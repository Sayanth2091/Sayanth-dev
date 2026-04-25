# 02 — BUILD HERO (THE BLOCK)

> The hero is "Cut 0" — before any cuts have happened. Pure void, pure type, the shard not yet introduced. The shard comes in step 03 and will be slotted into the right side of this layout.

---

## What this step builds

A full-viewport hero section that:

- Establishes the editorial restraint of the site
- Introduces the dual-voice system (serif italic + mono caps)
- Has a placeholder `<div>` reserved for the shard (slot it in step 03)
- Animates type entry with a stagger using GSAP
- Includes a fixed minimal nav (six dots, current section highlighted)
- Includes a small mono "scroll indicator" at the bottom

---

## The prompt — paste into Sonnet/Haiku

```
Build the hero section of NULL_SECTOR. This is build step 02 of 10.

Read 00_NARRATIVE_BIBLE.md before responding. Section 1 is "THE BLOCK" — the unread surface. The shard is NOT included in this step; reserve a div with id="shard-mount" on the right half of the layout for step 03.

WHAT TO BUILD:
1. A new component `src/components/Hero.astro` that renders inside `BaseLayout.astro`
2. Update `src/pages/index.astro` to render `<Hero />` and remove the "BOOTSTRAP COMPLETE" placeholder
3. A new component `src/components/SideNav.astro` — a fixed vertical nav on the left edge, six small dots (one per section), current section highlighted in `accent`
4. A new component `src/components/ScrollHint.astro` — a small mono indicator at the bottom-center reading `[ SCROLL TO BEGIN ]`, pulsing slowly
5. A GSAP entry animation in a new file `src/scripts/hero.ts` that:
   - Fades in elements in this order with 60ms stagger: top-left mono label, top-right case file label, scroll hint, then the headline (last)
   - Uses the cinematic ease from tokens
   - Total entry duration: 1800ms

LAYOUT (DESKTOP):
- Two-column grid, 50/50 split
- Left column: type stack
- Right column: empty div with id="shard-mount" (the shard will mount here in step 03)
- Full viewport height (min-h-screen)
- Padding: 48px on all sides
- Top bar: small mono labels at top-left and top-right
- Bottom bar: scroll hint centered

LAYOUT (MOBILE, <768px):
- Single column
- Shard mount sits ABOVE type stack, 60vh tall
- Type stack below, 40vh
- Top bar still visible
- Scroll hint hidden on mobile

EXACT TYPE CONTENT (use these strings exactly — do not paraphrase):

Top-left (mono, fg-low, tracking-mono-default, text-[11px]):
SKYWALKR_2091 //

Top-right (mono, fg-low, tracking-mono-default, text-[11px]):
CH.00 — THE BLOCK

Mono pre-headline (mono, accent, tracking-mono-default, text-[12px], mb-4):
> CHANNEL ESTABLISHED.

Headline (serif, fg-high, leading-[1.05], tracking-[-0.02em]):
Line 1, regular weight, text-[clamp(40px,7vw,96px)]:
He finds the ghosts
Line 2, italic, same size:
in your machines.

Sub-headline (mono, fg-mid, tracking-mono-wide, text-[11px], mt-8):
SOC ANALYST · RESEARCHER · BUILDER

Scroll hint (mono, fg-low, tracking-mono-wide, text-[10px], with pulsing opacity):
[ SCROLL TO BEGIN ▾ ]

NAV DOTS:
Six small circles, 6px diameter, vertical stack with 32px gap.
Inactive: rgba(255,255,255,0.25)
Active: #7DF9FF
Hovered: rgba(255,255,255,0.6)
Each dot has a tooltip on hover showing the section name in mono on the right side: "01 // THE BLOCK", "02 // FIRST CUT", etc.

CONSTRAINTS:
- No images. No icons (except CSS-drawn dots). The page is type-only at this stage.
- Headline uses the serif font from tokens. If Cormorant Garamond fails to load, system serif fallback. Test by temporarily blocking Google Fonts in DevTools.
- The "He" in "He finds the ghosts" — use lowercase 'h' if the design lead later requests, but DEFAULT to capital "He" (the bible's voice rules use third-person formal).
- The italic on "in your machines." is a real italic from the font, not a CSS faux-italic.
- The shard-mount div has `min-height: 60vh` on mobile and full column height on desktop. Empty for now.
- Z-index discipline: cursor on top (z-50), grain (z-40), nav and scroll hint (z-30), hero content (z-10), shard-mount (z-0).

DELIVERABLES:
1. Full file tree of new/changed files
2. Complete file contents for each
3. Any package.json changes (likely none in this step)
4. Verification checklist below
5. Commit message: "step-02: hero — block established, type system live"

DO NOT BUILD:
- The shard (step 03)
- Any section after the hero (steps 04+)
- Audio (step 08)
- Boot sequence (step 09)

Begin.
```

---

## Verification checklist for step 02

Run `pnpm dev`. Load `localhost:4321`. **All** of the following must be true:

- [ ] The hero takes up the full viewport on first load
- [ ] Type elements fade in with a visible stagger (not all at once)
- [ ] The serif headline is in two lines, the second italicized
- [ ] The mono labels are in `JetBrains Mono`, all-caps where specified
- [ ] The right half of the screen is empty (the shard mount)
- [ ] The left vertical nav shows six dots; the first is cyan, others are dim white
- [ ] Hovering a dot shows a small mono tooltip ("01 // THE BLOCK" etc.) to its right
- [ ] The scroll hint at bottom-center pulses slowly
- [ ] On mobile width (resize to 375px), the layout reflows: shard mount on top, type below, scroll hint hidden
- [ ] The custom cursor still works
- [ ] The grain overlay still animates
- [ ] No console errors

If a check fails, fix it before step 03. The shard's positioning depends on this layout being correct.

---

## What it should feel like

Before scrolling, the visitor should feel they have arrived at a *place*, not a webpage. The black, the grain, the cyan accent, the silence (literal silence — no audio yet), and the typography hierarchy should communicate: this is going to take time. Settle in.

The right half being empty is intentional — it creates a question. *Why is half the screen blank?* The visitor leans forward. Then in step 03, the shard appears and answers.

---

## Token cost estimate

Sonnet: ~10k in / 8k out
Haiku: ~10k in / 14k out

## Commit and continue

```bash
git add .
git commit -m "step-02: hero — block established, type system live"
git push
```

Move to `03_BUILD_SHARD.md`.
