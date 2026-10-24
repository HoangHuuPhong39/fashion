import React from 'react';
import Link from 'next/link';
import { ArrowRight, Sparkles } from 'lucide-react';
import { CAMPAIGNS } from '@/data/mockData';
import { CampaignBanner } from '@/types';
import { SafeImage } from '@/components/ui/SafeImage';

export const CampaignBanners: React.FC = () => {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {CAMPAIGNS.map((camp: CampaignBanner) => (
          <div
            key={camp.id}
            className="group relative h-80 sm:h-96 rounded-lg overflow-hidden border border-[#E8E4DC] shadow-sm hover:shadow-xl transition-all duration-500"
          >
            {/* Background Image */}
            <SafeImage
              src={camp.image}
              alt={camp.title}
              fill
              className="object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
              sizes="(max-width: 768px) 100vw, 50vw"
            />

            {/* Dark gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#171613]/90 via-[#171613]/40 to-transparent" />

            {/* Content at bottom */}
            <div className="absolute inset-0 p-6 sm:p-8 flex flex-col justify-end text-left z-10">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-[#171613]/70 backdrop-blur-sm border border-[#C7A66A]/40 text-[#E8D7BD] text-[10px] font-bold uppercase tracking-[0.2em] w-fit rounded-[2px] mb-2.5">
                <Sparkles className="w-3 h-3 text-[#C7A66A]" />
                {camp.tag}
              </span>

              <h3 className="font-editorial text-2xl sm:text-3xl font-medium text-[#FAF8F3] tracking-wide">
                {camp.title}
              </h3>

              <p className="text-xs sm:text-sm text-[#E8D7BD]/80 mt-1.5 max-w-md font-light leading-relaxed">
                {camp.subtitle}
              </p>

              <div className="pt-4">
                <Link
                  href={camp.link}
                  className="inline-flex items-center gap-2 text-xs font-bold text-[#FAF8F3] hover:text-[#C7A66A] tracking-[0.16em] uppercase transition-colors"
                >
                  <span>Khám phá ngay</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform duration-300" />
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
