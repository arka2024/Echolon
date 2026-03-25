import type { Metadata } from 'next';
import { Inter, Noto_Sans, Noto_Sans_Bengali, Noto_Sans_Devanagari } from 'next/font/google';
import './globals.css';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { ChatbotWidget } from '@/components/ChatbotWidget'; // ✅ ENABLED
import { LanguageProvider } from '@/components/LanguageProvider';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const notoSans = Noto_Sans({ subsets: ['latin'], variable: '--font-noto' });
const notoBengali = Noto_Sans_Bengali({ subsets: ['bengali'], variable: '--font-bn' });
const notoDevanagari = Noto_Sans_Devanagari({ subsets: ['devanagari'], variable: '--font-hi' });

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
      <body className={`${inter.variable} ${notoSans.variable} ${notoBengali.variable} ${notoDevanagari.variable}`}>
        <LanguageProvider>
          <Navbar />

          {/* Main Content */}
          <main className="pt-16 lg:pt-20 min-h-screen">
            {children}
          </main>

          {/* ✅ Chatbot ENABLED */}
          <ChatbotWidget />

          <Footer />
        </LanguageProvider>
      </body>
    </html>
  );
}