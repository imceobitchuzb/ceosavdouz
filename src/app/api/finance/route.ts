import { NextResponse } from "next/server";
import { getServerSession } from "@/lib/auth/session";
import prisma from "@/lib/db/prisma";
import { transactionSchema } from "@/lib/validation/schemas";

export async function GET(request: Request) {
  const session = await getServerSession();
  if (!session) {
    return NextResponse.json({ error: "Не авторизован" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const type = searchParams.get("type"); // INCOME, EXPENSE, or ALL

  try {
    const transactions = await prisma.transaction.findMany({
      where: {
        businessId: session.businessId,
        ...(type && type !== "ALL" ? { type } : {}),
      },
      orderBy: { date: "desc" },
    });

    const totalIncome = transactions
      .filter((t) => t.type === "INCOME")
      .reduce((sum, t) => sum + t.amount, 0);

    const totalExpense = transactions
      .filter((t) => t.type === "EXPENSE")
      .reduce((sum, t) => sum + t.amount, 0);

    const netProfit = totalIncome - totalExpense;

    return NextResponse.json({
      transactions,
      summary: {
        totalIncome,
        totalExpense,
        netProfit,
      },
    });
  } catch (error) {
    console.error("Error fetching financial transactions:", error);
    return NextResponse.json({ error: "Ошибка загрузки финансовых данных" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const session = await getServerSession();
  if (!session) {
    return NextResponse.json({ error: "Не авторизован" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const validated = transactionSchema.safeParse(body);

    if (!validated.success) {
      return NextResponse.json(
        { error: validated.error.errors[0]?.message || "Ошибка валидации транзакции" },
        { status: 400 }
      );
    }

    const { type, category, amount, description, date } = validated.data;

    const transaction = await prisma.transaction.create({
      data: {
        businessId: session.businessId,
        type,
        category,
        amount,
        description: description || null,
        date: date ? new Date(date) : new Date(),
      },
    });

    await prisma.auditLog.create({
      data: {
        businessId: session.businessId,
        userId: session.userId,
        action: "CREATE",
        entity: "FINANCE",
        entityId: transaction.id,
        details: `Внесена проводка: ${type === "INCOME" ? "Доход" : "Расход"} на ${amount} UZS (${category})`,
      },
    });

    return NextResponse.json({ success: true, transaction }, { status: 201 });
  } catch (error) {
    console.error("Error creating financial transaction:", error);
    return NextResponse.json({ error: "Ошибка при записи транзакции" }, { status: 500 });
  }
}
