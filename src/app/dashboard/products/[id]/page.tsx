import { notFound } from "next/navigation";
import { requireAuth } from "@/lib/auth/session";
import prisma from "@/lib/db/prisma";
import { ProductForm } from "../product-form";

export default async function EditProductPage({
  params,
}: {
  params: { id: string };
}) {
  const session = await requireAuth();

  const [product, categories] = await Promise.all([
    prisma.product.findFirst({
      where: {
        id: params.id,
        businessId: session.businessId,
      },
    }),
    prisma.category.findMany({
      where: { businessId: session.businessId },
      orderBy: { name: "asc" },
    }),
  ]);

  if (!product) {
    notFound();
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
          Редактирование товара
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">
          {product.name} · Изменение цен, параметров и складских остатков
        </p>
      </div>

      <ProductForm initialData={product} categories={categories} />
    </div>
  );
}
