import Link from "next/link";
import { requireAuth } from "@/lib/auth/session";
import prisma from "@/lib/db/prisma";
import { formatUZS } from "@/lib/utils/format";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { OrdersClient } from "./orders-client";

export default async function OrdersPage() {
  const session = await requireAuth();

  const orders = await prisma.order.findMany({
    where: { businessId: session.businessId },
    include: {
      customer: true,
      items: true,
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
            Управление заказами
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Журнал продаж, контроль статусов доставки и оплаты
          </p>
        </div>

        <Link href="/dashboard/orders/new">
          <Button size="sm" className="gap-1.5 bg-emerald-700 hover:bg-emerald-800 shadow-sm">
            <Plus className="w-4 h-4" />
            <span>Оформить новый заказ</span>
          </Button>
        </Link>
      </div>

      <OrdersClient initialOrders={orders} userRole={session.role} />
    </div>
  );
}
