# NULL_SECTOR — Build Pack

> Everything needed to build the awwwards-tier revamp of your portfolio. Two folders, one workflow, ten build steps. Designed primarily for Claude Sonnet, with Haiku-mode addendum if you want to save money.

---

## What's in this pack

```
null_sector_pack/
├── PROMPT_PACK/           ← website code generation (paste into Sonnet/Haiku)
│   ├── 00_NARRATIVE_BIBLE.md      ← read this first, every session
│   ├── 01_BOOTSTRAP.md            ← step 1: scaffold + git workflow
│   ├── 02_BUILD_HERO.md           ← step 2: hero section
│   ├── 03_BUILD_SHARD.md          ← step 3: 3D centerpiece (heaviest)
│   ├── 04_BUILD_DOSSIER.md        ← step 4: about + scroll system
│   ├── 05_BUILD_OPERATIONS.md     ← step 5: case files (horizontal scroll)
│   ├── 06_BUILD_ARSENAL.md        ← step 6: skills constellation
│   ├── 07_BUILD_TRANSMISSION.md   ← step 7: contact + signoff
│   ├── 08_BUILD_AUDIO_LAYER.md    ← step 8: ambient + UI sounds
│   ├── 09_BUILD_IMMERSIVE_LAYERS.md ← step 9: boot, terminal, konami
│   ├── 10_POLISH_AND_DEPLOY.md    ← step 10: a11y, perf, ship
│   ├── HAIKU_MODE.md              ← prepend to any step if using Haiku
│   └── COPY_BANK.md               ← every line of text on the site, locked
└── MEDIA_PACK/            ← asset generation (do this BEFORE the prompt pack)
    ├── README.md          ← workflow, paths, recommended order
    ├── PORTRAIT.md        ← Midjourney/Flux prompts for the dossier portrait
    ├── CASE_VISUALS.md    ← 6 hero visuals, one per operation
    ├── AUDIO.md           ← 6 audio files (ambient + UI sounds)
    ├── TEXTURES.md        ← optional grain/scanline overlays
    ├── VIDEO_LOOPS.md     ← optional video for case detail pages
    └── OG_IMAGE.md        ← link preview image for social sharing
```

---

## The recommended workflow

```
┌───────────────────────────────────────────────────────────────┐
│ PHASE 1 — Read and prepare (30 min)                           │
│   1. Read PROMPT_PACK/00_NARRATIVE_BIBLE.md cover to cover   │
│   2. Read MEDIA_PACK/README.md                                │
│   3. Decide: Sonnet or Haiku for the build                    │
│      (Sonnet recommended — better quality per dollar)         │
│   4. Set up empty Astro folder, GitHub repo, dev environment  │
└───────────────────────────────────────────────────────────────┘
                             ↓
┌───────────────────────────────────────────────────────────────┐
│ PHASE 2 — Generate assets (2-4 hours)                         │
│   1. PORTRAIT.md → public/images/portrait.jpg                 │
│   2. CASE_VISUALS.md → public/images/cases/*.png              │
│   3. AUDIO.md → public/audio/*                                │
│   4. OG_IMAGE.md → public/og.png                              │
│   5. (Optional) TEXTURES.md and VIDEO_LOOPS.md               │
└───────────────────────────────────────────────────────────────┘
                             ↓
┌───────────────────────────────────────────────────────────────┐
│ PHASE 3 — Build the site (5-10 hours)                         │
│   For each build step 01 → 10:                                │
│     a. Open new Sonnet/Haiku session                          │
│     b. Paste 00_NARRATIVE_BIBLE.md                            │
│     c. (If Haiku) paste HAIKU_MODE.md                         │
│     d. Paste the step's build prompt                          │
│     e. Apply the model's output to your project               │
│     f. Run pnpm dev, verify the checklist                     │
│     g. git commit with the suggested message                  │
│     h. Move to next step                                      │
└───────────────────────────────────────────────────────────────┘
                             ↓
┌───────────────────────────────────────────────────────────────┐
│ PHASE 4 — Ship and submit (1 hour)                            │
│   1. Replace placeholders (Formspree endpoint, GitHub user)   │
│   2. Push to main, GitHub Actions deploys to Pages            │
│   3. Verify live URL                                          │
│   4. Submit to awwwards.com/submit                            │
│   5. Cross-post to HN, r/web_design, Twitter, LinkedIn        │
└───────────────────────────────────────────────────────────────┘
```

