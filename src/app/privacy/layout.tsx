import { buildStaticPageMetadata } from "@/lib/seo";

export const metadata = buildStaticPageMetadata("privacy");

export default function PrivacyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
