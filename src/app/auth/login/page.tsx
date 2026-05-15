"use client"

import { Suspense, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { toast } from "sonner"
import { LogIn } from "lucide-react"

import { Button } from "@/components/ui/button"
import { loginSchema, type LoginFormData } from "@/lib/validations/authSchema"
import { useAuthStore } from "@/lib/store/authStore"
import { AuthLayout } from "@/components/auth/auth-layout"
import { AuthField } from "@/components/auth/auth-field"

function LoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { login } = useAuthStore()
  const [isLoading, setIsLoading] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  })

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true)
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })

      const result = await response.json()

      if (result.success) {
        login(result.data.user, result.data.token)
        toast.success("تم تسجيل الدخول بنجاح")
        const callbackUrl = searchParams.get("callbackUrl")
        if (callbackUrl?.startsWith("/admin") && result.data.user.role === "admin") {
          router.push(callbackUrl)
        } else if (result.data.user.role === "admin") {
          router.push("/admin/dashboard")
        } else {
          router.push("/")
        }
      } else {
        toast.error(result.error || "فشل في تسجيل الدخول")
      }
    } catch {
      toast.error("حدث خطأ ما. يرجى المحاولة مرة أخرى.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <AuthLayout
      title="تسجيل الدخول"
      subtitle="أدخل بريدك الإلكتروني وكلمة المرور للوصول إلى حسابك"
      footer={
        <p>
          ليس لديك حساب؟{" "}
          <Link href="/auth/register" className="font-black text-primary hover:underline">
            إنشاء حساب جديد
          </Link>
        </p>
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

        <AuthField
          id="password"
          label="كلمة المرور"
          type="password"
          placeholder="••••••••"
          autoComplete="current-password"
          error={errors.password?.message}
          {...register("password")}
        />

        <div className="flex justify-end">
          <Link
            href="/auth/forgot-password"
            className="text-sm font-bold text-primary hover:underline"
          >
            نسيت كلمة المرور؟
          </Link>
        </div>

        <Button type="submit" size="xl" className="w-full" disabled={isLoading}>
          <LogIn className="h-5 w-5" />
          {isLoading ? "جاري تسجيل الدخول..." : "تسجيل الدخول"}
        </Button>
      </form>
    </AuthLayout>
  )
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-[#F9F6F1]">
          <p className="font-medium text-muted-foreground">جاري التحميل...</p>
        </div>
      }
    >
      <LoginForm />
    </Suspense>
  )
}
