import { buildStaticPageMetadata } from "@/lib/seo";

export const metadata = buildStaticPageMetadata("news");

export default function NewsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
