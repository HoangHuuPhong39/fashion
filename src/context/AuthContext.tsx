'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { User, Order, MembershipTier, LoyaltyTierDetails } from '@/types';

export const LOYALTY_TIERS: Record<MembershipTier, LoyaltyTierDetails> = {
  bronze: {
    tier: 'bronze',
    name: 'Hội Viên Đồng',
    badge: '🥉 HỘI VIÊN ĐỒNG',
    minSpent: 0,
    minOrders: 0,
    discountPercent: 0,
    colorScheme: {
      bg: 'bg-[#FAF6F0]',
      text: 'text-[#8A5A36]',
      border: 'border-[#D9C3B0]',
      badgeBg: 'bg-[#8A5A36]',
      badgeText: 'text-[#FAF6F0]',
      gradient: 'from-[#C4976E] via-[#8A5A36] to-[#5C361D]'
    },
    benefits: [
      'Tích lũy 1% điểm thưởng trên mọi đơn hàng',
      'Voucher chào mừng thành viên mới 100.000đ',
      'Nhận tin thông báo sớm về các đợt Sale & Lookbook mới'
    ],
    gifts: [
      'Voucher 100K áp dụng đơn từ 500K',
      'E-voucher mừng sinh nhật 50.000đ'
    ]
  },
  silver: {
    tier: 'silver',
    name: 'Hội Viên Bạc',
    badge: '🥈 HỘI VIÊN BẠC',
    minSpent: 1500000,
    minOrders: 3,
    discountPercent: 5,
    colorScheme: {
      bg: 'bg-[#F1F3F5]',
      text: 'text-[#495057]',
      border: 'border-[#CED4DA]',
      badgeBg: 'bg-[#495057]',
      badgeText: 'text-white',
      gradient: 'from-[#CED4DA] via-[#868E96] to-[#495057]'
    },
    benefits: [
      'Giảm trực tiếp 5% cho tất cả đơn hàng',
      'Tích lũy 2% điểm thưởng mỗi lần mua sắm',
      'Quà sinh nhật trị giá 200.000đ',
      'Hỗ trợ đổi size & mẫu tận nơi miễn phí trong 10 ngày'
    ],
    gifts: [
      'Voucher sinh nhật 200.000đ',
      'Khăn lụa TADA! Signature Limited Edition',
      'Mã Freeship 3 đơn/tháng'
    ]
  },
  gold: {
    tier: 'gold',
    name: 'Hội Viên Vàng',
    badge: '🥇 HỘI VIÊN VÀNG',
    minSpent: 5000000,
    minOrders: 6,
    discountPercent: 10,
    colorScheme: {
      bg: 'bg-[#FFF9E6]',
      text: 'text-[#B45309]',
      border: 'border-[#FDE68A]',
      badgeBg: 'bg-[#D97706]',
      badgeText: 'text-white',
      gradient: 'from-[#FBBF24] via-[#D97706] to-[#92400E]'
    },
    benefits: [
      'Giảm trực tiếp 10% tự động trên tổng hóa đơn',
      'Miễn phí vận chuyển (Freeship) trọn đời toàn quốc',
      'Ưu tiên đặt trước (Pre-order) hàng Order Quốc Tế không cần cọc trước',
      'Quà tặng sinh nhật độc quyền từ bộ sưu tập mới'
    ],
    gifts: [
      'Set quà tặng Nước hoa mini TADA! Atelier',
      'Voucher 500.000đ mừng thăng hạng Vàng',
      'Túi Canvas da cao cấp TADA!'
    ]
  },
  diamond: {
    tier: 'diamond',
    name: 'VIP Kim Cương',
    badge: '💎 VIP KIM CƯƠNG',
    minSpent: 12000000,
    minOrders: 10,
    discountPercent: 15,
    colorScheme: {
      bg: 'bg-[#F3E8FF]',
      text: 'text-[#6B21A8]',
      border: 'border-[#E9D5FF]',
      badgeBg: 'bg-[#7E22CE]',
      badgeText: 'text-white',
      gradient: 'from-[#A855F7] via-[#7E22CE] to-[#3B0764]'
    },
    benefits: [
      'Giảm tối đa 15% trọn đời trên mọi đơn hàng',
      'Giao hàng Hỏa tốc nội thành 2h hoàn toàn miễn phí',
      'Chuyên viên tư vấn phong cách riêng (Personal Stylist) 24/7',
      'Vé mời hàng ghế đầu các đêm Fashion Show & Tiệc khách VIP thường niên',
      'Hộp quà tri ân cao cấp gửi tận nhà mỗi quý'
    ],
    gifts: [
      'Bộ sưu tập quà tặng Luxury Box 4 mùa',
      'Áo khoác Blazer may đo riêng theo số đo',
      'Thẻ VIP thẻ kim loại khắc tên riêng'
    ]
  }
};

