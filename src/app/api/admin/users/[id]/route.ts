import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongoose';
import User from '@/lib/models/User';
import { handleApiError } from '@/lib/api-helpers';

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
): Promise<NextResponse> {
  try {
    await connectDB();

    const { id } = await params;
    const user = await User.findByIdAndDelete(id);

    if (!user) {
      return NextResponse.json(
        { success: false, error: 'المستخدم غير موجود' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'تم حذف المستخدم بنجاح',
    });
  } catch (error) {
    return handleApiError(error, 'فشل في حذف المستخدم');
  }
}
