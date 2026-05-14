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
} from "lucide-react"

interface CarDoc {
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
  const [car, setCar] = useState<CarDoc | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedImage, setSelectedImage] = useState(0)

  useEffect(() => {
    const fetchCar = async () => {
      setLoading(true)
      setError(null)
      try {
        const res = await fetch(`/api/cars/${params.id}`)
        const data = await res.json()

        if (data.success) {
          setCar(data.data)
        } else {
          setError(data.error || "السيارة غير موجودة")
        }
      } catch {
        setError("حدث خطأ في الاتصال")
      } finally {
        setLoading(false)
      }
    }

    if (params.id) fetchCar()
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

  if (error || !car) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <main className="container mx-auto px-4 py-8">
          <Card className="p-8 text-center">
            <Car className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-lg font-semibold mb-2">السيارة غير موجودة</h3>
            <p className="text-muted-foreground mb-4">
              {error || "لم يتم العثور على السيارة المطلوبة"}
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
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="container mx-auto px-4 py-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Images Section */}
          <div className="space-y-6">
            <Card className="border-0 shadow-2xl rounded-[3rem] overflow-hidden bg-white">
              <div className="relative aspect-[4/3] overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={car.images[selectedImage] || "/placeholder-car.jpg"}
                  alt={`${car.brand} ${car.model}`}
                  className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                />
                <Badge className={`absolute top-6 right-6 px-6 py-2 rounded-full text-sm font-bold border-0 shadow-lg ${getStatusColor(car.status)}`}>
                  {car.status}
                </Badge>
              </div>
            </Card>
            
            {car.images.length > 1 && (
              <div className="grid grid-cols-4 gap-4">
                {car.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`relative aspect-square rounded-2xl overflow-hidden transition-all border-4 ${
                      selectedImage === index
                        ? "border-primary shadow-lg scale-105"
                        : "border-transparent hover:border-gray-200"
                    }`}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={image}
                      alt={`${car.brand} ${car.model} ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Car Details Section */}
          <div className="space-y-10">
            <div className="space-y-4">
              <div className="flex flex-wrap items-center gap-4 text-sm font-bold text-primary">
                <Badge variant="outline" className="px-4 py-1 border-primary/20 bg-primary/5 text-primary rounded-full">
                  {car.brand}
                </Badge>
                <span>•</span>
                <span className="text-muted-foreground">{car.year} موديل</span>
              </div>
              <h1 className="text-5xl md:text-6xl font-[1000] tracking-tighter leading-tight">
                {car.brand} {car.model}
              </h1>
              <p className="text-4xl font-black text-primary">
                {car.price.toLocaleString()} <span className="text-2xl">ج.م</span>
              </p>
            </div>

            <Card className="border-0 shadow-xl rounded-[2.5rem] bg-white overflow-hidden">
              <CardHeader className="p-8 pb-0">
                <CardTitle className="text-2xl font-black">المواصفات الأساسية</CardTitle>
              </CardHeader>
              <CardContent className="p-8 grid grid-cols-2 gap-8">
                <div className="flex items-center gap-4 group">
                  <div className="p-3 bg-gray-50 rounded-2xl group-hover:bg-primary/10 transition-colors">
                    <Calendar className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground font-bold">سنة الصنع</p>
                    <p className="text-lg font-black">{car.year}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 group">
                  <div className="p-3 bg-gray-50 rounded-2xl group-hover:bg-primary/10 transition-colors">
                    <Fuel className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground font-bold">نوع الوقود</p>
                    <p className="text-lg font-black">{car.fuelType}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 group">
                  <div className="p-3 bg-gray-50 rounded-2xl group-hover:bg-primary/10 transition-colors">
                    <Settings className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground font-bold">ناقل الحركة</p>
                    <p className="text-lg font-black">{car.transmission}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 group">
                  <div className="p-3 bg-gray-50 rounded-2xl group-hover:bg-primary/10 transition-colors">
                    <Gauge className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground font-bold">المسافة</p>
                    <p className="text-lg font-black">{car.mileage.toLocaleString()} كم</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-xl rounded-[2.5rem] bg-white overflow-hidden">
              <CardHeader className="p-8 pb-0">
                <CardTitle className="text-2xl font-black">الوصف</CardTitle>
              </CardHeader>
              <CardContent className="p-8">
                <div 
                  className="text-muted-foreground text-lg leading-relaxed font-medium rich-text-content"
                  dangerouslySetInnerHTML={{ __html: car.description }}
                />
              </CardContent>
            </Card>

            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Button size="lg" className="flex-1 h-16 rounded-[1.5rem] text-xl font-black bg-[#1A1A1A] hover:bg-black text-white shadow-xl">
                <Phone className="h-6 w-6 ml-3" />
                اتصل بالبائع
              </Button>
              <Button variant="outline" size="lg" className="flex-1 h-16 rounded-[1.5rem] text-xl font-black border-2 border-gray-100 hover:bg-gray-50 shadow-lg">
                <Mail className="h-6 w-6 ml-3" />
                إرسال استفسار
              </Button>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
