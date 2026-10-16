"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";

declare global {
  interface Window {
    Telegram?: {
      WebApp?: {
        ready: () => void;
        expand: () => void;
        close: () => void;
        initData: string;
        initDataUnsafe?: {
          user?: {
            id: number;
            first_name: string;
            last_name?: string;
            username?: string;
            language_code?: string;
          };
          auth_date?: number;
          hash?: string;
        };
        setHeaderColor?: (color: string) => void;
        setBackgroundColor?: (color: string) => void;
        MainButton?: {
          text: string;
          show: () => void;
          hide: () => void;
          enable: () => void;
          disable: () => void;
          onClick: (fn: () => void) => void;
        };
      };
    };
  }
}

export function TelegramMiniAppProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [isTelegram, setIsTelegram] = useState(false);
  const [isAuthenticating, setIsAuthenticating] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined" || !window.Telegram?.WebApp) return;

    const tg = window.Telegram.WebApp;
    tg.ready();
    tg.expand();

    try {
      if (tg.setHeaderColor) tg.setHeaderColor("#064e3b");
      if (tg.setBackgroundColor) tg.setBackgroundColor("#faf9f6");
    } catch {
      // Ignore theme color setting errors on older Telegram clients
    }

    if (tg.initData && tg.initData.length > 0) {
      setIsTelegram(true);

      // If user is on landing or auth pages inside Telegram Web App, auto-login into dashboard
      const isAuthPage =
        pathname === "/login" ||
        pathname === "/register" ||
        pathname === "/";

      // Verify current session first
      fetch("/api/auth/me")
        .then((res) => {
          if (!res.ok) {
            setIsAuthenticating(true);
            return fetch("/api/auth/telegram", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ initData: tg.initData }),
            })
              .then((authRes) => authRes.json())
              .then((data) => {
                if (data.success) {
                  if (isAuthPage) {
                    router.push("/dashboard");
                  } else {
                    router.refresh();
                  }
                }
              })
              .catch((err) => {
                console.error("Auto Telegram auth failed:", err);
              })
              .finally(() => {
                setIsAuthenticating(false);
              });
          }
        })
        .catch(() => {});
    }
  }, [pathname, router]);

  return (
    <>
      {isAuthenticating && (
        <div className="fixed top-0 left-0 right-0 z-50 bg-emerald-700 text-white text-xs py-1.5 px-4 text-center font-medium shadow-md flex items-center justify-center gap-2">
          <svg
            className="animate-spin h-3.5 w-3.5 text-white"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8v8H4z"
            />
          </svg>
          Вход через Telegram аккаунт...
        </div>
      )}
      {children}
    </>
  );
}
