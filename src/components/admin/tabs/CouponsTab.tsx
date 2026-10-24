'use client';

import React from 'react';

export const CouponsTab: React.FC = () => {
  return (
    <div className="bg-white rounded-2xl border border-[#E8E4DC] p-6 shadow-sm space-y-6">
      <h2 className="font-editorial text-xl font-semibold text-[#171613]">
        Mã Khuyến Mãi Đang Kích Hoạt
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 bg-[#FAF8F3] rounded-xl border border-[#E8E4DC] space-y-2">
          <span className="px-2 py-0.5 bg-[#15803D] text-white text-[10px] font-bold rounded">Đang chạy</span>
          <h3 className="font-mono text-base font-bold text-[#171613]">TADAVIP</h3>
          <p className="text-xs text-[#747069]">Giảm 10% tổng đơn hàng (không cộng dồn ưu đãi VIP)</p>
        </div>
        <div className="p-4 bg-[#FAF8F3] rounded-xl border border-[#E8E4DC] space-y-2">
          <span className="px-2 py-0.5 bg-[#15803D] text-white text-[10px] font-bold rounded">Đang chạy</span>
          <h3 className="font-mono text-base font-bold text-[#171613]">FREESHIP</h3>
          <p className="text-xs text-[#747069]">Miễn phí vận chuyển toàn quốc cho đơn từ 499.000đ</p>
        </div>
        <div className="p-4 bg-[#FAF8F3] rounded-xl border border-[#E8E4DC] space-y-2">
          <span className="px-2 py-0.5 bg-[#15803D] text-white text-[10px] font-bold rounded">Đang chạy</span>
          <h3 className="font-mono text-base font-bold text-[#171613]">FALL2026</h3>
          <p className="text-xs text-[#747069]">Giảm 15% cho Bộ sưu tập Thu Đông 2026</p>
        </div>
      </div>
    </div>
  );
};
