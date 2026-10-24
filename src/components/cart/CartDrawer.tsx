'use client';

import React from 'react';
import Link from 'next/link';
import { X, Trash2, Plus, Minus, ArrowRight, ShoppingBag, ShieldCheck, Truck } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { Badge } from '@/components/ui/Badge';
import { SafeImage } from '@/components/ui/SafeImage';
import { LoyaltyProgressBar } from '@/components/loyalty/LoyaltyProgressBar';

export const CartDrawer: React.FC = () => {
  const { user } = useAuth();
  const {
    items,
    isCartDrawerOpen,
    setIsCartDrawerOpen,
    updateQuantity,
    removeFromCart,
    subtotal,
    totalItems
  } = useCart();

  if (!isCartDrawerOpen) return null;

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
  };

  const freeShippingThreshold = 2000000;
  const remainingForFreeShipping = Math.max(0, freeShippingThreshold - subtotal);
  const progressPercent = Math.min(100, (subtotal / freeShippingThreshold) * 100);

  // Kiểm tra giỏ hàng có hàng order không
  const hasOrderItems = items.some((item) => item.product.origin === 'international_order');

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-[#171613]/60 backdrop-blur-sm transition-opacity"
        onClick={() => setIsCartDrawerOpen(false)}
      />

      <div className="fixed inset-y-0 right-0 max-w-md w-full bg-[#FAF8F3] shadow-2xl flex flex-col z-50 animate-in slide-in-from-right duration-300">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-[#E8E4DC] flex items-center justify-between bg-[#F4F1EA]">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-[#8A7158]" />
            <h3 className="font-editorial text-lg font-medium text-[#171613]">
              Giỏ hàng của bạn ({totalItems})
            </h3>
          </div>
          <button
            onClick={() => setIsCartDrawerOpen(false)}
            className="p-1.5 text-[#747069] hover:text-[#171613] rounded-full hover:bg-[#E8E4DC]/50 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Freeship Progress Bar */}
        <div className="bg-[#FAF8F3] px-5 py-3 border-b border-[#E8E4DC] text-xs">
          {remainingForFreeShipping > 0 ? (
            <p className="text-[#747069]">
              Mua thêm <strong className="text-[#171613]">{formatPrice(remainingForFreeShipping)}</strong> để được <span className="text-[#8A7158] font-semibold">Miễn phí vận chuyển</span>
            </p>
          ) : (
            <p className="text-[#2E4F3E] font-medium flex items-center gap-1.5">
              <Truck className="w-4 h-4 text-[#2E4F3E]" />
              Bạn đã đủ điều kiện nhận Miễn phí vận chuyển toàn quốc!
            </p>
          )}
          <div className="w-full bg-[#E8E4DC] h-1.5 rounded-full mt-2 overflow-hidden">
            <div
              className="bg-[#C7A66A] h-full transition-all duration-500 rounded-full"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* Order Notice if order item exists */}
        {hasOrderItems && (
          <div className="bg-[#F4F1EA] px-5 py-2.5 border-b border-[#E8E4DC] flex items-start gap-2 text-[11px] text-[#747069]">
            <ShieldCheck className="w-4 h-4 text-[#8A7158] shrink-0 mt-0.5" />
            <span>
              Giỏ hàng có sản phẩm <strong className="text-[#171613]">Order Quốc Tế</strong>. Đơn hàng yêu cầu đặt cọc 50% trước khi xử lý mua hàng tại boutique nước ngoài.
            </span>
          </div>
        )}

        {/* Item List */}
        <div className="flex-1 overflow-y-auto p-5 divide-y divide-[#E8E4DC]">
          {items.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 text-[#747069]">
              <div className="w-16 h-16 rounded-full bg-[#F4F1EA] flex items-center justify-center mb-3">
                <ShoppingBag className="w-8 h-8 text-[#8A7158]/50" />
              </div>
              <h4 className="font-editorial text-lg text-[#171613] font-medium">
                Giỏ hàng trống
              </h4>
              <p className="text-xs text-[#747069] mt-1 max-w-xs">
                Chưa có sản phẩm nào trong giỏ hàng. Hãy khám phá các thiết kế mới nhất của TADA!.
              </p>
              <button
                onClick={() => setIsCartDrawerOpen(false)}
                className="mt-5 px-6 py-2.5 bg-[#171613] text-[#FAF8F3] text-xs uppercase tracking-wider font-medium rounded hover:bg-[#8A7158] transition-colors"
              >
                Khám phá ngay
              </button>
            </div>
          ) : (
            items.map((item) => (
              <div key={item.id} className="py-4 first:pt-0 last:pb-0 flex gap-4">
                <div className="relative w-20 h-24 bg-[#E8E4DC] rounded overflow-hidden shrink-0">
                  <SafeImage
                    src={item.product.images[0]}
                    alt={item.product.name}
                    fill
                    className="object-cover"
                    sizes="80px"
                  />
                </div>

                <div className="flex-1 min-w-0 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[10px] text-[#8A7158] font-bold tracking-wider uppercase">
                        {item.product.brand}
                      </span>
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="text-[#747069] hover:text-[#B83A3A] transition-colors"
                        title="Xóa khỏi giỏ"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <h5 className="text-xs font-medium text-[#171613] line-clamp-1 mt-0.5">
                      {item.product.name}
                    </h5>

                    <div className="flex items-center gap-2 mt-1 text-[11px] text-[#747069]">
                      <span>Màu: <strong className="text-[#171613]">{item.selectedColor}</strong></span>
                      <span>•</span>
                      <span>Size: <strong className="text-[#171613]">{item.selectedSize}</strong></span>
                    </div>

                    <div className="mt-1">
                      {item.product.origin === 'international_order' ? (
                        <Badge type="ORDER QUỐC TẾ" />
                      ) : item.product.origin === 'vietnam_local_brand' ? (
                        <Badge type="LOCAL BRAND" />
                      ) : (
                        <Badge type="HÀNG CÓ SẴN" />
                      )}
                    </div>
                  </div>

                  <div className="flex items-center justify-between mt-2 pt-2 border-t border-[#E8E4DC]/40">
                    <div className="flex items-center border border-[#E8E4DC] rounded bg-white">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="p-1 text-[#747069] hover:text-[#171613]"
                        aria-label="Giảm"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="px-2.5 text-xs font-medium text-[#171613]">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="p-1 text-[#747069] hover:text-[#171613]"
                        aria-label="Tăng"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>

                    <span className="text-xs font-semibold text-[#171613]">
                      {formatPrice(item.product.price * item.quantity)}
                    </span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer Actions */}
        {items.length > 0 && (
          <div className="p-5 border-t border-[#E8E4DC] bg-[#F4F1EA] space-y-3">
            {/* Thanh tiến trình thăng hạng thành viên */}
            <LoyaltyProgressBar user={user} cartSubtotal={subtotal} compact />

            <div className="flex items-center justify-between text-sm font-medium">
              <span className="text-[#747069]">Tạm tính:</span>
              <span className="font-editorial text-lg text-[#171613] font-bold">
                {formatPrice(subtotal)}
              </span>
            </div>

            <p className="text-[11px] text-[#747069]">
              Phí vận chuyển và mã ưu đãi sẽ được tính tại bước thanh toán.
            </p>

            <div className="grid grid-cols-2 gap-2 pt-1">
              <Link
                href="/cart"
                onClick={() => setIsCartDrawerOpen(false)}
                className="py-2.5 text-center bg-white border border-[#171613] text-[#171613] text-xs uppercase tracking-wider font-medium rounded hover:bg-[#FAF8F3] transition-colors"
              >
                Xem giỏ hàng
              </Link>
              <Link
                href="/checkout"
                onClick={() => setIsCartDrawerOpen(false)}
                className="py-2.5 text-center bg-[#171613] text-[#FAF8F3] text-xs uppercase tracking-wider font-semibold rounded hover:bg-[#8A7158] transition-colors flex items-center justify-center gap-1.5 shadow-md"
              >
                <span>Thanh toán</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
