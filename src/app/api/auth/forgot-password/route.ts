import { NextRequest, NextResponse } from 'next/server';
import { handleApiError } from '@/lib/api-helpers';
import { createPasswordResetToken } from '@/lib/password-reset';
import {
  getResendConfigError,
  sendPasswordResetEmail,
} from '@/lib/send-reset-email';

const successMessage =
  'إذا كان البريد الإلكتروني مسجلاً، ستتلقى رابط استعادة كلمة المرور';

export async function POST(request: NextRequest) {
  try {
    const configError = getResendConfigError();
    if (configError && process.env.NODE_ENV === 'production') {
      console.error('Forgot password:', configError);
      return NextResponse.json(
        {
          success: false,
          error:
            'خدمة البريد غير مُفعّلة. أضف RESEND_API_KEY في إعدادات Vercel ثم أعد النشر.',
        },
        { status: 503 }
      );
    }

    const body = await request.json();
    const { email } = body;

    if (!email || typeof email !== 'string') {
      return NextResponse.json(
        { success: false, error: 'البريد الإلكتروني مطلوب' },
        { status: 400 }
      );
    }

    const reset = await createPasswordResetToken(email);

    if (!reset) {
      return NextResponse.json({ success: true, message: successMessage });
    }

    const { resetUrl, userName } = reset;
    const { sent, error: emailError } = await sendPasswordResetEmail(
      email.toLowerCase().trim(),
      resetUrl,
      userName
    );

    if (!sent) {
      console.error('Password reset email failed:', emailError);
      console.error('Reset URL (support only):', resetUrl);

      if (process.env.NODE_ENV === 'production') {
        return NextResponse.json(
          {
            success: false,
            error:
              emailError ||
              'تعذر إرسال البريد. تحقق من Resend: المفتاح، عنوان المرسل، وتوثيق النطاق.',
          },
          { status: 500 }
        );
      }

      return NextResponse.json({
        success: true,
        message: successMessage,
        resetUrl,
        devNote: emailError,
      });
    }

    return NextResponse.json({
      success: true,
      message: successMessage,
    });
  } catch (error) {
    return handleApiError(error, 'فشل في معالجة طلب استعادة كلمة المرور');
  }
}
