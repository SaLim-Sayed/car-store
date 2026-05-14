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

  const handleLogout = () => {
    logout();
  };

  const navLinks = [
    { href: "/", label: "الرئيسية" },
    { href: "/cars", label: "السيارات" },
    { href: "/showrooms", label: "المعارض" },
    { href: "/news", label: "الأخبار" },
  ];

  const isHomePage = pathname === "/";
  const textColor = isScrolled || !isHomePage ? "text-foreground" : "text-white";
  const logoBorderColor = isScrolled || !isHomePage ? "border-primary/20" : "border-white/30";

  return (
    <header
      className={`fixed top-0 z-50 w-full transition-all duration-500 ${
        isScrolled
          ? "bg-white/80 backdrop-blur-2xl border-b border-gray-100 py-3 shadow-[0_8px_30px_rgb(0,0,0,0.04)]"
          : isHomePage 
            ? "bg-transparent py-6"
            : "bg-white/50 backdrop-blur-xl border-b border-gray-50 py-4"
      }`}
    >
      <div className="container mx-auto flex h-20 items-center justify-between">
        <div className="flex items-center gap-12">
          <Link
            href="/"
            className="flex items-center gap-5 transition-all hover:scale-105 active:scale-95"
          >
            <div
              className={`relative h-16 w-16 rounded-[1.5rem] overflow-hidden border-2 transition-all duration-500 ${logoBorderColor} shadow-xl`}
            >
              <Image
                src="/logo-maarad-sayarat.png"
                alt="سيارات المنيا"
                fill
                className="object-cover"
              />
            </div>
            <span
              className={`font-[1000] text-3xl tracking-tighter transition-colors duration-500 ${textColor}`}
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

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-4">
            <ThemeToggle />

            {isAuthenticated ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className={`h-14 px-7 rounded-2xl gap-4 font-[1000] text-xl transition-all duration-500 active:scale-95 ${textColor.includes("white") ? "text-white hover:bg-white/15" : "text-foreground bg-gray-50 hover:bg-gray-100 shadow-sm"}`}
                  >
                    <div className="h-9 w-9 rounded-xl bg-primary shadow-lg shadow-primary/30 flex items-center justify-center">
                      <User className="h-5 w-5 text-white" />
                    </div>
                    <span className="hidden lg:inline-block">{user?.name}</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="end"
                  className="w-72 rounded-[2.5rem] p-5 border-0 shadow-2xl mt-5 bg-white/95 backdrop-blur-xl"
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
                        className="rounded-2xl p-4 cursor-pointer focus:bg-primary/5 transition-colors"
                      >
                        <Link
                          href="/admin/cars/new"
                          className="w-full flex items-center gap-4 group"
                        >
                          <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center group-hover:scale-110 transition-transform">
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
                    className="rounded-2xl p-4 text-destructive cursor-pointer hover:bg-destructive/10 focus:bg-destructive/5 transition-colors"
                  >
                    <div className="h-10 w-10 rounded-xl bg-destructive/10 flex items-center justify-center">
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
                className={`rounded-2xl h-14 px-10 text-xl font-[1000] transition-all duration-500 shadow-xl hover:shadow-2xl active:scale-95 ${
                  textColor.includes("white")
                    ? "text-white border-white/30 hover:bg-white/10 shadow-white/5"
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
                  className={`md:hidden h-14 w-14 rounded-2xl transition-all duration-500 active:scale-95 ${textColor.includes("white") ? "text-white" : "text-foreground bg-gray-100/50"}`}
                >
                  <Menu className="h-9 w-9" />
                </Button>
              </DialogTrigger>
              <DialogContent
                className="fixed top-0 right-0 h-full w-[340px] rounded-none border-l-0 shadow-[0_0_50px_rgba(0,0,0,0.1)] p-0 overflow-hidden flex flex-col bg-white/95 backdrop-blur-2xl"
                showCloseButton={false}
              >
                <div className="flex items-center justify-between p-8 border-b border-gray-100">
                  <div className="flex items-center gap-5">
                    <div className="h-14 w-14 rounded-[1.2rem] border-2 border-primary/20 overflow-hidden relative shadow-lg">
                      <Image
                        src="/logo-maarad-sayarat.png"
                        alt="Logo"
                        fill
                        className="object-cover"
                      />
                    </div>
                    <span className="font-[1000] text-2xl tracking-tighter">
                      سيارات المنيا
                    </span>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="rounded-xl h-12 w-12 hover:bg-gray-100"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <X className="h-7 w-7" />
                  </Button>
                </div>

                <div className="flex-1 overflow-y-auto p-8 pt-10">
                  <nav className="flex flex-col gap-4">
                    {navLinks.map((link) => {
                      const isActive = pathname === link.href;
                      return (
                        <Link
                          key={link.href}
                          href={link.href}
                          onClick={() => setIsMobileMenuOpen(false)}
                          className={`flex items-center justify-between px-7 py-5 rounded-[2rem] text-2xl font-black transition-all active:scale-95 ${
                            isActive
                              ? "bg-primary text-white shadow-xl shadow-primary/30"
                              : "text-muted-foreground hover:bg-gray-50"
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
                        className="mt-6 flex items-center justify-center gap-4 px-7 py-6 rounded-[2rem] text-2xl font-black bg-[#1A1A1A] text-white shadow-2xl active:scale-95 transition-all"
                      >
                        <User className="h-7 w-7" />
                        تسجيل الدخول
                      </Link>
                    )}
                  </nav>
                </div>

                {isAuthenticated && (
                  <div className="p-8 border-t border-gray-100 bg-gray-50/30">
                    <div className="flex items-center gap-5 mb-8 px-2">
                      <div className="h-16 w-16 rounded-2xl bg-primary shadow-xl shadow-primary/20 flex items-center justify-center">
                        <User className="h-9 w-9 text-white" />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-xl font-black">{user?.name}</span>
                        <span className="text-sm text-muted-foreground font-bold opacity-70 truncate max-w-[180px]">
                          {user?.email}
                        </span>
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      className="w-full h-16 rounded-[2rem] text-destructive hover:text-destructive hover:bg-destructive/10 gap-4 text-xl font-black border-2 border-transparent bg-white shadow-xl active:scale-95 transition-all"
                      onClick={() => {
                        handleLogout();
                        setIsMobileMenuOpen(false);
                      }}
                    >
                      <LogOut className="h-7 w-7" />
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
