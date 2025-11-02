// src/app/layout.tsx
import './globals.css';
import type { Metadata } from 'next';
import { Roboto } from 'next/font/google';
import ThemeRegistry from './ThemeRegistry';

const roboto = Roboto({
  weight: ['300', '400', '500', '700'],
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Security Agency Dashboard',
  description: 'Management solutions for security operations',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={roboto.className}>
        <ThemeRegistry>
          {children}
        </ThemeRegistry>
      </body>
    </html>
  );
}