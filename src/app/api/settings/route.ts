import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongoose';
import Settings from '@/lib/models/Settings';
import { handleApiError, getServerSession } from '@/lib/api-helpers';

export async function GET(request: NextRequest) {
  try {
    await connectDB();
    let settings = await Settings.findOne();
    if (!settings) {
      settings = await Settings.create({});
    }
    return NextResponse.json({ success: true, data: settings });
  } catch (error) {
    return handleApiError(error, 'فشل في جلب الإعدادات');
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

    let settings = await Settings.findOne();
    if (!settings) {
      settings = new Settings(body);
      await settings.save();
    } else {
      settings.set(body);
      await settings.save();
    }

    return NextResponse.json(
      { success: true, data: settings, message: 'تم تحديث الإعدادات بنجاح' },
      { status: 200 }
    );
  } catch (error) {
    return handleApiError(error, 'فشل في تحديث الإعدادات');
  }
}
