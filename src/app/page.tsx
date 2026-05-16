"use client";

import { HeroSlider } from "@/components/hero-slider";
import { CarCard } from "@/components/car-card";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Car,
  Shield,
  PlusCircle,
  ChevronLeft,
  Settings,
  Tractor,
  ArrowRight,
  Sparkles,
  Zap,
} from "lucide-react";
import Link from "next/link";
import { getWhatsAppUrl, WHATSAPP_MESSAGES } from "@/lib/whatsapp";
import { WhatsAppIcon } from "@/components/whatsapp-icon";
import { useFeaturedCars, Car as CarType } from "@/hooks/useCars";
import { useNews } from "@/hooks/useContent";
import { useFeaturedEquipment, type Equipment } from "@/hooks/useEquipment";
import { EquipmentCard } from "@/components/equipment-card";
import { Skeleton } from "@/components/ui/skeleton";
import { SwiperSlide } from "swiper/react";
import { HomeSectionCarousel } from "@/components/home-section-carousel";
import { NewsHomeCard, type NewsHomeItem } from "@/components/news-home-card";

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
          {/* Main Services */}
          <section className="space-y-8">
            <div className="max-w-4xl mx-auto text-center space-y-4">
              <h2 className="text-2xl md:text-4xl font-black tracking-tight text-foreground">
                الخدمات <span className="text-primary">الرئيسية</span>
              </h2>
              <p className="text-muted-foreground text-base md:text-lg font-medium max-w-2xl mx-auto">
                اكتشف مجموعة واسعة من السيارات والمعدات أو اعرض سيارتك للبيع بكل
                سهولة.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Service Cards */}
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
                      className={`w-16 h-16 ${service.iconBg} rounded-xl flex items-center justify-center shadow-none relative z-10 transition-transform group-`}
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
                      className="w-full h-12 rounded-lg text-base font-bold group/btn"
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
          <section className="space-y-6">
            <div className="flex md:flex-row justify-between items-end gap-6 border-b border-gray-200 pb-4">
              <div className="space-y-2 text-right">
                <h2 className="text-2xl md:text-3xl font-black text-foreground">
                  أحدث السيارات <span className="text-primary">للبيع</span>
                </h2>
              </div>
              <Button
                variant="outline"
                asChild
                size="sm"
                className="rounded-lg bg-white text-black border-gray-200 hover:bg-gray-50 transition-all px-4 shrink-0 font-bold"
              >
                <Link href="/cars" className="flex items-center gap-2">
                  عرض الكل
                  <ChevronLeft className="h-4 w-4" />
                </Link>
              </Button>
            </div>

            {(isLoading || featuredCars.length > 0) && (
              <div className="w-full max-w-full min-w-0 overflow-hidden pb-4">
                <HomeSectionCarousel
                  navKey="featured-cars"
                  loop={!isLoading && featuredCars.length > 3}
                  autoplayDelay={5500}
                  spaceBetween={24}
                  slidesPerView={1}
                  breakpoints={{
                    640: { slidesPerView: 2 },
                    1024: { slidesPerView: 3 },
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
            <section className="space-y-6">
              <div className="flex md:flex-row justify-between items-end gap-6 border-b border-gray-200 pb-4">
                <div className="space-y-2 text-right">
                  <h2 className="text-2xl md:text-3xl font-black text-foreground">
                    معدات <span className="text-primary">ثقيلة وزراعية</span>
                  </h2>
                </div>
                <Button
                  variant="outline"
                  asChild
                  size="sm"
                  className="rounded-lg bg-white shrink-0 hover:bg-gray-50 transition-all font-bold"
                >
                  <Link href="/equipment" className="flex items-center gap-2">
                    عرض الكل
                    <ChevronLeft className="h-4 w-4" />
                  </Link>
                </Button>
              </div>
              <div className="w-full max-w-full min-w-0 overflow-hidden pb-4">
                <HomeSectionCarousel
                  navKey="featured-equipment"
                  loop={featuredEquipment.length > 3}
                  autoplayDelay={6000}
                  spaceBetween={24}
                  slidesPerView={1}
                  breakpoints={{
                    640: { slidesPerView: 2 },
                    1024: { slidesPerView: 3 },
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

          <section className="space-y-6">
            <div className="flex  justify-between gap-6 border-b border-gray-200 pb-4 md:flex-row md:items-end">
              <div className="space-y-2 text-right">
                <h2 className="mx-2 truncate text-2xl font-black text-foreground md:text-3xl">
                  أخبار <span className="text-primary">السيارات</span>
                </h2>
              </div>
              <Button
                variant="outline"
                asChild
                size="sm"
                className="shrink-0 rounded-lg border-gray-200 bg-white text-black transition-all hover:bg-gray-50 font-bold"
              >
                <Link href="/news" className="flex items-center gap-2">
                  عرض الكل
                  <ChevronLeft className="h-4 w-4" />
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
        <div className="container mx-auto max-w-7xl px-4 py-20 relative z-30 w-full">
          <div className="w-full overflow-hidden pb-8">
            <HomeSectionCarousel
              navKey="hero-stats"
              loop={false}
              autoplayDelay={5000}
              spaceBetween={20}
              slidesPerView={1}
              breakpoints={{
                640: { slidesPerView: 2 },
                1024: { slidesPerView: 3 },
              }}
            >
              {[
                {
                  icon: Car,
                  title: "أكثر من 500 سيارة",
                  desc: "جديد ومستعمل بأفضل الحالات",
                  color: "bg-blue-600",
                },
                {
                  icon: Zap,
                  title: "أسعار تنافسية",
                  desc: "عروض حصرية وتسهيلات بنكية",
                  color: "bg-amber-600",
                },
                {
                  icon: Shield,
                  title: "ضمان وموثوقية",
                  desc: "فحص شامل وتقارير فنية معتمدة",
                  color: "bg-emerald-600",
                },
              ].map((stat, idx) => (
                <SwiperSlide key={idx} className="h-auto!">
                  <Card className=" border-0 rounded-lg overflow-hidden group transition-all duration-500 bg-white/90 backdrop-blur-xl h-full border-t border-white/50">
                    <CardContent className="p-6 flex items-center gap-5">
                      <div
                        className={`w-12 h-12 ${stat.color} rounded-lg flex items-center justify-center shrink-0 shadow-none transition-transform group-hover:scale-110`}
                      >
                        <stat.icon className="h-8 w-8 text-white" />
                      </div>
                      <div className="space-y-1 text-right">
                        <h3 className="text-xl font-black text-[#1A1A1A]">
                          {stat.title}
                        </h3>
                        <p className="text-muted-foreground text-sm font-bold leading-relaxed">
                          {stat.desc}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </SwiperSlide>
              ))}
            </HomeSectionCarousel>
          </div>
        </div>
      </main>

      <footer className="bg-[#1B3E7A] text-white pt-16 pb-8 border-t-4 border-accent">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
            <div className="md:col-span-2 space-y-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white rounded-lg shadow-none">
                  <Car className="h-6 w-6 text-[#1B3E7A]" />
                </div>
                <span className="font-black text-2xl tracking-tighter text-white">
                  سيارات المنيا
                </span>
              </div>
              <p className="text-gray-400 text-xl max-w-md leading-relaxed font-medium">
                المنصة الأكبر والأكثر ثقة لبيع وشراء السيارات والمعدات في محافظة
                المنيا. نربط البائع بالمشتري بكل سهولة.
              </p>
            </div>
            <div className="space-y-6">
              <h4 className="text-xl font-black text-white">روابط سريعة</h4>
              <ul className="space-y-4 text-gray-400 font-bold">
                <li>
                  <Link
                    href="/cars"
                    className="hover:text-primary transition-colors"
                  >
                    سيارات للبيع
                  </Link>
                </li>
                <li>
                  <Link
                    href="/equipment"
                    className="hover:text-primary transition-colors"
                  >
                    معدات ثقيلة
                  </Link>
                </li>
                <li>
                  <Link
                    href="/showrooms"
                    className="hover:text-primary transition-colors"
                  >
                    معارض السيارات
                  </Link>
                </li>
                <li>
                  <Link
                    href="/news"
                    className="hover:text-primary transition-colors"
                  >
                    أخبار السوق
                  </Link>
                </li>
              </ul>
            </div>
            <div className="space-y-6">
              <h4 className="text-xl font-black text-white">تواصل معنا</h4>
              <Button
                asChild
                className="w-full h-16 rounded-2xl bg-[#22C55E] hover:bg-green-600 text-black font-black text-lg"
              >
                <a
                  href={getWhatsAppUrl(WHATSAPP_MESSAGES.default)}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <WhatsAppIcon />
                  تواصل عبر واتساب
                </a>
              </Button>
            </div>
          </div>
          <div className="border-t border-white/10 pt-12 flex flex-col md:flex-row justify-between items-center gap-8">
            <p className="text-gray-500 text-sm font-bold">
              © 2026 سوق سيارات المنيا. جميع الحقوق محفوظة.
            </p>
            <div className="flex gap-8 text-gray-400 font-bold text-sm">
              <Link
                href="/privacy"
                className="hover:text-white transition-colors"
              >
                سياسة الخصوصية
              </Link>
              <Link
                href="/terms"
                className="hover:text-white transition-colors"
              >
                شروط الاستخدام
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
