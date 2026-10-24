'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Trash2,
  Plus,
  Minus,
  CheckCircle2,
  ShieldCheck,
  RotateCcw,
  Tag,
  ArrowRight
} from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { SafeImage } from '@/components/ui/SafeImage';

export default function CartPage() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const {
    items,
    removeFromCart,
    updateQuantity,
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

  React.useEffect(() => {
    setMounted(true);
  }, []);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
  };

  const handleApply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponCode.trim()) return;
    const res = applyCoupon(couponCode);
    setCouponMsg(res.message);
  };

  return (
    <div className="bg-[#FAF8F3] min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-6">
        <h1 className="font-editorial text-2xl sm:text-3xl font-medium text-[#171613] leading-tight">
          Giỏ hàng <span className="text-base text-[#747069] font-normal tabular-nums">({mounted ? items.length : 0} sản phẩm)</span>
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* CỘT TRÁI: DANH SÁCH SẢN PHẨM & MÃ GIẢM GIÁ (8 Cột - Chuẩn 100% Ảnh 4) */}
          <div className="lg:col-span-8 space-y-4">
            {/* Thanh tác vụ: Chọn tất cả, Xóa, Lưu danh sách */}
            <div className="bg-white rounded-xl border border-[#E8E4DC] p-4 flex items-center justify-between text-xs text-[#747069] shadow-sm">
              <label className="flex items-center gap-2 cursor-pointer text-[#171613] font-medium">
                <input type="checkbox" defaultChecked className="rounded accent-[#171613]" />
                <span>Chọn tất cả</span>
              </label>
              <div className="flex items-center space-x-4">
                <button className="hover:text-[#B83A3A] transition-colors">Xóa</button>
                <span>|</span>
                <button className="hover:text-[#171613] transition-colors">Lưu danh sách</button>
              </div>
            </div>

            {/* Danh Sách Sản Phẩm */}
            <div className="bg-white rounded-xl border border-[#E8E4DC] p-5 divide-y divide-[#F0ECE1] shadow-sm">
              {!mounted ? (
                <div className="py-12 text-center text-xs text-[#747069]">
                  Đang đồng bộ giỏ hàng...
                </div>
              ) : items.length === 0 ? (
                <div className="py-12 text-center text-xs text-[#747069]">
                  Giỏ hàng của bạn đang trống.
                </div>
              ) : (
                items.map((item) => (
                  <div key={item.id} className="py-4 first:pt-0 last:pb-0 flex items-center gap-4 text-xs">
                    <input type="checkbox" defaultChecked className="rounded accent-[#171613]" />

                    {/* Ảnh sản phẩm */}
                    <div className="relative w-16 h-20 bg-[#FAF8F3] rounded-lg overflow-hidden shrink-0 border border-[#E8E4DC]">
                      <SafeImage
                        src={item.product.images[0]}
                        alt={item.product.name}
                        fill
                        className="object-cover"
                        sizes="64px"
                      />
                    </div>

                    {/* Tên & Thuộc tính */}
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-[#171613] truncate">
                        {item.product.name}
                      </h3>
                      <p className="text-[11px] text-[#747069] mt-0.5">
                        Màu: {item.selectedColor} | Size: {item.selectedSize}
                      </p>

                      {/* Badge nguồn hàng */}
                      <span className="inline-block mt-1.5 px-2 py-0.5 rounded text-[9px] font-bold bg-[#DCFCE7] text-[#15803D]">
                        {item.product.origin === 'international_order' ? 'Order quốc tế' : 'Hàng có sẵn'}
                      </span>
                    </div>

                    {/* Bộ đếm số lượng `- 1 +` */}
                    <div className="flex items-center border border-[#E8E4DC] rounded bg-white">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="px-2 py-1 text-[#747069] hover:text-[#171613]"
                      >
                        -
                      </button>
                      <span className="px-2.5 py-1 font-bold text-[#171613]">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="px-2 py-1 text-[#747069] hover:text-[#171613]"
                      >
                        +
                      </button>
                    </div>

                    {/* Giá tiền */}
                    <div className="text-right min-w-[100px]">
                      <span className="font-bold text-[#171613] text-sm">
                        {formatPrice(item.product.price * item.quantity)}
                      </span>
                    </div>

                    {/* Nút xóa */}
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="text-[#A8A29E] hover:text-[#B83A3A] p-1"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))
              )}
            </div>

            {/* Ô Nhập Mã Giảm Giá (Chuẩn Ảnh 4) */}
            <div className="bg-white rounded-xl border border-[#E8E4DC] p-4 flex flex-wrap items-center justify-between gap-3 shadow-sm">
              <span className="text-xs font-bold text-[#171613] flex items-center gap-1.5">
                <Tag className="w-4 h-4 text-[#C78238]" />
                <span>Mã giảm giá / Voucher</span>
              </span>

              <form onSubmit={handleApply} className="flex gap-2 flex-1 max-w-xs">
                <input
                  type="text"
                  placeholder="Nhập mã ưu đãi..."
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
                  className="flex-1 bg-[#FAF8F3] border border-[#E8E4DC] rounded-lg p-2 text-xs uppercase focus:outline-none"
                />
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#171613] hover:bg-[#333] text-white text-xs font-semibold rounded-lg"
                >
                  Áp dụng
                </button>
              </form>
            </div>

            {/* Banner Ưu Đãi Dưới Cùng (Chuẩn Ảnh 4) */}
            <div className="bg-[#F6EFEB] border border-[#E8D7BD] rounded-xl p-4 flex items-center justify-between shadow-sm">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#C78238]/20 flex items-center justify-center font-bold text-[#C78238] text-xs shrink-0">
                  10%
                </div>
                <div>
                  <h4 className="text-xs font-bold text-[#171613]">
                    Giảm thêm 10% cho đơn hàng từ 3.000.000đ
                  </h4>
                  <p className="text-[10px] text-[#747069]">Áp dụng tự động hoặc nhập mã LUMIEREVIP</p>
                </div>
              </div>
              <button
                onClick={() => applyCoupon('LUMIEREVIP')}
                className="px-3.5 py-1.5 bg-[#8A7158] hover:bg-[#6D5843] text-white text-[11px] font-semibold rounded-lg shrink-0"
              >
                Sử dụng ngay
              </button>
            </div>
          </div>

          {/* CỘT PHẢI: BẢNG TỔNG THANH TOÁN (4 Cột - Chuẩn 100% Ảnh 4) */}
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
              onClick={() => router.push('/checkout')}
              className="w-full py-3.5 bg-[#171613] hover:bg-[#333] text-white text-xs uppercase font-bold tracking-wider rounded-lg shadow-md transition-colors"
            >
              Thanh toán
            </button>

            {/* Dòng Thông Báo Miễn Phí Vận Chuyển Xanh */}
            <div className="text-center text-xs text-[#15803D] font-medium flex items-center justify-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Bạn sẽ được miễn phí vận chuyển!</span>
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
      </div>
    </div>
  );
}
