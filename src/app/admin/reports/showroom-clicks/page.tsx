import { Metadata } from "next";
import connectDB from "@/lib/mongoose";
import ClickTrack from "@/lib/models/ClickTrack";
import Showroom from "@/lib/models/Showroom";
import { Card, CardContent } from "@/components/ui/card";
import { Store, Ghost } from "lucide-react";
import { ShowroomClicksChart } from "@/components/charts/ShowroomClicksChart";
import { ShowroomFilter } from "@/components/showroom-filter";
import { DeleteCallsButton } from "@/components/delete-calls-button";
import { ReportCallGroups } from "@/components/report-call-groups";
import { cn } from "@/lib/utils";
import { buildShowroomClicksMatchQuery } from "@/lib/showroom-clicks-query";

export const metadata: Metadata = {
  title: "تقارير اتصالات المعارض | لوحة التحكم",
};

export const dynamic = "force-dynamic";

const ITEM_TYPE_LABELS: Record<string, string> = {
  car: "سيارة",
  equipment: "معدة",
  bike: "دراجة نارية",
  showroom: "تواصل مباشر",
};

async function getStats(showroomId?: string, startDate?: string, endDate?: string) {
  await connectDB();

  const matchQuery = buildShowroomClicksMatchQuery(showroomId, startDate, endDate);

  const stats = await ClickTrack.aggregate([
    { $match: matchQuery },
    {
      $group: {
        _id: "$targetId",
        totalClicks: { $sum: 1 },
        lastClick: { $max: "$createdAt" },
      },
    },
    { $sort: { totalClicks: -1 } },
  ]);

  const populatedStats = await Promise.all(
    stats.map(async (stat) => {
      const showroom = await Showroom.findById(stat._id).select("name logo").lean();
      return {
        ...stat,
        showroom: showroom ? { name: showroom.name, logo: showroom.logo } : null,
      };
    }),
  );

  const allShowrooms = await Showroom.find({}).select("name").lean();

  return {
    stats: populatedStats.filter((s) => s.showroom),
    allShowrooms: allShowrooms.map((s) => ({ _id: s._id.toString(), name: s.name })),
    matchQuery,
  };
}

function Metric({
  label,
  value,
  hint,
}: {
  label: string;
  value: string;
  hint?: string;
}) {
  return (
    <div className="rounded-lg border border-slate-200 bg-white px-3 py-3 sm:px-4">
      <p className="text-[11px] font-medium text-slate-500 sm:text-xs">{label}</p>
      <p className="mt-1 text-xl font-semibold tabular-nums text-slate-900 sm:text-2xl">{value}</p>
      {hint ? (
        <p className="mt-0.5 truncate text-[11px] text-slate-400 sm:text-xs">{hint}</p>
      ) : null}
    </div>
  );
}

