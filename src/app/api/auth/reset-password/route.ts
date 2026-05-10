import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongoose';
import User from '@/lib/models/User';
import bcrypt from 'bcryptjs';
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
    
    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() }
    });
    
    if (!user) {
      return NextResponse.json(
        { success: false, error: 'رمز إعادة التعيين غير صالح أو منتهي الصلاحية' },
        { status: 400 }
      );
    }
    
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    
    await user.save();
    
    return NextResponse.json({
      success: true,
      message: 'تم إعادة تعيين كلمة المرور بنجاح'
    });
  } catch (error) {
    return handleApiError(error, 'فشل في إعادة تعيين كلمة المرور');
  }
}
