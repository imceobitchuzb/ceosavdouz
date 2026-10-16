"use client";

import * as React from "react";
import { Globe, Check } from "lucide-react";

export function LanguageSwitcher() {
  const [isOpen, setIsOpen] = React.useState(false);
  const [currentLang, setCurrentLang] = React.useState<"ru" | "uz">("ru");
  const [toastMessage, setToastMessage] = React.useState<string | null>(null);

  const handleSelect = (lang: "ru" | "uz") => {
    if (lang === "uz") {
      setToastMessage("O'zbek tili (Lotin) lokallashuvi tez kunda kutilmoqda. Hozirda asosiy interfeys rus tilida ishlamoqda.");
      setTimeout(() => setToastMessage(null), 4000);
    } else {
      setCurrentLang("ru");
    }
    setIsOpen(false);
  };

  return (
    <div className="relative inline-block text-left">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium text-slate-700 bg-white border border-slate-200 rounded-md hover:bg-slate-50 transition-colors shadow-2xs"
        aria-label="Выбрать язык"
      >
        <Globe className="w-3.5 h-3.5 text-emerald-700" />
        <span>{currentLang === "ru" ? "Русский" : "O'zbekcha"}</span>
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute right-0 mt-1.5 w-48 rounded-md bg-white border border-slate-200 shadow-lg py-1 z-50 text-xs">
            <button
              onClick={() => handleSelect("ru")}
              className="w-full text-left px-3 py-2 flex items-center justify-between hover:bg-slate-50 transition-colors"
            >
              <span className="font-medium text-slate-900">Русский (Основной)</span>
              {currentLang === "ru" && <Check className="w-3.5 h-3.5 text-emerald-600" />}
            </button>
            <button
              onClick={() => handleSelect("uz")}
              className="w-full text-left px-3 py-2 flex items-center justify-between hover:bg-slate-50 transition-colors text-slate-600"
            >
              <div className="flex flex-col">
                <span className="font-medium text-slate-800">O&apos;zbekcha</span>
                <span className="text-[10px] text-emerald-600">Tez kunda / В разработке</span>
              </div>
              {currentLang === "uz" && <Check className="w-3.5 h-3.5 text-emerald-600" />}
            </button>
          </div>
        </>
      )}

      {toastMessage && (
        <div className="fixed bottom-4 right-4 z-50 max-w-sm bg-slate-900 text-white px-4 py-3 rounded-lg shadow-xl text-xs flex items-center gap-2 animate-in fade-in slide-in-from-bottom-2">
          <Globe className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
}
