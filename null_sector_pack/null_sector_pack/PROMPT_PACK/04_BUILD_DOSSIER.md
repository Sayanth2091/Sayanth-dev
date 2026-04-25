# 04 — BUILD THE DOSSIER (FIRST CUT)

> Section 2 of the site. The first cut happens here. The shard goes from State 0 → State 1 as the user enters this section. The visitor reads the dossier; the shard reveals its top facet in concert. This is also where Lenis smooth scroll is wired up and the first ScrollTrigger fires.

---

## What this step builds

- `src/components/Dossier.astro` — the second full-viewport section
- `src/scripts/scroll.ts` — the central scroll system (Lenis + ScrollTrigger), drives `cutProgress` for the rest of the build
- The portrait image slot (image goes in `MEDIA_PACK` — placeholder ok at this step)
- The horizontal scrubber timeline at the bottom
- The dual-voice (serif human / mono system) treatment, fully realized for the first time

---

## The prompt — paste into Sonnet/Haiku

````
Build the Dossier section of NULL_SECTOR. This is build step 04 of 10.

Read 00_NARRATIVE_BIBLE.md first. This section is "THE FIRST CUT" — the human is revealed. The shard transitions from State 0 to State 1 as the visitor enters this section.

WHAT TO BUILD:

1. `src/components/Dossier.astro` — the section component
2. `src/scripts/scroll.ts` — Lenis + GSAP ScrollTrigger setup, central scroll system
3. `src/scripts/cuts.ts` — fires the cutProgress events as user scrolls past each section. For now, only handles cuts 0 and 1.
4. Update `src/pages/index.astro` to add `<Dossier />` after `<Hero />`
5. Update `src/components/SideNav.astro` to highlight the active section based on scroll position

LAYOUT:

Two-column desktop, 40/60 split (portrait left, text right).
Single column mobile, portrait on top.

LEFT COLUMN — THE PORTRAIT:
- Reserved div with id="dossier-portrait" — for now, a placeholder background-color: #1A1A22 with subtle border-bottom: 0.5px solid var(--accent at 0.2)
- A `<img>` tag with src="/images/portrait.jpg" — the file may not exist yet; that's expected. Add `onerror="this.style.display='none'"` so the placeholder shows.
- Aspect ratio 4:5
- Above the portrait, a single mono caption: `[ SUBJECT_PHOTO_2024.11 ]` — fg-low, text-[10px], tracking-mono-wide, mb-3
- Below the portrait, a redaction-style line: `█████████ // DECLASSIFIED` — fg-low, text-[10px], mt-3
- The whole portrait area has subtle scanlines via a CSS overlay (linear-gradient repeating every 3px, opacity 0.06)

RIGHT COLUMN — THE TEXT:
The dual-voice treatment in alternating blocks.

Block A (mono header, top of column):
```
> SUBJECT FILE OPENED
> CLEARANCE: GRANTED
> READ TIME: ~90 SECONDS
```
fg-mid, text-[12px], mono, leading-[2], mb-12

Block B (serif italic, the human voice):
"He grew up next to a river in Kerala."
text-[clamp(28px,3.2vw,44px)], serif italic, fg-high, leading-[1.2]

Block C (mono system readout):
```
LOCATION:    KL/IN
YEARS_ACTIVE: 02
SPECIALTY:   DETECTION_ENGINEERING
EDUCATION:   M.TECH / VIT BHOPAL
```
mono, text-[12px], fg-mid, with two-column alignment (label left, value right, dotted leader between if possible — use a ::before pseudo-element with content of dots), leading-[2.2], mt-8 mb-12

Block D (serif italic):
"He noticed patterns most people miss."
Same styling as Block B.

Block E (mono):
```
STATUS:      ACTIVE
DEPLOYMENT:  REMOTE
TIMEZONE:    UTC+5:30
LANGUAGES:   EN, ML
```
Same styling as Block C.

Block F (serif italic):
"He builds things that watch other things."
Same styling as Block B.

Block G (mono — the close):
```
> END OF FILE PREVIEW.
> DEEPER ACCESS REQUIRES TRANSMISSION.
```
fg-mid, mono, mt-12

THE SCRUBBER TIMELINE (bottom of section):

A horizontal timeline spanning the full width of the section (below both columns, mt-16).
Four nodes (small cyan circles 8px diameter), evenly spaced, connected by a thin fg-low line.

Labels above each node (mono, text-[10px], fg-low, tracking-mono-wide):
1. "VIT BHOPAL"
2. "VERZEO"
3. "DIGITAL INSIGHTS"
4. "NOW"

Labels below each node (mono, text-[10px], fg-mid):
1. "2019 — 2024"
2. "JAN — MAR 2022"
3. "MAR 2024 — DEC 2025"
4. "ACTIVE"

On hover of each node:
- Node enlarges to 12px
- A small "field report" tooltip appears above, max 200px wide, with a 1-2 sentence detail
- Tooltip background: #1A1A22, border: 0.5px solid accent, padding 12px, mono text-[11px], fg-mid

