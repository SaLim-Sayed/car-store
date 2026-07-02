import type { ReactNode } from "react";
import Link from "next/link";
import { Check, MapPin, Store } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export const listingDetailShell = "min-h-screen bg-slate-50/60";
export const listingDetailMain =
  "container mx-auto max-w-5xl px-4 pt-6 pb-8 sm:pt-8";

type Chip = {
  icon?: ReactNode;
  label: string;
};

type ListingDetailHeaderProps = {
  category: string;
  title: string;
  suffix?: string;
  price?: number | null;
  chips?: Chip[];
  actions?: ReactNode;
  status?: ReactNode;
};

export function ListingDetailHeader({
  category,
  title,
  suffix = "للبيع",
  price,
  chips,
  actions,
  status,
}: ListingDetailHeaderProps) {
  return (
    <header className="rounded-xl border border-slate-200/80 bg-white p-4 shadow-sm sm:p-5">
      <div className="flex flex-col gap-4 sm:gap-5">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 flex-1 space-y-3">
            <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-primary">
              {category}
            </p>
            <div className="space-y-2">
              <h1 className="text-pretty text-xl font-semibold leading-snug text-slate-900 sm:text-2xl lg:text-[1.65rem]">
                {title}
                <span className="mr-2 text-base font-medium text-slate-500 sm:text-lg">
                  {suffix}
                </span>
              </h1>
              {status}
            </div>
          </div>
          {actions ? <div className="shrink-0">{actions}</div> : null}
        </div>

        {chips && chips.length > 0 ? (
          <div className="flex flex-wrap gap-1.5">
            {chips.map((chip) => (
              <span
                key={chip.label}
                className="inline-flex items-center gap-1.5 rounded-lg border border-slate-100 bg-slate-50 px-2.5 py-1 text-xs font-medium text-slate-700"
              >
                {chip.icon ? (
                  <span className="text-primary [&>svg]:size-3.5">{chip.icon}</span>
                ) : null}
                {chip.label}
              </span>
            ))}
          </div>
        ) : null}

        <div className="flex items-baseline gap-2 border-t border-slate-100 pt-3">
          <span className="text-xs font-medium text-slate-500">السعر</span>
          <span className="text-2xl font-semibold tabular-nums text-primary sm:text-[1.75rem]">
            {price ? price.toLocaleString("ar-EG") : "حسب الطلب"}
          </span>
          {price ? (
            <span className="text-xs font-medium text-slate-500">جنيه</span>
          ) : null}
        </div>
      </div>
    </header>
  );
}

export function ListingDetailSection({
  title,
  children,
  id,
  className,
}: {
  title: string;
  children: ReactNode;
  id?: string;
  className?: string;
}) {
  return (
    <section id={id} className={cn("space-y-3", className)}>
      <h2 className="flex items-center gap-2 text-base font-semibold text-slate-900 sm:text-lg">
        <span className="h-5 w-0.5 rounded-full bg-primary" aria-hidden />
        {title}
      </h2>
      {children}
    </section>
  );
}

export function ListingSpecTable({
  rows,
}: {
  rows: { label: string; value: string }[];
}) {
  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
      {rows.map((row, index) => (
        <div
          key={row.label}
          className={cn(
            "grid grid-cols-2 text-sm",
            index > 0 && "border-t border-slate-100",
          )}
        >
          <div className="bg-slate-50/90 px-3 py-2.5 font-medium text-slate-500 sm:px-4">
            {row.label}
          </div>
          <div className="px-3 py-2.5 font-medium text-slate-900 sm:px-4">{row.value}</div>
        </div>
      ))}
    </div>
  );
}

export function ListingFeatureList({ features }: { features: string[] }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 sm:p-5">
      <ul className="grid grid-cols-1 gap-2 sm:grid-cols-2">
        {features.map((feature) => (
          <li
            key={feature}
            className="flex items-center gap-2 text-sm font-medium text-slate-700"
          >
            <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-primary/10">
              <Check className="size-3 text-primary" />
            </span>
            {feature}
          </li>
        ))}
      </ul>
    </div>
  );
}

export function ListingDescription({ html }: { html: string }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 sm:p-5">
      <div
        className="rich-text-content text-sm leading-relaxed text-slate-600"
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </div>
  );
}

type ListingSellerCardProps = {
  name: string;
  location?: string;
  logo?: string | null;
  fallbackIcon?: ReactNode;
  showroomHref?: string | null;
  showroomLinkLabel?: string;
};

export function ListingSellerCard({
  name,
  location,
  logo,
  fallbackIcon,
  showroomHref,
  showroomLinkLabel = "عرض تفاصيل المعرض",
}: ListingSellerCardProps) {
  return (
    <Card className="overflow-hidden rounded-xl border-slate-200 bg-white shadow-sm">
      <div className="h-0.5 bg-gradient-to-l from-primary/80 to-primary/30" />
      <CardContent className="space-y-4 p-5">
        <p className="text-center text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-500">
          جهة الإعلان
        </p>
        <div className="flex flex-col items-center gap-3 text-center">
          <div className="relative">
            <div className="flex size-16 items-center justify-center overflow-hidden rounded-xl border border-slate-100 bg-slate-50 ring-4 ring-slate-50 sm:size-[4.5rem]">
              {logo ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={logo} alt={name} className="size-full object-cover" />
              ) : (
                fallbackIcon ?? <Store className="size-8 text-primary/30" />
              )}
            </div>
          </div>
          <div className="space-y-1.5">
            <h3 className="text-base font-semibold text-slate-900">{name}</h3>
            {location ? (
              <p className="flex items-center justify-center gap-1.5 text-sm text-slate-500">
                <MapPin className="size-3.5 shrink-0 text-primary" />
                <span className="line-clamp-2">{location}</span>
              </p>
            ) : null}
            {showroomHref ? (
              <Link
                href={showroomHref}
                className="inline-flex items-center text-sm font-medium text-primary hover:underline"
              >
                {showroomLinkLabel}
              </Link>
            ) : null}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export function ListingSafetyTip({
  title = "نصيحة أمان",
  children,
}: {
  title?: string;
  children: ReactNode;
}) {
  return (
    <div className="rounded-xl border border-amber-200/70 bg-amber-50/80 p-4">
      <p className="text-xs font-semibold text-amber-900">{title}</p>
      <p className="mt-1.5 text-xs leading-relaxed text-amber-800/90">{children}</p>
    </div>
  );
}

export function ListingContentLayout({
  main,
  sidebar,
}: {
  main: ReactNode;
  sidebar: ReactNode;
}) {
  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 lg:gap-8">
      <div className="space-y-6 lg:col-span-8">{main}</div>
      <aside className="space-y-4 lg:col-span-4 lg:sticky lg:top-28 lg:self-start">
        {sidebar}
      </aside>
    </div>
  );
}
