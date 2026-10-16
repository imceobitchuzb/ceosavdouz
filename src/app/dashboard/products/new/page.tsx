import { requireAuth } from "@/lib/auth/session";
import prisma from "@/lib/db/prisma";
import { ProductForm } from "../product-form";

export default async function NewProductPage() {
  const session = await requireAuth();

  const categories = await prisma.category.findMany({
    where: { businessId: session.businessId },
    orderBy: { name: "asc" },
  });

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
          Добавление нового товара
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Заполните параметры товара, цены закупки и продажи в сумах (UZS)
        </p>
      </div>

      <ProductForm categories={categories} />
    </div>
  );
}
