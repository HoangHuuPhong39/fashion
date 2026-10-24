'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product, CartItem } from '@/types';
import { useAuth } from '@/context/AuthContext';
import { calculateOrderPricing, VALID_COUPONS } from '@/lib/pricing';

interface CartContextType {
  items: CartItem[];
  addToCart: (product: Product, selectedColor: string, selectedSize: string, quantity?: number) => { success: boolean; message: string };
  removeFromCart: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
  subtotal: number;
  shippingFee: number;
  discountAmount: number;
  membershipDiscountAmount: number;
  membershipDiscountPercent: number;
  appliedCoupon: string | null;
  applyCoupon: (code: string) => { success: boolean; message: string; discountPercent?: number };
  removeCoupon: () => void;
  total: number;
  isCartDrawerOpen: boolean;
  setIsCartDrawerOpen: (open: boolean) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, getMembershipDiscountPercent } = useAuth();
  const [items, setItems] = useState<CartItem[]>([]);
  const [appliedCoupon, setAppliedCoupon] = useState<string | null>(null);
  const [discountPercent, setDiscountPercent] = useState<number>(0);
  const [isCartDrawerOpen, setIsCartDrawerOpen] = useState(false);

  // Initialize from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem('tada_cart');
      if (saved) {
        setItems(JSON.parse(saved));
      }
    } catch {
      // fallback safe
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem('tada_cart', JSON.stringify(items));
    } catch {
      // fallback safe
    }
  }, [items]);

  const addToCart = (product: Product, selectedColor: string, selectedSize: string, quantity: number = 1) => {
    if (!selectedColor || !selectedSize) {
      return { success: false, message: 'Vui lòng chọn màu sắc và kích cỡ trước khi thêm vào giỏ hàng.' };
    }

    // Tìm biến thể tương ứng
    const variant = product.variants?.find(
      (v) => v.color.toLowerCase() === selectedColor.toLowerCase() && v.size.toLowerCase() === selectedSize.toLowerCase()
    );
    const availableStock = variant ? variant.stockCount : product.stockCount;

    if (availableStock <= 0) {
      return { success: false, message: `Sản phẩm "${product.name}" (${selectedColor} - Size ${selectedSize}) hiện đã hết hàng.` };
    }

    const itemId = `${product.id}-${selectedColor}-${selectedSize}`;
    const existing = items.find((item) => item.id === itemId);
    const currentQtyInCart = existing ? existing.quantity : 0;

    if (currentQtyInCart + quantity > availableStock) {
      return {
        success: false,
        message: `Kho chỉ còn ${availableStock} chiếc (${selectedColor} - Size ${selectedSize}). Bạn đã có ${currentQtyInCart} chiếc trong giỏ.`
      };
    }

    setItems((prevItems) => {
      const exist = prevItems.find((item) => item.id === itemId);
      if (exist) {
        return prevItems.map((item) =>
          item.id === itemId
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      } else {
        return [
          ...prevItems,
          {
            id: itemId,
            product,
            selectedColor,
            selectedSize,
            quantity,
            variantId: variant?.id,
            sku: variant?.sku || product.sku
          }
        ];
      }
    });

    setIsCartDrawerOpen(true);
    return { success: true, message: `Đã thêm "${product.name}" vào giỏ hàng.` };
  };

  const removeFromCart = (itemId: string) => {
    setItems((prev) => prev.filter((item) => item.id !== itemId));
  };

  const updateQuantity = (itemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(itemId);
      return;
    }

    const targetItem = items.find((i) => i.id === itemId);
    if (targetItem) {
      const variant = targetItem.product.variants?.find(
        (v) =>
          v.color.toLowerCase() === targetItem.selectedColor.toLowerCase() &&
          v.size.toLowerCase() === targetItem.selectedSize.toLowerCase()
      );
      const availableStock = variant ? variant.stockCount : targetItem.product.stockCount;
      if (quantity > availableStock) {
        alert(`Rất tiếc! Kho chỉ còn ${availableStock} chiếc cho biến thể (${targetItem.selectedColor} - Size ${targetItem.selectedSize}).`);
        quantity = availableStock;
      }
    }

    setItems((prev) =>
      prev.map((item) =>
        item.id === itemId ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => {
    setItems([]);
    setAppliedCoupon(null);
    setDiscountPercent(0);
  };

  const applyCoupon = (code: string) => {
    const cleanCode = code.trim().toUpperCase();
    const rule = VALID_COUPONS[cleanCode];
    if (rule) {
      setAppliedCoupon(rule.code);
      setDiscountPercent(rule.discountPercent);
      return {
        success: true,
        message: `Áp dụng mã ${rule.code} thành công! ${rule.description}.`,
        discountPercent: rule.discountPercent
      };
    }
    return { success: false, message: 'Mã giảm giá không hợp lệ hoặc đã hết hạn.' };
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    setDiscountPercent(0);
  };

  const totalItems = items.reduce((acc, item) => acc + item.quantity, 0);
  const subtotal = items.reduce((acc, item) => acc + item.product.price * item.quantity, 0);

  const pricing = calculateOrderPricing({
    subtotal,
    couponCode: appliedCoupon,
    membershipTier: user?.membershipTier || 'bronze'
  });

  const total = items.length === 0 ? 0 : pricing.total;
  const shippingFee = items.length === 0 ? 0 : pricing.shippingFee;
  const totalDiscount = items.length === 0 ? 0 : pricing.totalDiscount;
  const membershipDiscountAmount = items.length === 0 ? 0 : pricing.membershipDiscountAmount;
  const membershipDiscountPercent = getMembershipDiscountPercent();

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        totalItems,
        subtotal,
        shippingFee,
        discountAmount: totalDiscount,
        membershipDiscountAmount,
        membershipDiscountPercent,
        appliedCoupon,
        applyCoupon,
        removeCoupon,
        total,
        isCartDrawerOpen,
        setIsCartDrawerOpen
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
