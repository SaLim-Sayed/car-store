"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Car, Store, Tractor } from "lucide-react";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  {
    label: "الرئيسية",
    href: "/",
    icon: Home,
  },
  {
    label: "السيارات",
    href: "/cars",
    icon: Car,
  },
  {
    label: "المعارض",
    href: "/showrooms",
    icon: Store,
  },
  {
    label: "المعدات",
    href: "/equipment",
    icon: Tractor,
  },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 flex items-center justify-around bg-white border-t border-slate-200/60 pb-safe pt-2 md:hidden shadow-[0_-4px_20px_-15px_rgba(0,0,0,0.1)]">
      {NAV_ITEMS.map((item) => {
        const isActive =
          item.href === "/"
            ? pathname === "/"
            : pathname?.startsWith(item.href);

        return (
          <Link
            key={item.href}
            href={item.href}
            className="flex flex-col items-center justify-center w-full py-1.5 gap-1 select-none active:scale-95 transition-transform"
          >
            <div
              className={cn(
                "flex items-center justify-center p-1.5 rounded-xl transition-colors",
                isActive
                  ? "bg-primary/10 text-primary"
                  : "text-slate-500 hover:bg-slate-50"
              )}
            >
              <item.icon
                className={cn(
                  "w-6 h-6",
                  isActive ? "fill-primary/20 stroke-2" : "stroke-[1.5px]"
                )}
              />
            </div>
            <span
              className={cn(
                "text-[10px] font-bold transition-colors",
                isActive ? "text-primary" : "text-slate-500"
              )}
            >
              {item.label}
            </span>
          </Link>
        );
      })}
    </div>
  );
}
