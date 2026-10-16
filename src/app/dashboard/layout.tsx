import { redirect } from "next/navigation";
import { getServerSession } from "@/lib/auth/session";
import prisma from "@/lib/db/prisma";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";

export const metadata = {
  title: "Панель управления — CEOSAVDOUZ",
};

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession();

  if (!session) {
    redirect("/login");
  }

  // Count unread notifications for this business
  let unreadCount = 0;
  try {
    unreadCount = await prisma.notification.count({
      where: {
        businessId: session.businessId,
        isRead: false,
      },
    });
  } catch (e) {
    console.error("Error fetching unread notifications count:", e);
  }

  return (
    <DashboardShell session={session} unreadCount={unreadCount}>
      {children}
    </DashboardShell>
  );
}
