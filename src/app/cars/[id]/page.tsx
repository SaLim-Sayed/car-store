"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Navbar } from "@/components/navbar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { 
  Car, 
  Calendar, 
  Fuel, 
  Settings, 
  Gauge, 
  Palette,
  Phone,
  Mail,
  MapPin
} from "lucide-react"

interface Car {
  _id: string
  brand: string
  model: string
  year: number
  price: number
  fuelType: string
  transmission: string
  mileage: number
  color: string
  description: string
  images: string[]
  features: string[]
  status: string
  createdAt: string
}

export default function CarDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [car, setCar] = useState<Car | null>(null)
  const [loading, setLoading] = useState(true)
  const [selectedImage, setSelectedImage] = useState(0)

  // Mock data for demonstration
  const mockCar: Car = {
    _id: "1",
    brand: "تويوتا",
    model: "كامري",
    year: 2023,
    price: 120000,
    fuelType: "بنزين",
    transmission: "أوتوماتيك",
    mileage: 15000,
    color: "أبيض",
    description: "سيارة تويوتا كامري 2023 بحالة ممتازة، موتور قوي واستهلاك وقود منخفض. السيارة مجهزة بأحدث تقنيات الأمان والراحة، وتتميز بتصميم داخلي فاخر ومساحة واسعة للركاب.",
    images: [
      "https://images.unsplash.com/photo-1550355291-bbee04a92027?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1494976388539-d1058494cdd8?w=800&h=600&fit=crop"
    ],
    features: [
      "نظام تثبيت السرعة",
      "كاميرا خلفية",
      "مستشعر ركن سيارة",
      "شاشة لمس 8 بوصة",
      "بلوتوث",
      "مكيف أوتوماتيك",
      "نوافذ كهربائية",
      "مرايا كهربائية"
    ],
    status: "متاح",
    createdAt: new Date().toISOString()
  }

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setCar(mockCar)
      setLoading(false)
    }, 1000)
  }, [params.id])

  const getStatusColor = (status: string) => {
    switch (status) {
      case "متاح":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
      case "مباع":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
      case "محجوز":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300"
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <main className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div>
              <Skeleton className="h-96 w-full rounded-lg" />
            </div>
            <div className="space-y-4">
              <Skeleton className="h-8 w-3/4" />
              <Skeleton className="h-6 w-1/2" />
              <Skeleton className="h-20 w-full" />
              <Skeleton className="h-10 w-full" />
            </div>
          </div>
        </main>
      </div>
    )
  }

  if (!car) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <main className="container mx-auto px-4 py-8">
          <Card className="p-8 text-center">
            <Car className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-lg font-semibold mb-2">السيارة غير موجودة</h3>
            <p className="text-muted-foreground mb-4">
              لم يتم العثور على السيارة المطلوبة
            </p>
            <Button onClick={() => router.push("/cars")}>
              العودة إلى قائمة السيارات
            </Button>
          </Card>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      <Navbar />
      
      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Images Section */}
          <div>
            <div className="mb-4">
              <img
                src={car.images[selectedImage]}
                alt={`${car.brand} ${car.model}`}
                className="w-full h-96 object-cover rounded-lg"
              />
            </div>
            <div className="grid grid-cols-4 gap-2">
              {car.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`border-2 rounded overflow-hidden transition-all ${
                    selectedImage === index
                      ? "border-primary"
                      : "border-transparent hover:border-muted-foreground"
                  }`}
                >
                  <img
                    src={image}
                    alt={`${car.brand} ${car.model} ${index + 1}`}
                    className="w-full h-20 object-cover"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Car Details Section */}
          <div className="space-y-6">
            <div>
              <div className="flex items-center justify-between mb-2">
                <h1 className="text-3xl font-bold">
                  {car.brand} {car.model}
                </h1>
                <Badge className={getStatusColor(car.status)}>
                  {car.status}
                </Badge>
              </div>
              <p className="text-2xl font-bold text-primary mb-4">
                {car.price.toLocaleString()} ريال
              </p>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>المواصفات الأساسية</CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span>سنة الصنع: {car.year}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Fuel className="h-4 w-4 text-muted-foreground" />
                  <span>نوع الوقود: {car.fuelType}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Settings className="h-4 w-4 text-muted-foreground" />
                  <span>ناقل الحركة: {car.transmission}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Gauge className="h-4 w-4 text-muted-foreground" />
                  <span>المسافة: {car.mileage.toLocaleString()} كم</span>
                </div>
                <div className="flex items-center gap-2">
                  <Palette className="h-4 w-4 text-muted-foreground" />
                  <span>اللون: {car.color}</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>الوصف</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed">
                  {car.description}
                </p>
              </CardContent>
            </Card>

            {car.features && car.features.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>المميزات</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-2">
                    {car.features.map((feature, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-2 p-2 bg-muted rounded"
                      >
                        <div className="w-2 h-2 bg-primary rounded-full" />
                        <span className="text-sm">{feature}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            <div className="flex gap-4">
              <Button size="lg" className="flex-1">
                <Phone className="h-4 w-4 ml-2" />
                اتصل بنا
              </Button>
              <Button variant="outline" size="lg" className="flex-1">
                <Mail className="h-4 w-4 ml-2" />
                إرسال رسالة
              </Button>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
