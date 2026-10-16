"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  ShoppingCart,
  PlusCircle,
  Package,
  Users,
  Wallet,
  BarChart3,
  Users2,
  Bell,
  Settings,
  TrendingUp,
  LogOut,
  ChevronRight,
  ShieldAlert
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { USER_ROLES } from "@/lib/utils/format";

interface NavItem {
  title: string;
  href: string;
  icon: React.ElementType;
  badge?: string;
  badgeVariant?: "default" | "secondary" | "warning" | "destructive";
  roles?: string[]; // Allowed roles (if restricted)
}

const NAV_ITEMS: NavItem[] = [
  {
    title: "Обзор (KPI)",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Продажи",
    href: "/dashboard/sales",
    icon: TrendingUp,
  },
  {
    title: "Заказы",
    href: "/dashboard/orders",
    icon: ShoppingCart,
  },
  {
    title: "Новый заказ",
    href: "/dashboard/orders/new",
    icon: PlusCircle,
  },
  {
    title: "Товары и склад",
    href: "/dashboard/products",
    icon: Package,
  },
  {
    title: "Клиенты и долги",
    href: "/dashboard/customers",
    icon: Users,
  },
  {
    title: "Финансы и касса",
    href: "/dashboard/finance",
    icon: Wallet,
  },
  {
    title: "Аналитика",
    href: "/dashboard/analytics",
    icon: BarChart3,
    roles: ["OWNER", "ADMIN", "MANAGER"],
  },
  {
    title: "Сотрудники",
    href: "/dashboard/team",
    icon: Users2,
    roles: ["OWNER", "ADMIN"],
  },
  {
    title: "Уведомления",
    href: "/dashboard/notifications",
    icon: Bell,
  },
  {
    title: "Настройки бизнеса",
    href: "/dashboard/settings",
    icon: Settings,
    roles: ["OWNER", "ADMIN"],
  },
];

interface DashboardNavProps {
  userRole?: string;
  onLinkClick?: () => void;
}

export function DashboardNav({ userRole = "OWNER", onLinkClick }: DashboardNavProps) {
  const pathname = usePathname();

  return (
    <nav className="flex-1 space-y-1.5 px-3 py-4">
      <div className="px-3 pb-2 text-[10px] font-bold uppercase tracking-wider text-slate-400">
        Управление бизнесом
      </div>

      {NAV_ITEMS.map((item) => {
        // Role check
        if (item.roles && !item.roles.includes(userRole)) {
          return null;
        }

        const isActive =
          item.href === "/dashboard"
            ? pathname === "/dashboard"
            : pathname.startsWith(item.href);

        const Icon = item.icon;

        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={onLinkClick}
            className={`flex items-center justify-between px-3 py-2 text-xs font-medium rounded-lg transition-colors group ${
              isActive
                ? "bg-emerald-800 text-white shadow-xs font-semibold"
                : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
            }`}
          >
            <div className="flex items-center gap-3">
              <Icon
                className={`w-4 h-4 shrink-0 transition-colors ${
                  isActive ? "text-white" : "text-slate-400 group-hover:text-slate-700"
                }`}
              />
              <span>{item.title}</span>
            </div>

            {item.badge && (
              <Badge
                variant={item.badgeVariant || "secondary"}
                className="text-[10px] px-1.5 py-0 h-4"
              >
                {item.badge}
              </Badge>
            )}
          </Link>
        );
      })}
    </nav>
  );
}
