'use client';

import React, { useState, useEffect } from 'react';
import { MessageSquare, X, ExternalLink } from 'lucide-react';

export function FloatingContactWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Trì hoãn hiển thị 1.5 giây sau khi trang nạp để tối ưu chỉ số First Contentful Paint & LCP
    const timer = setTimeout(() => setMounted(true), 1500);
    return () => clearTimeout(timer);
  }, []);

  if (!mounted) return null;

  const zaloPhone = process.env.NEXT_PUBLIC_ZALO_PHONE || '0366861159';
  const messengerUrl = process.env.NEXT_PUBLIC_MESSENGER_URL || 'https://m.me/tadafashionatelier';

  return (
    <aside
      aria-label="Kênh hỗ trợ trực tuyến"
      className="fixed bottom-24 sm:bottom-6 right-4 sm:right-6 z-40 flex flex-col items-end print:hidden select-none"
    >
      {/* Menu các kênh chat khi mở */}
      {isOpen && (
        <div
          role="dialog"
          aria-label="Chọn kênh chat tư vấn"
          className="mb-3 bg-white border border-[#E8E4DC] rounded-2xl p-3 shadow-2xl space-y-2 w-56 animate-in fade-in slide-in-from-bottom-2 duration-200"
        >
          <div className="flex items-center justify-between pb-2 border-b border-[#E8E4DC] px-1">
            <span className="text-[11px] font-bold text-[#171613] uppercase tracking-wider">
              Tư Vấn Trực Tuyến
            </span>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="p-1 rounded-full text-[#747069] hover:text-[#171613] hover:bg-[#FAF8F3]"
              aria-label="Đóng bảng chat"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Kênh Zalo */}
          <a
            href={`https://zalo.me/${zaloPhone.replace(/\s+/g, '')}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2.5 p-2 rounded-xl hover:bg-[#FAF8F3] transition-colors group"
          >
            <div className="w-8 h-8 rounded-full bg-[#0068FF] text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-xs">
              Z
            </div>
            <div className="flex-1 min-w-0">
              <span className="text-xs font-semibold text-[#171613] block group-hover:text-[#0068FF] transition-colors">
                Chat qua Zalo
              </span>
              <span className="text-[10px] text-[#747069] block truncate font-mono">
                {zaloPhone}
              </span>
            </div>
            <ExternalLink className="w-3.5 h-3.5 text-[#A8A29E] group-hover:text-[#171613]" />
          </a>

          {/* Kênh Facebook Messenger */}
          <a
            href={messengerUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2.5 p-2 rounded-xl hover:bg-[#FAF8F3] transition-colors group"
          >
            <div className="w-8 h-8 rounded-full bg-[#0084FF] text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-xs">
              M
            </div>
            <div className="flex-1 min-w-0">
              <span className="text-xs font-semibold text-[#171613] block group-hover:text-[#0084FF] transition-colors">
                Messenger
              </span>
              <span className="text-[10px] text-[#747069] block truncate">
                TADA! Atelier Stylist
              </span>
            </div>
            <ExternalLink className="w-3.5 h-3.5 text-[#A8A29E] group-hover:text-[#171613]" />
          </a>
        </div>
      )}

      {/* Nút tròn kích hoạt chính */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        aria-label="Hỗ trợ & Tư vấn trực tiếp"
        className="w-12 h-12 rounded-full bg-[#171613] hover:bg-[#8A7158] text-[#FAF8F3] shadow-lg flex items-center justify-center transition-all hover:scale-105 active:scale-95 border-2 border-[#FAF8F3]"
      >
        {isOpen ? <X className="w-5 h-5" /> : <MessageSquare className="w-5 h-5" />}
      </button>
    </aside>
  );
}
