"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { ArrowRight } from "lucide-react"
import { useEquipmentById, useUpdateEquipment } from "@/hooks/useEquipment"
import {
 BikeForm,
 emptyBikeForm,
 bikeFormToPayload,
 validateBikeForm,
 type BikeFormData,
} from "@/components/bike-form"

export default function EditBikePage() {
 const params = useParams()
 const id = params.id as string
 const router = useRouter()
 const { data, isLoading } = useEquipmentById(id)
 const updateMutation = useUpdateEquipment()
 const [form, setForm] = useState<BikeFormData>(emptyBikeForm)
 const [errors, setErrors] = useState<Partial<Record<keyof BikeFormData, string>>>({})
 const [isUploading, setIsUploading] = useState(false)

 useEffect(() => {
 const item = data?.data
 if (!item) return
 setForm({
 title: item.title || "",
 brand: item.brand || "",
 model: item.model || "",
 year: item.year ? String(item.year) : "",
 price: item.price ? String(item.price) : "",
 category: item.category as BikeFormData["category"],
 condition: item.condition as BikeFormData["condition"],
 hours: String(item.hours ?? 0),
 location: item.location || "مدينة المنيا. ميدان الحميات",
 phone: item.phone ?? "",
 description: item.description || "",
 images: item.images || [],
 features: item.features || [],
 status: item.status as BikeFormData["status"],
 featured: item.featured ?? false,
 locationLink: item.locationLink || "",
 showroom: typeof item.showroom === 'object' ? item.showroom?._id : item.showroom || "",
 })
 }, [data])

 const onSubmit = (e: React.FormEvent) => {
 e.preventDefault()
 const validation = validateBikeForm(form)
 setErrors(validation)
 if (Object.keys(validation).length > 0) return

 updateMutation.mutate(
 { id, data: bikeFormToPayload(form) },
 { onSuccess: () => router.push("/admin/bikes") }
 )
 }

 if (isLoading && !form.title) {
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
              <Link href="/admin/bikes" className="hover:text-primary transition-colors">الدراجات הנارية</Link>
              <ArrowRight className="h-3 w-3" />
              <span className="text-slate-800">تعديل {form.title}</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-slate-900 tracking-tight">تعديل بيانات الدراجة</h1>
            <p className="text-sm md:text-base text-slate-500 font-bold max-w-2xl">
              تحديث بيانات الدراجة النارية
            </p>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <Button variant="outline" asChild className="h-11 border-slate-200 text-slate-600 font-black rounded-xl hover:bg-slate-50 px-6">
              <Link href="/admin/bikes">إلغاء الأمر</Link>
            </Button>
            <Button
              onClick={onSubmit}
              disabled={updateMutation.isPending || isUploading}
              className="h-11 bg-primary hover:bg-primary/90 text-white font-black rounded-xl shadow-lg shadow-primary/20 transition-all hover:scale-105 active:scale-95 px-8"
            >
              {updateMutation.isPending ? "جاري الحفظ..." : "حفظ التحديثات"}
            </Button>
          </div>
        </div>

        <form onSubmit={onSubmit} className="mt-8 space-y-8">
          <BikeForm
            form={form}
            onChange={setForm}
            errors={errors}
            isUploading={isUploading}
            onUploadingChange={setIsUploading}
          />
          <div className="flex gap-4 pt-4 border-t border-slate-200 mt-8">
            <Button
              type="submit"
              disabled={updateMutation.isPending || isUploading}
              className="flex-1 md:flex-[0_0_auto] h-14 bg-primary hover:bg-primary/90 text-white font-black rounded-xl shadow-lg shadow-primary/20 transition-all hover:scale-[1.02] active:scale-95 px-12 text-lg"
            >
              {updateMutation.isPending ? "جاري الحفظ..." : "حفظ التحديثات"}
            </Button>
            <Button type="button" variant="outline" asChild className="flex-1 md:flex-[0_0_auto] h-14 border-slate-200 text-slate-600 hover:bg-slate-50 font-black rounded-xl px-12 text-lg">
              <Link href="/admin/bikes">إلغاء الأمر</Link>
            </Button>
          </div>
        </form>
      </main>
    </div>
 )
}
