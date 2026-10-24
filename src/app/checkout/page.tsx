'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Lock,
  ChevronRight,
  Truck,
  CreditCard,
  QrCode,
  DollarSign,
  CheckCircle2,
  AlertCircle,
  ShoppingBag,
  ArrowLeft,
  MapPin
} from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { useProducts } from '@/context/ProductContext';
import { Order, OrderItem, PaymentMethod } from '@/types';
import { SafeImage } from '@/components/ui/SafeImage';
import { calculateOrderPricing } from '@/lib/pricing';

export default function CheckoutPage() {
  const router = useRouter();
  const { items, subtotal, discountAmount, appliedCoupon, applyCoupon, total, clearCart } = useCart();
  const { user, addOrder } = useAuth();
  const { refreshProducts } = useProducts();

  // Form states - Mặc định để trống, sẽ tự động điền nếu tài khoản đã có địa chỉ lưu sẵn
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [district, setDistrict] = useState('');
  const [ward, setWard] = useState('');
  const [notes, setNotes] = useState('');
  const [shippingMethod, setShippingMethod] = useState<'standard' | 'express'>('standard');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('cod');
  const [couponInput, setCouponInput] = useState('');
  const [couponMsg, setCouponMsg] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Tự động đồng bộ thông tin tài khoản đang đăng nhập
  useEffect(() => {
    if (user) {
      if (user.name) setFullName((prev) => prev || user.name);
      if (user.phone) setPhone((prev) => prev || user.phone);
      if (user.email) setEmail((prev) => prev || user.email);

      if (user.addresses && user.addresses.length > 0) {
        const defaultAddr = user.addresses[0];
        if (defaultAddr.fullName) setFullName(defaultAddr.fullName);
        if (defaultAddr.phone) setPhone(defaultAddr.phone);
        if (defaultAddr.email) setEmail(defaultAddr.email);
        if (defaultAddr.address) setAddress(defaultAddr.address);
        if (defaultAddr.city) setCity(defaultAddr.city);
        if (defaultAddr.district) setDistrict(defaultAddr.district);
        if (defaultAddr.ward) setWard(defaultAddr.ward);
      }
    }
  }, [user]);

  const pricing = calculateOrderPricing({
    subtotal,
    couponCode: appliedCoupon,
    membershipTier: user?.membershipTier || 'bronze',
    shippingMethod
  });
  const shippingCost = pricing.shippingFee;
  const finalTotal = pricing.total;

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
  };

  const handleApplyCoupon = () => {
    if (!couponInput.trim()) return;
    const res = applyCoupon(couponInput);
    setCouponMsg(res.message);
  };

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();

    if (items.length === 0) {
      setErrorMessage('Giỏ hàng của bạn đang trống. Vui lòng thêm sản phẩm trước khi thanh toán.');
      return;
    }

    if (!fullName.trim() || !phone.trim()) {
      setErrorMessage('Vui lòng nhập họ tên và số điện thoại người nhận hàng.');
      return;
    }

    if (!address.trim() || !city.trim() || !district.trim()) {
      setErrorMessage('Vui lòng nhập đầy đủ địa chỉ giao hàng (Số nhà/đường, Quận/Huyện, Tỉnh/Thành phố).');
      return;
    }

    setIsSubmitting(true);
    setErrorMessage('');

    const orderPayload: any = {
      items: items.map((i) => ({
        productId: i.product.id,
        productName: i.product.name,
        color: i.selectedColor,
        size: i.selectedSize,
        quantity: i.quantity,
        variantId: i.variantId
      })),
      shippingAddress: {
        fullName: fullName.trim(),
        phone: phone.trim(),
        email: email.trim(),
        address: address.trim(),
        city: city.trim(),
        district: district.trim(),
        ward: ward.trim(),
        notes: notes.trim()
      },
      paymentMethod,
      paymentStatus: 'pending',
      shippingMethod,
      appliedCoupon: appliedCoupon || undefined,
      notes: notes.trim()
    };

    try {
      const res = await addOrder(orderPayload);

      if (res.success && res.order) {
        // Tự động lưu địa chỉ này vào hồ sơ nếu người dùng chưa có địa chỉ nào lưu trước đó
        if (user && (!user.addresses || user.addresses.length === 0)) {
          fetch('/api/auth/profile', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              addresses: [
                {
                  fullName: fullName.trim(),
                  phone: phone.trim(),
                  email: email.trim(),
                  address: address.trim(),
                  ward: ward.trim(),
                  district: district.trim(),
                  city: city.trim()
                }
              ]
            })
          }).catch(() => {});
        }

        await refreshProducts();
        clearCart();
        router.push(`/order-success/${res.order.id}`);
      } else {
        setErrorMessage(res.message || 'Không thể tạo đơn hàng. Vui lòng kiểm tra lại tồn kho.');
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Lỗi kết nối khi đặt hàng.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="bg-[#FAF8F3] min-h-[70vh] py-16 px-4 flex items-center justify-center">
        <div className="max-w-md w-full bg-white p-8 rounded-2xl border border-[#E8E4DC] shadow-sm text-center space-y-4">
          <div className="w-14 h-14 rounded-full bg-[#FAF8F3] text-[#8A7158] flex items-center justify-center mx-auto">
            <ShoppingBag className="w-6 h-6" />
          </div>
          <h2 className="font-editorial text-2xl font-medium text-[#171613]">
            Giỏ Hàng Đang Trống
          </h2>
          <p className="text-xs text-[#747069]">
            Bạn chưa chọn thiết kế nào. Hãy khám phá bộ sưu tập mới nhất của TADA! và chọn cho mình sản phẩm ưng ý.
          </p>
          <div className="pt-2">
            <Link
              href="/shop"
              className="inline-flex items-center gap-2 px-6 py-3 bg-[#171613] hover:bg-[#8A7158] text-white text-xs font-bold uppercase tracking-wider rounded-xl transition-colors shadow-sm"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Khám Phá Cửa Hàng</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#FAF8F3] min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="font-editorial text-2xl sm:text-3xl font-medium text-[#171613]">
            Thanh Toán Đơn Hàng
          </h1>
          <Link
            href="/cart"
            className="text-xs font-semibold text-[#8A7158] hover:underline flex items-center gap-1"
          >
            ← Quay lại giỏ hàng
          </Link>
        </div>

        {errorMessage && (
          <div className="p-4 bg-[#FEE2E2] border border-[#FCA5A5] text-[#DC2626] rounded-xl text-xs font-medium flex items-center gap-2 shadow-sm">
            <AlertCircle className="w-5 h-5 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        <form onSubmit={handlePlaceOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* CỘT TRÁI: 1. THÔNG TIN NHẬN HÀNG & 2. VẬN CHUYỂN (6 Cột) */}
          <div className="lg:col-span-6 space-y-6">
            {/* 1. Thông tin nhận hàng */}
            <div className="bg-white rounded-xl border border-[#E8E4DC] p-6 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-xs font-bold text-[#171613] uppercase tracking-wider">
                  1. Thông tin nhận hàng
                </h2>
                {user && user.addresses && user.addresses.length > 0 ? (
                  <span className="text-[11px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded font-medium border border-emerald-200">
                    Đã áp dụng địa chỉ mặc định
                  </span>
                ) : (
                  <span className="text-[11px] text-[#8A7158] bg-[#FAF3E8] px-2 py-0.5 rounded font-medium border border-[#E8DAC2]">
                    Yêu cầu thêm địa chỉ
                  </span>
                )}
              </div>

              {(!address || (user && (!user.addresses || user.addresses.length === 0))) && (
                <div className="p-3 bg-[#FAF3E8] border border-[#E8DAC2] rounded-xl flex items-start gap-2.5 text-xs text-[#8A7158]">
                  <MapPin className="w-4 h-4 shrink-0 mt-0.5 text-[#8A7158]" />
                  <div>
                    <span className="font-bold block text-[#171613]">Tài khoản chưa có địa chỉ giao hàng</span>
                    <span className="text-[11px]">Vui lòng điền thông tin địa chỉ bên dưới. Hệ thống sẽ tự động lưu lại vào sổ địa chỉ của bạn cho các lần mua sắm tiếp theo.</span>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div>
                  <label className="block text-[#747069] mb-1 font-medium">Họ và tên người nhận *</label>
                  <input
                    type="text"
                    required
                    placeholder="Nguyễn Văn A"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full bg-[#FAF8F3] border border-[#E8E4DC] rounded-lg p-2.5 text-[#171613] font-medium placeholder:text-[#A8A29E]"
                  />
                </div>
                <div>
                  <label className="block text-[#747069] mb-1 font-medium">Số điện thoại *</label>
                  <input
                    type="text"
                    required
                    placeholder="09xx xxx xxx"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full bg-[#FAF8F3] border border-[#E8E4DC] rounded-lg p-2.5 text-[#171613] font-medium placeholder:text-[#A8A29E]"
                  />
                </div>
              </div>

              <div className="text-xs">
                <label className="block text-[#747069] mb-1 font-medium">Email nhận thông báo đơn hàng *</label>
                <input
                  type="email"
                  required
                  placeholder="email@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-[#FAF8F3] border border-[#E8E4DC] rounded-lg p-2.5 text-[#171613] placeholder:text-[#A8A29E]"
                />
              </div>

              <div className="text-xs">
                <label className="block text-[#747069] mb-1 font-medium">Địa chỉ giao hàng chi tiết (Số nhà, ngõ, tên đường) *</label>
                <input
                  type="text"
                  required
                  placeholder="Ví dụ: 123 Lê Duẩn, Căn hộ 4.02..."
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full bg-[#FAF8F3] border border-[#E8E4DC] rounded-lg p-2.5 text-[#171613] placeholder:text-[#A8A29E]"
                />
              </div>

              <div className="grid grid-cols-3 gap-2 text-xs">
                <div>
                  <label className="block text-[#747069] mb-1 font-medium">Tỉnh / Thành phố *</label>
                  <select
                    value={city}
                    required
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full bg-[#FAF8F3] border border-[#E8E4DC] rounded-lg p-2 text-xs text-[#171613]"
                  >
                    <option value="">-- Chọn Tỉnh / Thành --</option>
                    <option value="Hà Nội">Hà Nội</option>
                    <option value="TP. Hồ Chí Minh">TP. Hồ Chí Minh</option>
                    <option value="Đà Nẵng">Đà Nẵng</option>
                    <option value="Hải Phòng">Hải Phòng</option>
                    <option value="Cần Thơ">Cần Thơ</option>
                    <option value="Bình Dương">Bình Dương</option>
                    <option value="Đồng Nai">Đồng Nai</option>
                    <option value="Quảng Ninh">Quảng Ninh</option>
                    <option value="Khác">Tỉnh / Thành khác</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[#747069] mb-1 font-medium">Quận / Huyện *</label>
                  <input
                    type="text"
                    required
                    placeholder="Quận / Huyện"
                    value={district}
                    onChange={(e) => setDistrict(e.target.value)}
                    className="w-full bg-[#FAF8F3] border border-[#E8E4DC] rounded-lg p-2 text-xs text-[#171613] placeholder:text-[#A8A29E]"
                  />
                </div>
                <div>
                  <label className="block text-[#747069] mb-1 font-medium">Phường / Xã *</label>
                  <input
                    type="text"
                    required
                    placeholder="Phường / Xã"
                    value={ward}
                    onChange={(e) => setWard(e.target.value)}
                    className="w-full bg-[#FAF8F3] border border-[#E8E4DC] rounded-lg p-2 text-xs text-[#171613] placeholder:text-[#A8A29E]"
                  />
                </div>
              </div>

              <div className="text-xs">
                <label className="block text-[#747069] mb-1 font-medium">Ghi chú giao hàng (Tùy chọn)</label>
                <input
                  type="text"
                  placeholder="Ví dụ: Giao giờ hành chính, gọi trước khi đến..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full bg-[#FAF8F3] border border-[#E8E4DC] rounded-lg p-2 text-xs text-[#171613]"
                />
              </div>
            </div>

            {/* 2. Phương thức vận chuyển */}
            <div className="bg-white rounded-xl border border-[#E8E4DC] p-6 shadow-sm space-y-3">
              <h2 className="text-xs font-bold text-[#171613] uppercase tracking-wider mb-2">
                2. Phương thức vận chuyển
              </h2>

              <label
                className={`flex items-center justify-between p-3.5 rounded-lg border cursor-pointer text-xs transition-all ${
                  shippingMethod === 'standard' ? 'border-[#171613] bg-[#FAF8F3]' : 'border-[#E8E4DC]'
                }`}
              >
                <div className="flex items-center gap-3">
                  <input
                    type="radio"
                    name="ship"
                    checked={shippingMethod === 'standard'}
                    onChange={() => setShippingMethod('standard')}
                    className="accent-[#171613]"
                  />
                  <div>
                    <span className="font-semibold text-[#171613] block">Giao hàng tiêu chuẩn (2 - 4 ngày)</span>
                    <span className="text-[10px] text-[#A8A29E]">Vận chuyển toàn quốc an toàn</span>
                  </div>
                </div>
                <span className="font-bold text-[#171613]">30.000đ</span>
              </label>

              <label
                className={`flex items-center justify-between p-3.5 rounded-lg border cursor-pointer text-xs transition-all ${
                  shippingMethod === 'express' ? 'border-[#171613] bg-[#FAF8F3]' : 'border-[#E8E4DC]'
                }`}
              >
                <div className="flex items-center gap-3">
                  <input
                    type="radio"
                    name="ship"
                    checked={shippingMethod === 'express'}
                    onChange={() => setShippingMethod('express')}
                    className="accent-[#171613]"
                  />
                  <div>
                    <span className="font-semibold text-[#171613] block">Giao hàng hỏa tốc Express (1 - 2 ngày)</span>
                    <span className="text-[10px] text-[#A8A29E]">Ưu tiên xử lý đóng gói và giao sớm</span>
                  </div>
                </div>
                <span className="font-bold text-[#171613]">50.000đ</span>
              </label>
            </div>
          </div>

          {/* CỘT PHẢI: 3. THANH TOÁN & TÓM TẮT SẢN PHẨM & MÃ GIẢM GIÁ (6 Cột) */}
          <div className="lg:col-span-6 space-y-6">
            {/* 3. Phương thức thanh toán */}
            <div className="bg-white rounded-xl border border-[#E8E4DC] p-6 shadow-sm space-y-3">
              <h2 className="text-xs font-bold text-[#171613] uppercase tracking-wider mb-2">
                3. Phương thức thanh toán
              </h2>

              <label
                className={`flex items-center gap-3 p-3.5 rounded-lg border cursor-pointer text-xs transition-all ${
                  paymentMethod === 'cod' ? 'border-[#171613] bg-[#FAF8F3]' : 'border-[#E8E4DC]'
                }`}
              >
                <input
                  type="radio"
                  name="pay"
                  checked={paymentMethod === 'cod'}
                  onChange={() => setPaymentMethod('cod')}
                  className="accent-[#171613]"
                />
                <DollarSign className="w-4 h-4 text-[#8A7158]" />
                <div>
                  <span className="font-semibold text-[#171613] block">Thanh toán khi nhận hàng (COD)</span>
                  <span className="text-[10px] text-[#747069]">Kiểm tra hàng trước khi thanh toán cho shipper</span>
                </div>
              </label>

              <label
                className={`flex items-center gap-3 p-3.5 rounded-lg border cursor-pointer text-xs transition-all ${
                  paymentMethod === 'vietqr' ? 'border-[#171613] bg-[#FAF8F3]' : 'border-[#E8E4DC]'
                }`}
              >
                <input
                  type="radio"
                  name="pay"
                  checked={paymentMethod === 'vietqr'}
                  onChange={() => setPaymentMethod('vietqr')}
                  className="accent-[#171613]"
                />
                <QrCode className="w-4 h-4 text-[#8A7158]" />
                <div>
                  <span className="font-semibold text-[#171613] block">Chuyển khoản ngân hàng VietQR</span>
                  <span className="text-[10px] text-[#747069]">Quét mã QR tự động điền số tiền và nội dung chuyển</span>
                </div>
              </label>

              <label
                className={`flex items-center gap-3 p-3.5 rounded-lg border cursor-pointer text-xs transition-all ${
                  paymentMethod === 'credit_card' ? 'border-[#171613] bg-[#FAF8F3]' : 'border-[#E8E4DC]'
                }`}
              >
                <input
                  type="radio"
                  name="pay"
                  checked={paymentMethod === 'credit_card'}
                  onChange={() => setPaymentMethod('credit_card')}
                  className="accent-[#171613]"
                />
                <CreditCard className="w-4 h-4 text-[#8A7158]" />
                <div>
                  <span className="font-semibold text-[#171613] block">Thẻ tín dụng / Thẻ ghi nợ Quốc tế</span>
                  <span className="text-[10px] text-[#747069]">Bảo mật thanh toán 3D-Secure</span>
                </div>
              </label>
            </div>

            {/* Danh sách sản phẩm trong giỏ hàng & Mã giảm giá */}
            <div className="bg-white rounded-xl border border-[#E8E4DC] p-6 shadow-sm space-y-4">
              <h2 className="text-xs font-bold text-[#171613] uppercase tracking-wider">
                4. Đơn hàng của bạn ({items.length} mặt hàng)
              </h2>

              <div className="divide-y divide-[#E8E4DC] max-h-60 overflow-y-auto pr-1">
                {items.map((item) => (
                  <div key={item.id} className="py-2.5 flex items-center justify-between gap-3 text-xs">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="relative w-12 h-14 rounded overflow-hidden bg-[#FAF8F3] border border-[#E8E4DC] shrink-0">
                        <SafeImage
                          src={item.product.images[0] || '/images/products/dress-1.jpg'}
                          alt=""
                          fill
                          className="object-cover"
                          sizes="48px"
                        />
                      </div>
                      <div className="min-w-0">
                        <div className="font-semibold text-[#171613] truncate">{item.product.name}</div>
                        <div className="text-[11px] text-[#747069]">
                          {item.selectedColor} - Size {item.selectedSize} × {item.quantity}
                        </div>
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <span className="font-bold text-[#171613]">
                        {formatPrice(item.product.price * item.quantity)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Nhập mã giảm giá */}
              <div className="pt-2">
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Mã giảm giá (TADAVIP, FREESHIP...)"
                    value={couponInput}
                    onChange={(e) => setCouponInput(e.target.value)}
                    className="flex-1 bg-[#FAF8F3] border border-[#E8E4DC] rounded-lg p-2.5 text-xs uppercase focus:outline-none focus:border-[#171613]"
                  />
                  <button
                    type="button"
                    onClick={handleApplyCoupon}
                    className="px-4 py-2 bg-[#8A7158] hover:bg-[#6D5843] text-white text-xs font-semibold rounded-lg transition-colors"
                  >
                    Áp dụng
                  </button>
                </div>
                {couponMsg && (
                  <p className="text-[11px] text-[#15803D] mt-1 font-medium">{couponMsg}</p>
                )}
              </div>

              {/* Tóm tắt tổng tiền */}
              <div className="pt-4 border-t border-[#F0ECE1] space-y-2 text-xs text-[#747069]">
                <div className="flex justify-between">
                  <span>Tạm tính</span>
                  <span className="font-medium text-[#171613] tabular-nums">{formatPrice(subtotal)}</span>
                </div>
                {discountAmount > 0 && (
                  <div className="flex justify-between text-[#15803D]">
                    <span>Giảm giá ({appliedCoupon})</span>
                    <span className="font-medium tabular-nums">-{formatPrice(discountAmount)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Phí vận chuyển</span>
                  <span className="font-medium text-[#171613] tabular-nums">{formatPrice(shippingCost)}</span>
                </div>
                <div className="pt-2 border-t border-[#F0ECE1] flex justify-between items-baseline">
                  <span className="text-sm font-bold text-[#171613]">Tổng thanh toán</span>
                  <span className="text-2xl font-bold text-[#B83A3A] tabular-nums tracking-tight">
                    {formatPrice(finalTotal)}
                  </span>
                </div>
              </div>

              {/* Nút Đặt hàng */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full mt-2 py-3.5 bg-[#171613] hover:bg-[#8A7158] text-white text-xs uppercase font-semibold tracking-[0.05em] rounded-xl shadow-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                <Lock className="w-4 h-4" />
                <span>{isSubmitting ? 'Đang xử lý đặt hàng...' : 'Xác Nhận Đặt Hàng'}</span>
              </button>

              <div className="text-center text-[10px] text-[#A8A29E] flex items-center justify-center gap-1 mt-1">
                <span>Dữ liệu đơn hàng được bảo mật và đồng bộ với hệ thống quản trị TADA!</span>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
