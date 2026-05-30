import { SITE_PHONE_E164 } from '@/lib/phone';

export const WHATSAPP_PHONE = SITE_PHONE_E164;

export const WHATSAPP_MESSAGES = {
 default: 'مرحباً، أريد الاستفسار عن سوق سيارات المنيا',
 sellCar: 'مرحباً، أريد عرض سيارتي للبيع على سوق سيارات المنيا',
 sellEquipment: 'مرحباً، أريد عرض معداتي للبيع على سوق سيارات المنيا',
} as const;

export function getWhatsAppUrl(
 message: string = WHATSAPP_MESSAGES.default
): string {
 return `https://wa.me/${WHATSAPP_PHONE}?text=${encodeURIComponent(message)}`;
}
