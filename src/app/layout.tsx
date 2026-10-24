import type { Metadata } from 'next';
import { Playfair_Display, Be_Vietnam_Pro } from 'next/font/google';
import './globals.css';
import { Providers } from './providers';
import { LayoutWrapper } from '@/components/layout/LayoutWrapper';

const playfair = Playfair_Display({
  subsets: ['latin', 'vietnamese'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-playfair',
  display: 'swap',
});

const beVietnamPro = Be_Vietnam_Pro({
  subsets: ['latin', 'vietnamese'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-sans',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'TADA! — Style for your story | Sàn Thời Trang Cao Cấp',
  description: 'Khám phá thế giới thời trang thanh lịch tại TADA!. Tuyển chọn thiết kế độc quyền từ Local Brands Việt Nam hàng đầu và dịch vụ Order thời trang quốc tế từ Paris, Seoul, Tokyo.',
  keywords: 'TADA!, thời trang cao cấp, local brand việt nam, hàng order quốc tế, đầm lụa, áo khoác cashmere, quiet luxury',
  openGraph: {
    title: 'TADA! — Style for your story',
    description: 'Nền tảng thương mại điện tử thời trang đương đại và dịch vụ Fashion Concierge quốc tế.',
    type: 'website',
    locale: 'vi_VN',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="vi" suppressHydrationWarning className={`${playfair.variable} ${beVietnamPro.variable} h-full`}>
      <body suppressHydrationWarning className="min-h-full flex flex-col bg-[#FAF8F3] text-[#171613]">
        <Providers>
          <LayoutWrapper>{children}</LayoutWrapper>
        </Providers>
      </body>
    </html>
  );
}
