import { requireAuth } from "@/lib/auth/session";
import prisma from "@/lib/db/prisma";
import { NotificationsClient } from "./notifications-client";

export default async function NotificationsPage() {
  const session = await requireAuth();

  const notifications = await prisma.notification.findMany({
    where: { businessId: session.businessId },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
          Центр уведомлений
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Оповещения об остатках, новых заказах, платежах и системных событиях
        </p>
      </div>

      <NotificationsClient initialNotifications={notifications} />
    </div>
  );
}
