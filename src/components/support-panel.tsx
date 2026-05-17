"use client";

import { getTelHref, SITE_PHONE_DISPLAY } from "@/lib/phone";
import { getWhatsAppUrl } from "@/lib/whatsapp";
import { Headphones, MessagesSquare } from "lucide-react";

export function SupportPanel() {
  return (
    <section className="py-16 bg-white border-t border-slate-100" dir="rtl">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Title */}
        <h2 className="text-2xl md:text-3xl font-[1000] text-slate-800 text-center mb-10 select-none">
          محتاج مساعدة؟ <span className="text-primary">تواصل معانا</span>
        </h2>

        {/* Support Options Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Card 2: Contact Sales */}
          <a
            href={getTelHref()}
            className="flex items-center justify-between gap-4 p-5 md:p-6 bg-white border border-slate-100 rounded-2xl shadow-sm hover:shadow-md hover:border-primary/20 transition-all duration-300 group"
          >
            {/* Left Side: Headset Icon */}
            <div className="flex items-center justify-center h-12 w-12 rounded-xl bg-slate-50 text-slate-600 group-hover:bg-primary/5 group-hover:text-primary transition-colors shrink-0">
              <Headphones className="h-6 w-6" />
            </div>

            {/* Right Side: Text */}
            <div className="text-right flex-1">
              <h3 className="text-base md:text-lg font-black text-slate-800 mb-1 group-hover:text-primary transition-colors">
                اتصل بالمبيعات
              </h3>
              <p className="text-xs md:text-sm font-bold text-slate-400">
                تواصل مع فريق المبيعات لدينا ({SITE_PHONE_DISPLAY})
              </p>
            </div>
          </a>

          {/* Card 3: Technical Support */}
          <a
            href={getWhatsAppUrl(
              "مرحباً، أريد الاستفسار عن الدعم الفني لموقع سيارات المنيا",
            )}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between gap-4 p-5 md:p-6 bg-white border border-slate-100 rounded-2xl shadow-sm hover:shadow-md hover:border-primary/20 transition-all duration-300 group"
          >
            {/* Left Side: Chat Icon */}
            <div className="flex items-center justify-center h-12 w-12 rounded-xl bg-slate-50 text-[#10B981] group-hover:bg-[#ECFDF5] transition-colors shrink-0">
              <MessagesSquare className="h-6 w-6" />
            </div>

            {/* Right Side: Text */}
            <div className="text-right flex-1">
              <h3 className="text-base md:text-lg font-black text-slate-800 mb-1 group-hover:text-[#10B981] transition-colors">
                الدعم الفني
              </h3>
              <p className="text-xs md:text-sm font-bold text-slate-400">
                أرسل لنا استفساراتك وسنجيبك فوراً!
              </p>
            </div>
          </a>
        </div>
      </div>
    </section>
  );
}
