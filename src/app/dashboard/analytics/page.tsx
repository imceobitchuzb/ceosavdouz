import { requireAuth } from "@/lib/auth/session";
import prisma from "@/lib/db/prisma";
import { formatUZS } from "@/lib/utils/format";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { SalesChart } from "@/components/dashboard/sales-chart";
import { FinanceChart } from "@/components/dashboard/finance-chart";
import {
  TrendingUp,
  BarChart3,
  Package,
  Users,
  Award,
  AlertTriangle,
  PieChart as PieIcon
} from "lucide-react";

export default async function AnalyticsPage() {
  const session = await requireAuth();

  // Load orders with items and products
  const [orders, products, customers, transactions] = await Promise.all([
    prisma.order.findMany({
      where: { businessId: session.businessId, status: { not: "CANCELLED" } },
      include: {
        items: { include: { product: true } },
        customer: true,
      },
      orderBy: { createdAt: "desc" },
    }),
    prisma.product.findMany({
      where: { businessId: session.businessId },
      include: { category: true },
    }),
    prisma.customer.findMany({
      where: { businessId: session.businessId },
    }),
    prisma.transaction.findMany({
      where: { businessId: session.businessId },
    }),
  ]);

  // Calculations
  const totalRevenue = orders.reduce((sum, o) => sum + o.totalAmount, 0);
  const totalCost = orders.reduce((sum, o) => {
    return sum + o.items.reduce((iSum, i) => iSum + i.quantity * i.costPrice, 0);
  }, 0);
  const grossProfit = Math.max(0, totalRevenue - totalCost);
  const grossMargin = totalRevenue > 0 ? Math.round((grossProfit / totalRevenue) * 100) : 0;
  const avgCheck = orders.length > 0 ? Math.round(totalRevenue / orders.length) : 0;

  // Best-selling products calculation
  const productSalesMap: { [key: string]: { name: string; quantity: number; revenue: number } } = {};
  orders.forEach((o) => {
    o.items.forEach((item) => {
      const name = item.productName;
      if (!productSalesMap[name]) {
        productSalesMap[name] = { name, quantity: 0, revenue: 0 };
      }
      productSalesMap[name].quantity += item.quantity;
      productSalesMap[name].revenue += item.total;
    });
  });

  const topProducts = Object.values(productSalesMap)
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, 5);

  // Sales trend by day
  const days: { [key: string]: { date: string; revenue: number; orders: number } } = {};
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const key = d.toLocaleDateString("ru-RU", { month: "short", day: "numeric" });
    days[key] = { date: key, revenue: 0, orders: 0 };
  }
  orders.forEach((o) => {
    const d = new Date(o.createdAt);
    const key = d.toLocaleDateString("ru-RU", { month: "short", day: "numeric" });
    if (days[key]) {
      days[key].revenue += o.totalAmount;
      days[key].orders += 1;
    }
  });
  const salesChartData = Object.values(days);

  // Category distribution
  const categoryMap: { [key: string]: number } = {};
  products.forEach((p) => {
    const catName = p.category?.name || "Без категории";
    categoryMap[catName] = (categoryMap[catName] || 0) + 1;
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
          Бизнес-аналитика и отчеты
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Комплексный анализ продаж, рентабельности и товарной динамики
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 bg-white rounded-xl border border-slate-200 shadow-2xs">
          <span className="text-xs text-slate-500 font-medium">Общая выручка</span>
          <p className="text-2xl font-black text-slate-900 font-mono mt-1">
            {formatUZS(totalRevenue)}
          </p>
          <span className="text-[11px] text-emerald-700 font-semibold mt-1 block">
            Заказов: {orders.length}
          </span>
        </div>

        <div className="p-5 bg-white rounded-xl border border-slate-200 shadow-2xs">
          <span className="text-xs text-slate-500 font-medium">Валовая прибыль</span>
          <p className="text-2xl font-black text-emerald-800 font-mono mt-1">
            {formatUZS(grossProfit)}
          </p>
          <span className="text-[11px] text-slate-500 mt-1 block">
            За вычетом себестоимости закупки
          </span>
        </div>

        <div className="p-5 bg-white rounded-xl border border-slate-200 shadow-2xs">
          <span className="text-xs text-slate-500 font-medium">Торговая маржинальность</span>
          <p className="text-2xl font-black text-emerald-800 font-mono mt-1">
            {grossMargin}%
          </p>
          <span className="text-[11px] text-slate-500 mt-1 block">
            Средняя рентабельность продаж
          </span>
        </div>

        <div className="p-5 bg-white rounded-xl border border-slate-200 shadow-2xs">
          <span className="text-xs text-slate-500 font-medium">Средний чек (AOV)</span>
          <p className="text-2xl font-black text-slate-900 font-mono mt-1">
            {formatUZS(avgCheck)}
          </p>
          <span className="text-[11px] text-slate-500 mt-1 block">
            На 1 завершенный заказ
          </span>
        </div>
      </div>

      {/* Main Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Sales Trend */}
        <Card className="shadow-2xs">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-bold flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-emerald-700" />
              <span>Динамика продаж (7 дней)</span>
            </CardTitle>
            <p className="text-xs text-slate-500">Посуточный объем реализованной продукции</p>
          </CardHeader>
          <CardContent>
            <SalesChart data={salesChartData} />
          </CardContent>
        </Card>

        {/* Top Products Table */}
        <Card className="shadow-2xs">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-bold flex items-center gap-2">
              <Award className="w-4 h-4 text-emerald-700" />
              <span>Топ товаров по выручке</span>
            </CardTitle>
            <p className="text-xs text-slate-500">Самые доходные товарные позиции компании</p>
          </CardHeader>
          <CardContent className="p-0">
            {topProducts.length === 0 ? (
              <p className="text-xs text-slate-400 p-6 text-center">Нет данных о продажах</p>
            ) : (
              <div className="divide-y divide-slate-100">
                {topProducts.map((p, idx) => (
                  <div key={idx} className="p-3.5 flex items-center justify-between text-xs hover:bg-slate-50">
                    <div className="flex items-center gap-3">
                      <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-800 font-bold flex items-center justify-center text-[11px]">
                        {idx + 1}
                      </div>
                      <div>
                        <p className="font-semibold text-slate-900 line-clamp-1">{p.name}</p>
                        <span className="text-[10px] text-slate-500">Продано: {p.quantity} шт.</span>
                      </div>
                    </div>

                    <span className="font-bold text-slate-900 font-mono">
                      {formatUZS(p.revenue)}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Category Distribution & Inventory Status */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="shadow-2xs">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-bold flex items-center gap-2">
              <PieIcon className="w-4 h-4 text-emerald-700" />
              <span>Структура номенклатуры по категориям</span>
            </CardTitle>
            <p className="text-xs text-slate-500">Распределение товаров на складе</p>
          </CardHeader>
          <CardContent className="space-y-3">
            {Object.entries(categoryMap).map(([category, count]) => {
              const pct = products.length > 0 ? Math.round((count / products.length) * 100) : 0;
              return (
                <div key={category} className="space-y-1 text-xs">
                  <div className="flex justify-between">
                    <span className="font-medium text-slate-800">{category}</span>
                    <span className="text-slate-500">{count} тов. ({pct}%)</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                    <div
                      className="bg-emerald-600 h-2 rounded-full transition-all"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>

        {/* Customer Base Performance */}
        <Card className="shadow-2xs">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-bold flex items-center gap-2">
              <Users className="w-4 h-4 text-emerald-700" />
              <span>Показатели клиентской базы</span>
            </CardTitle>
            <p className="text-xs text-slate-500">Активность контрагентов и дебиторская нагрузка</p>
          </CardHeader>
          <CardContent className="space-y-4 text-xs">
            <div className="p-3 bg-slate-50 rounded-lg flex justify-between items-center">
              <span className="text-slate-600">Всего клиентов в базе:</span>
              <span className="font-bold text-slate-900">{customers.length}</span>
            </div>
            <div className="p-3 bg-amber-50 rounded-lg border border-amber-200/80 flex justify-between items-center text-amber-900">
              <span>Клиентов с открытым долгом:</span>
              <span className="font-bold">{customers.filter((c) => c.currentDebt > 0).length}</span>
            </div>
            <div className="p-3 bg-emerald-50 rounded-lg border border-emerald-200/80 flex justify-between items-center text-emerald-900">
              <span>Клиентов с покупками от 5 млн сум:</span>
              <span className="font-bold">{customers.filter((c) => c.totalSpent >= 5000000).length}</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
