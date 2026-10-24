'use client';

import React from 'react';
import Link from 'next/link';
import { Sparkles, ChevronRight, ArrowRight } from 'lucide-react';
import { BRANDS, PRODUCTS } from '@/data/mockData';
import { ProductCard } from '@/components/product/ProductCard';
import { SafeImage } from '@/components/ui/SafeImage';

export default function LocalBrandsPage() {
  const localBrands = BRANDS.filter((b) => b.isLocalBrand);
  const localProducts = PRODUCTS.filter((p) => p.origin === 'vietnam_local_brand');

  return (
    <div className="bg-[#FAF8F3] min-h-screen">
      {/* Editorial Banner */}
      <div className="relative bg-[#171613] text-[#FAF8F3] py-20 px-4 sm:px-6 lg:px-8 border-b border-[#2A2925] overflow-hidden">
        <div className="absolute inset-0 opacity-20 pointer-events-none">
          <SafeImage
            src="https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=1600&auto=format&fit=crop&q=80"
            alt="Vietnam Fashion Background"
            fill
            className="object-cover"
          />
        </div>

        <div className="relative max-w-7xl mx-auto">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-xs text-[#E8D7BD]/80 mb-6">
            <Link href="/" className="hover:text-[#FAF8F3]">
              Trang chủ
            </Link>
            <ChevronRight className="w-3 h-3 text-[#747069]" />
            <span className="text-[#C7A66A] font-medium">Vietnam Local Brands</span>
          </nav>

          <div className="max-w-2xl space-y-4">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#C7A66A]/20 text-[#C7A66A] text-[10px] font-bold tracking-[0.25em] uppercase rounded">
              <Sparkles className="w-3.5 h-3.5" />
              SÂN CHƠI THỜI TRANG ĐƯƠNG ĐẠI VIỆT NAM
            </div>

            <h1 className="font-editorial text-4xl sm:text-5xl lg:text-6xl text-[#FAF8F3] font-light leading-tight">
              Bản Sắc Thiết Kế & Nghệ Thuật May Đo Việt
            </h1>

            <p className="text-xs sm:text-sm text-[#E8D7BD]/80 leading-relaxed font-light">
              TADA! vinh danh sự giao thoa giữa nghệ thuật thủ công truyền thống và tư duy thị giác đương đại. Mỗi sản phẩm là thành quả tâm huyết từ những nhà thiết kế độc lập hàng đầu Việt Nam.
            </p>
          </div>
        </div>
      </div>

      {/* Brand Stories Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center max-w-xl mx-auto mb-12">
          <span className="text-[11px] font-bold text-[#8A7158] uppercase tracking-[0.25em] block mb-2">
            DESIGNER DIRECTORY
          </span>
          <h2 className="font-editorial text-3xl font-medium text-[#171613]">
            Các Nhà Mốt Tiêu Biểu
          </h2>
          <div className="w-12 h-0.5 bg-[#C7A66A] mx-auto mt-3" />
        </div>

        <div className="space-y-12">
          {localBrands.map((brand, index) => {
            const brandProds = localProducts.filter(
              (p) => p.brand.toLowerCase() === brand.name.toLowerCase()
            );

            return (
              <div
                key={brand.id}
                className="bg-[#F4F1EA] rounded-2xl overflow-hidden border border-[#E8E4DC] p-6 sm:p-10 shadow-sm"
              >
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center mb-8 pb-8 border-b border-[#E8E4DC]">
                  {/* Image */}
                  <div className="lg:col-span-5 relative h-72 rounded-xl overflow-hidden shadow-md">
                    <SafeImage
                      src={brand.bannerImage}
                      alt={brand.name}
                      fill
                      className="object-cover"
                      sizes="(max-width: 1024px) 100vw, 40vw"
                    />
                    <div className="absolute top-4 left-4 bg-[#171613]/80 backdrop-blur-sm px-3 py-1 rounded text-[10px] text-[#C7A66A] font-bold tracking-widest uppercase">
                      Est. {brand.foundedYear}
                    </div>
                  </div>

                  {/* Story */}
                  <div className="lg:col-span-7 space-y-4">
                    <div className="flex items-center gap-3">
                      <h3 className="font-editorial text-3xl font-medium text-[#171613]">
                        {brand.name}
                      </h3>
                      <span className="text-xs bg-[#E8D7BD]/60 px-2.5 py-0.5 rounded text-[#8A7158] font-bold uppercase tracking-wider">
                        {brand.country}
                      </span>
                    </div>

                    <span className="text-xs font-bold text-[#8A7158] uppercase tracking-wider block">
                      Phong cách: {brand.aesthetic}
                    </span>

                    <p className="text-xs sm:text-sm text-[#747069] leading-relaxed">
                      {brand.story}
                    </p>

                    <div className="pt-2">
                      <Link
                        href={`/shop?brand=${brand.slug}`}
                        className="inline-flex items-center gap-2 px-6 py-2.5 bg-[#171613] hover:bg-[#8A7158] text-[#FAF8F3] text-xs font-bold uppercase tracking-wider rounded transition-colors"
                      >
                        <span>Xem toàn bộ BST của {brand.name}</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </div>
                </div>

                {/* Brand Products Preview */}
                {brandProds.length > 0 && (
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-[#8A7158] mb-4">
                      Thiết kế nổi bật từ {brand.name}:
                    </h4>
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                      {brandProds.map((prod) => (
                        <ProductCard key={prod.id} product={prod} />
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
