/** Egypt: +20 10 14001708 */
export const WHATSAPP_PHONE = '201014001708';

export const WHATSAPP_MESSAGES = {
  default: 'مرحباً، أريد الاستفسار عن معرض سيارات المنيا',
  sellCar: 'مرحباً، أريد عرض سيارتي للبيع على معرض سيارات المنيا',
  sellEquipment: 'مرحباً، أريد عرض معداتي للبيع على معرض سيارات المنيا',
} as const;

export function getWhatsAppUrl(
  message: string = WHATSAPP_MESSAGES.default
): string {
  return `https://wa.me/${WHATSAPP_PHONE}?text=${encodeURIComponent(message)}`;
}
