import Link from "next/link";
import {
  ArrowRight,
  TrendingUp,
  Package,
  Users,
  CreditCard,
  ShieldCheck,
  CheckCircle2,
  ChevronRight,
  Clock,
  Sparkles,
  BarChart3,
  Smartphone,
  Layers,
  HelpCircle
} from "lucide-react";
import { Navbar } from "@/components/public/navbar";
import { Footer } from "@/components/public/footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      <main className="flex-1">
        {/* HERO SECTION */}
        <section className="relative overflow-hidden pt-12 pb-20 lg:pt-20 lg:pb-28 border-b border-slate-200/70 bg-gradient-to-b from-white via-[#faf9f6] to-[#f4f2ec]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto space-y-6">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold shadow-2xs">
                <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                <span>Создано специально для предпринимателей Узбекистана</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 leading-[1.12]">
                Единая система управления торговлей и финансами в{" "}
                <span className="text-emerald-700 underline decoration-emerald-200 underline-offset-8">
                  Узбекистане
                </span>
              </h1>

              <p className="text-lg sm:text-xl text-slate-600 leading-relaxed max-w-2xl mx-auto">
                Замените разрозненные блокноты и сложные таблицы одной понятной платформой: продажи, складские остатки, дебиторская задолженность клиентов и чистая прибыль в сумах (UZS).
              </p>

              <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3.5">
                <Link href="/register" className="w-full sm:w-auto">
                  <Button size="lg" className="w-full sm:w-auto gap-2 text-base px-7 shadow-md">
                    <span>Открыть бесплатный демо-доступ</span>
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </Link>
                <Link href="/dashboard" className="w-full sm:w-auto">
                  <Button variant="outline" size="lg" className="w-full sm:w-auto text-base text-slate-800">
                    <span>Посмотреть демо-кабинет</span>
                  </Button>
                </Link>
              </div>

              <div className="pt-4 flex items-center justify-center gap-6 text-xs text-slate-500 font-medium">
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Без кредитных карт</span>
                </span>
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Валюта: UZS</span>
                </span>
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Интерфейс на русском + готовность к узбекскому</span>
                </span>
              </div>
            </div>

            {/* DASHBOARD PREVIEW MOCKUP */}
            <div className="mt-14 relative max-w-5xl mx-auto rounded-xl border border-slate-200/90 bg-white p-2.5 sm:p-4 shadow-xl">
              <div className="rounded-lg border border-slate-100 overflow-hidden bg-slate-50">
                {/* Mock header */}
                <div className="h-10 bg-slate-900 flex items-center justify-between px-4 text-slate-300 text-xs">
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full bg-rose-500" />
                    <div className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                    <div className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                    <span className="ml-2 font-mono text-slate-400">app.ceosavdouz.uz/dashboard</span>
                  </div>
                  <div className="text-[11px] text-emerald-400 font-mono">
                    Silk Road Trading OOO · Онлайн
                  </div>
                </div>

                {/* Dashboard layout snippet preview */}
                <div className="p-4 sm:p-6 bg-[#faf9f6] grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="p-4 bg-white rounded-lg border border-slate-200 shadow-2xs">
                    <span className="text-xs text-slate-500 font-medium">Выручка за месяц</span>
                    <p className="text-xl font-bold text-slate-900 mt-1">42 850 000 сум</p>
                    <span className="text-[11px] text-emerald-700 font-semibold mt-1 inline-flex items-center gap-0.5">
                      +14.2% к прошлому месяцу
                    </span>
                  </div>
                  <div className="p-4 bg-white rounded-lg border border-slate-200 shadow-2xs">
                    <span className="text-xs text-slate-500 font-medium">Заказов оформлено</span>
                    <p className="text-xl font-bold text-slate-900 mt-1">128 заказов</p>
                    <span className="text-[11px] text-slate-600 mt-1 inline-flex items-center gap-0.5">
                      Средний чек: 334 700 сум
                    </span>
                  </div>
                  <div className="p-4 bg-white rounded-lg border border-slate-200 shadow-2xs">
                    <span className="text-xs text-slate-500 font-medium">Дебиторский долг клиентов</span>
                    <p className="text-xl font-bold text-amber-700 mt-1">5 700 000 сум</p>
                    <span className="text-[11px] text-amber-800 font-semibold mt-1 inline-flex items-center gap-0.5">
                      2 клиента с задержкой
                    </span>
                  </div>
                  <div className="p-4 bg-white rounded-lg border border-slate-200 shadow-2xs">
                    <span className="text-xs text-slate-500 font-medium">Критический остаток</span>
                    <p className="text-xl font-bold text-rose-700 mt-1">2 товара</p>
                    <span className="text-[11px] text-rose-800 font-semibold mt-1 inline-flex items-center gap-0.5">
                      Требуется закупка
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* TARGET BUSINESSES SECTION */}
        <section className="py-16 bg-white border-b border-slate-200/80">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-12">
              <h2 className="text-xs font-bold text-emerald-700 uppercase tracking-widest mb-2">
                Для кого создан CEOSAVDOUZ
              </h2>
              <p className="text-2xl sm:text-3xl font-extrabold text-slate-900">
                Создан под реалии торговли в Узбекистане
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-6 rounded-xl border border-slate-200 bg-[#faf9f6] space-y-3">
                <div className="w-10 h-10 rounded-lg bg-emerald-100 flex items-center justify-center text-emerald-800">
                  <Smartphone className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-slate-900">Продавцы в Instagram и Telegram</h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Быстрое оформление заказов, учет отправок курьерами по Ташкенту и вилоятам через почтовые службы BTS и Fargo.
                </p>
              </div>

              <div className="p-6 rounded-xl border border-slate-200 bg-[#faf9f6] space-y-3">
                <div className="w-10 h-10 rounded-lg bg-emerald-100 flex items-center justify-center text-emerald-800">
                  <Package className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-slate-900">Магазины розничной торговли</h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Контроль склада, штрихкодов, цен закупки и реализации. Автоматические уведомления о заканчивающихся товарах.
                </p>
              </div>

              <div className="p-6 rounded-xl border border-slate-200 bg-[#faf9f6] space-y-3">
                <div className="w-10 h-10 rounded-lg bg-emerald-100 flex items-center justify-center text-emerald-800">
                  <TrendingUp className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-slate-900">Оптовики и дистрибьюторы</h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Учет отсрочек платежей (насия), фиксация частичных оплат и прозрачная история взаиморасчетов с каждым контрагентом.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CORE CAPABILITIES (FEATURES OVERVIEW) */}
        <section className="py-20 bg-[#faf9f6] border-b border-slate-200/80">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
              <Badge variant="outline" className="border-emerald-200 text-emerald-800 bg-emerald-50">
                Полный функционал
              </Badge>
              <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
                Все ключевые процессы в единой системе
              </h2>
              <p className="text-slate-600 text-base">
                Никаких разрозненных программ. Управляйте бизнесом со смартфона или рабочего ноутбука.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <div className="p-6 rounded-xl bg-white border border-slate-200 shadow-2xs space-y-3">
                <div className="w-10 h-10 rounded-lg bg-emerald-700 text-white flex items-center justify-center">
                  <Package className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-bold text-slate-900">Учет товаров и склада</h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Каталог с артикулами (SKU), категориями, себестоимостью и маржой. Контроль остатков и защита от пересортицы.
                </p>
                <Link href="/features" className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-700 hover:underline pt-2">
                  <span>Подробнее</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              <div className="p-6 rounded-xl bg-white border border-slate-200 shadow-2xs space-y-3">
                <div className="w-10 h-10 rounded-lg bg-emerald-700 text-white flex items-center justify-center">
                  <CreditCard className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-bold text-slate-900">Управление заказами</h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Удобное оформление заказов, учет статусов (новый, в обработке, завершен), расчет скидок и списание товаров со склада.
                </p>
                <Link href="/features" className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-700 hover:underline pt-2">
                  <span>Подробнее</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              <div className="p-6 rounded-xl bg-white border border-slate-200 shadow-2xs space-y-3">
                <div className="w-10 h-10 rounded-lg bg-emerald-700 text-white flex items-center justify-center">
                  <Users className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-bold text-slate-900">Клиенты и контроль долгов</h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Полная база клиентов с номерами телефонов Узбекистана (+998), учет долговых остатков и история всех платежей.
                </p>
                <Link href="/features" className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-700 hover:underline pt-2">
                  <span>Подробнее</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              <div className="p-6 rounded-xl bg-white border border-slate-200 shadow-2xs space-y-3">
                <div className="w-10 h-10 rounded-lg bg-emerald-700 text-white flex items-center justify-center">
                  <BarChart3 className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-bold text-slate-900">Доходы, расходы и прибыль</h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Учет аренды, зарплат, логистики и маркетинга. Четкое разделение выручки и реальной чистой прибыли без задвоения.
                </p>
                <Link href="/features" className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-700 hover:underline pt-2">
                  <span>Подробнее</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              <div className="p-6 rounded-xl bg-white border border-slate-200 shadow-2xs space-y-3">
                <div className="w-10 h-10 rounded-lg bg-emerald-700 text-white flex items-center justify-center">
                  <Layers className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-bold text-slate-900">Команда и разграничение прав</h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Роли: Владелец, Администратор, Менеджер, Кассир. Кассир не видит общую финансовую аналитику и себестоимость.
                </p>
                <Link href="/features" className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-700 hover:underline pt-2">
                  <span>Подробнее</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              <div className="p-6 rounded-xl bg-white border border-slate-200 shadow-2xs space-y-3">
                <div className="w-10 h-10 rounded-lg bg-emerald-700 text-white flex items-center justify-center">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-bold text-slate-900">Изоляция данных и безопасность</h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Строгая мультиарендная архитектура: данные вашего бизнеса изолированы и защищены современными криптографическими стандартами.
                </p>
                <Link href="/features" className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-700 hover:underline pt-2">
                  <span>Подробнее</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* HOW IT WORKS */}
        <section className="py-20 bg-white border-b border-slate-200/80">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-16 space-y-2">
              <h2 className="text-xs font-bold text-emerald-700 uppercase tracking-widest">
                Быстрый старт
              </h2>
              <p className="text-3xl font-extrabold text-slate-900">
                Запуск за 3 простых шага
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
              <div className="p-6 rounded-xl bg-[#faf9f6] border border-slate-200 text-center space-y-3">
                <div className="w-12 h-12 rounded-full bg-emerald-700 text-white text-lg font-bold flex items-center justify-center mx-auto shadow-sm">
                  1
                </div>
                <h3 className="text-base font-bold text-slate-900">Регистрация компании</h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Укажите название вашего бизнеса, телефон и создайте аккаунт владельца за 60 секунд.
                </p>
              </div>

              <div className="p-6 rounded-xl bg-[#faf9f6] border border-slate-200 text-center space-y-3">
                <div className="w-12 h-12 rounded-full bg-emerald-700 text-white text-lg font-bold flex items-center justify-center mx-auto shadow-sm">
                  2
                </div>
                <h3 className="text-base font-bold text-slate-900">Добавление товаров</h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Внесите основные товары с ценами продажи и остатками на складе.
                </p>
              </div>

              <div className="p-6 rounded-xl bg-[#faf9f6] border border-slate-200 text-center space-y-3">
                <div className="w-12 h-12 rounded-full bg-emerald-700 text-white text-lg font-bold flex items-center justify-center mx-auto shadow-sm">
                  3
                </div>
                <h3 className="text-base font-bold text-slate-900">Оформление первых продаж</h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Пробивайте заказы, ведите расчеты с клиентами и отслеживайте финансовый результат в реальном времени.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* PRICING PREVIEW */}
        <section className="py-20 bg-[#faf9f6] border-b border-slate-200/80">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
              <Badge variant="outline" className="border-emerald-200 text-emerald-800 bg-emerald-50">
                Честные тарифы в сумах
              </Badge>
              <h2 className="text-3xl font-extrabold text-slate-900">
                Прозрачные условия без скрытых платежей
              </h2>
              <p className="text-slate-600 text-base">
                Начните бесплатно в течение 14 дней. Никаких привязок карт.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              {/* Plan 1 */}
              <div className="rounded-xl border border-slate-200 bg-white p-7 space-y-6 flex flex-col justify-between shadow-2xs">
                <div>
                  <h3 className="text-lg font-bold text-slate-900">Старт</h3>
                  <p className="text-xs text-slate-500 mt-1">Для начинающих продавцов и Telegram-магазинов</p>
                  <div className="mt-4">
                    <span className="text-3xl font-extrabold text-slate-900">190 000</span>
                    <span className="text-xs text-slate-500 font-medium"> сум / месяц</span>
                  </div>
                  <ul className="mt-6 space-y-2.5 text-xs text-slate-600">
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>До 500 активных товаров</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>До 2 пользователей</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>Учет заказов и клиентов</span>
                    </li>
                  </ul>
                </div>
                <Link href="/register">
                  <Button variant="outline" className="w-full">Выбрать тариф</Button>
                </Link>
              </div>

              {/* Plan 2: Featured */}
              <div className="rounded-xl border-2 border-emerald-600 bg-white p-7 space-y-6 flex flex-col justify-between shadow-lg relative">
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="bg-emerald-700 text-white text-[11px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                    Популярный выбор
                  </span>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900">Бизнес</h3>
                  <p className="text-xs text-slate-500 mt-1">Для растущих магазинов и оптовых складов</p>
                  <div className="mt-4">
                    <span className="text-3xl font-extrabold text-emerald-700">390 000</span>
                    <span className="text-xs text-slate-500 font-medium"> сум / месяц</span>
                  </div>
                  <ul className="mt-6 space-y-2.5 text-xs text-slate-600">
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>Неограниченное число товаров</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>До 7 пользователей и ролей</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>Учет долгов и насия (дебиторка)</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>Финансовая аналитика и отчеты</span>
                    </li>
                  </ul>
                </div>
                <Link href="/register">
                  <Button className="w-full shadow-md">Попробовать 14 дней бесплатно</Button>
                </Link>
              </div>

              {/* Plan 3 */}
              <div className="rounded-xl border border-slate-200 bg-white p-7 space-y-6 flex flex-col justify-between shadow-2xs">
                <div>
                  <h3 className="text-lg font-bold text-slate-900">Корпоративный</h3>
                  <p className="text-xs text-slate-500 mt-1">Для сетей магазинов и крупных дистрибьюторов</p>
                  <div className="mt-4">
                    <span className="text-3xl font-extrabold text-slate-900">790 000</span>
                    <span className="text-xs text-slate-500 font-medium"> сум / месяц</span>
                  </div>
                  <ul className="mt-6 space-y-2.5 text-xs text-slate-600">
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>Неограниченные пользователи</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>Приоритетная техподдержка</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>API для интеграции</span>
                    </li>
                  </ul>
                </div>
                <Link href="/contact">
                  <Button variant="outline" className="w-full">Связаться с отделом продаж</Button>
                </Link>
              </div>
            </div>

            <div className="text-center mt-10">
              <Link href="/pricing" className="text-sm font-semibold text-emerald-700 hover:underline inline-flex items-center gap-1">
                <span>Подробная сравнительная таблица тарифов</span>
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </section>

        {/* FAQ SECTION */}
        <section className="py-20 bg-white border-b border-slate-200/80">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-14 space-y-2">
              <h2 className="text-xs font-bold text-emerald-700 uppercase tracking-widest">
                Часто задаваемые вопросы
              </h2>
              <p className="text-3xl font-extrabold text-slate-900">
                Ответы на главные вопросы
              </p>
            </div>

            <div className="space-y-4">
              <div className="p-5 rounded-lg border border-slate-200 bg-[#faf9f6]">
                <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                  <HelpCircle className="w-4 h-4 text-emerald-700" />
                  <span>В какой валюте производятся все расчеты?</span>
                </h4>
                <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                  Все цены, себестоимость, платежи и финансовые отчеты ведутся в национальной валюте Узбекистана — узбекских сумах (UZS).
                </p>
              </div>

              <div className="p-5 rounded-lg border border-slate-200 bg-[#faf9f6]">
                <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                  <HelpCircle className="w-4 h-4 text-emerald-700" />
                  <span>Можно ли вести учет клиентов с долгами (насия)?</span>
                </h4>
                <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                  Да, система позволяет оформлять заказы с частичной оплатой или в рассрочку/долг. Баланс задолженности каждого клиента фиксируется автоматически, с возможностью внесения частичных платежей.
                </p>
              </div>

              <div className="p-5 rounded-lg border border-slate-200 bg-[#faf9f6]">
                <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                  <HelpCircle className="w-4 h-4 text-emerald-700" />
                  <span>Работает ли система на мобильных телефонах?</span>
                </h4>
                <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                  Да, весь интерфейс полностью адаптивен и оптимизирован для работы со смартфонов, планшетов и настольных компьютеров без необходимости установки громоздких программ.
                </p>
              </div>

              <div className="p-5 rounded-lg border border-slate-200 bg-[#faf9f6]">
                <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                  <HelpCircle className="w-4 h-4 text-emerald-700" />
                  <span>Планируется ли интеграция с Telegram-ботом?</span>
                </h4>
                <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                  Да, в системе уже заложена серверная архитектура для взаимодействия с Telegram-ботом на базе Python aiogram. Уведомления о заказах и остатках будут приходить прямо в рабочий чат.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* FINAL CALL TO ACTION */}
        <section className="py-20 bg-emerald-900 text-white relative overflow-hidden">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6 relative z-10">
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
              Готовы навести порядок в продажах и финансах?
            </h2>
            <p className="text-base sm:text-lg text-emerald-100 max-w-2xl mx-auto leading-relaxed">
              Присоединяйтесь к растущим торговым предприятиям Узбекистана. Начните использовать CEOSAVDOUZ прямо сейчас.
            </p>
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/register">
                <Button size="lg" className="bg-white text-emerald-900 hover:bg-emerald-50 text-base px-8 font-semibold shadow-lg">
                  Зарегистрировать бизнес
                </Button>
              </Link>
              <Link href="/dashboard">
                <Button variant="outline" size="lg" className="border-emerald-700 bg-emerald-800/60 text-white hover:bg-emerald-800 text-base">
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
