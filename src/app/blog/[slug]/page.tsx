/**
 * blog/[slug]/page.tsx — Blog article detail page
 *
 * Fetches a single published blog post by slug and renders:
 *   - Cover image (optimized via Next.js Image)
 *   - Post title and date
 *   - Rich text content via TiptapRenderer
 *
 * generateStaticParams pre-builds pages for all published posts at build time.
 */

import { supabase } from '@/lib/supabase';
import { notFound } from 'next/navigation';
import TiptapRenderer from '@/components/TiptapRenderer';
import { Calendar, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

// ── ISR: Revalidate every 60 seconds ──────────────────────────────────────────
export const revalidate = 60;

// ── Pre-build detail pages for all published post slugs ──────────────────────
export async function generateStaticParams() {
  const { data: posts } = await supabase
    .from('posts')
    .select('slug')
    .eq('is_published', true);
  return posts?.map(({ slug }) => ({ slug })) ?? [];
}

// ── Page component ────────────────────────────────────────────────────────────
export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const { data: post, error } = await supabase
    .from('posts')
    .select('*')
    .eq('slug', slug)
    .single();

  if (error || !post) {
    notFound();
  }

  return (
    <article className="min-h-screen">

      {/* ── Cover image (full-width, if set) ──────────────────────────── */}
      {post.image_url && (
        <div className="relative w-full h-[45vh] overflow-hidden bg-[#111111]">
          <Image
            src={post.image_url}
            alt={post.title}
            fill
            className="object-cover"
            priority
            sizes="100vw"
          />
          {/* Gradient fade into page background */}
          <div
            className="absolute inset-0"
            style={{ background: 'linear-gradient(to bottom, transparent 40%, #0A0A0A 100%)' }}
          />
        </div>
      )}

      {/* ── Article content area ──────────────────────────────────────── */}
      <div className="max-w-3xl mx-auto px-4 py-12">

        {/* Back link */}
        <Link
          href="/blog"
          className="inline-flex items-center gap-2 text-sm text-[#666666] hover:text-[#3ECF8E] transition-colors mb-10 group"
        >
          <ArrowLeft size={15} className="group-hover:-translate-x-1 transition-transform" />
          Back to Blog
        </Link>

        {/* ── Post header ────────────────────────────────────────────── */}
        <header className="mb-10 text-center">
          {/* Publication date */}
          <div className="flex items-center justify-center gap-1.5 text-sm text-[#666666] mb-5">
            <Calendar size={14} />
            {new Date(post.published_at || post.created_at).toLocaleDateString('en-US', {
              year: 'numeric', month: 'long', day: 'numeric',
            })}
          </div>

          {/* Title */}
          <h1 className="text-3xl md:text-5xl font-bold text-[#EDEDED] leading-tight">
            {post.title}
          </h1>
        </header>

        {/* Divider */}
        <div className="border-t border-[#2E2E2E] mb-10" />

        {/* ── Rich text content from Tiptap editor ─────────────────── */}
        {/*
          TiptapRenderer converts the stored Tiptap JSON to HTML.
          The prose classes below style the HTML output.
        */}
        <div className="
          prose prose-invert prose-lg max-w-none
          prose-headings:text-[#EDEDED] prose-headings:font-bold
          prose-p:text-[#A1A1A1] prose-p:leading-relaxed
          prose-a:text-[#3ECF8E] prose-a:no-underline hover:prose-a:underline
          prose-strong:text-[#EDEDED]
          prose-code:text-[#3ECF8E] prose-code:bg-[#111111] prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded
          prose-pre:bg-[#111111] prose-pre:border prose-pre:border-[#2E2E2E] prose-pre:rounded-xl
          prose-blockquote:border-l-[#3ECF8E] prose-blockquote:text-[#A1A1A1]
          prose-img:rounded-xl prose-img:border prose-img:border-[#2E2E2E]
          prose-hr:border-[#2E2E2E]
        ">
          <TiptapRenderer content={post.content} />
        </div>

        {/* ── Footer: back to blog ────────────────────────────────────── */}
        <div className="mt-16 pt-8 border-t border-[#2E2E2E]">
          <Link href="/blog" className="btn-secondary text-sm">
            <ArrowLeft size={15} />
            Back to all articles
          </Link>
        </div>
      </div>
    </article>
  );
}
