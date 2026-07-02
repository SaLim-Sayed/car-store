"use client";

import { MessageSquare } from "lucide-react";
import { CallButton } from "@/components/call-button";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

/** Sits above the mobile bottom tab bar (`BottomNav`). */
export const listingContactBarPosition =
  "max-md:bottom-[calc(5rem+env(safe-area-inset-bottom,0px))] md:bottom-0";

export const listingPageBottomPadding =
  "pb-[calc(9.5rem+env(safe-area-inset-bottom,0px))] md:pb-[5.5rem]";

type ListingContactBarProps = {
  phone?: string | null;
  whatsappHref: string;
  onCall?: () => void;
  onWhatsapp?: () => void;
  className?: string;
};

export function ListingContactBar({
  phone,
  whatsappHref,
  onCall,
  onWhatsapp,
  className,
}: ListingContactBarProps) {
  return (
    <div
      className={cn(
        "fixed inset-x-0 z-[60] border-t border-slate-200 bg-white/95 shadow-[0_-6px_28px_rgb(15_23_42/0.12)] backdrop-blur-md",
        listingContactBarPosition,
        className,
      )}
      role="region"
      aria-label="تواصل سريع"
    >
      <div className="container mx-auto flex max-w-5xl gap-2 p-3 md:pb-[max(0.75rem,env(safe-area-inset-bottom))]">
        <CallButton
          phone={phone}
          label="اتصال"
          onClick={onCall}
          className="h-12 min-h-12 flex-1 rounded-xl bg-[#2563EB] text-sm font-semibold text-white shadow-sm hover:bg-[#1d4ed8]"
        />
        <Button
          asChild
          variant="outline"
          className="h-12 min-h-12 flex-1 rounded-xl border-2 border-[#15803d] bg-white text-sm font-semibold text-[#15803d] shadow-sm hover:bg-[#15803d]/5"
        >
          <a
            href={whatsappHref}
            target="_blank"
            rel="noopener noreferrer"
            onClick={onWhatsapp}
          >
            <MessageSquare className="ml-1.5 size-4 shrink-0" />
            واتساب
          </a>
        </Button>
      </div>
    </div>
  );
}
