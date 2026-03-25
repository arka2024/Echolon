import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'PalmArbor | Precision Oil Palm Agriculture',
  description: 'A trust-driven digital ecosystem combining advisory, financial clarity, and market linkage for oil palm farmers.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="antialiased">
      <body className={inter.className}>
        <Navbar />
        {/* We add a padding top to avoid content hiding behind the fixed navbar */}
        <main className="pt-16 lg:pt-20 min-h-screen">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
