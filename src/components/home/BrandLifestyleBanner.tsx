import React from 'react';
import Link from 'next/link';
import { ArrowRight, Sparkles, Heart, Compass, Crown, Eye } from 'lucide-react';
import { SafeImage } from '@/components/ui/SafeImage';

export const BrandLifestyleBanner: React.FC = () => {
  const styles = [
    { label: 'Nữ thanh lịch', icon: Crown },
    { label: 'Nữ tính', icon: Heart },
    { label: 'Thanh lịch', icon: Sparkles },
    { label: 'Hiện đại', icon: Compass },
    { label: 'Cá tính', icon: Eye }
  ];

  return (
    <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 min-w-0">
      <div className="relative rounded-2xl overflow-hidden bg-[#2A231C] text-white p-6 sm:p-8 shadow-md">
        {/* Background Image với Opacity mờ */}
        <div className="absolute inset-0 opacity-25">
          <SafeImage
            src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1600&auto=format&fit=crop&q=80"
            alt="The TADA! Lifestyle"
            fill
            className="object-cover"
          />
        </div>

        <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-6">
          {/* Tiêu đề bên trái */}
          <div className="text-center lg:text-left">
            <h3 className="font-editorial text-xl sm:text-2xl font-bold tracking-wider text-white">
              THE TADA<span className="text-[#C78238]">!</span>
            </h3>
            <p className="text-xs text-[#E8D7BD]/90 mt-1 font-light">
              Phong cách thời trang cho mọi khoảnh khắc
            </p>
          </div>

          {/* Dải 5 phong cách ở giữa */}
          <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-6 text-xs text-[#E8D7BD]">
            {styles.map((s, idx) => {
              const Icon = s.icon;
              return (
                <div key={idx} className="flex items-center gap-1.5 bg-black/30 backdrop-blur-sm px-3 py-1.5 rounded-full border border-white/10">
                  <Icon className="w-3.5 h-3.5 text-[#C7A66A]" />
                  <span className="text-[11px] font-medium text-white">{s.label}</span>
                </div>
              );
            })}
          </div>

          {/* Nút Khám phá ngay bên phải */}
          <div>
            <Link
              href="/shop"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-white text-[#171613] hover:bg-[#FAF8F3] text-xs font-semibold rounded-full shadow-md transition-all whitespace-nowrap"
            >
              <span>Khám phá ngay</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};
