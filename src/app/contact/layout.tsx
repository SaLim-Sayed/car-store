import { buildStaticPageMetadata } from "@/lib/seo";

export const metadata = buildStaticPageMetadata("contact");

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
