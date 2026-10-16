import { NextResponse } from "next/server";
import { getServerSession } from "@/lib/auth/session";
import prisma from "@/lib/db/prisma";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession();
  if (!session) {
    return NextResponse.json({ error: "Не авторизован" }, { status: 401 });
  }

  try {
    const order = await prisma.order.findFirst({
      where: { id: params.id, businessId: session.businessId },
      include: {
        customer: true,
        items: {
          include: { product: true },
        },
        payments: true,
      },
    });

    if (!order) {
      return NextResponse.json({ error: "Заказ не найден" }, { status: 404 });
    }

    return NextResponse.json({ order });
  } catch (error) {
    console.error("Error fetching order:", error);
    return NextResponse.json({ error: "Ошибка сервера" }, { status: 500 });
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession();
  if (!session) {
    return NextResponse.json({ error: "Не авторизован" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { status, paymentStatus, paidAmount } = body;

    const existing = await prisma.order.findFirst({
      where: { id: params.id, businessId: session.businessId },
      include: { items: true, customer: true },
    });

    if (!existing) {
      return NextResponse.json({ error: "Заказ не найден" }, { status: 404 });
    }

    // Execute status transition in a transaction
    const updated = await prisma.$transaction(async (tx) => {
      // If transitioning to CANCELLED from a non-cancelled state:
      if (status === "CANCELLED" && existing.status !== "CANCELLED") {
        // 1. Restore stock quantities for all items
        for (const item of existing.items) {
          if (item.productId) {
            await tx.product.update({
              where: { id: item.productId },
              data: {
                stockQuantity: { increment: item.quantity },
              },
            });
          }
        }

        // 2. Revert customer debt and total spent if linked
        if (existing.customerId) {
          const unpaidRemainder = Math.max(0, existing.totalAmount - existing.paidAmount);
          await tx.customer.update({
            where: { id: existing.customerId },
            data: {
              totalSpent: { decrement: existing.totalAmount },
              currentDebt: { decrement: unpaidRemainder },
            },
          });
        }
      }

      // Update the order record
      const order = await tx.order.update({
        where: { id: params.id },
        data: {
          ...(status ? { status } : {}),
          ...(paymentStatus ? { paymentStatus } : {}),
          ...(paidAmount !== undefined ? { paidAmount } : {}),
        },
      });

      // Audit log
      await tx.auditLog.create({
        data: {
          businessId: session.businessId,
          userId: session.userId,
          action: "UPDATE",
          entity: "ORDER",
          entityId: order.id,
          details: `Статус заказа ${existing.orderNumber} изменен на: ${status || existing.status}`,
        },
      });

      return order;
    });

    return NextResponse.json({ success: true, order: updated });
  } catch (error) {
    console.error("Error updating order:", error);
    return NextResponse.json({ error: "Ошибка при обновлении заказа" }, { status: 500 });
  }
}