interface AuthContextType {
  user: User | null;
  orders: Order[];
  isAdmin: boolean;
  isLoading: boolean;
  activeTierDetails: LoyaltyTierDetails;
  getMembershipDiscountPercent: () => number;
  getNextTierInfo: () => {
    nextTier: LoyaltyTierDetails | null;
    spentProgressPercent: number;
    amountNeeded: number;
    ordersNeeded: number;
  };
  loginWithEmail: (email: string, password?: string) => Promise<{ success: boolean; message: string; requires2FA?: boolean }>;
  loginWithAdmin: (email: string, password: string, twoFactorCode: string) => Promise<{ success: boolean; message: string }>;
  loginWithOAuth: (provider: 'google' | 'facebook' | 'apple' | 'phone', identifier?: string) => void;
  register: (name: string, email: string, phone: string, password?: string) => Promise<{ success: boolean; message: string }>;
  changePassword: (currentPassword: string, newPassword: string) => Promise<{ success: boolean; message: string }>;
  logout: () => Promise<void>;
  updateProfile: (updates: Partial<User>) => Promise<{ success: boolean; message: string; user?: User }>;
  addOrder: (order: Order) => Promise<{ success: boolean; message: string; order?: Order }>;
  updateOrderStatus: (orderId: string, status: Order['status'], statusLabel: string, note?: string, paymentStatus?: Order['paymentStatus']) => Promise<void>;
  refreshOrders: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const USER_STORAGE_KEY = 'tada_current_user';
const ORDERS_STORAGE_KEY = 'tada_orders_list';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Mặc định không có tài khoản demo tự gán, bắt đầu bằng null
  const [user, setUser] = useState<User | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchOrders = useCallback(async (currentUser: User | null) => {
    if (!currentUser) {
      setOrders([]);
      try {
        localStorage.removeItem(ORDERS_STORAGE_KEY);
      } catch {}
      return;
    }

    try {
      const isAdmin = currentUser.role === 'admin';
      const userIdParam = encodeURIComponent(currentUser.id);
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 3500);
      const res = await fetch(`/api/orders?userId=${userIdParam}&isAdmin=${isAdmin}`, {
        signal: controller.signal
      });
      clearTimeout(timeoutId);

      if (res.ok) {
        const data = await res.json();
        if (data.success && Array.isArray(data.orders)) {
          setOrders(data.orders);
          try {
            localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(data.orders));
          } catch {}
          return;
        }
      }
    } catch (e) {
      console.warn('Could not fetch /api/orders, fallback to localStorage', e);
    }

