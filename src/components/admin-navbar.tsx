"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  LayoutDashboard,
  Car,
  Newspaper,
  Store,
  Tractor,
  Users,
  LogOut,
  ExternalLink,
  Menu,
  X,
} from "lucide-react";
import { useAuthStore } from "@/lib/store/authStore";
import { cn } from "@/lib/utils";

const adminLinks = [
  { href: "/admin/dashboard", label: "لوحة التحكم", icon: LayoutDashboard },
  { href: "/admin/cars", label: "السيارات", icon: Car },
  { href: "/admin/news", label: "الأخبار", icon: Newspaper },
  { href: "/admin/showrooms", label: "المعارض", icon: Store },
  { href: "/admin/equipment", label: "المعدات", icon: Tractor },
  { href: "/admin/users", label: "المستخدمون", icon: Users },
];

export function AdminNavbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuthStore();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
    } catch {
      // ignore
    }
    logout();
    router.push("/auth/login");
  };

  const isActive = (href: string) => {
    if (href === "/admin/dashboard") return pathname === href;
    return pathname === href || pathname.startsWith(`${href}/`);
  };

  return (
    <header className="fixed top-0 z-40 w-full border-b border-white/10 bg-[#1B3E7A] text-white shadow-none">
      <div className="container mx-auto flex h-16 items-center justify-between gap-4 px-4 md:h-[4.5rem]">
        <div className="flex items-center gap-3 md:gap-8">
          <Link
            href="/admin/dashboard"
            className="flex items-center gap-3 shrink-0"
          >
            <div className="relative  overflow-hidden rounded-md shadow-none flex items-center justify-center   p-0.5">
              <Image
                src="/logo.png"
                alt="لوحة التحكم"
                width={200}
                height={200}
                className="object-contain"
                priority
              />
            </div>
            <div className="hidden sm:block text-right"></div>
          </Link>

          <nav className="hidden lg:flex items-center gap-1">
            {adminLinks.map(({ href, label, icon: Icon }) => (
              <Link
                key={href}
                href={href}
                className={cn(
                  "flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-black transition-colors",
                  isActive(href)
                    ? "bg-[#E28328] text-white shadow-none"
                    : "text-white/80 hover:bg-white/10 hover:text-white",
                )}
              >
                <Icon className="h-4 w-4" />
                {label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            asChild
            className="hidden md:flex font-black rounded-xl border-white/20 text-white bg-transparent hover:bg-white/10 hover:text-white"
          >
            <Link href="/" target="_blank" rel="noopener noreferrer">
              <ExternalLink className="h-4 w-4 ml-2" />
              عرض الموقع
            </Link>
          </Button>

          {user && (
            <span className="hidden md:inline text-sm font-bold text-white/80 max-w-[140px] truncate">
              {user.name}
            </span>
          )}

          <Button
            variant="ghost"
            size="sm"
            onClick={handleLogout}
            className="hidden md:flex font-black text-red-300 hover:text-red-200 hover:bg-white/10 rounded-xl"
          >
            <LogOut className="h-4 w-4 ml-2" />
            خروج
          </Button>

          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden rounded-xl text-white hover:bg-white/10"
            onClick={() => setMobileOpen((o) => !o)}
            aria-label="القائمة"
          >
            {mobileOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </Button>
        </div>
      </div>

      {mobileOpen && (
        <nav className="lg:hidden border-t border-white/10 bg-[#1B3E7A] px-4 py-4 space-y-1 text-white">
          {adminLinks.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              onClick={() => setMobileOpen(false)}
              className={cn(
                "flex items-center gap-3 rounded-xl px-4 py-3 font-black transition-colors",
                isActive(href)
                  ? "bg-[#E28328] text-white"
                  : "text-white/80 hover:bg-white/10 hover:text-white",
              )}
            >
              <Icon className="h-5 w-5" />
              {label}
            </Link>
          ))}
          <Link
            href="/"
            onClick={() => setMobileOpen(false)}
            className="flex items-center gap-3 rounded-xl px-4 py-3 font-black text-white/80 hover:bg-white/10 hover:text-white"
          >
            <ExternalLink className="h-5 w-5" />
            عرض الموقع
          </Link>
          <button
            type="button"
            onClick={() => {
              setMobileOpen(false);
              handleLogout();
            }}
            className="flex w-full items-center gap-3 rounded-xl px-4 py-3 font-black text-red-300 hover:bg-white/10"
          >
            <LogOut className="h-5 w-5" />
            تسجيل الخروج
          </button>
        </nav>
      )}
    </header>
  );
}
