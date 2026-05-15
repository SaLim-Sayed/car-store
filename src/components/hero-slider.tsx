"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { GlobalSearch } from "@/components/global-search";

const slides = [
  {
    image: "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=1600&q=80",
    title: "مجموعة سيارات",
    highlight: "فاخرة",
    subtitle: "اكتشف أحدث الموديلات والعروض الحصرية",
    desc: "مجموعتنا الواسعة من السيارات الجديدة والمستعملة بأفضل الأسعار في السوق، مع خيارات تمويل مرنة وضمان شامل."
  },
  {
    image: "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=1600&q=80",
    title: "أفضل العروض على",
    highlight: "السيارات المستعملة",
    subtitle: "سيارات مفحصة ومضمونة بأسعار لا تقبل المنافسة",
    desc: "نضمن لك الجودة والموثوقية في كل سيارة نعرضها، مع تقارير فحص فنية شاملة لراحة بالك."
  },
  {
    image: "https://images.unsplash.com/photo-1583121274602-3e2820c69888?w=1600&q=80",
    title: "احصل على سيارة",
    highlight: "أحلامك اليوم",
    subtitle: "خيارات تمويل مرنة تناسب ميزانيتك",
    desc: "تواصل معنا لمعرفة أحدث خطط التمويل الميسرة والعروض البنكية الحصرية لعملائنا في المنيا."
  }
];

export function HeroSlider() {
  const [currentSlide, setCurrentSlide] = useState(0);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  // Auto-play
  useEffect(() => {
    const timer = setInterval(nextSlide, 6000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="relative w-full min-h-[100svh] md:h-[750px]">
      <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden>
      {/* Background Slides */}
      {slides.map((slide, index) => (
        <div
          key={index}
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
            index === currentSlide ? "opacity-100 scale-105" : "opacity-0 scale-100"
          }`}
          style={{ transitionProperty: "opacity, transform" }}
        >
          <div
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{ backgroundImage: `url('${slide.image}')` }}
          />
          {/* Dark Overlay with Gradient */}
          <div className="absolute inset-0 bg-gradient-to-l from-black/80 via-black/50 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/30" />
        </div>
      ))}
      </div>

      {/* Content Container */}
      <div className="relative z-10 container mx-auto h-full flex flex-col justify-end md:justify-center pb-14 md:pb-0 px-4 md:px-8 pt-16 md:pt-0">
        <div className="w-full max-w-4xl mx-auto md:mx-0 text-white space-y-5 md:space-y-8 animate-in fade-in slide-in-from-right-12 duration-1000">

          {/* Exclusive Offer Badge */}
          <div className="flex justify-end">
            <div className="inline-flex items-center gap-2.5 px-5 py-2 bg-primary/20 backdrop-blur-xl border border-primary/40 rounded-md text-primary text-sm font-black tracking-wider shadow-xl">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-primary" />
              </span>
              عروض حصرية
            </div>
          </div>

          {/* Main Heading */}
          <div className="space-y-2">
            <h1 key={`title-${currentSlide}`} className="text-5xl md:text-6xl font-[1000] text-right leading-tight animate-in fade-in slide-in-from-right-8 duration-700">
              {slides[currentSlide].title}
              <br />
              <span className="text-primary">{slides[currentSlide].highlight}</span>
            </h1>
          </div>

          {/* Subheading */}
          <div key={`sub-${currentSlide}`} className="space-y-3 md:space-y-4 text-right animate-in fade-in slide-in-from-right-12 duration-700 delay-150">
            <p className="text-lg md:text-2xl text-white font-bold drop-shadow-lg">
              {slides[currentSlide].subtitle}
            </p>
            <p className="text-sm md:text-lg text-white/70 leading-relaxed font-medium max-w-2xl ml-auto">
              {slides[currentSlide].desc}
            </p>
          </div>

          {/* Search */}
          <div className="relative w-full pt-2">
            <GlobalSearch variant="hero" />
          </div>

          {/* CTA Buttons */}
          <div className="grid grid-cols-2 gap-3 md:flex md:flex-wrap md:gap-4 pt-2 md:pt-0 md:justify-end">
            <Button
              size="2xl"
              asChild
              className="rounded-md bg-white text-black hover:bg-gray-100 border-0 shadow-2xl transition-all hover:scale-105 active:scale-95 w-full md:w-auto md:min-w-[200px]"
            >
              <Link href="/cars">استعرض السيارات</Link>
            </Button>
            <Button
              size="2xl"
              variant="outline"
              asChild
              className="rounded-md border-white/30 text-white bg-white/10 backdrop-blur-md hover:bg-white/20 transition-all hover:scale-105 active:scale-95 w-full md:w-auto md:min-w-[200px]"
            >
              <Link href="/about">لمعرفة المزيد</Link>
            </Button>
          </div>
        </div>
      </div>

      {/* Pagination Dots */}
      <div className="absolute bottom-12 right-1/2 translate-x-1/2 md:translate-x-0 md:right-8 z-30 flex gap-3">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrentSlide(i)}
            className={`h-2.5 transition-all duration-500 rounded-full ${
              i === currentSlide ? "w-10 bg-primary shadow-[0_0_15px_rgba(217,119,6,0.5)]" : "w-2.5 bg-white/30 hover:bg-white/50"
            }`}
            aria-label={`Go to slide ${i + 1}`}
          />
        ))}
      </div>

      {/* Decorative Elements */}
      <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-background to-transparent z-20" />
    </section>
  );
}
