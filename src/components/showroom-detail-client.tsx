"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { CarCard } from "@/components/car-card";
import { EquipmentCard } from "@/components/equipment-card";
import { ContactActionsRow, ContactWhatsappLink } from "@/components/contact-actions";
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

export function ShowroomPageContact({
  showroomId,
  phone,
  whatsappHref,
  className,
}: {
  showroomId: string;
  phone: string;
  whatsappHref: string;
  className?: string;
}) {
  const trackCall = async () => {
    try {
      await fetch("/api/track/click", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "showroom_contact",
          targetId: showroomId,
          metadata: { itemName: "المعرض نفسه", itemType: "showroom" },
        }),
      });
    } catch {
      // ignore
    }
  };

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
    <ContactActionsRow
      phone={phone}
      whatsappHref={whatsappHref}
      onCall={() => void trackCall()}
      onWhatsapp={() => void trackWhatsapp()}
      className={className}
    />
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
    <ContactWhatsappLink
      href={href}
      label="واتساب"
      onClick={() => void trackWhatsapp()}
      className={className}
    />
  );
}
