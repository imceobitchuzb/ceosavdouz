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

# 3. Keyboards Helper
def get_main_keyboard(webapp_url: str) -> InlineKeyboardMarkup:
    """Build the main interactive inline keyboard with Web App & Quick Actions"""
    buttons = [
        [
            InlineKeyboardButton(
                text="🚀 Открыть CEOSAVDOUZ (Mini App)",
                web_app=WebAppInfo(url=f"{webapp_url}/dashboard"),
            )
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
            InlineKeyboardButton(text="🌐 Открыть в браузере", url=webapp_url),
            InlineKeyboardButton(text="ℹ️ Помощь и справка", callback_data="nav_help"),
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
    user_name = message.from_user.first_name if message.from_user else "Предприниматель"
    user_id = message.from_user.id if message.from_user else "N/A"
    username = f"@{message.from_user.username}" if message.from_user and message.from_user.username else "без username"

    logger.info(f"User /start command received: {user_name} ({user_id}, {username})")

    welcome_text = (
        f"Здравствуйте, <b>{user_name}</b>! 🇺🇿💼\n\n"
        f"Добро пожаловать в <b>CEOSAVDOUZ</b> — ведущую SaaS-платформу управления бизнесом и торговлей в Узбекистане.\n\n"
        f"🔹 <b>Возможности системы:</b>\n"
        f"• Учет оптовых и розничных продаж (UZS)\n"
        f"• Контроль складских остатков и порога дефицита\n"
        f"• Мониторинг дебиторской задолженности (Nasiya / Долги)\n"
        f"• Финансовая аналитика: выручка, себестоимость, маржа\n"
        f"• Telegram-оповещения о заказах и заканчивающихся товарах\n\n"
        f"👇 <b>Нажмите кнопку ниже, чтобы войти в ваш персональный кабинет:</b>"
    )

    await message.answer(
        welcome_text,
        reply_markup=get_main_keyboard(WEBAPP_URL),
        disable_web_page_preview=True,
    )


@dp.message(Command("help"))
async def handle_help(message: Message):
    """Handle /help command"""
    help_text = (
        "📖 <b>Справочник команд CEOSAVDOUZ:</b>\n\n"
        "• /start — Главное меню и запуск приложения\n"
        "• /status — Состояние платформы и подключение\n"
        "• /help — Данная справочная информация\n\n"
        "💡 <b>Как пользоваться Telegram Mini App:</b>\n"
        "1. Нажмите кнопку <b>«🚀 Открыть CEOSAVDOUZ»</b> внизу экрана или в меню.\n"
        "2. Ваша сессия авторизуется автоматически через защищенный криптографический протокол HMAC-SHA256.\n"
        "3. Вы получите мгновенный доступ к кассе, заказам, отчетам и товарам.\n\n"
        f"🌐 <i>Веб-версия: {WEBAPP_URL}</i>"
    )
    await message.answer(
        help_text,
        reply_markup=InlineKeyboardMarkup(
            inline_keyboard=[
                [
                    InlineKeyboardButton(
                        text="🚀 Войти в CEOSAVDOUZ",
                        web_app=WebAppInfo(url=f"{WEBAPP_URL}/dashboard"),
                    )
                ]
            ]
        ),
        disable_web_page_preview=True,
    )


@dp.message(Command("status"))
async def handle_status(message: Message):
    """Handle /status command"""
    chat_id = message.chat.id
    status_text = (
        "⚡ <b>Статус интеграции CEOSAVDOUZ:</b>\n\n"
        "✅ <b>Telegram Bot API:</b> Подключен (активен)\n"
        f"✅ <b>Ваш Chat ID:</b> <code>{chat_id}</code>\n"
        f"🌐 <b>Адрес WebApp:</b> <code>{WEBAPP_URL}</code>\n"
        "🔒 <b>Криптография:</b> HMAC-SHA-256 WebAppData включена\n"
        "📦 <b>Складские оповещения:</b> Активны\n"
        "🛍️ <b>Уведомления о заказах:</b> Активны\n\n"
        "<i>Используйте Chat ID в настройках вашего бизнеса, чтобы получать прямые отчеты.</i>"
    )
    await message.answer(
        status_text,
        reply_markup=get_main_keyboard(WEBAPP_URL),
        disable_web_page_preview=True,
    )


# 6. Callback Query Handlers
@dp.callback_query(F.data == "nav_products")
async def cb_products(callback: CallbackQuery):
    await callback.answer()
    text = (
        "📦 <b>Управление складом и товарами:</b>\n\n"
        "Просматривайте остатки, закупочные цены, отслеживайте дефицит и добавляйте новые партии товара."
    )
    kb = InlineKeyboardMarkup(
        inline_keyboard=[
            [
                InlineKeyboardButton(
                    text="📦 Открыть каталог товаров",
                    web_app=WebAppInfo(url=f"{WEBAPP_URL}/dashboard/products"),
                )
            ]
        ]
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
        inline_keyboard=[
            [
                InlineKeyboardButton(
                    text="📊 Смотреть аналитику",
                    web_app=WebAppInfo(url=f"{WEBAPP_URL}/dashboard/analytics"),
                )
            ]
        ]
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
        inline_keyboard=[
            [
                InlineKeyboardButton(
                    text="🛒 Открыть кассу POS",
                    web_app=WebAppInfo(url=f"{WEBAPP_URL}/dashboard/orders/new"),
                )
            ]
        ]
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
        inline_keyboard=[
            [
                InlineKeyboardButton(
                    text="👥 Открыть базу клиентов",
                    web_app=WebAppInfo(url=f"{WEBAPP_URL}/dashboard/customers"),
                )
            ]
        ]
    )
    await callback.message.answer(text, reply_markup=kb)


@dp.callback_query(F.data == "nav_help")
async def cb_help(callback: CallbackQuery):
    await callback.answer()
    await handle_help(callback.message)


# 7. Lifecycle & Entrypoint
async def main():
    logger.info("Setting bot commands menu...")
    await bot.set_my_commands(
        [
            BotCommand(command="start", description="Запустить CEOSAVDOUZ и главное меню"),
            BotCommand(command="status", description="Проверить статус интеграции и Chat ID"),
            BotCommand(command="help", description="Справка по работе с платформой"),
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
