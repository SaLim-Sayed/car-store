import { writeFile } from 'fs/promises';
import { join } from 'path';
import { v4 as uuidv4 } from 'uuid';

const DATA_URL_PATTERN = /^data:image\/([\w+.-]+);base64,(.+)$/;

export async function persistImageUrl(image: string): Promise<string> {
  if (!image.startsWith('data:image/')) {
    return image;
  }

  const match = image.match(DATA_URL_PATTERN);
  if (!match) {
    throw new Error('صيغة الصورة غير صالحة');
  }

  const [, rawExt, base64Data] = match;
  const ext = rawExt.split('+')[0] === 'jpeg' ? 'jpg' : rawExt.split('+')[0];
  const buffer = Buffer.from(base64Data, 'base64');
  const filename = `${uuidv4()}.${ext}`;
  const filePath = join(process.cwd(), 'public', 'uploads', filename);

  await writeFile(filePath, buffer);

  return `/uploads/${filename}`;
}
