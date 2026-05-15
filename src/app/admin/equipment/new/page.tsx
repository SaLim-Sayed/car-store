"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"
import { useCreateEquipment } from "@/hooks/useEquipment"
import {
  EquipmentForm,
  emptyEquipmentForm,
  equipmentFormToPayload,
  validateEquipmentForm,
  type EquipmentFormData,
} from "@/components/equipment-form"

export default function NewEquipmentPage() {
  const router = useRouter()
  const createMutation = useCreateEquipment()
  const [form, setForm] = useState<EquipmentFormData>(emptyEquipmentForm)
  const [errors, setErrors] = useState<Partial<Record<keyof EquipmentFormData, string>>>({})
  const [isUploading, setIsUploading] = useState(false)

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const validation = validateEquipmentForm(form)
    setErrors(validation)
    if (Object.keys(validation).length > 0) return

    createMutation.mutate(equipmentFormToPayload(form), {
      onSuccess: () => router.push("/admin/equipment"),
    })
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
          <h1 className="text-5xl font-[1000] tracking-tighter">إضافة معدة</h1>
          <p className="text-muted-foreground text-xl font-medium">آلات زراعية أو معدات ثقيلة</p>
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
              disabled={createMutation.isPending || isUploading}
              className="flex-[2] h-16 font-black text-xl"
            >
              {createMutation.isPending ? "جاري الحفظ..." : "حفظ المعدة"}
            </Button>
          </div>
        </form>
      </main>
    </div>
  )
}
