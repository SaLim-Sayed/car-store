"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { MultiImageUpload } from "@/components/multi-image-upload"
import { YearPicker } from "@/components/year-picker"
import { currentYear } from "@/lib/date-utils"
import { toast } from "sonner"
import { Plus, X, Phone, Tractor, ImagePlus, Info, Settings, MapPin, CheckCircle, Tag } from "lucide-react"
import { SITE_PHONE_DISPLAY } from "@/lib/phone"
import { RichTextEditor } from "@/components/rich-text-editor"
import { cn } from "@/lib/utils"

const CATEGORIES = ["جرار", "حفار", "شاحنة", "معدة زراعية", "معدة بناء", "موتوسيكل", "توك توك", "تروسيكل", "أخرى"] as const
const CONDITIONS = ["جديد", "مستعمل"] as const
const STATUSES = ["متاح", "مباع", "محجوز"] as const

export interface EquipmentFormData {
  title: string
  brand: string
  model: string
  year: string
  price: string
  category: (typeof CATEGORIES)[number]
  condition: (typeof CONDITIONS)[number]
  hours: string
  location: string
  phone: string
  description: string
  images: string[]
  features: string[]
  status: (typeof STATUSES)[number]
  featured: boolean
  locationLink: string
}

export const emptyEquipmentForm: EquipmentFormData = {
  title: "",
  brand: "",
  model: "",
  year: String(new Date().getFullYear()),
  price: "",
  category: "معدة زراعية",
  condition: "مستعمل",
  hours: "0",
  location: "المنيا",
  phone: "",
  description: "",
  images: [],
  features: [],
  status: "متاح",
  featured: false,
  locationLink: "",
}

interface EquipmentFormProps {
  form: EquipmentFormData
  onChange: (form: EquipmentFormData) => void
  errors: Partial<Record<keyof EquipmentFormData, string>>
  isUploading: boolean
  onUploadingChange: (v: boolean) => void
}

