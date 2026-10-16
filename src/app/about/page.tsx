import { Navbar } from "@/components/public/navbar";
import { Footer } from "@/components/public/footer";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, Target, HeartHandshake, Zap, ShieldCheck } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      <main className="flex-1">
        {/* Hero */}
        <section className="py-16 bg-gradient-to-b from-white to-[#faf9f6] border-b border-slate-200 text-center">
          <div className="max-w-4xl mx-auto px-4 space-y-4">
            <Badge variant="outline" className="border-emerald-200 text-emerald-800 bg-emerald-50">
              О платформе
            </Badge>
            <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight">
              Миссия CEOSAVDOUZ — цифровой порядок в каждом бизнесе
            </h1>
            <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
              Мы создаем современное и быстрое программное обеспечение для предпринимателей Узбекистана, избавляя от рутины и давая полную прозрачность в продажах, складе и финансах.
            </p>
          </div>
        </section>

        {/* Story & Context */}
        <section className="py-16 bg-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
            <div className="space-y-4 text-slate-700 text-sm sm:text-base leading-relaxed">
              <h2 className="text-2xl font-bold text-slate-900">
                Почему мы создали CEOSAVDOUZ
              </h2>
              <p>
                Экономика Узбекистана переживает стремительное развитие торговли: тысячи магазинов, оптовых складов и интернет-продавцов ежедневно совершают десятки тысяч операций. Однако большинство предпринимателей до сих пор вынуждены вести учет в бумажных тетрадях или сложных Excel-файлах, которые часто теряются, содержат ошибки и не дают увидеть реальную чистую прибыль.
              </p>
              <p>
                Зарубежные CRM и ERP-системы часто перегружены ненужным функционалом, сложны во внедрении, не поддерживают узбекский сум без конвертаций и не учитывают локальную специфику — торговлю в рассрочку (насия), частичные оплаты наличными и через национальные платежные карты.
              </p>
              <p>
                <strong>CEOSAVDOUZ</strong> был спроектирован с чистого листа именно под требования локального рынка: скорость работы, удобство на смартфоне, надежная изоляция данных каждого предприятия и интуитивно понятные отчеты.
              </p>
            </div>

            {/* Principles */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6">
              <div className="p-6 rounded-xl border border-slate-200 bg-[#faf9f6] space-y-3">
                <div className="w-10 h-10 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center">
                  <Target className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-slate-900 text-base">Простота и скорость</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Обучение нового кассира или менеджера занимает не более 15 минут. Интерфейс лаконичен и не перегружен лишними техническими терминами.
                </p>
              </div>

              <div className="p-6 rounded-xl border border-slate-200 bg-[#faf9f6] space-y-3">
                <div className="w-10 h-10 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-slate-900 text-base">Безопасность и изоляция</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Каждая компания работает в строго изолированном контуре данных. Ваши обороты, клиентская база и себестоимость товаров защищены от несанкционированного доступа.
                </p>
              </div>

              <div className="p-6 rounded-xl border border-slate-200 bg-[#faf9f6] space-y-3">
                <div className="w-10 h-10 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center">
                  <HeartHandshake className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-slate-900 text-base">Уважение к местной коммерческой культуре</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Встроенная поддержка расчетов в сумах (UZS), контроль долговых списков клиентов и оперативная адаптация под новые требования законодательства РУз.
                </p>
              </div>

              <div className="p-6 rounded-xl border border-slate-200 bg-[#faf9f6] space-y-3">
                <div className="w-10 h-10 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center">
                  <Zap className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-slate-900 text-base">Инженерная надежность</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Современный технологический стек на базе Next.js, строгой типизации TypeScript и реляционной базы данных с поддержкой транзакций для каждой складской операции.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
