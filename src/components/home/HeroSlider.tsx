'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ChevronLeft, ChevronRight, ArrowRight, Sparkles } from 'lucide-react';

interface Slide {
  id: string;
  badge: string;
  title: string;
  subtitle: string;
  description: string;
  ctaText: string;
  ctaLink: string;
  secondaryCtaText?: string;
  secondaryCtaLink?: string;
  image: string;
  textColor: 'light' | 'dark';
}

const SLIDES: Slide[] = [
  {
    id: 'slide-1',
    badge: 'NEW COLLECTION 2026',
    title: 'THU ĐÔNG EDITORIAL',
    subtitle: 'Nghệ Thuật Của Sự Tối Giản & Chất Liệu Cashmere Thượng Hạng',
    description: 'Khám phá bộ sưu tập áo khoác dạ dáng dài, cardigan mohair và lụa tơ tằm mang tinh thần Quiet Luxury chuẩn mực.',
    ctaText: 'Khám phá bộ sưu tập',
    ctaLink: '/shop?collection=thu-dong',
    secondaryCtaText: 'Xem Lookbook',
    secondaryCtaLink: '/shop?category=ao-khoac',
    image: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1920&auto=format&fit=crop&q=85',
    textColor: 'light'
  },
  {
    id: 'slide-2',
    badge: 'VIETNAM DESIGNER SPOTLIGHT',
    title: 'LOCAL BRANDS VIỆT NAM',
    subtitle: 'Vẻ Đẹp Đương Đại Vươn Tầm Quốc Tế',
    description: 'Tuyển tập thiết kế độc quyền từ Gia Studios, Subtle Studios và Duc Studio. Tôn sùng nét đẹp thủ công và đường rã rập điêu luyện.',
    ctaText: 'Khám phá Nhà Thiết Kế',
    ctaLink: '/local-brands',
    secondaryCtaText: 'Xem sản phẩm có sẵn',
    secondaryCtaLink: '/shop?origin=vietnam_local_brand',
    image: 'https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=1920&auto=format&fit=crop&q=85',
    textColor: 'light'
  },
  {
    id: 'slide-3',
    badge: 'FASHION CONCIERGE',
    title: 'INTERNATIONAL ORDER',
    subtitle: 'Boutique Paris, Seoul & Tokyo Trực Tiếp Về Tay Bạn',
    description: 'Dịch vụ đặt hàng thời trang quốc tế minh bạch hóa đơn chứng từ, hỗ trợ kiểm định bill box và vận chuyển hàng không chuyên dụng.',
    ctaText: 'Trải nghiệm Dịch Vụ Order',
    ctaLink: '/shop?origin=international_order',
    secondaryCtaText: 'Chính sách cọc 50%',
    secondaryCtaLink: '/order-info',
    image: 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=1920&auto=format&fit=crop&q=85',
    textColor: 'light'
  }
];

export const HeroSlider: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % SLIDES.length);
  }, []);

  const prevSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev - 1 + SLIDES.length) % SLIDES.length);
  }, []);

  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(nextSlide, 6500);
    return () => clearInterval(interval);
  }, [nextSlide, isPaused]);

  const slide = SLIDES[currentSlide];

  return (
    <div
      className="relative w-full h-[520px] sm:h-[620px] lg:h-[700px] overflow-hidden bg-[#171613] select-none"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Background Images with Crossfade */}
      {SLIDES.map((s, index) => (
        <div
          key={s.id}
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
            index === currentSlide ? 'opacity-100 scale-100' : 'opacity-0 scale-105 pointer-events-none'
          }`}
          style={{ transitionProperty: 'opacity, transform' }}
        >
          <Image
            src={s.image}
            alt={s.title}
            fill
            priority={index === 0}
            className="object-cover object-center filter brightness-[0.82]"
            sizes="100vw"
          />
          {/* Subtle gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#171613]/85 via-[#171613]/50 to-transparent" />
        </div>
      ))}

      {/* Content Container */}
      <div className="relative max-w-7xl mx-auto h-full px-6 sm:px-8 lg:px-12 flex items-center z-10">
        <div className="max-w-2xl text-left space-y-4 sm:space-y-6">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#171613]/70 backdrop-blur-md border border-[#C7A66A]/40 text-[#E8D7BD] text-[11px] uppercase tracking-[0.25em] font-semibold rounded-[2px]">
            <Sparkles className="w-3.5 h-3.5 text-[#C7A66A]" />
            <span>{slide.badge}</span>
          </div>

          {/* Title */}
          <h1 className="font-editorial text-4xl sm:text-5xl lg:text-6xl text-[#FAF8F3] font-normal tracking-[0.08em] leading-tight">
            {slide.title}
          </h1>

          {/* Subtitle */}
          <p className="text-sm sm:text-base text-[#E8D7BD] font-medium tracking-wide">
            {slide.subtitle}
          </p>

          {/* Description */}
          <p className="text-xs sm:text-sm text-[#FAF8F3]/80 leading-relaxed font-light max-w-xl">
            {slide.description}
          </p>

          {/* CTAs */}
          <div className="flex flex-wrap items-center gap-3 sm:gap-4 pt-2">
            <Link
              href={slide.ctaLink}
              className="px-6 py-3.5 bg-[#C7A66A] hover:bg-[#E8D7BD] text-[#171613] text-xs font-bold uppercase tracking-[0.16em] rounded transition-all duration-300 flex items-center gap-2 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              <span>{slide.ctaText}</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            {slide.secondaryCtaText && slide.secondaryCtaLink && (
              <Link
                href={slide.secondaryCtaLink}
                className="px-5 py-3.5 bg-[#171613]/60 hover:bg-[#171613]/90 text-[#FAF8F3] border border-[#FAF8F3]/30 hover:border-[#C7A66A] text-xs font-semibold uppercase tracking-[0.16em] rounded backdrop-blur-sm transition-all duration-300"
              >
                {slide.secondaryCtaText}
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Navigation Controls: Arrows */}
      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-[#171613]/40 hover:bg-[#171613]/80 text-[#FAF8F3] border border-white/10 hover:border-[#C7A66A] backdrop-blur-sm transition-all z-20"
        aria-label="Slide trước"
      >
        <ChevronLeft className="w-5 h-5" />
      </button>

      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-[#171613]/40 hover:bg-[#171613]/80 text-[#FAF8F3] border border-white/10 hover:border-[#C7A66A] backdrop-blur-sm transition-all z-20"
        aria-label="Slide tiếp theo"
      >
        <ChevronRight className="w-5 h-5" />
      </button>

      {/* Slide Indicators: Dots & Current index */}
      <div className="absolute bottom-6 right-8 sm:right-12 z-20 flex items-center space-x-3">
        <span className="text-xs text-[#E8D7BD] tracking-widest font-mono">
          0{currentSlide + 1} / 0{SLIDES.length}
        </span>
        <div className="flex space-x-1.5">
          {SLIDES.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentSlide(idx)}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                idx === currentSlide ? 'w-8 bg-[#C7A66A]' : 'w-2 bg-[#FAF8F3]/40 hover:bg-[#FAF8F3]'
              }`}
              aria-label={`Đi tới slide ${idx + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
