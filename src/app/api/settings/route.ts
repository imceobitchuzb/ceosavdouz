import { NextResponse } from "next/server";
import { getServerSession } from "@/lib/auth/session";
import prisma from "@/lib/db/prisma";
import { businessSettingsSchema } from "@/lib/validation/schemas";
import { TelegramNotificationService } from "@/lib/services/telegram-stub";

export async function GET() {
  const session = await getServerSession();
  if (!session) {
    return NextResponse.json({ error: "Не авторизован" }, { status: 401 });
  }

  try {
    const business = await prisma.business.findUnique({
      where: { id: session.businessId },
    });

    const user = await prisma.user.findUnique({
      where: { id: session.userId },
      select: { id: true, name: true, email: true, phone: true },
    });

    const telegramStatus = TelegramNotificationService.getStatus();

    return NextResponse.json({
      business,
      user,
      telegramStatus,
    });
  } catch (error) {
    console.error("Error fetching settings:", error);
    return NextResponse.json({ error: "Ошибка загрузки настроек" }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  const session = await getServerSession();
  if (!session) {
    return NextResponse.json({ error: "Не авторизован" }, { status: 401 });
  }

  // Only OWNER or ADMIN can change business settings
  if (session.role !== "OWNER" && session.role !== "ADMIN") {
    return NextResponse.json(
      { error: "Недостаточно прав для изменения настроек компании" },
      { status: 403 }
    );
  }

  try {
    const body = await request.json();
    const validated = businessSettingsSchema.safeParse(body);

    if (!validated.success) {
      return NextResponse.json(
        { error: validated.error.errors[0]?.message || "Ошибка валидации" },
        { status: 400 }
      );
    }

    const { name, inn, phone, address, city } = validated.data;

    const updated = await prisma.business.update({
      where: { id: session.businessId },
      data: {
        name,
        inn: inn || null,
        phone: phone || null,
        address: address || null,
        city: city || "Ташкент",
      },
    });

    await prisma.auditLog.create({
      data: {
        businessId: session.businessId,
        userId: session.userId,
        action: "UPDATE",
        entity: "SETTINGS",
        entityId: updated.id,
        details: `Обновлены реквизиты компании: ${updated.name}`,
      },
    });

    return NextResponse.json({ success: true, business: updated });
  } catch (error) {
    console.error("Error updating settings:", error);
    return NextResponse.json({ error: "Ошибка при сохранении настроек" }, { status: 500 });
  }
}
