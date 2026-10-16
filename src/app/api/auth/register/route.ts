import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import prisma from "@/lib/db/prisma";
import { registerSchema } from "@/lib/validation/schemas";
import { signSessionToken, COOKIE_NAME } from "@/lib/auth/jwt";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validated = registerSchema.safeParse(body);

    if (!validated.success) {
      return NextResponse.json(
        { error: validated.error.errors[0]?.message || "Ошибка валидации данных" },
        { status: 400 }
      );
    }

    const { name, email, password, businessName, phone } = validated.data;

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "Пользователь с таким email уже зарегистрирован" },
        { status: 409 }
      );
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    // Create Business, User, and Membership in a transaction
    const result = await prisma.$transaction(async (tx) => {
      const user = await tx.user.create({
        data: {
          email: email.toLowerCase(),
          name,
          phone,
          passwordHash,
        },
      });

      const business = await tx.business.create({
        data: {
          name: businessName,
          phone,
          currency: "UZS",
        },
      });

      const membership = await tx.businessMember.create({
        data: {
          userId: user.id,
          businessId: business.id,
          role: "OWNER",
        },
      });

      // Default starter category
      await tx.category.create({
        data: {
          businessId: business.id,
          name: "Общая категория",
          description: "Основная категория товаров",
        },
      });

      // Initial welcome notification
      await tx.notification.create({
        data: {
          businessId: business.id,
          title: "Добро пожаловать в CEOSAVDOUZ!",
          message: `Компания «${business.name}» успешно создана. Начните с добавления ваших товаров и первого заказа.`,
          type: "SYSTEM",
        },
      });

      return { user, business, membership };
    });

    // Create JWT session
    const token = await signSessionToken({
      userId: result.user.id,
      email: result.user.email,
      name: result.user.name,
      businessId: result.business.id,
      businessName: result.business.name,
      role: result.membership.role,
    });

    const response = NextResponse.json({
      success: true,
      user: {
        id: result.user.id,
        email: result.user.email,
        name: result.user.name,
        businessId: result.business.id,
        businessName: result.business.name,
        role: result.membership.role,
      },
    });

    response.cookies.set({
      name: COOKIE_NAME,
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 7 * 24 * 60 * 60, // 7 days
    });

    return response;
  } catch (error) {
    console.error("Register error:", error);
    return NextResponse.json(
      { error: "Внутренняя ошибка сервера при регистрации" },
      { status: 500 }
    );
  }
}
