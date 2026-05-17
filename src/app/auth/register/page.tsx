"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { UserPlus } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  registerSchema,
  type RegisterFormData,
} from "@/lib/validations/authSchema";
import { useAuthStore } from "@/lib/store/authStore";
import { AuthLayout } from "@/components/auth/auth-layout";
import { AuthField } from "@/components/auth/auth-field";

export default function RegisterPage() {
  const router = useRouter();
  const { login } = useAuthStore();
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterFormData) => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: data.name,
          email: data.email,
          password: data.password,
        }),
      });

      const result = await response.json();

      if (result.success) {
        login(result.data.user, result.data.token);
        toast.success("تم إنشاء الحساب بنجاح");
        router.push("/");
      } else {
        toast.error(result.error || "فشل في إنشاء الحساب");
      }
    } catch {
      toast.error("حدث خطأ ما. يرجى المحاولة مرة أخرى.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout
      title="إنشاء حساب جديد"
      subtitle="انضم إلى منصة سيارات المنيا وابدأ بيع وشراء السيارات بسهولة"
      footer={
        <p className="text-white space-x-3">
          لديك حساب بالفعل؟{" "}
          <Link
            href="/auth/login"
            className="font-black text-accent hover:underline"
          >
            تسجيل الدخول
          </Link>
        </p>
      }
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <AuthField
          id="name"
          label="الاسم الكامل"
          type="text"
          placeholder="أدخل اسمك الكامل"
          autoComplete="name"
          error={errors.name?.message}
          {...register("name")}
        />

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
          <UserPlus className="h-5 w-5" />
          {isLoading ? "جاري إنشاء الحساب..." : "إنشاء حساب"}
        </Button>
      </form>
    </AuthLayout>
  );
}
