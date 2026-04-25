# MEDIA_PACK — README

> Generate these assets BEFORE running Haiku/Sonnet on the PROMPT_PACK. The build prompts assume these files exist at specific paths. Missing files won't break the site (everything fails gracefully), but the awwwards-tier visual quality depends on real assets here.

---

## The workflow

```
1. Read this README.
2. Generate each asset using the prompts in this folder.
3. Drop them into the correct paths in your project's `public/` folder.
4. THEN run the PROMPT_PACK build steps.
```

If you skip the media generation, the site will still work — placeholder dark blocks will show where images would be, and audio will silently no-op. But the visual impact drops by 60%.

---

## Where each asset goes

After generation, drop files into these paths in your null-sector project:

```
public/
├── images/
│   ├── portrait.jpg                     ← see PORTRAIT.md
│   ├── cases/
│   │   ├── sentinel-hero.png            ← see CASE_VISUALS.md (1 of 6)
│   │   ├── northwall-hero.png           ← see CASE_VISUALS.md (2 of 6)
│   │   ├── gatekeeper-hero.png          ← see CASE_VISUALS.md (3 of 6)
│   │   ├── asclepius-hero.png           ← see CASE_VISUALS.md (4 of 6)
│   │   ├── vessel-hero.png              ← see CASE_VISUALS.md (5 of 6)
│   │   └── antibody-hero.png            ← see CASE_VISUALS.md (6 of 6)
│   └── textures/
│       ├── grain.png                    ← see TEXTURES.md (optional)
│       └── scanlines.png                ← see TEXTURES.md (optional)
├── audio/
│   ├── ambient.mp3                      ← see AUDIO.md
│   ├── tick.wav                         ← see AUDIO.md
│   ├── transmit.wav                     ← see AUDIO.md
│   ├── cut.wav                          ← see AUDIO.md
│   ├── decrypt.wav                      ← see AUDIO.md
│   └── keystroke.wav                    ← see AUDIO.md
├── video/
│   └── (optional — see VIDEO_LOOPS.md)
├── og.png                               ← see OG_IMAGE.md
└── favicon.svg                          ← inline in step 10, no generation needed
```

**Important for GitHub Pages:** the project deploys at `/null-sector/`, so all asset paths in the code reference `/null-sector/images/...`. Files still go in the project's `public/` folder — Astro adds the base path automatically.

---

## Generation tools you already have or can use

You've worked with these tools before — pick what's available:

| Asset type | Best tool | Fallback |
|------------|-----------|----------|
| Portrait | Midjourney v6 / Flux 1.1 Pro | Free Flux on fal.ai or Replicate trial |
| Case visuals | Midjourney v6 / Flux | Stable Diffusion XL local |
| OG image | Midjourney 16:9 mode | Manual composite in Figma |
| Textures | Photopea (free) + manual noise | Existing texture from textures.com |
| Ambient audio | Suno AI (you've used this) | Freesound.org free CC0 loops |
| UI sounds | Freesound.org free CC0 | ElevenLabs SFX generator |
| Video loops (optional) | Wan2GP via Pinokio (your existing pipeline) | Skip — video is optional |

---

## Recommended order of generation

Generate in this order — earliest assets are most visible, latest are nice-to-haves:

1. **Portrait** (PORTRAIT.md) — single highest-impact asset. Dossier section. Do this first.
2. **6 case visuals** (CASE_VISUALS.md) — operations section. Big visual impact.
3. **6 audio files** (AUDIO.md) — turn the site from a webpage into an experience.
4. **OG image** (OG_IMAGE.md) — the link preview. Do this before sharing.
5. **Textures** (TEXTURES.md) — only if grain looks weak with the CSS-only fallback.
6. **Video loops** (VIDEO_LOOPS.md) — entirely optional, only if you want extra polish on case detail pages.

**Estimated time:** 2-4 hours for all assets if you have Midjourney + Suno, longer if free tools only.

---

## A note on style consistency

The site has a strict visual identity (read PROMPT_PACK/00_NARRATIVE_BIBLE.md). All generated images must match:

- **Palette:** void black (#0A0A0F), white at varying opacity, single cyan accent (#7DF9FF). No other colors. Especially no warm tones, no saturated reds/greens/yellows.
- **Mood:** cinematic, surveillance-aesthetic, slightly menacing. Reference: *Blade Runner 2049*, *Severance*, *Mr. Robot*.
- **Composition:** centered, restrained, lots of negative space.
- **Texture:** film grain, slight noise, never clean.

Each prompt file includes the style anchor as a suffix to keep generations consistent. Use it.

---

## If a generation looks wrong

Symptoms and fixes:

- **Too colorful:** strengthen the "monochrome, desaturated" instruction. Add `--no color, vibrant, saturated`.
- **Too clean / digital:** add "film grain, 35mm photograph, slight motion blur."
- **Wrong subject identity (portrait):** specify "South Indian man, mid-twenties" more explicitly. Avoid "young" alone (often produces children).
- **Generic stock-photo feel:** add reference cinematographers — "shot by Roger Deakins" or "shot like Severance."
- **Stiff / catalog pose (portrait):** add "candid, surveillance camera capture, slight grain."

---

Now move to PORTRAIT.md and start generating.
