'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { Clock, ArrowRight } from 'lucide-react';
import { useProducts } from '@/context/ProductContext';
import { ProductCard } from '@/components/product/ProductCard';
import { QuickViewModal } from '@/components/product/QuickViewModal';
import { Product } from '@/types';

export const NewArrivalsSection: React.FC = () => {
  const { products, isLoading } = useProducts();
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);

  // Hàng mới về: theo thời gian cập nhật/tạo mới
  const newArrivals = useMemo(() => {
    const list = [...products].filter((p) => !p.status || p.status === 'active');
    return list
      .sort((a, b) => new Date(b.createdAt || b.updatedAt || 0).getTime() - new Date(a.createdAt || a.updatedAt || 0).getTime())
      .slice(0, 8);
  }, [products]);

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="flex items-center gap-2 text-lg sm:text-xl font-bold text-[#171613]">
            <Clock className="w-5 h-5 text-[#2563EB]" />
            <span>Hàng mới về (New Arrivals)</span>
          </h2>
          <p className="text-[11px] text-[#747069] mt-0.5">
            Cập nhật những mẫu thiết kế mới nhất vừa cập bến kho hàng TADA! tuần này
          </p>
        </div>

        <Link
          href="/shop?tab=new"
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
          {newArrivals.map((product) => (
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
