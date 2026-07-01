/**
 * Footer.tsx
 *
 * A minimal, dark footer with:
 *   - Brand logo + tagline
 *   - Navigation links (same as Navbar)
 *   - Social icon links
 *   - Copyright year (auto-updates)
 *   - Green gradient top border
 */

import Link from 'next/link';
import Image from 'next/image';
import { Github, Linkedin, Mail } from 'lucide-react';
import { supabase } from '@/lib/supabase';

// ── Footer navigation links ───────────────────────────────────────────────────
const FOOTER_LINKS = [
  { label: 'Projects', href: '/projects' },
  { label: 'Blog', href: '/blog' },
  { label: 'Contact', href: '/contact' },
];

// ── Social links ──────────────────────────────────────────────────────────────
const SOCIAL_LINKS = [
  { label: 'GitHub', href: 'https://github.com/Bhanura', icon: Github },
  { label: 'LinkedIn', href: 'https://www.linkedin.com/in/bhanura-waduge-44b7611a7', icon: Linkedin },
  { label: 'Email', href: 'mailto:bhanuwaduge@gmail.com', icon: Mail },
];

export default async function Footer() {
  // Fetch headshot URL from site settings
  const { data: heroSettings } = await supabase
    .from('site_settings')
    .select('content')
    .eq('section', 'hero')
    .single();

  const headshotUrl: string = heroSettings?.content?.headshotUrl || '';

  return (
    <footer className="bg-[#0A0A0A] border-t border-[#2E2E2E]">

      {/* Thin gradient accent line at very top */}
      <div
        className="h-px w-full"
        style={{ background: 'linear-gradient(to right, transparent, #3ECF8E40, transparent)' }}
      />

      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-10">

          {/* ── Brand column ──────────────────────────────────────────── */}
          <div className="md:col-span-1">
            {/* Logo */}
            <div className="flex items-center gap-2 mb-3">
              {headshotUrl ? (
                <div className="relative w-8 h-8 rounded-lg overflow-hidden border border-[#3ECF8E]/30 p-[2px]">
                  <div className="relative w-full h-full rounded-md overflow-hidden bg-[#0A0A0A]">
                    <Image 
                      src={headshotUrl} 
                      alt="Bhanura Waduge Logo" 
                      fill 
                      className="object-cover" 
                      sizes="32px"
                    />
                  </div>
                </div>
              ) : (
                <div className="w-8 h-8 rounded-lg bg-[#3ECF8E] flex items-center justify-center text-[#0A0A0A] font-bold text-sm">
                  BW
                </div>
              )}
              <span className="font-semibold text-[#EDEDED]">Bhanura Waduge</span>
            </div>
            {/* Tagline */}
            <p className="text-sm text-[#666666] leading-relaxed max-w-xs">
              Full Stack &amp; AI Engineer — building digital products that matter.
            </p>
          </div>

          {/* ── Navigation column ─────────────────────────────────────── */}
          <div>
            <h3 className="text-xs font-semibold text-[#A1A1A1] uppercase tracking-widest mb-4">
              Navigation
            </h3>
            <ul className="space-y-2">
              {FOOTER_LINKS.map(({ label, href }) => (
                <li key={label}>
                  <Link
                    href={href}
                    className="text-sm text-[#666666] hover:text-[#3ECF8E] transition-colors"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* ── Social column ─────────────────────────────────────────── */}
          <div>
            <h3 className="text-xs font-semibold text-[#A1A1A1] uppercase tracking-widest mb-4">
              Connect
            </h3>
            <ul className="space-y-2">
              {SOCIAL_LINKS.map(({ label, href, icon: Icon }) => (
                <li key={label}>
                  <a
                    href={href}
                    target={href.startsWith('mailto') ? undefined : '_blank'}
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-sm text-[#666666] hover:text-[#3ECF8E] transition-colors"
                  >
                    <Icon size={14} />
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* ── Bottom bar ──────────────────────────────────────────────── */}
        <div className="border-t border-[#2E2E2E] pt-6 text-center">
          <p className="text-xs text-[#666666]">
            &copy; {new Date().getFullYear()} Bhanura Waduge. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
