"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Printer, CalendarDays, FilterX } from "lucide-react";
import { useEffect, useState } from "react";
import { ShowroomAutocomplete, type ShowroomOption } from "@/components/showroom-autocomplete";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format, subDays, startOfDay, endOfDay, startOfMonth } from "date-fns";
import { ar } from "date-fns/locale";
import { type DateRange } from "react-day-picker";
import { cn } from "@/lib/utils";

function formatDateLabel(date: string) {
  return format(new Date(date), "d MMM yyyy", { locale: ar });
}

function DateRangeDisplay({
  startDate,
  endDate,
  activeField,
}: {
  startDate: string;
  endDate: string;
  activeField?: "from" | "to";
}) {
  return (
    <div className="flex w-full items-stretch overflow-hidden rounded-lg border border-slate-200 bg-white sm:w-auto">
      <div
        className={cn(
          "flex min-w-0 flex-1 items-center gap-2 px-3 py-2 text-right",
          activeField === "from" && "bg-slate-50",
        )}
      >
        <CalendarDays className="size-3.5 shrink-0 text-slate-400" />
        <div className="min-w-0">
          <p className="text-[10px] text-slate-400">من</p>
          <p className={cn("text-xs", startDate ? "text-slate-800" : "text-slate-400")}>
            {startDate ? formatDateLabel(startDate) : "—"}
          </p>
        </div>
      </div>
      <div className="w-px self-stretch bg-slate-200" />
      <div
        className={cn(
          "flex min-w-0 flex-1 items-center px-3 py-2 text-right",
          activeField === "to" && "bg-slate-50",
        )}
      >
        <div className="min-w-0">
          <p className="text-[10px] text-slate-400">إلى</p>
          <p className={cn("text-xs", endDate ? "text-slate-800" : "text-slate-400")}>
            {endDate ? formatDateLabel(endDate) : "—"}
          </p>
        </div>
      </div>
    </div>
  );
}

function rangeFromParams(startDate: string, endDate: string): DateRange | undefined {
  if (!startDate && !endDate) return undefined;
  return {
    from: startDate ? new Date(startDate) : undefined,
    to: endDate ? new Date(endDate) : undefined,
  };
}

const QUICK_PERIODS: { id: string; label: string; getRange: () => DateRange }[] = [
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
    id: "month",
    label: "هذا الشهر",
    getRange: () => ({ from: startOfMonth(new Date()), to: endOfDay(new Date()) }),
  },
];

