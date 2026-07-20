"use client"

import { Suspense, useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { Navbar } from "@/components/navbar"
import { CarSearch } from "@/components/car-search"
import { CarCard } from "@/components/car-card"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Breadcrumbs } from "@/components/breadcrumbs"
import { Skeleton } from "@/components/ui/skeleton"
import { Car as CarIcon } from "lucide-react"
import { useCarStore } from "@/lib/store/carStore"
import { useInfiniteCars, CarsFilters, Car } from "@/hooks/useCars"
import { useInView } from "react-intersection-observer"
import { useShowroomById } from "@/hooks/useContent"
import { LoadMorePagination } from "@/components/pagination"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

function CarsPageContent() {
 const searchParams = useSearchParams()
 const { filters, setFilters } = useCarStore()
 const { ref, inView } = useInView()

 useEffect(() => {
 const q = searchParams.get("search")
 if (q) setFilters({ search: q })
 }, [searchParams, setFilters])
 
 // Convert store filters to API filters
 const apiFilters: CarsFilters = {
 search: filters.search,
 fuelType: filters.fuelType,
 transmission: filters.transmission,
 minPrice: filters.minPrice ? Number(filters.minPrice) : undefined,
 maxPrice: filters.maxPrice ? Number(filters.maxPrice) : undefined,
 showroom: searchParams.get("showroom") || undefined,
 sortBy: filters.sortBy || undefined,
 }

  const { 
    data: carsData, 
    isLoading, 
    error, 
    refetch,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage
  } = useInfiniteCars(9, apiFilters)

  useEffect(() => {
    if (inView && hasNextPage) {
      fetchNextPage()
    }
  }, [inView, hasNextPage, fetchNextPage])

  const cars = carsData?.pages.flatMap(page => page.data) || []
  const pagination = carsData?.pages[0]?.pagination

 const showroomId = searchParams.get("showroom")
 const { data: showroomData } = useShowroomById(showroomId || "")
 const showroomInfo = showroomData?.data

 return (
 <div className="min-h-screen bg-background">
 
  <main className="container mx-auto px-4 py-8 md:py-24">
  <Breadcrumbs items={[{ label: showroomInfo ? `سيارات ${showroomInfo.name}` : "سيارات مستعملة للبيع في المنيا" }]} />
  <div className="mt-4 mb-8 md:mb-16 space-y-3 md:space-y-4">
 <h1 className="text-3xl md:text-5xl font-[1000] tracking-tighter text-pretty">
 {showroomInfo ? `سيارات ${showroomInfo.name}` : "سيارات مستعملة للبيع في المنيا"}
 </h1>
 <p className="text-muted-foreground text-lg md:text-xl font-medium max-w-3xl">
 {showroomInfo 
 ? `تصفح السيارات المتاحة لدى ${showroomInfo.name}`
 : "إعلانات سيارات مستعملة وجديدة في المنيا وسمالوط وبني مزار ومغاغة — تقسيط وكاش، قارن الأسعار وتواصل مع البائع مباشرة بدون وسيط."}
 </p>
  <div className="h-1.5 w-24 md:w-32 bg-primary rounded-full mt-4" />
  </div>

  <div className="mb-8 md:mb-16">
  <CarSearch />
  </div>

 {isLoading ? (
 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
 {Array.from({ length: 9 }).map((_, i) => (
 <Card key={i} className="rounded-[2.5rem] overflow-hidden border-0 shadow-none">
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
 <Card className="p-16 text-center border-0 shadow-none rounded-[3rem] bg-white">
 <CarIcon className="h-20 w-20 mx-auto mb-6 text-muted-foreground opacity-20" />
 <h3 className="text-3xl font-[1000] mb-4">حدث خطأ في التحميل</h3>
 <p className="text-muted-foreground text-lg mb-8">نعتذر، لم نتمكن من جلب بيانات السيارات في الوقت الحالي.</p>
 <Button onClick={() => refetch()} className="rounded-2xl px-10 h-14 text-lg font-bold">
 إعادة المحاولة
 </Button>
 </Card>
 ) : cars.length === 0 ? (
 <Card className="p-16 text-center border-0 shadow-none rounded-[3rem] bg-white">
 <CarIcon className="h-20 w-20 mx-auto mb-6 text-muted-foreground opacity-20" />
 <h3 className="text-3xl font-[1000] mb-4">لا توجد سيارات مطابقة</h3>
 <p className="text-muted-foreground text-lg">
 جرب تغيير معايير البحث أو تصفح جميع المعروض
 </p>
 </Card>
 ) : (
 <div className="space-y-16">
 <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
 <div className="text-lg font-bold text-muted-foreground">
 تم العثور على <span className="text-foreground">{pagination?.total ?? cars.length}</span> سيارة
 </div>
 <div className="flex items-center gap-2">
 <span className="text-sm font-bold text-muted-foreground whitespace-nowrap">ترتيب حسب:</span>
 <Select
 dir="rtl"
 value={filters.sortBy || 'newest'}
 onValueChange={(val) => setFilters({ sortBy: val })}
 >
 <SelectTrigger className="w-[160px] h-10 rounded-xl border-2 border-gray-100 bg-white font-bold text-sm">
 <SelectValue placeholder="الترتيب" />
 </SelectTrigger>
 <SelectContent className="rounded-xl border border-gray-100 shadow-xl bg-white">
 <SelectItem value="newest">الأحدث أولاً</SelectItem>
 <SelectItem value="oldest">الأقدم أولاً</SelectItem>
 </SelectContent>
 </Select>
 </div>
 </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {cars.map((car: Car) => (
            <CarCard key={car._id} car={car} />
          ))}
        </div>

        <LoadMorePagination
          loadedCount={cars.length}
          totalCount={pagination?.total}
          itemLabel="سيارة"
          hasMore={!!hasNextPage}
          isLoading={isFetchingNextPage}
          onLoadMore={() => void fetchNextPage()}
          sentinelRef={ref}
        />
 </div>
 )}
 </main>
 </div>
 )
}

function CarsPageFallback() {
 return (
 <div className="min-h-screen bg-background">
 <main className="container mx-auto px-4 py-24">
 <Skeleton className="h-14 w-64 mb-8" />
 <Skeleton className="h-32 w-full max-w-xl mb-16" />
 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
 {Array.from({ length: 6 }).map((_, i) => (
 <Skeleton key={i} className="h-96 w-full rounded-[2.5rem]" />
 ))}
 </div>
 </main>
 </div>
 )
}

export default function CarsPage() {
 return (
 <Suspense fallback={<CarsPageFallback />}>
 <CarsPageContent />
 </Suspense>
 )
}
