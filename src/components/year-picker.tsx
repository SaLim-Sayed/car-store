"use client"

import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"
import { currentYear, yearOptions } from "@/lib/date-utils"

interface YearPickerProps {
 id?: string
 label?: string
 value: string
 onChange: (year: string) => void
 error?: string
 required?: boolean
 startYear?: number
 endYear?: number
 className?: string
 selectClassName?: string
 disabled?: boolean
}

export function YearPicker({
 id,
 label,
 value,
 onChange,
 error,
 required,
 startYear = 1950,
 endYear = currentYear() + 1,
 className,
 selectClassName,
 disabled,
}: YearPickerProps) {
 const inputId = id || "year-picker"
 const years = yearOptions(startYear, endYear)

 return (
 <div className={cn("space-y-3", className)}>
 {label && (
 <Label htmlFor={inputId} className="text-lg font-black">
 {label}
 {required && " *"}
 </Label>
 )}
 <select
 id={inputId}
 value={value}
 onChange={(e) => onChange(e.target.value)}
 disabled={disabled}
 required={required}
 className={cn(
 "flex h-14 w-full rounded-md border-2 bg-white px-6 py-2 text-lg font-bold focus:border-primary focus:outline-none transition-colors",
 error ? "border-red-500" : "border-gray-50",
 selectClassName
 )}
 >
 <option value="">اختر السنة</option>
 {years.map((y) => (
 <option key={y} value={String(y)}>
 {y}
 </option>
 ))}
 </select>
 {error && <p className="text-sm font-bold text-red-500">{error}</p>}
 </div>
 )
}
