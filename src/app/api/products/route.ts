import { NextResponse } from "next/server";
import { getServerSession } from "@/lib/auth/session";
import prisma from "@/lib/db/prisma";
import { productSchema } from "@/lib/validation/schemas";

export async function GET(request: Request) {
  const session = await getServerSession();
  if (!session) {
    return NextResponse.json({ error: "Не авторизован" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const search = searchParams.get("search") || "";
  const categoryId = searchParams.get("categoryId") || "";

  try {
    const products = await prisma.product.findMany({
      where: {
        businessId: session.businessId,
        ...(categoryId ? { categoryId } : {}),
        ...(search
          ? {
              OR: [
                { name: { contains: search } },
                { sku: { contains: search } },
                { barcode: { contains: search } },
              ],
            }
          : {}),
      },
      include: {
        category: true,
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ products });
  } catch (error) {
    console.error("Error fetching products:", error);
    return NextResponse.json({ error: "Ошибка загрузки товаров" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const session = await getServerSession();
  if (!session) {
    return NextResponse.json({ error: "Не авторизован" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const validated = productSchema.safeParse(body);

    if (!validated.success) {
      return NextResponse.json(
        { error: validated.error.errors[0]?.message || "Ошибка валидации данных товара" },
        { status: 400 }
      );
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

    // Check if category belongs to this business if provided
    if (categoryId) {
      const category = await prisma.category.findFirst({
        where: { id: categoryId, businessId: session.businessId },
      });
      if (!category) {
        return NextResponse.json({ error: "Выбранная категория не найдена" }, { status: 400 });
      }
    }

    const product = await prisma.product.create({
      data: {
        businessId: session.businessId,
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

    // If stock is already at or below threshold, trigger notification
    if (stockQuantity <= minStockThreshold) {
      await prisma.notification.create({
        data: {
          businessId: session.businessId,
          title: "Создан товар с низким остатком",
          message: `Товар «${product.name}» добавлен с остатком ${product.stockQuantity} ${product.unit}. Пополните склад при необходимости.`,
          type: "STOCK",
        },
      });
    }

    // Log audit event
    await prisma.auditLog.create({
      data: {
        businessId: session.businessId,
        userId: session.userId,
        action: "CREATE",
        entity: "PRODUCT",
        entityId: product.id,
        details: `Создан товар: ${product.name} (${product.sellingPrice} UZS)`,
      },
    });

    return NextResponse.json({ success: true, product }, { status: 201 });
  } catch (error) {
    console.error("Error creating product:", error);
    return NextResponse.json({ error: "Внутренняя ошибка создания товара" }, { status: 500 });
  }
}
