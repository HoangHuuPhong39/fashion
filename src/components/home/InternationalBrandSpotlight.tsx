'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight, Globe, Sparkles } from 'lucide-react';
import { BRANDS } from '@/data/mockData';
import { SafeImage } from '@/components/ui/SafeImage';

export const InternationalBrandSpotlight: React.FC = () => {
  // Feature the top luxury & heritage international brands
  const featuredSlugs = ['burberry', 'lacoste', 'chrome-hearts', 'polo-ralph-lauren', 'adidas-originals', 'louis-vuitton', 'dior', 'gucci'];
  const intlBrands = BRANDS.filter((b) => !b.isLocalBrand && featuredSlugs.includes(b.slug));

  return (
    <section className="bg-white py-16 border-b border-[#E8E4DC]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#8A7158]/10 text-[#8A7158] text-[10px] font-semibold tracking-[0.08em] uppercase rounded mb-2">
              <Globe className="w-3.5 h-3.5 text-[#C7A66A]" />
              Haute Couture & Heritage Brands
            </div>
            <h2 className="font-editorial text-3xl sm:text-4xl text-[#171613] font-medium">
              Nhà Mốt Quốc Tế & Boutique Tuyển Chọn
            </h2>
            <p className="text-xs sm:text-sm text-[#747069] mt-2 max-w-xl">
              Từ các xưởng may đo lâu đời tại Paris, London, Florence đến phong cách Terrace Retro thập niên 90. Trải nghiệm dịch vụ mua sắm và order quốc tế trọn gói kèm bảo hiểm.
            </p>
          </div>

          <Link
            href="/shop?origin=international_order"
            className="text-xs font-semibold text-[#8A7158] hover:text-[#171613] uppercase tracking-[0.05em] inline-flex items-center gap-1.5 shrink-0"
          >
            <span>Tất cả sản phẩm Order Quốc Tế</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Brand Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
          {intlBrands.map((brand) => (
            <Link
              key={brand.id}
              href={`/shop?brand=${brand.slug}`}
              className="group bg-[#FAF8F3] rounded-xl overflow-hidden border border-[#E8E4DC] hover:border-[#C7A66A] transition-all duration-300 flex flex-col justify-between hover:shadow-md"
            >
              <div className="relative h-44 w-full overflow-hidden bg-[#E8E4DC]">
                <SafeImage
                  src={brand.bannerImage}
                  alt={brand.name}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                  sizes="(max-width: 768px) 50vw, 25vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#171613]/75 via-[#171613]/25 to-transparent" />
                <div className="absolute bottom-3 left-3 right-3 text-white">
                  <span className="text-[9px] uppercase font-bold tracking-widest text-[#E8D7BD] block">
                    {brand.country} • Est. {brand.foundedYear}
                  </span>
                  <h3 className="font-editorial text-lg font-medium leading-tight text-white group-hover:text-[#E8D7BD] transition-colors">
                    {brand.name}
                  </h3>
                </div>
              </div>

              <div className="p-3.5 bg-white flex items-center justify-between">
                <span className="text-[11px] text-[#524E48] font-medium line-clamp-1">
                  {brand.aesthetic}
                </span>
                <span className="text-xs text-[#C78238] group-hover:translate-x-1 transition-transform">
                  →
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};
