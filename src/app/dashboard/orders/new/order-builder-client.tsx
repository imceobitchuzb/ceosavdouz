"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { formatUZS } from "@/lib/utils/format";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  Plus,
  Minus,
  Trash2,
  Search,
  ShoppingCart,
  UserPlus,
  CheckCircle2,
  AlertCircle,
  ArrowLeft,
  CreditCard,
  Banknote,
  Send,
  ArrowDown,
  X
} from "lucide-react";

interface Product {
  id: string;
  name: string;
  sku: string | null;
  sellingPrice: number;
  costPrice: number;
  stockQuantity: number;
  unit: string;
}

interface Customer {
  id: string;
  name: string;
  phone: string;
  currentDebt: number;
}

interface OrderItemRow {
  productId: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  costPrice: number;
  stockAvailable: number;
}

interface OrderBuilderClientProps {
  products: Product[];
  customers: Customer[];
}

export function OrderBuilderClient({
  products,
  customers,
}: OrderBuilderClientProps) {
  const router = useRouter();
  const checkoutSectionRef = React.useRef<HTMLDivElement>(null);

  // Selected order items
  const [items, setItems] = React.useState<OrderItemRow[]>([]);
  const [productSearch, setProductSearch] = React.useState("");

  // Customer state
  const [customerMode, setCustomerMode] = React.useState<"existing" | "new" | "guest">("guest");
  const [selectedCustomerId, setSelectedCustomerId] = React.useState<string>("");
  const [newCustomerName, setNewCustomerName] = React.useState("");
  const [newCustomerPhone, setNewCustomerPhone] = React.useState("");

  // Financials & Status
  const [discountAmount, setDiscountAmount] = React.useState<number>(0);
  const [paidAmount, setPaidAmount] = React.useState<number>(0);
  const [hasManuallyEditedPaid, setHasManuallyEditedPaid] = React.useState(false);
  const [paymentMethod, setPaymentMethod] = React.useState<"CASH" | "CARD" | "BANK_TRANSFER">("CASH");
  const [orderStatus, setOrderStatus] = React.useState<"COMPLETED" | "PROCESSING" | "PENDING">("COMPLETED");
  const [notes, setNotes] = React.useState("");

  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  // Auto-calculated totals with memoization
  const subtotal = React.useMemo(() => {
    return items.reduce((acc, item) => acc + item.quantity * item.unitPrice, 0);
  }, [items]);

  const totalAmount = React.useMemo(() => {
    return Math.max(0, subtotal - discountAmount);
  }, [subtotal, discountAmount]);

  // Synchronize paidAmount only if user hasn't explicitly set a custom amount
  React.useEffect(() => {
    if (!hasManuallyEditedPaid) {
      setPaidAmount(totalAmount);
    }
  }, [totalAmount, hasManuallyEditedPaid]);

  const debtAmount = Math.max(0, totalAmount - paidAmount);

  // Memoized product search
  const filteredProducts = React.useMemo(() => {
    const q = productSearch.trim().toLowerCase();
    if (!q) return products;
    return products.filter((p) => {
      return (
        p.name.toLowerCase().includes(q) ||
        (p.sku && p.sku.toLowerCase().includes(q))
      );
    });
  }, [products, productSearch]);

  // Add item or increment quantity
  const handleAddProduct = (product: Product) => {
    const existing = items.find((i) => i.productId === product.id);
    if (existing) {
      if (existing.quantity >= product.stockQuantity) {
        alert(`На складе доступно только ${product.stockQuantity} ${product.unit}`);
        return;
      }
      setItems((prev) =>
        prev.map((i) =>
          i.productId === product.id ? { ...i, quantity: i.quantity + 1 } : i
        )
      );
    } else {
      if (product.stockQuantity < 1) {
        alert(`Товар «${product.name}» закончился на складе!`);
        return;
      }
      setItems((prev) => [
        ...prev,
        {
          productId: product.id,
          productName: product.name,
          quantity: 1,
          unitPrice: product.sellingPrice,
          costPrice: product.costPrice,
          stockAvailable: product.stockQuantity,
        },
      ]);
    }
  };

  const updateQuantity = (productId: string, delta: number) => {
    setItems((prev) =>
      prev
        .map((item) => {
          if (item.productId === productId) {
            const newQty = item.quantity + delta;
            if (newQty > item.stockAvailable) {
              alert(`Доступно только ${item.stockAvailable} шт.`);
              return item;
            }
            return { ...item, quantity: Math.max(1, newQty) };
          }
          return item;
        })
        .filter((item) => item.quantity > 0)
    );
  };

  const removeItem = (productId: string) => {
    setItems((prev) => prev.filter((i) => i.productId !== productId));
  };

  const scrollToCheckout = () => {
    checkoutSectionRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (items.length === 0) {
      setError("Добавьте хотя бы один товар в заказ");
      return;
    }

    setLoading(true);
    setError(null);

    const payload = {
      customerId: customerMode === "existing" ? selectedCustomerId : null,
      customerName: customerMode === "new" ? newCustomerName : null,
      customerPhone: customerMode === "new" ? newCustomerPhone : null,
      items: items.map((i) => ({
        productId: i.productId,
        productName: i.productName,
        quantity: i.quantity,
        unitPrice: i.unitPrice,
        costPrice: i.costPrice,
      })),
      discountAmount,
      paidAmount,
      paymentMethod,
      status: orderStatus,
      notes: notes || null,
    };

    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Ошибка сохранения заказа");
      }

      router.push("/dashboard/orders");
      router.refresh();
    } catch (err: unknown) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const selectedCustomerObj = customers.find((c) => c.id === selectedCustomerId);

  return (
    <div className="space-y-6 pb-24 lg:pb-0">
      {error && (
        <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
          <span>{error}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* LEFT COLUMN: Catalog Picker (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="p-4 sm:p-5 bg-white rounded-xl border border-slate-200 shadow-2xs space-y-3.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                Каталог товаров
              </span>
              <span className="text-xs text-slate-500 font-mono">
                {products.length} поз.
              </span>
            </div>

            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
              <Input
                placeholder="Поиск по названию или артикулу..."
                value={productSearch}
                onChange={(e) => setProductSearch(e.target.value)}
                className="pl-9 pr-8 text-xs h-10"
              />
              {productSearch && (
                <button
                  onClick={() => setProductSearch("")}
                  className="absolute right-2.5 top-3 text-slate-400 hover:text-slate-600"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            <div className="max-h-[520px] overflow-y-auto divide-y divide-slate-100 pr-1 -mr-1">
              {filteredProducts.length === 0 ? (
                <div className="py-8 text-center text-xs text-slate-400">
                  Товары не найдены
                </div>
              ) : (
                filteredProducts.map((p) => {
                  const inCart = items.find((i) => i.productId === p.id);
                  const isOutOfStock = p.stockQuantity <= 0;

                  return (
                    <div
                      key={p.id}
                      className="py-3 flex items-center justify-between gap-2.5 text-xs transition-colors hover:bg-slate-50/60 rounded-lg px-1.5"
                    >
                      <div className="flex-1 min-w-0 pr-2">
                        <p className="font-semibold text-slate-900 truncate">{p.name}</p>
                        <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 text-[11px] text-slate-500 mt-0.5">
                          <span className="font-bold text-emerald-800 font-mono">
                            {formatUZS(p.sellingPrice)}
                          </span>
                          <span>·</span>
                          <span className={isOutOfStock ? "text-rose-600 font-semibold" : ""}>
                            Остаток: {p.stockQuantity} {p.unit}
                          </span>
                        </div>
                      </div>

                      <Button
                        size="sm"
                        disabled={isOutOfStock}
                        variant={inCart ? "secondary" : "outline"}
                        onClick={() => handleAddProduct(p)}
                        className={`h-9 px-3 text-xs gap-1 shrink-0 touch-manipulation ${
                          inCart ? "border-emerald-300 bg-emerald-50 text-emerald-900 font-semibold" : ""
                        }`}
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>{inCart ? `В чеке: ${inCart.quantity}` : "В чек"}</span>
                      </Button>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Order Summary & Checkout (5 cols) */}
        <div ref={checkoutSectionRef} className="lg:col-span-5 space-y-4">
          <Card className="shadow-sm border-slate-200">
            <CardContent className="p-4 sm:p-5 space-y-5">
              {/* Customer Selector */}
              <div className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Контрагент
                  </label>
                  {items.length > 0 && (
                    <Badge variant="outline" className="text-[10px] text-emerald-700 border-emerald-200">
                      Позиций: {items.length}
                    </Badge>
                  )}
                </div>

                <div className="grid grid-cols-3 gap-1.5 p-1 bg-slate-100 rounded-lg text-xs font-medium">
                  <button
                    type="button"
                    onClick={() => setCustomerMode("guest")}
                    className={`py-1.5 rounded-md text-center transition-colors ${
                      customerMode === "guest"
                        ? "bg-white text-slate-900 font-bold shadow-2xs"
                        : "text-slate-600"
                    }`}
                  >
                    Розничный
                  </button>
                  <button
                    type="button"
                    onClick={() => setCustomerMode("existing")}
                    className={`py-1.5 rounded-md text-center transition-colors ${
                      customerMode === "existing"
                        ? "bg-white text-slate-900 font-bold shadow-2xs"
                        : "text-slate-600"
                    }`}
                  >
                    Из базы
                  </button>
                  <button
                    type="button"
                    onClick={() => setCustomerMode("new")}
                    className={`py-1.5 rounded-md text-center transition-colors ${
                      customerMode === "new"
                        ? "bg-white text-slate-900 font-bold shadow-2xs"
                        : "text-slate-600"
                    }`}
                  >
                    + Новый
                  </button>
                </div>

                {customerMode === "existing" && (
                  <div className="space-y-2 pt-1">
                    <select
                      value={selectedCustomerId}
                      onChange={(e) => setSelectedCustomerId(e.target.value)}
                      className="w-full h-10 px-3 rounded-md border border-slate-200 bg-white text-xs text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-600"
                    >
                      <option value="">Выберите клиента...</option>
                      {customers.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.name} ({c.phone})
                        </option>
                      ))}
                    </select>

                    {selectedCustomerObj && selectedCustomerObj.currentDebt > 0 && (
                      <div className="p-2.5 rounded-lg bg-amber-50 border border-amber-200 text-xs text-amber-900 flex items-center justify-between">
                        <span>Текущий долг (Насия):</span>
                        <span className="font-bold text-amber-900 font-mono">
                          {formatUZS(selectedCustomerObj.currentDebt)}
                        </span>
                      </div>
                    )}
                  </div>
                )}

                {customerMode === "new" && (
                  <div className="space-y-2 pt-1">
                    <Input
                      placeholder="Имя клиента *"
                      value={newCustomerName}
                      onChange={(e) => setNewCustomerName(e.target.value)}
                      className="text-xs h-9"
                    />
                    <Input
                      placeholder="Телефон (+998 XX XXX XX XX)"
                      value={newCustomerPhone}
                      onChange={(e) => setNewCustomerPhone(e.target.value)}
                      className="text-xs h-9"
                    />
                  </div>
                )}
              </div>

              {/* Order Items List */}
              <div className="space-y-2 pt-2 border-t border-slate-100">
                <span className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                  Товары в заказе ({items.length})
                </span>

                {items.length === 0 ? (
                  <div className="p-6 text-center text-xs text-slate-400 bg-slate-50/80 rounded-lg border border-dashed border-slate-200">
                    Нажмите «В чек» на товарах из списка
                  </div>
                ) : (
                  <div className="max-h-60 overflow-y-auto divide-y divide-slate-100 pr-1 text-xs -mr-1">
                    {items.map((item) => (
                      <div key={item.productId} className="py-2.5 space-y-1.5">
                        <div className="flex items-center justify-between">
                          <span className="font-semibold text-slate-900 truncate pr-2">
                            {item.productName}
                          </span>
                          <span className="font-mono font-bold text-slate-900 shrink-0">
                            {formatUZS(item.quantity * item.unitPrice)}
                          </span>
                        </div>

                        <div className="flex items-center justify-between text-slate-500">
                          <span className="text-[11px]">{formatUZS(item.unitPrice)} / шт</span>
                          <div className="flex items-center gap-1.5">
                            <button
                              type="button"
                              onClick={() => updateQuantity(item.productId, -1)}
                              className="w-7 h-7 rounded bg-slate-100 hover:bg-slate-200 active:bg-slate-300 flex items-center justify-center text-slate-700 touch-manipulation"
                              aria-label="Уменьшить количество"
                            >
                              <Minus className="w-3.5 h-3.5" />
                            </button>
                            <span className="w-6 text-center font-bold text-slate-900 font-mono">
                              {item.quantity}
                            </span>
                            <button
                              type="button"
                              onClick={() => updateQuantity(item.productId, 1)}
                              className="w-7 h-7 rounded bg-slate-100 hover:bg-slate-200 active:bg-slate-300 flex items-center justify-center text-slate-700 touch-manipulation"
                              aria-label="Увеличить количество"
                            >
                              <Plus className="w-3.5 h-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={() => removeItem(item.productId)}
                              className="p-1.5 text-slate-400 hover:text-rose-600 ml-1 rounded"
                              aria-label="Удалить позицию"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Discount, Payment, Status */}
              <div className="space-y-3 pt-3 border-t border-slate-100 text-xs">
                {/* Discount */}
                <div className="flex items-center justify-between gap-4">
                  <span className="text-slate-600">Скидка (сум):</span>
                  <Input
                    type="number"
                    min="0"
                    step="5000"
                    value={discountAmount || ""}
                    onChange={(e) => setDiscountAmount(Number(e.target.value) || 0)}
                    placeholder="0"
                    className="w-32 h-9 text-right font-mono text-xs"
                  />
                </div>

                {/* Subtotal & Total */}
                <div className="p-3.5 bg-slate-50 rounded-xl space-y-1.5 border border-slate-100">
                  <div className="flex justify-between text-slate-500">
                    <span>Подытог:</span>
                    <span className="font-mono">{formatUZS(subtotal)}</span>
                  </div>
                  {discountAmount > 0 && (
                    <div className="flex justify-between text-emerald-700 font-medium">
                      <span>Скидка:</span>
                      <span className="font-mono">-{formatUZS(discountAmount)}</span>
                    </div>
                  )}
                  <div className="flex justify-between font-extrabold text-base text-slate-900 pt-1.5 border-t border-slate-200">
                    <span>Итого к оплате:</span>
                    <span className="text-emerald-800 font-mono">{formatUZS(totalAmount)}</span>
                  </div>
                </div>

                {/* Paid Amount */}
                <div className="flex items-center justify-between gap-4">
                  <span className="text-slate-700 font-semibold">Фактически оплачено:</span>
                  <Input
                    type="number"
                    min="0"
                    step="5000"
                    value={paidAmount}
                    onChange={(e) => {
                      setHasManuallyEditedPaid(true);
                      setPaidAmount(Number(e.target.value) || 0);
                    }}
                    className="w-36 h-9 text-right font-mono text-xs font-bold"
                  />
                </div>

                {/* Outstanding Debt Indicator */}
                {debtAmount > 0 && (
                  <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-amber-900 flex justify-between items-center font-semibold">
                    <span>Долг клиента (Насия):</span>
                    <span className="text-amber-800 font-mono">{formatUZS(debtAmount)}</span>
                  </div>
                )}

                {/* Payment Method */}
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                    Способ оплаты
                  </label>
                  <select
                    value={paymentMethod}
                    onChange={(e) => setPaymentMethod(e.target.value as any)}
                    className="w-full h-9 px-2 rounded-md border border-slate-200 bg-white text-xs text-slate-700"
                  >
                    <option value="CASH">Наличные (Сум)</option>
                    <option value="CARD">Uzcard / Humo</option>
                    <option value="BANK_TRANSFER">Банковский перевод (р/с)</option>
                  </select>
                </div>

                {/* Status */}
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                    Статус заказа
                  </label>
                  <select
                    value={orderStatus}
                    onChange={(e) => setOrderStatus(e.target.value as any)}
                    className="w-full h-9 px-2 rounded-md border border-slate-200 bg-white text-xs text-slate-700"
                  >
                    <option value="COMPLETED">Выполнен (Продажа закрыта)</option>
                    <option value="PROCESSING">В обработке (Сборка/Доставка)</option>
                    <option value="PENDING">Новый (Ожидает подтверждения)</option>
                  </select>
                </div>

                {/* Notes */}
                <div>
                  <Input
                    placeholder="Примечание к заказу (например, доставка Yandex Taxi)..."
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="text-xs h-9"
                  />
                </div>
              </div>

              {/* Submit Button */}
              <Button
                onClick={handleSubmit}
                disabled={loading || items.length === 0}
                className="w-full h-11 bg-emerald-700 hover:bg-emerald-800 text-sm gap-2 shadow-sm touch-manipulation"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>{loading ? "Оформление заказа..." : `Оформить на ${formatUZS(totalAmount)}`}</span>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* MOBILE STICKY FLOATING CHECKOUT BAR */}
      {items.length > 0 && (
        <div className="fixed bottom-0 inset-x-0 bg-white/95 backdrop-blur-md border-t border-slate-200 p-3 z-40 lg:hidden shadow-lg animate-in slide-in-from-bottom duration-200">
          <div className="max-w-md mx-auto flex items-center justify-between gap-3">
            <div>
              <span className="text-[11px] text-slate-500 font-medium block">
                {items.length} {items.length === 1 ? "товар" : "товара(ов)"} в чеке
              </span>
              <span className="text-base font-extrabold text-emerald-800 font-mono">
                {formatUZS(totalAmount)}
              </span>
            </div>

            <Button
              size="sm"
              onClick={scrollToCheckout}
              className="gap-1.5 bg-emerald-700 hover:bg-emerald-800 text-xs px-4 h-9 shadow-sm"
            >
              <span>К оплате</span>
              <ArrowDown className="w-3.5 h-3.5" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
