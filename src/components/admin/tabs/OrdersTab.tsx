'use client';

import React from 'react';
import { Search, FileSpreadsheet, Eye } from 'lucide-react';
import { Order, OrderStatus } from '@/types';

interface OrdersTabProps {
  filteredOrders: Order[];
  paginatedOrders: Order[];
  handleExportCSV: () => void;
  refreshOrders: () => void;
  orderSearch: string;
  setOrderSearch: (val: string) => void;
  orderStatusFilter: string;
  setOrderStatusFilter: (val: string) => void;
  orderPaymentFilter: string;
  setOrderPaymentFilter: (val: string) => void;
  orderDateRange: 'all' | 'today' | '7days' | '30days';
  setOrderDateRange: (val: 'all' | 'today' | '7days' | '30days') => void;
  orderPage: number;
  setOrderPage: React.Dispatch<React.SetStateAction<number>>;
  totalOrderPages: number;
  formatDate: (dateStr: string) => string;
  formatPrice: (price: number) => string;
  updateOrderStatus: (
    orderId: string,
    status: OrderStatus,
    statusLabel: string,
    note?: string,
    paymentStatus?: Order['paymentStatus']
  ) => Promise<any>;
  refreshProducts: () => Promise<any>;
  setViewingOrderDetail: (order: Order) => void;
}

