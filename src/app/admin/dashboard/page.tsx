"use client"

import { Navbar } from "@/components/navbar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Car,
  Users,
  TrendingUp,
  DollarSign,
  ShoppingBag,
  Database,
  Plus,
  Settings,
  CheckCircle,
} from "lucide-react"
import Link from "next/link"
import { useAdminStats, useSeedDatabase } from "@/hooks/useAdmin"

export default function AdminDashboard() {
  const { data: statsData, isLoading, error } = useAdminStats()
  const { mutate: seedDatabase, isPending: seeding } = useSeedDatabase()
  
  const stats = statsData?.data || statsData

  const handleSeed = () => {
    seedDatabase()
  }

  const statCards = stats
    ? [
        {
          title: "إجمالي السيارات",
          value: (stats.totalCars || 0).toLocaleString(),
          icon: Car,
          color: "text-blue-600",
          bgColor: "bg-blue-100 dark:bg-blue-900",
        },
        {
          title: "إجمالي المستخدمين",
          value: (stats.totalUsers || 0).toLocaleString(),
          icon: Users,
          color: "text-green-600",
          bgColor: "bg-green-100 dark:bg-green-900",
        },
        {
          title: "السيارات المتاحة",
          value: (stats.availableCars || 0).toLocaleString(),
          icon: TrendingUp,
          color: "text-orange-600",
          bgColor: "bg-orange-100 dark:bg-orange-900",
        },
        {
          title: "السيارات المباعة",
          value: (stats.soldCars || 0).toLocaleString(),
          icon: ShoppingBag,
          color: "text-red-600",
          bgColor: "bg-red-100 dark:bg-red-900",
        },
        {
          title: "إجمالي الإيرادات",
          value: (stats.totalRevenue || 0).toLocaleString() + " ج.م",
          icon: DollarSign,
          color: "text-purple-600",
          bgColor: "bg-purple-100 dark:bg-purple-900",
        },
      ]
    : []

  return (
    <div className="min-h-screen">
      <Navbar />

      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">لوحة تحكم المسؤول</h1>
          <p className="text-muted-foreground">إدارة وتتبع أداء متجر السيارات</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
          {isLoading
            ? Array.from({ length: 5 }).map((_, i) => (
                <Card key={i}>
                  <CardContent className="p-6">
                    <Skeleton className="h-6 w-1/2 mb-2" />
                    <Skeleton className="h-8 w-3/4" />
                  </CardContent>
                </Card>
              ))
            : statCards.map((stat, index) => (
                <Card key={index}>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">
                          {stat.title}
                        </p>
                        <p className="text-2xl font-bold">{stat.value}</p>
                      </div>
                      <div className={`p-3 rounded-full ${stat.bgColor}`}>
                        <stat.icon className={`h-6 w-6 ${stat.color}`} />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                إجراءات سريعة
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button asChild className="w-full justify-start">
                <Link href="/admin/cars/new">
                  <Plus className="h-4 w-4 ml-2" />
                  إضافة سيارة جديدة
                </Link>
              </Button>
              <Button variant="outline" asChild className="w-full justify-start">
                <Link href="/admin/cars">
                  <Car className="h-4 w-4 ml-2" />
                  إدارة السيارات
                </Link>
              </Button>
              <Button variant="outline" asChild className="w-full justify-start">
                <Link href="/admin/users">
                  <Users className="h-4 w-4 ml-2" />
                  إدارة المستخدمين
                </Link>
              </Button>
            </CardContent>
          </Card>

          {/* Inventory Summary */}
          <Card>
            <CardHeader>
              <CardTitle>ملخص المخزون</CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="space-y-3">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <Skeleton key={i} className="h-12 w-full" />
                  ))}
                </div>
              ) : stats ? (
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-950 rounded-lg">
                    <p className="font-medium text-green-700 dark:text-green-300">
                      سيارات متاحة
                    </p>
                    <span className="text-xl font-bold text-green-600 dark:text-green-400">
                      {stats.availableCars}
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-red-50 dark:bg-red-950 rounded-lg">
                    <p className="font-medium text-red-700 dark:text-red-300">
                      سيارات مباعة
                    </p>
                    <span className="text-xl font-bold text-red-600 dark:text-red-400">
                      {stats.soldCars}
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-yellow-50 dark:bg-yellow-950 rounded-lg">
                    <p className="font-medium text-yellow-700 dark:text-yellow-300">
                      سيارات محجوزة
                    </p>
                    <span className="text-xl font-bold text-yellow-600 dark:text-yellow-400">
                      {stats.reservedCars}
                    </span>
                  </div>
                </div>
              ) : null}
            </CardContent>
          </Card>

          {/* Database Seeding Card */}
          <Card className="border-dashed">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="h-5 w-5 text-primary" />
                تهيئة قاعدة البيانات
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                أضف بيانات تجريبية (8 سيارات + حساب مسؤول) إلى قاعدة البيانات. سيتم تخطي البيانات الموجودة.
              </p>

              
              <Button
                className="w-full"
                variant="outline"
                onClick={handleSeed}
                disabled={seeding}
              >
                <Database className="h-4 w-4 ml-2" />
                {seeding ? "جاري التهيئة..." : "تهيئة البيانات الآن"}
              </Button>

              <div className="text-xs text-muted-foreground space-y-1 border-t pt-3">
                  <p className="font-medium">بيانات الدخول للمسؤول:</p>
                  <p>البريد: <code className="bg-muted px-1 rounded">admin@carstore.com</code></p>
                  <p>كلمة المرور: <code className="bg-muted px-1 rounded">Admin@123</code></p>
                </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
