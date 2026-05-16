"use client"

import { Suspense, useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { toast } from "sonner"
import { KeyRound } from "lucide-react"

import { Button } from "@/components/ui/button"
import { resetPasswordSchema, type ResetPasswordFormData } from "@/lib/validations/authSchema"
import { AuthLayout } from "@/components/auth/auth-layout"
import { AuthField } from "@/components/auth/auth-field"

function ResetPasswordForm() {
 const router = useRouter()
 const searchParams = useSearchParams()
 const tokenFromUrl = searchParams.get("token") ?? ""
 const [isLoading, setIsLoading] = useState(false)

 const {
 register,
 handleSubmit,
 setValue,
 formState: { errors },
 } = useForm<ResetPasswordFormData>({
 resolver: zodResolver(resetPasswordSchema),
 defaultValues: {
 token: "",
 password: "",
 confirmPassword: "",
 },
 })

 useEffect(() => {
 if (tokenFromUrl) setValue("token", tokenFromUrl)
 }, [tokenFromUrl, setValue])

 const onSubmit = async (data: ResetPasswordFormData) => {
 const token = tokenFromUrl || data.token
 if (!token) {
 toast.error("رابط إعادة التعيين غير صالح")
 return
 }

 setIsLoading(true)
 try {
 const response = await fetch("/api/auth/reset-password", {
 method: "POST",
 headers: { "Content-Type": "application/json" },
 body: JSON.stringify({
 token,
 password: data.password,
 }),
 })

 const result = await response.json()

 if (result.success) {
 toast.success("تم إعادة تعيين كلمة المرور بنجاح")
 router.push("/auth/login")
 } else {
 toast.error(result.error || "فشل في إعادة تعيين كلمة المرور")
 }
 } catch {
 toast.error("حدث خطأ ما. يرجى المحاولة مرة أخرى.")
 } finally {
 setIsLoading(false)
 }
 }

 if (!tokenFromUrl) {
 return (
 <AuthLayout
 title="رابط غير صالح"
 subtitle="يبدو أن رابط إعادة التعيين ناقصاً أو منتهياً. اطلب رابطاً جديداً من صفحة نسيت كلمة المرور."
 footer={
 <Link href="/auth/forgot-password" className="font-black text-primary hover:underline">
 طلب رابط جديد
 </Link>
 }
 >
 <Button size="xl" className="w-full" asChild>
 <Link href="/auth/forgot-password">الذهاب إلى نسيت كلمة المرور</Link>
 </Button>
 </AuthLayout>
 )
 }

 return (
 <AuthLayout
 title="إعادة تعيين كلمة المرور"
 subtitle="أدخل كلمة المرور الجديدة وتأكيدها"
 footer={
 <Link href="/auth/login" className="font-black text-primary hover:underline">
 العودة إلى تسجيل الدخول
 </Link>
 }
 >
 <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
 <input type="hidden" {...register("token")} />

 <AuthField
 id="password"
 label="كلمة المرور الجديدة"
 type="password"
 placeholder="••••••••"
 autoComplete="new-password"
 error={errors.password?.message}
 {...register("password")}
 />

 <AuthField
 id="confirmPassword"
 label="تأكيد كلمة المرور"
 type="password"
 placeholder="••••••••"
 autoComplete="new-password"
 error={errors.confirmPassword?.message}
 {...register("confirmPassword")}
 />

 <Button type="submit" size="xl" className="w-full" disabled={isLoading}>
 <KeyRound className="h-5 w-5" />
 {isLoading ? "جاري الحفظ..." : "حفظ كلمة المرور الجديدة"}
 </Button>
 </form>
 </AuthLayout>
 )
}

export default function ResetPasswordPage() {
 return (
 <Suspense
 fallback={
 <div className="flex min-h-screen items-center justify-center bg-[#F9F6F1]">
 <p className="font-medium text-muted-foreground">جاري التحميل...</p>
 </div>
 }
 >
 <ResetPasswordForm />
 </Suspense>
 )
}
