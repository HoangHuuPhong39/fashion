'use client';

import React, { useEffect } from 'react';
import { AuthProvider } from '@/context/AuthContext';
import { ProductProvider } from '@/context/ProductContext';
import { WishlistProvider } from '@/context/WishlistContext';
import { CartProvider } from '@/context/CartContext';

export const Providers: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  useEffect(() => {
    // Chặn lỗi rác do Extension của trình duyệt (IDM, AutoFill, Extension khác) bắn vào console Next.js
    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      const reasonStr = String(event.reason?.stack || event.reason?.message || event.reason || '');
      if (reasonStr.includes('M_ID') || reasonStr.includes('chrome-extension://') || reasonStr.includes('moz-extension://')) {
        event.preventDefault();
        event.stopImmediatePropagation();
      }
    };

    window.addEventListener('unhandledrejection', handleUnhandledRejection, true);
    return () => {
      window.removeEventListener('unhandledrejection', handleUnhandledRejection, true);
    };
  }, []);

  return (
    <ProductProvider>
      <AuthProvider>
        <WishlistProvider>
          <CartProvider>
            {children}
          </CartProvider>
        </WishlistProvider>
      </AuthProvider>
    </ProductProvider>
  );
};
