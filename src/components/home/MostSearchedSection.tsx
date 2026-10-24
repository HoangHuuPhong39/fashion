'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { Search, TrendingUp, ArrowRight } from 'lucide-react';
import { useProducts } from '@/context/ProductContext';
import { ProductCard } from '@/components/product/ProductCard';
import { QuickViewModal } from '@/components/product/QuickViewModal';
import { Product } from '@/types';

export const MostSearchedSection: React.FC = () => {
  const { products, trendingSearches, isLoading } = useProducts();
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);

  // Sắp xếp theo sản phẩm được xem & tìm kiếm nhiều nhất
  const mostSearchedProducts = useMemo(() => {
    const list = [...products].filter((p) => (!p.status || p.status === 'active') && p.inStock);
    return list
      .sort((a, b) => (b.viewsCount || 0) - (a.viewsCount || 0) || (b.salesCount || 0) - (a.salesCount || 0))
      .slice(0, 4);
  }, [products]);

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div className="bg-gradient-to-r from-[#FAF6F0] via-white to-[#F7F3EB] rounded-2xl border border-[#E8E4DC] p-5 sm:p-6 shadow-sm">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
          <div>
            <h2 className="flex items-center gap-2 text-lg sm:text-xl font-bold text-[#171613]">
              <TrendingUp className="w-5 h-5 text-[#C78238]" />
              <span>Được tìm kiếm nhiều nhất</span>
            </h2>
            <p className="text-[11px] text-[#747069] mt-0.5">
              Xu hướng thời trang được khách hàng quan tâm và tra cứu nhiều nhất tuần qua
            </p>
          </div>

          {/* Trending keywords pills */}
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-[11px] font-semibold text-[#8A7158] flex items-center gap-1">
              <Search className="w-3 h-3" />
              <span>Từ khóa hot:</span>
            </span>
            {trendingSearches.slice(0, 4).map((kw, idx) => (
              <Link
                key={idx}
                href={`/shop?q=${encodeURIComponent(kw.query)}`}
                className="text-[11px] px-2.5 py-1 bg-white hover:bg-[#171613] hover:text-white text-[#524E48] rounded-full border border-[#D5CEC2] transition-colors"
              >
                {kw.query}
              </Link>
            ))}
          </div>
        </div>

        {/* Lưới sản phẩm */}
        {isLoading ? (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="aspect-[3/4] bg-white rounded-xl border border-[#E8E4DC] animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
            {mostSearchedProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onQuickView={(p) => setQuickViewProduct(p)}
              />
            ))}
          </div>
        )}
      </div>

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
