import { headers } from 'next/headers'

export async function getServerSession() {
  try {
    const headersList = await headers()
    const authorization = headersList.get('authorization')
    
    if (!authorization) {
      return null
    }

    const token = authorization.split(' ')[1]
    if (!token) {
      return null
    }

    // Verify JWT token (simplified - in production, use proper JWT verification)
    try {
      const payload = JSON.parse(atob(token.split('.')[1]))
      return {
        user: {
          id: payload.userId,
          email: payload.email,
          role: payload.role
        }
      }
    } catch (error) {
      return null
    }
  } catch (error) {
    return null
  }
}

import { NextResponse } from 'next/server';

export function handleApiError(error: any, defaultMessage: string = 'حدث خطأ ما') {
  console.error('API Error:', error)
  
  if (error.code === 11000) {
    return NextResponse.json(
      { success: false, error: 'خطأ في الاتصال بقاعدة البيانات' },
      { status: 500 }
    );
  }
  
  if (error.name === 'ValidationError') {
    const errors = Object.values(error.errors).map((err: any) => err.message)
    return NextResponse.json(
      { success: false, error: errors.join(', ') },
      { status: 400 }
    );
  }
  
  return NextResponse.json(
    { success: false, error: error.message || defaultMessage },
    { status: 500 }
  );
}
