import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongoose';
import News from '@/lib/models/News';
import { handleApiError, getServerSession } from '@/lib/api-helpers';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await connectDB();
    const news = await News.findById(id);
    if (!news) {
      return NextResponse.json({ success: false, error: 'الخبر غير موجود' }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: news });
  } catch (error) {
    return handleApiError(error, 'فشل في جلب الخبر');
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
    const news = await News.findByIdAndUpdate(id, body, { new: true, runValidators: true });
    
    if (!news) {
      return NextResponse.json({ success: false, error: 'الخبر غير موجود' }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: news });
  } catch (error) {
    return handleApiError(error, 'فشل في تحديث الخبر');
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
    const news = await News.findByIdAndDelete(id);
    
    if (!news) {
      return NextResponse.json({ success: false, error: 'الخبر غير موجود' }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: {} });
  } catch (error) {
    return handleApiError(error, 'فشل في حذف الخبر');
  }
}
