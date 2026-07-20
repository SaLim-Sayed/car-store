"use client";

import { useEffect, useMemo, useState, type ComponentType } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Car,
  Users,
  DollarSign,
  Database,
  Plus,
  Settings,
  Tractor,
  ChevronLeft,
  Store,
  Newspaper,
  Activity,
  ArrowUpRight,
  Sparkles,
  Trash2,
  Eye,
  UserRound,
  MousePointerClick,
  LayoutDashboard,
} from "lucide-react";
import Link from "next/link";
import { useAdminStats, useSeedDatabase, useClearDatabase } from "@/hooks/useAdmin";
import { useCars } from "@/hooks/useCars";
import { cn } from "@/lib/utils";

type StatTone = "sky" | "violet" | "emerald" | "primary" | "slate" | "amber";

type StatCard = {
  title: string;
  value: string;
  icon: ComponentType<{ className?: string }>;
  tone: StatTone;
  desc?: string;
  href?: string;
};

const toneStyles: Record<
  StatTone,
  { iconWrap: string; bar: string; soft: string }
> = {
  sky: {
    iconWrap: "bg-sky-500/10 text-sky-700",
    bar: "bg-sky-500",
    soft: "from-sky-500/[0.06]",
  },
  violet: {
    iconWrap: "bg-violet-500/10 text-violet-700",
    bar: "bg-violet-500",
    soft: "from-violet-500/[0.06]",
  },
  emerald: {
    iconWrap: "bg-emerald-500/10 text-emerald-700",
    bar: "bg-emerald-500",
    soft: "from-emerald-500/[0.06]",
  },
  primary: {
    iconWrap: "bg-primary/10 text-primary",
    bar: "bg-primary",
    soft: "from-primary/[0.06]",
  },
  slate: {
    iconWrap: "bg-slate-500/10 text-slate-600",
    bar: "bg-slate-400",
    soft: "from-slate-500/[0.05]",
  },
  amber: {
    iconWrap: "bg-amber-500/10 text-amber-700",
    bar: "bg-amber-500",
    soft: "from-amber-500/[0.06]",
  },
};

function StatTile({
  stat,
  featured = false,
}: {
  stat: StatCard;
  featured?: boolean;
}) {
  const tone = toneStyles[stat.tone];
  const content = (
    <>
      <div
        className={cn(
          "pointer-events-none absolute inset-0 bg-linear-to-bl to-transparent opacity-100",
          tone.soft,
        )}
      />
      <div className={cn("absolute inset-y-3 right-0 w-[3px] rounded-full", tone.bar)} />
      <div className="relative flex h-full items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-[12px] font-semibold text-slate-500">{stat.title}</p>
          <p
            className={cn(
              "mt-2 font-bold tracking-tight text-slate-900 tabular-nums",
              featured ? "text-[2rem] leading-none" : "text-[1.75rem] leading-none",
            )}
          >
            {stat.value}
          </p>
          {stat.desc ? (
            <p className="mt-2 text-[11px] font-medium text-slate-400">{stat.desc}</p>
          ) : null}
        </div>
        <div
          className={cn(
            "flex size-10 shrink-0 items-center justify-center rounded-xl",
            tone.iconWrap,
          )}
        >
          <stat.icon className="size-4" />
        </div>
      </div>
    </>
  );

  const className = cn(
    "group relative block overflow-hidden rounded-2xl border border-slate-200/90 bg-white p-5",
    "shadow-[0_1px_2px_rgba(15,23,42,0.04)] transition-all duration-200",
    "hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-[0_12px_28px_-16px_rgba(15,23,42,0.25)]",
    featured && "min-h-[124px]",
  );

  if (stat.href) {
    return (
      <Link href={stat.href} className={className}>
        {content}
      </Link>
    );
  }

  return <div className={className}>{content}</div>;
}

