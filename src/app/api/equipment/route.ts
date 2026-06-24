import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongoose';
import Equipment from '@/lib/models/Equipment';
import Car from '@/lib/models/Car';
import { handleApiError, getServerSession } from '@/lib/api-helpers';
import { persistImageUrl } from '@/lib/persist-image';

async function normalizeImages(images?: string[]) {
 if (!images?.length) return images;
 return Promise.all(images.map((img) => persistImageUrl(img)));
}

export async function GET(request: NextRequest) {
 try {
 await connectDB();

 const { searchParams } = new URL(request.url);
 const page = parseInt(searchParams.get('page') || '1');
 const limit = parseInt(searchParams.get('limit') || '12');
 const search = searchParams.get('search') || '';
 const category = searchParams.get('category');
 const featured = searchParams.get('featured');
 const minPrice = searchParams.get('minPrice');
 const maxPrice = searchParams.get('maxPrice');
 const sortBy = searchParams.get('sortBy') || 'newest';
 const type = searchParams.get('type');

 const query: Record<string, any> = {};

 if (search) {
 query.$or = [
 { title: { $regex: search, $options: 'i' } },
 { brand: { $regex: search, $options: 'i' } },
 { model: { $regex: search, $options: 'i' } },
 { description: { $regex: search, $options: 'i' } },
 { location: { $regex: search, $options: 'i' } },
 ];
 }

 if (category) {
 query.category = category;
  } else if (type === 'bikes') {
  query.category = { $in: ['موتوسيكل', 'توك توك', 'تروسيكل', 'سكوتر', 'دراجة نارية'] };
  } else if (type === 'equipment') {
  query.category = { $nin: ['موتوسيكل', 'توك توك', 'تروسيكل', 'سكوتر', 'دراجة نارية'] };
  }

 if (featured === 'true') query.featured = true;

 const showroom = searchParams.get('showroom');
 if (showroom) {
  query.showroom = showroom;
 }

 if (minPrice || maxPrice) {
 query.price = {};
 if (minPrice) (query.price as { $gte?: number }).$gte = parseFloat(minPrice);
 if (maxPrice) (query.price as { $lte?: number }).$lte = parseFloat(maxPrice);
 }

 const skip = (page - 1) * limit;

 const sortOrder = sortBy === 'oldest' ? 1 : -1;

 const [items, total] = await Promise.all([
 Equipment.find(query).sort({ createdAt: sortOrder }).skip(skip).limit(limit),
 Equipment.countDocuments(query),
 ]);

 return NextResponse.json({
 success: true,
 data: items,
 pagination: {
 page,
 limit,
 total,
 pages: Math.ceil(total / limit),
 },
 });
 } catch (error) {
 return handleApiError(error, 'فشل في جلب المعدات');
 }
}

export async function POST(request: NextRequest) {
 try {
 const session = await getServerSession();
 if (!session || session.user.role !== 'admin') {
 return NextResponse.json(
 { success: false, error: 'غير مصرح لك بالقيام بهذا الإجراء' },
 { status: 403 }
 );
 }

 await connectDB();
 const body = await request.json();

 if (body.images?.length) {
 body.images = await normalizeImages(body.images);
 }

 if (body.category === 'سيارة') {
   const newCar = new Car({
     brand: body.brand,
     model: body.model || 'غير محدد',
     year: body.year || new Date().getFullYear(),
     price: body.price,
     fuelType: 'بنزين',
     transmission: 'أوتوماتيك',
     mileage: body.hours || 0,
     color: 'غير محدد',
     location: body.location,
     phone: body.phone,
     description: body.description,
     images: body.images,
     features: body.features,
     status: body.status,
     locationLink: body.locationLink,
     showroom: body.showroom,
     bodyType: 'سيارة',
   });
   
   await newCar.save();

   return NextResponse.json({
     success: true,
     data: newCar,
     message: 'تمت إضافة المركبة إلى قسم السيارات بنجاح',
   }, { status: 201 });
 }

 const equipment = await Equipment.create(body);

 return NextResponse.json(
 { success: true, data: equipment, message: 'تمت إضافة المعدة بنجاح' },
 { status: 201 }
 );
 } catch (error) {
 return handleApiError(error, 'فشل في إضافة المعدة');
 }
}
