'use client';

import React, { useState } from 'react';
import { SafeImage } from '@/components/ui/SafeImage';
import { TrendingUp, AlertTriangle, Package, CheckCircle2, XCircle, Clock } from 'lucide-react';

export interface RevenuePoint {
  label: string;
  revenue: number;
}

export interface DashboardStats {
  actualRevenue: number;
  totalOrdersCount: number;
  pendingCount: number;
  shippingCount: number;
  deliveredCount: number;
  cancelledCount: number;
  cancellationRate: number;
  aov: number;
  totalItemsSold: number;
  lowStockProducts: any[];
  topSellingProducts: Array<{
    name: string;
    image: string;
    quantity: number;
    revenue: number;
  }>;
  revenueTimeline: RevenuePoint[];
}

export type DashboardTimeRange = 'all' | 'today' | '7days' | '30days' | 'this_month';

interface DashboardTabProps {
  dashboardTimeRange: DashboardTimeRange;
  setDashboardTimeRange: (range: DashboardTimeRange) => void;
  dashboardStats: DashboardStats;
  formatPrice: (price: number) => string;
  lowStockThreshold?: number;
  setLowStockThreshold?: (threshold: number) => void;
  onOpenStockModal?: (product: any) => void;
}

export const DashboardTab: React.FC<DashboardTabProps> = ({
  dashboardTimeRange,
  setDashboardTimeRange,
  dashboardStats,
  formatPrice,
  lowStockThreshold = 5,
  setLowStockThreshold,
  onOpenStockModal
}) => {
  const maxRevenue = Math.max(...(dashboardStats.revenueTimeline?.map((p) => p.revenue) || [1]), 100000);

  return (
    <div className="space-y-6">
      {/* Header & Bộ lọc khoảng thời gian */}
      <div className="bg-white p-5 rounded-2xl border border-[#E8E4DC] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xs">
        <div>
          <h3 className="font-editorial text-xl font-bold text-[#171613]">
            Báo Cáo Hiệu Quả Bán Hàng TADA! Atelier
          </h3>
          <p className="text-xs text-[#747069] mt-0.5">
            Doanh thu thực nhận chỉ tính đơn đã thanh toán hoặc giao thành công. Top bán chạy lọc từ đơn giao thật.
          </p>
        </div>

        <div className="flex items-center gap-1.5 bg-[#FAF8F3] p-1 rounded-xl border border-[#E8E4DC] self-stretch sm:self-auto overflow-x-auto">
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
              className={`px-3 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                dashboardTimeRange === t.key
                  ? 'bg-[#171613] text-white shadow-xs'
                  : 'text-[#747069] hover:text-[#171613]'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* 5 Chỉ số quan trọng (Kèm tỷ lệ hủy & cảnh báo tồn kho) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-[#E8E4DC] shadow-xs space-y-1">
          <span className="text-[11px] text-[#747069] font-medium uppercase tracking-wider">
            Doanh Thu Thực Nhận
          </span>
          <div className="text-2xl font-bold text-[#15803D] tabular-nums tracking-tight">
            {formatPrice(dashboardStats.actualRevenue)}
          </div>
          <div className="text-[10px] text-[#747069]">
            Đã thanh toán / giao thành công
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-[#E8E4DC] shadow-xs space-y-1">
          <span className="text-[11px] text-[#747069] font-medium uppercase tracking-wider">
            Tổng Đơn Hàng
          </span>
          <div className="text-2xl font-bold text-[#171613] tabular-nums tracking-tight">
            {dashboardStats.totalOrdersCount} đơn
          </div>
          <div className="text-[10px] text-[#D97706] font-medium">
            {dashboardStats.pendingCount} đơn chờ duyệt
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-[#E8E4DC] shadow-xs space-y-1">
          <span className="text-[11px] text-[#747069] font-medium uppercase tracking-wider">
            AOV (Giá Trị / Đơn)
          </span>
          <div className="text-2xl font-bold text-[#8A7158] tabular-nums tracking-tight">
            {formatPrice(dashboardStats.aov)}
          </div>
          <div className="text-[10px] text-[#747069]">
            {dashboardStats.totalItemsSold} sản phẩm bán ra
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-[#E8E4DC] shadow-xs space-y-1">
          <span className="text-[11px] text-[#747069] font-medium uppercase tracking-wider">
            Tỷ Lệ Hủy Đơn
          </span>
          <div className="text-2xl font-bold text-[#DC2626] tabular-nums tracking-tight">
            {dashboardStats.cancellationRate}%
          </div>
          <div className="text-[10px] text-[#747069]">
            {dashboardStats.cancelledCount} / {dashboardStats.totalOrdersCount} đơn bị hủy
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-[#E8E4DC] shadow-xs space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[11px] text-[#DC2626] font-semibold uppercase tracking-wider flex items-center gap-1">
              <AlertTriangle className="w-3.5 h-3.5" />
              Tồn Kho Thấp
            </span>
            {setLowStockThreshold && (
              <div className="flex items-center gap-1 text-[10px] text-[#747069]">
                <span>&le;</span>
                <input
                  type="number"
                  min="1"
                  max="50"
                  value={lowStockThreshold}
                  onChange={(e) => setLowStockThreshold(Math.max(1, parseInt(e.target.value) || 1))}
                  className="w-10 px-1 py-0.5 border border-[#E8E4DC] rounded text-center text-xs font-bold text-[#171613] bg-[#FAF8F3]"
                  title="Cấu hình ngưỡng cảnh báo tồn kho"
                />
              </div>
            )}
          </div>
          <div className="text-2xl font-bold text-[#DC2626] tabular-nums tracking-tight">
            {dashboardStats.lowStockProducts.length} mẫu
          </div>
          <div className="text-[10px] text-[#747069]">
            Cần lên kế hoạch may / nhập thêm
          </div>
        </div>
      </div>

      {/* Biểu đồ nhẹ SVG (Tải lười không phụ thuộc thư viện nặng) */}
      <div className="bg-white p-6 rounded-2xl border border-[#E8E4DC] shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-[#15803D]" />
            <h4 className="font-bold text-sm text-[#171613] uppercase tracking-wider">
              Xu Hướng Doanh Thu Theo Thời Gian
            </h4>
          </div>
          <span className="text-xs text-[#747069]">Biểu đồ trực quan hóa dữ liệu đơn hàng thực</span>
        </div>

        {dashboardStats.revenueTimeline && dashboardStats.revenueTimeline.length > 0 ? (
          <div className="pt-4">
            <div className="h-44 flex items-end gap-2 sm:gap-4 px-2 border-b border-[#E8E4DC]">
              {dashboardStats.revenueTimeline.map((item, idx) => {
                const heightPct = Math.max(8, Math.round((item.revenue / maxRevenue) * 100));
                return (
                  <div key={idx} className="flex-1 flex flex-col items-center gap-1 group relative">
                    {/* Tooltip */}
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity absolute -top-9 bg-[#171613] text-white text-[10px] py-1 px-2 rounded pointer-events-none whitespace-nowrap z-10 shadow-lg">
                      {formatPrice(item.revenue)}
                    </div>
                    {/* Bar */}
                    <div
                      className="w-full bg-gradient-to-t from-[#8A7158] to-[#C7A66A] rounded-t-md transition-all duration-300 group-hover:brightness-110"
                      style={{ height: `${heightPct}%` }}
                    />
                    {/* Label */}
                    <span className="text-[10px] text-[#747069] truncate max-w-[50px] font-mono">
                      {item.label}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          <div className="h-32 flex items-center justify-center text-xs text-[#747069] bg-[#FAF8F3] rounded-xl border border-dashed border-[#E8E4DC]">
            Chưa có đủ dữ liệu biến động doanh thu trong kỳ được chọn.
          </div>
        )}
      </div>

      {/* Phân bố trạng thái đơn & Top sản phẩm bán chạy thật */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Cột trái: Tỷ lệ trạng thái đơn */}
        <div className="lg:col-span-5 bg-white p-6 rounded-2xl border border-[#E8E4DC] shadow-xs space-y-4">
          <h4 className="font-bold text-sm text-[#171613] uppercase tracking-wider">
            Phân Bổ Trạng Thái Đơn Hàng
          </h4>
          <div className="space-y-3.5 pt-1">
            <div>
              <div className="flex justify-between text-xs mb-1 font-medium">
                <span className="text-[#D97706] flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5" /> Chờ xác nhận
                </span>
                <span className="font-bold">{dashboardStats.pendingCount} đơn</span>
              </div>
              <div className="w-full bg-[#FAF8F3] h-2 rounded-full overflow-hidden">
                <div
                  className="bg-[#D97706] h-full transition-all duration-500"
                  style={{
                    width: `${dashboardStats.totalOrdersCount > 0 ? (dashboardStats.pendingCount / dashboardStats.totalOrdersCount) * 100 : 0}%`
                  }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs mb-1 font-medium">
                <span className="text-[#0284C7] flex items-center gap-1.5">
                  <Package className="w-3.5 h-3.5" /> Đang vận chuyển
                </span>
                <span className="font-bold">{dashboardStats.shippingCount} đơn</span>
              </div>
              <div className="w-full bg-[#FAF8F3] h-2 rounded-full overflow-hidden">
                <div
                  className="bg-[#0284C7] h-full transition-all duration-500"
                  style={{
                    width: `${dashboardStats.totalOrdersCount > 0 ? (dashboardStats.shippingCount / dashboardStats.totalOrdersCount) * 100 : 0}%`
                  }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs mb-1 font-medium">
                <span className="text-[#15803D] flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Giao thành công
                </span>
                <span className="font-bold">{dashboardStats.deliveredCount} đơn</span>
              </div>
              <div className="w-full bg-[#FAF8F3] h-2 rounded-full overflow-hidden">
                <div
                  className="bg-[#15803D] h-full transition-all duration-500"
                  style={{
                    width: `${dashboardStats.totalOrdersCount > 0 ? (dashboardStats.deliveredCount / dashboardStats.totalOrdersCount) * 100 : 0}%`
                  }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs mb-1 font-medium">
                <span className="text-[#DC2626] flex items-center gap-1.5">
                  <XCircle className="w-3.5 h-3.5" /> Đã hủy
                </span>
                <span className="font-bold">{dashboardStats.cancelledCount} đơn ({dashboardStats.cancellationRate}%)</span>
              </div>
              <div className="w-full bg-[#FAF8F3] h-2 rounded-full overflow-hidden">
                <div
                  className="bg-[#DC2626] h-full transition-all duration-500"
                  style={{
                    width: `${dashboardStats.totalOrdersCount > 0 ? (dashboardStats.cancelledCount / dashboardStats.totalOrdersCount) * 100 : 0}%`
                  }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Cột phải: Top sản phẩm bán chạy thật (từ đơn delivered) */}
        <div className="lg:col-span-7 bg-white p-6 rounded-2xl border border-[#E8E4DC] shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="font-bold text-sm text-[#171613] uppercase tracking-wider">
              Top 5 Thiết Kế Bán Chạy Thật (Đã Giao)
            </h4>
            <span className="text-[10px] text-[#747069] bg-[#FAF8F3] px-2 py-0.5 rounded border border-[#E8E4DC]">
              Delivered Only
            </span>
          </div>

          <div className="divide-y divide-[#E8E4DC]">
            {dashboardStats.topSellingProducts.length === 0 ? (
              <p className="text-xs text-[#747069] py-8 text-center bg-[#FAF8F3] rounded-xl border border-dashed border-[#E8E4DC]">
                Chưa có đơn hàng nào được đánh dấu &quot;Đã giao thành công&quot; trong khoảng thời gian này.
              </p>
            ) : (
              dashboardStats.topSellingProducts.map((p, idx) => (
                <div key={idx} className="py-2.5 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <span className="w-5 h-5 rounded-full bg-[#FAF8F3] border border-[#E8E4DC] text-[10px] font-bold flex items-center justify-center text-[#171613]">
                      {idx + 1}
                    </span>
                    <div className="relative w-9 h-11 rounded overflow-hidden bg-[#FAF8F3] border border-[#E8E4DC] shrink-0">
                      <SafeImage src={p.image} alt="" fill className="object-cover" sizes="36px" />
                    </div>
                    <div>
                      <div className="text-xs font-semibold text-[#171613] truncate max-w-xs">{p.name}</div>
                      <div className="text-[10px] text-[#747069]">Đã giao thực tế: {p.quantity} chiếc</div>
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

      {/* Danh sách cảnh báo sản phẩm tồn kho thấp */}
      {dashboardStats.lowStockProducts.length > 0 && (
        <div className="bg-white p-6 rounded-2xl border border-red-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-red-600" />
              <h4 className="font-bold text-sm text-[#171613] uppercase tracking-wider">
                Cảnh Báo Tồn Kho Dưới Ngưỡng ({dashboardStats.lowStockProducts.length} sản phẩm &le; {lowStockThreshold})
              </h4>
            </div>
            <span className="text-xs text-red-600 font-medium">Yêu cầu nhập kho</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {dashboardStats.lowStockProducts.map((p) => (
              <div
                key={p.id}
                className="p-3 rounded-xl border border-red-100 bg-red-50/30 flex items-center justify-between gap-2"
              >
                <div className="flex items-center gap-2.5 overflow-hidden">
                  <div className="relative w-10 h-12 rounded bg-white border border-red-200 shrink-0 overflow-hidden">
                    <SafeImage src={p.images?.[0] || '/images/products/placeholder.jpg'} alt="" fill className="object-cover" sizes="40px" />
                  </div>
                  <div className="truncate">
                    <div className="text-xs font-bold text-[#171613] truncate">{p.name}</div>
                    <div className="text-[11px] text-red-600 font-bold">
                      Còn: {p.stockCount} chiếc
                    </div>
                  </div>
                </div>

                {onOpenStockModal && (
                  <button
                    onClick={() => onOpenStockModal(p)}
                    className="px-2.5 py-1 bg-red-600 hover:bg-red-700 text-white rounded text-[10px] font-bold shrink-0 transition-colors"
                  >
                    Nhập kho
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
