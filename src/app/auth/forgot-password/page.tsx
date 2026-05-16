"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { toast } from "sonner"
import Link from "next/link"
import { Mail, ArrowRight, CheckCircle2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { forgotPasswordSchema, type ForgotPasswordFormData } from "@/lib/validations/authSchema"
import { AuthLayout } from "@/components/auth/auth-layout"
import { AuthField } from "@/components/auth/auth-field"

export default function ForgotPasswordPage() {
 const [isLoading, setIsLoading] = useState(false)
 const [isSubmitted, setIsSubmitted] = useState(false)
 const [devResetUrl, setDevResetUrl] = useState<string | null>(null)

 const {
 register,
 handleSubmit,
 formState: { errors },
 } = useForm<ForgotPasswordFormData>({
 resolver: zodResolver(forgotPasswordSchema),
 })

 const onSubmit = async (data: ForgotPasswordFormData) => {
 setIsLoading(true)
 try {
 const response = await fetch("/api/auth/forgot-password", {
 method: "POST",
 headers: { "Content-Type": "application/json" },
 body: JSON.stringify(data),
 })

 const result = await response.json()

 if (result.success) {
 setIsSubmitted(true)
 if (result.resetUrl) setDevResetUrl(result.resetUrl)
 toast.success("تم إرسال رابط إعادة تعيين كلمة المرور")
 } else {
 toast.error(result.error || "فشل في إرسال رابط إعادة التعيين")
 }
 } catch {
 toast.error("حدث خطأ ما. يرجى المحاولة مرة أخرى.")
 } finally {
 setIsLoading(false)
 }
 }

 if (isSubmitted) {
 return (
 <AuthLayout
 title="تم الإرسال بنجاح"
 subtitle="تحقق من بريدك الإلكتروني واتبع التعليمات لإعادة تعيين كلمة المرور"
 footer={
 <Link href="/auth/login" className="font-black text-primary hover:underline">
 العودة إلى تسجيل الدخول
 </Link>
 }
 >
 <div className="flex flex-col items-center gap-6 py-4 text-center">
 <div className="flex h-20 w-20 items-center justify-center rounded-full bg-green-100 text-green-600">
 <CheckCircle2 className="h-10 w-10" />
 </div>
 <p className="text-muted-foreground font-medium leading-relaxed">
 إذا كان البريد مسجلاً لدينا، ستصلك رسالة تحتوي على رابط إعادة التعيين خلال دقائق.
 </p>
 {devResetUrl && (
 <div className="w-full rounded-xl border border-amber-200 bg-amber-50 p-4 text-right text-sm">
 <p className="mb-2 font-black text-amber-900">وضع التطوير — رابط إعادة التعيين:</p>
 <a
 href={devResetUrl}
 className="break-all font-medium text-primary underline"
 >
 {devResetUrl}
 </a>
 </div>
 )}
 <Button size="xl" className="w-full" asChild>
 <Link href="/auth/login">
 <ArrowRight className="h-5 w-5" />
 العودة إلى تسجيل الدخول
 </Link>
 </Button>
 </div>
 </AuthLayout>
 )
 }

 return (
 <AuthLayout
 title="نسيت كلمة المرور"
 subtitle="أدخل بريدك الإلكتروني وسنرسل لك رابطاً لإعادة تعيين كلمة المرور"
 footer={
 <Link href="/auth/login" className="inline-flex items-center gap-2 font-black text-primary hover:underline">
 <ArrowRight className="h-4 w-4" />
 العودة إلى تسجيل الدخول
 </Link>
 }
 >
 <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
 <AuthField
 id="email"
 label="البريد الإلكتروني"
 type="email"
 placeholder="example@email.com"
 autoComplete="email"
 error={errors.email?.message}
 {...register("email")}
 />

 <Button type="submit" size="xl" className="w-full" disabled={isLoading}>
 <Mail className="h-5 w-5" />
 {isLoading ? "جاري الإرسال..." : "إرسال رابط إعادة التعيين"}
 </Button>
 </form>
 </AuthLayout>
 )
}
