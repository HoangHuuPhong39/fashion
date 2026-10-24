'use client';

import React, { useState } from 'react';
import {
  Send,
  Search,
  CheckCircle2,
  Clock,
  Sparkles,
  ShieldCheck,
  AlertCircle,
  Plane,
  Package,
  Truck
} from 'lucide-react';
import { ConciergeRequest, ConciergeStatus } from '@/types';

export function ConciergeInteractive() {
  const [activeTab, setActiveTab] = useState<'request' | 'track'>('request');

  // Request form state
  const [serviceType, setServiceType] = useState<'international_order' | 'bespoke_tailoring'>('international_order');
  const [customerName, setCustomerName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [productName, setProductName] = useState('');
  const [productLink, setProductLink] = useState('');
  const [size, setSize] = useState('');
  const [color, setColor] = useState('');
  const [budgetVND, setBudgetVND] = useState('');
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitResult, setSubmitResult] = useState<{
    success: boolean;
    message: string;
    code?: string;
  } | null>(null);

  // Tracking state
  const [lookupCode, setLookupCode] = useState('');
  const [lookupContact, setLookupContact] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [trackedRequest, setTrackedRequest] = useState<ConciergeRequest | null>(null);
  const [trackingError, setTrackingError] = useState('');

  const handleSubmitRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitResult(null);

    try {
      const res = await fetch('/api/concierge', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          serviceType,
          customerName,
          phone,
          email,
          productName,
          productLink: productLink || undefined,
          size: size || undefined,
          color: color || undefined,
          budgetVND: budgetVND ? parseInt(budgetVND.replace(/\D/g, ''), 10) : undefined,
          notes: notes || undefined
        })
      });

      const data = await res.json();
      if (res.ok && data.success && data.request) {
        setSubmitResult({
          success: true,
          message: data.message,
          code: data.request.code
        });
        // Reset form
        setProductName('');
        setProductLink('');
        setSize('');
        setColor('');
        setBudgetVND('');
        setNotes('');
      } else {
        setSubmitResult({
          success: false,
          message: data.message || 'Không thể gửi yêu cầu lúc này.'
        });
      }
    } catch {
      setSubmitResult({
        success: false,
        message: 'Lỗi kết nối tới máy chủ. Vui lòng thử lại.'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleTrackRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!lookupCode.trim() || !lookupContact.trim()) return;

    setIsSearching(true);
    setTrackingError('');
    setTrackedRequest(null);

    try {
      const params = new URLSearchParams({
        code: lookupCode.trim(),
        contact: lookupContact.trim()
      });
      const res = await fetch(`/api/concierge?${params.toString()}`);
      const data = await res.json();

      if (res.ok && data.success && data.request) {
        setTrackedRequest(data.request);
      } else {
        setTrackingError(data.message || 'Không tìm thấy yêu cầu.');
      }
    } catch {
      setTrackingError('Lỗi kiểm tra tiến trình. Vui lòng thử lại.');
    } finally {
      setIsSearching(false);
    }
  };

  const PIPELINE_STEPS: { status: ConciergeStatus; title: string; icon: any }[] = [
    { status: 'received', title: 'Tiếp nhận', icon: CheckCircle2 },
    { status: 'quoted', title: 'Thẩm định & Báo giá', icon: Clock },
    { status: 'deposit_paid', title: 'Đã đặt cọc 50%', icon: ShieldCheck },
    { status: 'purchased', title: 'Đặt mua Boutique', icon: Sparkles },
    { status: 'shipping_international', title: 'Bay quốc tế', icon: Plane },
    { status: 'in_warehouse', title: 'Về kho Atelier', icon: Package },
    { status: 'delivered', title: 'Giao tận tay', icon: Truck }
  ];

  const getStepStatusIndex = (currentStatus: ConciergeStatus) => {
    return PIPELINE_STEPS.findIndex((s) => s.status === currentStatus);
  };

  const formatVND = (num: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(num);
  };

  return (
    <div className="bg-white rounded-3xl border border-[#E8E4DC] overflow-hidden shadow-sm">
      {/* 2 Tabs chuyển đổi */}
      <div className="flex border-b border-[#E8E4DC] bg-[#FAF8F3]">
        <button
          type="button"
          onClick={() => setActiveTab('request')}
          className={`flex-1 py-4 px-6 text-xs sm:text-sm font-semibold border-b-2 transition-all flex items-center justify-center gap-2 ${
            activeTab === 'request'
              ? 'border-[#171613] bg-white text-[#171613]'
              : 'border-transparent text-[#747069] hover:text-[#171613]'
          }`}
        >
          <Sparkles className="w-4 h-4 text-[#8A7158]" />
          <span>Gửi Yêu Cầu Order / May Đo</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('track')}
          className={`flex-1 py-4 px-6 text-xs sm:text-sm font-semibold border-b-2 transition-all flex items-center justify-center gap-2 ${
            activeTab === 'track'
              ? 'border-[#171613] bg-white text-[#171613]'
              : 'border-transparent text-[#747069] hover:text-[#171613]'
          }`}
        >
          <Search className="w-4 h-4 text-[#8A7158]" />
          <span>Tra Cứu Lộ Trình Concierge</span>
        </button>
      </div>

      <div className="p-6 sm:p-10">
        {activeTab === 'request' ? (
          <div className="space-y-6 max-w-2xl mx-auto">
            <div className="text-center space-y-1">
              <h3 className="font-editorial text-2xl font-semibold text-[#171613]">
                Điền Thông Tin Thiết Kế Bạn Mong Muốn
              </h3>
              <p className="text-xs text-[#747069]">
                Chuyên viên Atelier sẽ liên hệ báo giá và tư vấn phương án sở hữu tối ưu trong vòng 2 giờ.
              </p>
            </div>

            {submitResult && (
              <div
                className={`p-4 rounded-xl text-xs flex items-start gap-3 ${
                  submitResult.success
                    ? 'bg-[#F0FDF4] border border-[#86EFAC] text-[#15803D]'
                    : 'bg-[#FEE2E2] border border-[#FCA5A5] text-[#DC2626]'
                }`}
              >
                {submitResult.success ? (
                  <CheckCircle2 className="w-5 h-5 shrink-0 text-[#15803D]" />
                ) : (
                  <AlertCircle className="w-5 h-5 shrink-0 text-[#DC2626]" />
                )}
                <div className="space-y-1">
                  <p className="font-semibold">{submitResult.message}</p>
                  {submitResult.code && (
                    <p className="text-[#171613]">
                      Mã yêu cầu của bạn là:{' '}
                      <strong className="font-mono bg-white px-2 py-0.5 rounded border border-[#86EFAC]">
                        {submitResult.code}
                      </strong>
                      . Bạn có thể dùng mã này để theo dõi tiến trình đơn ở tab bên cạnh.
                    </p>
                  )}
                </div>
              </div>
            )}

            <form onSubmit={handleSubmitRequest} className="space-y-4 text-xs">
              {/* Lựa chọn loại dịch vụ */}
              <div>
                <label className="block text-[#171613] font-semibold mb-2">
                  Loại dịch vụ bạn muốn đặt:
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setServiceType('international_order')}
                    className={`p-3 rounded-xl border text-left transition-all ${
                      serviceType === 'international_order'
                        ? 'border-[#171613] bg-[#FAF8F3] font-bold text-[#171613]'
                        : 'border-[#E8E4DC] text-[#747069] hover:border-[#171613]'
                    }`}
                  >
                    <span className="block text-xs">✈️ Order Quốc Tế</span>
                    <span className="text-[10px] font-normal text-[#747069] block mt-0.5">
                      Boutique Pháp, Ý, Hàn Quốc, Nhật Bản
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setServiceType('bespoke_tailoring')}
                    className={`p-3 rounded-xl border text-left transition-all ${
                      serviceType === 'bespoke_tailoring'
                        ? 'border-[#171613] bg-[#FAF8F3] font-bold text-[#171613]'
                        : 'border-[#E8E4DC] text-[#747069] hover:border-[#171613]'
                    }`}
                  >
                    <span className="block text-xs">🪡 May Đo Bespoke</span>
                    <span className="text-[10px] font-normal text-[#747069] block mt-0.5">
                      Đo ni đóng giày theo thông số cơ thể
                    </span>
                  </button>
                </div>
              </div>

              {/* Thông tin cá nhân */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label htmlFor="concierge-name" className="block text-[#747069] font-medium mb-1">
                    Họ và tên *
                  </label>
                  <input
                    id="concierge-name"
                    type="text"
                    required
                    placeholder="Nguyễn Thị Mai"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="w-full bg-[#FAF8F3] border border-[#E8E4DC] rounded-lg p-2.5 text-[#171613] focus:outline-none focus:border-[#8A7158]"
                  />
                </div>

                <div>
                  <label htmlFor="concierge-phone" className="block text-[#747069] font-medium mb-1">
                    Số điện thoại / Zalo *
                  </label>
                  <input
                    id="concierge-phone"
                    type="tel"
                    required
                    placeholder="09xx xxx xxx"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full bg-[#FAF8F3] border border-[#E8E4DC] rounded-lg p-2.5 text-[#171613] focus:outline-none focus:border-[#8A7158]"
                  />
                </div>

                <div>
                  <label htmlFor="concierge-email" className="block text-[#747069] font-medium mb-1">
                    Email nhận báo giá *
                  </label>
                  <input
                    id="concierge-email"
                    type="email"
                    required
                    placeholder="email@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-[#FAF8F3] border border-[#E8E4DC] rounded-lg p-2.5 text-[#171613] focus:outline-none focus:border-[#8A7158]"
                  />
                </div>
              </div>

              {/* Tên sản phẩm & Link */}
              <div>
                <label htmlFor="concierge-prod-name" className="block text-[#747069] font-medium mb-1">
                  Tên sản phẩm / Thiết kế cần tìm *
                </label>
                <input
                  id="concierge-prod-name"
                  type="text"
                  required
                  placeholder="Ví dụ: Đầm lụa Zimmermann Alabaster / Trench Coat Burberry Kensington..."
                  value={productName}
                  onChange={(e) => setProductName(e.target.value)}
                  className="w-full bg-[#FAF8F3] border border-[#E8E4DC] rounded-lg p-2.5 text-[#171613] focus:outline-none focus:border-[#8A7158]"
                />
              </div>

              <div>
                <label htmlFor="concierge-link" className="block text-[#747069] font-medium mb-1">
                  Đường dẫn (Link) sản phẩm hoặc ảnh mẫu trên web (nếu có)
                </label>
                <input
                  id="concierge-link"
                  type="url"
                  placeholder="https://..."
                  value={productLink}
                  onChange={(e) => setProductLink(e.target.value)}
                  className="w-full bg-[#FAF8F3] border border-[#E8E4DC] rounded-lg p-2.5 text-[#171613] focus:outline-none focus:border-[#8A7158]"
                />
              </div>

              {/* Size, Màu, Ngân sách */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label htmlFor="concierge-size" className="block text-[#747069] font-medium mb-1">
                    Kích cỡ (Size)
                  </label>
                  <input
                    id="concierge-size"
                    type="text"
                    placeholder="VD: Size S / 36 EU / May đo"
                    value={size}
                    onChange={(e) => setSize(e.target.value)}
                    className="w-full bg-[#FAF8F3] border border-[#E8E4DC] rounded-lg p-2.5 text-[#171613] focus:outline-none focus:border-[#8A7158]"
                  />
                </div>

                <div>
                  <label htmlFor="concierge-color" className="block text-[#747069] font-medium mb-1">
                    Màu sắc ưu tiên
                  </label>
                  <input
                    id="concierge-color"
                    type="text"
                    placeholder="VD: Kem / Đen / Họa tiết hoa"
                    value={color}
                    onChange={(e) => setColor(e.target.value)}
                    className="w-full bg-[#FAF8F3] border border-[#E8E4DC] rounded-lg p-2.5 text-[#171613] focus:outline-none focus:border-[#8A7158]"
                  />
                </div>

                <div>
                  <label htmlFor="concierge-budget" className="block text-[#747069] font-medium mb-1">
                    Ngân sách dự kiến (VND)
                  </label>
                  <input
                    id="concierge-budget"
                    type="text"
                    placeholder="VD: 5.000.000"
                    value={budgetVND}
                    onChange={(e) => setBudgetVND(e.target.value)}
                    className="w-full bg-[#FAF8F3] border border-[#E8E4DC] rounded-lg p-2.5 text-[#171613] focus:outline-none focus:border-[#8A7158] font-mono"
                  />
                </div>
              </div>

              {/* Ghi chú */}
              <div>
                <label htmlFor="concierge-notes" className="block text-[#747069] font-medium mb-1">
                  Ghi chú chi tiết thêm (Yêu cầu hóa đơn boutique, thời hạn cần nhận, số đo chi tiết...)
                </label>
                <textarea
                  id="concierge-notes"
                  rows={3}
                  placeholder="Ghi chú thêm cho chuyên viên Atelier..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full bg-[#FAF8F3] border border-[#E8E4DC] rounded-lg p-2.5 text-[#171613] focus:outline-none focus:border-[#8A7158]"
                />
              </div>

              {/* Điều khoản cọc & hoàn tiền minh bạch */}
              <div className="p-3 bg-[#FAF8F3] border border-[#E8E4DC] rounded-xl text-[11px] text-[#747069] space-y-1">
                <span className="font-bold text-[#171613] block">Chính sách đặt cọc & bảo hiểm:</span>
                <p>• Quý khách đặt cọc 50% sau khi đồng ý với báo giá chính thức của Atelier.</p>
                <p>• Hoàn tiền cọc 100% trong 24 giờ nếu boutique quốc tế hết hàng hoặc không mua được trong 7 ngày.</p>
                <p>• Đầy đủ hóa đơn gốc từ boutique, hộp, túi giấy nguyên bản và bảo hiểm vận chuyển bay toàn phần.</p>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3.5 bg-[#171613] hover:bg-[#8A7158] text-white text-xs font-bold uppercase tracking-wider rounded-xl transition-colors shadow-sm disabled:opacity-50 flex items-center justify-center gap-2"
              >
                <Send className="w-4 h-4" />
                <span>{isSubmitting ? 'Đang gửi yêu cầu...' : 'Gửi Yêu Cầu Fashion Concierge'}</span>
              </button>
            </form>
          </div>
        ) : (
          <div className="space-y-8 max-w-2xl mx-auto">
            <div className="text-center space-y-1">
              <h3 className="font-editorial text-2xl font-semibold text-[#171613]">
                Tra Cứu Lộ Trình Concierge
              </h3>
              <p className="text-xs text-[#747069]">
                Nhập mã yêu cầu (dạng CR-xxxxxx) và số điện thoại hoặc email đăng ký để theo dõi tiến trình thực tế.
              </p>
            </div>

            <form onSubmit={handleTrackRequest} className="flex flex-col sm:flex-row gap-3">
              <input
                type="text"
                required
                placeholder="Mã yêu cầu (VD: CR-123456)"
                value={lookupCode}
                onChange={(e) => setLookupCode(e.target.value)}
                className="flex-1 bg-[#FAF8F3] border border-[#E8E4DC] rounded-xl px-4 py-3 text-xs uppercase font-mono font-bold text-[#171613] focus:outline-none focus:border-[#8A7158]"
              />
              <input
                type="text"
                required
                placeholder="Số điện thoại hoặc Email"
                value={lookupContact}
                onChange={(e) => setLookupContact(e.target.value)}
                className="flex-1 bg-[#FAF8F3] border border-[#E8E4DC] rounded-xl px-4 py-3 text-xs text-[#171613] focus:outline-none focus:border-[#8A7158]"
              />
              <button
                type="submit"
                disabled={isSearching}
                className="px-6 py-3 bg-[#171613] text-white text-xs font-bold rounded-xl hover:bg-[#8A7158] transition-colors shrink-0 disabled:opacity-50"
              >
                {isSearching ? 'Đang tra cứu...' : 'Tra Cứu'}
              </button>
            </form>

            {trackingError && (
              <div className="p-4 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{trackingError}</span>
              </div>
            )}

            {trackedRequest && (
              <div className="space-y-6 pt-4 border-t border-[#E8E4DC] animate-in fade-in duration-300">
                {/* Thông tin tóm tắt yêu cầu */}
                <div className="p-5 bg-[#FAF8F3] rounded-2xl border border-[#E8E4DC] space-y-3">
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <span className="font-mono text-xs font-bold bg-white px-2.5 py-1 rounded border border-[#E8E4DC]">
                      {trackedRequest.code}
                    </span>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-[#8A7158]">
                      {trackedRequest.serviceType === 'bespoke_tailoring' ? 'May đo Bespoke' : 'Order Quốc Tế'}
                    </span>
                  </div>

                  <h4 className="font-editorial text-lg font-semibold text-[#171613]">
                    {trackedRequest.productName}
                  </h4>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs text-[#747069] pt-2 border-t border-[#E8E4DC]">
                    <div>
                      <span className="block text-[10px] text-[#A8A29E]">Khách hàng:</span>
                      <strong className="text-[#171613]">{trackedRequest.customerName}</strong>
                    </div>
                    <div>
                      <span className="block text-[10px] text-[#A8A29E]">Kích cỡ / Màu:</span>
                      <strong className="text-[#171613]">
                        {trackedRequest.size || 'Theo mẫu'} - {trackedRequest.color || 'Nguyên bản'}
                      </strong>
                    </div>
                    <div>
                      <span className="block text-[10px] text-[#A8A29E]">Báo giá trọn gói:</span>
                      <strong className="text-[#B83A3A] font-bold">
                        {trackedRequest.quotedPrice ? formatVND(trackedRequest.quotedPrice) : 'Đang thẩm định'}
                      </strong>
                    </div>
                    <div>
                      <span className="block text-[10px] text-[#A8A29E]">Đã đặt cọc 50%:</span>
                      <strong className="text-[#15803D]">
                        {trackedRequest.depositAmount ? formatVND(trackedRequest.depositAmount) : 'Chưa đặt cọc'}
                      </strong>
                    </div>
                  </div>
                </div>

                {/* Timeline 7 bước Pipeline */}
                <div className="space-y-4">
                  <h4 className="font-editorial text-base font-semibold text-[#171613]">
                    Lộ Trình Xử Lý Thực Tế
                  </h4>

                  <div className="relative pl-6 border-l-2 border-[#E8E4DC] space-y-6">
                    {PIPELINE_STEPS.map((step, idx) => {
                      const currentIdx = getStepStatusIndex(trackedRequest.status);
                      const isCompleted = idx < currentIdx;
                      const isCurrent = idx === currentIdx;

                      return (
                        <div key={step.status} className="relative">
                          <span
                            className={`absolute -left-[31px] top-0 w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold ${
                              isCompleted
                                ? 'bg-[#15803D] text-white'
                                : isCurrent
                                ? 'bg-[#171613] text-white ring-4 ring-[#8A7158]/20'
                                : 'bg-[#FAF8F3] text-[#A8A29E] border border-[#E8E4DC]'
                            }`}
                          >
                            {isCompleted ? '✓' : idx + 1}
                          </span>

                          <div className={idx > currentIdx ? 'opacity-40' : ''}>
                            <h5 className="font-bold text-xs text-[#171613] flex items-center gap-2">
                              <span>{step.title}</span>
                              {isCurrent && (
                                <span className="text-[10px] font-normal bg-[#8A7158] text-white px-2 py-0.5 rounded-full">
                                  Đang thực hiện
                                </span>
                              )}
                            </h5>

                            {/* Ghi chú lịch sử tương ứng nếu có */}
                            {trackedRequest.statusHistory?.map((h, hIdx) => {
                              if (h.status === step.status) {
                                return (
                                  <div key={hIdx} className="text-xs text-[#747069] mt-1 space-y-0.5">
                                    <p>{h.note || h.label}</p>
                                    <span className="text-[10px] text-[#A8A29E] block">
                                      {new Date(h.changedAt).toLocaleString('vi-VN')}
                                    </span>
                                  </div>
                                );
                              }
                              return null;
                            })}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
