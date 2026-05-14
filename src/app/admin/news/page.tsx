"use client"

import { Navbar } from "@/components/navbar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { Plus, Trash2, Edit, ExternalLink, Calendar, Tag } from "lucide-react"
import Link from "next/link"
import { useNews, useDeleteNews } from "@/hooks/useContent"
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

export default function AdminNews() {
  const { data: newsData, isLoading } = useNews(100, "all")
  const deleteMutation = useDeleteNews()

  const newsItems = newsData?.data || []

  return (
    <div className="min-h-screen bg-[#F9F6F1]">
      <Navbar />

      <main className="container mx-auto px-4 py-24">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
          <div className="space-y-4">
            <h1 className="text-5xl font-[1000] tracking-tighter">إدارة الأخبار</h1>
            <p className="text-muted-foreground text-xl font-medium">إدارة المحتوى والمقالات المنشورة</p>
            <div className="h-1.5 w-24 bg-primary rounded-full" />
          </div>
          
          <Button asChild className="rounded-2xl h-14 px-8 text-lg font-black shadow-lg shadow-primary/20">
            <Link href="/admin/news/new" className="flex items-center">
              <Plus className="h-5 w-5 ml-2" />
              إضافة خبر جديد
            </Link>
          </Button>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {Array.from({ length: 6 }).map((_, i) => (
              <Card key={i} className="border-0 shadow-lg rounded-[2.5rem] bg-white overflow-hidden">
                <Skeleton className="h-48 w-full" />
                <CardContent className="p-8 space-y-4">
                  <Skeleton className="h-8 w-3/4" />
                  <Skeleton className="h-6 w-full" />
                  <Skeleton className="h-10 w-full rounded-xl" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : newsItems.length === 0 ? (
          <Card className="border-2 border-dashed border-gray-200 rounded-[2.5rem] p-16 text-center bg-white">
            <p className="text-2xl font-black text-muted-foreground mb-6">لا توجد أخبار حالياً</p>
            <Button asChild variant="outline" className="rounded-2xl h-12 px-6">
              <Link href="/admin/news/new">ابدأ بإضافة أول خبر</Link>
            </Button>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {newsItems.map((news: any) => (
              <Card key={news._id} className="border-0 shadow-xl rounded-[2.5rem] bg-white overflow-hidden group hover:shadow-2xl transition-all duration-500">
                <CardHeader className="p-0 relative h-48 overflow-hidden bg-gray-100">
                  {news.image ? (
                    <img src={news.image} alt={news.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                      <ExternalLink className="h-12 w-12 opacity-20" />
                    </div>
                  )}
                  <div className="absolute top-6 right-6">
                    <span className="bg-white/90 backdrop-blur-md px-4 py-1.5 rounded-full text-sm font-black shadow-sm">
                      {news.category}
                    </span>
                  </div>
                </CardHeader>
                <CardContent className="p-8 space-y-6">
                  <div className="space-y-3">
                    <div className="flex items-center gap-4 text-sm text-muted-foreground font-bold mb-1">
                       <div className="flex items-center gap-1.5">
                         <Calendar className="h-4 w-4" />
                         {news.date}
                       </div>
                       <div className="h-1 w-1 bg-gray-300 rounded-full" />
                       <div className="flex items-center gap-1.5">
                         <Tag className="h-4 w-4" />
                         {news.status}
                       </div>
                    </div>
                    <CardTitle className="text-2xl font-black leading-tight line-clamp-2">
                      {news.title}
                    </CardTitle>
                    <p className="text-muted-foreground line-clamp-2 font-medium leading-relaxed">
                      {news.excerpt}
                    </p>
                  </div>

                  <div className="flex gap-3 pt-2">
                    <Button variant="outline" asChild className="flex-1 rounded-xl h-12 font-bold border-2">
                      <Link href={`/admin/news/edit/${news._id}`}>
                        <Edit className="h-4 w-4 ml-2" />
                        تعديل
                      </Link>
                    </Button>
                    
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="outline" className="w-12 h-12 rounded-xl border-2 text-destructive hover:bg-destructive/10">
                          <Trash2 className="h-5 w-5" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="rounded-[2.5rem] p-10 border-0 shadow-2xl">
                        <DialogHeader className="space-y-4">
                          <DialogTitle className="text-2xl font-black">هل أنت متأكد من الحذف؟</DialogTitle>
                          <DialogDescription className="text-lg font-medium leading-relaxed">
                            هذا الإجراء لا يمكن التراجع عنه. سيتم حذف الخبر نهائياً من قاعدة البيانات.
                          </DialogDescription>
                        </DialogHeader>
                        <DialogFooter className="mt-8 gap-4">
                          <DialogClose asChild>
                            <Button variant="outline" className="rounded-2xl h-14 px-8 text-lg font-black border-2">إلغاء</Button>
                          </DialogClose>
                          <Button 
                            onClick={() => deleteMutation.mutate(news._id)}
                            className="rounded-2xl h-14 px-8 text-lg font-black bg-destructive hover:bg-destructive/90"
                          >
                            تأكيد الحذف
                          </Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
