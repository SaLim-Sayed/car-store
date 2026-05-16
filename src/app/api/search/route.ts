import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongoose';
import Car from '@/lib/models/Car';
import Showroom from '@/lib/models/Showroom';
import Equipment from '@/lib/models/Equipment';
import News from '@/lib/models/News';
import { handleApiError } from '@/lib/api-helpers';
import { pickFirstImage, resolveImageSrc } from '@/lib/image-src';

export type SearchResultItem = {
 id: string;
 type: 'car' | 'showroom' | 'equipment' | 'news';
 typeLabel: string;
 title: string;
 subtitle?: string;
 href: string;
 image?: string;
};

/** Per-category cap to keep responses fast; set high enough to show full result sets */
const MAX_PER_TYPE = 100;

function regex(q: string) {
 return { $regex: q, $options: 'i' };
}

export async function GET(request: NextRequest) {
 try {
 const q = request.nextUrl.searchParams.get('q')?.trim() ?? '';

 if (q.length < 2) {
 return NextResponse.json({ success: true, data: [] as SearchResultItem[] });
 }

 await connectDB();

 const [cars, showrooms, equipment, news] = await Promise.all([
 Car.find({
 $or: [
 { brand: regex(q) },
 { model: regex(q) },
 { description: regex(q) },
 { color: regex(q) },
 ],
 })
 .select('brand model year price images')
 .limit(MAX_PER_TYPE)
 .lean(),

 Showroom.find({
 $or: [{ name: regex(q) }, { address: regex(q) }, { description: regex(q) }],
 })
 .select('name address logo')
 .limit(MAX_PER_TYPE)
 .lean(),

 Equipment.find({
 $or: [
 { title: regex(q) },
 { brand: regex(q) },
 { model: regex(q) },
 { location: regex(q) },
 ],
 })
 .select('title brand model price images')
 .limit(MAX_PER_TYPE)
 .lean(),

 News.find({
 status: 'نشط',
 $or: [{ title: regex(q) }, { excerpt: regex(q) }, { category: regex(q) }],
 })
 .select('title excerpt category image')
 .limit(MAX_PER_TYPE)
 .lean(),
 ]);

 const results: SearchResultItem[] = [
 ...cars.map((c) => ({
 id: String(c._id),
 type: 'car' as const,
 typeLabel: 'سيارة',
 title: `${c.brand} ${c.model}`,
 subtitle: `${c.year} · ${Number(c.price).toLocaleString('ar-EG')} ج.م`,
 href: `/cars/${c._id}`,
 image: pickFirstImage(
 ...(Array.isArray(c.images) ? c.images : [])
 ) ?? undefined,
 })),
 ...showrooms.map((s) => ({
 id: String(s._id),
 type: 'showroom' as const,
 typeLabel: 'معرض',
 title: s.name,
 subtitle: s.address,
 href: `/showrooms?search=${encodeURIComponent(s.name)}`,
 image: resolveImageSrc(s.logo) ?? undefined,
 })),
 ...equipment.map((e) => ({
 id: String(e._id),
 type: 'equipment' as const,
 typeLabel: 'معدة',
 title: e.title || `${e.brand} ${e.model || ''}`.trim(),
 subtitle: `${Number(e.price).toLocaleString('ar-EG')} ج.م`,
 href: `/equipment/${e._id}`,
 image: pickFirstImage(
 ...(Array.isArray(e.images) ? e.images : [])
 ) ?? undefined,
 })),
 ...news.map((n) => ({
 id: String(n._id),
 type: 'news' as const,
 typeLabel: 'خبر',
 title: n.title,
 subtitle: n.category,
 href: `/news/${n._id}`,
 image: resolveImageSrc(n.image) ?? undefined,
 })),
 ];

 return NextResponse.json({
 success: true,
 data: results,
 total: results.length,
 counts: {
 cars: cars.length,
 showrooms: showrooms.length,
 equipment: equipment.length,
 news: news.length,
 },
 });
 } catch (error) {
 return handleApiError(error, 'فشل في البحث');
 }
}
