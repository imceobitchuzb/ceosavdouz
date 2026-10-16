import crypto from "crypto";

export interface TelegramUser {
  id: number;
  first_name: string;
  last_name?: string;
  username?: string;
  language_code?: string;
  is_premium?: boolean;
}

export interface TelegramValidationResult {
  isValid: boolean;
  user?: TelegramUser;
  authDate?: number;
  error?: string;
}

/**
 * Validates Telegram Mini App initData string according to official Telegram docs
 * https://core.telegram.org/bots/webapps#validating-data-received-via-the-mini-app
 */
export function validateTelegramWebAppData(
  initData: string,
  botToken: string,
  maxAgeSeconds: number = 86400 // 24 hours
): TelegramValidationResult {
  if (!initData || !botToken) {
    return { isValid: false, error: "Отсутствуют initData или токен бота" };
  }

  try {
    const params = new URLSearchParams(initData);
    const hash = params.get("hash");

    if (!hash) {
      return { isValid: false, error: "В initData отсутствует обязательный параметр hash" };
    }

    params.delete("hash");

    // Sort parameters alphabetically
    const keys = Array.from(params.keys()).sort();
    const dataCheckString = keys
      .map((key) => `${key}=${params.get(key)}`)
      .join("\n");

    // Compute secret key = HMAC-SHA256("WebAppData", botToken)
    const secretKey = crypto
      .createHmac("sha256", "WebAppData")
      .update(botToken)
      .digest();

    // Compute hash = HMAC-SHA256(secretKey, dataCheckString)
    const computedHash = crypto
      .createHmac("sha256", secretKey)
      .update(dataCheckString)
      .digest("hex");

    // Constant-time comparison
    const hashBuffer = Buffer.from(hash, "hex");
    const computedBuffer = Buffer.from(computedHash, "hex");

    if (
      hashBuffer.length !== computedBuffer.length ||
      !crypto.timingSafeEqual(hashBuffer, computedBuffer)
    ) {
      return { isValid: false, error: "Неверная подпись HMAC Telegram" };
    }

    // Check auth_date expiration
    const authDateStr = params.get("auth_date");
    if (!authDateStr) {
      return { isValid: false, error: "Отсутствует auth_date" };
    }

    const authDate = parseInt(authDateStr, 10);
    const currentTime = Math.floor(Date.now() / 1000);

    if (currentTime - authDate > maxAgeSeconds) {
      return { isValid: false, error: "Срок действия сессии Telegram истек" };
    }

    // Parse user JSON
    const userJson = params.get("user");
    let user: TelegramUser | undefined = undefined;
    if (userJson) {
      try {
        user = JSON.parse(userJson) as TelegramUser;
      } catch {
        // user parsing error ignored
      }
    }

    return {
      isValid: true,
      user,
      authDate,
    };
  } catch (err: any) {
    return {
      isValid: false,
      error: `Ошибка проверки подписи Telegram: ${err.message}`,
    };
  }
}
