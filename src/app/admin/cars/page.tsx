"use client"

import { useState, useEffect, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { toast } from "sonner"
import { Car, Edit, Trash2, Plus, Search, Settings } from "lucide-react"
import Link from "next/link"
import { cn } from "@/lib/utils"

interface CarDoc {
  _id: string
  brand: string
  model: string
  year: number
  price?: number
  fuelType: string
  transmission: string
  mileage: number
  color: string
  description: string
  images: string[]
  status: string
  createdAt: string
}

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog"

export default function AdminCarsPage() {
  const [cars, setCars] = useState<CarDoc[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [deleteLoading, setDeleteLoading] = useState<string | null>(null)

  const fetchCars = useCallback(async () => {
    setLoading(true)
    try {
      const res = await fetch("/api/cars?limit=100")
      const data = await res.json()
      if (data.success) {
        setCars(data.data)
      } else {
        toast.error("فشل في جلب السيارات")
      }
    } catch {
      toast.error("حدث خطأ في الاتصال")
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchCars()
  }, [fetchCars])

  const filteredCars = cars.filter(
    (car) =>
      car.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
      car.model.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10
  const totalPages = Math.ceil(filteredCars.length / itemsPerPage)
  const paginatedCars = filteredCars.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)

  useEffect(() => {
    setCurrentPage(1)
  }, [searchTerm])

  const handleDelete = async (carId: string) => {
    setDeleteLoading(carId)
    try {
      const res = await fetch(`/api/cars/${carId}`, { method: "DELETE" })
      const data = await res.json()

      if (data.success) {
        setCars((prev) => prev.filter((car) => car._id !== carId))
        toast.success("تم حذف السيارة بنجاح")
      } else {
        toast.error(data.error || "فشل في حذف السيارة")
      }
    } catch {
      toast.error("حدث خطأ في الاتصال")
    } finally {
      setDeleteLoading(null)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F8FAFC]">
        <main className="container mx-auto px-4 py-8 max-w-7xl space-y-8">
          <Skeleton className="h-12 w-64 rounded-xl" />
          <div className="space-y-4">
            {[...Array(5)].map((_, index) => (
              <Skeleton key={index} className="h-24 w-full rounded-lg" />
            ))}
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <main className="container mx-auto px-4 py-8 max-w-7xl">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-8 border-b border-slate-200">
          <div className="space-y-1.5">
            <h1 className="text-3xl md:text-4xl font-bold text-slate-900 tracking-tight">إدارة السيارات</h1>
            <p className="text-sm md:text-base text-slate-500 font-bold max-w-2xl">
              إدارة مخزون السيارات المعروضة في المنصة، يمكنك إضافة سيارات جديدة، تعديل المواصفات أو الحذف.
            </p>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <Button asChild className="h-11 bg-slate-950 hover:bg-slate-800 text-white font-black rounded-xl shadow-lg shadow-slate-900/20 transition-all hover:scale-105 active:scale-95 px-6">
              <Link href="/admin/cars/new">
                <Plus className="h-5 w-5 ml-2" />
                إضافة سيارة
              </Link>
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 mt-8">
          {/* Search bar */}
          <div className="relative group max-w-xl">
            <Search className="absolute right-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-500 group-focus-within:text-[#E28328] transition-colors" />
            <Input
              placeholder="ابحث بالعلامة التجارية أو الموديل..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="h-14 rounded-lg border-slate-200 shadow-sm pr-12 pl-6 text-sm font-bold bg-white focus-visible:ring-1 focus-visible:ring-[#E28328] focus-visible:border-[#E28328]"
            />
          </div>

          <Card className="border-0 shadow-sm rounded-xl bg-white overflow-hidden ring-1 ring-slate-100">
            <CardHeader className="p-6 border-b border-slate-100/60 bg-white flex flex-row items-center justify-between">
              <CardTitle className="flex items-center gap-3 text-lg font-black text-slate-800">
                <div className="p-2 bg-primary/10 rounded-lg text-primary">
                  <Car className="h-5 w-5" />
                </div>
                قائمة السيارات ({filteredCars.length})
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0 overflow-x-auto">
              {filteredCars.length > 0 ? (
                <table className="w-full text-right border-collapse min-w-[900px]">
                  <thead>
                    <tr className="border-y border-slate-100/80 text-slate-500 text-[11px] font-semibold text-slate-600 uppercase tracking-wider font-bold bg-slate-50/50">
                      <th className="py-2.5 px-4 pr-8">السيارة</th>
                      <th className="py-2.5 px-4">السعر</th>
                      <th className="py-2.5 px-4">المواصفات</th>
                      <th className="py-2.5 px-4">الحالة</th>
                      <th className="py-2.5 px-4 pl-8 text-center">الإجراءات</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100/80 bg-white">
                    {paginatedCars.map((car) => (
                      <tr key={car._id} className="hover:bg-slate-50/60 transition-colors group">
                        <td className="py-2.5 px-4 pr-8">
                          <div className="flex items-center gap-4">
                            <div className="relative h-14 w-20 rounded-xl overflow-hidden bg-slate-100 shrink-0 shadow-sm border border-slate-200/50">
                              <img
                                src={car.images[0] || "/placeholder-car.jpg"}
                                alt={`${car.brand} ${car.model}`}
                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                              />
                            </div>
                            <div>
                              <p className="font-bold text-slate-900 text-sm">
                                {car.brand} {car.model}
                              </p>
                              <p className="text-xs text-slate-500 font-bold mt-1">
                                {car.year} • {car.color}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="py-2.5 px-4 font-bold text-slate-900 text-sm">
                          {car.price ? (
                            <span className="text-[#E28328]">{car.price.toLocaleString()} ج.م</span>
                          ) : (
                            <span className="text-slate-500 text-xs">حسب الطلب</span>
                          )}
                        </td>
                        <td className="py-2.5 px-4 text-slate-500 text-xs font-bold">
                          <div className="flex flex-col gap-1">
                            <span>{car.transmission === "manual" ? "يدوي" : "أوتوماتيك"} • {car.fuelType === "gasoline" ? "بنزين" : car.fuelType === "diesel" ? "ديزل" : car.fuelType}</span>
                            <span className="text-slate-500">{car.mileage.toLocaleString()} كم</span>
                          </div>
                        </td>
                        <td className="py-2.5 px-4">
                          <span
                            className={cn(
                              "inline-flex items-center justify-center px-3 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wide",
                              car.status === "available" || car.status === "متاح" ? "bg-emerald-50 text-primary border border-emerald-100" : "",
                              car.status === "sold" || car.status === "مباع" ? "bg-rose-50 text-rose-600 border border-rose-100" : "",
                              car.status === "reserved" || car.status === "محجوز" ? "bg-amber-50 text-primary border border-primary/20" : "",
                            )}
                          >
                            {car.status}
                          </span>
                        </td>
                        <td className="py-2.5 px-4 pl-8 text-center">
                          <div className="flex items-center justify-center gap-2 opacity-100">
                            <Button asChild size="sm" variant="ghost" className="h-9 w-9 p-0 rounded-lg text-slate-500 hover:text-primary hover:bg-slate-100">
                              <Link href={`/admin/cars/${car._id}/edit`}>
                                <Edit className="h-4.5 w-4.5" />
                              </Link>
                            </Button>
                            
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-9 w-9 p-0 rounded-lg text-slate-500 hover:text-rose-600 hover:bg-slate-100 transition-colors"
                                >
                                  <Trash2 className="h-4.5 w-4.5" />
                                </Button>
                              </DialogTrigger>
                              <DialogContent className="rounded-[2rem] p-8 border-0 shadow-2xl">
                                <DialogHeader className="space-y-3">
                                  <DialogTitle className="text-xl font-bold text-slate-900">حذف السيارة؟</DialogTitle>
                                  <DialogDescription className="text-sm font-bold text-slate-500 leading-relaxed">
                                    سيتم حذف مركبة {car.brand} {car.model} نهائياً من قاعدة البيانات. هذا الإجراء لا يمكن التراجع عنه.
                                  </DialogDescription>
                                </DialogHeader>
                                <DialogFooter className="mt-6 gap-3">
                                  <DialogClose asChild>
                                    <Button variant="outline" className="rounded-xl h-11 px-6 text-sm font-black border-slate-200">إلغاء</Button>
                                  </DialogClose>
                                  <Button 
                                    onClick={() => handleDelete(car._id)}
                                    disabled={deleteLoading === car._id}
                                    className="rounded-xl h-11 px-6 text-sm font-black bg-rose-600 hover:bg-rose-700 text-white"
                                  >
                                    {deleteLoading === car._id ? "جاري الحذف..." : "تأكيد الحذف"}
                                  </Button>
                                </DialogFooter>
                              </DialogContent>
                            </Dialog>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <div className="text-center py-16 text-slate-500 text-sm font-bold flex flex-col items-center gap-4">
                  <div className="w-16 h-16 bg-slate-50 rounded-lg flex items-center justify-center">
                    <Car className="h-8 w-8 text-slate-300" />
                  </div>
                  <h3 className="text-lg font-[1000] text-slate-700">لا توجد نتائج</h3>
                  <p className="text-slate-500 font-medium">
                    {searchTerm ? "لم نجد أي سيارة تطابق بحثك حالياً" : "لم يتم إضافة أي سيارات للمخزون بعد"}
                  </p>
                </div>
              )}
            </CardContent>
            
            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between border-t border-slate-100 p-4 bg-white">
                <span className="text-sm text-slate-500 font-medium">
                  عرض {(currentPage - 1) * itemsPerPage + 1} إلى {Math.min(currentPage * itemsPerPage, filteredCars.length)} من أصل {filteredCars.length} سيارة
                </span>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className="text-slate-600"
                  >
                    السابق
                  </Button>
                  <div className="flex items-center gap-1">
                    {Array.from({ length: totalPages }).map((_, i) => (
                      <Button
                        key={i}
                        variant={currentPage === i + 1 ? "default" : "ghost"}
                        size="sm"
                        onClick={() => setCurrentPage(i + 1)}
                        className={cn("w-8 h-8 p-0", currentPage === i + 1 ? "bg-primary text-white" : "text-slate-600")}
                      >
                        {i + 1}
                      </Button>
                    ))}
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
                    className="text-slate-600"
                  >
                    التالي
                  </Button>
                </div>
              </div>
            )}
          </Card>
        </div>
      </main>
    </div>
  )
}
