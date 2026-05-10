import { headers } from 'next/headers';
import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET!;

export async function getServerSession() {
  try {
    const headersList = await headers();
    const authorization = headersList.get('authorization');

    if (!authorization) return null;

    const token = authorization.split(' ')[1];
    if (!token) return null;

    try {
      const payload = jwt.verify(token, JWT_SECRET) as {
        userId: string;
        email: string;
        role: string;
      };
      return {
        user: {
          id: payload.userId,
          email: payload.email,
          role: payload.role,
        },
      };
    } catch {
      return null;
    }
  } catch {
    return null;
  }
}

export function handleApiError(
  error: unknown,
  defaultMessage: string = 'حدث خطأ ما'
) {
  console.error('API Error:', error);

  if (
    typeof error === 'object' &&
    error !== null &&
    'code' in error &&
    (error as { code: number }).code === 11000
  ) {
    return NextResponse.json(
      { success: false, error: 'هذا البريد الإلكتروني مستخدم بالفعل' },
      { status: 409 }
    );
  }

  if (
    typeof error === 'object' &&
    error !== null &&
    'name' in error &&
    (error as { name: string }).name === 'ValidationError'
  ) {
    const errObj = (error as unknown) as { errors: Record<string, { message: string }> };
    const errors = Object.values(errObj.errors).map((e) => e.message);
    return NextResponse.json(
      { success: false, error: errors.join(', ') },
      { status: 400 }
    );
  }

  const message =
    error instanceof Error ? error.message : defaultMessage;

  return NextResponse.json(
    { success: false, error: message || defaultMessage },
    { status: 500 }
  );
}
