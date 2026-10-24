import React from 'react';
import Link from 'next/link';
import { SafeImage } from '@/components/ui/SafeImage';

const QUICK_CATEGORIES = [
  { name: 'Áo sơ mi', link: '/shop?sub=ao-so-mi-nu', image: '/images/products/lacoste-long-sleeve-polo-white.jpg' },
  { name: 'Áo thun & Polo', link: '/shop?sub=ao-thun-nu', image: '/images/products/lacoste-cable-knit-polo-brown.jpg' },
  { name: 'Quần jeans', link: '/shop?sub=quan-jeans-nu', image: '/images/products/dolce-gabbana-tailored-trousers-cream.jpg' },
  { name: 'Quần short', link: '/shop?sub=quan-short-nu', image: 'https://images.unsplash.com/photo-1591195853828-11db59a44f6b?w=200&auto=format&fit=crop&q=80' },
  { name: 'Váy & Đầm', link: '/shop?sub=dam-vay-lien', image: 'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=200&auto=format&fit=crop&q=80' },
  { name: 'Đồ bộ mặc nhà', link: '/shop?category=do-bo', image: '/images/products/adidas-varsity-bomber-tracksuit.jpg' },
  { name: 'Áo khoác', link: '/shop?sub=ao-khoac-nu', image: '/images/products/lacoste-hooded-knit-cardigan-navy.jpg' },
  { name: 'Phụ kiện', link: '/shop?category=phu-kien', image: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=200&auto=format&fit=crop&q=80' },
  { name: 'Thời trang Nữ', link: '/shop?category=nu', image: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=200&auto=format&fit=crop&q=80' },
  { name: 'Thời trang Nam', link: '/shop?category=nam', image: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=200&auto=format&fit=crop&q=80' }
];

export const CategoryCircles: React.FC = () => {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
      <div className="bg-white rounded-2xl border border-[#E8E4DC] p-4 sm:p-5 shadow-sm overflow-x-auto no-scrollbar">
        <div className="flex items-center justify-between min-w-[780px] gap-4 sm:gap-6">
          {QUICK_CATEGORIES.map((cat, index) => (
            <Link
              key={index}
              href={cat.link}
              className="flex flex-col items-center group shrink-0"
            >
              {/* Hình tròn avatar danh mục */}
              <div className="relative w-14 h-14 sm:w-16 sm:h-16 rounded-full overflow-hidden border-2 border-[#D5CEC2] group-hover:border-[#C78238] p-0.5 bg-[#FAF8F3] transition-all duration-300 transform group-hover:scale-105 shadow-sm">
                <div className="relative w-full h-full rounded-full overflow-hidden">
                  <SafeImage
                    src={cat.image}
                    alt={cat.name}
                    fill
                    className="object-cover"
                    sizes="64px"
                  />
                </div>
              </div>

              {/* Tên danh mục bên dưới */}
              <span className="text-[11px] sm:text-xs font-medium text-[#171613] group-hover:text-[#C78238] mt-2 transition-colors whitespace-nowrap">
                {cat.name}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};
