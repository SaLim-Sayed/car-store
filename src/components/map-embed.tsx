"use client";

import { MapPin, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

function toEmbedUrl(url: string) {
  const u = url.trim();
  if (!u) return null;

  if (u.includes("/maps/embed") || u.includes("output=embed")) return u;

  if (u.includes("google.com/maps")) {
    return u.includes("?") ? `${u}&output=embed` : `${u}?output=embed`;
  }

  return null;
}

function coordsToEmbedUrl(lat: number, lng: number) {
  return `https://www.google.com/maps?q=${lat},${lng}&z=15&output=embed`;
}

export function MapEmbed({
  url,
  title = "الموقع على الخريطة",
  className,
  coordinates,
}: {
  url?: string | null;
  title?: string;
  className?: string;
  coordinates?: { lat: number; lng: number } | null;
}) {
  const raw = (url ?? "").trim();
  const embedFromUrl = raw ? toEmbedUrl(raw) : null;
  const embedFromCoords =
    coordinates && Number.isFinite(coordinates.lat) && Number.isFinite(coordinates.lng)
      ? coordsToEmbedUrl(coordinates.lat, coordinates.lng)
      : null;
  const embed = embedFromUrl ?? embedFromCoords;
  const externalHref = raw || (coordinates ? `https://www.google.com/maps?q=${coordinates.lat},${coordinates.lng}` : null);

  if (!embed && !externalHref) return null;

  return (
    <section className={cn("space-y-2", className)}>
      <div className="flex items-center justify-between gap-2">
        <h3 className="flex items-center gap-1.5 text-sm font-medium text-slate-800">
          <MapPin className="size-3.5 text-primary" />
          {title}
        </h3>
        {externalHref ? (
          <Button asChild variant="outline" size="sm" className="h-8 rounded-lg text-xs">
            <a href={externalHref} target="_blank" rel="noopener noreferrer">
              فتح
              <ExternalLink className="mr-1.5 size-3" aria-hidden />
            </a>
          </Button>
        ) : null}
      </div>

      {embed ? (
        <div className="overflow-hidden rounded-lg border border-slate-200 bg-white">
          <div className="relative aspect-[4/3] w-full sm:aspect-[16/11]">
            <iframe
              src={embed}
              title={title}
              className="absolute inset-0 h-full w-full"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              allowFullScreen
            />
          </div>
        </div>
      ) : externalHref ? (
        <a
          href={externalHref}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-between gap-3 rounded-lg border border-slate-200 bg-slate-50 px-3 py-3 text-sm transition-colors hover:bg-slate-100"
        >
          <span className="text-slate-600">عرض الموقع في خرائط Google</span>
          <ExternalLink className="size-4 shrink-0 text-slate-400" />
        </a>
      ) : null}
    </section>
  );
}
