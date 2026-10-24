'use client';

import React from 'react';
import Link from 'next/link';
import { Truck, Award, RotateCcw, Heart, ShoppingBag, User } from 'lucide-react';
import { useWishlist } from '@/context/WishlistContext';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';

export const TopBar: React.FC = () => {
  const [mounted, setMounted] = React.useState(false);
  const { totalWishlist } = useWishlist();
  const { totalItems } = useCart();
  const { user } = useAuth();

  React.useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="bg-[#171613] text-[#FAF8F3] text-[11px] py-1.5 px-4 sm:px-6 lg:px-8 border-b border-[#2A2925] select-none">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* 3 Cam Kết Bên Trái (như trong ảnh mẫu) */}
        <div className="flex items-center space-x-6 text-[#E8D7BD]/90">
          <span className="flex items-center gap-1.5 hover:text-white transition-colors">
            <Truck className="w-3.5 h-3.5 text-[#C7A66A]" />
            <span>Miễn phí vận chuyển cho đơn từ 499K</span>
          </span>
          <span className="hidden md:flex items-center gap-1.5 hover:text-white transition-colors">
            <Award className="w-3.5 h-3.5 text-[#C7A66A]" />
            <span>Hóa đơn boutique gốc & xuất xứ minh bạch</span>
          </span>
          <span className="hidden lg:flex items-center gap-1.5 hover:text-white transition-colors">
            <RotateCcw className="w-3.5 h-3.5 text-[#C7A66A]" />
            <span>Đổi trả trong 7 ngày</span>
          </span>
        </div>

        {/* Tiện Ích Bên Phải (như trong ảnh mẫu) */}
        <div className="flex items-center space-x-4 text-[#E8D7BD]/90">
          {mounted && user?.role === 'admin' && (
            <Link
              href="/admin"
              className="flex items-center gap-1.5 px-2 py-0.5 bg-[#C78238] hover:bg-[#A66827] text-white text-[10px] font-bold rounded tracking-wide transition-all shadow-sm"
            >
              <span>🛡️ BẢNG ADMIN</span>
            </Link>
          )}

          <Link
            href="/account"
            className="flex items-center gap-1.5 hover:text-white transition-colors"
          >
            {mounted && user ? (
              <>
                <span className="font-medium">{user.name}</span>
                {user.role === 'customer' && (
                  <span className={`text-[9px] px-1.5 py-0.2 rounded font-bold uppercase ${
                    user.membershipTier === 'diamond' ? 'bg-[#7E22CE] text-white' :
                    user.membershipTier === 'gold' ? 'bg-[#D97706] text-white' :
                    user.membershipTier === 'silver' ? 'bg-[#495057] text-white' :
                    'bg-[#8A5A36] text-white'
                  }`}>
                    {user.membershipTier === 'diamond' ? '💎 VIP' :
                     user.membershipTier === 'gold' ? '🥇 Vàng' :
                     user.membershipTier === 'silver' ? '🥈 Bạc' : '🥉 Đồng'}
                  </span>
                )}
              </>
            ) : (
              'Đăng nhập | Đăng ký'
            )}
          </Link>

          <Link
            href="/wishlist"
            className="flex items-center gap-1 hover:text-white transition-colors"
          >
            <Heart className="w-3.5 h-3.5 text-[#C7A66A]" />
            <span>Yêu thích</span>
          </Link>

          <Link
            href="/cart"
            className="flex items-center gap-1 hover:text-white transition-colors"
          >
            <div className="relative">
              <ShoppingBag className="w-3.5 h-3.5 text-[#C7A66A]" />
              {mounted && totalItems > 0 && (
                <span className="absolute -top-1.5 -right-2 bg-[#B83A3A] text-white text-[9px] font-bold w-3.5 h-3.5 rounded-full flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
};
