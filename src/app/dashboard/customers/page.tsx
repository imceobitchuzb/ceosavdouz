import { requireAuth } from "@/lib/auth/session";
import prisma from "@/lib/db/prisma";
import { CustomersClient } from "./customers-client";

export default async function CustomersPage() {
  const session = await requireAuth();

  const customers = await prisma.customer.findMany({
    where: { businessId: session.businessId },
    include: {
      orders: {
        select: { id: true, totalAmount: true, status: true, createdAt: true },
        orderBy: { createdAt: "desc" },
        take: 3,
      },
    },
    orderBy: { currentDebt: "desc" },
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
          Клиенты и контрагенты
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">
          База покупателей, контроль дебиторской задолженности (насия) и история платежей
        </p>
      </div>

      <CustomersClient initialCustomers={customers} />
    </div>
  );
}