---

## Quick decisions to make before starting

### Sonnet vs Haiku

I recommend **Sonnet**. Reasoning:

| | Sonnet | Haiku |
|---|---|---|
| Cost per token | ~10× higher | baseline |
| Tokens needed for this build | ~1× | ~3-5× (retries + verbosity) |
| Net cost | similar | similar |
| Your time | 1× (works first try) | 4× (retries, fixes, debugging) |
| Output quality | high, awwwards-tier | acceptable with hand-holding |
| Total dollars | ~$3-4 | ~$2-3 |

Time matters more than dollars here. Pick Sonnet.

### Portrait: real photo or AI generated

Use a **real photo of yourself** processed in Photopea per PORTRAIT.md. AI portraits always have a tell. Your real face, processed cinematically, has none.

### Hosting

GitHub Pages, baked into the bootstrap. Free, fast, serves everything we need.

### Audio: source or generate

Mix. Use Freesound.org for the UI sounds (they're tiny and free). Generate the ambient drone with Suno (you have it). Total time: ~1 hour for all six files.

---

## Token cost summary (across all 10 build steps)

| Step | Sonnet in/out | Haiku in/out |
|------|---------------|--------------|
| 01 Bootstrap | 6k / 4k | 6k / 6k |
| 02 Hero | 10k / 8k | 10k / 14k |
| 03 Shard | 14k / 18k | 14k / 28k |
| 04 Dossier | 12k / 14k | 12k / 22k |
| 05 Operations | 16k / 14k | 16k / 24k |
| 06 Arsenal | 10k / 12k | 10k / 18k |
| 07 Transmission | 12k / 12k | 12k / 18k |
| 08 Audio | 10k / 8k | 10k / 14k |
| 09 Immersive | 14k / 14k | 14k / 22k |
| 10 Polish | 12k / 10k | 12k / 18k |
| **TOTAL** | **~116k / ~114k** | **~116k / ~184k** |

At Anthropic's API rates (April 2026):
- Sonnet: ~$3.50 USD total
- Haiku: ~$2.20 USD total

Both are within Pro plan usage limits if running through claude.ai instead of API.

---

## Important placeholders to replace

After the build is done, search and replace these strings in your project:

| Placeholder | Replace with |
|-------------|--------------|
| `YOUR_GITHUB_USERNAME` | `Sayanth2091` |
| `REPLACE_ME` (Formspree) | Your real Formspree endpoint |
| Default site URL | `https://Sayanth2091.github.io` |

---

## What to do if a build step fails

1. **Don't panic.** Git checkpoints from step 01 mean you can always roll back.
2. **Check the verification checklist** for that step. Identify which item failed.
3. **Read the "Common failure modes" section** in the relevant step file — most issues are listed there.
4. **Re-run the prompt** with a more constrained scope (e.g. "rebuild only the Constellation.tsx file").
5. If still stuck, **switch to Sonnet** for that one step and try again.
6. If that fails, **roll back via git** and skip the optional features (e.g. drop the konami code if it's the blocker).

The site is good without any one feature. Don't let perfect be the enemy of shipped.

---

## Final pre-flight check

Before starting Phase 1, confirm you have:

- [ ] Node 20+ installed
- [ ] pnpm installed
- [ ] An empty GitHub repo named `null-sector` under your account
- [ ] Either Claude Pro/Max plan OR API access with budget
- [ ] Either Midjourney/Flux subscription OR fal.ai/Replicate trial credits
- [ ] Suno AI access OR Freesound.org account (free)
- [ ] Photopea bookmarked (no install required, browser-based)
- [ ] DaVinci Resolve installed (only if doing video loops)
- [ ] Formspree.io account (free)
- [ ] 8-12 hours of focus time across 2-3 days

If all checked, you're ready. Start at PROMPT_PACK/00_NARRATIVE_BIBLE.md.

Good hunting.
