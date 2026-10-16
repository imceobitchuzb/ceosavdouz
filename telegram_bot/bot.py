#!/usr/bin/env python3
"""
CEOSAVDOUZ — Telegram Bot & Mini App Integration Service
Framework: Python 3 with aiogram 3.x
Author: Senior Full-Stack & Telegram Mini App Engineer
"""

import os
import sys
import logging
import asyncio
from pathlib import Path
from dotenv import load_dotenv

from aiogram import Bot, Dispatcher, F
from aiogram.client.default import DefaultBotProperties
from aiogram.enums import ParseMode
from aiogram.filters import CommandStart, Command
from aiogram.types import (
    Message,
    CallbackQuery,
    InlineKeyboardMarkup,
    InlineKeyboardButton,
    WebAppInfo,
    BotCommand,
)
from aiogram.exceptions import TelegramBadRequest

# 1. Logging Configuration
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s",
    handlers=[logging.StreamHandler(sys.stdout)],
)
logger = logging.getLogger("ceosavdouz_bot")

# 2. Environment Configuration
current_dir = Path(__file__).resolve().parent
root_dir = current_dir.parent

# Load .env from project root or current dir
load_dotenv(dotenv_path=root_dir / ".env")
load_dotenv(dotenv_path=current_dir / ".env")

BOT_TOKEN = os.getenv("TELEGRAM_BOT_TOKEN")
WEBAPP_URL = os.getenv("WEBAPP_URL", "http://localhost:3000").rstrip("/")

if not BOT_TOKEN:
    logger.critical("TELEGRAM_BOT_TOKEN is not set in environment or .env file!")
    sys.exit(1)

logger.info("Initializing CEOSAVDOUZ Telegram Bot...")
logger.info(f"Target WebApp URL: {WEBAPP_URL}")


# 3. Intelligent Button & Keyboard Helper
def make_button(text: str, path: str = "") -> InlineKeyboardButton:
    """
    Safely creates an InlineKeyboardButton:
    - If URL starts with https://, uses Telegram WebAppInfo (opens inside Telegram as Mini App)
    - If URL is http:// (e.g. localhost), uses standard URL button (avoids Telegram API rejection)
    """
    clean_url = f"{WEBAPP_URL.rstrip('/')}/{path.lstrip('/')}" if path else WEBAPP_URL
    if clean_url.startswith("https://"):
        return InlineKeyboardButton(text=text, web_app=WebAppInfo(url=clean_url))
    return InlineKeyboardButton(text=text, url=clean_url)


def get_main_keyboard() -> InlineKeyboardMarkup:
    """Build the main interactive inline keyboard with Web App & Quick Actions"""
    is_https = WEBAPP_URL.startswith("https://")
    main_button_label = "🚀 Открыть CEOSAVDOUZ (Mini App)" if is_https else "🚀 Открыть CEOSAVDOUZ (Веб)"

    buttons = [
        [
            make_button(main_button_label, "dashboard")
        ],
        [
            InlineKeyboardButton(text="📦 Склад и остатки", callback_data="nav_products"),
            InlineKeyboardButton(text="📊 Аналитика и выручка", callback_data="nav_analytics"),
        ],
        [
            InlineKeyboardButton(text="🛒 Касса / Новый чек", callback_data="nav_pos"),
            InlineKeyboardButton(text="👥 Контрагенты и долги", callback_data="nav_customers"),
        ],
        [
            make_button("🌐 Главная страница", ""),
            InlineKeyboardButton(text="ℹ️ Помощь и статус", callback_data="nav_status"),
        ],
    ]
    return InlineKeyboardMarkup(inline_keyboard=buttons)


# 4. Dispatcher & Bot Initialization
bot = Bot(
    token=BOT_TOKEN,
    default=DefaultBotProperties(parse_mode=ParseMode.HTML),
)
dp = Dispatcher()


