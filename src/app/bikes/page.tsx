"use client"

import { useState } from "react"
import { Navbar } from "@/components/navbar"
import { EquipmentCard } from "@/components/equipment-card"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Skeleton } from "@/components/ui/skeleton"
import { Bike, Search } from "lucide-react"
import { Breadcrumbs } from "@/components/breadcrumbs"
import { useEquipment, type Equipment } from "@/hooks/useEquipment"
import { Pagination } from "@/components/pagination"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

const CATEGORIES = ["الكل", "موتوسيكل", "توك توك", "تروسيكل"] as const

export default function BikesPage() {
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState("")
  const [searchInput, setSearchInput] = useState("")
  const [category, setCategory] = useState<string>("الكل")
  const [sortBy, setSortBy] = useState<string>("newest")

  const { data, isLoading, error, refetch } = useEquipment(page, 9, {
    search: search || undefined,
    category: category === "الكل" ? undefined : category,
    sortBy: sortBy,
    type: "bikes",
  })

  const items = data?.data || []
  const pagination = data?.pagination

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    setSearch(searchInput.trim())
    setPage(1)
  }



  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="container mx-auto px-4 py-8 md:py-24">
        <Breadcrumbs items={[{ label: "الدراجات النارية والتوك توك" }]} />
        <div className="mt-4 mb-8 md:mb-16 space-y-3 md:space-y-4">
          <h1 className="text-5xl md:text-6xl font-[1000] tracking-tighter">سوق الدراجات النارية والتوك توك</h1>
          <p className="text-muted-foreground text-xl font-medium">
            موتوسيكلات، توك توك، وتروسيكلات للبيع في محافظة المنيا
          </p>
          <div className="h-1.5 w-24 md:w-32 bg-primary rounded-full mt-4" />
        </div>

        <form onSubmit={handleSearch} className="mb-8 flex gap-3 max-w-2xl">
          <div className="relative flex-1">
            <Search className="absolute right-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="ابحث بالاسم، الماركة، أو المنطقة..."
              className="h-14 pr-12 rounded-2xl border-2 font-bold"
            />
          </div>
          <Button type="submit" className="h-14 px-8 rounded-2xl font-black">
            بحث
          </Button>
        </form>

        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-12">
          <div className="flex flex-wrap gap-3">
            {CATEGORIES.map((cat) => (
              <Button
                key={cat}
                type="button"
                variant={category === cat ? "default" : "outline"}
                className="rounded-full font-black"
                onClick={() => {
                  setCategory(cat)
                  setPage(1)
                }}
              >
                {cat}
              </Button>
            ))}
          </div>
          
          <div className="flex items-center gap-2 shrink-0 w-full sm:w-auto self-end md:self-auto">
            <span className="text-sm font-bold text-muted-foreground whitespace-nowrap">ترتيب حسب:</span>
            <Select
              dir="rtl"
              value={sortBy}
              onValueChange={(val) => {
                setSortBy(val)
                setPage(1)
              }}
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

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {Array.from({ length: 6 }).map((_, i) => (
              <Card key={i} className="rounded-[2.5rem] overflow-hidden border-0 shadow-none">
                <CardContent className="p-0">
                  <Skeleton className="h-64 w-full" />
                  <div className="p-8 space-y-4">
                    <Skeleton className="h-8 w-3/4" />
                    <Skeleton className="h-12 w-full" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : error ? (
          <Card className="p-16 text-center border-0 shadow-none rounded-[3rem] bg-white">
            <Bike className="h-20 w-20 mx-auto mb-6 text-muted-foreground opacity-20" />
            <h3 className="text-3xl font-[1000] mb-4">حدث خطأ في التحميل</h3>
            <Button onClick={() => refetch()} className="rounded-2xl px-10 h-14 text-lg font-bold">
              إعادة المحاولة
            </Button>
          </Card>
        ) : items.length === 0 ? (
          <Card className="p-16 text-center border-0 shadow-none rounded-[3rem] bg-white">
            <Bike className="h-20 w-20 mx-auto mb-6 text-muted-foreground opacity-20" />
            <h3 className="text-3xl font-[1000] mb-4">لا توجد دراجات معروضة</h3>
            <p className="text-muted-foreground text-lg">جرّب تغيير البحث أو التصنيف</p>
          </Card>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {items.map((item: Equipment) => {
                // Intercept the router push for bikes details by modifying the equipment prop or custom card.
                // Since EquipmentCard navigates to `/equipment/${equipment._id}`, we should either pass custom link or intercept it.
                // Let's modify EquipmentCard to navigate to either `/bikes/${_id}` or `/equipment/${_id}` based on its category!
                // Yes! That's incredibly elegant: inside EquipmentCard, if the category is 'موتوسيكل' or 'توك توك' or 'تروسيكل', it navigates to `/bikes/${_id}`, otherwise to `/equipment/${_id}`!
                // Let's check: that's perfect and requires no change in the bikes page usage of EquipmentCard!
                return <EquipmentCard key={item._id} equipment={item} />
              })}
            </div>

            <Pagination
              page={page}
              totalPages={pagination?.pages ?? 1}
              onPageChange={setPage}
              totalItems={pagination?.total}
              pageSize={pagination?.limit}
              itemLabel="دراجة"
              scrollToTop
            />
          </>
        )}
      </main>
    </div>
  )
}
