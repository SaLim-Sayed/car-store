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
 <header className="fixed top-0 z-40 w-full border-b border-gray-100 bg-white/95 backdrop-blur-xl shadow-none">
 <div className="container mx-auto flex h-16 items-center justify-between gap-4 px-4 md:h-[4.5rem]">
 <div className="flex items-center gap-3 md:gap-8">
 <Link
 href="/admin/dashboard"
 className="flex items-center gap-3 shrink-0"
 >
 <div className="relative h-10 w-10 md:h-12 md:w-12 overflow-hidden rounded-md border-2 border-primary/20 shadow-none">
 <Image
 src="/logo-maarad-sayarat.png"
 alt="لوحة التحكم"
 fill
 className="object-cover"
 />
 </div>
 <div className="hidden sm:block text-right">
 <p className="text-xs font-bold text-muted-foreground">
 لوحة الإدارة
 </p>
 <p className="text-lg font-[1000] leading-tight">سيارات المنيا</p>
 </div>
 </Link>

 <nav className="hidden lg:flex items-center gap-1">
 {adminLinks.map(({ href, label, icon: Icon }) => (
 <Link
 key={href}
 href={href}
 className={cn(
 "flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-black transition-colors",
 isActive(href)
 ? "bg-primary text-white shadow-none shadow-primary/20"
 : "text-muted-foreground hover:bg-gray-50 hover:text-foreground",
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
 className="hidden md:flex font-black rounded-xl"
 >
 <Link href="/" target="_blank" rel="noopener noreferrer">
 <ExternalLink className="h-4 w-4 ml-2" />
 عرض الموقع
 </Link>
 </Button>

 {user && (
 <span className="hidden md:inline text-sm font-bold text-muted-foreground max-w-[140px] truncate">
 {user.name}
 </span>
 )}

 <Button
 variant="ghost"
 size="sm"
 onClick={handleLogout}
 className="hidden md:flex font-black text-destructive hover:text-destructive hover:bg-destructive/10 rounded-xl"
 >
 <LogOut className="h-4 w-4 ml-2" />
 خروج
 </Button>

 <Button
 variant="ghost"
 size="icon"
 className="lg:hidden rounded-xl"
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
 <nav className="lg:hidden border-t border-gray-100 bg-white px-4 py-4 space-y-1">
 {adminLinks.map(({ href, label, icon: Icon }) => (
 <Link
 key={href}
 href={href}
 onClick={() => setMobileOpen(false)}
 className={cn(
 "flex items-center gap-3 rounded-xl px-4 py-3 font-black",
 isActive(href)
 ? "bg-primary text-white"
 : "text-muted-foreground hover:bg-gray-50",
 )}
 >
 <Icon className="h-5 w-5" />
 {label}
 </Link>
 ))}
 <Link
 href="/"
 onClick={() => setMobileOpen(false)}
 className="flex items-center gap-3 rounded-xl px-4 py-3 font-black text-muted-foreground hover:bg-gray-50"
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
 className="flex w-full items-center gap-3 rounded-xl px-4 py-3 font-black text-destructive hover:bg-destructive/10"
 >
 <LogOut className="h-5 w-5" />
 تسجيل الخروج
 </button>
 </nav>
 )}
 </header>
 );
}
