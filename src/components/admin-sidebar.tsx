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
  Bike,
  Users,
  Settings,
  LogOut,
  ExternalLink,
  Menu,
  X,
  TrendingUp,
} from "lucide-react";
import { useAuthStore } from "@/lib/store/authStore";
import { cn } from "@/lib/utils";

const adminLinks = [
  { href: "/admin/dashboard", label: "لوحة التحكم", icon: LayoutDashboard },
  { href: "/admin/cars", label: "السيارات", icon: Car },
  { href: "/admin/equipment", label: "المعدات", icon: Tractor },
  { href: "/admin/bikes", label: "الدراجات النارية", icon: Bike },
  { href: "/admin/showrooms", label: "المعارض", icon: Store },
  { href: "/admin/news", label: "الأخبار", icon: Newspaper },
  { href: "/admin/reports/showroom-clicks", label: "تقارير المعارض", icon: TrendingUp },
  { href: "/admin/users", label: "المستخدمون", icon: Users },
  { href: "/admin/settings", label: "الإعدادات", icon: Settings },
];

export function AdminSidebar() {
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

  const SidebarContent = () => (
    <div className="flex h-full flex-col bg-primary text-primary-foreground/80">
      <div className="flex h-24 items-center justify-center border-b border-primary-foreground/10 px-6 shrink-0">
        <Link href="/admin/dashboard" className="flex items-center gap-3">
          <Image
            src="/logo.png"
            alt="لوحة التحكم"
            width={160}
            height={50}
            className="h-auto w-auto max-h-[50px] object-contain drop-shadow-md brightness-0 invert opacity-90"
            priority
            unoptimized
          />
        </Link>
      </div>

      <div className="flex-1 overflow-y-auto py-8 px-4 space-y-1.5 custom-scrollbar">
        <div className="text-[10px] font-black text-primary-foreground/50 uppercase tracking-widest mb-4 px-2">
          القائمة الرئيسية
        </div>
        {adminLinks.map(({ href, label, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            onClick={() => setMobileOpen(false)}
            className={cn(
              "flex items-center gap-3.5 rounded-xl px-4 py-3.5 text-sm font-black transition-all duration-300 group relative overflow-hidden",
              isActive(href)
                ? "bg-[#E28328] text-white shadow-[0_0_20px_rgba(226,131,40,0.3)]"
                : "text-primary-foreground/70 hover:bg-white/10 hover:text-white",
            )}
          >
            {isActive(href) && (
              <div className="absolute right-0 top-0 h-full w-1 bg-white/30 rounded-l-full" />
            )}
            <Icon className={cn("h-5 w-5 transition-transform duration-300", isActive(href) ? "scale-110" : "group-hover:scale-110")} />
            <span className="relative z-10">{label}</span>
          </Link>
        ))}
      </div>

      <div className="border-t border-primary-foreground/10 py-4 px-6 space-y-2 shrink-0 bg-primary">
        <Button
          variant="ghost"
          asChild
          className="w-full justify-start text-primary-foreground/70 hover:text-white hover:bg-white/10 font-black rounded-xl h-12 transition-colors"
        >
          <Link href="/" target="_blank" rel="noopener noreferrer">
            <ExternalLink className="h-5 w-5 ml-3" />
            عرض الموقع
          </Link>
        </Button>
        <Button
          variant="ghost"
          onClick={handleLogout}
          className="w-full justify-start text-rose-300/90 hover:text-rose-200 hover:bg-rose-500/20 font-black rounded-xl h-12 transition-colors"
        >
          <LogOut className="h-5 w-5 ml-3" />
          تسجيل الخروج
        </Button>
        
        {user && (
          <div className="mt-5 pt-5 border-t border-primary-foreground/10 flex items-center gap-3 px-2">
            <div className="h-10 w-10 rounded-xl bg-white/10 flex items-center justify-center shadow-inner border border-white/5">
              <span className="font-black text-white text-lg">{user.name?.charAt(0) || 'A'}</span>
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-bold text-white truncate w-32">{user.name}</span>
              <span className="text-[10px] text-primary-foreground/60 font-bold truncate w-32 uppercase tracking-wide">{user.role === 'admin' ? 'مدير النظام' : user.role}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex fixed top-0 right-0 z-40 h-screen w-72 flex-col shadow-2xl shadow-primary/20">
        <SidebarContent />
      </aside>

      {/* Mobile Header */}
      <header className="lg:hidden fixed top-0 z-40 w-full h-16 bg-primary border-b border-primary-foreground/10 flex items-center justify-between px-4 shadow-md">
        <Link href="/admin/dashboard">
          <Image
            src="/logo.png"
            alt="لوحة التحكم"
            width={120}
            height={40}
            unoptimized
            className="h-auto w-auto max-h-10 object-contain brightness-0 invert opacity-90"
          />
        </Link>
        <Button
          variant="ghost"
          size="icon"
          className="text-primary-foreground/80 hover:bg-white/10 rounded-xl"
          onClick={() => setMobileOpen((o) => !o)}
        >
          {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </Button>
      </header>

      {/* Mobile Sidebar Overlay */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm transition-opacity" onClick={() => setMobileOpen(false)} />
          <aside className="relative w-72 max-w-[85%] bg-primary h-full flex flex-col shadow-2xl animate-in slide-in-from-right-full duration-300">
             <SidebarContent />
          </aside>
        </div>
      )}
    </>
  );
}
