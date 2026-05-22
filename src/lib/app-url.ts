/** Canonical site origin (no trailing slash). Use for sitemap, robots, metadata, emails. */
export function getAppUrl(): string {
  const raw =
    process.env.NEXT_PUBLIC_APP_URL ||
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : null) ||
    process.env.APP_URL ||
    (process.env.NODE_ENV === "production"
      ? "https://car-store-sepia.vercel.app"
      : "http://localhost:3000");
  return raw.replace(/\/+$/, "");
}

/** Build an absolute URL without duplicate slashes (safe even if env URL ends with `/`). */
export function absoluteUrl(path = ""): string {
  const base = getAppUrl();
  const cleanPath = path.replace(/^\/+/, "");
  if (!cleanPath) return `${base}/`;
  return `${base}/${cleanPath}`;
}
