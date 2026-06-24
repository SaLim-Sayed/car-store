"use client";

import { MapPin, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

function toEmbedUrl(url: string) {
  const u = url.trim();
  if (!u) return null;

  // If already an embed URL
  if (u.includes("/maps/embed") || u.includes("output=embed")) return u;

  // Standard google maps links can often be embedded by adding output=embed
  if (u.includes("google.com/maps")) {
    return u.includes("?") ? `${u}&output=embed` : `${u}?output=embed`;
  }

  // Short links (maps.app.goo.gl) usually cannot be embedded reliably
  return null;
}

export function MapEmbed({
  url,
  title = "الموقع على الخريطة",
  className,
}: {
  url?: string | null;
  title?: string;
  className?: string;
}) {
  const raw = (url ?? "").trim();
  if (!raw) return null;

  const embed = toEmbedUrl(raw);

  return (
    <section className={cn("space-y-3", className)}>
      <div className="flex items-center justify-between gap-3">
        <h3 className="text-sm font-black text-slate-800 flex items-center gap-2">
          <MapPin className="h-4 w-4 text-primary" />
          {title}
        </h3>
        <Button
          asChild
          variant="outline"
          size="sm"
          className="h-9 rounded-lg font-bold"
        >
          <a href={raw} target="_blank" rel="noopener noreferrer">
            فتح
            <ExternalLink className="h-4 w-4 mr-2" aria-hidden />
          </a>
        </Button>
      </div>

      {embed ? (
        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
          <div className="relative w-full aspect-[16/10]">
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
      ) : (
        <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-6 text-center shadow-sm">
          <div className="flex size-12 items-center justify-center rounded-full bg-slate-100 text-slate-400">
            <MapPin className="size-6" />
          </div>
          <div className="space-y-1">
            <h4 className="text-sm font-black text-slate-700">موقع المعرض متاح خارجياً</h4>
            <p className="text-xs font-bold leading-relaxed text-slate-500 max-w-[250px] mx-auto">
              لا يمكن عرض الخريطة داخل الصفحة لهذا الرابط، لكن يمكنك فتحه مباشرة في خرائط Google.
            </p>
          </div>
          <Button asChild variant="outline" size="sm" className="mt-2 h-10 rounded-xl font-bold bg-white">
            <a href={raw} target="_blank" rel="noopener noreferrer">
              فتح في خرائط Google
              <ExternalLink className="mr-2 h-4 w-4" aria-hidden />
            </a>
          </Button>
        </div>
      )}
    </section>
  );
}

