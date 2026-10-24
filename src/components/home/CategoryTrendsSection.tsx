'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { Layers, ArrowRight } from 'lucide-react';
import { useProducts } from '@/context/ProductContext';
import { ProductCard } from '@/components/product/ProductCard';
import { QuickViewModal } from '@/components/product/QuickViewModal';
import { Product } from '@/types';

interface TrendTab {
  id: string;
  name: string;
  filterFn: (p: Product) => boolean;
  viewAllLink: string;
}

const TREND_TABS: TrendTab[] = [
  {
    id: 'so-mi',
    name: 'Áo Sơ Mi Được Yêu Thích',
    filterFn: (p) =>
      (p.subCategoryId === 'ao-so-mi-nu' || p.subCategoryId === 'ao-so-mi-nam') ||
      p.name.toLowerCase().includes('sơ mi') ||
      p.name.toLowerCase().includes('blouse'),
    viewAllLink: '/shop?sub=ao-so-mi-nu'
  },
  {
    id: 'ao-thun-polo',
    name: 'Áo Thun & Polo Hot',
    filterFn: (p) =>
      (p.subCategoryId === 'ao-thun-nu' || p.subCategoryId === 'ao-polo-nam' || p.subCategoryId === 'ao-thun-nam') ||
      p.name.toLowerCase().includes('thun') ||
      p.name.toLowerCase().includes('polo'),
    viewAllLink: '/shop?sub=ao-thun-nu'
  },
  {
    id: 'vay-dam',
    name: 'Váy & Đầm Tiệc Nổi Bật',
    filterFn: (p) =>
      p.subCategoryId === 'dam-vay-lien' ||
      p.subCategoryId === 'chan-vay' ||
      p.category === 'vay-dam' ||
      p.name.toLowerCase().includes('đầm') ||
      p.name.toLowerCase().includes('váy'),
    viewAllLink: '/shop?sub=dam-vay-lien'
  },
  {
    id: 'quan-jeans-au',
    name: 'Quần Jeans & Quần Âu',
    filterFn: (p) =>
      (p.subCategoryId && p.subCategoryId.includes('quan')) ||
      p.category === 'quan' ||
      p.name.toLowerCase().includes('quần'),
    viewAllLink: '/shop?sub=quan-jeans-nu'
  },
  {
    id: 'do-bo',
    name: 'Đồ Bộ & Mặc Nhà',
    filterFn: (p) =>
      p.categoryId === 'do-bo' ||
      p.category === 'do-bo' ||
      p.name.toLowerCase().includes('bộ') ||
      p.name.toLowerCase().includes('tracksuit'),
    viewAllLink: '/shop?category=do-bo'
  }
];

export const CategoryTrendsSection: React.FC = () => {
  const { products, isLoading } = useProducts();
  const [activeTabId, setActiveTabId] = useState(TREND_TABS[0].id);
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);

  const currentTab = TREND_TABS.find((t) => t.id === activeTabId) || TREND_TABS[0];

  const filteredProducts = useMemo(() => {
    const list = products.filter((p) => (!p.status || p.status === 'active') && currentTab.filterFn(p));
    return list.slice(0, 8);
  }, [products, currentTab]);

  return (
    <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 min-w-0">
      {/* Header & Tabs */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6 pb-3 border-b border-[#E8E4DC]">
        <div>
          <span className="text-[11px] font-bold text-[#8A7158] uppercase tracking-wider flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5 text-[#C78238]" />
            <span>KHÁM PHÁ THEO DANH MỤC</span>
          </span>
          <h2 className="text-xl sm:text-2xl font-bold text-[#171613] mt-1">
            Xu Hướng Thời Trang Theo Ngành Hàng
          </h2>
        </div>

        {/* Tab pills */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
          {TREND_TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTabId(tab.id)}
              className={`px-3 py-1.5 text-xs rounded-full font-medium transition-all shrink-0 ${
                activeTabId === tab.id
                  ? 'bg-[#171613] text-[#FAF8F3] shadow-sm'
                  : 'bg-white text-[#747069] hover:bg-[#F4F1EA] hover:text-[#171613] border border-[#E8E4DC]'
              }`}
            >
              {tab.name}
            </button>
          ))}
        </div>
      </div>

      {/* Grid sản phẩm */}
      {isLoading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="aspect-[3/4] bg-white rounded-xl border border-[#E8E4DC] animate-pulse" />
          ))}
        </div>
      ) : filteredProducts.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4">
          {filteredProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onQuickView={(p) => setQuickViewProduct(p)}
            />
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-[#E8E4DC] p-12 text-center text-xs text-[#747069]">
          Chưa có sản phẩm nào trong danh mục này.
        </div>
      )}

      {/* Bottom CTA: Xem tất cả sản phẩm thuộc tab */}
      <div className="mt-6 text-center">
        <Link
          href={currentTab.viewAllLink}
          className="inline-flex items-center gap-2 px-6 py-2.5 bg-white hover:bg-[#171613] text-[#171613] hover:text-white border border-[#171613] rounded-full text-xs font-semibold uppercase tracking-wider transition-all shadow-sm"
        >
          <span>Xem tất cả {currentTab.name}</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
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
