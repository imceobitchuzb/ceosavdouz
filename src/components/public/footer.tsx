import Link from "next/link";
import { Mail, Phone, MapPin, ShieldCheck, Heart } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-slate-950 text-slate-300 pt-16 pb-12 border-t border-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-slate-800/80">
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="w-9 h-9 rounded-lg bg-emerald-600 flex items-center justify-center text-white font-bold text-lg shadow-sm">
                CS
              </div>
              <div className="flex flex-col">
                <span className="font-extrabold text-base tracking-tight text-white">
                  CEOSAVDOUZ
                </span>
                <span className="text-[10px] text-emerald-400 font-medium tracking-wider uppercase">
                  Управление бизнесом в Узбекистане
                </span>
              </div>
            </Link>
            <p className="text-sm text-slate-400 max-w-sm leading-relaxed">
              Современная экосистема для малого и среднего бизнеса Узбекистана: продажи, учет товаров, контроль дебиторской задолженности и финансовая аналитика в реальном времени.
            </p>
            <div className="flex items-center gap-3 pt-1 text-xs text-slate-400">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-slate-900 border border-slate-800 text-emerald-400">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Изолированная база данных</span>
              </span>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-slate-900 border border-slate-800 text-slate-300">
                <span>Валюта: UZS (Сум)</span>
              </span>
            </div>
          </div>

          {/* Product Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold text-white uppercase tracking-wider">
              Продукт
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/features" className="hover:text-emerald-400 transition-colors">
                  Все возможности
                </Link>
              </li>
              <li>
                <Link href="/pricing" className="hover:text-emerald-400 transition-colors">
                  Тарифные планы
                </Link>
              </li>
              <li>
                <Link href="/dashboard" className="hover:text-emerald-400 transition-colors text-emerald-400 font-medium">
                  Демо-кабинет
                </Link>
              </li>
              <li>
                <Link href="/register" className="hover:text-emerald-400 transition-colors">
                  Регистрация
                </Link>
              </li>
            </ul>
          </div>

          {/* Company & Support */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold text-white uppercase tracking-wider">
              Компания
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/about" className="hover:text-emerald-400 transition-colors">
                  О платформе
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-emerald-400 transition-colors">
                  Связаться с нами
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="hover:text-emerald-400 transition-colors">
                  Политика конфиденциальности
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-emerald-400 transition-colors">
                  Условия использования
                </Link>
              </li>
            </ul>
          </div>

          {/* Local Contact Info */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold text-white uppercase tracking-wider">
              Локация и контакты
            </h4>
            <ul className="space-y-2.5 text-xs text-slate-400">
              <li className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>г. Ташкент, Яккасарайский р-н, ул. Шота Руставели</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-emerald-400 shrink-0" />
                <span className="font-mono text-slate-300">+998 (71) 200-00-00</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-emerald-400 shrink-0" />
                <span className="font-mono text-slate-300">support@ceosavdouz.uz</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© {new Date().getFullYear()} CEOSAVDOUZ. Все права защищены. Разработано для бизнеса Узбекистана.</p>
          <div className="flex items-center gap-6">
            <Link href="/privacy" className="hover:text-slate-300 transition-colors">
              Конфиденциальность
            </Link>
            <Link href="/terms" className="hover:text-slate-300 transition-colors">
              Оферта
            </Link>
            <span className="inline-flex items-center gap-1 text-slate-500">
              Сделано с <Heart className="w-3 h-3 text-rose-500 fill-rose-500" /> в Ташкенте
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
