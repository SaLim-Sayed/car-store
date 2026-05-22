import { buildStaticPageMetadata } from "@/lib/seo";

export const metadata = buildStaticPageMetadata("faq");

export default function FaqLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
