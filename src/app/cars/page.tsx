"use client"

import { useState } from "react"
import { Navbar } from "@/components/navbar"
import { CarSearch } from "@/components/car-search"
import { CarCard } from "@/components/car-card"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Car as CarIcon } from "lucide-react"
import { useCarStore } from "@/lib/store/carStore"
import { useCars, CarsFilters, Car } from "@/hooks/useCars"

export default function CarsPage() {
  const { filters } = useCarStore()
  const [page, setPage] = useState(1)
  
  // Convert store filters to API filters
  const apiFilters: CarsFilters = {
    search: filters.search,
    fuelType: filters.fuelType,
    transmission: filters.transmission,
    minPrice: filters.minPrice ? Number(filters.minPrice) : undefined,
    maxPrice: filters.maxPrice ? Number(filters.maxPrice) : undefined,
  }

  const { data: carsData, isLoading, error, refetch } = useCars(page, 9, apiFilters)
  const cars = carsData?.data || []
  const pagination = carsData?.pagination

  const handlePageChange = (newPage: number) => {
    setPage(newPage)
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  return (
    <div className="min-h-screen bg-background">
 
      <main className="container mx-auto px-4 py-24">
        <div className="mb-16 space-y-4">
          <h1 className="text-5xl md:text-6xl font-[1000] tracking-tighter">جميع السيارات</h1>
          <p className="text-muted-foreground text-xl font-medium">
            اكتشف مجموعتنا الواسعة من السيارات الجديدة والمستعملة في المنيا
          </p>
          <div className="h-1.5 w-32 bg-primary rounded-full" />
        </div>

        <div className="mb-16">
          <CarSearch />
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {Array.from({ length: 9 }).map((_, i) => (
              <Card key={i} className="rounded-[2.5rem] overflow-hidden border-0 shadow-lg">
                <CardContent className="p-0">
                  <Skeleton className="h-64 w-full" />
                  <div className="p-8 space-y-6">
                    <Skeleton className="h-8 w-3/4" />
                    <Skeleton className="h-6 w-1/4" />
                    <div className="flex gap-4">
                      <Skeleton className="h-4 w-16" />
                      <Skeleton className="h-4 w-16" />
                    </div>
                    <Skeleton className="h-14 w-full rounded-2xl" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : error ? (
          <Card className="p-16 text-center border-0 shadow-xl rounded-[3rem] bg-white">
            <CarIcon className="h-20 w-20 mx-auto mb-6 text-muted-foreground opacity-20" />
            <h3 className="text-3xl font-[1000] mb-4">حدث خطأ في التحميل</h3>
            <p className="text-muted-foreground text-lg mb-8">نعتذر، لم نتمكن من جلب بيانات السيارات في الوقت الحالي.</p>
            <Button onClick={() => refetch()} className="rounded-2xl px-10 h-14 text-lg font-bold">
              إعادة المحاولة
            </Button>
          </Card>
        ) : cars.length === 0 ? (
          <Card className="p-16 text-center border-0 shadow-xl rounded-[3rem] bg-white">
            <CarIcon className="h-20 w-20 mx-auto mb-6 text-muted-foreground opacity-20" />
            <h3 className="text-3xl font-[1000] mb-4">لا توجد سيارات مطابقة</h3>
            <p className="text-muted-foreground text-lg">
              جرب تغيير معايير البحث أو تصفح جميع المعروض
            </p>
          </Card>
        ) : (
          <div className="space-y-16">
            <div className="flex justify-between items-center">
              <div className="text-lg font-bold text-muted-foreground">
                تم العثور على <span className="text-foreground">{pagination?.total ?? cars.length}</span> سيارة
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {cars.map((car: Car) => (
                <CarCard key={car._id} car={car} />
              ))}
            </div>

            {pagination && pagination.pages > 1 && (
              <div className="flex justify-center pt-8">
                <div className="flex items-center gap-3">
                  <Button
                    variant="outline"
                    className="rounded-xl h-12 px-6 font-bold"
                    onClick={() => handlePageChange(Math.max(1, page - 1))}
                    disabled={page === 1}
                  >
                    السابق
                  </Button>
                  
                  <div className="flex gap-2">
                    {Array.from({ length: pagination.pages }, (_, i) => i + 1).map((p) => (
                      <Button
                        key={p}
                        variant={p === page ? "default" : "outline"}
                        className={`w-12 h-12 rounded-xl font-bold transition-all ${
                          p === page ? "shadow-lg scale-110" : ""
                        }`}
                        onClick={() => handlePageChange(p)}
                      >
                        {p}
                      </Button>
                    ))}
                  </div>

                  <Button
                    variant="outline"
                    className="rounded-xl h-12 px-6 font-bold"
                    onClick={() => handlePageChange(Math.min(pagination.pages, page + 1))}
                    disabled={page === pagination.pages}
                  >
                    التالي
                  </Button>
                </div>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  )
}
