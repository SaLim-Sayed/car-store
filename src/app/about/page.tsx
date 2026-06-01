"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Users,
  MapPin,
  Coins,
  TrendingUp,
  Handshake,
  ArrowLeft,
  Info,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";

const values = [
  {
    icon: MapPin,
    title: "سوق متكامل لكل أرجاء المنيا",
    description:
      "نحن سوق بمعنى الكلمة، ليس على أرض معينة فقط وإنما في كل أرجاء محافظة المنيا نصل إليك أينما كنت.",
  },
  {
    icon: Coins,
    title: "منصة مجانية بالكامل",
    description:
      "نحن لا نشارككم في الربح ولا في البيع والشراء؛ الأمر متروك خالصاً لكم. دورنا يقتصر على العرض والانتشار وتسهيل التواصل بينكم.",
  },
  {
    icon: TrendingUp,
    title: "الارتقاء بالمهنة",
    description:
      "نريد الارتقاء بقطاع تجارة السيارات والمعدات من خلال تقديم الخدمات دون النظر للمقابل، ولا نحمل أصحاب المهن أي أعباء إضافية تثقل كاهلهم.",
  },
  {
    icon: Users,
    title: "منكم وإليكم",
    description:
      "نحن منكم وبينكم؛ لسنا تجاراً ولا مستثمرين ولا سماسرة. إنما نحن أبناء المنيا نحاول جاهدين تسهيل العمل والبيع والشراء وتوسيع دائرة الانتشار للجميع.",
  },
  {
    icon: Handshake,
    title: "شراكة وتكامل رقمي",
    description:
      "يمكنكم استغلال هذا السوق لبناء شراكات وتحقيق التكامل بينكم. وكأنكم جميعاً أصحاب المعارض تفتحون معرضاً واحداً ضخماً على موقعنا الإلكتروني يجمعكم معاً.",
  },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#faf8f4] via-[#F9F6F1] to-[#f4f1eb]">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#1B3E7A] to-[#0E2042] text-white py-20 lg:py-28">
        {/* Ambient Decorative Background */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(226,131,40,0.1),transparent_50%)] pointer-events-none" />
        <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-[#E28328] via-white/20 to-[#E28328]" />

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/10 text-[#E28328] font-bold text-sm mb-2">
              <Info className="h-4 w-4" />
              سوق سيارات المنيا
            </div>
            <h1 className="text-4xl md:text-6xl font-[1000] tracking-tight leading-none">
              من نحن
            </h1>
            <p className="text-lg md:text-2xl text-blue-100/90 font-bold leading-relaxed max-w-3xl mx-auto pt-4 border-t border-white/10">
              نحن نقدم للجميع البائع والمشترى وصاحب المعرض خدمة قيمة من خلال
              إتاحة العرض للجميع وتوفير عناء الانتقالات والبحث الشاق من مكان إلى
              آخر.
            </p>
          </div>
        </div>
      </section>

      {/* Values & Principles Section */}
      <section className="py-20 lg:py-28 relative">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-3xl md:text-4xl font-black text-slate-900">
              رؤيتنا ومبادئنا
            </h2>
            <p className="text-sm md:text-base text-slate-500 font-bold max-w-xl mx-auto">
              نهجنا البسيط والأمين في تسهيل حركة السوق لأهالي المنيا الكرام
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {values.slice(0, 3).map((val, idx) => (
              <Card
                key={idx}
                className="group border border-slate-200/80 bg-white hover:border-[#E28328]/40 hover:shadow-xl hover:shadow-slate-100/50 transition-all duration-300 rounded-2xl overflow-hidden shadow-none flex flex-col h-full"
              >
                <CardContent className="p-8 flex flex-col gap-6 flex-1">
                  <div className="w-14 h-14 bg-gradient-to-br from-[#1B3E7A]/5 to-[#1B3E7A]/10 text-[#1B3E7A] rounded-xl flex items-center justify-center transition-all duration-300 group-hover:scale-110 group-hover:from-[#E28328]/10 group-hover:to-[#E28328]/20 group-hover:text-[#E28328]">
                    <val.icon className="h-7 w-7" />
                  </div>
                  <div className="space-y-3">
                    <h3 className="text-xl font-bold text-slate-900 group-hover:text-[#1B3E7A] transition-colors">
                      {val.title}
                    </h3>
                    <p className="text-slate-600 text-sm leading-relaxed font-semibold">
                      {val.description}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Centered remaining 2 values */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto mt-8">
            {values.slice(3).map((val, idx) => (
              <Card
                key={idx}
                className="group border border-slate-200/80 bg-white hover:border-[#E28328]/40 hover:shadow-xl hover:shadow-slate-100/50 transition-all duration-300 rounded-2xl overflow-hidden shadow-none flex flex-col h-full"
              >
                <CardContent className="p-8 flex flex-col gap-6 flex-1">
                  <div className="w-14 h-14 bg-gradient-to-br from-[#1B3E7A]/5 to-[#1B3E7A]/10 text-[#1B3E7A] rounded-xl flex items-center justify-center transition-all duration-300 group-hover:scale-110 group-hover:from-[#E28328]/10 group-hover:to-[#E28328]/20 group-hover:text-[#E28328]">
                    <val.icon className="h-7 w-7" />
                  </div>
                  <div className="space-y-3">
                    <h3 className="text-xl font-bold text-slate-900 group-hover:text-[#1B3E7A] transition-colors">
                      {val.title}
                    </h3>
                    <p className="text-slate-600 text-sm leading-relaxed font-semibold">
                      {val.description}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Management Section */}
      <section className="pb-20 lg:pb-28">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="text-center mb-12 space-y-4">
            <h2 className="text-3xl md:text-4xl font-black text-slate-900">
              إدارة المنصة
            </h2>
            <p className="text-sm md:text-base text-slate-500 font-bold max-w-xl mx-auto">
              نعمل معاً لخدمة أهالي المنيا وتسهيل التواصل التجاري
            </p>
          </div>

          <Card className="border border-slate-200/80 bg-white shadow-lg shadow-slate-100/50 rounded-[2rem] overflow-hidden p-6 md:p-8">
            <div className="flex flex-col md:flex-row items-center gap-8 md:gap-10">
              <div className="relative w-48 h-48 md:w-56 md:h-56 shrink-0 rounded-[1.75rem] overflow-hidden border-4 border-slate-100/80 shadow-md">
                <Image
                  src="/elbadry.jpeg"
                  alt="محمد البدري - مدير السوق"
                  fill
                  className="object-center"
                  sizes="(max-width: 768px) 192px, 224px"
                  priority
                />
              </div>
              <div className="space-y-4 text-center md:text-right">
                <div className="space-y-1">
                  <h3 className="text-2xl md:text-3xl font-black text-slate-900">
                    محمد البدري
                  </h3>
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#E28328]/10 text-[#E28328] font-bold text-xs">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#E28328]" />
                    مدير السوق
                  </div>
                </div>
                <p className="text-slate-600 text-base font-semibold leading-relaxed">
                  مؤسس ومدير سوق سيارات المنياومعارض المنيا. نسعى من خلال هذه
                  المنصة إلى تسهيل حركة التجارة والبيع والشراء بين أبناء محافظة
                  المنيا الكرام، وتقديم حلول رقمية مبتكرة تختصر عناء البحث
                  والمسافات مجاناً بالكامل ودون أي عمولات.
                </p>
              </div>
            </div>
          </Card>
        </div>
      </section>

      {/* Showcase Integration section */}
      <section className="pb-24 lg:pb-32">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="bg-gradient-to-br from-[#1B3E7A] to-[#0E2042] text-white rounded-[2.5rem] p-8 md:p-14 relative overflow-hidden shadow-2xl shadow-blue-950/20 border border-white/10">
            {/* Background pattern */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_100%_100%,rgba(226,131,40,0.15),transparent_60%)] pointer-events-none" />

            <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-8 space-y-6 text-right">
                <h3 className="text-2xl md:text-4xl font-black leading-tight">
                  معرض واحد يجمعنا جميعاً
                </h3>
                <p className="text-blue-100/90 text-base md:text-lg font-semibold leading-relaxed">
                  موقعنا الإلكتروني بمثابة ساحة عرض كبرى ومفتوحة تجمع أصحاب
                  المعارض والسيارات والمشترين من كل أرجاء المنيا تحت سقف رقمي
                  واحد، لتسهيل عمليات البيع وتوسيع انتشار أعمالكم بأمان وسرعة
                  ودون أي عمولات.
                </p>
                <div className="flex flex-wrap gap-4 pt-4">
                  <Button
                    size="lg"
                    className="h-14 rounded-xl bg-[#E28328] hover:bg-[#c9701d] text-white font-black px-8 text-base shadow-lg shadow-amber-950/20 hover:scale-[1.03] transition-all"
                    asChild
                  >
                    <Link href="/cars" className="flex items-center gap-2">
                      تصفح السيارات
                      <ArrowLeft className="h-4.5 w-4.5" />
                    </Link>
                  </Button>
                  <Button
                    size="lg"
                    variant="outline"
                    className="h-14 rounded-xl border-white/20 hover:bg-white/10 text-white font-black px-8 text-base hover:text-white"
                    asChild
                  >
                    <Link href="/contact">تواصل معنا مباشرة</Link>
                  </Button>
                </div>
              </div>
              <div className="lg:col-span-4 flex justify-center lg:justify-end">
                <div className="relative w-48 h-48 md:w-56 md:h-56 bg-gradient-to-br from-white/10 to-white/5 rounded-[2rem] border border-white/15 flex items-center justify-center backdrop-blur-md">
                  <div className="text-center space-y-2 p-6">
                    <span className="text-4xl md:text-5xl">🚗</span>
                    <h4 className="text-lg font-black pt-2">
                      سوق المنيا الموحد
                    </h4>
                    <p className="text-xs text-blue-200/70 font-semibold">
                      بكل حب لأهل المنيا
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
