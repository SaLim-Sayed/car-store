"use client";

import Image from "next/image";
import Link from "next/link";
import { Car, Shield, TrendingUp } from "lucide-react";

type AuthLayoutProps = {
  title: string;
  subtitle: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
};

const highlights = [
  { icon: Car, text: "آلاف السيارات والمعدات المعروضة" },
  { icon: Shield, text: "منصة موثوقة لبيع وشراء السيارات" },
  { icon: TrendingUp, text: "وصول سريع لآلاف المشترين في المنيا" },
];

export function AuthLayout({
  title,
  subtitle,
  children,
  footer,
}: AuthLayoutProps) {
  return (
    <div className="min-h-screen bg-primary sm:bg-[#F9F6F1]">
      <div className="grid min-h-screen lg:grid-cols-2">
        <div className="relative hidden lg:flex flex-col justify-between overflow-hidden bg-[#1B3E7A] p-12 text-white">
          <div className="absolute inset-0 bg-gradient-to-br from-[#E28328]/25 via-transparent to-black/50" />
          <div className="relative z-10">
            <Link
              href="/"
              className="inline-flex items-center gap-4 transition-opacity hover:opacity-90"
            >
              <div className="relative overflow-hidden rounded-2xl   p-1 shadow-none flex items-center justify-center">
                <Image
                  src="/logo.png"
                  alt="سيارات المنيا"
                  width={200}
                  height={100}
                  className="object-contain"
                />
              </div>
            </Link>
          </div>

          <div className="relative z-10 flex flex-col gapy-4 px-6 justify-start   ">
            <div className="space-y-4">
              <h2 className="text-4xl font-[1000] leading-tight tracking-tight">
                بوابتك لعالم
                <br />
                <span className="text-[#E28328]">السيارات في المنيا</span>
              </h2>
              <p className="max-w-md text-lg text-white/70 font-medium leading-relaxed">
                سجّل دخولك لإدارة إعلاناتك، أو أنشئ حساباً جديداً وابدأ البيع
                والشراء بكل سهولة.
              </p>
            </div>
            <ul className="space-y-4">
              {highlights.map(({ icon: Icon, text }) => (
                <li
                  key={text}
                  className="flex items-center gap-4 text-white/90"
                >
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white/10 text-white">
                    <Icon className="h-5 w-5" />
                  </span>
                  <span className="font-bold text-lg">{text}</span>
                </li>
              ))}
            </ul>
          </div>

          <p className="relative z-10 text-sm text-white/50 font-medium">
            © {new Date().getFullYear()} سيارات المنيا — جميع الحقوق محفوظة
          </p>
        </div>

        <div className="flex flex-col justify-center px-4 pb-10 sm:px-8 lg:px-14">
          <div className="mx-auto w-full max-w-md space-y-4">
            <Link
              href="/"
              className="flex lg:hidden items-center justify-center gap-3"
            >
              <div className="relative overflow-hidden rounded-xl   shadow-none flex items-center justify-center">
                <Image
                  src="/logo.png"
                  alt="سيارات المنيا"
                  width={200}
                  height={50}
                  className="object-contain"
                />
              </div>
            </Link>

            <div className="rounded-[2rem] border border-white/80 bg-white p-8 shadow-[0_20px_60px_rgba(0,0,0,0.06)] sm:p-10">
              <header className="mb-8 space-y-2 text-center">
                <h1 className="text-3xl font-[1000] tracking-tight text-foreground">
                  {title}
                </h1>
                <p className="text-muted-foreground font-medium leading-relaxed">
                  {subtitle}
                </p>
                <div className="mx-auto mt-4 h-1 w-16 rounded-full bg-primary" />
              </header>
              {children}
            </div>

            {footer && (
              <footer className="text-center text-sm text-muted-foreground font-medium">
                {footer}
              </footer>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
