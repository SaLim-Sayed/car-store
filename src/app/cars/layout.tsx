import { buildStaticPageMetadata } from "@/lib/seo";

export const metadata = buildStaticPageMetadata("cars");

export default function CarsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
