/**
 * Localization and formatting utilities for CEOSAVDOUZ (Uzbekistan market)
 */

/**
 * Format monetary amount into Uzbek Som (UZS)
 * Example: 12500000 -> "12 500 000 сум"
 */
export function formatUZS(amount: number | null | undefined, suffix: string = " сум"): string {
  if (amount === null || amount === undefined || isNaN(amount)) {
    return `0${suffix}`;
  }
  // Round to nearest integer (in Uzbekistan commercial practice, coins/fractions do not circulate)
  const rounded = Math.round(amount);
  const formatted = rounded.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
  return `${formatted}${suffix}`;
}

/**
 * Format standard Uzbek phone number
 * Inputs: "998901234567", "+998901234567", "901234567"
 * Output: "+998 (90) 123-45-67"
 */
export function formatUzbekPhone(phone: string | null | undefined): string {
  if (!phone) return "—";
  const cleaned = phone.replace(/\D/g, "");
  
  let target = cleaned;
  if (target.startsWith("998") && target.length >= 12) {
    target = target.slice(3);
  } else if (target.length === 9) {
    // Already without country code
  } else {
    return phone; // Return original if unknown format
  }

  const code = target.slice(0, 2);
  const part1 = target.slice(2, 5);
  const part2 = target.slice(5, 7);
  const part3 = target.slice(7, 9);

  return `+998 (${code}) ${part1}-${part2}-${part3}`;
}

/**
 * Format date in Tashkent timezone with Russian / Uzbek months
 */
export function formatLocalDatetime(date: string | Date | null | undefined, includeTime: boolean = true): string {
  if (!date) return "—";
  const d = typeof date === "string" ? new Date(date) : date;
  if (isNaN(d.getTime())) return "—";

  const options: Intl.DateTimeFormatOptions = {
    timeZone: "Asia/Tashkent",
    year: "numeric",
    month: "short",
    day: "numeric",
    ...(includeTime ? { hour: "2-digit", minute: "2-digit" } : {}),
  };

  return new Intl.DateTimeFormat("ru-RU", options).format(d);
}

/**
 * Format relative date (Today, Yesterday, or formatted date)
 */
export function formatRelativeDate(date: string | Date | null | undefined): string {
  if (!date) return "—";
  const d = typeof date === "string" ? new Date(date) : date;
  if (isNaN(d.getTime())) return "—";

  const now = new Date();
  const diffDays = Math.floor((now.getTime() - d.getTime()) / (1000 * 60 * 60 * 24));

  if (diffDays === 0) {
    return "Сегодня, " + d.toLocaleTimeString("ru-RU", { hour: "2-digit", minute: "2-digit", timeZone: "Asia/Tashkent" });
  } else if (diffDays === 1) {
    return "Вчера, " + d.toLocaleTimeString("ru-RU", { hour: "2-digit", minute: "2-digit", timeZone: "Asia/Tashkent" });
  }

  return formatLocalDatetime(d, false);
}

/**
 * Status helpers for orders
 */
export const ORDER_STATUSES: Record<string, { label: string; color: string; badge: string }> = {
  PENDING: { label: "Новый", color: "text-amber-700 bg-amber-50 border-amber-200", badge: "Новый" },
  PROCESSING: { label: "В обработке", color: "text-blue-700 bg-blue-50 border-blue-200", badge: "В обработке" },
  COMPLETED: { label: "Выполнен", color: "text-emerald-700 bg-emerald-50 border-emerald-200", badge: "Выполнен" },
  CANCELLED: { label: "Отменен", color: "text-rose-700 bg-rose-50 border-rose-200", badge: "Отменен" },
};

/**
 * Status helpers for payments
 */
export const PAYMENT_STATUSES: Record<string, { label: string; color: string }> = {
  UNPAID: { label: "Не оплачен", color: "text-rose-700 bg-rose-50 border-rose-200" },
  PARTIAL: { label: "Частично", color: "text-amber-700 bg-amber-50 border-amber-200" },
  PAID: { label: "Оплачен", color: "text-emerald-700 bg-emerald-50 border-emerald-200" },
};

/**
 * Payment methods
 */
export const PAYMENT_METHODS: Record<string, string> = {
  CASH: "Наличные",
  CARD: "Uzcard / Humo",
  BANK_TRANSFER: "Банковский перевод",
};

/**
 * Role translations
 */
export const USER_ROLES: Record<string, string> = {
  OWNER: "Владелец",
  ADMIN: "Администратор",
  MANAGER: "Менеджер продаж",
  CASHIER: "Кассир",
};
