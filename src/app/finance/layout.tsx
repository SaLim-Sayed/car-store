import { buildStaticPageMetadata } from "@/lib/seo";

export const metadata = buildStaticPageMetadata("finance");

export default function FinanceLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
