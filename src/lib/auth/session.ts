import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { COOKIE_NAME, verifySessionToken, type SessionPayload } from "./jwt";
import prisma from "@/lib/db/prisma";

export async function getServerSession(): Promise<SessionPayload | null> {
  const cookieStore = cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;

  if (!token) return null;

  const payload = await verifySessionToken(token);
  if (!payload || !payload.userId || !payload.businessId) return null;

  // Strict tenant verification: confirm membership in the database
  try {
    const membership = await prisma.businessMember.findUnique({
      where: {
        userId_businessId: {
          userId: payload.userId,
          businessId: payload.businessId,
        },
      },
      include: {
        business: true,
        user: true,
      },
    });

    if (!membership) return null;

    return {
      userId: membership.userId,
      email: membership.user.email,
      name: membership.user.name,
      businessId: membership.businessId,
      businessName: membership.business.name,
      role: membership.role,
    };
  } catch (err) {
    console.error("Error validating session membership:", err);
    return null;
  }
}

export async function requireAuth(): Promise<SessionPayload> {
  const session = await getServerSession();
  if (!session) {
    redirect("/login");
  }
  return session;
}

export async function requireRole(allowedRoles: string[]): Promise<SessionPayload> {
  const session = await requireAuth();
  if (!allowedRoles.includes(session.role)) {
    throw new Error("Недостаточно прав для выполнения данной операции");
  }
  return session;
}
