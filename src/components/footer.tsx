"use client";

import { Button } from "@/components/ui/button";
import { useSettings } from "@/hooks/useSettings";
import { SITE_PHONE_DISPLAY } from "@/lib/phone";
import { getWhatsAppUrl, WHATSAPP_MESSAGES } from "@/lib/whatsapp";
import { ArrowUp, MapPin, MessageSquare, Phone } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { FaWhatsapp } from "react-icons/fa";

// Custom SVG components for brand social icons
const FacebookIcon = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
  </svg>
);

const TwitterIcon = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3.1 16 1.7 13.5 1.7 13.5c.8.1 1.6 0 2.4-.2C1.5 12.8.5 10.5.5 10.5c.7.4 1.5.6 2.3.6C.8 9.7.5 7.5.5 7.5c1.7.9 3.5 1.3 5.4 1.4C5 6.1 5 4.5 5.9 3.3c.9-1.2 2.6-1.6 4.1-1 1.5.6 2.5 2.1 2.5 3.7 0 .5-.1 1-.2 1.5 1.2-1.2 2.6-2.1 4-2.8.4-.2.9-.4 1.3-.5.4-.1.9-.1 1.3 0-.1.3-.3.6-.5.9-.2.3-.5.6-.8.8.5-.1 1-.2 1.5-.4z" />
  </svg>
);

