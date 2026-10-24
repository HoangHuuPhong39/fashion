import Link from 'next/link';
import { ArrowLeft, ShoppingBag } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center bg-[#FAF8F3] px-4 py-16">
      <div className="max-w-md w-full text-center space-y-6">
        <div className="w-16 h-16 rounded-full bg-[#EAE5DC] flex items-center justify-center mx-auto text-[#171613]">
          <ShoppingBag className="w-8 h-8 text-[#8A7158]" />
        </div>
        <div className="space-y-2">
          <span className="text-xs font-bold tracking-widest text-[#8A7158] uppercase">404 — Trang Không Tồn Tại</span>
          <h1 className="font-editorial text-3xl font-medium text-[#171613]">
            Không Tìm Thấy Trang Yêu Cầu
          </h1>
          <p className="text-xs text-[#747069] leading-relaxed">
            Đường dẫn bạn vừa truy cập có thể đã được thay đổi, xóa bỏ hoặc tạm thời không khả dụng.
          </p>
        </div>
        <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            href="/"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 bg-[#171613] text-[#FAF8F3] text-xs font-medium rounded-xl hover:bg-[#2C2A24] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Về trang chủ</span>
          </Link>
          <Link
            href="/shop"
            className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-3 bg-white border border-[#E8E4DC] text-[#171613] text-xs font-medium rounded-xl hover:bg-[#FAF8F3] transition-colors"
          >
            Khám phá bộ sưu tập
          </Link>
        </div>
      </div>
    </div>
  );
}
