"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { ImageUpload } from "@/components/image-upload"
import { uploadImageFile } from "@/lib/client-image-upload"
import { YearPicker } from "@/components/year-picker"
import { currentYear } from "@/lib/date-utils"
import { toast } from "sonner"
import { Plus, X, Phone } from "lucide-react"
import { SITE_PHONE_DISPLAY } from "@/lib/phone"

const CATEGORIES = ["جرار", "حفار", "شاحنة", "معدة زراعية", "معدة بناء", "أخرى"] as const
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
 const [coverImage, setCoverImage] = useState(form.images[0] || "")

 const set = <K extends keyof EquipmentFormData>(key: K, value: EquipmentFormData[K]) => {
 onChange({ ...form, [key]: value })
 }

 const setCover = (url: string) => {
 setCoverImage(url)
 const rest = form.images.filter((img) => img !== url)
 onChange({ ...form, images: url ? [url, ...rest] : rest })
 }

 const addExtraImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
 const file = e.target.files?.[0]
 if (!file) return
 onUploadingChange(true)
 try {
 const url = await uploadImageFile(file)
 onChange({ ...form, images: [...form.images, url] })
 toast.success("تم رفع الصورة")
 } catch (err) {
 toast.error(err instanceof Error ? err.message : "فشل رفع الصورة")
 } finally {
 onUploadingChange(false)
 e.target.value = ""
 }
 }

 const removeImage = (url: string) => {
 const next = form.images.filter((img) => img !== url)
 onChange({ ...form, images: next })
 if (coverImage === url) setCoverImage(next[0] || "")
 }

 return (
 <div className="space-y-12">
 <Card className="border-0 shadow-none rounded-md bg-white overflow-hidden">
 <CardHeader className="p-8 pb-0">
 <CardTitle className="text-2xl font-black">بيانات المعدة</CardTitle>
 </CardHeader>
 <CardContent className="p-8 space-y-8">
 <div className="space-y-3">
 <Label className="text-lg font-black">عنوان الإعلان *</Label>
 <Input
 value={form.title}
 onChange={(e) => set("title", e.target.value)}
 placeholder="مثال: جرار ماسي فيرغسون 2020"
 className={`h-14 rounded-md border-2 px-6 font-bold ${errors.title ? "border-red-500" : "border-gray-50"}`}
 />
 {errors.title && <p className="text-sm text-red-500 font-bold">{errors.title}</p>}
 </div>

 <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
 <div className="space-y-3">
 <Label className="text-lg font-black">الماركة *</Label>
 <Input
 value={form.brand}
 onChange={(e) => set("brand", e.target.value)}
 className={`h-14 rounded-md border-2 px-6 font-bold ${errors.brand ? "border-red-500" : "border-gray-50"}`}
 />
 {errors.brand && <p className="text-sm text-red-500 font-bold">{errors.brand}</p>}
 </div>
 <div className="space-y-3">
 <Label className="text-lg font-black">الموديل</Label>
 <Input
 value={form.model}
 onChange={(e) => set("model", e.target.value)}
 className="h-14 rounded-md border-2 border-gray-50 px-6 font-bold"
 />
 </div>
 </div>

 <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
 <div className="space-y-3">
 <Label className="text-lg font-black">السعر (ج.م) *</Label>
 <Input
 type="number"
 value={form.price}
 onChange={(e) => set("price", e.target.value)}
 className={`h-14 rounded-md border-2 px-6 font-bold ${errors.price ? "border-red-500" : "border-gray-50"}`}
 />
 </div>
 <YearPicker
 label="سنة الصنع"
 value={form.year}
 onChange={(year) => set("year", year)}
 endYear={currentYear() + 1}
 />
 <div className="space-y-3">
 <Label className="text-lg font-black">ساعات التشغيل</Label>
 <Input
 type="number"
 value={form.hours}
 onChange={(e) => set("hours", e.target.value)}
 className="h-14 rounded-md border-2 border-gray-50 px-6 font-bold"
 />
 </div>
 </div>

 <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
 <div className="space-y-3">
 <Label className="text-lg font-black">التصنيف</Label>
 <select
 value={form.category}
 onChange={(e) => set("category", e.target.value as EquipmentFormData["category"])}
 className="flex h-14 w-full rounded-md border-2 border-gray-50 bg-white px-6 font-bold"
 >
 {CATEGORIES.map((c) => (
 <option key={c} value={c}>
 {c}
 </option>
 ))}
 </select>
 </div>
 <div className="space-y-3">
 <Label className="text-lg font-black">الحالة</Label>
 <select
 value={form.condition}
 onChange={(e) => set("condition", e.target.value as EquipmentFormData["condition"])}
 className="flex h-14 w-full rounded-md border-2 border-gray-50 bg-white px-6 font-bold"
 >
 {CONDITIONS.map((c) => (
 <option key={c} value={c}>
 {c}
 </option>
 ))}
 </select>
 </div>
 <div className="space-y-3">
 <Label className="text-lg font-black">حالة العرض</Label>
 <select
 value={form.status}
 onChange={(e) => set("status", e.target.value as EquipmentFormData["status"])}
 className="flex h-14 w-full rounded-md border-2 border-gray-50 bg-white px-6 font-bold"
 >
 {STATUSES.map((s) => (
 <option key={s} value={s}>
 {s}
 </option>
 ))}
 </select>
 </div>
 </div>

 <div className="space-y-3">
 <Label className="text-lg font-black">الموقع</Label>
 <Input
 value={form.location}
 onChange={(e) => set("location", e.target.value)}
 className="h-14 rounded-md border-2 border-gray-50 px-6 font-bold"
 />
 </div>

 <div className="space-y-3">
 <Label className="text-lg font-black">رقم الهاتف للتواصل</Label>
 <div className="relative">
 <Phone className="absolute right-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
 <Input
 type="tel"
 value={form.phone}
 onChange={(e) => set("phone", e.target.value)}
 placeholder={`اتركه فارغاً لاستخدام ${SITE_PHONE_DISPLAY}`}
 className="h-14 rounded-md border-2 border-gray-50 pr-12 pl-6 font-bold"
 dir="ltr"
 />
 </div>
 </div>

 <div className="space-y-3">
 <Label className="text-lg font-black">الوصف *</Label>
 <Textarea
 value={form.description}
 onChange={(e) => set("description", e.target.value)}
 className={`min-h-[160px] rounded-md border-2 p-6 font-bold ${errors.description ? "border-red-500" : "border-gray-50"}`}
 />
 {errors.description && (
 <p className="text-sm text-red-500 font-bold">{errors.description}</p>
 )}
 </div>

 <label className="flex items-center gap-3 cursor-pointer justify-end">
 <span className="text-lg font-black">إعلان مميز في الصفحة الرئيسية</span>
 <input
 type="checkbox"
 checked={form.featured}
 onChange={(e) => set("featured", e.target.checked)}
 className="h-5 w-5"
 />
 </label>
 </CardContent>
 </Card>

 <Card className="border-0 shadow-none rounded-md bg-white overflow-hidden">
 <CardHeader className="p-8 pb-0">
 <CardTitle className="text-2xl font-black">الصور</CardTitle>
 </CardHeader>
 <CardContent className="p-8 space-y-8">
 <ImageUpload
 value={coverImage}
 onChange={setCover}
 error={errors.images}
 allowUrl={false}
 onUploadingChange={onUploadingChange}
 />

 <div className="space-y-3">
 <Label className="font-black">صور إضافية</Label>
 <Input type="file" accept="image/*" onChange={addExtraImage} disabled={isUploading} />
 </div>

 {form.images.length > 0 && (
 <div className="flex flex-wrap gap-4">
 {form.images.map((img) => (
 <div key={img} className="relative w-32 h-24 rounded-lg overflow-hidden border-2">
 <img src={img} alt="" className="w-full h-full object-cover" />
 <button
 type="button"
 onClick={() => removeImage(img)}
 className="absolute top-1 left-1 bg-white rounded p-1 shadow"
 >
 <X className="h-4 w-4 text-destructive" />
 </button>
 </div>
 ))}
 </div>
 )}
 </CardContent>
 </Card>

 <Card className="border-0 shadow-none rounded-md bg-white overflow-hidden">
 <CardHeader className="p-8 pb-0">
 <CardTitle className="text-2xl font-black">المميزات</CardTitle>
 </CardHeader>
 <CardContent className="p-8 space-y-4">
 <div className="flex gap-3">
 <Input
 value={newFeature}
 onChange={(e) => setNewFeature(e.target.value)}
 placeholder="ميزة إضافية..."
 className="h-12 font-bold"
 />
 <Button
 type="button"
 onClick={() => {
 const f = newFeature.trim()
 if (!f) return
 set("features", [...form.features, f])
 setNewFeature("")
 }}
 className="font-black shrink-0"
 >
 <Plus className="h-4 w-4" />
 </Button>
 </div>
 <ul className="space-y-2 text-right">
 {form.features.map((f, i) => (
 <li key={f} className="flex justify-end items-center gap-2 font-bold">
 {f}
 <button type="button" onClick={() => set("features", form.features.filter((_, j) => j !== i))}>
 <X className="h-4 w-4 text-destructive" />
 </button>
 </li>
 ))}
 </ul>
 </CardContent>
 </Card>
 </div>
 )
}

export function equipmentFormToPayload(form: EquipmentFormData) {
 return {
 title: form.title.trim(),
 brand: form.brand.trim(),
 model: form.model.trim(),
 year: form.year ? Number(form.year) : undefined,
 price: Number(form.price),
 category: form.category,
 condition: form.condition,
 hours: Number(form.hours) || 0,
 location: form.location.trim(),
 phone: form.phone.trim(),
 description: form.description.trim(),
 images: form.images,
 features: form.features,
 status: form.status,
 featured: form.featured,
 }
}

export function validateEquipmentForm(form: EquipmentFormData) {
 const errors: Partial<Record<keyof EquipmentFormData, string>> = {}
 if (!form.title.trim()) errors.title = "العنوان مطلوب"
 if (!form.brand.trim()) errors.brand = "الماركة مطلوبة"
 if (!form.price || Number(form.price) <= 0) errors.price = "السعر مطلوب"
 if (!form.description.trim()) errors.description = "الوصف مطلوب"
 if (!form.images.length) errors.images = "صورة واحدة على الأقل مطلوبة"
 return errors
}
