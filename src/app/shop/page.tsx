import React, { Suspense } from 'react';
import { Metadata } from 'next';
import { queryProducts, getDBCategories } from '@/lib/db';
import { ShopClient } from '@/components/shop/ShopClient';

interface PageProps {
  searchParams: Promise<{
    category?: string;
    sub?: string;
    brand?: string;
    origin?: string;
    sale?: string;
    collection?: string;
    q?: string;
    tab?: string;
    page?: string;
    limit?: string;
  }>;
}

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://tada-fashion.vn';

export async function generateMetadata({ searchParams }: PageProps): Promise<Metadata> {
  const params = await searchParams;
  const categories = getDBCategories();

  let title = 'Cửa Hàng Thời Trang Đương Đại | TADA! Fashion Atelier';
  let description =
    'Khám phá toàn bộ danh mục sản phẩm thời trang thiết kế, đầm lụa, áo sơ mi, blazer và trang phục may đo cao cấp tại TADA! Fashion Atelier.';

  if (params.category) {
    const cat = categories.find((c) => c.slug === params.category || c.id === params.category);
    if (cat) {
      title = `Thời Trang ${cat.name} Cao Cấp | TADA! Fashion Atelier`;
      description = `Khám phá các thiết kế thời trang ${cat.name.toLowerCase()} may đo tinh tế, phom dáng kiến trúc đương đại tại TADA! Atelier.`;
    }
  } else if (params.brand) {
    title = `Thương Hiệu ${params.brand} | TADA! Fashion Atelier`;
    description = `Bộ sưu tập chính hãng từ nhà mốt ${params.brand} tuyển chọn bởi TADA! Fashion Atelier.`;
  } else if (params.collection) {
    title = `Bộ Sưu Tập ${params.collection} | TADA! Fashion Atelier`;
    description = `Khám phá lookbook và bộ sưu tập độc quyền ${params.collection} tại TADA! Atelier.`;
  } else if (params.sale === 'true') {
    title = 'Ưu Đãi Đặc Biệt & Flash Sale | TADA! Fashion Atelier';
    description = 'Ưu đãi giới hạn cho các thiết kế cao cấp và lookbook đương đại tại TADA! Fashion Atelier.';
  }

  const canonicalUrl = `${siteUrl}/shop`;

  return {
    title,
    description,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      siteName: 'TADA! Fashion Atelier',
      images: [
        {
          url: `${siteUrl}/images/og-default.jpg`,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
      locale: 'vi_VN',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [`${siteUrl}/images/og-default.jpg`],
    },
  };
}

export default async function ShopPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const categories = getDBCategories();
  const queryResult = queryProducts({
    category: params.category,
    subCategory: params.sub,
    brand: params.brand,
    origin: params.origin as any,
    query: params.q,
    page: params.page ? parseInt(params.page, 10) : 1,
    limit: 24,
  });

  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#FAF8F3] flex items-center justify-center p-20 text-center text-sm font-editorial text-[#747069]">
          Đang tải không gian mua sắm TADA! Atelier...
        </div>
      }
    >
      <ShopClient initialProducts={queryResult.products} initialCategories={categories} />
    </Suspense>
  );
}
