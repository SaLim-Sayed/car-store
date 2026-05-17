import { Metadata } from 'next';

export const metadata: Metadata = {
  title: "من نحن | سوق سيارات المنيا",
  description: "تعرف على سوق سيارات المنيا، المنصة الأكبر والرائدة لبيع وشراء السيارات الجديدة والمستعملة والمعدات الثقيلة والزراعية في محافظة المنيا.",
  alternates: {
    canonical: '/about',
  },
  openGraph: {
    title: "من نحن | سوق سيارات المنيا",
    description: "تعرف على سوق سيارات المنيا، المنصة الأكبر والرائدة لبيع وشراء السيارات الجديدة والمستعملة والمعدات الثقيلة والزراعية في محافظة المنيا.",
    url: 'https://car-store-sepia.vercel.app/about',
    type: 'website',
  },
};

export default function AboutLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
