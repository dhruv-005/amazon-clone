import type { Metadata } from 'next';
import './globals.css';
import { ReduxProvider } from '@/store/provider';

export const metadata: Metadata = {
  title: 'Online Shopping site in India: Shop Online for Mobiles, Books, Watches, Shoes and More - Amazon.in',
  description: 'Amazon Clone - India Online Shopping for Electronics, Apparel, Computers, Books, Home & Kitchen and more.',
  icons: { icon: '/favicon.ico' },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col bg-[#eaeded] antialiased">
        <ReduxProvider>{children}</ReduxProvider>
      </body>
    </html>
  );
}
