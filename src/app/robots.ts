import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://tada-fashion.vn';

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/admin',
          '/api/',
          '/account',
          '/order-success/',
          '/cart',
          '/checkout'
        ]
      }
    ],
    sitemap: `${baseUrl}/sitemap.xml`
  };
}
