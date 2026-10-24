'use client';

import React, { useState, Suspense } from 'react';
import { TopBar } from './TopBar';
import { Header } from './Header';
import { Navigation } from './Navigation';
import { Footer } from './Footer';
import { MobileMenu } from './MobileMenu';
import { CartDrawer } from '@/components/cart/CartDrawer';
import { FloatingContactWidget } from './FloatingContactWidget';

export const LayoutWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <>
      <TopBar />
      <Header onOpenMobileMenu={() => setIsMobileMenuOpen(true)} />
      <Suspense fallback={<nav className="hidden lg:block bg-[#FAF8F3] border-b border-[#E8E4DC] h-[48px]" />}>
        <Navigation />
      </Suspense>
      <MobileMenu isOpen={isMobileMenuOpen} onClose={() => setIsMobileMenuOpen(false)} />
      <CartDrawer />
      <main className="flex-1">{children}</main>
      <Footer />
      <FloatingContactWidget />
    </>
  );
};
