"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { ArrowRight } from "lucide-react"
import { useEquipmentById, useUpdateEquipment } from "@/hooks/useEquipment"
import {
  EquipmentForm,
  emptyEquipmentForm,
  equipmentFormToPayload,
  validateEquipmentForm,
  type EquipmentFormData,
} from "@/components/equipment-form"

export default function EditEquipmentPage() {
  const params = useParams()
  const id = params.id as string
  const router = useRouter()
  const { data, isLoading } = useEquipmentById(id)
  const updateMutation = useUpdateEquipment()
  const [form, setForm] = useState<EquipmentFormData>(emptyEquipmentForm)
  const [errors, setErrors] = useState<Partial<Record<keyof EquipmentFormData, string>>>({})
  const [isUploading, setIsUploading] = useState(false)

  useEffect(() => {
    const item = data?.data
    if (!item) return
    setForm({
      title: item.title || "",
      brand: item.brand || "",
      model: item.model || "",
      year: item.year ? String(item.year) : "",
      price: String(item.price),
      category: item.category as EquipmentFormData["category"],
      condition: item.condition as EquipmentFormData["condition"],
      hours: String(item.hours ?? 0),
      location: item.location || "المنيا",
      description: item.description || "",
      images: item.images || [],
      features: item.features || [],
      status: item.status as EquipmentFormData["status"],
      featured: item.featured ?? false,
    })
  }, [data])

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const validation = validateEquipmentForm(form)
    setErrors(validation)
    if (Object.keys(validation).length > 0) return

    updateMutation.mutate(
      { id, data: equipmentFormToPayload(form) },
      { onSuccess: () => router.push("/admin/equipment") }
    )
  }

  if (isLoading && !form.title) {
    return (
      <div className="min-h-screen bg-[#F9F6F1]">
        <main className="container mx-auto px-4 pb-8 max-w-4xl space-y-8">
          <Skeleton className="h-12 w-64" />
          <Skeleton className="h-96 w-full" />
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#F9F6F1]">
      <main className="container mx-auto px-4 pb-8 max-w-4xl">
        <div className="space-y-4 mb-12">
          <Button variant="ghost" size="sm" asChild className="-mr-4">
            <Link href="/admin/equipment" className="font-black">
              <ArrowRight className="h-4 w-4 ml-2" />
              قائمة المعدات
            </Link>
          </Button>
          <h1 className="text-5xl font-[1000] tracking-tighter">تعديل معدة</h1>
        </div>

        <form onSubmit={onSubmit} className="space-y-8">
          <EquipmentForm
            form={form}
            onChange={setForm}
            errors={errors}
            isUploading={isUploading}
            onUploadingChange={setIsUploading}
          />
          <div className="flex gap-4">
            <Button type="button" variant="outline" asChild className="flex-1 h-16 font-black">
              <Link href="/admin/equipment">إلغاء</Link>
            </Button>
            <Button
              type="submit"
              disabled={updateMutation.isPending || isUploading}
              className="flex-[2] h-16 font-black text-xl"
            >
              {updateMutation.isPending ? "جاري الحفظ..." : "حفظ التغييرات"}
            </Button>
          </div>
        </form>
      </main>
    </div>
  )
}
