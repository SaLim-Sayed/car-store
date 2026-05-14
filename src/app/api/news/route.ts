import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongoose';
import News from '@/lib/models/News';
import { handleApiError, getServerSession } from '@/lib/api-helpers';

export async function GET(request: Request) {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '10');
    const status = searchParams.get('status') || 'نشط';

    const query = status === 'all' ? {} : { status };
    const news = await News.find(query).sort({ createdAt: -1 }).limit(limit);

    return NextResponse.json({ success: true, data: news });
  } catch (error) {
    return handleApiError(error, 'فشل في جلب الأخبار');
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
    const news = await News.create(body);

    return NextResponse.json({ success: true, data: news }, { status: 201 });
  } catch (error) {
    return handleApiError(error, 'فشل في إضافة الخبر');
  }
}
