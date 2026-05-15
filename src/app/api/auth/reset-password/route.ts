import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import connectDB from '@/lib/mongoose';
import User from '@/lib/models/User';
import { handleApiError } from '@/lib/api-helpers';

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    await connectDB();

    const { token, password } = await request.json();

    if (!token || !password) {
      return NextResponse.json(
        { success: false, error: 'الرمز وكلمة المرور الجديدة مطلوبان' },
        { status: 400 }
      );
    }

    if (typeof password !== 'string' || password.length < 6) {
      return NextResponse.json(
        { success: false, error: 'كلمة المرور يجب أن تكون 6 أحرف على الأقل' },
        { status: 400 }
      );
    }

    const tokenHash = crypto.createHash('sha256').update(token).digest('hex');

    const user = await User.findOne({
      resetPasswordToken: tokenHash,
      resetPasswordExpires: { $gt: new Date() },
    });

    if (!user) {
      return NextResponse.json(
        { success: false, error: 'رمز إعادة التعيين غير صالح أو منتهي الصلاحية' },
        { status: 400 }
      );
    }

    user.password = password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    return NextResponse.json({
      success: true,
      message: 'تم إعادة تعيين كلمة المرور بنجاح',
    });
  } catch (error) {
    return handleApiError(error, 'فشل في إعادة تعيين كلمة المرور');
  }
}
