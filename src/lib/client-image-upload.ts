export async function uploadImageFile(file: File): Promise<string> {
 const formData = new FormData();
 formData.append('file', file);

 const res = await fetch('/api/upload', {
 method: 'POST',
 body: formData,
 });

 const data = await res.json();

 if (!data.success || !data.url) {
 throw new Error(data.error || 'فشل رفع الصورة');
 }

 return data.url;
}

export async function uploadImageIfNeeded(image: string): Promise<string> {
 if (!image.startsWith('data:image/')) {
 return image;
 }

 const response = await fetch(image);
 const blob = await response.blob();
 const extension = blob.type.split('/')[1]?.replace('jpeg', 'jpg') || 'jpg';

 const formData = new FormData();
 formData.append('file', blob, `image.${extension}`);

 const res = await fetch('/api/upload', {
 method: 'POST',
 body: formData,
 });

 const data = await res.json();

 if (!data.success || !data.url) {
 throw new Error(data.error || 'فشل رفع الصورة');
 }

 return data.url;
}
