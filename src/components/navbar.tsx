"use client";

import { GlobalSearch } from "@/components/global-search";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/lib/store/authStore";
import { cn } from "@/lib/utils";
import { ChevronLeft, Menu, Settings, X, Home, Car, Store, Tractor, Bike, Newspaper } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState, useRef } from "react";

export function Navbar() {
  const pathname = usePathname();
  const { user, isAuthenticated, logout } = useAuthStore();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const navRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (isMobileMenuOpen && navRef.current && !navRef.current.contains(event.target as Node)) {
        setIsMobileMenuOpen(false);
      }
    };
    
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isMobileMenuOpen]);

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
    { href: "/", label: "الرئيسية", icon: Home },
    { href: "/cars", label: "السيارات", icon: Car },
    { href: "/showrooms", label: "المعارض", icon: Store },
    { href: "/equipment", label: "المعدات الثقيلة", icon: Tractor },
    { href: "/bikes", label: "الدراجات النارية", icon: Bike },
    { href: "/news", label: "الأخبار", icon: Newspaper },
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
    <>
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 z-[40] bg-black/50 backdrop-blur-sm transition-opacity lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
          aria-hidden="true"
        />
      )}
      <header ref={navRef} className="fixed top-0 z-[50] w-full overflow-visible transition-all duration-500 bg-[#1B3E7A]/95 backdrop-blur-md border-b border-white/10 text-white shadow-sm">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-12 lg:h-16">
            <div className="flex items-center gap-3 lg:gap-6 min-w-0">
            <Link
              href="/"
              className="flex items-center gap-2 lg:gap-3 transition-all shrink-0"
            >
              <div className="relative hidden lg:block rounded-md overflow-hidden shrink-0 w-[200px] xl:w-[320px]">
                <Image
                  src="/logo.png"
                  alt="سيارات المنيا"
                  width={320}
                  height={256}
                  priority
                  className="w-full h-auto object-contain"
                />
              </div>
              <div className="relative block lg:hidden rounded-md overflow-hidden shrink-0 w-[160px] sm:w-[200px]">
                <Image
                  src="/logo.png"
                  alt="سيارات المنيا"
                  width={200}
                  height={160}
                  priority
                  className="w-full h-auto object-contain"
                />
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center lg:gap-2 xl:gap-4 lg:mr-4 xl:mr-8 shrink-0">
              {navLinks.map((link) => {
                const Icon = link.icon;
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`flex items-center gap-2 px-3 py-2 rounded-xl text-sm xl:text-base font-black transition-all duration-300 group ${
                      isActive
                        ? "bg-white/15 text-white shadow-inner"
                        : "text-white/80 hover:bg-white/10 hover:text-white"
                    }`}
                  >
                    <Icon className={`h-4 w-4 ${isActive ? "text-white" : "text-white/70 group-hover:text-white transition-colors duration-300"}`} />
                    {link.label}
                  </Link>
                );
              })}
            </nav>
          </div>

          <div className="flex items-center gap-2 lg:gap-4 shrink-0">
            {/* <div className="hidden lg:block">
              <ThemeToggle />
            </div> */}

            {/* {isAuthenticated ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    className={`h-9 lg:h-9 xl:h-11 px-3 lg:px-4 xl:px-5 bg-primary rounded-md gap-2 font-black text-sm lg:text-sm xl:text-base transition-all duration-500 ${textColor.includes("white") ? "text-white " : "text-foreground shadow-none"}`}
                  >
                    <div className="h-7 w-7 rounded-md bg-primary/20 flex items-center justify-center">
                      <User className="h-4.5 w-4.5 text-white" />
                    </div>
                    <span className="hidden xl:inline-block">{user?.name}</span>
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
                className="hidden lg:flex rounded-md lg:h-9 lg:px-3 xl:h-10 xl:px-6 text-xs xl:text-sm font-black transition-all duration-500 shadow-none hover:shadow-none text-white border-white/40 bg-white/10 hover:bg-white/20"
              >
                <Link href="/auth/login">تسجيل الدخول</Link>
              </Button>
            )} */}

            {/* Mobile Menu Toggle Button */}
            <Button
              variant="ghost"
              size="icon"
              className={`lg:hidden h-10 w-10 rounded-md transition-all duration-500 ${textColor.includes("white") ? "text-white hover:bg-white/15" : "text-foreground bg-gray-100/70 hover:bg-gray-200"}`}
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
            "hidden lg:block overflow-hidden transition-[max-height,opacity,padding] duration-300",
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
        <nav className="lg:hidden border-t border-white/10 bg-[#1B3E7A] px-4 py-4 space-y-1 text-white flex flex-col gap-2">
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
            const Icon = link.icon;
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`flex items-center gap-3 px-5 py-3 rounded-xl text-lg font-black transition-all ${
                  isActive
                    ? "bg-white/15 text-white shadow-inner"
                    : "text-white/80 hover:bg-white/10 hover:text-white"
                }`}
              >
                <Icon className={`h-5 w-5 ${isActive ? "text-white" : "text-white/60"}`} />
                {link.label}
              </Link>
            );
          })}
          {/* 
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
          )} */}
        </nav>
      )}
    </header>
    </>
  );
}
