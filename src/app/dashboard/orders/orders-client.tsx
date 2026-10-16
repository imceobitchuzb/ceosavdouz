"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  formatUZS,
  formatLocalDatetime,
  ORDER_STATUSES,
  PAYMENT_STATUSES,
} from "@/lib/utils/format";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from "@/components/ui/table";
import {
  Search,
  ShoppingCart,
  Eye,
  CheckCircle2,
  Clock,
  XCircle,
  FileText,
  X
} from "lucide-react";

interface OrderItem {
  id: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

interface Order {
  id: string;
  orderNumber: string;
  status: string;
  paymentStatus: string;
  totalAmount: number;
  discountAmount: number;
  paidAmount: number;
  notes: string | null;
  createdAt: string | Date;
  customer: { id: string; name: string; phone: string; currentDebt: number } | null;
  items: OrderItem[];
}

interface OrdersClientProps {
  initialOrders: Order[];
  userRole: string;
}

export function OrdersClient({ initialOrders, userRole }: OrdersClientProps) {
  const router = useRouter();
  const [search, setSearch] = React.useState("");
  const [statusFilter, setStatusFilter] = React.useState<string>("ALL");
  const [selectedOrder, setSelectedOrder] = React.useState<Order | null>(null);
  const [updatingId, setUpdatingId] = React.useState<string | null>(null);

  const filteredOrders = React.useMemo(() => {
    const s = search.trim().toLowerCase();
    return initialOrders.filter((order) => {
      const matchesSearch =
        !s ||
        order.orderNumber.toLowerCase().includes(s) ||
        (order.customer?.name && order.customer.name.toLowerCase().includes(s)) ||
        (order.customer?.phone && order.customer.phone.includes(s));

      const matchesStatus =
        statusFilter === "ALL" || order.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [initialOrders, search, statusFilter]);

  const handleStatusChange = async (orderId: string, newStatus: string) => {
    setUpdatingId(orderId);
    try {
      const res = await fetch(`/api/orders/${orderId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!res.ok) {
        const err = await res.json();
        alert(err.error || "Ошибка обновления статуса");
        return;
      }

      router.refresh();
      if (selectedOrder && selectedOrder.id === orderId) {
        setSelectedOrder({ ...selectedOrder, status: newStatus });
      }
    } catch {
      alert("Ошибка сети");
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div className="space-y-4">
      {/* Search & Status Filters */}
      <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-2xs flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
          <Input
            placeholder="Поиск по номеру заказа, клиенту или телефону..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 pr-8 text-xs h-9"
          />
          {search && (
            <button
              onClick={() => setSearch("")}
              className="absolute right-2.5 top-2.5 text-slate-400 hover:text-slate-600"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Status Pills */}
        <div className="flex flex-wrap items-center gap-1.5 text-xs">
          {[
            { id: "ALL", label: `Все (${initialOrders.length})` },
            { id: "PENDING", label: "Новые" },
            { id: "PROCESSING", label: "В обработке" },
            { id: "COMPLETED", label: "Выполнены" },
            { id: "CANCELLED", label: "Отменены" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setStatusFilter(tab.id)}
              className={`px-3 py-1.5 rounded-lg font-medium transition-colors touch-manipulation ${
                statusFilter === tab.id
                  ? "bg-emerald-800 text-white shadow-2xs"
                  : "bg-slate-100 text-slate-700 hover:bg-slate-200"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Content: Mobile Cards + Desktop Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
        {filteredOrders.length === 0 ? (
          <div className="p-12 text-center space-y-3">
            <ShoppingCart className="w-10 h-10 text-slate-300 mx-auto" />
            <h3 className="text-sm font-semibold text-slate-900">Заказы не найдены</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Попробуйте сбросить фильтры или оформите новый заказ.
            </p>
          </div>
        ) : (
          <>
            {/* MOBILE CARDS VIEW (< md) */}
            <div className="divide-y divide-slate-100 md:hidden">
              {filteredOrders.map((order) => {
                const statusInfo = ORDER_STATUSES[order.status] || {
                  label: order.status,
                  color: "",
                };
                const paymentInfo = PAYMENT_STATUSES[order.paymentStatus] || {
                  label: order.paymentStatus,
                  color: "",
                };

                return (
                  <div key={order.id} className="p-3.5 space-y-2.5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-extrabold text-slate-900 font-mono text-sm">
                          {order.orderNumber}
                        </span>
                        <span className="text-[11px] text-slate-400">
                          {formatLocalDatetime(order.createdAt, false)}
                        </span>
                      </div>

                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setSelectedOrder(order)}
                        className="h-7 px-2.5 text-xs gap-1 text-slate-700"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Чек</span>
                      </Button>
                    </div>

                    <div className="flex items-center justify-between text-xs">
                      <div className="truncate pr-2">
                        <span className="font-semibold text-slate-800 truncate block">
                          {order.customer?.name || "Розничный покупатель"}
                        </span>
                        {order.customer?.phone && (
                          <span className="text-[10px] text-slate-400 font-mono">
                            {order.customer.phone}
                          </span>
                        )}
                      </div>

                      <div className="text-right shrink-0">
                        <span className="font-extrabold text-slate-900 font-mono text-sm block">
                          {formatUZS(order.totalAmount)}
                        </span>
                        {order.paidAmount < order.totalAmount && (
                          <span className="text-[10px] text-amber-700 font-semibold block">
                            Долг: {formatUZS(order.totalAmount - order.paidAmount)}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center justify-between gap-2 pt-1 border-t border-slate-50">
                      <div className="flex items-center gap-1.5">
                        <span
                          className={`inline-flex px-2 py-0.5 rounded text-[10px] font-semibold border ${paymentInfo.color}`}
                        >
                          {paymentInfo.label}
                        </span>
                      </div>

                      <select
                        value={order.status}
                        disabled={updatingId === order.id}
                        onChange={(e) => handleStatusChange(order.id, e.target.value)}
                        className={`text-xs font-semibold rounded px-2 py-1 border transition-colors focus:outline-none ${statusInfo.color}`}
                      >
                        <option value="PENDING">Новый</option>
                        <option value="PROCESSING">В обработке</option>
                        <option value="COMPLETED">Выполнен</option>
                        <option value="CANCELLED">Отменен</option>
                      </select>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* DESKTOP TABLE VIEW (>= md) */}
            <div className="hidden md:block">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Номер и дата</TableHead>
                    <TableHead>Клиент</TableHead>
                    <TableHead>Позиции</TableHead>
                    <TableHead>Сумма заказа</TableHead>
                    <TableHead>Статус оплаты</TableHead>
                    <TableHead>Статус заказа</TableHead>
                    <TableHead className="text-right">Детали</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredOrders.map((order) => {
                    const statusInfo = ORDER_STATUSES[order.status] || {
                      label: order.status,
                      color: "",
                    };
                    const paymentInfo = PAYMENT_STATUSES[order.paymentStatus] || {
                      label: order.paymentStatus,
                      color: "",
                    };

                    return (
                      <TableRow key={order.id}>
                        <TableCell>
                          <div>
                            <span className="font-bold text-slate-900 block font-mono">
                              {order.orderNumber}
                            </span>
                            <span className="text-[11px] text-slate-400">
                              {formatLocalDatetime(order.createdAt)}
                            </span>
                          </div>
                        </TableCell>

                        <TableCell>
                          <div>
                            <span className="font-semibold text-slate-900 block text-xs">
                              {order.customer?.name || "Розничный покупатель"}
                            </span>
                            {order.customer?.phone && (
                              <span className="text-[11px] text-slate-400 font-mono">
                                {order.customer.phone}
                              </span>
                            )}
                          </div>
                        </TableCell>

                        <TableCell className="text-xs text-slate-600">
                          {order.items.length} поз.
                        </TableCell>

                        <TableCell>
                          <div>
                            <span className="font-bold text-slate-900 text-xs block font-mono">
                              {formatUZS(order.totalAmount)}
                            </span>
                            {order.paidAmount < order.totalAmount && (
                              <span className="text-[10px] text-amber-700 block font-medium">
                                Остаток: {formatUZS(order.totalAmount - order.paidAmount)}
                              </span>
                            )}
                          </div>
                        </TableCell>

                        <TableCell>
                          <span
                            className={`inline-flex px-2 py-0.5 rounded text-[10px] font-semibold border ${paymentInfo.color}`}
                          >
                            {paymentInfo.label}
                          </span>
                        </TableCell>

                        <TableCell>
                          <select
                            value={order.status}
                            disabled={updatingId === order.id}
                            onChange={(e) => handleStatusChange(order.id, e.target.value)}
                            className={`text-xs font-semibold rounded px-2 py-1 border transition-colors focus:outline-none ${statusInfo.color}`}
                          >
                            <option value="PENDING">Новый</option>
                            <option value="PROCESSING">В обработке</option>
                            <option value="COMPLETED">Выполнен</option>
                            <option value="CANCELLED">Отменен</option>
                          </select>
                        </TableCell>

                        <TableCell className="text-right">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setSelectedOrder(order)}
                            className="text-slate-500 hover:text-emerald-700 h-8 px-2"
                            title="Просмотр заказа"
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          </>
        )}
      </div>

      {/* Order Details Modal Dialog with Responsive Viewport */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto p-5 sm:p-6 space-y-4 sm:space-y-5 shadow-2xl animate-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="text-base sm:text-lg font-bold text-slate-900">
                  Заказ {selectedOrder.orderNumber}
                </h3>
                <p className="text-xs text-slate-500">
                  {formatLocalDatetime(selectedOrder.createdAt)}
                </p>
              </div>
              <button
                onClick={() => setSelectedOrder(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Customer Info */}
            <div className="p-3 bg-slate-50 rounded-xl text-xs space-y-1">
              <span className="text-[10px] uppercase font-bold text-slate-400">Контрагент</span>
              <p className="font-bold text-slate-900">
                {selectedOrder.customer?.name || "Розничный покупатель"}
              </p>
              {selectedOrder.customer?.phone && (
                <p className="text-slate-600 font-mono">{selectedOrder.customer.phone}</p>
              )}
            </div>

            {/* Items List */}
            <div className="space-y-2">
              <span className="text-xs font-bold text-slate-900">Состав заказа</span>
              <div className="divide-y divide-slate-100 text-xs">
                {selectedOrder.items.map((item, idx) => (
                  <div key={idx} className="py-2 flex items-center justify-between gap-2">
                    <div className="truncate pr-2">
                      <p className="font-semibold text-slate-900 truncate">{item.productName}</p>
                      <p className="text-slate-500 text-[11px]">
                        {item.quantity} шт × {formatUZS(item.unitPrice)}
                      </p>
                    </div>
                    <span className="font-mono font-bold text-slate-900 shrink-0">
                      {formatUZS(item.total)}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Calculations Breakdown */}
            <div className="pt-3 border-t border-slate-100 text-xs space-y-1.5">
              {selectedOrder.discountAmount > 0 && (
                <div className="flex justify-between text-emerald-700">
                  <span>Скидка:</span>
                  <span>-{formatUZS(selectedOrder.discountAmount)}</span>
                </div>
              )}
              <div className="flex justify-between font-bold text-sm text-slate-900 pt-1">
                <span>Итоговая сумма:</span>
                <span className="font-mono">{formatUZS(selectedOrder.totalAmount)}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Оплачено:</span>
                <span className="font-semibold font-mono">{formatUZS(selectedOrder.paidAmount)}</span>
              </div>
              {selectedOrder.totalAmount > selectedOrder.paidAmount && (
                <div className="flex justify-between text-amber-700 font-semibold">
                  <span>Остаток задолженности:</span>
                  <span className="font-mono">{formatUZS(selectedOrder.totalAmount - selectedOrder.paidAmount)}</span>
                </div>
              )}
            </div>

            {selectedOrder.notes && (
              <div className="p-3 bg-amber-50/70 border border-amber-200/80 rounded-lg text-xs text-amber-900">
                <span className="font-bold block mb-0.5">Примечание:</span>
                {selectedOrder.notes}
              </div>
            )}

            <Button
              className="w-full text-xs h-10"
              variant="outline"
              onClick={() => setSelectedOrder(null)}
            >
              Закрыть
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
