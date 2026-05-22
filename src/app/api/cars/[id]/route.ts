import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongoose';
import Car from '@/lib/models/Car';
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
