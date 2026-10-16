"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Building2,
  Globe,
  Bot,
  Save,
  CheckCircle2,
  AlertCircle,
  ShieldAlert,
  Code,
  Lock
} from "lucide-react";

interface SettingsClientProps {
  initialBusiness: any;
  userEmail: string;
  userName: string;
  userRole: string;
  telegramStatus: { isConfigured: boolean; botUsername: string | null };
}

export function SettingsClient({
  initialBusiness,
  userEmail,
  userName,
  userRole,
  telegramStatus,
}: SettingsClientProps) {
  const router = useRouter();
  const [activeTab, setActiveTab] = React.useState<"profile" | "locale" | "telegram">("profile");

  const [formData, setFormData] = React.useState({
    name: initialBusiness?.name || "",
    inn: initialBusiness?.inn || "",
    phone: initialBusiness?.phone || "",
    address: initialBusiness?.address || "",
    city: initialBusiness?.city || "Ташкент",
  });

  const [loading, setLoading] = React.useState(false);
  const [success, setSuccess] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const res = await fetch("/api/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Ошибка сохранения настроек");
      }

      setSuccess(true);
      router.refresh();
      setTimeout(() => setSuccess(false), 3000);
    } catch (err: unknown) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Settings Navigation Tabs */}
      <div className="flex border-b border-slate-200 gap-6 text-xs font-bold uppercase tracking-wider">
        <button
          onClick={() => setActiveTab("profile")}
          className={`pb-3 transition-colors border-b-2 flex items-center gap-1.5 ${
            activeTab === "profile"
              ? "border-emerald-700 text-emerald-800"
              : "border-transparent text-slate-500 hover:text-slate-800"
          }`}
        >
          <Building2 className="w-4 h-4" />
          <span>Профиль компании</span>
        </button>

        <button
          onClick={() => setActiveTab("locale")}
          className={`pb-3 transition-colors border-b-2 flex items-center gap-1.5 ${
            activeTab === "locale"
              ? "border-emerald-700 text-emerald-800"
              : "border-transparent text-slate-500 hover:text-slate-800"
          }`}
        >
          <Globe className="w-4 h-4" />
          <span>Локализация и валюта</span>
        </button>

        <button
          onClick={() => setActiveTab("telegram")}
          className={`pb-3 transition-colors border-b-2 flex items-center gap-1.5 ${
            activeTab === "telegram"
              ? "border-emerald-700 text-emerald-800"
              : "border-transparent text-slate-500 hover:text-slate-800"
          }`}
        >
          <Bot className="w-4 h-4" />
          <span>Telegram Бот (Архитектура)</span>
        </button>
      </div>

      {/* Tab 1: Business Profile */}
      {activeTab === "profile" && (
        <Card className="shadow-2xs">
          <CardHeader className="pb-4">
            <CardTitle className="text-base font-bold">
              Юридические реквизиты и контакты
            </CardTitle>
            <p className="text-xs text-slate-500">
              Информация используется в счетах, накладных и карточках контрагентов
            </p>
          </CardHeader>
          <CardContent>
            {error && (
              <div className="mb-4 p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
                <span>{error}</span>
              </div>
            )}

            {success && (
              <div className="mb-4 p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
                <span>Настройки компании успешно сохранены</span>
              </div>
            )}

            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Наименование организации / бренда <span className="text-rose-500">*</span>
                </label>
                <Input
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="text-xs"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    ИНН предприятия (Узбекистан)
                  </label>
                  <Input
                    placeholder="308945123"
                    value={formData.inn}
                    onChange={(e) => setFormData({ ...formData, inn: e.target.value })}
                    className="text-xs font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Рабочий телефон (+998)
                  </label>
                  <Input
                    placeholder="+998 71 234-56-78"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Город / регион
                  </label>
                  <Input
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    className="text-xs"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Фактический адрес офиса / склада
                  </label>
                  <Input
                    placeholder="г. Ташкент, Чиланзарский р-н, ул. Катартал, 28"
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    className="text-xs"
                  />
                </div>
              </div>

              <div className="pt-2 flex justify-end">
                <Button
                  type="submit"
                  disabled={loading}
                  className="gap-1.5 bg-emerald-700 hover:bg-emerald-800 text-xs shadow-sm"
                >
                  <Save className="w-4 h-4" />
                  <span>{loading ? "Сохранение..." : "Сохранить изменения"}</span>
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Tab 2: Localization */}
      {activeTab === "locale" && (
        <Card className="shadow-2xs">
          <CardHeader className="pb-4">
            <CardTitle className="text-base font-bold">
              Параметры регионализации и валюты
            </CardTitle>
            <p className="text-xs text-slate-500">
              Стандарты финансовых расчетов в Республике Узбекистан
            </p>
          </CardHeader>
          <CardContent className="space-y-4 text-xs">
            <div className="p-4 rounded-xl border border-slate-200 bg-[#faf9f6] space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-900">Основная валюта учета</span>
                <Badge variant="outline" className="border-emerald-200 text-emerald-800 bg-emerald-50 font-mono">
                  UZS (Узбекский сум)
                </Badge>
              </div>
              <p className="text-slate-600">
                Все розничные цены, себестоимость, остатки задолженностей и финансовые проводки фиксируются в сумах без дробных тийинов.
              </p>
            </div>

            <div className="p-4 rounded-xl border border-slate-200 bg-[#faf9f6] space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-900">Часовой пояс</span>
                <span className="font-mono text-slate-700 font-semibold">Asia/Tashkent (UTC+5)</span>
              </div>
              <p className="text-slate-600">
                Время фиксации заказов, транзакций и действий аудита приведено к единому локальному времени Ташкента.
              </p>
            </div>

            <div className="p-4 rounded-xl border border-slate-200 bg-[#faf9f6] space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-900">Языковые пакеты</span>
                <span className="text-emerald-700 font-semibold">Русский (Активен) · Узбекский (Латиница, Этап 2)</span>
              </div>
              <p className="text-slate-600">
                Архитектура подготовлена к мультиязычности i18n с переключением локали через верхний селектор.
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Tab 3: Telegram Integration Architecture */}
      {activeTab === "telegram" && (
        <Card className="shadow-2xs">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-base font-bold flex items-center gap-2">
                  <Bot className="w-5 h-5 text-emerald-700" />
                  <span>Архитектура интеграции Telegram-бота</span>
                </CardTitle>
                <p className="text-xs text-slate-500 mt-0.5">
                  Серверный шлюз оповещений для второго этапа разработки
                </p>
              </div>
              <Badge variant={telegramStatus.isConfigured ? "success" : "secondary"}>
                {telegramStatus.isConfigured ? "Подключен" : "Не подключен (Ожидает настройки)"}
              </Badge>
            </div>
          </CardHeader>

          <CardContent className="space-y-5 text-xs">
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
              <h4 className="font-bold text-slate-900">
                Спецификация интеграции (Python 3.11+ / aiogram 3.x)
              </h4>
              <p className="text-slate-600 leading-relaxed">
                Система содержит выделенный абстрактный слой <code className="text-emerald-700 font-mono">TelegramNotificationService</code> в <code className="text-slate-700 font-mono">src/lib/services/telegram-stub.ts</code>. Это предотвращает жесткую сцепку и гарантирует надежность при отсутствии токена.
              </p>
              <ul className="list-disc pl-5 space-y-1 text-slate-600">
                <li>Уведомления о новых заказах (номер, сумма, клиент, состав)</li>
                <li>Оповещения об остатке товаров ниже порогового минимума</li>
                <li>Ежедневная финансовая сводка выручки и чистой прибыли</li>
              </ul>
            </div>

            <div className="space-y-2">
              <span className="font-bold text-slate-900 block">
                Формат события вебхука (JSON Contract):
              </span>
              <pre className="p-4 rounded-xl bg-slate-900 text-slate-100 font-mono text-[11px] overflow-x-auto">
{`{
  "event": "order.created",
  "timestamp": "${new Date().toISOString()}",
  "payload": {
    "orderId": "clv123456789",
    "orderNumber": "ORD-1004",
    "businessName": "${initialBusiness?.name || "Silk Road Trading"}",
    "customerName": "Шерзод Умаров",
    "totalAmount": 1950000,
    "currency": "UZS",
    "itemCount": 2
  }
}`}
              </pre>
            </div>

            <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 space-y-1">
              <span className="font-bold block">Инструкция по подключению в продакшене:</span>
              <p className="text-[11px] leading-relaxed">
                Для активации реальной отправки сообщений создайте бота в Telegram через <strong>@BotFather</strong> и укажите переменные в файле <code>.env</code>:
              </p>
              <div className="pt-1 font-mono text-[10px] text-amber-950">
                <code>TELEGRAM_BOT_TOKEN=&quot;your_token_from_botfather&quot;</code><br />
                <code>TELEGRAM_WEBHOOK_SECRET=&quot;secure_hmac_secret&quot;</code>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
