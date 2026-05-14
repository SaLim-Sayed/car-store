# سيارات المنيا

تطبيق ويب حديث لإدارة وعرض السيارات في محافظة المنيا، مصر، باستخدام Next.js و MongoDB.

## المتطلبات

- Node.js 18 أو أحدث
- MongoDB

## الإعداد

1. تثبيت الاعتماديات:
```bash
npm install
```

2. إنشاء ملف `.env.local` في جذر المشروع:
```env
# MongoDB Configuration
MONGODB_URI=mongodb+srv://amirasayedsalem112_db_user:CrSOY3vFKOkQhHiv@cluster0.tosznzx.mongodb.net/care-me?retryWrites=true&w=majority

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-here

# Email Configuration (for password reset)
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password

# NextAuth URL
NEXTAUTH_URL=http://localhost:3000
```

3. تشغيل خادم التطوير:
```bash
npm run dev
```

## الميزات

- 🔐 نظام مصادقة كامل (تسجيل، دخول، إعادة تعيين كلمة المرور)
- 🚗 إدارة السيارات (إضافة، تعديل، حذف، عرض)
- 🔍 بحث متقدم بالفلاتر
- 📰 قسم الأخبار
- 🌙 دعم الوضع الليلي/النهاري
- 🌐 دعم اللغة العربية (RTL) - المنيا، مصر
- 📱 تصميم متجاوب
- 🎨 واجهة مستخدم حديثة باستخدام shadcn/ui
- 📍 مخصص لسوق المنيا وصعيد مصر

## التقنيات المستخدمة

- **Frontend**: Next.js 14, React, TypeScript, Tailwind CSS
- **UI Components**: shadcn/ui, Lucide Icons
- **State Management**: Zustand
- **Forms**: React Hook Form, Zod
- **Backend**: Next.js API Routes
- **Database**: MongoDB with Mongoose
- **Authentication**: JWT
- **Email**: Nodemailer

## بنية المشروع

```
src/
├── app/                    # App Router (Next.js 13+)
│   ├── api/               # API Routes
│   │   ├── auth/          # Authentication endpoints
│   │   └── cars/          # Cars CRUD endpoints
│   ├── auth/              # Authentication pages
│   ├── cars/              # Cars listing page
│   └── admin/             # Admin dashboard
├── components/            # Reusable components
├── lib/
│   ├── models/            # MongoDB models
│   ├── store/             # Zustand stores
│   └── validations/       # Zod schemas
└── utils/                # Utility functions
```

## استخدام التطبيق

1. **للمستخدمين العاديين**:
   - تصفح السيارات المتاحة
   - البحث والفلترة
   - قراءة الأخبار
   - إنشاء حساب لتسجيل الدخول

2. **للمسؤولين**:
   - إدارة السيارات (إضافة، تعديل، حذف)
   - لوحة تحكم إدارية
   - إدارة المستخدمين

## واجهات API

### المصادقة
- `POST /api/auth/register` - إنشاء حساب جديد
- `POST /api/auth/login` - تسجيل الدخول
- `POST /api/auth/forgot-password` - طلب إعادة تعيين كلمة المرور
- `POST /api/auth/reset-password` - إعادة تعيين كلمة المرور

### السيارات
- `GET /api/cars` - جلب قائمة السيارات مع البحث والفلترة
- `POST /api/cars` - إضافة سيارة جديدة (للمسؤولين)
- `GET /api/cars/[id]` - جلب تفاصيل سيارة معينة
- `PUT /api/cars/[id]` - تحديث سيارة (للمسؤولين)
- `DELETE /api/cars/[id]` - حذف سيارة (للمسؤولين)

## النشر

لتشغيل التطبيق في بيئة الإنتاج:

1. بناء المشروع:
```bash
npm run build
```

2. تشغيل خادم الإنتاج:
```bash
npm start
```

## المساهمة

1. Fork المشروع
2. إنشاء فرع جديد (`git checkout -b feature/amazing-feature`)
3. عمل commit (`git commit -m 'Add amazing feature'`)
4. الدفع إلى الفرع (`git push origin feature/amazing-feature`)
5. إنشاء Pull Request
# car-store
