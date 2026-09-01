import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

export const metadata: Metadata = {
  title: { template: '%s | GovSetu', default: 'GovSetu — Government Innovation Platform' },
  description:
    'AI-powered government innovation procurement platform connecting government departments with startups through structured discovery, evaluation, and pilot workflows.',
  keywords: ['government', 'startup', 'innovation', 'procurement', 'AI matching'],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="antialiased">{children}</body>
    </html>
  );
}
