/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class', // Enable class-based dark mode
  theme: {
    extend: {
      // ─── Custom Color Palette (Supabase-inspired dark theme) ───────────────
      colors: {
        // Background layers
        surface: {
          base:    '#0A0A0A', // Deepest background
          raised:  '#111111', // Slightly elevated surface
          overlay: '#1A1A1A', // Cards and panels
          border:  '#2E2E2E', // Borders and dividers
        },
        // Supabase-green accent
        brand: {
          DEFAULT: '#3ECF8E', // Primary accent green
          dark:    '#249169', // Hover / active state
          glow:    '#3ECF8E33', // Transparent glow for shadows
          subtle:  '#3ECF8E15', // Very subtle background tint
        },
        // Text colors
        content: {
          primary:   '#EDEDED', // Main readable text
          secondary: '#A1A1A1', // Subdued / metadata text
          muted:     '#666666', // Placeholder / disabled text
        },
      },

      // ─── Typography ──────────────────────────────────────────────────────
      fontFamily: {
        sans:  ['Inter', 'system-ui', 'sans-serif'],
        mono:  ['JetBrains Mono', 'monospace'],
      },

      // ─── Animations ──────────────────────────────────────────────────────
      animation: {
        'fade-in':       'fadeIn 0.6s ease-out forwards',
        'slide-up':      'slideUp 0.6s ease-out forwards',
        'slide-in-left': 'slideInLeft 0.6s ease-out forwards',
        'pulse-slow':    'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float':         'float 6s ease-in-out infinite',
        'glow-pulse':    'glowPulse 3s ease-in-out infinite',
        'spin-slow':     'spin 8s linear infinite',
      },
      keyframes: {
        fadeIn: {
          '0%':   { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%':   { opacity: '0', transform: 'translateY(24px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideInLeft: {
          '0%':   { opacity: '0', transform: 'translateX(-24px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%':      { transform: 'translateY(-12px)' },
        },
        glowPulse: {
          '0%, 100%': { boxShadow: '0 0 20px #3ECF8E22' },
          '50%':      { boxShadow: '0 0 40px #3ECF8E55, 0 0 80px #3ECF8E22' },
        },
      },

      // ─── Box Shadows ──────────────────────────────────────────────────────
      boxShadow: {
        'brand':     '0 0 30px #3ECF8E33',
        'brand-lg':  '0 0 60px #3ECF8E44',
        'card':      '0 4px 24px rgba(0, 0, 0, 0.4)',
        'card-hover':'0 8px 40px rgba(0, 0, 0, 0.6)',
      },

      // ─── Backdrop Blur ────────────────────────────────────────────────────
      backdropBlur: {
        xs: '2px',
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
};
