import { Navbar } from "@/components/public/navbar";
import { Footer } from "@/components/public/footer";

export default function TermsPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      <main className="flex-1 py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 text-slate-800 text-sm leading-relaxed">
          <div className="border-b border-slate-200 pb-6">
            <h1 className="text-3xl font-extrabold text-slate-900">
              Пользовательское соглашение и оферта
            </h1>
            <p className="text-xs text-slate-500 mt-2">
              Редакция от 16 октября 2026 г. · Платформа управления бизнесом CEOSAVDOUZ
            </p>
          </div>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-slate-900">1. Предмет соглашения</h2>
            <p>
              Настоящий документ регулирует условия предоставления доступа к SaaS-платформе <strong>CEOSAVDOUZ</strong> для юридических лиц и индивидуальных предпринимателей в целях автоматизации торговых, складских и финансовых операций.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-slate-900">2. Порядок предоставления сервиса</h2>
            <p>
              Сервис предоставляется по модели подписки (SaaS). Каждому новому зарегистрированному предприятию предоставляется бесплатный тестовый период сроком 14 (четырнадцать) календарных дней.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-slate-900">3. Обязанности и ответственность сторон</h2>
            <p>
              Пользователь несет ответственность за сохранность учетных данных своих сотрудников и правомерность внесения персональных данных конечных покупателей. Платформа обязуется обеспечивать непрерывную доступность сервиса и сохранность сформированных баз данных.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-slate-900">4. Порядок оплаты и закрывающие документы</h2>
            <p>
              Оплата платных тарифов осуществляется в национальной валюте Республики Узбекистан — сумах (UZS) посредством банковского перевода или корпоративных платежных карт. Юридическим лицам оформляются электронные счета-фактуры (ЭСФ).
            </p>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}
