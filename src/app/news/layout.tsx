import { Metadata } from 'next';

export const metadata: Metadata = {
  title: "أخبار السيارات ومراجعات السوق | سوق سيارات المنيا",
  description: "تابع أحدث أخبار السيارات في مصر، نصائح الصيانة، مراجعات الموديلات الجديدة، وأحدث الأسعار والعروض في سوق سيارات المنيا.",
  alternates: {
    canonical: '/news',
  },
  openGraph: {
    title: "أخبار السيارات ومراجعات السوق | سوق سيارات المنيا",
    description: "تابع أحدث أخبار السيارات في مصر، نصائح الصيانة، مراجعات الموديلات الجديدة، وأحدث الأسعار والعروض في سوق سيارات المنيا.",
    url: 'https://car-store-sepia.vercel.app/news',
    type: 'website',
  },
};

export default function NewsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
