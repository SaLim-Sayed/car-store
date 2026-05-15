/** ISO calendar date: YYYY-MM-DD */
export type IsoDateString = string

export function todayIso(): IsoDateString {
  return new Date().toISOString().slice(0, 10)
}

export function currentYear(): number {
  return new Date().getFullYear()
}

export function yearOptions(
  startYear = 1950,
  endYear = currentYear() + 1
): number[] {
  const years: number[] = []
  for (let y = endYear; y >= startYear; y--) years.push(y)
  return years
}

/** Normalize stored values (ISO or legacy Arabic/locale strings) to YYYY-MM-DD for inputs */
export function parseToIsoDate(value: string | undefined | null): IsoDateString {
  if (!value?.trim()) return ""

  const trimmed = value.trim()
  if (/^\d{4}-\d{2}-\d{2}$/.test(trimmed)) return trimmed
  if (trimmed.includes("T") && /^\d{4}-\d{2}-\d{2}/.test(trimmed)) {
    return trimmed.slice(0, 10)
  }

  const digits = trimmed.match(/\d+/g)
  if (digits && digits.length >= 3) {
    let day: number
    let month: number
    let year: number

    if (digits[0].length === 4) {
      ;[year, month, day] = digits.map(Number)
    } else {
      ;[day, month, year] = digits.map(Number)
      if (year < 100) year += 2000
    }

    if (year >= 1900 && month >= 1 && month <= 12 && day >= 1 && day <= 31) {
      return `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`
    }
  }

  const parsed = new Date(trimmed)
  if (!Number.isNaN(parsed.getTime())) {
    return parsed.toISOString().slice(0, 10)
  }

  return ""
}

/** Arabic long date for UI lists (e.g. 15 مايو 2026) */
export function formatDateDisplay(value: string | undefined | null): string {
  const iso = parseToIsoDate(value ?? "")
  if (!iso) return value?.trim() || ""

  const [y, m, d] = iso.split("-").map(Number)
  return new Intl.DateTimeFormat("ar-EG", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(new Date(y, m - 1, d))
}

export function isoFromYear(year: string | number): IsoDateString {
  const y = typeof year === "string" ? parseInt(year, 10) : year
  if (!y || Number.isNaN(y)) return ""
  return `${y}-01-01`
}

export function yearFromValue(value: string | number | undefined | null): string {
  if (value === undefined || value === null || value === "") return ""
  const str = String(value)
  if (/^\d{4}$/.test(str)) return str
  const iso = parseToIsoDate(str)
  if (iso) return iso.slice(0, 4)
  const n = parseInt(str, 10)
  return Number.isNaN(n) ? "" : String(n)
}
