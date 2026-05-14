"use client";

import { useState } from "react";
import { Search, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";

export function HeroSlider() {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <section className="relative w-full h-[600px] md:h-[750px] overflow-hidden">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-transform duration-1000"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=1200&h=600&fit=crop')",
        }}
      >
        {/* Dark Overlay with Gradient */}
        <div className="absolute inset-0 bg-gradient-to-l from-black/80 via-black/40 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />
      </div>

      {/* Content Container */}
      <div className="relative z-10 container mx-auto h-full flex flex-col justify-center px-4 md:px-8">
        <div className="max-w-4xl text-white space-y-8 animate-in fade-in slide-in-from-right-12 duration-1000">
          {/* Exclusive Offer Badge */}
          {/* <div className="inline-flex items-center gap-3 px-6 py-2.5 bg-primary/10 backdrop-blur-xl border-2 border-primary/20 rounded-full text-white text-base font-black tracking-wider animate-in fade-in zoom-in duration-1000 shadow-2xl shadow-primary/20">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
              <span className="relative inline-flex rounded-full h-3 w-3 bg-primary" />
            </span>
            عروض حصرية لفترة محدودة
          </div> */}

          {/* Main Heading */}
          <h1 className="text-6xl  md:text-5xl font-[1000]   text-right">
            مجموعة سيارات
            <span className="text-primary "> فاخرة </span>
          </h1>

          {/* Subheading */}
          <div className="space-y-6 max-w-2xl ml-auto text-right">
            <p className="text-2xl md:text-3xl text-white font-bold drop-shadow-lg">
              اكتشف أحدث الموديلات العالمية بأسعار تنافسية
            </p>
            <p className="text-lg md:text-xl text-white/70 leading-relaxed font-medium">
              نحن نقدم لك تجربة فريدة في اختيار سيارتك القادمة مع باقة متنوعة من
              الخيارات التي تلبي كافة تطلعاتك.
            </p>
          </div>

          {/* Search Bar Integrated */}
          <div className="relative max-w-3xl group w-full ml-auto pt-4">
            <div className="relative flex items-center bg-white rounded-[2rem] p-1.5 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.3)] transition-transform group-focus-within:scale-[1.02] duration-500">
              <Button className="rounded-[1.7rem] px-14 h-16 text-2xl font-black bg-[#1A1A1A] hover:bg-black text-white transition-all shadow-xl">
                بحث
              </Button>
              <div className="flex-1 flex items-center px-8">
                <Input
                  type="text"
                  placeholder="ابحث عن سيارتك المثالية..."
                  className="border-0 focus-visible:ring-0 text-gray-900 placeholder:text-gray-400 text-xl md:text-2xl h-16 w-full bg-transparent text-right font-black"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <Search className="h-8 w-8 text-gray-400 mr-4" />
              </div>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-wrap gap-6 pt-8 justify-end">
            <Button
              size="lg"
              asChild
              className="rounded-3xl px-12 h-16 text-xl font-black bg-white text-black hover:bg-gray-100 border-0 shadow-2xl transition-all hover:scale-105 active:scale-95"
            >
              <Link href="/cars">استعرض السيارات</Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              asChild
              className="rounded-3xl px-12 h-16 text-xl font-black border-white/20 text-white bg-white/5 backdrop-blur-md hover:bg-white/10 transition-all hover:scale-105 active:scale-95"
            >
              <Link href="/about">لمعرفة المزيد</Link>
            </Button>
          </div>
        </div>
      </div>

      {/* Decorative Elements */}
      <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-background to-transparent z-20" />
    </section>
  );
}
