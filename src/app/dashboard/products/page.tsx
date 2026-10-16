import Link from "next/link";
import { requireAuth } from "@/lib/auth/session";
import prisma from "@/lib/db/prisma";
import { formatUZS } from "@/lib/utils/format";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from "@/components/ui/table";
import {
  Package,
  Plus,
  Search,
  AlertTriangle,
  Edit,
  Trash2,
  Tag
} from "lucide-react";
import { ProductsClient } from "./products-client";

export default async function ProductsPage({
  searchParams,
}: {
  searchParams?: { search?: string; categoryId?: string };
}) {
  const session = await requireAuth();

  const search = searchParams?.search || "";
  const categoryId = searchParams?.categoryId || "";

  const [products, categories] = await Promise.all([
    prisma.product.findMany({
      where: {
        businessId: session.businessId,
        ...(categoryId ? { categoryId } : {}),
        ...(search
          ? {
              OR: [
                { name: { contains: search } },
                { sku: { contains: search } },
                { barcode: { contains: search } },
              ],
            }
          : {}),
      },
      include: {
        category: true,
      },
      orderBy: { createdAt: "desc" },
    }),
    prisma.category.findMany({
      where: { businessId: session.businessId },
    }),
  ]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
            Склад и товары
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Каталог товаров, управление ценами и контроль остатков на складе
          </p>
        </div>

        <Link href="/dashboard/products/new">
          <Button size="sm" className="gap-1.5 bg-emerald-700 hover:bg-emerald-800 shadow-sm">
            <Plus className="w-4 h-4" />
            <span>Добавить товар</span>
          </Button>
        </Link>
      </div>

      <ProductsClient
        initialProducts={products}
        categories={categories}
        userRole={session.role}
      />
    </div>
  );
}
