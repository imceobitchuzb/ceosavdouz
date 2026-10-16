"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight, Lock, Mail, AlertCircle, Sparkles, Building2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Не удалось войти в аккаунт");
      }

      router.push("/dashboard");
      router.refresh();
    } catch (err: unknown) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const fillCredentials = (demoEmail: string) => {
    setEmail(demoEmail);
    setPassword("password123");
    setError(null);
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
          Вход в панель управления
        </h2>
        <p className="mt-1 text-xs text-slate-500">
          Или{" "}
          <Link href="/register" className="font-semibold text-emerald-700 hover:underline">
            зарегистрируйте новую компанию
          </Link>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4 sm:px-0">
        <div className="bg-white py-8 px-6 shadow-sm rounded-2xl border border-slate-200 sm:px-10 space-y-6">
          {error && (
            <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Электронная почта (Email)
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
                <Input
                  type="email"
                  required
                  className="pl-9"
                  placeholder="name@company.uz"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-semibold text-slate-700">
                  Пароль
                </label>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
                <Input
                  type="password"
                  required
                  className="pl-9"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            <Button type="submit" disabled={loading} className="w-full gap-2 shadow-sm">
              <span>{loading ? "Авторизация..." : "Войти в систему"}</span>
              <ArrowRight className="w-4 h-4" />
            </Button>
          </form>

          {/* Quick Demo Access Buttons */}
          <div className="pt-4 border-t border-slate-100">
            <div className="flex items-center gap-1 text-[11px] font-semibold text-slate-500 mb-2.5 uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
              <span>Быстрый вход для тестирования демо-базы:</span>
            </div>
            <div className="grid grid-cols-1 gap-1.5 text-xs">
              <button
                type="button"
                onClick={() => fillCredentials("aziz@ceosavdouz.uz")}
                className="w-full text-left px-3 py-2 rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors flex items-center justify-between group"
              >
                <div>
                  <span className="font-semibold text-slate-900 group-hover:text-emerald-700">Азиз Каримов</span>
                  <span className="text-[10px] text-slate-500 block">Владелец бизнеса (Silk Road Trading)</span>
                </div>
                <span className="text-[10px] bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded font-mono">
                  OWNER
                </span>
              </button>

              <button
                type="button"
                onClick={() => fillCredentials("nigora@ceosavdouz.uz")}
                className="w-full text-left px-3 py-2 rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors flex items-center justify-between group"
              >
                <div>
                  <span className="font-semibold text-slate-900 group-hover:text-emerald-700">Нигора Рахимова</span>
                  <span className="text-[10px] text-slate-500 block">Менеджер по продажам</span>
                </div>
                <span className="text-[10px] bg-blue-50 text-blue-700 border border-blue-200 px-2 py-0.5 rounded font-mono">
                  MANAGER
                </span>
              </button>

              <button
                type="button"
                onClick={() => fillCredentials("jasur@ceosavdouz.uz")}
                className="w-full text-left px-3 py-2 rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors flex items-center justify-between group"
              >
                <div>
                  <span className="font-semibold text-slate-900 group-hover:text-emerald-700">Жасур Алиев</span>
                  <span className="text-[10px] text-slate-500 block">Кассир торговой точки</span>
                </div>
                <span className="text-[10px] bg-amber-50 text-amber-700 border border-amber-200 px-2 py-0.5 rounded font-mono">
                  CASHIER
                </span>
              </button>
            </div>
            <p className="text-[10px] text-slate-400 text-center mt-2">Пароль для всех демо-пользователей: password123</p>
          </div>
        </div>

        <div className="text-center mt-6">
          <Link href="/" className="text-xs text-slate-500 hover:text-slate-800">
            ← Вернуться на главную страницу
          </Link>
        </div>
      </div>
    </div>
  );
}
