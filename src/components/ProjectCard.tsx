'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Github, ExternalLink, ArrowRight, ChevronLeft, ChevronRight, Image as ImageIcon } from 'lucide-react';

export default function ProjectCard({ project, index }: { project: any; index: number }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const media = project.media || [];
  const delayMs = Math.min(index * 100, 600);

  // Auto-play slideshow on hover
  useEffect(() => {
    if (isHovered && media.length > 1) {
      timerRef.current = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % media.length);
      }, 2000); // Change image every 2 seconds on hover
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
      // Reset to thumbnail when not hovering
      setCurrentIndex(0); 
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isHovered, media.length]);

  const handleNext = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentIndex((prev) => (prev + 1) % media.length);
  };

  const handlePrev = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentIndex((prev) => (prev - 1 + media.length) % media.length);
  };

  const currentMedia = media[currentIndex];

  return (
    <div
      className="glass-card flex flex-col overflow-hidden group hover:border-[#3ECF8E30] transition-all duration-300 hover:-translate-y-1 hover:shadow-card-hover"
      style={{ animation: `slideUp 0.5s ease-out ${delayMs}ms both` }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* ── Media Gallery Tile ─────────────────────────────────────────── */}
      <div className="relative w-full h-48 bg-[#0A0A0A] overflow-hidden group/media">
        {media.length > 0 && currentMedia ? (
          currentMedia.type === 'image' ? (
            <Image
              src={currentMedia.url}
              alt={project.title}
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, 33vw"
            />
          ) : (
            <video
              src={currentMedia.url}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              autoPlay
              muted
              loop
              playsInline
            />
          )
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center text-[#666666]">
            <ImageIcon size={32} className="mb-2 opacity-50" />
            <span className="text-xs">No media</span>
          </div>
        )}

        {/* Media counter indicator */}
        {media.length > 1 && (
          <div className="absolute top-2 right-2 bg-black/60 backdrop-blur-md px-2 py-1 rounded-md text-[10px] text-white font-medium z-10">
            {currentIndex + 1} / {media.length}
          </div>
        )}

        {/* Manual Navigation Arrows (show only on hover if multiple media) */}
        {media.length > 1 && isHovered && (
          <>
            <button
              onClick={handlePrev}
              className="absolute left-2 top-1/2 -translate-y-1/2 p-1.5 bg-black/50 hover:bg-[#3ECF8E] hover:text-black text-white rounded-full transition-colors z-20"
            >
              <ChevronLeft size={16} />
            </button>
            <button
              onClick={handleNext}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 bg-black/50 hover:bg-[#3ECF8E] hover:text-black text-white rounded-full transition-colors z-20"
            >
              <ChevronRight size={16} />
            </button>
          </>
        )}
      </div>

      {/* ── Card body ────────────────────────────────────────────────────── */}
      <div className="p-6 flex flex-col flex-1">
        <Link href={`/projects/${project.slug}`} className="block group/title mb-2">
          <h2 className="text-lg font-semibold text-[#EDEDED] group-hover/title:text-[#3ECF8E] transition-colors leading-snug">
            {project.title}
          </h2>
        </Link>

        <p className="text-sm text-[#A1A1A1] leading-relaxed mb-4 flex-1 line-clamp-3">
          {project.description || 'No description provided.'}
        </p>

        {project.tech_stack && project.tech_stack.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-4">
            {project.tech_stack.slice(0, 4).map((tech: string) => (
              <span key={tech} className="tech-badge text-xs">
                {tech}
              </span>
            ))}
            {project.tech_stack.length > 4 && (
              <span className="text-xs text-[#666666] py-1 px-1">
                +{project.tech_stack.length - 4} more
              </span>
            )}
          </div>
        )}

        <div className="flex items-center justify-between pt-4 border-t border-[#2E2E2E] mt-auto">
          <div className="flex items-center gap-3">
            {/* Show first repo link if exists */}
            {project.repositories && project.repositories.length > 0 && (
              <a
                href={project.repositories[0].url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-xs text-[#666666] hover:text-[#3ECF8E] transition-colors"
              >
                <Github size={14} />
                Code
              </a>
            )}
            {project.demo_url && (
              <a
                href={project.demo_url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-xs text-[#666666] hover:text-[#3ECF8E] transition-colors"
              >
                <ExternalLink size={14} />
                Demo
              </a>
            )}
          </div>

          <Link
            href={`/projects/${project.slug}`}
            className="flex items-center gap-1 text-xs text-[#3ECF8E] hover:gap-2 transition-all font-medium"
          >
            Details
            <ArrowRight size={13} />
          </Link>
        </div>
      </div>
    </div>
  );
}
