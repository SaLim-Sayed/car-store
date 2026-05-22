"use client";

import { GlobalSearch } from "@/components/global-search";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuthStore } from "@/lib/store/authStore";
import { cn } from "@/lib/utils";
import {
  LogOut,
  Menu,
  PlusCircle,
  Settings,
  User,
  X,
  ChevronLeft,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

export function Navbar() {
  const pathname = usePathname();
  const { user, isAuthenticated, logout } = useAuthStore();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const y = window.scrollY;
      setIsScrolled((prev) => {
        if (y > 60) return true;
        if (y < 40) return false;
        return prev;
      });
    };
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
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
  const textColor = "text-white";
  const logoBorderColor = "border-white/30";

  const [showNavbarSearch, setShowNavbarSearch] = useState(!isHomePage);

  useEffect(() => {
    if (isHomePage && isScrolled) {
      setShowNavbarSearch(true);
    } else if (!isHomePage && isScrolled) {
      setShowNavbarSearch(true);
    } else {
      setShowNavbarSearch(false);
    }
  }, [isHomePage, isScrolled]);

  return (
    <header className="fixed top-0 z-[50] w-full overflow-visible transition-all duration-500 bg-[#1B3E7A] text-white shadow-none">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-12 md:h-16">
          <div className="flex items-center gap-3 md:gap-12">
            <Link
              href="/"
              className="flex items-center gap-2 md:gap-4 transition-all"
            >
              <div className="relative hidden sm:block rounded-md overflow-hidden shrink-0">
                <Image
                  src="/logo.png"
                  alt="سيارات المنيا"
                  width={250}
                  height={200}
                  priority
                />
              </div>
              <div className="relative block sm:hidden rounded-md overflow-hidden shrink-0">
                <Image
                  src="/logo.png"
                  alt="سيارات المنيا"
                  width={150}
                  height={150}
                  priority
                />
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-10 mr-12">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`text-xl font-bold transition-all duration-500 relative group py-2 ${
                    pathname === link.href
                      ? "text-white"
                      : "text-white/80 hover:text-white"
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
            {/* <div className="hidden md:block">
              <ThemeToggle />
            </div> */}

            {isAuthenticated ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    className={`h-9 md:h-14 px-3 md:px-7 bg-primary rounded-md gap-2 md:gap-4 font-[1000] text-sm md:text-xl transition-all duration-500 ${textColor.includes("white") ? "text-white " : "text-foreground     shadow-none"}`}
                  >
                    <div className="h-9 w-9 rounded-md bg-primary shadow-none shadow-primary/30 flex items-center justify-center">
                      <User className="h-5 w-5 text-white" />
                    </div>
                    <span className="hidden lg:inline-block">{user?.name}</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="end"
                  className="w-72 rounded-md py-4 px-6 border-0 shadow-none mt-5 bg-white/95 backdrop-blur-xl"
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
                          <div className="h-10 w-10 rounded-md bg-primary/10 flex items-center justify-center group- transition-transform">
                            <PlusCircle className="h-5 w-5 text-primary" />
                          </div>
                          <span className="font-black text-lg">
                            إضافة سيارة
                          </span>
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
                          <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center group- transition-transform">
                            <Settings className="h-5 w-5 text-primary" />
                          </div>
                          <span className="font-black text-lg">
                            لوحة التحكم
                          </span>
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
                    <span className="font-black text-lg ml-auto mr-4">
                      تسجيل الخروج
                    </span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button
                variant="outline"
                size="lg"
                asChild
                className="hidden sm:flex rounded-md h-10 md:h-12 px-5 md:px-8 text-sm md:text-lg font-bold transition-all duration-500 shadow-none hover:shadow-none text-white border-white/40 bg-white/10 hover:bg-white/20"
              >
                <Link href="/auth/login">تسجيل الدخول</Link>
              </Button>
            )}

            {/* Mobile Menu Toggle Button */}
            <Button
              variant="ghost"
              size="icon"
              className={`md:hidden h-10 w-10 rounded-md transition-all duration-500 ${textColor.includes("white") ? "text-white hover:bg-white/15" : "text-foreground bg-gray-100/70 hover:bg-gray-200"}`}
              onClick={() => setIsMobileMenuOpen((o) => !o)}
              aria-label="القائمة"
            >
              {isMobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </Button>
          </div>
        </div>

        <div
          className={cn(
            "hidden md:block overflow-hidden transition-[max-height,opacity,padding] duration-300",
            showNavbarSearch
              ? "max-h-20 opacity-100 pb-3 pt-1"
              : "max-h-0 opacity-0 pb-0 pt-0 pointer-events-none",
          )}
        >
          <GlobalSearch
            variant="navbar"
            onNavigate={() => setIsMobileMenuOpen(false)}
          />
        </div>
      </div>
      {isMobileMenuOpen && (
        <nav className="md:hidden border-t border-white/10 bg-[#1B3E7A] px-4 py-4 space-y-1 text-white flex flex-col gap-2">
          {/* Admin Dashboard Quick Access inside client mobile drawer */}
          {isAuthenticated && user?.role === "admin" && (
            <Link
              href="/admin/dashboard"
              onClick={() => setIsMobileMenuOpen(false)}
              className="flex items-center justify-between px-5 py-3 rounded-xl text-lg font-black transition-all bg-[#E28328] text-white shadow-sm mb-2"
            >
              <span className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                لوحة التحكم
              </span>
              <ChevronLeft className="h-5 w-5" />
            </Link>
          )}

          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`flex items-center justify-between px-5 py-3 rounded-xl text-lg font-black transition-all ${
                  isActive
                    ? "bg-[#E28328] text-white shadow-none"
                    : "text-white/80 hover:bg-white/10 hover:text-white"
                }`}
              >
                {link.label}
                {isActive && (
                  <div className="h-1.5 w-1.5 md:h-2 md:w-2 rounded-full bg-white" />
                )}
              </Link>
            );
          })}

          {!isAuthenticated && (
            <Link
              href="/auth/login"
              onClick={() => setIsMobileMenuOpen(false)}
              className="mt-4 flex items-center justify-center gap-3 px-5 py-3.5 rounded-xl text-lg font-black bg-[#E28328] text-white shadow-none transition-all hover:bg-[#E28328]/90"
            >
              <User className="h-6 w-6" />
              تسجيل الدخول
            </Link>
          )}

          {isAuthenticated && (
            <div className="px-5 pb-4 pt-4 border-t border-white/10 bg-white/5 rounded-xl mt-4">
              <div className="flex items-center gap-4 mb-4">
                <div className="h-12 w-12 rounded-xl bg-[#E28328] shadow-none flex items-center justify-center shrink-0">
                  <User className="h-6 w-6 text-white" />
                </div>
                <div className="flex flex-col min-w-0 flex-1 text-right text-white">
                  <span className="text-base font-black truncate">
                    {user?.name}
                  </span>
                  <span className="text-xs text-white/60 font-bold truncate">
                    {user?.email}
                  </span>
                </div>
              </div>
              <Button
                variant="ghost"
                className="w-full h-11 rounded-xl text-red-300 hover:text-red-200 hover:bg-white/10 gap-3 text-sm font-black bg-transparent border border-red-500/20 shadow-none transition-all"
                onClick={() => {
                  logout();
                  setIsMobileMenuOpen(false);
                }}
              >
                <LogOut className="h-5 w-5" />
                تسجيل الخروج
              </Button>
            </div>
          )}
        </nav>
      )}
    </header>
  );
}
