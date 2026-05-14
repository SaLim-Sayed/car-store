"use client";

import { useState } from "react";
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

  const handleLogout = () => {
    logout();
  };

  const navLinks = [
    { href: "/", label: "الرئيسية" },
    { href: "/cars", label: "السيارات" },
    { href: "/news", label: "الأخبار" },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center gap-2">
            <div className="relative h-20 w-32 md:h-12 md:w-40">
              <Image
                src="/logo-maarad-sayarat.png"
                alt="معرض سيارات"
                fill
                className="object-contain"
                priority
              />
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6 mr-6">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`text-sm font-medium transition-colors hover:text-primary ${
                  pathname === link.href
                    ? "text-foreground"
                    : "text-muted-foreground"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center space-x-2">
            <ThemeToggle />

            {isAuthenticated ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="gap-2">
                    <User className="h-4 w-4" />
                    <span className="hidden sm:inline-block">{user?.name}</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">
                        {user?.name}
                      </p>
                      <p className="text-xs leading-none text-muted-foreground">
                        {user?.email}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  {user?.role === "admin" && (
                    <>
                      <DropdownMenuItem asChild>
                        <Link
                          href="/admin/cars"
                          className="w-full cursor-pointer"
                        >
                          <PlusCircle className="h-4 w-4 ml-2" />
                          إضافة سيارة
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link
                          href="/admin/dashboard"
                          className="w-full cursor-pointer"
                        >
                          <Settings className="h-4 w-4 ml-2" />
                          لوحة التحكم
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                    </>
                  )}
                  <DropdownMenuItem
                    onClick={handleLogout}
                    className="text-destructive cursor-pointer"
                  >
                    <LogOut className="h-4 w-4 ml-2" />
                    تسجيل الخروج
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="flex items-center space-x-2">
                <Button variant="outline" size="sm" asChild>
                  <Link href="/auth/login">تسجيل الدخول</Link>
                </Button>
              </div>
            )}

            {/* Mobile Menu Drawer */}
            <Dialog open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
              <DialogTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden">
                  <Menu className="h-6 w-6" />
                </Button>
              </DialogTrigger>
              <DialogContent
                className="fixed top-0 left-0 h-full w-[300px] rounded-none border-r shadow-2xl translate-x-0 translate-y-0 data-open:animate-in data-open:slide-in-from-left duration-300 data-closed:animate-out data-closed:slide-out-to-left p-0 overflow-hidden flex flex-col"
                showCloseButton={false}
              >
                <div className="flex items-center justify-between p-4 border-b">
                  <div className="flex items-center gap-2">
                    <div className="relative h-8 w-24">
                      <Image
                        src="/logo-maarad-sayarat.png"
                        alt="معرض سيارات"
                        fill
                        className="object-contain"
                      />
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <X className="h-5 w-5" />
                  </Button>
                </div>

                <div className="flex-1 overflow-y-auto p-4">
                  <nav className="flex flex-col space-y-2">
                    {navLinks.map((link) => {
                      const Icon =
                        link.href === "/"
                          ? Car
                          : link.href === "/cars"
                            ? Car
                            : Settings; // Fallback icons
                      return (
                        <Link
                          key={link.href}
                          href={link.href}
                          onClick={() => setIsMobileMenuOpen(false)}
                          className={`flex items-center gap-3 px-4 py-3 rounded-lg text-lg font-medium transition-all hover:bg-accent ${
                            pathname === link.href
                              ? "bg-accent text-primary"
                              : "text-muted-foreground"
                          }`}
                        >
                          {link.href === "/" && <Car className="h-5 w-5" />}
                          {link.href === "/cars" && <Car className="h-5 w-5" />}
                          {link.href === "/news" && (
                            <PlusCircle className="h-5 w-5" />
                          )}
                          {link.label}
                        </Link>
                      );
                    })}

                    {!isAuthenticated && (
                      <Link
                        href="/auth/login"
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="flex items-center gap-3 px-4 py-3 rounded-lg text-lg font-medium text-muted-foreground hover:bg-accent hover:text-primary transition-all"
                      >
                        <User className="h-5 w-5" />
                        تسجيل الدخول
                      </Link>
                    )}
                  </nav>
                </div>

                {isAuthenticated && (
                  <div className="p-4 border-t bg-muted/30">
                    <div className="flex items-center gap-3 mb-4 px-2">
                      <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <User className="h-5 w-5 text-primary" />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-sm font-semibold">
                          {user?.name}
                        </span>
                        <span className="text-xs text-muted-foreground truncate max-w-[180px]">
                          {user?.email}
                        </span>
                      </div>
                    </div>
                    <Button
                      variant="destructive"
                      className="w-full justify-start gap-3 h-11"
                      onClick={() => {
                        handleLogout();
                        setIsMobileMenuOpen(false);
                      }}
                    >
                      <LogOut className="h-5 w-5" />
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
