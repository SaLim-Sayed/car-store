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
    if (!confirm("هل أنت متأكد من حذف هذه السيارة؟")) return

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
          <div className="space-y-4">
            {[...Array(5)].map((_, index) => (
              <Card key={index}>
                <CardContent className="p-6">
                  <Skeleton className="h-20 w-full" />
                </CardContent>
              </Card>
            ))}
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      <Navbar />

      <main className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">إدارة السيارات</h1>
            <p className="text-muted-foreground">
              إضافة وتعديل وحذف السيارات في المتجر
            </p>
          </div>
          <Button asChild>
            <Link href="/admin/cars/new">
              <Plus className="h-4 w-4 ml-2" />
              إضافة سيارة جديدة
            </Link>
          </Button>
        </div>

        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="relative">
              <Search className="absolute right-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="ابحث بالعلامة التجارية أو الموديل..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pr-10"
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>قائمة السيارات ({filteredCars.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-right pb-3">الصورة</th>
                    <th className="text-right pb-3">العلامة التجارية</th>
                    <th className="text-right pb-3">الموديل</th>
                    <th className="text-right pb-3">السنة</th>
                    <th className="text-right pb-3">السعر</th>
                    <th className="text-right pb-3">الحالة</th>
                    <th className="text-right pb-3">الإجراءات</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredCars.map((car) => (
                    <tr key={car._id} className="border-b hover:bg-muted/50">
                      <td className="py-3">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={car.images[0] || "/placeholder-car.jpg"}
                          alt={`${car.brand} ${car.model}`}
                          className="w-16 h-12 object-cover rounded"
                        />
                      </td>
                      <td className="py-3 font-medium">{car.brand}</td>
                      <td className="py-3">{car.model}</td>
                      <td className="py-3">{car.year}</td>
                      <td className="py-3 font-semibold">
                        {car.price.toLocaleString()} ج.م
                      </td>
                      <td className="py-3">
                        <Badge className={getStatusColor(car.status)}>
                          {car.status}
                        </Badge>
                      </td>
                      <td className="py-3">
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm" asChild>
                            <Link href={`/admin/cars/${car._id}/edit`}>
                              <Edit className="h-4 w-4" />
                            </Link>
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDelete(car._id)}
                            disabled={deleteLoading === car._id}
                            className="text-red-600 hover:text-red-700 hover:border-red-600"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {filteredCars.length === 0 && (
                <div className="text-center py-8">
                  <Car className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="text-lg font-semibold mb-2">لا توجد سيارات</h3>
                  <p className="text-muted-foreground">
                    {searchTerm
                      ? "لم يتم العثور على سيارات تطابق معايير البحث"
                      : "لم يتم إضافة أي سيارات بعد"}
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
