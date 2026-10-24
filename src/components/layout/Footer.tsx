'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Mail, Phone, MapPin, ShieldCheck, RefreshCw, Truck, CreditCard, CheckCircle2 } from 'lucide-react';

export const Footer: React.FC = () => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setEmail('');
    }
  };

  return (
    <footer className="bg-[#171613] text-[#FAF8F3] pt-16 pb-8 border-t border-[#2A2925] mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Cam kết 4 trụ cột */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 pb-12 border-b border-[#2A2925] text-xs">
          <div className="flex items-start gap-3">
            <ShieldCheck className="w-6 h-6 text-[#C7A66A] shrink-0 mt-0.5" />
            <div>
              <h5 className="font-medium text-[#FAF8F3] uppercase tracking-wider text-[11px]">
                Nguồn Gốc Minh Bạch
              </h5>
              <p className="text-[#E8D7BD]/70 text-[11px] mt-1">
                Sản phẩm phân phối chính thức từ NTK Việt Nam & Hóa đơn chứng từ mua hàng tại boutique quốc tế.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <Truck className="w-6 h-6 text-[#C7A66A] shrink-0 mt-0.5" />
            <div>
              <h5 className="font-medium text-[#FAF8F3] uppercase tracking-wider text-[11px]">
                Vận Chuyển Toàn Diện
              </h5>
              <p className="text-[#E8D7BD]/70 text-[11px] mt-1">
                Giao hỏa tốc 2-4h nội thành. Miễn phí vận chuyển toàn quốc cho đơn từ 2.000.000đ.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <RefreshCw className="w-6 h-6 text-[#C7A66A] shrink-0 mt-0.5" />
            <div>
              <h5 className="font-medium text-[#FAF8F3] uppercase tracking-wider text-[11px]">
                Đổi Trả Linh Hoạt
              </h5>
              <p className="text-[#E8D7BD]/70 text-[11px] mt-1">
                Đổi size, đổi mẫu trong 7 ngày đối với hàng có sẵn. Bảo vệ quyền lợi đặt hàng order quốc tế.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <CreditCard className="w-6 h-6 text-[#C7A66A] shrink-0 mt-0.5" />
            <div>
              <h5 className="font-medium text-[#FAF8F3] uppercase tracking-wider text-[11px]">
                Thanh Toán Minh Bạch
              </h5>
              <p className="text-[#E8D7BD]/70 text-[11px] mt-1">
                Chuyển khoản VietQR tức thì, COD tiền mặt khi nhận hàng hoặc Thẻ thanh toán quốc tế Visa/Master.
              </p>
            </div>
          </div>
        </div>

        {/* 4 Cột Nội Dung Chính */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 py-12 border-b border-[#2A2925]">
          {/* Cột 1: Thông tin thương hiệu */}
          <div className="lg:col-span-2 space-y-4">
            <div>
              <span className="font-editorial text-2xl tracking-[0.06em] font-bold text-[#FAF8F3] block">
                TADA<span className="text-[#C7A66A]">!</span>
              </span>
              <span className="text-[10px] tracking-[0.12em] text-[#C7A66A] uppercase font-normal">
                Style for your story
              </span>
            </div>
            <p className="text-xs text-[#E8D7BD]/80 leading-relaxed max-w-sm">
              Nền tảng thương mại điện tử thời trang tuyển chọn dành cho người sành điệu. Cầu nối tinh tế giữa các nhà mốt thiết kế đương đại Việt Nam và thế giới thời trang xa xỉ quốc tế.
            </p>
            <div className="space-y-2 text-xs text-[#E8D7BD]/80 pt-2">
              <p className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-[#C7A66A] shrink-0" />
                <span>Showroom: 68 Đồng Khởi, Bến Nghé, Quận 1, TP. Hồ Chí Minh</span>
              </p>
              <p className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-[#C7A66A] shrink-0" />
                <span>Hotline VIP: {process.env.NEXT_PUBLIC_HOTLINE || '0366861159'}</span>
              </p>
              <p className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-[#C7A66A] shrink-0" />
                <span>{process.env.NEXT_PUBLIC_CONTACT_EMAIL || 'contact@tada.vn'}</span>
              </p>
            </div>
          </div>

          {/* Cột 2: Khám phá */}
          <div className="space-y-3">
            <h5 className="font-editorial text-sm font-semibold text-[#C7A66A] uppercase tracking-wider">
              Khám Phá
            </h5>
            <ul className="space-y-2 text-xs text-[#E8D7BD]/80">
              <li><Link href="/ve-chung-toi" className="hover:text-[#FAF8F3] transition-colors">Về Chúng Tôi (Story)</Link></li>
              <li><Link href="/shop?category=nu" className="hover:text-[#FAF8F3] transition-colors">Bộ sưu tập Nữ</Link></li>
              <li><Link href="/shop?category=nam" className="hover:text-[#FAF8F3] transition-colors">Thời trang Nam</Link></li>
              <li><Link href="/collections" className="hover:text-[#FAF8F3] transition-colors">Editorial Lookbook 2026</Link></li>
              <li><Link href="/concierge" className="hover:text-[#FAF8F3] transition-colors">Dịch vụ Fashion Concierge</Link></li>
              <li><Link href="/shop?sale=true" className="hover:text-[#B83A3A] transition-colors">Ưu đãi mùa mới (Sale)</Link></li>
            </ul>
          </div>

          {/* Cột 3: Hỗ trợ & Chính sách */}
          <div className="space-y-3">
            <h5 className="font-editorial text-sm font-semibold text-[#C7A66A] uppercase tracking-wider">
              Chính Sách & Hỗ Trợ
            </h5>
            <ul className="space-y-2 text-xs text-[#E8D7BD]/80">
              <li><Link href="/chinh-sach-doi-tra" className="hover:text-[#FAF8F3] transition-colors">Chính sách đổi trả trong 7 ngày</Link></li>
              <li><Link href="/van-chuyen" className="hover:text-[#FAF8F3] transition-colors">Chính sách giao nhận & Freeship</Link></li>
              <li><Link href="/thanh-toan" className="hover:text-[#FAF8F3] transition-colors">Phương thức thanh toán & VietQR</Link></li>
              <li><Link href="/lien-he" className="hover:text-[#FAF8F3] transition-colors">Liên hệ xưởng & Showroom</Link></li>
              <li><Link href="/order-info" className="hover:text-[#FAF8F3] transition-colors">Quy trình Hàng Order Quốc Tế</Link></li>
            </ul>
          </div>

          {/* Cột 4: Đăng ký nhận tin */}
          <div className="space-y-3">
            <h5 className="font-editorial text-sm font-semibold text-[#C7A66A] uppercase tracking-wider">
              TADA! Privilege
            </h5>
            <p className="text-xs text-[#E8D7BD]/80">
              Nhận thông báo độc quyền về các bộ sưu tập giới hạn và mã giảm giá 10% cho đơn hàng đầu tiên:
            </p>

            {subscribed ? (
              <div className="p-3 bg-[#2A2925] rounded border border-[#C7A66A]/40 text-xs text-[#C7A66A] flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>Cảm ơn bạn đã tham gia TADA! Privilege. Mã: <strong>TADAVIP</strong></span>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="space-y-2">
                <input
                  type="email"
                  required
                  placeholder="Nhập email của bạn..."
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-[#2A2925] border border-[#3A3834] rounded px-3 py-2 text-xs text-[#FAF8F3] placeholder-[#747069] focus:outline-none focus:border-[#C7A66A]"
                />
                <button
                  type="submit"
                  className="w-full py-2 bg-[#C7A66A] hover:bg-[#E8D7BD] text-[#171613] text-xs uppercase font-bold tracking-wider rounded transition-colors"
                >
                  Đăng ký đặc quyền
                </button>
              </form>
            )}

            <div className="pt-2 text-[11px] text-[#747069]">
              Phương thức thanh toán được hỗ trợ:
              <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                <span className="px-2 py-1 bg-[#2A2925] border border-[#3A3834] rounded text-[10px] text-[#FAF8F3]">VietQR</span>
                <span className="px-2 py-1 bg-[#2A2925] border border-[#3A3834] rounded text-[10px] text-[#FAF8F3]">COD Tiền mặt</span>
                <span className="px-2 py-1 bg-[#2A2925] border border-[#3A3834] rounded text-[10px] text-[#FAF8F3]">Visa / Master</span>
                <span className="px-2 py-1 bg-[#2A2925] border border-[#3A3834] rounded text-[10px] text-[#FAF8F3]">Chuyển khoản 24/7</span>
              </div>
            </div>
          </div>
        </div>

        {/* Khu vực Thông Tin Pháp Lý (E-Commerce Compliance) */}
        <div className="pt-8 border-t border-[#2A2925] grid grid-cols-1 md:grid-cols-12 gap-6 items-center text-xs text-[#E8D7BD]/70">
          <div className="md:col-span-8 space-y-1.5 leading-relaxed">
            <p className="font-semibold text-[#FAF8F3]">
              CÔNG TY TNHH THỜI TRANG TADA! ATELIER (VIỆT NAM)
            </p>
            <p>
              • <strong>Mã số doanh nghiệp (MST):</strong> [0123456789 - Chủ shop cập nhật mã số thuế chính thức]
            </p>
            <p>
              • <strong>Địa chỉ trụ sở chính:</strong> [Số 68 Đường Đồng Khởi, Phường Bến Nghé, Quận 1, TP. Hồ Chí Minh]
            </p>
            <p>
              • <strong>Giấy phép ĐKKD:</strong> [Số 0123456789 cấp ngày 01/01/2026 bởi Sở Kế hoạch và Đầu tư TP.HCM]
            </p>
            <p>
              • <strong>Đại diện pháp luật:</strong> [Họ và tên người đại diện pháp luật] — Hotline: {process.env.NEXT_PUBLIC_HOTLINE || '0366861159'}
            </p>
          </div>

          <div className="md:col-span-4 flex md:justify-end items-center gap-3">
            {/* Huy hiệu Đã thông báo Bộ Công Thương */}
            <div className="inline-flex items-center gap-2 px-3 py-2 bg-[#2A2925] border border-[#3A3834] rounded-lg">
              <div className="w-6 h-6 rounded-full bg-[#15803D]/20 text-[#22C55E] flex items-center justify-center text-[10px] font-bold">
                ✓
              </div>
              <div>
                <span className="text-[10px] font-bold text-[#FAF8F3] block leading-tight">ĐÃ THÔNG BÁO</span>
                <span className="text-[9px] text-[#C7A66A] block leading-tight">BỘ CÔNG THƯƠNG</span>
              </div>
            </div>

            {/* Chứng nhận SSL an toàn */}
            <div className="inline-flex items-center gap-2 px-3 py-2 bg-[#2A2925] border border-[#3A3834] rounded-lg">
              <div className="w-6 h-6 rounded-full bg-[#0369A1]/20 text-[#38BDF8] flex items-center justify-center text-[10px] font-bold">
                🔒
              </div>
              <div>
                <span className="text-[10px] font-bold text-[#FAF8F3] block leading-tight">BẢO MẬT SSL</span>
                <span className="text-[9px] text-[#A8A29E] block leading-tight">GIAO DỊCH AN TOÀN</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bản quyền */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between text-[11px] text-[#747069] gap-3">
          <p>© 2026 TADA! Fashion E-Commerce. All rights reserved.</p>
          <div className="flex items-center space-x-6">
            <Link href="/terms" className="hover:text-[#FAF8F3] transition-colors">Điều khoản dịch vụ</Link>
            <Link href="/privacy" className="hover:text-[#FAF8F3] transition-colors">Bảo mật thông tin</Link>
            <Link href="/cookies" className="hover:text-[#FAF8F3] transition-colors">Chính sách Cookie</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
