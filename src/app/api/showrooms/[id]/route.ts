import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongoose';
import Showroom from '@/lib/models/Showroom';
import { handleApiError, getServerSession } from '@/lib/api-helpers';
import { persistImageUrl } from '@/lib/persist-image';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await connectDB();
    const showroom = await Showroom.findById(id);
    if (!showroom) {
      return NextResponse.json({ success: false, error: 'المعرض غير موجود' }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: showroom });
  } catch (error) {
    return handleApiError(error, 'فشل في جلب بيانات المعرض');
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const session = await getServerSession();
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json({ success: false, error: 'غير مصرح لك بالقيام بهذا الإجراء' }, { status: 403 });
    }

    await connectDB();
    const body = await request.json();
    if (body.logo) {
      body.logo = await persistImageUrl(body.logo);
    }
    const showroom = await Showroom.findByIdAndUpdate(id, body, { new: true, runValidators: true });
    
    if (!showroom) {
      return NextResponse.json({ success: false, error: 'المعرض غير موجود' }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: showroom });
  } catch (error) {
    return handleApiError(error, 'فشل في تحديث بيانات المعرض');
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const session = await getServerSession();
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json({ success: false, error: 'غير مصرح لك بالقيام بهذا الإجراء' }, { status: 403 });
    }

    await connectDB();
    const showroom = await Showroom.findByIdAndDelete(id);
    
    if (!showroom) {
      return NextResponse.json({ success: false, error: 'المعرض غير موجود' }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: {} });
  } catch (error) {
    return handleApiError(error, 'فشل في حذف المعرض');
  }
}
