"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"
import { useCreateEquipment } from "@/hooks/useEquipment"
import {
  BikeForm,
  emptyBikeForm,
  bikeFormToPayload,
  validateBikeForm,
  type BikeFormData,
} from "@/components/bike-form"

function coerceCategory(raw?: string): BikeFormData["category"] | undefined {
  if (!raw) return undefined
  const allowed: BikeFormData["category"][] = [
    "موتوسيكل",
    "توك توك",
    "تروسيكل",
    "سكوتر",
    "دراجة نارية",
    "أخرى",
  ]
  return allowed.includes(raw as BikeFormData["category"])
    ? (raw as BikeFormData["category"])
    : undefined
}

export default function NewBikeClient({ initialCategory }: { initialCategory?: string }) {
  const router = useRouter()
  const createMutation = useCreateEquipment()
  const [form, setForm] = useState<BikeFormData>(() => ({
    ...emptyBikeForm,
    category: coerceCategory(initialCategory) || emptyBikeForm.category,
  }))
  const [errors, setErrors] = useState<Partial<Record<keyof BikeFormData, string>>>({})
  const [isUploading, setIsUploading] = useState(false)

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const validation = validateBikeForm(form)
    setErrors(validation)
    if (Object.keys(validation).length > 0) return

    createMutation.mutate(bikeFormToPayload(form), {
      onSuccess: () => router.push("/admin/bikes"),
    })
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <main className="container mx-auto px-4 py-8 max-w-5xl">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-8 border-b border-slate-200">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2 text-slate-500 mb-2 font-bold text-sm">
              <Link href="/admin/bikes" className="hover:text-primary transition-colors">
                الدراجات הנارية
              </Link>
              <ArrowRight className="h-3 w-3" />
              <span className="text-slate-800">إضافة دراجة جديدة</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-slate-900 tracking-tight">
              إضافة دراجة جديدة
            </h1>
            <p className="text-sm md:text-base text-slate-500 font-bold max-w-2xl">
              موتوسيكلات وتوك توك وتروسيكلات
            </p>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <Button
              variant="outline"
              asChild
              className="h-11 border-slate-200 text-slate-600 font-black rounded-xl hover:bg-slate-50 px-6"
            >
              <Link href="/admin/bikes">إلغاء الأمر</Link>
            </Button>
            <Button
              onClick={onSubmit}
              disabled={createMutation.isPending || isUploading}
              className="h-11 bg-primary hover:bg-primary/90 text-white font-black rounded-xl shadow-lg shadow-primary/20 transition-all hover:scale-105 active:scale-95 px-8"
            >
              {createMutation.isPending ? "جاري الحفظ..." : "حفظ الدراجة"}
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
              disabled={createMutation.isPending || isUploading}
              className="flex-1 md:flex-[0_0_auto] h-14 bg-primary hover:bg-primary/90 text-white font-black rounded-xl shadow-lg shadow-primary/20 transition-all hover:scale-[1.02] active:scale-95 px-12 text-lg"
            >
              {createMutation.isPending ? "جاري الحفظ..." : "حفظ الدراجة"}
            </Button>
            <Button
              type="button"
              variant="outline"
              asChild
              className="flex-1 md:flex-[0_0_auto] h-14 border-slate-200 text-slate-600 hover:bg-slate-50 font-black rounded-xl px-12 text-lg"
            >
              <Link href="/admin/bikes">إلغاء الأمر</Link>
            </Button>
          </div>
        </form>
      </main>
    </div>
  )
}

