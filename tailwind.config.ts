import type { Config } from 'tailwindcss';

export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        void: 'oklch(0.08 0.008 195)',
        accent: 'oklch(0.82 0.11 85)',
        'fg-high': 'rgba(255, 255, 255, 0.92)',
        'fg-mid': 'rgba(255, 255, 255, 0.60)',
        'fg-low': 'rgba(255, 255, 255, 0.35)',
      },
      fontFamily: {
        serif: ['"Cormorant Garamond"', 'serif'],
        sans: ['"Inter Tight"', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      letterSpacing: {
        'mono-tight': '0.05em',
        'mono-default': '0.15em',
        'mono-wide': '0.2em',
      },
      transitionTimingFunction: {
        'cinematic': 'cubic-bezier(0.65, 0, 0.35, 1)',
      },
    },
  },
  plugins: [],
} satisfies Config;
