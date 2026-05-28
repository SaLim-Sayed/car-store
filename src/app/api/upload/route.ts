import { NextRequest, NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import crypto from "node:crypto";

export const runtime = "nodejs";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || "demo",
  api_key: process.env.CLOUDINARY_API_KEY || "123456789012345",
  api_secret: process.env.CLOUDINARY_API_SECRET || "secret",
});

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
]);

const MIME_TO_EXT: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/gif": "gif",
};

async function saveLocally(file: File, origin: string) {
  const ext = MIME_TO_EXT[file.type] ?? "bin";
  const filename = `${crypto.randomUUID()}.${ext}`;
  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  const uploadDir = path.join(process.cwd(), "public", "uploads");
  await mkdir(uploadDir, { recursive: true });
  await writeFile(path.join(uploadDir, filename), buffer);

  return {
    url: `${origin}/uploads/${filename}`,
    storage: "local" as const,
  };
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json(
        { success: false, error: "لم يتم اختيار ملف" },
        { status: 400 },
      );
    }

    if (!ALLOWED_TYPES.has(file.type)) {
      return NextResponse.json(
        {
          success: false,
          error: "نوع الملف غير مدعوم. استخدم JPG أو PNG أو WebP",
        },
        { status: 400 },
      );
    }

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { success: false, error: "حجم الصورة يجب أن يكون أقل من 5 ميجابايت" },
        { status: 400 },
      );
    }

    if (file.size === 0) {
      return NextResponse.json(
        {
          success: false,
          error:
            "الملف فارغ (0 بايت). استخدم رفع multipart صحيح مثل: curl -F \"file=@/path/to/file.png\"",
        },
        { status: 400 },
      );
    }

    const origin = request.nextUrl.origin;

    const hasCloudinaryConfig =
      !!process.env.CLOUDINARY_CLOUD_NAME &&
      !!process.env.CLOUDINARY_API_KEY &&
      !!process.env.CLOUDINARY_API_SECRET &&
      process.env.CLOUDINARY_CLOUD_NAME !== "demo";

    if (!hasCloudinaryConfig) {
      const local = await saveLocally(file, origin);
      return NextResponse.json({
        success: true,
        url: local.url,
        storage: local.storage,
        message: "File uploaded successfully",
      });
    }

    try {
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);
      const base64Data = buffer.toString("base64");
      const fileUri = `data:${file.type};base64,${base64Data}`;

      const result = await cloudinary.uploader.upload(fileUri, {
        folder: "car_store",
        resource_type: "image",
      });

      return NextResponse.json({
        success: true,
        url: result.secure_url,
        storage: "cloudinary",
        message: "File uploaded successfully",
      });
    } catch (cloudErr) {
      console.error("Cloudinary upload failed, falling back to local:", cloudErr);
      const local = await saveLocally(file, origin);

      const cloudinaryError =
        cloudErr && typeof cloudErr === "object"
          ? // @ts-expect-error cloudinary error is untyped
            (cloudErr.message ?? cloudErr.error?.message ?? cloudErr.toString?.())
          : String(cloudErr);

      return NextResponse.json({
        success: true,
        url: local.url,
        storage: local.storage,
        warning:
          "تعذر الرفع إلى Cloudinary، تم حفظ الصورة محلياً. تحقق من إعدادات Cloudinary.",
        ...(process.env.NODE_ENV !== "production" ? { cloudinaryError } : {}),
      });
    }
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json(
      { success: false, error: "فشل رفع الملف" },
      { status: 500 },
    );
  }
}