export default function AdminDashboard() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  const { data: statsData, isLoading, error } = useAdminStats();
  const { mutate: seedDatabase, isPending: seeding } = useSeedDatabase();
  const { mutate: clearDatabase, isPending: clearing } = useClearDatabase();

  const { data: carsData, isLoading: carsLoading } = useCars(1, 5);
  const recentCars = carsData?.data || [];
  const showStatsSkeleton = !mounted || isLoading;
  const showCarsSkeleton = !mounted || carsLoading;

  const stats = statsData?.data || statsData;

  const todayLabel = useMemo(() => {
    if (!mounted) return "";
    return new Intl.DateTimeFormat("ar-EG", {
      weekday: "long",
      day: "numeric",
      month: "long",
    }).format(new Date());
  }, [mounted]);

  const handleSeed = () => {
    seedDatabase();
  };

  const handleClear = () => {
    if (
      confirm(
        "متأكد إنك عايز تمسح كل الداتا؟ هتتمسح العربيات والمعدات والمعارض والمقالات، وحسابات الأدمن والمستخدمين هتفضل زي ما هي.",
      )
    ) {
      clearDatabase();
    }
  };

  const visitCards: StatCard[] = stats
    ? [
        {
          title: "الزارات اليوم",
          value: (stats.visitsToday || 0).toLocaleString("ar-EG"),
          icon: Eye,
          tone: "sky",
          desc: `${(stats.uniqueVisitorsToday || 0).toLocaleString("ar-EG")} زائر مختلف`,
        },
        {
          title: "امس",
          value: (stats.visitsYesterday || 0).toLocaleString("ar-EG"),
          icon: Activity,
          tone: "violet",
          desc: `الأسبوع: ${(stats.visitsThisWeek || 0).toLocaleString("ar-EG")}`,
        },
        {
          title: "كل الزبارات",
          value: (stats.visitsTotal || 0).toLocaleString("ar-EG"),
          icon: UserRound,
          tone: "emerald",
        },
      ]
    : [];

  const inventoryCards: StatCard[] = stats
    ? [
        {
          title: "العربيات",
          value: (stats.totalCars || 0).toLocaleString("ar-EG"),
          icon: Car,
          tone: "primary",
          desc: "عربيات معروضة دلوقتي",
          href: "/admin/cars",
        },
        {
          title: "المستخدمين",
          value: (stats.totalUsers || 0).toLocaleString("ar-EG"),
          icon: Users,
          tone: "slate",
          desc: "ناس مسجّلة في النظام",
          href: "/admin/users",
        },
        {
          title: "المعارض",
          value: (stats.totalShowrooms || 0).toLocaleString("ar-EG"),
          icon: Store,
          tone: "primary",
          desc: "معارض شغّالة في المنيا",
          href: "/admin/showrooms",
        },
        {
          title: "المعدات",
          value: (stats.totalEquipment || 0).toLocaleString("ar-EG"),
          icon: Tractor,
          tone: "slate",
          desc: "معدات وآلات موجودة",
          href: "/admin/equipment",
        },
        {
          title: "الأخبار",
          value: (stats.totalNews || 0).toLocaleString("ar-EG"),
          icon: Newspaper,
          tone: "slate",
          desc: "مقالات وأخبار منشورين",
          href: "/admin/news",
        },
        {
          title: "المبيعات",
          value: `${(stats.totalRevenue || 0).toLocaleString("ar-EG")} ج.م`,
          icon: DollarSign,
          tone: "amber",
          desc: "فلوس تقريبية اتجمعت",
        },
      ]
    : [];

  const stockItems = stats
    ? [
        {
          label: "متاحة للبيع",
          count: stats.availableCars || 0,
          color: "bg-emerald-500",
          track: "bg-emerald-50",
          text: "text-emerald-700",
        },
        {
          label: "تم بيعها",
          count: stats.soldCars || 0,
          color: "bg-rose-500",
          track: "bg-rose-50",
          text: "text-rose-700",
        },
        {
          label: "محجوزة مؤقتاً",
          count: stats.reservedCars || 0,
          color: "bg-amber-500",
          track: "bg-amber-50",
          text: "text-amber-700",
        },
      ]
    : [];

  return (
    <div className="min-h-screen bg-[#EEF1F6]">
      <main className="container mx-auto max-w-7xl space-y-6 px-4 py-7 md:space-y-8 md:py-8">
        {/* Hero header */}
        <section className="relative overflow-hidden rounded-3xl border border-slate-200/80 bg-white shadow-[0_1px_2px_rgba(15,23,42,0.04)]">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,_rgba(27,62,122,0.10),_transparent_55%),radial-gradient(ellipse_at_bottom_right,_rgba(226,131,40,0.08),_transparent_45%)]" />
          <div className="relative flex flex-col gap-5 p-5 md:flex-row md:items-center md:justify-between md:p-7">
            <div className="space-y-2">
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white/80 px-2.5 py-1 text-[11px] font-semibold text-slate-500 backdrop-blur">
                  <LayoutDashboard className="size-3.5" />
                  لوحة الإدارة
                </span>
                {todayLabel ? (
                  <span className="text-[11px] font-medium text-slate-400">{todayLabel}</span>
                ) : null}
              </div>
              <h1 className="text-2xl font-bold tracking-tight text-slate-900 md:text-[2rem]">
                لوحة التحكم
              </h1>
              <p className="max-w-xl text-sm font-medium leading-relaxed text-slate-500">
                أهلاً بيك. من هنا تضيف عربيات، تتابع الزيارات، وتعدّل الداتا بسهولة.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2.5">
              <div className="hidden items-center gap-2 rounded-full border border-emerald-200/80 bg-emerald-50 px-3 py-1.5 sm:flex">
                <span className="relative flex size-2">
                  <span className="absolute inline-flex size-full animate-ping rounded-full bg-emerald-400 opacity-60" />
                  <span className="relative inline-flex size-2 rounded-full bg-emerald-500" />
                </span>
                <span className="text-xs font-semibold text-emerald-800">كل حاجة تمام</span>
              </div>
              <Button
                variant="outline"
                asChild
                className="h-10 rounded-xl border-slate-200 bg-white/90 px-4 text-sm font-semibold text-slate-700 backdrop-blur hover:bg-white"
              >
                <Link href="/admin/equipment/new?category=موتوسيكل">
                  <Sparkles className="ml-2 size-4 text-amber-500" />
                  ضيف موتوسيكل أو توك توك
                </Link>
              </Button>
              <Button
                asChild
                className="h-10 rounded-xl bg-primary px-5 text-sm font-semibold text-white shadow-[0_8px_20px_-10px_rgba(27,62,122,0.7)] hover:bg-primary/90"
              >
                <Link href="/admin/cars/new">
                  <Plus className="ml-2 size-4" />
                  ضيف عربية
                </Link>
              </Button>
            </div>
          </div>
        </section>

        {error ? (
          <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-700">
            فيه مشكلة في تحميل الإحصائيات. جرّب تحديث الصفحة.
          </div>
        ) : null}

        {/* Visits */}
        <section className="space-y-3">
          <div className="flex items-end justify-between gap-3 px-0.5">
            <div>
              <h2 className="text-sm font-bold text-slate-800">الزيارات</h2>
              <p className="mt-0.5 text-xs font-medium text-slate-400">متابعة حركة الموقع</p>
            </div>
          </div>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            {showStatsSkeleton
              ? Array.from({ length: 3 }).map((_, i) => (
                  <div
                    key={i}
                    className="h-[124px] animate-pulse rounded-2xl bg-white/70 ring-1 ring-slate-200/80"
                  />
                ))
              : visitCards.map((stat) => (
                  <StatTile key={stat.title} stat={stat} featured />
                ))}
          </div>
        </section>

        {/* Platform summary */}
        <section className="space-y-3">
          <div className="flex items-end justify-between gap-3 px-0.5">
            <div>
              <h2 className="text-sm font-bold text-slate-800">ملخص المنصة</h2>
              <p className="mt-0.5 text-xs font-medium text-slate-400">اضغط على أي كارت للدخول للقسم</p>
            </div>
          </div>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {showStatsSkeleton
              ? Array.from({ length: 6 }).map((_, i) => (
                  <div
                    key={i}
                    className="h-[118px] animate-pulse rounded-2xl bg-white/70 ring-1 ring-slate-200/80"
                  />
                ))
              : inventoryCards.map((stat) => (
                  <StatTile key={stat.title} stat={stat} />
                ))}
          </div>
        </section>

        {/* Middle row */}
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-12">
          <Card className="overflow-hidden rounded-3xl border border-slate-200/80 bg-white shadow-none lg:col-span-4">
            <CardHeader className="border-b border-slate-100 p-5">
              <CardTitle className="flex items-center gap-3 text-[15px] font-bold text-slate-800">
                <span className="flex size-9 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <Settings className="size-4" />
                </span>
                إدارة الأقسام
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-1 p-2.5">
              {[
                { label: "العربيات", href: "/admin/cars", icon: Car, count: stats?.totalCars },
                { label: "المعارض", href: "/admin/showrooms", icon: Store, count: stats?.totalShowrooms },
                { label: "المعدات", href: "/admin/equipment", icon: Tractor, count: stats?.totalEquipment },
                {
                  label: "موتوسيكل وتوك توك",
                  href: "/admin/equipment/new?category=موتوسيكل",
                  icon: Sparkles,
                },
                { label: "الأخبار", href: "/admin/news", icon: Newspaper, count: stats?.totalNews },
                { label: "المستخدمين", href: "/admin/users", icon: Users, count: stats?.totalUsers },
                {
                  label: "تقرير ضغطات المعارض",
                  href: "/admin/reports/showroom-clicks",
                  icon: MousePointerClick,
                },
              ].map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="group flex items-center justify-between rounded-2xl px-3 py-2.5 transition-colors hover:bg-slate-50"
                >
                  <div className="flex items-center gap-3">
                    <span className="flex size-8 items-center justify-center rounded-lg bg-slate-50 text-slate-400 transition-colors group-hover:bg-white group-hover:text-primary group-hover:shadow-sm">
                      <link.icon className="size-3.5" />
                    </span>
                    <span className="text-sm font-semibold text-slate-600 group-hover:text-slate-900">
                      {link.label}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    {link.count !== undefined ? (
                      <span className="rounded-md bg-slate-100 px-2 py-0.5 text-[11px] font-bold tabular-nums text-slate-500">
                        {link.count}
                      </span>
                    ) : null}
                    <ChevronLeft className="size-4 text-slate-300 transition-all group-hover:-translate-x-0.5 group-hover:text-slate-600" />
                  </div>
                </Link>
              ))}
            </CardContent>
          </Card>

          <Card className="overflow-hidden rounded-3xl border border-slate-200/80 bg-white shadow-none lg:col-span-4">
            <CardHeader className="border-b border-slate-100 p-5">
              <CardTitle className="flex items-center gap-3 text-[15px] font-bold text-slate-800">
                <span className="flex size-9 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <Activity className="size-4" />
                </span>
                حالة المخزون
              </CardTitle>
            </CardHeader>
            <CardContent className="p-5">
              {showStatsSkeleton ? (
                <div className="space-y-5">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <Skeleton key={i} className="h-14 w-full rounded-xl" />
                  ))}
                </div>
              ) : stats ? (
                <div className="space-y-5">
                  <div className="rounded-2xl border border-slate-100 bg-slate-50/80 px-4 py-3">
                    <p className="text-[11px] font-semibold text-slate-400">إجمالي العربيات</p>
                    <p className="mt-1 text-2xl font-bold tabular-nums text-slate-900">
                      {(stats.totalCars || 0).toLocaleString("ar-EG")}
                    </p>
                  </div>
                  {stockItems.map((item) => {
                    const pct =
                      stats.totalCars > 0
                        ? Math.round((item.count / stats.totalCars) * 100)
                        : 0;
                    return (
                      <div key={item.label} className="space-y-2">
                        <div className="flex items-center justify-between gap-3">
                          <span className="text-sm font-semibold text-slate-600">{item.label}</span>
                          <div className="flex items-center gap-2">
                            <span className="text-[11px] font-bold tabular-nums text-slate-400">
                              {pct}%
                            </span>
                            <span
                              className={cn(
                                "rounded-md px-2 py-0.5 text-[11px] font-bold tabular-nums",
                                item.track,
                                item.text,
                              )}
                            >
                              {item.count}
                            </span>
                          </div>
                        </div>
                        <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                          <div
                            className={cn("h-full rounded-full transition-all duration-700", item.color)}
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="py-10 text-center text-sm text-slate-400">مفيش إحصائيات حالياً</div>
              )}
            </CardContent>
          </Card>

          <Card className="relative overflow-hidden rounded-3xl border-0 bg-[#13284F] text-white shadow-none lg:col-span-4">
            <div className="pointer-events-none absolute -left-8 top-0 size-44 rounded-full bg-[#E28328]/20 blur-3xl" />
            <div className="pointer-events-none absolute -right-10 bottom-0 size-40 rounded-full bg-sky-400/10 blur-3xl" />
            <CardHeader className="relative z-10 border-b border-white/10 p-5">
              <CardTitle className="flex items-center gap-3 text-[15px] font-bold text-white">
                <span className="flex size-9 items-center justify-center rounded-xl bg-white/10">
                  <Database className="size-4" />
                </span>
                أدوات النظام
              </CardTitle>
            </CardHeader>
            <CardContent className="relative z-10 space-y-4 p-5">
              <p className="text-sm font-medium leading-relaxed text-white/65">
                أدوات للمطورين فقط. تقدر تعيد ملء الداتا التجريبية أو تمسحها وقت الاختبار.
              </p>
              <div className="space-y-2 rounded-2xl border border-white/10 bg-white/5 p-3.5">
                <div className="flex items-center justify-between gap-2 text-xs">
                  <span className="font-semibold text-white/55">حساب الإدارة</span>
                  <code className="rounded-md bg-black/25 px-2 py-1 font-mono text-[10px] text-white/90">
                    admin@sooqsayaratalminya.com
                  </code>
                </div>
                <div className="flex items-center justify-between gap-2 text-xs">
                  <span className="font-semibold text-white/55">كلمة المرور</span>
                  <code className="rounded-md bg-black/25 px-2 py-1 font-mono text-[10px] text-white/90">
                    Admin@123
                  </code>
                </div>
              </div>
              <div className="hidden flex-col gap-2.5">
                <Button
                  className="h-10 w-full rounded-xl bg-white text-sm font-bold text-primary hover:bg-slate-100"
                  onClick={handleSeed}
                  disabled={seeding || clearing}
                >
                  {seeding ? (
                    <>
                      <Activity className="ml-2 size-4 animate-spin" />
                      جاري الاستعادة...
                    </>
                  ) : (
                    <>
                      <Sparkles className="ml-2 size-4" />
                      استعادة البيانات التجريبية
                    </>
                  )}
                </Button>
                <Button
                  className="h-10 w-full rounded-xl border-0 bg-rose-600 text-sm font-bold text-white hover:bg-rose-700"
                  onClick={handleClear}
                  disabled={seeding || clearing}
                >
                  {clearing ? (
                    <>
                      <Activity className="ml-2 size-4 animate-spin" />
                      جاري المسح...
                    </>
                  ) : (
                    <>
                      <Trash2 className="ml-2 size-4" />
                      مسح جميع البيانات
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent cars */}
        <Card className="overflow-hidden rounded-3xl border border-slate-200/80 bg-white shadow-none">
          <CardHeader className="flex flex-row items-center justify-between border-b border-slate-100 p-5">
            <CardTitle className="flex items-center gap-3 text-[15px] font-bold text-slate-800">
              <span className="flex size-9 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <Car className="size-4" />
              </span>
              أحدث الإضافات
            </CardTitle>
            <Button
              asChild
              variant="outline"
              size="sm"
              className="h-8 rounded-lg border-slate-200 px-3 text-xs font-semibold text-slate-600 hover:bg-slate-50"
            >
              <Link href="/admin/cars">عرض الكل</Link>
            </Button>
          </CardHeader>
          <CardContent className="overflow-x-auto p-0">
            {showCarsSkeleton ? (
              <div className="space-y-3 p-5">
                {Array.from({ length: 4 }).map((_, i) => (
                  <Skeleton key={i} className="h-12 w-full rounded-xl" />
                ))}
              </div>
            ) : recentCars.length > 0 ? (
              <table className="w-full min-w-[800px] border-collapse text-right">
                <thead>
                  <tr className="border-b border-slate-100 bg-slate-50/80 text-[11px] font-bold text-slate-500">
                    <th className="px-4 py-3.5 pr-6">المركبة</th>
                    <th className="px-4 py-3.5">السعر</th>
                    <th className="px-4 py-3.5">الموديل</th>
                    <th className="px-4 py-3.5">المواصفات</th>
                    <th className="px-4 py-3.5">الحالة</th>
                    <th className="px-4 py-3.5 pl-6 text-center">إجراء</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {recentCars.map((car: any) => (
                    <tr key={car._id} className="group transition-colors hover:bg-slate-50/80">
                      <td className="px-4 py-3.5 pr-6">
                        <div className="flex items-center gap-3">
                          <div className="relative h-11 w-14 shrink-0 overflow-hidden rounded-xl bg-slate-100 ring-1 ring-slate-200/70">
                            {car.images?.[0] ? (
                              <img
                                src={car.images[0]}
                                alt={`${car.brand} ${car.model}`}
                                className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                              />
                            ) : (
                              <div className="flex h-full w-full items-center justify-center text-slate-300">
                                <Car className="size-4" />
                              </div>
                            )}
                          </div>
                          <div>
                            <p className="text-sm font-bold text-slate-900">
                              {car.brand} {car.model}
                            </p>
                            <p className="mt-0.5 text-xs font-medium text-slate-400">
                              {(car.mileage || 0).toLocaleString("ar-EG")} كم • {car.color}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3.5 text-sm font-bold tabular-nums text-slate-900">
                        {car.price
                          ? `${Number(car.price).toLocaleString("ar-EG")} ج.م`
                          : "حسب الطلب"}
                      </td>
                      <td className="px-4 py-3.5 text-sm font-semibold text-slate-500">
                        {car.year}
                      </td>
                      <td className="px-4 py-3.5 text-xs font-medium text-slate-500">
                        <div className="flex flex-col gap-0.5">
                          <span>
                            {car.transmission === "manual" ? "يدوي" : "أوتوماتيك"}
                          </span>
                          <span className="text-slate-400">{car.fuelType}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3.5">
                        <span
                          className={cn(
                            "inline-flex items-center justify-center rounded-full px-2.5 py-1 text-[10px] font-bold",
                            car.status === "available" &&
                              "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-100",
                            car.status === "sold" &&
                              "bg-rose-50 text-rose-600 ring-1 ring-rose-100",
                            car.status === "reserved" &&
                              "bg-amber-50 text-amber-700 ring-1 ring-amber-100",
                          )}
                        >
                          {car.status === "available"
                            ? "متاحة"
                            : car.status === "sold"
                              ? "مباعة"
                              : "محجوزة"}
                        </span>
                      </td>
                      <td className="px-4 py-3.5 pl-6 text-center">
                        <div className="flex items-center justify-center gap-1">
                          <Button
                            asChild
                            size="sm"
                            variant="ghost"
                            className="size-8 rounded-lg p-0 text-slate-400 hover:bg-slate-100 hover:text-primary"
                          >
                            <Link href={`/admin/cars/${car._id}/edit`}>
                              <Settings className="size-4" />
                            </Link>
                          </Button>
                          <Button
                            asChild
                            size="sm"
                            variant="ghost"
                            className="size-8 rounded-lg p-0 text-slate-400 hover:bg-slate-100 hover:text-primary"
                          >
                            <Link
                              href={`/cars/${car._id}`}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              <ArrowUpRight className="size-4" />
                            </Link>
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="flex flex-col items-center gap-2 py-14 text-sm font-medium text-slate-400">
                <Car className="size-10 text-slate-200" />
                مفيش عربيات معروضة حالياً
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
