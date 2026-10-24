import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Giỏ Hàng | TADA! Fashion Atelier',
  description: 'Giỏ hàng của bạn tại TADA! Fashion Atelier.',
  robots: {
    index: false,
    follow: false,
  },
};

export default function CartLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
