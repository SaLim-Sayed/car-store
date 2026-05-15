"use client"

import { Calendar } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"

interface DatePickerProps {
  id?: string
  label?: string
  value: string
  onChange: (isoDate: string) => void
  error?: string
  required?: boolean
  min?: string
  max?: string
  className?: string
  inputClassName?: string
  disabled?: boolean
}

export function DatePicker({
  id,
  label,
  value,
  onChange,
  error,
  required,
  min,
  max,
  className,
  inputClassName,
  disabled,
}: DatePickerProps) {
  const inputId = id || "date-picker"

  return (
    <div className={cn("space-y-3", className)}>
      {label && (
        <Label htmlFor={inputId} className="text-lg font-black">
          {label}
          {required && " *"}
        </Label>
      )}
      <div className="relative">
        <Calendar
          className="pointer-events-none absolute right-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground"
          aria-hidden
        />
        <Input
          id={inputId}
          type="date"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          min={min}
          max={max}
          disabled={disabled}
          required={required}
          className={cn(
            "h-14 rounded-md border-2 px-6 pr-12 font-bold [color-scheme:light] dark:[color-scheme:dark]",
            error ? "border-red-500" : "border-gray-50 focus:border-primary",
            inputClassName
          )}
        />
      </div>
      {error && <p className="text-sm font-bold text-red-500">{error}</p>}
    </div>
  )
}

