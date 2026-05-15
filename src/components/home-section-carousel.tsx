"use client"

import { ReactNode, useRef, useState, useEffect } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Swiper, SwiperSlide } from "swiper/react"
import { Autoplay, Navigation, Pagination } from "swiper/modules"
import type { SwiperOptions } from "swiper/types"
import { cn } from "@/lib/utils"
import "swiper/css"
import "swiper/css/pagination"
import "swiper/css/navigation"

type HomeSectionCarouselProps = {
  navKey: string
  loop?: boolean
  autoplayDelay: number
  children: ReactNode
} & Pick<SwiperOptions, "breakpoints" | "slidesPerView" | "spaceBetween">

export function HomeSectionCarousel({
  navKey,
  loop = false,
  autoplayDelay,
  breakpoints,
  slidesPerView = 1,
  spaceBetween = 16,
  children,
}: HomeSectionCarouselProps) {
  const prevRef = useRef<HTMLButtonElement>(null)
  const nextRef = useRef<HTMLButtonElement>(null)
  const [init, setInit] = useState(false)

  // Swiper needs a re-render to recognize the refs once they are attached to the DOM
  useEffect(() => {
    setInit(true)
  }, [])

  const navBtn =
    "pointer-events-auto absolute top-1/2 z-10 hidden h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border border-black/10 bg-white/95 text-foreground shadow-[0_8px_30px_rgb(0,0,0,0.12)] backdrop-blur-sm transition-all hover:border-primary/40 hover:bg-primary hover:text-white hover:shadow-lg hover:scale-105 active:scale-95 disabled:pointer-events-none disabled:opacity-30 sm:flex md:h-10 md:w-10"

  return (
    <div className="relative isolate w-full min-w-0 sm:ps-12 sm:pe-12">
      <button
        ref={prevRef}
        type="button"
        className={cn(navBtn, "inset-s-0")}
        aria-label="السابق"
      >
        <ChevronRight className="h-4 w-4 md:h-5 md:w-5 shrink-0" aria-hidden />
      </button>
      <button
        ref={nextRef}
        type="button"
        className={cn(navBtn, "inset-e-0")}
        aria-label="التالي"
      >
        <ChevronLeft className="h-4 w-4 md:h-5 md:w-5 shrink-0" aria-hidden />
      </button>
      
      <Swiper
        key={init ? "initialized" : "uninitialized"}
        modules={[Autoplay, Pagination, Navigation]}
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
          // @ts-ignore
          swiper.params.navigation.prevEl = prevRef.current
          // @ts-ignore
          swiper.params.navigation.nextEl = nextRef.current
        }}
        pagination={{
          clickable: true,
          dynamicBullets: true,
          dynamicMainBullets: 5,
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
          "py-1 pb-11 md:pb-12",
          "[--swiper-pagination-color:#D97706]",
          "[--swiper-pagination-bullet-inactive-color:rgb(0_0_0/0.2)]",
          "[--swiper-pagination-bullet-inactive-opacity:1]",
          "[--swiper-pagination-bottom:2px]",
          "[--swiper-pagination-bullet-size:7px]",
          "[--swiper-pagination-bullet-horizontal-gap:6px]",
          "[&_.swiper-slide]:transition-[transform,opacity,box-shadow]",
          "[&_.swiper-slide]:duration-300",
          "[&_.swiper-slide]:ease-out",
          "[&_.swiper-slide:not(.swiper-slide-active)]:opacity-[0.92]",
          "[&_.swiper-slide.swiper-slide-active]:opacity-100"
        )}
      >
        {children}
      </Swiper>
    </div>
  )
}
