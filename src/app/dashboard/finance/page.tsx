import { requireAuth } from "@/lib/auth/session";
import prisma from "@/lib/db/prisma";
import { FinanceClient } from "./finance-client";

export default async function FinancePage() {
  const session = await requireAuth();

  const transactions = await prisma.transaction.findMany({
    where: { businessId: session.businessId },
    orderBy: { date: "desc" },
  });

  const totalIncome = transactions
    .filter((t) => t.type === "INCOME")
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpense = transactions
    .filter((t) => t.type === "EXPENSE")
    .reduce((sum, t) => sum + t.amount, 0);

  const netProfit = totalIncome - totalExpense;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
          Финансы и учет расходов
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Контроль денежных потоков (Cash Flow), операционных расходов и чистой прибыли в сумах (UZS)
        </p>
      </div>

      <FinanceClient
        initialTransactions={transactions}
        summary={{ totalIncome, totalExpense, netProfit }}
      />
    </div>
  );
}
