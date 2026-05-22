import { Metadata } from 'next';
import connectDB from '@/lib/mongoose';
import Car from '@/lib/models/Car';

interface LayoutProps {
  children: React.ReactNode;
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://car-store-sepia.vercel.app';

  try {
    await connectDB();
    const car = await Car.findById(id).lean() as any;

    if (!car) {
      return {
        title: 'السيارة غير موجودة | سوق سيارات المنيا',
      };
    }

    const title = `${car.brand} ${car.model} موديل ${car.year} للبيع في المنيا`;
    const description = `شراء سيارة ${car.brand} ${car.model} سنة ${car.year} في المنيا. ناقل حركة ${car.transmission}، وقود ${car.fuelType}${car.price ? `، وسعر ${car.price.toLocaleString('ar-EG')} جنيه` : ""}. تصفح التفاصيل وتواصل مع البائع مباشرة.`;
    const imageUrl = car.images?.[0] || '/logo.png';

    return {
      title,
      description,
      alternates: {
        canonical: `${baseUrl}/cars/${id}`,
      },
      openGraph: {
        title,
        description,
        url: `${baseUrl}/cars/${id}`,
        type: 'website',
        images: [
          {
            url: imageUrl,
            alt: title,
          },
        ],
      },
      twitter: {
        card: 'summary_large_image',
        title,
        description,
        images: [imageUrl],
      },
    };
  } catch (error) {
    console.error('Error generating car metadata:', error);
    return {
      title: 'تفاصيل السيارة | سوق سيارات المنيا',
    };
  }
}

export default function CarLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
