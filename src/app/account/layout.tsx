import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Tài Khoản Cá Nhân & Hạng Thành Viên | TADA! Fashion Atelier',
  description: 'Quản lý thông tin tài khoản, tích điểm hạng thành viên và đơn mua tại TADA! Fashion Atelier.',
  robots: {
    index: false,
    follow: false,
  },
};

export default function AccountLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
