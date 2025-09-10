---
title: "How I Vibe‑Coded My Personal Website in 5 Minutes"
description: "A quick build log: stack choices, 3D touches, animations, and the exact prompts used."
date: 2025-03-01
tags: [build-log, astro, threejs, automation, security, ai]
category: "self-learning"
---

![Hero](/images/image.png)

I wanted something fast, sci‑fi, and fun — with 3D flare, smooth transitions, and clean content management. This post recaps how I assembled the site quickly using Astro, Three.js, and a sprinkle of tasteful animations.

## TL;DR

- Framework: Astro (static, fast, content collections)
- 3D: Three.js starfield + holographic shapes
- Theme: neon cyan/purple, hologrid, scanlines
- Content: Markdown collections for Blog and Projects
- Extras: reveal‑on‑scroll, hover tilts, link prefetch

## What I Built

- Landing page with a Three.js starfield and a neon hero.
- Split sections for AI, Cyber Security, and n8n Automations — each with a tiny 3D HoloShape accent.
- Projects and Blog pages powered by content collections, with per‑post routes.
- A minimalist Nav + Footer, sci‑fi styled cards, and shimmering headline.

![Sections](/images/Service-section.png)

## Why Astro

- Speed: outputs static HTML by default — ideal for a portfolio with content.
- Content collections: first‑class Markdown with Zod schemas.
- Interop: easy to add small islands of Three.js without owning a whole client framework.

## 3D Touches

- Starfield: `Points` cloud rotated subtly using a `Clock`, fog for depth, alpha renderer over the hero.
- HoloShape: transmission material + wireframe cage, small and reusable, animated with a simple clock.

## Animations & Transitions

- Reveal on scroll via `IntersectionObserver`, with reduced‑motion safeguards.
- Hover tilt on cards using CSS transforms driven by pointer position.
- Section title underlines and neon border glows for micro‑feedback.
- Link prefetch on hover for snappier navigation.

## Content Model

- Blog schema: `title`, `description?`, `date`, `tags[]`.
- Projects schema: `title`, `summary`, `date`, `stack[]`, `link?`, `repo?`, `featured`.

## Notable Files

- `src/pages/index.astro`: hero, featured projects, AI/Security/Automations sections.
- `src/components/StarfieldCanvas.astro`: starfield background.
- `src/components/HoloShape.astro`: holographic 3D shape component.
- `src/styles/global.css`: theme variables, hologrid/scanlines, animations.
- `src/content/blog/*`: markdown posts.

![Blog](/images/blog.png)

## Prompts I Used (verbatim)

These are the core prompts that drove the build:

> Make me a portfolio personal website I am Sayanth Sreekanth ie Skywalkr_2091 I work as Cyber Security SOC Analyst, AI (n8n automation) full stack next js SveleteKIT etc. Use one very powerful framework like sveltekit, Astro or anything which can run super fast. It should be my personal portfolio. Able to make blogs showcase my projects and all. use threejs or any 3d setup to make the animations superb. Use a scifi theme. Make it very interesting. Use portfolio websites from www.awwwards.com as reference if needed or insipration. Let me know what you make



## What I’d Add Next

- Project detail pages with small interactive diagrams or shader transitions.
- Command palette (Ctrl/Cmd+K) to jump between sections, posts, and projects.
- OG image generation for posts, plus RSS and sitemap.

## Run It

```bash
npm install
npm run dev
```

Open the local URL, then check Home, Projects, and Blog. Replace the SVG placeholders in `public/images` with real screenshots when ready.

