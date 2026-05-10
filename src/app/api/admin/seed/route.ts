import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongoose';
import Car from '@/lib/models/Car';
import User from '@/lib/models/User';
import { handleApiError } from '@/lib/api-helpers';

const seedCars = [
  {
    brand: 'تويوتا',
    model: 'كامري',
    year: 2023,
    price: 120000,
    fuelType: 'بنزين',
    transmission: 'أوتوماتيك',
    mileage: 15000,
    color: 'أبيض',
    description: 'سيارة تويوتا كامري 2023 بحالة ممتازة، موتور قوي واستهلاك وقود منخفض. السيارة مجهزة بأحدث تقنيات الأمان والراحة.',
    images: ['https://images.unsplash.com/photo-1550355291-bbee04a92027?w=800&h=600&fit=crop'],
    features: ['نظام تثبيت السرعة', 'كاميرا خلفية', 'مستشعر ركن سيارة', 'شاشة لمس 8 بوصة', 'بلوتوث', 'مكيف أوتوماتيك'],
    status: 'متاح',
  },
  {
    brand: 'هونداي',
    model: 'سوناتا',
    year: 2022,
    price: 95000,
    fuelType: 'بنزين',
    transmission: 'أوتوماتيك',
    mileage: 25000,
    color: 'أسود',
    description: 'هونداي سوناتا 2022 بميزات متقدمة وتصميم عصري يجمع بين الأناقة والأداء العالي.',
    images: ['https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=800&h=600&fit=crop'],
    features: ['بلوتوث', 'مكيف أوتوماتيك', 'نوافذ كهربائية', 'مرايا كهربائية', 'نظام ملاحة'],
    status: 'متاح',
  },
  {
    brand: 'نيسان',
    model: 'ألتيما',
    year: 2023,
    price: 110000,
    fuelType: 'بنزين',
    transmission: 'أوتوماتيك',
    mileage: 8000,
    color: 'فضي',
    description: 'نيسان ألتيما 2023 بتقنيات أمان متقدمة وأداء ممتاز على الطريق.',
    images: ['https://images.unsplash.com/photo-1494976388539-d1058494cdd8?w=800&h=600&fit=crop'],
    features: ['نظام ABS', 'مثبت سرعة', 'كاميرا 360 درجة', 'مقاعد جلدية', 'سقف فتحة هواء'],
    status: 'متاح',
  },
  {
    brand: 'مرسيدس',
    model: 'C-Class',
    year: 2023,
    price: 180000,
    fuelType: 'بنزين',
    transmission: 'أوتوماتيك',
    mileage: 5000,
    color: 'فضي',
    description: 'مرسيدس C-Class 2023 بفخامة وأداء استثنائي، تجمع بين التصميم الراقي والتقنية المتقدمة.',
    images: ['https://images.unsplash.com/photo-1617654112369-82a9e57c8411?w=800&h=600&fit=crop'],
    features: ['مقاعد جلد فاخرة', 'نظام صوتي Burmester', 'شاشة عرض رأسية', 'مكيف ثلاثي المناطق', 'حزمة AMG'],
    status: 'متاح',
  },
  {
    brand: 'بي إم دبليو',
    model: 'X5',
    year: 2022,
    price: 220000,
    fuelType: 'ديزل',
    transmission: 'أوتوماتيك',
    mileage: 12000,
    color: 'أسود',
    description: 'بي إم دبليو X5 2022 SUV فاخرة بأداء قوي ومساحة داخلية واسعة مثالية للعائلة.',
    images: ['https://images.unsplash.com/photo-1553413077-1d3782b2b4f0?w=800&h=600&fit=crop'],
    features: ['دفع رباعي', 'سقف بانوراما', 'مقاعد كهربائية', 'نظام تهوية مقاعد', 'كاميرا 360', 'نظام توقف تلقائي'],
    status: 'متاح',
  },
  {
    brand: 'لكزس',
    model: 'RX 350',
    year: 2023,
    price: 195000,
    fuelType: 'بنزين',
    transmission: 'أوتوماتيك',
    mileage: 7000,
    color: 'أبيض',
    description: 'لكزس RX 350 2023 بجودة يابانية عالية وتقنيات متقدمة تضمن تجربة قيادة استثنائية.',
    images: ['https://images.unsplash.com/photo-1627550832985-3e8bc5e0a7af?w=800&h=600&fit=crop'],
    features: ['نظام هايبرد', 'مقاعد مدفأة ومبردة', 'شاشة 14 بوصة', 'نظام Mark Levinson الصوتي', 'مساعد الحارة'],
    status: 'متاح',
  },
  {
    brand: 'كيا',
    model: 'سيراتو',
    year: 2023,
    price: 85000,
    fuelType: 'بنزين',
    transmission: 'أوتوماتيك',
    mileage: 20000,
    color: 'أحمر',
    description: 'كيا سيراتو 2023 سيارة اقتصادية بتصميم عصري جذاب ومواصفات رائعة بسعر منافس.',
    images: ['https://images.unsplash.com/photo-1607853202273-797f1c22a38e?w=800&h=600&fit=crop'],
    features: ['شاشة لمس 10.25 بوصة', 'كاميرا خلفية', 'مستشعرات ركن', 'بلوتوث', 'Apple CarPlay'],
    status: 'متاح',
  },
  {
    brand: 'هوندا',
    model: 'أكورد',
    year: 2022,
    price: 130000,
    fuelType: 'بنزين',
    transmission: 'أوتوماتيك',
    mileage: 18000,
    color: 'رمادي',
    description: 'هوندا أكورد 2022 سيارة عائلية موثوقة بمحرك قوي واقتصادي في استهلاك الوقود.',
    images: ['https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=800&h=600&fit=crop'],
    features: ['Honda Sensing', 'شاشة 9 بوصة', 'مقاعد جلدية', 'نظام صوتي بريميوم', 'مكيف مزدوج'],
    status: 'مباع',
  },
];

export async function POST() {
  try {
    await connectDB();

    const results: Record<string, unknown> = {};

    // --- Seed Cars ---
    const existingCarsCount = await Car.countDocuments();
    if (existingCarsCount === 0) {
      await Car.insertMany(seedCars);
      results.cars = `تم إضافة ${seedCars.length} سيارة بنجاح`;
    } else {
      results.cars = `تم تخطي السيارات — يوجد بالفعل ${existingCarsCount} سيارات`;
    }

    // --- Seed Admin User ---
    const adminEmail = 'admin@carstore.com';
    const existingAdmin = await User.findOne({ email: adminEmail });

    if (!existingAdmin) {
      const adminUser = new User({
        name: 'المسؤول',
        email: adminEmail,
        password: 'Admin@123',
        role: 'admin',
        isActive: true,
      });
      await adminUser.save();
      results.admin = 'تم إنشاء حساب المسؤول: admin@carstore.com / Admin@123';
    } else {
      results.admin = 'حساب المسؤول موجود بالفعل';
    }

    return NextResponse.json({
      success: true,
      message: 'تم تهيئة قاعدة البيانات بنجاح',
      results,
    });
  } catch (error) {
    return handleApiError(error, 'فشل في تهيئة قاعدة البيانات');
  }
}
