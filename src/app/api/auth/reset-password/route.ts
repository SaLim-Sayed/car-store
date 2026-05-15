import { NextRequest, NextResponse } from 'next/server';
import { handleApiError } from '@/lib/api-helpers';
import { applyPasswordReset } from '@/lib/password-reset';

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
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

    const updated = await applyPasswordReset(token, password);

    if (!updated) {
      return NextResponse.json(
        { success: false, error: 'رمز إعادة التعيين غير صالح أو منتهي الصلاحية' },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'تم إعادة تعيين كلمة المرور بنجاح',
    });
  } catch (error) {
    return handleApiError(error, 'فشل في إعادة تعيين كلمة المرور');
  }
}
