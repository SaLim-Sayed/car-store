import { Metadata } from 'next';
import connectDB from '@/lib/mongoose';
import News from '@/lib/models/News';

interface LayoutProps {
  children: React.ReactNode;
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://car-store-sepia.vercel.app';

  try {
    await connectDB();
    const article = await News.findById(id).lean() as any;

    if (!article) {
      return {
        title: 'الخبر غير موجود | سوق سيارات المنيا',
      };
    }

    const title = `${article.title} | أخبار سوق سيارات المنيا`;
    const description = article.excerpt || article.content?.slice(0, 150) + '...';
    const imageUrl = article.image || '/logo.png';

    return {
      title,
      description,
      alternates: {
        canonical: `${baseUrl}/news/${id}`,
      },
      openGraph: {
        title,
        description,
        url: `${baseUrl}/news/${id}`,
        type: 'article',
        images: [
          {
            url: imageUrl,
            alt: article.title,
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
    console.error('Error generating news metadata:', error);
    return {
      title: 'أخبار السيارات | سوق سيارات المنيا',
    };
  }
}

export default function NewsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
