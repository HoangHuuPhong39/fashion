import { MembershipTier } from '@/types';
import { FREESHIP_THRESHOLD } from '@/lib/pricing';

export interface ShippingCalculationParams {
  province?: string;
  district?: string;
  subtotal: number;
  shippingMethod?: 'standard' | 'express';
  membershipTier?: MembershipTier | null;
  isCouponFreeship?: boolean;
}

export interface ShippingEstimateResult {
  shippingFee: number;
  estimatedDeliveryText: string;
  isFree: boolean;
  provider: 'ghn' | 'fallback';
}

/**
 * Adapter tích hợp đơn vị vận chuyển GHN (Giao Hàng Nhanh)
 */
export async function calculateGHNFee(
  fromDistrictId: number,
  toDistrictId: number,
  weightInGrams: number = 500
): Promise<number | null> {
  const token = process.env.GHN_API_TOKEN;
  const shopId = process.env.GHN_SHOP_ID;

  if (!token || !shopId) return null;

  try {
    const res = await fetch('https://online-gateway.ghn.vn/shiip/public-api/v2/shipping-order/fee', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Token: token,
        ShopId: shopId
      },
      body: JSON.stringify({
        service_type_id: 2, // Chuẩn
        from_district_id: fromDistrictId,
        to_district_id: toDistrictId,
        weight: weightInGrams
      }),
      signal: AbortSignal.timeout(3000) // Timeout 3s để không làm nghẽn trang checkout
    });

    if (!res.ok) return null;
    const data = await res.json();
    if (data.code === 200 && data.data?.total) {
      return Number(data.data.total);
    }
    return null;
  } catch {
    return null; // Fallback an toàn về cước chuẩn của Atelier
  }
}

/**
 * Hàm tính toán phí vận chuyển chính thức phía Server & hiển thị giao diện Client
 * QUY TẮC BẢO MẬT: Mọi đơn hàng phải chạy qua hàm này ở server khi tạo đơn
 */
export function calculateServerShipping(params: ShippingCalculationParams): ShippingEstimateResult {
  const {
    province = '',
    subtotal,
    shippingMethod = 'standard',
    membershipTier = 'bronze',
    isCouponFreeship = false
  } = params;

  const cleanProvince = province.trim().toLowerCase();
  const isMetro =
    cleanProvince.includes('hà nội') ||
    cleanProvince.includes('ha noi') ||
    cleanProvince.includes('hồ chí minh') ||
    cleanProvince.includes('ho chi minh') ||
    cleanProvince.includes('sài gòn') ||
    cleanProvince.includes('hcm');

  // Kiểm tra điều kiện miễn phí vận chuyển
  const isVipFreeship = membershipTier === 'gold' || membershipTier === 'diamond';
  const isThresholdFreeship = subtotal >= FREESHIP_THRESHOLD;

  if (shippingMethod === 'express') {
    // Hỏa tốc: Thành viên Diamond được miễn phí hỏa tốc
    if (membershipTier === 'diamond') {
      return {
        shippingFee: 0,
        estimatedDeliveryText: 'Hỏa tốc trong ngày (Ưu đãi hạng Diamond)',
        isFree: true,
        provider: 'fallback'
      };
    }

    return {
      shippingFee: 50000,
      estimatedDeliveryText: isMetro ? 'Giao hỏa tốc trong 2 - 4 giờ' : 'Giao nhanh 1 - 2 ngày làm việc',
      isFree: false,
      provider: 'fallback'
    };
  }

  // Tiêu chuẩn (standard)
  if (isCouponFreeship || isVipFreeship || isThresholdFreeship) {
    return {
      shippingFee: 0,
      estimatedDeliveryText: isMetro ? 'Dự kiến nhận hàng: 1 - 2 ngày' : 'Dự kiến nhận hàng: 2 - 4 ngày',
      isFree: true,
      provider: 'fallback'
    };
  }

  // Cước chuẩn theo vùng miền
  const baseFee = isMetro ? 25000 : 35000;
  const deliveryText = isMetro ? 'Dự kiến nhận hàng: 1 - 2 ngày' : 'Dự kiến nhận hàng: 2 - 4 ngày';

  return {
    shippingFee: baseFee,
    estimatedDeliveryText: deliveryText,
    isFree: false,
    provider: 'fallback'
  };
}
