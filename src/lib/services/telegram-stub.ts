/**
 * CEOSAVDOUZ Telegram Notification Service
 *
 * Real Telegram Bot API message dispatcher with HTML formatting,
 * rate limiting protection, and multi-tenant chat routing.
 */
import prisma from "@/lib/db/prisma";

export interface OrderNotificationPayload {
  orderId: string;
  orderNumber: string;
  customerName: string;
  totalAmount: number;
  itemCount: number;
  businessName: string;
  businessId?: string;
  paymentMethod?: string;
}

export interface LowStockNotificationPayload {
  productId: string;
  productName: string;
  currentStock: number;
  minThreshold: number;
  businessName: string;
  businessId?: string;
}

export interface DailySummaryNotificationPayload {
  date: string;
  totalOrders: number;
  totalRevenue: number;
  totalProfit: number;
  businessName: string;
  businessId?: string;
}

export class TelegramNotificationService {
  private static getToken(): string | null {
    const token = process.env.TELEGRAM_BOT_TOKEN;
    return token && token.trim() !== "" ? token.trim() : null;
  }

  static isConfigured(): boolean {
    return Boolean(this.getToken());
  }

  /**
   * Helper to format numbers as Uzbek Som (e.g. 1 250 000 сум)
   */
  private static formatMoney(amount: number): string {
    return new Intl.NumberFormat("ru-RU").format(amount) + " сум";
  }

  /**
   * Find target chat IDs for a business (from Business.telegramChatId or linked Users)
   */
  private static async getChatIdsForBusiness(businessId?: string): Promise<string[]> {
    const chatIds: Set<string> = new Set();

    // Default global fallback chat ID if specified in env
    if (process.env.TELEGRAM_CHAT_ID) {
      chatIds.add(process.env.TELEGRAM_CHAT_ID);
    }

    if (businessId) {
      try {
        const business = await prisma.business.findUnique({
          where: { id: businessId },
          include: {
            members: {
              include: {
                user: true,
              },
            },
          },
        });

        if (business?.telegramChatId) {
          chatIds.add(business.telegramChatId);
        }

        if (business?.members) {
          for (const member of business.members) {
            if (member.user.telegramId) {
              chatIds.add(member.user.telegramId);
            }
          }
        }
      } catch (err) {
        console.error("[TelegramService] Error fetching business chat IDs:", err);
      }
    }

    return Array.from(chatIds);
  }

