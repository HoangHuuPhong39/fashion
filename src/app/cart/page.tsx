'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Trash2,
  ArrowRight,
  ShieldCheck,
  RotateCcw,
  CheckCircle2,
  Tag,
  ShoppingBag,
  ArrowLeft
} from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { SafeImage } from '@/components/ui/SafeImage';
import { useMounted } from '@/hooks/useMounted';

export default function CartPage() {
  const router = useRouter();
  const mounted = useMounted();

  const {
    items,
    removeFromCart,
    updateQuantity,
    clearCart,
    subtotal,
    shippingFee,
    discountAmount,
    membershipDiscountAmount,
    membershipDiscountPercent,
    appliedCoupon,
    applyCoupon,
    total
  } = useCart();

  const [couponCode, setCouponCode] = useState('');
  const [couponMsg, setCouponMsg] = useState('');


  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
  };

  const handleApply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponCode.trim()) return;
    const res = applyCoupon(couponCode);
    setCouponMsg(res.message);
  };

  const FREESHIP_THRESHOLD = 499000;
  const isEligibleFreeship = subtotal >= FREESHIP_THRESHOLD || shippingFee === 0;
  const amountNeededForFreeship = Math.max(0, FREESHIP_THRESHOLD - subtotal);

  return (
    <div className="bg-[#FAF8F3] min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-6">
        <h1 className="font-editorial text-2xl sm:text-3xl font-medium text-[#171613] leading-tight">
          Giỏ hàng <span className="text-base text-[#747069] font-normal tabular-nums">({mounted ? items.length : 0} sản phẩm)</span>
        </h1>

        {!mounted ? (
          <div className="bg-white rounded-2xl border border-[#E8E4DC] p-12 text-center text-xs text-[#747069]">
            Đang đồng bộ giỏ hàng...
          </div>
        ) : items.length === 0 ? (
          /* Empty State: Ẩn hoàn toàn tóm tắt đơn và nút thanh toán */
          <div className="bg-white rounded-2xl border border-[#E8E4DC] p-12 sm:p-16 text-center space-y-5 shadow-sm max-w-xl mx-auto">
            <div className="w-16 h-16 rounded-full bg-[#FAF8F3] border border-[#E8E4DC] flex items-center justify-center mx-auto text-[#8A7158]">
              <ShoppingBag className="w-8 h-8" />
            </div>
            <div className="space-y-2">
              <h2 className="font-editorial text-2xl font-medium text-[#171613]">
                Giỏ hàng của bạn đang trống
              </h2>
              <p className="text-xs text-[#747069] leading-relaxed max-w-sm mx-auto">
                Chưa có thiết kế nào trong giỏ hàng. Hãy khám phá các bộ sưu tập thời trang đương đại và dịch vụ Fashion Concierge của TADA!.
              </p>
            </div>
            <div className="pt-2">
              <Link
                href="/shop"
                className="inline-flex items-center gap-2 px-6 py-3 bg-[#171613] hover:bg-[#8A7158] text-white text-xs font-bold uppercase tracking-wider rounded-xl shadow-sm transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Khám phá bộ sưu tập ngay</span>
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* CỘT TRÁI: DANH SÁCH SẢN PHẨM & MÃ GIẢM GIÁ (8 Cột) */}
            <div className="lg:col-span-8 space-y-4">
              {/* Thanh tác vụ: Chọn tất cả, Xóa toàn bộ */}
              <div className="bg-white rounded-xl border border-[#E8E4DC] p-4 flex items-center justify-between text-xs text-[#747069] shadow-sm">
                <span className="text-[#171613] font-medium">Danh sách các món đồ bạn đã chọn ({items.length})</span>
                <button
                  type="button"
                  onClick={clearCart}
                  className="hover:text-[#B83A3A] transition-colors flex items-center gap-1 text-[11px]"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Xóa toàn bộ giỏ hàng</span>
                </button>
              </div>

              {/* Danh Sách Sản Phẩm */}
              <div className="bg-white rounded-xl border border-[#E8E4DC] p-5 divide-y divide-[#F0ECE1] shadow-sm">
                {items.map((item) => (
                  <div key={item.id} className="py-4 first:pt-0 last:pb-0 flex items-center gap-4 text-xs">
                    {/* Ảnh sản phẩm */}
                    <div className="relative w-16 h-20 bg-[#FAF8F3] rounded-lg overflow-hidden shrink-0 border border-[#E8E4DC]">
                      <SafeImage
                        src={item.product.images?.[0] || '/images/placeholder-fashion.svg'}
                        alt={item.product.name}
                        fill
                        className="object-cover"
                        sizes="64px"
                      />
                    </div>

                    {/* Tên & Thuộc tính */}
                    <div className="flex-1 min-w-0">
                      <Link href={`/product/${item.product.id}`} className="hover:underline">
                        <h3 className="font-semibold text-[#171613] truncate">
                          {item.product.name}
                        </h3>
                      </Link>
                      <p className="text-[11px] text-[#747069] mt-0.5">
                        Màu: {item.selectedColor} | Size: {item.selectedSize}
                      </p>
                      <div className="text-xs font-bold text-[#B83A3A] mt-1 tabular-nums">
                        {formatPrice(item.product.price)}
                      </div>
                    </div>

                    {/* Bộ tăng giảm số lượng */}
                    <div className="flex items-center border border-[#E8E4DC] rounded-lg bg-[#FAF8F3]">
                      <button
                        type="button"
                        aria-label="Giảm số lượng"
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="px-2.5 py-1 text-[#747069] hover:text-[#171613]"
                      >
                        -
                      </button>
                      <span className="px-2 py-1 font-bold text-[#171613] text-center min-w-[24px]">
                        {item.quantity}
                      </span>
                      <button
                        type="button"
                        aria-label="Tăng số lượng"
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="px-2.5 py-1 text-[#747069] hover:text-[#171613]"
                      >
                        +
                      </button>
                    </div>

                    {/* Tổng từng dòng */}
                    <div className="w-24 text-right font-bold text-sm text-[#171613] tabular-nums hidden sm:block">
                      {formatPrice(item.product.price * item.quantity)}
                    </div>

                    {/* Nút Xóa */}
                    <button
                      type="button"
                      aria-label="Xóa sản phẩm này"
                      onClick={() => removeFromCart(item.id)}
                      className="text-[#747069] hover:text-[#B83A3A] transition-colors p-1"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>

              {/* Ô Nhập Mã Giảm Giá */}
              <div className="bg-white rounded-xl border border-[#E8E4DC] p-4 flex flex-col sm:flex-row items-center gap-3 shadow-sm">
                <div className="flex items-center gap-2 text-xs font-bold text-[#171613] shrink-0">
                  <Tag className="w-4 h-4 text-[#8A7158]" />
                  <span>Mã giảm giá:</span>
                </div>
                <form onSubmit={handleApply} className="flex-1 flex gap-2 w-full">
                  <input
                    type="text"
                    placeholder="Nhập mã ưu đãi (VD: TADAVIP, FREESHIP)..."
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                    className="flex-1 bg-[#FAF8F3] border border-[#E8E4DC] rounded-lg px-3 py-2 text-xs text-[#171613] focus:outline-none focus:border-[#171613]"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2 bg-[#171613] hover:bg-[#8A7158] text-white text-xs font-bold rounded-lg transition-colors"
                  >
                    Áp dụng
                  </button>
                </form>
              </div>
              {couponMsg && (
                <p className="text-xs text-[#8A7158] font-medium px-1">{couponMsg}</p>
              )}

              {/* Banner Ưu Đãi Dưới Cùng */}
              <div className="bg-[#F6EFEB] border border-[#E8D7BD] rounded-xl p-4 flex items-center justify-between shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#C78238]/20 flex items-center justify-center font-bold text-[#C78238] text-xs shrink-0">
                    10%
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-[#171613]">
                      Giảm thêm 10% cho đơn hàng từ 500.000đ
                    </h4>
                    <p className="text-[10px] text-[#747069]">Áp dụng tự động hoặc nhập mã TADAVIP</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => applyCoupon('TADAVIP')}
                  className="px-3.5 py-1.5 bg-[#8A7158] hover:bg-[#6D5843] text-white text-[11px] font-semibold rounded-lg shrink-0"
                >
                  Sử dụng ngay
                </button>
              </div>
            </div>

            {/* CỘT PHẢI: BẢNG TỔNG THANH TOÁN (4 Cột) */}
            <div className="lg:col-span-4 bg-white rounded-xl border border-[#E8E4DC] p-6 shadow-sm space-y-5">
              <h3 className="font-editorial text-base font-semibold text-[#171613] pb-3 border-b border-[#F0ECE1]">
                Tóm Tắt Đơn Hàng
              </h3>

              <div className="space-y-3 text-xs text-[#747069]">
                <div className="flex justify-between">
                  <span>Tổng tiền ({items.length} sản phẩm)</span>
                  <span className="font-medium text-[#171613] tabular-nums">{formatPrice(subtotal)}</span>
                </div>

                {membershipDiscountAmount > 0 && (
                  <div className="flex justify-between text-[#8A5A36] bg-[#FAF6F0] p-2 rounded-lg border border-[#E8D7BD]">
                    <span>Ưu đãi Hội viên (-{membershipDiscountPercent}%)</span>
                    <span className="font-bold tabular-nums">-{formatPrice(membershipDiscountAmount)}</span>
                  </div>
                )}

                {discountAmount > membershipDiscountAmount && (
                  <div className="flex justify-between text-[#B83A3A]">
                    <span>Mã giảm giá ({appliedCoupon})</span>
                    <span className="font-medium tabular-nums">-{formatPrice(discountAmount - membershipDiscountAmount)}</span>
                  </div>
                )}

                <div className="flex justify-between">
                  <span>Phí vận chuyển</span>
                  <span className="font-medium text-[#15803D] tabular-nums">
                    {shippingFee === 0 ? 'Miễn phí' : formatPrice(shippingFee)}
                  </span>
                </div>

                <div className="pt-3 border-t border-[#F0ECE1] flex justify-between items-baseline">
                  <span className="text-sm font-bold text-[#171613]">Tổng thanh toán</span>
                  <span className="text-2xl font-bold text-[#B83A3A] tabular-nums tracking-tight">
                    {formatPrice(total)}
                  </span>
                </div>
              </div>

              {/* Nút Đen "Thanh toán" */}
              <button
                type="button"
                onClick={() => router.push('/checkout')}
                className="w-full py-3.5 bg-[#171613] hover:bg-[#8A7158] text-white text-xs uppercase font-bold tracking-wider rounded-lg shadow-md transition-colors"
              >
                Tiến hành thanh toán
              </button>

              {/* Dòng Thông Báo Miễn Phí Vận Chuyển Chuẩn Xác Theo Ngưỡng Thật */}
              <div className={`text-center text-xs font-medium flex items-center justify-center gap-1.5 p-2 rounded-lg ${
                isEligibleFreeship ? 'bg-[#DCFCE7] text-[#15803D]' : 'bg-[#FEF3C7] text-[#B45309]'
              }`}>
                <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                <span>
                  {isEligibleFreeship
                    ? 'Đơn hàng đủ điều kiện miễn phí vận chuyển toàn quốc!'
                    : `Mua thêm ${formatPrice(amountNeededForFreeship)} để được Miễn phí giao hàng (ngưỡng 499K).`}
                </span>
              </div>

              {/* 2 Cam Kết Dưới Cùng */}
              <div className="pt-3 border-t border-[#F0ECE1] flex items-center justify-between text-[11px] text-[#A8A29E]">
                <span className="flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#8A7158]" />
                  <span>Thanh toán an toàn</span>
                </span>
                <span className="flex items-center gap-1">
                  <RotateCcw className="w-3.5 h-3.5 text-[#8A7158]" />
                  <span>Đổi trả trong 7 ngày</span>
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