# 5. Handlers
@dp.message(CommandStart())
async def handle_start(message: Message):
    """Handle /start command"""
    try:
        user_name = message.from_user.first_name if message.from_user else "Предприниматель"
        user_id = message.from_user.id if message.from_user else "N/A"
        username = f"@{message.from_user.username}" if message.from_user and message.from_user.username else "без username"

        logger.info(f"User /start command received: {user_name} (ID: {user_id}, {username})")

        is_https = WEBAPP_URL.startswith("https://")
        https_hint = ""
        if not is_https:
            https_hint = (
                "\n\n💡 <i>Примечание: Текущий адрес — локальный (HTTP). Для открытия приложения как встроенного "
                "Telegram Mini App на смартфоне укажите публичный HTTPS-адрес (Netlify, Vercel или ngrok) в WEBAPP_URL.</i>"
            )

        welcome_text = (
            f"Здравствуйте, <b>{user_name}</b>! 🇺🇿💼\n\n"
            f"Добро пожаловать в <b>CEOSAVDOUZ</b> — единую экосистему управления бизнесом и торговлей в Узбекистане.\n\n"
            f"🔹 <b>Возможности системы:</b>\n"
            f"• Учет оптовых и розничных продаж (UZS)\n"
            f"• Контроль складских остатков и дефицита\n"
            f"• Мониторинг дебиторской задолженности (Nasiya / Долги)\n"
            f"• Финансовая аналитика: выручка, маржа, средний чек\n"
            f"• Оповещения о заказах и заканчивающихся товарах{https_hint}\n\n"
            f"👇 <b>Нажмите кнопку ниже для перехода в рабочее пространство:</b>"
        )

        await message.answer(
            welcome_text,
            reply_markup=get_main_keyboard(),
            disable_web_page_preview=True,
        )
    except Exception as e:
        logger.exception(f"Error in /start handler: {e}")
        await message.answer(
            f"Здравствуйте! Произошла ошибка при формировании интерфейса: {e}\n"
            f"Ссылка на систему: {WEBAPP_URL}"
        )


@dp.message(Command("help"))
async def handle_help(message: Message):
    """Handle /help command"""
    try:
        help_text = (
            "📖 <b>Справочник команд CEOSAVDOUZ:</b>\n\n"
            "• /start — Главное меню и запуск приложения\n"
            "• /status — Состояние платформы, Chat ID и ссылка\n"
            "• /pos — Рабочее место кассира (оформление чека)\n"
            "• /products — Складские запасы и каталог товаров\n"
            "• /analytics — Сводка по выручке и финансам\n"
            "• /help — Данная справка\n\n"
            f"🌐 <i>Рабочий адрес: {WEBAPP_URL}</i>"
        )
        await message.answer(
            help_text,
            reply_markup=get_main_keyboard(),
            disable_web_page_preview=True,
        )
    except Exception as e:
        logger.exception(f"Error in /help handler: {e}")


@dp.message(Command("status"))
async def handle_status(message: Message):
    """Handle /status command"""
    try:
        chat_id = message.chat.id
        is_https = WEBAPP_URL.startswith("https://")
        status_text = (
            "⚡ <b>Статус интеграции CEOSAVDOUZ:</b>\n\n"
            "✅ <b>Telegram Bot API:</b> Подключен (активен)\n"
            f"✅ <b>Ваш Chat ID:</b> <code>{chat_id}</code>\n"
            f"🌐 <b>Адрес WebApp:</b> <code>{WEBAPP_URL}</code>\n"
            f"🔒 <b>Режим Mini App (HTTPS):</b> {'Активен 🟢' if is_https else 'Ожидает HTTPS 🟡'}\n"
            "📦 <b>Складские оповещения:</b> Активны\n"
            "🛍️ <b>Уведомления о заказах:</b> Активны\n\n"
            "<i>Укажите ваш Chat ID в настройках вашего бизнеса или в файле .env (TELEGRAM_CHAT_ID), чтобы получать прямые отчеты.</i>"
        )
        await message.answer(
            status_text,
            reply_markup=get_main_keyboard(),
            disable_web_page_preview=True,
        )
    except Exception as e:
        logger.exception(f"Error in /status handler: {e}")