export function Footer() {
  const { data: settingsData } = useSettings();
  const settings = settingsData?.data || {};

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="relative bg-gradient-to-b from-[#1B3E7A] to-[#0E2042] text-white  pt-10 pb-10 border-t border-white/10 overflow-hidden">
      {/* Decorative top accent strip */}
      <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-[#E28328] via-white/20 to-[#E28328]" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          {/* Brand Info */}
          <div className="flex flex-col items-start justify-start">
            <div className="relative w-full h-[100px]  rounded-xl overflow-hidden shrink-0   ">
              <Image
                src="/logo.png"
                alt="سيارات المنيا"
                width={200}
                height={50}
                priority
              />
            </div>

            {/* Social Icons */}
            <div className="flex items-center gap-3 pt-2">
              {(!settings.facebook || settings.facebook) && (
                <a
                  href={
                    settings.facebook ||
                    "https://www.facebook.com/share/1GWZAJfyKL/"
                  }
                  target="_blank"
                  rel="noopener noreferrer"
                  className="h-10 w-10 rounded-xl bg-white/10 hover:bg-[#E28328] text-white flex items-center justify-center transition-all duration-300 transform hover:-translate-y-1"
                  aria-label="فيسبوك"
                >
                  <FacebookIcon className="h-5 w-5" />
                </a>
              )}
              {settings.twitter && (
                <a
                  href={settings.twitter}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="h-10 w-10 rounded-xl bg-white/10 hover:bg-[#E28328] text-white flex items-center justify-center transition-all duration-300 transform hover:-translate-y-1"
                  aria-label="تويتر"
                >
                  <TwitterIcon className="h-5 w-5" />
                </a>
              )}
              <a
                href={getWhatsAppUrl(
                  WHATSAPP_MESSAGES.default,
                  settings.phoneE164,
                )}
                target="_blank"
                rel="noopener noreferrer"
                className="h-10 w-10 rounded-xl bg-white/10 hover:bg-[#22C55E] text-white flex items-center justify-center transition-all duration-300 transform hover:-translate-y-1"
                aria-label="واتساب"
              >
                <MessageSquare className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-6">
            <h4 className="text-lg font-black text-white relative w-fit after:content-[''] after:absolute after:-bottom-2 after:right-0 after:h-0.5 after:w-8 after:bg-[#E28328] pb-1">
              تصفح الأقسام
            </h4>
            <ul className="space-y-3.5 text-blue-100/70 font-bold text-sm">
              <li>
                <Link
                  href="/cars"
                  className="hover:text-white hover:mr-1 transition-all flex items-center gap-2"
                >
                  <span className="h-1.5 w-1.5 rounded-full bg-[#E28328]" />
                  سيارات للبيع
                </Link>
              </li>
              <li>
                <Link
                  href="/equipment"
                  className="hover:text-white hover:mr-1 transition-all flex items-center gap-2"
                >
                  <span className="h-1.5 w-1.5 rounded-full bg-[#E28328]" />
                  آلات ومعدات ثقيلة
                </Link>
              </li>
              <li>
                <Link
                  href="/showrooms"
                  className="hover:text-white hover:mr-1 transition-all flex items-center gap-2"
                >
                  <span className="h-1.5 w-1.5 rounded-full bg-[#E28328]" />
                  معارض السيارات والشركاء
                </Link>
              </li>
              <li>
                <Link
                  href="/news"
                  className="hover:text-white hover:mr-1 transition-all flex items-center gap-2"
                >
                  <span className="h-1.5 w-1.5 rounded-full bg-[#E28328]" />
                  أخبار ومراجعات السوق
                </Link>
              </li>
            </ul>
          </div>

          {/* Additional Pages */}
          <div className="space-y-6">
            <h4 className="text-lg font-black text-white relative w-fit after:content-[''] after:absolute after:-bottom-2 after:right-0 after:h-0.5 after:w-8 after:bg-[#E28328] pb-1">
              معلومات إضافية
            </h4>
            <ul className="space-y-3.5 text-blue-100/70 font-bold text-sm">
              <li>
                <Link
                  href="/about"
                  className="hover:text-white hover:mr-1 transition-all flex items-center gap-2"
                >
                  <span className="h-1.5 w-1.5 rounded-full bg-[#E28328]" />
                  من نحن
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="hover:text-white hover:mr-1 transition-all flex items-center gap-2"
                >
                  <span className="h-1.5 w-1.5 rounded-full bg-[#E28328]" />
                  اتصل بنا
                </Link>
              </li>
              {/* <li>
                <Link
                  href="/faq"
                  className="hover:text-white hover:mr-1 transition-all flex items-center gap-2"
                >
                  <span className="h-1.5 w-1.5 rounded-full bg-[#E28328]" />
                  الأسئلة الشائعة
                </Link>
              </li>
              <li>
                <Link
                  href="/privacy"
                  className="hover:text-white hover:mr-1 transition-all flex items-center gap-2"
                >
                  <span className="h-1.5 w-1.5 rounded-full bg-[#E28328]" />
                  سياسة الخصوصية
                </Link>
              </li> */}
            </ul>
          </div>

          {/* Contact Details & WhatsApp Call */}
          <div className="space-y-6">
            <h4 className="text-lg font-black text-white relative w-fit after:content-[''] after:absolute after:-bottom-2 after:right-0 after:h-0.5 after:w-8 after:bg-[#E28328] pb-1">
              تواصل مباشر
            </h4>
            <div className="space-y-4 text-blue-100/70 font-bold text-sm">
              <div className="flex items-center gap-3">
                <div className="h-9 w-9 rounded-lg bg-white/10 flex items-center justify-center shrink-0">
                  <MapPin className="h-4.5 w-4.5 text-[#E28328]" />
                </div>
                <span>
                  {settings.address || "مدينة المنيا. ميدان الحميات، مصر"}
                </span>
              </div>
              <div className="flex items-center gap-3">
                <div className="h-9 w-9 rounded-lg bg-white/10 flex items-center justify-center shrink-0">
                  <Phone className="h-4.5 w-4.5 text-[#E28328]" />
                </div>
                <span dir="ltr">
                  {settings.phoneDisplay || SITE_PHONE_DISPLAY}
                </span>
              </div>
            </div>

            <Button
              asChild
              className="w-full h-14 rounded-xl bg-[#22C55E] hover:bg-[#1eb052] text-white font-black text-base transition-all duration-300 shadow-lg shadow-blue-950/20 hover:scale-[1.02]"
            >
              <a
                href={getWhatsAppUrl(
                  WHATSAPP_MESSAGES.default,
                  settings.phoneE164,
                )}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2"
              >
                <FaWhatsapp className="h-5 w-5 fill-white text-transparent" />
                تواصل عبر واتساب
              </a>
            </Button>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-blue-200/50 text-xs sm:text-sm font-bold text-center md:text-right">
            © {new Date().getFullYear()} سوق سيارات المنيا. جميع الحقوق محفوظة.
            تم التطوير بكل حب لأهالي المنيا.
          </p>
          <div className="flex items-center gap-6">
            <Link
              href="/terms"
              className="text-blue-100/60 hover:text-white text-xs sm:text-sm font-bold transition-colors"
            >
              شروط الاستخدام
            </Link>
            <button
              onClick={scrollToTop}
              className="h-10 w-10 rounded-full bg-white/10 hover:bg-[#E28328] hover:text-white text-blue-100/70 flex items-center justify-center transition-all duration-300 shadow-md shadow-black/20"
              aria-label="العودة لأعلى الصفحة"
            >
              <ArrowUp className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
