import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongoose';
import Showroom from '@/lib/models/Showroom';
import { handleApiError, getServerSession } from '@/lib/api-helpers';

export async function GET(request: Request) {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    const featured = searchParams.get('featured');
    
    const query = featured === 'true' ? { featured: true } : {};
    const showrooms = await Showroom.find(query).sort({ createdAt: -1 });

    return NextResponse.json({ success: true, data: showrooms });
  } catch (error) {
    return handleApiError(error, 'فشل في جلب المعارض');
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession();
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json({ success: false, error: 'غير مصرح لك بالقيام بهذا الإجراء' }, { status: 403 });
    }

    await connectDB();
    const body = await request.json();
    const showroom = await Showroom.create(body);

    return NextResponse.json({ success: true, data: showroom }, { status: 201 });
  } catch (error) {
    return handleApiError(error, 'فشل في إضافة المعرض');
  }
}
