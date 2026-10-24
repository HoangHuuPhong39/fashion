import { MetadataRoute } from 'next';
import { getDBProducts } from '@/lib/db';
import { BLOG_POSTS } from '@/data/blog-posts';

export const revalidate = 3600; // Cập nhật lại sitemap mỗi 1 giờ

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://tada-fashion.vn';
  const now = new Date();

  // Các trang tĩnh chính
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}`,
      lastModified: now,
      changeFrequency: 'daily',
      priority: 1.0
    },
    {
      url: `${baseUrl}/shop`,
      lastModified: now,
      changeFrequency: 'daily',
      priority: 0.9
    },
    {
      url: `${baseUrl}/collections`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.85
    },
    {
      url: `${baseUrl}/concierge`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.8
    },
    {
      url: `${baseUrl}/order-info`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.6
    },
    {
      url: `${baseUrl}/ve-chung-toi`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.7
    },
    {
      url: `${baseUrl}/chinh-sach-doi-tra`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.6
    },
    {
      url: `${baseUrl}/van-chuyen`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.6
    },
    {
      url: `${baseUrl}/thanh-toan`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.6
    },
    {
      url: `${baseUrl}/lien-he`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.7
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.8
    },
    {
      url: `${baseUrl}/privacy`,
      lastModified: now,
      changeFrequency: 'yearly',
      priority: 0.4
    },
    {
      url: `${baseUrl}/terms`,
      lastModified: now,
      changeFrequency: 'yearly',
      priority: 0.4
    },
    {
      url: `${baseUrl}/cookies`,
      lastModified: now,
      changeFrequency: 'yearly',
      priority: 0.4
    }
  ];

  // Các trang chi tiết sản phẩm động từ Database
  try {
    const products = getDBProducts();
    const productRoutes: MetadataRoute.Sitemap = products
      .filter((p) => !p.status || p.status === 'active')
      .map((p) => ({
        url: `${baseUrl}/product/${p.slug || p.id}`,
        lastModified: p.updatedAt ? new Date(p.updatedAt) : now,
        changeFrequency: 'weekly',
        priority: 0.7
      }));

    const blogRoutes: MetadataRoute.Sitemap = BLOG_POSTS.map((post) => ({
      url: `${baseUrl}/blog/${post.slug}`,
      lastModified: new Date(post.publishedAt),
      changeFrequency: 'monthly',
      priority: 0.7
    }));

    return [...staticRoutes, ...productRoutes, ...blogRoutes];
  } catch {
    return staticRoutes;
  }
}
