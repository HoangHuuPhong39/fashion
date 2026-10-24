import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Thanh Toán Đơn Hàng | TADA! Fashion Atelier',
  description: 'Thanh toán an toàn với mã hóa bảo mật tại TADA! Fashion Atelier.',
  robots: {
    index: false,
    follow: false,
  },
};

export default function CheckoutLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
