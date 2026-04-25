# 10 — POLISH AND DEPLOY

> Final pass. After this, the site is live on GitHub Pages and ready for awwwards submission.

---

## What this step covers

- Accessibility audit
- Performance pass
- SEO + Open Graph
- Final asset wiring (you've generated images via MEDIA_PACK by now)
- GitHub Pages deployment
- Submission checklist for awwwards

---

## The prompt — paste into Sonnet/Haiku

````
Final polish pass on NULL_SECTOR. Build step 10 of 10.

Read 00_NARRATIVE_BIBLE.md once more.

PART A — ACCESSIBILITY AUDIT

Apply the following changes:

1. Every interactive element has aria-label or descriptive text
2. The boot sequence is skippable: pressing Esc or any key jumps to end
3. All non-essential animations respect `prefers-reduced-motion: reduce`:
   - Shard renders State 5 immediately, no rotation, no cursor parallax
   - Constellation is static
   - Boot sequence skipped
   - Lenis smooth scroll falls back to native scroll
   - Audio toggle hidden
4. All images have alt text — even the portrait (`alt="surveillance photo, classified"`)
5. Color contrast: verify fg-mid (60% white) on void background passes WCAG AA for body text. Increase opacity if not.
6. Focus states on all form fields, buttons, links — visible accent ring
7. The terminal input is keyboard-only friendly (no mouse needed once open)
8. Skip link at top of page: `<a href="#main">Skip to content</a>`, visible only on focus

PART B — PERFORMANCE PASS

1. Verify the shard's inner data scene doesn't render every frame — it should render only when cutProgress changes, or at most every 4th frame
2. Lazy-load the constellation Canvas: only mount when section is within 200px of viewport
3. Preload critical fonts in `<head>`: just the Cormorant Italic and Inter Tight 500 weights
4. Audio files are only fetched after toggle ON
5. Images: ensure all are WebP or AVIF with reasonable dimensions
6. Run `pnpm build` and check the dist/ folder — total JS should be under 300KB gzipped

If any chunk exceeds 200KB gzipped, identify the culprit (probably Three.js + drei) and lazy-import non-critical drei helpers.

PART C — SEO + OPEN GRAPH

Update `src/layouts/BaseLayout.astro` head:

```astro
---
interface Props {
  title?: string;
  description?: string;
}
const {
  title = 'SAYANTH SREEKANTH // NULL_SECTOR',
  description = 'SOC analyst, security researcher, interface builder. Six operations. Six lessons.',
} = Astro.props;
const og = `${Astro.site}null-sector/og.png`;
---
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>{title}</title>
  <meta name="description" content={description} />

  <meta property="og:type" content="website" />
  <meta property="og:title" content={title} />
  <meta property="og:description" content={description} />
  <meta property="og:image" content={og} />
  <meta property="og:image:width" content="1200" />
  <meta property="og:image:height" content="630" />

  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content={title} />
  <meta name="twitter:description" content={description} />
  <meta name="twitter:image" content={og} />

  <link rel="icon" type="image/svg+xml" href="/null-sector/favicon.svg" />
</head>
```

Add a static `og.png` and `favicon.svg` to `public/`. The favicon is a simple cyan square with a small cyan triangle cut out (mimics the shard). The og.png should be generated via MEDIA_PACK.

PART D — FINAL ASSET WIRING

Confirm these files exist in `public/`:
- `public/images/portrait.jpg` — generated via MEDIA_PACK PORTRAIT.md
- `public/images/cases/sentinel-hero.png` and 5 others — generated via MEDIA_PACK CASE_VISUALS.md
- `public/audio/ambient.mp3`, `tick.wav`, `transmit.wav`, `cut.wav`, `decrypt.wav`, `keystroke.wav` — sourced via MEDIA_PACK AUDIO.md
- `public/og.png` — generated via MEDIA_PACK
- `public/favicon.svg` — minimal, generate inline

If any are missing, the site still works — failed images hide via onError, missing audio silently no-ops.

PART E — README

Create `README.md` at project root:

```markdown
# NULL_SECTOR

A scroll-driven cinematic portfolio. The site cuts itself open as the visitor descends.

Built with Astro 4, React Three Fiber, GSAP, Lenis. Deployed on GitHub Pages.

## development
pnpm install
pnpm dev

## build
pnpm build
pnpm preview

## deploy
Push to main. The .github/workflows/deploy.yml handles the rest.

## structure
- src/components/ — section components
- src/content/operations/ — case files (MDX). Add new ones here.
- src/scripts/ — scroll, audio, cursor, konami systems
- public/audio/ — sound design assets (see MEDIA_PACK)
- public/images/ — portrait, case visuals, og (see MEDIA_PACK)

## adding a new case file
Drop a new MDX in src/content/operations/ matching the schema in src/content/config.ts. It auto-routes.
```

PART F — DEPLOY

```bash
# verify build works
pnpm build

# commit
git add .
git commit -m "step-10: polish — a11y, perf, seo, ready"
git push
```

GitHub Pages will pick up the workflow and deploy. Verify at:
`https://YOUR_GITHUB_USERNAME.github.io/null-sector/`

In repo Settings → Pages: confirm Source is "GitHub Actions" and Custom domain is empty (unless you have one).

DELIVERABLES:
1. List of all changes
2. Final verification checklist
3. Awwwards submission checklist (next section)

Begin.
````

---

## Final verification checklist

After all 10 steps, the live site should pass:

- [ ] `pnpm dev` clean, no warnings
- [ ] `pnpm build` clean, no warnings, dist size under 5MB total
- [ ] Live URL works on GitHub Pages
- [ ] Boot sequence on first visit
- [ ] All six sections scroll smoothly
- [ ] Shard transitions through five states across the scroll
- [ ] Audio toggle works, ambient + UI sounds engage on enable
- [ ] Form submits to Formspree and shows success state
- [ ] Konami code unlocks /classified
- [ ] Terminal opens on `/` keystroke and all commands work
- [ ] Mobile (375px width): all sections render correctly, horizontal scroll disabled
- [ ] Lighthouse scores: Performance >85, Accessibility >95, SEO >95
- [ ] Reduced motion: site works without animation
- [ ] No console errors in any browser tested (Chrome, Safari, Firefox)
- [ ] OG image renders correctly when URL pasted in Slack / Twitter / LinkedIn
- [ ] All MDX case files render at /case/<slug>
- [ ] Site source link in footer goes to public GitHub repo

---

## Awwwards submission checklist

When ready to submit:

1. **Site of the Day requires:** original concept, custom 3D, attention to detail, audio (✓ all present)
2. Take 4 high-quality screenshots: hero with shard, dossier section, operations horizontal scroll, signoff
3. Record a 30-60s screen capture: scroll from top to bottom, showcasing the shard cuts
4. Submit via awwwards.com/submit:
   - Site name: `NULL_SECTOR`
   - Tags: portfolio, dark, three.js, gsap, cinematic, typography
   - Authors: Sayanth Sreekanth — design + development (note: leave Anthropic/Claude credit out of awwwards but mention in your case study)
5. Cross-post to:
   - r/web_design subreddit
   - Hacker News (Show HN: NULL_SECTOR — a portfolio that cuts itself open)
   - Twitter / X with the screen capture
   - LinkedIn — one-line caption: "I revamped my portfolio. Six cuts, one ghost."

---

## Token cost estimate for step 10

Sonnet: ~12k in / 10k out
Haiku: ~12k in / 18k out

---

## Total token budget across all 10 steps

- **Sonnet:** ~120k in / ~120k out — call it ~$3-4 USD total in API cost (well within Pro/Max plan limits)
- **Haiku:** ~120k in / ~200k out — call it ~$2-3 USD total in API cost

Sonnet is the better choice on quality-per-token. Haiku saves money but adds your time fixing drift.

---

## Final commit

```bash
git add .
git commit -m "step-10: polish — a11y, perf, seo, ready"
git tag v1.0.0
git push --tags
```

You're done. The site is live. Go submit it.
