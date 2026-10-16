import { requireAuth } from "@/lib/auth/session";
import prisma from "@/lib/db/prisma";
import { formatUZS, formatLocalDatetime, ORDER_STATUSES, PAYMENT_STATUSES } from "@/lib/utils/format";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from "@/components/ui/table";
import { TrendingUp, ShoppingBag, CreditCard, Banknote, Building2 } from "lucide-react";

export default async function SalesPage() {
  const session = await requireAuth();

  const orders = await prisma.order.findMany({
    where: { businessId: session.businessId },
    include: {
      customer: true,
      items: true,
      payments: true,
    },
    orderBy: { createdAt: "desc" },
  });

  const validOrders = orders.filter((o) => o.status !== "CANCELLED");
  const totalRevenue = validOrders.reduce((sum, o) => sum + o.totalAmount, 0);
  const avgOrderValue = validOrders.length > 0 ? Math.round(totalRevenue / validOrders.length) : 0;

  // Breakdown by payment method from payments
  const payments = await prisma.payment.findMany({
    where: { businessId: session.businessId },
  });

  const cashTotal = payments
    .filter((p) => p.paymentMethod === "CASH")
    .reduce((sum, p) => sum + p.amount, 0);

  const cardTotal = payments
    .filter((p) => p.paymentMethod === "CARD")
    .reduce((sum, p) => sum + p.amount, 0);

  const bankTotal = payments
    .filter((p) => p.paymentMethod === "BANK_TRANSFER")
    .reduce((sum, p) => sum + p.amount, 0);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
          Отчет по продажам
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Сводка по выручке, структуре оплат и среднему чеку
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 bg-white rounded-xl border border-slate-200 shadow-2xs">
          <span className="text-xs text-slate-500 font-medium">Общая выручка от продаж</span>
          <p className="text-2xl font-black text-slate-900 font-mono mt-1">
            {formatUZS(totalRevenue)}
          </p>
          <span className="text-[11px] text-emerald-700 font-medium mt-1 block">
            Успешных заказов: {validOrders.length}
          </span>
        </div>

        <div className="p-5 bg-white rounded-xl border border-slate-200 shadow-2xs">
          <span className="text-xs text-slate-500 font-medium">Средний чек (AOV)</span>
          <p className="text-2xl font-black text-slate-900 font-mono mt-1">
            {formatUZS(avgOrderValue)}
          </p>
          <span className="text-[11px] text-slate-500 mt-1 block">
            На одного покупателя
          </span>
        </div>

        <div className="p-5 bg-white rounded-xl border border-slate-200 shadow-2xs">
          <span className="text-xs text-slate-500 font-medium">Фактически собрано оплат</span>
          <p className="text-2xl font-black text-emerald-800 font-mono mt-1">
            {formatUZS(cashTotal + cardTotal + bankTotal)}
          </p>
          <span className="text-[11px] text-slate-500 mt-1 block">
            Наличные, Uzcard, Humo, р/с
          </span>
        </div>
      </div>

      {/* Payment methods distribution */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-xl border border-slate-200 bg-white flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center">
            <Banknote className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs text-slate-500">Наличные (Сум)</span>
            <p className="text-base font-bold text-slate-900 font-mono">{formatUZS(cashTotal)}</p>
          </div>
        </div>

        <div className="p-4 rounded-xl border border-slate-200 bg-white flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center">
            <CreditCard className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs text-slate-500">Uzcard / Humo</span>
            <p className="text-base font-bold text-slate-900 font-mono">{formatUZS(cardTotal)}</p>
          </div>
        </div>

        <div className="p-4 rounded-xl border border-slate-200 bg-white flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-purple-50 text-purple-700 flex items-center justify-center">
            <Building2 className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs text-slate-500">Банковский перевод (р/с)</span>
            <p className="text-base font-bold text-slate-900 font-mono">{formatUZS(bankTotal)}</p>
          </div>
        </div>
      </div>

      {/* Sales Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <h3 className="font-bold text-sm text-slate-900">Журнал продаж</h3>
          <span className="text-xs text-slate-500">Всего записей: {orders.length}</span>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Заказ</TableHead>
              <TableHead>Дата и время</TableHead>
              <TableHead>Покупатель</TableHead>
              <TableHead>Статус заказа</TableHead>
              <TableHead>Оплата</TableHead>
              <TableHead className="text-right">Сумма продажи</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders.map((o) => {
              const statusInfo = ORDER_STATUSES[o.status] || { label: o.status, color: "" };
              const paymentInfo = PAYMENT_STATUSES[o.paymentStatus] || { label: o.paymentStatus, color: "" };

              return (
                <TableRow key={o.id}>
                  <TableCell className="font-bold text-slate-900 font-mono text-xs">
                    {o.orderNumber}
                  </TableCell>
                  <TableCell className="text-xs text-slate-500">
                    {formatLocalDatetime(o.createdAt)}
                  </TableCell>
                  <TableCell className="text-xs text-slate-800">
                    {o.customer?.name || "Розничный покупатель"}
                  </TableCell>
                  <TableCell>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-semibold border ${statusInfo.color}`}>
                      {statusInfo.label}
                    </span>
                  </TableCell>
                  <TableCell>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-semibold border ${paymentInfo.color}`}>
                      {paymentInfo.label}
                    </span>
                  </TableCell>
                  <TableCell className="text-right font-bold text-slate-900 font-mono text-xs">
                    {formatUZS(o.totalAmount)}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
