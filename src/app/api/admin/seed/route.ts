import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongoose';
import Car from '@/lib/models/Car';
import Equipment from '@/lib/models/Equipment';
import Showroom from '@/lib/models/Showroom';
import News from '@/lib/models/News';
import User from '@/lib/models/User';
import { handleApiError } from '@/lib/api-helpers';

const seedShowrooms = [
  {
    name: 'معرض المنيا للسيارات',
    address: 'مدينة المنيا. ميدان الحميات',
    phone: '01099039475',
    email: 'info@miniacars.com',
    description: 'أكبر معرض سيارات مستعملة وجديدة في المنيا.',
    logo: 'https://images.unsplash.com/photo-1562575214-da9fcf59b907?w=150&h=150&fit=crop',
    featured: true,
  },
  {
    name: 'المنيا للمعدات الثقيلة والزراعية',
    address: 'مدينة المنيا. ميدان الحميات',
    phone: '01099039475',
    email: 'info@miniaheavy.com',
    description: 'أفضل الجرارات والمعدات الثقيلة المستوردة بحالة الزيرو.',
    logo: 'https://images.unsplash.com/photo-1586864387967-d02ef85d93e8?w=150&h=150&fit=crop',
    featured: true,
  }
];

const seedNews = [
  {
    title: 'أسعار السيارات في المنيا 2026',
    content: 'شهد سوق السيارات في المنيا مؤخراً استقراراً ملحوظاً في الأسعار مع زيادة الطلب على السيارات الاقتصادية والمستعملة بحالة جيدة. ويأتي طراز تويوتا كامري وهونداي سوناتا في مقدمة رغبات المشترين لبساطة الصيانة وتوفر قطع الغيار.',
    excerpt: 'تقرير شامل ومحدث عن أسعار السيارات المستعملة والجديدة في سوق المنيا للسيارات بعد التحديثات الأخيرة.',
    category: 'أخبار السوق',
    image: 'https://images.unsplash.com/photo-1550355291-bbee04a92027?w=800&h=600&fit=crop',
    author: 'محمد البدري',
    status: 'نشط'
  },
  {
    title: 'أهم النصائح قبل شراء معدة ثقيلة مستعملة',
    content: 'قبل إتمام عملية شراء جرار زراعي أو معدة ثقيلة مستعملة، ننصح أصحاب المهن بالآتي: أولاً فحص المحرك وساعات العمل بدقة، ثانياً فحص خراطيم الهيدروليك بحثاً عن أي تسريب، وثالثاً تجربة المعدة تحت ضغط كافٍ والتأكد من سلامة المستندات والرخصة.',
    excerpt: 'نصائح هامة يقدمها لكم خبراء الصيانة لفحص المحرك والشاسيه والتأكد من سلامة الأوراق للمعدة.',
    category: 'نصائح تهمك',
    image: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=800&h=600&fit=crop',
    author: 'الإدارة',
    status: 'نشط'
  }
];

async function clearCollections() {
  await Car.deleteMany({});
  await Equipment.deleteMany({});
  await Showroom.deleteMany({});
  await News.deleteMany({});
}

