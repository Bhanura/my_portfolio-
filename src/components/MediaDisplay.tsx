/**
 * MediaDisplay.tsx
 *
 * A smart media renderer that accepts image_url and/or video_url
 * and renders the appropriate element:
 *   - video_url → <video> with controls
 *   - image_url → Next.js <Image> (optimized, lazy-loaded)
 *   - neither   → a styled placeholder gradient
 *
 * Usage:
 *   <MediaDisplay imageUrl={project.image_url} videoUrl={project.video_url} alt="Project X" />
 */

import Image from 'next/image';

type MediaDisplayProps = {
  imageUrl?: string | null;
  videoUrl?: string | null;
  alt: string;
  className?: string;        // Applied to the outer wrapper div
  priority?: boolean;        // Pass true for above-the-fold images
};

export default function MediaDisplay({
  imageUrl,
  videoUrl,
  alt,
  className = '',
  priority = false,
}: MediaDisplayProps) {

  // ── Case 1: Render a video player if a video URL is provided ──────────────
  if (videoUrl) {
    return (
      <div className={`relative overflow-hidden ${className}`}>
        <video
          src={videoUrl}
          controls
          preload="metadata"
          className="w-full h-full object-cover"
          aria-label={alt}
        >
          {/* Fallback text for browsers that don't support <video> */}
          Your browser does not support the video tag.
        </video>
      </div>
    );
  }

  // ── Case 2: Render an optimized image if an image URL is provided ─────────
  if (imageUrl) {
    return (
      <div className={`relative overflow-hidden ${className}`}>
        <Image
          src={imageUrl}
          alt={alt}
          fill                            // Fill the parent container
          className="object-cover"        // Crop/zoom to fit (like CSS background-size: cover)
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          priority={priority}             // Eagerly load hero images
        />
      </div>
    );
  }

  // ── Case 3: Placeholder gradient if neither image nor video exists ─────────
  return (
    <div
      className={`flex items-center justify-center ${className}`}
      style={{
        background: 'linear-gradient(135deg, #1A1A1A 0%, #111111 50%, #0A0A0A 100%)',
      }}
      aria-label={`No media for ${alt}`}
    >
      {/* Decorative pattern to fill empty space */}
      <div
        className="w-full h-full flex items-center justify-center opacity-20"
        style={{
          backgroundImage: 'radial-gradient(circle, #3ECF8E 1px, transparent 1px)',
          backgroundSize: '24px 24px',
        }}
      />
    </div>
  );
}
