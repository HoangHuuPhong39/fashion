'use client';

import React from 'react';
import Link from 'next/link';
import { Globe, ShieldCheck, Clock, Plane, FileText, CheckCircle2, ChevronRight, HelpCircle } from 'lucide-react';

export default function OrderInfoPage() {
  return (
    <div className="bg-[#FAF8F3] min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-12">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-xs text-[#747069]">
          <Link href="/" className="hover:text-[#171613]">
            Trang chủ
          </Link>
          <ChevronRight className="w-3 h-3 text-[#747069]" />
          <span className="text-[#171613] font-medium">Quy trình Hàng Order Quốc Tế</span>
        </nav>

        {/* Header */}
        <div className="text-center space-y-3">
          <span className="text-[11px] font-bold text-[#8A7158] uppercase tracking-[0.25em]">
            FASHION CONCIERGE DIRECTORY
          </span>
          <h1 className="font-editorial text-3xl sm:text-4xl lg:text-5xl font-normal text-[#171613]">
            Dịch Vụ Order Thời Trang Quốc Tế
          </h1>
          <p className="text-xs sm:text-sm text-[#747069] max-w-xl mx-auto leading-relaxed">
            Minh bạch từng bước từ lúc đặt cọc, lấy hàng tại boutique nước ngoài cho đến khi giao tận tay bạn tại Việt Nam.
          </p>
        </div>

        {/* 4 Bước Quy Trình Order */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white p-5 rounded-xl border border-[#E8E4DC] shadow-sm">
            <span className="text-2xl font-editorial font-bold text-[#C7A66A] block mb-2">01</span>
            <h3 className="font-editorial text-base font-semibold text-[#171613] mb-1">
              Chọn Mẫu & Cọc 50%
            </h3>
            <p className="text-xs text-[#747069] leading-relaxed">
              Khách hàng đặt hàng trên hệ thống và chuyển khoản cọc 50% qua VietQR để kích hoạt đơn mua.
            </p>
          </div>

          <div className="bg-white p-5 rounded-xl border border-[#E8E4DC] shadow-sm">
            <span className="text-2xl font-editorial font-bold text-[#C7A66A] block mb-2">02</span>
            <h3 className="font-editorial text-base font-semibold text-[#171613] mb-1">
              Mua Tại Boutique
            </h3>
            <p className="text-xs text-[#747069] leading-relaxed">
              Buyer tại Paris/Seoul trực tiếp tới store hãng mua hàng, nhận bill gốc, kiểm tra đường kim mũi chỉ.
            </p>
          </div>

          <div className="bg-white p-5 rounded-xl border border-[#E8E4DC] shadow-sm">
            <span className="text-2xl font-editorial font-bold text-[#C7A66A] block mb-2">03</span>
            <h3 className="font-editorial text-base font-semibold text-[#171613] mb-1">
              Vận Chuyển Bay Air
            </h3>
            <p className="text-xs text-[#747069] leading-relaxed">
              Hàng hóa được đóng thùng chuyên dụng, bảo hiểm 100% và bay về Việt Nam trong 7-10 ngày làm việc.
            </p>
          </div>

          <div className="bg-white p-5 rounded-xl border border-[#E8E4DC] shadow-sm">
            <span className="text-2xl font-editorial font-bold text-[#C7A66A] block mb-2">04</span>
            <h3 className="font-editorial text-base font-semibold text-[#171613] mb-1">
              Kiểm Tra & Giao Hàng
            </h3>
            <p className="text-xs text-[#747069] leading-relaxed">
              TADA! đóng gói hộp signature, giao tận tay bạn. Bạn kiểm tra hóa đơn và thanh toán 50% còn lại.
            </p>
          </div>
        </div>

        {/* Chi Tiết Chính Sách */}
        <div className="bg-[#FAF8F3] border border-[#E8E4DC] rounded-xl p-8 space-y-6 text-xs sm:text-sm text-[#171613] leading-relaxed">
          <section id="deposit" className="space-y-2">
            <h3 className="font-editorial text-xl font-semibold text-[#171613] flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-[#8A7158]" />
              <span>Chính Sách Đặt Cọc & Hủy Đơn</span>
            </h3>
            <p className="text-[#747069]">
              • Đơn hàng Order Quốc Tế cần thanh toán trước 50% giá trị để TADA! tiến hành mua tại hãng nước ngoài.
            </p>
            <p className="text-[#747069]">
              • Trong trường hợp hãng tại nước ngoài hết size hoặc hết hàng, TADA! sẽ hoàn trả 100% số tiền đặt cọc vào tài khoản của quý khách trong vòng 24 giờ làm việc.
            </p>
            <p className="text-[#747069]">
              • Sau khi boutique tại nước ngoài đã xuất hóa đơn mua hàng thành công, đơn hàng không thể hủy ngang vì sản phẩm đã được thanh toán cho hãng.
            </p>
          </section>

          <section id="authenticity" className="space-y-2 pt-4 border-t border-[#E8E4DC]">
            <h3 className="font-editorial text-xl font-semibold text-[#171613] flex items-center gap-2">
              <FileText className="w-5 h-5 text-[#8A7158]" />
              <span>Cam Kết Hóa Đơn & Nguồn Gốc</span>
            </h3>
            <p className="text-[#747069]">
              Mọi sản phẩm order đều đi kèm bill mua hàng từ store chính hãng (Paris, Seoul, Tokyo), dustbag, box và thẻ bảo hành (nếu hãng có cung cấp). Chúng tôi minh bạch thông tin nguồn cung và nói không với hàng không rõ nguồn gốc.
            </p>
          </section>

          <section id="returns" className="space-y-2 pt-4 border-t border-[#E8E4DC]">
            <h3 className="font-editorial text-xl font-semibold text-[#171613] flex items-center gap-2">
              <Clock className="w-5 h-5 text-[#8A7158]" />
              <span>Thời Gian Giao Hàng & Đổi Trả</span>
            </h3>
            <p className="text-[#747069]">
              • Hàng order Hàn Quốc: 7 - 10 ngày làm việc.
            </p>
            <p className="text-[#747069]">
              • Hàng order Pháp / Châu Âu: 8 - 12 ngày làm việc.
            </p>
            <p className="text-[#747069]">
              • Hàng có sẵn trong kho Việt Nam: Giao hỏa tốc 2-4h nội thành và 24-48h toàn quốc.
            </p>
          </section>
        </div>

        <div className="text-center pt-4">
          <Link
            href="/shop?origin=international_order"
            className="px-8 py-3.5 bg-[#171613] hover:bg-[#8A7158] text-[#FAF8F3] text-xs uppercase font-bold tracking-[0.18em] rounded inline-block transition-colors"
          >
            Khám phá danh sách hàng Order Quốc Tế
          </Link>
        </div>
      </div>
    </div>
  );
}
