'use client';

import React, { useState, useEffect } from 'react';
import { History, Search, RefreshCw, ShieldCheck, Filter } from 'lucide-react';
import { AdminAuditLogEntry } from '@/lib/audit';

export const AuditLogsTab: React.FC = () => {
  const [logs, setLogs] = useState<AdminAuditLogEntry[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [actionFilter, setActionFilter] = useState('all');
  const [search, setSearch] = useState('');

  const fetchLogs = async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams();
      if (actionFilter !== 'all') params.set('action', actionFilter);
      if (search.trim()) params.set('search', search.trim());
      params.set('limit', '100');

      const res = await fetch(`/api/admin/audit-logs?${params.toString()}`);
      if (res.ok) {
        const data = await res.json();
        if (data.success && Array.isArray(data.logs)) {
          setLogs(data.logs);
        }
      }
    } catch (e) {
      console.error('Failed to fetch audit logs', e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    let active = true;
    const loadLogs = async () => {
      try {
        const params = new URLSearchParams();
        if (actionFilter !== 'all') params.set('action', actionFilter);
        params.set('limit', '100');

        const res = await fetch(`/api/admin/audit-logs?${params.toString()}`);
        if (res.ok && active) {
          const data = await res.json();
          if (data.success && Array.isArray(data.logs)) {
            setLogs(data.logs);
          }
        }
      } catch (e) {
        console.error('Failed to fetch audit logs', e);
      }
    };
    void loadLogs();
    return () => {
      active = false;
    };
  }, [actionFilter]);

  const formatDate = (isoString: string) => {
    try {
      const d = new Date(isoString);
      return new Intl.DateTimeFormat('vi-VN', {
        dateStyle: 'short',
        timeStyle: 'medium'
      }).format(d);
    } catch {
      return isoString;
    }
  };

  const getActionBadge = (action: string) => {
    switch (action) {
      case 'price_change':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#FEF3C7] text-[#B45309]">Đổi Giá</span>;
      case 'order_status_update':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#E0F2FE] text-[#0369A1]">Cập Nhật Đơn</span>;
      case 'inventory_adjust':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#DCFCE7] text-[#15803D]">Điều Chỉnh Kho</span>;
      case 'bank_settings_update':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#F3E8FF] text-[#7E22CE]">Đổi Ngân Hàng</span>;
      case '2fa_enabled':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#ECFDF5] text-[#047857]">Bật 2FA</span>;
      case '2fa_disabled':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#FEE2E2] text-[#B91C1C]">Tắt 2FA</span>;
      case 'admin_login':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#F4F1EA] text-[#171613]">Đăng Nhập</span>;
      default:
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-gray-100 text-gray-700">{action}</span>;
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-[#E8E4DC] p-6 shadow-sm space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#F0ECE1]">
        <div>
          <div className="flex items-center gap-2">
            <History className="w-5 h-5 text-[#8A7158]" />
            <h2 className="font-editorial text-xl font-semibold text-[#171613]">
              Nhật Ký Thao Tác Quản Trị (Audit Log)
            </h2>
          </div>
          <p className="text-xs text-[#747069] mt-1">
            Bảng chỉ thêm (append-only), lưu vết bất biến mọi thay đổi giá bán, đơn hàng, tồn kho và cấu hình bảo mật.
          </p>
        </div>

        <button
          onClick={fetchLogs}
          disabled={isLoading}
          className="px-3.5 py-2 bg-[#FAF8F3] hover:bg-[#E8D7BD] border border-[#E8E4DC] text-xs font-semibold rounded-lg text-[#171613] transition-colors flex items-center gap-1.5 self-start sm:self-auto"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
          <span>Làm mới</span>
        </button>
      </div>

      {/* Bộ lọc & Tìm kiếm */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-3.5 h-3.5 absolute left-3 top-3 text-[#A8A29E]" />
          <input
            type="text"
            placeholder="Tìm theo người thực hiện, ID đối tượng, ghi chú..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && fetchLogs()}
            className="w-full bg-[#FAF8F3] border border-[#E8E4DC] rounded-lg py-2 pl-8 pr-3 text-xs text-[#171613] focus:outline-none focus:border-[#171613]"
          />
        </div>

        <div className="flex items-center gap-2">
          <Filter className="w-3.5 h-3.5 text-[#A8A29E]" />
          <select
            value={actionFilter}
            onChange={(e) => setActionFilter(e.target.value)}
            className="bg-[#FAF8F3] border border-[#E8E4DC] rounded-lg py-2 px-3 text-xs font-medium text-[#171613] focus:outline-none focus:border-[#171613]"
          >
            <option value="all">Tất cả hành động</option>
            <option value="price_change">Đổi giá sản phẩm</option>
            <option value="order_status_update">Cập nhật đơn hàng</option>
            <option value="inventory_adjust">Điều chỉnh kho</option>
            <option value="bank_settings_update">Đổi tài khoản ngân hàng</option>
            <option value="admin_login">Đăng nhập Admin</option>
            <option value="2fa_enabled">Kích hoạt 2FA</option>
            <option value="2fa_disabled">Tắt 2FA</option>
          </select>
        </div>
      </div>

      {/* Bảng danh sách log */}
      <div className="overflow-x-auto rounded-xl border border-[#E8E4DC]">
        <table className="w-full text-left text-xs">
          <thead className="bg-[#FAF8F3] border-b border-[#E8E4DC] text-[#747069] uppercase tracking-wider font-semibold">
            <tr>
              <th className="p-3">Thời Gian</th>
              <th className="p-3">Người Thực Hiện</th>
              <th className="p-3">Hành Động</th>
              <th className="p-3">Đối Tượng</th>
              <th className="p-3">Chi Tiết Biến Động</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#E8E4DC]">
            {logs.length === 0 ? (
              <tr>
                <td colSpan={5} className="p-6 text-center text-[#747069]">
                  {isLoading ? 'Đang tải nhật ký thao tác...' : 'Chưa có nhật ký nào được ghi nhận.'}
                </td>
              </tr>
            ) : (
              logs.map((log) => (
                <tr key={log.id} className="hover:bg-[#FAF8F3]/60 transition-colors">
                  <td className="p-3 text-[#747069] whitespace-nowrap font-mono text-[11px]">
                    {formatDate(log.createdAt)}
                  </td>
                  <td className="p-3 font-semibold text-[#171613] whitespace-nowrap">
                    {log.performedBy}
                  </td>
                  <td className="p-3 whitespace-nowrap">
                    {getActionBadge(log.action)}
                  </td>
                  <td className="p-3 text-[#747069] whitespace-nowrap">
                    <span className="font-mono text-[11px] font-bold text-[#171613]">{log.entityId}</span>
                    <span className="text-[10px] ml-1 uppercase text-[#A8A29E]">({log.entity})</span>
                  </td>
                  <td className="p-3 text-[#171613]">
                    <div className="max-w-md break-words text-[11px] bg-[#FAF8F3] p-2 rounded border border-[#E8E4DC] font-mono">
                      {log.details.before || log.details.after ? (
                        <div className="space-y-0.5">
                          {log.details.before && (
                            <div>
                              <span className="text-red-600 font-bold">Trước: </span>
                              {JSON.stringify(log.details.before)}
                            </div>
                          )}
                          {log.details.after && (
                            <div>
                              <span className="text-green-700 font-bold">Sau: </span>
                              {JSON.stringify(log.details.after)}
                            </div>
                          )}
                        </div>
                      ) : (
                        <span>{log.details.note || log.details.reason || JSON.stringify(log.details)}</span>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
