import { NextResponse } from "next/server";
import { getServerSession } from "@/lib/auth/session";
import prisma from "@/lib/db/prisma";
import { customerSchema } from "@/lib/validation/schemas";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession();
  if (!session) {
    return NextResponse.json({ error: "Не авторизован" }, { status: 401 });
  }

  try {
    const customer = await prisma.customer.findFirst({
      where: { id: params.id, businessId: session.businessId },
      include: {
        orders: {
          orderBy: { createdAt: "desc" },
          include: { items: true },
        },
        payments: {
          orderBy: { createdAt: "desc" },
        },
      },
    });

    if (!customer) {
      return NextResponse.json({ error: "Клиент не найден" }, { status: 404 });
    }

    return NextResponse.json({ customer });
  } catch (error) {
    console.error("Error fetching customer:", error);
    return NextResponse.json({ error: "Ошибка сервера" }, { status: 500 });
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession();
  if (!session) {
    return NextResponse.json({ error: "Не авторизован" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const validated = customerSchema.safeParse(body);

    if (!validated.success) {
      return NextResponse.json(
        { error: validated.error.errors[0]?.message || "Ошибка валидации" },
        { status: 400 }
      );
    }

    const existing = await prisma.customer.findFirst({
      where: { id: params.id, businessId: session.businessId },
    });

    if (!existing) {
      return NextResponse.json({ error: "Клиент не найден" }, { status: 404 });
    }

    const updated = await prisma.customer.update({
      where: { id: params.id },
      data: validated.data,
    });

    return NextResponse.json({ success: true, customer: updated });
  } catch (error) {
    console.error("Error updating customer:", error);
    return NextResponse.json({ error: "Ошибка при обновлении клиента" }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession();
  if (!session) {
    return NextResponse.json({ error: "Не авторизован" }, { status: 401 });
  }

  try {
    const existing = await prisma.customer.findFirst({
      where: { id: params.id, businessId: session.businessId },
    });

    if (!existing) {
      return NextResponse.json({ error: "Клиент не найден" }, { status: 404 });
    }

    if (existing.currentDebt > 0) {
      return NextResponse.json(
        { error: "Нельзя удалить клиента с непогашенным долгом" },
        { status: 400 }
      );
    }

    await prisma.customer.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting customer:", error);
    return NextResponse.json({ error: "Ошибка при удалении клиента" }, { status: 500 });
  }
}
