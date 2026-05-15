"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "sonner"
import { ArrowRight } from "lucide-react"
import Link from "next/link"
import { useCreateNews } from "@/hooks/useContent"
import { uploadImageIfNeeded } from "@/lib/client-image-upload"
import { ImageUpload } from "@/components/image-upload"
import { DatePicker } from "@/components/date-picker"
import { todayIso } from "@/lib/date-utils"

export default function NewNewsPage() {
  const router = useRouter()
  const createMutation = useCreateNews()
  const [isUploading, setIsUploading] = useState(false)

  const [form, setForm] = useState({
    title: "",
    excerpt: "",
    content: "",
    image: "",
    category: "أخبار السوق",
    status: "نشط",
    date: todayIso(),
  })

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

      createMutation.mutate(
        {
          ...form,
          image,
          date: form.date,
        },
        {
          onSuccess: () => {
            toast.success("تم نشر الخبر بنجاح")
            router.push("/admin/news")
          },
          onError: (error: any) => {
            toast.error(error?.response?.data?.error || error?.message || "فشل في نشر الخبر")
          }
        }
      )
    } catch {
      toast.error("فشل رفع الصورة. جرّب رفع الملف مرة أخرى.")
    }
  }

  return (
    <div className="min-h-screen bg-[#F9F6F1]">
 
      <main className="container mx-auto px-4 pb-8 max-w-4xl">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 mb-12">
          <div className="space-y-4">
             <Button variant="ghost" size="sm" asChild className="rounded-md hover:bg-white -mr-4">
              <Link href="/admin/news" className="flex items-center text-muted-foreground hover:text-primary font-black">
                <ArrowRight className="h-4 w-4 ml-2" />
                قائمة الأخبار
              </Link>
            </Button>
            <h1 className="text-5xl font-[1000] tracking-tighter">إضافة خبر</h1>
            <p className="text-muted-foreground text-xl font-medium">نشر مقال جديد في قسم الأخبار</p>
            <div className="h-1.5 w-24 bg-primary rounded-md" />
          </div>
        </div>

        <form onSubmit={onSubmit} className="space-y-12">
          <Card className="border-0 shadow-2xl rounded-md bg-white overflow-hidden">
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
                  className={`h-14 rounded-md border-2 px-6 font-bold ${errors.title ? "border-red-500" : "border-gray-50 focus:border-primary"}`}
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
                inputClassName="rounded-md"
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-3">
                  <Label htmlFor="category" className="text-lg font-black">التصنيف *</Label>
                  <select
                    id="category"
                    value={form.category}
                    onChange={(e) => setForm({ ...form, category: e.target.value })}
                    className="flex h-14 w-full rounded-md border-2 border-gray-50 bg-white px-6 py-2 text-lg font-bold focus:border-primary focus:outline-none transition-colors"
                  >
                    <option value="أخبار السوق">أخبار السوق</option>
                    <option value="جديد السيارات">جديد السيارات</option>
                    <option value="نصائح تهمك">نصائح تهمك</option>
                    <option value="مراجعات">مراجعات</option>
                    <option value="أخبار">أخبار</option>
                    <option value="عروض">عروض</option>
                  </select>
                </div>
                <div className="space-y-3">
                  <Label htmlFor="status" className="text-lg font-black">الحالة *</Label>
                  <select
                    id="status"
                    value={form.status}
                    onChange={(e) => setForm({ ...form, status: e.target.value })}
                    className="flex h-14 w-full rounded-md border-2 border-gray-50 bg-white px-6 py-2 text-lg font-bold focus:border-primary focus:outline-none transition-colors"
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
                  className={`min-h-[100px] rounded-md border-2 p-6 font-bold ${errors.excerpt ? "border-red-500" : "border-gray-50 focus:border-primary"}`}
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
                  className={`min-h-[300px] rounded-md border-2 p-6 font-bold ${errors.content ? "border-red-500" : "border-gray-50 focus:border-primary"}`}
                />
                {errors.content && <p className="text-sm text-red-500 font-bold">{errors.content}</p>}
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-2xl rounded-md bg-white overflow-hidden">
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
            <Button type="button" variant="outline" asChild className="flex-1 h-16 rounded-md text-xl font-black border-2">
              <Link href="/admin/news">إلغاء</Link>
            </Button>
            <Button
              type="submit"
              disabled={createMutation.isPending || isUploading}
              className="flex-[2] h-16 rounded-md text-xl font-black shadow-xl shadow-primary/20"
            >
              {createMutation.isPending ? "جاري النشر..." : "نشر الخبر الآن"}
            </Button>
          </div>
        </form>
      </main>
    </div>
  )
}
