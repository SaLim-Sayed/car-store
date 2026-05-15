"use client"

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
  Tractor,
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
          title: "المعارض",
          value: (stats.totalShowrooms || 0).toLocaleString(),
          icon: Database,
          color: "text-indigo-600",
          bgColor: "bg-indigo-100 dark:bg-indigo-900",
        },
        {
          title: "المعدات",
          value: (stats.totalEquipment || 0).toLocaleString(),
          icon: Tractor,
          color: "text-emerald-600",
          bgColor: "bg-emerald-100 dark:bg-emerald-900",
        },
        {
          title: "الأخبار",
          value: (stats.totalNews || 0).toLocaleString(),
          icon: CheckCircle,
          color: "text-amber-600",
          bgColor: "bg-amber-100 dark:bg-amber-900",
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
    <div className="min-h-screen bg-[#F9F6F1]">
 
      <main className="container mx-auto px-4 pb-8">
        <div className="mb-12 space-y-4">
          <h1 className="text-5xl font-[1000] tracking-tighter">لوحة التحكم</h1>
          <p className="text-muted-foreground text-xl font-medium">إدارة وتتبع أداء متجرك بشكل احترافي</p>
          <div className="h-1.5 w-24 bg-primary rounded-full" />
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-8 mb-12">
          {isLoading
            ? Array.from({ length: 6 }).map((_, i) => (
                <Card key={i} className="border-0 shadow-lg rounded-[2rem]">
                  <CardContent className="p-8">
                    <Skeleton className="h-6 w-1/2 mb-4" />
                    <Skeleton className="h-10 w-3/4" />
                  </CardContent>
                </Card>
              ))
            : statCards.map((stat, index) => (
                <Card key={index} className="border-0 shadow-xl rounded-[2.5rem] bg-white hover:scale-105 transition-transform duration-500">
                  <CardContent className="p-8">
                    <div className="flex flex-col gap-6">
                      <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${stat.bgColor}`}>
                        <stat.icon className={`h-8 w-8 ${stat.color}`} />
                      </div>
                      <div>
                        <p className="text-sm font-black text-muted-foreground mb-1 uppercase tracking-wider">
                          {stat.title}
                        </p>
                        <p className="text-3xl font-[1000] tracking-tight">{stat.value}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Quick Actions */}
          <Card className="border-0 shadow-xl rounded-[2.5rem] bg-white overflow-hidden">
            <CardHeader className="p-8 pb-0">
              <CardTitle className="flex items-center gap-3 text-2xl font-black">
                <Settings className="h-6 w-6 text-primary" />
                إدارة المحتوى
              </CardTitle>
            </CardHeader>
            <CardContent className="p-8 space-y-4">
              <Button asChild className="w-full h-14 justify-between rounded-2xl text-lg font-black bg-[#1A1A1A] hover:bg-black text-white px-6 group">
                <Link href="/admin/cars/new" className="flex items-center justify-between w-full">
                  <div className="flex items-center">
                    <Plus className="h-5 w-5 ml-3" />
                    سيارة جديدة
                  </div>
                  <Plus className="h-5 w-5 opacity-0 group-hover:opacity-100 transition-opacity" />
                </Link>
              </Button>
              <Button variant="outline" asChild className="w-full h-14 justify-between rounded-2xl text-lg font-black border-2 border-gray-50 hover:bg-gray-50 px-6">
                <Link href="/admin/cars" className="flex items-center">
                  <Car className="h-5 w-5 ml-3 text-primary" />
                  إدارة السيارات
                </Link>
              </Button>
              <Button variant="outline" asChild className="w-full h-14 justify-between rounded-2xl text-lg font-black border-2 border-gray-50 hover:bg-gray-50 px-6">
                <Link href="/admin/news" className="flex items-center">
                  <CheckCircle className="h-5 w-5 ml-3 text-amber-600" />
                  إدارة الأخبار
                </Link>
              </Button>
              <Button variant="outline" asChild className="w-full h-14 justify-between rounded-2xl text-lg font-black border-2 border-gray-50 hover:bg-gray-50 px-6">
                <Link href="/admin/showrooms" className="flex items-center">
                  <Database className="h-5 w-5 ml-3 text-indigo-600" />
                  إدارة المعارض
                </Link>
              </Button>
              <Button variant="outline" asChild className="w-full h-14 justify-between rounded-2xl text-lg font-black border-2 border-gray-50 hover:bg-gray-50 px-6">
                <Link href="/admin/equipment" className="flex items-center">
                  <Tractor className="h-5 w-5 ml-3 text-emerald-600" />
                  المعدات الزراعية
                </Link>
              </Button>
            </CardContent>
          </Card>

          {/* Inventory Summary */}
          <Card className="border-0 shadow-xl rounded-[2.5rem] bg-white overflow-hidden">
            <CardHeader className="p-8 pb-0">
              <CardTitle className="text-2xl font-black">حالة المخزون</CardTitle>
            </CardHeader>
            <CardContent className="p-8">
              {isLoading ? (
                <div className="space-y-4">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <Skeleton key={i} className="h-16 w-full rounded-2xl" />
                  ))}
                </div>
              ) : stats ? (
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-5 bg-emerald-50 rounded-2xl border border-emerald-100">
                    <p className="text-lg font-black text-emerald-900">
                      سيارات متاحة للبيع
                    </p>
                    <span className="text-3xl font-[1000] text-emerald-600">
                      {stats.availableCars}
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-5 bg-rose-50 rounded-2xl border border-rose-100">
                    <p className="text-lg font-black text-rose-900">
                      سيارات تم بيعها
                    </p>
                    <span className="text-3xl font-[1000] text-rose-600">
                      {stats.soldCars}
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-5 bg-amber-50 rounded-2xl border border-amber-100">
                    <p className="text-lg font-black text-amber-900">
                      سيارات محجوزة
                    </p>
                    <span className="text-3xl font-[1000] text-amber-600">
                      {stats.reservedCars}
                    </span>
                  </div>
                </div>
              ) : null}
            </CardContent>
          </Card>

          {/* Database & System */}
          <Card className="border-2 border-dashed border-primary/20 shadow-none rounded-[2.5rem] bg-white overflow-hidden">
            <CardHeader className="p-8 pb-0">
              <CardTitle className="flex items-center gap-3 text-2xl font-black">
                <Database className="h-6 w-6 text-primary" />
                النظام والقاعدة
              </CardTitle>
            </CardHeader>
            <CardContent className="p-8 space-y-6">
              <p className="text-muted-foreground text-lg leading-relaxed font-medium">
                تستخدم هذه الأداة لتهيئة قاعدة البيانات ببيانات تجريبية أولية للبدء في استخدام النظام.
              </p>
              
              <Button
                className="w-full h-16 rounded-2xl text-xl font-black bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/20"
                onClick={handleSeed}
                disabled={seeding}
              >
                <TrendingUp className="h-6 w-6 ml-3" />
                {seeding ? "جاري التهيئة..." : "تهيئة البيانات التجريبية"}
              </Button>

              <div className="p-6 bg-gray-50 rounded-2xl space-y-3">
                  <p className="font-black text-foreground">بيانات الدخول الافتراضية:</p>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">البريد:</span>
                    <code className="font-bold text-primary">admin@carstore.com</code>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">السر:</span>
                    <code className="font-bold text-primary">Admin@123</code>
                  </div>
                </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
