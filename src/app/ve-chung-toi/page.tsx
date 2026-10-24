import React from 'react';
import { Metadata } from 'next';
import Link from 'next/link';
import { ChevronRight, Sparkles, Crown, Award, ArrowRight } from 'lucide-react';
import { SafeImage } from '@/components/ui/SafeImage';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://tada-fashion.vn';

export const metadata: Metadata = {
  title: 'Về Chúng Tôi — Câu Chuyện Thương Hiệu | TADA! Fashion Atelier',
  description:
    'Tìm hiểu về hành trình, triết lý may đo đương đại và nghệ thuật định hình phong cách tại TADA! Fashion Atelier. Nơi chất liệu thượng hạng giao thoa cùng kỹ nghệ thủ công.',
  alternates: {
    canonical: `${siteUrl}/ve-chung-toi`,
  },
  openGraph: {
    title: 'Về Chúng Tôi — TADA! Fashion Atelier',
    description: 'Nghệ thuật thời trang đương đại, may đo tinh xảo và câu chuyện đằng sau thương hiệu TADA! Atelier.',
    url: `${siteUrl}/ve-chung-toi`,
    images: [{ url: `${siteUrl}/images/og-default.jpg`, width: 1200, height: 630, alt: 'Về TADA! Atelier' }],
  },
};

export default function AboutUsPage() {
  return (
    <div className="bg-[#FAF8F3] min-h-screen py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-12">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-xs text-[#747069]">
          <Link href="/" className="hover:text-[#171613]">Trang chủ</Link>
          <ChevronRight className="w-3 h-3 text-[#747069]" />
          <span className="text-[#171613] font-medium">Về chúng tôi</span>
        </nav>

        {/* Editorial Header */}
        <header className="text-center max-w-2xl mx-auto space-y-4">
          <span className="text-[10px] font-bold tracking-[0.3em] text-[#8A7158] uppercase block">
            ATELIER HERITAGE &bull; EST. 2026
          </span>
          <h1 className="font-editorial text-4xl sm:text-5xl font-medium text-[#171613] leading-tight">
            Nơi Nghệ Thuật May Đo Chạm Đến Phong Cách Cá Nhân
          </h1>
          <p className="text-xs sm:text-sm text-[#747069] leading-relaxed">
            &ldquo;More than fashion &mdash; It&apos;s your story.&rdquo; Tại TADA!, mỗi đường kim mũi chỉ là một tác phẩm kiến trúc thu nhỏ được tạo tác để tôn vinh bản sắc riêng biệt của người mặc.
          </p>
        </header>

        {/* Hero Image */}
        <div className="relative h-72 sm:h-96 rounded-2xl overflow-hidden border border-[#E8E4DC] shadow-sm">
          <SafeImage
            src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1600&auto=format&fit=crop&q=80"
            alt="Không gian sáng tạo TADA! Fashion Atelier"
            fill
            priority
            className="object-cover"
            sizes="(max-width: 1024px) 100vw, 1100px"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex items-end p-6 sm:p-10">
            <p className="text-white text-xs sm:text-sm font-light max-w-md">
              Không gian Atelier &mdash; Nơi những thước vải lụa tơ tằm, dạ cashmere thượng hạng thành hình.
            </p>
          </div>
        </div>

        {/* 3 Trụ Cột Triết Lý */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 sm:p-8 rounded-2xl border border-[#E8E4DC] space-y-3 shadow-xs">
            <div className="w-10 h-10 rounded-xl bg-[#FAF8F3] border border-[#E8E4DC] flex items-center justify-center text-[#8A7158]">
              <Award className="w-5 h-5" />
            </div>
            <h2 className="font-editorial text-xl font-bold text-[#171613]">Kỹ Nghệ May Đo Tinh Xảo</h2>
            <p className="text-xs text-[#747069] leading-relaxed">
              Kế thừa chuẩn mực may đo Bespoke truyền thống kết hợp cùng phom dáng đương đại. Mọi đường ráp ly, ve áo và gấu trang phục đều được kiểm định khắt khe bởi các nghệ nhân lành nghề.
            </p>
          </div>

          <div className="bg-white p-6 sm:p-8 rounded-2xl border border-[#E8E4DC] space-y-3 shadow-xs">
            <div className="w-10 h-10 rounded-xl bg-[#FAF8F3] border border-[#E8E4DC] flex items-center justify-center text-[#8A7158]">
              <Crown className="w-5 h-5" />
            </div>
            <h2 className="font-editorial text-xl font-bold text-[#171613]">Chất Liệu Tuyển Chọn</h2>
            <p className="text-xs text-[#747069] leading-relaxed">
              TADA! cam kết nguồn gốc minh bạch: Lụa tơ tằm Bảo Lộc thượng hạng, len lông cừu Merino, Cashmere Mông Cổ và Cotton hữu cơ thoáng khí, thân thiện với làn da và bền vững theo thời gian.
            </p>
          </div>

          <div className="bg-white p-6 sm:p-8 rounded-2xl border border-[#E8E4DC] space-y-3 shadow-xs">
            <div className="w-10 h-10 rounded-xl bg-[#FAF8F3] border border-[#E8E4DC] flex items-center justify-center text-[#8A7158]">
              <Sparkles className="w-5 h-5" />
            </div>
            <h2 className="font-editorial text-xl font-bold text-[#171613]">Dịch Vụ Fashion Concierge</h2>
            <p className="text-xs text-[#747069] leading-relaxed">
              Không chỉ bán trang phục may sẵn, chúng tôi cung cấp dịch vụ tìm kiếm và order thời trang quốc tế từ Paris, Seoul, Tokyo cùng dịch vụ tư vấn may đo trang phục cá nhân hóa 1:1.
            </p>
          </div>
        </section>

        {/* Khối Cam Kết */}
        <section className="bg-white rounded-2xl border border-[#E8E4DC] p-8 sm:p-12 space-y-6 shadow-sm">
          <div className="max-w-3xl space-y-4">
            <span className="text-xs font-bold text-[#8A7158] uppercase tracking-wider block">
              CAM KẾT CỦA ATELIER
            </span>
            <h2 className="font-editorial text-2xl sm:text-3xl font-medium text-[#171613]">
              Minh Bạch, Bền Vững &amp; Đồng Hành Dài Lâu
            </h2>
            <p className="text-xs sm:text-sm text-[#747069] leading-relaxed">
              Chúng tôi tin rằng thời trang thực thụ không phải là sự tiêu dùng nhanh chóng, mà là sự đầu tư có ý thức cho phong cách cá nhân. TADA! từ chối các sản phẩm không rõ xuất xứ và kiên định với mô hình sản xuất có trách nhiệm, giảm thiểu tồn kho thừa thãi và bảo tồn giá trị thủ công Việt Nam.
            </p>
          </div>

          <div className="pt-4 flex items-center gap-4 flex-wrap border-t border-[#F0ECE1]">
            <Link
              href="/shop"
              className="px-6 py-3 bg-[#171613] hover:bg-[#8A7158] text-white text-xs font-bold uppercase tracking-wider rounded-xl transition-colors shadow-sm flex items-center gap-2"
            >
              <span>Khám phá bộ sưu tập</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
            <Link
              href="/concierge"
              className="px-6 py-3 bg-[#FAF8F3] hover:bg-[#E8D7BD] text-[#171613] border border-[#E8E4DC] text-xs font-bold uppercase tracking-wider rounded-xl transition-colors"
            >
              Dịch vụ Fashion Concierge
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}
