'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { PRODUCTS } from '@/data/mockData';
import { Product } from '@/types';
import { ProductCard } from '@/components/product/ProductCard';
import { QuickViewModal } from '@/components/product/QuickViewModal';

type TabKey = 'best_sellers' | 'new_arrivals' | 'international_order' | 'local_brands' | 'sale';

const TABS: { key: TabKey; label: string }[] = [
  { key: 'best_sellers', label: 'Bán Chạy Nhất' },
  { key: 'new_arrivals', label: 'Hàng Mới Về' },
  { key: 'international_order', label: 'Hàng Order Quốc Tế' },
  { key: 'local_brands', label: 'Thương Hiệu Việt' },
  { key: 'sale', label: 'Đang Giảm Giá' },
];

export const FeaturedProducts: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabKey>('best_sellers');
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);

  const getFilteredProducts = (): Product[] => {
    switch (activeTab) {
      case 'best_sellers':
        return PRODUCTS.filter((p) => p.isBestSeller);
      case 'new_arrivals':
        return PRODUCTS.filter((p) => p.isNewArrival);
      case 'international_order':
        return PRODUCTS.filter((p) => p.origin === 'international_order');
      case 'local_brands':
        return PRODUCTS.filter((p) => p.origin === 'vietnam_local_brand');
      case 'sale':
        return PRODUCTS.filter((p) => p.isSale || ((p.discountPercentage ?? 0) > 0));
      default:
        return PRODUCTS;
    }
  };

  const filteredProducts = getFilteredProducts();

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      {/* Header section */}
      <div className="text-center max-w-xl mx-auto mb-8">
        <span className="text-[11px] font-semibold text-[#8A7158] uppercase tracking-[0.08em] block mb-2">
          EDITORIAL SELECTION
        </span>
        <h2 className="font-editorial text-2xl sm:text-3xl lg:text-4xl font-normal text-[#171613] leading-tight">
          Thiết Kế Nổi Bật
        </h2>
        <div className="w-12 h-0.5 bg-[#C7A66A] mx-auto mt-3" />
      </div>

      {/* Tabs */}
      <div className="flex items-center justify-center gap-2 sm:gap-4 overflow-x-auto pb-4 mb-8 no-scrollbar">
        {TABS.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`px-4 py-2 text-xs uppercase tracking-[0.05em] font-medium rounded-full whitespace-nowrap transition-all duration-300 ${
              activeTab === tab.key
                ? 'bg-[#171613] text-[#FAF8F3] shadow-sm'
                : 'bg-[#F4F1EA] text-[#747069] hover:bg-[#E8D7BD]/50 hover:text-[#171613]'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
        {filteredProducts.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            onQuickView={(p) => setQuickViewProduct(p)}
          />
        ))}
      </div>

      {/* Bottom View All Link */}
      <div className="mt-12 text-center">
        <Link
          href={`/shop?tab=${activeTab}`}
          className="inline-flex items-center gap-2 px-8 py-3.5 bg-transparent border border-[#171613] hover:bg-[#171613] text-[#171613] hover:text-[#FAF8F3] text-xs font-semibold uppercase tracking-[0.06em] rounded transition-all duration-300"
        >
          <span>Xem tất cả sản phẩm ({filteredProducts.length}+)</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      {/* Quick View Modal */}
      <QuickViewModal
        product={quickViewProduct}
        onClose={() => setQuickViewProduct(null)}
      />
    </section>
  );
};
