import { buildStaticPageMetadata, buildFaqJsonLd, CARS_MARKET_FAQ } from "@/lib/seo";
import { JsonLd } from "@/components/seo/json-ld";

export const metadata = buildStaticPageMetadata("faq");

export default function FaqLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <JsonLd data={buildFaqJsonLd(CARS_MARKET_FAQ)} />
      {children}
    </>
  );
}
