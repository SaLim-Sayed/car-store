"use client"

import { useState } from "react"
import { Navbar } from "@/components/navbar"
import { EquipmentCard } from "@/components/equipment-card"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Skeleton } from "@/components/ui/skeleton"
import { Tractor, Search } from "lucide-react"
import { useEquipment, type Equipment } from "@/hooks/useEquipment"

const CATEGORIES = ["الكل", "جرار", "حفار", "شاحنة", "معدة زراعية", "معدة بناء", "أخرى"] as const

export default function EquipmentPage() {
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState("")
  const [searchInput, setSearchInput] = useState("")
  const [category, setCategory] = useState<string>("الكل")

  const { data, isLoading, error, refetch } = useEquipment(page, 9, {
    search: search || undefined,
    category: category === "الكل" ? undefined : category,
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

      <main className="container mx-auto px-4 py-24">
        <div className="mb-12 space-y-4">
          <h1 className="text-5xl md:text-6xl font-[1000] tracking-tighter">آلات زراعية ومعدات ثقيلة</h1>
          <p className="text-muted-foreground text-xl font-medium">
            جرارات، حفارات، شاحنات، ومعدات بناء وزراعة في محافظة المنيا
          </p>
          <div className="h-1.5 w-32 bg-primary rounded-full" />
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

        <div className="flex flex-wrap gap-3 mb-12">
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

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {Array.from({ length: 6 }).map((_, i) => (
              <Card key={i} className="rounded-[2.5rem] overflow-hidden border-0 shadow-lg">
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
          <Card className="p-16 text-center border-0 shadow-xl rounded-[3rem] bg-white">
            <Tractor className="h-20 w-20 mx-auto mb-6 text-muted-foreground opacity-20" />
            <h3 className="text-3xl font-[1000] mb-4">حدث خطأ في التحميل</h3>
            <Button onClick={() => refetch()} className="rounded-2xl px-10 h-14 text-lg font-bold">
              إعادة المحاولة
            </Button>
          </Card>
        ) : items.length === 0 ? (
          <Card className="p-16 text-center border-0 shadow-xl rounded-[3rem] bg-white">
            <Tractor className="h-20 w-20 mx-auto mb-6 text-muted-foreground opacity-20" />
            <h3 className="text-3xl font-[1000] mb-4">لا توجد معدات معروضة</h3>
            <p className="text-muted-foreground text-lg">جرّب تغيير البحث أو التصنيف</p>
          </Card>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {items.map((item: Equipment) => (
                <EquipmentCard key={item._id} equipment={item} />
              ))}
            </div>

            {pagination && pagination.pages > 1 && (
              <div className="flex justify-center gap-4 mt-12">
                <Button
                  variant="outline"
                  disabled={page <= 1}
                  onClick={() => setPage((p) => p - 1)}
                  className="rounded-2xl font-black"
                >
                  السابق
                </Button>
                <span className="flex items-center font-black text-lg">
                  {page} / {pagination.pages}
                </span>
                <Button
                  variant="outline"
                  disabled={page >= pagination.pages}
                  onClick={() => setPage((p) => p + 1)}
                  className="rounded-2xl font-black"
                >
                  التالي
                </Button>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  )
}

