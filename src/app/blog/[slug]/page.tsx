import React from 'react';
import Link from 'next/link';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { ChevronRight, Clock, ArrowLeft, Sparkles, ShoppingBag, ArrowRight } from 'lucide-react';
import { getBlogPostBySlug, BLOG_POSTS } from '@/data/blog-posts';
import { getDBProducts } from '@/lib/db';
import { SafeImage } from '@/components/ui/SafeImage';
import { ProductCard } from '@/components/product/ProductCard';

interface PageProps {
  params: Promise<{ slug: string }>;
}

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://tada-fashion.vn';

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = getBlogPostBySlug(slug);

  if (!post) {
    return {
      title: 'Không tìm thấy bài viết | TADA! Atelier',
      description: 'Bài viết không tồn tại hoặc đã được chuyển hướng.'
    };
  }

  const url = `${siteUrl}/blog/${post.slug}`;
  const ogImage = post.coverImage.startsWith('http') ? post.coverImage : `${siteUrl}${post.coverImage}`;

  return {
    title: `${post.title} | TADA! Atelier Magazine`,
    description: post.excerpt,
    alternates: {
      canonical: url
    },
    openGraph: {
      title: post.title,
      description: post.excerpt,
      url,
      type: 'article',
      publishedTime: post.publishedAt,
      authors: [post.author.name],
      images: [{ url: ogImage, width: 1200, height: 630, alt: post.title }]
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.excerpt,
      images: [ogImage]
    }
  };
}

