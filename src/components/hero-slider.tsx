"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Swiper, SwiperSlide } from "swiper/react";
import type { SwiperProps } from "swiper/react";
import { Autoplay, Navigation, Pagination } from "swiper/modules";
import Link from "next/link";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

const heroSlides = [
  {
    id: 1,
    title: "مجموعة سيارات فاخرة",
    subtitle: "اكتشف أحدث الموديلات والعروض الحصرية",
    image:
      "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=1200&h=600&fit=crop",
    cta: "استعرض السيارات",
    link: "/cars",
  },
  {
    id: 2,
    title: "أسعار تنافسية",
    subtitle: "أفضل الأسعار في السوق مع ضمان الجودة",
    image:
      "https://images.unsplash.com/photo-1494976388539-d1058494cdd8?w=1200&h=600&fit=crop",
    cta: "اطلب الآن",
    link: "/cars",
  },
  {
    id: 3,
    title: "خدمة عملاء ممتازة",
    subtitle: "فريق متخصص لمساعدتك في اختيار السيارة المناسبة",
    image:
      "https://images.unsplash.com/photo-1563720224045-81751d25408b?w=1200&h=600&fit=crop",
    cta: "تواصل معنا",
    link: "/contact",
  },
];

export function HeroSlider() {
  const [swiper, setSwiper] = useState<any>(null);

  const swiperConfig = {
    modules: [Autoplay, Navigation, Pagination],
    spaceBetween: 0,
    slidesPerView: 1,
    loop: true,
    grabCursor: true,
    simulateTouch: true,
    autoplay: {
      delay: 6000,
      disableOnInteraction: false,
    },
    pagination: {
      clickable: true,
      el: ".custom-pagination",
      renderBullet: (index: number, className: string) => {
        const slide = heroSlides[index];
        return `<span class="${className}" style="background-image: url(${slide.image})"></span>`;
      },
    },
    onSwiper: setSwiper,
  };

  return (
    <div className="relative w-full h-[500px] md:h-[650px] overflow-hidden rounded-3xl shadow-2xl">
      <Swiper {...swiperConfig} className="h-full w-full">
        {heroSlides.map((slide) => (
          <SwiperSlide key={slide.id}>
            <div className="relative w-full h-full">
              {/* Background Image */}
              <div
                className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-transform duration-10000 hover:scale-110"
                style={{ backgroundImage: `url(${slide.image})` }}
              >
                {/* Advanced Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />
              </div>

              {/* Content */}
              <div className="relative z-10 flex h-full items-center px-8 md:px-20">
                <div className="max-w-3xl text-white space-y-6">
                  <div className="inline-block px-4 py-1.5 bg-primary/20 backdrop-blur-md border border-primary/30 rounded-full text-primary-foreground text-sm font-semibold tracking-wider uppercase animate-in fade-in slide-in-from-right-4 duration-700">
                    عروض حصرية
                  </div>

                  <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight leading-[1.1] animate-in fade-in slide-in-from-bottom-8 duration-700 delay-100">
                    {slide.title}
                  </h1>

                  <p className="text-xl md:text-2xl text-gray-200 font-medium animate-in fade-in slide-in-from-bottom-6 duration-700 delay-200">
                    {slide.subtitle}
                  </p>

                  <p className="text-lg text-gray-400 max-w-xl leading-relaxed animate-in fade-in slide-in-from-bottom-4 duration-700 delay-300">
                    اكتشف مجموعتنا الواسعة من السيارات الجديدة والمستعملة بأفضل
                    الأسعار في السوق مع خيارات تمويل مرنة وضمان شامل.
                  </p>

                  <div className="flex flex-wrap gap-4 pt-4 animate-in fade-in slide-in-from-bottom-2 duration-700 delay-500">
                    <Button
                      size="lg"
                      className="bg-primary text-primary-foreground hover:bg-primary/90 text-lg px-10 py-7 rounded-full shadow-lg shadow-primary/20 transition-all hover:scale-105 active:scale-95"
                      asChild
                    >
                      <Link href={slide.link}>{slide.cta}</Link>
                    </Button>
                    <Button
                      variant="outline"
                      size="lg"
                      className="bg-white/10 backdrop-blur-md border-white/20 text-white hover:bg-white/20 text-lg px-10 py-7 rounded-full transition-all hover:scale-105 active:scale-95"
                      asChild
                    >
                      <Link href="/about">لمعرفة المزيد</Link>
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Circular Pagination (Centered) */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20 flex justify-center items-center px-4 py-2 bg-black/20 backdrop-blur-md rounded-full border border-white/10 custom-pagination shadow-2xl" />

      {/* Navigation Buttons (Left Corner) */}
      <div className="absolute bottom-10 left-10 z-20 flex gap-4">
        <Button
          variant="outline"
          size="icon"
          className="bg-black/20 backdrop-blur-xl border-white/10 text-white rounded-full w-14 h-14 hover:bg-primary hover:border-primary transition-all duration-300 group shadow-xl"
          onClick={() => swiper?.slidePrev()}
        >
          <ChevronRight className="h-6 w-6 group-hover:-translate-x-1 transition-transform" />
        </Button>

        <Button
          variant="outline"
          size="icon"
          className="bg-black/20 backdrop-blur-xl border-white/10 text-white rounded-full w-14 h-14 hover:bg-primary hover:border-primary transition-all duration-300 group shadow-xl"
          onClick={() => swiper?.slideNext()}
        >
          <ChevronLeft className="h-6 w-6 group-hover:translate-x-1 transition-transform" />
        </Button>
      </div>

      {/* Styled Pagination Wrapper */}
      <style jsx global>{`
        .swiper {
          user-select: none;
        }
        .custom-pagination {
          gap: 12px;
          display: flex;
          align-items: center;
          padding: 8px 20px !important;
        }
        .custom-pagination .swiper-pagination-bullet {
          margin: 0 !important;
          background: white;
          opacity: 0.6;
          width: 30px;
          height: 30px;
          border-radius: 50%;
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          cursor: pointer;
          background-size: cover;
          background-position: center;
          border: 2px solid white;
          box-shadow:
            0 4px 6px -1px rgb(0 0 0 / 0.1),
            0 2px 4px -2px rgb(0 0 0 / 0.1);
        }
        .custom-pagination .swiper-pagination-bullet-active {
          opacity: 1;
          width: 50px;
          height: 50px;
          border-color: hsl(var(--primary));
          transform: translateY(-4px) scale(1.1);
          box-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.2);
          z-index: 10;
        }
        .custom-pagination .swiper-pagination-bullet:hover {
          opacity: 0.9;
          transform: translateY(-2px);
        }
      `}</style>
    </div>
  );
}