export function ShowroomFilter({ showrooms }: { showrooms: ShowroomOption[] }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [dateOpen, setDateOpen] = useState(false);
  const [monthsToShow, setMonthsToShow] = useState(1);
  const [draftRange, setDraftRange] = useState<DateRange | undefined>(undefined);
  const currentShowroom = searchParams.get("showroomId") || "all";
  const startDate = searchParams.get("startDate") || "";
  const endDate = searchParams.get("endDate") || "";

  const selectedRange = rangeFromParams(startDate, endDate);
  const displayStartDate =
    dateOpen && draftRange?.from ? format(draftRange.from, "yyyy-MM-dd") : startDate;
  const displayEndDate = dateOpen
    ? draftRange?.to
      ? format(draftRange.to, "yyyy-MM-dd")
      : ""
    : endDate;
  const activeField: "from" | "to" | undefined = dateOpen
    ? draftRange?.from && !draftRange?.to
      ? "to"
      : !draftRange?.from
        ? "from"
        : undefined
    : undefined;

  const applyRangeToUrl = (range?: DateRange) => {
    const params = new URLSearchParams(searchParams.toString());

    if (range?.from) {
      params.set("startDate", format(range.from, "yyyy-MM-dd"));
    } else {
      params.delete("startDate");
    }

    if (range?.to) {
      params.set("endDate", format(range.to, "yyyy-MM-dd"));
    } else {
      params.delete("endDate");
    }

    router.push(`${pathname}?${params.toString()}`);
  };

  const handleDateOpenChange = (open: boolean) => {
    setDateOpen(open);
    if (open) {
      setDraftRange(selectedRange);
    }
  };

  const handleDraftSelect = (range?: DateRange) => {
    setDraftRange(range);
    if (range?.from && range?.to) {
      applyRangeToUrl(range);
    }
  };

  const clearDraftRange = () => {
    setDraftRange(undefined);
    applyRangeToUrl(undefined);
  };

  const clearFilters = () => {
    setDraftRange(undefined);
    router.push(pathname);
  };

  const updateParams = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value && value !== "all") {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    router.push(`${pathname}?${params.toString()}`);
  };

  const hasFilters =
    Boolean(startDate || endDate || (currentShowroom && currentShowroom !== "all"));

  useEffect(() => {
    const media = window.matchMedia("(min-width: 640px)");
    const update = () => setMonthsToShow(media.matches ? 2 : 1);
    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);

  return (
    <div className="rounded-lg border border-slate-200 bg-white p-3 print:hidden sm:p-4">
      <div className="flex flex-col gap-3">
        <div className="flex flex-wrap items-center gap-2">
          {QUICK_PERIODS.map((period) => (
            <button
              key={period.id}
              type="button"
              onClick={() => applyRangeToUrl(period.getRange())}
              className="rounded-md border border-slate-200 px-2.5 py-1 text-[11px] font-medium text-slate-600 transition-colors hover:border-slate-300 hover:bg-slate-50 sm:text-xs"
            >
              {period.label}
            </button>
          ))}
        </div>

        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
          <Popover open={dateOpen} onOpenChange={handleDateOpenChange}>
            <PopoverTrigger asChild>
              <button type="button" className="w-full text-right outline-none sm:w-auto">
                <DateRangeDisplay
                  startDate={displayStartDate}
                  endDate={displayEndDate}
                  activeField={activeField}
                />
              </button>
            </PopoverTrigger>
            <PopoverContent
              className="w-[calc(100vw-2rem)] max-w-none rounded-lg p-0 sm:w-auto"
              align="start"
              sideOffset={6}
              onOpenAutoFocus={(e) => e.preventDefault()}
            >
              <Calendar
                mode="range"
                defaultMonth={draftRange?.from ?? draftRange?.to ?? new Date()}
                selected={draftRange}
                onSelect={handleDraftSelect}
                numberOfMonths={monthsToShow}
                locale={ar}
                dir="rtl"
              />
              <div className="flex items-center justify-between border-t border-slate-100 px-3 py-2">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="h-8 text-xs text-slate-500"
                  onClick={clearDraftRange}
                >
                  مسح
                </Button>
                <Button
                  type="button"
                  size="sm"
                  className="h-8 text-xs"
                  onClick={() => setDateOpen(false)}
                >
                  تم
                </Button>
              </div>
            </PopoverContent>
          </Popover>

          <ShowroomAutocomplete
            showrooms={showrooms}
            value={currentShowroom}
            onChange={(id) => updateParams("showroomId", id)}
            className="sm:min-w-[200px] sm:flex-1"
          />

          <div className="flex gap-2">
            {hasFilters && (
              <Button
                onClick={clearFilters}
                variant="outline"
                size="sm"
                className="h-9 flex-1 rounded-lg text-xs sm:flex-none"
              >
                <FilterX className="ml-1.5 size-3.5" />
                مسح
              </Button>
            )}
            <Button
              onClick={() => window.print()}
              size="sm"
              variant="outline"
              className="h-9 flex-1 rounded-lg text-xs sm:flex-none"
            >
              <Printer className="ml-1.5 size-3.5" />
              طباعة
            </Button>
          </div>
        </div>

        {hasFilters && (
          <div className="flex flex-wrap gap-1.5 border-t border-slate-100 pt-2.5">
            {currentShowroom !== "all" && (
              <span className="rounded-md bg-slate-100 px-2 py-0.5 text-[11px] text-slate-600">
                {showrooms.find((s) => s._id === currentShowroom)?.name}
              </span>
            )}
            {startDate && (
              <span className="rounded-md bg-slate-100 px-2 py-0.5 text-[11px] text-slate-600 tabular-nums">
                من {formatDateLabel(startDate)}
              </span>
            )}
            {endDate && (
              <span className="rounded-md bg-slate-100 px-2 py-0.5 text-[11px] text-slate-600 tabular-nums">
                إلى {formatDateLabel(endDate)}
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
