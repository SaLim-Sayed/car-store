import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://car-store-sepia.vercel.app';
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: [
        '/admin/',
        '/api/',
        '/auth/',
        '/*?*', // Disallow crawling filter query strings to prevent duplicate content indexing
      ],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
