import { buildStaticPageMetadata } from "@/lib/seo";

export const metadata = buildStaticPageMetadata("bikes");

export default function BikesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
