"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/theme-toggle"
import { useAuthStore } from "@/lib/store/authStore"
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu"
import { User, Car, LogOut, Settings, PlusCircle } from "lucide-react"

export function Navbar() {
  const pathname = usePathname()
  const { user, isAuthenticated, logout } = useAuthStore()

  const handleLogout = () => {
    logout()
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center">
        <div className="mr-4 flex">
          <Link href="/" className="mr-6 flex items-center space-x-2">
            <Car className="h-6 w-6" />
            <span className="hidden font-bold sm:inline-block">
              متجر السيارات
            </span>
          </Link>
        </div>
        
        <nav className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
          <div className="w-full flex-1 md:w-auto md:flex-none">
            <div className="flex items-center space-x-4">
              <Link
                href="/"
                className={`text-sm font-medium transition-colors hover:text-primary ${
                  pathname === "/" ? "text-foreground" : "text-muted-foreground"
                }`}
              >
                الرئيسية
              </Link>
              <Link
                href="/cars"
                className={`text-sm font-medium transition-colors hover:text-primary ${
                  pathname === "/cars" ? "text-foreground" : "text-muted-foreground"
                }`}
              >
                السيارات
              </Link>
              <Link
                href="/news"
                className={`text-sm font-medium transition-colors hover:text-primary ${
                  pathname === "/news" ? "text-foreground" : "text-muted-foreground"
                }`}
              >
                الأخبار
              </Link>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <ThemeToggle />
            
            {isAuthenticated ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm">
                    <User className="h-4 w-4 mr-2" />
                    {user?.name}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  {user?.role === 'admin' && (
                    <>
                      <DropdownMenuItem asChild>
                        <Link href="/admin/cars">
                          <PlusCircle className="h-4 w-4 mr-2" />
                          إضافة سيارة
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link href="/admin/dashboard">
                          <Settings className="h-4 w-4 mr-2" />
                          لوحة التحكم
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                    </>
                  )}
                  <DropdownMenuItem onClick={handleLogout}>
                    <LogOut className="h-4 w-4 mr-2" />
                    تسجيل الخروج
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="flex items-center space-x-2">
                <Button variant="outline" size="sm" asChild>
                  <Link href="/auth/login">تسجيل الدخول</Link>
                </Button>
                <Button size="sm" asChild>
                  <Link href="/auth/register">إنشاء حساب</Link>
                </Button>
              </div>
            )}
          </div>
        </nav>
      </div>
    </header>
  )
}
