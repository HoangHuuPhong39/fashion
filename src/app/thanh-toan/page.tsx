import React from 'react';
import { Metadata } from 'next';
import Link from 'next/link';
import { ChevronRight, CreditCard, QrCode, ShoppingBag, ShieldCheck, CheckCircle2 } from 'lucide-react';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://tada-fashion.vn';

export const metadata: Metadata = {
  title: 'Phương Thức Thanh Toán & Hướng Dẫn VietQR | TADA! Fashion Atelier',
  description:
    'Hướng dẫn các hình thức thanh toán an toàn tại TADA! Fashion Atelier: Tiền mặt COD khi nhận hàng, Chuyển khoản VietQR tự động 24/7 và Thẻ tín dụng quốc tế.',
  alternates: {
    canonical: `${siteUrl}/thanh-toan`,
  },
  openGraph: {
    title: 'Phương Thức Thanh Toán | TADA! Fashion Atelier',
    description: 'Thanh toán bảo mật, thuận tiện và tự động hóa tại TADA! Atelier.',
    url: `${siteUrl}/thanh-toan`,
  },
};

export default function PaymentGuidePage() {
  return (
    <div className="bg-[#FAF8F3] min-h-screen py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-10">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-xs text-[#747069]">
          <Link href="/" className="hover:text-[#171613]">Trang chủ</Link>
          <ChevronRight className="w-3 h-3 text-[#747069]" />
          <span className="text-[#171613] font-medium">Phương thức thanh toán</span>
        </nav>

        {/* Header */}
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <div className="w-12 h-12 rounded-full bg-white border border-[#E8E4DC] flex items-center justify-center mx-auto text-[#8A7158] shadow-xs">
            <CreditCard className="w-6 h-6" />
          </div>
          <h1 className="font-editorial text-3xl sm:text-4xl font-medium text-[#171613]">
            Hướng Dẫn &amp; Phương Thức Thanh Toán
          </h1>
          <p className="text-xs sm:text-sm text-[#747069] leading-relaxed">
            TADA! Fashion Atelier hỗ trợ đa dạng phương thức thanh toán an toàn, ứng dụng công nghệ quét mã QR động xác nhận tự động chỉ trong vài giây.
          </p>
        </div>

        {/* 3 Phương Thức */}
        <div className="space-y-6">
          {/* 1. Chuyển khoản VietQR */}
          <section className="bg-white rounded-2xl border border-[#C7A66A]/60 p-6 sm:p-8 space-y-4 shadow-xs relative overflow-hidden">
            <div className="absolute top-0 right-0 bg-[#8A7158] text-[#FAF8F3] text-[10px] font-bold px-3 py-1 rounded-bl-lg tracking-wider uppercase">
              Khuyên Dùng &bull; Tự Động 24/7
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#FAF8F3] border border-[#E8E4DC] flex items-center justify-center text-[#8A7158]">
                <QrCode className="w-5 h-5" />
              </div>
              <div>
                <h2 className="font-editorial text-xl font-bold text-[#171613]">
                  1. Chuyển Khoản Ngân Hàng VietQR (Tự Động)
                </h2>
                <p className="text-xs text-[#747069]">Xác nhận đơn ngay lập tức qua Napas247, không cần gửi ảnh bill</p>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-[#747069] leading-relaxed">
              Sau khi bấm &ldquo;Đặt Hàng&rdquo;, màn hình sẽ hiển thị mã QR động được tạo riêng cho đơn của bạn kèm sẵn số tiền và nội dung chuyển khoản. Bạn chỉ cần mở ứng dụng ngân hàng bất kỳ (Vietcombank, MBBank, Techcombank, VPBank...) hoặc ví điện tử để quét mã.
            </p>

            <div className="bg-[#FAF8F3] p-4 rounded-xl border border-[#E8E4DC] text-xs space-y-1.5">
              <div><strong>Ngân hàng thụ hưởng:</strong> MBBank (Ngân hàng TMCP Quân Đội)</div>
              <div><strong>Số tài khoản:</strong> <span className="font-mono font-bold text-[#171613]">0366861159</span></div>
              <div><strong>Chủ tài khoản:</strong> <span className="font-bold text-[#171613]">TADA FASHION ATELIER</span></div>
              <div className="text-[11px] text-[#8A7158] pt-1">
                * Hệ thống tự động xác nhận sau 3 - 10 giây khi tiền vào tài khoản và cập nhật trạng thái đơn thành công.
              </div>
            </div>
          </section>

          {/* 2. Tiền mặt COD */}
          <section className="bg-white rounded-2xl border border-[#E8E4DC] p-6 sm:p-8 space-y-4 shadow-xs">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#FAF8F3] border border-[#E8E4DC] flex items-center justify-center text-[#8A7158]">
                <ShoppingBag className="w-5 h-5" />
              </div>
              <div>
                <h2 className="font-editorial text-xl font-bold text-[#171613]">
                  2. Thanh Toán Tiền Mặt Khi Nhận Hàng (COD)
                </h2>
                <p className="text-xs text-[#747069]">Kiểm tra kiện hàng an tâm trước khi gửi tiền cho bưu tá</p>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-[#747069] leading-relaxed">
              Quý khách thanh toán trực tiếp số tiền ghi trên hóa đơn bọc hàng cho nhân viên giao vận khi nhận trang phục. Áp dụng cho mọi đơn hàng giao tận nơi trên toàn lãnh thổ Việt Nam.
            </p>
          </section>

          {/* 3. Thẻ quốc tế */}
          <section className="bg-white rounded-2xl border border-[#E8E4DC] p-6 sm:p-8 space-y-4 shadow-xs">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#FAF8F3] border border-[#E8E4DC] flex items-center justify-center text-[#8A7158]">
                <CreditCard className="w-5 h-5" />
              </div>
              <div>
                <h2 className="font-editorial text-xl font-bold text-[#171613]">
                  3. Thẻ Tín Dụng &amp; Ghi Nợ Quốc Tế (Visa, Mastercard, JCB)
                </h2>
                <p className="text-xs text-[#747069]">Bảo mật tiêu chuẩn PCI-DSS và xác thực OTP 3D-Secure</p>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-[#747069] leading-relaxed">
              Mọi giao dịch thanh toán trực tuyến qua thẻ tại TADA! đều được mã hóa SSL/TLS 256-bit. Hệ thống không lưu trữ thông tin số thẻ hay mã CVV của khách hàng, đảm bảo tính bảo mật tuyệt đối.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
