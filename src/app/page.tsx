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
    <div className="min-h-screen bg-[#F9F6F1]">
      <main>
        {/* Hero Section */}
        <section className="relative w-full min-w-0 overflow-x-hidden">
          <HeroSlider />

          {/* Floating Stats */}
        </section>

        <div className="container mx-auto px-4 py-16 md:py-32 space-y-24 md:space-y-40">
          {/* Main Services (The "Wow" Section) */}
          <section className="space-y-16">
            <div className="max-w-4xl mx-auto text-center space-y-8">
              <div className="inline-flex items-center gap-2 px-6 py-2 rounded-full bg-primary/10 text-primary border border-primary/20 animate-pulse">
                <Sparkles className="w-4 h-4" />
                <span className="text-xs font-black uppercase tracking-widest">
                  منصة المنيا الأولى
                </span>
              </div>
              <h2 className="text-4xl md:text-8xl font-[1000] tracking-tighter leading-[0.9] text-[#1A1A1A]">
                تجربة تسوق <br />{" "}
                <span className="text-primary italic">فاخرة</span> لكل السيارات
              </h2>
              <p className="text-muted-foreground text-lg md:text-2xl font-medium max-w-2xl mx-auto">
                سواء كنت تشتري سيارة أحلامك أو تبيع معداتك الثقيلة، نحن نوفر لك
                الطريق الأسرع والأكثر أماناً في صعيد مصر.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Service Cards */}
              {[
                {
                  title: "بيع سيارتك الآن",
                  desc: "انشر إعلانك في دقائق واجذب آلاف المشترين الجادين في المنيا والمحافظات المجاورة.",
                  icon: Car,
                  bg: "bg-blue-50",
                  iconBg: "bg-blue-600",
                  link: getWhatsAppUrl(WHATSAPP_MESSAGES.sellCar),
                  isExternal: true,
                  action: "اعرض سيارتي",
                },
                {
                  title: "دليل المعارض",
                  desc: "استكشف قائمة شاملة بأفضل معارض السيارات المعتمدة والموثوقة في جميع أنحاء المنيا.",
                  icon: Settings,
                  bg: "bg-amber-50",
                  iconBg: "bg-amber-600",
                  link: "/showrooms",
                  action: "تصفح المعارض",
                },
                {
                  title: "المعدات الثقيلة",
                  desc: "قسم متخصص للجرارات والمعدات الزراعية والآلات الثقيلة بأسعار تنافسية جداً.",
                  icon: Tractor,
                  bg: "bg-emerald-50",
                  iconBg: "bg-emerald-600",
                  link: "/equipment",
                  action: "قسم المعدات",
                },
              ].map((service, i) => (
                <Card
                  key={i}
                  className="border-0  rounded-[3rem] overflow-hidden group bg-white  transition-all h-full flex flex-col"
                >
                  <div
                    className={`h-48 ${service.bg} relative overflow-hidden flex items-center justify-center`}
                  >
                    <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-black via-transparent to-transparent group-hover:scale-150 transition-transform duration-1000"></div>
                    <div
                      className={`w-24 h-24 ${service.iconBg} rounded-[2rem] flex items-center justify-center shadow-2xl relative z-10 transition-transform group-hover:scale-110 group-hover:-rotate-6`}
                    >
                      <service.icon className="w-12 h-12 text-white" />
                    </div>
                  </div>
                  <CardContent className="p-10 text-center flex-1 flex flex-col justify-between space-y-6">
                    <div className="space-y-4">
                      <h3 className="text-2xl font-black text-[#1A1A1A]">
                        {service.title}
                      </h3>
                      <p className="text-muted-foreground font-medium leading-relaxed">
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
                      className="w-full h-16 rounded-2xl text-lg font-black group/btn"
                    >
                      <Link
                        href={service.link}
                        {...(service.isExternal
                          ? { target: "_blank", rel: "noopener noreferrer" }
                          : {})}
                      >
                        {service.isExternal && (
                          <WhatsAppIcon className="ml-2" />
                        )}
                        {service.action}
                        <ArrowRight className="mr-2 h-5 w-5 rotate-180 group-hover/btn:-translate-x-2 transition-transform" />
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>

          {/* Featured Cars Section */}
          <section className="space-y-12">
            <div className="flex md:flex-row justify-between items-end gap-6 border-b border-gray-200 pb-12">
              <div className="space-y-4 text-right">
                <Badge
                  variant="secondary"
                  className="px-4 py-1.5 rounded-full bg-amber-100 text-amber-700 font-black text-xs tracking-widest uppercase"
                >
                  الأكثر طلباً
                </Badge>
                <h2 className="text-4xl mx-2 truncate md:text-7xl font-[1000] tracking-tighter text-[#1A1A1A]">
                  سيارات <span className="text-primary italic">مختارة</span>
                </h2>
              </div>
              <Button
                variant="outline"
                asChild
                size="xl"
                className="rounded-full bg-white text-black border-gray-200 hover:bg-black hover:text-white transition-all px-8 shrink-0"
              >
                <Link href="/cars" className="flex items-center gap-2">
                  اكتشف المعروض بالكامل
                  <ChevronLeft className="h-5 w-5" />
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
                          <Card className="rounded-[2.5rem] overflow-hidden border-0 shadow-lg h-full">
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
            <section className="space-y-12">
              <div className="flex md:flex-row justify-between items-end gap-6 border-b border-gray-200 pb-12">
                <div className="space-y-4 text-right">
                  <Badge
                    variant="secondary"
                    className="px-4 py-1.5 rounded-full bg-emerald-100 text-emerald-700 font-black text-xs tracking-widest uppercase"
                  >
                    معدات ثقيلة
                  </Badge>
                  <h2 className="text-4xl mx-2 truncate md:text-7xl font-[1000] tracking-tighter text-[#1A1A1A]">
                    آلات ومعدات <span className="text-emerald-600">زراعية</span>
                  </h2>
                </div>
                <Button
                  variant="outline"
                  asChild
                  size="xl"
                  className="rounded-full bg-white shrink-0 hover:bg-emerald-600 hover:text-white hover:border-emerald-600 transition-all"
                >
                  <Link href="/equipment" className="flex items-center gap-2">
                    تصفح جميع المعدات
                    <ChevronLeft className="h-5 w-5" />
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

          {/* News Section */}
          <section className="space-y-12">
            <div className="flex flex-col justify-between gap-6 border-b border-gray-200 pb-12 md:flex-row md:items-end">
              <div className="space-y-4 text-right">
                <Badge
                  variant="secondary"
                  className="rounded-full bg-blue-100 px-4 py-1.5 text-xs font-black uppercase tracking-widest text-blue-700"
                >
                  أخبار السوق
                </Badge>
                <h2 className="mx-2 truncate text-4xl font-[1000] tracking-tighter text-[#1A1A1A] md:text-7xl">
                  أخبار <span className="text-blue-600 italic">المنيا</span>
                </h2>
                <p className="text-lg font-bold text-muted-foreground md:text-xl">
                  كل ما يخص عالم السيارات في محافظة المنيا أولاً بأول.
                </p>
              </div>
              <Button
                variant="outline"
                asChild
                size="xl"
                className="shrink-0 rounded-full border-gray-200 bg-white px-10 text-black transition-all hover:bg-blue-600 hover:text-white"
              >
                <Link href="/news" className="flex items-center gap-2">
                  عرض كل الأخبار
                  <ChevronLeft className="h-5 w-5" />
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
                          <Card className="flex h-full flex-col overflow-hidden rounded-[2.5rem] border-0 shadow-lg">
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
                  <Card className="  border-0 rounded-[2.5rem] overflow-hidden group hover:-translate-y-2 transition-all duration-500 bg-white/90 backdrop-blur-xl h-full border-t border-white/50">
                    <CardContent className="p-8 flex items-center gap-6">
                      <div
                        className={`w-16 h-16 ${stat.color} rounded-2xl flex items-center justify-center shrink-0 shadow-lg shadow-black/10 transition-transform group-hover:scale-110 group-hover:rotate-3`}
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

      {/* Footer Enhancements */}
      <footer className="bg-[#1A1A1A] text-white pt-24 pb-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-16 mb-24">
            <div className="md:col-span-2 space-y-8">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-primary rounded-2xl shadow-xl shadow-primary/20">
                  <Car className="h-8 w-8 text-black" />
                </div>
                <span className="font-black text-4xl tracking-tighter">
                  سوق المنيا
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
