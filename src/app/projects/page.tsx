/**
 * projects/page.tsx — Projects listing page
 *
 * Fetches all projects from Supabase and renders them in a responsive card grid.
 * Each card supports:
 *   - image_url → Next.js <Image> (optimized)
 *   - video_url → <video> preview (muted autoplay for thumbnail feel)
 *   - Neither   → animated placeholder
 *
 * Revalidates every 60 seconds (ISR — no full deploy needed for content changes).
 */

import { supabase } from '@/lib/supabase';
import Link from 'next/link';
import ProjectCard from '@/components/ProjectCard';
import FadeIn from '@/components/FadeIn';

// ── ISR: Revalidate page data every 60 seconds ────────────────────────────────
export const revalidate = 60;

export default async function ProjectsPage() {
  // ── Fetch published projects from Supabase, newest first ───────────────────
  const { data: projects, error } = await supabase
    .from('projects')
    .select('*')
    .eq('is_published', true)
    .order('created_at', { ascending: false });

  // If Supabase returns an error, show a user-friendly message
  if (error) {
    console.error('Error fetching projects:', error);
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="glass-card p-8 text-center max-w-md">
          <p className="text-[#A1A1A1]">Unable to load projects right now. Please try again later.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen px-4 py-16 max-w-6xl mx-auto">

      {/* ── Page Header ─────────────────────────────────────────────────── */}
      <FadeIn className="mb-14">
        <p className="text-[#3ECF8E] text-sm font-medium tracking-widest uppercase mb-3">
          My work
        </p>
        <h1 className="text-4xl md:text-5xl font-bold text-[#EDEDED] mb-4">
          Projects
        </h1>
        <p className="text-[#A1A1A1] text-lg max-w-2xl">
          A collection of things I&apos;ve built — from web apps to AI systems.
        </p>
        <div className="mt-6 w-16 h-0.5 bg-[#3ECF8E] rounded-full" />
      </FadeIn>

      {/* ── Empty state ──────────────────────────────────────────────────── */}
      {(!projects || projects.length === 0) && (
        <div className="glass-card p-16 text-center">
          <p className="text-[#A1A1A1]">No projects published yet. Check back soon!</p>
        </div>
      )}

      {/* ── Projects Grid ────────────────────────────────────────────────── */}
      {projects && projects.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project, index) => (
            <FadeIn key={project.id} delay={Math.min(index * 0.1, 0.5)}>
              <ProjectCard project={project} index={index} />
            </FadeIn>
          ))}
        </div>
      )}
    </div>
  );
}


