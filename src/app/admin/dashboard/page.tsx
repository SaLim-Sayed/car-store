"use client"

import { useState, useEffect } from "react"
import { Navbar } from "@/components/navbar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Car, Users, TrendingUp, DollarSign } from "lucide-react"
import Link from "next/link"

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalCars: 0,
    totalUsers: 0,
    availableCars: 0,
    soldCars: 0,
    totalRevenue: 0
  })

  // Mock data for demonstration
  useEffect(() => {
    setStats({
      totalCars: 156,
      totalUsers: 89,
      availableCars: 134,
      soldCars: 22,
      totalRevenue: 2850000
    })
  }, [])

  const statCards = [
    {
      title: "إجمالي السيارات",
      value: stats.totalCars,
      icon: Car,
      color: "text-blue-600",
      bgColor: "bg-blue-100 dark:bg-blue-900"
    },
    {
      title: "إجمالي المستخدمين",
      value: stats.totalUsers,
      icon: Users,
      color: "text-green-600",
      bgColor: "bg-green-100 dark:bg-green-900"
    },
    {
      title: "السيارات المتاحة",
      value: stats.availableCars,
      icon: TrendingUp,
      color: "text-orange-600",
      bgColor: "bg-orange-100 dark:bg-orange-900"
    },
    {
      title: "إجمالي الإيرادات",
      value: `${stats.totalRevenue.toLocaleString()} ريال`,
      icon: DollarSign,
      color: "text-purple-600",
      bgColor: "bg-purple-100 dark:bg-purple-900"
    }
  ]

  return (
    <div className="min-h-screen">
      <Navbar />
      
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">لوحة تحكم المسؤول</h1>
          <p className="text-muted-foreground">
            إدارة وتتبع أداء متجر السيارات
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {statCards.map((stat, index) => (
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

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>إجراءات سريعة</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button asChild className="w-full justify-start">
                <Link href="/admin/cars/new">
                  <Car className="h-4 w-4 ml-2" />
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

          <Card>
            <CardHeader>
              <CardTitle>آخر النشاطات</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-muted rounded">
                  <div>
                    <p className="font-medium">إضافة سيارة جديدة</p>
                    <p className="text-sm text-muted-foreground">تويوتا كامري 2024</p>
                  </div>
                  <span className="text-sm text-muted-foreground">منذ 5 دقائق</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-muted rounded">
                  <div>
                    <p className="font-medium">بيع سيارة</p>
                    <p className="text-sm text-muted-foreground">هونداي سوناتا 2023</p>
                  </div>
                  <span className="text-sm text-muted-foreground">منذ ساعة</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-muted rounded">
                  <div>
                    <p className="font-medium">مستخدم جديد</p>
                    <p className="text-sm text-muted-foreground">أحمد محمد</p>
                  </div>
                  <span className="text-sm text-muted-foreground">منذ 3 ساعات</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
