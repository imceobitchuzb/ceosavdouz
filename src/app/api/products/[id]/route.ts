import { NextResponse } from "next/server";
import { getServerSession } from "@/lib/auth/session";
import prisma from "@/lib/db/prisma";
import { productSchema } from "@/lib/validation/schemas";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession();
  if (!session) {
    return NextResponse.json({ error: "Не авторизован" }, { status: 401 });
  }

  try {
    const product = await prisma.product.findFirst({
      where: {
        id: params.id,
        businessId: session.businessId,
      },
      include: {
        category: true,
      },
    });

    if (!product) {
      return NextResponse.json({ error: "Товар не найден" }, { status: 404 });
    }

    return NextResponse.json({ product });
  } catch (error) {
    console.error("Error fetching product:", error);
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
    const validated = productSchema.safeParse(body);

    if (!validated.success) {
      return NextResponse.json(
        { error: validated.error.errors[0]?.message || "Ошибка валидации" },
        { status: 400 }
      );
    }

    // Verify existing product belongs to current business
    const existing = await prisma.product.findFirst({
      where: { id: params.id, businessId: session.businessId },
    });

    if (!existing) {
      return NextResponse.json({ error: "Товар не найден" }, { status: 404 });
    }

    const {
      name,
      categoryId,
      sku,
      barcode,
      costPrice,
      sellingPrice,
      stockQuantity,
      minStockThreshold,
      unit,
    } = validated.data;

    const updated = await prisma.product.update({
      where: { id: params.id },
      data: {
        name,
        categoryId: categoryId || null,
        sku: sku || null,
        barcode: barcode || null,
        costPrice,
        sellingPrice,
        stockQuantity,
        minStockThreshold,
        unit,
      },
      include: {
        category: true,
      },
    });

    // Check low stock trigger
    if (stockQuantity <= minStockThreshold) {
      await prisma.notification.create({
        data: {
          businessId: session.businessId,
          title: "Критический остаток товара",
          message: `Остаток товара «${updated.name}» снизился до ${updated.stockQuantity} ${updated.unit}.`,
          type: "STOCK",
        },
      });
    }

    return NextResponse.json({ success: true, product: updated });
  } catch (error) {
    console.error("Error updating product:", error);
    return NextResponse.json({ error: "Ошибка при сохранении товара" }, { status: 500 });
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
    // Only allow OWNER, ADMIN, MANAGER to delete products
    if (session.role === "CASHIER") {
      return NextResponse.json(
        { error: "Кассир не имеет прав на удаление товаров" },
        { status: 403 }
      );
    }

    const existing = await prisma.product.findFirst({
      where: { id: params.id, businessId: session.businessId },
    });

    if (!existing) {
      return NextResponse.json({ error: "Товар не найден" }, { status: 404 });
    }

    await prisma.product.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting product:", error);
    return NextResponse.json({ error: "Ошибка при удалении товара" }, { status: 500 });
  }
}
