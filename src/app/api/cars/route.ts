import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongoose';
import Car from '@/lib/models/Car';
import Equipment from '@/lib/models/Equipment';
import '@/lib/models/Showroom';
import { handleApiError } from '@/lib/api-helpers';

export async function GET(request: NextRequest) {
 try {
 await connectDB();
 
 const { searchParams } = new URL(request.url);
 const page = parseInt(searchParams.get('page') || '1');
 const limit = parseInt(searchParams.get('limit') || '10');
 const search = searchParams.get('search') || '';
 const fuelType = searchParams.get('fuelType');
 const transmission = searchParams.get('transmission');
 const minPrice = searchParams.get('minPrice');
 const maxPrice = searchParams.get('maxPrice');
 const showroom = searchParams.get('showroom');
 const sortBy = searchParams.get('sortBy') || 'newest';
 
 const query: any = {};
 
 if (search) {
 query.$or = [
 { brand: { $regex: search, $options: 'i' } },
 { model: { $regex: search, $options: 'i' } },
 { description: { $regex: search, $options: 'i' } },
 { location: { $regex: search, $options: 'i' } }
 ];
 }
 
 if (fuelType) query.fuelType = fuelType;
 if (transmission) query.transmission = transmission;
 if (minPrice || maxPrice) {
 query.price = {};
 if (minPrice) query.price.$gte = parseFloat(minPrice);
 if (maxPrice) query.price.$lte = parseFloat(maxPrice);
 }
 if (showroom) query.showroom = showroom;
 
 const skip = (page - 1) * limit;

 const sortOrder = sortBy === 'oldest' ? 1 : -1;
 
 const cars = await Car.find(query)
 .populate('showroom', 'name locationLink')
 .sort({ createdAt: sortOrder })
 .skip(skip)
 .limit(limit);
 
 const total = await Car.countDocuments(query);
 
 return NextResponse.json({
 success: true,
 data: cars,
 pagination: {
 page,
 limit,
 total,
 pages: Math.ceil(total / limit)
 }
 });
 } catch (error) {
 return handleApiError(error, 'فشل في جلب السيارات');
 }
}

export async function POST(request: NextRequest) {
 try {
 await connectDB();
 
 const body = await request.json();

 if (body.bodyType && body.bodyType !== 'سيارة') {
   let category = 'أخرى';
   if (body.bodyType === 'دراجة نارية') category = 'موتوسيكل';
   if (body.bodyType === 'توك توك') category = 'توك توك';
   if (body.bodyType === 'معدة') category = 'معدة زراعية';

   const newEquipment = new Equipment({
     title: `${body.brand} ${body.model}`,
     brand: body.brand,
     model: body.model,
     year: body.year,
     price: body.price,
     category: category,
     condition: 'مستعمل',
     hours: body.mileage || 0,
     location: body.location,
     phone: body.phone,
     description: body.description,
     images: body.images,
     features: body.features,
     status: body.status,
     locationLink: body.locationLink,
     showroom: body.showroom,
     featured: false,
   });

   await newEquipment.save();

   return NextResponse.json({
     success: true,
     data: newEquipment,
     message: 'تمت إضافة المركبة إلى قسم (دراجات أو معدات) بنجاح',
   }, { status: 201 });
 }

 const car = new Car(body);
 await car.save();
 
 return NextResponse.json({
 success: true,
 data: car,
 message: 'تمت إضافة السيارة بنجاح'
 }, { status: 201 });
 } catch (error) {
 return handleApiError(error, 'فشل في إضافة السيارة');
 }
}
