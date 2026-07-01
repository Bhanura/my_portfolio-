'use client';

/**
 * Navbar.tsx
 *
 * Features:
 *   - Glassmorphism: translucent background with backdrop blur
 *   - Scrolled state: adds stronger border on scroll
 *   - Resume link: REMOVED from public nav (hidden)
 *   - Hidden admin access: click logo 5 times rapidly → navigate to /admin/login
 *   - Mobile: hamburger menu that opens a slide-down nav
 *   - Active link: highlighted with brand green color
 */

import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import { Briefcase, Mail, PenTool, Menu, X } from 'lucide-react';
import Image from 'next/image';
import { supabase } from '@/lib/supabase';

// ── Navigation links (Resume is intentionally excluded from public nav) ─────
const NAV_LINKS = [
  { label: 'Projects', href: '/projects', icon: Briefcase },
  { label: 'Blog',     href: '/blog',     icon: PenTool },
  { label: 'Contact',  href: '/contact', icon: Mail },
];

export default function Navbar() {
  const router   = useRouter();
  const pathname = usePathname();

  // ── Scroll detection — adds a stronger border once user scrolls ──────────
  const [isScrolled, setIsScrolled] = useState(false);

  // ── Mobile menu open/close state ─────────────────────────────────────────
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // ── Secret admin access: track logo click count ───────────────────────────
  const [clickCount,     setClickCount]     = useState(0);
  const [lastClickTime,  setLastClickTime]  = useState(0);

  // ── Profile Photo ─────────────────────────────────────────────────────────
  const [headshotUrl, setHeadshotUrl] = useState<string>('');

  // Fetch headshot URL on mount
  useEffect(() => {
    const fetchSettings = async () => {
      const { data } = await supabase
        .from('site_settings')
        .select('content')
        .eq('section', 'hero')
        .single();
      if (data?.content?.headshotUrl) {
        setHeadshotUrl(data.content.headshotUrl);
      }
    };
    fetchSettings();
  }, []);

  // Listen to scroll to toggle the navbar border
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // When click count reaches 5 within 2s bursts, redirect to admin login
  useEffect(() => {
    if (clickCount >= 5) {
      router.push('/admin/login');
      setClickCount(0);
    }
  }, [clickCount, router]);

  // Handle logo click — increments counter, navigates home if under threshold
  const handleLogoClick = (e: React.MouseEvent) => {
    e.preventDefault();
    const now = Date.now();

    // Reset counter if more than 2 seconds since last click
    if (now - lastClickTime > 2000) {
      setClickCount(1);
    } else {
      setClickCount(prev => prev + 1);
    }
    setLastClickTime(now);

    // Navigate home unless we're about to trigger admin redirect
    if (clickCount < 4) {
      router.push('/');
    }
  };

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  return (
    <nav
      className={`
        fixed top-0 left-0 right-0 z-50
        transition-all duration-300
        ${isScrolled
          ? 'bg-[#0A0A0A]/90 backdrop-blur-xl border-b border-[#2E2E2E]'
          : 'bg-transparent backdrop-blur-sm'
        }
      `}
    >
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">

        {/* ── Logo ─────────────────────────────────────────────────────────── */}
        <div
          onClick={handleLogoClick}
          className="flex items-center gap-3 cursor-pointer select-none group"
        >
          {/* Logo badge / Profile Photo */}
          {headshotUrl ? (
            <div className="
              relative w-9 h-9 rounded-lg overflow-hidden
              border border-[#3ECF8E]/30 p-[2px]
              group-hover:shadow-[0_0_15px_rgba(62,207,142,0.3)] transition-all duration-300
            ">
              <div className="relative w-full h-full rounded-md overflow-hidden bg-[#0A0A0A]">
                <Image 
                  src={headshotUrl} 
                  alt="Bhanura Waduge Logo" 
                  fill 
                  className="object-cover" 
                  sizes="36px"
                />
              </div>
            </div>
          ) : (
            <div className="
              w-9 h-9 rounded-lg flex items-center justify-center font-bold text-sm
              bg-[#3ECF8E] text-[#0A0A0A]
              group-hover:shadow-[0_0_15px_rgba(62,207,142,0.4)] transition-all duration-300
            ">
              BW
            </div>
          )}
          {/* Full name — hidden on small screens */}
          <span className="hidden sm:inline text-[#EDEDED] font-semibold tracking-tight">
            Bhanura Waduge
          </span>
        </div>

        {/* ── Desktop Nav Links ─────────────────────────────────────────────── */}
        <div className="hidden md:flex items-center gap-1">
          {NAV_LINKS.map(({ label, href, icon: Icon }) => {
            // Determine if this link is the current active page
            const isActive = pathname === href || (href !== '/' && pathname.startsWith(href.split('#')[0]));
            return (
              <Link
                key={href}
                href={href}
                className={`
                  flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium
                  transition-all duration-200
                  ${isActive
                    ? 'text-[#3ECF8E] bg-[#3ECF8E10]'
                    : 'text-[#A1A1A1] hover:text-[#EDEDED] hover:bg-[#ffffff08]'
                  }
                `}
              >
                <Icon size={15} />
                {label}
              </Link>
            );
          })}
        </div>

        {/* ── Mobile Hamburger Button ──────────────────────────────────────── */}
        <button
          onClick={() => setIsMobileMenuOpen(prev => !prev)}
          className="md:hidden p-2 rounded-lg text-[#A1A1A1] hover:text-[#EDEDED] hover:bg-[#ffffff08] transition-colors"
          aria-label="Toggle mobile menu"
        >
          {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* ── Mobile Dropdown Menu ─────────────────────────────────────────────── */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-[#111111] border-b border-[#2E2E2E] px-4 py-3 space-y-1">
          {NAV_LINKS.map(({ label, href, icon: Icon }) => {
            const isActive = pathname === href || (href !== '/' && pathname.startsWith(href.split('#')[0]));
            return (
              <Link
                key={href}
                href={href}
                className={`
                  flex items-center gap-2 px-4 py-3 rounded-lg text-sm font-medium
                  transition-all duration-200
                  ${isActive
                    ? 'text-[#3ECF8E] bg-[#3ECF8E10]'
                    : 'text-[#A1A1A1] hover:text-[#EDEDED] hover:bg-[#ffffff08]'
                  }
                `}
              >
                <Icon size={16} />
                {label}
              </Link>
            );
          })}
        </div>
      )}
    </nav>
  );
}
