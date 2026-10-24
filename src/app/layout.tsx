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

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://tada-fashion.vn';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'TADA! Fashion Atelier | Thời Trang Đương Đại & May Đo Tinh Tế',
    template: '%s | TADA! Fashion Atelier',
  },
  description:
    'Khám phá thế giới thời trang thanh lịch tại TADA! Fashion Atelier. Tuyển chọn thiết kế độc quyền từ Local Brands Việt Nam hàng đầu và dịch vụ Fashion Concierge may đo.',
  keywords: [
    'TADA!',
    'thời trang cao cấp',
    'local brand việt nam',
    'hàng order quốc tế',
    'đầm lụa',
    'áo khoác cashmere',
    'quiet luxury',
    'may đo đương đại',
  ],
  openGraph: {
    title: 'TADA! Fashion Atelier — Style for your story',
    description: 'Nền tảng thương mại điện tử thời trang đương đại và dịch vụ Fashion Concierge quốc tế.',
    type: 'website',
    locale: 'vi_VN',
    siteName: 'TADA! Fashion Atelier',
    images: [
      {
        url: `${siteUrl}/images/og-default.jpg`,
        width: 1200,
        height: 630,
        alt: 'TADA! Fashion Atelier',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'TADA! Fashion Atelier',
    description: 'Thời trang đương đại & dịch vụ may đo cao cấp.',
    images: [`${siteUrl}/images/og-default.jpg`],
  },
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION || undefined,
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