export function EquipmentForm({
  form,
  onChange,
  errors,
  isUploading,
  onUploadingChange,
}: EquipmentFormProps) {
  const [newFeature, setNewFeature] = useState("")

  const set = <K extends keyof EquipmentFormData>(key: K, value: EquipmentFormData[K]) => {
    onChange({ ...form, [key]: value })
  }

  const onImagesChange = (images: string[]) => {
    onChange({ ...form, images })
  }

  const addFeature = () => {
    const f = newFeature.trim()
    if (!f) return
    set("features", [...form.features, f])
    setNewFeature("")
  }

  const removeFeature = (idx: number) => {
    set("features", form.features.filter((_, i) => i !== idx))
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Main Form Area (Spans 2 columns) */}
      <div className="lg:col-span-2 space-y-8">
        
        {/* Basic Details Card */}
        <Card className="border border-slate-100 shadow-sm rounded-3xl bg-white overflow-hidden ring-1 ring-slate-100/50">
          <CardHeader className="p-6 border-b border-slate-100/60 bg-white">
            <CardTitle className="flex items-center gap-3 text-lg font-black text-slate-800">
              <div className="p-2 bg-primary/10 rounded-lg text-primary">
                <Tractor className="h-5 w-5" />
              </div>
              البيانات الأساسية
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-6">
            <div className="space-y-2.5">
              <Label className="text-sm font-black text-slate-700">عنوان الإعلان <span className="text-rose-500">*</span></Label>
              <Input
                value={form.title}
                onChange={(e) => set("title", e.target.value)}
                placeholder="مثال: جرار ماسي فيرغسون 2020 بحالة ممتازة"
                className={cn("h-12 rounded-xl bg-slate-50 border-slate-200 focus-visible:ring-primary font-bold", errors.title && "border-rose-500 focus-visible:ring-rose-500")}
              />
              {errors.title && <p className="text-xs text-rose-500 font-bold">{errors.title}</p>}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2.5">
                <Label className="text-sm font-black text-slate-700">الماركة <span className="text-rose-500">*</span></Label>
                <Input
                  value={form.brand}
                  onChange={(e) => set("brand", e.target.value)}
                  placeholder="مثال: كتربيلر، جون دير"
                  className={cn("h-12 rounded-xl bg-slate-50 border-slate-200 focus-visible:ring-primary font-bold", errors.brand && "border-rose-500 focus-visible:ring-rose-500")}
                />
                {errors.brand && <p className="text-xs text-rose-500 font-bold">{errors.brand}</p>}
              </div>
              <div className="space-y-2.5">
                <Label className="text-sm font-black text-slate-700">الموديل</Label>
                <Input
                  value={form.model}
                  onChange={(e) => set("model", e.target.value)}
                  placeholder="مثال: 320D L"
                  className="h-12 rounded-xl bg-slate-50 border-slate-200 focus-visible:ring-primary font-bold"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <YearPicker
                id="year"
                label="سنة الصنع"
                value={form.year}
                onChange={(year) => set("year", year)}
                endYear={currentYear() + 1}
                selectClassName="rounded-xl h-12 bg-slate-50 border-slate-200 focus:border-teal-500 focus:ring-primary"
              />
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
              <div className="space-y-2.5">
                <Label className="text-sm font-black text-slate-700">ساعات التشغيل</Label>
                <Input
                  type="number"
                  min={0}
                  value={form.hours}
                  onChange={(e) => set("hours", e.target.value)}
                  placeholder="0"
                  className="h-12 rounded-xl bg-slate-50 border-slate-200 focus-visible:ring-primary font-bold"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2.5">
                <Label className="text-sm font-black text-slate-700">التصنيف <span className="text-rose-500">*</span></Label>
                <select
                  value={form.category}
                  onChange={(e) => set("category", e.target.value as EquipmentFormData["category"])}
                  className="flex h-12 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-bold focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-primary transition-colors"
                >
                  {CATEGORIES.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
              <div className="space-y-2.5">
                <Label className="text-sm font-black text-slate-700">حالة المعدة <span className="text-rose-500">*</span></Label>
                <select
                  value={form.condition}
                  onChange={(e) => set("condition", e.target.value as EquipmentFormData["condition"])}
                  className="flex h-12 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-bold focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-primary transition-colors"
                >
                  {CONDITIONS.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Description Card */}
        <Card className="border border-slate-100 shadow-sm rounded-3xl bg-white overflow-hidden ring-1 ring-slate-100/50">
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
              <Label className="text-sm font-black text-slate-700">الوصف التفصيلي <span className="text-rose-500">*</span></Label>
              <div className="rounded-xl border border-slate-200 overflow-hidden bg-slate-50">
                <RichTextEditor
                  value={form.description}
                  onChange={(val) => set("description", val)}
                  placeholder="اكتب وصفاً جذاباً للمعدة يوضح حالتها وصيانتها ومميزاتها..."
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
                  placeholder="مثال: كابينة مكيفة، صيانة دورية، كاوتش جديد..."
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
        <Card className="border border-slate-100 shadow-sm rounded-3xl bg-white overflow-hidden ring-1 ring-slate-100/50">
          <CardHeader className="bg-slate-50/50 py-4 px-6 border-b border-slate-100">
            <CardTitle className="flex items-center gap-3 text-base font-black text-slate-800">
              <div className="p-2 bg-primary/10 rounded-lg text-primary">
                <ImagePlus className="h-4 w-4" />
              </div>
              الصور <span className="text-rose-500">*</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="py-4 px-6">
            <MultiImageUpload
              value={form.images}
              onChange={onImagesChange}
              error={errors.images}
              onUploadingChange={onUploadingChange}
              max={12}
              label="الصور"
            />
          </CardContent>
        </Card>

        {/* Status Card */}
        <Card className="border border-slate-100 shadow-sm rounded-3xl bg-white overflow-hidden ring-1 ring-slate-100/50">
          <CardHeader className="bg-slate-50/50 py-4 px-6 border-b border-slate-100">
            <CardTitle className="flex items-center gap-3 text-base font-black text-slate-800">
              <div className="p-2 bg-primary/10 rounded-lg text-primary">
                <Tag className="h-4 w-4" />
              </div>
              إعدادات العرض
            </CardTitle>
          </CardHeader>
          <CardContent className="py-4 px-6 space-y-5">
            <div className="space-y-2.5">
              <Label className="text-sm font-black text-slate-700">حالة العرض</Label>
              <select
                value={form.status}
                onChange={(e) => set("status", e.target.value as EquipmentFormData["status"])}
                className="flex h-12 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-bold focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-primary transition-colors"
              >
                {STATUSES.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>
            
            <div className="flex items-center gap-3 bg-primary/5 border border-primary/20 p-4 rounded-xl">
              <input
                id="featured"
                type="checkbox"
                checked={form.featured}
                onChange={(e) => set("featured", e.target.checked)}
                className="h-5 w-5 rounded text-primary focus:ring-primary"
              />
              <Label htmlFor="featured" className="text-sm font-bold text-slate-900 cursor-pointer flex-1">
                تمييز الإعلان في الرئيسية
              </Label>
            </div>
          </CardContent>
        </Card>

        {/* Contact & Location Card */}
        <Card className="border border-slate-100 shadow-sm rounded-3xl bg-white overflow-hidden ring-1 ring-slate-100/50">
          <CardHeader className="bg-slate-50/50 py-4 px-6 border-b border-slate-100">
            <CardTitle className="flex items-center gap-3 text-base font-black text-slate-800">
              <div className="p-2 bg-rose-500/10 rounded-lg text-rose-600">
                <MapPin className="h-4 w-4" />
              </div>
              الموقع والتواصل
            </CardTitle>
          </CardHeader>
          <CardContent className="py-4 px-6 space-y-5">
            <div className="space-y-2.5">
              <Label className="text-sm font-black text-slate-700">الموقع الأساسي</Label>
              <Input
                value={form.location}
                onChange={(e) => set("location", e.target.value)}
                placeholder="المنيا"
                className="h-12 rounded-xl border-slate-200 bg-slate-50 px-4 font-bold text-sm focus-visible:ring-rose-500"
              />
            </div>

            <div className="space-y-2.5">
              <Label className="text-sm font-black text-slate-700">رابط الموقع (خرائط جوجل)</Label>
              <div className="relative">
                <MapPin className="absolute right-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                <Input
                  value={form.locationLink}
                  onChange={(e) => set("locationLink", e.target.value)}
                  placeholder="https://maps.google.com/..."
                  className="h-12 rounded-xl border-slate-200 bg-slate-50 pr-10 pl-4 font-bold text-sm focus-visible:ring-rose-500"
                  dir="ltr"
                />
              </div>
            </div>

            <div className="space-y-2.5">
              <Label className="text-sm font-black text-slate-700">رقم الهاتف</Label>
              <div className="relative">
                <Phone className="absolute right-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                <Input
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
          </CardContent>
        </Card>

      </div>
    </div>
  )
}

export function equipmentFormToPayload(form: EquipmentFormData) {
  return {
    title: form.title.trim(),
    brand: form.brand.trim(),
    model: form.model.trim(),
    year: form.year ? Number(form.year) : undefined,
    price: form.price ? Number(form.price) : undefined,
    category: form.category,
    condition: form.condition,
    hours: form.hours ? Number(form.hours) : undefined,
    location: form.location.trim(),
    phone: form.phone.trim(),
    description: form.description.trim(),
    images: form.images,
    features: form.features,
    status: form.status,
    featured: form.featured,
    locationLink: form.locationLink.trim(),
  }
}

export function validateEquipmentForm(form: EquipmentFormData) {
  const errors: Partial<Record<keyof EquipmentFormData, string>> = {}
  if (!form.title.trim()) errors.title = "مطلوب"
  if (!form.brand.trim()) errors.brand = "مطلوب"
  if (form.price && isNaN(Number(form.price))) errors.price = "يجب أن يكون رقماً"
  if (!form.description.trim()) errors.description = "مطلوب"
  if (!form.images.length) errors.images = "صورة واحدة على الأقل مطلوبة"
  return errors
}
