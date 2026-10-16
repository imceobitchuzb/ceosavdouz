"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { formatUZS, formatLocalDatetime } from "@/lib/utils/format";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from "@/components/ui/table";
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  Plus,
  ArrowUpRight,
  ArrowDownRight,
  Filter,
  X,
  AlertCircle,
  FileSpreadsheet
} from "lucide-react";
import { FinanceChart } from "@/components/dashboard/finance-chart";

interface Transaction {
  id: string;
  type: string;
  category: string;
  amount: number;
  description: string | null;
  date: string | Date;
  relatedOrderId: string | null;
}

interface FinanceClientProps {
  initialTransactions: Transaction[];
  summary: {
    totalIncome: number;
    totalExpense: number;
    netProfit: number;
  };
}

const EXPENSE_CATEGORIES = [
  "Аренда",
  "Зарплата",
  "Закупка товара",
  "Логистика",
  "Маркетинг и реклама",
  "Налоги и сборы",
  "Коммунальные услуги",
  "Прочие расходы",
];

const INCOME_CATEGORIES = [
  "Оплата заказа",
  "Погашение долга (Насия)",
  "Внереализационный доход",
  "Прочие доходы",
];

export function FinanceClient({
  initialTransactions,
  summary,
}: FinanceClientProps) {
  const router = useRouter();
  const [typeFilter, setTypeFilter] = React.useState<string>("ALL");
  const [modalOpen, setModalOpen] = React.useState(false);

  // New transaction form
  const [transType, setTransType] = React.useState<"EXPENSE" | "INCOME">("EXPENSE");
  const [transCategory, setTransCategory] = React.useState("Аренда");
  const [transAmount, setTransAmount] = React.useState<number>(0);
  const [transDescription, setTransDescription] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const filteredTransactions = initialTransactions.filter((t) => {
    if (typeFilter === "ALL") return true;
    return t.type === typeFilter;
  });

  // Group transactions for monthly chart
  const monthsMap: { [key: string]: { month: string; income: number; expense: number; profit: number } } = {};
  initialTransactions.forEach((t) => {
    const d = new Date(t.date);
    const m = d.toLocaleDateString("ru-RU", { month: "short" });
    if (!monthsMap[m]) {
      monthsMap[m] = { month: m, income: 0, expense: 0, profit: 0 };
    }
    if (t.type === "INCOME") {
      monthsMap[m].income += t.amount;
    } else {
      monthsMap[m].expense += t.amount;
    }
    monthsMap[m].profit = monthsMap[m].income - monthsMap[m].expense;
  });

  const chartData = Object.values(monthsMap);

  const handleCreateTransaction = async (e: React.FormEvent) => {
    e.preventDefault();
    if (transAmount <= 0) {
      setError("Сумма должна быть больше 0");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/finance", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: transType,
          category: transCategory,
          amount: transAmount,
          description: transDescription || null,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Ошибка записи транзакции");
      }

      setModalOpen(false);
      setTransAmount(0);
      setTransDescription("");
      router.refresh();
    } catch (err: unknown) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Total Income */}
        <div className="p-5 bg-white rounded-xl border border-slate-200 shadow-2xs space-y-1">
          <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
            <span>Всего доходов</span>
            <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center">
              <ArrowDownRight className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-emerald-800 font-mono">
            {formatUZS(summary.totalIncome)}
          </p>
          <span className="text-[11px] text-slate-400 block">Поступления от продаж и оплат</span>
        </div>

        {/* Total Expenses */}
        <div className="p-5 bg-white rounded-xl border border-slate-200 shadow-2xs space-y-1">
          <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
            <span>Операционные расходы</span>
            <div className="w-7 h-7 rounded-lg bg-rose-50 text-rose-700 flex items-center justify-center">
              <ArrowUpRight className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-rose-700 font-mono">
            {formatUZS(summary.totalExpense)}
          </p>
          <span className="text-[11px] text-slate-400 block">Аренда, закупки, зарплаты</span>
        </div>

        {/* Net Profit */}
        <div className="p-5 bg-white rounded-xl border border-slate-200 shadow-2xs space-y-1">
          <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
            <span>Чистый финансовый результат</span>
            <div className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <p
            className={`text-2xl font-black font-mono ${
              summary.netProfit >= 0 ? "text-emerald-800" : "text-rose-700"
            }`}
          >
            {formatUZS(summary.netProfit)}
          </p>
          <span className="text-[11px] text-slate-400 block">
            {summary.netProfit >= 0 ? "Чистая прибыль бизнеса" : "Временный убыток"}
          </span>
        </div>
      </div>

      {/* Finance Bar Chart */}
      <Card className="shadow-2xs">
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-bold">
            Сравнение доходов и расходов
          </CardTitle>
          <p className="text-xs text-slate-500 mt-0.5">
            Фактическое распределение денежных средств
          </p>
        </CardHeader>
        <CardContent>
          <FinanceChart data={chartData} />
        </CardContent>
      </Card>

      {/* Transactions Section */}
      <div className="space-y-4">
        <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-2xs flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
          <div className="flex items-center gap-1.5 text-xs">
            {[
              { id: "ALL", label: `Все записи (${initialTransactions.length})` },
              { id: "INCOME", label: "Доходы" },
              { id: "EXPENSE", label: "Расходы" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setTypeFilter(tab.id)}
                className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
                  typeFilter === tab.id
                    ? "bg-slate-900 text-white shadow-2xs"
                    : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <Button
            size="sm"
            onClick={() => setModalOpen(true)}
            className="gap-1.5 bg-emerald-700 hover:bg-emerald-800 text-xs shadow-sm"
          >
            <Plus className="w-4 h-4" />
            <span>Внести проводку</span>
          </Button>
        </div>

        {/* Transactions Table */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
          {filteredTransactions.length === 0 ? (
            <div className="p-12 text-center text-xs text-slate-400">
              Транзакций не найдено
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Дата</TableHead>
                  <TableHead>Тип</TableHead>
                  <TableHead>Категория</TableHead>
                  <TableHead>Описание</TableHead>
                  <TableHead className="text-right">Сумма</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTransactions.map((t) => {
                  const isIncome = t.type === "INCOME";

                  return (
                    <TableRow key={t.id}>
                      <TableCell className="text-xs text-slate-500">
                        {formatLocalDatetime(t.date, false)}
                      </TableCell>

                      <TableCell>
                        <Badge
                          variant={isIncome ? "success" : "destructive"}
                          className="text-[10px] font-semibold"
                        >
                          {isIncome ? "Доход" : "Расход"}
                        </Badge>
                      </TableCell>

                      <TableCell className="text-xs font-semibold text-slate-900">
                        {t.category}
                      </TableCell>

                      <TableCell className="text-xs text-slate-600">
                        {t.description || "—"}
                      </TableCell>

                      <TableCell
                        className={`text-right text-xs font-bold font-mono ${
                          isIncome ? "text-emerald-700" : "text-rose-700"
                        }`}
                      >
                        {isIncome ? "+" : "-"}
                        {formatUZS(t.amount)}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}
        </div>
      </div>

      {/* Add Transaction Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-5 shadow-2xl animate-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900">
                Внесение финансовой операции
              </h3>
              <button
                onClick={() => setModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {error && (
              <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleCreateTransaction} className="space-y-4">
              {/* Type Switcher */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Тип операции
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setTransType("EXPENSE");
                      setTransCategory(EXPENSE_CATEGORIES[0]);
                    }}
                    className={`py-2 rounded-lg text-xs font-bold border transition-colors ${
                      transType === "EXPENSE"
                        ? "bg-rose-50 border-rose-400 text-rose-800 shadow-2xs"
                        : "bg-white border-slate-200 text-slate-600"
                    }`}
                  >
                    Расход (Списание)
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setTransType("INCOME");
                      setTransCategory(INCOME_CATEGORIES[0]);
                    }}
                    className={`py-2 rounded-lg text-xs font-bold border transition-colors ${
                      transType === "INCOME"
                        ? "bg-emerald-50 border-emerald-400 text-emerald-800 shadow-2xs"
                        : "bg-white border-slate-200 text-slate-600"
                    }`}
                  >
                    Доход (Поступление)
                  </button>
                </div>
              </div>

              {/* Category */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Статья / категория
                </label>
                <select
                  value={transCategory}
                  onChange={(e) => setTransCategory(e.target.value)}
                  className="w-full h-9 px-3 rounded-md border border-slate-200 bg-white text-xs text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-600"
                >
                  {(transType === "EXPENSE" ? EXPENSE_CATEGORIES : INCOME_CATEGORIES).map(
                    (cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    )
                  )}
                </select>
              </div>

              {/* Amount */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Сумма в сумах (UZS) <span className="text-rose-500">*</span>
                </label>
                <Input
                  type="number"
                  min="1"
                  step="10000"
                  required
                  placeholder="0"
                  value={transAmount || ""}
                  onChange={(e) => setTransAmount(Number(e.target.value) || 0)}
                  className="text-xs font-bold font-mono"
                />
                <span className="text-[10px] text-slate-400 mt-1 block">
                  {formatUZS(transAmount)}
                </span>
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Описание / контрагент
                </label>
                <Input
                  placeholder="Например, оплата аренды склада за текущий месяц"
                  value={transDescription}
                  onChange={(e) => setTransDescription(e.target.value)}
                  className="text-xs"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setModalOpen(false)}
                >
                  Отмена
                </Button>
                <Button
                  type="submit"
                  disabled={loading}
                  size="sm"
                  className={transType === "EXPENSE" ? "bg-rose-600 hover:bg-rose-700" : "bg-emerald-700 hover:bg-emerald-800"}
                >
                  {loading ? "Запись..." : "Сохранить проводку"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
