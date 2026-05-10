import { Navbar } from "@/components/navbar"
import { HeroSlider } from "@/components/hero-slider"
import { CarCard } from "@/components/car-card"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Car, TrendingUp, Users, Shield } from "lucide-react"
import Link from "next/link"

// Mock data for demonstration
const featuredCars = [
  {
    _id: "1",
    brand: "تويوتا",
    model: "كامري",
    year: 2023,
    price: 120000,
    fuelType: "بنزين",
    transmission: "أوتوماتيك",
    mileage: 15000,
    color: "أبيض",
    description: "سيارة تويوتا كامري 2023 بحالة ممتازة، موتور قوي واستهلاك وقود منخفض.",
    images: ["https://images.unsplash.com/photo-1550355291-bbee04a92027?w=400&h=300&fit=crop"],
    status: "متاح",
    createdAt: new Date().toISOString()
  },
  {
    _id: "2",
    brand: "هونداي",
    model: "سوناتا",
    year: 2022,
    price: 95000,
    fuelType: "بنزين",
    transmission: "أوتوماتيك",
    mileage: 25000,
    color: "أسود",
    description: "هونداي سوناتا 2022 بميزات متقدمة وتصميم عصري.",
    images: ["https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=400&h=300&fit=crop"],
    status: "متاح",
    createdAt: new Date().toISOString()
  },
  {
    _id: "3",
    brand: "نيسان",
    model: "ألتيما",
    year: 2023,
    price: 110000,
    fuelType: "بنزين",
    transmission: "أوتوماتيك",
    mileage: 8000,
    color: "فضي",
    description: "نيسان ألتيما 2023 بتقنيات أمان متقدمة وأداء ممتاز.",
    images: ["https://images.unsplash.com/photo-1494976388539-d1058494cdd8?w=400&h=300&fit=crop"],
    status: "متاح",
    createdAt: new Date().toISOString()
  }
]

const newsItems = [
  {
    id: 1,
    title: "إطلاق موديلات جديدة لعام 2024",
    excerpt: "تستعد الشركات الكبرى لإطلاق أحدث موديلاتها مع تقنيات متطورة.",
    date: "2024-01-15",
    category: "أخبار السيارات"
  },
  {
    id: 2,
    title: "ارتفاع أسعار السيارات الكهربائية",
    excerpt: "شهدت أسعار السيارات الكهربائية ارتفاعاً طفيفاً هذا الشهر.",
    date: "2024-01-14",
    category: "الأسعار"
  },
  {
    id: 3,
    title: "عروض حصرية على السيارات العائلية",
    excerpt: "خصومات تصل إلى 20% على السيارات العائلية المختارة.",
    date: "2024-01-13",
    category: "عروض"
  }
]

export default function HomePage() {
  return (
    <div className="min-h-screen">
      <Navbar />
      
      <main className="container mx-auto px-4 py-8">
        <section className="mb-12">
          <HeroSlider />
        </section>

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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredCars.map((car) => (
              <CarCard key={car._id} car={car} />
            ))}
          </div>
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
      </main>
    </div>
  )
}
