"use client";

import { GlobalSearch } from "@/components/global-search";
import { Car, Shield, Zap } from "lucide-react";

export function HeroSlider() {
  return (
    <section className="relative w-full bg-[#1B3E7A] overflow-hidden">
      {/* Background Image with Rich Gradient Overlay */}
      <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=1600&q=80')] bg-cover bg-center" />
      <div className="absolute inset-0 bg-gradient-to-b from-[#1B3E7A]/95 via-[#1B3E7A]/80 to-[#1B3E7A]" />

      {/* Main content */}
      <div className="relative z-10 pt-32 pb-14 md:pt-40 md:pb-20">
        <div className="container mx-auto px-4 max-w-4xl text-center space-y-6 md:space-y-8">
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black text-white leading-[1.1] tracking-tight">
            سوق سيارات <span className="text-[#E28328] relative inline-block">
              المنيا
              <div className="absolute -bottom-2 left-0 right-0 h-2 bg-[#E28328]/30 blur-sm rounded-full" />
            </span> الأول
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-white/80 font-medium max-w-2xl mx-auto leading-relaxed">
            استكشف أضخم تشكيلة من السيارات الجديدة والمستعملة، والمعدات الثقيلة، بأفضل الأسعار وبكل ثقة وأمان.
          </p>

          {/* Search box */}
          <div className="bg-white/10 backdrop-blur-md p-2 rounded-2xl md:rounded-3xl border border-white/20 mt-8 mx-auto max-w-3xl shadow-2xl">
            <div className="bg-white rounded-xl md:rounded-2xl overflow-hidden shadow-inner">
              <GlobalSearch
                variant="hero"
                placeholder="ابحث بالماركة، الموديل، أو الكلمات المفتاحية..."
              />
            </div>
          </div>
        </div>
      </div>

      {/* Quick-stats strip */}
      <div className="relative z-10 border-t border-white/10 bg-[#163060]">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-3 divide-x divide-x-reverse divide-white/10">
            {[
              { icon: Car,    label: "+500 سيارة", sub: "جديد ومستعمل" },
              { icon: Zap,    label: "أسعار تنافسية", sub: "عروض حصرية يومية" },
              { icon: Shield, label: "ضمان الجودة", sub: "فحص فني شامل" },
            ].map(({ icon: Icon, label, sub }, i) => (
              <div key={i} className="flex items-center gap-3 px-4 py-3 md:py-4 justify-center">
                <Icon className="h-5 w-5 text-[#E28328] shrink-0" />
                <div className="text-right">
                  <p className="text-white text-xs md:text-sm font-bold leading-none">{label}</p>
                  <p className="text-white/50 text-[10px] md:text-xs mt-0.5">{sub}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
