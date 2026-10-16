import { NextResponse } from "next/server";
import { getServerSession } from "@/lib/auth/session";
import prisma from "@/lib/db/prisma";
import { customerPaymentSchema } from "@/lib/validation/schemas";

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession();
  if (!session) {
    return NextResponse.json({ error: "Не авторизован" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const validated = customerPaymentSchema.safeParse(body);

    if (!validated.success) {
      return NextResponse.json(
        { error: validated.error.errors[0]?.message || "Ошибка валидации платежа" },
        { status: 400 }
      );
    }

    const { amount, paymentMethod, notes } = validated.data;

    // Verify customer belongs to this business
    const customer = await prisma.customer.findFirst({
      where: { id: params.id, businessId: session.businessId },
    });

    if (!customer) {
      return NextResponse.json({ error: "Клиент не найден" }, { status: 404 });
    }

    // Execute in transaction to reduce debt and register financial transaction
    const result = await prisma.$transaction(async (tx) => {
      // Validate payment amount: cannot exceed currentDebt + margin of error, or just clamp to 0
      const newDebt = Math.max(0, customer.currentDebt - amount);

      const updatedCustomer = await tx.customer.update({
        where: { id: params.id },
        data: { currentDebt: newDebt },
      });

      const payment = await tx.payment.create({
        data: {
          businessId: session.businessId,
          customerId: customer.id,
          amount,
          paymentMethod,
          notes: notes || `Погашение задолженности от ${customer.name}`,
        },
      });

      // Register income transaction
      await tx.transaction.create({
        data: {
          businessId: session.businessId,
          type: "INCOME",
          category: "Погашение долга (Насия)",
          amount,
          description: `Оплата долга от ${customer.name}`,
        },
      });

      // Audit log
      await tx.auditLog.create({
        data: {
          businessId: session.businessId,
          userId: session.userId,
          action: "UPDATE",
          entity: "CUSTOMER",
          entityId: customer.id,
          details: `Принят платеж ${amount} UZS от ${customer.name}. Новый остаток долга: ${newDebt} UZS`,
        },
      });

      return { customer: updatedCustomer, payment };
    });

    return NextResponse.json({ success: true, ...result });
  } catch (error) {
    console.error("Error processing debt payment:", error);
    return NextResponse.json({ error: "Ошибка обработки платежа" }, { status: 500 });
  }
}
