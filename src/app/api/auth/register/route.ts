import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongoose';
import User from '@/lib/models/User';
import jwt from 'jsonwebtoken';
import { handleApiError } from '@/lib/api-helpers';

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    await connectDB();
    
    const { name, email, password } = await request.json();
    
    if (!name || !email || !password) {
      return NextResponse.json(
        { success: false, error: 'جميع الحقول مطلوبة' },
        { status: 400 }
      );
    }
    
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { success: false, error: 'البريد الإلكتروني مسجل بالفعل' },
        { status: 400 }
      );
    }
    
    const user = new User({ name, email, password });
    await user.save();
    
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
      message: 'تم إنشاء الحساب بنجاح'
    }, { status: 201 });
  } catch (error) {
    return handleApiError(error, 'فشل في إنشاء الحساب');
  }
}
