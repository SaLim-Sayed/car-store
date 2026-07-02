"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Tractor, Edit, Trash2, Plus, Search, Settings, ArrowUpRight } from "lucide-react"
import Link from "next/link"
import { cn } from "@/lib/utils"
import { Pagination } from "@/components/pagination"
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
import { useEquipment, useDeleteEquipment, type Equipment } from "@/hooks/useEquipment"

export default function AdminEquipmentPage() {
  const { data, isLoading } = useEquipment(1, 100, { type: 'equipment' })
  const deleteMutation = useDeleteEquipment()
  const equipment = data?.data || []
  
  const [searchTerm, setSearchTerm] = useState("")

  const filteredEquipment = equipment.filter(
    (eq: Equipment) =>
      (eq.title && eq.title.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (eq.brand && eq.brand.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (eq.model && eq.model.toLowerCase().includes(searchTerm.toLowerCase()))
  )

  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10
  const totalPages = Math.ceil(filteredEquipment.length / itemsPerPage)
  const paginatedEquipment = filteredEquipment.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)

  useEffect(() => {
    setCurrentPage(1)
  }, [searchTerm])

  if (isLoading) {
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
            <h1 className="text-3xl md:text-4xl font-bold text-slate-900 tracking-tight">إدارة المعدات الثقيلة</h1>
            <p className="text-sm md:text-base text-slate-500 font-bold max-w-2xl">
              إدارة مخزون الجرارات، الحفارات، والمعدات الثقيلة المعروضة. أضف معدات جديدة أو حدث المخزون الحالي.
            </p>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <Button asChild className="h-11 bg-slate-950 hover:bg-slate-800 text-white font-black rounded-xl shadow-lg shadow-slate-900/20 transition-all hover:scale-105 active:scale-95 px-6">
              <Link href="/admin/equipment/new">
                <Plus className="h-5 w-5 ml-2" />
                إضافة معدة
              </Link>
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 mt-8">
          {/* Search bar */}
          <div className="relative group max-w-xl">
            <Search className="absolute right-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-500 group-focus-within:text-primary transition-colors" />
            <Input
              placeholder="ابحث بالعلامة التجارية، الموديل أو الاسم..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="h-14 rounded-lg border-slate-200 shadow-sm pr-12 pl-6 text-sm font-bold bg-white focus-visible:ring-1 focus-visible:ring-primary focus-visible:border-teal-500"
            />
          </div>

          <Card className="border-0 shadow-sm rounded-xl bg-white overflow-hidden ring-1 ring-slate-100">
            <CardHeader className="p-6 border-b border-slate-100/60 bg-white flex flex-row items-center justify-between">
              <CardTitle className="flex items-center gap-3 text-lg font-black text-slate-800">
                <div className="p-2 bg-primary/10 rounded-lg text-primary">
                  <Tractor className="h-5 w-5" />
                </div>
                قائمة المعدات ({filteredEquipment.length})
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0 overflow-x-auto">
              {paginatedEquipment.length > 0 ? (
                <table className="w-full text-right border-collapse min-w-[900px]">
                  <thead>
                    <tr className="border-y border-slate-100/80 text-slate-500 text-[11px] font-semibold text-slate-600 uppercase tracking-wider font-bold bg-slate-50/50">
                      <th className="py-2.5 px-4 pr-8">المعدة</th>
                      <th className="py-2.5 px-4">السعر</th>
                      <th className="py-2.5 px-4">التصنيف</th>
                      <th className="py-2.5 px-4">الحالة</th>
                      <th className="py-2.5 px-4 pl-8 text-center">الإجراءات</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100/80 bg-white">
                    {paginatedEquipment.map((item: any) => (
                      <tr key={item._id} className="hover:bg-slate-50/60 transition-colors group">
                        <td className="py-2.5 px-4 pr-8">
                          <div className="flex items-center gap-4">
                            <div className="relative h-14 w-20 rounded-xl overflow-hidden bg-slate-100 shrink-0 shadow-sm border border-slate-200/50">
                              {item.images?.[0] ? (
                                <img
                                  src={item.images[0]}
                                  alt={item.title || item.brand}
                                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center text-slate-300">
                                  <Tractor className="h-5 w-5" />
                                </div>
                              )}
                            </div>
                            <div>
                              <p className="font-bold text-slate-900 text-sm">
                                {item.title || `${item.brand} ${item.model || ""}`}
                              </p>
                              <p className="text-xs text-slate-500 font-bold mt-1">
                                {item.year} {item.hours ? `• ${item.hours.toLocaleString()} ساعة` : ""}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="py-2.5 px-4 font-bold text-slate-900 text-sm">
                          {item.price ? (
                            <span className="text-primary">{item.price.toLocaleString()} ج.م</span>
                          ) : (
                            <span className="text-slate-500 text-xs">حسب الطلب</span>
                          )}
                        </td>
                        <td className="py-2.5 px-4 text-slate-500 text-xs font-bold">
                          <div className="flex flex-col gap-1 items-start">
                            <Badge variant="outline" className="text-slate-600 border-slate-200">{item.category}</Badge>
                            {item.featured && <span className="text-[10px] text-primary font-black">⭐ مميز</span>}
                          </div>
                        </td>
                        <td className="py-2.5 px-4">
                          <span
                            className={cn(
                              "inline-flex items-center justify-center px-3 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wide",
                              item.status === "available" || item.status === "متاح" ? "bg-emerald-50 text-primary border border-emerald-100" : "",
                              item.status === "sold" || item.status === "مباع" ? "bg-rose-50 text-rose-600 border border-rose-100" : "",
                              item.status === "reserved" || item.status === "محجوز" ? "bg-amber-50 text-primary border border-primary/20" : "",
                            )}
                          >
                            {item.status}
                          </span>
                        </td>
                        <td className="py-2.5 px-4 pl-8 text-center">
                          <div className="flex items-center justify-center gap-2 opacity-100">
                            <Button asChild size="sm" variant="ghost" className="h-9 w-9 p-0 rounded-lg text-slate-500 hover:text-primary hover:bg-slate-100">
                              <Link href={`/admin/equipment/${item._id}/edit`}>
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
                                  <DialogTitle className="text-xl font-bold text-slate-900">حذف المعدة؟</DialogTitle>
                                  <DialogDescription className="text-sm font-bold text-slate-500 leading-relaxed">
                                    سيتم حذف {item.title || item.brand} نهائياً من قاعدة البيانات. هذا الإجراء لا يمكن التراجع عنه.
                                  </DialogDescription>
                                </DialogHeader>
                                <DialogFooter className="mt-6 gap-3">
                                  <DialogClose asChild>
                                    <Button variant="outline" className="rounded-xl h-11 px-6 text-sm font-black border-slate-200">إلغاء</Button>
                                  </DialogClose>
                                  <Button 
                                    onClick={() => deleteMutation.mutate(item._id)}
                                    disabled={deleteMutation.isPending}
                                    className="rounded-xl h-11 px-6 text-sm font-black bg-rose-600 hover:bg-rose-700 text-white"
                                  >
                                    {deleteMutation.isPending ? "جاري الحذف..." : "تأكيد الحذف"}
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
                    <Tractor className="h-8 w-8 text-slate-300" />
                  </div>
                  <h3 className="text-lg font-[1000] text-slate-700">لا توجد نتائج</h3>
                  <p className="text-slate-500 font-medium">
                    {searchTerm ? "لم نجد أي معدة تطابق بحثك حالياً" : "لم يتم إضافة أي معدات للمخزون بعد"}
                  </p>
                </div>
              )}
            </CardContent>

            <Pagination
              variant="admin"
              page={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
              totalItems={filteredEquipment.length}
              pageSize={itemsPerPage}
              itemLabel="معدة"
            />
          </Card>
        </div>
      </main>
    </div>
  )
}
