/**
 * admin/layout.tsx — Admin section layout
 *
 * Wraps all /admin/* pages. Applies the dark background.
 * Note: This overrides the public-facing pt-16 since admin has its own full-screen layout.
 */

import { Metadata } from 'next';

// Tell search engines NOT to index admin pages
export const metadata: Metadata = {
  title: 'Admin — Bhanura Waduge',
  robots: { index: false, follow: false },
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    // Admin section uses the same dark base as the rest of the site
    // The pt-16 from the main layout doesn't apply here since we wrap fully
    <div className="min-h-screen bg-[#0A0A0A] text-[#EDEDED]">
      {children}
    </div>
  );
}
