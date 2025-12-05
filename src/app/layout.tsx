import type { Metadata } from 'next';
import { Cormorant_Garamond, Inter, Great_Vibes } from 'next/font/google';
import './globals.css';

// Elegant display font
const displayFont = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-display',
  display: 'swap',
});

// Clean body font
const bodyFont = Inter({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-body',
  display: 'swap',
});

// Script font for accents
const scriptFont = Great_Vibes({
  subsets: ['latin'],
  weight: '400',
  variable: '--font-script',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Wedding Celebration | Partner One & Partner Two',
  description: 'Join us in celebrating our special day. We are excited to share this moment with you.',
  keywords: ['wedding', 'celebration', 'invitation', 'RSVP'],
  openGraph: {
    title: 'Wedding Celebration',
    description: 'Join us in celebrating our special day.',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${displayFont.variable} ${bodyFont.variable} ${scriptFont.variable}`}
    >
      <body className="min-h-screen">
        {children}
      </body>
    </html>
  );
}
