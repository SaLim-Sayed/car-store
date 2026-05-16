import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongoose';
import User from '@/lib/models/User';
import { handleApiError } from '@/lib/api-helpers';

// GET all users (admin only)
export async function GET() {
 try {
 await connectDB();

 const users = await User.find({}, '-password').sort({ createdAt: -1 });

 return NextResponse.json({ success: true, data: users });
 } catch (error) {
 return handleApiError(error, 'فشل في جلب المستخدمين');
 }
}

// POST create a new user (admin only)
export async function POST(request: NextRequest) {
 try {
 await connectDB();

 const body = await request.json();
 const { name, email, password, role = 'user' } = body;

 if (!name || !email || !password) {
 return NextResponse.json(
 { success: false, error: 'الاسم والبريد الإلكتروني وكلمة المرور مطلوبة' },
 { status: 400 }
 );
 }

 if (password.length < 6) {
 return NextResponse.json(
 { success: false, error: 'كلمة المرور يجب أن تكون 6 أحرف على الأقل' },
 { status: 400 }
 );
 }

 const existing = await User.findOne({ email: email.toLowerCase() });
 if (existing) {
 return NextResponse.json(
 { success: false, error: 'هذا البريد الإلكتروني مستخدم بالفعل' },
 { status: 409 }
 );
 }

 const user = new User({
 name: name.trim(),
 email: email.toLowerCase().trim(),
 password,
 role,
 isActive: true,
 });

 await user.save();

 return NextResponse.json(
 {
 success: true,
 data: {
 id: user._id,
 name: user.name,
 email: user.email,
 role: user.role,
 isActive: user.isActive,
 createdAt: user.createdAt,
 },
 message: 'تم إنشاء المستخدم بنجاح',
 },
 { status: 201 }
 );
 } catch (error) {
 return handleApiError(error, 'فشل في إنشاء المستخدم');
 }
}
