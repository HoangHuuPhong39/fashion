import React from 'react';
import Link from 'next/link';
import { Metadata } from 'next';
import {
  Globe,
  ShieldCheck,
  Clock,
  Plane,
  ChevronRight,
  Headphones,
  CheckCircle2,
  FileText,
  Search,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { SafeImage } from '@/components/ui/SafeImage';
import { ConciergeInteractive } from '@/components/concierge/ConciergeInteractive';

export const metadata: Metadata = {
  title: 'Fashion Concierge Service | TADA! Fashion Atelier',
  description:
    'Dịch vụ cá nhân hóa tìm kiếm, thẩm định và đặt mua thời trang cao cấp quốc tế từ Paris, Milan, London, Seoul, Tokyo về Việt Nam.',
  alternates: {
    canonical: 'https://tada-fashion.vn/concierge'
  },
  openGraph: {
    title: 'Fashion Concierge Service | TADA! Fashion Atelier',
    description:
      'Dịch vụ cá nhân hóa tìm kiếm, thẩm định và đặt mua thời trang cao cấp quốc tế theo yêu cầu.',
    url: 'https://tada-fashion.vn/concierge',
    siteName: 'TADA! Fashion Atelier'
  }
};

export default function ConciergePage() {
  const hotline = process.env.NEXT_PUBLIC_HOTLINE || '0366861159';
  const contactEmail = process.env.NEXT_PUBLIC_CONTACT_EMAIL || 'contact@tada.vn';

  return (
    <div className="bg-[#FAF8F3] min-h-screen">
      {/* Hero Banner */}
      <div className="relative bg-[#171613] text-[#FAF8F3] py-20 px-4 sm:px-6 lg:px-8 border-b border-[#2A2925] overflow-hidden">
        <div className="absolute inset-0 opacity-20 pointer-events-none">
          <SafeImage
            src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1600&auto=format&fit=crop&q=80"
            alt="Fashion Concierge Background"
            fill
            className="object-cover"
          />
        </div>

        <div className="relative max-w-7xl mx-auto">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-xs text-[#E8D7BD]/80 mb-6">
            <Link href="/" className="hover:text-[#FAF8F3]">
              Trang chủ
            </Link>
            <ChevronRight className="w-3 h-3 text-[#747069]" />
            <span className="text-[#C7A66A] font-medium">Fashion Concierge</span>
          </nav>

          <div className="max-w-3xl space-y-4">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#C7A66A]/20 text-[#C7A66A] text-[10px] font-bold tracking-[0.25em] uppercase rounded">
              <Sparkles className="w-3.5 h-3.5" />
              DỊCH VỤ THỜI TRANG ĐẶC QUYỀN CAO CẤP
            </div>

            <h1 className="font-editorial text-4xl sm:text-5xl lg:text-6xl text-[#FAF8F3] font-light leading-tight">
              TADA! Fashion Concierge 24/7
            </h1>

            <p className="text-sm sm:text-base text-[#E8D7BD]/80 leading-relaxed font-light max-w-2xl">
              Tìm kiếm, tuyển chọn và vận chuyển những thiết kế hiếm, giới hạn hoặc phiên bản runway độc quyền từ các kinh đô thời trang Paris, Milan, London, Seoul và Tokyo trực tiếp tới tay bạn.
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8 space-y-16">
        {/* 4 Trụ Cột Cam Kết */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-2xl border border-[#E8E4DC] shadow-xs space-y-3">
            <div className="w-10 h-10 rounded-xl bg-[#FAF8F3] flex items-center justify-center text-[#8A7158]">
              <Search className="w-5 h-5" />
            </div>
            <h3 className="font-editorial text-lg font-medium text-[#171613]">
              Săn Tìm Độc Bản
            </h3>
            <p className="text-xs text-[#747069] leading-relaxed">
              Mạng lưới personal shopper chuyên nghiệp trực tiếp tại Pháp, Ý, Hàn Quốc và Nhật Bản tiếp cận kho hàng VIP và các bộ sưu tập sold-out.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-[#E8E4DC] shadow-xs space-y-3">
            <div className="w-10 h-10 rounded-xl bg-[#FAF8F3] flex items-center justify-center text-[#8A7158]">
              <FileText className="w-5 h-5" />
            </div>
            <h3 className="font-editorial text-lg font-medium text-[#171613]">
              Hóa Đơn Boutique Gốc
            </h3>
            <p className="text-xs text-[#747069] leading-relaxed">
              Mỗi sản phẩm đều có đầy đủ hóa đơn mua hàng trực tiếp từ boutique chính hãng, tag nguyên bản, hộp và phụ kiện đi kèm nguyên vẹn.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-[#E8E4DC] shadow-xs space-y-3">
            <div className="w-10 h-10 rounded-xl bg-[#FAF8F3] flex items-center justify-center text-[#8A7158]">
              <Plane className="w-5 h-5" />
            </div>
            <h3 className="font-editorial text-lg font-medium text-[#171613]">
              Vận Chuyển Hàng Không Express
            </h3>
            <p className="text-xs text-[#747069] leading-relaxed">
              Hàng hóa được vận chuyển đường bay ưu tiên có bảo hiểm toàn phần 100%, thời gian từ 7-14 ngày làm việc.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-[#E8E4DC] shadow-xs space-y-3">
            <div className="w-10 h-10 rounded-xl bg-[#FAF8F3] flex items-center justify-center text-[#8A7158]">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="font-editorial text-lg font-medium text-[#171613]">
              Đồng Kiểm & Bảo Hiểm
            </h3>
            <p className="text-xs text-[#747069] leading-relaxed">
              Khách hàng được quyền kiểm tra sản phẩm trước khi thanh toán phần còn lại. Hoàn tiền 100% nếu phát hiện sai lệch.
            </p>
          </div>
        </div>

        {/* Khối Tương Tác: Gửi Yêu Cầu & Tra Cứu Lộ Trình Concierge */}
        <section id="concierge-form">
          <ConciergeInteractive />
        </section>

        {/* Quy Trình 4 Bước Hoạt Động */}
        <div className="bg-white rounded-3xl border border-[#E8E4DC] p-8 sm:p-12 shadow-sm space-y-10">
          <div className="text-center max-w-xl mx-auto space-y-2">
            <span className="text-[11px] font-bold text-[#8A7158] uppercase tracking-[0.25em]">
              HOW IT WORKS
            </span>
            <h2 className="font-editorial text-3xl sm:text-4xl text-[#171613]">
              Quy Trình Đặt Hàng Concierge
            </h2>
            <p className="text-xs text-[#747069]">
              4 bước minh bạch và tiện lợi để sở hữu món đồ thời trang mong muốn
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="space-y-3">
              <span className="text-3xl font-editorial font-bold text-[#C7A66A]">01</span>
              <h4 className="font-bold text-sm text-[#171613]">Gửi Yêu Cầu & Tư Vấn</h4>
              <p className="text-xs text-[#747069] leading-relaxed">
                Gửi hình ảnh, liên kết hoặc tên món đồ bạn tìm kiếm cho chuyên viên tư vấn qua Hotline hoặc Zalo.
              </p>
            </div>

            <div className="space-y-3">
              <span className="text-3xl font-editorial font-bold text-[#C7A66A]">02</span>
              <h4 className="font-bold text-sm text-[#171613]">Báo Giá & Đặt Cọc 50%</h4>
              <p className="text-xs text-[#747069] leading-relaxed">
                Nhận báo giá trọn gói (đã gồm thuế hải quan, phí vận chuyển) và xác nhận đơn qua chuyển khoản cọc VietQR.
              </p>
            </div>

            <div className="space-y-3">
              <span className="text-3xl font-editorial font-bold text-[#C7A66A]">03</span>
              <h4 className="font-bold text-sm text-[#171613]">Mua Boutique & Vận Chuyển</h4>
              <p className="text-xs text-[#747069] leading-relaxed">
                Shopper trực tiếp đến boutique mua sản phẩm, gửi hình ảnh/video check bill và đóng gói vận chuyển bay về VN.
              </p>
            </div>

            <div className="space-y-3">
              <span className="text-3xl font-editorial font-bold text-[#C7A66A]">04</span>
              <h4 className="font-bold text-sm text-[#171613]">Giao Tận Tay & Đồng Kiểm</h4>
              <p className="text-xs text-[#747069] leading-relaxed">
                Giao hàng tận nơi, khách hàng kiểm tra nguyên seal, bill hãng và thanh toán 50% giá trị đơn hàng còn lại.
              </p>
            </div>
          </div>
        </div>

        {/* Khung Liên Hệ Concierge */}
        <div className="bg-[#171613] text-[#FAF8F3] rounded-3xl p-8 sm:p-12 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-3 max-w-xl">
            <span className="text-[11px] font-bold text-[#C7A66A] uppercase tracking-[0.2em]">
              DỊCH VỤ TƯ VẤN 24/7
            </span>
            <h3 className="font-editorial text-2xl sm:text-3xl">
              Bạn Đang Tìm Món Đồ Hiếm Hoặc Phiên Bản Giới Hạn?
            </h3>
            <p className="text-xs sm:text-sm text-[#FAF8F3]/70 leading-relaxed font-light">
              Đội ngũ Fashion Concierge của TADA! sẵn sàng hỗ trợ tìm kiếm và kiểm tra tình trạng hàng tại tất cả các boutique trên thế giới ngay hôm nay.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 shrink-0 w-full sm:w-auto">
            <a
              href={`tel:${hotline}`}
              className="inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-[#C7A66A] text-[#171613] text-xs font-bold rounded-xl hover:bg-[#D5B77E] transition-colors"
            >
              <Headphones className="w-4 h-4" />
              <span>Hotline: {hotline}</span>
            </a>
            <Link
              href="/order-info#concierge"
              className="inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-[#2A2925] text-white text-xs font-medium rounded-xl hover:bg-[#383732] transition-colors"
            >
              <span>Xem bảng tra cứu đơn</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
