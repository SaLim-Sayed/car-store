"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Navbar } from "@/components/navbar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "sonner"
import { ArrowRight, Plus, X, Image as ImageIcon } from "lucide-react"
import Link from "next/link"
import { useCreateNews } from "@/hooks/useContent"

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
    status: "نشط"
  })

  const [errors, setErrors] = useState<Partial<Record<keyof typeof form, string>>>({})

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setIsUploading(true)
    try {
      const formData = new FormData()
      formData.append('file', file)

      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      })

      const data = await res.json()

      if (data.success) {
        setForm((prev) => ({ ...prev, image: data.url }))
        toast.success("تم رفع الصورة بنجاح")
      } else {
        toast.error(data.error || "فشل رفع الصورة")
      }
    } catch {
      toast.error("حدث خطأ أثناء رفع الصورة")
    } finally {
      setIsUploading(false)
      e.target.value = ''
    }
  }

  const validate = () => {
    const newErrors: Partial<Record<keyof typeof form, string>> = {}
    if (!form.title) newErrors.title = "العنوان مطلوب"
    if (!form.excerpt) newErrors.excerpt = "الملخص مطلوب"
    if (!form.content) newErrors.content = "المحتوى مطلوب"
    if (!form.image) newErrors.image = "الصورة مطلوبة"
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate()) return

    createMutation.mutate(
      {
        ...form,
        date: new Date().toLocaleDateString("ar-SA")
      },
      {
        onSuccess: () => {
          toast.success("تم نشر الخبر بنجاح")
          router.push("/admin/news")
        },
        onError: (error: any) => {
          toast.error(error?.message || "فشل في نشر الخبر")
        }
      }
    )
  }

  return (
    <div className="min-h-screen bg-[#F9F6F1]">
      <Navbar />

      <main className="container mx-auto px-4 py-24 max-w-4xl">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 mb-12">
          <div className="space-y-4">
             <Button variant="ghost" size="sm" asChild className="rounded-full hover:bg-white -mr-4">
              <Link href="/admin/news" className="flex items-center text-muted-foreground hover:text-primary font-black">
                <ArrowRight className="h-4 w-4 ml-2" />
                قائمة الأخبار
              </Link>
            </Button>
            <h1 className="text-5xl font-[1000] tracking-tighter">إضافة خبر</h1>
            <p className="text-muted-foreground text-xl font-medium">نشر مقال جديد في قسم الأخبار</p>
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
            <CardContent className="p-8 space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                <div className="space-y-4">
                  <Label className="text-lg font-black">رفع صورة</Label>
                  <div className="relative h-48 border-4 border-dashed border-gray-100 rounded-[2rem] flex flex-col items-center justify-center hover:border-primary transition-colors cursor-pointer group">
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={handleFileUpload}
                      disabled={isUploading}
                      className="absolute inset-0 opacity-0 cursor-pointer z-10"
                    />
                    <ImageIcon className="h-12 w-12 text-muted-foreground group-hover:text-primary mb-3 transition-colors" />
                    <span className="text-muted-foreground font-black group-hover:text-primary transition-colors">
                      {isUploading ? "جاري الرفع..." : "اسحب الصورة هنا أو اختر ملف"}
                    </span>
                  </div>
                </div>

                <div className="space-y-4">
                  <Label className="text-lg font-black">رابط الصورة (URL)</Label>
                  <Input
                    value={form.image}
                    onChange={(e) => setForm({ ...form, image: e.target.value })}
                    placeholder="https://example.com/image.jpg"
                    className={`h-14 rounded-2xl border-2 px-6 font-bold ${errors.image ? "border-red-500" : "border-gray-50 focus:border-primary"}`}
                  />
                  <p className="text-sm text-muted-foreground font-bold">يمكنك استخدام رابط مباشر بدلاً من الرفع</p>
                </div>
              </div>

              {form.image && (
                <div className="relative aspect-video rounded-[2rem] overflow-hidden shadow-xl border-4 border-white group">
                  <img
                    src={form.image}
                    alt="معاينة"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <button
                    type="button"
                    onClick={() => setForm({ ...form, image: "" })}
                    className="absolute top-6 left-6 w-12 h-12 bg-white text-destructive rounded-full flex items-center justify-center shadow-2xl hover:scale-110 transition-transform"
                  >
                    <X className="h-6 w-6" />
                  </button>
                </div>
              )}
              {errors.image && <p className="text-sm text-red-500 font-bold">{errors.image}</p>}
            </CardContent>
          </Card>

          <div className="flex gap-4 pt-8">
            <Button type="button" variant="outline" asChild className="flex-1 h-16 rounded-2xl text-xl font-black border-2">
              <Link href="/admin/news">إلغاء</Link>
            </Button>
            <Button 
              type="submit" 
              disabled={createMutation.isPending || isUploading} 
              className="flex-[2] h-16 rounded-2xl text-xl font-black shadow-xl shadow-primary/20"
            >
              {createMutation.isPending ? "جاري النشر..." : "نشر الخبر الآن"}
            </Button>
          </div>
        </form>
      </main>
    </div>
  )
}
