import { Metadata } from 'next';

export const metadata: Metadata = {
  title: "معارض السيارات والشركاء في المنيا | سوق سيارات المنيا",
  description: "دليل معارض السيارات المعتمدة والموثوقة في محافظة المنيا. تواصل مع المعارض والشركات واكتشف أحدث العروض والسيارات المتاحة لديهم مباشرة.",
  alternates: {
    canonical: '/showrooms',
  },
  openGraph: {
    title: "معارض السيارات والشركاء في المنيا | سوق سيارات المنيا",
    description: "دليل معارض السيارات المعتمدة والموثوقة في محافظة المنيا. تواصل مع المعارض والشركات واكتشف أحدث العروض والسيارات المتاحة لديهم مباشرة.",
    url: 'https://car-store-sepia.vercel.app/showrooms',
    type: 'website',
  },
};

export default function ShowroomsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
