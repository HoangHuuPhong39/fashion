import React from 'react';
import Link from 'next/link';
import { ArrowRight, Compass } from 'lucide-react';
import { SafeImage } from '@/components/ui/SafeImage';

export const EditorialLookbook: React.FC = () => {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="bg-[#171613] text-[#FAF8F3] rounded-2xl overflow-hidden border border-[#2A2925] shadow-xl">
        <div className="grid grid-cols-1 lg:grid-cols-12 items-stretch">
          {/* Left Text Presentation */}
          <div className="lg:col-span-5 p-8 sm:p-12 lg:p-16 flex flex-col justify-between">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#C7A66A]/20 text-[#C7A66A] text-[10px] font-semibold tracking-[0.08em] uppercase rounded mb-4">
                <Compass className="w-3.5 h-3.5" />
                Editorial Lookbook 2026
              </div>

              <h2 className="font-editorial text-3xl sm:text-4xl lg:text-5xl font-normal tracking-[-0.015em] text-[#FAF8F3] leading-[1.18]">
                Vũ Điệu Của Lụa & Len Cashmere
              </h2>

              <p className="text-xs sm:text-sm text-[#E8D7BD]/85 mt-4 leading-[1.65] font-light">
                Mùa thu đông năm nay, TADA! tôn vinh những đường nét tinh tế không gò bó. Sự đối lập hài hòa giữa độ rũ mềm mại của lụa Bảo Lộc và cấu trúc ấm áp, đanh chắc của Cashmere nguyên bản.
              </p>

              <div className="mt-8 space-y-4 border-l border-[#C7A66A]/40 pl-4 text-xs text-[#FAF8F3]/90">
                <div>
                  <span className="text-[#C7A66A] font-semibold block uppercase tracking-[0.05em] text-[11px]">
                    01. Quiet Luxury
                  </span>
                  <span className="text-[#E8D7BD]/70">Gam màu trung tính: Đen noir, be champagne và nâu mocha thượng hạng.</span>
                </div>
                <div>
                  <span className="text-[#C7A66A] font-semibold block uppercase tracking-[0.05em] text-[11px]">
                    02. Artisanal Craftsmanship
                  </span>
                  <span className="text-[#E8D7BD]/70">Khuy xà cừ tự nhiên, đường may 21 mũi/inch và lót lụa thủ công.</span>
                </div>
              </div>
            </div>

            <div className="pt-8">
              <Link
                href="/shop?collection=thu-dong"
                className="inline-flex items-center gap-2 px-8 py-3.5 bg-[#C7A66A] hover:bg-[#E8D7BD] text-[#171613] text-xs font-semibold uppercase tracking-[0.06em] rounded transition-all duration-300 shadow-lg"
              >
                <span>Xem trọn bộ Lookbook Thu Đông</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* Right Editorial Image Grid */}
          <div className="lg:col-span-7 grid grid-cols-2 gap-2 p-3 sm:p-4 bg-[#23221E]">
            <div className="relative h-72 sm:h-96 lg:h-full rounded overflow-hidden">
              <SafeImage
                src="https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=1000&auto=format&fit=crop&q=85"
                alt="Silk Dress Lookbook"
                fill
                className="object-cover hover:scale-105 transition-transform duration-700"
                sizes="(max-width: 1024px) 50vw, 30vw"
              />
              <div className="absolute bottom-3 left-3 bg-[#171613]/80 backdrop-blur-sm px-2.5 py-1 rounded text-[10px] text-[#E8D7BD]">
                Look 01 • Đầm lụa cát Gia Studios
              </div>
            </div>

            <div className="relative h-72 sm:h-96 lg:h-full rounded overflow-hidden">
              <SafeImage
                src="https://images.unsplash.com/photo-1539533018447-63fcce2678e3?w=1000&auto=format&fit=crop&q=85"
                alt="Cashmere Coat Lookbook"
                fill
                className="object-cover hover:scale-105 transition-transform duration-700"
                sizes="(max-width: 1024px) 50vw, 30vw"
              />
              <div className="absolute bottom-3 left-3 bg-[#171613]/80 backdrop-blur-sm px-2.5 py-1 rounded text-[10px] text-[#E8D7BD]">
                Look 02 • Trench coat Lemaire Paris
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
