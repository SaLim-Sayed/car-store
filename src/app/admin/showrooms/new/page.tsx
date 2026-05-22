"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "sonner"
import { ArrowRight, Plus, X, Store, MapPin, Phone, Mail, Globe, ImagePlus, CheckCircle, Tag, Info } from "lucide-react"
import Link from "next/link"
import { useCreateShowroom } from "@/hooks/useContent"
import { cn } from "@/lib/utils"

export default function NewShowroomPage() {
  const router = useRouter()
  const createMutation = useCreateShowroom()
  const [isUploading, setIsUploading] = useState(false)
  const [newImageUrl, setNewImageUrl] = useState("")

  const [form, setForm] = useState({
    name: "",
    address: "",
    location: "",
    phone: "",
    email: "",
    website: "",
    description: "",
    logo: "",
    featured: false,
    locationLink: ""
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

  const addImageUrl = () => {
    const url = newImageUrl.trim()
    if (!url) return
    setForm((prev) => ({ ...prev, logo: url }))
    setNewImageUrl("")
  }

  const validate = () => {
    const newErrors: Partial<Record<keyof typeof form, string>> = {}
    if (!form.name) newErrors.name = "مطلوب"
    if (!form.address) newErrors.address = "مطلوب"
    if (!form.phone) newErrors.phone = "مطلوب"
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate()) {
      toast.error("يرجى مراجعة الحقول المطلوبة")
      return
    }

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
    <div className="min-h-screen bg-[#F8FAFC]">
      <main className="container mx-auto px-4 py-8 max-w-5xl">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-8 border-b border-slate-200">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2 text-slate-500 mb-2 font-bold text-sm">
              <Link href="/admin/showrooms" className="hover:text-primary transition-colors">المعارض</Link>
              <ArrowRight className="h-3 w-3" />
              <span className="text-slate-800">إضافة معرض جديد</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-slate-900 tracking-tight">إضافة معرض جديد</h1>
            <p className="text-sm md:text-base text-slate-500 font-bold max-w-2xl">
              تسجيل معرض سيارات جديد في النظام
            </p>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <Button variant="outline" asChild className="h-11 border-slate-200 text-slate-600 font-black rounded-xl hover:bg-slate-50 px-6">
              <Link href="/admin/showrooms">إلغاء الأمر</Link>
            </Button>
            <Button
              onClick={onSubmit}
              disabled={createMutation.isPending || isUploading}
              className="h-11 bg-primary hover:bg-primary/90 text-white font-black rounded-xl shadow-lg shadow-primary/20 transition-all hover:scale-105 active:scale-95 px-8"
            >
              {createMutation.isPending ? "جاري الحفظ..." : "تسجيل المعرض"}
            </Button>
          </div>
        </div>

        <form onSubmit={onSubmit} className="mt-8 space-y-8">
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Form Area (Spans 2 columns) */}
            <div className="lg:col-span-2 space-y-8">
              
              {/* Basic Details Card */}
              <Card className="border border-slate-100 shadow-sm rounded-xl bg-white overflow-hidden ring-1 ring-slate-100/50">
                <CardHeader className="p-6 border-b border-slate-100/60 bg-white">
                  <CardTitle className="flex items-center gap-3 text-lg font-black text-slate-800">
                    <div className="p-2 bg-primary/10 rounded-lg text-primary">
                      <Store className="h-5 w-5" />
                    </div>
                    البيانات الأساسية
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6 space-y-6">
                  
                  <div className="space-y-2.5">
                    <Label htmlFor="name" className="text-sm font-black text-slate-700">اسم المعرض <span className="text-rose-500">*</span></Label>
                    <div className="relative">
                      <Store className="absolute right-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                      <Input
                        id="name"
                        value={form.name}
                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                        placeholder="اسم المعرض التجاري..."
                        className={cn("h-12 rounded-xl bg-slate-50 border-slate-200 pr-10 pl-4 focus-visible:ring-primary font-bold", errors.name && "border-rose-500 focus-visible:ring-rose-500")}
                      />
                    </div>
                    {errors.name && <p className="text-xs text-rose-500 font-bold">{errors.name}</p>}
                  </div>

                  <div className="space-y-2.5">
                    <Label htmlFor="description" className="text-sm font-black text-slate-700">نبذة عن المعرض <span className="text-slate-500 font-medium">(اختياري)</span></Label>
                    <Textarea
                      id="description"
                      value={form.description}
                      onChange={(e) => setForm({ ...form, description: e.target.value })}
                      placeholder="وصف المعرض والخدمات المقدمة..."
                      className="min-h-[120px] rounded-xl bg-slate-50 border-slate-200 focus-visible:ring-primary font-bold resize-none"
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Contact & Location Card */}
              <Card className="border border-slate-100 shadow-sm rounded-xl bg-white overflow-hidden ring-1 ring-slate-100/50">
                <CardHeader className="p-6 border-b border-slate-100/60 bg-white">
                  <CardTitle className="flex items-center gap-3 text-lg font-black text-slate-800">
                    <div className="p-2 bg-primary/10 rounded-lg text-primary">
                      <MapPin className="h-5 w-5" />
                    </div>
                    التواصل والموقع
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6 space-y-6">
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2.5">
                      <Label htmlFor="phone" className="text-sm font-black text-slate-700">رقم الهاتف <span className="text-rose-500">*</span></Label>
                      <div className="relative">
                        <Phone className="absolute right-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                        <Input
                          id="phone"
                          value={form.phone}
                          onChange={(e) => setForm({ ...form, phone: e.target.value })}
                          placeholder="01012345678"
                          className={cn("h-12 rounded-xl bg-slate-50 border-slate-200 pr-10 pl-4 focus-visible:ring-primary font-bold", errors.phone && "border-rose-500 focus-visible:ring-rose-500")}
                          dir="ltr"
                        />
                      </div>
                      {errors.phone && <p className="text-xs text-rose-500 font-bold">{errors.phone}</p>}
                    </div>

                    <div className="space-y-2.5">
                      <Label htmlFor="email" className="text-sm font-black text-slate-700">البريد الإلكتروني <span className="text-slate-500 font-medium">(اختياري)</span></Label>
                      <div className="relative">
                        <Mail className="absolute right-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                        <Input
                          id="email"
                          type="email"
                          value={form.email}
                          onChange={(e) => setForm({ ...form, email: e.target.value })}
                          placeholder="contact@example.com"
                          className="h-12 rounded-xl bg-slate-50 border-slate-200 pr-10 pl-4 focus-visible:ring-primary font-bold"
                          dir="ltr"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2.5">
                    <Label htmlFor="website" className="text-sm font-black text-slate-700">الموقع الإلكتروني <span className="text-slate-500 font-medium">(اختياري)</span></Label>
                    <div className="relative">
                      <Globe className="absolute right-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                      <Input
                        id="website"
                        value={form.website}
                        onChange={(e) => setForm({ ...form, website: e.target.value })}
                        placeholder="https://www.example.com"
                        className="h-12 rounded-xl bg-slate-50 border-slate-200 pr-10 pl-4 focus-visible:ring-primary font-bold"
                        dir="ltr"
                      />
                    </div>
                  </div>

                  <div className="space-y-2.5 pt-4 border-t border-slate-100">
                    <Label htmlFor="address" className="text-sm font-black text-slate-700">العنوان بالتفصيل <span className="text-rose-500">*</span></Label>
                    <div className="relative">
                      <MapPin className="absolute right-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                      <Input
                        id="address"
                        value={form.address}
                        onChange={(e) => setForm({ ...form, address: e.target.value })}
                        placeholder="المحافظة، الحي، الشارع..."
                        className={cn("h-12 rounded-xl bg-slate-50 border-slate-200 pr-10 pl-4 focus-visible:ring-primary font-bold", errors.address && "border-rose-500 focus-visible:ring-rose-500")}
                      />
                    </div>
                    {errors.address && <p className="text-xs text-rose-500 font-bold">{errors.address}</p>}
                  </div>

                  <div className="space-y-2.5">
                    <Label htmlFor="locationLink" className="text-sm font-black text-slate-700">رابط الموقع (خرائط جوجل) <span className="text-slate-500 font-medium">(اختياري)</span></Label>
                    <div className="relative">
                      <MapPin className="absolute right-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                      <Input
                        id="locationLink"
                        value={form.locationLink}
                        onChange={(e) => setForm({ ...form, locationLink: e.target.value })}
                        placeholder="https://maps.google.com/..."
                        className="h-12 rounded-xl bg-slate-50 border-slate-200 pr-10 pl-4 focus-visible:ring-primary font-bold"
                        dir="ltr"
                      />
                    </div>
                  </div>

                </CardContent>
              </Card>

            </div>

            {/* Sidebar Form Area (Spans 1 column) */}
            <div className="space-y-8">
              
              {/* Media Card */}
              <Card className="border border-slate-100 shadow-sm rounded-xl bg-white overflow-hidden ring-1 ring-slate-100/50">
                <CardHeader className="bg-slate-50/50 py-2.5 px-4 border-b border-slate-100">
                  <CardTitle className="flex items-center gap-3 text-base font-black text-slate-800">
                    <div className="p-2 bg-primary/10 rounded-lg text-primary">
                      <ImagePlus className="h-4 w-4" />
                    </div>
                    الشعار <span className="text-slate-500 font-medium">(اختياري)</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="py-2.5 px-4 space-y-6">
                  
                  {form.logo ? (
                    <div className="flex justify-center">
                      <div className="relative h-32 w-32 rounded-lg overflow-hidden border border-slate-200 bg-slate-50 group">
                        <img
                          src={form.logo}
                          alt="الشعار"
                          className="w-full h-full object-contain p-2"
                        />
                        <div className="absolute inset-0 bg-black/50 opacity-100 flex items-center justify-center">
                          <button
                            type="button"
                            onClick={() => setForm({ ...form, logo: "" })}
                            className="w-8 h-8 bg-rose-500 text-white rounded-full flex items-center justify-center hover:bg-rose-600 transition-colors"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <div className="relative h-28 border-2 border-dashed border-slate-200 bg-slate-50 rounded-lg flex flex-col items-center justify-center hover:border-primary hover:bg-primary/5 transition-colors cursor-pointer group">
                        <Input
                          type="file"
                          accept="image/*"
                          onChange={handleFileUpload}
                          disabled={isUploading}
                          className="absolute inset-0 opacity-0 cursor-pointer z-10"
                        />
                        <ImagePlus className="h-6 w-6 text-slate-500 group-hover:text-primary mb-2 transition-colors" />
                        <span className="text-xs text-slate-500 font-bold group-hover:text-primary transition-colors">
                          {isUploading ? "جاري الرفع..." : "اضغط لرفع شعار المعرض"}
                        </span>
                      </div>
                    </div>
                  )}
                  
                  {!form.logo && (
                    <div className="space-y-3">
                      <Label className="text-xs font-black text-slate-500">أو إضافة برابط مباشر</Label>
                      <div className="flex gap-2">
                        <Input
                          value={newImageUrl}
                          onChange={(e) => setNewImageUrl(e.target.value)}
                          placeholder="https://..."
                          className="h-10 rounded-xl border-slate-200 bg-slate-50 px-4 font-bold text-sm"
                          onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addImageUrl())}
                          dir="ltr"
                        />
                        <Button type="button" onClick={addImageUrl} size="icon" className="h-10 w-10 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-700 shrink-0">
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  )}

                </CardContent>
              </Card>

              {/* Status Card */}
              <Card className="border border-slate-100 shadow-sm rounded-xl bg-white overflow-hidden ring-1 ring-slate-100/50">
                <CardHeader className="bg-slate-50/50 py-2.5 px-4 border-b border-slate-100">
                  <CardTitle className="flex items-center gap-3 text-base font-black text-slate-800">
                    <div className="p-2 bg-primary/10 rounded-lg text-primary">
                      <Tag className="h-4 w-4" />
                    </div>
                    إعدادات العرض
                  </CardTitle>
                </CardHeader>
                <CardContent className="py-2.5 px-4">
                  <div className="flex items-center gap-3 bg-primary/5 border border-primary/20 p-4 rounded-xl">
                    <input
                      id="featured"
                      type="checkbox"
                      checked={form.featured}
                      onChange={(e) => setForm({ ...form, featured: e.target.checked })}
                      className="h-5 w-5 rounded text-primary focus:ring-primary"
                    />
                    <Label htmlFor="featured" className="text-sm font-bold text-slate-900 cursor-pointer flex-1 leading-tight">
                      تمييز المعرض كشريك متميز
                    </Label>
                  </div>
                </CardContent>
              </Card>

            </div>
          </div>
          
          <div className="flex gap-4 pt-4 border-t border-slate-200 mt-8">
            <Button
              type="submit"
              disabled={createMutation.isPending || isUploading}
              className="flex-1 md:flex-[0_0_auto] h-14 bg-primary hover:bg-primary/90 text-white font-black rounded-xl shadow-lg shadow-primary/20 transition-all hover:scale-[1.02] active:scale-95 px-12 text-lg"
            >
              {createMutation.isPending ? "جاري التسجيل..." : "تسجيل المعرض"}
            </Button>
            <Button type="button" variant="outline" asChild className="flex-1 md:flex-[0_0_auto] h-14 border-slate-200 text-slate-600 hover:bg-slate-50 font-black rounded-xl px-12 text-lg">
              <Link href="/admin/showrooms">إلغاء الأمر</Link>
            </Button>
          </div>
        </form>
      </main>
    </div>
  )
}
