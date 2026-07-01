/**
 * page.tsx — Homepage
 *
 * Sections:
 *   1. Hero     — Profile photo, name, headline, CTA buttons, social links
 *   2. Skills   — Animated grid of tech skill badges
 *   3. Contact  — Contact form (ContactForm component)
 *
 * Profile photo is fetched from the 'hero' row in site_settings (Supabase).
 * To update your photo:
 *   1. Upload it to Supabase Storage → portfolio-assets bucket
 *   2. Copy the public URL
 *   3. In Admin → Site Settings → hero → set "headshotUrl" to that URL
 */

import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Github, Linkedin, Mail, ExternalLink } from 'lucide-react';
import HeroBackground from '@/components/HeroBackground';
import ExperienceTimeline from '@/components/ExperienceTimeline';
import EducationTimeline from '@/components/EducationTimeline';
import FadeIn from '@/components/FadeIn';
import { supabase } from '@/lib/supabase';

// ── Revalidate every 60 seconds (ISR — updates without a full deploy) ─────────
export const revalidate = 60;

// ── Skills to display in the Skills section ───────────────────────────────────
// Edit this array to add/remove your skills
const SKILLS = [
  // Languages
  { label: 'Python', category: 'language' },
  { label: 'TypeScript', category: 'language' },
  { label: 'JavaScript', category: 'language' },
  { label: 'SQL', category: 'language' },
  // Frameworks & Libraries
  { label: 'React', category: 'framework' },
  { label: 'Next.js', category: 'framework' },
  { label: 'Node.js', category: 'framework' },
  { label: 'FastAPI', category: 'framework' },
  // AI / ML
  { label: 'TensorFlow', category: 'ai' },
  { label: 'LangChain', category: 'ai' },
  { label: 'OpenAI API', category: 'ai' },
  // Cloud & Tools
  { label: 'Supabase', category: 'tool' },
  { label: 'PostgreSQL', category: 'tool' },
  { label: 'Docker', category: 'tool' },
  { label: 'Git', category: 'tool' },
  { label: 'Tailwind CSS', category: 'tool' },
];

// ── Social links ──────────────────────────────────────────────────────────────
const SOCIAL_LINKS = [
  {
    label: 'GitHub',
    href: 'https://github.com/Bhanura',
    icon: Github,
  },
  {
    label: 'LinkedIn',
    href: 'https://www.linkedin.com/in/bhanura-waduge-44b7611a7',
    icon: Linkedin,
  },
  {
    label: 'Email',
    href: 'mailto:bhanuwaduge@gmail.com',
    icon: Mail,
  },
];

