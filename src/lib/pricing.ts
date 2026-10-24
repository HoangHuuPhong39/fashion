import { MembershipTier } from '@/types';

export interface CouponRule {
  code: string;
  discountPercent: number;
  isFreeship: boolean;
  description: string;
}

export const VALID_COUPONS: Record<string, CouponRule> = {
  TADAVIP: {
    code: 'TADAVIP',
    discountPercent: 10,
    isFreeship: false,
    description: 'Giảm 10% tổng đơn hàng'
  },
  LUMIEREVIP: {
    code: 'LUMIEREVIP',
    discountPercent: 10,
    isFreeship: false,
    description: 'Giảm 10% tổng đơn hàng'
  },
  FREESHIP: {
    code: 'FREESHIP',
    discountPercent: 0,
    isFreeship: true,
    description: 'Miễn phí vận chuyển toàn quốc'
  },
  FALL2026: {
    code: 'FALL2026',
    discountPercent: 15,
    isFreeship: false,
    description: 'Giảm 15% cho BST Thu Đông 2026'
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
  total: number;
}

/**
 * Tính toán biểu phí, chiết khấu và tổng thanh toán chuẩn xác phía Server & Client
 */
export function calculateOrderPricing(params: {
  subtotal: number;
  couponCode?: string | null;
  membershipTier?: MembershipTier | null;
  shippingMethod?: 'standard' | 'express';
}): PricingCalculationResult {
  const { subtotal, couponCode, membershipTier, shippingMethod } = params;

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

  // 1. Kiểm tra mã giảm giá
  const cleanCode = (couponCode || '').trim().toUpperCase();
  const couponRule = cleanCode ? VALID_COUPONS[cleanCode] || null : null;
  const appliedCoupon = couponRule ? couponRule.code : null;

  const couponDiscountPercent = couponRule ? couponRule.discountPercent : 0;
  const couponDiscountAmount = Math.round((subtotal * couponDiscountPercent) / 100);

  // 2. Chiết khấu theo cấp bậc Hội Viên
  const tier = membershipTier || 'bronze';
  const membershipDiscountPercent = MEMBERSHIP_DISCOUNT_PERCENT[tier] || 0;
  const membershipDiscountAmount = Math.round((subtotal * membershipDiscountPercent) / 100);

  // 3. Phí vận chuyển
  const isVipFreeship = tier === 'gold' || tier === 'diamond';
  const isCouponFreeship = couponRule ? couponRule.isFreeship : false;
  const isThresholdFreeship = subtotal >= FREESHIP_THRESHOLD;

  let shippingFee = STANDARD_SHIPPING_FEE;
  if (shippingMethod === 'express') {
    shippingFee = 50000;
  }

  if (isVipFreeship || isCouponFreeship || isThresholdFreeship) {
    shippingFee = 0;
  }

  // 4. Tổng thanh toán
  const totalDiscount = couponDiscountAmount + membershipDiscountAmount;
  const total = Math.max(0, subtotal - totalDiscount + shippingFee);

  return {
    subtotal,
    shippingFee,
    couponDiscountAmount,
    membershipDiscountAmount,
    totalDiscount,
    appliedCoupon,
    total
  };
}
