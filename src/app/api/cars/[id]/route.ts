import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongoose';
import Car from '@/lib/models/Car';
import Equipment from '@/lib/models/Equipment';
import '@/lib/models/Showroom';
import { handleApiError } from '@/lib/api-helpers';

export async function GET(
 request: NextRequest,
 { params }: { params: Promise<{ id: string }> }
): Promise<NextResponse> {
 try {
 await connectDB();

 const { id } = await params;
 const car = await Car.findById(id).populate('showroom', 'name locationLink');

 if (!car) {
 return NextResponse.json(
 { success: false, error: 'السيارة غير موجودة' },
 { status: 404 }
 );
 }

 return NextResponse.json({ success: true, data: car });
 } catch (error) {
 return handleApiError(error, 'فشل في جلب السيارة');
 }
}

export async function PUT(
 request: NextRequest,
 { params }: { params: Promise<{ id: string }> }
): Promise<NextResponse> {
 try {
 await connectDB();

 const body = await request.json();
 const { id } = await params;

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
   await Car.findByIdAndDelete(id);

   return NextResponse.json({
     success: true,
     data: newEquipment,
     message: 'تم تحويل السيارة إلى التصنيف المناسب (دراجات أو معدات)',
   });
 }

 const car = await Car.findByIdAndUpdate(id, body, {
 new: true,
 runValidators: true,
 });

 if (!car) {
 return NextResponse.json(
 { success: false, error: 'السيارة غير موجودة' },
 { status: 404 }
 );
 }

 return NextResponse.json({
 success: true,
 data: car,
 message: 'تم تحديث السيارة بنجاح',
 });
 } catch (error) {
 return handleApiError(error, 'فشل في تحديث السيارة');
 }
}

export async function DELETE(
 request: NextRequest,
 { params }: { params: Promise<{ id: string }> }
): Promise<NextResponse> {
 try {
 await connectDB();

 const { id } = await params;
 const car = await Car.findByIdAndDelete(id);

 if (!car) {
 return NextResponse.json(
 { success: false, error: 'السيارة غير موجودة' },
 { status: 404 }
 );
 }

 return NextResponse.json({
 success: true,
 message: 'تم حذف السيارة بنجاح',
 });
 } catch (error) {
 return handleApiError(error, 'فشل في حذف السيارة');
 }
}
