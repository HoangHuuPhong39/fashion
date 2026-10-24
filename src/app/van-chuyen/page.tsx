import React from 'react';
import { Metadata } from 'next';
import Link from 'next/link';
import { ChevronRight, Truck, Clock, ShieldCheck, MapPin, Globe } from 'lucide-react';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://tada-fashion.vn';

export const metadata: Metadata = {
  title: 'Chính Sách Vận Chuyển & Giao Nhận Toàn Quốc | TADA! Fashion Atelier',
  description:
    'Thông tin chính sách giao hàng toàn quốc tại TADA! Fashion Atelier. Miễn phí vận chuyển cho đơn hàng từ 499.000đ, thời gian giao hàng 1-4 ngày làm việc.',
  alternates: {
    canonical: `${siteUrl}/van-chuyen`,
  },
  openGraph: {
    title: 'Chính Sách Vận Chuyển | TADA! Fashion Atelier',
    description: 'Biểu phí giao hàng, chính sách Freeship và thời gian vận chuyển tại TADA! Atelier.',
    url: `${siteUrl}/van-chuyen`,
  },
};

export default function ShippingPolicyPage() {
  return (
    <div className="bg-[#FAF8F3] min-h-screen py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-10">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-xs text-[#747069]">
          <Link href="/" className="hover:text-[#171613]">Trang chủ</Link>
          <ChevronRight className="w-3 h-3 text-[#747069]" />
          <span className="text-[#171613] font-medium">Chính sách vận chuyển</span>
        </nav>

        {/* Header */}
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <div className="w-12 h-12 rounded-full bg-white border border-[#E8E4DC] flex items-center justify-center mx-auto text-[#8A7158] shadow-xs">
            <Truck className="w-6 h-6" />
          </div>
          <h1 className="font-editorial text-3xl sm:text-4xl font-medium text-[#171613]">
            Chính Sách Giao Nhận &amp; Vận Chuyển
          </h1>
          <p className="text-xs sm:text-sm text-[#747069] leading-relaxed">
            TADA! Fashion Atelier hợp tác cùng các đơn vị chuyển phát nhanh hàng đầu (GHN, GHTK, Viettel Post) để trang phục được đóng gói chuẩn mực và giao tận tay quý khách an toàn nhất.
          </p>
        </div>

        {/* Nội dung */}
        <div className="space-y-6">
          {/* 1. Biểu phí & Freeship */}
          <section className="bg-white rounded-2xl border border-[#E8E4DC] p-6 sm:p-8 space-y-4 shadow-xs">
            <div className="flex items-center justify-between pb-3 border-b border-[#F0ECE1]">
              <h2 className="font-editorial text-xl font-bold text-[#171613]">1. Biểu Phí Giao Hàng Toàn Quốc</h2>
              <span className="px-3 py-1 bg-[#E8F5E9] text-[#15803D] rounded-full text-xs font-bold">
                Freeship đơn &ge; 499.000đ
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="p-4 bg-[#FAF8F3] rounded-xl border border-[#E8E4DC] space-y-2">
                <span className="text-xs font-bold text-[#8A7158] uppercase">Đơn Hàng Dưới 499.000đ</span>
                <div className="text-2xl font-bold text-[#171613] font-mono">30.000đ</div>
                <p className="text-xs text-[#747069]">Đồng giá toàn quốc, áp dụng cho tất cả 63 tỉnh thành Việt Nam.</p>
              </div>

              <div className="p-4 bg-[#E8F5E9]/50 rounded-xl border border-[#C8E6C9] space-y-2">
                <span className="text-xs font-bold text-[#2E7D32] uppercase">Đơn Hàng Từ 499.000đ Trở Lên</span>
                <div className="text-2xl font-bold text-[#15803D] font-mono">0đ (MIỄN PHÍ)</div>
                <p className="text-xs text-[#747069]">TADA! tự động miễn phí vận chuyển 100% tại bước thanh toán.</p>
              </div>
            </div>
          </section>

          {/* 2. Thời gian giao hàng dự kiến */}
          <section className="bg-white rounded-2xl border border-[#E8E4DC] p-6 sm:p-8 space-y-4 shadow-xs">
            <h2 className="font-editorial text-xl font-bold text-[#171613] flex items-center gap-2">
              <Clock className="w-5 h-5 text-[#8A7158]" />
              <span>2. Thời Gian Giao Hàng Dự Kiến</span>
            </h2>
            <div className="divide-y divide-[#F0ECE1] text-xs sm:text-sm">
              <div className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                <span className="font-semibold text-[#171613]">Khu vực Nội thành Hà Nội &amp; TP. Hồ Chí Minh</span>
                <span className="text-[#8A7158] font-mono font-bold">1 - 2 ngày làm việc</span>
              </div>
              <div className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                <span className="font-semibold text-[#171613]">Các tỉnh / thành phố khu vực miền Bắc, Trung, Nam</span>
                <span className="text-[#8A7158] font-mono font-bold">2 - 4 ngày làm việc</span>
              </div>
              <div className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                <span className="font-semibold text-[#171613]">Khu vực huyện xã, vùng sâu vùng xa hoặc hải đảo</span>
                <span className="text-[#8A7158] font-mono font-bold">3 - 5 ngày làm việc</span>
              </div>
              <div className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                <span className="font-semibold text-[#171613]">Đơn đặt hàng quốc tế (Fashion Concierge: Paris, Seoul, Tokyo)</span>
                <span className="text-[#D97706] font-mono font-bold">7 - 14 ngày làm việc</span>
              </div>
            </div>
          </section>

          {/* 3. Quy chuẩn đóng gói & Đồng kiểm */}
          <section className="bg-white rounded-2xl border border-[#E8E4DC] p-6 sm:p-8 space-y-4 shadow-xs">
            <h2 className="font-editorial text-xl font-bold text-[#171613] flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-[#15803D]" />
              <span>3. Đóng Gói Cao Cấp &amp; Quyền Đồng Kiểm</span>
            </h2>
            <p className="text-xs sm:text-sm text-[#747069] leading-relaxed">
              Mỗi thiết kế từ TADA! Atelier trước khi gửi đi đều được ủi hơi nước định hình, bọc trong lớp giấy nến thơm chống ẩm và đặt trang trọng trong hộp carton cứng in logo ép kim.<br /><br />
              <strong>Chính sách đồng kiểm:</strong> Quý khách được quyền mở kiện hàng kiểm tra đúng mẫu mã, màu sắc, size trước khi thanh toán cho nhân viên bưu tá (không thử đồ tại chỗ để giữ gìn vệ sinh trang phục).
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
