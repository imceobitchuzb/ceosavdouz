"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Menu,
  Bell,
  LogOut,
  Plus,
  Building2,
  User as UserIcon,
  ChevronDown
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { LanguageSwitcher } from "@/components/public/language-switcher";
import { USER_ROLES } from "@/lib/utils/format";

interface DashboardHeaderProps {
  businessName: string;
  userName: string;
  userRole: string;
  unreadNotificationsCount?: number;
  onOpenMobileMenu: () => void;
}

export function DashboardHeader({
  businessName,
  userName,
  userRole,
  unreadNotificationsCount = 2,
  onOpenMobileMenu,
}: DashboardHeaderProps) {
  const router = useRouter();
  const [loggingOut, setLoggingOut] = React.useState(false);

  const handleLogout = async () => {
    setLoggingOut(true);
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      router.push("/login");
      router.refresh();
    } catch {
      router.push("/login");
    }
  };

  const roleLabel = USER_ROLES[userRole] || userRole;

  return (
    <header className="sticky top-0 z-30 h-16 bg-white border-b border-slate-200 px-4 sm:px-6 flex items-center justify-between">
      {/* Left: Mobile trigger & Company Title */}
      <div className="flex items-center gap-3">
        <button
          onClick={onOpenMobileMenu}
          className="lg:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100 transition-colors"
          aria-label="Открыть боковое меню"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-800">
            <Building2 className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-sm text-slate-900 line-clamp-1 max-w-[140px] sm:max-w-[240px]">
                {businessName}
              </span>
              <Badge variant="outline" className="hidden sm:inline-flex text-[10px] py-0 px-1.5 h-4 text-emerald-700 border-emerald-200 bg-emerald-50">
                {roleLabel}
              </Badge>
            </div>
            <span className="text-[10px] text-slate-400 block -mt-0.5 font-mono">
              Ташкент · Валюта: UZS
            </span>
          </div>
        </div>
      </div>

      {/* Right: Actions, Notifications, User & Logout */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Quick New Order */}
        <Link href="/dashboard/orders/new">
          <Button size="sm" className="hidden sm:inline-flex gap-1.5 bg-emerald-700 hover:bg-emerald-800 text-xs shadow-2xs">
            <Plus className="w-3.5 h-3.5" />
            <span>Новый заказ</span>
          </Button>
        </Link>

        {/* Notifications */}
        <Link href="/dashboard/notifications" className="relative p-2 rounded-lg text-slate-600 hover:bg-slate-100 transition-colors">
          <Bell className="w-4 h-4" />
          {unreadNotificationsCount > 0 && (
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-rose-600 ring-2 ring-white" />
          )}
        </Link>

        <div className="hidden sm:block">
          <LanguageSwitcher />
        </div>

        {/* User Info & Logout */}
        <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
          <div className="hidden md:flex flex-col text-right">
            <span className="text-xs font-semibold text-slate-900 line-clamp-1">{userName}</span>
            <span className="text-[10px] text-slate-400 font-medium">{roleLabel}</span>
          </div>

          <button
            onClick={handleLogout}
            disabled={loggingOut}
            title="Выйти из аккаунта"
            className="p-2 rounded-lg text-slate-500 hover:text-rose-600 hover:bg-rose-50 transition-colors"
            aria-label="Выйти"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
}
