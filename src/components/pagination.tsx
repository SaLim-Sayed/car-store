"use client";

import { ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  formatPaginationSummary,
  getPaginationRange,
  scrollToTopSmooth,
} from "@/lib/pagination";

type PaginationProps = {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  totalItems?: number;
  pageSize?: number;
  itemLabel?: string;
  variant?: "default" | "admin";
  scrollToTop?: boolean;
  className?: string;
  showSummary?: boolean;
};

export function Pagination({
  page,
  totalPages,
  onPageChange,
  totalItems,
  pageSize,
  itemLabel = "عنصر",
  variant = "default",
  scrollToTop = false,
  className,
  showSummary = true,
}: PaginationProps) {
  if (totalPages <= 1) return null;

  const tokens = getPaginationRange(page, totalPages);
  const summary =
    totalItems !== undefined && pageSize !== undefined
      ? formatPaginationSummary(page, pageSize, totalItems, itemLabel)
      : `صفحة ${page} من ${totalPages}`;

  const goToPage = (nextPage: number) => {
    if (nextPage < 1 || nextPage > totalPages || nextPage === page) return;
    onPageChange(nextPage);
    if (scrollToTop) scrollToTopSmooth();
  };

  const isAdmin = variant === "admin";

  return (
    <nav
      aria-label="التنقل بين الصفحات"
      className={cn(
        isAdmin
          ? "flex flex-col gap-3 border-t border-slate-100 bg-white p-4 sm:flex-row sm:items-center sm:justify-between"
          : "mt-12 flex flex-col items-center gap-4",
        className,
      )}
    >
      {showSummary ? (
        <p
          className={cn(
            "text-sm font-medium text-slate-500",
            isAdmin ? "text-right" : "text-center",
          )}
        >
          {summary}
        </p>
      ) : null}

      <div className="flex items-center justify-center gap-1">
        <Button
          type="button"
          variant="outline"
          size={isAdmin ? "sm" : "default"}
          onClick={() => goToPage(page - 1)}
          disabled={page <= 1}
          aria-label="الصفحة السابقة"
          className={cn(
            "gap-1.5 font-semibold",
            isAdmin
              ? "h-9 rounded-lg border-slate-200 text-slate-600"
              : "h-11 rounded-xl px-4",
          )}
        >
          <ChevronRight className="size-4" aria-hidden />
          <span className="hidden sm:inline">السابق</span>
        </Button>

        <div className="hidden items-center gap-1 px-1 sm:flex">
          {tokens.map((token, index) =>
            token === "ellipsis" ? (
              <span
                key={`ellipsis-${index}`}
                className="flex size-9 items-center justify-center text-slate-400"
                aria-hidden
              >
                <MoreHorizontal className="size-4" />
              </span>
            ) : (
              <Button
                key={token}
                type="button"
                variant={page === token ? "default" : "ghost"}
                size="sm"
                onClick={() => goToPage(token)}
                aria-label={`الصفحة ${token}`}
                aria-current={page === token ? "page" : undefined}
                className={cn(
                  "size-9 rounded-lg p-0 font-semibold tabular-nums",
                  page === token
                    ? "bg-primary text-white shadow-sm"
                    : "text-slate-600 hover:bg-slate-100",
                )}
              >
                {token}
              </Button>
            ),
          )}
        </div>

        <span
          className="flex h-11 min-w-[4.5rem] items-center justify-center rounded-xl bg-slate-50 px-3 text-sm font-semibold tabular-nums text-slate-700 sm:hidden"
          aria-live="polite"
        >
          {page} / {totalPages}
        </span>

        <Button
          type="button"
          variant="outline"
          size={isAdmin ? "sm" : "default"}
          onClick={() => goToPage(page + 1)}
          disabled={page >= totalPages}
          aria-label="الصفحة التالية"
          className={cn(
            "gap-1.5 font-semibold",
            isAdmin
              ? "h-9 rounded-lg border-slate-200 text-slate-600"
              : "h-11 rounded-xl px-4",
          )}
        >
          <span className="hidden sm:inline">التالي</span>
          <ChevronLeft className="size-4" aria-hidden />
        </Button>
      </div>
    </nav>
  );
}

type LoadMorePaginationProps = {
  loadedCount: number;
  totalCount?: number;
  itemLabel?: string;
  hasMore: boolean;
  isLoading?: boolean;
  onLoadMore: () => void;
  sentinelRef?: (node?: Element | null) => void;
  className?: string;
};

export function LoadMorePagination({
  loadedCount,
  totalCount,
  itemLabel = "عنصر",
  hasMore,
  isLoading = false,
  onLoadMore,
  sentinelRef,
  className,
}: LoadMorePaginationProps) {
  const summary =
    totalCount !== undefined
      ? `عرض ${loadedCount} من ${totalCount} ${itemLabel}`
      : `تم تحميل ${loadedCount} ${itemLabel}`;

  return (
    <div className={cn("space-y-4 pt-8", className)}>
      <p className="text-center text-sm font-medium text-slate-500">{summary}</p>

      {hasMore ? (
        <div className="flex flex-col items-center gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={onLoadMore}
            disabled={isLoading}
            className="h-11 min-w-[10rem] rounded-xl font-semibold"
          >
            {isLoading ? "جاري التحميل..." : "تحميل المزيد"}
          </Button>
          {sentinelRef ? <div ref={sentinelRef} className="h-1 w-full" aria-hidden /> : null}
          {isLoading ? (
            <div className="size-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          ) : null}
        </div>
      ) : totalCount !== undefined && loadedCount > 0 ? (
        <p className="text-center text-xs font-medium text-slate-400">تم عرض كل النتائج</p>
      ) : null}
    </div>
  );
}
