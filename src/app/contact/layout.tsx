import { Metadata } from 'next';

export const metadata: Metadata = {
  title: "اتصل بنا | سوق سيارات المنيا",
  description: "تواصل معنا في سوق سيارات المنيا للاستفسارات، إضافة الإعلانات، أو الإبلاغ عن مشكلة. نحن هنا لمساعدتك على مدار الساعة.",
  alternates: {
    canonical: '/contact',
  },
  openGraph: {
    title: "اتصل بنا | سوق سيارات المنيا",
    description: "تواصل معنا في سوق سيارات المنيا للاستفسارات، إضافة الإعلانات، أو الإبلاغ عن مشكلة. نحن هنا لمساعدتك على مدار الساعة.",
    url: 'https://car-store-sepia.vercel.app/contact',
    type: 'website',
  },
};

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
