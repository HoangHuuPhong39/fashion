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

  const allProducts = getDBProducts();
  const relatedProducts = allProducts
    .filter(
      (p) => p.id !== product.id && (p.category === product.category || p.brand === product.brand)
    )
    .slice(0, 4);

  return <ProductDetailClient key={product.id} product={product} relatedProducts={relatedProducts} />;
}
