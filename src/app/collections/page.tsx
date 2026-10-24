import React from 'react';
import { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, Sparkles, ChevronRight } from 'lucide-react';
import { getDBProducts } from '@/lib/db';
import { ProductCard } from '@/components/product/ProductCard';
import { SafeImage } from '@/components/ui/SafeImage';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://tada-fashion.vn';

export const metadata: Metadata = {
  title: 'Bộ Sưu Tập Thời Trang Đương Đại & Lookbooks 2026 | TADA! Fashion Atelier',
  description:
    'Khám phá các bộ sưu tập thời trang Thu Đông 2026, phong cách Quiet Luxury, Local Designer Việt Nam và Heritage Sportswear tại TADA! Fashion Atelier.',
  alternates: {
    canonical: `${siteUrl}/collections`,
  },
  openGraph: {
    title: 'Bộ Sưu Tập Thời Trang Đương Đại & Lookbooks 2026 | TADA!',
    description:
      'Mỗi bộ sưu tập tại TADA! là một câu chuyện thị giác được định hình bởi chất liệu thượng hạng và kỹ thuật may đo tinh tế.',
    url: `${siteUrl}/collections`,
    siteName: 'TADA! Fashion Atelier',
    images: [
      {
        url: `${siteUrl}/images/og-default.jpg`,
        width: 1200,
        height: 630,
        alt: 'Bộ sưu tập TADA! Fashion Atelier',
      },
    ],
    locale: 'vi_VN',
    type: 'website',
  },
};

