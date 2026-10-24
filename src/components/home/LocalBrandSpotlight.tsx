import React from 'react';
import Link from 'next/link';
import { ArrowRight, Sparkles } from 'lucide-react';
import { BRANDS } from '@/data/mockData';
import { SafeImage } from '@/components/ui/SafeImage';

export const LocalBrandSpotlight: React.FC = () => {
  const localBrands = BRANDS.filter((b) => b.isLocalBrand);

  return (
    <section className="w-full bg-[#FAF8F3] py-20 border-y border-[#E8E4DC] min-w-0">
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 min-w-0">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#8A7158]/10 text-[#8A7158] text-[10px] font-semibold tracking-[0.08em] uppercase rounded mb-2">
              <Sparkles className="w-3.5 h-3.5 text-[#C7A66A]" />
              Bản Sắc Thời Trang Việt
            </div>
            <h2 className="font-editorial text-3xl sm:text-4xl text-[#171613] font-medium">
              Vietnam Local Designer Spotlight
            </h2>
            <p className="text-xs sm:text-sm text-[#747069] mt-2 max-w-xl">
              TADA! tự hào là không gian tuyển chọn và đồng hành cùng các nhà mốt đương đại Việt Nam. Nơi nghệ thuật thủ công và phom dáng Á Đông được thăng hoa.
            </p>
          </div>

          <Link
            href="/local-brands"
            className="text-xs font-semibold text-[#8A7158] hover:text-[#171613] uppercase tracking-[0.05em] inline-flex items-center gap-1.5 shrink-0"
          >
            <span>Xem tất cả câu chuyện thương hiệu</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Brand cards grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {localBrands.map((brand) => (
            <div
              key={brand.id}
              className="bg-[#F4F1EA] rounded-lg overflow-hidden border border-[#E8E4DC] hover:border-[#C7A66A] transition-all duration-300 group flex flex-col justify-between"
            >
              <div>
                {/* Brand Banner Image */}
                <div className="relative h-48 w-full overflow-hidden bg-[#E8E4DC]">
                  <SafeImage
                    src={brand.bannerImage}
                    alt={brand.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                    sizes="(max-width: 768px) 100vw, 25vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#171613]/70 to-transparent" />
                  <div className="absolute bottom-3 left-3 right-3 text-white">
                    <span className="text-[10px] uppercase font-bold tracking-widest text-[#C7A66A] block">
                      Thành lập {brand.foundedYear} • {brand.country}
                    </span>
                    <h3 className="font-editorial text-xl font-medium">
                      {brand.name}
                    </h3>
                  </div>
                </div>

                {/* Brand Story Content */}
                <div className="p-5">
                  <span className="text-[11px] font-semibold text-[#8A7158] tracking-wider uppercase block mb-1">
                    {brand.aesthetic}
                  </span>
                  <p className="text-xs text-[#747069] line-clamp-3 leading-relaxed font-light">
                    {brand.story}
                  </p>
                </div>
              </div>

              {/* Action Button */}
              <div className="p-5 pt-0">
                <Link
                  href={`/shop?brand=${brand.slug}`}
                  className="w-full py-2.5 bg-white group-hover:bg-[#171613] text-[#171613] group-hover:text-[#FAF8F3] border border-[#E8E4DC] group-hover:border-[#171613] text-xs uppercase tracking-wider font-semibold rounded text-center block transition-colors duration-300"
                >
                  Khám phá BST {brand.name}
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
