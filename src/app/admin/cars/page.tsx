"use client"

import { useState, useEffect, useCallback } from "react"
import { Navbar } from "@/components/navbar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { toast } from "sonner"
import { Car, Edit, Trash2, Plus, Search } from "lucide-react"
import Link from "next/link"

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

  const getStatusColor = (status: string) => {
    switch (status) {
      case "متاح":
        return "bg-emerald-100 text-emerald-700 border-emerald-200"
      case "مباع":
        return "bg-rose-100 text-rose-700 border-rose-200"
      case "محجوز":
        return "bg-amber-100 text-amber-700 border-amber-200"
      default:
        return "bg-gray-100 text-gray-700 border-gray-200"
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F9F6F1]">
        <Navbar />
        <main className="container mx-auto px-4 py-24 max-w-7xl space-y-8">
          <Skeleton className="h-16 w-64 rounded-2xl" />
          <div className="space-y-4">
            {[...Array(5)].map((_, index) => (
              <Skeleton key={index} className="h-32 w-full rounded-[2.5rem]" />
            ))}
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#F9F6F1]">
      <Navbar />

      <main className="container mx-auto px-4 py-24 max-w-7xl">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 mb-12">
          <div className="space-y-4">
            <h1 className="text-5xl font-[1000] tracking-tighter">إدارة السيارات</h1>
            <p className="text-muted-foreground text-xl font-medium">التحكم في مخزون السيارات المعروضة</p>
            <div className="h-1.5 w-24 bg-primary rounded-full" />
          </div>
          
          <Button asChild className="rounded-2xl h-14 px-8 text-lg font-black shadow-lg shadow-primary/20">
            <Link href="/admin/cars/new" className="flex items-center">
              <Plus className="h-5 w-5 ml-2" />
              إضافة سيارة جديدة
            </Link>
          </Button>
        </div>

        <div className="grid grid-cols-1 gap-8">
          {/* Search bar */}
          <div className="relative group">
            <Search className="absolute right-8 top-1/2 -translate-y-1/2 h-6 w-6 text-muted-foreground group-focus-within:text-primary transition-colors" />
            <Input
              placeholder="ابحث بالعلامة التجارية، الموديل..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="h-20 rounded-[2rem] border-0 shadow-xl pr-16 pl-8 text-xl font-bold bg-white focus-visible:ring-primary/20"
            />
          </div>

          <Card className="border-0 shadow-2xl rounded-[2.5rem] bg-white overflow-hidden">
            <CardHeader className="p-8 pb-0 flex flex-row items-center justify-between">
              <CardTitle className="text-2xl font-black">قائمة المخزون ({filteredCars.length})</CardTitle>
            </CardHeader>
            <CardContent className="p-8">
              <div className="overflow-x-auto -mx-8 px-8">
                <table className="w-full border-separate border-spacing-y-4">
                  <thead>
                    <tr className="text-muted-foreground font-black text-sm uppercase tracking-widest">
                      <th className="text-right pb-4 px-6">السيارة</th>
                      <th className="text-right pb-4 px-6">المواصفات</th>
                      <th className="text-right pb-4 px-6">السعر</th>
                      <th className="text-right pb-4 px-6">الحالة</th>
                      <th className="text-left pb-4 px-6">الإجراءات</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredCars.map((car) => (
                      <tr key={car._id} className="group">
                        <td className="py-4 px-6 bg-gray-50/50 rounded-r-[2rem] first:rounded-r-[2rem]">
                          <div className="flex items-center gap-6">
                            <div className="h-20 w-28 bg-white rounded-2xl overflow-hidden shadow-md border-2 border-white shrink-0">
                              <img
                                src={car.images[0] || "/placeholder-car.jpg"}
                                alt={`${car.brand} ${car.model}`}
                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                              />
                            </div>
                            <div className="space-y-1">
                              <div className="text-xl font-black">{car.brand} {car.model}</div>
                              <div className="text-muted-foreground font-bold">{car.year} • {car.color}</div>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-6 bg-gray-50/50">
                          <div className="space-y-1 font-bold text-muted-foreground">
                            <div>{car.transmission} • {car.fuelType}</div>
                            <div>{car.mileage.toLocaleString()} كم</div>
                          </div>
                        </td>
                        <td className="py-4 px-6 bg-gray-50/50">
                          <div className="text-2xl font-black text-primary">
                            {car.price.toLocaleString()} <span className="text-sm">ج.م</span>
                          </div>
                        </td>
                        <td className="py-4 px-6 bg-gray-50/50">
                          <Badge className={`${getStatusColor(car.status)} border-2 rounded-full px-4 py-1 font-black text-sm shadow-sm`}>
                            {car.status}
                          </Badge>
                        </td>
                        <td className="py-4 px-6 bg-gray-50/50 rounded-l-[2rem] last:rounded-l-[2rem]">
                          <div className="flex gap-3 justify-end">
                            <Button variant="outline" size="icon" asChild className="h-12 w-12 rounded-xl border-2 hover:bg-white hover:text-primary transition-all">
                              <Link href={`/admin/cars/${car._id}/edit`}>
                                <Edit className="h-5 w-5" />
                              </Link>
                            </Button>
                            
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button
                                  variant="outline"
                                  size="icon"
                                  className="h-12 w-12 rounded-xl border-2 text-rose-600 hover:bg-rose-50 hover:border-rose-200 transition-all"
                                >
                                  <Trash2 className="h-5 w-5" />
                                </Button>
                              </DialogTrigger>
                              <DialogContent className="rounded-[2.5rem] p-10 border-0 shadow-2xl">
                                <DialogHeader className="space-y-4">
                                  <DialogTitle className="text-2xl font-black">حذف السيارة؟</DialogTitle>
                                  <DialogDescription className="text-lg font-medium leading-relaxed">
                                    سيتم حذف {car.brand} {car.model} نهائياً من المتجر. لا يمكن التراجع عن هذا الإجراء.
                                  </DialogDescription>
                                </DialogHeader>
                                <DialogFooter className="mt-8 gap-4">
                                  <DialogClose asChild>
                                    <Button variant="outline" className="rounded-2xl h-14 px-8 text-lg font-black border-2">إلغاء</Button>
                                  </DialogClose>
                                  <Button 
                                    onClick={() => handleDelete(car._id)}
                                    className="rounded-2xl h-14 px-8 text-lg font-black bg-rose-600 hover:bg-rose-700"
                                  >
                                    تأكيد الحذف
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

                {filteredCars.length === 0 && (
                  <div className="text-center py-24 bg-gray-50/50 rounded-[2rem] mt-4">
                    <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
                      <Car className="h-12 w-12 text-muted-foreground opacity-20" />
                    </div>
                    <h3 className="text-2xl font-[1000] mb-2 tracking-tight">لا توجد نتائج</h3>
                    <p className="text-muted-foreground text-lg font-medium">
                      {searchTerm ? "لم نجد أي سيارة تطابق بحثك حالياً" : "لم يتم إضافة أي سيارات للمخزون بعد"}
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
