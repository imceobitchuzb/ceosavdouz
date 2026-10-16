"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { formatUZS } from "@/lib/utils/format";
import { Input } from "@/components/ui/input";
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
  Search,
  AlertTriangle,
  Edit,
  Trash2,
  Package,
  CheckCircle2,
  Filter
} from "lucide-react";

interface Product {
  id: string;
  name: string;
  sku: string | null;
  barcode: string | null;
  costPrice: number;
  sellingPrice: number;
  stockQuantity: number;
  minStockThreshold: number;
  unit: string;
  category: { id: string; name: string } | null;
}

interface Category {
  id: string;
  name: string;
}

interface ProductsClientProps {
  initialProducts: Product[];
  categories: Category[];
  userRole: string;
}

export function ProductsClient({
  initialProducts,
  categories,
  userRole,
}: ProductsClientProps) {
  const router = useRouter();
  const [search, setSearch] = React.useState("");
  const [selectedCategory, setSelectedCategory] = React.useState<string>("all");
  const [stockFilter, setStockFilter] = React.useState<"all" | "low">("all");
  const [deletingId, setDeletingId] = React.useState<string | null>(null);

  const filteredProducts = initialProducts.filter((product) => {
    // Search match
    const s = search.toLowerCase();
    const matchesSearch =
      !search ||
      product.name.toLowerCase().includes(s) ||
      (product.sku && product.sku.toLowerCase().includes(s)) ||
      (product.barcode && product.barcode.includes(s));

    // Category match
    const matchesCategory =
      selectedCategory === "all" || product.category?.id === selectedCategory;

    // Stock filter match
    const matchesStock =
      stockFilter === "all" || product.stockQuantity <= product.minStockThreshold;

    return matchesSearch && matchesCategory && matchesStock;
  });

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Вы действительно хотите удалить товар «${name}»?`)) return;

    setDeletingId(id);
    try {
      const res = await fetch(`/api/products/${id}`, { method: "DELETE" });
      if (!res.ok) {
        const err = await res.json();
        alert(err.error || "Ошибка удаления");
        return;
      }
      router.refresh();
    } catch {
      alert("Ошибка сетевого соединения");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="space-y-4">
      {/* Search & Filter Bar */}
      <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-2xs flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
          <Input
            placeholder="Поиск по названию, артикулу или штрихкоду..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 text-xs"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Category Filter */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="h-9 px-3 rounded-md border border-slate-200 bg-white text-xs text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-600"
          >
            <option value="all">Все категории ({initialProducts.length})</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>

          {/* Stock Filter Toggle */}
          <button
            onClick={() => setStockFilter(stockFilter === "all" ? "low" : "all")}
            className={`h-9 px-3 rounded-md text-xs font-medium border flex items-center gap-1.5 transition-colors ${
              stockFilter === "low"
                ? "bg-rose-50 border-rose-300 text-rose-800"
                : "bg-white border-slate-200 text-slate-700 hover:bg-slate-50"
            }`}
          >
            <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
            <span>Только с низким остатком</span>
          </button>
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
        {filteredProducts.length === 0 ? (
          <div className="p-12 text-center space-y-3">
            <Package className="w-10 h-10 text-slate-300 mx-auto" />
            <h3 className="text-sm font-semibold text-slate-900">Товары не найдены</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Попробуйте изменить поисковый запрос или фильтры категорий.
            </p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Наименование и артикул</TableHead>
                <TableHead>Категория</TableHead>
                <TableHead>Себестоимость</TableHead>
                <TableHead>Цена продажи</TableHead>
                <TableHead>Наценка</TableHead>
                <TableHead>Остаток на складе</TableHead>
                <TableHead className="text-right">Действия</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredProducts.map((p) => {
                const isLowStock = p.stockQuantity <= p.minStockThreshold;
                const margin =
                  p.costPrice > 0
                    ? Math.round(((p.sellingPrice - p.costPrice) / p.costPrice) * 100)
                    : 0;

                return (
                  <TableRow key={p.id}>
                    <TableCell>
                      <div>
                        <Link
                          href={`/dashboard/products/${p.id}`}
                          className="font-bold text-slate-900 hover:text-emerald-700 transition-colors"
                        >
                          {p.name}
                        </Link>
                        <div className="flex items-center gap-2 mt-0.5 text-[11px] text-slate-400 font-mono">
                          {p.sku && <span>SKU: {p.sku}</span>}
                          {p.barcode && <span>ШК: {p.barcode}</span>}
                        </div>
                      </div>
                    </TableCell>

                    <TableCell>
                      <Badge variant="secondary" className="text-[11px] font-normal">
                        {p.category?.name || "Без категории"}
                      </Badge>
                    </TableCell>

                    <TableCell className="text-xs font-mono text-slate-600">
                      {formatUZS(p.costPrice)}
                    </TableCell>

                    <TableCell className="text-xs font-bold font-mono text-slate-900">
                      {formatUZS(p.sellingPrice)}
                    </TableCell>

                    <TableCell>
                      <span className="text-xs font-semibold text-emerald-700">
                        +{margin}%
                      </span>
                    </TableCell>

                    <TableCell>
                      <div className="flex items-center gap-1.5">
                        <Badge
                          variant={isLowStock ? "destructive" : "outline"}
                          className={`text-xs ${
                            !isLowStock ? "border-slate-200 text-slate-800" : ""
                          }`}
                        >
                          {p.stockQuantity} {p.unit}
                        </Badge>
                        {isLowStock && (
                          <span
                            title={`Мин. порог: ${p.minStockThreshold} ${p.unit}`}
                            className="text-[10px] text-rose-600 font-medium"
                          >
                            (мин. {p.minStockThreshold})
                          </span>
                        )}
                      </div>
                    </TableCell>

                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Link href={`/dashboard/products/${p.id}`}>
                          <button
                            className="p-1.5 text-slate-500 hover:text-emerald-700 hover:bg-slate-100 rounded-md transition-colors"
                            title="Редактировать товар"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                        </Link>

                        {userRole !== "CASHIER" && (
                          <button
                            onClick={() => handleDelete(p.id, p.name)}
                            disabled={deletingId === p.id}
                            className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-md transition-colors"
                            title="Удалить товар"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        )}
      </div>
    </div>
  );
}
