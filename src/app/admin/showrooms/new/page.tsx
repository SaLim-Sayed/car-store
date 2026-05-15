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
import { ArrowRight, Plus, X, Store, MapPin, Phone, Mail, Globe } from "lucide-react"
import Link from "next/link"
import { useCreateShowroom } from "@/hooks/useContent"

export default function NewShowroomPage() {
  const router = useRouter()
  const createMutation = useCreateShowroom()
  const [isUploading, setIsUploading] = useState(false)

  const [form, setForm] = useState({
    name: "",
    address: "",
    location: "",
    phone: "",
    email: "",
    website: "",
    description: "",
    logo: "",
    featured: false
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
        setForm((prev) => ({ ...prev, logo: data.url }))
        toast.success("تم رفع الشعار بنجاح")
      } else {
        toast.error(data.error || "فشل رفع الشعار")
      }
    } catch {
      toast.error("حدث خطأ أثناء رفع الشعار")
    } finally {
      setIsUploading(false)
      e.target.value = ''
    }
  }

  const validate = () => {
    const newErrors: Partial<Record<keyof typeof form, string>> = {}
    if (!form.name) newErrors.name = "اسم المعرض مطلوب"
    if (!form.address) newErrors.address = "العنوان مطلوب"
    if (!form.phone) newErrors.phone = "رقم الهاتف مطلوب"
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate()) return

    createMutation.mutate(form, {
      onSuccess: () => {
        toast.success("تمت إضافة المعرض بنجاح")
        router.push("/admin/showrooms")
      },
      onError: (error: any) => {
        toast.error(error?.message || "فشل في إضافة المعرض")
      }
    })
  }

  return (
    <div className="min-h-screen bg-[#F9F6F1]">
 
      <main className="container mx-auto px-4 py-24 max-w-4xl">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 mb-12">
          <div className="space-y-4">
             <Button variant="ghost" size="sm" asChild className="rounded-full hover:bg-white -mr-4">
              <Link href="/admin/showrooms" className="flex items-center text-muted-foreground hover:text-primary font-black">
                <ArrowRight className="h-4 w-4 ml-2" />
                قائمة المعارض
              </Link>
            </Button>
            <h1 className="text-5xl font-[1000] tracking-tighter">إضافة معرض</h1>
            <p className="text-muted-foreground text-xl font-medium">تسجيل معرض سيارات جديد في النظام</p>
            <div className="h-1.5 w-24 bg-primary rounded-full" />
          </div>
        </div>

        <form onSubmit={onSubmit} className="space-y-12">
          <Card className="border-0 shadow-2xl rounded-[2.5rem] bg-white overflow-hidden">
            <CardHeader className="p-8 pb-0">
              <CardTitle className="text-2xl font-black">البيانات الأساسية</CardTitle>
            </CardHeader>
            <CardContent className="p-8 space-y-8">
              <div className="space-y-3">
                <Label htmlFor="name" className="text-lg font-black">اسم المعرض *</Label>
                <div className="relative">
                  <Store className="absolute right-6 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <Input
                    id="name"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder="اسم المعرض التجاري..."
                    className={`h-14 rounded-2xl border-2 pr-14 pl-6 font-bold ${errors.name ? "border-red-500" : "border-gray-50 focus:border-primary"}`}
                  />
                </div>
                {errors.name && <p className="text-sm text-red-500 font-bold">{errors.name}</p>}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-3">
                  <Label htmlFor="phone" className="text-lg font-black">رقم الهاتف *</Label>
                  <div className="relative">
                    <Phone className="absolute right-6 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                    <Input
                      id="phone"
                      value={form.phone}
                      onChange={(e) => setForm({ ...form, phone: e.target.value })}
                      placeholder="0123456789"
                      className={`h-14 rounded-2xl border-2 pr-14 pl-6 font-bold ${errors.phone ? "border-red-500" : "border-gray-50 focus:border-primary"}`}
                    />
                  </div>
                  {errors.phone && <p className="text-sm text-red-500 font-bold">{errors.phone}</p>}
                </div>
                <div className="space-y-3">
                  <Label htmlFor="email" className="text-lg font-black">البريد الإلكتروني</Label>
                  <div className="relative">
                    <Mail className="absolute right-6 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                    <Input
                      id="email"
                      type="email"
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      placeholder="contact@showroom.com"
                      className="h-14 rounded-2xl border-2 pr-14 pl-6 font-bold border-gray-50 focus:border-primary"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <Label htmlFor="address" className="text-lg font-black">العنوان بالتفصيل *</Label>
                <div className="relative">
                  <MapPin className="absolute right-6 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <Input
                    id="address"
                    value={form.address}
                    onChange={(e) => setForm({ ...form, address: e.target.value })}
                    placeholder="المحافظة، الحي، الشارع..."
                    className={`h-14 rounded-2xl border-2 pr-14 pl-6 font-bold ${errors.address ? "border-red-500" : "border-gray-50 focus:border-primary"}`}
                  />
                </div>
                {errors.address && <p className="text-sm text-red-500 font-bold">{errors.address}</p>}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-3">
                  <Label htmlFor="website" className="text-lg font-black">الموقع الإلكتروني</Label>
                  <div className="relative">
                    <Globe className="absolute right-6 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                    <Input
                      id="website"
                      value={form.website}
                      onChange={(e) => setForm({ ...form, website: e.target.value })}
                      placeholder="www.showroom.com"
                      className="h-14 rounded-2xl border-2 pr-14 pl-6 font-bold border-gray-50 focus:border-primary"
                    />
                  </div>
                </div>
                <div className="space-y-3 flex flex-col justify-end">
                  <label className="flex items-center gap-4 h-14 px-6 rounded-2xl border-2 border-gray-50 bg-gray-50/50 cursor-pointer hover:bg-gray-50 transition-colors">
                    <input
                      type="checkbox"
                      checked={form.featured}
                      onChange={(e) => setForm({ ...form, featured: e.target.checked })}
                      className="w-6 h-6 rounded-lg border-2 border-gray-300 text-primary focus:ring-primary"
                    />
                    <span className="text-lg font-black">تمييز المعرض كشريك متميز</span>
                  </label>
                </div>
              </div>

              <div className="space-y-3">
                <Label htmlFor="description" className="text-lg font-black">وصف المعرض</Label>
                <Textarea
                  id="description"
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  placeholder="نبذة عن المعرض والخدمات المقدمة..."
                  className="min-h-[150px] rounded-2xl border-2 p-6 font-bold border-gray-50 focus:border-primary"
                />
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-2xl rounded-[2.5rem] bg-white overflow-hidden">
            <CardHeader className="p-8 pb-0">
              <CardTitle className="text-2xl font-black">الشعار والهوية</CardTitle>
            </CardHeader>
            <CardContent className="p-8 space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                <div className="space-y-4">
                  <Label className="text-lg font-black">رفع الشعار</Label>
                  <div className="relative h-48 border-4 border-dashed border-gray-100 rounded-[2rem] flex flex-col items-center justify-center hover:border-primary transition-colors cursor-pointer group">
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={handleFileUpload}
                      disabled={isUploading}
                      className="absolute inset-0 opacity-0 cursor-pointer z-10"
                    />
                    <Plus className="h-12 w-12 text-muted-foreground group-hover:text-primary mb-3 transition-colors" />
                    <span className="text-muted-foreground font-black group-hover:text-primary transition-colors">
                      {isUploading ? "جاري الرفع..." : "اختر ملف الشعار"}
                    </span>
                  </div>
                </div>

                <div className="space-y-4">
                  <Label className="text-lg font-black">رابط الشعار (URL)</Label>
                  <Input
                    value={form.logo}
                    onChange={(e) => setForm({ ...form, logo: e.target.value })}
                    placeholder="https://example.com/logo.png"
                    className="h-14 rounded-2xl border-2 px-6 font-bold border-gray-50 focus:border-primary"
                  />
                  <p className="text-sm text-muted-foreground font-bold">يفضل استخدام شعار بخلفية شفافة</p>
                </div>
              </div>

              {form.logo && (
                <div className="flex justify-center">
                   <div className="relative h-40 w-40 rounded-[2rem] overflow-hidden shadow-xl border-4 border-white group bg-gray-50">
                    <img
                      src={form.logo}
                      alt="معاينة"
                      className="w-full h-full object-contain p-4 group-hover:scale-110 transition-transform duration-700"
                    />
                    <button
                      type="button"
                      onClick={() => setForm({ ...form, logo: "" })}
                      className="absolute top-4 left-4 w-10 h-10 bg-white text-destructive rounded-full flex items-center justify-center shadow-2xl hover:scale-110 transition-transform"
                    >
                      <X className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          <div className="flex gap-4 pt-8">
            <Button type="button" variant="outline" asChild className="flex-1 h-16 rounded-2xl text-xl font-black border-2">
              <Link href="/admin/showrooms">إلغاء</Link>
            </Button>
            <Button 
              type="submit" 
              disabled={createMutation.isPending || isUploading} 
              className="flex-[2] h-16 rounded-2xl text-xl font-black shadow-xl shadow-primary/20"
            >
              {createMutation.isPending ? "جاري الحفظ..." : "تسجيل المعرض"}
            </Button>
          </div>
        </form>
      </main>
    </div>
  )
}
