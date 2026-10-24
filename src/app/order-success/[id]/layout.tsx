import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Đặt Hàng Thành Công | TADA! Fashion Atelier',
  description: 'Thông tin xác nhận đơn hàng tại TADA! Fashion Atelier.',
  robots: {
    index: false,
    follow: false,
  },
};

export default function OrderSuccessLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
