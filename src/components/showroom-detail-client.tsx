"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CarCard } from "@/components/car-card";
import { EquipmentCard } from "@/components/equipment-card";
import { ContactShowroomButton } from "@/components/contact-showroom-button";
import { listingContactBarPosition } from "@/components/listing-contact-bar";
import { cn } from "@/lib/utils";
import type { Car } from "@/hooks/useCars";
import type { Equipment } from "@/hooks/useEquipment";

type InventoryTab = {
  id: string;
  label: string;
  count: number;
  href: string;
  kind: "cars" | "bikes" | "equipment";
  items: Car[] | Equipment[];
};

export function ShowroomInventoryTabs({ tabs }: { tabs: InventoryTab[] }) {
  const [activeId, setActiveId] = useState(tabs[0]?.id ?? "");

  const activeTab = useMemo(
    () => tabs.find((tab) => tab.id === activeId) ?? tabs[0],
    [tabs, activeId],
  );

  if (!activeTab) return null;

  return (
    <section className="space-y-3">
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-base font-semibold text-slate-900 sm:text-lg">إعلانات المعرض</h2>
        <Link
          href={activeTab.href}
          className="text-xs font-medium text-primary hover:underline"
        >
          عرض الكل
        </Link>
      </div>

      {tabs.length > 1 ? (
        <div className="flex gap-1 overflow-x-auto rounded-lg border border-slate-200 bg-slate-50 p-1 scrollbar-none">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveId(tab.id)}
              className={cn(
                "shrink-0 rounded-md px-3 py-1.5 text-xs font-medium transition-colors",
                activeTab.id === tab.id
                  ? "bg-white text-slate-900 shadow-sm"
                  : "text-slate-500 hover:text-slate-700",
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>
      ) : null}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {activeTab.kind === "cars"
          ? (activeTab.items as Car[]).map((car) => (
              <CarCard key={String(car._id)} car={car} />
            ))
          : (activeTab.items as Equipment[]).map((item) => (
              <EquipmentCard key={String(item._id)} equipment={item} />
            ))}
      </div>
    </section>
  );
}

export function ShowroomStickyActions({
  showroomId,
  phone,
  whatsappHref,
  primaryHref,
  primaryLabel,
}: {
  showroomId: string;
  phone: string;
  whatsappHref: string;
  primaryHref: string;
  primaryLabel: string;
}) {
  const trackWhatsapp = async () => {
    try {
      await fetch("/api/track/click", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "showroom_contact",
          targetId: showroomId,
          metadata: { itemName: "واتساب المعرض", itemType: "showroom" },
        }),
      });
    } catch {
      // ignore
    }
  };

  return (
    <div
      className={cn(
        "fixed inset-x-0 z-[60] border-t border-slate-200 bg-white/95 p-3 shadow-[0_-6px_28px_rgb(15_23_42/0.12)] backdrop-blur-md",
        listingContactBarPosition,
        "md:pb-[max(0.75rem,env(safe-area-inset-bottom))]",
      )}
    >
      <div className="mx-auto flex max-w-5xl gap-2">
        <Button asChild className="h-11 flex-1 rounded-lg text-sm font-medium">
          <Link href={primaryHref}>{primaryLabel}</Link>
        </Button>
        <ContactShowroomButton
          showroomId={showroomId}
          phone={phone}
          className="h-11 min-w-[5.5rem] rounded-lg px-4 text-sm font-medium"
        />
        <Button
          asChild
          variant="outline"
          className="h-11 min-w-11 rounded-lg border-emerald-200 px-0 text-emerald-700"
        >
          <a
            href={whatsappHref}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="واتساب"
            onClick={() => void trackWhatsapp()}
          >
            <MessageSquare className="size-4" />
          </a>
        </Button>
      </div>
    </div>
  );
}

export function ShowroomWhatsappButton({
  showroomId,
  href,
  className,
}: {
  showroomId: string;
  href: string;
  className?: string;
}) {
  const trackWhatsapp = async () => {
    try {
      await fetch("/api/track/click", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "showroom_contact",
          targetId: showroomId,
          metadata: { itemName: "واتساب المعرض", itemType: "showroom" },
        }),
      });
    } catch {
      // ignore
    }
  };

  return (
    <Button asChild variant="outline" className={className}>
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        onClick={() => void trackWhatsapp()}
      >
        <MessageSquare className="ml-1.5 size-4" />
        واتساب
      </a>
    </Button>
  );
}
