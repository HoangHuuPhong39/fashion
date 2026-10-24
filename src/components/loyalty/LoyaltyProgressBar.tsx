'use client';

import React from 'react';
import { Award, Sparkles, TrendingUp, ChevronRight } from 'lucide-react';
import { User, MembershipTier } from '@/types';
import { LOYALTY_TIERS } from '@/context/AuthContext';
import Link from 'next/link';

interface LoyaltyProgressBarProps {
  user: User | null;
  cartSubtotal?: number;
  compact?: boolean;
}

export function LoyaltyProgressBar({ user, cartSubtotal = 0, compact = false }: LoyaltyProgressBarProps) {
  if (!user) {
    if (compact) {
      return (
        <div className="p-3 bg-[#FAF8F3] border border-[#E8E4DC] rounded-xl text-xs space-y-1">
          <div className="flex items-center justify-between">
            <span className="font-bold text-[#171613]">Đăng nhập hội viên</span>
            <Link href="/account" className="text-[#8A7158] font-semibold hover:underline">
              Đăng nhập →
            </Link>
          </div>
          <p className="text-[11px] text-[#747069]">
            Tích điểm nâng hạng và nhận ưu đãi Freeship mọi đơn hàng từ hạng Vàng.
          </p>
        </div>
      );
    }
    return null;
  }

  const currentTier = user.membershipTier || 'bronze';
  const totalSpent = user.totalSpent || 0;

  // Lấy mốc hạng kế tiếp
  const tiersOrder: MembershipTier[] = ['bronze', 'silver', 'gold', 'diamond'];
  const currentIdx = tiersOrder.indexOf(currentTier);
  const nextTierKey = currentIdx < tiersOrder.length - 1 ? tiersOrder[currentIdx + 1] : null;
  const nextTierDetails = nextTierKey ? LOYALTY_TIERS[nextTierKey] : null;

  const currentTierMin = LOYALTY_TIERS[currentTier].minSpent;
  const nextTierMin = nextTierDetails ? nextTierDetails.minSpent : currentTierMin;

  // Tính phần trăm tiến độ
  const range = nextTierMin - currentTierMin;
  const progressInTier = Math.max(0, totalSpent - currentTierMin);
  const percent = nextTierDetails
    ? Math.min(100, Math.round((progressInTier / (range || 1)) * 100))
    : 100;

  // Tiến độ dự kiến nếu tính cả giỏ hàng hiện tại
  const projectedTotal = totalSpent + cartSubtotal;
  const projectedProgress = nextTierDetails
    ? Math.min(100, Math.round((Math.max(0, projectedTotal - currentTierMin) / (range || 1)) * 100))
    : 100;
  const willUpgradeWithCart = nextTierDetails && projectedTotal >= nextTierMin;

  const amountNeeded = nextTierDetails ? Math.max(0, nextTierMin - totalSpent) : 0;
  const amountNeededWithCart = nextTierDetails ? Math.max(0, nextTierMin - projectedTotal) : 0;

  const formatPrice = (p: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(p);
  };

  if (compact) {
    return (
      <div className="p-3.5 bg-white border border-[#E8E4DC] rounded-2xl shadow-xs space-y-2">
        <div className="flex items-center justify-between text-xs">
          <span className="font-bold text-[#171613] flex items-center gap-1.5">
            <Award className="w-3.5 h-3.5 text-[#8A7158]" />
            <span>Hạng: {LOYALTY_TIERS[currentTier].name}</span>
          </span>
          {nextTierDetails && (
            <span className="text-[10px] text-[#8A7158] font-bold">
              Mục tiêu: {nextTierDetails.name}
            </span>
          )}
        </div>

        {/* Thanh Progress */}
        <div className="relative w-full h-2.5 bg-[#FAF8F3] rounded-full overflow-hidden border border-[#E8E4DC]">
          {/* Progress dự kiến của giỏ hàng */}
          {cartSubtotal > 0 && projectedProgress > percent && (
            <div
              className="absolute top-0 left-0 h-full bg-[#E8D7BD] transition-all duration-500"
              style={{ width: `${projectedProgress}%` }}
            />
          )}
          {/* Progress thật hiện tại */}
          <div
            className="absolute top-0 left-0 h-full bg-[#8A7158] transition-all duration-500 rounded-full"
            style={{ width: `${percent}%` }}
          />
        </div>

        {nextTierDetails ? (
          willUpgradeWithCart ? (
            <p className="text-[11px] text-[#15803D] font-bold flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-[#15803D]" />
              <span>Đơn hàng này sẽ giúp bạn thăng hạng lên {nextTierDetails.name}!</span>
            </p>
          ) : (
            <p className="text-[11px] text-[#747069]">
              Còn thiếu <strong className="text-[#171613]">{formatPrice(amountNeededWithCart > 0 ? amountNeededWithCart : amountNeeded)}</strong> để thăng hạng <strong>{nextTierDetails.name}</strong>.
            </p>
          )
        ) : (
          <p className="text-[11px] text-[#15803D] font-bold">
            🎉 Bạn đã đạt hạng Kim Cương cao nhất với đặc quyền may đo & Freeship trọn đời!
          </p>
        )}
      </div>
    );
  }

  return (
    <div className="bg-white rounded-3xl border border-[#E8E4DC] p-6 sm:p-8 shadow-xs space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#E8E4DC]">
        <div>
          <span className="text-[11px] font-bold text-[#8A7158] uppercase tracking-[0.2em] block">
            CHƯƠNG TRÌNH KHÁCH HÀNG THÂN THIẾT ATELIER
          </span>
          <h3 className="font-editorial text-2xl font-semibold text-[#171613]">
            Tiến Trình Thăng Hạng Của Bạn
          </h3>
        </div>
        <div className="text-right">
          <span className="text-xs text-[#747069] block">Tổng chi tiêu tích lũy:</span>
          <strong className="font-editorial text-2xl font-bold text-[#171613]">
            {formatPrice(totalSpent)}
          </strong>
        </div>
      </div>

      {/* 4 Mốc Hạng */}
      <div className="grid grid-cols-4 gap-2 text-center text-xs relative">
        {tiersOrder.map((t, idx) => {
          const isPassed = currentIdx >= idx;
          const isCurrent = currentTier === t;
          const tierData = LOYALTY_TIERS[t];

          return (
            <div key={t} className={`space-y-1.5 ${isPassed ? '' : 'opacity-40'}`}>
              <div
                className={`w-9 h-9 mx-auto rounded-full flex items-center justify-center font-bold transition-all ${
                  isCurrent
                    ? 'bg-[#171613] text-white ring-4 ring-[#8A7158]/20 shadow-sm'
                    : isPassed
                    ? 'bg-[#8A7158] text-white'
                    : 'bg-[#FAF8F3] text-[#A8A29E] border border-[#E8E4DC]'
                }`}
              >
                {isPassed ? '✓' : idx + 1}
              </div>
              <span className={`block font-semibold ${isCurrent ? 'text-[#171613]' : 'text-[#747069]'}`}>
                {tierData.name}
              </span>
              <span className="block text-[10px] text-[#A8A29E] font-mono">
                {tierData.minSpent === 0 ? 'Mặc định' : formatPrice(tierData.minSpent)}
              </span>
            </div>
          );
        })}
      </div>

      {/* Thanh Progress Bar */}
      <div className="space-y-2">
        <div className="flex justify-between text-xs text-[#747069]">
          <span>Tiến độ hiện tại: <strong>{percent}%</strong></span>
          {nextTierDetails && (
            <span>Mốc tiếp theo: <strong>{formatPrice(nextTierMin)}</strong></span>
          )}
        </div>
        <div className="w-full h-3 bg-[#FAF8F3] rounded-full overflow-hidden border border-[#E8E4DC]">
          <div
            className="h-full bg-[#171613] transition-all duration-700 rounded-full"
            style={{ width: `${percent}%` }}
          />
        </div>
      </div>

      {/* Box đặc quyền tiếp theo */}
      {nextTierDetails ? (
        <div className="p-4 bg-[#FAF8F3] rounded-2xl border border-[#E8E4DC] flex items-start gap-3 text-xs">
          <Sparkles className="w-5 h-5 text-[#8A7158] shrink-0 mt-0.5" />
          <div className="space-y-1">
            <p className="font-semibold text-[#171613]">
              Chỉ còn thiếu <span className="text-[#B83A3A] font-bold">{formatPrice(amountNeeded)}</span> để thăng hạng {nextTierDetails.name}!
            </p>
            <p className="text-[#747069] leading-relaxed">
              Đặc quyền khi lên hạng {nextTierDetails.name}: Giảm ngay {nextTierDetails.discountPercent}% cho mọi đơn hàng, ưu tiên đặt may đo tại xưởng và miễn phí vận chuyển toàn quốc.
            </p>
          </div>
        </div>
      ) : (
        <div className="p-4 bg-[#F0FDF4] rounded-2xl border border-[#86EFAC] text-xs text-[#15803D] font-medium">
          🎉 Chúc mừng bạn đã là thành viên Kim Cương (Diamond VIP). Bạn đang tận hưởng mức chiết khấu 15% cao nhất cùng dịch vụ may đo riêng biệt của TADA! Atelier.
        </div>
      )}
    </div>
  );
}
