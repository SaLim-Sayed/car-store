"use client";

import { GlobalSearch } from "@/components/global-search";

export function HeroSlider() {
  return (
    <section className="relative w-full pt-32 pb-16 md:pt-40 md:pb-24 bg-[#1B3E7A]">
      <div className="absolute inset-0 opacity-10 bg-[url('https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=1600&q=80')] bg-cover bg-center mix-blend-overlay"></div>

      <div className="relative z-10 container mx-auto px-4 max-w-4xl text-center space-y-8">
        <h1 className="text-3xl md:text-5xl font-black text-white leading-tight">
          أكبر سوق سيارات في <span className="text-accent">المنيا</span>
        </h1>
        <p className="text-lg md:text-xl text-white/80 font-bold max-w-2xl mx-auto">
          ابحث عن سيارتك الجديدة أو المستعملة بأفضل الأسعار والمواصفات
        </p>

        <div className="bg-white   rounded-xl shadow-none mt-8 mx-auto max-w-3xl">
          <GlobalSearch
            variant="hero"
            placeholder="ابحث بالماركة، الموديل، أو الكلمات المفتاحية..."
          />
        </div>
      </div>
    </section>
  );
}