export async function POST() {
  try {
    await connectDB();

    // Clear all non-auth collections first
    await clearCollections();

    // Seed Showrooms
    const showrooms = await Showroom.insertMany(seedShowrooms);
    const carShowroom = showrooms[0];
    const heavyShowroom = showrooms[1];

    // Build lists of cars and equipment with showroom references
    const cars = [
      {
        brand: 'تويوتا',
        model: 'كامري',
        year: 2023,
        price: 1200000,
        fuelType: 'بنزين',
        transmission: 'أوتوماتيك',
        mileage: 15000,
        color: 'أبيض',
        location: 'مدينة المنيا. ميدان الحميات',
        description: 'سيارة تويوتا كامري 2023 بحالة ممتازة، موتور قوي واستهلاك وقود منخفض. السيارة مجهزة بأحدث تقنيات الأمان والراحة.',
        images: ['https://images.unsplash.com/photo-1550355291-bbee04a92027?w=800&h=600&fit=crop'],
        features: ['نظام تثبيت السرعة', 'كاميرا خلفية', 'مستشعر ركن سيارة', 'شاشة لمس 8 بوصة', 'بلوتوث', 'مكيف أوتوماتيك'],
        status: 'متاح',
        showroom: carShowroom._id,
        phone: '01099039475',
      },
      {
        brand: 'هونداي',
        model: 'سوناتا',
        year: 2022,
        price: 950000,
        fuelType: 'بنزين',
        transmission: 'أوتوماتيك',
        mileage: 25000,
        color: 'أسود',
        location: 'مدينة المنيا. ميدان الحميات',
        description: 'هونداي سوناتا 2022 بميزات متقدمة وتصميم عصري يجمع بين الأناقة والأداء العالي.',
        images: ['https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=800&h=600&fit=crop'],
        features: ['بلوتوث', 'مكيف أوتوماتيك', 'نوافذ كهربائية', 'مرايا كهربائية', 'نظام ملاحة'],
        status: 'متاح',
        showroom: carShowroom._id,
        phone: '01099039475',
      },
      {
        brand: 'مرسيدس',
        model: 'C200',
        year: 2023,
        price: 1800000,
        fuelType: 'بنزين',
        transmission: 'أوتوماتيك',
        mileage: 5000,
        color: 'فضي',
        location: 'مدينة المنيا. ميدان الحميات',
        description: 'مرسيدس C-Class 2023 بفخامة وأداء استثنائي، تجمع بين التصميم الراقي والتقنية المتقدمة.',
        images: ['https://images.unsplash.com/photo-1617654112369-82a9e57c8411?w=800&h=600&fit=crop'],
        features: ['مقاعد جلد فاخرة', 'نظام صوتي Burmester', 'شاشة عرض رأسية', 'مكيف ثلاثي المناطق', 'حزمة AMG'],
        status: 'متاح',
        showroom: carShowroom._id,
        phone: '01099039475',
      }
    ];

    const equipment = [
      {
        title: 'جرار ماسي فيرغسون 385',
        brand: 'ماسي فيرغسون',
        model: 'MF 385',
        year: 2020,
        price: 650000,
        category: 'جرار',
        condition: 'مستعمل',
        hours: 1200,
        location: 'مدينة المنيا. ميدان الحميات',
        description: 'جرار ماسي فيرغسون بحالة ممتازة جاهز للعمل مباشرة بكفاءة عالية.',
        images: ['https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=800&h=600&fit=crop'],
        features: ['جر خلفي قوي', 'صيانة كاملة', 'إطارات بحالة ممتازة'],
        status: 'متاح',
        showroom: heavyShowroom._id,
        phone: '01099039475',
      },
      {
        title: 'حفار كتربيلر 320D',
        brand: 'كتربيلر',
        model: '320D L',
        year: 2019,
        price: 2100000,
        category: 'حفار',
        condition: 'مستعمل',
        hours: 4500,
        location: 'مدينة المنيا. ميدان الحميات',
        description: 'حفار كتربيلر قوي جداً وجاهز لكافة أعمال الحفر والمقاولات والصخور.',
        images: ['https://images.unsplash.com/photo-1586864387967-d02ef85d93e8?w=800&h=600&fit=crop'],
        features: ['كابينة مكيفة', 'صيانة دورية بالتوكيل', 'مطرقة هيدروليكية'],
        status: 'متاح',
        showroom: heavyShowroom._id,
        phone: '01099039475',
      },
      {
        title: 'موتوسيكل دايون 4',
        brand: 'دايون',
        model: 'دايون 4',
        year: 2022,
        price: 28000,
        category: 'موتوسيكل',
        condition: 'مستعمل',
        hours: 0,
        location: 'مدينة المنيا. ميدان الحميات',
        description: 'موتوسيكل دايون 4 بحالة الزيرو موتور ممتاز ورخصة سارية.',
        images: ['https://images.unsplash.com/photo-1494976388539-d1058494cdd8?w=800&h=600&fit=crop'],
        features: ['رخصة سنتين', 'حالة فبريكا', 'اقتصادي في الوقود'],
        status: 'متاح',
        phone: '01099039475',
      },
      {
        title: 'توك توك بجاج هندي 2021',
        brand: 'بجاج',
        model: 'بجاج',
        year: 2021,
        price: 45000,
        category: 'توك توك',
        condition: 'مستعمل',
        hours: 0,
        location: 'مدينة المنيا. ميدان الحميات',
        description: 'توك توك بجاج هندي موديل 2021 رخصة سارية وحالة جيدة.',
        images: ['https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=800&h=600&fit=crop'],
        features: ['رخصة سارية', 'عمرة كاملة حديثة', 'كاوتش جديد'],
        status: 'متاح',
        phone: '01099039475',
      },
      {
        title: 'تروسيكل جي إم سي 200 سي سي 2022',
        brand: 'جي إم سي',
        model: 'جامبو',
        year: 2022,
        price: 36000,
        category: 'تروسيكل',
        condition: 'مستعمل',
        hours: 0,
        location: 'مدينة المنيا. ميدان الحميات',
        description: 'تروسيكل جي إم سي بحالة جيدة جداً، صندوق كبير ومحرك قوي 200 سي سي.',
        images: ['https://images.unsplash.com/photo-1558981806-ec527fa84c39?w=800&h=600&fit=crop'],
        features: ['محرك 200 سي سي', 'صندوق حمولة كبير', 'إطارات جديدة'],
        status: 'متاح',
        phone: '01099039475',
      },
      {
        title: 'موتوسيكل حلاوة أليكانتو 2023',
        brand: 'حلاوة',
        model: 'أليكانتو',
        year: 2023,
        price: 32000,
        category: 'موتوسيكل',
        condition: 'مستعمل',
        hours: 0,
        location: 'مدينة المنيا. ميدان الحميات',
        description: 'موتوسيكل حلاوة أليكانتو 2023 كسر زيرو، مشي مسافة قصيرة جداً وموتور ناعم.',
        images: ['https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?w=800&h=600&fit=crop'],
        features: ['كسر زيرو', 'عداد رقمي', 'فرامل باكم'],
        status: 'متاح',
        phone: '01099039475',
      }
    ];

    await Car.insertMany(cars);
    await Equipment.insertMany(equipment);
    await News.insertMany(seedNews);

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
    }

    return NextResponse.json({
      success: true,
      message: 'تم إعادة تهيئة واستعادة قاعدة البيانات بالكامل بنجاح',
      results: {
        showrooms: showrooms.length,
        cars: cars.length,
        equipment: equipment.length,
        news: seedNews.length,
      }
    });
  } catch (error) {
    return handleApiError(error, 'فشل في استعادة قاعدة البيانات');
  }
}

export async function DELETE() {
  try {
    await connectDB();
    await clearCollections();

    return NextResponse.json({
      success: true,
      message: 'تم تفريغ كافة البيانات بنجاح (مع الاحتفاظ بالمستخدمين وحسابات الإدارة)',
    });
  } catch (error) {
    return handleApiError(error, 'فشل في تفريغ قاعدة البيانات');
  }
}
