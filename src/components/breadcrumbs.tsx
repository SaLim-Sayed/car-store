"use client";

import Link from "next/link";
import { ChevronLeft, Home } from "lucide-react";

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
}

export function Breadcrumbs({ items }: BreadcrumbsProps) {
  return (
    <nav
      dir="rtl"
      aria-label="مسار الصفحة"
      className="flex items-center gap-2 bg-white/70 backdrop-blur-md border border-slate-200/50 rounded-full px-5 py-2.5 shadow-[0_2px_12px_-4px_rgba(27,62,122,0.06)] w-fit mb-8 text-sm font-black transition-all hover:shadow-[0_4px_16px_-4px_rgba(27,62,122,0.1)] text-slate-600"
    >
      <Link
        href="/"
        className="flex items-center gap-1.5 text-[#1B3E7A] hover:text-[#E28328] transition-colors"
      >
        <Home className="h-4 w-4" />
        <span>الرئيسية</span>
      </Link>

      {items.map((item, index) => {
        const isLast = index === items.length - 1;
        return (
          <div key={index} className="flex items-center gap-2">
            <ChevronLeft className="h-3.5 w-3.5 text-slate-300 stroke-[3]" />
            {isLast || !item.href ? (
              <span className="text-slate-800 truncate max-w-[180px] sm:max-w-[300px]">
                {item.label}
              </span>
            ) : (
              <Link
                href={item.href}
                className="text-slate-600 hover:text-[#E28328] transition-colors"
              >
                {item.label}
              </Link>
            )}
          </div>
        );
      })}
    </nav>
  );
}
