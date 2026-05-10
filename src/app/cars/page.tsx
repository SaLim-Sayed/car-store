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

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 9 }).map((_, i) => (
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
            <CarIcon className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-lg font-semibold mb-2">حدث خطأ</h3>
            <p className="text-muted-foreground mb-4">فشل في تحميل السيارات</p>
            <Button onClick={() => refetch()}>إعادة المحاولة</Button>
          </Card>
        ) : cars.length === 0 ? (
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
              تم العثور على {pagination?.total ?? cars.length} سيارة
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {cars.map((car: Car) => (
                <CarCard key={car._id} car={car} />
              ))}
            </div>

            {pagination && pagination.pages > 1 && (
              <div className="mt-8 flex justify-center">
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    onClick={() => handlePageChange(Math.max(1, page - 1))}
                    disabled={page === 1}
                  >
                    السابق
                  </Button>
                  {Array.from({ length: pagination.pages }, (_, i) => i + 1).map((p) => (
                    <Button
                      key={p}
                      variant={p === page ? "default" : "outline"}
                      onClick={() => handlePageChange(p)}
                    >
                      {p}
                    </Button>
                  ))}
                  <Button
                    variant="outline"
                    onClick={() => handlePageChange(Math.min(pagination.pages, page + 1))}
                    disabled={page === pagination.pages}
                  >
                    التالي
                  </Button>
                </div>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  )
}
