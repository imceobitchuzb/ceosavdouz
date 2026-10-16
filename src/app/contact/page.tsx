"use client";

import * as React from "react";
import { Navbar } from "@/components/public/navbar";
import { Footer } from "@/components/public/footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Phone, Mail, MapPin, Send, CheckCircle2 } from "lucide-react";

export default function ContactPage() {
  const [submitted, setSubmitted] = React.useState(false);
  const [formData, setFormData] = React.useState({
    name: "",
    phone: "",
    businessName: "",
    message: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      <main className="flex-1">
        {/* Header */}
        <section className="py-16 bg-gradient-to-b from-white to-[#faf9f6] border-b border-slate-200 text-center">
          <div className="max-w-4xl mx-auto px-4 space-y-4">
            <Badge variant="outline" className="border-emerald-200 text-emerald-800 bg-emerald-50">
              Связь с командой
            </Badge>
            <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight">
              Мы на связи в Ташкенте
            </h1>
            <p className="text-base sm:text-lg text-slate-600 max-w-xl mx-auto">
              Есть вопросы по внедрению, тарифам или индивидуальной интеграции? Напишите нам или позвоните.
            </p>
          </div>
        </section>

        {/* Form and Contacts */}
        <section className="py-16 bg-white">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              {/* Contact Information */}
              <div className="space-y-8">
                <div>
                  <h2 className="text-2xl font-bold text-slate-900 mb-2">
                    Контакты отдела продаж и поддержки
                  </h2>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    Консультируем предпринимателей с понедельника по субботу с 09:00 до 19:00 по времени Ташкента.
                  </p>
                </div>

                <div className="space-y-5 text-sm">
                  <div className="flex items-start gap-3.5 p-4 rounded-xl border border-slate-200 bg-[#faf9f6]">
                    <MapPin className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-bold text-slate-900">Офис в Ташкенте</p>
                      <p className="text-slate-600 text-xs mt-0.5">г. Ташкент, Яккасарайский район, ул. Шота Руставели, бизнес-центр</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3.5 p-4 rounded-xl border border-slate-200 bg-[#faf9f6]">
                    <Phone className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-bold text-slate-900">Телефонная линия</p>
                      <p className="text-slate-600 text-xs font-mono mt-0.5">+998 (71) 200-00-00</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3.5 p-4 rounded-xl border border-slate-200 bg-[#faf9f6]">
                    <Mail className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-bold text-slate-900">Электронная почта</p>
                      <p className="text-slate-600 text-xs font-mono mt-0.5">support@ceosavdouz.uz</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Form */}
              <div className="p-8 rounded-2xl border border-slate-200 bg-[#faf9f6] shadow-sm">
                {submitted ? (
                  <div className="py-12 text-center space-y-4">
                    <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center mx-auto">
                      <CheckCircle2 className="w-8 h-8" />
                    </div>
                    <h3 className="text-xl font-bold text-slate-900">Спасибо за обращение!</h3>
                    <p className="text-xs text-slate-600 max-w-sm mx-auto leading-relaxed">
                      Ваш запрос успешно отправлен. Наш специалист свяжется с вами по указанному телефону в течение рабочего дня.
                    </p>
                    <Button variant="outline" size="sm" onClick={() => setSubmitted(false)}>
                      Отправить еще одно сообщение
                    </Button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <h3 className="text-lg font-bold text-slate-900 mb-1">
                      Форма обратной связи
                    </h3>
                    <p className="text-xs text-slate-500 mb-4">
                      Заполните поля, и мы подготовим персональную консультацию для вашего бизнеса.
                    </p>

                    <div>
                      <label className="block text-xs font-medium text-slate-700 mb-1">
                        Ваше имя <span className="text-rose-500">*</span>
                      </label>
                      <Input
                        required
                        placeholder="Например, Азиз"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-slate-700 mb-1">
                        Номер телефона в Узбекистане <span className="text-rose-500">*</span>
                      </label>
                      <Input
                        required
                        placeholder="+998 90 123 45 67"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-slate-700 mb-1">
                        Название компании или магазина
                      </label>
                      <Input
                        placeholder="Например, Магазин одежды или ИП"
                        value={formData.businessName}
                        onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-slate-700 mb-1">
                        Сообщение или вопрос <span className="text-rose-500">*</span>
                      </label>
                      <textarea
                        required
                        rows={4}
                        className="w-full rounded-md border border-slate-200 bg-white p-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 focus-visible:border-emerald-600"
                        placeholder="Опишите ваши задачи: количество товаров, число кассиров, вопросы по интеграции..."
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      />
                    </div>

                    <Button type="submit" className="w-full gap-2 shadow-sm">
                      <Send className="w-4 h-4" />
                      <span>Отправить сообщение</span>
                    </Button>
                  </form>
                )}
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
