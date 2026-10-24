import React from 'react';
import { Metadata } from 'next';
import { HeroShowcase } from '@/components/home/HeroShowcase';
import { CategoryCircles } from '@/components/home/CategoryCircles';
import { PromoCards } from '@/components/home/PromoCards';
import { BestSellersSection } from '@/components/home/BestSellersSection';
import { MostSearchedSection } from '@/components/home/MostSearchedSection';
import { FeaturedSection } from '@/components/home/FeaturedSection';
import { NewArrivalsSection } from '@/components/home/NewArrivalsSection';
import { CategoryTrendsSection } from '@/components/home/CategoryTrendsSection';
import { BrandLifestyleBanner } from '@/components/home/BrandLifestyleBanner';
import { InternationalBrandSpotlight } from '@/components/home/InternationalBrandSpotlight';
import { LocalBrandSpotlight } from '@/components/home/LocalBrandSpotlight';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://tada-fashion.vn';

export const metadata: Metadata = {
  title: 'TADA! Fashion Atelier | Thiết Kế Thời Trang Đương Đại & May Đo Tinh Tế',
  description:
    'Khám phá các bộ sưu tập thời trang đương đại, local brand Việt Nam và phong cách thời trang may đo cao cấp tại TADA! Fashion Atelier. Miễn phí vận chuyển toàn quốc từ 499.000đ.',
  alternates: {
    canonical: siteUrl,
  },
  openGraph: {
    title: 'TADA! Fashion Atelier | Thiết Kế Thời Trang Đương Đại',
    description:
      'Khám phá các thiết kế thời trang may đo tinh tế, bộ sưu tập Thu Đông 2026 và phong cách Quiet Luxury tại TADA! Fashion Atelier.',
    url: siteUrl,
    siteName: 'TADA! Fashion Atelier',
    images: [
      {
        url: `${siteUrl}/images/og-default.jpg`,
        width: 1200,
        height: 630,
        alt: 'TADA! Fashion Atelier',
      },
    ],
    locale: 'vi_VN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'TADA! Fashion Atelier | Thời Trang Đương Đại & May Đo',
    description:
      'Khám phá các thiết kế thời trang may đo tinh tế và bộ sưu tập đương đại tại TADA! Fashion Atelier.',
    images: [`${siteUrl}/images/og-default.jpg`],
  },
};

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen bg-[#FAF8F3] w-full min-w-0 overflow-x-hidden">
      {/* 1. Banner Chiến Dịch / Bộ Sưu Tập Nổi Bật (Gọn gàng, sang trọng) */}
      <HeroShowcase />

      {/* 2. Danh Mục Mua Sắm Nhanh Hình Tròn Trực Quan (Áo sơ mi, Áo thun, Quần jeans, Váy/đầm, Đồ bộ, Áo khoác, Phụ kiện) */}
      <CategoryCircles />

      {/* 3. Thẻ Khuyến Mãi & Bộ Sưu Tập Nổi Bật */}
      <PromoCards />

      {/* 4. Khu vực “Bán Chạy Nhất”: Sắp xếp theo số lượng bán thực tế từ đơn hàng */}
      <BestSellersSection />

      {/* 5. Khu vực “Được Tìm Kiếm Nhiều Nhất”: Dựa trên từ khóa và truy vấn thực tế */}
      <MostSearchedSection />

      {/* 6. Khu vực “Sản Phẩm Nổi Bật”: Do Admin tuyển chọn */}
      <FeaturedSection />

      {/* 7. Khu vực “Hàng Mới Về”: Theo thời gian cập nhật kho thực tế */}
      <NewArrivalsSection />

      {/* 8. Khu vực “Xu Hướng Theo Danh Mục”: Tab tương tác Áo sơ mi, Áo thun & Polo, Váy đầm, Quần âu/jeans, Đồ bộ */}
      <CategoryTrendsSection />

      {/* 9. Banner Phong Cách Thương Hiệu */}
      <BrandLifestyleBanner />

      {/* 10. Spotlight Thương Hiệu Quốc Tế Order */}
      <InternationalBrandSpotlight />

      {/* 11. Spotlight Local Brands Việt Nam */}
      <LocalBrandSpotlight />
    </div>
  );
}
