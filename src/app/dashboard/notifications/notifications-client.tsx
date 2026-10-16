"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { formatLocalDatetime } from "@/lib/utils/format";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  Bell,
  CheckCheck,
  AlertTriangle,
  ShoppingCart,
  Wallet,
  Info,
  Clock
} from "lucide-react";

interface Notification {
  id: string;
  title: string;
  message: string;
  type: string;
  isRead: boolean;
  createdAt: string | Date;
}

interface NotificationsClientProps {
  initialNotifications: Notification[];
}

export function NotificationsClient({
  initialNotifications,
}: NotificationsClientProps) {
  const router = useRouter();
  const [filter, setFilter] = React.useState<"ALL" | "UNREAD">("ALL");
  const [loading, setLoading] = React.useState(false);

  const filtered = initialNotifications.filter((n) => {
    if (filter === "UNREAD") return !n.isRead;
    return true;
  });

  const unreadCount = initialNotifications.filter((n) => !n.isRead).length;

  const handleMarkAllRead = async () => {
    setLoading(true);
    try {
      await fetch("/api/notifications", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ markAllRead: true }),
      });
      router.refresh();
    } catch {
      alert("Ошибка сети");
    } finally {
      setLoading(false);
    }
  };

  const handleMarkSingleRead = async (id: string) => {
    try {
      await fetch("/api/notifications", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      router.refresh();
    } catch {
      // silent
    }
  };

  const getIcon = (type: string) => {
    switch (type) {
      case "STOCK":
        return <AlertTriangle className="w-4 h-4 text-rose-600" />;
      case "ORDER":
        return <ShoppingCart className="w-4 h-4 text-blue-600" />;
      case "FINANCE":
        return <Wallet className="w-4 h-4 text-emerald-600" />;
      default:
        return <Info className="w-4 h-4 text-slate-600" />;
    }
  };

  return (
    <div className="space-y-4">
      {/* Top Filter and Action */}
      <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-2xs flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
        <div className="flex items-center gap-1.5 text-xs">
          <button
            onClick={() => setFilter("ALL")}
            className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
              filter === "ALL"
                ? "bg-slate-900 text-white shadow-2xs"
                : "bg-slate-100 text-slate-700 hover:bg-slate-200"
            }`}
          >
            Все ({initialNotifications.length})
          </button>
          <button
            onClick={() => setFilter("UNREAD")}
            className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
              filter === "UNREAD"
                ? "bg-emerald-800 text-white shadow-2xs"
                : "bg-slate-100 text-slate-700 hover:bg-slate-200"
            }`}
          >
            Непрочитанные ({unreadCount})
          </button>
        </div>

        {unreadCount > 0 && (
          <Button
            size="sm"
            variant="outline"
            disabled={loading}
            onClick={handleMarkAllRead}
            className="gap-1.5 text-xs text-slate-700"
          >
            <CheckCheck className="w-4 h-4 text-emerald-600" />
            <span>Отметить все прочитанными</span>
          </Button>
        )}
      </div>

      {/* Notifications List */}
      <div className="space-y-2.5">
        {filtered.length === 0 ? (
          <div className="p-12 text-center text-xs text-slate-400 bg-white rounded-xl border border-slate-200">
            Нет уведомлений в этой категории
          </div>
        ) : (
          filtered.map((n) => (
            <div
              key={n.id}
              onClick={() => !n.isRead && handleMarkSingleRead(n.id)}
              className={`p-4 rounded-xl border transition-all cursor-pointer ${
                !n.isRead
                  ? "bg-white border-emerald-300 shadow-xs ring-1 ring-emerald-100"
                  : "bg-[#faf9f6]/80 border-slate-200 text-slate-600 hover:bg-white"
              }`}
            >
              <div className="flex items-start justify-between gap-3 text-xs">
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-slate-100 shrink-0 mt-0.5">
                    {getIcon(n.type)}
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className={`font-bold ${!n.isRead ? "text-slate-900" : "text-slate-700"}`}>
                        {n.title}
                      </span>
                      {!n.isRead && (
                        <span className="w-2 h-2 rounded-full bg-emerald-600" />
                      )}
                    </div>
                    <p className="text-slate-600 leading-relaxed text-[11px] sm:text-xs">
                      {n.message}
                    </p>
                  </div>
                </div>

                <span className="text-[10px] text-slate-400 shrink-0 font-mono">
                  {formatLocalDatetime(n.createdAt)}
                </span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