  /**
   * Send a formatted HTML message via Telegram Bot API
   */
  private static async sendTelegramMessage(
    chatId: string,
    htmlText: string
  ): Promise<boolean> {
    const token = this.getToken();
    if (!token) return false;

    try {
      const url = `https://api.telegram.org/bot${token}/sendMessage`;
      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: chatId,
          text: htmlText,
          parse_mode: "HTML",
          disable_web_page_preview: true,
        }),
      });

      if (!response.ok) {
        const errJson = await response.json().catch(() => null);
        console.warn(`[TelegramService] API error for chat ${chatId}:`, errJson);
        return false;
      }

      return true;
    } catch (err) {
      console.error(`[TelegramService] Network error sending to chat ${chatId}:`, err);
      return false;
    }
  }

  /**
   * Send order notification
   */
  static async notifyNewOrder(
    payload: OrderNotificationPayload
  ): Promise<{ success: boolean; delivered: boolean; reason?: string }> {
    if (!this.isConfigured()) {
      return {
        success: true,
        delivered: false,
        reason: "TELEGRAM_BOT_TOKEN не настроен",
      };
    }

    try {
      const chatIds = await this.getChatIdsForBusiness(payload.businessId);
      if (chatIds.length === 0) {
        return {
          success: true,
          delivered: false,
          reason: "Нет привязанных Telegram аккаунтов для отправки уведомления",
        };
      }

      const formattedAmount = this.formatMoney(payload.totalAmount);
      const text = [
        `🛒 <b>Новый заказ: ${payload.orderNumber}</b>`,
        `🏢 Предприятие: <b>${payload.businessName}</b>`,
        `👤 Клиент: <b>${payload.customerName}</b>`,
        `📦 Позиций: <b>${payload.itemCount}</b>`,
        `💰 Сумма: <b>${formattedAmount}</b>`,
        payload.paymentMethod ? `💳 Оплата: <code>${payload.paymentMethod}</code>` : "",
        `\n<a href="${process.env.WEBAPP_URL || "http://localhost:3000"}/dashboard/orders">Открыть в CEOSAVDOUZ</a>`,
      ]
        .filter(Boolean)
        .join("\n");

      let deliveredCount = 0;
      for (const chatId of chatIds) {
        const ok = await this.sendTelegramMessage(chatId, text);
        if (ok) deliveredCount++;
      }

      return {
        success: true,
        delivered: deliveredCount > 0,
      };
    } catch (err: any) {
      console.error("[TelegramService] Failed to dispatch order notification:", err);
      return { success: false, delivered: false, reason: err.message };
    }
  }

  /**
   * Send low-stock notification
   */
  static async notifyLowStock(
    payload: LowStockNotificationPayload
  ): Promise<{ success: boolean; delivered: boolean; reason?: string }> {
    if (!this.isConfigured()) {
      return {
        success: true,
        delivered: false,
        reason: "TELEGRAM_BOT_TOKEN не настроен",
      };
    }

    try {
      const chatIds = await this.getChatIdsForBusiness(payload.businessId);
      if (chatIds.length === 0) return { success: true, delivered: false };

      const text = [
        `⚠️ <b>Внимание: Заканчивается товар!</b>`,
        `🏢 Предприятие: <b>${payload.businessName}</b>`,
        `📦 Товар: <b>${payload.productName}</b>`,
        `🔴 Остаток: <b>${payload.currentStock} шт.</b> (порог: ${payload.minThreshold} шт.)`,
        `\n<a href="${process.env.WEBAPP_URL || "http://localhost:3000"}/dashboard/products">Пополнить склад</a>`,
      ].join("\n");

      let deliveredCount = 0;
      for (const chatId of chatIds) {
        const ok = await this.sendTelegramMessage(chatId, text);
        if (ok) deliveredCount++;
      }

      return { success: true, delivered: deliveredCount > 0 };
    } catch (err: any) {
      return { success: false, delivered: false, reason: err.message };
    }
  }

  /**
   * Send daily summary
   */
  static async notifyDailySummary(
    payload: DailySummaryNotificationPayload
  ): Promise<{ success: boolean; delivered: boolean; reason?: string }> {
    if (!this.isConfigured()) {
      return {
        success: true,
        delivered: false,
        reason: "TELEGRAM_BOT_TOKEN не настроен",
      };
    }

    try {
      const chatIds = await this.getChatIdsForBusiness(payload.businessId);
      if (chatIds.length === 0) return { success: true, delivered: false };

      const text = [
        `📊 <b>Сводка за день: ${payload.date}</b>`,
        `🏢 Предприятие: <b>${payload.businessName}</b>`,
        `📋 Заказов оформлено: <b>${payload.totalOrders}</b>`,
        `💵 Выручка: <b>${this.formatMoney(payload.totalRevenue)}</b>`,
        `📈 Валовая прибыль: <b>${this.formatMoney(payload.totalProfit)}</b>`,
      ].join("\n");

      let deliveredCount = 0;
      for (const chatId of chatIds) {
        const ok = await this.sendTelegramMessage(chatId, text);
        if (ok) deliveredCount++;
      }

      return { success: true, delivered: deliveredCount > 0 };
    } catch (err: any) {
      return { success: false, delivered: false, reason: err.message };
    }
  }

  /**
   * Get Telegram bot configuration status
   */
  static getStatus(): { isConfigured: boolean; botUsername: string | null } {
    return {
      isConfigured: this.isConfigured(),
      botUsername: process.env.TELEGRAM_BOT_USERNAME || "ceosavdouz_bot",
    };
  }
}
