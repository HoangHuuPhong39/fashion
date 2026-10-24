'use client';

import React, { useState } from 'react';
import { Send, CheckCircle2, AlertCircle } from 'lucide-react';

export function ContactForm() {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [statusMsg, setStatusMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatusMsg(null);
    setIsLoading(true);

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fullName, email, phone, subject, message }),
      });
      const data = await res.json();

      if (!res.ok || !data.success) {
        setStatusMsg({ type: 'error', text: data.message || 'Không thể gửi tin nhắn. Vui lòng thử lại sau.' });
      } else {
        setStatusMsg({ type: 'success', text: data.message });
        setFullName('');
        setEmail('');
        setPhone('');
        setSubject('');
        setMessage('');
      }
    } catch {
      setStatusMsg({ type: 'error', text: 'Lỗi kết nối máy chủ. Vui lòng kiểm tra đường truyền mạng.' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 text-xs">
      {statusMsg && (
        <div
          className={`p-4 rounded-xl flex items-start gap-2.5 ${
            statusMsg.type === 'success'
              ? 'bg-[#E8F5E9] border border-[#C8E6C9] text-[#15803D]'
              : 'bg-[#FEE2E2] border border-[#FCA5A5] text-[#DC2626]'
          }`}
        >
          {statusMsg.type === 'success' ? (
            <CheckCircle2 className="w-5 h-5 shrink-0" />
          ) : (
            <AlertCircle className="w-5 h-5 shrink-0" />
          )}
          <span className="leading-relaxed">{statusMsg.text}</span>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-[#171613] font-semibold mb-1">Họ và tên quý khách *</label>
          <input
            type="text"
            required
            placeholder="Ví dụ: Nguyễn Phương Mai"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className="w-full bg-[#FAF8F3] border border-[#E8E4DC] rounded-xl p-3 text-xs text-[#171613] focus:border-[#171613] focus:outline-none transition-colors"
          />
        </div>

        <div>
          <label className="block text-[#171613] font-semibold mb-1">Địa chỉ Email *</label>
          <input
            type="email"
            required
            placeholder="email@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full bg-[#FAF8F3] border border-[#E8E4DC] rounded-xl p-3 text-xs text-[#171613] focus:border-[#171613] focus:outline-none transition-colors"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-[#171613] font-semibold mb-1">Số điện thoại liên hệ</label>
          <input
            type="tel"
            placeholder="0987 654 321"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="w-full bg-[#FAF8F3] border border-[#E8E4DC] rounded-xl p-3 text-xs text-[#171613] focus:border-[#171613] focus:outline-none transition-colors"
          />
        </div>

        <div>
          <label className="block text-[#171613] font-semibold mb-1">Chủ đề cần tư vấn *</label>
          <input
            type="text"
            required
            placeholder="Ví dụ: Tư vấn may đo đầm dạ hội"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            className="w-full bg-[#FAF8F3] border border-[#E8E4DC] rounded-xl p-3 text-xs text-[#171613] focus:border-[#171613] focus:outline-none transition-colors"
          />
        </div>
      </div>

      <div>
        <label className="block text-[#171613] font-semibold mb-1">Nội dung tin nhắn &amp; yêu cầu chi tiết *</label>
        <textarea
          rows={5}
          required
          placeholder="Mô tả cụ thể về kiểu dáng, sở thích chất liệu, số đo hoặc thắc mắc của bạn..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="w-full bg-[#FAF8F3] border border-[#E8E4DC] rounded-xl p-3 text-xs text-[#171613] focus:border-[#171613] focus:outline-none transition-colors"
        />
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="w-full py-3.5 bg-[#171613] hover:bg-[#8A7158] text-white text-xs font-bold uppercase tracking-wider rounded-xl transition-all shadow-sm flex items-center justify-center gap-2 disabled:opacity-50"
      >
        <Send className="w-4 h-4" />
        <span>{isLoading ? 'Đang gửi tin nhắn...' : 'Gửi Tin Nhắn Đến Atelier'}</span>
      </button>
    </form>
  );
}
