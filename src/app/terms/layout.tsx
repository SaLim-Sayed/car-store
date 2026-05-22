import { buildStaticPageMetadata } from "@/lib/seo";

export const metadata = buildStaticPageMetadata("terms");

export default function TermsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
