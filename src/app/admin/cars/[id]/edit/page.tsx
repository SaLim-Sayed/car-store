"use client"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Skeleton } from "@/components/ui/skeleton"
import { toast } from "sonner"
import { ArrowRight, Plus, X, Phone, MapPin, Store, Car, ImagePlus, Info, CheckCircle, Tag } from "lucide-react"
import { useShowrooms } from "@/hooks/useContent"
import { SITE_PHONE_DISPLAY } from "@/lib/phone"
import Link from "next/link"
import { RichTextEditor } from "@/components/rich-text-editor"
import { YearPicker } from "@/components/year-picker"
import { currentYear } from "@/lib/date-utils"
import { cn } from "@/lib/utils"
import { MultiImageUpload } from "@/components/multi-image-upload"

const FUEL_TYPES = ["بنزين", "كهرباء", "غاز طبيعي", "غاز", "سولار"] as const
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
  location: string
  phone: string
  description: string
  images: string[]
  features: string[]
  status: Status
  locationLink: string
  showroom: string
}

export default function EditCarPage() {
  const router = useRouter()
  const params = useParams()
  const carId = params.id as string
  const { data: showroomsRes } = useShowrooms()
  const showrooms = showroomsRes?.data || []

  const [loadingCar, setLoadingCar] = useState(true)
  const [isLoading, setIsLoading] = useState(false)
  const [newFeature, setNewFeature] = useState("")
  const [errors, setErrors] = useState<Partial<Record<keyof CarForm, string>>>({})
  const [isUploading, setIsUploading] = useState(false)

  const [form, setForm] = useState<CarForm>({
    brand: "",
    model: "",
    year: String(new Date().getFullYear()),
    price: "",
    fuelType: "بنزين",
    transmission: "أوتوماتيك",
    mileage: "",
    color: "",
    location: "مدينة المنيا. ميدان الحميات",
    phone: "",
    description: "",
    features: [],
    status: "متاح",
    locationLink: "",
    showroom: "",
    images: [],
  })

  useEffect(() => {
    const fetchCar = async () => {
      try {
        const res = await fetch(`/api/cars/${carId}`)
        const data = await res.json()
        if (data.success) {
          const c = data.data
          setForm({
            brand: c.brand,
            model: c.model,
            year: String(c.year),
            price: c.price ? String(c.price) : "",
            fuelType: c.fuelType,
            transmission: c.transmission,
            mileage: c.mileage !== undefined && c.mileage !== null ? String(c.mileage) : "",
            color: c.color,
            location: c.location ?? "مدينة المنيا. ميدان الحميات",
            phone: c.phone ?? "",
            description: c.description,
            images: c.images ?? [],
            features: c.features ?? [],
            status: c.status,
            locationLink: c.locationLink ?? "",
            showroom: c.showroom ?? "",
          })
        } else {
          toast.error("السيارة غير موجودة")
          router.push("/admin/cars")
        }
      } catch {
        toast.error("حدث خطأ في الاتصال")
        router.push("/admin/cars")
      } finally {
        setLoadingCar(false)
      }
    }
    if (carId) fetchCar()
  }, [carId, router])

  const set = (field: keyof CarForm, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }))
    setErrors((prev) => ({ ...prev, [field]: undefined }))
  }

  const onImagesChange = (images: string[]) => {
    setForm((prev) => ({ ...prev, images }))
    setErrors((prev) => ({ ...prev, images: undefined }))
  }

  const handleShowroomChange = (nextId: string) => {
    if (!nextId) {
      set("showroom", "")
      return
    }

    const sr = showrooms.find((s: any) => String(s._id) === String(nextId))

    setForm((prev) => ({
      ...prev,
      showroom: nextId,
      phone: sr?.phone ?? prev.phone,
      locationLink: sr?.locationLink ?? prev.locationLink,
    }))
    setErrors((prev) => ({ ...prev, showroom: undefined, phone: undefined, locationLink: undefined }))
  }

  const addFeature = () => {
    const f = newFeature.trim()
    if (!f) return
    setForm((prev) => ({ ...prev, features: [...prev.features, f] }))
    setNewFeature("")
  }

  const removeFeature = (idx: number) => {
    setForm((prev) => ({ ...prev, features: prev.features.filter((_, i) => i !== idx) }))
  }

  const validate = () => {
    const newErrors: Partial<Record<keyof CarForm, string>> = {}
    if (!form.brand) newErrors.brand = "مطلوب"
    if (!form.model) newErrors.model = "مطلوب"
    if (!form.year || isNaN(Number(form.year))) newErrors.year = "مطلوب"
    if (form.price && isNaN(Number(form.price))) newErrors.price = "يجب أن يكون رقماً"
    if (form.mileage && isNaN(Number(form.mileage))) newErrors.mileage = "يجب أن يكون رقماً"
    if (!form.color) newErrors.color = "مطلوب"
    if (!form.location?.trim()) newErrors.location = "مطلوب"
    if (!form.description || form.description.length < 10)
      newErrors.description = "يجب أن يكون 10 أحرف على الأقل"
    if (form.images.length === 0) newErrors.images = "صورة واحدة على الأقل مطلوبة"
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate()) {
      toast.error("يرجى مراجعة الحقول المطلوبة")
      return
    }

    setIsLoading(true)
    try {
      const payload = {
        ...form,
        year: Number(form.year),
        price: form.price ? Number(form.price) : null,
        mileage: form.mileage ? Number(form.mileage) : null,
        phone: form.phone.trim(),
        location: form.location.trim(),
        locationLink: form.locationLink.trim(),
        showroom: form.showroom || undefined,
      }

      const res = await fetch(`/api/cars/${carId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })

      const data = await res.json()

      if (data.success) {
        toast.success("تم تحديث السيارة بنجاح")
        router.push("/admin/cars")
      } else {
        toast.error(data.error || "فشل في تحديث السيارة")
      }
    } catch {
      toast.error("حدث خطأ في الاتصال")
    } finally {
      setIsLoading(false)
    }
  }

  if (loadingCar) {
    return (
      <div className="min-h-screen bg-[#F8FAFC]">
        <main className="container mx-auto px-4 py-8 max-w-5xl space-y-8">
          <Skeleton className="h-12 w-64 rounded-xl" />
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <Skeleton className="h-[600px] w-full rounded-xl lg:col-span-2" />
            <Skeleton className="h-[600px] w-full rounded-xl" />
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <main className="container mx-auto px-4 py-8 max-w-5xl">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-8 border-b border-slate-200">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2 text-slate-500 mb-2 font-bold text-sm">
              <Link href="/admin/cars" className="hover:text-primary transition-colors">السيارات</Link>
              <ArrowRight className="h-3 w-3" />
              <span className="text-slate-800">تعديل بيانات {form.brand} {form.model}</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-slate-900 tracking-tight">تحديث البيانات</h1>
            <p className="text-sm md:text-base text-slate-500 font-bold max-w-2xl">
              تعديل تفاصيل السيارة. الحقول المطلوبة مميزة بعلامة <span className="text-rose-500">*</span>
            </p>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <Button variant="outline" asChild className="h-11 border-slate-200 text-slate-600 font-black rounded-xl hover:bg-slate-50 px-6">
              <Link href="/admin/cars">إلغاء الأمر</Link>
            </Button>
            <Button onClick={onSubmit} disabled={isLoading} className="h-11 bg-primary hover:bg-primary/90 text-white font-black rounded-xl shadow-lg shadow-primary/20 transition-all hover:scale-105 active:scale-95 px-8">
              {isLoading ? "جاري الحفظ..." : "حفظ التحديثات"}
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
                      <Car className="h-5 w-5" />
                    </div>
                    المواصفات الأساسية
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6 space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2.5">
                      <Label htmlFor="brand" className="text-sm font-black text-slate-700">العلامة التجارية <span className="text-rose-500">*</span></Label>
                      <Input
                        id="brand"
                        value={form.brand}
                        onChange={(e) => set("brand", e.target.value)}
                        placeholder="مثال: مرسيدس، بي إم دبليو"
                        className={cn("h-12 rounded-xl bg-slate-50 border-slate-200 focus-visible:ring-primary font-bold", errors.brand && "border-rose-500 focus-visible:ring-rose-500")}
                      />
                      {errors.brand && <p className="text-xs text-rose-500 font-bold">{errors.brand}</p>}
                    </div>
                    <div className="space-y-2.5">
                      <Label htmlFor="model" className="text-sm font-black text-slate-700">الموديل <span className="text-rose-500">*</span></Label>
                      <Input
                        id="model"
                        value={form.model}
                        onChange={(e) => set("model", e.target.value)}
                        placeholder="مثال: C200, X5"
                        className={cn("h-12 rounded-xl bg-slate-50 border-slate-200 focus-visible:ring-primary font-bold", errors.model && "border-rose-500 focus-visible:ring-rose-500")}
                      />
                      {errors.model && <p className="text-xs text-rose-500 font-bold">{errors.model}</p>}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2.5">
                      <Label htmlFor="year" className="text-sm font-black text-slate-700">سنة الصنع <span className="text-rose-500">*</span></Label>
                      <YearPicker
                        id="year"
                        label=""
                        value={form.year}
                        onChange={(year) => set("year", year)}
                        error={errors.year}
                        required
                        endYear={currentYear() + 1}
                        selectClassName="rounded-xl h-12 bg-slate-50 border-slate-200"
                      />
                    </div>
                    <div className="space-y-2.5">
                      <Label htmlFor="price" className="text-sm font-black text-slate-700">السعر (ج.م) <span className="text-slate-500 font-medium">(اختياري)</span></Label>
                      <Input
                        id="price"
                        type="number"
                        min={0}
                        value={form.price}
                        onChange={(e) => set("price", e.target.value)}
                        placeholder="1,250,000"
                        className={cn("h-12 rounded-xl bg-slate-50 border-slate-200 focus-visible:ring-primary font-bold", errors.price && "border-rose-500 focus-visible:ring-rose-500")}
                      />
                      {errors.price && <p className="text-xs text-rose-500 font-bold">{errors.price}</p>}
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2.5">
                      <Label htmlFor="mileage" className="text-sm font-black text-slate-700">المسافة (كم) <span className="text-slate-500 font-medium">(اختياري)</span></Label>
                      <Input
                        id="mileage"
                        type="number"
                        min={0}
                        value={form.mileage}
                        onChange={(e) => set("mileage", e.target.value)}
                        placeholder="0"
                        className={cn("h-12 rounded-xl bg-slate-50 border-slate-200 focus-visible:ring-primary font-bold", errors.mileage && "border-rose-500 focus-visible:ring-rose-500")}
                      />
                      {errors.mileage && <p className="text-xs text-rose-500 font-bold">{errors.mileage}</p>}
                    </div>
                    <div className="space-y-2.5">
                      <Label htmlFor="color" className="text-sm font-black text-slate-700">اللون <span className="text-rose-500">*</span></Label>
                      <Input
                        id="color"
                        value={form.color}
                        onChange={(e) => set("color", e.target.value)}
                        placeholder="مثال: أسود ميتاليك"
                        className={cn("h-12 rounded-xl bg-slate-50 border-slate-200 focus-visible:ring-primary font-bold", errors.color && "border-rose-500 focus-visible:ring-rose-500")}
                      />
                      {errors.color && <p className="text-xs text-rose-500 font-bold">{errors.color}</p>}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2.5">
                      <Label htmlFor="fuelType" className="text-sm font-black text-slate-700">نوع الوقود <span className="text-rose-500">*</span></Label>
                      <select
                        id="fuelType"
                        value={form.fuelType}
                        onChange={(e) => set("fuelType", e.target.value)}
                        className="flex h-12 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-bold focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-primary transition-colors"
                      >
                        {FUEL_TYPES.map((f) => (
                          <option key={f} value={f}>{f}</option>
                        ))}
                      </select>
                    </div>
                    <div className="space-y-2.5">
                      <Label htmlFor="transmission" className="text-sm font-black text-slate-700">ناقل الحركة <span className="text-rose-500">*</span></Label>
                      <select
                        id="transmission"
                        value={form.transmission}
                        onChange={(e) => set("transmission", e.target.value)}
                        className="flex h-12 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-bold focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-primary transition-colors"
                      >
                        {TRANSMISSIONS.map((t) => (
                          <option key={t} value={t}>{t}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Description Card */}
              <Card className="border border-slate-100 shadow-sm rounded-xl bg-white overflow-hidden ring-1 ring-slate-100/50">
                <CardHeader className="p-6 border-b border-slate-100/60 bg-white">
                  <CardTitle className="flex items-center gap-3 text-lg font-black text-slate-800">
                    <div className="p-2 bg-primary/10 rounded-lg text-primary">
                      <Info className="h-5 w-5" />
                    </div>
                    التفاصيل والمميزات
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6 space-y-6">
                  <div className="space-y-2.5">
                    <Label htmlFor="description" className="text-sm font-black text-slate-700">الوصف التفصيلي <span className="text-rose-500">*</span></Label>
                    <div className="rounded-xl border border-slate-200 overflow-hidden bg-slate-50">
                      <RichTextEditor
                        value={form.description}
                        onChange={(val) => set("description", val)}
                        placeholder="اكتب وصفاً جذاباً للسيارة يوضح حالتها ومميزاتها..."
                      />
                    </div>
                    {errors.description && (
                      <p className="text-xs text-rose-500 font-bold">{errors.description}</p>
                    )}
                  </div>
                  
                  <div className="space-y-4 pt-4 border-t border-slate-100">
                    <Label className="text-sm font-black text-slate-700">مميزات إضافية</Label>
                    <div className="flex gap-3">
                      <Input
                        value={newFeature}
                        onChange={(e) => setNewFeature(e.target.value)}
                        placeholder="مثال: بصمة، فتحة سقف، حساسات، كاميرا 360..."
                        className="h-12 rounded-xl border-slate-200 bg-slate-50 focus-visible:ring-primary font-bold"
                        onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addFeature())}
                      />
                      <Button type="button" onClick={addFeature} className="h-12 px-6 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-black">
                        إضافة
                      </Button>
                    </div>
                    {form.features.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {form.features.map((f, idx) => (
                          <div
                            key={idx}
                            className="inline-flex items-center gap-1.5 bg-indigo-50 text-indigo-700 border border-indigo-100 px-3 py-1.5 rounded-lg text-sm font-bold shadow-sm"
                          >
                            <CheckCircle className="h-3.5 w-3.5" />
                            {f}
                            <button
                              type="button"
                              onClick={() => removeFeature(idx)}
                              className="mr-1 hover:text-indigo-900 transition-colors"
                            >
                              <X className="h-4 w-4" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
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
                    الصور <span className="text-rose-500">*</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="py-2.5 px-4">
                  <MultiImageUpload
                    value={form.images}
                    onChange={onImagesChange}
                    error={errors.images}
                    onUploadingChange={setIsUploading}
                    max={12}
                    label="الصور"
                  />
                </CardContent>
              </Card>

              {/* Status Card */}
              <Card className="border border-slate-100 shadow-sm rounded-xl bg-white overflow-hidden ring-1 ring-slate-100/50">
                <CardHeader className="bg-slate-50/50 py-2.5 px-4 border-b border-slate-100">
                  <CardTitle className="flex items-center gap-3 text-base font-black text-slate-800">
                    <div className="p-2 bg-primary/10 rounded-lg text-primary">
                      <Tag className="h-4 w-4" />
                    </div>
                    الحالة
                  </CardTitle>
                </CardHeader>
                <CardContent className="py-2.5 px-4">
                  <select
                    id="status"
                    value={form.status}
                    onChange={(e) => set("status", e.target.value as Status)}
                    className="flex h-12 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-bold focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-primary transition-colors"
                  >
                    {STATUSES.map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </CardContent>
              </Card>

              {/* Contact & Location Card */}
              <Card className="border border-slate-100 shadow-sm rounded-xl bg-white overflow-hidden ring-1 ring-slate-100/50">
                <CardHeader className="bg-slate-50/50 py-2.5 px-4 border-b border-slate-100">
                  <CardTitle className="flex items-center gap-3 text-base font-black text-slate-800">
                    <div className="p-2 bg-rose-500/10 rounded-lg text-rose-600">
                      <MapPin className="h-4 w-4" />
                    </div>
                    الموقع والتواصل
                  </CardTitle>
                </CardHeader>
                <CardContent className="py-2.5 px-4 space-y-5">
                  <div className="space-y-2.5">
                    <Label htmlFor="showroom" className="text-sm font-black text-slate-700">المعرض المنتمي إليه</Label>
                    <div className="relative">
                      <Store className="absolute right-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                      <select
                        id="showroom"
                        value={form.showroom}
                        onChange={(e) => handleShowroomChange(e.target.value)}
                        className="flex h-12 w-full rounded-xl border border-slate-200 bg-slate-50 pr-10 pl-4 py-2 text-sm font-bold focus:border-rose-500 focus:outline-none focus:ring-1 focus:ring-rose-500 transition-colors appearance-none"
                      >
                        <option value="">لا ينتمي لمعرض</option>
                        {showrooms.map((s: any) => (
                          <option key={s._id} value={s._id}>{s.name}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="space-y-2.5">
                    <Label htmlFor="phone" className="text-sm font-black text-slate-700">رقم الهاتف</Label>
                    <div className="relative">
                      <Phone className="absolute right-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                      <Input
                        id="phone"
                        type="tel"
                        value={form.phone}
                        onChange={(e) => set("phone", e.target.value)}
                        placeholder="01012345678"
                        className="h-12 rounded-xl border-slate-200 bg-slate-50 pr-10 pl-4 font-bold text-sm focus-visible:ring-rose-500"
                        dir="ltr"
                      />
                    </div>
                    <p className="text-[10px] text-slate-500 font-bold leading-relaxed">
                      إذا تركته فارغاً، سيعرض رقم المنصة ({SITE_PHONE_DISPLAY})
                    </p>
                  </div>

                  <div className="space-y-2.5">
                    <Label htmlFor="location" className="text-sm font-black text-slate-700">
                      العنوان / المنطقة <span className="text-rose-500">*</span>
                    </Label>
                    <div className="relative">
                      <MapPin className="absolute right-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                      <Input
                        id="location"
                        value={form.location}
                        onChange={(e) => set("location", e.target.value)}
                        placeholder="مثال: مدينة المنيا. ميدان الحميات"
                        className={cn(
                          "h-12 rounded-xl border-slate-200 bg-slate-50 pr-10 pl-4 font-bold text-sm focus-visible:ring-rose-500",
                          errors.location && "border-rose-500 focus-visible:ring-rose-500",
                        )}
                      />
                    </div>
                    {errors.location && <p className="text-xs text-rose-500 font-bold">{errors.location}</p>}
                  </div>

                  <div className="space-y-2.5">
                    <Label htmlFor="locationLink" className="text-sm font-black text-slate-700">رابط الموقع (خرائط جوجل)</Label>
                    <div className="relative">
                      <MapPin className="absolute right-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                      <Input
                        id="locationLink"
                        value={form.locationLink}
                        onChange={(e) => set("locationLink", e.target.value)}
                        placeholder="https://maps.google.com/..."
                        className="h-12 rounded-xl border-slate-200 bg-slate-50 pr-10 pl-4 font-bold text-sm focus-visible:ring-rose-500"
                        dir="ltr"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

            </div>
          </div>
          
          <div className="flex gap-4 pt-4 border-t border-slate-200 mt-8">
            <Button type="submit" disabled={isLoading} className="flex-1 md:flex-[0_0_auto] h-14 bg-primary hover:bg-primary/90 text-white font-black rounded-xl shadow-lg shadow-primary/20 transition-all hover:scale-[1.02] active:scale-95 px-12 text-lg">
              {isLoading ? "جاري الحفظ..." : "حفظ التحديثات"}
            </Button>
            <Button type="button" variant="outline" asChild className="flex-1 md:flex-[0_0_auto] h-14 border-slate-200 text-slate-600 hover:bg-slate-50 font-black rounded-xl px-12 text-lg">
              <Link href="/admin/cars">إلغاء الأمر</Link>
            </Button>
          </div>
        </form>
      </main>
    </div>
  )
}
