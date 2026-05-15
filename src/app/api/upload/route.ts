import { NextRequest, NextResponse } from 'next/server';
import { mkdir, writeFile } from 'fs/promises';
import { join } from 'path';
import { v4 as uuidv4 } from 'uuid';

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp', 'image/gif']);

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json(
        { success: false, error: 'لم يتم اختيار ملف' },
        { status: 400 }
      );
    }

    if (!ALLOWED_TYPES.has(file.type)) {
      return NextResponse.json(
        { success: false, error: 'نوع الملف غير مدعوم. استخدم JPG أو PNG أو WebP' },
        { status: 400 }
      );
    }

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { success: false, error: 'حجم الصورة يجب أن يكون أقل من 5 ميجابايت' },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const extension = file.name.split('.').pop() || file.type.split('/')[1]?.replace('jpeg', 'jpg') || 'jpg';
    const filename = `${uuidv4()}.${extension}`;
    const uploadsDir = join(process.cwd(), 'public', 'uploads');
    const filePath = join(uploadsDir, filename);

    await mkdir(uploadsDir, { recursive: true });
    await writeFile(filePath, buffer);

    const url = `/uploads/${filename}`;

    return NextResponse.json({
      success: true,
      url,
      message: 'File uploaded successfully',
    });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { success: false, error: 'فشل رفع الملف' },
      { status: 500 }
    );
  }
}
