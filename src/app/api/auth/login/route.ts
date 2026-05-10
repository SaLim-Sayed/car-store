import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongoose';
import User from '@/lib/models/User';
import jwt from 'jsonwebtoken';
import { handleApiError } from '@/lib/api-helpers';

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    await connectDB();
    
    const { email, password } = await request.json();
    
    if (!email || !password) {
      return NextResponse.json(
        { success: false, error: 'البريد الإلكتروني وكلمة المرور مطلوبان' },
        { status: 400 }
      );
    }
    
    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json(
        { success: false, error: 'بيانات الاعتماد غير صحيحة' },
        { status: 401 }
      );
    }
    
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return NextResponse.json(
        { success: false, error: 'بيانات الاعتماد غير صحيحة' },
        { status: 401 }
      );
    }
    
    if (!user.isActive) {
      return NextResponse.json(
        { success: false, error: 'الحساب غير نشط' },
        { status: 401 }
      );
    }
    
    const token = jwt.sign(
      { userId: user._id, email: user.email, role: user.role },
      process.env.JWT_SECRET!,
      { expiresIn: '7d' }
    );
    
    return NextResponse.json({
      success: true,
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role
        },
        token
      },
      message: 'تم تسجيل الدخول بنجاح'
    });
  } catch (error) {
    return handleApiError(error, 'فشل في تسجيل الدخول');
  }
}
