'use client';

import React from 'react';
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

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen bg-[#FAF8F3]">
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
