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

export async function GET(
 request: NextRequest,
 { params }: { params: Promise<{ id: string }> }
) {
 try {
 const { id } = await params;
 await connectDB();
 const equipment = await Equipment.findById(id);

 if (!equipment) {
 return NextResponse.json({ success: false, error: 'المعدة غير موجودة' }, { status: 404 });
 }

 return NextResponse.json({ success: true, data: equipment });
 } catch (error) {
 return handleApiError(error, 'فشل في جلب بيانات المعدة');
 }
}

export async function PUT(
 request: NextRequest,
 { params }: { params: Promise<{ id: string }> }
) {
 try {
 const { id } = await params;
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
   await Equipment.findByIdAndDelete(id);

   return NextResponse.json({
     success: true,
     data: newCar,
     message: 'تم تحويل المركبة إلى قسم السيارات بنجاح',
   });
 }

 const equipment = await Equipment.findByIdAndUpdate(id, body, {
 new: true,
 runValidators: true,
 });

 if (!equipment) {
 return NextResponse.json({ success: false, error: 'المعدة غير موجودة' }, { status: 404 });
 }

 return NextResponse.json({ success: true, data: equipment });
 } catch (error) {
 return handleApiError(error, 'فشل في تحديث المعدة');
 }
}

export async function DELETE(
 request: NextRequest,
 { params }: { params: Promise<{ id: string }> }
) {
 try {
 const { id } = await params;
 const session = await getServerSession();
 if (!session || session.user.role !== 'admin') {
 return NextResponse.json(
 { success: false, error: 'غير مصرح لك بالقيام بهذا الإجراء' },
 { status: 403 }
 );
 }

 await connectDB();
 const equipment = await Equipment.findByIdAndDelete(id);

 if (!equipment) {
 return NextResponse.json({ success: false, error: 'المعدة غير موجودة' }, { status: 404 });
 }

 return NextResponse.json({ success: true, data: {} });
 } catch (error) {
 return handleApiError(error, 'فشل في حذف المعدة');
 }
}
