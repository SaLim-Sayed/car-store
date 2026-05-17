"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Car,
  Users,
  TrendingUp,
  DollarSign,
  Database,
  Plus,
  Settings,
  CheckCircle,
  Tractor,
  ChevronLeft,
  Activity,
  ArrowUpRight,
  Calendar,
} from "lucide-react";
import Link from "next/link";
import { useAdminStats, useSeedDatabase } from "@/hooks/useAdmin";
import { useCars } from "@/hooks/useCars";

export default function AdminDashboard() {
  const { data: statsData, isLoading, error } = useAdminStats();
  const { mutate: seedDatabase, isPending: seeding } = useSeedDatabase();
  
  // Fetch recently added cars (Page 1, limit 5)
  const { data: carsData, isLoading: carsLoading } = useCars(1, 5);
  const recentCars = carsData?.data || [];

  const stats = statsData?.data || statsData;

  const handleSeed = () => {
    seedDatabase();
  };

  const statCards = stats
    ? [
        {
          title: "إجمالي السيارات",
          value: (stats.totalCars || 0).toLocaleString(),
          icon: Car,
          color: "text-blue-600",
          bgColor: "bg-blue-50",
          borderColor: "border-t-blue-600",
          desc: "سيارات نشطة في المعرض",
        },
        {
          title: "إجمالي المستخدمين",
          value: (stats.totalUsers || 0).toLocaleString(),
          icon: Users,
          color: "text-emerald-600",
          bgColor: "bg-emerald-50",
          borderColor: "border-t-emerald-600",
          desc: "أعضاء ومسؤولين مسجلين",
        },
        {
          title: "المعارض الشريكة",
          value: (stats.totalShowrooms || 0).toLocaleString(),
          icon: Database,
          color: "text-indigo-600",
          bgColor: "bg-indigo-50",
          borderColor: "border-t-indigo-600",
          desc: "معارض نشطة في المنيا",
        },
        {
          title: "المعدات الثقيلة",
          value: (stats.totalEquipment || 0).toLocaleString(),
          icon: Tractor,
          color: "text-teal-600",
          bgColor: "bg-teal-50",
          borderColor: "border-t-teal-600",
          desc: "جرارات وآلات زراعية",
        },
        {
          title: "المقالات والأخبار",
          value: (stats.totalNews || 0).toLocaleString(),
          icon: CheckCircle,
          color: "text-amber-600",
          bgColor: "bg-amber-50",
          borderColor: "border-t-amber-600",
          desc: "أخبار السيارات المنشورة",
        },
        {
          title: "تقدير الإيرادات",
          value: (stats.totalRevenue || 0).toLocaleString() + " ج.م",
          icon: DollarSign,
          color: "text-rose-600",
          bgColor: "bg-rose-50",
          borderColor: "border-t-rose-600",
          desc: "تقديري للمبيعات المحققة",
        },
      ]
    : [];

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <main className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Title and Top Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-slate-200 pb-5 mb-8 gap-4">
          <div className="flex items-center gap-3">
            <div className="w-1.5 h-8 bg-[#1B3E7A] rounded-full" />
            <div>
              <h1 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">لوحة التحكم الإدارية</h1>
              <p className="text-sm text-slate-500 font-bold mt-1">نظام إدارة المحتوى والإحصائيات الشاملة لسوق سيارات المنيا</p>
            </div>
          </div>
          {/* Quick Action & Status Indicator */}
          <div className="flex items-center gap-3 shrink-0">
            <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-100 rounded-full px-3 py-1.5">
              <span className="h-2.5 w-2.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-xs font-bold text-emerald-800">قاعدة البيانات نشطة</span>
            </div>
            <Button asChild size="sm" className="bg-[#E28328] hover:bg-[#E28328]/90 text-white font-bold rounded-lg shadow-sm">
              <Link href="/admin/cars/new">
                <Plus className="h-4 w-4 ml-1.5" />
                سيارة جديدة
              </Link>
            </Button>
          </div>
        </div>

        {/* Welcome & Time Banner */}
        <div className="bg-[#1B3E7A] text-white rounded-lg p-6 mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 shadow-sm relative overflow-hidden">
          <div className="absolute right-0 top-0 h-full w-1/3 bg-gradient-to-l from-white/10 to-transparent pointer-events-none" />
          <div className="space-y-1.5 z-10">
            <h2 className="text-xl md:text-2xl font-black">مرحباً بك مجدداً، مدير النظام 👋</h2>
            <p className="text-xs md:text-sm text-white/80 font-medium">
              إليك نظرة عامة على حالة سوق السيارات والمعدات في المنيا اليوم. يمكنك إدارة المعروضات وتحديث الأسعار بسهولة.
            </p>
          </div>
          <div className="flex items-center gap-3 shrink-0 bg-white/10 px-4 py-2 rounded-lg z-10 border border-white/10">
            <Calendar className="h-4.5 w-4.5 text-[#E28328]" />
            <span className="text-xs font-black">
              {new Date().toLocaleDateString("ar-EG", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </span>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-8">
          {isLoading
            ? Array.from({ length: 6 }).map((_, i) => (
                <Card key={i} className="border border-slate-200 shadow-none rounded-lg bg-white">
                  <CardContent className="p-5">
                    <Skeleton className="h-4 w-1/2 mb-3" />
                    <Skeleton className="h-8 w-3/4" />
                  </CardContent>
                </Card>
              ))
            : statCards.map((stat, index) => (
                <Card
                  key={index}
                  className={`border border-slate-200 border-t-4 ${stat.borderColor} shadow-sm rounded-lg bg-white hover:shadow-md hover:-translate-y-0.5 transition-all duration-300`}
                >
                  <CardContent className="p-5 flex flex-col justify-between h-full min-h-[140px]">
                    <div className="flex items-start justify-between">
                      <p className="text-xs font-black text-slate-500 uppercase tracking-wide leading-relaxed">
                        {stat.title}
                      </p>
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${stat.bgColor} shrink-0`}>
                        <stat.icon className={`h-4.5 w-4.5 ${stat.color}`} />
                      </div>
                    </div>
                    <div className="mt-3">
                      <p className="text-2xl font-black text-slate-900 tracking-tight leading-none">{stat.value}</p>
                      <p className="text-[10px] text-slate-400 font-bold mt-1.5">{stat.desc}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Column 1: Quick management links */}
          <Card className="border border-slate-200 shadow-sm rounded-lg bg-white overflow-hidden">
            <CardHeader className="border-b border-slate-100 bg-slate-50/50 p-5">
              <CardTitle className="flex items-center gap-2.5 text-base font-black text-slate-800">
                <Settings className="h-5 w-5 text-[#1B3E7A]" />
                إدارة أقسام المحتوى
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 space-y-2">
              {[
                { label: "إدارة السيارات", href: "/admin/cars", icon: Car, count: stats?.totalCars },
                { label: "إدارة المعارض الشريكة", href: "/admin/showrooms", icon: Database, count: stats?.totalShowrooms },
                { label: "إدارة المعدات الثقيلة", href: "/admin/equipment", icon: Tractor, count: stats?.totalEquipment },
                { label: "إدارة المقالات والأخبار", href: "/admin/news", icon: CheckCircle, count: stats?.totalNews },
                { label: "إدارة حسابات المستخدمين", href: "/admin/users", icon: Users, count: stats?.totalUsers },
              ].map((link, idx) => (
                <Link
                  key={idx}
                  href={link.href}
                  className="flex items-center justify-between p-3.5 rounded-lg border border-slate-100 hover:border-[#1B3E7A]/20 hover:bg-slate-50 transition-all group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-md bg-slate-100 flex items-center justify-center text-slate-600 group-hover:bg-[#1B3E7A]/10 group-hover:text-[#1B3E7A] transition-colors">
                      <link.icon className="h-4.5 w-4.5" />
                    </div>
                    <span className="text-sm font-bold text-slate-700 group-hover:text-slate-900">{link.label}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    {link.count !== undefined && (
                      <span className="text-xs font-black text-slate-400 group-hover:text-[#1B3E7A] transition-colors px-2 py-0.5 bg-slate-100 group-hover:bg-[#1B3E7A]/5 rounded-md">
                        {link.count}
                      </span>
                    )}
                    <ChevronLeft className="h-4 w-4 text-slate-400 group-hover:text-[#1B3E7A] transform group-hover:-translate-x-0.5 transition-all" />
                  </div>
                </Link>
              ))}
            </CardContent>
          </Card>

          {/* Column 2: Inventory breakdown */}
          <Card className="border border-slate-200 shadow-sm rounded-lg bg-white overflow-hidden">
            <CardHeader className="border-b border-slate-100 bg-slate-50/50 p-5">
              <CardTitle className="flex items-center gap-2.5 text-base font-black text-slate-800">
                <Activity className="h-5 w-5 text-[#E28328]" />
                مؤشرات حالة المخزون
              </CardTitle>
            </CardHeader>
            <CardContent className="p-5 flex flex-col justify-between h-[calc(100%-70px)]">
              {isLoading ? (
                <div className="space-y-4 w-full">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <Skeleton key={i} className="h-14 w-full rounded-lg" />
                  ))}
                </div>
              ) : stats ? (
                <div className="space-y-4 w-full">
                  {/* Progress bars visual style */}
                  <div className="p-4 rounded-lg border border-slate-100 bg-[#F8FAFC]">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-xs font-black text-slate-600">سيارات معروضة متاحة للبيع</span>
                      <span className="text-xs font-black text-emerald-600">{stats.availableCars || 0} سيارة</span>
                    </div>
                    <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                      <div
                        className="bg-emerald-500 h-full rounded-full transition-all duration-500"
                        style={{
                          width: `${
                            stats.totalCars > 0
                              ? Math.round(((stats.availableCars || 0) / stats.totalCars) * 100)
                              : 0
                          }%`,
                        }}
                      />
                    </div>
                  </div>

                  <div className="p-4 rounded-lg border border-slate-100 bg-[#F8FAFC]">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-xs font-black text-slate-600">سيارات تم بيعها وتأكيدها</span>
                      <span className="text-xs font-black text-rose-600">{stats.soldCars || 0} سيارة</span>
                    </div>
                    <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                      <div
                        className="bg-rose-500 h-full rounded-full transition-all duration-500"
                        style={{
                          width: `${
                            stats.totalCars > 0
                              ? Math.round(((stats.soldCars || 0) / stats.totalCars) * 100)
                              : 0
                          }%`,
                        }}
                      />
                    </div>
                  </div>

                  <div className="p-4 rounded-lg border border-slate-100 bg-[#F8FAFC]">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-xs font-black text-slate-600">سيارات محجوزة مؤقتاً</span>
                      <span className="text-xs font-black text-amber-600">{stats.reservedCars || 0} سيارة</span>
                    </div>
                    <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                      <div
                        className="bg-amber-500 h-full rounded-full transition-all duration-500"
                        style={{
                          width: `${
                            stats.totalCars > 0
                              ? Math.round(((stats.reservedCars || 0) / stats.totalCars) * 100)
                              : 0
                          }%`,
                        }}
                      />
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8 text-slate-400 text-sm">لا تتوفر إحصائيات للمخزون</div>
              )}
            </CardContent>
          </Card>

          {/* Column 3: Seed & Database controls */}
          <Card className="border border-slate-200 shadow-sm rounded-lg bg-white overflow-hidden flex flex-col justify-between">
            <div>
              <CardHeader className="border-b border-slate-100 bg-slate-50/50 p-5">
                <CardTitle className="flex items-center gap-2.5 text-base font-black text-slate-800">
                  <Database className="h-5 w-5 text-indigo-600" />
                  أدوات صيانة النظام
                </CardTitle>
              </CardHeader>
              <CardContent className="p-5 space-y-4">
                <p className="text-slate-500 text-xs leading-relaxed font-bold">
                  تتيح لك أداة الصيانة تهيئة وإعادة بناء قاعدة البيانات محلياً بالكامل بالاعتماد على حزمة بيانات تجريبية متكاملة لتبسيط الاختبار.
                </p>

                <div className="p-4 bg-slate-50 rounded-lg border border-slate-150 space-y-2.5">
                  <div className="flex justify-between text-xs items-center">
                    <span className="text-slate-500 font-bold">البريد التجريبي:</span>
                    <code className="bg-white border border-slate-200 px-2 py-0.5 rounded font-black text-primary text-[10px]">
                      admin@carstore.com
                    </code>
                  </div>
                  <div className="flex justify-between text-xs items-center">
                    <span className="text-slate-500 font-bold">كلمة المرور:</span>
                    <code className="bg-white border border-slate-200 px-2 py-0.5 rounded font-black text-primary text-[10px]">
                      Admin@123
                    </code>
                  </div>
                </div>
              </CardContent>
            </div>

            <div className="p-5 border-t border-slate-100 bg-slate-50/50">
              <Button
                className="w-full h-11 bg-[#1B3E7A] hover:bg-[#1B3E7A]/90 text-white font-black text-sm rounded-lg shadow-sm flex items-center justify-center gap-2"
                onClick={handleSeed}
                disabled={seeding}
              >
                <Activity className={`h-4 w-4 ${seeding ? "animate-spin" : ""}`} />
                {seeding ? "جاري تعبئة البيانات..." : "تهيئة وتعبئة قاعدة البيانات"}
              </Button>
            </div>
          </Card>
        </div>

        {/* Recent Cars Table */}
        <Card className="border border-slate-200 shadow-sm rounded-lg bg-white overflow-hidden mt-6">
          <CardHeader className="border-b border-slate-100 bg-slate-50/50 p-5 flex flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2.5 text-base font-black text-slate-800">
              <Car className="h-5 w-5 text-[#1B3E7A]" />
              آخر السيارات المضافة للسوق
            </CardTitle>
            <Button asChild variant="outline" size="sm" className="font-black text-xs border-slate-200 text-slate-650 hover:bg-slate-50 rounded-lg">
              <Link href="/admin/cars">عرض كافة السيارات</Link>
            </Button>
          </CardHeader>
          <CardContent className="p-0 overflow-x-auto">
            {carsLoading ? (
              <div className="p-6 space-y-4">
                {Array.from({ length: 4 }).map((_, i) => (
                  <Skeleton key={i} className="h-12 w-full rounded-lg" />
                ))}
              </div>
            ) : recentCars.length > 0 ? (
              <table className="w-full text-right border-collapse min-w-[700px]">
                <thead>
                  <tr className="border-b border-slate-100 text-slate-500 text-xs font-black bg-slate-50/20">
                    <th className="p-4 pr-6">السيارة</th>
                    <th className="p-4">السعر</th>
                    <th className="p-4">سنة الموديل</th>
                    <th className="p-4">ناقل الحركة / الوقود</th>
                    <th className="p-4">الحالة</th>
                    <th className="p-4 pl-6 text-center">الإجراءات</th>
                  </tr>
                </thead>
                <tbody>
                  {recentCars.map((car: any) => (
                    <tr key={car._id} className="border-b border-slate-100 last:border-0 hover:bg-slate-50/40 transition-colors">
                      <td className="p-4 pr-6">
                        <div className="flex items-center gap-3">
                          <div className="relative h-12 w-18 rounded-md overflow-hidden bg-slate-100 border border-slate-200 shrink-0">
                            {car.images?.[0] ? (
                              <img
                                src={car.images[0]}
                                alt={`${car.brand} ${car.model}`}
                                className="object-cover w-full h-full"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-slate-400">
                                <Car className="h-5 w-5" />
                              </div>
                            )}
                          </div>
                          <div>
                            <p className="font-bold text-slate-900 text-sm">
                              {car.brand} {car.model}
                            </p>
                            <p className="text-[10px] text-slate-400 font-bold mt-0.5">
                              {car.mileage?.toLocaleString() || 0} كم • {car.color}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="p-4 font-black text-slate-950 text-sm">
                        {car.price?.toLocaleString() || 0} ج.م
                      </td>
                      <td className="p-4 text-slate-650 text-sm font-black">
                        {car.year}
                      </td>
                      <td className="p-4 text-slate-600 text-sm font-bold">
                        {car.transmission === "manual" ? "يدوي" : "أوتوماتيك"} / {car.fuelType === "gasoline" ? "بنزين" : car.fuelType === "diesel" ? "ديزل" : "غاز طبيعي"}
                      </td>
                      <td className="p-4">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-black ${
                            car.status === "available"
                              ? "bg-emerald-50 text-emerald-700 border border-emerald-100"
                              : car.status === "sold"
                              ? "bg-rose-50 text-rose-700 border border-rose-100"
                              : "bg-amber-50 text-amber-700 border border-amber-100"
                          }`}
                        >
                          {car.status === "available" ? "متاحة" : car.status === "sold" ? "مباعة" : "محجوزة"}
                        </span>
                      </td>
                      <td className="p-4 pl-6 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <Button asChild size="sm" variant="outline" className="h-8 text-xs font-bold border-slate-200 text-[#1B3E7A] hover:bg-[#1B3E7A]/5 hover:text-[#1B3E7A] rounded-md">
                            <Link href={`/admin/cars/${car._id}/edit`}>تعديل</Link>
                          </Button>
                          <Button asChild size="sm" variant="ghost" className="h-8 text-xs font-bold text-slate-500 hover:bg-slate-100 rounded-md">
                            <Link href={`/cars/${car._id}`} target="_blank" rel="noopener noreferrer">
                              <ArrowUpRight className="h-3.5 w-3.5 ml-1" />
                              معاينة
                            </Link>
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="text-center py-10 text-slate-400 text-sm font-bold">لا تتوفر سيارات معروضة حالياً</div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
