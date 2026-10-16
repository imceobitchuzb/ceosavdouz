import { Navbar } from "@/components/public/navbar";
import { Footer } from "@/components/public/footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { Check, X, HelpCircle, ShieldCheck } from "lucide-react";

export default function PricingPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      <main className="flex-1">
        {/* Header */}
        <section className="py-16 bg-gradient-to-b from-white to-[#faf9f6] border-b border-slate-200 text-center">
          <div className="max-w-5xl mx-auto px-4 space-y-4">
            <Badge variant="outline" className="border-emerald-200 text-emerald-800 bg-emerald-50">
              Тарифные планы для Узбекистана
            </Badge>
            <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight">
              Инвестируйте в порядок и рост прибыли
            </h1>
            <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto">
              Фиксированная стоимость в узбекских сумах (UZS). 14 дней полного бесплатного доступа для каждого нового бизнеса.
            </p>
          </div>
        </section>

        {/* Pricing Cards */}
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Plan 1 */}
              <div className="rounded-2xl border border-slate-200 bg-[#faf9f6] p-8 flex flex-col justify-between">
                <div>
                  <h3 className="text-xl font-bold text-slate-900">Старт</h3>
                  <p className="text-xs text-slate-500 mt-1">Идеально для индивидуальных предпринимателей и Telegram-магазинов</p>
                  <div className="my-6">
                    <span className="text-4xl font-extrabold text-slate-900">190 000</span>
                    <span className="text-sm text-slate-500 font-medium"> сум / мес</span>
                  </div>
                  <ul className="space-y-3 text-xs text-slate-700">
                    <li className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-emerald-600" />
                      <span>До 500 активных товаров</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-emerald-600" />
                      <span>До 2 пользователей (Кассир + Владелец)</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-emerald-600" />
                      <span>Оформление заказов и базовый склад</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-emerald-600" />
                      <span>База клиентов и история покупок</span>
                    </li>
                    <li className="flex items-center gap-2 text-slate-400">
                      <X className="w-4 h-4 text-slate-300" />
                      <span>Учет дебиторской задолженности (Насия)</span>
                    </li>
                    <li className="flex items-center gap-2 text-slate-400">
                      <X className="w-4 h-4 text-slate-300" />
                      <span>Раздельный учет расходов и чистой прибыли</span>
                    </li>
                  </ul>
                </div>
                <Link href="/register" className="mt-8">
                  <Button variant="outline" className="w-full">Начать 14 дней бесплатно</Button>
                </Link>
              </div>

              {/* Plan 2: Featured */}
              <div className="rounded-2xl border-2 border-emerald-600 bg-white p-8 flex flex-col justify-between shadow-xl relative">
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="bg-emerald-700 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                    Рекомендуемый выбор
                  </span>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-900">Бизнес</h3>
                  <p className="text-xs text-slate-500 mt-1">Для полноценных магазинов, оптовых баз и сервисных компаний</p>
                  <div className="my-6">
                    <span className="text-4xl font-extrabold text-emerald-700">390 000</span>
                    <span className="text-sm text-slate-500 font-medium"> сум / мес</span>
                  </div>
                  <ul className="space-y-3 text-xs text-slate-700">
                    <li className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-emerald-600" />
                      <span className="font-semibold text-slate-900">Неограниченное число товаров</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-emerald-600" />
                      <span>До 7 сотрудников с ролями (Владелец, Менеджер, Кассир)</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-emerald-600" />
                      <span className="font-semibold text-emerald-800">Контроль долгов клиентов (Насия) и график оплат</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-emerald-600" />
                      <span>Финансовый учет: Доходы, Расходы, Чистая прибыль</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-emerald-600" />
                      <span>Аналитика продаж и графики выручки</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-emerald-600" />
                      <span>Поддержка оповещений о критическом остатке</span>
                    </li>
                  </ul>
                </div>
                <Link href="/register" className="mt-8">
                  <Button className="w-full bg-emerald-700 hover:bg-emerald-800 shadow-md">
                    Попробовать 14 дней бесплатно
                  </Button>
                </Link>
              </div>

              {/* Plan 3 */}
              <div className="rounded-2xl border border-slate-200 bg-[#faf9f6] p-8 flex flex-col justify-between">
                <div>
                  <h3 className="text-xl font-bold text-slate-900">Корпоративный</h3>
                  <p className="text-xs text-slate-500 mt-1">Для торговых сетей, дистрибьюторских центров и филиалов</p>
                  <div className="my-6">
                    <span className="text-4xl font-extrabold text-slate-900">790 000</span>
                    <span className="text-sm text-slate-500 font-medium"> сум / мес</span>
                  </div>
                  <ul className="space-y-3 text-xs text-slate-700">
                    <li className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-emerald-600" />
                      <span>Неограниченное количество пользователей</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-emerald-600" />
                      <span>Мульти-склад и учет филиалов</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-emerald-600" />
                      <span>Выделенный менеджер техподдержки</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-emerald-600" />
                      <span>API для интеграции с внешними системами</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-emerald-600" />
                      <span>Обучение команды и персональный онбординг</span>
                    </li>
                  </ul>
                </div>
                <Link href="/contact" className="mt-8">
                  <Button variant="outline" className="w-full">Запросить индивидуальный тариф</Button>
                </Link>
              </div>
            </div>

            {/* Security note */}
            <div className="mt-12 p-4 rounded-xl bg-emerald-50/70 border border-emerald-200 text-xs text-emerald-900 flex items-center justify-center gap-2 max-w-2xl mx-auto text-center">
              <ShieldCheck className="w-4 h-4 text-emerald-700 shrink-0" />
              <span>Оплата производится по безналичному расчету или через корпоративные карты (Uzcard / Humo) с предоставлением закрывающих документов (ЭСФ).</span>
            </div>
          </div>
        </section>

        {/* Pricing FAQ */}
        <section className="py-16 bg-[#faf9f6] border-t border-slate-200">
          <div className="max-w-4xl mx-auto px-4 space-y-6">
            <h2 className="text-2xl font-bold text-slate-900 text-center">
              Вопросы по оплате и тарифам
            </h2>
            <div className="space-y-4 text-xs">
              <div className="p-4 bg-white rounded-lg border border-slate-200">
                <p className="font-bold text-slate-900 mb-1">Нужно ли вводить данные карты при регистрации?</p>
                <p className="text-slate-600">Нет. Пробный 14-дневный период активируется мгновенно без ввода платежных данных.</p>
              </div>
              <div className="p-4 bg-white rounded-lg border border-slate-200">
                <p className="font-bold text-slate-900 mb-1">Что происходит по истечении 14 дней?</p>
                <p className="text-slate-600">Все ваши данные сохраняются в безопасности. Вы сможете выбрать подходящий тариф или продолжить использовать систему после активации подписки.</p>
              </div>
              <div className="p-4 bg-white rounded-lg border border-slate-200">
                <p className="font-bold text-slate-900 mb-1">Предоставляются ли электронные счет-фактуры (ЭСФ)?</p>
                <p className="text-slate-600">Да, для юридических лиц Узбекистана мы оформляем официальный договор и отправляем ЭСФ через системы Didox / Soliq.</p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
