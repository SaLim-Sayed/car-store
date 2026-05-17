import { Metadata } from 'next';

export const metadata: Metadata = {
  title: "سيارات للبيع في المنيا | سوق سيارات المنيا",
  description: "تصفح آلاف السيارات الجديدة والمستعملة المعروضة للبيع في محافظة المنيا. قارن الأسعار والمواصفات وتواصل مباشرة مع أصحاب السيارات والمعارض مجاناً وبدون أي عمولة.",
  alternates: {
    canonical: '/cars',
  },
  openGraph: {
    title: "سيارات للبيع في المنيا | سوق سيارات المنيا",
    description: "تصفح آلاف السيارات الجديدة والمستعملة المعروضة للبيع في محافظة المنيا. قارن الأسعار والمواصفات وتواصل مباشرة مع البائعين مجاناً.",
    url: 'https://car-store-sepia.vercel.app/cars',
    type: 'website',
  },
};

export default function CarsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
