"use client"

import { Navbar } from "@/components/navbar"
import { HeroSlider } from "@/components/hero-slider"
import { CarCard } from "@/components/car-card"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Car, TrendingUp, Shield } from "lucide-react"
import Link from "next/link"
import { useFeaturedCars } from "@/hooks/useCars"
import { Skeleton } from "@/components/ui/skeleton"
import { Car as CarType } from "@/hooks/useCars"

const newsItems = [
  {
    id: 1,
    title: "إطلاق موديلات جديدة لعام 2024",
    excerpt: "تستعد الشركات الكبرى لإطلاق أحدث موديلاتها مع تقنيات متطورة.",
    date: "2024-01-15",
    category: "أخبار السيارات",
  },
  {
    id: 2,
    title: "ارتفاع أسعار السيارات الكهربائية",
    excerpt: "شهدت أسعار السيارات الكهربائية ارتفاعاً طفيفاً هذا الشهر.",
    date: "2024-01-14",
    category: "الأسعار",
  },
  {
    id: 3,
    title: "عروض حصرية على السيارات العائلية",
    excerpt: "خصومات تصل إلى 20% على السيارات العائلية المختارة.",
    date: "2024-01-13",
    category: "عروض",
  },
]

export default function HomePage() {
  const { data: carsData, isLoading, error } = useFeaturedCars();
  const featuredCars = carsData?.data || [];

  return (
    <div className="min-h-screen">
      <Navbar />

      <main>
        <section className="mb-12">
          <HeroSlider />
        </section>
        
        <div className="container mx-auto px-4 py-8">
          <section className="mb-12">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardContent className="p-6 text-center">
                <Car className="h-12 w-12 mx-auto mb-4 text-primary" />
                <h3 className="text-lg font-semibold mb-2">أكثر من 500 سيارة</h3>
                <p className="text-muted-foreground">مجموعة متنوعة من السيارات الجديدة والمستعملة</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6 text-center">
                <TrendingUp className="h-12 w-12 mx-auto mb-4 text-primary" />
                <h3 className="text-lg font-semibold mb-2">أسعار تنافسية</h3>
                <p className="text-muted-foreground">أفضل الأسعار في السوق مع ضمان الجودة</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6 text-center">
                <Shield className="h-12 w-12 mx-auto mb-4 text-primary" />
                <h3 className="text-lg font-semibold mb-2">ضمان وموثوقية</h3>
                <p className="text-muted-foreground">جميع سياراتنا مفحصة ومضمونة</p>
              </CardContent>
            </Card>
          </div>
        </section>

        <section className="mb-12">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">السيارات المميزة</h2>
            <Button variant="outline" asChild>
              <Link href="/cars">عرض الكل</Link>
            </Button>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 3 }).map((_, i) => (
                <Card key={i}>
                  <CardContent className="p-0">
                    <Skeleton className="h-48 w-full" />
                    <div className="p-4 space-y-3">
                      <Skeleton className="h-6 w-3/4" />
                      <Skeleton className="h-4 w-1/2" />
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-10 w-full" />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : error ? (
            <Card className="p-8 text-center">
              <Car className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg font-semibold mb-2">حدث خطأ</h3>
              <p className="text-muted-foreground mb-4">
                فشل في تحميل السيارات. يرجى المحاولة مرة أخرى.
              </p>
              <Button onClick={() => window.location.reload()}>
                إعادة المحاولة
              </Button>
            </Card>
          ) : featuredCars.length === 0 ? (
            <Card className="p-8 text-center">
              <Car className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg font-semibold mb-2">لا توجد سيارات حالياً</h3>
              <p className="text-muted-foreground">
                لم يتم إضافة أي سيارات بعد.{" "}
                <Link href="/admin/cars/new" className="text-primary underline">
                  أضف سيارتك الأولى
                </Link>
              </p>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredCars.map((car: CarType) => (
                <CarCard key={car._id} car={car} />
              ))}
            </div>
          )}
        </section>

        <section className="mb-12">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">أحدث الأخبار</h2>
            <Button variant="outline" asChild>
              <Link href="/news">عرض الكل</Link>
            </Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {newsItems.map((news) => (
              <Card key={news.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <Badge variant="secondary">{news.category}</Badge>
                    <span className="text-sm text-muted-foreground">{news.date}</span>
                  </div>
                  <CardTitle className="text-lg">{news.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">{news.excerpt}</p>
                  <Button variant="outline" size="sm" asChild>
                    <Link href={`/news/${news.id}`}>قراءة المزيد</Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      </div>
      </main>
    </div>
  )
}
