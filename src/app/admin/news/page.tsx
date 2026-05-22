"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { Input } from "@/components/ui/input"
import { Plus, Trash2, Edit, ExternalLink, Calendar, Tag, Search, Newspaper } from "lucide-react"
import Link from "next/link"
import { useNews, useDeleteNews } from "@/hooks/useContent"
import { FormattedDate } from "@/components/formatted-date"
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
import { cn } from "@/lib/utils"

export default function AdminNews() {
  const { data: newsData, isLoading } = useNews(100, "all")
  const deleteMutation = useDeleteNews()
  const newsItems = newsData?.data || []
  
  const [searchTerm, setSearchTerm] = useState("")

  const filteredNews = newsItems.filter(
    (news: any) =>
      news.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (news.category && news.category.toLowerCase().includes(searchTerm.toLowerCase()))
  )

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#F8FAFC]">
        <main className="container mx-auto px-4 py-8 max-w-7xl space-y-8">
          <Skeleton className="h-12 w-64 rounded-xl" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-72 w-full rounded-xl" />
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
            <h1 className="text-3xl md:text-4xl font-bold text-slate-900 tracking-tight">إدارة الأخبار والمقالات</h1>
            <p className="text-sm md:text-base text-slate-500 font-bold max-w-2xl">
              إدارة المحتوى والمقالات المنشورة في المنصة. يمكنك نشر أخبار جديدة، تعديل المحتوى أو حذفه.
            </p>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <Button asChild className="h-11 bg-slate-950 hover:bg-slate-800 text-white font-black rounded-xl shadow-lg shadow-slate-900/20 transition-all hover:scale-105 active:scale-95 px-6">
              <Link href="/admin/news/new">
                <Plus className="h-5 w-5 ml-2" />
                إضافة خبر جديد
              </Link>
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 mt-8">
          {/* Search bar */}
          <div className="relative group max-w-xl">
            <Search className="absolute right-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-500 group-focus-within:text-primary transition-colors" />
            <Input
              placeholder="ابحث بعنوان الخبر أو التصنيف..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="h-14 rounded-lg border-slate-200 shadow-sm pr-12 pl-6 text-sm font-bold bg-white focus-visible:ring-1 focus-visible:ring-primary focus-visible:border-amber-500"
            />
          </div>

          <div className="flex items-center gap-2 mb-2">
            <Newspaper className="h-5 w-5 text-primary" />
            <h2 className="text-lg font-black text-slate-800">سجل المقالات والأخبار ({filteredNews.length})</h2>
          </div>

          {filteredNews.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredNews.map((news: any) => (
                <Card key={news._id} className="border border-slate-100 shadow-sm rounded-xl bg-white overflow-hidden group hover:shadow-xl hover:shadow-slate-200/50 hover:border-primary/20 transition-all duration-300 flex flex-col">
                  <CardHeader className="p-0 relative h-48 overflow-hidden bg-slate-100 shrink-0">
                    {news.image ? (
                      <img src={news.image} alt={news.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-slate-300">
                        <Newspaper className="h-12 w-12" />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    <div className="absolute top-4 right-4 flex gap-2">
                      <span className="bg-white/95 backdrop-blur-md px-3 py-1 rounded-md text-[10px] font-bold uppercase tracking-wide text-slate-700 shadow-sm">
                        {news.category}
                      </span>
                      <span className={cn(
                        "px-3 py-1 rounded-md text-[10px] font-bold uppercase tracking-wide shadow-sm",
                        news.status === 'نشط' || news.status === 'active' ? "bg-emerald-500 text-white" : "bg-slate-500 text-white"
                      )}>
                        {news.status}
                      </span>
                    </div>
                  </CardHeader>
                  <CardContent className="p-6 flex-1 flex flex-col justify-between space-y-6">
                    <div className="space-y-3">
                      <div className="flex items-center gap-3 text-xs text-slate-500 font-bold mb-1">
                        <div className="flex items-center gap-1.5">
                          <Calendar className="h-3.5 w-3.5" />
                          <FormattedDate value={news.date} />
                        </div>
                      </div>
                      <CardTitle className="text-xl font-bold text-slate-900 leading-tight line-clamp-2 group-hover:text-primary transition-colors">
                        {news.title}
                      </CardTitle>
                      <p className="text-sm text-slate-500 line-clamp-2 font-medium leading-relaxed">
                        {news.excerpt}
                      </p>
                    </div>

                    <div className="flex gap-3 pt-4 border-t border-slate-50 mt-auto">
                      <Button variant="outline" asChild className="flex-1 rounded-xl h-10 text-xs font-black border-slate-200 text-[#1B3E7A] hover:bg-slate-50">
                        <Link href={`/admin/news/edit/${news._id}`}>
                          <Edit className="h-4 w-4 ml-1.5" />
                          تعديل
                        </Link>
                      </Button>
                      
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="ghost" size="icon" className="w-10 h-10 rounded-xl text-slate-500 hover:text-rose-600 hover:bg-rose-50 transition-colors">
                            <Trash2 className="h-4.5 w-4.5" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="rounded-[2rem] p-8 border-0 shadow-2xl">
                          <DialogHeader className="space-y-3">
                            <DialogTitle className="text-xl font-bold text-slate-900">حذف الخبر؟</DialogTitle>
                            <DialogDescription className="text-sm font-bold text-slate-500 leading-relaxed">
                              هذا الإجراء لا يمكن التراجع عنه. سيتم حذف الخبر نهائياً من قاعدة البيانات ولن يظهر للزوار.
                            </DialogDescription>
                          </DialogHeader>
                          <DialogFooter className="mt-6 gap-3">
                            <DialogClose asChild>
                              <Button variant="outline" className="rounded-xl h-11 px-6 text-sm font-black border-slate-200">إلغاء</Button>
                            </DialogClose>
                            <Button 
                              onClick={() => deleteMutation.mutate(news._id)}
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
                <Newspaper className="h-8 w-8 text-slate-300" />
              </div>
              <h3 className="text-lg font-[1000] text-slate-700">لا توجد نتائج</h3>
              <p className="text-slate-500 font-medium">
                {searchTerm ? "لم نجد أي مقال يطابق بحثك حالياً" : "لم يتم نشر أي أخبار بعد"}
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
