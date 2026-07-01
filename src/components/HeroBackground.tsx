/**
 * HeroBackground.tsx
 *
 * Decorative animated background for the hero section.
 * Uses CSS-only blobs (no external libraries) and a dot-grid overlay.
 *
 * How it works:
 *   - position: absolute, fills its parent (parent must be position: relative)
 *   - pointer-events: none so clicks pass through to content above
 *   - z-index: 0 (content should be z-index: 10 or higher)
 */

export default function HeroBackground() {
  return (
    // Outer wrapper — fills the parent hero container
    <div
      className="absolute inset-0 overflow-hidden pointer-events-none"
      aria-hidden="true"   // Hidden from screen readers — it's purely decorative
    >
      {/* ── Dot grid overlay ───────────────────────────────────────────────── */}
      <div
        className="absolute inset-0 opacity-30"
        style={{
          backgroundImage:
            'radial-gradient(circle, rgba(62, 207, 142, 0.15) 1px, transparent 1px)',
          backgroundSize: '40px 40px',
        }}
      />

      {/* ── Glow Blob 1 — top left, large, brand green ───────────────────── */}
      <div
        className="absolute rounded-full blur-3xl animate-pulse-slow"
        style={{
          width: '600px',
          height: '600px',
          top: '-200px',
          left: '-200px',
          background: 'radial-gradient(circle, rgba(62, 207, 142, 0.12) 0%, transparent 70%)',
        }}
      />

      {/* ── Glow Blob 2 — bottom right, medium, teal ─────────────────────── */}
      <div
        className="absolute rounded-full blur-3xl animate-pulse-slow animate-delay-700"
        style={{
          width: '400px',
          height: '400px',
          bottom: '-100px',
          right: '-100px',
          background: 'radial-gradient(circle, rgba(36, 145, 105, 0.15) 0%, transparent 70%)',
        }}
      />

      {/* ── Glow Blob 3 — center, very subtle white glow ─────────────────── */}
      <div
        className="absolute rounded-full blur-3xl animate-pulse-slow animate-delay-400"
        style={{
          width: '300px',
          height: '300px',
          top: '40%',
          left: '60%',
          background: 'radial-gradient(circle, rgba(255, 255, 255, 0.02) 0%, transparent 70%)',
        }}
      />

      {/* ── Gradient fade — fades the grid/blobs at the bottom ──────────── */}
      <div
        className="absolute inset-x-0 bottom-0 h-48"
        style={{
          background: 'linear-gradient(to top, #0A0A0A 0%, transparent 100%)',
        }}
      />
    </div>
  );
}
