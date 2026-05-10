"use client"

import { useState, useEffect } from "react"
import { Navbar } from "@/components/navbar"
import { CarSearch } from "@/components/car-search"
import { CarCard } from "@/components/car-card"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { useCarStore } from "@/lib/store/carStore"
import { Car as CarIcon } from "lucide-react"

export default function CarsPage() {
  const { cars, loading, error, filters } = useCarStore()
  const [page, setPage] = useState(1)

  // Mock data for demonstration
  const mockCars = [
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
    },
    {
      _id: "4",
      brand: "مرسيدس",
      model: "C-Class",
      year: 2023,
      price: 180000,
      fuelType: "بنزين",
      transmission: "أوتوماتيك",
      mileage: 5000,
      color: "فضي",
      description: "مرسيدس C-Class 2023 بفخامة وأداء استثنائي.",
      images: ["https://images.unsplash.com/photo-1617654112369-82a9e57c8411?w=400&h=300&fit=crop"],
      status: "متاح",
      createdAt: new Date().toISOString()
    },
    {
      _id: "5",
      brand: "بي إم دبليو",
      model: "X5",
      year: 2022,
      price: 220000,
      fuelType: "ديزل",
      transmission: "أوتوماتيك",
      mileage: 12000,
      color: "أسود",
      description: "بي إم دبليو X5 2022 SUV فاخرة بأداء قوي.",
      images: ["https://images.unsplash.com/photo-1553413077-1d3782b2b4f0?w=400&h=300&fit=crop"],
      status: "متاح",
      createdAt: new Date().toISOString()
    },
    {
      _id: "6",
      brand: "لكزس",
      model: "RX 350",
      year: 2023,
      price: 195000,
      fuelType: "بنزين",
      transmission: "أوتوماتيك",
      mileage: 7000,
      color: "أبيض",
      description: "لكزس RX 350 2023 بجودة عالية وتقنيات متقدمة.",
      images: ["https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=400&h=300&fit=crop"],
      status: "متاح",
      createdAt: new Date().toISOString()
    }
  ]

  const displayCars = mockCars // In real app, this would be filtered based on filters

  return (
    <div className="min-h-screen">
      <Navbar />
      
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">جميع السيارات</h1>
          <p className="text-muted-foreground">
            اكتشف مجموعتنا الواسعة من السيارات الجديدة والمستعملة
          </p>
        </div>

        <CarSearch />

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, index) => (
              <Card key={index} className="overflow-hidden">
                <Skeleton className="h-48 w-full" />
                <CardContent className="p-4">
                  <Skeleton className="h-4 w-3/4 mb-2" />
                  <Skeleton className="h-4 w-1/2 mb-4" />
                  <Skeleton className="h-10 w-full" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : error ? (
          <Card className="p-8 text-center">
            <CarIcon className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-lg font-semibold mb-2">حدث خطأ</h3>
            <p className="text-muted-foreground mb-4">{error}</p>
            <Button onClick={() => window.location.reload()}>
              إعادة المحاولة
            </Button>
          </Card>
        ) : displayCars.length === 0 ? (
          <Card className="p-8 text-center">
            <CarIcon className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-lg font-semibold mb-2">لا توجد سيارات</h3>
            <p className="text-muted-foreground">
              لم يتم العثور على سيارات تطابق معايير البحث
            </p>
          </Card>
        ) : (
          <>
            <div className="mb-4 text-sm text-muted-foreground">
              تم العثور على {displayCars.length} سيارة
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {displayCars.map((car) => (
                <CarCard key={car._id} car={car} />
              ))}
            </div>

            <div className="mt-8 flex justify-center">
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={() => setPage(Math.max(1, page - 1))}
                  disabled={page === 1}
                >
                  السابق
                </Button>
                <Button variant="outline" disabled>
                  {page}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setPage(page + 1)}
                >
                  التالي
                </Button>
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  )
}
