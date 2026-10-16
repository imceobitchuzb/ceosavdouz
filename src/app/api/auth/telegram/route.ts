import { NextResponse } from "next/server";
import prisma from "@/lib/db/prisma";
import { validateTelegramWebAppData } from "@/lib/auth/telegram";
import { signSessionToken, COOKIE_NAME } from "@/lib/auth/jwt";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { initData } = body;

    const botToken = process.env.TELEGRAM_BOT_TOKEN;
    if (!botToken) {
      return NextResponse.json(
        { error: "TELEGRAM_BOT_TOKEN не настроен на сервере" },
        { status: 500 }
      );
    }

    if (!initData) {
      return NextResponse.json(
        { error: "Отсутствуют данные initData от Telegram Web App" },
        { status: 400 }
      );
    }

    // Cryptographic validation
    const validation = validateTelegramWebAppData(initData, botToken);
    if (!validation.isValid || !validation.user) {
      return NextResponse.json(
        { error: validation.error || "Недействительные данные авторизации Telegram" },
        { status: 401 }
      );
    }

    const tgUser = validation.user;
    const telegramIdStr = String(tgUser.id);
    const tgUsername = tgUser.username || null;
    const tgFullName = [tgUser.first_name, tgUser.last_name].filter(Boolean).join(" ") || "Пользователь Telegram";

    // 1. Try to find user by telegramId
    let user = await prisma.user.findFirst({
      where: { telegramId: telegramIdStr },
      include: {
        memberships: {
          include: { business: true },
          take: 1,
        },
      },
    });

    // 2. If not found by telegramId, link to existing demo/admin user or first user
    if (!user) {
      const existingUser = await prisma.user.findFirst({
        where: {
          OR: [
            { email: "admin@ceosavdouz.uz" },
            { email: "demo@ceosavdouz.uz" },
          ],
        },
        include: {
          memberships: {
            include: { business: true },
            take: 1,
          },
        },
      });

      if (existingUser) {
        user = await prisma.user.update({
          where: { id: existingUser.id },
          data: {
            telegramId: telegramIdStr,
            telegramUsername: tgUsername,
          },
          include: {
            memberships: {
              include: { business: true },
              take: 1,
            },
          },
        });
      } else {
        // Fallback: find any user with business membership
        const anyUser = await prisma.user.findFirst({
          include: {
            memberships: {
              include: { business: true },
              take: 1,
            },
          },
        });

        if (anyUser) {
          user = await prisma.user.update({
            where: { id: anyUser.id },
            data: {
              telegramId: telegramIdStr,
              telegramUsername: tgUsername,
            },
            include: {
              memberships: {
                include: { business: true },
                take: 1,
              },
            },
          });
        }
      }
    }

    if (!user || user.memberships.length === 0 || !user.memberships[0].business) {
      return NextResponse.json(
        { error: "Не найдено доступных предприятий для данного аккаунта Telegram" },
        { status: 404 }
      );
    }

    const membership = user.memberships[0];

    // Sign session JWT
    const token = await signSessionToken({
      userId: user.id,
      email: user.email,
      name: user.name || tgFullName,
      businessId: membership.business.id,
      businessName: membership.business.name,
      role: membership.role,
    });

    const isProduction = process.env.NODE_ENV === "production";
    const response = NextResponse.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        telegramId: user.telegramId,
        businessId: membership.business.id,
        businessName: membership.business.name,
        role: membership.role,
      },
    });

    response.cookies.set({
      name: COOKIE_NAME,
      value: token,
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? "none" : "lax",
      path: "/",
      maxAge: 7 * 24 * 60 * 60,
    });

    return response;
  } catch (error: any) {
    console.error("Telegram Auth error:", error);
    return NextResponse.json(
      { error: "Внутренняя ошибка сервера при авторизации через Telegram" },
      { status: 500 }
    );
  }
}
