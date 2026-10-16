"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { formatUZS, formatUzbekPhone } from "@/lib/utils/format";
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
  Users,
  Plus,
  UserCheck,
  AlertCircle,
  X,
  Phone,
  ArrowRight,
  TrendingDown
} from "lucide-react";

interface Customer {
  id: string;
  name: string;
  phone: string;
  address: string | null;
  notes: string | null;
  totalSpent: number;
  currentDebt: number;
  orders: { id: string; totalAmount: number; status: string }[];
}

interface CustomersClientProps {
  initialCustomers: Customer[];
}

export function CustomersClient({ initialCustomers }: CustomersClientProps) {
  const router = useRouter();
  const [search, setSearch] = React.useState("");
  const [debtOnly, setDebtOnly] = React.useState(false);
  const [modalOpen, setModalOpen] = React.useState(false);

  // New customer form state
  const [newCustomer, setNewCustomer] = React.useState({
    name: "",
    phone: "",
    address: "",
    notes: "",
  });
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const filteredCustomers = initialCustomers.filter((c) => {
    const s = search.toLowerCase();
    const matchesSearch =
      !search ||
      c.name.toLowerCase().includes(s) ||
      c.phone.includes(s) ||
      (c.address && c.address.toLowerCase().includes(s));

    const matchesDebt = !debtOnly || c.currentDebt > 0;
    return matchesSearch && matchesDebt;
  });

  const totalDebt = initialCustomers.reduce((acc, c) => acc + c.currentDebt, 0);
  const debtClientsCount = initialCustomers.filter((c) => c.currentDebt > 0).length;

  const handleCreateCustomer = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/customers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newCustomer),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Ошибка добавления клиента");
      }

      setModalOpen(false);
      setNewCustomer({ name: "", phone: "", address: "", notes: "" });
      router.refresh();
    } catch (err: unknown) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* KPI mini-cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-2xs">
          <span className="text-xs text-slate-500 font-medium">Всего контрагентов</span>
          <p className="text-xl font-bold text-slate-900 mt-1">{initialCustomers.length}</p>
        </div>

        <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-2xs">
          <span className="text-xs text-slate-500 font-medium">Клиентов с долгами (Насия)</span>
          <p className="text-xl font-bold text-amber-700 mt-1">{debtClientsCount}</p>
        </div>

        <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-2xs">
          <span className="text-xs text-slate-500 font-medium">Общая сумма долгов</span>
          <p className="text-xl font-bold text-amber-800 mt-1 font-mono">{formatUZS(totalDebt)}</p>
        </div>
      </div>

      {/* Search & Actions Bar */}
      <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-2xs flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
          <Input
            placeholder="Поиск по имени, номеру телефона (+998) или адресу..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 text-xs"
          />
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setDebtOnly(!debtOnly)}
            className={`h-9 px-3 rounded-md text-xs font-medium border flex items-center gap-1.5 transition-colors ${
              debtOnly
                ? "bg-amber-50 border-amber-300 text-amber-900 font-semibold"
                : "bg-white border-slate-200 text-slate-700 hover:bg-slate-50"
            }`}
          >
            <TrendingDown className="w-3.5 h-3.5 text-amber-600" />
            <span>Только с долгом ({debtClientsCount})</span>
          </button>

          <Button
            size="sm"
            onClick={() => setModalOpen(true)}
            className="gap-1.5 bg-emerald-700 hover:bg-emerald-800 text-xs shadow-sm"
          >
            <Plus className="w-4 h-4" />
            <span>Добавить клиента</span>
          </Button>
        </div>
      </div>

      {/* Customers Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
        {filteredCustomers.length === 0 ? (
          <div className="p-12 text-center space-y-3">
            <Users className="w-10 h-10 text-slate-300 mx-auto" />
            <h3 className="text-sm font-semibold text-slate-900">Клиенты не найдены</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Попробуйте изменить поисковый запрос или добавьте нового клиента.
            </p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Имя клиента</TableHead>
                <TableHead>Телефон</TableHead>
                <TableHead>Город / Адрес</TableHead>
                <TableHead>Всего покупок</TableHead>
                <TableHead>Текущий долг (Насия)</TableHead>
                <TableHead className="text-right">Профиль</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCustomers.map((c) => {
                const hasDebt = c.currentDebt > 0;

                return (
                  <TableRow key={c.id}>
                    <TableCell>
                      <div>
                        <Link
                          href={`/dashboard/customers/${c.id}`}
                          className="font-bold text-slate-900 hover:text-emerald-700 transition-colors"
                        >
                          {c.name}
                        </Link>
                        {c.notes && (
                          <p className="text-[11px] text-slate-400 line-clamp-1 mt-0.5">
                            {c.notes}
                          </p>
                        )}
                      </div>
                    </TableCell>

                    <TableCell className="text-xs font-mono text-slate-700">
                      {formatUzbekPhone(c.phone)}
                    </TableCell>

                    <TableCell className="text-xs text-slate-600">
                      {c.address || "—"}
                    </TableCell>

                    <TableCell className="text-xs font-semibold text-slate-900 font-mono">
                      {formatUZS(c.totalSpent)}
                    </TableCell>

                    <TableCell>
                      {hasDebt ? (
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-bold text-amber-900 bg-amber-50 border border-amber-200 font-mono">
                          {formatUZS(c.currentDebt)}
                        </span>
                      ) : (
                        <span className="text-xs text-slate-400">Нет долга</span>
                      )}
                    </TableCell>

                    <TableCell className="text-right">
                      <Link href={`/dashboard/customers/${c.id}`}>
                        <Button variant="ghost" size="sm" className="text-xs text-emerald-700 hover:text-emerald-800 gap-1">
                          <span>Карточка</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </Button>
                      </Link>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        )}
      </div>

      {/* Add Customer Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-5 shadow-2xl animate-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900">
                Новый контрагент / клиент
              </h3>
              <button
                onClick={() => setModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {error && (
              <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleCreateCustomer} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  ФИО или название компании <span className="text-rose-500">*</span>
                </label>
                <Input
                  required
                  placeholder="Шерзод Умаров или OOO 'Tashkent Trade'"
                  value={newCustomer.name}
                  onChange={(e) => setNewCustomer({ ...newCustomer, name: e.target.value })}
                  className="text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Номер телефона (+998) <span className="text-rose-500">*</span>
                </label>
                <Input
                  required
                  placeholder="+998 90 123 45 67"
                  value={newCustomer.phone}
                  onChange={(e) => setNewCustomer({ ...newCustomer, phone: e.target.value })}
                  className="text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Адрес (город, район, ориентир)
                </label>
                <Input
                  placeholder="г. Ташкент, Чиланзар-12"
                  value={newCustomer.address}
                  onChange={(e) => setNewCustomer({ ...newCustomer, address: e.target.value })}
                  className="text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Заметки (условия отсрочки, предпочтения)
                </label>
                <Input
                  placeholder="Например, оптовик, отсрочка 7 дней"
                  value={newCustomer.notes}
                  onChange={(e) => setNewCustomer({ ...newCustomer, notes: e.target.value })}
                  className="text-xs"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setModalOpen(false)}
                >
                  Отмена
                </Button>
                <Button
                  type="submit"
                  disabled={loading}
                  size="sm"
                  className="bg-emerald-700 hover:bg-emerald-800"
                >
                  {loading ? "Сохранение..." : "Создать клиента"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
