import { buildStaticPageMetadata } from "@/lib/seo";

export const metadata = buildStaticPageMetadata("about");

export default function AboutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
