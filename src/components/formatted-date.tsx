import { formatDateDisplay } from "@/lib/date-utils"

interface FormattedDateProps {
 value: string | undefined | null
 className?: string
}

export function FormattedDate({ value, className }: FormattedDateProps) {
 return <span className={className}>{formatDateDisplay(value)}</span>
}
