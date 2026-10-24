import React from 'react';
import { ProductBadge } from '@/types';

interface BadgeProps {
  type: ProductBadge | 'SALE';
  discountText?: string;
}

export const Badge: React.FC<BadgeProps> = ({ type, discountText }) => {
  if (type === 'SALE' && discountText) {
    return (
      <span className="inline-flex items-center px-2 py-0.5 text-[10px] tracking-wider uppercase font-semibold bg-[#B83A3A] text-white rounded-[2px] shadow-sm">
        {discountText}
      </span>
    );
  }

  switch (type) {
    case 'ORDER QUỐC TẾ':
      return (
        <span className="inline-flex items-center px-2 py-0.5 text-[10px] tracking-wider uppercase font-medium bg-[#1A2530] text-[#E8D7BD] border border-[#C7A66A]/30 rounded-[2px]">
          Order Quốc Tế
        </span>
      );
    case 'LOCAL BRAND':
      return (
        <span className="inline-flex items-center px-2 py-0.5 text-[10px] tracking-wider uppercase font-medium bg-[#8A7158] text-[#FAF8F3] rounded-[2px]">
          Local Brand VN
        </span>
      );
    case 'HÀNG CÓ SẴN':
      return (
        <span className="inline-flex items-center px-2 py-0.5 text-[10px] tracking-wider uppercase font-medium bg-[#2E4F3E] text-[#FAF8F3] rounded-[2px]">
          Có Sẵn Giao 24h
        </span>
      );
    case 'PREMIUM':
      return (
        <span className="inline-flex items-center px-2 py-0.5 text-[10px] tracking-wider uppercase font-medium bg-[#171613] text-[#C7A66A] border border-[#C7A66A]/50 rounded-[2px]">
          ★ Premium
        </span>
      );
    default:
      return (
        <span className="inline-flex items-center px-2 py-0.5 text-[10px] tracking-wider uppercase font-medium bg-[#F4F1EA] text-[#171613] border border-[#E8E4DC] rounded-[2px]">
          {type}
        </span>
      );
  }
};
