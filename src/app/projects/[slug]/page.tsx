/**
 * projects/[slug]/page.tsx — Project detail page
 *
 * Fetches a single project by its URL slug and renders:
 *   - Title, description, and metadata (date period, links, repos)
 *   - Rich text content (HTML from Tiptap editor)
 *   - Tech stack badges
 *   - Bottom Media Gallery
 */

import { supabase } from '@/lib/supabase';
import { notFound } from 'next/navigation';
import { Github, ExternalLink, Calendar, ArrowLeft, ImageIcon } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

// ── ISR: Revalidate every 60 seconds ──────────────────────────────────────────
export const revalidate = 60;

export async function generateStaticParams() {
  const { data: projects } = await supabase.from('projects').select('slug');
  return projects?.map(({ slug }) => ({ slug })) ?? [];
}

// ── Formatting helper for time periods ──────────────────────────────────────
function formatPeriod(start: string | null, end: string | null) {
  if (!start && !end) return null;
  
  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
  };
  
  const startStr = start ? formatDate(start) : 'Unknown';
  const endStr = end ? formatDate(end) : 'Present';
  
  // If start and end are exactly the same month/year, just return one
  if (startStr === endStr) return startStr;
  
  return `${startStr} — ${endStr}`;
}

// ── Page component ────────────────────────────────────────────────────────────
export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  // ── Fetch the project matching this slug ──────────────────────────────────
  const { data: project, error } = await supabase
    .from('projects')
    .select('*')
    .eq('slug', slug)
    .single();

  if (error || !project) {
    notFound();
  }

  const timePeriod = formatPeriod(project.start_date, project.end_date);
  const repos = project.repositories || [];
  const media = project.media || [];

  return (
    <article className="min-h-screen">

      <div className="max-w-4xl mx-auto px-4 py-16">

        {/* Back to projects link */}
        <Link
          href="/projects"
          className="inline-flex items-center gap-2 text-sm text-[#666666] hover:text-[#3ECF8E] transition-colors mb-10 group"
        >
          <ArrowLeft size={15} className="group-hover:-translate-x-1 transition-transform" />
          Back to Projects
        </Link>

        {/* ── Project Header ──────────────────────────────────────────────── */}
        <header className="mb-12">

          {/* Title */}
          <h1 className="text-4xl md:text-5xl font-bold text-[#EDEDED] mb-4 leading-tight">
            {project.title}
          </h1>

          {/* Time Period */}
          {timePeriod && (
            <div className="flex items-center gap-2 text-[#3ECF8E] font-medium mb-6">
              <Calendar size={16} />
              <span>{timePeriod}</span>
            </div>
          )}

          {project.description && (
            <div className="prose prose-invert prose-lg max-w-none prose-p:text-xl prose-p:text-[#A1A1A1] prose-p:leading-relaxed mb-8 prose-headings:text-[#EDEDED] prose-headings:font-bold prose-a:text-[#3ECF8E]">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {project.description}
              </ReactMarkdown>
            </div>
          )}

          {/* Metadata row: links and repos */}
          <div className="flex flex-wrap gap-4 items-center">
            
            {/* Render all repositories */}
            {repos.map((repo: { name: string; url: string }, index: number) => (
              <a
                key={index}
                href={repo.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-sm text-[#EDEDED] bg-[#1A1A1A] border border-[#2E2E2E] px-3 py-1.5 rounded-lg hover:border-[#3ECF8E] hover:text-[#3ECF8E] transition-colors shadow-sm"
              >
                <Github size={14} />
                {repo.name || 'GitHub'}
              </a>
            ))}

            {project.demo_url && (
              <a
                href={project.demo_url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-sm text-black bg-[#3ECF8E] border border-[#3ECF8E] px-3 py-1.5 rounded-lg hover:bg-[#249169] transition-colors shadow-sm font-medium"
              >
                <ExternalLink size={14} />
                Live Demo
              </a>
            )}
          </div>
        </header>

        {/* Divider */}
        <div className="border-t border-[#2E2E2E] mb-12" />

        {/* ── Rich Text Content ────────────────────────────────────────────── */}
        <div className="prose prose-invert prose-lg max-w-none
          prose-headings:text-[#EDEDED] prose-headings:font-bold
          prose-p:text-[#A1A1A1] prose-p:leading-relaxed
          prose-a:text-[#3ECF8E] prose-a:no-underline hover:prose-a:underline
          prose-strong:text-[#EDEDED]
          prose-code:text-[#3ECF8E] prose-code:bg-[#111111] prose-code:px-1 prose-code:rounded
          prose-pre:bg-[#111111] prose-pre:border prose-pre:border-[#2E2E2E]
          prose-blockquote:border-[#3ECF8E] prose-blockquote:text-[#A1A1A1]
          prose-hr:border-[#2E2E2E] mb-16
        ">
          {project.content ? (
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {project.content}
            </ReactMarkdown>
          ) : (
            <p className="text-[#666666] italic">No detailed write-up yet.</p>
          )}
        </div>

        {/* ── Bottom Media Gallery ─────────────────────────────────────────── */}
        {media.length > 0 && (
          <div className="mb-16">
            <h3 className="text-2xl font-bold text-[#EDEDED] mb-6">Gallery</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {media.map((item: { type: string; url: string }, index: number) => (
                <div key={index} className="relative aspect-video rounded-xl overflow-hidden border border-[#2E2E2E] bg-[#0A0A0A] shadow-lg group">
                  {item.type === 'image' ? (
                    <Image
                      src={item.url}
                      alt={`${project.title} gallery image ${index + 1}`}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                      sizes="(max-width: 768px) 100vw, 50vw"
                    />
                  ) : (
                    <video
                      src={item.url}
                      controls
                      preload="metadata"
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── Tech Stack ──────────────────────────────────────────────────── */}
        {project.tech_stack && project.tech_stack.length > 0 && (
          <div className="pt-8 border-t border-[#2E2E2E]">
            <h3 className="text-sm font-medium text-[#A1A1A1] uppercase tracking-widest mb-4">
              Technologies Used
            </h3>
            <div className="flex flex-wrap gap-2">
              {project.tech_stack.map((tech: string) => (
                <span key={tech} className="tech-badge">
                  {tech}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* ── CTA: Go back ──────────────────────────────────────────────── */}
        <div className="mt-16 pt-8 border-t border-[#2E2E2E] flex justify-between items-center">
          <Link href="/projects" className="btn-secondary text-sm">
            <ArrowLeft size={15} />
            All Projects
          </Link>
          <div className="flex gap-3">
            {repos.length > 0 && (
              <a href={repos[0].url} target="_blank" rel="noopener noreferrer" className="btn-secondary text-sm">
                <Github size={15} />
                Code
              </a>
            )}
            {project.demo_url && (
              <a href={project.demo_url} target="_blank" rel="noopener noreferrer" className="btn-primary text-sm">
                <ExternalLink size={15} />
                Live Demo
              </a>
            )}
          </div>
        </div>
      </div>
    </article>
  );
}
