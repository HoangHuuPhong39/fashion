import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { CATEGORIES } from '@/data/mockData';

export const CategoryGrid: React.FC = () => {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="text-center max-w-xl mx-auto mb-10">
        <span className="text-[11px] font-semibold text-[#8A7158] uppercase tracking-[0.08em] block mb-2">
          DANH MỤC TUYỂN CHỌN
        </span>
        <h2 className="font-editorial text-2xl sm:text-3xl lg:text-4xl font-normal text-[#171613] leading-tight">
          Khám Phá Phong Cách Của Bạn
        </h2>
        <div className="w-12 h-0.5 bg-[#C7A66A] mx-auto mt-3" />
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4">
        {CATEGORIES.map((cat) => (
          <Link
            key={cat.id}
            href={cat.slug === 'local-brands' ? '/local-brands' : `/shop?category=${cat.slug}`}
            className="group relative flex flex-col items-center bg-[#F4F1EA] rounded-lg overflow-hidden border border-[#E8E4DC] hover:border-[#C7A66A]/70 transition-all duration-300 hover:shadow-md"
          >
            {/* Image container */}
            <div className="relative aspect-square w-full overflow-hidden bg-[#E8E4DC]">
              <Image
                src={cat.image || '/images/categories/nu.jpg'}
                alt={cat.name}
                fill
                className="object-cover transition-transform duration-500 ease-out group-hover:scale-108"
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 16vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#171613]/60 via-transparent to-transparent opacity-40 group-hover:opacity-60 transition-opacity" />
            </div>

            {/* Label below */}
            <div className="p-3 text-center w-full bg-[#FAF8F3]">
              <h3 className="text-xs sm:text-sm font-medium text-[#171613] group-hover:text-[#8A7158] transition-colors truncate">
                {cat.name}
              </h3>
              <span className="text-[10px] text-[#747069] font-normal block mt-0.5">
                {cat.count} thiết kế
              </span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
};
