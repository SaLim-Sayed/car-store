import { Metadata } from 'next';
import connectDB from '@/lib/mongoose';
import Equipment from '@/lib/models/Equipment';

interface LayoutProps {
  children: React.ReactNode;
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://car-store-sepia.vercel.app';

  try {
    await connectDB();
    const item = await Equipment.findById(id).lean() as any;

    if (!item) {
      return {
        title: 'المعدة غير موجودة | سوق سيارات المنيا',
      };
    }

    const title = `${item.title} ${item.brand} ${item.model} في المنيا`;
    const description = `بيع وشراء معدات ثقيلة وزراعية في المنيا: ${item.category} ${item.brand} ${item.model}. الحالة: ${item.condition}، ساعات العمل: ${item.hours} ساعة، الموقع: ${item.location}، وسعر: ${item.price.toLocaleString('ar-EG')} جنيه.`;
    const imageUrl = item.images?.[0] || '/logo.png';

    return {
      title,
      description,
      alternates: {
        canonical: `${baseUrl}/equipment/${id}`,
      },
      openGraph: {
        title,
        description,
        url: `${baseUrl}/equipment/${id}`,
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
    console.error('Error generating equipment metadata:', error);
    return {
      title: 'تفاصيل المعدة | سوق سيارات المنيا',
    };
  }
}

export default function EquipmentLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