function formatReportDate(value: string) {
  return new Date(value).toLocaleDateString("ar-EG", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export default async function ShowroomClicksReportPage({
  searchParams,
}: {
  searchParams: Promise<{ showroomId?: string; startDate?: string; endDate?: string }>;
}) {
  const params = await searchParams;
  const showroomId = params.showroomId;
  const startDate = params.startDate;
  const endDate = params.endDate;
  const { stats, allShowrooms, matchQuery } = await getStats(showroomId, startDate, endDate);

  const totalGlobalClicks = stats.reduce((acc, curr) => acc + curr.totalClicks, 0);
  const avgClicks =
    stats.length > 0 ? Math.round((totalGlobalClicks / stats.length) * 10) / 10 : 0;
  const topShowroom = stats[0];

  const recentClicksLimit = startDate || endDate ? 2000 : 200;
  const recentClicks = await ClickTrack.find(matchQuery)
    .sort({ createdAt: -1 })
    .limit(recentClicksLimit)
    .lean();

  const typeBreakdown = recentClicks.reduce<Record<string, number>>((acc, click) => {
    const type = (click.metadata as { itemType?: string } | undefined)?.itemType || "other";
    acc[type] = (acc[type] || 0) + 1;
    return acc;
  }, {});

  const groupedClicks: Record<string, { showroomName: string; clicks: typeof recentClicks }> = {};

  recentClicks.forEach((click) => {
    const statMatch = stats.find((s) => String(s._id) === String(click.targetId));
    const showroomName = statMatch?.showroom?.name || "معرض محذوف";

    if (!groupedClicks[showroomName]) {
      groupedClicks[showroomName] = { showroomName, clicks: [] };
    }
    groupedClicks[showroomName].clicks.push(click);
  });

  const groupedClicksArray = Object.values(groupedClicks);
  const selectedShowroomName =
    showroomId && showroomId !== "all"
      ? allShowrooms.find((s) => s._id === showroomId)?.name
      : null;

  const serializedGroups = groupedClicksArray.map((group) => ({
    showroomName: group.showroomName,
    clicks: group.clicks.map((click) => ({
      itemName:
        (click.metadata as { itemName?: string } | undefined)?.itemName || "غير محدد",
      itemType: (click.metadata as { itemType?: string } | undefined)?.itemType || "",
      createdAt: new Date(click.createdAt).toISOString(),
    })),
  }));

  return (
    <div className="min-h-screen bg-slate-50/50 print:bg-white print:min-h-0">
      <main className="mx-auto max-w-6xl space-y-5 px-1 py-1 sm:space-y-6 sm:px-0 sm:py-0 print:max-w-none">
        {/* Header + filters */}
        <div className="space-y-3 print:hidden">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div className="min-w-0">
              <h1 className="text-lg font-semibold text-slate-900 sm:text-xl">
                تقارير اتصالات المعارض
              </h1>
              <p className="mt-0.5 text-xs text-slate-500 sm:text-sm">
                إحصائيات واتصالات حسب المعرض والفترة
              </p>
            </div>
            <DeleteCallsButton
              showrooms={allShowrooms}
              defaultShowroomId={showroomId}
              defaultStartDate={startDate}
              defaultEndDate={endDate}
            />
          </div>
          <ShowroomFilter showrooms={allShowrooms} />
        </div>

        {/* Print header */}
        <div className="mb-6 hidden border-b border-slate-200 pb-4 text-center print:block">
          <h1 className="text-2xl font-semibold text-black">تقرير اتصالات المعارض</h1>
          <p className="mt-1 text-sm text-slate-600">{selectedShowroomName || "جميع المعارض"}</p>
          {(startDate || endDate) && (
            <p className="mt-1 text-xs text-slate-500">
              {startDate ? formatReportDate(startDate) : "…"} —{" "}
              {endDate ? formatReportDate(endDate) : "…"}
            </p>
          )}
        </div>

        {/* Metrics */}
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 sm:gap-3 print:grid-cols-4">
          <Metric
            label="إجمالي الاتصالات"
            value={totalGlobalClicks.toLocaleString("ar-EG")}
          />
          <Metric label="معارض نشطة" value={stats.length.toLocaleString("ar-EG")} />
          <Metric label="المتوسط" value={avgClicks.toLocaleString("ar-EG")} hint="لكل معرض" />
          <Metric
            label="الأعلى"
            value={topShowroom?.totalClicks?.toLocaleString("ar-EG") || "0"}
            hint={topShowroom?.showroom?.name}
          />
        </div>

        {/* Type breakdown — compact */}
        {recentClicks.length > 0 && Object.keys(typeBreakdown).length > 0 && (
          <div className="flex flex-wrap gap-1.5 print:hidden">
            {Object.entries(typeBreakdown)
              .sort((a, b) => b[1] - a[1])
              .map(([type, count]) => {
                const pct = Math.round((count / recentClicks.length) * 100);
                return (
                  <span
                    key={type}
                    className="inline-flex items-center gap-1.5 rounded-md border border-slate-200 bg-white px-2.5 py-1 text-xs text-slate-600"
                  >
                    <span className="font-medium text-slate-800">
                      {ITEM_TYPE_LABELS[type] || type}
                    </span>
                    <span className="tabular-nums text-slate-400">
                      {count} · {pct}%
                    </span>
                  </span>
                );
              })}
          </div>
        )}

        {/* Chart + ranking */}
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-5 print:hidden">
          {stats.length > 0 && (
            <div className="hidden md:block lg:col-span-3">
              <ShowroomClicksChart
                data={stats.map((s) => ({
                  name: s.showroom?.name || "محذوف",
                  clicks: s.totalClicks,
                }))}
              />
            </div>
          )}

          <Card
            className={cn(
              "overflow-hidden rounded-lg border-slate-200 shadow-none",
              stats.length > 0 ? "lg:col-span-2" : "lg:col-span-5",
            )}
          >
            <div className="border-b border-slate-100 px-4 py-3">
              <h2 className="text-sm font-medium text-slate-800">ترتيب المعارض</h2>
            </div>
            <div className="divide-y divide-slate-100">
              {stats.length > 0 ? (
                stats.map((stat, index) => {
                  const share =
                    totalGlobalClicks > 0
                      ? Math.round((stat.totalClicks / totalGlobalClicks) * 100)
                      : 0;

                  return (
                    <div
                      key={String(stat._id)}
                      className="flex items-center gap-3 px-4 py-3 hover:bg-slate-50/80"
                    >
                      <span className="w-5 shrink-0 text-center text-xs font-medium text-slate-400 tabular-nums">
                        {index + 1}
                      </span>
                      <div className="flex size-8 shrink-0 items-center justify-center overflow-hidden rounded-md border border-slate-100 bg-slate-50">
                        {stat.showroom?.logo ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={stat.showroom.logo}
                            alt={stat.showroom.name}
                            className="size-full object-cover"
                          />
                        ) : (
                          <Store className="size-3.5 text-slate-300" />
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium text-slate-900">
                          {stat.showroom?.name}
                        </p>
                        <p className="text-[11px] text-slate-400 tabular-nums">
                          {share}% ·{" "}
                          {new Date(stat.lastClick).toLocaleString("ar-EG", {
                            dateStyle: "short",
                            timeStyle: "short",
                          })}
                        </p>
                      </div>
                      <span className="shrink-0 text-sm font-semibold tabular-nums text-slate-900">
                        {stat.totalClicks}
                      </span>
                    </div>
                  );
                })
              ) : (
                <div className="px-4 py-12 text-center">
                  <Ghost className="mx-auto mb-3 size-10 text-slate-300" />
                  <p className="text-sm text-slate-500">لا توجد بيانات في هذه الفترة</p>
                </div>
              )}
            </div>
          </Card>
        </div>

        {/* Call log */}
        <section className="space-y-3 print:space-y-4">
          <div className="flex items-baseline justify-between gap-2">
            <h2 className="text-sm font-medium text-slate-800">سجل الاتصالات</h2>
            <span className="text-xs text-slate-400 tabular-nums">
              {recentClicks.length.toLocaleString("ar-EG")} سجل
            </span>
          </div>

          {groupedClicksArray.length > 0 ? (
            <ReportCallGroups groups={serializedGroups} />
          ) : (
            <Card className="rounded-lg border-dashed border-slate-200 bg-white shadow-none">
              <CardContent className="flex flex-col items-center justify-center py-16 text-center">
                <Ghost className="mb-3 size-10 text-slate-300 print:hidden" />
                <p className="text-sm text-slate-600">لا توجد اتصالات في هذه الفترة</p>
              </CardContent>
            </Card>
          )}
        </section>
      </main>
    </div>
  );
}
