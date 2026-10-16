import { Navbar } from "@/components/public/navbar";
import { Footer } from "@/components/public/footer";

export default function PrivacyPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      <main className="flex-1 py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 text-slate-800 text-sm leading-relaxed">
          <div className="border-b border-slate-200 pb-6">
            <h1 className="text-3xl font-extrabold text-slate-900">
              Политика конфиденциальности
            </h1>
            <p className="text-xs text-slate-500 mt-2">
              Редакция от 16 октября 2026 г. · Применимое законодательство: Республика Узбекистан (Закон «О персональных данных»)
            </p>
          </div>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-slate-900">1. Общие положения</h2>
            <p>
              Настоящая Политика определяет порядок обработки и защиты информации о пользователях сервиса <strong>CEOSAVDOUZ</strong> (далее — «Платформа»), принадлежащего разработчикам платформы на территории Республики Узбекистан.
            </p>
            <p>
              Мы с уважением относимся к конфиденциальности вашей коммерческой информации, базы клиентов и данных финансового учета.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-slate-900">2. Состав собираемых данных</h2>
            <p>
              При использовании платформы обрабатываются следующие категории данных:
            </p>
            <ul className="list-disc pl-5 space-y-1 text-xs text-slate-600">
              <li>Регистрационные данные: имя, номер телефона (+998), email, наименование предприятия, ИНН;</li>
              <li>Служебные данные учетной записи: хешированные пароли, идентификаторы сессий, лог авторизаций;</li>
              <li>Коммерческие данные предприятия: справочники номенклатуры, складские остатки, заказы, задолженности контрагентов, транзакции.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-slate-900">3. Изоляция и защита информации</h2>
            <p>
              Платформа реализует строгую программную мультиарендную изоляцию (Tenant Isolation). Данные одной компании недоступны пользователям других учетных записей. Все соединения шифруются по протоколу TLS. Пароли пользователей хранятся исключительно в виде криптографических хешей bcrypt.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-slate-900">4. Контакты службы защиты данных</h2>
            <p>
              По вопросам удаления данных или запроса копии архива обращайтесь по адресу электронной почты: <span className="font-mono text-emerald-700">privacy@ceosavdouz.uz</span>.
            </p>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}
