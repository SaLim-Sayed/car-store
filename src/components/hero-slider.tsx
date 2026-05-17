"use client";

import { GlobalSearch } from "@/components/global-search";
import { Car, Shield, Zap } from "lucide-react";

export function HeroSlider() {
  return (
    <section className="relative w-full bg-[#1B3E7A]">
      {/* Background texture */}
      <div className="absolute inset-0 opacity-[0.07] bg-[url('https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=1600&q=80')] bg-cover bg-center" />

      {/* Main content */}
      <div className="relative z-10 pt-28 pb-10 md:pt-36 md:pb-12">
        <div className="container mx-auto px-4 max-w-3xl text-center space-y-5">
          <h1 className="text-2xl md:text-4xl font-black text-white leading-tight tracking-tight">
            أكبر سوق سيارات في <span className="text-[#E28328]">المنيا</span>
          </h1>
          <p className="text-sm md:text-base text-white/70 font-medium max-w-xl mx-auto">
            ابحث عن سيارتك الجديدة أو المستعملة بأفضل الأسعار والمواصفات
          </p>

          {/* Search box */}
          <div className="bg-white rounded-lg overflow-hidden border border-white/10 mt-4 mx-auto max-w-2xl">
            <GlobalSearch
              variant="hero"
              placeholder="ابحث بالماركة، الموديل، أو الكلمات المفتاحية..."
            />
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
