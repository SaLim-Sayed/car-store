"use client"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import { Navbar } from "@/components/navbar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Skeleton } from "@/components/ui/skeleton"
import { toast } from "sonner"
import { ArrowRight } from "lucide-react"
import Link from "next/link"
import { useNews, useUpdateNews } from "@/hooks/useContent"
import { uploadImageIfNeeded } from "@/lib/client-image-upload"
import { ImageUpload } from "@/components/image-upload"
import { DatePicker } from "@/components/date-picker"
import { parseToIsoDate, todayIso } from "@/lib/date-utils"

export default function EditNewsPage() {
  const router = useRouter()
  const params = useParams()
  const id = params.id as string
  const { data: newsData, isLoading: isLoadingData } = useNews(1, "all") // Simplified, but should ideally fetch by ID
  const updateMutation = useUpdateNews()
  const [isUploading, setIsUploading] = useState(false)

  const [form, setForm] = useState({
    title: "",
    excerpt: "",
    content: "",
    image: "",
    category: "أخبار السوق",
    status: "نشط",
    date: ""
  })

  useEffect(() => {
    // Note: Since our useNews hook currently fetches all, we filter here. 
    // In a real app, you'd have a useNewsById hook.
    const fetchItem = async () => {
      try {
        const res = await fetch(`/api/news`)
        const data = await res.json()
        const item = data.data?.find((n: any) => n._id === id)
        if (item) {
          setForm({
            title: item.title,
            excerpt: item.excerpt,
            content: item.content,
            image: item.image,
            category: item.category,
            status: item.status,
            date: parseToIsoDate(item.date) || todayIso()
          })
        }
      } catch (e) {
        toast.error("فشل في تحميل بيانات الخبر")
      }
    }
    if (id) fetchItem()
  }, [id])

  const [errors, setErrors] = useState<Partial<Record<keyof typeof form, string>>>({})

  const validate = () => {
    const newErrors: Partial<Record<keyof typeof form, string>> = {}
    if (!form.title) newErrors.title = "العنوان مطلوب"
    if (!form.excerpt) newErrors.excerpt = "الملخص مطلوب"
    if (!form.content) newErrors.content = "المحتوى مطلوب"
    if (!form.image) newErrors.image = "الصورة مطلوبة"
    if (!form.date) newErrors.date = "تاريخ النشر مطلوب"
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate()) return

    try {
      const image = await uploadImageIfNeeded(form.image)

      updateMutation.mutate(
        {
          id,
          data: { ...form, image }
        },
        {
          onSuccess: () => {
            toast.success("تم تحديث الخبر بنجاح")
            router.push("/admin/news")
          },
          onError: (error: any) => {
            toast.error(error?.response?.data?.error || error?.message || "فشل في تحديث الخبر")
          }
        }
      )
    } catch {
      toast.error("فشل رفع الصورة. جرّب رفع الملف مرة أخرى.")
    }
  }

  if (isLoadingData && !form.title) {
    return (
      <div className="min-h-screen bg-[#F9F6F1]">
           <main className="container mx-auto px-4 py-24 max-w-4xl space-y-12">
          <Skeleton className="h-16 w-64 rounded-2xl" />
          <Skeleton className="h-[600px] w-full rounded-[2.5rem]" />
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#F9F6F1]">
 
      <main className="container mx-auto px-4 py-24 max-w-4xl">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 mb-12">
          <div className="space-y-4">
             <Button variant="ghost" size="sm" asChild className="rounded-full hover:bg-white -mr-4">
              <Link href="/admin/news" className="flex items-center text-muted-foreground hover:text-primary font-black">
                <ArrowRight className="h-4 w-4 ml-2" />
                قائمة الأخبار
              </Link>
            </Button>
            <h1 className="text-5xl font-[1000] tracking-tighter">تعديل الخبر</h1>
            <p className="text-muted-foreground text-xl font-medium">تحديث بيانات المقال المنشور</p>
            <div className="h-1.5 w-24 bg-primary rounded-full" />
          </div>
        </div>

        <form onSubmit={onSubmit} className="space-y-12">
          <Card className="border-0 shadow-2xl rounded-[2.5rem] bg-white overflow-hidden">
            <CardHeader className="p-8 pb-0">
              <CardTitle className="text-2xl font-black">محتوى الخبر</CardTitle>
            </CardHeader>
            <CardContent className="p-8 space-y-8">
              <div className="space-y-3">
                <Label htmlFor="title" className="text-lg font-black">العنوان الرئيسي *</Label>
                <Input
                  id="title"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  placeholder="اكتب عنواناً جذاباً..."
                  className={`h-14 rounded-2xl border-2 px-6 font-bold ${errors.title ? "border-red-500" : "border-gray-50 focus:border-primary"}`}
                />
                {errors.title && <p className="text-sm text-red-500 font-bold">{errors.title}</p>}
              </div>

              <DatePicker
                id="news-date"
                label="تاريخ النشر"
                value={form.date}
                onChange={(date) => setForm({ ...form, date })}
                error={errors.date}
                required
                max={todayIso()}
                inputClassName="rounded-2xl"
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-3">
                  <Label htmlFor="category" className="text-lg font-black">التصنيف *</Label>
                  <select
                    id="category"
                    value={form.category}
                    onChange={(e) => setForm({ ...form, category: e.target.value })}
                    className="flex h-14 w-full rounded-2xl border-2 border-gray-50 bg-white px-6 py-2 text-lg font-bold focus:border-primary focus:outline-none transition-colors"
                  >
                    <option value="أخبار السوق">أخبار السوق</option>
                    <option value="جديد السيارات">جديد السيارات</option>
                    <option value="نصائح تهمك">نصائح تهمك</option>
                    <option value="مراجعات">مراجعات</option>
                  </select>
                </div>
                <div className="space-y-3">
                  <Label htmlFor="status" className="text-lg font-black">الحالة *</Label>
                  <select
                    id="status"
                    value={form.status}
                    onChange={(e) => setForm({ ...form, status: e.target.value })}
                    className="flex h-14 w-full rounded-2xl border-2 border-gray-50 bg-white px-6 py-2 text-lg font-bold focus:border-primary focus:outline-none transition-colors"
                  >
                    <option value="نشط">نشط</option>
                    <option value="مسودة">مسودة</option>
                  </select>
                </div>
              </div>

              <div className="space-y-3">
                <Label htmlFor="excerpt" className="text-lg font-black">ملخص الخبر *</Label>
                <Textarea
                  id="excerpt"
                  value={form.excerpt}
                  onChange={(e) => setForm({ ...form, excerpt: e.target.value })}
                  placeholder="وصف مختصر يظهر في قائمة الأخبار..."
                  className={`min-h-[100px] rounded-2xl border-2 p-6 font-bold ${errors.excerpt ? "border-red-500" : "border-gray-50 focus:border-primary"}`}
                />
                {errors.excerpt && <p className="text-sm text-red-500 font-bold">{errors.excerpt}</p>}
              </div>

              <div className="space-y-3">
                <Label htmlFor="content" className="text-lg font-black">التفاصيل الكاملة *</Label>
                <Textarea
                  id="content"
                  value={form.content}
                  onChange={(e) => setForm({ ...form, content: e.target.value })}
                  placeholder="اكتب المحتوى الكامل هنا..."
                  className={`min-h-[300px] rounded-2xl border-2 p-6 font-bold ${errors.content ? "border-red-500" : "border-gray-50 focus:border-primary"}`}
                />
                {errors.content && <p className="text-sm text-red-500 font-bold">{errors.content}</p>}
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-2xl rounded-[2.5rem] bg-white overflow-hidden">
            <CardHeader className="p-8 pb-0">
              <CardTitle className="text-2xl font-black">الصورة البارزة</CardTitle>
            </CardHeader>
            <CardContent className="p-8">
              <ImageUpload
                value={form.image}
                onChange={(image) => setForm((prev) => ({ ...prev, image }))}
                error={errors.image}
                onUploadingChange={setIsUploading}
              />
            </CardContent>
          </Card>

          <div className="flex gap-4 pt-8">
            <Button type="button" variant="outline" asChild className="flex-1 h-16 rounded-2xl text-xl font-black border-2">
              <Link href="/admin/news">إلغاء</Link>
            </Button>
            <Button 
              type="submit" 
              disabled={updateMutation.isPending || isUploading} 
              className="flex-[2] h-16 rounded-2xl text-xl font-black shadow-xl shadow-primary/20"
            >
              {updateMutation.isPending ? "جاري الحفظ..." : "حفظ التغييرات"}
            </Button>
          </div>
        </form>
      </main>
    </div>
  )
}
