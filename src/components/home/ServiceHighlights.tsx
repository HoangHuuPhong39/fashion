import React from 'react';
import Link from 'next/link';
import { Globe, Sparkles, Crown, Headphones, ArrowRight } from 'lucide-react';

const SERVICES = [
  {
    icon: Globe,
    title: 'Hàng Order Quốc Tế',
    desc: 'Boutique Paris, Seoul & Tokyo. Vận chuyển hàng không chuyên dụng, kiểm định xuất xứ minh bạch.',
    linkText: 'Quy trình order',
    linkHref: '/order-info'
  },
  {
    icon: Sparkles,
    title: 'Local Brands Việt Nam',
    desc: 'Tuyển chọn các nhà thiết kế đương đại hàng đầu. Chất liệu lụa, linen thủ công tinh xảo.',
    linkText: 'Khám phá NTK',
    linkHref: '/local-brands'
  },
  {
    icon: Crown,
    title: 'Đặc Quyền Thành Viên VIP',
    desc: 'Tham gia TADA! Privilege. Giảm ngay 10% đơn đầu tiên và quà tặng riêng theo mùa.',
    linkText: 'Nhận ưu đãi',
    linkHref: '/account'
  },
  {
    icon: Headphones,
    title: 'Fashion Concierge 24/7',
    desc: 'Dịch vụ tìm kiếm mẫu mã độc bản theo yêu cầu, tư vấn phối đồ và fitting kích cỡ riêng.',
    linkText: 'Liên hệ tư vấn',
    linkHref: '/order-info#concierge'
  }
];

export const ServiceHighlights: React.FC = () => {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 sm:-mt-10 relative z-20">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {SERVICES.map((item, index) => {
          const Icon = item.icon;
          return (
            <div
              key={index}
              className="bg-[#FAF8F3] border border-[#E8E4DC] p-5 rounded-lg shadow-sm hover:shadow-md hover:border-[#C7A66A]/60 transition-all duration-300 group flex flex-col justify-between"
            >
              <div>
                <div className="w-10 h-10 rounded-full bg-[#F4F1EA] group-hover:bg-[#171613] flex items-center justify-center transition-colors duration-300 mb-3.5">
                  <Icon className="w-5 h-5 text-[#8A7158] group-hover:text-[#C7A66A] transition-colors" />
                </div>
                <h3 className="font-editorial text-base font-semibold text-[#171613]">
                  {item.title}
                </h3>
                <p className="text-xs text-[#747069] mt-1.5 leading-relaxed font-light">
                  {item.desc}
                </p>
              </div>

              <div className="pt-4 mt-2 border-t border-[#E8E4DC]/40">
                <Link
                  href={item.linkHref}
                  className="text-xs text-[#8A7158] font-semibold hover:text-[#171613] inline-flex items-center gap-1 group/link"
                >
                  <span>{item.linkText}</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover/link:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
