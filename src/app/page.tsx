"use client"

import { HeroSlider } from "@/components/hero-slider"
import { CarCard } from "@/components/car-card"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { 
  Car, 
  TrendingUp, 
  Shield, 
  PlusCircle, 
  ChevronLeft, 
  Settings, 
  Users, 
  HelpCircle, 
  Phone, 
  Info 
} from "lucide-react"
import Link from "next/link"
import { getWhatsAppUrl, WHATSAPP_MESSAGES } from "@/lib/whatsapp"
import { WhatsAppIcon } from "@/components/whatsapp-icon"
import { useFeaturedCars, Car as CarType } from "@/hooks/useCars"
import { useNews } from "@/hooks/useContent"
import { useFeaturedEquipment, type Equipment } from "@/hooks/useEquipment"
import { EquipmentCard } from "@/components/equipment-card"
import { FormattedDate } from "@/components/formatted-date"
import { Skeleton } from "@/components/ui/skeleton"

export default function HomePage() {
  const { data: carsData, isLoading, error } = useFeaturedCars();
  const { data: newsData } = useNews(3);
  const { data: equipmentData } = useFeaturedEquipment(3);
  
  const featuredCars = carsData?.data || [];
  const newsItems = newsData?.data || [];
  const featuredEquipment = equipmentData?.data || [];

  return (
    <div className="min-h-screen bg-background">
 
      <main>
        <section className="relative">
          <HeroSlider />
          
          {/* Overlapping Feature Cards */}
          <div className="container mx-auto px-4 -mt-28 relative z-30">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
              <Card className="shadow-xl border-0 rounded-[2.5rem] overflow-hidden group hover:-translate-y-2 transition-transform duration-500 bg-white">
                <CardContent className="p-10 text-center space-y-6">
                  <div className="w-20 h-20 bg-[#1A1A1A] rounded-3xl flex items-center justify-center mx-auto transition-transform group-hover:scale-110">
                    <Car className="h-8 w-8 text-[#D97706]" />
                  </div>
                  <div className="space-y-3">
                    <h3 className="text-2xl font-black">أكثر من 500 سيارة</h3>
                    <p className="text-muted-foreground text-base leading-relaxed">
                      مجموعة متنوعة من السيارات الجديدة والمستعملة
                    </p>
                  </div>
                </CardContent>
              </Card>
              <Card className="shadow-xl border-0 rounded-[2.5rem] overflow-hidden group hover:-translate-y-2 transition-transform duration-500 bg-white">
                <CardContent className="p-10 text-center space-y-6">
                  <div className="w-20 h-20 bg-[#1A1A1A] rounded-3xl flex items-center justify-center mx-auto transition-transform group-hover:scale-110">
                    <TrendingUp className="h-8 w-8 text-[#D97706]" />
                  </div>
                  <div className="space-y-3">
                    <h3 className="text-2xl font-black">أسعار تنافسية</h3>
                    <p className="text-muted-foreground text-base leading-relaxed">
                      أفضل الأسعار في السوق مع ضمان الجودة
                    </p>
                  </div>
                </CardContent>
              </Card>
              <Card className="shadow-xl border-0 rounded-[2.5rem] overflow-hidden group hover:-translate-y-2 transition-transform duration-500 bg-white">
                <CardContent className="p-10 text-center space-y-6">
                  <div className="w-20 h-20 bg-[#1A1A1A] rounded-3xl flex items-center justify-center mx-auto transition-transform group-hover:scale-110">
                    <Shield className="h-8 w-8 text-[#D97706]" />
                  </div>
                  <div className="space-y-3">
                    <h3 className="text-2xl font-black">ضمان وموثوقية</h3>
                    <p className="text-muted-foreground text-base leading-relaxed">
                      جميع سياراتنا مفحصة ومضمونة
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
        
        <div className="container mx-auto px-4 py-24 space-y-32">
          {/* Services Section */}
          <section className="space-y-16">
            <div className="text-center space-y-6">
              <Badge variant="outline" className="px-8 py-2.5 text-[#D97706] border-[#D97706]/20 bg-[#FEF3C7] rounded-full text-lg font-black shadow-sm">خدماتنا</Badge>
              <h2 className="text-5xl md:text-7xl font-[1000] tracking-tighter">كل ما تحتاجه في مكان واحد</h2>
              <p className="text-muted-foreground text-2xl font-medium">تصفح، اعرض، وتواصل بسهولة عبر منصتنا</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 max-w-6xl mx-auto">
              {/* Card 1: Sell Car */}
              <Card className="border-0 shadow-[0_20px_50px_rgba(0,0,0,0.05)] rounded-[3.5rem] overflow-hidden group bg-white transition-all hover:shadow-[0_20px_60px_rgba(0,0,0,0.08)]">
                <CardContent className="p-12 flex flex-col md:flex-row items-center gap-10">
                  <div className="flex-1 space-y-8 order-2 md:order-1 text-center md:text-right">
                    <h3 className="text-4xl font-[1000] tracking-tight">اعرض سيارتك للبيع هنا</h3>
                    <p className="text-muted-foreground text-xl leading-relaxed font-medium">انشر إعلانك بسهولة، وصل لآلاف المشترين المحتملين في المنيا.</p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start pt-2 w-full max-w-lg">
                      <Button asChild size="2xl" variant="accent" className="w-full sm:flex-1 min-w-[200px]">
                        <a
                          href={getWhatsAppUrl(WHATSAPP_MESSAGES.sellCar)}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <WhatsAppIcon />
                          اعرض سيارتي
                        </a>
                      </Button>
                      <Button asChild size="2xl" variant="surface" className="w-full sm:flex-1 min-w-[200px]">
                        <Link href="/cars">
                          تصفح المعروض
                          <ChevronLeft />
                        </Link>
                      </Button>
                    </div>
                  </div>
                  <div className="w-28 h-28 bg-[#1A1A1A] rounded-[2.5rem] flex items-center justify-center order-1 md:order-2 shrink-0 shadow-2xl">
                    <Car className="h-12 w-12 text-[#D97706]" />
                  </div>
                </CardContent>
              </Card>

              {/* Card 2: Showrooms */}
              <Card className="border-0 shadow-[0_20px_50px_rgba(0,0,0,0.05)] rounded-[3.5rem] overflow-hidden group bg-white transition-all hover:shadow-[0_20px_60px_rgba(0,0,0,0.08)]">
                <CardContent className="p-12 flex flex-col md:flex-row items-center gap-10">
                  <div className="flex-1 space-y-8 order-2 md:order-1 text-center md:text-right">
                    <h3 className="text-4xl font-[1000] tracking-tight">معارض السيارات بأنحاء المنيا</h3>
                    <p className="text-muted-foreground text-xl leading-relaxed font-medium">دليل شامل لجميع معارض السيارات في محافظة المنيا.</p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start pt-2 w-full max-w-lg">
                      <Button asChild size="2xl" variant="accent" className="w-full sm:flex-1 min-w-[200px]">
                        <Link href="/admin/showrooms/new">
                          <PlusCircle />
                          اشتراك معرض جديد
                        </Link>
                      </Button>
                      <Button asChild size="2xl" variant="surface" className="w-full sm:flex-1 min-w-[200px]">
                        <Link href="/showrooms">
                          تصفح المعارض
                          <ChevronLeft />
                        </Link>
                      </Button>
                    </div>
                  </div>
                  <div className="w-28 h-28 bg-[#1A1A1A] rounded-[2.5rem] flex items-center justify-center order-1 md:order-2 shrink-0 shadow-2xl">
                    <Settings className="h-12 w-12 text-[#D97706]" />
                  </div>
                </CardContent>
              </Card>

              {/* Card 3: Heavy Equipment */}
              <Card className="border-0 shadow-[0_20px_50px_rgba(0,0,0,0.05)] rounded-[3.5rem] overflow-hidden group bg-white transition-all hover:shadow-[0_20px_60px_rgba(0,0,0,0.08)]">
                <CardContent className="p-12 flex flex-col md:flex-row items-center gap-10">
                  <div className="flex-1 space-y-8 order-2 md:order-1 text-center md:text-right">
                    <h3 className="text-4xl font-[1000] tracking-tight">آلات زراعية ومعدات ثقيلة</h3>
                    <p className="text-muted-foreground text-xl leading-relaxed font-medium">جرارات، حفارات، شاحنات، ومعدات بناء وزراعة بأسعار تنافسية.</p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start pt-2 w-full max-w-lg">
                      <Button asChild size="2xl" variant="accent" className="w-full sm:flex-1 min-w-[200px]">
                        <a
                          href={getWhatsAppUrl(WHATSAPP_MESSAGES.sellEquipment)}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <WhatsAppIcon />
                          اعرض معداتي
                        </a>
                      </Button>
                      <Button asChild size="2xl" variant="surface" className="w-full sm:flex-1 min-w-[200px]">
                        <Link href="/equipment">
                          تصفح المعروض
                          <ChevronLeft />
                        </Link>
                      </Button>
                    </div>
                  </div>
                  <div className="w-28 h-28 bg-[#1A1A1A] rounded-[2.5rem] flex items-center justify-center order-1 md:order-2 shrink-0 shadow-2xl">
                    <TrendingUp className="h-12 w-12 text-[#D97706]" />
                  </div>
                </CardContent>
              </Card>
            </div>
          </section>
          

          {/* Featured Cars Section */}
          <section className="space-y-8">
            <div className="flex justify-between items-center">
              <h2 className="text-5xl md:text-6xl font-[1000] tracking-tighter">السيارات المميزة</h2>
              <Button variant="outline" asChild size="xl" className="rounded-full bg-white text-black border-gray-200 hover:bg-gray-50 shadow-sm shrink-0">
                <Link href="/cars">
                  عرض الكل
                  <ChevronLeft />
                </Link>
              </Button>
            </div>

            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {Array.from({ length: 3 }).map((_, i) => (
                  <Card key={i} className="rounded-3xl overflow-hidden border-0 shadow-lg">
                    <CardContent className="p-0">
                      <Skeleton className="h-64 w-full" />
                      <div className="p-6 space-y-4">
                        <Skeleton className="h-8 w-3/4" />
                        <Skeleton className="h-6 w-1/4" />
                        <div className="flex gap-4">
                          <Skeleton className="h-4 w-16" />
                          <Skeleton className="h-4 w-16" />
                        </div>
                        <Skeleton className="h-12 w-full rounded-2xl" />
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {featuredCars.map((car: CarType) => (
                  <CarCard key={car._id} car={car} />
                ))}
              </div>
            )}
          </section>

          {featuredEquipment.length > 0 && (
            <section className="space-y-8">
              <div className="flex justify-between items-center">
                <h2 className="text-5xl md:text-6xl font-[1000] tracking-tighter">معدات زراعية مميزة</h2>
                <Button variant="outline" asChild size="xl" className="rounded-full bg-white shrink-0">
                  <Link href="/equipment">
                    عرض الكل
                    <ChevronLeft />
                  </Link>
                </Button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {featuredEquipment.map((item: Equipment) => (
                  <EquipmentCard key={item._id} equipment={item} />
                ))}
              </div>
            </section>
          )}

          {/* News Section */}
          <section className="space-y-12">
            <div className="flex justify-between items-center">
              <h2 className="text-4xl md:text-5xl font-black tracking-tight">أحدث الأخبار</h2>
              <Button variant="outline" asChild size="xl" className="rounded-full bg-white text-black border-gray-200 hover:bg-gray-50 shrink-0">
                <Link href="/news">
                  عرض الكل
                  <ChevronLeft />
                </Link>
              </Button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {newsItems.map((news: any) => (
                <Card key={news._id} className="border-0 shadow-xl rounded-[2.5rem] hover:shadow-2xl transition-all group bg-white overflow-hidden">
                  <CardHeader className="p-8 pb-4">
                    <div className="flex justify-between items-start mb-6">
                      <Badge variant="secondary" className="bg-[#FEF3C7] text-[#D97706] border-0 rounded-full px-4 py-1.5 font-bold">{news.category}</Badge>
                      <FormattedDate value={news.date} className="text-sm font-bold text-muted-foreground" />
                    </div>
                    <CardTitle className="text-2xl font-black group-hover:text-primary transition-colors leading-tight">
                      {news.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-8 pt-0">
                    <p className="text-muted-foreground text-lg mb-8 line-clamp-2 leading-relaxed">{news.excerpt}</p>
                    <Link href={`/news/${news._id}`} className="inline-flex items-center text-[#D97706] text-lg font-black hover:gap-4 transition-all">
                      قراءة المزيد
                      <ChevronLeft className="mr-2 h-5 w-5" />
                    </Link>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>
        </div>
      </main>

      <footer className="border-t py-12 bg-white">
        <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-8">
          <p className="text-muted-foreground text-sm order-2 md:order-1">
            © 2026 جميع الحقوق محفوظة.
          </p>
          <div className="flex items-center gap-4 order-1 md:order-2">
            <span className="font-black text-xl">سوق سيارات المنيا</span>
            <div className="p-2 bg-primary/10 rounded-full">
              <Car className="h-6 w-6 text-primary" />
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
