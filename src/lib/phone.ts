/** Egypt site line — same as WhatsApp */
export const SITE_PHONE_E164 = '201099039480';

export const SITE_PHONE_DISPLAY = '+20 109 903 9480';

import { toEnglishDigits } from '@/lib/utils';

export function normalizePhoneDigits(phone?: string | null): string | null {
 if (!phone?.trim()) return null;
 const englishPhone = toEnglishDigits(phone);
 const digits = englishPhone.replace(/\D/g, '');
 if (!digits) return null;
 if (digits.startsWith('20')) return digits;
 if (digits.startsWith('0')) return `20${digits.slice(1)}`;
 if (digits.length === 10) return `20${digits}`;
 return digits;
}

/** Seller/item phone, or site default when missing */
export function getContactPhone(phone?: string | null, fallbackE164: string = SITE_PHONE_E164): string {
 return normalizePhoneDigits(phone) ?? fallbackE164;
}

export function getTelHref(phone?: string | null, fallbackE164: string = SITE_PHONE_E164): string {
 return `tel:+${getContactPhone(phone, fallbackE164)}`;
}

export function formatPhoneDisplay(phone?: string | null, fallbackE164: string = SITE_PHONE_E164, fallbackDisplay: string = SITE_PHONE_DISPLAY): string {
 const normalized = getContactPhone(phone, fallbackE164);
 if (normalized === fallbackE164 && !normalizePhoneDigits(phone)) {
 return fallbackDisplay;
 }
 if (normalized.length >= 12 && normalized.startsWith('20')) {
 return `+${normalized.slice(0, 2)} ${normalized.slice(2, 4)} ${normalized.slice(4, 6)} ${normalized.slice(6)}`;
 }
 return phone?.trim() || fallbackDisplay;
}
