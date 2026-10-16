import { NextResponse } from "next/server";
import { getServerSession } from "@/lib/auth/session";
import prisma from "@/lib/db/prisma";
import { customerSchema } from "@/lib/validation/schemas";

export async function GET(request: Request) {
  const session = await getServerSession();
  if (!session) {
    return NextResponse.json({ error: "Не авторизован" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const search = searchParams.get("search") || "";
  const hasDebtOnly = searchParams.get("debtOnly") === "true";

  try {
    const customers = await prisma.customer.findMany({
      where: {
        businessId: session.businessId,
        ...(hasDebtOnly ? { currentDebt: { gt: 0 } } : {}),
        ...(search
          ? {
              OR: [
                { name: { contains: search } },
                { phone: { contains: search } },
                { address: { contains: search } },
              ],
            }
          : {}),
      },
      include: {
        orders: {
          select: { id: true, totalAmount: true, status: true, createdAt: true },
          orderBy: { createdAt: "desc" },
          take: 3,
        },
      },
      orderBy: { currentDebt: "desc" },
    });

    return NextResponse.json({ customers });
  } catch (error) {
    console.error("Error fetching customers:", error);
    return NextResponse.json({ error: "Ошибка загрузки клиентов" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const session = await getServerSession();
  if (!session) {
    return NextResponse.json({ error: "Не авторизован" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const validated = customerSchema.safeParse(body);

    if (!validated.success) {
      return NextResponse.json(
        { error: validated.error.errors[0]?.message || "Ошибка валидации клиента" },
        { status: 400 }
      );
    }

    const { name, phone, address, notes } = validated.data;

    const customer = await prisma.customer.create({
      data: {
        businessId: session.businessId,
        name,
        phone,
        address: address || null,
        notes: notes || null,
        totalSpent: 0,
        currentDebt: 0,
      },
    });

    await prisma.auditLog.create({
      data: {
        businessId: session.businessId,
        userId: session.userId,
        action: "CREATE",
        entity: "CUSTOMER",
        entityId: customer.id,
        details: `Создан контрагент: ${customer.name} (${customer.phone})`,
      },
    });

    return NextResponse.json({ success: true, customer }, { status: 201 });
  } catch (error) {
    console.error("Error creating customer:", error);
    return NextResponse.json({ error: "Ошибка создания клиента" }, { status: 500 });
  }
}
