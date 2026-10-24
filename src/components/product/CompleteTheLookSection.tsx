'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Sparkles, ShoppingBag, Check, CheckCircle2 } from 'lucide-react';
import { Product } from '@/types';
import { SafeImage } from '@/components/ui/SafeImage';
import { useCart } from '@/context/CartContext';

interface CompleteTheLookSectionProps {
  mainProduct: Product;
  matchingProducts: Product[];
}

export function CompleteTheLookSection({
  mainProduct,
  matchingProducts
}: CompleteTheLookSectionProps) {
  const { addToCart, setIsCartDrawerOpen } = useCart();

  // Khởi tạo các sản phẩm trong set được chọn mặc định
  const allSetItems = [mainProduct, ...matchingProducts.slice(0, 3)];
  const [selectedIds, setSelectedIds] = useState<string[]>(allSetItems.map((p) => p.id));
  const [isAdding, setIsAdding] = useState(false);
  const [successMsg, setSuccessMsg] = useState(false);

  if (matchingProducts.length === 0) return null;

  const toggleItem = (id: string) => {
    // Không cho phép bỏ chọn sản phẩm chính
    if (id === mainProduct.id) return;
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter((item) => item !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

  const selectedItems = allSetItems.filter((p) => selectedIds.includes(p.id));
  const totalSetPrice = selectedItems.reduce((sum, item) => sum + item.price, 0);

  // Giảm giá 5% khi mua từ 2 món trở lên trong set
  const isComboDiscount = selectedItems.length >= 2;
  const discountAmount = isComboDiscount ? Math.round(totalSetPrice * 0.05) : 0;
  const finalSetPrice = totalSetPrice - discountAmount;

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
  };

  const handleAddSetToCart = () => {
    setIsAdding(true);
    let addedCount = 0;

    for (const item of selectedItems) {
      if (item.stockCount > 0) {
        const defaultColor = item.colors?.[0]?.name || 'Mặc định';
        const defaultSize = item.sizes?.[0] || 'M';
        addToCart(item, defaultColor, defaultSize, 1);
        addedCount++;
      }
    }

    setIsAdding(false);
    if (addedCount > 0) {
      setSuccessMsg(true);
      setTimeout(() => {
        setSuccessMsg(false);
        setIsCartDrawerOpen(true);
      }, 800);
    }
  };

  return (
    <section className="bg-white rounded-3xl border border-[#E8E4DC] p-6 sm:p-8 shadow-xs space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-2 pb-4 border-b border-[#E8E4DC]">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-[#FAF8F3] border border-[#E8E4DC] flex items-center justify-center text-[#8A7158]">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-editorial text-xl font-semibold text-[#171613]">
              Hoàn Thiện Set Đồ (Complete the Look)
            </h3>
            <p className="text-[11px] text-[#747069]">
              Gợi ý phối đồ ton-sur-ton từ các Stylist Atelier. Tiết kiệm thêm 5% khi mua theo set.
            </p>
          </div>
        </div>

        {isComboDiscount && (
          <span className="text-[11px] font-bold text-[#8A7158] bg-[#FAF8F3] px-3 py-1 rounded-full border border-[#E8E4DC]">
            Ưu đãi Set Combo: Giảm 5%
          </span>
        )}
      </div>

      {/* Grid danh sách các món trong set */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {allSetItems.map((item, index) => {
          const isSelected = selectedIds.includes(item.id);
          const isMain = item.id === mainProduct.id;

          return (
            <div
              key={item.id}
              onClick={() => toggleItem(item.id)}
              className={`relative rounded-2xl border p-3 cursor-pointer transition-all ${
                isSelected
                  ? 'border-[#171613] bg-[#FAF8F3]/60 shadow-xs'
                  : 'border-[#E8E4DC] bg-white opacity-60 hover:opacity-100'
              }`}
            >
              <div className="flex items-start gap-3">
                <div className="relative w-16 h-20 rounded-xl overflow-hidden bg-[#FAF8F3] shrink-0 border border-[#E8E4DC]">
                  <SafeImage src={item.images?.[0]} alt={item.name} fill className="object-cover" sizes="64px" />
                </div>

                <div className="flex-1 min-w-0 space-y-1">
                  <div className="flex items-center gap-1.5">
                    {isMain && (
                      <span className="text-[9px] font-bold bg-[#171613] text-white px-1.5 py-0.5 rounded uppercase">
                        Sản phẩm chính
                      </span>
                    )}
                    <span className="text-[10px] text-[#8A7158] font-medium">{item.brand}</span>
                  </div>

                  <h4 className="text-xs font-semibold text-[#171613] line-clamp-2 leading-tight">
                    {item.name}
                  </h4>

                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-[#B83A3A] font-mono">
                      {formatPrice(item.price)}
                    </span>
                  </div>
                </div>

                <div
                  className={`w-5 h-5 rounded-md flex items-center justify-center shrink-0 border transition-colors ${
                    isSelected ? 'bg-[#171613] border-[#171613] text-white' : 'border-[#D5CEC2] bg-white'
                  }`}
                >
                  {isSelected && <Check className="w-3.5 h-3.5" />}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer tính tiền & Nút thêm cả set */}
      <div className="pt-4 border-t border-[#E8E4DC] flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="space-y-1 text-center sm:text-left">
          <div className="flex items-baseline gap-2 justify-center sm:justify-start">
            <span className="text-xs text-[#747069]">Tổng set ({selectedItems.length} món):</span>
            <span className="font-editorial text-2xl font-bold text-[#171613]">
              {formatPrice(finalSetPrice)}
            </span>
            {discountAmount > 0 && (
              <span className="text-xs line-through text-[#A8A29E] font-mono">
                {formatPrice(totalSetPrice)}
              </span>
            )}
          </div>
          {discountAmount > 0 && (
            <p className="text-[11px] text-[#15803D] font-medium">
              Bạn tiết kiệm được {formatPrice(discountAmount)} khi mua trọn bộ outfit!
            </p>
          )}
        </div>

        <button
          type="button"
          disabled={selectedItems.length === 0 || isAdding}
          onClick={handleAddSetToCart}
          className="w-full sm:w-auto px-8 py-3.5 bg-[#171613] hover:bg-[#8A7158] text-white text-xs font-bold uppercase tracking-wider rounded-xl transition-all shadow-sm flex items-center justify-center gap-2 disabled:opacity-50"
        >
          {successMsg ? (
            <>
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Đã thêm toàn bộ set đồ vào giỏ!</span>
            </>
          ) : (
            <>
              <ShoppingBag className="w-4 h-4" />
              <span>Thêm Cả Set Vào Giỏ Hàng</span>
            </>
          )}
        </button>
      </div>
    </section>
  );
}
