"use client";

import { ReactNode, useRef, useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation } from "swiper/modules";
import type { SwiperOptions } from "swiper/types";
import { cn } from "@/lib/utils";
import "swiper/css";
import "swiper/css/navigation";

type HomeSectionCarouselProps = {
 navKey: string;
 loop?: boolean;
 autoplayDelay: number;
 children: ReactNode;
} & Pick<SwiperOptions, "breakpoints" | "slidesPerView" | "spaceBetween">;

export function HomeSectionCarousel({
 navKey,
 loop = false,
 autoplayDelay,
 breakpoints,
 slidesPerView = 1,
 spaceBetween = 16,
 children,
}: HomeSectionCarouselProps) {
 const prevRef = useRef<HTMLButtonElement>(null);
 const nextRef = useRef<HTMLButtonElement>(null);
 const [init, setInit] = useState(false);

 // Swiper needs a re-render to recognize the refs once they are attached to the DOM
 useEffect(() => {
 setInit(true);
 }, []);

 const navBtn =
 "pointer-events-auto flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-black/10 bg-white/95 text-foreground shadow-[0_8px_30px_rgb(0,0,0,0.12)] backdrop-blur-sm transition-all hover:border-primary/40 hover:bg-primary hover:text-white hover:shadow-none disabled:pointer-events-none disabled:opacity-30 sm:h-9 sm:w-9 md:h-10 md:w-10";

 return (
 <div className="isolate w-full min-w-0">
 <div className="relative order-1 min-w-0 w-full pb-12 sm:pb-0 sm:pl-14 sm:pr-14">
        {/* Left Button (Next) */}
        <button
          ref={nextRef}
          type="button"
          className={cn(
            navBtn,
            "hidden sm:flex absolute left-2 sm:left-0 top-1/2 z-10 -translate-y-1/2"
          )}
          aria-label="التالي"
        >
          <ChevronLeft className="h-4 w-4 md:h-5 md:w-5 shrink-0" aria-hidden />
        </button>

        {/* Right Button (Prev) */}
        <button
          ref={prevRef}
          type="button"
          className={cn(
            navBtn,
            "hidden sm:flex absolute right-2 sm:right-0 top-1/2 z-10 -translate-y-1/2"
          )}
          aria-label="السابق"
        >
          <ChevronRight className="h-4 w-4 md:h-5 md:w-5 shrink-0" aria-hidden />
        </button>
 <Swiper
 key={`${navKey}-${init ? "initialized" : "uninitialized"}`}
 modules={[Autoplay, Navigation]}
 dir="rtl"
 loop={loop}
 speed={720}
 grabCursor
 resistanceRatio={0.75}
 slidesPerView={slidesPerView}
 spaceBetween={spaceBetween}
 watchOverflow
 centeredSlides={false}
 navigation={{
 prevEl: prevRef.current,
 nextEl: nextRef.current,
 }}
 onBeforeInit={(swiper) => {
 // @ts-expect-error Swiper types
 swiper.params.navigation.prevEl = prevRef.current;
 // @ts-expect-error Swiper types
 swiper.params.navigation.nextEl = nextRef.current;
 }}
 autoplay={{
 delay: autoplayDelay,
 disableOnInteraction: false,
 pauseOnMouseEnter: true,
 }}
 breakpoints={breakpoints}
 className={cn(
 "home-section-carousel w-full max-w-full min-w-0 box-border!",
 "[&_.swiper-wrapper]:items-stretch!",
 "py-1",
 "[&_.swiper-slide]:transition-[transform,opacity,box-shadow]",
 "[&_.swiper-slide]:duration-300",
 "[&_.swiper-slide]:ease-out",
 "[&_.swiper-slide:not(.swiper-slide-active)]:opacity-[0.92]",
 "[&_.swiper-slide.swiper-slide-active]:opacity-100",
 )}
 >
 {children}
 </Swiper>
 </div>
 </div>
 );
}
