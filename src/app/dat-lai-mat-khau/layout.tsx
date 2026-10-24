import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Đặt Lại Mật Khẩu | TADA! Fashion Atelier',
  description: 'Thiết lập lại mật khẩu tài khoản an toàn tại TADA! Fashion Atelier.',
  robots: {
    index: false,
    follow: false,
  },
};

export default function ResetPasswordLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
