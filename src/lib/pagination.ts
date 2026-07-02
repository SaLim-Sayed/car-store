export type PaginationToken = number | "ellipsis";

export function getPaginationRange(
  currentPage: number,
  totalPages: number,
  delta = 1,
): PaginationToken[] {
  if (totalPages <= 0) return [];
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, index) => index + 1);
  }

  const pages = new Set<number>([1, totalPages, currentPage]);

  for (let offset = 1; offset <= delta; offset += 1) {
    pages.add(currentPage - offset);
    pages.add(currentPage + offset);
  }

  const sorted = [...pages].filter((page) => page >= 1 && page <= totalPages).sort((a, b) => a - b);
  const result: PaginationToken[] = [];
  let previous: number | null = null;

  for (const page of sorted) {
    if (previous !== null && page - previous > 1) {
      result.push("ellipsis");
    }
    result.push(page);
    previous = page;
  }

  return result;
}

export function formatPaginationSummary(
  page: number,
  pageSize: number,
  totalItems: number,
  itemLabel: string,
): string {
  if (totalItems <= 0) {
    return `لا توجد ${itemLabel}`;
  }

  const from = (page - 1) * pageSize + 1;
  const to = Math.min(page * pageSize, totalItems);
  return `عرض ${from} إلى ${to} من أصل ${totalItems} ${itemLabel}`;
}

export function scrollToTopSmooth() {
  if (typeof window === "undefined") return;
  window.scrollTo({ top: 0, behavior: "smooth" });
}
