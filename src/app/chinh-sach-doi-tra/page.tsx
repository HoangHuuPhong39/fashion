import React from 'react';
import { Metadata } from 'next';
import Link from 'next/link';
import { ChevronRight, RotateCcw, CheckCircle2, AlertTriangle, ShieldCheck, HelpCircle } from 'lucide-react';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://tada-fashion.vn';

export const metadata: Metadata = {
  title: 'Chính Sách Đổi Trả & Bảo Hành 7 Ngày | TADA! Fashion Atelier',
  description:
    'Chính sách đổi hàng linh hoạt trong vòng 7 ngày tại TADA! Fashion Atelier. Hỗ trợ đổi size, đổi mẫu nhanh chóng và minh bạch.',
  alternates: {
    canonical: `${siteUrl}/chinh-sach-doi-tra`,
  },
  openGraph: {
    title: 'Chính Sách Đổi Trả | TADA! Fashion Atelier',
    description: 'Quy trình đổi hàng trong 7 ngày, điều kiện áp dụng và hướng dẫn chi tiết tại TADA! Atelier.',
    url: `${siteUrl}/chinh-sach-doi-tra`,
  },
};

export default function ReturnPolicyPage() {
  return (
    <div className="bg-[#FAF8F3] min-h-screen py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-10">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-xs text-[#747069]">
          <Link href="/" className="hover:text-[#171613]">Trang chủ</Link>
          <ChevronRight className="w-3 h-3 text-[#747069]" />
          <span className="text-[#171613] font-medium">Chính sách đổi trả</span>
        </nav>

        {/* Header */}
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <div className="w-12 h-12 rounded-full bg-white border border-[#E8E4DC] flex items-center justify-center mx-auto text-[#8A7158] shadow-xs">
            <RotateCcw className="w-6 h-6" />
          </div>
          <h1 className="font-editorial text-3xl sm:text-4xl font-medium text-[#171613]">
            Chính Sách Đổi Trả &amp; Bảo Hành Trang Phục
          </h1>
          <p className="text-xs sm:text-sm text-[#747069] leading-relaxed">
            Nhằm đảm bảo sự hài lòng tuyệt đối của quý khách, TADA! Fashion Atelier hỗ trợ đổi size, đổi mẫu trong vòng <strong>07 ngày</strong> kể từ ngày nhận hàng.
          </p>
        </div>

        {/* Nội dung chính */}
        <div className="space-y-6">
          {/* 1. Điều kiện đổi trả */}
          <section className="bg-white rounded-2xl border border-[#E8E4DC] p-6 sm:p-8 space-y-4 shadow-xs">
            <h2 className="font-editorial text-xl font-bold text-[#171613] flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-[#15803D]" />
              <span>1. Điều Kiện Tiếp Nhận Đổi Hàng</span>
            </h2>
            <ul className="space-y-2 text-xs sm:text-sm text-[#747069] list-disc pl-5 leading-relaxed">
              <li>Sản phẩm còn trong thời hạn <strong>07 ngày</strong> kể từ khi khách hàng ký nhận từ đơn vị vận chuyển.</li>
              <li>Sản phẩm còn nguyên tem mác thương hiệu (Hangtag), dây niêm phong, khuy phụ và bao bì hộp đựng cao cấp của TADA!.</li>
              <li>Sản phẩm chưa qua giặt ủi, không có mùi lạ (nước hoa, mỹ phẩm, mùi cơ thể), không bị rách xước hoặc sờn sợi vải do tác động bên ngoài.</li>
              <li>Có hóa đơn mua hàng điện tử hoặc mã đơn hàng (#TADA-...) trùng khớp với hệ thống.</li>
            </ul>
          </section>

          {/* 2. Các trường hợp không áp dụng */}
          <section className="bg-white rounded-2xl border border-[#E8E4DC] p-6 sm:p-8 space-y-4 shadow-xs">
            <h2 className="font-editorial text-xl font-bold text-[#171613] flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-[#D97706]" />
              <span>2. Trường Hợp Miễn Trừ Không Áp Dụng Đổi Trả</span>
            </h2>
            <ul className="space-y-2 text-xs sm:text-sm text-[#747069] list-disc pl-5 leading-relaxed">
              <li>Các thiết kế may đo cá nhân hóa theo số đo riêng (Bespoke / Made-to-measure) hoặc trang phục đã chỉnh sửa theo yêu cầu của khách.</li>
              <li>Sản phẩm thuộc nhóm phụ kiện nhạy cảm, trang sức bạc/vàng hoặc đồ lót vì lý do vệ sinh an toàn.</li>
              <li>Sản phẩm xả kho giảm giá từ 50% trở lên (Final Sale) trừ trường hợp lỗi kỹ thuật xuất phát từ xưởng may.</li>
              <li>Quá thời hạn 07 ngày kể từ khi nhận hàng.</li>
            </ul>
          </section>

          {/* 3. Quy trình đổi hàng 4 bước */}
          <section className="bg-white rounded-2xl border border-[#E8E4DC] p-6 sm:p-8 space-y-6 shadow-xs">
            <h2 className="font-editorial text-xl font-bold text-[#171613] flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-[#8A7158]" />
              <span>3. Quy Trình Đổi Hàng Thuận Tiện</span>
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
              <div className="p-4 bg-[#FAF8F3] rounded-xl border border-[#E8E4DC] space-y-2">
                <span className="w-6 h-6 rounded-full bg-[#171613] text-[#FAF8F3] text-xs font-bold flex items-center justify-center">1</span>
                <h3 className="font-bold text-xs text-[#171613]">Liên Hệ Atelier</h3>
                <p className="text-[11px] text-[#747069]">Nhắn tin qua Zalo Hotline <strong>0366 861 159</strong> hoặc gửi yêu cầu tại trang Liên Hệ.</p>
              </div>

              <div className="p-4 bg-[#FAF8F3] rounded-xl border border-[#E8E4DC] space-y-2">
                <span className="w-6 h-6 rounded-full bg-[#171613] text-[#FAF8F3] text-xs font-bold flex items-center justify-center">2</span>
                <h3 className="font-bold text-xs text-[#171613]">Xác Nhận Yêu Cầu</h3>
                <p className="text-[11px] text-[#747069]">Cung cấp mã đơn hàng và hình ảnh sản phẩm để chuyên viên kiểm tra điều kiện.</p>
              </div>

              <div className="p-4 bg-[#FAF8F3] rounded-xl border border-[#E8E4DC] space-y-2">
                <span className="w-6 h-6 rounded-full bg-[#171613] text-[#FAF8F3] text-xs font-bold flex items-center justify-center">3</span>
                <h3 className="font-bold text-xs text-[#171613]">Gửi Hàng Về Xưởng</h3>
                <p className="text-[11px] text-[#747069]">Đóng gói cẩn thận và gửi về địa chỉ Showroom của TADA! hoặc nhân viên bưu tá đến lấy.</p>
              </div>

              <div className="p-4 bg-[#FAF8F3] rounded-xl border border-[#E8E4DC] space-y-2">
                <span className="w-6 h-6 rounded-full bg-[#171613] text-[#FAF8F3] text-xs font-bold flex items-center justify-center">4</span>
                <h3 className="font-bold text-xs text-[#171613]">Nhận Thiết Kế Mới</h3>
                <p className="text-[11px] text-[#747069]">Sản phẩm mới sẽ được gửi đi trong vòng 24 - 48 giờ làm việc sau khi kiểm định xong.</p>
              </div>
            </div>
          </section>

          {/* 4. Chi phí vận chuyển đổi hàng */}
          <section className="bg-white rounded-2xl border border-[#E8E4DC] p-6 sm:p-8 space-y-3 shadow-xs">
            <h2 className="font-editorial text-xl font-bold text-[#171613]">4. Chi Phí Vận Chuyển Khi Đổi Hàng</h2>
            <p className="text-xs sm:text-sm text-[#747069] leading-relaxed">
              - <strong>Miễn phí 100%</strong> phí ship 2 chiều nếu sản phẩm bị lỗi từ xưởng (bung chỉ, sai thông số may đo, giao nhầm mẫu/size).<br />
              - Trường hợp quý khách có nhu cầu đổi size hoặc đổi sang mẫu khác theo sở thích cá nhân, quý khách chỉ cần thanh toán phí ship 1 chiều gửi về xưởng (chiều gửi đi TADA! hỗ trợ).
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
