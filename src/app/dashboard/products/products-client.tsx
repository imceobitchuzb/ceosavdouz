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
  Filter,
  X
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

  // Memoized filtering for fast typing without lag
  const filteredProducts = React.useMemo(() => {
    const s = search.trim().toLowerCase();
    return initialProducts.filter((product) => {
      const matchesSearch =
        !s ||
        product.name.toLowerCase().includes(s) ||
        (product.sku && product.sku.toLowerCase().includes(s)) ||
        (product.barcode && product.barcode.includes(s));

      const matchesCategory =
        selectedCategory === "all" || product.category?.id === selectedCategory;

      const matchesStock =
        stockFilter === "all" || product.stockQuantity <= product.minStockThreshold;

      return matchesSearch && matchesCategory && matchesStock;
    });
  }, [initialProducts, search, selectedCategory, stockFilter]);

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
            className="pl-9 pr-8 text-xs h-9"
          />
          {search && (
            <button
              onClick={() => setSearch("")}
              className="absolute right-2.5 top-2.5 text-slate-400 hover:text-slate-600"
            >
              <X className="w-4 h-4" />
            </button>
          )}
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
            className={`h-9 px-3 rounded-md text-xs font-medium border flex items-center gap-1.5 transition-colors touch-manipulation ${
              stockFilter === "low"
                ? "bg-rose-50 border-rose-300 text-rose-800 font-semibold"
                : "bg-white border-slate-200 text-slate-700 hover:bg-slate-50"
            }`}
          >
            <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
            <span>Только малый остаток</span>
          </button>
        </div>
      </div>

      {/* Content: Mobile Cards + Desktop Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
        {filteredProducts.length === 0 ? (
          <div className="p-12 text-center space-y-3">
            <Package className="w-10 h-10 text-slate-300 mx-auto" />
            <h3 className="text-sm font-semibold text-slate-900">Товары не найдены</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Попробуйте изменить поисковый запрос или сбросить фильтры.
            </p>
          </div>
        ) : (
          <>
            {/* MOBILE CARDS VIEW (< md) */}
            <div className="divide-y divide-slate-100 md:hidden">
              {filteredProducts.map((p) => {
                const isLowStock = p.stockQuantity <= p.minStockThreshold;
                const margin =
                  p.costPrice > 0
                    ? Math.round(((p.sellingPrice - p.costPrice) / p.costPrice) * 100)
                    : 0;

                return (
                  <div key={p.id} className="p-3.5 space-y-2.5">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <Link
                          href={`/dashboard/products/${p.id}`}
                          className="font-bold text-sm text-slate-900 hover:text-emerald-700 line-clamp-2"
                        >
                          {p.name}
                        </Link>
                        <div className="flex flex-wrap items-center gap-2 mt-1 text-[11px] text-slate-400 font-mono">
                          {p.sku && <span>SKU: {p.sku}</span>}
                          {p.category && (
                            <Badge variant="secondary" className="text-[10px] py-0 px-1.5 h-4">
                              {p.category.name}
                            </Badge>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-1 shrink-0">
                        <Link href={`/dashboard/products/${p.id}`}>
                          <button
                            className="p-2 text-slate-600 hover:text-emerald-700 hover:bg-slate-100 rounded-lg touch-manipulation"
                            title="Редактировать"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                        </Link>
                        {userRole !== "CASHIER" && (
                          <button
                            onClick={() => handleDelete(p.id, p.name)}
                            disabled={deletingId === p.id}
                            className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg touch-manipulation"
                            title="Удалить"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-xs pt-1 border-t border-slate-50">
                      <div>
                        <span className="font-extrabold text-slate-900 font-mono text-sm block">
                          {formatUZS(p.sellingPrice)}
                        </span>
                        <span className="text-[10px] text-slate-500">
                          Закупка: {formatUZS(p.costPrice)} · <span className="text-emerald-700 font-semibold">+{margin}%</span>
                        </span>
                      </div>

                      <div className="text-right">
                        <Badge
                          variant={isLowStock ? "destructive" : "outline"}
                          className={`text-xs ${
                            !isLowStock ? "border-slate-200 text-slate-800" : ""
                          }`}
                        >
                          {p.stockQuantity} {p.unit}
                        </Badge>
                        {isLowStock && (
                          <span className="text-[10px] text-rose-600 font-semibold block mt-0.5">
                            Мин. {p.minStockThreshold}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* DESKTOP TABLE VIEW (>= md) */}
            <div className="hidden md:block">
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
            </div>
          </>
        )}
      </div>
    </div>
  );
}
