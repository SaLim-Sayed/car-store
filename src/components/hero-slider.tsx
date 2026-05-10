"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ChevronLeft, ChevronRight, Star } from "lucide-react"

const heroSlides = [
  {
    id: 1,
    title: "مجموعة سيارات فاخرة",
    subtitle: "اكتشف أحدث الموديلات والعروض الحصرية",
    image: "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=1200&h=600&fit=crop",
    cta: "استعرض السيارات",
    link: "/cars"
  },
  {
    id: 2,
    title: "أسعار تنافسية",
    subtitle: "أفضل الأسعار في السمع مع ضمان الجودة",
    image: "https://images.unsplash.com/photo-1494976388539-d1058494cdd8?w=1200&h=600&fit=crop",
    cta: "اطلب الآن",
    link: "/cars"
  },
  {
    id: 3,
    title: "خدمة عملاء ممتازة",
    subtitle: "فريق متخصص لمساعدتك في اختيار السيارة المناسبة",
    image: "https://images.unsplash.com/photo-1563720224045-81751d25408b?w=1200&h=600&fit=crop",
    cta: "تواصل معنا",
    link: "/contact"
  }
]

export function HeroSlider() {
  const [currentSlide, setCurrentSlide] = useState(0)

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % heroSlides.length)
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length)
  }

  useEffect(() => {
    const timer = setInterval(() => {
      nextSlide()
    }, 5000)

    return () => clearInterval(timer)
  }, [])

  return (
    <div className="relative w-full h-[600px] overflow-hidden rounded-lg">
      {heroSlides.map((slide, index) => (
        <div
          key={slide.id}
          className={`absolute inset-0 transition-opacity duration-1000 ${
            index === currentSlide ? "opacity-100" : "opacity-0"
          }`}
        >
          <div
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{ backgroundImage: `url(${slide.image})` }}
          >
            <div className="absolute inset-0 bg-black/50" />
          </div>
          <div className="relative z-10 flex h-full items-center justify-center">
            <div className="text-center text-white px-4">
              <h1 className="text-4xl md:text-6xl font-bold mb-4">
                {slide.title}
              </h1>
              <p className="text-xl md:text-2xl mb-8 max-w-2xl mx-auto">
                {slide.subtitle}
              </p>
              <Button size="lg" asChild>
                <a href={slide.link}>{slide.cta}</a>
              </Button>
            </div>
          </div>
        </div>
      ))}

      <Button
        variant="outline"
        size="icon"
        className="absolute left-4 top-1/2 -translate-y-1/2 z-20 bg-white/20 backdrop-blur-sm border-white/20 text-white hover:bg-white/30"
        onClick={prevSlide}
      >
        <ChevronRight className="h-4 w-4" />
      </Button>

      <Button
        variant="outline"
        size="icon"
        className="absolute right-4 top-1/2 -translate-y-1/2 z-20 bg-white/20 backdrop-blur-sm border-white/20 text-white hover:bg-white/30"
        onClick={nextSlide}
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>

      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex space-x-2">
        {heroSlides.map((_, index) => (
          <button
            key={index}
            className={`w-3 h-3 rounded-full transition-colors ${
              index === currentSlide ? "bg-white" : "bg-white/50"
            }`}
            onClick={() => setCurrentSlide(index)}
          />
        ))}
      </div>
    </div>
  )
}
