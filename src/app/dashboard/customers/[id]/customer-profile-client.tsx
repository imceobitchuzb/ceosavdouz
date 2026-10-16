"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  formatUZS,
  formatUzbekPhone,
  formatLocalDatetime,
  ORDER_STATUSES,
  PAYMENT_STATUSES,
  PAYMENT_METHODS
} from "@/lib/utils/format";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft,
  Phone,
  MapPin,
  Clock,
  CreditCard,
  PlusCircle,
  FileText,
  AlertCircle,
  CheckCircle2,
  X,
  Wallet
} from "lucide-react";

interface CustomerDetail {
  id: string;
  name: string;
  phone: string;
  address: string | null;
  notes: string | null;
  totalSpent: number;
  currentDebt: number;
  orders: {
    id: string;
    orderNumber: string;
    status: string;
    paymentStatus: string;
    totalAmount: number;
    paidAmount: number;
    createdAt: string | Date;
    items: { productName: string; quantity: number }[];
  }[];
  payments: {
    id: string;
    amount: number;
    paymentMethod: string;
    notes: string | null;
    createdAt: string | Date;
  }[];
}

interface CustomerProfileClientProps {
  customer: CustomerDetail;
}

export function CustomerProfileClient({ customer }: CustomerProfileClientProps) {
  const router = useRouter();
  const [activeTab, setActiveTab] = React.useState<"orders" | "payments">("orders");
  const [paymentModalOpen, setPaymentModalOpen] = React.useState(false);

  // Payment form state
  const [paymentAmount, setPaymentAmount] = React.useState<number>(customer.currentDebt || 0);
  const [paymentMethod, setPaymentMethod] = React.useState<"CASH" | "CARD" | "BANK_TRANSFER">("CASH");
  const [paymentNotes, setPaymentNotes] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const handleRecordPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (paymentAmount <= 0) {
      setError("Сумма платежа должна быть больше нуля");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`/api/customers/${customer.id}/payments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: paymentAmount,
          paymentMethod,
          notes: paymentNotes || null,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Ошибка сохранения платежа");
      }

      setPaymentModalOpen(false);
      setPaymentNotes("");
      router.refresh();
    } catch (err: unknown) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Back button & Title */}
      <div className="flex items-center justify-between">
        <Link href="/dashboard/customers">
          <Button variant="outline" size="sm" className="gap-1.5 text-xs">
            <ArrowLeft className="w-4 h-4" />
            <span>Назад к списку клиентов</span>
          </Button>
        </Link>

        {customer.currentDebt > 0 && (
          <Button
            size="sm"
            onClick={() => {
              setPaymentAmount(customer.currentDebt);
              setPaymentModalOpen(true);
            }}
            className="gap-1.5 bg-emerald-700 hover:bg-emerald-800 text-xs shadow-sm"
          >
            <Wallet className="w-4 h-4" />
            <span>Принять оплату долга</span>
          </Button>
        )}
      </div>

      {/* Profile Card & Financial Balances */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Customer Info Card */}
        <Card className="md:col-span-2 shadow-2xs">
          <CardHeader className="pb-3">
            <div className="flex items-start justify-between">
              <div>
                <CardTitle className="text-xl font-extrabold text-slate-900">
                  {customer.name}
                </CardTitle>
                <div className="flex items-center gap-2 mt-1 text-xs text-slate-600 font-mono">
                  <Phone className="w-3.5 h-3.5 text-slate-400" />
                  <a href={`tel:${customer.phone}`} className="hover:text-emerald-700">
                    {formatUzbekPhone(customer.phone)}
                  </a>
                </div>
              </div>
              <Badge variant="outline" className="text-xs">
                ID: {customer.id.slice(-6)}
              </Badge>
            </div>
          </CardHeader>

          <CardContent className="space-y-3 pt-0 text-xs text-slate-600">
            {customer.address && (
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                <span>{customer.address}</span>
              </div>
            )}
            {customer.notes && (
              <div className="p-3 rounded-lg bg-[#faf9f6] border border-slate-200/80">
                <span className="font-semibold text-slate-800 block mb-0.5">Заметки о клиенте:</span>
                <p className="text-slate-600 leading-relaxed">{customer.notes}</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Debt & Total Spent Summary */}
        <div className="space-y-4">
          <div className="p-5 bg-white rounded-xl border border-slate-200 shadow-2xs">
            <span className="text-xs text-slate-500 font-medium">Текущий долг (Насия)</span>
            <div className="text-2xl font-black text-amber-700 font-mono mt-1">
              {formatUZS(customer.currentDebt)}
            </div>
            {customer.currentDebt > 0 ? (
              <span className="text-[11px] text-amber-800 font-semibold mt-1 block">
                Требуется погашение задолженности
              </span>
            ) : (
              <span className="text-[11px] text-emerald-700 font-semibold mt-1 block">
                Задолженности нет
              </span>
            )}
          </div>

          <div className="p-5 bg-white rounded-xl border border-slate-200 shadow-2xs">
            <span className="text-xs text-slate-500 font-medium">Общий объем покупок</span>
            <div className="text-2xl font-black text-slate-900 font-mono mt-1">
              {formatUZS(customer.totalSpent)}
            </div>
            <span className="text-[11px] text-slate-500 mt-1 block">
              Всего заказов: {customer.orders.length}
            </span>
          </div>
        </div>
      </div>

      {/* Tabs: Orders / Payments History */}
      <Card className="shadow-2xs">
        <div className="border-b border-slate-200 px-6 pt-4 flex gap-6">
          <button
            onClick={() => setActiveTab("orders")}
            className={`pb-3 text-xs font-bold uppercase tracking-wider transition-colors border-b-2 ${
              activeTab === "orders"
                ? "border-emerald-700 text-emerald-800"
                : "border-transparent text-slate-500 hover:text-slate-800"
            }`}
          >
            История заказов ({customer.orders.length})
          </button>
          <button
            onClick={() => setActiveTab("payments")}
            className={`pb-3 text-xs font-bold uppercase tracking-wider transition-colors border-b-2 ${
              activeTab === "payments"
                ? "border-emerald-700 text-emerald-800"
                : "border-transparent text-slate-500 hover:text-slate-800"
            }`}
          >
            История оплат долга ({customer.payments.length})
          </button>
        </div>

        <CardContent className="p-6">
          {activeTab === "orders" && (
            <div className="space-y-3">
              {customer.orders.length === 0 ? (
                <p className="text-xs text-slate-400 py-6 text-center">Заказов пока не было</p>
              ) : (
                <div className="divide-y divide-slate-100">
                  {customer.orders.map((order) => {
                    const statusInfo = ORDER_STATUSES[order.status] || { label: order.status, color: "" };
                    const paymentInfo = PAYMENT_STATUSES[order.paymentStatus] || { label: order.paymentStatus, color: "" };

                    return (
                      <div key={order.id} className="py-3 flex items-center justify-between text-xs">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-slate-900">{order.orderNumber}</span>
                            <span className={`px-2 py-0.5 rounded text-[10px] font-semibold border ${statusInfo.color}`}>
                              {statusInfo.label}
                            </span>
                            <span className={`px-2 py-0.5 rounded text-[10px] font-semibold border ${paymentInfo.color}`}>
                              {paymentInfo.label}
                            </span>
                          </div>
                          <p className="text-slate-400 text-[11px] mt-0.5">
                            {formatLocalDatetime(order.createdAt)} · {order.items.length} поз.
                          </p>
                        </div>

                        <div className="text-right">
                          <span className="font-bold text-slate-900 font-mono text-sm block">
                            {formatUZS(order.totalAmount)}
                          </span>
                          {order.paidAmount < order.totalAmount && (
                            <span className="text-[10px] text-amber-700 block font-medium">
                              Долг: {formatUZS(order.totalAmount - order.paidAmount)}
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {activeTab === "payments" && (
            <div className="space-y-3">
              {customer.payments.length === 0 ? (
                <p className="text-xs text-slate-400 py-6 text-center">Платежей пока не зафиксировано</p>
              ) : (
                <div className="divide-y divide-slate-100">
                  {customer.payments.map((p) => (
                    <div key={p.id} className="py-3 flex items-center justify-between text-xs">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-emerald-800">
                            +{formatUZS(p.amount)}
                          </span>
                          <Badge variant="outline" className="text-[10px]">
                            {PAYMENT_METHODS[p.paymentMethod] || p.paymentMethod}
                          </Badge>
                        </div>
                        <p className="text-slate-500 text-[11px] mt-0.5">
                          {p.notes || "Погашение задолженности"}
                        </p>
                      </div>

                      <div className="text-slate-400 text-[11px]">
                        {formatLocalDatetime(p.createdAt)}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Record Debt Payment Modal */}
      {paymentModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-5 shadow-2xl animate-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  Прием оплаты задолженности
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Клиент: {customer.name}
                </p>
              </div>
              <button
                onClick={() => setPaymentModalOpen(false)}
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

            <form onSubmit={handleRecordPayment} className="space-y-4">
              <div className="p-3 bg-amber-50 rounded-lg border border-amber-200 text-xs flex justify-between items-center">
                <span className="text-amber-900 font-medium">Текущий долг клиента:</span>
                <span className="font-bold text-amber-900 font-mono text-sm">
                  {formatUZS(customer.currentDebt)}
                </span>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-semibold text-slate-700">
                    Сумма платежа (сум) <span className="text-rose-500">*</span>
                  </label>
                  <button
                    type="button"
                    onClick={() => setPaymentAmount(customer.currentDebt)}
                    className="text-[11px] text-emerald-700 font-semibold hover:underline"
                  >
                    Погасить весь долг
                  </button>
                </div>
                <Input
                  type="number"
                  min="1"
                  step="5000"
                  required
                  value={paymentAmount || ""}
                  onChange={(e) => setPaymentAmount(Number(e.target.value) || 0)}
                  className="font-mono text-xs font-bold"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Способ оплаты
                </label>
                <select
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value as any)}
                  className="w-full h-9 px-3 rounded-md border border-slate-200 bg-white text-xs text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-600"
                >
                  <option value="CASH">Наличные (Сум)</option>
                  <option value="CARD">Uzcard / Humo</option>
                  <option value="BANK_TRANSFER">Банковский перевод</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Примечание / комментарий
                </label>
                <Input
                  placeholder="Например, наличными в кассу или чек №..."
                  value={paymentNotes}
                  onChange={(e) => setPaymentNotes(e.target.value)}
                  className="text-xs"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setPaymentModalOpen(false)}
                >
                  Отмена
                </Button>
                <Button
                  type="submit"
                  disabled={loading}
                  size="sm"
                  className="bg-emerald-700 hover:bg-emerald-800"
                >
                  {loading ? "Обработка..." : `Зачислить ${formatUZS(paymentAmount)}`}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
