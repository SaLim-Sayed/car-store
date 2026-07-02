"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  format,
  subDays,
  subMonths,
  startOfDay,
  endOfDay,
  startOfMonth,
  endOfMonth,
  startOfYear,
  parse,
  isValid,
} from "date-fns";
import { ar } from "date-fns/locale";
import { CalendarDays, Trash2 } from "lucide-react";
import { type DateRange } from "react-day-picker";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  ShowroomAutocomplete,
  type ShowroomOption,
} from "@/components/showroom-autocomplete";
import { cn } from "@/lib/utils";

type DeleteCallsButtonProps = {
  showrooms: ShowroomOption[];
  defaultShowroomId?: string;
  defaultStartDate?: string;
  defaultEndDate?: string;
};

type PeriodPreset = {
  id: string;
  label: string;
  getRange: () => DateRange;
};

const PERIOD_PRESETS: PeriodPreset[] = [
  {
    id: "today",
    label: "اليوم",
    getRange: () => ({ from: startOfDay(new Date()), to: endOfDay(new Date()) }),
  },
  {
    id: "7d",
    label: "7 أيام",
    getRange: () => ({
      from: startOfDay(subDays(new Date(), 6)),
      to: endOfDay(new Date()),
    }),
  },
  {
    id: "30d",
    label: "30 يوم",
    getRange: () => ({
      from: startOfDay(subDays(new Date(), 29)),
      to: endOfDay(new Date()),
    }),
  },
  {
    id: "this_month",
    label: "هذا الشهر",
    getRange: () => ({ from: startOfMonth(new Date()), to: endOfDay(new Date()) }),
  },
  {
    id: "last_month",
    label: "الشهر الماضي",
    getRange: () => {
      const lastMonth = subMonths(new Date(), 1);
      return { from: startOfMonth(lastMonth), to: endOfMonth(lastMonth) };
    },
  },
  {
    id: "3m",
    label: "3 أشهر",
    getRange: () => ({
      from: startOfDay(subMonths(new Date(), 3)),
      to: endOfDay(new Date()),
    }),
  },
  {
    id: "ytd",
    label: "منذ السنة",
    getRange: () => ({ from: startOfYear(new Date()), to: endOfDay(new Date()) }),
  },
];

function parseDateString(value: string) {
  if (!value?.trim()) return null;
  const parsed = parse(value, "yyyy-MM-dd", new Date());
  return isValid(parsed) ? parsed : null;
}

function formatDateLabel(date: string | Date | undefined | null) {
  if (!date) return "—";
  const parsed = typeof date === "string" ? parseDateString(date) : isValid(date) ? date : null;
  if (!parsed) return "—";
  return format(parsed, "d MMM yyyy", { locale: ar });
}

function formatPeriodLabel(startDate: string, endDate: string) {
  const start = formatDateLabel(startDate);
  const end = formatDateLabel(endDate);
  if (start === "—" && end === "—") return "—";
  if (start !== "—" && end !== "—") return `${start} — ${end}`;
  if (start !== "—") return `من ${start}`;
  return `حتى ${end}`;
}

function rangeToStrings(range?: DateRange) {
  return {
    startDate: range?.from ? format(range.from, "yyyy-MM-dd") : "",
    endDate: range?.to ? format(range.to, "yyyy-MM-dd") : "",
  };
}

function DeleteDateRange({
  startDate,
  endDate,
  draftRange,
  onSelect,
}: {
  startDate: string;
  endDate: string;
  draftRange?: DateRange;
  onSelect: (range?: DateRange) => void;
}) {
  const [open, setOpen] = useState(false);
  const activeField: "from" | "to" | undefined =
    draftRange?.from && !draftRange?.to ? "to" : !draftRange?.from ? "from" : undefined;

  const displayStart =
    open && draftRange?.from ? format(draftRange.from, "yyyy-MM-dd") : startDate;
  const displayEnd = open ? (draftRange?.to ? format(draftRange.to, "yyyy-MM-dd") : "") : endDate;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          type="button"
          className="flex w-full items-stretch overflow-hidden rounded-lg border border-slate-200 bg-white text-right outline-none"
        >
          <div
            className={cn(
              "flex min-w-0 flex-1 items-center gap-2 px-3 py-2",
              activeField === "from" && "bg-slate-50",
            )}
          >
            <CalendarDays className="size-3.5 shrink-0 text-slate-400" />
            <div className="min-w-0">
              <p className="text-[10px] text-slate-400">من</p>
              <p className={cn("text-xs", displayStart ? "text-slate-800" : "text-slate-400")}>
                {displayStart ? formatDateLabel(displayStart) : "—"}
              </p>
            </div>
          </div>
          <div className="w-px bg-slate-200" />
          <div
            className={cn(
              "flex min-w-0 flex-1 px-3 py-2",
              activeField === "to" && "bg-slate-50",
            )}
          >
            <div className="min-w-0">
              <p className="text-[10px] text-slate-400">إلى</p>
              <p className={cn("text-xs", displayEnd ? "text-slate-800" : "text-slate-400")}>
                {displayEnd ? formatDateLabel(displayEnd) : "—"}
              </p>
            </div>
          </div>
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-auto rounded-lg p-0" align="start" sideOffset={4}>
        <Calendar
          mode="range"
          selected={draftRange}
          onSelect={onSelect}
          numberOfMonths={1}
          locale={ar}
          dir="rtl"
        />
        <div className="border-t border-slate-100 p-2">
          <Button
            type="button"
            size="sm"
            className="h-8 w-full text-xs"
            onClick={() => setOpen(false)}
          >
            تم
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}

