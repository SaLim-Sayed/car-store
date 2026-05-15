'use client';

import { getWhatsAppUrl, WHATSAPP_MESSAGES } from '@/lib/whatsapp';
import { WhatsAppIcon } from '@/components/whatsapp-icon';

export function WhatsAppFloat() {
  const href = getWhatsAppUrl(WHATSAPP_MESSAGES.default);

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="تواصل عبر واتساب"
      className="whatsapp-float group fixed bottom-6 left-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg shadow-[#25D366]/40 transition-transform hover:scale-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#25D366] focus-visible:ring-offset-2"
    >
      <span className="whatsapp-float-ping absolute inset-0 rounded-full bg-[#25D366]" aria-hidden />
      <span className="whatsapp-float-ring absolute -inset-1 rounded-full border-2 border-[#25D366]/50" aria-hidden />
      <WhatsAppIcon className="relative z-10 h-7 w-7 transition-transform group-hover:scale-110" />
    </a>
  );
}
