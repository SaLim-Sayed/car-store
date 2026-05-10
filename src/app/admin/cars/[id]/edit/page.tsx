"use client"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import { Navbar } from "@/components/navbar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Skeleton } from "@/components/ui/skeleton"
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

export default function EditCarPage() {
  const router = useRouter()
  const params = useParams()
  const carId = params.id as string

  const [loadingCar, setLoadingCar] = useState(true)
  const [isLoading, setIsLoading] = useState(false)
  const [newImage, setNewImage] = useState("")
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
    description: "",
    images: [],
    features: [],
    status: "متاح",
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
            price: String(c.price),
            fuelType: c.fuelType,
            transmission: c.transmission,
            mileage: String(c.mileage),
            color: c.color,
            description: c.description,
            images: c.images ?? [],
            features: c.features ?? [],
            status: c.status,
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
      // Reset input
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
    setForm((prev) => ({ ...prev, images: prev.images.filter((_, i) => i !== idx) }))
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
      <div className="min-h-screen">
        <Navbar />
        <main className="container mx-auto px-4 py-8 max-w-3xl space-y-6">
          <Skeleton className="h-10 w-48" />
          <Skeleton className="h-96 w-full" />
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      <Navbar />

      <main className="container mx-auto px-4 py-8 max-w-3xl">
        <div className="flex items-center gap-3 mb-8">
          <Button variant="outline" size="sm" asChild>
            <Link href="/admin/cars">
              <ArrowRight className="h-4 w-4 ml-1" />
              رجوع
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold">تعديل السيارة</h1>
            <p className="text-muted-foreground">قم بتحديث تفاصيل السيارة</p>
          </div>
        </div>

        <form onSubmit={onSubmit} className="space-y-6">
          {/* Basic Info */}
          <Card>
            <CardHeader>
              <CardTitle>المعلومات الأساسية</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="brand">العلامة التجارية *</Label>
                  <Input
                    id="brand"
                    value={form.brand}
                    onChange={(e) => set("brand", e.target.value)}
                    className={errors.brand ? "border-red-500" : ""}
                  />
                  {errors.brand && <p className="text-sm text-red-500">{errors.brand}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="model">الموديل *</Label>
                  <Input
                    id="model"
                    value={form.model}
                    onChange={(e) => set("model", e.target.value)}
                    className={errors.model ? "border-red-500" : ""}
                  />
                  {errors.model && <p className="text-sm text-red-500">{errors.model}</p>}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="year">سنة الصنع *</Label>
                  <Input
                    id="year"
                    type="number"
                    min={1900}
                    max={new Date().getFullYear() + 1}
                    value={form.year}
                    onChange={(e) => set("year", e.target.value)}
                    className={errors.year ? "border-red-500" : ""}
                  />
                  {errors.year && <p className="text-sm text-red-500">{errors.year}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="price">السعر (ج.م) *</Label>
                  <Input
                    id="price"
                    type="number"
                    min={0}
                    value={form.price}
                    onChange={(e) => set("price", e.target.value)}
                    className={errors.price ? "border-red-500" : ""}
                  />
                  {errors.price && <p className="text-sm text-red-500">{errors.price}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="mileage">المسافة المقطوعة (كم) *</Label>
                  <Input
                    id="mileage"
                    type="number"
                    min={0}
                    value={form.mileage}
                    onChange={(e) => set("mileage", e.target.value)}
                    className={errors.mileage ? "border-red-500" : ""}
                  />
                  {errors.mileage && <p className="text-sm text-red-500">{errors.mileage}</p>}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="fuelType">نوع الوقود *</Label>
                  <select
                    id="fuelType"
                    value={form.fuelType}
                    onChange={(e) => set("fuelType", e.target.value)}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    {FUEL_TYPES.map((f) => (
                      <option key={f} value={f}>{f}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="transmission">ناقل الحركة *</Label>
                  <select
                    id="transmission"
                    value={form.transmission}
                    onChange={(e) => set("transmission", e.target.value)}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    {TRANSMISSIONS.map((t) => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="color">اللون *</Label>
                  <Input
                    id="color"
                    value={form.color}
                    onChange={(e) => set("color", e.target.value)}
                    className={errors.color ? "border-red-500" : ""}
                  />
                  {errors.color && <p className="text-sm text-red-500">{errors.color}</p>}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="status">الحالة *</Label>
                <select
                  id="status"
                  value={form.status}
                  onChange={(e) => set("status", e.target.value)}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  {STATUSES.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">الوصف *</Label>
                <RichTextEditor
                  value={form.description}
                  onChange={(val) => set("description", val)}
                  placeholder="وصف تفصيلي للسيارة..."
                />
                {errors.description && (
                  <p className="text-sm text-red-500">{errors.description}</p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Images */}
          <Card>
            <CardHeader>
              <CardTitle>الصور *</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>رفع من الجهاز</Label>
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    disabled={isUploading}
                    className="cursor-pointer"
                  />
                  {isUploading && (
                    <p className="text-sm text-primary animate-pulse">جاري رفع الصورة...</p>
                  )}
                </div>

                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-background px-2 text-muted-foreground">أو</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>رابط الصورة (URL)</Label>
                  <div className="flex gap-2">
                    <Input
                      value={newImage}
                      onChange={(e) => setNewImage(e.target.value)}
                      placeholder="https://example.com/image.jpg"
                      onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addImage())}
                    />
                    <Button type="button" onClick={addImage} variant="outline" size="icon">
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>

              {errors.images && (
                <p className="text-sm text-red-500">{errors.images}</p>
              )}
              {form.images.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {form.images.map((img, idx) => (
                    <div key={idx} className="relative group">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={img}
                        alt={`صورة ${idx + 1}`}
                        className="w-full h-28 object-cover rounded border"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(idx)}
                        className="absolute top-1 left-1 bg-red-500 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Features */}
          <Card>
            <CardHeader>
              <CardTitle>المميزات (اختياري)</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Input
                  value={newFeature}
                  onChange={(e) => setNewFeature(e.target.value)}
                  placeholder="مثال: نظام تثبيت السرعة"
                  onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addFeature())}
                />
                <Button type="button" onClick={addFeature} variant="outline">
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              {form.features.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {form.features.map((f, idx) => (
                    <span
                      key={idx}
                      className="inline-flex items-center gap-1 bg-muted px-3 py-1 rounded-full text-sm"
                    >
                      {f}
                      <button
                        type="button"
                        onClick={() => removeFeature(idx)}
                        className="text-muted-foreground hover:text-red-500"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          <div className="flex gap-4 justify-end">
            <Button type="button" variant="outline" asChild>
              <Link href="/admin/cars">إلغاء</Link>
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "جاري التحديث..." : "حفظ التغييرات"}
            </Button>
          </div>
        </form>
      </main>
    </div>
  )
}
