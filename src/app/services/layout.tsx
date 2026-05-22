import { buildStaticPageMetadata } from "@/lib/seo";

export const metadata = buildStaticPageMetadata("services");

export default function ServicesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
