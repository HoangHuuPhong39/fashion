'use client';

import React from 'react';
import { SafeImage } from '@/components/ui/SafeImage';

export interface DashboardStats {
  actualRevenue: number;
  totalOrdersCount: number;
  pendingCount: number;
  shippingCount: number;
  deliveredCount: number;
  cancelledCount: number;
  aov: number;
  totalItemsSold: number;
  lowStockProducts: any[];
  topSellingProducts: Array<{
    name: string;
    image: string;
    quantity: number;
    revenue: number;
  }>;
}

export type DashboardTimeRange = 'all' | 'today' | '7days' | '30days' | 'this_month';

interface DashboardTabProps {
  dashboardTimeRange: DashboardTimeRange;
  setDashboardTimeRange: (range: DashboardTimeRange) => void;
  dashboardStats: DashboardStats;
  formatPrice: (price: number) => string;
}

export const DashboardTab: React.FC<DashboardTabProps> = ({
  dashboardTimeRange,
  setDashboardTimeRange,
  dashboardStats,
  formatPrice
}) => {
  return (
    <div className="space-y-6">
      {/* Bộ lọc khoảng thời gian */}
      <div className="bg-white p-4 rounded-2xl border border-[#E8E4DC] flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h3 className="font-editorial text-lg font-bold text-[#171613]">
            Báo Cáo Hiệu Quả Bán Hàng TADA!
          </h3>
          <p className="text-xs text-[#747069]">
            Số liệu cập nhật theo dữ liệu đơn hàng thực tế. Doanh thu chỉ tính đơn đã hoàn tất / thanh toán.
          </p>
        </div>

        <div className="flex items-center gap-1.5 bg-[#FAF8F3] p-1 rounded-xl border border-[#E8E4DC]">
          {(
            [
              { key: 'all', label: 'Toàn bộ' },
              { key: 'today', label: 'Hôm nay' },
              { key: '7days', label: '7 ngày qua' },
              { key: '30days', label: '30 ngày' },
              { key: 'this_month', label: 'Tháng này' }
            ] as const
          ).map((t) => (
            <button
              key={t.key}
              onClick={() => setDashboardTimeRange(t.key)}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                dashboardTimeRange === t.key
                  ? 'bg-[#171613] text-white shadow-sm'
                  : 'text-[#747069] hover:text-[#171613]'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* 4 Chỉ số tài chính & Đơn hàng chính */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-[#E8E4DC] shadow-sm space-y-1">
          <span className="text-xs text-[#747069] font-medium uppercase tracking-wider">
            Doanh Thu Thực Nhận
          </span>
          <div className="text-2xl font-bold text-[#15803D] tabular-nums tracking-tight">
            {formatPrice(dashboardStats.actualRevenue)}
          </div>
          <div className="text-[10px] text-[#747069]">
            Chỉ tính đơn đã thanh toán hoặc giao thành công
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-[#E8E4DC] shadow-sm space-y-1">
          <span className="text-xs text-[#747069] font-medium uppercase tracking-wider">
            Tổng Đơn Hàng
          </span>
          <div className="text-2xl font-bold text-[#171613] tabular-nums tracking-tight">
            {dashboardStats.totalOrdersCount} đơn
          </div>
          <div className="text-[10px] text-[#D97706] font-medium">
            {dashboardStats.pendingCount} đơn mới đang chờ duyệt
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-[#E8E4DC] shadow-sm space-y-1">
          <span className="text-xs text-[#747069] font-medium uppercase tracking-wider">
            Giá Trị Đơn Trung Bình (AOV)
          </span>
          <div className="text-2xl font-bold text-[#8A7158] tabular-nums tracking-tight">
            {formatPrice(dashboardStats.aov)}
          </div>
          <div className="text-[10px] text-[#747069]">
            Tổng {dashboardStats.totalItemsSold} sản phẩm đã bán
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-[#E8E4DC] shadow-sm space-y-1">
          <span className="text-xs text-[#747069] font-medium uppercase tracking-wider">
            Cảnh Báo Kho Hàng
          </span>
          <div className="text-2xl font-bold text-[#DC2626] tabular-nums tracking-tight">
            {dashboardStats.lowStockProducts.length} mẫu
          </div>
          <div className="text-[10px] text-[#DC2626]">
            Sản phẩm tồn kho &le; 5 chiếc cần nhập thêm
          </div>
        </div>
      </div>

      {/* Phân bố trạng thái đơn hàng & Top sản phẩm bán chạy */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Cột trái: Tỷ lệ trạng thái đơn */}
        <div className="lg:col-span-5 bg-white p-6 rounded-2xl border border-[#E8E4DC] shadow-sm space-y-4">
          <h4 className="font-bold text-sm text-[#171613] uppercase tracking-wider">
            Trạng Thái Đơn Hàng
          </h4>
          <div className="space-y-3">
            <div>
              <div className="flex justify-between text-xs mb-1 font-medium">
                <span className="text-[#D97706]">Chờ xác nhận</span>
                <span>{dashboardStats.pendingCount} đơn</span>
              </div>
              <div className="w-full bg-[#FAF8F3] h-2 rounded-full overflow-hidden">
                <div
                  className="bg-[#D97706] h-full"
                  style={{
                    width: `${
                      dashboardStats.totalOrdersCount > 0
                        ? (dashboardStats.pendingCount / dashboardStats.totalOrdersCount) * 100
                        : 0
                    }%`
                  }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs mb-1 font-medium">
                <span className="text-[#0284C7]">Đang vận chuyển</span>
                <span>{dashboardStats.shippingCount} đơn</span>
              </div>
              <div className="w-full bg-[#FAF8F3] h-2 rounded-full overflow-hidden">
                <div
                  className="bg-[#0284C7] h-full"
                  style={{
                    width: `${
                      dashboardStats.totalOrdersCount > 0
                        ? (dashboardStats.shippingCount / dashboardStats.totalOrdersCount) * 100
                        : 0
                    }%`
                  }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs mb-1 font-medium">
                <span className="text-[#15803D]">Đã giao thành công</span>
                <span>{dashboardStats.deliveredCount} đơn</span>
              </div>
              <div className="w-full bg-[#FAF8F3] h-2 rounded-full overflow-hidden">
                <div
                  className="bg-[#15803D] h-full"
                  style={{
                    width: `${
                      dashboardStats.totalOrdersCount > 0
                        ? (dashboardStats.deliveredCount / dashboardStats.totalOrdersCount) * 100
                        : 0
                    }%`
                  }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs mb-1 font-medium">
                <span className="text-[#DC2626]">Đã hủy</span>
                <span>{dashboardStats.cancelledCount} đơn</span>
              </div>
              <div className="w-full bg-[#FAF8F3] h-2 rounded-full overflow-hidden">
                <div
                  className="bg-[#DC2626] h-full"
                  style={{
                    width: `${
                      dashboardStats.totalOrdersCount > 0
                        ? (dashboardStats.cancelledCount / dashboardStats.totalOrdersCount) * 100
                        : 0
                    }%`
                  }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Cột phải: Top sản phẩm bán chạy */}
        <div className="lg:col-span-7 bg-white p-6 rounded-2xl border border-[#E8E4DC] shadow-sm space-y-4">
          <h4 className="font-bold text-sm text-[#171613] uppercase tracking-wider">
            Top 5 Thiết Kế Bán Chạy Nhất
          </h4>
          <div className="divide-y divide-[#E8E4DC]">
            {dashboardStats.topSellingProducts.length === 0 ? (
              <p className="text-xs text-[#747069] py-4">Chưa có dữ liệu bán hàng trong kỳ.</p>
            ) : (
              dashboardStats.topSellingProducts.map((p, idx) => (
                <div key={idx} className="py-2.5 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <span className="w-5 h-5 rounded-full bg-[#FAF8F3] border border-[#E8E4DC] text-[10px] font-bold flex items-center justify-center text-[#171613]">
                      {idx + 1}
                    </span>
                    <div className="relative w-9 h-11 rounded overflow-hidden bg-[#FAF8F3] border border-[#E8E4DC]">
                      <SafeImage src={p.image} alt="" fill className="object-cover" sizes="36px" />
                    </div>
                    <div>
                      <div className="text-xs font-semibold text-[#171613] truncate max-w-xs">{p.name}</div>
                      <div className="text-[10px] text-[#747069]">Đã bán {p.quantity} chiếc</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs font-bold text-[#15803D]">{formatPrice(p.revenue)}</div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
