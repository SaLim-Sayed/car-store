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
  Store,
  Newspaper,
  Activity,
  ArrowUpRight,
  Calendar,
  Sparkles
} from "lucide-react";
import Link from "next/link";
import { useAdminStats, useSeedDatabase } from "@/hooks/useAdmin";
import { useCars } from "@/hooks/useCars";
import { cn } from "@/lib/utils";

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
          gradient: "from-primary/20 to-primary/5",
          iconColor: "text-primary",
          desc: "مركبات نشطة مسجلة",
        },
        {
          title: "إجمالي المستخدمين",
          value: (stats.totalUsers || 0).toLocaleString(),
          icon: Users,
          gradient: "from-primary/20 to-primary/5",
          iconColor: "text-primary",
          desc: "أعضاء مسجلين بالنظام",
        },
        {
          title: "المعارض الشريكة",
          value: (stats.totalShowrooms || 0).toLocaleString(),
          icon: Store,
          gradient: "from-primary/20 to-primary/5",
          iconColor: "text-primary",
          desc: "معارض نشطة في المنيا",
        },
        {
          title: "المعدات الثقيلة",
          value: (stats.totalEquipment || 0).toLocaleString(),
          icon: Tractor,
          gradient: "from-primary/20 to-primary/5",
          iconColor: "text-primary",
          desc: "معدات وآلات متوفرة",
        },
        {
          title: "المقالات المنشورة",
          value: (stats.totalNews || 0).toLocaleString(),
          icon: Newspaper,
          gradient: "from-primary/20 to-primary/5",
          iconColor: "text-primary",
          desc: "أخبار ومقالات نشطة",
        },
        {
          title: "إجمالي المبيعات",
          value: (stats.totalRevenue || 0).toLocaleString() + " ج.م",
          icon: DollarSign,
          gradient: "from-primary/20 to-primary/5",
          iconColor: "text-primary",
          desc: "إيرادات محققة تقديرية",
        },
      ]
    : [];

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <main className="container mx-auto px-4 py-8 max-w-7xl space-y-8">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-2">
          <div className="space-y-1.5">
            <h1 className="text-3xl md:text-4xl font-bold text-slate-900 tracking-tight">لوحة التحكم الإدارية</h1>
            <p className="text-sm md:text-base text-slate-500 font-bold max-w-2xl">
              مرحباً بك في مركز التحكم الشامل لمنصتك. يمكنك من هنا إدارة المعروضات، متابعة الإحصائيات، وتحديث بيانات النظام لحظة بلحظة.
            </p>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <div className="hidden sm:flex items-center gap-2 bg-white border border-slate-200/60 rounded-xl px-4 py-2.5 shadow-sm">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
              </span>
              <span className="text-xs font-black text-slate-700 uppercase tracking-widest">النظام مستقر</span>
            </div>
            <Button
              variant="outline"
              asChild
              className="h-11 border-slate-200 text-slate-700 font-black rounded-xl hover:bg-slate-50 px-5"
            >
              <Link href="/admin/equipment/new?category=دراجات نارية - توك توك - تروسيكل">
                <Sparkles className="h-5 w-5 ml-2" />
                إضافة دراجات نارية - توك توك - تروسيكل
              </Link>
            </Button>
            <Button asChild className="h-11 bg-primary hover:bg-primary/90 text-white font-black rounded-xl shadow-lg shadow-primary/20 transition-all hover:scale-105 active:scale-95 px-6">
              <Link href="/admin/cars/new">
                <Plus className="h-5 w-5 ml-2" />
                إضافة مركبة
              </Link>
            </Button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
          {isLoading
            ? Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="h-[140px] rounded-lg bg-slate-200 animate-pulse" />
              ))
            : statCards.map((stat, index) => (
                <div
                  key={index}
                  className="relative group overflow-hidden rounded-lg bg-white border border-slate-100 py-2.5 px-4 hover:shadow-xl hover:shadow-slate-200/50 transition-all duration-500 hover:-translate-y-1"
                >
                  <div className={cn("absolute inset-0 bg-gradient-to-br opacity-100 duration-500", stat.gradient)} />
                  <div className="relative z-10 flex flex-col justify-between h-full">
                    <div className="flex justify-between items-start">
                      <p className="text-[11px] font-black text-slate-500 uppercase tracking-widest leading-relaxed">
                        {stat.title}
                      </p>
                      <div className={cn("p-2 rounded-xl bg-slate-50 group-hover:bg-white transition-colors border border-slate-100", stat.iconColor)}>
                        <stat.icon className="h-4.5 w-4.5" />
                      </div>
                    </div>
                    <div className="mt-4">
                      <h3 className="text-2xl font-bold text-slate-900 tracking-tight">{stat.value}</h3>
                      <p className="text-[10px] text-slate-500 font-bold mt-1.5">{stat.desc}</p>
                    </div>
                  </div>
                </div>
              ))}
        </div>

        {/* Analytics & Controls Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Quick Links */}
          <Card className="border-0 shadow-sm rounded-xl bg-white overflow-hidden ring-1 ring-slate-100">
            <CardHeader className="p-6 border-b border-slate-100/60 bg-white">
              <CardTitle className="flex items-center gap-3 text-lg font-black text-slate-800">
                <div className="p-2 bg-primary/10 rounded-lg text-primary">
                  <Settings className="h-5 w-5" />
                </div>
                إدارة الأقسام
              </CardTitle>
            </CardHeader>
            <CardContent className="py-2.5 px-4 space-y-2">
              {[
                { label: "إدارة السيارات", href: "/admin/cars", icon: Car, count: stats?.totalCars },
                { label: "إدارة المعارض الشريكة", href: "/admin/showrooms", icon: Store, count: stats?.totalShowrooms },
                { label: "إدارة المعدات الثقيلة", href: "/admin/equipment", icon: Tractor, count: stats?.totalEquipment },
                {
                  label: "إضافة دراجات نارية - توك توك - تروسيكل",
                  href: "/admin/equipment/new?category=دراجات نارية - توك توك - تروسيكل",
                  icon: Sparkles,
                },
                { label: "إدارة المقالات والأخبار", href: "/admin/news", icon: Newspaper, count: stats?.totalNews },
                { label: "إدارة المستخدمين", href: "/admin/users", icon: Users, count: stats?.totalUsers },
              ].map((link, idx) => (
                <Link
                  key={idx}
                  href={link.href}
                  className="flex items-center justify-between p-4 rounded-xl hover:bg-slate-50 transition-colors group"
                >
                  <div className="flex items-center gap-4">
                    <div className="text-slate-500 group-hover:text-slate-900 transition-colors">
                      <link.icon className="h-5 w-5" />
                    </div>
                    <span className="text-sm font-bold text-slate-600 group-hover:text-slate-900">{link.label}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    {link.count !== undefined && (
                      <span className="text-xs font-black text-slate-500 bg-slate-100 px-2.5 py-1 rounded-md group-hover:bg-white group-hover:shadow-sm transition-all">
                        {link.count}
                      </span>
                    )}
                    <ChevronLeft className="h-4 w-4 text-slate-300 group-hover:text-slate-900 transform group-hover:-translate-x-1 transition-all" />
                  </div>
                </Link>
              ))}
            </CardContent>
          </Card>

          {/* Inventory Breakdown */}
          <Card className="border-0 shadow-sm rounded-xl bg-white overflow-hidden ring-1 ring-slate-100">
            <CardHeader className="p-6 border-b border-slate-100/60 bg-white">
              <CardTitle className="flex items-center gap-3 text-lg font-black text-slate-800">
                <div className="p-2 bg-primary/10 rounded-lg text-primary">
                  <Activity className="h-5 w-5" />
                </div>
                مؤشرات حالة المخزون
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              {isLoading ? (
                <div className="space-y-6 w-full">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <Skeleton key={i} className="h-14 w-full rounded-xl" />
                  ))}
                </div>
              ) : stats ? (
                <div className="space-y-6 w-full h-full flex flex-col justify-center">
                  {[
                    { label: "متاحة للبيع", count: stats.availableCars || 0, color: "bg-emerald-500", bgLight: "bg-emerald-50", text: "text-emerald-700" },
                    { label: "تم بيعها", count: stats.soldCars || 0, color: "bg-rose-500", bgLight: "bg-rose-50", text: "text-rose-700" },
                    { label: "محجوزة مؤقتاً", count: stats.reservedCars || 0, color: "bg-amber-500", bgLight: "bg-amber-50", text: "text-amber-700" }
                  ].map((item, idx) => (
                    <div key={idx} className="space-y-3">
                      <div className="flex justify-between items-end">
                        <span className="text-sm font-bold text-slate-600">{item.label}</span>
                        <span className={cn("text-xs font-black px-2.5 py-1 rounded-md", item.bgLight, item.text)}>
                          {item.count} سيارة
                        </span>
                      </div>
                      <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                        <div
                          className={cn("h-full rounded-full transition-all duration-1000", item.color)}
                          style={{
                            width: `${stats.totalCars > 0 ? Math.round((item.count / stats.totalCars) * 100) : 0}%`,
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-slate-500 text-sm">لا تتوفر إحصائيات</div>
              )}
            </CardContent>
          </Card>

          {/* System Control */}
          <Card className="border-0 shadow-sm rounded-xl bg-primary text-white overflow-hidden relative">
            <div className="absolute top-0 right-0 p-32 bg-white rounded-full blur-[100px] opacity-10 pointer-events-none" />
            <CardHeader className="p-6 border-b border-white/10 relative z-10">
              <CardTitle className="flex items-center gap-3 text-lg font-black text-white">
                <div className="p-2 bg-white/10 rounded-lg text-white">
                  <Database className="h-5 w-5" />
                </div>
                أدوات النظام
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 flex flex-col justify-between h-[calc(100%-85px)] relative z-10 space-y-6">
              <div className="space-y-4">
                <p className="text-slate-500 text-sm leading-relaxed font-bold">
                  بيانات تجريبية للمطورين. تتيح لك الأداة إعادة تعبئة قاعدة البيانات ببيانات وهمية متكاملة لغرض الاختبار وعرض التصميم.
                </p>
                <div className="p-4 bg-white/5 rounded-lg border border-white/10 space-y-3 backdrop-blur-sm">
                  <div className="flex justify-between text-xs items-center">
                    <span className="text-primary-foreground/80 font-bold">حساب الإدارة:</span>
                    <code className="bg-black/20 px-2 py-1 rounded text-white font-mono">admin@sooqsayaratalminya.com</code>
                  </div>
                  <div className="flex justify-between text-xs items-center">
                    <span className="text-primary-foreground/80 font-bold">كلمة المرور:</span>
                    <code className="bg-black/20 px-2 py-1 rounded text-white font-mono">Admin@123</code>
                  </div>
                </div>
              </div>
              <Button
                className="w-full h-12 bg-white hover:bg-slate-100 text-primary font-black text-sm rounded-xl shadow-lg shadow-black/10 transition-all hover:scale-[1.02]"
                onClick={handleSeed}
                disabled={seeding}
              >
                {seeding ? (
                  <>
                    <Activity className="h-5 w-5 ml-2 animate-spin" />
                    جاري التهيئة...
                  </>
                ) : (
                  <>
                    <Sparkles className="h-5 w-5 ml-2" />
                    تعبئة بيانات تجريبية
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Recent Cars Table */}
        <Card className="border-0 shadow-sm rounded-xl bg-white overflow-hidden ring-1 ring-slate-100">
          <CardHeader className="p-6 border-b border-slate-100/60 bg-white flex flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-3 text-lg font-black text-slate-800">
              <div className="p-2 bg-primary/10 rounded-lg text-primary">
                <Car className="h-5 w-5" />
              </div>
              أحدث الإضافات
            </CardTitle>
            <Button asChild variant="outline" size="sm" className="font-black text-xs border-slate-200 text-slate-600 hover:bg-slate-100 rounded-xl px-4 h-9">
              <Link href="/admin/cars">الكل</Link>
            </Button>
          </CardHeader>
          <CardContent className="p-0 overflow-x-auto">
            {carsLoading ? (
              <div className="p-6 space-y-4">
                {Array.from({ length: 4 }).map((_, i) => (
                  <Skeleton key={i} className="h-14 w-full rounded-xl" />
                ))}
              </div>
            ) : recentCars.length > 0 ? (
              <table className="w-full text-right border-collapse min-w-[800px]">
                <thead>
                  <tr className="border-y border-slate-100/80 text-slate-500 text-[11px] font-semibold text-slate-600 uppercase tracking-wider font-bold bg-slate-50/50">
                    <th className="py-2.5 px-4 pr-8">المركبة</th>
                    <th className="py-2.5 px-4">السعر</th>
                    <th className="py-2.5 px-4">الموديل</th>
                    <th className="py-2.5 px-4">المواصفات</th>
                    <th className="py-2.5 px-4">الحالة</th>
                    <th className="py-2.5 px-4 pl-8 text-center">إجراء</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100/80 bg-white">
                  {recentCars.map((car: any) => (
                    <tr key={car._id} className="hover:bg-slate-50/60 transition-colors group">
                      <td className="py-2.5 px-4 pr-8">
                        <div className="flex items-center gap-4">
                          <div className="relative h-12 w-16 rounded-xl overflow-hidden bg-slate-100 shrink-0 shadow-sm">
                            {car.images?.[0] ? (
                              <img
                                src={car.images[0]}
                                alt={`${car.brand} ${car.model}`}
                                className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-500"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-slate-300">
                                <Car className="h-5 w-5" />
                              </div>
                            )}
                          </div>
                          <div>
                            <p className="font-bold text-slate-900 text-sm">
                              {car.brand} {car.model}
                            </p>
                            <p className="text-xs text-slate-500 font-bold mt-1">
                              {car.mileage?.toLocaleString() || 0} كم • {car.color}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="py-2.5 px-4 font-bold text-slate-900 text-sm">
                        {car.price ? `${car.price.toLocaleString()} ج.م` : 'حسب الطلب'}
                      </td>
                      <td className="py-2.5 px-4 text-slate-500 text-sm font-black">
                        {car.year}
                      </td>
                      <td className="py-2.5 px-4 text-slate-500 text-xs font-bold">
                        <div className="flex flex-col gap-1">
                          <span>{car.transmission === "manual" ? "يدوي" : "أوتوماتيك"}</span>
                          <span className="text-slate-500">{car.fuelType}</span>
                        </div>
                      </td>
                      <td className="py-2.5 px-4">
                        <span
                          className={cn(
                            "inline-flex items-center justify-center px-3 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wide",
                            car.status === "available" && "bg-emerald-50 text-primary border border-emerald-100",
                            car.status === "sold" && "bg-rose-50 text-rose-600 border border-rose-100",
                            car.status === "reserved" && "bg-amber-50 text-primary border border-primary/20",
                          )}
                        >
                          {car.status === "available" ? "متاحة" : car.status === "sold" ? "مباعة" : "محجوزة"}
                        </span>
                      </td>
                      <td className="py-2.5 px-4 pl-8 text-center">
                        <div className="flex items-center justify-center gap-2 opacity-100">
                          <Button asChild size="sm" variant="ghost" className="h-8 w-8 p-0 rounded-lg text-slate-500 hover:text-[#1B3E7A] hover:bg-slate-100">
                            <Link href={`/admin/cars/${car._id}/edit`}>
                              <Settings className="h-4 w-4" />
                            </Link>
                          </Button>
                          <Button asChild size="sm" variant="ghost" className="h-8 w-8 p-0 rounded-lg text-slate-500 hover:text-primary hover:bg-slate-100">
                            <Link href={`/cars/${car._id}`} target="_blank" rel="noopener noreferrer">
                              <ArrowUpRight className="h-4 w-4" />
                            </Link>
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="text-center py-12 text-slate-500 text-sm font-bold flex flex-col items-center gap-3">
                <Car className="h-12 w-12 text-slate-200" />
                لا تتوفر مركبات معروضة حالياً
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
