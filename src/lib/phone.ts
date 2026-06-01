/** Egypt site line — same as WhatsApp */
export const SITE_PHONE_E164 = '201099039475';

export const SITE_PHONE_DISPLAY = '+20 109 903 9475';

export function normalizePhoneDigits(phone?: string | null): string | null {
 if (!phone?.trim()) return null;
 const digits = phone.replace(/\D/g, '');
 if (!digits) return null;
 if (digits.startsWith('20')) return digits;
 if (digits.startsWith('0')) return `20${digits.slice(1)}`;
 if (digits.length === 10) return `20${digits}`;
 return digits;
}

/** Seller/item phone, or site default when missing */
export function getContactPhone(phone?: string | null): string {
 return normalizePhoneDigits(phone) ?? SITE_PHONE_E164;
}

export function getTelHref(phone?: string | null): string {
 return `tel:+${getContactPhone(phone)}`;
}

export function formatPhoneDisplay(phone?: string | null): string {
 const normalized = getContactPhone(phone);
 if (normalized === SITE_PHONE_E164 && !normalizePhoneDigits(phone)) {
 return SITE_PHONE_DISPLAY;
 }
 if (normalized.length >= 12 && normalized.startsWith('20')) {
 return `+${normalized.slice(0, 2)} ${normalized.slice(2, 4)} ${normalized.slice(4, 6)} ${normalized.slice(6)}`;
 }
 return phone?.trim() || SITE_PHONE_DISPLAY;
}
