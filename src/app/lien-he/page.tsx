import React from 'react';
import { Metadata } from 'next';
import Link from 'next/link';
import { ChevronRight, MapPin, Phone, Mail, Clock, MessageSquare } from 'lucide-react';
import { ContactForm } from '@/components/contact/ContactForm';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://tada-fashion.vn';

export const metadata: Metadata = {
  title: 'Liên Hệ & Showroom Trải Nghiệm | TADA! Fashion Atelier',
  description:
    'Liên hệ đội ngũ TADA! Fashion Atelier để được tư vấn thời trang may đo, hỗ trợ đơn hàng hoặc ghé thăm không gian showroom trải nghiệm.',
  alternates: {
    canonical: `${siteUrl}/lien-he`,
  },
  openGraph: {
    title: 'Liên Hệ — TADA! Fashion Atelier',
    description: 'Thông tin liên hệ, hotline tư vấn và showroom TADA! Atelier.',
    url: `${siteUrl}/lien-he`,
  },
};

export default function ContactPage() {
  return (
    <div className="bg-[#FAF8F3] min-h-screen py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-10">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-xs text-[#747069]">
          <Link href="/" className="hover:text-[#171613]">Trang chủ</Link>
          <ChevronRight className="w-3 h-3 text-[#747069]" />
          <span className="text-[#171613] font-medium">Liên hệ</span>
        </nav>

        {/* Header */}
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <span className="text-[10px] font-bold tracking-[0.25em] text-[#8A7158] uppercase block">
            ATELIER CONTACT &bull; 24/7 SUPPORT
          </span>
          <h1 className="font-editorial text-3xl sm:text-4xl font-medium text-[#171613]">
            Kết Nối Cùng TADA! Atelier
          </h1>
          <p className="text-xs sm:text-sm text-[#747069] leading-relaxed">
            Chúng tôi luôn lắng nghe và sẵn sàng giải đáp mọi thắc mắc của bạn về bộ sưu tập, tư vấn phom dáng số đo và dịch vụ may đo cao cấp.
          </p>
        </div>

        {/* Grid 2 Cột: Thông Tin Showroom & Form Liên Hệ */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Cột trái: Thông tin showroom */}
          <div className="lg:col-span-5 space-y-4">
            <div className="bg-white rounded-2xl border border-[#E8E4DC] p-6 sm:p-8 space-y-6 shadow-xs">
              <h2 className="font-editorial text-xl font-bold text-[#171613]">
                Thông Tin Trụ Sở &amp; Showroom
              </h2>

              <div className="space-y-4 text-xs">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-[#FAF8F3] border border-[#E8E4DC] flex items-center justify-center text-[#8A7158] shrink-0">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div>
                    <strong className="block text-[#171613] mb-0.5">Địa chỉ Showroom Atelier:</strong>
                    <span className="text-[#747069] leading-relaxed">
                      128 Phố Huế, Phường Hàng Bài, Quận Hoàn Kiếm, Hà Nội
                    </span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-[#FAF8F3] border border-[#E8E4DC] flex items-center justify-center text-[#8A7158] shrink-0">
                    <Phone className="w-4 h-4" />
                  </div>
                  <div>
                    <strong className="block text-[#171613] mb-0.5">Hotline &amp; Zalo hỗ trợ:</strong>
                    <a href="tel:0366861159" className="text-[#8A7158] font-mono font-bold hover:underline">
                      0366 861 159
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-[#FAF8F3] border border-[#E8E4DC] flex items-center justify-center text-[#8A7158] shrink-0">
                    <Mail className="w-4 h-4" />
                  </div>
                  <div>
                    <strong className="block text-[#171613] mb-0.5">Thư điện tử (Email):</strong>
                    <a href="mailto:contact@tada-fashion.vn" className="text-[#747069] hover:underline font-mono">
                      contact@tada-fashion.vn
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-[#FAF8F3] border border-[#E8E4DC] flex items-center justify-center text-[#8A7158] shrink-0">
                    <Clock className="w-4 h-4" />
                  </div>
                  <div>
                    <strong className="block text-[#171613] mb-0.5">Giờ mở cửa đón khách:</strong>
                    <span className="text-[#747069]">
                      09:00 &mdash; 21:30 (Thứ 2 &mdash; Chủ Nhật, kể cả ngày lễ)
                    </span>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-[#F0ECE1] text-[11px] text-[#A8A29E] leading-relaxed">
                Quý khách có nhu cầu may đo Bespoke trực tiếp vui lòng đặt lịch trước qua hotline để nghệ nhân atelier sắp xếp đón tiếp chu đáo nhất.
              </div>
            </div>
          </div>

          {/* Cột phải: Form gửi tin nhắn */}
          <div className="lg:col-span-7">
            <div className="bg-white rounded-2xl border border-[#E8E4DC] p-6 sm:p-8 space-y-4 shadow-xs">
              <div className="flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-[#8A7158]" />
                <h2 className="font-editorial text-xl font-bold text-[#171613]">
                  Gửi Tin Nhắn Trực Tuyến Đến Xưởng
                </h2>
              </div>
              <p className="text-xs text-[#747069]">
                Điền thông tin bên dưới, nhân viên tư vấn của TADA! sẽ liên hệ lại với bạn trong thời gian sớm nhất.
              </p>

              <ContactForm />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
