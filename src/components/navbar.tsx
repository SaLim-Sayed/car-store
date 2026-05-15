"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";
import { useAuthStore } from "@/lib/store/authStore";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  User,
  Car,
  LogOut,
  Settings,
  PlusCircle,
  Menu,
  X,
  Mail,
} from "lucide-react";

export function Navbar() {
  const pathname = usePathname();
  const { user, isAuthenticated, logout } = useAuthStore();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
    } catch {
      // ignore network errors during logout
    }
    logout();
  };

  const navLinks = [
    { href: "/", label: "الرئيسية" },
    { href: "/cars", label: "السيارات" },
    { href: "/showrooms", label: "المعارض" },
    { href: "/equipment", label: "آلات زراعية" },
    { href: "/news", label: "الأخبار" },
  ];

  const isHomePage = pathname === "/";
  const textColor = isScrolled || !isHomePage ? "text-foreground" : "text-white";
  const logoBorderColor = isScrolled || !isHomePage ? "border-primary/20" : "border-white/30";

  return (
    <header
      className={`fixed top-0 z-50 w-full transition-all duration-500 ${
        isScrolled
          ? "bg-white/80 backdrop-blur-2xl border-b border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)]"
          : isHomePage 
            ? "bg-transparent "
            : "bg-white/50 backdrop-blur-xl border-b border-gray-50 "
      }`}
    >
      <div className="container mx-auto flex items-center justify-between px-4 h-12 md:h-20">
        <div className="flex items-center gap-3 md:gap-12">
          <Link
            href="/"
            className="flex items-center gap-3 md:gap-5 transition-all hover:scale-105 active:scale-95"
          >
            <div
              className={`relative h-11 w-11 md:h-16 md:w-16 rounded-md overflow-hidden border-2 transition-all duration-500 ${logoBorderColor} shadow-xl`}
            >
              <Image
                src="/logo-maarad-sayarat.png"
                alt="سيارات المنيا"
                fill
                className="object-cover"
              />
            </div>
            <span
              className={`hidden md:inline-block font-[1000] text-xl md:text-3xl tracking-tighter transition-colors duration-500 ${textColor}`}
            >
              سيارات المنيا
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-10 mr-12">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`text-xl font-black transition-all duration-500 hover:text-primary relative group py-2 ${
                  pathname === link.href
                    ? textColor.includes("white") ? "text-white" : "text-primary"
                    : textColor.includes("white") ? "text-white/70" : "text-muted-foreground"
                }`}
              >
                {link.label}
                <span
                  className={`absolute -bottom-1 right-0 h-1 bg-primary rounded-full transition-all duration-500 shadow-[0_0_12px_rgba(217,119,6,0.4)] ${pathname === link.href ? "w-full" : "w-0 group-hover:w-full"}`}
                />
              </Link>
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-2 md:gap-4">
          <div className="flex items-center gap-2 md:gap-4">
            <div className="hidden md:block">
              <ThemeToggle />
            </div>

            {isAuthenticated ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className={`h-11 md:h-14 px-4 md:px-7 rounded-md gap-2 md:gap-4 font-[1000] text-base md:text-xl transition-all duration-500 active:scale-95 ${textColor.includes("white") ? "text-white hover:bg-white/15" : "text-foreground bg-gray-50 hover:bg-gray-100 shadow-sm"}`}
                  >
                    <div className="h-9 w-9 rounded-md bg-primary shadow-lg shadow-primary/30 flex items-center justify-center">
                      <User className="h-5 w-5 text-white" />
                    </div>
                    <span className="hidden lg:inline-block">{user?.name}</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="end"
                  className="w-72 rounded-md p-5 border-0 shadow-2xl mt-5 bg-white/95 backdrop-blur-xl"
                >
                  <DropdownMenuLabel className="font-normal p-4 pt-2">
                    <div className="flex flex-col space-y-2">
                      <p className="text-xl font-black leading-none text-foreground">
                        {user?.name}
                      </p>
                      <p className="text-sm leading-none text-muted-foreground font-bold opacity-70">
                        {user?.email}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator className="my-3 opacity-50" />
                  {user?.role === "admin" && (
                    <>
                      <DropdownMenuItem
                        asChild
                        className="rounded-md p-4 cursor-pointer focus:bg-primary/5 transition-colors"
                      >
                        <Link
                          href="/admin/cars/new"
                          className="w-full flex items-center gap-4 group"
                        >
                          <div className="h-10 w-10 rounded-md bg-primary/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                            <PlusCircle className="h-5 w-5 text-primary" />
                          </div>
                          <span className="font-black text-lg">إضافة سيارة</span>
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        asChild
                        className="rounded-2xl p-4 cursor-pointer focus:bg-primary/5 transition-colors"
                      >
                        <Link
                          href="/admin/dashboard"
                          className="w-full flex items-center gap-4 group"
                        >
                          <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                            <Settings className="h-5 w-5 text-primary" />
                          </div>
                          <span className="font-black text-lg">لوحة التحكم</span>
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator className="my-3 opacity-50" />
                    </>
                  )}
                  <DropdownMenuItem
                    onClick={handleLogout}
                    className="rounded-md p-4 text-destructive cursor-pointer hover:bg-destructive/10 focus:bg-destructive/5 transition-colors"
                  >
                    <div className="h-10 w-10 rounded-md bg-destructive/10 flex items-center justify-center">
                      <LogOut className="h-5 w-5" />
                    </div>
                    <span className="font-black text-lg ml-auto mr-4">تسجيل الخروج</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button
                variant={isScrolled ? "default" : "outline"}
                size="lg"
                asChild
                className={`flex rounded-md h-10 md:h-14 px-5 md:px-10 text-sm md:text-xl font-[1000] transition-all duration-500 shadow-xl hover:shadow-2xl active:scale-95 ${
                  textColor.includes("white")
                    ? "text-white border-white/40 bg-white/10 hover:bg-white/20"
                    : "bg-[#1A1A1A] hover:bg-black text-white shadow-black/10"
                }`}
              >
                <Link href="/auth/login">تسجيل الدخول</Link>
              </Button>
            )}

            {/* Mobile Menu Drawer */}
            <Dialog open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
              <DialogTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className={`md:hidden h-10 w-10 rounded-md transition-all duration-500 active:scale-95 ${textColor.includes("white") ? "text-white hover:bg-white/15" : "text-foreground bg-gray-100/70 hover:bg-gray-200"}`}
                >
                  <Menu className="h-7 w-7" />
                </Button>
              </DialogTrigger>
              <DialogContent
                dir="rtl"
                className="fixed top-0 left-0 h-[100svh] w-[85vw] max-w-[340px] translate-x-0 translate-y-0 rounded-none rounded-r-md border-0 shadow-[0_0_60px_rgba(0,0,0,0.2)] p-0 overflow-hidden flex flex-col bg-white/98 backdrop-blur-3xl data-open:animate-in data-open:slide-in-from-left duration-500"
                showCloseButton={false}
              >
                <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-md border-2 border-primary/20 overflow-hidden relative shadow-lg">
                      <Image
                        src="/logo-maarad-sayarat.png"
                        alt="Logo"
                        fill
                        className="object-cover"
                      />
                    </div>
                    <span className="font-[1000] text-xl tracking-tighter">
                      سيارات المنيا
                    </span>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="rounded-md h-10 w-10 hover:bg-gray-100"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <X className="h-6 w-6" />
                  </Button>
                </div>

                <div className="flex-1 overflow-y-auto px-6 py-6">
                  <nav className="flex flex-col gap-2">
                    {navLinks.map((link) => {
                      const isActive = pathname === link.href;
                      return (
                        <Link
                          key={link.href}
                          href={link.href}
                          onClick={() => setIsMobileMenuOpen(false)}
                          className={`flex items-center justify-between px-5 py-4 rounded-md text-xl font-black transition-all active:scale-95 ${
                            isActive
                              ? "bg-primary text-white shadow-lg shadow-primary/25"
                              : "text-muted-foreground hover:bg-gray-50 hover:text-foreground"
                          }`}
                        >
                          {link.label}
                          {isActive && <div className="h-2 w-2 rounded-full bg-white" />}
                        </Link>
                      );
                    })}

                    {!isAuthenticated && (
                      <Link
                        href="/auth/login"
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="mt-4 flex items-center justify-center gap-3 px-5 py-4 rounded-md text-xl font-black bg-[#1A1A1A] text-white shadow-xl active:scale-95 transition-all"
                      >
                        <User className="h-6 w-6" />
                        تسجيل الدخول
                      </Link>
                    )}
                  </nav>
                </div>

                {isAuthenticated && (
                  <div className="px-6 pb-8 pt-5 border-t border-gray-100 bg-gray-50/50">
                    <div className="flex items-center gap-4 mb-6">
                      <div className="h-14 w-14 rounded-2xl bg-primary shadow-lg shadow-primary/20 flex items-center justify-center shrink-0">
                        <User className="h-7 w-7 text-white" />
                      </div>
                      <div className="flex flex-col min-w-0 flex-1 text-right">
                        <span className="text-lg font-black truncate">{user?.name}</span>
                        <span className="text-xs text-muted-foreground font-bold opacity-70 truncate">
                          {user?.email}
                        </span>
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      className="w-full h-14 rounded-md text-destructive hover:text-destructive hover:bg-destructive/10 gap-3 text-lg font-black border-2 border-transparent bg-white shadow-lg active:scale-95 transition-all"
                      onClick={() => {
                        handleLogout();
                        setIsMobileMenuOpen(false);
                      }}
                    >
                      <LogOut className="h-6 w-6" />
                      تسجيل الخروج
                    </Button>
                  </div>
                )}
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </div>
    </header>
  );
}
