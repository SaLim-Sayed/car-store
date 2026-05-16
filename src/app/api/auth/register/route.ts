import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongoose';
import User from '@/lib/models/User';
import { handleApiError } from '@/lib/api-helpers';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET!;
const JWT_EXPIRES_IN = '7d';

export async function POST(request: NextRequest) {
 try {
 await connectDB();

 const body = await request.json();
 const { name, email, password } = body;

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

 const existingUser = await User.findOne({ email: email.toLowerCase() });

 if (existingUser) {
 return NextResponse.json(
 { success: false, error: 'هذا البريد الإلكتروني مستخدم بالفعل' },
 { status: 409 }
 );
 }

 const user = new User({
 name: name.trim(),
 email: email.toLowerCase().trim(),
 password,
 role: 'user',
 });

 await user.save();

 const token = jwt.sign(
 { userId: user._id.toString(), email: user.email, role: user.role },
 JWT_SECRET,
 { expiresIn: JWT_EXPIRES_IN }
 );

 const response = NextResponse.json(
 {
 success: true,
 data: {
 token,
 user: {
 id: user._id.toString(),
 name: user.name,
 email: user.email,
 role: user.role,
 },
 },
 message: 'تم إنشاء الحساب بنجاح',
 },
 { status: 201 }
 );

 response.cookies.set('auth-token', token, {
 httpOnly: true,
 secure: process.env.NODE_ENV === 'production',
 sameSite: 'lax',
 path: '/',
 maxAge: 60 * 60 * 24 * 7,
 });

 return response;
 } catch (error) {
 return handleApiError(error, 'فشل في إنشاء الحساب');
 }
}
