import Link from "next/link";
import { requireAuth } from "@/lib/auth/session";
import prisma from "@/lib/db/prisma";
import { formatUZS, formatLocalDatetime, ORDER_STATUSES, PAYMENT_STATUSES } from "@/lib/utils/format";
import { SalesChart } from "@/components/dashboard/sales-chart";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  TrendingUp,
  ShoppingCart,
  Users,
  AlertTriangle,
  Plus,
  ArrowRight,
  Package,
  Clock,
  Sparkles
} from "lucide-react";

export default async function DashboardPage() {
  const session = await requireAuth();

  // 1. Fetch Key KPIs for this business
  const [
    orders,
    products,
    customers,
    lowStockProducts,
    recentOrders,
    recentNotifications,
  ] = await Promise.all([
    // All orders
    prisma.order.findMany({
      where: { businessId: session.businessId },
      select: { totalAmount: true, status: true, paidAmount: true, createdAt: true },
    }),
    // Products count
    prisma.product.count({
      where: { businessId: session.businessId },
    }),
    // Customers with debt
    prisma.customer.findMany({
      where: { businessId: session.businessId },
      select: { currentDebt: true },
    }),
    // Low stock items
    prisma.product.findMany({
      where: {
        businessId: session.businessId,
        stockQuantity: { lte: 5 },
      },
      take: 4,
    }),
    // Recent 5 orders
    prisma.order.findMany({
      where: { businessId: session.businessId },
      orderBy: { createdAt: "desc" },
      take: 5,
      include: {
        customer: { select: { name: true, phone: true } },
        items: true,
      },
    }),
    // Recent notifications
    prisma.notification.findMany({
      where: { businessId: session.businessId },
      orderBy: { createdAt: "desc" },
      take: 4,
    }),
  ]);

  // Aggregate stats: strictly count non-cancelled orders for revenue!
  const completedOrActiveOrders = orders.filter((o) => o.status !== "CANCELLED");
  const totalRevenue = completedOrActiveOrders.reduce((sum, o) => sum + o.totalAmount, 0);
  const totalDebt = customers.reduce((sum, c) => sum + c.currentDebt, 0);

  // 2. Prepare 7-day sales chart data
  const days: { [key: string]: { date: string; revenue: number; orders: number } } = {};
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const key = d.toLocaleDateString("ru-RU", { month: "short", day: "numeric" });
    days[key] = { date: key, revenue: 0, orders: 0 };
  }

  completedOrActiveOrders.forEach((o) => {
    const orderDate = new Date(o.createdAt);
    const key = orderDate.toLocaleDateString("ru-RU", { month: "short", day: "numeric" });
    if (days[key]) {
      days[key].revenue += o.totalAmount;
      days[key].orders += 1;
    }
  });

  const chartData = Object.values(days);

  return (
    <div className="space-y-6">
      {/* Top Welcome Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
              С возвращением, {session.name}
            </h1>
            <Badge variant="outline" className="text-emerald-700 border-emerald-200 bg-emerald-50 text-[10px]">
              Онлайн
            </Badge>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Операционная сводка по компании «{session.businessName}» · {new Intl.DateTimeFormat("ru-RU", { dateStyle: "long", timeZone: "Asia/Tashkent" }).format(new Date())}
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Link href="/dashboard/orders/new">
            <Button size="sm" className="gap-1.5 shadow-sm bg-emerald-700 hover:bg-emerald-800">
              <Plus className="w-4 h-4" />
              <span>Создать заказ</span>
            </Button>
          </Link>
          <Link href="/dashboard/products/new">
            <Button variant="outline" size="sm" className="gap-1.5">
              <Package className="w-4 h-4" />
              <span>Добавить товар</span>
            </Button>
          </Link>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* KPI 1: Revenue */}
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <span className="text-xs font-semibold text-slate-500">Выручка от заказов</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-xl sm:text-2xl font-black text-slate-900">
              {formatUZS(totalRevenue)}
            </div>
            <p className="text-[11px] text-slate-500 mt-1">
              Активных заказов: {completedOrActiveOrders.length}
            </p>
          </CardContent>
        </Card>

        {/* KPI 2: Total Orders */}
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <span className="text-xs font-semibold text-slate-500">Всего заказов</span>
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center">
              <ShoppingCart className="w-4 h-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-xl sm:text-2xl font-black text-slate-900">
              {orders.length}
            </div>
            <p className="text-[11px] text-slate-500 mt-1">
              Сумма среднего чека: {completedOrActiveOrders.length ? formatUZS(totalRevenue / completedOrActiveOrders.length) : "0 сум"}
            </p>
          </CardContent>
        </Card>

        {/* KPI 3: Customer Debt */}
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <span className="text-xs font-semibold text-slate-500">Долг клиентов (Насия)</span>
            <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-xl sm:text-2xl font-black text-amber-700">
              {formatUZS(totalDebt)}
            </div>
            <p className="text-[11px] text-amber-800 font-medium mt-1">
              {customers.filter((c) => c.currentDebt > 0).length} контрагента с задолженностью
            </p>
          </CardContent>
        </Card>

        {/* KPI 4: Low Stock */}
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <span className="text-xs font-semibold text-slate-500">Товары на исходе</span>
            <div className="w-8 h-8 rounded-lg bg-rose-50 text-rose-700 flex items-center justify-center">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-xl sm:text-2xl font-black text-rose-700">
              {lowStockProducts.length} поз.
            </div>
            <p className="text-[11px] text-slate-500 mt-1">
              Всего в каталоге: {products} товаров
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts & Warnings Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Sales Chart (2 cols) */}
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between pb-4">
            <div>
              <CardTitle className="text-base font-bold">Динамика продаж</CardTitle>
              <p className="text-xs text-slate-500 mt-0.5">Выручка по дням за последнюю неделю</p>
            </div>
            <Link href="/dashboard/analytics">
              <Button variant="ghost" size="sm" className="text-xs text-emerald-700 hover:text-emerald-800 gap-1">
                <span>Полный отчет</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            <SalesChart data={chartData} />
          </CardContent>
        </Card>

        {/* Low Stock Warning Box */}
        <Card className="flex flex-col justify-between">
          <div>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-bold flex items-center gap-2 text-rose-900">
                  <AlertTriangle className="w-4 h-4 text-rose-600" />
                  <span>Критический остаток</span>
                </CardTitle>
                <Link href="/dashboard/products" className="text-xs text-slate-500 hover:text-slate-800">
                  Все товары →
                </Link>
              </div>
              <p className="text-xs text-slate-500">Товары, требующие срочной закупки</p>
            </CardHeader>
            <CardContent className="space-y-2.5">
              {lowStockProducts.length === 0 ? (
                <p className="text-xs text-emerald-700 py-4 text-center">Все товарные позиции в достаточном количестве</p>
              ) : (
                lowStockProducts.map((p) => (
                  <div key={p.id} className="p-2.5 rounded-lg border border-slate-200 bg-white flex items-center justify-between text-xs">
                    <div className="space-y-0.5 pr-2">
                      <p className="font-semibold text-slate-900 line-clamp-1">{p.name}</p>
                      <p className="text-slate-500 text-[10px] font-mono">{p.sku || "Без SKU"}</p>
                    </div>
                    <Badge variant="destructive" className="shrink-0 text-[10px] py-0.5 px-2">
                      {p.stockQuantity} {p.unit}
                    </Badge>
                  </div>
                ))
              )}
            </CardContent>
          </div>

          <div className="p-4 pt-0">
            <Link href="/dashboard/products">
              <Button variant="outline" size="sm" className="w-full text-xs">
                Пополнить склад
              </Button>
            </Link>
          </div>
        </Card>
      </div>

      {/* Recent Orders & Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Orders (2 cols) */}
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between pb-3">
            <div>
              <CardTitle className="text-base font-bold">Последние заказы</CardTitle>
              <p className="text-xs text-slate-500 mt-0.5">Свежие продажи и оформленные чеки</p>
            </div>
            <Link href="/dashboard/orders">
              <Button variant="outline" size="sm" className="text-xs">
                Смотреть все заказы
              </Button>
            </Link>
          </CardHeader>
          <CardContent className="p-0">
            {recentOrders.length === 0 ? (
              <div className="p-6 text-center text-xs text-slate-500">
                Заказов пока нет. Нажмите «Создать заказ», чтобы оформить первую продажу.
              </div>
            ) : (
              <div className="divide-y divide-slate-100">
                {recentOrders.map((order) => {
                  const statusInfo = ORDER_STATUSES[order.status] || { label: order.status, color: "" };
                  const paymentInfo = PAYMENT_STATUSES[order.paymentStatus] || { label: order.paymentStatus, color: "" };

                  return (
                    <div key={order.id} className="p-4 hover:bg-slate-50/80 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-slate-900">{order.orderNumber}</span>
                          <span className={`px-2 py-0.5 rounded text-[10px] font-semibold border ${statusInfo.color}`}>
                            {statusInfo.label}
                          </span>
                          <span className={`px-2 py-0.5 rounded text-[10px] font-semibold border ${paymentInfo.color}`}>
                            {paymentInfo.label}
                          </span>
                        </div>
                        <p className="text-slate-600">
                          Клиент: <span className="font-medium text-slate-900">{order.customer?.name || "Розничный покупатель"}</span>
                          {order.customer?.phone && <span className="text-slate-400 font-mono ml-1">({order.customer.phone})</span>}
                        </p>
                        <p className="text-slate-400 text-[10px]">
                          {formatLocalDatetime(order.createdAt)} · Позиций: {order.items.length}
                        </p>
                      </div>

                      <div className="text-right sm:self-center">
                        <span className="text-sm font-bold text-slate-900 block">
                          {formatUZS(order.totalAmount)}
                        </span>
                        {order.paidAmount < order.totalAmount && (
                          <span className="text-[10px] text-amber-700 font-medium block">
                            Остаток: {formatUZS(order.totalAmount - order.paidAmount)}
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Notifications & System Activity */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-bold flex items-center justify-between">
              <span>Уведомления</span>
              <Link href="/dashboard/notifications" className="text-xs text-emerald-700 hover:underline font-normal">
                Все →
              </Link>
            </CardTitle>
            <p className="text-xs text-slate-500 mt-0.5">События и оповещения системы</p>
          </CardHeader>
          <CardContent className="space-y-3">
            {recentNotifications.length === 0 ? (
              <p className="text-xs text-slate-400 text-center py-6">Нет новых уведомлений</p>
            ) : (
              recentNotifications.map((n) => (
                <div key={n.id} className="p-3 rounded-lg border border-slate-200/80 bg-white space-y-1 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-slate-900 line-clamp-1">{n.title}</span>
                    <span className="text-[10px] text-slate-400 shrink-0 ml-1">
                      {new Date(n.createdAt).toLocaleTimeString("ru-RU", { hour: "2-digit", minute: "2-digit", timeZone: "Asia/Tashkent" })}
                    </span>
                  </div>
                  <p className="text-slate-600 text-[11px] leading-relaxed line-clamp-2">
                    {n.message}
                  </p>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
