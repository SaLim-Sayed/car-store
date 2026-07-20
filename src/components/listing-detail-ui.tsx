import type { ReactNode } from "react";
import Link from "next/link";
import { Check, MapPin, ShieldAlert, Store } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export const listingDetailShell = "min-h-screen bg-slate-50/60";
export const listingDetailMain =
  "container mx-auto max-w-6xl px-3 pt-3 pb-4 sm:px-4 sm:pt-4";

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
    <header className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-[0_8px_30px_-12px_rgb(15_23_42/0.10)]">
      <div className="flex flex-col gap-2 p-3 sm:gap-2.5 sm:p-3.5">
        <div className="flex items-start justify-between gap-2.5">
          <div className="min-w-0 flex-1 space-y-1">
            <p className="text-[11px] font-black uppercase tracking-[0.14em] text-primary">
              {category}
            </p>
            <div className="space-y-1">
              <h1 className="text-pretty text-xl font-black leading-snug text-slate-900 sm:text-2xl lg:text-[1.75rem]">
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
          <div className="flex flex-wrap gap-1">
            {chips.map((chip) => (
              <span
                key={chip.label}
                className="inline-flex items-center gap-1 rounded-md border border-slate-100 bg-slate-50 px-2 py-0.5 text-xs font-bold text-slate-700"
              >
                {chip.icon ? (
                  <span className="text-primary [&>svg]:size-3.5">{chip.icon}</span>
                ) : null}
                {chip.label}
              </span>
            ))}
          </div>
        ) : null}
      </div>

      <div className="flex items-baseline gap-2 border-t border-slate-100 bg-linear-to-l from-primary/6 to-transparent px-3 py-2 sm:px-3.5">
        <span className="text-xs font-bold text-slate-500">السعر</span>
        <span className="text-2xl font-[1000] tabular-nums text-primary sm:text-[1.9rem]">
          {price ? price.toLocaleString("ar-EG") : "حسب الطلب"}
        </span>
        {price ? (
          <span className="text-xs font-bold text-slate-500">جنيه</span>
        ) : null}
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
    <section id={id} className={cn("space-y-1.5", className)}>
      <h2 className="flex items-center gap-1.5 text-sm font-black text-slate-900 sm:text-base">
        <span className="h-4 w-1 rounded-full bg-primary" aria-hidden />
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
    <div className="grid grid-cols-1 gap-1.5 sm:grid-cols-2">
      {rows.map((row) => (
        <div
          key={row.label}
          className="flex items-center justify-between gap-2 rounded-lg border border-slate-200 bg-white px-2.5 py-2 text-sm shadow-sm transition-colors hover:border-slate-300"
        >
          <span className="font-bold text-slate-500">{row.label}</span>
          <span className="font-black text-slate-900">{row.value}</span>
        </div>
      ))}
    </div>
  );
}

export function ListingFeatureList({ features }: { features: string[] }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-2.5 shadow-sm sm:p-3">
      <ul className="grid grid-cols-1 gap-1 sm:grid-cols-2">
        {features.map((feature) => (
          <li
            key={feature}
            className="flex items-center gap-2 rounded-md bg-slate-50/70 px-2 py-1 text-sm font-bold text-slate-700"
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
    <div className="rounded-xl border border-slate-200 bg-white p-2.5 shadow-sm sm:p-3">
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
      <div className="h-1 bg-linear-to-l from-primary via-primary/60 to-primary/20" />
      <CardContent className="space-y-2 p-3 sm:p-3.5">
        <p className="text-center text-[11px] font-black uppercase tracking-[0.12em] text-slate-500">
          جهة الإعلان
        </p>
        <div className="flex flex-col items-center gap-1.5 text-center">
          <div className="relative">
            <div className="flex size-12 items-center justify-center overflow-hidden rounded-lg border border-slate-100 bg-slate-50 shadow-sm ring-2 ring-slate-50 sm:size-14">
              {logo ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={logo} alt={name} className="size-full object-cover" />
              ) : (
                fallbackIcon ?? <Store className="size-6 text-primary/30" />
              )}
            </div>
          </div>
          <div className="space-y-0.5">
            <h3 className="text-sm font-black text-slate-900 sm:text-base">{name}</h3>
            {location ? (
              <p className="flex items-center justify-center gap-1.5 text-sm font-medium text-slate-500">
                <MapPin className="size-3.5 shrink-0 text-primary" />
                <span className="line-clamp-2">{location}</span>
              </p>
            ) : null}
            {showroomHref ? (
              <Link
                href={showroomHref}
                className="inline-flex items-center text-sm font-bold text-primary hover:underline"
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
    <div className="flex gap-2 rounded-xl border border-amber-200/70 bg-amber-50/80 p-2.5">
      <ShieldAlert className="size-4 shrink-0 text-amber-600" aria-hidden />
      <div>
        <p className="text-xs font-black text-amber-900">{title}</p>
        <p className="mt-0.5 text-xs leading-relaxed font-medium text-amber-800/90">{children}</p>
      </div>
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
    <div className="grid grid-cols-1 gap-3 lg:grid-cols-12 lg:gap-4">
      <div className="space-y-3 lg:col-span-8">{main}</div>
      <aside className="space-y-2.5 lg:col-span-4 lg:sticky lg:top-20 lg:self-start">
        {sidebar}
      </aside>
    </div>
  );
}