@dp.message(Command("pos"))
async def handle_pos_cmd(message: Message):
    kb = InlineKeyboardMarkup(inline_keyboard=[[make_button("🛒 Открыть кассу POS", "dashboard/orders/new")]])
    await message.answer("🛒 <b>Кассовый терминал (POS):</b>", reply_markup=kb)


@dp.message(Command("products"))
async def handle_products_cmd(message: Message):
    kb = InlineKeyboardMarkup(inline_keyboard=[[make_button("📦 Открыть каталог товаров", "dashboard/products")]])
    await message.answer("📦 <b>Склад и остатки товаров:</b>", reply_markup=kb)


@dp.message(Command("analytics"))
async def handle_analytics_cmd(message: Message):
    kb = InlineKeyboardMarkup(inline_keyboard=[[make_button("📊 Смотреть аналитику", "dashboard/analytics")]])
    await message.answer("📊 <b>Аналитика и выручка:</b>", reply_markup=kb)


# 6. Callback Query Handlers
@dp.callback_query(F.data == "nav_products")
async def cb_products(callback: CallbackQuery):
    await callback.answer()
    text = (
        "📦 <b>Управление складом и товарами:</b>\n\n"
        "Просматривайте остатки, закупочные цены, отслеживайте дефицит и добавляйте новые партии товара."
    )
    kb = InlineKeyboardMarkup(
        inline_keyboard=[[make_button("📦 Открыть каталог товаров", "dashboard/products")]]
    )
    await callback.message.answer(text, reply_markup=kb)


@dp.callback_query(F.data == "nav_analytics")
async def cb_analytics(callback: CallbackQuery):
    await callback.answer()
    text = (
        "📊 <b>Финансовая аналитика и выручка:</b>\n\n"
        "Графики продаж за 7/30 дней, структура расходов, средний чек, валовая прибыль."
    )
    kb = InlineKeyboardMarkup(
        inline_keyboard=[[make_button("📊 Смотреть аналитику", "dashboard/analytics")]]
    )
    await callback.message.answer(text, reply_markup=kb)


@dp.callback_query(F.data == "nav_pos")
async def cb_pos(callback: CallbackQuery):
    await callback.answer()
    text = (
        "🛒 <b>Рабочее место кассира (POS):</b>\n\n"
        "Быстрый поиск товаров по штрихкоду/названию, выбор клиента, скидки, оплата нал/карта/в долг (Nasiya)."
    )
    kb = InlineKeyboardMarkup(
        inline_keyboard=[[make_button("🛒 Открыть кассу POS", "dashboard/orders/new")]]
    )
    await callback.message.answer(text, reply_markup=kb)


@dp.callback_query(F.data == "nav_customers")
async def cb_customers(callback: CallbackQuery):
    await callback.answer()
    text = (
        "👥 <b>База клиентов и учет долгов:</b>\n\n"
        "История покупок каждого контрагента, контроль дебиторской задолженности и погашение оплат."
    )
    kb = InlineKeyboardMarkup(
        inline_keyboard=[[make_button("👥 Открыть базу клиентов", "dashboard/customers")]]
    )
    await callback.message.answer(text, reply_markup=kb)


@dp.callback_query(F.data == "nav_status")
async def cb_status(callback: CallbackQuery):
    await callback.answer()
    await handle_status(callback.message)


# 7. Lifecycle & Entrypoint
async def main():
    logger.info("Setting bot commands menu...")
    await bot.set_my_commands(
        [
            BotCommand(command="start", description="Запустить CEOSAVDOUZ и главное меню"),
            BotCommand(command="pos", description="Касса / Оформление чека"),
            BotCommand(command="products", description="Склад и остатки товаров"),
            BotCommand(command="analytics", description="Выручка и аналитика"),
            BotCommand(command="status", description="Проверить статус интеграции"),
            BotCommand(command="help", description="Справка по командам"),
        ]
    )

    logger.info("Dropping pending updates and starting polling...")
    await bot.delete_webhook(drop_pending_updates=True)
    await dp.start_polling(bot)


if __name__ == "__main__":
    try:
        asyncio.run(main())
    except (KeyboardInterrupt, SystemExit):
        logger.info("CEOSAVDOUZ Telegram Bot stopped.")
