import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "CEOSAVDOUZ — Система управления бизнесом в Узбекистане",
  description:
    "Премиальная SaaS-платформа для автоматизации торговли, складского учета, контроля дебиторской задолженности и аналитики для предпринимателей Узбекистана.",
  keywords: [
    "SaaS Узбекистан",
    "управление торговлей Ташкент",
    "автоматизация магазина",
    "учет товаров UZS",
    "CRM для малого бизнеса",
    "CEOSAVDOUZ",
  ],
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ru" className="scroll-smooth">
      <body className="min-h-screen bg-[#faf9f6] text-slate-900 font-sans antialiased flex flex-col">
        {children}
      </body>
    </html>
  );
}
