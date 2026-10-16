import { NextResponse } from "next/server";
import { getServerSession } from "@/lib/auth/session";
import prisma from "@/lib/db/prisma";

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession();
  if (!session) {
    return NextResponse.json({ error: "Не авторизован" }, { status: 401 });
  }

  if (session.role !== "OWNER") {
    return NextResponse.json(
      { error: "Только владелец бизнеса может удалять сотрудников" },
      { status: 403 }
    );
  }

  try {
    const membership = await prisma.businessMember.findFirst({
      where: { id: params.id, businessId: session.businessId },
    });

    if (!membership) {
      return NextResponse.json({ error: "Сотрудник не найден" }, { status: 404 });
    }

    if (membership.role === "OWNER") {
      return NextResponse.json(
        { error: "Нельзя удалить владельца компании" },
        { status: 400 }
      );
    }

    if (membership.userId === session.userId) {
      return NextResponse.json(
        { error: "Нельзя удалить самого себя" },
        { status: 400 }
      );
    }

    await prisma.businessMember.delete({
      where: { id: params.id },
    });

    await prisma.auditLog.create({
      data: {
        businessId: session.businessId,
        userId: session.userId,
        action: "DELETE",
        entity: "TEAM",
        entityId: membership.userId,
        details: `Сотрудник удален из компании`,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting team member:", error);
    return NextResponse.json({ error: "Ошибка при удалении сотрудника" }, { status: 500 });
  }
}
