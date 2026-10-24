import React from 'react';
import Link from 'next/link';
import { FileText, ArrowLeft } from 'lucide-react';

export const metadata = {
  title: 'Điều Khoản Dịch Vụ | TADA! Fashion Atelier',
  description: 'Quy định và điều khoản sử dụng nền tảng thời trang cao cấp TADA!.'
};

export default function TermsPage() {
  return (
    <div className="bg-[#FAF8F3] min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto space-y-8 bg-white p-6 sm:p-10 rounded-2xl border border-[#E8E4DC] shadow-xs">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs text-[#8A7158] hover:text-[#171613] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Quay lại trang chủ</span>
        </Link>

        <div className="space-y-3 pb-6 border-b border-[#E8E4DC]">
          <div className="flex items-center gap-2 text-[#8A7158] text-xs font-bold uppercase tracking-wider">
            <FileText className="w-5 h-5" />
            <span>Thỏa Thuận Sử Dụng</span>
          </div>
          <h1 className="font-editorial text-3xl font-medium text-[#171613]">
            Điều Khoản Dịch Vụ
          </h1>
          <p className="text-xs text-[#747069]">
            Cập nhật lần cuối: Tháng 10/2026. Bản nháp điều khoản dịch vụ áp dụng cho tất cả khách hàng giao dịch tại TADA!.
          </p>
        </div>

        <div className="space-y-6 text-xs text-[#3A3834] leading-relaxed">
          <section className="space-y-2">
            <h2 className="font-editorial text-base font-semibold text-[#171613]">
              1. Chấp thuận điều khoản
            </h2>
            <p>
              Bằng việc truy cập, tạo tài khoản và đặt mua sản phẩm tại TADA!, quý khách đồng ý tuân thủ toàn bộ các điều khoản và quy định được nêu rõ tại trang này.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="font-editorial text-base font-semibold text-[#171613]">
              2. Đặt hàng và xác nhận giá cả
            </h2>
            <p>
              Giá niêm yết trên website là giá thanh toán chính thức đã bao gồm chiết khấu áp dụng theo chương trình hoặc cấp bậc Hội viên. Chúng tôi có quyền từ chối hoặc hủy đơn hàng nếu phát hiện có hành vi gian lận giá, can thiệp mã nguồn hoặc thông tin thanh toán không xác thực.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="font-editorial text-base font-semibold text-[#171613]">
              3. Chính sách đổi trả và hoàn tiền
            </h2>
            <p>
              TADA! hỗ trợ đổi size và mẫu trong vòng 7 ngày kể từ ngày nhận hàng đối với sản phẩm còn nguyên tem mác, chưa qua sử dụng hoặc giặt tẩy. Các chi tiết cụ thể xem thêm tại mục Chính Sách Đổi Trả.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
