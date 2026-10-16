"use client";

import * as React from "react";
import Link from "next/link";
import { X, Building2, ShieldCheck } from "lucide-react";
import { DashboardNav } from "./dashboard-nav";
import { DashboardHeader } from "./dashboard-header";
import type { SessionPayload } from "@/lib/auth/jwt";

interface DashboardShellProps {
  session: SessionPayload;
  unreadCount?: number;
  children: React.ReactNode;
}

export function DashboardShell({
  session,
  unreadCount = 2,
  children,
}: DashboardShellProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  return (
    <div className="min-h-screen bg-[#faf9f6] flex flex-col lg:flex-row text-slate-900">
      {/* DESKTOP SIDEBAR */}
      <aside className="hidden lg:flex lg:flex-col lg:w-64 lg:fixed lg:inset-y-0 z-40 bg-white border-r border-slate-200">
        {/* Brand */}
        <div className="h-16 flex items-center px-6 border-b border-slate-100 gap-2.5">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 rounded-lg bg-emerald-700 flex items-center justify-center text-white font-extrabold text-sm shadow-xs transition-transform group-hover:scale-105">
              CS
            </div>
            <div className="flex flex-col">
              <span className="font-extrabold text-sm tracking-tight text-slate-900 group-hover:text-emerald-800">
                CEOSAVDOUZ
              </span>
              <span className="text-[9px] text-emerald-700 font-semibold uppercase tracking-wider -mt-1">
                SaaS Uzbekistan
              </span>
            </div>
          </Link>
        </div>

        {/* Scrollable Navigation */}
        <div className="flex-1 overflow-y-auto">
          <DashboardNav userRole={session.role} />
        </div>

        {/* Bottom Business Card */}
        <div className="p-3 border-t border-slate-100 bg-[#faf9f6]/70">
          <div className="p-2.5 rounded-lg border border-slate-200/80 bg-white text-xs space-y-1">
            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-900 line-clamp-1">{session.businessName}</span>
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
            </div>
            <p className="text-[10px] text-slate-500 font-mono">Ташкент · ID: {session.businessId.slice(-6)}</p>
          </div>
        </div>
      </aside>

      {/* MOBILE DRAWER SIDEBAR */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs transition-opacity"
            onClick={() => setMobileMenuOpen(false)}
          />

          {/* Drawer content */}
          <div className="fixed inset-y-0 left-0 w-72 max-w-[85vw] bg-white shadow-2xl flex flex-col z-50 animate-in slide-in-from-left duration-200">
            <div className="h-16 flex items-center justify-between px-5 border-b border-slate-100">
              <Link
                href="/"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-2.5"
              >
                <div className="w-8 h-8 rounded-lg bg-emerald-700 flex items-center justify-center text-white font-bold text-sm">
                  CS
                </div>
                <span className="font-extrabold text-base tracking-tight text-slate-900">
                  CEOSAVDOUZ
                </span>
              </Link>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="p-1.5 rounded-lg text-slate-500 hover:bg-slate-100"
                aria-label="Закрыть меню"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto">
              <DashboardNav
                userRole={session.role}
                onLinkClick={() => setMobileMenuOpen(false)}
              />
            </div>
          </div>
        </div>
      )}

      {/* MAIN CONTENT WRAPPER */}
      <div className="flex-1 lg:pl-64 flex flex-col min-h-screen">
        <DashboardHeader
          businessName={session.businessName}
          userName={session.name}
          userRole={session.role}
          unreadNotificationsCount={unreadCount}
          onOpenMobileMenu={() => setMobileMenuOpen(true)}
        />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
