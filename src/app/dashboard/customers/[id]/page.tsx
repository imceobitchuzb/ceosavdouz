import { notFound } from "next/navigation";
import { requireAuth } from "@/lib/auth/session";
import prisma from "@/lib/db/prisma";
import { CustomerProfileClient } from "./customer-profile-client";

export default async function CustomerDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const session = await requireAuth();

  const customer = await prisma.customer.findFirst({
    where: {
      id: params.id,
      businessId: session.businessId,
    },
    include: {
      orders: {
        orderBy: { createdAt: "desc" },
        include: { items: true },
      },
      payments: {
        orderBy: { createdAt: "desc" },
      },
    },
  });

  if (!customer) {
    notFound();
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <CustomerProfileClient customer={customer} />
    </div>
  );
}