export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = await params;
  const post = getBlogPostBySlug(slug);

  if (!post) {
    notFound();
  }

  const allProducts = getDBProducts();
  const shopTheLookProducts = allProducts.filter(
    (p) => post.shopTheLookProductIds.includes(p.id) && (!p.status || p.status === 'active')
  );

  const relatedPosts = BLOG_POSTS.filter((p) => p.slug !== post.slug).slice(0, 2);

  // Article JSON-LD Schema
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    description: post.excerpt,
    image: [post.coverImage],
    datePublished: post.publishedAt,
    dateModified: post.publishedAt,
    author: {
      '@type': 'Person',
      name: post.author.name,
      jobTitle: post.author.role
    },
    publisher: {
      '@type': 'Organization',
      name: 'TADA! Fashion Atelier',
      logo: {
        '@type': 'ImageObject',
        url: `${siteUrl}/images/logo.png`
      }
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `${siteUrl}/blog/${post.slug}`
    }
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <article className="bg-[#FAF8F3] min-h-screen py-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto space-y-10">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-xs text-[#747069]">
            <Link href="/" className="hover:text-[#171613]">
              Trang chủ
            </Link>
            <ChevronRight className="w-3 h-3 text-[#A8A29E]" />
            <Link href="/blog" className="hover:text-[#171613]">
              Tạp Chí
            </Link>
            <ChevronRight className="w-3 h-3 text-[#A8A29E]" />
            <span className="text-[#171613] font-medium truncate max-w-xs">{post.title}</span>
          </nav>

          {/* Header Bài Viết */}
          <header className="space-y-4">
            <div className="flex flex-wrap gap-2">
              {post.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-3 py-1 bg-[#8A7158]/10 text-[#8A7158] text-[10px] font-bold uppercase tracking-wider rounded-full"
                >
                  {tag}
                </span>
              ))}
            </div>

            <h1 className="font-editorial text-3xl sm:text-4xl lg:text-5xl text-[#171613] font-medium leading-tight">
              {post.title}
            </h1>

            <p className="text-sm sm:text-base text-[#747069] leading-relaxed font-light">
              {post.subtitle}
            </p>

            {/* Author info & Metadata */}
            <div className="pt-4 border-t border-[#E8E4DC] flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="relative w-10 h-10 rounded-full overflow-hidden bg-[#E8E4DC]">
                  <SafeImage src={post.author.avatar} alt={post.author.name} fill className="object-cover" sizes="40px" />
                </div>
                <div>
                  <span className="text-xs font-bold text-[#171613] block">
                    {post.author.name}
                  </span>
                  <span className="text-[11px] text-[#747069] block">
                    {post.author.role}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-4 text-xs text-[#747069]">
                <span className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#8A7158]"></span>
                  <span>{new Date(post.publishedAt).toLocaleDateString('vi-VN')}</span>
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-[#8A7158]" />
                  <span>{post.readingTimeMinutes} phút đọc</span>
                </span>
              </div>
            </div>
          </header>

          {/* Ảnh Cover chính */}
          <div className="relative aspect-16/9 rounded-3xl overflow-hidden shadow-sm border border-[#E8E4DC]">
            <SafeImage
              src={post.coverImage}
              alt={post.title}
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 896px"
              priority
            />
          </div>

          {/* Mục Lục (Table of Contents) */}
          <aside className="p-6 bg-white rounded-2xl border border-[#E8E4DC] shadow-xs space-y-3">
            <span className="text-xs font-bold text-[#171613] uppercase tracking-wider block">
              Mục lục nội dung chính:
            </span>
            <ul className="space-y-1.5 text-xs">
              {post.tableOfContents.map((toc) => (
                <li key={toc.id}>
                  <a href={`#${toc.id}`} className="text-[#747069] hover:text-[#171613] hover:underline transition-colors">
                    {toc.text}
                  </a>
                </li>
              ))}
            </ul>
          </aside>

          {/* Thân bài viết */}
          <div className="bg-white rounded-3xl border border-[#E8E4DC] p-8 sm:p-12 shadow-sm space-y-8 text-sm text-[#171613] leading-relaxed">
            <p className="text-base font-medium text-[#747069] italic border-l-4 border-[#8A7158] pl-4">
              &quot;{post.excerpt}&quot;
            </p>

            {post.content.map((sec, idx) => (
              <section key={idx} className="space-y-3">
                {sec.heading && (
                  <h2 className="font-editorial text-2xl font-semibold text-[#171613] pt-4">
                    {sec.heading}
                  </h2>
                )}
                <p className="text-[#747069] leading-relaxed text-sm">
                  {sec.paragraph}
                </p>
              </section>
            ))}
          </div>

          {/* SHOP THE LOOK (Gắn thẻ sản phẩm trong bài viết) */}
          {shopTheLookProducts.length > 0 && (
            <section id="shop-the-look" className="bg-white rounded-3xl border border-[#E8E4DC] p-8 shadow-sm space-y-6">
              <div className="flex items-center justify-between flex-wrap gap-2 pb-4 border-b border-[#E8E4DC]">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-[#FAF8F3] border border-[#E8E4DC] flex items-center justify-center text-[#8A7158]">
                    <ShoppingBag className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-editorial text-xl font-semibold text-[#171613]">
                      Shop The Look
                    </h3>
                    <p className="text-[11px] text-[#747069]">
                      Các thiết kế được gợi ý trực tiếp trong bài viết từ TADA! Atelier.
                    </p>
                  </div>
                </div>
                <Link
                  href="/shop"
                  className="text-xs font-bold text-[#8A7158] hover:underline inline-flex items-center gap-1"
                >
                  <span>Xem toàn bộ cửa hàng</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {shopTheLookProducts.map((p) => (
                  <ProductCard key={p.id} product={p} />
                ))}
              </div>
            </section>
          )}

          {/* Bài viết liên quan */}
          {relatedPosts.length > 0 && (
            <div className="space-y-4 pt-6">
              <h3 className="font-editorial text-xl font-bold text-[#171613]">
                Bài Viết Cùng Chủ Đề
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {relatedPosts.map((rPost) => (
                  <Link
                    key={rPost.slug}
                    href={`/blog/${rPost.slug}`}
                    className="p-5 rounded-2xl bg-white border border-[#E8E4DC] shadow-xs hover:border-[#171613] transition-all space-y-2 block group"
                  >
                    <span className="text-[10px] font-bold text-[#8A7158] uppercase">
                      {rPost.tags[0]}
                    </span>
                    <h4 className="font-editorial text-base font-semibold text-[#171613] group-hover:text-[#8A7158] transition-colors line-clamp-2">
                      {rPost.title}
                    </h4>
                    <p className="text-xs text-[#747069] line-clamp-2">
                      {rPost.excerpt}
                    </p>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Quay lại */}
          <div className="pt-4 text-center">
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 px-6 py-3 bg-[#FAF8F3] hover:bg-[#E8E4DC] text-[#171613] text-xs font-semibold rounded-xl transition-colors border border-[#E8E4DC]"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Quay lại danh sách bài viết</span>
            </Link>
          </div>
        </div>
      </article>
    </>
  );
}