export default function CollectionsPage() {
  const allProducts = getDBProducts().filter((p) => !p.status || p.status === 'active');

  const autumnProducts = allProducts.filter((p) =>
    p.subCategory === 'ao-khoac' ||
    p.subCategory === 'ao-len' ||
    p.category === 'ao-khoac' ||
    p.category === 'ao-len' ||
    p.name.toLowerCase().includes('khoác') ||
    p.name.toLowerCase().includes('len') ||
    p.name.toLowerCase().includes('blazer')
  ).slice(0, 4);

  const quietLuxuryProducts = allProducts.filter((p) =>
    ['lemaire', 'gia studios', 'subtle studios', 'cos', 'chanel'].includes(p.brand.toLowerCase())
  ).slice(0, 4);

  const localDesignerProducts = allProducts.filter(
    (p) => p.origin === 'vietnam_local_brand'
  ).slice(0, 4);

  const retroSportswearProducts = allProducts.filter(
    (p) => p.category === 'do-bo' || p.brand === 'Adidas Originals' || p.brand === 'Chrome Hearts'
  ).slice(0, 4);

  return (
    <div className="bg-[#FAF8F3] min-h-screen py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-12">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-xs text-[#747069]">
          <Link href="/" className="hover:text-[#171613]">
            Trang chủ
          </Link>
          <ChevronRight className="w-3 h-3 text-[#747069]" />
          <span className="text-[#171613] font-medium">Bộ sưu tập & Lookbook</span>
        </nav>

        {/* Editorial Header */}
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <span className="text-[10px] font-bold tracking-[0.25em] text-[#8A7158] uppercase block">
            EDITORIAL LOOKBOOKS • 2026
          </span>
          <h1 className="font-editorial text-4xl sm:text-5xl font-normal text-[#171613]">
            Bộ Sưu Tập Thời Trang Đương Đại
          </h1>
          <p className="text-xs sm:text-sm text-[#747069] leading-relaxed">
            Mỗi bộ sưu tập tại TADA! là một câu chuyện thị giác được định hình bởi chất liệu thượng hạng, phom dáng kiến trúc và kỹ thuật cắt may điêu luyện.
          </p>
        </div>

        {/* 1. Bộ Sưu Tập Thu Đông 2026 */}
        <section className="bg-white rounded-2xl border border-[#E8E4DC] overflow-hidden p-6 sm:p-10 shadow-sm space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-7 relative h-80 sm:h-96 rounded-xl overflow-hidden shadow-md">
              <SafeImage
                src="https://images.unsplash.com/photo-1539533018447-63fcce2678e3?w=1600&auto=format&fit=crop&q=85"
                alt="Bộ sưu tập Thu Đông 2026"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 60vw"
              />
              <div className="absolute top-4 left-4 bg-[#171613]/85 text-[#E8D7BD] px-3 py-1 rounded text-[10px] font-bold tracking-widest uppercase">
                CAMPAIGN THU ĐÔNG 2026
              </div>
            </div>

            <div className="lg:col-span-5 space-y-4">
              <span className="text-xs font-bold text-[#8A7158] uppercase tracking-wider block">
                Seasonal Capsule
              </span>
              <h2 className="font-editorial text-3xl font-medium text-[#171613]">
                Bộ Sưu Tập Thu Đông 2026
              </h2>
              <p className="text-xs sm:text-sm text-[#747069] leading-relaxed">
                Tập hợp những thiết kế áo khoác măng tô Cashmere thượng hạng, áo len dệt kim Mohair bồng bềnh và blazer phom hộp sắc sảo. Tông màu be, nâu mocha, than chì mang lại cảm giác ấm áp và quý phái.
              </p>
              <div className="pt-2">
                <Link
                  href="/shop?collection=thu-dong"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-[#171613] hover:bg-[#333] text-white text-xs font-bold uppercase tracking-wider rounded-lg transition-colors shadow-sm"
                >
                  <span>Xem trọn bộ sưu tập Thu Đông ({autumnProducts.length}+ mẫu)</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#8A7158] mb-4">
              Thiết kế nổi bật trong chiến dịch:
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {autumnProducts.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        </section>

        {/* 2. Quiet Luxury Essentials */}
        <section className="bg-white rounded-2xl border border-[#E8E4DC] overflow-hidden p-6 sm:p-10 shadow-sm space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-5 space-y-4 order-2 lg:order-1">
              <span className="text-xs font-bold text-[#8A7158] uppercase tracking-wider block">
                Parisian Quiet Luxury
              </span>
              <h2 className="font-editorial text-3xl font-medium text-[#171613]">
                Quiet Luxury Essentials
              </h2>
              <p className="text-xs sm:text-sm text-[#747069] leading-relaxed">
                Vẻ đẹp tĩnh tại không cần logo phô trương. Đỉnh cao của sự sang trọng toát ra từ chất vải lụa tơ tằm Bảo Lộc, da bê Nappa nguyên tấm và len Merino của Lemaire, Gia Studios, Subtle Studios và COS.
              </p>
              <div className="pt-2">
                <Link
                  href="/shop?collection=quiet-luxury"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-[#171613] hover:bg-[#333] text-white text-xs font-bold uppercase tracking-wider rounded-lg transition-colors shadow-sm"
                >
                  <span>Khám phá Quiet Luxury Edit</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>

            <div className="lg:col-span-7 relative h-80 sm:h-96 rounded-xl overflow-hidden shadow-md order-1 lg:order-2">
              <SafeImage
                src="https://images.unsplash.com/photo-1445205170230-053b83016050?w=1600&auto=format&fit=crop&q=85"
                alt="Quiet Luxury Essentials"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 60vw"
              />
              <div className="absolute top-4 right-4 bg-[#171613]/85 text-[#C7A66A] px-3 py-1 rounded text-[10px] font-bold tracking-widest uppercase">
                TIMELESS LUXURY
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#8A7158] mb-4">
              Các thiết kế biểu tượng:
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {quietLuxuryProducts.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        </section>

        {/* 3. Vietnam Designer Lookbook */}
        <section className="bg-white rounded-2xl border border-[#E8E4DC] overflow-hidden p-6 sm:p-10 shadow-sm space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-7 relative h-80 sm:h-96 rounded-xl overflow-hidden shadow-md">
              <SafeImage
                src="https://images.unsplash.com/photo-1529139574466-a303027c1d8b?w=1600&auto=format&fit=crop&q=85"
                alt="Vietnam Designer Lookbook"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 60vw"
              />
              <div className="absolute top-4 left-4 bg-[#171613]/85 text-[#C7A66A] px-3 py-1 rounded text-[10px] font-bold tracking-widest uppercase flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-[#C7A66A]" />
                LOCAL BRAND LOOKBOOK
              </div>
            </div>

            <div className="lg:col-span-5 space-y-4">
              <span className="text-xs font-bold text-[#8A7158] uppercase tracking-wider block">
                Contemporary Vietnam
              </span>
              <h2 className="font-editorial text-3xl font-medium text-[#171613]">
                Vietnam Designer Lookbook
              </h2>
              <p className="text-xs sm:text-sm text-[#747069] leading-relaxed">
                Tôn vinh tài hoa của thế hệ nhà thiết kế trẻ đương đại Việt Nam. Sự kết hợp giữa đường cắt phá cách Avant-Garde từ Duc Studio, nét duyên dáng tối giản của Gia Studios và phom dáng công sở sắc nét của Nosbyn.
              </p>
              <div className="pt-2">
                <Link
                  href="/shop?collection=local-design"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-[#171613] hover:bg-[#333] text-white text-xs font-bold uppercase tracking-wider rounded-lg transition-colors shadow-sm"
                >
                  <span>Xem Lookbook Nhà Thiết Kế Việt</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#8A7158] mb-4">
              Trang phục thiết kế Việt được yêu thích:
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {localDesignerProducts.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        </section>

        {/* 4. Retro Terrace Football & Boutique Streetwear */}
        <section className="bg-white rounded-2xl border border-[#E8E4DC] overflow-hidden p-6 sm:p-10 shadow-sm space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-7 relative h-80 sm:h-96 rounded-xl overflow-hidden shadow-md">
              <SafeImage
                src="/images/products/adidas-varsity-bomber-tracksuit.jpg"
                alt="Retro Terrace Football & Tracksuits"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 60vw"
              />
              <div className="absolute top-4 left-4 bg-[#171613]/85 text-[#E8D7BD] px-3 py-1 rounded text-[10px] font-bold tracking-widest uppercase flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-[#C7A66A]" />
                RETRO TERRACE & BOUTIQUE
              </div>
            </div>

            <div className="lg:col-span-5 space-y-4">
              <span className="text-xs font-bold text-[#8A7158] uppercase tracking-wider block">
                Heritage Sportswear
              </span>
              <h2 className="font-editorial text-3xl font-medium text-[#171613]">
                Bộ Sưu Tập Đồ Bộ & Tracksuits Retro
              </h2>
              <p className="text-xs sm:text-sm text-[#747069] leading-relaxed">
                Đỉnh cao phong cách Terrace Retro Football từ các dòng áo Beckenbauer huyền thoại tuyển Đức, Tây Ban Nha, Argentina cùng các thiết kế thể thao dệt nỉ cao cấp từ Adidas Originals, Nike Strike và Chrome Hearts.
              </p>
              <div className="pt-2">
                <Link
                  href="/shop?category=do-bo"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-[#171613] hover:bg-[#333] text-white text-xs font-bold uppercase tracking-wider rounded-lg transition-colors shadow-sm"
                >
                  <span>Khám phá trọn bộ Đồ bộ & Tracksuits ({retroSportswearProducts.length}+ mẫu)</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#8A7158] mb-4">
              Tracksuits & Streetwear được săn đón:
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {retroSportswearProducts.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
