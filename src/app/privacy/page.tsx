import React from 'react';
import Link from 'next/link';
import { ShieldCheck, ArrowLeft } from 'lucide-react';

export const metadata = {
  title: 'Chính Sách Bảo Mật Thông Tin | TADA! Fashion Atelier',
  description: 'Cam kết bảo vệ dữ liệu cá nhân và an toàn thông tin khách hàng tại TADA! Fashion.'
};

export default function PrivacyPage() {
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
            <ShieldCheck className="w-5 h-5" />
            <span>Chính Sách & Quy Định</span>
          </div>
          <h1 className="font-editorial text-3xl font-medium text-[#171613]">
            Chính Sách Bảo Mật Thông Tin
          </h1>
          <p className="text-xs text-[#747069]">
            Cập nhật lần cuối: Tháng 10/2026. Bản nháp chính sách bảo vệ dữ liệu khách hàng của TADA! Fashion Atelier.
          </p>
        </div>

        <div className="space-y-6 text-xs text-[#3A3834] leading-relaxed">
          <section className="space-y-2">
            <h2 className="font-editorial text-base font-semibold text-[#171613]">
              1. Mục đích thu thập thông tin
            </h2>
            <p>
              TADA! thu thập các thông tin bao gồm Họ tên, Số điện thoại, Địa chỉ nhận hàng và Email khi quý khách thực hiện giao dịch hoặc đăng ký tài khoản. Thông tin này chỉ được sử dụng nhằm mục đích:
            </p>
            <ul className="list-disc list-inside space-y-1 text-[#5A5650] pl-2">
              <li>Xác nhận, đóng gói và vận chuyển đơn hàng đến tay quý khách.</li>
              <li>Cung cấp thông tin tiến độ giao hàng và chăm sóc sau mua sắm.</li>
              <li>Tích lũy điểm thưởng và nâng hạng Hội viên TADA! Privilege.</li>
            </ul>
          </section>

          <section className="space-y-2">
            <h2 className="font-editorial text-base font-semibold text-[#171613]">
              2. Cam kết bảo mật thông tin
            </h2>
            <p>
              Mọi mật khẩu đều được băm an toàn theo chuẩn công nghiệp (Bcrypt) và phiên đăng nhập được mã hóa SHA-256. Chúng tôi cam kết tuyệt đối không bán, chia sẻ hoặc tiết lộ thông tin cá nhân của quý khách cho bất kỳ bên thứ ba nào vì mục đích thương mại khi chưa có sự đồng ý rõ ràng.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="font-editorial text-base font-semibold text-[#171613]">
              3. Quyền của khách hàng đối với dữ liệu
            </h2>
            <p>
              Quý khách có toàn quyền chỉnh sửa thông tin giao hàng, đổi mật khẩu hoặc yêu cầu khóa/xóa tài khoản cá nhân thông qua trang Quản lý tài khoản hoặc liên hệ Hotline Chăm sóc Khách hàng.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