    try {
      const savedOrders = localStorage.getItem(ORDERS_STORAGE_KEY);
      if (savedOrders) {
        setOrders(JSON.parse(savedOrders));
      }
    } catch {}
  }, []);

  // Khôi phục phiên làm việc thực tế từ máy chủ khi mount
  useEffect(() => {
    let isCancelled = false;

    const restoreSession = async () => {
      // 1. Kiểm tra localStorage trước để có UI nhanh tức thì
      let localUser: User | null = null;
      try {
        const savedUser = localStorage.getItem(USER_STORAGE_KEY);
        if (savedUser) {
          const parsed = JSON.parse(savedUser);
          if (parsed && parsed.id) {
            localUser = parsed;
            if (!isCancelled) {
              setUser(parsed);
            }
          }
        }
      } catch {}

      // 2. Xác thực phiên thật với máy chủ với timeout 2s
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 2000);
        const res = await fetch('/api/auth/me', { signal: controller.signal });
        clearTimeout(timeoutId);

        if (!isCancelled) {
          if (res.ok) {
            const data = await res.json();
            if (data.success && data.user) {
              setUser(data.user);
              try {
                localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(data.user));
              } catch {}
              // Tải đơn hàng bất đồng bộ ở background, không chặn loading UI
              fetchOrders(data.user);
              return;
            }
          } else if (res.status === 401) {
            // Máy chủ xác nhận chưa đăng nhập
            if (!localUser) {
              setUser(null);
              setOrders([]);
              try {
                localStorage.removeItem(USER_STORAGE_KEY);
                localStorage.removeItem(ORDERS_STORAGE_KEY);
              } catch {}
            }
          }
        }
      } catch (err) {
        console.warn('Cannot verify session with server, keeping cached state if any', err);
      }

      if (!isCancelled) {
        if (localUser) {
          fetchOrders(localUser);
        } else {
          setUser(null);
          setOrders([]);
        }
      }
    };

    // Khởi chạy và kết thúc loading dứt khoát
    restoreSession().finally(() => {
      if (!isCancelled) {
        setIsLoading(false);
      }
    });

    // Timeout an toàn tuyệt đối: không bao giờ để loading xoay quá 1.5s
    const safetyTimer = setTimeout(() => {
      if (!isCancelled) {
        setIsLoading(false);
      }
    }, 1500);

    return () => {
      isCancelled = true;
      clearTimeout(safetyTimer);
    };
  }, [fetchOrders]);

  const saveUserLocal = (newUser: User | null) => {
    setUser(newUser);
    try {
      if (newUser) {
        localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(newUser));
      } else {
        localStorage.removeItem(USER_STORAGE_KEY);
        localStorage.removeItem(ORDERS_STORAGE_KEY);
      }
    } catch (e) {
      console.error('Failed to save user', e);
    }
    fetchOrders(newUser);
  };

  const isAdmin = user?.role === 'admin';
  const currentTier: MembershipTier = user?.membershipTier || 'bronze';
  const activeTierDetails = LOYALTY_TIERS[currentTier];

  const getMembershipDiscountPercent = () => {
    if (!user) return 0;
    return LOYALTY_TIERS[user.membershipTier]?.discountPercent || 0;
  };

  const getNextTierInfo = () => {
    const currentTierKey = user?.membershipTier || 'bronze';
    const totalSpent = user?.totalSpent || 0;
    const orderCount = orders.length;

    if (currentTierKey === 'bronze') {
      const next = LOYALTY_TIERS.silver;
      const spentProgress = Math.min(100, Math.round((totalSpent / next.minSpent) * 100));
      return {
        nextTier: next,
        spentProgressPercent: spentProgress,
        amountNeeded: Math.max(0, next.minSpent - totalSpent),
        ordersNeeded: Math.max(0, next.minOrders - orderCount)
      };
    }
    if (currentTierKey === 'silver') {
      const next = LOYALTY_TIERS.gold;
      const spentProgress = Math.min(100, Math.round((totalSpent / next.minSpent) * 100));
      return {
        nextTier: next,
        spentProgressPercent: spentProgress,
        amountNeeded: Math.max(0, next.minSpent - totalSpent),
        ordersNeeded: Math.max(0, next.minOrders - orderCount)
      };
    }
    if (currentTierKey === 'gold') {
      const next = LOYALTY_TIERS.diamond;
      const spentProgress = Math.min(100, Math.round((totalSpent / next.minSpent) * 100));
      return {
        nextTier: next,
        spentProgressPercent: spentProgress,
        amountNeeded: Math.max(0, next.minSpent - totalSpent),
        ordersNeeded: Math.max(0, next.minOrders - orderCount)
      };
    }

    return {
      nextTier: null,
      spentProgressPercent: 100,
      amountNeeded: 0,
      ordersNeeded: 0
    };
  };

  // Đăng nhập thường qua API server
  const loginWithEmail = async (email: string, password?: string) => {
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();

      if (res.ok && data.success && data.user) {
        saveUserLocal(data.user);
        return { success: true, message: data.message };
      }
      return {
        success: false,
        message: data.message || 'Đăng nhập không thành công.',
        requires2FA: data.requires2FA
      };
    } catch (e: any) {
      return { success: false, message: e.message || 'Lỗi kết nối máy chủ.' };
    }
  };

  // Đăng nhập Admin với mật khẩu & mã 2FA PIN
  const loginWithAdmin = async (email: string, password: string, twoFactorCode: string) => {
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, adminPin: twoFactorCode })
      });
      const data = await res.json();

      if (res.ok && data.success && data.user) {
        saveUserLocal(data.user);
        return { success: true, message: data.message };
      }
      return { success: false, message: data.message || 'Xác thực Quản trị viên thất bại.' };
    } catch (e: any) {
      return { success: false, message: e.message || 'Lỗi kết nối máy chủ.' };
    }
  };

  // Đăng ký tài khoản
  const register = async (name: string, email: string, phone: string, password?: string) => {
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, phone, password })
      });
      const data = await res.json();

      if (res.ok && data.success && data.user) {
        saveUserLocal(data.user);
        return { success: true, message: data.message };
      }
      return { success: false, message: data.message || 'Đăng ký không thành công.' };
    } catch (e: any) {
      return { success: false, message: e.message || 'Lỗi kết nối máy chủ.' };
    }
  };

  // Đăng nhập nhanh OAuth
  const loginWithOAuth = (provider: 'google' | 'facebook' | 'apple' | 'phone', identifier?: string) => {
    const newUser: User = {
      id: `usr-${provider}-${Date.now()}`,
      name: identifier || `Khách Hàng (${provider.toUpperCase()})`,
      email: identifier?.includes('@') ? identifier : `${provider}_user@tada.vn`,
      phone: identifier && !identifier.includes('@') ? identifier : '0912 345 678',
      role: 'customer',
      membershipTier: 'bronze',
      totalSpent: 0,
      points: 2000,
      isVip: false,
      addresses: []
    };
    saveUserLocal(newUser);
  };

  // Đổi mật khẩu
  const changePassword = async (currentPassword: string, newPassword: string) => {
    try {
      const res = await fetch('/api/auth/password', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ currentPassword, newPassword })
      });
      const data = await res.json();
      return { success: !!data.success, message: data.message || (data.success ? 'Đổi mật khẩu thành công.' : 'Đổi mật khẩu thất bại.') };
    } catch {
      return { success: false, message: 'Lỗi kết nối máy chủ.' };
    }
  };

  // Đăng xuất: xóa session trên server và client
  const logout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
    } catch {}
    saveUserLocal(null);
  };

  // Cập nhật hồ sơ cá nhân và cấu hình tài khoản (Admin/Khách)
  const updateProfile = async (updates: Partial<User>): Promise<{ success: boolean; message: string; user?: User }> => {
    try {
      const res = await fetch('/api/auth/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates)
      });
      const data = await res.json();
      if (res.ok && data.success && data.user) {
        saveUserLocal(data.user);
        return { success: true, message: data.message, user: data.user };
      }
      return { success: false, message: data.message || 'Cập nhật hồ sơ thất bại.' };
    } catch (err: any) {
      return { success: false, message: err.message || 'Lỗi mạng khi cập nhật hồ sơ.' };
    }
  };

  // Đặt hàng
  const addOrder = async (newOrder: Order): Promise<{ success: boolean; message: string; order?: Order }> => {
    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...newOrder,
          userId: user?.id
        })
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        return { success: false, message: data.message || 'Không thể tạo đơn hàng.' };
      }

      const createdOrder: Order = data.order || newOrder;

      setOrders((prev) => {
        const updated = [createdOrder, ...prev];
        try {
          localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(updated));
        } catch {}
        return updated;
      });

      if (user) {
        const addedSpent = createdOrder.total;
        const newTotalSpent = user.totalSpent + addedSpent;
        const orderCount = orders.length + 1;

        let newTier: MembershipTier = user.membershipTier;
        if (newTotalSpent >= LOYALTY_TIERS.diamond.minSpent || orderCount >= LOYALTY_TIERS.diamond.minOrders) {
          newTier = 'diamond';
        } else if (newTotalSpent >= LOYALTY_TIERS.gold.minSpent || orderCount >= LOYALTY_TIERS.gold.minOrders) {
          newTier = 'gold';
        } else if (newTotalSpent >= LOYALTY_TIERS.silver.minSpent || orderCount >= LOYALTY_TIERS.silver.minOrders) {
          newTier = 'silver';
        }

        saveUserLocal({
          ...user,
          totalSpent: newTotalSpent,
          membershipTier: newTier,
          points: user.points + Math.round(addedSpent / 1000)
        });
      }

      return { success: true, message: 'Đặt hàng thành công!', order: createdOrder };
    } catch (e: any) {
      console.error('Error placing order via API', e);
      return { success: false, message: e.message || 'Lỗi kết nối máy chủ khi đặt hàng.' };
    }
  };

  // Cập nhật trạng thái đơn hàng
  const updateOrderStatus = async (
    orderId: string,
    status: Order['status'],
    statusLabel: string,
    note?: string,
    paymentStatus?: Order['paymentStatus']
  ) => {
    try {
      const res = await fetch(`/api/orders/${orderId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status,
          note,
          paymentStatus,
          performedBy: user?.name || 'Admin'
        })
      });

      if (res.ok) {
        const data = await res.json();
        if (data.success && data.order) {
          setOrders((prev) => prev.map((ord) => (ord.id === orderId ? data.order : ord)));
          return;
        }
      }
    } catch (e) {
      console.error('Error updating order status via API', e);
    }

    setOrders((prev) => {
      const updated = prev.map((ord) =>
        ord.id === orderId ? { ...ord, status, statusLabel, ...(paymentStatus ? { paymentStatus } : {}) } : ord
      );
      try {
        localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(updated));
      } catch {}
      return updated;
    });
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        orders,
        isAdmin,
        isLoading,
        activeTierDetails,
        getMembershipDiscountPercent,
        getNextTierInfo,
        loginWithEmail,
        loginWithAdmin,
        loginWithOAuth,
        register,
        changePassword,
        logout,
        updateProfile,
        addOrder,
        updateOrderStatus,
        refreshOrders: () => fetchOrders(user)
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
