import { requireAuth } from "@/lib/auth/session";
import prisma from "@/lib/db/prisma";
import { OrderBuilderClient } from "./order-builder-client";

export default async function NewOrderPage() {
  const session = await requireAuth();

  const [products, customers] = await Promise.all([
    prisma.product.findMany({
      where: { businessId: session.businessId },
      orderBy: { name: "asc" },
    }),
    prisma.customer.findMany({
      where: { businessId: session.businessId },
      orderBy: { name: "asc" },
    }),
  ]);

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div>
        <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
          Оформление заказа (Касса)
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Добавьте товары, выберите покупателя, укажите скидку и статус оплаты
        </p>
      </div>

      <OrderBuilderClient products={products} customers={customers} />
    </div>
  );
}
