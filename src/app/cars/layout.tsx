import { buildStaticPageMetadata } from "@/lib/seo";
import { CarsJsonLd } from "@/components/seo/cars-json-ld";

export const metadata = buildStaticPageMetadata("cars");

export default function CarsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <CarsJsonLd />
      {children}
    </>
  );
}
