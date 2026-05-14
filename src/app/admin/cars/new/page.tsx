"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Navbar } from "@/components/navbar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"
import { ArrowRight, Plus, X } from "lucide-react"
import Link from "next/link"
import { RichTextEditor } from "@/components/rich-text-editor"

const FUEL_TYPES = ["بنزين", "ديزل", "كهرباء", "هايبرد"] as const
const TRANSMISSIONS = ["يدوي", "أوتوماتيك"] as const
const STATUSES = ["متاح", "مباع", "محجوز"] as const

type FuelType = (typeof FUEL_TYPES)[number]
type Transmission = (typeof TRANSMISSIONS)[number]
type Status = (typeof STATUSES)[number]

interface CarForm {
  brand: string
  model: string
  year: string
  price: string
  fuelType: FuelType
  transmission: Transmission
  mileage: string
  color: string
  description: string
  images: string[]
  features: string[]
  status: Status
}

export default function NewCarPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [newImage, setNewImage] = useState("")
  const [newFeature, setNewFeature] = useState("")

  const [form, setForm] = useState<CarForm>({
    brand: "",
    model: "",
    year: String(new Date().getFullYear()),
    price: "",
    fuelType: "بنزين",
    transmission: "أوتوماتيك",
    mileage: "",
    color: "",
    description: "",
    images: [],
    features: [],
    status: "متاح",
  })

  const [errors, setErrors] = useState<Partial<Record<keyof CarForm, string>>>({})
  const [isUploading, setIsUploading] = useState(false)

  const set = (field: keyof CarForm, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }))
    setErrors((prev) => ({ ...prev, [field]: undefined }))
  }

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
        setForm((prev) => ({ ...prev, images: [...prev.images, data.url] }))
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

  const addImage = () => {
    const url = newImage.trim()
    if (!url) return
    setForm((prev) => ({ ...prev, images: [...prev.images, url] }))
    setNewImage("")
  }

  const removeImage = (idx: number) => {
    setForm((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== idx),
    }))
  }

  const addFeature = () => {
    const f = newFeature.trim()
    if (!f) return
    setForm((prev) => ({ ...prev, features: [...prev.features, f] }))
    setNewFeature("")
  }

  const removeFeature = (idx: number) => {
    setForm((prev) => ({
      ...prev,
      features: prev.features.filter((_, i) => i !== idx),
    }))
  }

  const validate = () => {
    const newErrors: Partial<Record<keyof CarForm, string>> = {}
    if (!form.brand) newErrors.brand = "العلامة التجارية مطلوبة"
    if (!form.model) newErrors.model = "الموديل مطلوب"
    if (!form.year || isNaN(Number(form.year))) newErrors.year = "السنة مطلوبة"
    if (!form.price || isNaN(Number(form.price))) newErrors.price = "السعر مطلوب"
    if (!form.mileage || isNaN(Number(form.mileage))) newErrors.mileage = "المسافة مطلوبة"
    if (!form.color) newErrors.color = "اللون مطلوب"
    if (!form.description || form.description.length < 10)
      newErrors.description = "الوصف يجب أن يكون 10 أحرف على الأقل"
    if (form.images.length === 0) newErrors.images = "صورة واحدة على الأقل مطلوبة"
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate()) return

    setIsLoading(true)
    try {
      const payload = {
        ...form,
        year: Number(form.year),
        price: Number(form.price),
        mileage: Number(form.mileage),
      }

      const res = await fetch("/api/cars", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })

      const data = await res.json()

      if (data.success) {
        toast.success("تمت إضافة السيارة بنجاح")
        router.push("/admin/cars")
      } else {
        toast.error(data.error || "فشل في إضافة السيارة")
      }
    } catch {
      toast.error("حدث خطأ في الاتصال")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#F9F6F1]">
      <Navbar />

      <main className="container mx-auto px-4 py-24 max-w-4xl">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 mb-12">
          <div className="space-y-4">
             <Button variant="ghost" size="sm" asChild className="rounded-full hover:bg-white -mr-4">
              <Link href="/admin/cars" className="flex items-center text-muted-foreground hover:text-primary font-black">
                <ArrowRight className="h-4 w-4 ml-2" />
                قائمة السيارات
              </Link>
            </Button>
            <h1 className="text-5xl font-[1000] tracking-tighter">إضافة سيارة</h1>
            <p className="text-muted-foreground text-xl font-medium">أدخل تفاصيل السيارة الجديدة بدقة</p>
            <div className="h-1.5 w-24 bg-primary rounded-full" />
          </div>
        </div>

        <form onSubmit={onSubmit} className="space-y-12">
          {/* Basic Info */}
          <Card className="border-0 shadow-2xl rounded-[2.5rem] bg-white overflow-hidden">
            <CardHeader className="p-8 pb-0">
              <CardTitle className="text-2xl font-black">المواصفات الأساسية</CardTitle>
            </CardHeader>
            <CardContent className="p-8 space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-3">
                  <Label htmlFor="brand" className="text-lg font-black">العلامة التجارية *</Label>
                  <Input
                    id="brand"
                    value={form.brand}
                    onChange={(e) => set("brand", e.target.value)}
                    placeholder="مثال: مرسيدس، بي إم دبليو"
                    className={`h-14 rounded-2xl border-2 px-6 font-bold ${errors.brand ? "border-red-500" : "border-gray-50 focus:border-primary"}`}
                  />
                  {errors.brand && <p className="text-sm text-red-500 font-bold">{errors.brand}</p>}
                </div>
                <div className="space-y-3">
                  <Label htmlFor="model" className="text-lg font-black">الموديل *</Label>
                  <Input
                    id="model"
                    value={form.model}
                    onChange={(e) => set("model", e.target.value)}
                    placeholder="مثال: C200, X5"
                    className={`h-14 rounded-2xl border-2 px-6 font-bold ${errors.model ? "border-red-500" : "border-gray-50 focus:border-primary"}`}
                  />
                  {errors.model && <p className="text-sm text-red-500 font-bold">{errors.model}</p>}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="space-y-3">
                  <Label htmlFor="year" className="text-lg font-black">سنة الصنع *</Label>
                  <Input
                    id="year"
                    type="number"
                    min={1900}
                    max={new Date().getFullYear() + 1}
                    value={form.year}
                    onChange={(e) => set("year", e.target.value)}
                    className={`h-14 rounded-2xl border-2 px-6 font-bold ${errors.year ? "border-red-500" : "border-gray-50 focus:border-primary"}`}
                  />
                  {errors.year && <p className="text-sm text-red-500 font-bold">{errors.year}</p>}
                </div>
                <div className="space-y-3">
                  <Label htmlFor="price" className="text-lg font-black">السعر (ج.م) *</Label>
                  <Input
                    id="price"
                    type="number"
                    min={0}
                    value={form.price}
                    onChange={(e) => set("price", e.target.value)}
                    placeholder="1,250,000"
                    className={`h-14 rounded-2xl border-2 px-6 font-bold ${errors.price ? "border-red-500" : "border-gray-50 focus:border-primary"}`}
                  />
                  {errors.price && <p className="text-sm text-red-500 font-bold">{errors.price}</p>}
                </div>
                <div className="space-y-3">
                  <Label htmlFor="mileage" className="text-lg font-black">المسافة (كم) *</Label>
                  <Input
                    id="mileage"
                    type="number"
                    min={0}
                    value={form.mileage}
                    onChange={(e) => set("mileage", e.target.value)}
                    placeholder="0"
                    className={`h-14 rounded-2xl border-2 px-6 font-bold ${errors.mileage ? "border-red-500" : "border-gray-50 focus:border-primary"}`}
                  />
                  {errors.mileage && <p className="text-sm text-red-500 font-bold">{errors.mileage}</p>}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="space-y-3">
                  <Label htmlFor="fuelType" className="text-lg font-black">نوع الوقود *</Label>
                  <select
                    id="fuelType"
                    value={form.fuelType}
                    onChange={(e) => set("fuelType", e.target.value)}
                    className="flex h-14 w-full rounded-2xl border-2 border-gray-50 bg-white px-6 py-2 text-lg font-bold focus:border-primary focus:outline-none transition-colors"
                  >
                    {FUEL_TYPES.map((f) => (
                      <option key={f} value={f}>{f}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-3">
                  <Label htmlFor="transmission" className="text-lg font-black">ناقل الحركة *</Label>
                  <select
                    id="transmission"
                    value={form.transmission}
                    onChange={(e) => set("transmission", e.target.value)}
                    className="flex h-14 w-full rounded-2xl border-2 border-gray-50 bg-white px-6 py-2 text-lg font-bold focus:border-primary focus:outline-none transition-colors"
                  >
                    {TRANSMISSIONS.map((t) => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-3">
                  <Label htmlFor="color" className="text-lg font-black">اللون *</Label>
                  <Input
                    id="color"
                    value={form.color}
                    onChange={(e) => set("color", e.target.value)}
                    placeholder="مثال: أسود ميتاليك"
                    className={`h-14 rounded-2xl border-2 px-6 font-bold ${errors.color ? "border-red-500" : "border-gray-50 focus:border-primary"}`}
                  />
                  {errors.color && <p className="text-sm text-red-500 font-bold">{errors.color}</p>}
                </div>
              </div>

              <div className="space-y-3">
                <Label htmlFor="status" className="text-lg font-black">الحالة المعروضة *</Label>
                <select
                  id="status"
                  value={form.status}
                  onChange={(e) => set("status", e.target.value)}
                  className="flex h-14 w-full rounded-2xl border-2 border-gray-50 bg-white px-6 py-2 text-lg font-bold focus:border-primary focus:outline-none transition-colors"
                >
                  {STATUSES.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-3">
                <Label htmlFor="description" className="text-lg font-black">الوصف التفصيلي *</Label>
                <div className="rounded-2xl border-2 border-gray-50 overflow-hidden">
                  <RichTextEditor
                    value={form.description}
                    onChange={(val) => set("description", val)}
                    placeholder="اكتب وصفاً جذاباً للسيارة..."
                  />
                </div>
                {errors.description && (
                  <p className="text-sm text-red-500 font-bold">{errors.description}</p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Images */}
          <Card className="border-0 shadow-2xl rounded-[2.5rem] bg-white overflow-hidden">
            <CardHeader className="p-8 pb-0">
              <CardTitle className="text-2xl font-black">معرض الصور</CardTitle>
            </CardHeader>
            <CardContent className="p-8 space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                <div className="space-y-4">
                  <Label className="text-lg font-black">رفع صور من جهازك</Label>
                  <div className="relative h-40 border-4 border-dashed border-gray-100 rounded-[2rem] flex flex-col items-center justify-center hover:border-primary transition-colors cursor-pointer group">
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={handleFileUpload}
                      disabled={isUploading}
                      className="absolute inset-0 opacity-0 cursor-pointer z-10"
                    />
                    <Plus className="h-10 w-10 text-muted-foreground group-hover:text-primary mb-2 transition-colors" />
                    <span className="text-muted-foreground font-black group-hover:text-primary transition-colors">
                      {isUploading ? "جاري الرفع..." : "اختر ملفات"}
                    </span>
                  </div>
                </div>

                <div className="space-y-4">
                  <Label className="text-lg font-black">إضافة برابط مباشر</Label>
                  <div className="flex gap-4">
                    <Input
                      value={newImage}
                      onChange={(e) => setNewImage(e.target.value)}
                      placeholder="https://example.com/image.jpg"
                      className="h-14 rounded-2xl border-2 border-gray-50 px-6 font-bold"
                      onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addImage())}
                    />
                    <Button type="button" onClick={addImage} className="h-14 w-14 rounded-2xl shadow-lg">
                      <Plus className="h-6 w-6" />
                    </Button>
                  </div>
                </div>
              </div>

              {errors.images && (
                <p className="text-sm text-red-500 font-bold">{errors.images}</p>
              )}
              
              {form.images.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                  {form.images.map((img, idx) => (
                    <div key={idx} className="relative aspect-square group rounded-3xl overflow-hidden shadow-lg border-4 border-white">
                      <img
                        src={img}
                        alt={`صورة ${idx + 1}`}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <button
                          type="button"
                          onClick={() => removeImage(idx)}
                          className="w-12 h-12 bg-white text-destructive rounded-full flex items-center justify-center shadow-xl hover:scale-110 transition-transform"
                        >
                          <X className="h-6 w-6" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Features */}
          <Card className="border-0 shadow-2xl rounded-[2.5rem] bg-white overflow-hidden">
            <CardHeader className="p-8 pb-0">
              <CardTitle className="text-2xl font-black">مميزات إضافية</CardTitle>
            </CardHeader>
            <CardContent className="p-8 space-y-6">
              <div className="flex gap-4">
                <Input
                  value={newFeature}
                  onChange={(e) => setNewFeature(e.target.value)}
                  placeholder="مثال: بصمة، فتحة سقف، حساسات..."
                  className="h-14 rounded-2xl border-2 border-gray-50 px-6 font-bold"
                  onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addFeature())}
                />
                <Button type="button" onClick={addFeature} className="h-14 px-8 rounded-2xl shadow-lg">
                  إضافة
                </Button>
              </div>
              {form.features.length > 0 && (
                <div className="flex flex-wrap gap-3">
                  {form.features.map((f, idx) => (
                    <div
                      key={idx}
                      className="inline-flex items-center gap-2 bg-[#1A1A1A] text-white px-5 py-2.5 rounded-2xl text-lg font-black shadow-lg"
                    >
                      {f}
                      <button
                        type="button"
                        onClick={() => removeFeature(idx)}
                        className="hover:text-red-400 transition-colors"
                      >
                        <X className="h-5 w-5" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          <div className="flex gap-4 pt-8">
            <Button type="button" variant="outline" asChild className="flex-1 h-16 rounded-2xl text-xl font-black border-2">
              <Link href="/admin/cars">إلغاء</Link>
            </Button>
            <Button type="submit" disabled={isLoading} className="flex-[2] h-16 rounded-2xl text-xl font-black shadow-xl shadow-primary/20">
              {isLoading ? "جاري الإضافة..." : "إضافة السيارة"}
            </Button>
          </div>
        </form>
      </main>
    </div>
  )
}
