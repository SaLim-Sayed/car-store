import { z } from 'zod';

export const carSchema = z.object({
 brand: z.string().min(1, 'العلامة التجارية مطلوبة'),
 model: z.string().min(1, 'الموديل مطلوب'),
 year: z.number().min(1900, 'السنة يجب أن تكون 1900 أو أكبر').max(new Date().getFullYear() + 1, 'السنة غير صالحة'),
 price: z.number().min(0, 'السعر يجب أن يكون رقمًا موجبًا'),
 fuelType: z.enum(['بنزين', 'كهرباء', 'غاز طبيعي', 'غاز', 'سولار'], {
 message: 'نوع الوقود مطلوب',
 }),
 transmission: z.enum(['يدوي', 'أوتوماتيك'], {
 message: 'نوع ناقل الحركة مطلوب',
 }),
 mileage: z.number().min(0, 'المسافة المقطوعة يجب أن تكون رقمًا موجبًا'),
 color: z.string().min(1, 'اللون مطلوب'),
 phone: z.string().trim().optional(),
 description: z.string().min(10, 'الوصف يجب أن يكون 10 أحرف على الأقل'),
 images: z.array(z.string().url('رابط الصورة غير صالح')).min(1, 'صورة واحدة على الأقل مطلوبة'),
 features: z.array(z.string()).optional(),
 status: z.enum(['متاح', 'مباع', 'محجوز']).default('متاح'),
});

export const carFilterSchema = z.object({
 search: z.string().optional(),
 fuelType: z.enum(['بنزين', 'كهرباء', 'غاز طبيعي', 'غاز', 'سولار']).optional(),
 transmission: z.enum(['يدوي', 'أوتوماتيك']).optional(),
 minPrice: z.string().optional(),
 maxPrice: z.string().optional(),
});

export type CarFormData = z.infer<typeof carSchema>;
export type CarFilterData = z.infer<typeof carFilterSchema>;
