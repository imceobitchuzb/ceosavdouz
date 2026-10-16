import { requireAuth } from "@/lib/auth/session";
import prisma from "@/lib/db/prisma";
import { TeamClient } from "./team-client";

export default async function TeamPage() {
  const session = await requireAuth();

  const members = await prisma.businessMember.findMany({
    where: { businessId: session.businessId },
    include: {
      user: {
        select: { id: true, name: true, email: true, phone: true, createdAt: true },
      },
    },
    orderBy: { createdAt: "asc" },
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
          Сотрудники и разграничение прав
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Управление доступом персонала: Владелец, Администратор, Менеджер продаж, Кассир
        </p>
      </div>

      <TeamClient initialMembers={members} currentUserRole={session.role} />
    </div>
  );
}
