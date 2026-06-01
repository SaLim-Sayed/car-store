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

function coerceCategory(raw?: string): EquipmentFormData["category"] | undefined {
  if (!raw) return undefined
  const allowed: EquipmentFormData["category"][] = [
    "جرار",
    "حفار",
    "شاحنة",
    "معدة زراعية",
    "معدة بناء",
    "موتوسيكل",
    "توك توك",
    "تروسيكل",
    "أخرى",
  ]
  return allowed.includes(raw as EquipmentFormData["category"])
    ? (raw as EquipmentFormData["category"])
    : undefined
}

export default function NewEquipmentClient({ initialCategory }: { initialCategory?: string }) {
  const router = useRouter()
  const createMutation = useCreateEquipment()
  const [form, setForm] = useState<EquipmentFormData>(() => ({
    ...emptyEquipmentForm,
    category: coerceCategory(initialCategory) || emptyEquipmentForm.category,
  }))
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
    <div className="min-h-screen bg-[#F8FAFC]">
      <main className="container mx-auto px-4 py-8 max-w-5xl">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-8 border-b border-slate-200">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2 text-slate-500 mb-2 font-bold text-sm">
              <Link href="/admin/equipment" className="hover:text-primary transition-colors">
                المعدات
              </Link>
              <ArrowRight className="h-3 w-3" />
              <span className="text-slate-800">إضافة معدة جديدة</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-slate-900 tracking-tight">
              إضافة معدة جديدة
            </h1>
            <p className="text-sm md:text-base text-slate-500 font-bold max-w-2xl">
              آلات زراعية أو معدات ثقيلة أو موتوسيكلات وتوك توك وتروسيكلات
            </p>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <Button
              variant="outline"
              asChild
              className="h-11 border-slate-200 text-slate-600 font-black rounded-xl hover:bg-slate-50 px-6"
            >
              <Link href="/admin/equipment">إلغاء الأمر</Link>
            </Button>
            <Button
              onClick={onSubmit}
              disabled={createMutation.isPending || isUploading}
              className="h-11 bg-primary hover:bg-primary/90 text-white font-black rounded-xl shadow-lg shadow-primary/20 transition-all hover:scale-105 active:scale-95 px-8"
            >
              {createMutation.isPending ? "جاري الحفظ..." : "حفظ المعدة"}
            </Button>
          </div>
        </div>

        <form onSubmit={onSubmit} className="mt-8 space-y-8">
          <EquipmentForm
            form={form}
            onChange={setForm}
            errors={errors}
            isUploading={isUploading}
            onUploadingChange={setIsUploading}
          />
          <div className="flex gap-4 pt-4 border-t border-slate-200 mt-8">
            <Button
              type="submit"
              disabled={createMutation.isPending || isUploading}
              className="flex-1 md:flex-[0_0_auto] h-14 bg-primary hover:bg-primary/90 text-white font-black rounded-xl shadow-lg shadow-primary/20 transition-all hover:scale-[1.02] active:scale-95 px-12 text-lg"
            >
              {createMutation.isPending ? "جاري الحفظ..." : "حفظ المعدة"}
            </Button>
            <Button
              type="button"
              variant="outline"
              asChild
              className="flex-1 md:flex-[0_0_auto] h-14 border-slate-200 text-slate-600 hover:bg-slate-50 font-black rounded-xl px-12 text-lg"
            >
              <Link href="/admin/equipment">إلغاء الأمر</Link>
            </Button>
          </div>
        </form>
      </main>
    </div>
  )
}

