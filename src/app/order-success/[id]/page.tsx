'use client';

import React, { useState, useEffect, use } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  CheckCircle2,
  Clock,
  Package,
  Truck,
  ArrowRight,
  QrCode,
  ShieldCheck,
  ShoppingBag,
  ArrowLeft,
  Copy,
  Check
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { Order } from '@/types';
import { SafeImage } from '@/components/ui/SafeImage';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function OrderSuccessPage({ params }: PageProps) {
  const resolvedParams = use(params);
  const { orders } = useAuth();
  const [order, setOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [bankInfo, setBankInfo] = useState<{
    bankName: string;
    accountNumber: string;
    accountHolder: string;
    branch?: string;
    hotline?: string;
  }>({
    bankName: 'MBBank',
    accountNumber: '',
    accountHolder: '',
    branch: '',
    hotline: ''
  });

  const BANK_DISPLAY_NAMES: Record<string, string> = {
    MBBank: 'MB Bank (Quân Đội)',
    Techcombank: 'Techcombank (Ngân hàng Kỹ Thương)',
    Vietcombank: 'Vietcombank (Ngoại Thương Việt Nam)',
    VPBank: 'VPBank (Việt Nam Thịnh Vượng)',
    ACB: 'ACB (Á Châu)',
    BIDV: 'BIDV (Đầu Tư & Phát Triển)',
    Agribank: 'Agribank (Nông Nghiệp)',
    TPBank: 'TPBank (Tiên Phong)',
    Sacombank: 'Sacombank (Sài Gòn Thương Tín)',
    VIB: 'VIB (Quốc Tế Việt Nam)'
  };

  useEffect(() => {
    let active = true;

    // Tải cấu hình tài khoản ngân hàng mới nhất do Admin thiết lập
    fetch('/api/bank-info')
      .then((res) => res.json())
      .then((data) => {
        if (active && data.success && data.bankInfo && data.bankInfo.accountNumber) {
          setBankInfo(data.bankInfo);
        }
      })
      .catch((err) => console.error('Error fetching bank info:', err));

    // 1. Thử tìm trong AuthContext
    const found = orders.find((o) => o.id === resolvedParams.id || o.orderCode === resolvedParams.id);
    if (found) {
      queueMicrotask(() => {
        if (active) {
          setOrder(found);
          setIsLoading(false);
        }
      });
      return () => {
        active = false;
      };
    }

    // 2. Fetch từ API nếu chưa có
    fetch(`/api/orders/${resolvedParams.id}`)
      .then((res) => res.json())
      .then((data) => {
        if (active && data.success && data.order) {
          setOrder(data.order);
        }
      })
      .catch((err) => console.error(err))
      .finally(() => {
        if (active) setIsLoading(false);
      });

    return () => {
      active = false;
    };
  }, [resolvedParams.id, orders]);

  const copyToClipboard = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
  };

  if (isLoading) {
    return (
      <div className="bg-[#FAF8F3] min-h-[60vh] py-20 text-center">
        <p className="text-sm text-[#747069]">Đang tải thông tin đơn hàng...</p>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="bg-[#FAF8F3] min-h-[60vh] py-20 text-center space-y-4">
        <h2 className="font-editorial text-2xl text-[#171613]">Không tìm thấy đơn hàng</h2>
        <p className="text-xs text-[#747069]">Đơn hàng không tồn tại hoặc bạn không có quyền xem đơn hàng này.</p>
        <Link
          href="/shop"
          className="inline-block px-5 py-2.5 bg-[#171613] text-white text-xs font-bold rounded-xl"
        >
          Quay lại cửa hàng
        </Link>
      </div>
    );
  }

  const qrAmount = order.depositAmount ? order.depositAmount : order.total;
  const cleanAccNum = bankInfo.accountNumber.replace(/\s+/g, '');
  const qrUrl = `https://img.vietqr.io/image/${bankInfo.bankName}-${cleanAccNum}-compact2.png?amount=${qrAmount}&addInfo=${encodeURIComponent(order.orderCode || 'TADA')}&accountName=${encodeURIComponent(bankInfo.accountHolder)}`;

  const isAwaitingVietQR = order.paymentMethod === 'vietqr' && order.paymentStatus !== 'paid';

  // Xác định trạng thái của từng bước trong 4 bước dựa vào order.status thật
  const getStepData = (stepNumber: 1 | 2 | 3 | 4) => {
    const status = order.status;

    if (status === 'cancelled') {
      if (stepNumber === 1) {
        return {
          title: 'Đặt Hàng',
          desc: 'Hoàn tất',
          state: 'completed' as const
        };
      }
      return {
        title: stepNumber === 2 ? 'Xác Nhận Đơn' : stepNumber === 3 ? 'Đóng Gói & Xuất Kho' : 'Giao Tận Tay',
        desc: 'Đã hủy',
        state: 'cancelled' as const
      };
    }

    if (stepNumber === 1) {
      return {
        title: 'Đặt Hàng',
        desc: 'Hoàn tất',
        state: 'completed' as const
      };
    }

    if (stepNumber === 2) {
      if (status === 'pending_confirmation') {
        return {
          title: 'Xác Nhận Đơn',
          desc: 'Chờ xác nhận',
          state: 'current' as const
        };
      }
      return {
        title: 'Xác Nhận Đơn',
        desc: 'Đã xác nhận',
        state: 'completed' as const
      };
    }

    if (stepNumber === 3) {
      if (status === 'pending_confirmation') {
        return {
          title: 'Đóng Gói & Xuất Kho',
          desc: 'Chuẩn bị hàng',
          state: 'upcoming' as const
        };
      }
      if (status === 'confirmed') {
        return {
          title: 'Đóng Gói & Xuất Kho',
          desc: 'Chờ chuẩn bị',
          state: 'current' as const
        };
      }
      if (status === 'preparing') {
        return {
          title: 'Đóng Gói & Xuất Kho',
          desc: 'Đang đóng gói',
          state: 'current' as const
        };
      }
      return {
        title: 'Đóng Gói & Xuất Kho',
        desc: 'Đã xuất kho',
        state: 'completed' as const
      };
    }

    // stepNumber === 4
    if (status === 'shipping') {
      return {
        title: 'Giao Tận Tay',
        desc: 'Đang giao hàng',
        state: 'current' as const
      };
    }
    if (status === 'delivered') {
      return {
        title: 'Giao Tận Tay',
        desc: 'Đã nhận hàng',
        state: 'completed' as const
      };
    }
    return {
      title: 'Giao Tận Tay',
      desc: 'Nhận hàng',
      state: 'upcoming' as const
    };
  };

  return (
    <div className="bg-[#FAF8F3] min-h-screen py-14 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto space-y-8">
        {/* Banner Trạng Thái Đơn Hàng */}
        <div className="text-center space-y-3">
          {isAwaitingVietQR ? (
            <>
              <div className="w-16 h-16 rounded-full bg-[#D97706]/10 text-[#D97706] flex items-center justify-center mx-auto border border-[#D97706]/30 animate-in zoom-in duration-300">
                <Clock className="w-9 h-9" />
              </div>

              <span className="text-[11px] font-bold text-[#D97706] uppercase tracking-[0.25em]">
                ĐƠN HÀNG ĐANG CHỜ THANH TOÁN
              </span>

              <h1 className="font-editorial text-3xl sm:text-4xl text-[#171613] font-medium">
                Vui Lòng Quét Mã Chuyển Khoản
              </h1>

              <p className="text-xs sm:text-sm text-[#747069] max-w-md mx-auto">
                Mã đơn hàng: <strong className="text-[#171613] font-mono text-base">{order.orderCode}</strong>. Chúng tôi đã ghi nhận đơn hàng và đang chờ bạn hoàn tất thanh toán qua VietQR.
              </p>
            </>
          ) : (
            <>
              <div className="w-16 h-16 rounded-full bg-[#2E4F3E]/10 text-[#2E4F3E] flex items-center justify-center mx-auto border border-[#2E4F3E]/30 animate-in zoom-in duration-300">
                <CheckCircle2 className="w-9 h-9" />
              </div>

              <span className="text-[11px] font-bold text-[#8A7158] uppercase tracking-[0.25em]">
                ĐẶT HÀNG THÀNH CÔNG
              </span>

              <h1 className="font-editorial text-3xl sm:text-4xl text-[#171613] font-medium">
                Cảm Ơn Bạn Đã Chọn TADA!
              </h1>

              <p className="text-xs sm:text-sm text-[#747069] max-w-md mx-auto">
                Mã đơn hàng: <strong className="text-[#171613] font-mono text-base">{order.orderCode}</strong>. Chúng tôi đã ghi nhận đơn hàng vào hệ thống và đang tiến hành xử lý.
              </p>
            </>
          )}
        </div>

        {/* Lộ Trình Tiến Độ Đơn Hàng */}
        <div className="bg-white border border-[#E8E4DC] rounded-2xl p-6 shadow-sm">
          <h2 className="font-editorial text-base font-semibold text-[#171613] mb-6">
            Lộ Trình Xử Lý Đơn Hàng
          </h2>

          <div className="grid grid-cols-4 gap-2 text-center text-xs relative">
            {([1, 2, 3, 4] as const).map((stepNum) => {
              const step = getStepData(stepNum);
              return (
                <div
                  key={stepNum}
                  className={`flex flex-col items-center ${step.state === 'upcoming' ? 'opacity-60' : step.state === 'cancelled' ? 'opacity-60' : ''}`}
                >
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs ${
                      step.state === 'completed'
                        ? 'bg-[#171613] text-[#FAF8F3]'
                        : step.state === 'current'
                        ? 'bg-[#8A7158] text-white shadow-sm ring-4 ring-[#8A7158]/20'
                        : step.state === 'cancelled'
                        ? 'bg-[#FEE2E2] text-[#DC2626]'
                        : 'bg-[#E8E4DC] text-[#747069]'
                    }`}
                  >
                    {step.state === 'completed' ? '✓' : step.state === 'cancelled' ? '✕' : stepNum}
                  </div>
                  <span className={`mt-2 ${step.state === 'upcoming' ? 'font-medium text-[#747069]' : 'font-semibold text-[#171613]'}`}>
                    {step.title}
                  </span>
                  <span
                    className={`text-[10px] ${
                      step.state === 'current'
                        ? 'text-[#8A7158] font-medium'
                        : step.state === 'cancelled'
                        ? 'text-[#DC2626]'
                        : 'text-[#747069]'
                    }`}
                  >
                    {step.desc}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Khung Thanh Toán Chuyển Khoản VietQR (Nếu chọn chuyển khoản) */}
        {order.paymentMethod === 'vietqr' && (
          order.paymentStatus === 'paid' ? (
            <div className="bg-white border border-[#86EFAC] rounded-2xl p-6 shadow-sm flex items-center gap-4 bg-[#F0FDF4]/50">
              <div className="w-12 h-12 rounded-full bg-[#DCFCE7] text-[#15803D] flex items-center justify-center shrink-0">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <div className="space-y-0.5 text-xs">
                <span className="text-[10px] font-bold text-[#15803D] uppercase tracking-wider block">
                  ĐÃ XÁC NHẬN THANH TOÁN
                </span>
                <h3 className="font-editorial text-base font-medium text-[#171613]">
                  Giao Dịch VietQR Thành Công
                </h3>
                <p className="text-[#747069]">
                  Chúng tôi đã nhận đủ số tiền thanh toán cho đơn hàng <strong>{order.orderCode}</strong>. Đơn hàng đang được chuẩn bị để giao tới bạn.
                </p>
              </div>
            </div>
          ) : (
            <div className="bg-white border border-[#E8E4DC] rounded-2xl p-6 sm:p-8 shadow-sm">
            <div className="flex items-center gap-2 text-[#8A7158] font-bold text-xs uppercase tracking-wider mb-2">
              <QrCode className="w-4 h-4 text-[#8A7158]" />
              <span>Cổng Thanh Toán Chuyển Khoản Nhanh VietQR</span>
            </div>

            <h2 className="font-editorial text-xl font-medium text-[#171613]">
              Quét Mã Để Thanh Toán
            </h2>

            <p className="text-xs text-[#747069] mt-1">
              Sử dụng ứng dụng ngân hàng bất kỳ để quét mã QR chuyển tiền chính xác:
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 items-center mt-6 p-4 bg-[#FAF8F3] rounded-xl border border-[#E8E4DC]">
              <div className="relative aspect-square max-w-[220px] mx-auto w-full bg-white p-2 rounded-xl shadow-xs border border-[#E8E4DC]">
                <Image
                  src={qrUrl}
                  alt="VietQR Code"
                  fill
                  className="object-contain p-1"
                  unoptimized
                />
              </div>

              <div className="space-y-3 text-xs text-[#171613]">
                <div>
                  <span className="text-[#747069] block text-[11px]">Ngân hàng:</span>
                  <strong className="text-sm font-semibold text-[#171613]">
                    {BANK_DISPLAY_NAMES[bankInfo.bankName] || bankInfo.bankName}
                  </strong>
                  {bankInfo.branch && (
                    <span className="block text-[11px] text-[#747069]">{bankInfo.branch}</span>
                  )}
                </div>

                <div>
                  <span className="text-[#747069] block text-[11px]">Số tài khoản:</span>
                  <div className="flex items-center gap-2 mt-0.5">
                    <strong className="text-base font-mono text-[#171613] bg-white px-2.5 py-1 rounded border border-[#E8E4DC] inline-block tracking-wider">
                      {bankInfo.accountNumber}
                    </strong>
                    <button
                      type="button"
                      onClick={() => copyToClipboard(cleanAccNum, 'acc')}
                      className="p-1.5 hover:bg-white text-[#747069] hover:text-[#171613] rounded border border-[#E8E4DC] transition-colors flex items-center gap-1 text-[11px]"
                      title="Sao chép số tài khoản"
                    >
                      {copiedField === 'acc' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedField === 'acc' ? 'Đã chép' : 'Chép'}</span>
                    </button>
                  </div>
                </div>

                <div>
                  <span className="text-[#747069] block text-[11px]">Chủ tài khoản:</span>
                  <strong className="uppercase font-bold tracking-wide">
                    {bankInfo.accountHolder}
                  </strong>
                </div>

                <div>
                  <span className="text-[#747069] block text-[11px]">Số tiền cần thanh toán:</span>
                  <strong className="text-base text-[#B83A3A] font-bold">
                    {formatPrice(qrAmount)}
                  </strong>
                </div>

                <div>
                  <span className="text-[#747069] block text-[11px]">Nội dung chuyển khoản (bắt buộc):</span>
                  <div className="flex items-center gap-2 mt-0.5">
                    <strong className="font-mono text-xs bg-white px-2.5 py-1 rounded border border-[#E8E4DC] inline-block font-bold">
                      {order.orderCode}
                    </strong>
                    <button
                      type="button"
                      onClick={() => copyToClipboard(order.orderCode, 'code')}
                      className="p-1.5 hover:bg-white text-[#747069] hover:text-[#171613] rounded border border-[#E8E4DC] transition-colors flex items-center gap-1 text-[11px]"
                      title="Sao chép nội dung"
                    >
                      {copiedField === 'code' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedField === 'code' ? 'Đã chép' : 'Chép'}</span>
                    </button>
                  </div>
                </div>

                {bankInfo.hotline && (
                  <div className="pt-2 border-t border-[#E8E4DC]/60 text-[11px] text-[#747069]">
                    Hotline / Zalo hỗ trợ thanh toán: <strong className="text-[#171613] font-mono">{bankInfo.hotline}</strong>
                  </div>
                )}
              </div>
            </div>
          </div>
          )
        )}

        {/* Chi Tiết Mặt Hàng & Địa Chỉ Nhận Hàng */}
        <div className="bg-white border border-[#E8E4DC] rounded-2xl p-6 space-y-6 shadow-sm">
          <h2 className="font-editorial text-lg font-semibold text-[#171613] pb-3 border-b border-[#F0ECE1]">
            Chi Tiết Đơn Hàng
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs bg-[#FAF8F3] p-4 rounded-xl border border-[#E8E4DC]">
            <div>
              <span className="font-bold text-[#171613] block mb-1">Người nhận hàng:</span>
              <p><strong>{order.shippingAddress.fullName}</strong></p>
              <p>SĐT: {order.shippingAddress.phone}</p>
              <p>Email: {order.shippingAddress.email}</p>
            </div>
            <div>
              <span className="font-bold text-[#171613] block mb-1">Địa chỉ nhận hàng:</span>
              <p>{order.shippingAddress.address}</p>
              <p>{order.shippingAddress.ward}, {order.shippingAddress.district}, {order.shippingAddress.city}</p>
            </div>
          </div>

          <div className="divide-y divide-[#E8E4DC]">
            {order.items.map((item, idx) => (
              <div key={idx} className="py-3 flex items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-3">
                  <div className="relative w-12 h-14 rounded overflow-hidden bg-[#FAF8F3] border border-[#E8E4DC] shrink-0">
                    <SafeImage src={item.image} alt="" fill className="object-cover" sizes="48px" />
                  </div>
                  <div>
                    <div className="font-semibold text-[#171613]">{item.productName}</div>
                    <div className="text-[11px] text-[#747069]">
                      {item.color} - Size {item.size} × {item.quantity}
                    </div>
                  </div>
                </div>
                <div className="text-right font-bold text-[#171613]">
                  {formatPrice(item.price * item.quantity)}
                </div>
              </div>
            ))}
          </div>

          <div className="pt-3 border-t border-[#E8E4DC] space-y-1.5 text-right text-xs">
            <div className="flex justify-between">
              <span className="text-[#747069]">Tạm tính:</span>
              <span>{formatPrice(order.subtotal)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#747069]">Phí giao hàng:</span>
              <span>{formatPrice(order.shippingFee)}</span>
            </div>
            {order.discountAmount > 0 && (
              <div className="flex justify-between text-[#15803D]">
                <span>Giảm giá:</span>
                <span>-{formatPrice(order.discountAmount)}</span>
              </div>
            )}
            <div className="flex justify-between text-sm font-bold text-[#B83A3A] pt-2 border-t border-[#E8E4DC]">
              <span>Tổng thanh toán:</span>
              <span>{formatPrice(order.total)}</span>
            </div>
          </div>
        </div>

        {/* Nút Điều Hướng Tiếp Tục */}
        <div className="flex items-center justify-center gap-4 pt-2">
          <Link
            href="/account"
            className="px-6 py-3 bg-[#171613] hover:bg-[#8A7158] text-white text-xs font-bold uppercase tracking-wider rounded-xl transition-colors shadow-sm"
          >
            Theo Dõi Đơn Hàng Trong Tài Khoản
          </Link>
          <Link
            href="/shop"
            className="px-6 py-3 bg-white hover:bg-[#FAF8F3] border border-[#E8E4DC] text-[#171613] text-xs font-bold uppercase tracking-wider rounded-xl transition-colors"
          >
            Tiếp Tục Mua Sắm
          </Link>
        </div>
      </div>
    </div>
  );
}
