'use client';

import React from 'react';
import { InventoryLog } from '@/types';

interface InventoryLogsTabProps {
  inventoryLogs: InventoryLog[];
  fetchInventoryLogs: () => void;
  formatDate: (dateStr: string) => string;
}

export const InventoryLogsTab: React.FC<InventoryLogsTabProps> = ({
  inventoryLogs,
  fetchInventoryLogs,
  formatDate
}) => {
  return (
    <div className="bg-white rounded-2xl border border-[#E8E4DC] p-6 shadow-sm space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#F0ECE1]">
        <div>
          <h2 className="font-editorial text-xl font-semibold text-[#171613]">
            Nhật Ký Biến Động Kho Hàng
          </h2>
          <p className="text-xs text-[#747069]">
            Ghi nhận minh bạch mọi thao tác xuất/nhập/hủy hàng và đơn hàng liên quan. Tuyệt đối không âm kho.
          </p>
        </div>

        <button
          onClick={fetchInventoryLogs}
          className="px-3 py-1.5 bg-[#FAF8F3] hover:bg-[#E8D7BD] border border-[#E8E4DC] text-xs font-semibold rounded-lg text-[#171613] transition-colors"
        >
          Làm mới nhật ký
        </button>
      </div>

      <div className="overflow-x-auto border border-[#E8E4DC] rounded-xl">
        <table className="w-full text-xs text-left border-collapse">
          <thead>
            <tr className="bg-[#FAF8F3] text-[#171613] uppercase font-bold text-[10px] tracking-wider border-b border-[#E8E4DC]">
              <th className="p-3">Thời gian</th>
              <th className="p-3">Sản phẩm / Biến thể</th>
              <th className="p-3">Loại biến động</th>
              <th className="p-3 text-center">Trước</th>
              <th className="p-3 text-center">Thay đổi</th>
              <th className="p-3 text-center">Sau</th>
              <th className="p-3">Lý do & Mã đơn</th>
              <th className="p-3">Người thực hiện</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#E8E4DC]">
            {inventoryLogs.length === 0 ? (
              <tr>
                <td colSpan={8} className="p-8 text-center text-[#747069]">
                  Chưa có bản ghi biến động kho nào.
                </td>
              </tr>
            ) : (
              inventoryLogs.map((log) => {
                const isPositive = log.quantityChange > 0;
                return (
                  <tr key={log.id} className="hover:bg-[#FAF8F3]">
                    <td className="p-3 text-[#747069] whitespace-nowrap">
                      {formatDate(log.createdAt)}
                    </td>
                    <td className="p-3">
                      <div className="font-semibold text-[#171613]">{log.productName}</div>
                      {log.variantDesc && (
                        <div className="text-[10px] text-[#8A7158]">{log.variantDesc}</div>
                      )}
                    </td>
                    <td className="p-3">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          log.type === 'import'
                            ? 'bg-[#DCFCE7] text-[#15803D]'
                            : log.type === 'order_cancel_return'
                            ? 'bg-[#E0F2FE] text-[#0284C7]'
                            : log.type === 'order_deduct'
                            ? 'bg-[#FEF3C7] text-[#D97706]'
                            : 'bg-[#F1F3F5] text-[#495057]'
                        }`}
                      >
                        {log.type === 'import'
                          ? 'Nhập kho'
                          : log.type === 'order_deduct'
                          ? 'Xuất bán đơn'
                          : log.type === 'order_cancel_return'
                          ? 'Hoàn kho hủy đơn'
                          : 'Điều chỉnh'}
                      </span>
                    </td>
                    <td className="p-3 text-center text-[#747069] font-mono">{log.quantityBefore}</td>
                    <td className="p-3 text-center font-bold font-mono">
                      <span className={isPositive ? 'text-[#15803D]' : 'text-[#DC2626]'}>
                        {isPositive ? `+${log.quantityChange}` : log.quantityChange}
                      </span>
                    </td>
                    <td className="p-3 text-center font-bold text-[#171613] font-mono">
                      {log.quantityAfter}
                    </td>
                    <td className="p-3">
                      <div className="text-[#171613] max-w-xs">{log.reason}</div>
                      {log.orderId && (
                        <div className="text-[10px] font-mono text-[#8A7158]">{log.orderId}</div>
                      )}
                    </td>
                    <td className="p-3 text-[#747069] font-medium">{log.performedBy}</td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
