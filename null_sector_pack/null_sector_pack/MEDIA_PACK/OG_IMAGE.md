# OG_IMAGE.md

> The single most important asset for distribution. When the link is pasted in Slack, Twitter, LinkedIn, or anywhere else, this is the image people see. If it's bad, no one clicks. If it's great, the link spreads.

**Final path:** `public/og.png`
**Aspect ratio:** 1.91:1 (1200×630)
**Format:** PNG
**File size:** under 300KB

---

## What it must communicate

In the half-second a person sees the link preview in Slack, the image must communicate three things:

1. **This is a portfolio.** (Or at least: this is something a person made.)
2. **It is unusual.** (Curiosity bait.)
3. **It is high-craft.** (Production value signals seriousness.)

The image should NOT be a screenshot of the homepage. The homepage screenshot at 1200×630 looks busy and cluttered. The OG image is a poster — its own composition, designed for this aspect ratio.

---

## The composition

A 1200×630 black canvas with:

- A faceted geometric shape (the shard, in 2D) on the right side, rendered in cyan wireframe with a faint inner light
- The text "NULL_SECTOR" in serif italic on the left, large
- Below it, mono text: "SAYANTH SREEKANTH // PORTFOLIO"
- A small mono caption in the bottom-left: `[ CHANNEL ESTABLISHED. ]`
- Subtle film grain over the entire image

---

## Generation method 1 — Manually compose in Figma/Photopea (recommended)

You'll have the most control this way and it costs no AI generation.

### Step-by-step in Photopea

1. New file: 1200×630, background #0A0A0F
2. Use the Pen tool to draw a faceted shard shape on the right third — about 400px wide, made of 6-8 polygon faces
3. Stroke the polygon edges with a 1.5px cyan (#7DF9FF) line, no fill
4. Add a soft cyan glow behind the shard (Layer Effects → Outer Glow, cyan, 30px spread, 30% opacity)
5. Add text on the left:
   - "NULL_SECTOR" in serif italic (Cormorant Garamond), 96pt, fg-high white (rgba(255,255,255,0.92))
   - Below it: "SAYANTH SREEKANTH // PORTFOLIO" in JetBrains Mono, 16pt, fg-mid (rgba(255,255,255,0.6)), tracking 0.15em
6. Bottom-left small mono: `[ CHANNEL ESTABLISHED. ]`, 12pt, accent cyan, tracking 0.2em
7. Top-right small mono: `// CASE_FILE_OPEN`, 12pt, fg-low, tracking 0.15em
8. Add Filter → Noise → Add Noise, Monochromatic, 3% strength to the entire canvas
9. Export as PNG, 1200×630, optimized

This takes about 30 minutes the first time. The result is exactly on-brand and beats any AI generation.

---

## Generation method 2 — Midjourney / Flux

If you'd rather generate. Less consistent, but faster.

### Prompt

```
A cinematic 1200x630 graphic poster for a portfolio website called NULL_SECTOR. Pure black #0A0A0F background. On the right side, a faceted crystalline gem floating in the void, rendered in cyan wireframe lines (#7DF9FF) with a faint inner glow. On the left side, large serif italic typography reading "NULL_SECTOR" in white. Below it, smaller mono uppercase text reading "SAYANTH SREEKANTH // PORTFOLIO". Subtle film grain across the whole image. Cinematic, restrained, awwwards-tier graphic design. Reference: poster design for Severance, Blade Runner 2049 typography. --ar 1.91:1 --style raw --v 6
```

### Notes

- Midjourney does not always render text correctly. Expect to add the text yourself in Photopea after generating the visual base.
- Use --ar 1.91:1 to get the OG aspect.
- After generating, ALWAYS resize to exactly 1200×630 in Photopea or any image tool.

---

## Generation method 3 — Render from your own site

The simplest, perhaps best approach:

1. Open your site at `localhost:4321/null-sector/` in a browser
2. Wait for the boot sequence to finish, the shard to settle in State 1
3. Use a screenshot tool to capture the hero section at 1200×630 (use Chrome DevTools device toolbar, set dimensions, screenshot)
4. Open the screenshot in Photopea
5. Crop to exact 1200×630
6. Add a slight darkening overlay to ensure text remains readable on social previews
7. Optionally add a "// CHANNEL ESTABLISHED" overlay in the top-right
8. Export PNG

This is genuinely high-quality because it shows what visitors will see, not a representation of it. The risk: at 1200×630, the homepage looks cluttered. Crop carefully.

---

## Verification checklist

After generation:

- [ ] File exists at `public/og.png`
- [ ] Exactly 1200×630
- [ ] Under 300KB
- [ ] "NULL_SECTOR" text is readable
- [ ] Cyan accent visible
- [ ] No marketing language, no "click here," no badges
- [ ] Looks intentional even at thumbnail size

## Test the OG before launch

After deploying:

1. Paste your URL into Slack — verify the preview is correct
2. Paste into Twitter / X compose box — same
3. Paste into LinkedIn — same
4. Use the Open Graph debugger: https://www.opengraph.xyz/url/https%3A%2F%2FYOUR_URL — paste your URL, verify the image renders

If LinkedIn shows a stale or wrong image, request a re-scrape via:
- LinkedIn: https://www.linkedin.com/post-inspector/

If Twitter/X shows wrong image:
- Just wait 5 minutes — they cache aggressively and sometimes need time

If Slack shows wrong image:
- Try in an Incognito Slack workspace, or wait for cache (24h)

The OG image is what makes the site spread. Get it right before sharing.
