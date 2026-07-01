/**
 * blog/page.tsx — Blog listing page
 *
 * Fetches all published blog posts from Supabase and displays them
 * as a grid of article cards. Each card shows:
 *   - Cover image (via Next.js Image for optimization)
 *   - Publication date
 *   - Title (links to the full article)
 *   - A short excerpt placeholder
 *
 * Only published posts (is_published = true) are shown.
 */

import { supabase } from '@/lib/supabase';
import Link from 'next/link';
import Image from 'next/image';
import { Calendar, ArrowRight } from 'lucide-react';
import FadeIn from '@/components/FadeIn';

// ── ISR: Revalidate every 60 seconds ──────────────────────────────────────────
export const revalidate = 60;

export default async function BlogPage() {
  // ── Fetch published posts, newest first ──────────────────────────────────
  const { data: posts, error } = await supabase
    .from('posts')
    .select('id, title, slug, created_at, published_at, is_published, image_url')
    .eq('is_published', true)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching blog posts:', error);
    return (
      <div className="min-h-[60vh] flex items-center justify-center px-4">
        <div className="glass-card p-8 text-center max-w-md">
          <p className="text-[#A1A1A1]">Unable to load articles right now. Please try again later.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen px-4 py-16 max-w-6xl mx-auto">

      {/* ── Page Header ─────────────────────────────────────────────────── */}
      <FadeIn className="mb-14">
        <p className="text-[#3ECF8E] text-sm font-medium tracking-widest uppercase mb-3">
          Thoughts &amp; guides
        </p>
        <h1 className="text-4xl md:text-5xl font-bold text-[#EDEDED] mb-4">
          Technical Blog
        </h1>
        <p className="text-[#A1A1A1] text-lg max-w-2xl">
          Articles on full-stack development, AI engineering, and lessons learned building things.
        </p>
        <div className="mt-6 w-16 h-0.5 bg-[#3ECF8E] rounded-full" />
      </FadeIn>

      {/* ── Empty state ──────────────────────────────────────────────────── */}
      {(!posts || posts.length === 0) && (
        <div className="glass-card p-16 text-center">
          <p className="text-[#A1A1A1]">No articles published yet. Check back soon!</p>
        </div>
      )}

      {/* ── Blog cards grid ──────────────────────────────────────────────── */}
      {posts && posts.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map((post, index) => {
            return (
              <FadeIn key={post.id} delay={Math.min(index * 0.1, 0.5)}>
                <article
                  className="glass-card flex flex-col overflow-hidden group hover:border-[#3ECF8E30] transition-all duration-300 hover:-translate-y-1 hover:shadow-card-hover"
                >
                {/* Cover image area */}
                <div className="relative w-full h-48 overflow-hidden bg-[#111111]">
                  {post.image_url ? (
                    <Image
                      src={post.image_url}
                      alt={post.title}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                  ) : (
                    // Placeholder pattern when no cover image is set
                    <div
                      className="w-full h-full flex items-center justify-center"
                      style={{
                        backgroundImage: 'radial-gradient(circle, rgba(62, 207, 142, 0.08) 1px, transparent 1px)',
                        backgroundSize: '20px 20px',
                      }}
                    >
                      <span className="text-4xl font-bold text-gradient opacity-40">BW</span>
                    </div>
                  )}
                  {/* Gradient overlay at bottom of image */}
                  <div
                    className="absolute inset-x-0 bottom-0 h-16"
                    style={{ background: 'linear-gradient(to top, rgba(26,26,26,0.9), transparent)' }}
                  />
                </div>

                {/* Card body */}
                <div className="p-6 flex flex-col flex-1">
                  {/* Publication date */}
                  <div className="flex items-center gap-1.5 text-xs text-[#666666] mb-3">
                    <Calendar size={12} />
                    {new Date(post.published_at || post.created_at).toLocaleDateString('en-US', {
                      year: 'numeric', month: 'long', day: 'numeric',
                    })}
                  </div>

                  {/* Post title */}
                  <Link href={`/blog/${post.slug}`} className="block group/title mb-3">
                    <h2 className="text-base font-semibold text-[#EDEDED] group-hover/title:text-[#3ECF8E] transition-colors leading-snug">
                      {post.title}
                    </h2>
                  </Link>

                  {/* Spacer to push CTA to bottom */}
                  <div className="flex-1" />

                  {/* Read more link */}
                  <Link
                    href={`/blog/${post.slug}`}
                    className="inline-flex items-center gap-1.5 text-sm text-[#3ECF8E] hover:gap-3 transition-all font-medium mt-4 pt-4 border-t border-[#2E2E2E]"
                  >
                    Read article
                    <ArrowRight size={14} />
                  </Link>
                </div>
              </article>
            </FadeIn>
          );
        })}
        </div>
      )}
    </div>
  );
}