Field report contents:
1. VIT BHOPAL: "Integrated M.Tech, Cyber Security specialization. Built a VM-IPS and a steganography app."
2. VERZEO: "Two-month internship in Bangalore. First exposure to enterprise security tooling."
3. DIGITAL INSIGHTS: "Two years SOC monitoring for a Dubai MSSP. Remote from Kerala. Watched ten thousand alerts."
4. NOW: "Investigating LLM security, building autonomous triage systems, looking for the next signal."

THE SCROLL SYSTEM (src/scripts/scroll.ts):

```ts
import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const lenis = new Lenis({
  duration: 1.4,
  easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
  smoothWheel: true,
  touchMultiplier: 2,
});

lenis.on('scroll', ScrollTrigger.update);

gsap.ticker.add((time) => {
  lenis.raf(time * 1000);
});

gsap.ticker.lagSmoothing(0);

export { lenis };
```

THE CUTS SYSTEM (src/scripts/cuts.ts):

```ts
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

const cutSections = [
  { id: 'hero', cut: 0 },
  { id: 'dossier', cut: 1 },
  // Step 05 will add 2, step 06 will add 3, etc.
];

cutSections.forEach(({ id, cut }) => {
  ScrollTrigger.create({
    trigger: `#${id}`,
    start: 'top 60%',
    end: 'bottom 40%',
    onEnter: () => dispatchCut(cut),
    onEnterBack: () => dispatchCut(cut),
  });
});

function dispatchCut(value: number) {
  window.dispatchEvent(
    new CustomEvent('null-sector:cut-progress', { detail: { value } })
  );
}
```

The Dossier section element must have id="dossier" so the scroll trigger finds it.
The Hero section element must have id="hero" — update Hero.astro if it doesn't already.

The temporary debug buttons in the shard from step 03 should be REMOVED in this step now that the scroll system drives cuts. Or keep them, but only render in dev mode (`import.meta.env.DEV`).

ENTRY ANIMATION:

When the dossier section enters viewport (ScrollTrigger), animate Block A through G with a 80ms stagger, fade-up from opacity 0 / translateY(20px) to full. Total duration 1200ms. The serif blocks get a slightly slower individual fade (800ms) than the mono blocks (400ms) — this creates a nice rhythm.

CONSTRAINTS:
- The portrait image src points to `/images/portrait.jpg` — the user will drop the generated portrait into `public/images/` per MEDIA_PACK instructions
- All copy is exactly as written above. Do NOT paraphrase. The voice rules are strict.
- The scrubber line connecting the four nodes: 0.5px solid var(--fg-low), positioned absolutely behind the nodes
- Mobile (<768px): the scrubber rotates to vertical, on the left side of the column
- The scanline overlay on the portrait must be a `::after` pseudo-element with `pointer-events: none`

DELIVERABLES:
1. File tree
2. All file contents
3. Verification checklist
4. Commit message: "step-04: dossier — first cut, scroll system live"

DO NOT BUILD:
- Operations section (step 05)
- Audio (step 08)
- Boot sequence (step 09)

Begin.
````

---

## Verification checklist for step 04

- [ ] Scrolling down from the hero is buttery smooth (Lenis is working)
- [ ] At ~50% into the dossier, the shard transitions from State 0 (rough block) to State 1 (top facet cut, glimpse inside)
- [ ] Scrolling back up reverses the cut — shard returns to State 0
- [ ] Portrait area shows the placeholder dark block with scanlines (until image is dropped)
- [ ] All seven text blocks (A-G) fade in with stagger when section enters viewport
- [ ] The dual-voice rhythm is visible — serif italic and mono blocks alternate
- [ ] The scrubber timeline is visible at the bottom with four nodes
- [ ] Hovering each scrubber node shows a tooltip with the field report text
- [ ] The side nav's second dot becomes active when in the dossier
- [ ] On mobile, the layout reflows correctly and the scrubber goes vertical
- [ ] No console errors

---

## Common failure modes

- **Lenis fights with ScrollTrigger.** If smooth scroll feels off or triggers fire at wrong points, ensure the `lenis.on('scroll', ScrollTrigger.update)` line is present and that you registered ScrollTrigger before creating triggers.
- **Cuts don't fire.** Cause: the ScrollTrigger ran before the section was rendered. Fix: import the scroll script via `<script>` tag at end of body, or use Astro's `client:idle` hydration.
- **Mobile vertical scrubber breaks.** Common cause: forgetting to swap `flex-direction` and `width/height` properties. Use a separate mobile component or media query.

## Token cost estimate

Sonnet: ~12k in / 14k out
Haiku: ~12k in / 22k out

## Commit and continue

```bash
git add .
git commit -m "step-04: dossier — first cut, scroll system live"
git push
```

Move to `05_BUILD_OPERATIONS.md`.
