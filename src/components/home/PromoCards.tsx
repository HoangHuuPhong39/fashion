import React from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { SafeImage } from '@/components/ui/SafeImage';

export const PromoCards: React.FC = () => {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: SALE ĐỒ NỮ (Hồng phấn) */}
        <div className="relative rounded-2xl overflow-hidden p-5 flex flex-col justify-between h-48 bg-[#FDECEF] border border-[#F8D2D9] shadow-sm group">
          <div className="z-10 max-w-[150px]">
            <span className="text-[10px] font-semibold tracking-[0.05em] text-[#B83A3A] uppercase block">
              SALE ĐỒ NỮ
            </span>
            <h3 className="font-editorial text-2xl font-semibold text-[#171613] leading-tight mt-1">
              UP TO <span className="text-[#B83A3A]">50%</span>
            </h3>
            <span className="text-[11px] text-[#747069] block mt-1 font-normal">Hot trend - Giá tốt</span>
          </div>

          <div className="z-10 mt-4">
            <Link
              href="/shop?category=nu&sale=true"
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-[#B83A3A] hover:bg-[#9E2F2F] text-white text-[11px] font-semibold rounded-full shadow-sm transition-all"
            >
              <span>Mua ngay</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          <div className="absolute right-0 bottom-0 w-36 h-44 overflow-hidden pointer-events-none">
            <SafeImage
              src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80"
              alt="Sale đồ nữ"
              fill
              className="object-cover object-top group-hover:scale-105 transition-transform duration-300"
            />
          </div>
        </div>

        {/* Card 2: SALE ĐỒ NAM (Be sáng) */}
        <div className="relative rounded-2xl overflow-hidden p-5 flex flex-col justify-between h-48 bg-[#F4EFE6] border border-[#E6DDCD] shadow-sm group">
          <div className="z-10 max-w-[150px]">
            <span className="text-[10px] font-semibold tracking-[0.05em] text-[#8A7158] uppercase block">
              SALE ĐỒ NAM
            </span>
            <h3 className="font-editorial text-2xl font-semibold text-[#171613] leading-tight mt-1">
              UP TO <span className="text-[#8A7158]">45%</span>
            </h3>
            <span className="text-[11px] text-[#747069] block mt-1 font-normal">Phong cách lịch lãm</span>
          </div>

          <div className="z-10 mt-4">
            <Link
              href="/shop?category=nam&sale=true"
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-[#171613] hover:bg-[#333] text-white text-[11px] font-semibold rounded-full shadow-sm transition-all"
            >
              <span>Mua ngay</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          <div className="absolute right-0 bottom-0 w-36 h-44 overflow-hidden pointer-events-none">
            <SafeImage
              src="https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=300&auto=format&fit=crop&q=80"
              alt="Sale đồ nam"
              fill
              className="object-cover object-top group-hover:scale-105 transition-transform duration-300"
            />
          </div>
        </div>

        {/* Card 3: THỜI TRANG TRẺ EM (Xanh mint) */}
        <div className="relative rounded-2xl overflow-hidden p-5 flex flex-col justify-between h-48 bg-[#EBF5F3] border border-[#D2EAE5] shadow-sm group">
          <div className="z-10 max-w-[150px]">
            <span className="text-[10px] font-semibold tracking-[0.05em] text-[#2E7D6E] uppercase block">
              THỜI TRANG TRẺ EM
            </span>
            <h3 className="font-editorial text-2xl font-semibold text-[#171613] leading-tight mt-1">
              UP TO <span className="text-[#2E7D6E]">40%</span>
            </h3>
            <span className="text-[11px] text-[#747069] block mt-1 font-normal">Dễ thương mỗi ngày</span>
          </div>

          <div className="z-10 mt-4">
            <Link
              href="/shop?category=tre-em"
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-[#2E7D6E] hover:bg-[#25665A] text-white text-[11px] font-semibold rounded-full shadow-sm transition-all"
            >
              <span>Mua ngay</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          <div className="absolute right-0 bottom-0 w-36 h-44 overflow-hidden pointer-events-none">
            <SafeImage
              src="https://images.unsplash.com/photo-1514090458221-65bb69cf63e6?w=300&auto=format&fit=crop&q=80"
              alt="Thời trang trẻ em"
              fill
              className="object-cover object-top group-hover:scale-105 transition-transform duration-300"
            />
          </div>
        </div>

        {/* Card 4: PHỤ KIỆN HOT (Đen vàng Luxury) */}
        <div className="relative rounded-2xl overflow-hidden p-5 flex flex-col justify-between h-48 bg-[#171613] text-white border border-[#2A2925] shadow-sm group">
          <div className="z-10 max-w-[150px]">
            <span className="text-[10px] font-semibold tracking-[0.05em] text-[#C7A66A] uppercase block">
              PHỤ KIỆN HOT
            </span>
            <h3 className="font-editorial text-2xl font-semibold text-white leading-tight mt-1">
              UP TO <span className="text-[#C7A66A]">60%</span>
            </h3>
            <span className="text-[11px] text-[#E8D7BD]/85 block mt-1 font-normal">Tôn vinh phong cách của bạn</span>
          </div>

          <div className="z-10 mt-4">
            <Link
              href="/shop?category=phu-kien"
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-[#C7A66A] hover:bg-[#E8D7BD] text-[#171613] text-[11px] font-bold rounded-full shadow-sm transition-all"
            >
              <span>Mua ngay</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          <div className="absolute right-0 bottom-0 w-36 h-44 overflow-hidden pointer-events-none">
            <SafeImage
              src="https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=300&auto=format&fit=crop&q=80"
              alt="Phụ kiện hot"
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
            />
          </div>
        </div>
      </div>
    </section>
  );
};
