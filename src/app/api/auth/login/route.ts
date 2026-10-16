import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import prisma from "@/lib/db/prisma";
import { loginSchema } from "@/lib/validation/schemas";
import { signSessionToken, COOKIE_NAME } from "@/lib/auth/jwt";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validated = loginSchema.safeParse(body);

    if (!validated.success) {
      return NextResponse.json(
        { error: validated.error.errors[0]?.message || "Заполните email и пароль" },
        { status: 400 }
      );
    }

    const { email, password } = validated.data;

    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
      include: {
        memberships: {
          include: {
            business: true,
          },
          take: 1,
        },
      },
    });

    if (!user) {
      return NextResponse.json(
        { error: "Неверный email или пароль" },
        { status: 401 }
      );
    }

    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
    if (!isPasswordValid) {
      return NextResponse.json(
        { error: "Неверный email или пароль" },
        { status: 401 }
      );
    }

    const membership = user.memberships[0];
    if (!membership || !membership.business) {
      return NextResponse.json(
        { error: "У пользователя нет активных привязок к бизнесу" },
        { status: 403 }
      );
    }

    // Sign session JWT
    const token = await signSessionToken({
      userId: user.id,
      email: user.email,
      name: user.name,
      businessId: membership.business.id,
      businessName: membership.business.name,
      role: membership.role,
    });

    const response = NextResponse.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        businessId: membership.business.id,
        businessName: membership.business.name,
        role: membership.role,
      },
    });

    response.cookies.set({
      name: COOKIE_NAME,
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 7 * 24 * 60 * 60,
    });

    return response;
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { error: "Внутренняя ошибка сервера при входе" },
      { status: 500 }
    );
  }
}
