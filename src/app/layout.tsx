/**
 * layout.tsx — Root layout
 *
 * Wraps every page with:
 *   - Navbar (fixed at top, so we add pt-16 padding to <main>)
 *   - Footer
 *   - Global dark theme class on <html>
 */

import type { Metadata } from 'next';
import './globals.css';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

// ── SEO Metadata ──────────────────────────────────────────────────────────────
export const metadata: Metadata = {
  title: 'Bhanura Waduge | Full Stack & AI Engineer',
  description:
    'Portfolio of Bhanura Waduge — Full Stack and AI Engineer specializing in building exceptional digital products with React, Next.js, and modern cloud technologies.',
  keywords: ['Full Stack Developer', 'AI Engineer', 'React', 'Next.js', 'Portfolio'],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    // Force dark mode by adding the 'dark' class on the root element
    <html lang="en" className="dark" suppressHydrationWarning>
      <body className="antialiased min-h-screen flex flex-col bg-[#0A0A0A] text-[#EDEDED]">

        {/* Fixed navbar — always visible at the top */}
        <Navbar />

        {/*
          pt-16 = compensates for the fixed navbar height (64px = h-16)
          flex-1 = makes main take all remaining vertical space
        */}
        <main className="flex-1 pt-16">
          {children}
        </main>

        <Footer />
      </body>
    </html>
  );
}
