"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { Input } from "@/components/ui/input"
import { Plus, Trash2, Edit, Store, MapPin, Phone, Mail, CheckCircle, Search, ArrowUpRight } from "lucide-react"
import Link from "next/link"
import { useShowrooms, useDeleteShowroom } from "@/hooks/useContent"
import { cn } from "@/lib/utils"
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

export default function AdminShowrooms() {
  const { data: showroomsData, isLoading } = useShowrooms()
  const deleteMutation = useDeleteShowroom()
  const showrooms = showroomsData?.data || []
  
  const [searchTerm, setSearchTerm] = useState("")

  const filteredShowrooms = showrooms.filter(
    (showroom: any) =>
      showroom.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (showroom.address && showroom.address.toLowerCase().includes(searchTerm.toLowerCase()))
  )

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#F8FAFC]">
        <main className="container mx-auto px-4 py-8 max-w-7xl space-y-8">
          <Skeleton className="h-12 w-64 rounded-xl" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-56 w-full rounded-lg" />
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
            <h1 className="text-3xl md:text-4xl font-bold text-slate-900 tracking-tight">إدارة المعارض</h1>
            <p className="text-sm md:text-base text-slate-500 font-bold max-w-2xl">
              إدارة شركاء المعارض. يمكنك إضافة معارض جديدة، تحديث معلومات التواصل أو إزالتها.
            </p>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <Button asChild className="h-11 bg-slate-950 hover:bg-slate-800 text-white font-black rounded-xl shadow-lg shadow-slate-900/20 transition-all hover:scale-105 active:scale-95 px-6">
              <Link href="/admin/showrooms/new">
                <Plus className="h-5 w-5 ml-2" />
                إضافة معرض جديد
              </Link>
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 mt-8">
          {/* Search bar */}
          <div className="relative group max-w-xl">
            <Search className="absolute right-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-500 group-focus-within:text-primary transition-colors" />
            <Input
              placeholder="ابحث باسم المعرض أو العنوان..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="h-14 rounded-lg border-slate-200 shadow-sm pr-12 pl-6 text-sm font-bold bg-white focus-visible:ring-1 focus-visible:ring-primary focus-visible:border-indigo-500"
            />
          </div>

          <div className="flex items-center gap-2 mb-2">
            <Store className="h-5 w-5 text-primary" />
            <h2 className="text-lg font-black text-slate-800">قائمة المعارض المسجلة ({filteredShowrooms.length})</h2>
          </div>

          {filteredShowrooms.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredShowrooms.map((showroom: any) => (
                <Card key={showroom._id} className="border border-slate-100 shadow-sm rounded-xl bg-white overflow-hidden group hover:shadow-xl hover:shadow-slate-200/50 hover:border-indigo-100 transition-all duration-300">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="h-16 w-16 bg-slate-50 rounded-lg flex items-center justify-center border border-slate-100 overflow-hidden shrink-0 shadow-sm">
                        {showroom.logo ? (
                          <img src={showroom.logo} alt={showroom.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                        ) : (
                          <Store className="h-7 w-7 text-indigo-400" />
                        )}
                      </div>
                      <div className="space-y-1">
                        <CardTitle className="text-xl font-bold text-slate-900 line-clamp-1">{showroom.name}</CardTitle>
                        {showroom.featured && (
                          <div className="flex items-center gap-1 text-primary">
                            <CheckCircle className="h-3.5 w-3.5" />
                            <span className="text-[10px] font-bold uppercase tracking-wide">شريك متميز</span>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="mt-6 space-y-3">
                      <div className="flex items-start gap-3">
                        <MapPin className="h-4.5 w-4.5 text-slate-500 shrink-0 mt-0.5" />
                        <span className="text-sm text-slate-600 font-bold leading-relaxed line-clamp-2">{showroom.address}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <Phone className="h-4.5 w-4.5 text-slate-500 shrink-0" />
                        <span className="text-sm text-slate-600 font-bold" dir="ltr">{showroom.phone}</span>
                      </div>
                      {showroom.email && (
                        <div className="flex items-center gap-3">
                          <Mail className="h-4.5 w-4.5 text-slate-500 shrink-0" />
                          <span className="text-sm text-slate-600 font-bold line-clamp-1">{showroom.email}</span>
                        </div>
                      )}
                    </div>

                    <div className="flex items-center gap-2 mt-8 pt-4 border-t border-slate-50">
                      <Button asChild variant="outline" className="flex-1 rounded-xl h-10 text-xs font-black border-slate-200 text-[#1B3E7A] hover:bg-slate-50">
                        <Link href={`/admin/showrooms/edit/${showroom._id}`}>
                          <Edit className="h-4 w-4 ml-1.5" />
                          تعديل المعرض
                        </Link>
                      </Button>
                      
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-10 w-10 rounded-xl text-slate-500 hover:text-rose-600 hover:bg-rose-50 transition-colors">
                            <Trash2 className="h-4.5 w-4.5" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="rounded-[2rem] p-8 border-0 shadow-2xl">
                          <DialogHeader className="space-y-3">
                            <DialogTitle className="text-xl font-bold text-slate-900">حذف المعرض؟</DialogTitle>
                            <DialogDescription className="text-sm font-bold text-slate-500 leading-relaxed">
                              سيتم حذف {showroom.name} نهائياً. لن يؤثر هذا على السيارات المرتبطة به ولكنها لن تنتمي لمعرض بعد الآن. هذا الإجراء لا يمكن التراجع عنه.
                            </DialogDescription>
                          </DialogHeader>
                          <DialogFooter className="mt-6 gap-3">
                            <DialogClose asChild>
                              <Button variant="outline" className="rounded-xl h-11 px-6 text-sm font-black border-slate-200">إلغاء</Button>
                            </DialogClose>
                            <Button 
                              onClick={() => deleteMutation.mutate(showroom._id)}
                              disabled={deleteMutation.isPending}
                              className="rounded-xl h-11 px-6 text-sm font-black bg-rose-600 hover:bg-rose-700 text-white"
                            >
                              {deleteMutation.isPending ? "جاري الحذف..." : "تأكيد الحذف"}
                            </Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-16 text-slate-500 text-sm font-bold flex flex-col items-center gap-4 bg-white rounded-xl border border-slate-100 shadow-sm">
              <div className="w-16 h-16 bg-slate-50 rounded-lg flex items-center justify-center">
                <Store className="h-8 w-8 text-slate-300" />
              </div>
              <h3 className="text-lg font-[1000] text-slate-700">لا توجد نتائج</h3>
              <p className="text-slate-500 font-medium">
                {searchTerm ? "لم نجد أي معرض يطابق بحثك حالياً" : "لم يتم تسجيل أي معارض بعد"}
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
