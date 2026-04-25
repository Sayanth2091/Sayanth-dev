# 01 — BOOTSTRAP

> Run this first. After this file, you have a working Astro project with design tokens, fonts, the canvas, and a git workflow. Nothing else.

---

## Pre-flight check (do once, manually)

Before running this prompt with any model:

1. Install Node 20+ and pnpm: `npm install -g pnpm`
2. Have a fresh empty folder ready: `~/projects/null-sector`
3. Have a GitHub repo created (empty, no README) named exactly `null-sector` under your account
4. Read `00_NARRATIVE_BIBLE.md` once. The model will reference it constantly.

---

## The bootstrap prompt — paste this into Sonnet/Haiku

```
You are building the foundation of a portfolio website codenamed NULL_SECTOR. This is build step 01 of 10. Do not build any sections in this step. Only the foundation.

Read 00_NARRATIVE_BIBLE.md before responding. Treat it as authoritative.

PROJECT GOAL FOR THIS STEP:
A working Astro 4 project with:
- TypeScript strict mode
- Tailwind 3 with custom design tokens from the bible
- React Three Fiber + Drei + Postprocessing installed (for later 3D work)
- GSAP + ScrollTrigger installed (for later animation)
- Lenis installed (smooth scroll)
- Three custom fonts loaded (Cormorant Garamond as serif fallback, Inter Tight, JetBrains Mono)
- A working `BaseLayout.astro` that sets the canvas background, the grain texture, and the cursor
- A homepage `index.astro` that renders only "NULL_SECTOR // BOOTSTRAP COMPLETE" in mono, centered, on the void canvas
- Custom cursor implemented in pure CSS+JS (ring + crosshair, inverts on interactive hover)
- An animated film grain overlay (CSS-only, lightweight)
- A GitHub Pages deploy workflow (.github/workflows/deploy.yml) configured for the repo "null-sector"
- A working `pnpm dev` command

CONSTRAINTS:
- Astro 4.x latest. No older versions.
- Tailwind via official Astro integration.
- All design tokens declared in `tailwind.config.ts` AND mirrored in a CSS custom-properties file `src/styles/tokens.css`.
- Single accent color: #7DF9FF, named `accent` in Tailwind.
- Canvas color: #0A0A0F, named `void` in Tailwind.
- No placeholder content. No lorem ipsum. The bible's voice rules apply from this step onward — even comments in code use the project's tone.
- All interactive elements must work with the custom cursor.
- The grain overlay must not interfere with click events (`pointer-events: none`).

DELIVERABLES:
1. Full file tree in a single code block at the top of your response.
2. Each file's complete contents in its own code block, with the file path as the heading.
3. The exact pnpm/git commands to run, in order, at the end.
4. A "verification checklist" — what the user should see when they run `pnpm dev`.
5. The git commit message to use after this step completes.

DO NOT INCLUDE:
- The shard. (Step 03.)
- The hero section. (Step 02.)
- Any project content. (Step 05.)
- Audio. (Step 08.)
- Boot sequence, terminal, konami. (Step 09.)
- Optimisation or deployment. (Step 10.)

Begin.
```

---

## Expected file tree after this step

```
null-sector/
├── .github/
│   └── workflows/
│       └── deploy.yml
├── public/
│   └── fonts/
│       └── (placeholder — fonts loaded via Google Fonts CDN for now)
├── src/
│   ├── components/
│   │   ├── Cursor.astro
│   │   └── GrainOverlay.astro
│   ├── layouts/
│   │   └── BaseLayout.astro
│   ├── pages/
│   │   └── index.astro
│   ├── scripts/
│   │   └── cursor.ts
│   └── styles/
│       ├── global.css
│       └── tokens.css
├── .gitignore
├── astro.config.mjs
├── package.json
├── pnpm-lock.yaml
├── README.md
├── tailwind.config.ts
└── tsconfig.json
```

## Required dependencies (Sonnet/Haiku will install these)

**Production:**

