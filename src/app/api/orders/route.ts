import { NextResponse } from "next/server";
import { getServerSession } from "@/lib/auth/session";
import prisma from "@/lib/db/prisma";
import { orderSchema } from "@/lib/validation/schemas";
import { TelegramNotificationService } from "@/lib/services/telegram-stub";

export async function GET(request: Request) {
  const session = await getServerSession();
  if (!session) {
    return NextResponse.json({ error: "Не авторизован" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const status = searchParams.get("status");
  const search = searchParams.get("search");

  try {
    const orders = await prisma.order.findMany({
      where: {
        businessId: session.businessId,
        ...(status && status !== "ALL" ? { status } : {}),
        ...(search
          ? {
              OR: [
                { orderNumber: { contains: search } },
                { customer: { name: { contains: search } } },
                { customer: { phone: { contains: search } } },
              ],
            }
          : {}),
      },
      include: {
        customer: true,
        items: {
          include: {
            product: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ orders });
  } catch (error) {
    console.error("Error fetching orders:", error);
    return NextResponse.json({ error: "Ошибка загрузки заказов" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const session = await getServerSession();
  if (!session) {
    return NextResponse.json({ error: "Не авторизован" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const validated = orderSchema.safeParse(body);

    if (!validated.success) {
      return NextResponse.json(
        { error: validated.error.errors[0]?.message || "Ошибка валидации заказа" },
        { status: 400 }
      );
    }

    const {
      customerId,
      customerName,
      customerPhone,
      items,
      discountAmount,
      paidAmount,
      paymentStatus,
      paymentMethod,
      notes,
      status,
    } = validated.data;

    // Use Prisma transaction to ensure full database consistency
    const orderResult = await prisma.$transaction(async (tx) => {
      // 1. Resolve or create customer if name provided
      let finalCustomerId = customerId;

      if (!finalCustomerId && customerName && customerName.trim() !== "") {
        const newCustomer = await tx.customer.create({
          data: {
            businessId: session.businessId,
            name: customerName.trim(),
            phone: customerPhone?.trim() || "",
            totalSpent: 0,
            currentDebt: 0,
          },
        });
        finalCustomerId = newCustomer.id;
      }

      // 2. Generate unique order number (e.g. ORD-1005)
      const count = await tx.order.count({ where: { businessId: session.businessId } });
      const orderNumber = `ORD-${1000 + count + 1}`;

      // 3. Calculate totals & item calculations
      let subtotal = 0;
      const orderItemData = [];

      for (const item of items) {
        const itemTotal = item.quantity * item.unitPrice;
        subtotal += itemTotal;

        orderItemData.push({
          productId: item.productId || null,
          productName: item.productName,
          quantity: item.quantity,
          unitPrice: item.unitPrice,
          costPrice: item.costPrice || 0,
          total: itemTotal,
        });

        // If product linked, decrement stock and verify threshold
        if (item.productId) {
          const product = await tx.product.findUnique({
            where: { id: item.productId },
          });

          if (product && product.businessId === session.businessId) {
            const newStock = Math.max(0, product.stockQuantity - item.quantity);
            await tx.product.update({
              where: { id: product.id },
              data: { stockQuantity: newStock },
            });

            // Trigger low-stock notification if dropped below threshold
            if (newStock <= product.minStockThreshold) {
              await tx.notification.create({
                data: {
                  businessId: session.businessId,
                  title: "Критический остаток после продажи",
                  message: `Товар «${product.name}» оформлен в заказе ${orderNumber}. Текущий остаток: ${newStock} ${product.unit}.`,
                  type: "STOCK",
                },
              });
            }
          }
        }
      }

      const totalAmount = Math.max(0, subtotal - discountAmount);
      const remainingDebt = Math.max(0, totalAmount - paidAmount);

      // Determine payment status if not explicitly set
      let effectivePaymentStatus = paymentStatus;
      if (paidAmount >= totalAmount && totalAmount > 0) {
        effectivePaymentStatus = "PAID";
      } else if (paidAmount > 0 && paidAmount < totalAmount) {
        effectivePaymentStatus = "PARTIAL";
      } else if (paidAmount === 0 && totalAmount > 0) {
        effectivePaymentStatus = "UNPAID";
      }

      // 4. Create Order
      const newOrder = await tx.order.create({
        data: {
          businessId: session.businessId,
          customerId: finalCustomerId || null,
          orderNumber,
          status,
          paymentStatus: effectivePaymentStatus,
          totalAmount,
          discountAmount,
          paidAmount,
          notes,
          items: {
            create: orderItemData,
          },
        },
        include: {
          items: true,
          customer: true,
        },
      });

      // 5. If customer exists, update totalSpent and currentDebt
      if (finalCustomerId) {
        await tx.customer.update({
          where: { id: finalCustomerId },
          data: {
            totalSpent: {
              increment: status !== "CANCELLED" ? totalAmount : 0,
            },
            currentDebt: {
              increment: status !== "CANCELLED" ? remainingDebt : 0,
            },
          },
        });

        // If payment was made, record payment entry
        if (paidAmount > 0) {
          await tx.payment.create({
            data: {
              businessId: session.businessId,
              customerId: finalCustomerId,
              orderId: newOrder.id,
              amount: paidAmount,
              paymentMethod,
              notes: `Оплата по заказу ${orderNumber}`,
            },
          });
        }
      }

      // 6. Record financial transaction for cash flow if paid
      if (paidAmount > 0) {
        await tx.transaction.create({
          data: {
            businessId: session.businessId,
            type: "INCOME",
            category: "Оплата заказа",
            amount: paidAmount,
            description: `Выручка по заказу ${orderNumber} (${newOrder.customer?.name || "Розничный покупатель"})`,
            relatedOrderId: newOrder.id,
          },
        });
      }

      // 7. Audit log
      await tx.auditLog.create({
        data: {
          businessId: session.businessId,
          userId: session.userId,
          action: "CREATE",
          entity: "ORDER",
          entityId: newOrder.id,
          details: `Создан заказ ${orderNumber} на сумму ${totalAmount} UZS (Оплачено: ${paidAmount} UZS)`,
        },
      });

      return newOrder;
    });

    // Notify Telegram service
    await TelegramNotificationService.notifyNewOrder({
      orderId: orderResult.id,
      orderNumber: orderResult.orderNumber,
      customerName: orderResult.customer?.name || "Розничный покупатель",
      totalAmount: orderResult.totalAmount,
      itemCount: orderResult.items.length,
      businessName: session.businessName,
      businessId: session.businessId,
      paymentMethod,
    });

    return NextResponse.json({ success: true, order: orderResult }, { status: 201 });
  } catch (error) {
    console.error("Error creating order:", error);
    return NextResponse.json(
      { error: "Внутренняя ошибка при создании заказа: " + (error as Error).message },
      { status: 500 }
    );
  }
}
