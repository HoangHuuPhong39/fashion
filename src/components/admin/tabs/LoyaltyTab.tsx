'use client';

import React from 'react';
import { LOYALTY_TIERS } from '@/context/AuthContext';
import { User } from '@/types';

interface LoyaltyTabProps {
  userList: User[];
  formatPrice: (price: number) => string;
}

export const LoyaltyTab: React.FC<LoyaltyTabProps> = ({ userList, formatPrice }) => {
  return (
    <div className="bg-white rounded-2xl border border-[#E8E4DC] p-6 shadow-sm space-y-6">
      <div>
        <h2 className="font-editorial text-xl font-semibold text-[#171613]">
          Hệ Thống Hội Viên Loyalty & Khách Hàng Tích Lũy
        </h2>
        <p className="text-xs text-[#747069]">
          Khách hàng mua nhiều sẽ tự động thăng cấp theo tổng chi tiêu và hưởng mức chiết khấu độc quyền
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {Object.values(LOYALTY_TIERS).map((t) => (
          <div key={t.tier} className="p-4 rounded-xl border border-[#E8E4DC] bg-[#FAF8F3] space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-lg">
                {t.tier === 'diamond' ? '💎' : t.tier === 'gold' ? '🥇' : t.tier === 'silver' ? '🥈' : '🥉'}
              </span>
              <span className={`text-[10px] px-2 py-0.5 rounded font-bold ${t.colorScheme.badgeBg} ${t.colorScheme.badgeText}`}>
                Giảm {t.discountPercent}%
              </span>
            </div>
            <h3 className="font-bold text-sm text-[#171613]">{t.name}</h3>
            <p className="text-[11px] text-[#747069]">
              Mốc chi tiêu: {formatPrice(t.minSpent)} (hoặc {t.minOrders} đơn)
            </p>
            <div className="text-[10px] text-[#8A7158] pt-1 border-t border-[#E8E4DC]">
              🎁 {t.gifts[0]}
            </div>
          </div>
        ))}
      </div>

      <div className="border border-[#E8E4DC] rounded-xl overflow-hidden">
        <div className="p-3 bg-[#FAF8F3] border-b border-[#E8E4DC] font-bold text-xs text-[#171613]">
          Danh Sách Khách Hàng & Hạng Thành Viên Hệ Thống
        </div>
        <table className="w-full text-xs text-left border-collapse">
          <thead>
            <tr className="bg-white text-[#747069] uppercase font-bold text-[10px] tracking-wider border-b border-[#E8E4DC]">
              <th className="p-3">Họ Tên Khách Hàng</th>
              <th className="p-3">Email</th>
              <th className="p-3">Tổng Chi Tiêu</th>
              <th className="p-3">Hạng Hội Viên</th>
              <th className="p-3">Ưu Đãi Chiết Khấu</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#E8E4DC]">
            {userList.length > 0 ? (
              userList.map((acc) => {
                const tier = acc.membershipTier || 'bronze';
                const tierDetails = LOYALTY_TIERS[tier] || LOYALTY_TIERS.bronze;
                return (
                  <tr key={acc.id} className="hover:bg-[#FAF8F3]">
                    <td className="p-3 font-semibold text-[#171613] flex items-center gap-2">
                      <span>{acc.name}</span>
                      {acc.role === 'admin' && (
                        <span className="text-[9px] bg-[#171613] text-[#C7A66A] px-1.5 py-0.2 rounded font-bold">
                          ADMIN
                        </span>
                      )}
                    </td>
                    <td className="p-3 text-[#747069]">{acc.email}</td>
                    <td className="p-3 font-bold text-[#171613]">{formatPrice(acc.totalSpent || 0)}</td>
                    <td className="p-3">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${tierDetails.colorScheme.badgeBg} ${tierDetails.colorScheme.badgeText}`}>
                        {tierDetails.name}
                      </span>
                    </td>
                    <td className="p-3 font-bold text-[#15803D]">
                      Giảm {tierDetails.discountPercent}% tự động
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={5} className="p-6 text-center text-[#747069]">
                  Đang tải danh sách thành viên...
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
