'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { Sparkles, ArrowRight } from 'lucide-react';
import { useProducts } from '@/context/ProductContext';
import { ProductCard } from '@/components/product/ProductCard';
import { QuickViewModal } from '@/components/product/QuickViewModal';
import { Product } from '@/types';

export const FeaturedSection: React.FC = () => {
  const { products, isLoading } = useProducts();
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);

  // Sản phẩm nổi bật do Admin lựa chọn
  const featuredProducts = useMemo(() => {
    const list = [...products].filter(
      (p) => (!p.status || p.status === 'active') && (p.featured || (p.tags && p.tags.includes('featured')))
    );
    if (list.length >= 4) return list.slice(0, 8);
    // Nếu chưa đánh dấu đủ 4 sản phẩm, bổ sung thêm các sản phẩm cao cấp
    const fallback = products.filter((p) => !p.status || p.status === 'active').slice(0, 8);
    return fallback;
  }, [products]);

  return (
    <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 min-w-0">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="flex items-center gap-2 text-lg sm:text-xl font-bold text-[#171613]">
            <Sparkles className="w-5 h-5 text-[#C78238]" />
            <span>Sản phẩm nổi bật tuyển chọn</span>
          </h2>
          <p className="text-[11px] text-[#747069] mt-0.5">
            Bộ sưu tập trang phục cao cấp được đội ngũ TADA! Curators trực tiếp đánh giá và đề xuất
          </p>
        </div>

        <Link
          href="/shop?tab=featured"
          className="text-xs text-[#747069] hover:text-[#171613] font-medium flex items-center gap-1 transition-colors shrink-0"
        >
          <span>Xem tất cả</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="aspect-[3/4] bg-white rounded-xl border border-[#E8E4DC] animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4">
          {featuredProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onQuickView={(p) => setQuickViewProduct(p)}
            />
          ))}
        </div>
      )}

      {quickViewProduct && (
        <QuickViewModal
          product={quickViewProduct}
          isOpen={!!quickViewProduct}
          onClose={() => setQuickViewProduct(null)}
        />
      )}
    </section>
  );
};
