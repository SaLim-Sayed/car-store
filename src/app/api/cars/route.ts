import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongoose';
import Car from '@/lib/models/Car';
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
 
 const query: any = {};
 
 if (search) {
 query.$or = [
 { brand: { $regex: search, $options: 'i' } },
 { model: { $regex: search, $options: 'i' } },
 { description: { $regex: search, $options: 'i' } }
 ];
 }
 
 if (fuelType) query.fuelType = fuelType;
 if (transmission) query.transmission = transmission;
 if (minPrice || maxPrice) {
 query.price = {};
 if (minPrice) query.price.$gte = parseFloat(minPrice);
 if (maxPrice) query.price.$lte = parseFloat(maxPrice);
 }
 
 const skip = (page - 1) * limit;
 
 const cars = await Car.find(query)
 .sort({ createdAt: -1 })
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