export default async function Home() {
  // ── Fetch hero settings from Supabase (headshotUrl, tagline, etc.) ─────────
  const { data: heroSettings } = await supabase
    .from('site_settings')
    .select('content')
    .eq('section', 'hero')
    .single();

  // Extract the headshot URL from site settings (empty string = no photo set yet)
  const headshotUrl: string = heroSettings?.content?.headshotUrl || '';
  const headline: string = heroSettings?.content?.headline || 'I build exceptional digital products — from scalable web applications to intelligent AI-powered systems. Passionate about clean architecture and delightful user experiences.';

  // ── Fetch published professional experiences ───────────────────────────────
  const { data: experiences } = await supabase
    .from('experiences')
    .select('*')
    .eq('is_published', true)
    .order('start_date', { ascending: false });

  // ── Fetch published education milestones ───────────────────────────────────
  const { data: educationList } = await supabase
    .from('education')
    .select('*')
    .eq('is_published', true)
    .order('start_date', { ascending: false });

  return (
    <div className="flex flex-col">

      {/* ════════════════════════════════════════════════════════════════════
          SECTION 1: HERO
          ════════════════════════════════════════════════════════════════════ */}
      <section className="relative min-h-[calc(100vh-64px)] flex items-center justify-center px-4 overflow-hidden">

        {/* Animated background blobs + dot grid (purely decorative) */}
        <HeroBackground />

        {/* Hero content — stacked on mobile, side-by-side on large screens */}
        <div className="relative z-10 max-w-6xl mx-auto w-full py-20">
          <div className="flex flex-col-reverse lg:flex-row items-center gap-16 lg:gap-24">

            {/* ── Left column: Text content ─────────────────────────────── */}
            <div className="flex-1 text-center lg:text-left">
              {/* Animated availability badge */}
              <FadeIn delay={0.1}>
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-[#3ECF8E33] bg-[#3ECF8E08] text-[#3ECF8E] text-xs font-medium mb-6">
                  {/* Green pulse dot */}
                  <span className="w-1.5 h-1.5 rounded-full bg-[#3ECF8E] animate-pulse" />
                  Available for opportunities
                </div>
              </FadeIn>

              {/* Name */}
              <FadeIn delay={0.2}>
                <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-4 text-[#EDEDED]">
                  Bhanura{' '}
                  <span className="text-gradient">Waduge</span>
                </h1>
              </FadeIn>

              {/* Description */}
              <FadeIn delay={0.3}>
                <p className="text-lg md:text-xl text-[#A1A1A1] leading-relaxed mb-10 max-w-xl mx-auto lg:mx-0">
                  {headline}
                </p>
              </FadeIn>

              {/* CTA Buttons */}
              <FadeIn delay={0.4} className="flex flex-wrap items-center justify-center lg:justify-start gap-4 mb-12">
                <Link href="/projects" className="btn-primary group">
                  View My Work
                  <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link href="/contact" className="btn-secondary">
                  Get In Touch
                </Link>
              </FadeIn>

              {/* Social Links */}
              <FadeIn delay={0.5} className="flex items-center justify-center lg:justify-start gap-4">
                {SOCIAL_LINKS.map(({ label, href, icon: Icon }) => (
                  <a
                    key={label}
                    href={href}
                    target={href.startsWith('mailto') ? undefined : '_blank'}
                    rel="noopener noreferrer"
                    aria-label={label}
                    className="
                      w-10 h-10 rounded-lg flex items-center justify-center
                      text-[#666666] border border-[#2E2E2E] bg-[#111111]
                      hover:text-[#3ECF8E] hover:border-[#3ECF8E40] hover:bg-[#3ECF8E08]
                      transition-all duration-200
                    "
                  >
                    <Icon size={18} />
                  </a>
                ))}
              </FadeIn>
            </div>

            {/* ── Right column: Profile Photo ──────────────────────────────── */}
            <FadeIn delay={0.3} className="flex-shrink-0">
              {headshotUrl ? (
                // ── Photo uploaded: render with animated ring border ─────────
                <div className="relative">
                  {/* Spinning gradient ring */}
                  <div className="avatar-ring w-64 h-64 md:w-72 md:h-72" aria-hidden="true">
                    <div className="w-full h-full rounded-full overflow-hidden bg-[#0A0A0A] p-0.5">
                      <Image
                        src={headshotUrl}
                        alt="Bhanura Waduge — Profile Photo"
                        fill
                        className="object-cover rounded-full"
                        priority   // Load this image eagerly (above the fold)
                        sizes="(max-width: 768px) 256px, 288px"
                      />
                    </div>
                  </div>
                  {/* Glow behind the photo */}
                  <div
                    className="absolute inset-0 rounded-full blur-3xl -z-10 scale-75"
                    style={{ background: 'radial-gradient(circle, rgba(62, 207, 142, 0.2) 0%, transparent 70%)' }}
                    aria-hidden="true"
                  />
                </div>
              ) : (
                // ── No photo yet: render an elegant placeholder ──────────────
                <div className="relative w-64 h-64 md:w-72 md:h-72">
                  <div className="w-full h-full rounded-full border-2 border-dashed border-[#3ECF8E40] flex flex-col items-center justify-center gap-2 bg-[#111111]">
                    <span className="text-5xl font-bold text-gradient">BW</span>
                    <span className="text-xs text-[#666666] text-center px-4">
                      Upload photo in<br />Admin → Settings
                    </span>
                  </div>
                  <div
                    className="absolute inset-0 rounded-full blur-3xl -z-10 scale-75 opacity-50"
                    style={{ background: 'radial-gradient(circle, rgba(62, 207, 142, 0.15) 0%, transparent 70%)' }}
                    aria-hidden="true"
                  />
                </div>
              )}
            </FadeIn>

          </div>
        </div>

        {/* Scroll indicator */}
        <FadeIn delay={1} className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 text-[#666666]">
          <span className="text-xs tracking-widest uppercase">Scroll</span>
          <div className="w-px h-8 bg-gradient-to-b from-[#666666] to-transparent" />
        </FadeIn>
      </section>

      {/* ════════════════════════════════════════════════════════════════════
          SECTION 2: SKILLS
          ════════════════════════════════════════════════════════════════════ */}
      <section className="px-4 py-24 max-w-6xl mx-auto w-full">

        {/* Section header */}
        <FadeIn className="text-center mb-14">
          <p className="text-[#3ECF8E] text-sm font-medium tracking-widest uppercase mb-3">
            What I work with
          </p>
          <h2 className="text-3xl md:text-4xl font-bold text-[#EDEDED]">
            Skills &amp; Technologies
          </h2>
          <div className="mt-4 w-16 h-0.5 bg-[#3ECF8E] mx-auto rounded-full" />
        </FadeIn>

        {/* Skills grid — responsive badge layout */}
        <FadeIn delay={0.2} className="flex flex-wrap gap-3 justify-center">
          {SKILLS.map(({ label }) => (
            <span key={label} className="tech-badge">
              {label}
            </span>
          ))}
        </FadeIn>
      </section>

      {/* ════════════════════════════════════════════════════════════════════
          SECTION 3: EXPERIENCE
          ════════════════════════════════════════════════════════════════════ */}
      {experiences && experiences.length > 0 && (
        <section className="px-4 py-24 max-w-4xl mx-auto w-full">
          {/* Section header */}
          <FadeIn className="mb-14">
            <p className="text-[#3ECF8E] text-sm font-medium tracking-widest uppercase mb-3">
              Career Journey
            </p>
            <h2 className="text-3xl md:text-4xl font-bold text-[#EDEDED]">
              Professional Experience
            </h2>
            <div className="mt-4 w-16 h-0.5 bg-[#3ECF8E] rounded-full" />
          </FadeIn>

          <ExperienceTimeline experiences={experiences} />
        </section>
      )}

      {/* ════════════════════════════════════════════════════════════════════
          SECTION 4: EDUCATION
          ════════════════════════════════════════════════════════════════════ */}
      {educationList && educationList.length > 0 && (
        <section className="px-4 py-24 max-w-4xl mx-auto w-full border-t border-[#2E2E2E]">
          {/* Section header */}
          <FadeIn className="mb-14">
            <p className="text-[#3ECF8E] text-sm font-medium tracking-widest uppercase mb-3">
              Academic Background
            </p>
            <h2 className="text-3xl md:text-4xl font-bold text-[#EDEDED]">
              Education &amp; Milestones
            </h2>
            <div className="mt-4 w-16 h-0.5 bg-[#3ECF8E] rounded-full" />
          </FadeIn>

          <EducationTimeline educationList={educationList} />
        </section>
      )}

    </div>
  );
}
