import { z } from 'zod';

export const carSchema = z.object({
 brand: z.string().optional().default(''),
 model: z.string().optional().default(''),
 year: z
  .number()
  .min(1900, 'السنة يجب أن تكون 1900 أو أكبر')
  .max(new Date().getFullYear() + 1, 'السنة غير صالحة')
  .optional(),
 price: z.number().min(0, 'السعر يجب أن يكون رقمًا موجبًا').optional(),
 fuelType: z
  .enum(['بنزين', 'كهرباء', 'غاز طبيعي', 'غاز', 'سولار'])
  .optional()
  .default('بنزين'),
 transmission: z.enum(['يدوي', 'أوتوماتيك']).optional().default('أوتوماتيك'),
 mileage: z.number().min(0, 'المسافة المقطوعة يجب أن تكون رقمًا موجبًا').optional(),
 color: z.string().optional().default(''),
 location: z.string().trim().optional().default('المنيا'),
 phone: z.string().trim().optional(),
 description: z.string().optional().default(''),
 images: z.array(z.string()).optional().default([]),
 features: z.array(z.string()).optional(),
 status: z.enum(['متاح', 'مباع', 'محجوز']).default('متاح'),
 locationLink: z.string().trim().optional(),
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
