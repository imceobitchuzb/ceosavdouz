"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { formatLocalDatetime, USER_ROLES } from "@/lib/utils/format";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from "@/components/ui/table";
import {
  Users,
  UserPlus,
  ShieldCheck,
  CheckCircle2,
  XCircle,
  Trash2,
  X,
  AlertCircle
} from "lucide-react";

interface TeamMember {
  id: string;
  role: string;
  createdAt: string | Date;
  user: {
    id: string;
    name: string;
    email: string;
    phone: string | null;
  };
}

interface TeamClientProps {
  initialMembers: TeamMember[];
  currentUserRole: string;
}

export function TeamClient({
  initialMembers,
  currentUserRole,
}: TeamClientProps) {
  const router = useRouter();
  const [modalOpen, setModalOpen] = React.useState(false);
  const [formData, setFormData] = React.useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    role: "MANAGER" as "ADMIN" | "MANAGER" | "CASHIER",
  });
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const canManageTeam = currentUserRole === "OWNER" || currentUserRole === "ADMIN";

  const handleAddMember = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/team", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Ошибка добавления сотрудника");
      }

      setModalOpen(false);
      setFormData({ name: "", email: "", phone: "", password: "", role: "MANAGER" });
      router.refresh();
    } catch (err: unknown) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteMember = async (id: string, name: string) => {
    if (!confirm(`Удалить доступ для сотрудника «${name}»?`)) return;

    try {
      const res = await fetch(`/api/team/${id}`, { method: "DELETE" });
      if (!res.ok) {
        const data = await res.json();
        alert(data.error || "Ошибка удаления");
        return;
      }
      router.refresh();
    } catch {
      alert("Ошибка сети");
    }
  };

  return (
    <div className="space-y-6">
      {/* Top bar */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="text-xs">
            Всего сотрудников: {initialMembers.length}
          </Badge>
          <span className="text-xs text-slate-500">
            Ваша роль: <strong className="text-slate-900">{USER_ROLES[currentUserRole]}</strong>
          </span>
        </div>

        {canManageTeam && (
          <Button
            size="sm"
            onClick={() => setModalOpen(true)}
            className="gap-1.5 bg-emerald-700 hover:bg-emerald-800 text-xs shadow-sm"
          >
            <UserPlus className="w-4 h-4" />
            <span>Добавить сотрудника</span>
          </Button>
        )}
      </div>

      {/* Team Members Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Сотрудник</TableHead>
              <TableHead>Email для входа</TableHead>
              <TableHead>Телефон</TableHead>
              <TableHead>Роль в системе</TableHead>
              <TableHead>Дата добавления</TableHead>
              <TableHead className="text-right">Действия</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {initialMembers.map((m) => {
              const roleColor =
                m.role === "OWNER"
                  ? "bg-emerald-100 text-emerald-900 border-emerald-300"
                  : m.role === "ADMIN"
                  ? "bg-purple-100 text-purple-900 border-purple-300"
                  : m.role === "MANAGER"
                  ? "bg-blue-100 text-blue-900 border-blue-300"
                  : "bg-amber-100 text-amber-900 border-amber-300";

              return (
                <TableRow key={m.id}>
                  <TableCell className="font-bold text-slate-900 text-xs">
                    {m.user.name}
                  </TableCell>

                  <TableCell className="text-xs font-mono text-slate-600">
                    {m.user.email}
                  </TableCell>

                  <TableCell className="text-xs font-mono text-slate-600">
                    {m.user.phone || "—"}
                  </TableCell>

                  <TableCell>
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-bold border ${roleColor}`}
                    >
                      {USER_ROLES[m.role] || m.role}
                    </span>
                  </TableCell>

                  <TableCell className="text-xs text-slate-400">
                    {formatLocalDatetime(m.createdAt, false)}
                  </TableCell>

                  <TableCell className="text-right">
                    {currentUserRole === "OWNER" && m.role !== "OWNER" && (
                      <button
                        onClick={() => handleDeleteMember(m.id, m.user.name)}
                        className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-md transition-colors"
                        title="Отозвать доступ"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>

      {/* Permissions Matrix */}
      <Card className="shadow-2xs">
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-bold flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-700" />
            <span>Матрица прав доступа</span>
          </CardTitle>
          <p className="text-xs text-slate-500 mt-0.5">
            Контроль безопасности: какие разделы доступны каждой роли
          </p>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Функциональный раздел</TableHead>
                <TableHead>Владелец (OWNER)</TableHead>
                <TableHead>Администратор (ADMIN)</TableHead>
                <TableHead>Менеджер (MANAGER)</TableHead>
                <TableHead>Кассир (CASHIER)</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody className="text-xs">
              <TableRow>
                <TableCell className="font-semibold">Оформление заказов (Касса)</TableCell>
                <TableCell><CheckCircle2 className="w-4 h-4 text-emerald-600" /></TableCell>
                <TableCell><CheckCircle2 className="w-4 h-4 text-emerald-600" /></TableCell>
                <TableCell><CheckCircle2 className="w-4 h-4 text-emerald-600" /></TableCell>
                <TableCell><CheckCircle2 className="w-4 h-4 text-emerald-600" /></TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-semibold">Управление товарами и складом</TableCell>
                <TableCell><CheckCircle2 className="w-4 h-4 text-emerald-600" /></TableCell>
                <TableCell><CheckCircle2 className="w-4 h-4 text-emerald-600" /></TableCell>
                <TableCell><CheckCircle2 className="w-4 h-4 text-emerald-600" /></TableCell>
                <TableCell><span className="text-slate-400">Только просмотр</span></TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-semibold">Клиенты и долги (Насия)</TableCell>
                <TableCell><CheckCircle2 className="w-4 h-4 text-emerald-600" /></TableCell>
                <TableCell><CheckCircle2 className="w-4 h-4 text-emerald-600" /></TableCell>
                <TableCell><CheckCircle2 className="w-4 h-4 text-emerald-600" /></TableCell>
                <TableCell><span className="text-slate-400">Поиск при чеке</span></TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-semibold">Финансовый учет и расходы</TableCell>
                <TableCell><CheckCircle2 className="w-4 h-4 text-emerald-600" /></TableCell>
                <TableCell><CheckCircle2 className="w-4 h-4 text-emerald-600" /></TableCell>
                <TableCell><XCircle className="w-4 h-4 text-slate-300" /></TableCell>
                <TableCell><XCircle className="w-4 h-4 text-slate-300" /></TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-semibold">Аналитика чистой прибыли и маржи</TableCell>
                <TableCell><CheckCircle2 className="w-4 h-4 text-emerald-600" /></TableCell>
                <TableCell><CheckCircle2 className="w-4 h-4 text-emerald-600" /></TableCell>
                <TableCell><CheckCircle2 className="w-4 h-4 text-emerald-600" /></TableCell>
                <TableCell><XCircle className="w-4 h-4 text-slate-300" /></TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-semibold">Настройки компании и сотрудники</TableCell>
                <TableCell><CheckCircle2 className="w-4 h-4 text-emerald-600" /></TableCell>
                <TableCell><CheckCircle2 className="w-4 h-4 text-emerald-600" /></TableCell>
                <TableCell><XCircle className="w-4 h-4 text-slate-300" /></TableCell>
                <TableCell><XCircle className="w-4 h-4 text-slate-300" /></TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Add Member Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-5 shadow-2xl animate-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900">
                Добавление нового сотрудника
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

            <form onSubmit={handleAddMember} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  ФИО сотрудника <span className="text-rose-500">*</span>
                </label>
                <Input
                  required
                  placeholder="Например, Нигора Рахимова"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Email для входа <span className="text-rose-500">*</span>
                </label>
                <Input
                  type="email"
                  required
                  placeholder="staff@company.uz"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Номер телефона (+998)
                </label>
                <Input
                  placeholder="+998 90 123 45 67"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Роль сотрудника <span className="text-rose-500">*</span>
                </label>
                <select
                  value={formData.role}
                  onChange={(e) =>
                    setFormData({ ...formData, role: e.target.value as any })
                  }
                  className="w-full h-9 px-3 rounded-md border border-slate-200 bg-white text-xs text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-600"
                >
                  <option value="ADMIN">Администратор (Полный доступ к товарам и кассе)</option>
                  <option value="MANAGER">Менеджер продаж (Заказы, клиенты, каталог)</option>
                  <option value="CASHIER">Кассир (Только пробитие чеков на кассе)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Временный пароль для первого входа (мин. 6 знаков) <span className="text-rose-500">*</span>
                </label>
                <Input
                  type="password"
                  required
                  minLength={6}
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
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
                  {loading ? "Сохранение..." : "Добавить в команду"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
