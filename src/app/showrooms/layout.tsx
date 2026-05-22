import { buildStaticPageMetadata } from "@/lib/seo";

export const metadata = buildStaticPageMetadata("showrooms");

export default function ShowroomsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
