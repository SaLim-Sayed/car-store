import { buildSiteJsonLd } from "@/lib/seo";
import { JsonLd } from "@/components/seo/json-ld";

export function SiteJsonLd() {
  return <JsonLd data={buildSiteJsonLd()} />;
}
