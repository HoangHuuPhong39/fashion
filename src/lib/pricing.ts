import { MembershipTier } from '@/types';

export interface CouponRule {
  code: string;
  discountPercent: number;
  isFreeship: boolean;
  description: string;
  minOrderAmount?: number;
  maxUsage?: number;
}

export const VALID_COUPONS: Record<string, CouponRule> = {
  TADAVIP: {
    code: 'TADAVIP',
    discountPercent: 10,
    isFreeship: false,
    description: 'Giảm 10% tổng đơn hàng (đơn từ 500K)',
    minOrderAmount: 500000,
    maxUsage: 1000
  },
  FREESHIP: {
    code: 'FREESHIP',
    discountPercent: 0,
    isFreeship: true,
    description: 'Miễn phí vận chuyển toàn quốc (đơn từ 299K)',
    minOrderAmount: 299000,
    maxUsage: 5000
  },
  FALL2026: {
    code: 'FALL2026',
    discountPercent: 15,
    isFreeship: false,
    description: 'Giảm 15% cho BST Thu Đông 2026 (đơn từ 1 triệu)',
    minOrderAmount: 1000000,
    maxUsage: 500
  }
};

export const MEMBERSHIP_DISCOUNT_PERCENT: Record<MembershipTier, number> = {
  bronze: 0,
  silver: 5,
  gold: 10,
  diamond: 15
};

export const STANDARD_SHIPPING_FEE = 35000;
export const FREESHIP_THRESHOLD = 499000;

export interface PricingCalculationResult {
  subtotal: number;
  shippingFee: number;
  couponDiscountAmount: number;
  membershipDiscountAmount: number;
  totalDiscount: number;
  appliedCoupon: string | null;
  couponMessage?: string;
  total: number;
}

/**
 * Tính toán biểu phí, chiết khấu và tổng thanh toán chuẩn xác phía Server & Client
 * Quy tắc bảo mật: Mã giảm giá KHÔNG cộng dồn với chiết khấu hạng thành viên (áp dụng mức ưu đãi cao nhất).
 */
export function calculateOrderPricing(params: {
  subtotal: number;
  couponCode?: string | null;
  membershipTier?: MembershipTier | null;
  shippingMethod?: 'standard' | 'express';
  couponUsageCount?: number;
}): PricingCalculationResult {
  const { subtotal, couponCode, membershipTier, shippingMethod, couponUsageCount = 0 } = params;

  if (subtotal <= 0) {
    return {
      subtotal: 0,
      shippingFee: 0,
      couponDiscountAmount: 0,
      membershipDiscountAmount: 0,
      totalDiscount: 0,
      appliedCoupon: null,
      total: 0
    };
  }

  // 1. Kiểm tra mã giảm giá hợp lệ
  const cleanCode = (couponCode || '').trim().toUpperCase();
  const couponRule = cleanCode ? VALID_COUPONS[cleanCode] || null : null;
  let appliedCoupon: string | null = null;
  let couponDiscountAmount = 0;
  let isCouponFreeship = false;
  let couponMessage: string | undefined = undefined;

  if (couponRule) {
    // Kiểm tra mức đơn tối thiểu
    if (couponRule.minOrderAmount && subtotal < couponRule.minOrderAmount) {
      couponMessage = `Mã ${couponRule.code} yêu cầu đơn hàng tối thiểu ${new Intl.NumberFormat('vi-VN').format(couponRule.minOrderAmount)}đ.`;
    } else if (couponRule.maxUsage && couponUsageCount >= couponRule.maxUsage) {
      // Kiểm tra giới hạn lượt dùng
      couponMessage = `Mã ${couponRule.code} đã đạt giới hạn lượt sử dụng.`;
    } else {
      appliedCoupon = couponRule.code;
      isCouponFreeship = couponRule.isFreeship;
      const discountPercent = couponRule.discountPercent;
      couponDiscountAmount = Math.round((subtotal * discountPercent) / 100);
    }
  }

  // 2. Chiết khấu theo cấp bậc Hội Viên
  const tier = membershipTier || 'bronze';
  const membershipDiscountPercent = MEMBERSHIP_DISCOUNT_PERCENT[tier] || 0;
  let membershipDiscountAmount = Math.round((subtotal * membershipDiscountPercent) / 100);

  // 3. Quy tắc KHÔNG CỘNG DỒN: Nếu cả mã giảm giá và hội viên đều có giảm giá tiền mặt
  // Khách hàng nhận mức chiết khấu cao nhất, không cộng dồn hai ưu đãi
  let totalDiscount = 0;
  if (couponDiscountAmount > 0 && membershipDiscountAmount > 0) {
    if (couponDiscountAmount >= membershipDiscountAmount) {
      totalDiscount = couponDiscountAmount;
      membershipDiscountAmount = 0; // Ưu tiên coupon lớn hơn
    } else {
      totalDiscount = membershipDiscountAmount;
      couponDiscountAmount = 0; // Ưu tiên hạng thành viên lớn hơn
    }
  } else {
    totalDiscount = couponDiscountAmount + membershipDiscountAmount;
  }

  // 4. Phí vận chuyển
  const isVipFreeship = tier === 'gold' || tier === 'diamond';
  const isThresholdFreeship = subtotal >= FREESHIP_THRESHOLD;

  let shippingFee = STANDARD_SHIPPING_FEE;
  if (shippingMethod === 'express') {
    shippingFee = 50000;
    // Hạng Diamond được freeship cả hỏa tốc
    if (tier === 'diamond') {
      shippingFee = 0;
    }
  } else {
    if (isVipFreeship || isCouponFreeship || isThresholdFreeship) {
      shippingFee = 0;
    }
  }

  const total = Math.max(0, subtotal - totalDiscount + shippingFee);

  return {
    subtotal,
    shippingFee,
    couponDiscountAmount,
    membershipDiscountAmount,
    totalDiscount,
    appliedCoupon,
    couponMessage,
    total
  };
}
