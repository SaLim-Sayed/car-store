"use client";

import { CarCard } from "@/components/car-card";
import { EquipmentCard } from "@/components/equipment-card";
import { HeroSlider } from "@/components/hero-slider";
import { HomeSectionCarousel } from "@/components/home-section-carousel";
import { NewsHomeCard, type NewsHomeItem } from "@/components/news-home-card";
import { SupportPanel } from "@/components/support-panel";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { WhatsAppIcon } from "@/components/whatsapp-icon";
import { Car as CarType, useFeaturedCars } from "@/hooks/useCars";
import { useNews } from "@/hooks/useContent";
import { useFeaturedEquipment, type Equipment } from "@/hooks/useEquipment";
import { getWhatsAppUrl, WHATSAPP_MESSAGES } from "@/lib/whatsapp";
import {
  ArrowRight,
  Car,
  ChevronLeft,
  PlusCircle,
  Settings,
  Tractor,
} from "lucide-react";
import Link from "next/link";
import { SwiperSlide } from "swiper/react";

export default function HomePage() {
  const { data: carsData, isLoading } = useFeaturedCars();
  const { data: newsData, isLoading: newsLoading } = useNews(6);
  const { data: equipmentData } = useFeaturedEquipment(6);

  const featuredCars = carsData?.data || [];
  const newsItems = newsData?.data || [];
  const featuredEquipment = equipmentData?.data || [];

  return (
    <div className="min-h-screen bg-background">
      <main>
        {/* Hero Section */}
        <section className="relative w-full min-w-0 overflow-x-hidden">
          <HeroSlider />

          {/* Floating Stats */}
        </section>

        <div className="container mx-auto px-4 py-8 md:py-16 space-y-16 md:space-y-20">
          {/* Services — mobile: compact links, desktop: full cards */}
          <section className="space-y-5">
            {/* Mobile-only: 3-col enhanced tiles */}
            <div className="grid grid-cols-3 gap-3 md:hidden">
              {[
                {
                  title: "بيع سيارتك",
                  icon: Car,
                  accentBg: "bg-[#1B3E7A]",
                  link: getWhatsAppUrl(WHATSAPP_MESSAGES.sellCar),
                  isExternal: true,
                  label: "اعرض الآن",
                  sub: "/cars",
                  subLabel: "تصفح السيارات",
                },
                {
                  title: "إضافة معرض",
                  icon: PlusCircle,
                  accentBg: "bg-amber-600",
                  link: getWhatsAppUrl(
                    "مرحباً، أريد إضافة معرضي على سوق سيارات المنيا",
                  ),
                  isExternal: true,
                  label: "أضف معرضك",
                  sub: "/showrooms",
                  subLabel: "تصفح المعارض",
                },
                {
                  title: "إضافة معدة",
                  icon: Tractor,
                  accentBg: "bg-emerald-600",
                  link: getWhatsAppUrl(WHATSAPP_MESSAGES.sellEquipment),
                  isExternal: true,
                  label: "أضف معدة",
                  sub: "/equipment",
                  subLabel: "تصفح المعدات",
                },
              ].map((s, i) => (
                <div
                  key={i}
                  className="flex flex-col items-center text-center bg-white border border-gray-200 rounded-xl p-3 gap-2"
                >
                  <div
                    className={`w-11 h-11 ${s.accentBg} rounded-xl flex items-center justify-center`}
                  >
                    <s.icon className="w-5 h-5 text-white" />
                  </div>
                  <p className="text-xs font-black text-foreground leading-tight">
                    {s.title}
                  </p>
                  <Link
                    href={s.link}
                    {...(s.isExternal
                      ? { target: "_blank", rel: "noopener noreferrer" }
                      : {})}
                    className={`w-full text-[10px] font-bold py-1.5 rounded-lg text-white ${s.accentBg} hover:opacity-90 transition-opacity`}
                  >
                    {s.label}
                  </Link>
                  <Link
                    href={s.sub}
                    className="text-[10px] font-bold text-muted-foreground hover:text-primary transition-colors"
                  >
                    {s.subLabel}
                  </Link>
                </div>
              ))}
            </div>
            {/* Desktop-only full cards */}
            <div className="hidden md:grid md:grid-cols-3 gap-6">
              {[
                {
                  title: "بيع سيارتك الآن",
                  desc: "انشر إعلانك في دقائق واجذب آلاف المشترين الجادين في المنيا.",
                  icon: Car,
                  bg: "bg-blue-50",
                  iconBg: "bg-blue-600",
                  link: getWhatsAppUrl(WHATSAPP_MESSAGES.sellCar),
                  isExternal: true,
                  action: "اعرض سيارتي",
                },
                {
                  title: "دليل المعارض",
                  desc: "استكشف قائمة شاملة بأفضل معارض السيارات المعتمدة.",
                  icon: Settings,
                  bg: "bg-amber-50",
                  iconBg: "bg-amber-600",
                  link: "/showrooms",
                  action: "تصفح المعارض",
                },
                {
                  title: "المعدات الثقيلة",
                  desc: "قسم متخصص للجرارات والمعدات الزراعية والآلات الثقيلة.",
                  icon: Tractor,
                  bg: "bg-emerald-50",
                  iconBg: "bg-emerald-600",
                  link: "/equipment",
                  action: "قسم المعدات",
                },
              ].map((service, i) => (
                <Card
                  key={i}
                  className="border border-gray-200 rounded-xl overflow-hidden group bg-white transition-all h-full flex flex-col shadow-none hover:shadow-none"
                >
                  <div
                    className={`h-32 ${service.bg} relative overflow-hidden flex items-center justify-center`}
                  >
                    <div
                      className={`w-16 h-16 ${service.iconBg} rounded-xl flex items-center justify-center relative z-10 transition-transform group-hover:scale-110`}
                    >
                      <service.icon className="w-8 h-8 text-white" />
                    </div>
                  </div>
                  <CardContent className="p-6 text-center flex-1 flex flex-col justify-between space-y-4">
                    <div className="space-y-2">
                      <h3 className="text-xl font-bold text-foreground">
                        {service.title}
                      </h3>
                      <p className="text-muted-foreground text-sm font-medium leading-relaxed">
                        {service.desc}
                      </p>
                    </div>
                    <Button
                      asChild
                      variant={
                        service.iconBg.includes("amber")
                          ? "secondary"
                          : "outline"
                      }
                      className="w-full h-11 rounded-lg text-base font-bold group/btn"
                    >
                      <Link
                        href={service.link}
                        {...(service.isExternal
                          ? { target: "_blank", rel: "noopener noreferrer" }
                          : {})}
                      >
                        {service.isExternal && (
                          <WhatsAppIcon className="ml-2 w-4 h-4" />
                        )}
                        {service.action}
                        <ArrowRight className="mr-2 h-4 w-4 rotate-180 transition-transform" />
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>

          {/* Featured Cars Section */}
          <section className="space-y-4">
            {/* Mobile header */}
            <div className="flex items-center justify-between border-b border-gray-200 pb-3 md:hidden">
              <div className="flex items-center gap-2">
                <div className="w-1 h-5 bg-primary rounded-full" />
                <h2 className="text-lg font-black text-foreground">
                  أحدث السيارات للبيع
                </h2>
              </div>
              <Link
                href="/cars"
                className="text-xs font-bold text-primary hover:underline flex items-center gap-1"
              >
                عرض الكل <ChevronLeft className="h-3 w-3" />
              </Link>
            </div>
            {/* Desktop header */}
            <div className="hidden md:flex justify-between items-end gap-6 border-b border-gray-200 pb-4">
              <div className="space-y-1 text-right">
                <h2 className="text-2xl md:text-3xl font-black text-foreground">
                  أحدث السيارات <span className="text-primary">للبيع</span>
                </h2>
              </div>
              <Button
                variant="outline"
                asChild
                size="sm"
                className="rounded-lg bg-white text-black border-gray-200 hover:bg-gray-50 px-4 shrink-0 font-bold"
              >
                <Link href="/cars" className="flex items-center gap-2">
                  عرض الكل <ChevronLeft className="h-4 w-4" />
                </Link>
              </Button>
            </div>

            {(isLoading || featuredCars.length > 0) && (
              <div className="w-full max-w-full min-w-0 overflow-hidden pb-4">
                <HomeSectionCarousel
                  navKey="featured-cars"
                  loop={!isLoading && featuredCars.length > 3}
                  autoplayDelay={5500}
                  spaceBetween={12}
                  slidesPerView={1.4}
                  breakpoints={{
                    480: { slidesPerView: 1.2, spaceBetween: 16 },
                    640: { slidesPerView: 1.4, spaceBetween: 16 },
                    1024: { slidesPerView: 3, spaceBetween: 24 },
                  }}
                >
                  {isLoading
                    ? Array.from({ length: 3 }).map((_, i) => (
                        <SwiperSlide key={i} className="h-auto!">
                          <Card className="rounded-lg overflow-hidden border-0 shadow-none h-full">
                            <Skeleton className="h-64 w-full" />
                            <div className="p-8 space-y-6">
                              <Skeleton className="h-10 w-3/4" />
                              <div className="flex gap-4">
                                <Skeleton className="h-6 w-20" />
                                <Skeleton className="h-6 w-20" />
                              </div>
                              <Skeleton className="h-14 w-full rounded-2xl" />
                            </div>
                          </Card>
                        </SwiperSlide>
                      ))
                    : featuredCars.map((car: CarType) => (
                        <SwiperSlide key={car._id} className="h-auto!">
                          <CarCard car={car} />
                        </SwiperSlide>
                      ))}
                </HomeSectionCarousel>
              </div>
            )}
          </section>

          {/* Equipment Section */}
          {featuredEquipment.length > 0 && (
            <section className="space-y-4">
              {/* Mobile header */}
              <div className="flex items-center justify-between border-b border-gray-200 pb-3 md:hidden">
                <div className="flex items-center gap-2">
                  <div className="w-1 h-5 bg-emerald-600 rounded-full" />
                  <h2 className="text-lg font-black text-foreground">
                    معدات ثقيلة وزراعية
                  </h2>
                </div>
                <Link
                  href="/equipment"
                  className="text-xs font-bold text-primary hover:underline flex items-center gap-1"
                >
                  عرض الكل <ChevronLeft className="h-3 w-3" />
                </Link>
              </div>
              {/* Desktop header */}
              <div className="hidden md:flex justify-between items-end gap-6 border-b border-gray-200 pb-4">
                <div className="space-y-1 text-right">
                  <h2 className="text-2xl md:text-3xl font-black text-foreground">
                    معدات <span className="text-primary">ثقيلة وزراعية</span>
                  </h2>
                </div>
                <Button
                  variant="outline"
                  asChild
                  size="sm"
                  className="rounded-lg bg-white shrink-0 hover:bg-gray-50 font-bold"
                >
                  <Link href="/equipment" className="flex items-center gap-2">
                    عرض الكل <ChevronLeft className="h-4 w-4" />
                  </Link>
                </Button>
              </div>
              <div className="w-full max-w-full min-w-0 overflow-hidden pb-4">
                <HomeSectionCarousel
                  navKey="featured-equipment"
                  loop={featuredEquipment.length > 3}
                  autoplayDelay={6000}
                  spaceBetween={12}
                  slidesPerView={1.4}
                  breakpoints={{
                    480: { slidesPerView: 1.5, spaceBetween: 16 },
                    640: { slidesPerView: 2, spaceBetween: 16 },
                    1024: { slidesPerView: 3, spaceBetween: 24 },
                  }}
                >
                  {featuredEquipment.map((item: Equipment) => (
                    <SwiperSlide key={item._id} className="h-auto!">
                      <EquipmentCard equipment={item} />
                    </SwiperSlide>
                  ))}
                </HomeSectionCarousel>
              </div>
            </section>
          )}

          <section className="space-y-4">
            {/* Mobile header */}
            <div className="flex items-center justify-between border-b border-gray-200 pb-3 md:hidden">
              <div className="flex items-center gap-2">
                <div className="w-1 h-5 bg-blue-600 rounded-full" />
                <h2 className="text-lg font-black text-foreground">
                  أخبار السيارات
                </h2>
              </div>
              <Link
                href="/news"
                className="text-xs font-bold text-primary hover:underline flex items-center gap-1"
              >
                عرض الكل <ChevronLeft className="h-3 w-3" />
              </Link>
            </div>
            {/* Desktop header */}
            <div className="hidden md:flex justify-between items-end gap-6 border-b border-gray-200 pb-4">
              <div className="space-y-1 text-right">
                <h2 className="text-2xl md:text-3xl font-black text-foreground">
                  أخبار <span className="text-primary">السيارات</span>
                </h2>
              </div>
              <Button
                variant="outline"
                asChild
                size="sm"
                className="shrink-0 rounded-lg border-gray-200 bg-white text-black hover:bg-gray-50 font-bold"
              >
                <Link href="/news" className="flex items-center gap-2">
                  عرض الكل <ChevronLeft className="h-4 w-4" />
                </Link>
              </Button>
            </div>

            {(newsLoading || newsItems.length > 0) && (
              <div className="w-full max-w-full min-w-0 overflow-hidden pb-4">
                <HomeSectionCarousel
                  navKey="news-market"
                  loop={!newsLoading && newsItems.length > 3}
                  autoplayDelay={6200}
                  spaceBetween={24}
                  slidesPerView={1}
                  breakpoints={{
                    640: { slidesPerView: 2 },
                    1024: { slidesPerView: 3 },
                  }}
                >
                  {newsLoading
                    ? Array.from({ length: 3 }).map((_, i) => (
                        <SwiperSlide key={i} className="h-auto!">
                          <Card className="flex h-full flex-col overflow-hidden rounded-lg border-0 shadow-none">
                            <CardHeader className="space-y-6 p-10 pb-4">
                              <div className="flex justify-between">
                                <Skeleton className="h-7 w-24 rounded-full" />
                                <Skeleton className="h-4 w-20" />
                              </div>
                              <Skeleton className="h-10 w-full max-w-md" />
                              <div className="space-y-3">
                                <Skeleton className="h-4 w-full" />
                                <Skeleton className="h-4 w-full" />
                                <Skeleton className="h-4 w-[80%]" />
                              </div>
                            </CardHeader>
                            <div className="px-10 pb-10">
                              <Skeleton className="h-6 w-32" />
                            </div>
                          </Card>
                        </SwiperSlide>
                      ))
                    : newsItems.map((news: NewsHomeItem) => (
                        <SwiperSlide key={news._id} className="h-auto!">
                          <NewsHomeCard news={news} />
                        </SwiperSlide>
                      ))}
                </HomeSectionCarousel>
              </div>
            )}
          </section>
        </div>
      </main>

      <SupportPanel />
    </div>
  );
}
