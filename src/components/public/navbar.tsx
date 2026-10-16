"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, ArrowRight, LayoutDashboard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { LanguageSwitcher } from "./language-switcher";

const NAV_LINKS = [
  { href: "/features", label: "Возможности" },
  { href: "/pricing", label: "Тарифы" },
  { href: "/about", label: "О платформе" },
  { href: "/contact", label: "Контакты" },
];

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-200/80 bg-white/95 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-lg bg-emerald-700 flex items-center justify-center text-white font-bold text-lg shadow-sm transition-transform group-hover:scale-105">
              CS
            </div>
            <div className="flex flex-col">
              <span className="font-extrabold text-base tracking-tight text-slate-900 group-hover:text-emerald-800 transition-colors">
                CEOSAVDOUZ
              </span>
              <span className="text-[10px] text-emerald-700 font-medium tracking-wider uppercase -mt-1">
                Бизнес-платформа
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-7">
            {NAV_LINKS.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`text-sm font-medium transition-colors ${
                    isActive
                      ? "text-emerald-700 font-semibold"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* Action Buttons & Locale */}
          <div className="hidden md:flex items-center gap-3">
            <LanguageSwitcher />
            <Link href="/login">
              <Button variant="ghost" size="sm" className="text-slate-700 hover:text-slate-900">
                Вход
              </Button>
            </Link>
            <Link href="/register">
              <Button size="sm" className="gap-1.5 shadow-sm">
                <span>Начать бесплатно</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Button>
            </Link>
          </div>

          {/* Mobile hamburger button */}
          <div className="flex md:hidden items-center gap-2">
            <LanguageSwitcher />
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-slate-700 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
              aria-label="Открыть меню"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-slate-200 bg-white px-4 pt-3 pb-6 space-y-4 animate-in slide-in-from-top duration-200">
          <nav className="flex flex-col space-y-2">
            <Link
              href="/"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 text-sm font-medium text-slate-800 hover:bg-slate-50 rounded-md"
            >
              Главная
            </Link>
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-2 text-sm font-medium text-slate-800 hover:bg-slate-50 rounded-md"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="pt-2 border-t border-slate-100 flex flex-col gap-2">
            <Link href="/login" onClick={() => setMobileMenuOpen(false)}>
              <Button variant="outline" className="w-full justify-center">
                Вход в кабинет
              </Button>
            </Link>
            <Link href="/register" onClick={() => setMobileMenuOpen(false)}>
              <Button className="w-full justify-center gap-2">
                <span>Создать аккаунт</span>
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
            <Link href="/dashboard" onClick={() => setMobileMenuOpen(false)}>
              <Button variant="secondary" className="w-full justify-center gap-2 text-emerald-800">
                <LayoutDashboard className="w-4 h-4" />
                <span>Демо панель управления</span>
              </Button>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
