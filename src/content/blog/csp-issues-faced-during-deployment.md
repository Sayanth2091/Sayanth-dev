---
title: "CSP and Runtime Issues Faced During Deployment"
description: "What broke after deploying to Cloudflare Pages, how it was fixed, and a checklist to prevent it."
date: 2025-09-11
tags: ["CSP", "Astro", "Cloudflare Pages", "Debugging"]
category: "Build & Deploy"
---

When the site was first deployed, only the static background rendered and client-side features failed to hydrate. The console showed errors like "Node is not available" and CSP-related blocking of scripts.

This post summarizes the symptoms, root causes, concrete fixes (with commit references from `git log`), and a prevention checklist.

## Symptoms
- Only static parts visible; nav and animations did not hydrate.
- Console errors:
  - "Node is not available" / "Node cannot be found" during navigation/animations.
  - CSP violations due to inline scripts or unexpected bundling.
- Navbar/Footer styles appeared broken in production build.

## Root Causes
- Node APIs or assumptions leaking into client bundles or serverless (Workers) runtime.
- Inline script handling differences in production (CSP-unsafe output).
- One malformed CSS rule that broke the rest of the stylesheet after minification.

## Fixes Applied (from git history)
- CSP-safe script loading and bundling changes:
  - Move helpers to `/public/scripts` and load with `is:raw` in `Base.astro`.
  - Keep Three/animation initializers in `src/scripts` only when bundling is required.
  - Commits: `11869a5`, `cecd51a`.
- Guard/disable cross-document View Transitions that error on Workers runtime:
  - Commits: `faad1d6`, `1268e35`.
- Replace glyph grid with a simpler, more reliable intro overlay:
  - Commit: `ea42182`.
- Fix broken global CSS that cascaded into nav/footer issues:
  - Correct `*::-webkit-scrollbar-thumb` rule (was malformed and broke parsing).
  - Commit: `93a4a0b`.
- Stabilize the intro morph animation:
  - Remove border/blur, ensure overlay z-index over preloader, add blinking cursor, use ASCII-only glyphs.
  - Commits: `df571a9`, `8d8eeaa`, `5beefb6`, `338b321`.

## Prevention Checklist
- Avoid Node-only APIs in anything that ships to the browser:
  - Do not use `fs`, `path`, Node `crypto`, `Buffer`, or `process.env` client-side.
  - Prefer Web APIs: `crypto.subtle`, `crypto.getRandomValues`, `crypto.randomUUID`, `TextEncoder/Decoder`.
  - Use `import.meta.env.PUBLIC_*` for client env vars.
- Keep scripts CSP-friendly:
  - Prefer external scripts from `/public/scripts` and load with `is:raw`.
  - Avoid inline `<script>` code in built HTML when using strict CSP headers.
- Be cautious with advanced navigation/animation features:
  - Cross-document View Transitions can break on SSR/Workers; add guards and an easy off-switch.
- Validate CSS early:
  - A single malformed rule can break the rest of the stylesheet in production minification.
  - Always run `npm run build && npm run preview` and check the console before deploying.
- Reproduce production locally:
  - Use Node 20 (`nvm use 20`), `npm ci`, and test via `preview` not just `dev`.

## Handy Commands
Build and preview locally:

```
nvm use 20 && npm ci && npm run build && npm run preview
```

Rough scan for Node-only usage in client-exposed files (PowerShell):

```
Get-ChildItem -Recurse -File |
  Where-Object { $_.Extension -match '\.(astro|ts|tsx|js|mjs|cjs)$' } |
  Select-String -Pattern 'process\.env','Buffer\b','\bfs\b','\bpath\b','node:crypto','window\.process','global\.process'
```

## Closing Thoughts
Astro on Cloudflare Pages is happiest when client bundles are browser-only and scripts are externalized. Lock Node to v20, validate with `preview`, and keep a small checklist for CSP and Workers quirks. When in doubt, start by removing Node-only imports from anything that hydrates and move dynamic effects behind small, external scripts.

