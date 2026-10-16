"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { formatUZS } from "@/lib/utils/format";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { AlertCircle, ArrowLeft, Save, Sparkles } from "lucide-react";

interface Category {
  id: string;
  name: string;
}

interface ProductData {
  id?: string;
  name: string;
  categoryId: string | null;
  sku: string | null;
  barcode: string | null;
  costPrice: number;
  sellingPrice: number;
  stockQuantity: number;
  minStockThreshold: number;
  unit: string;
}

interface ProductFormProps {
  initialData?: ProductData;
  categories: Category[];
}

export function ProductForm({ initialData, categories }: ProductFormProps) {
  const router = useRouter();
  const isEditing = Boolean(initialData?.id);

  const [formData, setFormData] = React.useState({
    name: initialData?.name || "",
    categoryId: initialData?.categoryId || (categories[0]?.id || ""),
    sku: initialData?.sku || "",
    barcode: initialData?.barcode || "",
    costPrice: initialData?.costPrice || 0,
    sellingPrice: initialData?.sellingPrice || 0,
    stockQuantity: initialData?.stockQuantity || 0,
    minStockThreshold: initialData?.minStockThreshold ?? 5,
    unit: initialData?.unit || "шт",
  });

  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const margin =
    formData.costPrice > 0
      ? Math.round(((formData.sellingPrice - formData.costPrice) / formData.costPrice) * 100)
      : 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const url = isEditing ? `/api/products/${initialData?.id}` : "/api/products";
    const method = isEditing ? "PUT" : "POST";

    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Ошибка сохранения товара");
      }

      router.push("/dashboard/products");
      router.refresh();
    } catch (err: unknown) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="shadow-sm">
      <CardContent className="p-6">
        {error && (
          <div className="mb-6 p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Main Info */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Основные данные
            </h3>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Наименование товара <span className="text-rose-500">*</span>
              </label>
              <Input
                required
                placeholder="Например, Смартфон Artel U5 128GB Black"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Категория товара
                </label>
                <select
                  value={formData.categoryId}
                  onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                  className="w-full h-9 px-3 rounded-md border border-slate-200 bg-white text-xs text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-600"
                >
                  <option value="">Без категории</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Единица измерения
                </label>
                <select
                  value={formData.unit}
                  onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                  className="w-full h-9 px-3 rounded-md border border-slate-200 bg-white text-xs text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-600"
                >
                  <option value="шт">шт (штука)</option>
                  <option value="кг">кг (килограмм)</option>
                  <option value="м">м (метр)</option>
                  <option value="пачка">пачка</option>
                  <option value="компл">компл (комплект)</option>
                  <option value="л">л (литр)</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Артикул (SKU)
                </label>
                <Input
                  placeholder="ART-U5-128"
                  value={formData.sku}
                  onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Штрихкод (EAN/UPC)
                </label>
                <Input
                  placeholder="478001234501"
                  value={formData.barcode}
                  onChange={(e) => setFormData({ ...formData, barcode: e.target.value })}
                />
              </div>
            </div>
          </div>

          {/* Pricing & Margins */}
          <div className="space-y-4 pt-4 border-t border-slate-100">
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Цены и себестоимость (UZS)
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Себестоимость закупки (сум)
                </label>
                <Input
                  type="number"
                  min="0"
                  step="1000"
                  placeholder="0"
                  value={formData.costPrice || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, costPrice: Number(e.target.value) || 0 })
                  }
                />
                <span className="text-[10px] text-slate-400 mt-1 block">
                  {formatUZS(formData.costPrice)}
                </span>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Цена продажи (сум) <span className="text-rose-500">*</span>
                </label>
                <Input
                  type="number"
                  min="0"
                  step="1000"
                  required
                  placeholder="0"
                  value={formData.sellingPrice || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, sellingPrice: Number(e.target.value) || 0 })
                  }
                />
                <span className="text-[10px] text-slate-400 mt-1 block">
                  {formatUZS(formData.sellingPrice)}
                </span>
              </div>
            </div>

            {/* Live Margin Calculation */}
            <div className="p-3 bg-emerald-50 rounded-lg border border-emerald-200/80 flex items-center justify-between text-xs">
              <span className="text-emerald-900 font-medium">
                Расчетная наценка / маржинальность:
              </span>
              <span className="font-extrabold text-emerald-800 text-sm">
                +{margin}% ({formatUZS(Math.max(0, formData.sellingPrice - formData.costPrice))})
              </span>
            </div>
          </div>

          {/* Stock Quantities */}
          <div className="space-y-4 pt-4 border-t border-slate-100">
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Складской остаток
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Текущее количество на складе
                </label>
                <Input
                  type="number"
                  min="0"
                  value={formData.stockQuantity}
                  onChange={(e) =>
                    setFormData({ ...formData, stockQuantity: parseInt(e.target.value) || 0 })
                  }
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Порог оповещения (минимальный остаток)
                </label>
                <Input
                  type="number"
                  min="0"
                  value={formData.minStockThreshold}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      minStockThreshold: parseInt(e.target.value) || 0,
                    })
                  }
                />
                <span className="text-[10px] text-slate-400 mt-1 block">
                  При снижении до этого уровня придет уведомление о необходимости закупки
                </span>
              </div>
            </div>
          </div>

          {/* Buttons */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
            <Link href="/dashboard/products">
              <Button type="button" variant="outline" size="sm" className="gap-1.5">
                <ArrowLeft className="w-4 h-4" />
                <span>Отмена</span>
              </Button>
            </Link>

            <Button
              type="submit"
              disabled={loading}
              size="sm"
              className="gap-1.5 bg-emerald-700 hover:bg-emerald-800 shadow-sm"
            >
              <Save className="w-4 h-4" />
              <span>{loading ? "Сохранение..." : isEditing ? "Обновить товар" : "Сохранить товар"}</span>
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
