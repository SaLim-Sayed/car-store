import { MetadataRoute } from "next";
import { absoluteUrl } from "@/lib/app-url";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: [
        "/admin/",
        "/api/",
        "/auth/",
        "/*?*", // Avoid indexing filter query strings (duplicate content)
      ],
    },
    sitemap: absoluteUrl("sitemap.xml"),
  };
}
