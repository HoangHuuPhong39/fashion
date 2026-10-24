import React from 'react';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getProductById, getDBProducts } from '@/lib/db';
import { ProductDetailClient } from '@/components/product/ProductDetailClient';

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const product = getProductById(id);

  if (!product) {
    return {
      title: 'Không tìm thấy sản phẩm | TADA! Fashion Atelier',
      description: 'Sản phẩm không tồn tại hoặc đã ngừng kinh doanh tại TADA! Fashion Atelier.'
    };
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://tada-fashion.vn';
  const url = `${siteUrl}/product/${product.slug || product.id}`;
  const firstImage = product.images?.[0] || '/images/placeholder-fashion.svg';
  const ogImageUrl = firstImage.startsWith('http') ? firstImage : `${siteUrl}${firstImage}`;

  return {
    title: `${product.name} | TADA! Fashion Atelier`,
    description: product.description?.slice(0, 160) || `${product.name} - ${product.brand} tại TADA! Fashion Atelier`,
    alternates: {
      canonical: url,
    },
    openGraph: {
      title: `${product.name} | ${product.brand} - TADA!`,
      description: product.description?.slice(0, 160),
      url,
      siteName: 'TADA! Fashion Atelier',
      images: [
        {
          url: ogImageUrl,
          width: 800,
          height: 1000,
          alt: product.name,
        }
      ],
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: `${product.name} | TADA! Fashion Atelier`,
      description: product.description?.slice(0, 160),
      images: [ogImageUrl],
    }
  };
}

export default async function ProductDetailPage({ params }: PageProps) {
  const { id } = await params;
  const product = getProductById(id);

  if (!product) {
    notFound();
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://tada-fashion.vn';
  const allProducts = getDBProducts();
  const relatedProducts = allProducts
    .filter(
      (p) => p.id !== product.id && (p.category === product.category || p.brand === product.brand)
    )
    .slice(0, 4);

  // Sản phẩm phối cùng set đồ (Complete the Look)
  const matchingProducts = allProducts
    .filter((p) => p.id !== product.id && p.category !== product.category && (!p.status || p.status === 'active'))
    .slice(0, 3);

  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          {
            '@type': 'ListItem',
            position: 1,
            name: 'Trang chủ',
            item: siteUrl,
          },
          {
            '@type': 'ListItem',
            position: 2,
            name: product.category === 'nu' ? 'Thời Trang Nữ' : product.category === 'nam' ? 'Thời Trang Nam' : product.category,
            item: `${siteUrl}/shop?category=${product.category}`,
          },
          {
            '@type': 'ListItem',
            position: 3,
            name: product.name,
            item: `${siteUrl}/product/${product.slug || product.id}`,
          },
        ],
      },
      {
        '@type': 'Product',
        name: product.name,
        description: product.description,
        image: product.images?.map((img) => (img.startsWith('http') ? img : `${siteUrl}${img}`)) || [],
        sku: product.sku || product.id,
        brand: {
          '@type': 'Brand',
          name: product.brand,
        },
        offers: {
          '@type': 'Offer',
          url: `${siteUrl}/product/${product.slug || product.id}`,
          priceCurrency: 'VND',
          price: product.price,
          priceValidUntil: '2027-12-31',
          itemCondition: 'https://schema.org/NewCondition',
          availability:
            product.stockCount > 0 ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
          seller: {
            '@type': 'Organization',
            name: 'TADA! Fashion Atelier',
          },
        },
        ...(product.reviewCount && product.reviewCount > 0
          ? {
              aggregateRating: {
                '@type': 'AggregateRating',
                ratingValue: product.rating,
                reviewCount: product.reviewCount,
              },
            }
          : {}),
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ProductDetailClient
        key={product.id}
        product={product}
        relatedProducts={relatedProducts}
        matchingProducts={matchingProducts}
      />
    </>
  );
}
