import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Hệ Thống Quản Trị Atelier | TADA!',
  description: 'Bảng điều khiển quản trị vận hành TADA! Fashion Atelier.',
  robots: {
    index: false,
    follow: false,
  },
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
