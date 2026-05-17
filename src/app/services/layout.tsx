import { Metadata } from 'next';

export const metadata: Metadata = {
  title: "خدماتنا | سوق سيارات المنيا",
  description: "اكتشف الخدمات المتميزة التي يقدمها سوق سيارات المنيا، من بيع وشراء السيارات، تمويل السيارات، وإضافة المعارض مجاناً وبكل سهولة.",
  alternates: {
    canonical: '/services',
  },
  openGraph: {
    title: "خدماتنا | سوق سيارات المنيا",
    description: "اكتشف الخدمات المتميزة التي يقدمها سوق سيارات المنيا، من بيع وشراء السيارات، تمويل السيارات، وإضافة المعارض مجاناً وبكل سهولة.",
    url: 'https://car-store-sepia.vercel.app/services',
    type: 'website',
  },
};

export default function ServicesLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
