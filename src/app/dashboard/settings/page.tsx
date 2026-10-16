import { requireAuth } from "@/lib/auth/session";
import prisma from "@/lib/db/prisma";
import { TelegramNotificationService } from "@/lib/services/telegram-stub";
import { SettingsClient } from "./settings-client";

export default async function SettingsPage() {
  const session = await requireAuth();

  const business = await prisma.business.findUnique({
    where: { id: session.businessId },
  });

  const telegramStatus = TelegramNotificationService.getStatus();

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
          Настройки бизнеса
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Реквизиты компании, валютные параметры и подготовка интеграций
        </p>
      </div>

      <SettingsClient
        initialBusiness={business}
        userEmail={session.email}
        userName={session.name}
        userRole={session.role}
        telegramStatus={telegramStatus}
      />
    </div>
  );
}