export function DeleteCallsButton({
  showrooms,
  defaultShowroomId,
  defaultStartDate,
  defaultEndDate,
}: DeleteCallsButtonProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [countLoading, setCountLoading] = useState(false);
  const [previewCount, setPreviewCount] = useState<number | null>(null);
  const [selectedPreset, setSelectedPreset] = useState<string | null>(null);
  const [selectedShowroom, setSelectedShowroom] = useState("all");
  const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined);
  const [draftRange, setDraftRange] = useState<DateRange | undefined>(undefined);

  const { startDate, endDate } = rangeToStrings(dateRange);
  const hasValidRange = Boolean(parseDateString(startDate) && parseDateString(endDate));
  const selectedShowroomName =
    selectedShowroom === "all"
      ? "جميع المعارض"
      : showrooms.find((s) => s._id === selectedShowroom)?.name || "معرض محدد";

  const resetFromDefaults = useCallback(() => {
    setSelectedShowroom(defaultShowroomId && defaultShowroomId !== "all" ? defaultShowroomId : "all");
    setSelectedPreset(null);
    if (defaultStartDate || defaultEndDate) {
      setDateRange({
        from: defaultStartDate ? new Date(defaultStartDate) : undefined,
        to: defaultEndDate ? new Date(defaultEndDate) : undefined,
      });
    } else {
      setDateRange(PERIOD_PRESETS[2].getRange());
      setSelectedPreset("30d");
    }
    setDraftRange(undefined);
  }, [defaultShowroomId, defaultStartDate, defaultEndDate]);

  useEffect(() => {
    if (open) resetFromDefaults();
  }, [open, resetFromDefaults]);

  useEffect(() => {
    if (!open || !hasValidRange) {
      setPreviewCount(null);
      return;
    }

    const controller = new AbortController();
    const timer = setTimeout(async () => {
      setCountLoading(true);
      try {
        const params = new URLSearchParams();
        if (selectedShowroom !== "all") params.set("showroomId", selectedShowroom);
        params.set("startDate", startDate);
        params.set("endDate", endDate);

        const res = await fetch(`/api/admin/reports/showroom-clicks?${params.toString()}`, {
          signal: controller.signal,
        });
        const data = await res.json();
        setPreviewCount(data.success ? data.count : 0);
      } catch {
        if (!controller.signal.aborted) setPreviewCount(null);
      } finally {
        if (!controller.signal.aborted) setCountLoading(false);
      }
    }, 300);

    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [open, hasValidRange, selectedShowroom, startDate, endDate]);

  const applyPreset = (preset: PeriodPreset) => {
    setSelectedPreset(preset.id);
    setDateRange(preset.getRange());
    setDraftRange(undefined);
  };

  const handleDateSelect = (range?: DateRange) => {
    setDraftRange(range);
    setSelectedPreset(null);
    if (range?.from && range?.to) {
      setDateRange(range);
    } else if (range?.from) {
      setDateRange({ from: range.from, to: undefined });
    }
  };

  const handleDelete = async () => {
    if (!hasValidRange) {
      toast.error("يرجى تحديد فترة كاملة (من وإلى)");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/admin/reports/showroom-clicks", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          showroomId: selectedShowroom === "all" ? undefined : selectedShowroom,
          startDate,
          endDate,
        }),
      });
      const data = await res.json();

      if (!res.ok || !data.success) {
        toast.error(data.error || "فشل في حذف الاتصالات");
        return;
      }

      toast.success(data.message || "تم الحذف بنجاح");
      setConfirmOpen(false);
      setOpen(false);
      router.refresh();
    } catch {
      toast.error("حدث خطأ في الاتصال");
    } finally {
      setLoading(false);
    }
  };

  const requestDeleteConfirmation = () => {
    if (!hasValidRange) {
      toast.error("يرجى تحديد فترة كاملة (من وإلى)");
      return;
    }
    if (previewCount === 0) return;
    setConfirmOpen(true);
  };

  const deleteLabel = !hasValidRange
    ? "حدد الفترة أولاً"
    : countLoading
      ? "جاري الحساب..."
      : previewCount === 0
        ? "لا توجد اتصالات"
        : `حذف ${(previewCount ?? 0).toLocaleString("ar-EG")} اتصال`;

  return (
    <>
      <Drawer open={open} onOpenChange={setOpen}>
        <DrawerTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            className="h-9 rounded-lg border-rose-200 text-xs text-rose-600 hover:bg-rose-50 sm:text-sm"
          >
            <Trash2 className="ml-1.5 size-3.5" />
            حذف الاتصالات
          </Button>
        </DrawerTrigger>

        <DrawerContent>
          <DrawerHeader className="space-y-1">
            <DrawerTitle className="text-base font-semibold">حذف سجل الاتصالات</DrawerTitle>
            <DrawerDescription className="text-xs font-normal text-slate-500">
              اختر المعرض والفترة. الإجراء نهائي ولا يمكن التراجع عنه.
            </DrawerDescription>
          </DrawerHeader>

          <div className="flex-1 space-y-4 overflow-y-auto px-4 py-3 sm:px-5">
            <section className="space-y-2">
              <p className="text-xs font-medium text-slate-600">الفترة</p>
              <div className="flex gap-1.5 overflow-x-auto pb-0.5 scrollbar-none">
                {PERIOD_PRESETS.map((preset) => (
                  <button
                    key={preset.id}
                    type="button"
                    onClick={() => applyPreset(preset)}
                    className={cn(
                      "shrink-0 rounded-md border px-2.5 py-1.5 text-xs font-medium transition-colors",
                      selectedPreset === preset.id
                        ? "border-primary bg-primary/5 text-primary"
                        : "border-slate-200 text-slate-600 hover:bg-slate-50",
                    )}
                  >
                    {preset.label}
                  </button>
                ))}
              </div>
              <DeleteDateRange
                startDate={startDate}
                endDate={endDate}
                draftRange={draftRange ?? dateRange}
                onSelect={handleDateSelect}
              />
            </section>

            <section className="space-y-2">
              <p className="text-xs font-medium text-slate-600">المعرض</p>
              <ShowroomAutocomplete
                showrooms={showrooms}
                value={selectedShowroom}
                onChange={setSelectedShowroom}
                listId="delete-showroom-options"
              />
            </section>

            {hasValidRange && (
              <div className="rounded-lg border border-slate-100 bg-slate-50 px-3 py-2.5 text-xs text-slate-600">
                <span className="font-medium text-slate-800">{selectedShowroomName}</span>
                <span className="mx-1.5 text-slate-300">·</span>
                <span>{formatPeriodLabel(startDate, endDate)}</span>
                <span className="mx-1.5 text-slate-300">·</span>
                <span className="font-medium text-rose-600 tabular-nums">
                  {countLoading ? "…" : (previewCount ?? 0).toLocaleString("ar-EG")} اتصال
                </span>
              </div>
            )}
          </div>

          <DrawerFooter className="gap-2">
            <Button
              onClick={requestDeleteConfirmation}
              disabled={loading || !hasValidRange || countLoading || previewCount === 0}
              className="h-10 rounded-lg bg-rose-600 text-sm font-medium text-white hover:bg-rose-700"
            >
              {deleteLabel}
            </Button>
            <Button
              variant="outline"
              className="h-10 rounded-lg text-sm"
              onClick={() => setOpen(false)}
            >
              إلغاء
            </Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>

      <Dialog open={confirmOpen && hasValidRange} onOpenChange={setConfirmOpen}>
        <DialogContent className="w-[calc(100%-1.5rem)] max-w-sm rounded-xl p-5">
          <DialogHeader>
            <DialogTitle className="text-base font-semibold">تأكيد الحذف</DialogTitle>
            <DialogDescription asChild>
              <div className="space-y-2 pt-1 text-sm text-slate-500">
                <p>
                  سيتم حذف{" "}
                  <span className="font-semibold text-rose-600 tabular-nums">
                    {(previewCount ?? 0).toLocaleString("ar-EG")}
                  </span>{" "}
                  اتصالاً نهائياً.
                </p>
                <p className="rounded-md bg-slate-50 px-3 py-2 text-xs text-slate-600">
                  {selectedShowroomName} · {formatPeriodLabel(startDate, endDate)}
                </p>
              </div>
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex-col gap-2 sm:flex-row">
            <DialogClose asChild>
              <Button variant="outline" className="h-9 w-full text-sm sm:w-auto" disabled={loading}>
                إلغاء
              </Button>
            </DialogClose>
            <Button
              onClick={() => void handleDelete()}
              disabled={loading}
              className="h-9 w-full bg-rose-600 text-sm text-white hover:bg-rose-700 sm:w-auto"
            >
              {loading ? "جاري الحذف..." : "تأكيد الحذف"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
