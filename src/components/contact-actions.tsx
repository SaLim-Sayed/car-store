"use client";

import type { ReactNode } from "react";
import { Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { WhatsAppIcon } from "@/components/whatsapp-icon";
import { cn } from "@/lib/utils";
import { formatPhoneDisplay, getTelHref } from "@/lib/phone";

export const contactCallClass =
  "h-10 min-h-10 flex-1 gap-1.5 rounded-lg border-0 bg-slate-900 text-sm font-bold text-white shadow-sm transition-transform hover:bg-slate-800 active:scale-[0.98]";

export const contactWhatsappClass =
  "h-10 min-h-10 flex-1 gap-1.5 rounded-lg border border-emerald-200 bg-emerald-50 text-sm font-bold text-emerald-800 shadow-sm transition-transform hover:bg-emerald-100 active:scale-[0.98]";

type ContactCallLinkProps = {
  phone?: string | null;
  label?: string;
  showNumber?: boolean;
  onClick?: () => void;
  className?: string;
};

export function ContactCallLink({
  phone,
  label = "اتصال",
  showNumber = false,
  onClick,
  className,
}: ContactCallLinkProps) {
  const display = formatPhoneDisplay(phone);

  return (
    <Button asChild className={cn(contactCallClass, className)}>
      <a href={getTelHref(phone)} onClick={onClick}>
        <Phone className="size-4 shrink-0" aria-hidden />
        <span>{label}</span>
        {showNumber && display ? (
          <span className="text-xs font-medium text-white/85" dir="ltr">
            {display}
          </span>
        ) : null}
      </a>
    </Button>
  );
}

type ContactWhatsappLinkProps = {
  href: string;
  label?: string;
  iconOnly?: boolean;
  onClick?: () => void;
  className?: string;
};

export function ContactWhatsappLink({
  href,
  label = "واتساب",
  iconOnly = false,
  onClick,
  className,
}: ContactWhatsappLinkProps) {
  return (
    <Button asChild className={cn(contactWhatsappClass, iconOnly && "min-w-11 flex-none px-0", className)}>
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        onClick={onClick}
        aria-label={iconOnly ? "واتساب" : undefined}
      >
        <WhatsAppIcon className="size-4 shrink-0" />
        {!iconOnly ? <span>{label}</span> : null}
      </a>
    </Button>
  );
}

type ContactActionsRowProps = {
  phone?: string | null;
  whatsappHref: string;
  onCall?: () => void;
  onWhatsapp?: () => void;
  callLabel?: string;
  whatsappLabel?: string;
  showPhoneNumber?: boolean;
  className?: string;
  callClassName?: string;
  whatsappClassName?: string;
};

export function ContactActionsRow({
  phone,
  whatsappHref,
  onCall,
  onWhatsapp,
  callLabel = "اتصال",
  whatsappLabel = "واتساب",
  showPhoneNumber = false,
  className,
  callClassName,
  whatsappClassName,
}: ContactActionsRowProps) {
  return (
    <div className={cn("flex gap-2", className)}>
      <ContactCallLink
        phone={phone}
        label={callLabel}
        showNumber={showPhoneNumber}
        onClick={onCall}
        className={callClassName}
      />
      <ContactWhatsappLink
        href={whatsappHref}
        label={whatsappLabel}
        onClick={onWhatsapp}
        className={whatsappClassName}
      />
    </div>
  );
}

type ContactActionsCardProps = {
  title?: string;
  subtitle?: string;
  phone?: string | null;
  whatsappHref: string;
  onCall?: () => void;
  onWhatsapp?: () => void;
  children?: ReactNode;
  className?: string;
};

/** Inline contact block for listing/showroom pages. */
export function ContactActionsCard({
  title = "تواصل مباشر",
  subtitle = "اتصال أو واتساب مع المعلن",
  phone,
  whatsappHref,
  onCall,
  onWhatsapp,
  children,
  className,
}: ContactActionsCardProps) {
  return (
    <div
      className={cn(
        "overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm",
        className,
      )}
    >
      <div className="border-b border-slate-100 bg-linear-to-l from-primary/6 to-transparent px-3 py-2">
        <p className="text-sm font-black text-slate-900">{title}</p>
        <p className="mt-0.5 text-xs font-medium text-slate-500">{subtitle}</p>
      </div>
      <div className="space-y-2 p-3">
        {children}
        <ContactActionsRow
          phone={phone}
          whatsappHref={whatsappHref}
          onCall={onCall}
          onWhatsapp={onWhatsapp}
          showPhoneNumber
        />
      </div>
    </div>
  );
}

export function ContactInfoTile({
  icon,
  label,
  value,
  href,
  className,
}: {
  icon: ReactNode;
  label: string;
  value: string;
  href?: string;
  className?: string;
}) {
  const content = (
    <>
      <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
        {icon}
      </span>
      <span className="min-w-0">
        <span className="block text-[11px] font-medium text-slate-500">{label}</span>
        <span
          className={cn(
            "block truncate text-sm font-semibold text-slate-900",
            href && "group-hover:text-primary",
          )}
          dir={label === "الهاتف" ? "ltr" : undefined}
        >
          {value}
        </span>
      </span>
    </>
  );

  if (href) {
    return (
      <a
        href={href}
        className={cn(
          "group flex items-center gap-3 rounded-xl border border-slate-100 bg-slate-50/80 px-3 py-2.5 transition-colors hover:border-slate-200 hover:bg-slate-100",
          className,
        )}
      >
        {content}
      </a>
    );
  }

  return (
    <div
      className={cn(
        "flex items-center gap-3 rounded-xl border border-slate-100 bg-slate-50/80 px-3 py-2.5",
        className,
      )}
    >
      {content}
    </div>
  );
}