- `astro` ^4
- `@astrojs/react` ^3
- `@astrojs/tailwind` ^5
- `react` ^18
- `react-dom` ^18
- `three` ^0.160
- `@react-three/fiber` ^8
- `@react-three/drei` ^9
- `@react-three/postprocessing` ^2
- `gsap` ^3.12
- `lenis` ^1
- `tailwindcss` ^3

**Dev:**

- `typescript` ^5
- `@types/three` ^0.160
- `@types/react` ^18

## Tailwind tokens (the model must use exactly these)

```ts
// tailwind.config.ts excerpt
extend: {
  colors: {
    void: '#0A0A0F',
    accent: '#7DF9FF',
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
}
```

## GitHub Pages deploy workflow (must be exactly this)

```yaml
# .github/workflows/deploy.yml
name: Deploy to GitHub Pages

on:
  push:
    branches: [main]
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: "pages"
  cancel-in-progress: false

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v3
        with: { version: 9 }
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: pnpm
      - run: pnpm install --frozen-lockfile
      - run: pnpm build
      - uses: actions/upload-pages-artifact@v3
        with: { path: ./dist }

  deploy:
    needs: build
    runs-on: ubuntu-latest
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    steps:
      - id: deployment
        uses: actions/deploy-pages@v4
```

## astro.config.mjs (must include)

```js
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwind from '@astrojs/tailwind';

export default defineConfig({
  site: 'https://YOUR_GITHUB_USERNAME.github.io',
  base: '/null-sector',
  integrations: [
    react(),
    tailwind({ applyBaseStyles: false })
  ],
  vite: {
    ssr: {
      noExternal: ['gsap', 'lenis']
    }
  }
});
```

> The user must replace `YOUR_GITHUB_USERNAME` after the model finishes.

---

## The git workflow (run after every step)

After every step (01 through 10) completes and the verification checklist passes:

```bash
git add .
git commit -m "step-XX: <commit message provided by the model>"
git push origin main
```

**Why this matters for Haiku especially:** if a future step breaks the build, you `git reset --hard HEAD~1` and you're back to the last working state. Without checkpoints, a Haiku drift in step 06 can poison everything before it.

**Initial commit (run once after this step):**

```bash
git init
git add .
git commit -m "step-01: bootstrap — astro, tokens, cursor, grain"
git branch -M main
git remote add origin git@github.com:YOUR_GITHUB_USERNAME/null-sector.git
git push -u origin main
```

After the first push, go to GitHub → repo → Settings → Pages → Source: "GitHub Actions". The deploy will run automatically.

---

## Verification checklist for step 01

The model's output is correct only if **all** of the following are true after `pnpm dev`:

- [ ] `pnpm dev` starts without errors on `localhost:4321`
- [ ] The page is fully `#0A0A0F` (the void color), not black
- [ ] The text "NULL_SECTOR // BOOTSTRAP COMPLETE" appears centered, in JetBrains Mono, in `fg-low` opacity
- [ ] The default OS cursor is hidden; a small ring + crosshair follows the pointer
- [ ] The cursor inverts to cyan when hovering on text or interactive elements
- [ ] A subtle film grain animates across the entire viewport
- [ ] No console errors
- [ ] `pnpm build` produces a `dist/` folder without errors
- [ ] The `.github/workflows/deploy.yml` exists and is syntactically valid

If any item fails, fix that item before moving to step 02. Do not let drift accumulate.

## Commit message after this step

`step-01: bootstrap — astro, tokens, cursor, grain`

---

## Notes for the human (you)

- This step takes ~5 minutes for Sonnet, ~12 minutes for Haiku.
- Token cost: Sonnet ~6k in / 4k out, Haiku ~6k in / 6k out (Haiku tends to over-explain).
- If Haiku produces a `package.json` with wrong versions, manually fix to the versions listed above. This is the single most common Haiku failure mode.
- If you see "Module not found: lenis", run `pnpm add lenis` manually. Lenis renamed packages in 2024 and some models still output old import paths.

Move to `02_BUILD_HERO.md` only after all checklist items pass.
