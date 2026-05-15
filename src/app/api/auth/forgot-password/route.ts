import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongoose';
import User from '@/lib/models/User';
import { handleApiError } from '@/lib/api-helpers';
import crypto from 'crypto';

export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const body = await request.json();
    const { email } = body;

    if (!email) {
      return NextResponse.json(
        { success: false, error: 'البريد الإلكتروني مطلوب' },
        { status: 400 }
      );
    }

    const user = await User.findOne({ email: email.toLowerCase() });

    // Always return success to avoid email enumeration attacks
    if (!user) {
      return NextResponse.json({
        success: true,
        message: 'إذا كان البريد الإلكتروني مسجلاً، ستتلقى رابط استعادة كلمة المرور',
      });
    }

    // Generate a secure reset token
    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetTokenHash = crypto
      .createHash('sha256')
      .update(resetToken)
      .digest('hex');

    // Store hashed token and expiry (1 hour) on user doc
    user.resetPasswordToken = resetTokenHash;
    user.resetPasswordExpires = new Date(Date.now() + 60 * 60 * 1000);
    await user.save();

    const appUrl =
      process.env.NEXT_PUBLIC_APP_URL ||
      process.env.APP_URL ||
      'http://localhost:3000';
    const resetUrl = `${appUrl.replace(/\/$/, '')}/auth/reset-password?token=${resetToken}`;

    // TODO: send resetUrl by email in production (SMTP / Resend / etc.)
    return NextResponse.json({
      success: true,
      message: 'إذا كان البريد الإلكتروني مسجلاً، ستتلقى رابط استعادة كلمة المرور',
      ...(process.env.NODE_ENV === 'development' && { resetToken, resetUrl }),
    });
  } catch (error) {
    return handleApiError(error, 'فشل في معالجة طلب استعادة كلمة المرور');
  }
}
