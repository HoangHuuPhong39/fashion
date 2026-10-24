import React from 'react';
import Link from 'next/link';
import { Cookie, Shield, CheckCircle2, ChevronRight, Info } from 'lucide-react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Chính sách Cookie | TADA! Fashion',
  description: 'Chính sách sử dụng Cookie và công nghệ lưu trữ dữ liệu tại TADA! Fashion.',
};

export default function CookiesPage() {
  return (
    <div className="bg-[#FAF8F3] min-h-screen py-16 text-[#171613]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="flex items-center space-x-2 text-xs text-[#747069] mb-8">
          <Link href="/" className="hover:text-[#171613] transition-colors">
            Trang chủ
          </Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-[#171613] font-medium">Chính sách Cookie</span>
        </nav>

        {/* Title */}
        <div className="border-b border-[#E5E0D8] pb-6 mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#171613] text-[#FAF8F3] rounded-full text-xs uppercase tracking-wider mb-4">
            <Cookie className="w-3.5 h-3.5 text-[#C7A66A]" />
            Bảo Mật & Trải Nghiệm Người Dùng
          </div>
          <h1 className="font-editorial text-3xl sm:text-4xl font-bold text-[#171613] tracking-tight">
            Chính Sách Cookie
          </h1>
          <p className="text-xs text-[#747069] mt-2">
            Cập nhật lần cuối: Tháng 10/2026 | Phiên bản dành cho khách hàng TADA! Fashion
          </p>
        </div>

        {/* Content */}
        <div className="space-y-8 text-sm leading-relaxed text-[#3A3834]">
          <section className="bg-white p-6 rounded-lg border border-[#E5E0D8] shadow-xs">
            <h2 className="font-editorial text-lg font-bold text-[#171613] mb-3 flex items-center gap-2">
              <Info className="w-5 h-5 text-[#C7A66A]" />
              1. Cookie là gì?
            </h2>
            <p>
              Cookie là các tệp văn bản nhỏ được lưu trữ trên trình duyệt hoặc thiết bị của bạn khi bạn truy cập
              vào trang web <strong>TADA! Fashion</strong>. Chúng giúp trang web nhận biết thiết bị của bạn, ghi nhớ
              tùy chọn cá nhân và giỏ hàng thời trang qua các lần truy cập, từ đó mang lại trải nghiệm mua sắm mượt mà nhất.
            </p>
          </section>

          <section className="bg-white p-6 rounded-lg border border-[#E5E0D8] shadow-xs">
            <h2 className="font-editorial text-lg font-bold text-[#171613] mb-3 flex items-center gap-2">
              <Shield className="w-5 h-5 text-[#C7A66A]" />
              2. Các loại Cookie & Bộ nhớ TADA! Fashion sử dụng
            </h2>
            <div className="space-y-4">
              <div className="p-4 bg-[#FAF8F3] rounded border border-[#E5E0D8]">
                <h3 className="font-semibold text-xs uppercase text-[#171613] tracking-wider mb-1">
                  Cookie Cần thiết (Strictly Necessary) - `tada_session`
                </h3>
                <p className="text-xs text-[#747069]">
                  Cookie bảo mật phiên đăng nhập, được gắn cờ <code>HttpOnly</code> và <code>SameSite=Lax</code>.
                  Đây là cookie bắt buộc để xác thực danh tính, bảo vệ tài khoản khỏi tấn công chiếm phiên (session hijacking).
                </p>
              </div>

              <div className="p-4 bg-[#FAF8F3] rounded border border-[#E5E0D8]">
                <h3 className="font-semibold text-xs uppercase text-[#171613] tracking-wider mb-1">
                  Bộ nhớ Giỏ hàng & Yêu thích (LocalStorage) - `tada_cart`, `tada_wishlist`
                </h3>
                <p className="text-xs text-[#747069]">
                  Lưu trữ danh sách các trang phục quý khách đã thêm vào giỏ hàng hoặc danh sách yêu thích
                  để không bị mất khi đóng trình duyệt hoặc tải lại trang.
                </p>
              </div>

              <div className="p-4 bg-[#FAF8F3] rounded border border-[#E5E0D8]">
                <h3 className="font-semibold text-xs uppercase text-[#171613] tracking-wider mb-1">
                  Cookie Tra cứu Đơn hàng Vừa tạo - `tada_recent_order`
                </h3>
                <p className="text-xs text-[#747069]">
                  Cookie tạm thời (tự hết hạn sau 1 giờ) hỗ trợ khách hàng không đăng nhập có thể xem biên nhận
                  và trạng thái đơn hàng của chính mình ngay sau khi đặt hàng thành công.
                </p>
              </div>
            </div>
          </section>

          <section className="bg-white p-6 rounded-lg border border-[#E5E0D8] shadow-xs">
            <h2 className="font-editorial text-lg font-bold text-[#171613] mb-3 flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-[#C7A66A]" />
              3. Quản lý và Tắt Cookie
            </h2>
            <p className="mb-3">
              Quý khách có quyền chấp nhận hoặc từ chối cookie bất cứ lúc nào thông qua cài đặt của trình duyệt
              (Google Chrome, Safari, Firefox, Microsoft Edge).
            </p>
            <p className="text-xs text-[#747069] bg-[#FAF8F3] p-3 rounded border border-[#E5E0D8]">
              <strong>Lưu ý:</strong> Nếu quý khách vô hiệu hóa hoàn toàn Cookie trên trình duyệt, các tính năng cốt lõi
              như đăng nhập thành viên TADA!, duy trì giỏ hàng và thanh toán trực tuyến có thể không hoạt động chính xác.
            </p>
          </section>

          <section className="bg-[#171613] text-[#FAF8F3] p-6 rounded-lg border border-[#2A2925]">
            <h2 className="font-editorial text-lg font-bold text-[#C7A66A] mb-2">
              4. Liên hệ bộ phận Bảo mật & Dữ liệu
            </h2>
            <p className="text-xs text-[#E8D7BD]/80 mb-4">
              Nếu quý khách có bất kỳ câu hỏi nào về chính sách cookie và bảo vệ dữ liệu cá nhân, vui lòng liên hệ:
            </p>
            <div className="text-xs space-y-1 text-[#FAF8F3]">
              <p>Email: <strong>{process.env.NEXT_PUBLIC_CONTACT_EMAIL || 'contact@tada.vn'}</strong></p>
              <p>Hotline: <strong>{process.env.NEXT_PUBLIC_HOTLINE || '0366861159'}</strong></p>
              <p>Địa chỉ: 68 Đồng Khởi, Bến Nghé, Quận 1, TP. Hồ Chí Minh</p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
