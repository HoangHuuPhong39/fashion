'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Shirt,
  Truck,
  RotateCcw,
  Headphones,
  ChevronLeft,
  ChevronRight,
  ArrowRight
} from 'lucide-react';
import { SafeImage } from '@/components/ui/SafeImage';

export const HeroShowcase: React.FC = () => {
  const [slideIndex, setSlideIndex] = useState(0);

  const slides = [
    {
      script: 'New Collection',
      title: 'THU ĐÔNG 2025',
      subtitle: 'Thanh lịch trong từng khoảnh khắc',
      sub2: 'Phong cách mới - Cảm hứng mới',
      slogan: "More than fashion / It's your story",
      image: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1600&auto=format&fit=crop&q=85',
      link: '/shop?collection=thu-dong'
    },
    {
      script: 'Exclusive Designers',
      title: 'VIETNAM LOCAL BRANDS',
      subtitle: 'Tôn vinh nghệ thuật may đo Á Đông',
      sub2: 'Chất liệu lụa cát & linen tự nhiên',
      slogan: 'Timeless Beauty & Elegance',
      image: 'https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=1600&auto=format&fit=crop&q=85',
      link: '/local-brands'
    },
    {
      script: 'Boutique & Sportswear',
      title: 'HAUTE & RETRO TRACKSUITS',
      subtitle: 'Burberry Check, Lacoste Knit & Retro Beckenbauer',
      sub2: 'Order Quốc Tế chính hãng từ Paris, London & Milan',
      slogan: 'Curated Luxury For Gentlemen',
      image: '/images/products/burberry-vintage-check-cardigan-camel.jpg',
      link: '/shop?category=do-bo'
    }
  ];

  const current = slides[slideIndex];

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 pb-8">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-stretch">
        {/* Banner Lớn Bên Trái (Cột 9) - Chuẩn 100% bố cục ảnh mẫu */}
        <div className="lg:col-span-9 relative h-[360px] sm:h-[420px] md:h-[460px] rounded-2xl overflow-hidden bg-[#171613] shadow-sm select-none">
          <SafeImage
            src={current.image}
            alt={current.title}
            fill
            priority
            className="object-cover object-center filter brightness-[0.88]"
            sizes="(max-width: 1024px) 100vw, 75vw"
          />

          {/* Gradient phủ nhẹ */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/65 via-black/35 to-transparent" />

          {/* Nội dung bên trái */}
          <div className="absolute inset-y-0 left-0 p-8 sm:p-12 flex flex-col justify-center max-w-lg z-10 text-white">
            <span className="font-serif italic text-2xl sm:text-3xl text-[#E8D7BD] font-light block mb-1">
              {current.script}
            </span>

            <h1 className="font-editorial text-3xl sm:text-4xl md:text-5xl font-medium tracking-tight text-white mb-2">
              {current.title}
            </h1>

            <p className="text-xs sm:text-sm text-[#FAF8F3]/90 font-light leading-relaxed">
              {current.subtitle}
            </p>
            <p className="text-xs sm:text-sm text-[#FAF8F3]/90 font-light leading-relaxed mb-6">
              {current.sub2}
            </p>

            <div>
              <Link
                href={current.link}
                className="inline-flex items-center gap-2 px-6 py-2.5 bg-white hover:bg-[#FAF8F3] text-[#171613] text-xs font-semibold rounded-full shadow-md transition-all duration-200 transform hover:scale-102"
              >
                <span>Mua ngay</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          {/* Slogan góc phải (như trong ảnh mẫu) */}
          <div className="absolute right-8 top-1/2 -translate-y-1/2 hidden md:block text-right text-white/90 z-10 pointer-events-none">
            <p className="font-serif italic text-lg sm:text-xl font-light">More than fashion</p>
            <p className="font-serif italic text-lg sm:text-xl font-light text-[#E8D7BD]">It&apos;s your story</p>
          </div>

          {/* Điều khiển phân trang góc dưới phải (Dots + 2 Nút Mũi Tên Tròn) */}
          <div className="absolute bottom-5 right-6 z-20 flex items-center space-x-3">
            <div className="flex space-x-1.5 mr-2">
              {slides.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setSlideIndex(i)}
                  className={`w-2 h-2 rounded-full transition-all ${
                    i === slideIndex ? 'bg-white w-4' : 'bg-white/50'
                  }`}
                  aria-label={`Slide ${i + 1}`}
                />
              ))}
            </div>

            <button
              onClick={() => setSlideIndex((prev) => (prev === 0 ? slides.length - 1 : prev - 1))}
              className="w-7 h-7 rounded-full bg-white/80 hover:bg-white text-[#171613] flex items-center justify-center transition-colors shadow-sm"
              aria-label="Previous"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            <button
              onClick={() => setSlideIndex((prev) => (prev + 1) % slides.length)}
              className="w-7 h-7 rounded-full bg-white/80 hover:bg-white text-[#171613] flex items-center justify-center transition-colors shadow-sm"
              aria-label="Next"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Cột Phải: 4 Dịch Vụ + Thẻ Đen VIP (Cột 3) - Chuẩn 100% ảnh mẫu */}
        <div className="lg:col-span-3 flex flex-col justify-between gap-3">
          {/* 4 Khối Dịch Vụ Nền Trắng Bo Góc */}
          <div className="bg-white rounded-xl border border-[#E8E4DC] p-4 shadow-sm divide-y divide-[#F0ECE1]">
            <div className="flex items-center gap-3 py-2.5 first:pt-1">
              <div className="w-8 h-8 rounded-full bg-[#FAF8F3] flex items-center justify-center shrink-0">
                <Shirt className="w-4 h-4 text-[#8A7158]" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-[#171613]">Hàng chính hãng</h4>
                <p className="text-[10px] text-[#747069]">Cam kết 100% chính hãng</p>
              </div>
            </div>

            <div className="flex items-center gap-3 py-2.5">
              <div className="w-8 h-8 rounded-full bg-[#FAF8F3] flex items-center justify-center shrink-0">
                <Truck className="w-4 h-4 text-[#8A7158]" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-[#171613]">Giao nhanh toàn quốc</h4>
                <p className="text-[10px] text-[#747069]">Nhận hàng từ 2 - 5 ngày</p>
              </div>
            </div>

            <div className="flex items-center gap-3 py-2.5">
              <div className="w-8 h-8 rounded-full bg-[#FAF8F3] flex items-center justify-center shrink-0">
                <RotateCcw className="w-4 h-4 text-[#8A7158]" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-[#171613]">Đổi trả dễ dàng</h4>
                <p className="text-[10px] text-[#747069]">Trong 7 ngày</p>
              </div>
            </div>

            <div className="flex items-center gap-3 py-2.5 last:pb-1">
              <div className="w-8 h-8 rounded-full bg-[#FAF8F3] flex items-center justify-center shrink-0">
                <Headphones className="w-4 h-4 text-[#8A7158]" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-[#171613]">Tư vấn 24/7</h4>
                <p className="text-[10px] text-[#747069]">Hỗ trợ nhanh chóng</p>
              </div>
            </div>
          </div>

          {/* Thẻ Đen VIP Có Ảnh Người Mẫu (Chuẩn 100% ảnh mẫu) */}
          <div className="relative bg-[#171613] text-white rounded-xl p-4 overflow-hidden shadow-sm flex items-center justify-between">
            <div className="z-10 max-w-[140px]">
              <h4 className="text-xs font-bold text-white leading-tight">Thành viên VIP</h4>
              <p className="text-[10px] text-[#E8D7BD] mt-0.5">Giảm thêm đến 15%</p>
              <Link
                href="/account"
                className="mt-2.5 inline-flex items-center gap-1 px-3 py-1 bg-white text-[#171613] hover:bg-[#FAF8F3] text-[10px] font-bold rounded-full transition-colors"
              >
                <span>Tham gia ngay</span>
                <ArrowRight className="w-2.5 h-2.5" />
              </Link>
            </div>

            {/* Ảnh chân dung cô gái ở góc phải */}
            <div className="relative w-20 h-24 rounded-lg overflow-hidden shrink-0 border border-white/10 shadow">
              <SafeImage
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80"
                alt="VIP Member"
                fill
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
