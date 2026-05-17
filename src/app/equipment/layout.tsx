import { Metadata } from 'next';

export const metadata: Metadata = {
  title: "معدات ثقيلة وزراعية للبيع | سوق سيارات المنيا",
  description: "أكبر سوق للمعدات الثقيلة والزراعية والجرارات المستعملة والجديدة في المنيا. تصفح جرارات زراعية وحفارات وشاحنات بأسعار ممتازة وتواصل مع البائع مباشرة.",
  alternates: {
    canonical: '/equipment',
  },
  openGraph: {
    title: "معدات ثقيلة وزراعية للبيع | سوق سيارات المنيا",
    description: "أكبر سوق للمعدات الثقيلة والزراعية والجرارات المستعملة والجديدة في المنيا. تصفح جرارات زراعية وتواصل مع المعارض والشركات مباشرة.",
    url: 'https://car-store-sepia.vercel.app/equipment',
    type: 'website',
  },
};

export default function EquipmentLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
