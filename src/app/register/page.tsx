"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight, Lock, Mail, User, Building2, Phone, AlertCircle, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function RegisterPage() {
  const router = useRouter();
  const [formData, setFormData] = React.useState({
    name: "",
    email: "",
    password: "",
    businessName: "",
    phone: "",
  });
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Ошибка регистрации");
      }

      router.push("/dashboard");
      router.refresh();
    } catch (err: unknown) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#faf9f6] flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <Link href="/" className="inline-flex items-center gap-2.5 mb-6 group">
          <div className="w-10 h-10 rounded-xl bg-emerald-700 flex items-center justify-center text-white font-bold text-xl shadow-md">
            CS
          </div>
          <span className="font-extrabold text-2xl tracking-tight text-slate-900">
            CEOSAVDOUZ
          </span>
        </Link>
        <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
          Создание аккаунта компании
        </h2>
        <p className="mt-1 text-xs text-slate-500">
          Уже зарегистрированы?{" "}
          <Link href="/login" className="font-semibold text-emerald-700 hover:underline">
            Войти в систему
          </Link>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4 sm:px-0">
        <div className="bg-white py-8 px-6 shadow-sm rounded-2xl border border-slate-200 sm:px-10 space-y-5">
          {error && (
            <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Название вашего бизнеса / магазина <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <Building2 className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
                <Input
                  required
                  className="pl-9"
                  placeholder="OOO «Navbahor Savdo»"
                  value={formData.businessName}
                  onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                ФИО владельца <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <User className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
                <Input
                  required
                  className="pl-9"
                  placeholder="Азиз Каримов"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Номер телефона (+998) <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <Phone className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
                <Input
                  required
                  className="pl-9"
                  placeholder="+998 90 123 45 67"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Email для входа <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
                <Input
                  type="email"
                  required
                  className="pl-9"
                  placeholder="owner@business.uz"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Пароль (от 6 символов) <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
                <Input
                  type="password"
                  required
                  minLength={6}
                  className="pl-9"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                />
              </div>
            </div>

            <div className="pt-2">
              <Button type="submit" disabled={loading} className="w-full gap-2 shadow-sm">
                <span>{loading ? "Создание учетной записи..." : "Начать 14 дней бесплатно"}</span>
                <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          </form>

          <div className="pt-3 border-t border-slate-100 space-y-1.5 text-[11px] text-slate-500 text-center">
            <p className="flex items-center justify-center gap-1 text-emerald-700 font-medium">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>14 дней бесплатно без привязки карты</span>
            </p>
            <p>
              Нажимая кнопку, вы соглашаетесь с{" "}
              <Link href="/terms" className="underline hover:text-slate-800">
                условиями оферты
              </Link>{" "}
              и{" "}
              <Link href="/privacy" className="underline hover:text-slate-800">
                политикой конфиденциальности
              </Link>
              .
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
