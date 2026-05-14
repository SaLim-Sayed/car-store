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
    { href: "/news", label: "الأخبار" },
  ];

  return (
    <header
      className={`fixed top-0 z-50 w-full transition-all duration-300 ${
        isScrolled
          ? "bg-background/95 backdrop-blur border-b supports-[backdrop-filter]:bg-background/60 py-2"
          : "bg-transparent py-4"
      }`}
    >
      <div className="container mx-auto flex h-20 items-center justify-between">
        <div className="flex items-center gap-12">
          <Link
            href="/"
            className="flex items-center gap-4 transition-transform hover:scale-105"
          >
            <div
              className={`relative h-14 w-14 rounded-full overflow-hidden border-2 transition-all ${isScrolled ? "border-primary shadow-lg" : "border-white/30 shadow-2xl"}`}
            >
              <Image
                src="/logo-maarad-sayarat.png"
                alt="سيارات المنيا"
                fill
                className="object-cover"
              />
            </div>
            <span
              className={`font-[1000] text-2xl tracking-tighter transition-colors ${isScrolled ? "text-foreground" : "text-white"}`}
            >
              سيارات المنيا
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8 mr-12">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`text-lg font-black transition-all hover:text-primary relative group ${
                  pathname === link.href
                    ? isScrolled
                      ? "text-primary"
                      : "text-white"
                    : isScrolled
                      ? "text-muted-foreground"
                      : "text-white/80"
                }`}
              >
                {link.label}
                <span
                  className={`absolute -bottom-2 right-0 h-1 bg-primary transition-all duration-300 ${pathname === link.href ? "w-full" : "w-0 group-hover:w-full"}`}
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
                    className={`h-12 px-6 rounded-2xl gap-3 font-black text-lg transition-all ${!isScrolled ? "text-white hover:bg-white/10" : "bg-gray-50"}`}
                  >
                    <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center">
                      <User className="h-5 w-5 text-primary" />
                    </div>
                    <span className="hidden sm:inline-block">{user?.name}</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="end"
                  className="w-64 rounded-[2rem] p-4 border-0 shadow-2xl mt-4"
                >
                  <DropdownMenuLabel className="font-normal p-4">
                    <div className="flex flex-col space-y-2">
                      <p className="text-lg font-black leading-none">
                        {user?.name}
                      </p>
                      <p className="text-sm leading-none text-muted-foreground font-medium">
                        {user?.email}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator className="my-2" />
                  {user?.role === "admin" && (
                    <>
                      <DropdownMenuItem
                        asChild
                        className="rounded-xl p-3 cursor-pointer"
                      >
                        <Link
                          href="/admin/cars"
                          className="w-full flex items-center gap-3"
                        >
                          <PlusCircle className="h-5 w-5 text-primary" />
                          <span className="font-bold">إضافة سيارة</span>
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        asChild
                        className="rounded-xl p-3 cursor-pointer"
                      >
                        <Link
                          href="/admin/dashboard"
                          className="w-full flex items-center gap-3"
                        >
                          <Settings className="h-5 w-5 text-primary" />
                          <span className="font-bold">لوحة التحكم</span>
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator className="my-2" />
                    </>
                  )}
                  <DropdownMenuItem
                    onClick={handleLogout}
                    className="rounded-xl p-3 text-destructive cursor-pointer hover:bg-destructive/10"
                  >
                    <LogOut className="h-5 w-5 ml-3" />
                    <span className="font-bold">تسجيل الخروج</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button
                variant={isScrolled ? "default" : "outline"}
                size="lg"
                asChild
                className={`rounded-2xl h-12 px-8 text-lg font-black transition-all ${
                  !isScrolled
                    ? "text-white border-white/40 hover:bg-white/10"
                    : "bg-[#1A1A1A] hover:bg-black text-white"
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
                  className={`md:hidden h-12 w-12 rounded-2xl ${!isScrolled ? "text-white" : "bg-gray-50"}`}
                >
                  <Menu className="h-8 w-8" />
                </Button>
              </DialogTrigger>
              <DialogContent
                className="fixed top-0 right-0 h-full w-[320px] rounded-none border-l shadow-2xl p-0 overflow-hidden flex flex-col bg-white"
                showCloseButton={false}
              >
                <div className="flex items-center justify-between p-6 border-b">
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-full border-2 border-primary overflow-hidden relative">
                      <Image
                        src="/logo-maarad-sayarat.png"
                        alt="Logo"
                        fill
                        className="object-cover"
                      />
                    </div>
                    <span className="font-black text-xl tracking-tighter">
                      سيارات المنيا
                    </span>
                  </div>
                  <Button
                    variant="secondary"
                    size="icon"
                    className="rounded-xl h-10 w-10"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <X className="h-6 w-6" />
                  </Button>
                </div>

                <div className="flex-1 overflow-y-auto p-6">
                  <nav className="flex flex-col gap-3">
                    {navLinks.map((link) => {
                      return (
                        <Link
                          key={link.href}
                          href={link.href}
                          onClick={() => setIsMobileMenuOpen(false)}
                          className={`flex items-center gap-4 px-6 py-4 rounded-2xl text-xl font-black transition-all ${
                            pathname === link.href
                              ? "bg-primary/10 text-primary"
                              : "text-muted-foreground hover:bg-gray-50"
                          }`}
                        >
                          {link.label}
                        </Link>
                      );
                    })}

                    {!isAuthenticated && (
                      <Link
                        href="/auth/login"
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="mt-4 flex items-center gap-4 px-6 py-5 rounded-2xl text-xl font-black bg-[#1A1A1A] text-white shadow-xl"
                      >
                        <User className="h-6 w-6" />
                        تسجيل الدخول
                      </Link>
                    )}
                  </nav>
                </div>

                {isAuthenticated && (
                  <div className="p-6 border-t bg-gray-50/50">
                    <div className="flex items-center gap-4 mb-6 px-2">
                      <div className="h-14 w-14 rounded-2xl bg-white shadow-sm flex items-center justify-center">
                        <User className="h-8 w-8 text-primary" />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-lg font-black">{user?.name}</span>
                        <span className="text-sm text-muted-foreground font-medium truncate max-w-[180px]">
                          {user?.email}
                        </span>
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      className="w-full h-14 rounded-2xl text-destructive hover:text-destructive hover:bg-destructive/10 gap-3 text-lg font-black border-2 border-transparent bg-white shadow-sm"
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
