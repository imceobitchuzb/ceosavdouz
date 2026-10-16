import { Navbar } from "@/components/public/navbar";
import { Footer } from "@/components/public/footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import {
  Package,
  ShoppingCart,
  Users,
  CreditCard,
  PieChart,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  TrendingUp,
  Boxes,
  BellRing,
  Smartphone
} from "lucide-react";

export default function FeaturesPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      <main className="flex-1">
        {/* Header */}
        <section className="py-16 bg-gradient-to-b from-white to-[#faf9f6] border-b border-slate-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
            <Badge variant="outline" className="border-emerald-200 text-emerald-800 bg-emerald-50">
              Функциональные модули
            </Badge>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight">
              Все инструменты для роста вашего бизнеса
            </h1>
            <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto">
              Разработано специально для торговли, дистрибуции и услуг в Узбекистане с расчетами в сумах (UZS).
            </p>
          </div>
        </section>

        {/* Deep Dive Modules */}
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-24">
            {/* Feature 1: Inventory */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div className="space-y-5">
                <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center">
                  <Package className="w-6 h-6" />
                </div>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
                  Умный склад и товарная номенклатура
                </h2>
                <p className="text-slate-600 leading-relaxed text-sm sm:text-base">
                  Контролируйте фактические остатки товаров в реальном времени. Система автоматически отслеживает порог критического минимума и предотвращает ситуации «нет на складе».
                </p>
                <ul className="space-y-2.5 text-sm text-slate-700">
                  <li className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Учет себестоимости и рекомендуемой цены продажи</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Поддержка единиц измерения: штуки, метры, килограммы, пачки</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Уведомления о товарах на исходе</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Быстрый поиск по названию, артикулу (SKU) и штрихкоду</span>
                  </li>
                </ul>
              </div>
              <div className="p-6 rounded-2xl bg-[#faf9f6] border border-slate-200 shadow-sm space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                  <span className="font-bold text-sm text-slate-900">Каталог товаров (Склад)</span>
                  <Badge variant="success">8 наименований в демо</Badge>
                </div>
                <div className="space-y-3 text-xs">
                  <div className="p-3 bg-white rounded-lg border border-slate-200 flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-slate-900">Смартфон Artel U5 128GB</p>
                      <p className="text-slate-500">Закупка: 1 450 000 сум · Продажа: 1 950 000 сум</p>
                    </div>
                    <Badge variant="outline" className="text-emerald-700 border-emerald-200">В наличии: 14 шт</Badge>
                  </div>
                  <div className="p-3 bg-white rounded-lg border border-slate-200 flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-slate-900">Белье сатиновое &apos;Bukhara Gold&apos;</p>
                      <p className="text-slate-500">Закупка: 280 000 сум · Продажа: 490 000 сум</p>
                    </div>
                    <Badge variant="destructive">Мало: 3 шт (Мин: 6)</Badge>
                  </div>
                </div>
              </div>
            </div>

            {/* Feature 2: Orders & POS */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div className="p-6 rounded-2xl bg-[#faf9f6] border border-slate-200 shadow-sm space-y-4 order-2 lg:order-1">
                <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                  <span className="font-bold text-sm text-slate-900">Оформление заказа ORD-1002</span>
                  <Badge variant="info">В обработке</Badge>
                </div>
                <div className="p-4 bg-white rounded-lg border border-slate-200 text-xs space-y-2">
                  <div className="flex justify-between text-slate-600">
                    <span>Клиент:</span>
                    <span className="font-medium text-slate-900">ООО &apos;Оазис Дистрибьюшн&apos;</span>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span>Сумма позиций:</span>
                    <span className="font-medium text-slate-900">10 000 000 сум</span>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span>Скидка постоянного партнера:</span>
                    <span className="text-emerald-700 font-medium">-500 000 сум</span>
                  </div>
                  <div className="flex justify-between pt-2 border-t border-slate-100 text-sm font-bold text-slate-900">
                    <span>Итого к оплате:</span>
                    <span>9 500 000 сум</span>
                  </div>
                  <div className="pt-2 flex justify-between text-amber-700 font-semibold">
                    <span>Долг по заказу:</span>
                    <span>4 500 000 сум (Насия)</span>
                  </div>
                </div>
              </div>

              <div className="space-y-5 order-1 lg:order-2">
                <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center">
                  <ShoppingCart className="w-6 h-6" />
                </div>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
                  Управление заказами и продажами
                </h2>
                <p className="text-slate-600 leading-relaxed text-sm sm:text-base">
                  Оформляйте заказы за считанные секунды с любого устройства: на кассе магазина, при приеме заказов через Instagram Direct или при оптовых поставках.
                </p>
                <ul className="space-y-2.5 text-sm text-slate-700">
                  <li className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Мгновенный выбор товаров и автоматический подсчет сумм</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Фиксация скидок и статусов оплаты (Оплачен, Частично, Не оплачен)</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Автоматическое списание проданных позиций со склада</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Защита от ошибочного увеличения выручки при отмене заказа</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Feature 3: Customers & Debt */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div className="space-y-5">
                <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center">
                  <Users className="w-6 h-6" />
                </div>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
                  Клиентская база и контроль долгов (Насия)
                </h2>
                <p className="text-slate-600 leading-relaxed text-sm sm:text-base">
                  Торговля под реализацию и отсрочка платежа — распространенная практика в Узбекистане. CEOSAVDOUZ ведет строгий учет каждого сума дебиторской задолженности.
                </p>
                <ul className="space-y-2.5 text-sm text-slate-700">
                  <li className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Профиль клиента с номерами +998, адресом и персональными заметками</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>История всех покупок и оплат в хронологическом порядке</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Внесение частичных оплат с автоматическим пересчетом остатка долга</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Валидация сумм, исключающая отрицательные балансы</span>
                  </li>
                </ul>
              </div>
              <div className="p-6 rounded-2xl bg-[#faf9f6] border border-slate-200 shadow-sm space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                  <span className="font-bold text-sm text-slate-900">Карточка клиента</span>
                  <Badge variant="warning">Долг: 4 500 000 сум</Badge>
                </div>
                <div className="p-4 bg-white rounded-lg border border-slate-200 text-xs space-y-2">
                  <p className="font-bold text-sm text-slate-900">ООО &apos;Оазис Дистрибьюшн&apos;</p>
                  <p className="text-slate-500 font-mono">+998 (71) 200-11-22 · Ташкент, Мирабадский р-н</p>
                  <div className="grid grid-cols-2 gap-2 pt-2">
                    <div className="p-2 bg-slate-50 rounded">
                      <span className="text-[10px] text-slate-500">Всего покупок</span>
                      <p className="font-bold text-slate-900">18 450 000 сум</p>
                    </div>
                    <div className="p-2 bg-amber-50 rounded border border-amber-200">
                      <span className="text-[10px] text-amber-800">Текущий долг</span>
                      <p className="font-bold text-amber-900">4 500 000 сум</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-16 bg-slate-900 text-white text-center">
          <div className="max-w-4xl mx-auto px-4 space-y-6">
            <h2 className="text-3xl font-extrabold">Убедитесь в возможностях на реальных данных</h2>
            <p className="text-slate-400 max-w-xl mx-auto text-sm">
              Войдите в демо-панель управления без регистрации или создайте аккаунт вашей компании.
            </p>
            <div className="flex justify-center gap-4">
              <Link href="/register">
                <Button size="lg" className="bg-emerald-600 hover:bg-emerald-700 text-white">
                  Создать компанию
                </Button>
              </Link>
              <Link href="/dashboard">
                <Button variant="outline" size="lg" className="border-slate-700 text-slate-200 hover:bg-slate-800">
                  Открыть демо-панель
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
