import React from 'react';
import Link from 'next/link';
import { Metadata } from 'next';
import { ChevronRight, Clock, ArrowRight, Sparkles } from 'lucide-react';
import { BLOG_POSTS } from '@/data/blog-posts';
import { SafeImage } from '@/components/ui/SafeImage';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://tada-fashion.vn';

export const metadata: Metadata = {
  title: 'Tạp Chí & Cẩm Nang Phong Cách Thời Trang | TADA! Atelier',
  description:
    'Khám phá nghệ thuật phối đồ Quiet Luxury, kỹ nghệ may đo Bespoke truyền thống và cẩm nang chăm sóc lụa tơ tằm, len cashmere từ các chuyên gia thời trang TADA! Atelier.',
  alternates: {
    canonical: `${siteUrl}/blog`
  },
  openGraph: {
    title: 'Tạp Chí Thời Trang TADA! Atelier — Editorial & Style Guide',
    description: 'Nguồn cảm hứng phối đồ đương đại và cẩm nang phong cách sống thượng lưu.',
    url: `${siteUrl}/blog`
  }
};

export default function BlogIndexPage() {
  return (
    <div className="bg-[#FAF8F3] min-h-screen py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-12">
        {/* Breadcrumb & Header */}
        <div className="space-y-4">
          <nav className="flex items-center gap-2 text-xs text-[#747069]">
            <Link href="/" className="hover:text-[#171613]">
              Trang chủ
            </Link>
            <ChevronRight className="w-3 h-3 text-[#A8A29E]" />
            <span className="text-[#171613] font-medium">Tạp Chí Atelier</span>
          </nav>

          <div className="max-w-2xl space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#8A7158]/10 text-[#8A7158] text-[10px] font-bold tracking-[0.2em] uppercase rounded-full">
              <Sparkles className="w-3 h-3" />
              TADA! EDITORIAL & STYLE GUIDE
            </div>
            <h1 className="font-editorial text-3xl sm:text-4xl lg:text-5xl text-[#171613] font-light">
              Tạp Chí &amp; Cẩm Nang Phong Cách
            </h1>
            <p className="text-xs sm:text-sm text-[#747069] leading-relaxed">
              Những bài viết chuyên sâu về triết lý thời trang đương đại, kỹ nghệ may đo thủ công và bí quyết gìn giữ những bộ cánh đắt giá từ đội ngũ Stylist của TADA! Atelier.
            </p>
          </div>
        </div>

        {/* Danh sách bài viết */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {BLOG_POSTS.map((post) => (
            <article
              key={post.slug}
              className="bg-white rounded-3xl border border-[#E8E4DC] overflow-hidden shadow-xs hover:shadow-md transition-all group flex flex-col"
            >
              <Link href={`/blog/${post.slug}`} className="block relative aspect-16/10 overflow-hidden bg-[#FAF8F3]">
                <SafeImage
                  src={post.coverImage}
                  alt={post.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
                <div className="absolute top-4 left-4 flex flex-wrap gap-1.5">
                  {post.tags.slice(0, 2).map((tag) => (
                    <span
                      key={tag}
                      className="px-2.5 py-1 bg-[#171613]/80 backdrop-blur-xs text-white text-[10px] font-semibold rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </Link>

              <div className="p-6 sm:p-8 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center gap-4 text-[11px] text-[#747069]">
                    <span className="flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#8A7158]"></span>
                      <span>{new Date(post.publishedAt).toLocaleDateString('vi-VN')}</span>
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-[#8A7158]" />
                      <span>{post.readingTimeMinutes} phút đọc</span>
                    </span>
                  </div>

                  <h2 className="font-editorial text-xl sm:text-2xl font-semibold text-[#171613] group-hover:text-[#8A7158] transition-colors leading-snug">
                    <Link href={`/blog/${post.slug}`}>{post.title}</Link>
                  </h2>

                  <p className="text-xs text-[#747069] line-clamp-3 leading-relaxed">
                    {post.excerpt}
                  </p>
                </div>

                <div className="pt-4 border-t border-[#E8E4DC] flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="relative w-7 h-7 rounded-full overflow-hidden bg-[#E8E4DC]">
                      <SafeImage src={post.author.avatar} alt={post.author.name} fill className="object-cover" sizes="28px" />
                    </div>
                    <div>
                      <span className="text-xs font-semibold text-[#171613] block leading-tight">
                        {post.author.name}
                      </span>
                      <span className="text-[10px] text-[#A8A29E] block">
                        {post.author.role}
                      </span>
                    </div>
                  </div>

                  <Link
                    href={`/blog/${post.slug}`}
                    className="inline-flex items-center gap-1 text-xs font-bold text-[#171613] group-hover:text-[#8A7158] transition-colors"
                  >
                    <span>Đọc tiếp</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}
