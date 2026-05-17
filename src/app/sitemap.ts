import { MetadataRoute } from 'next';
import connectDB from '@/lib/mongoose';
import Car from '@/lib/models/Car';
import Equipment from '@/lib/models/Equipment';
import Showroom from '@/lib/models/Showroom';
import News from '@/lib/models/News';

export const dynamic = 'force-dynamic';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://car-store-sepia.vercel.app';

  // Static routes
  const staticRoutes = [
    '',
    '/about',
    '/cars',
    '/equipment',
    '/news',
    '/contact',
    '/services',
    '/showrooms',
    '/faq',
    '/finance',
    '/privacy',
    '/terms'
  ];

  const staticEntries = staticRoutes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: (route === '' ? 'daily' : 'weekly') as 'daily' | 'weekly',
    priority: route === '' ? 1.0 : 0.8,
  }));

  try {
    await connectDB();

    // Fetch dynamic items
    const [cars, equipment, showrooms, news] = await Promise.all([
      Car.find({}, '_id updatedAt').lean(),
      Equipment.find({}, '_id updatedAt').lean(),
      Showroom.find({}, '_id updatedAt').lean(),
      News.find({}, '_id updatedAt').lean(),
    ]);

    const carEntries = cars.map((car: any) => ({
      url: `${baseUrl}/cars/${car._id}`,
      lastModified: car.updatedAt || new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.6,
    }));

    const equipmentEntries = equipment.map((equip: any) => ({
      url: `${baseUrl}/equipment/${equip._id}`,
      lastModified: equip.updatedAt || new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.6,
    }));

    const showroomEntries = showrooms.map((sr: any) => ({
      url: `${baseUrl}/showrooms/${sr._id}`,
      lastModified: sr.updatedAt || new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.6,
    }));

    const newsEntries = news.map((item: any) => ({
      url: `${baseUrl}/news/${item._id}`,
      lastModified: item.updatedAt || new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.5,
    }));

    return [
      ...staticEntries,
      ...carEntries,
      ...equipmentEntries,
      ...showroomEntries,
      ...newsEntries,
    ];
  } catch (error) {
    console.error('Error generating sitemap:', error);
    return staticEntries;
  }
}
