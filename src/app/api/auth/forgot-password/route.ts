import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongoose';
import User from '@/lib/models/User';
import crypto from 'crypto';
import nodemailer from 'nodemailer';
import { handleApiError } from '@/lib/api-helpers';

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    await connectDB();
    
    const { email } = await request.json();
    
    if (!email) {
      return NextResponse.json(
        { success: false, error: 'البريد الإلكتروني مطلوب' },
        { status: 400 }
      );
    }
    
    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json(
        { success: false, error: 'البريد الإلكتروني غير مسجل' },
        { status: 404 }
      );
    }
    
    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetPasswordExpires = new Date(Date.now() + 3600000); // 1 hour
    
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = resetPasswordExpires;
    await user.save();
    
    // Configure email transporter
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });
    
    const resetUrl = `${process.env.NEXTAUTH_URL}/reset-password?token=${resetToken}`;
    
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'إعادة تعيين كلمة المرور',
      html: `
        <div dir="rtl" style="font-family: Arial, sans-serif;">
          <h2>إعادة تعيين كلمة المرور</h2>
          <p>لقد طلبت إعادة تعيين كلمة المرور لحسابك.</p>
          <p>اضغط على الرابط التالي لإعادة تعيين كلمة المرور:</p>
          <a href="${resetUrl}" style="background-color: #007bff; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">
            إعادة تعيين كلمة المرور
          </a>
          <p>هذا الرابط صالح لمدة ساعة واحدة فقط.</p>
          <p>إذا لم تطلب إعادة تعيين كلمة المرور، يرجى تجاهل هذا البريد الإلكتروني.</p>
        </div>
      `,
    };
    
    await transporter.sendMail(mailOptions);
    
    return NextResponse.json({
      success: true,
      message: 'تم إرسال رابط إعادة تعيين كلمة المرور إلى بريدك الإلكتروني'
    });
  } catch (error) {
    return handleApiError(error, 'فشل في إرسال رابط إعادة تعيين كلمة المرور');
  }
}
