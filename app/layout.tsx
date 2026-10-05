import type { Metadata, Viewport } from 'next';
import './globals.css';
import { AnimatedBackground } from '@/components/animated-background';
import { Header } from '@/components/header';

export const metadata: Metadata = {
  title: 'duvansi — Shopee Link Converter',
  description: 'Shopee Affiliate Link Converter',
  icons: {
    icon: '/favicon.ico',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: 'cover',
  themeColor: '#07080d',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="vi" className="dark">
      <body className="min-h-screen bg-[#07080d] text-zinc-100 flex flex-col justify-between selection:bg-indigo-500/30 selection:text-indigo-200 antialiased overflow-x-hidden">
        <AnimatedBackground />
        <Header />
        <main className="flex-1 flex flex-col justify-center items-center w-full px-3 sm:px-4">
          {children}
        </main>
        <footer className="w-full py-4 text-center text-[11px] text-zinc-600/80 tracking-widest uppercase select-none">
          duvansi &copy; {new Date().getFullYear()}
        </footer>
      </body>
    </html>
  );
}