export const OrdersTab: React.FC<OrdersTabProps> = ({
  filteredOrders,
  paginatedOrders,
  handleExportCSV,
  refreshOrders,
  orderSearch,
  setOrderSearch,
  orderStatusFilter,
  setOrderStatusFilter,
  orderPaymentFilter,
  setOrderPaymentFilter,
  orderDateRange,
  setOrderDateRange,
  orderPage,
  setOrderPage,
  totalOrderPages,
  formatDate,
  formatPrice,
  updateOrderStatus,
  refreshProducts,
  setViewingOrderDetail
}) => {
  return (
    <div className="bg-white rounded-2xl border border-[#E8E4DC] p-6 shadow-sm space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-[#F0ECE1]">
        <div>
          <h2 className="font-editorial text-xl font-semibold text-[#171613]">
            Danh Sách Đơn Hàng ({filteredOrders.length})
          </h2>
          <p className="text-xs text-[#747069]">
            Theo dõi, lọc, cập nhật trạng thái đơn, in phiếu giao hàng và xuất file Excel/CSV.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={handleExportCSV}
            className="px-3.5 py-2 bg-[#15803D] hover:bg-[#166534] text-white text-xs font-bold rounded-lg flex items-center gap-1.5 transition-colors shadow-sm"
            title="Xuất file CSV mở trên Excel"
          >
            <FileSpreadsheet className="w-4 h-4" />
            <span>Xuất Excel / CSV</span>
          </button>
          <button
            onClick={() => refreshOrders()}
            className="px-3 py-2 bg-[#FAF8F3] hover:bg-[#E8D7BD] border border-[#E8E4DC] text-xs font-semibold rounded-lg text-[#171613] transition-colors"
          >
            Làm mới
          </button>
        </div>
      </div>

      {/* Bộ lọc đơn hàng */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
        <div className="relative">
          <Search className="w-3.5 h-3.5 absolute left-3 top-3 text-[#A8A29E]" />
          <input
            type="text"
            placeholder="Mã đơn, tên khách, SĐT..."
            value={orderSearch}
            onChange={(e) => {
              setOrderSearch(e.target.value);
              setOrderPage(1);
            }}
            className="w-full bg-[#FAF8F3] border border-[#E8E4DC] rounded-lg py-2 pl-8 pr-3 text-xs text-[#171613] focus:outline-none focus:border-[#171613]"
          />
        </div>

        <div>
          <select
            value={orderStatusFilter}
            onChange={(e) => {
              setOrderStatusFilter(e.target.value);
              setOrderPage(1);
            }}
            className="w-full bg-[#FAF8F3] border border-[#E8E4DC] rounded-lg p-2 text-xs text-[#171613]"
          >
            <option value="all">Tất cả trạng thái</option>
            <option value="pending_confirmation">Chờ xác nhận</option>
            <option value="confirmed">Đã xác nhận</option>
            <option value="preparing">Đang chuẩn bị</option>
            <option value="shipping">Đang vận chuyển</option>
            <option value="delivered">Đã giao thành công</option>
            <option value="cancelled">Đã hủy</option>
          </select>
        </div>

        <div>
          <select
            value={orderPaymentFilter}
            onChange={(e) => {
              setOrderPaymentFilter(e.target.value);
              setOrderPage(1);
            }}
            className="w-full bg-[#FAF8F3] border border-[#E8E4DC] rounded-lg p-2 text-xs text-[#171613]"
          >
            <option value="all">Tất cả phương thức thanh toán</option>
            <option value="cod">Thanh toán khi nhận hàng (COD)</option>
            <option value="vietqr">Chuyển khoản VietQR</option>
            <option value="credit_card">Thẻ tín dụng / Ghi nợ</option>
          </select>
        </div>

        <div>
          <select
            value={orderDateRange}
            onChange={(e) => {
              setOrderDateRange(e.target.value as any);
              setOrderPage(1);
            }}
            className="w-full bg-[#FAF8F3] border border-[#E8E4DC] rounded-lg p-2 text-xs text-[#171613]"
          >
            <option value="all">Toàn bộ thời gian</option>
            <option value="today">Hôm nay</option>
            <option value="7days">7 ngày qua</option>
            <option value="30days">30 ngày qua</option>
          </select>
        </div>
      </div>

      {/* Bảng đơn hàng */}
      <div className="overflow-x-auto border border-[#E8E4DC] rounded-xl">
        <table className="w-full text-xs text-left border-collapse">
          <thead>
            <tr className="bg-[#FAF8F3] text-[#171613] uppercase font-bold text-[10px] tracking-wider border-b border-[#E8E4DC]">
              <th className="p-3">Mã đơn & Ngày đặt</th>
              <th className="p-3">Khách hàng</th>
              <th className="p-3">Sản phẩm</th>
              <th className="p-3">Tổng tiền</th>
              <th className="p-3">Thanh toán</th>
              <th className="p-3">Trạng thái</th>
              <th className="p-3 text-right">Thao tác</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#E8E4DC]">
            {paginatedOrders.length === 0 ? (
              <tr>
                <td colSpan={7} className="p-8 text-center text-[#747069]">
                  Không tìm thấy đơn hàng nào phù hợp với bộ lọc.
                </td>
              </tr>
            ) : (
              paginatedOrders.map((ord) => {
                const totalQty = ord.items.reduce((sum, i) => sum + i.quantity, 0);

                return (
                  <tr key={ord.id} className="hover:bg-[#FAF8F3] transition-colors">
                    <td className="p-3">
                      <div className="font-mono font-bold text-[#171613]">
                        {ord.orderCode || `#${ord.id}`}
                      </div>
                      <div className="text-[10px] text-[#747069] mt-0.5">
                        {formatDate(ord.createdAt)}
                      </div>
                    </td>

                    <td className="p-3">
                      <div className="font-semibold text-[#171613]">{ord.shippingAddress?.fullName}</div>
                      <div className="text-[10px] text-[#747069]">{ord.shippingAddress?.phone}</div>
                      <div className="text-[10px] text-[#A8A29E] truncate max-w-[150px]">
                        {ord.shippingAddress?.city}
                      </div>
                    </td>

                    <td className="p-3">
                      <div className="text-[11px] font-medium text-[#171613]">
                        {totalQty} sản phẩm
                      </div>
                      <div className="text-[10px] text-[#747069] truncate max-w-[200px]">
                        {ord.items[0]?.productName}{' '}
                        {ord.items.length > 1 && `+${ord.items.length - 1} món khác`}
                      </div>
                    </td>

                    <td className="p-3">
                      <span className="font-bold text-[#B83A3A] block">{formatPrice(ord.total)}</span>
                      {ord.discountAmount > 0 && (
                        <span className="text-[10px] text-[#15803D] block">
                          -{formatPrice(ord.discountAmount)} (Voucher)
                        </span>
                      )}
                    </td>

                    <td className="p-3">
                      <div className="font-semibold uppercase text-[10px] text-[#171613]">
                        {ord.paymentMethod === 'cod'
                          ? 'COD (Tiền mặt)'
                          : ord.paymentMethod === 'vietqr'
                          ? 'VietQR'
                          : 'Thẻ'}
                      </div>
                      <select
                        value={ord.paymentStatus || 'pending'}
                        onChange={async (e) => {
                          const newPay = e.target.value as Order['paymentStatus'];
                          await updateOrderStatus(
                            ord.id,
                            ord.status,
                            ord.statusLabel,
                            `Admin cập nhật thanh toán: ${newPay}`,
                            newPay
                          );
                        }}
                        className={`inline-block px-1.5 py-0.5 text-[10px] font-bold rounded mt-1 border cursor-pointer ${
                          ord.paymentStatus === 'paid'
                            ? 'bg-[#DCFCE7] text-[#15803D] border-[#86EFAC]'
                            : ord.paymentStatus === 'partially_paid'
                            ? 'bg-[#FEF3C7] text-[#D97706] border-[#FDE68A]'
                            : 'bg-[#F1F3F5] text-[#495057] border-[#CED4DA]'
                        }`}
                        title="Admin: Thay đổi trạng thái thanh toán"
                      >
                        <option value="pending">Chưa thu (pending)</option>
                        <option value="partially_paid">Đã cọc (partially_paid)</option>
                        <option value="paid">Đã thanh toán (paid)</option>
                        <option value="refunded">Đã hoàn tiền (refunded)</option>
                      </select>
                    </td>

                    <td className="p-3">
                      <select
                        value={ord.status}
                        onChange={async (e) => {
                          const newSt = e.target.value as OrderStatus;
                          const labelMap: Record<OrderStatus, string> = {
                            pending_confirmation: 'Chờ xác nhận',
                            confirmed: 'Đã xác nhận',
                            preparing: 'Đang chuẩn bị',
                            shipping: 'Đang vận chuyển',
                            delivered: 'Đã giao thành công',
                            cancelled: 'Đã hủy',
                            return_processing: 'Đang xử lý đổi trả'
                          };
                          const confirmChange =
                            newSt === 'cancelled'
                              ? confirm(
                                  `Bạn có chắc muốn HỦY đơn hàng ${ord.orderCode}? Toàn bộ số lượng hàng sẽ tự động hoàn trả vào kho!`
                                )
                              : true;
                          if (confirmChange) {
                            await updateOrderStatus(ord.id, newSt, labelMap[newSt], 'Cập nhật từ bảng quản trị');
                            await refreshProducts();
                          }
                        }}
                        className={`text-[11px] font-bold p-1 rounded border ${
                          ord.status === 'delivered'
                            ? 'bg-[#DCFCE7] text-[#15803D] border-[#86EFAC]'
                            : ord.status === 'cancelled'
                            ? 'bg-[#FEE2E2] text-[#DC2626] border-[#FCA5A5]'
                            : ord.status === 'shipping'
                            ? 'bg-[#E0F2FE] text-[#0284C7] border-[#BAE6FD]'
                            : ord.status === 'pending_confirmation'
                            ? 'bg-[#FEF3C7] text-[#D97706] border-[#FDE68A]'
                            : 'bg-[#FAF8F3] text-[#171613] border-[#E8E4DC]'
                        }`}
                      >
                        <option value="pending_confirmation">Chờ xác nhận</option>
                        <option value="confirmed">Đã xác nhận</option>
                        <option value="preparing">Đang chuẩn bị</option>
                        <option value="shipping">Đang vận chuyển</option>
                        <option value="delivered">Đã giao thành công</option>
                        <option value="cancelled">Đã hủy (Hoàn kho)</option>
                      </select>
                    </td>

                    <td className="p-3 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => setViewingOrderDetail(ord)}
                          className="px-2.5 py-1 bg-[#171613] text-[#FAF8F3] hover:bg-[#8A7158] rounded text-[11px] font-semibold transition-colors flex items-center gap-1"
                        >
                          <Eye className="w-3 h-3" />
                          <span>Chi tiết</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Phân trang */}
      {totalOrderPages > 1 && (
        <div className="flex items-center justify-between pt-2">
          <span className="text-xs text-[#747069]">
            Trang {orderPage} / {totalOrderPages}
          </span>
          <div className="flex items-center gap-1">
            <button
              disabled={orderPage === 1}
              onClick={() => setOrderPage((p) => Math.max(1, p - 1))}
              className="px-3 py-1 bg-[#FAF8F3] border border-[#E8E4DC] rounded text-xs disabled:opacity-50"
            >
              Trước
            </button>
            <button
              disabled={orderPage === totalOrderPages}
              onClick={() => setOrderPage((p) => Math.min(totalOrderPages, p + 1))}
              className="px-3 py-1 bg-[#FAF8F3] border border-[#E8E4DC] rounded text-xs disabled:opacity-50"
            >
              Sau
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
