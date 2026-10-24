'use client';

import React from 'react';
import Link from 'next/link';
import { Heart, ChevronRight, ArrowRight } from 'lucide-react';
import { useWishlist } from '@/context/WishlistContext';
import { ProductCard } from '@/components/product/ProductCard';
import { useMounted } from '@/hooks/useMounted';

export default function WishlistPage() {
  const { wishlist, totalWishlist } = useWishlist();
  const mounted = useMounted();

  return (
    <div className="bg-[#FAF8F3] min-h-screen py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-xs text-[#747069] mb-6">
          <Link href="/" className="hover:text-[#171613]">
            Trang chủ
          </Link>
          <ChevronRight className="w-3 h-3 text-[#747069]" />
          <span className="text-[#171613] font-medium">Danh sách yêu thích</span>
        </nav>

        <div className="flex items-end justify-between pb-6 border-b border-[#E8E4DC] mb-8">
          <div>
            <span className="text-[10px] uppercase font-bold text-[#8A7158] tracking-[0.25em] block mb-1">
              BỘ SƯU TẬP CỦA BẠN
            </span>
            <h1 className="font-editorial text-3xl sm:text-4xl font-normal text-[#171613]">
              Danh Sách Yêu Thích
            </h1>
          </div>
          <span className="text-xs text-[#747069] font-mono">
            {mounted ? totalWishlist : 0} sản phẩm đã lưu
          </span>
        </div>

        {!mounted ? (
          <div className="bg-[#F4F1EA] rounded-xl p-12 text-center max-w-md mx-auto border border-[#E8E4DC]">
            <p className="text-xs text-[#747069]">Đang đồng bộ danh sách yêu thích...</p>
          </div>
        ) : wishlist.length === 0 ? (
          <div className="bg-[#F4F1EA] rounded-xl p-12 text-center max-w-md mx-auto border border-[#E8E4DC]">
            <div className="w-14 h-14 rounded-full bg-[#FAF8F3] flex items-center justify-center mx-auto mb-3">
              <Heart className="w-6 h-6 text-[#8A7158]" />
            </div>
            <h2 className="font-editorial text-xl text-[#171613] font-medium">
              Chưa có sản phẩm yêu thích
            </h2>
            <p className="text-xs text-[#747069] mt-2">
              Nhấn vào biểu tượng trái tim trên các thiết kế bạn yêu thích để lưu lại và theo dõi ưu đãi.
            </p>
            <Link
              href="/shop"
              className="mt-6 inline-flex items-center gap-2 px-6 py-2.5 bg-[#171613] hover:bg-[#8A7158] text-[#FAF8F3] text-xs font-bold uppercase tracking-wider rounded transition-colors"
            >
              <span>Khám phá bộ sưu tập</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {wishlist.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
