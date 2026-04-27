# Future.md — Path to Awwwards SOTD

Live URL reviewed: `https://main.sayanth-dev.pages.dev/`
Reference standard: Site of the Day on awwwards (target: design 8.5+, usability 8+, creativity 9+, content 8+).

This is not a bug list. This is the gap between *good portfolio* and *a thing people screenshot and share.*

---

## 1. First Impression — the 3-second test

Awwwards judges the first 3 seconds harder than the next 3 minutes. Right now those seconds work but don't *trap*.

- **Boot sequence too fast to read.** 2.4s is below the recognition threshold for most viewers. Push to 3.5–4s and add one more line: `> SCANNING VISITOR FINGERPRINT...` followed by a fake hash. Visitors should feel observed before they see the shard.
- **Add a per-visitor detail.** During boot, briefly flash their actual locale: `> ORIGIN: BANGALORE / IN. ROUTE: SECURE.` (use `Intl.DateTimeFormat().resolvedOptions().timeZone` — no IP lookup needed). The bible says "treat the visitor as an analyst reading a file" — invert it, treat them as the file.
- **Favicon and tab title.** Tab title should animate when the page is backgrounded: `[ SIGNAL LOST ]` → `[ NULL_SECTOR ]` cycle. Tiny detail, awwwards judges notice.
- **OG card.** Generate a proper 1200×630 OG image with the shard rendered to a still + the codename. Right now `og.png` is a placeholder. This is the image people see when the link is shared — it carries 50% of the "you have to see this" virality.

## 2. The Shard — the centerpiece is doing too little

The bible promises *"They drag the shard. It responds with weight and momentum."* Right now it rotates on hover/scroll but doesn't *feel* like an object.

- **Add inertia and momentum.** Use a velocity-based rotation that decays over ~1.5s after release. This single change is what separates "3D model" from "object you can hold."
- **Cursor facet readout.** The bible explicitly specifies `[ FACET 03 / 20 ]` displaying near the cursor on hover. Implement this — raycast against the geometry, map face index to a facet number.
- **Audio-reactive shard.** When `cut.wav` plays at each section transition, the shard should pulse subtly (scale 1.0 → 1.04 → 1.0 over 600ms). Audio-visual sync is a creativity-score multiplier.
- **Click-to-shatter easter egg.** Triple-click the shard → it fragments into all six facets, suspends in space for 2s, reassembles. Costs nothing in normal flow, rewards the curious.

## 3. Sound — the bible specifies five files, audit which actually fire

Per the bible: `tick`, `transmit`, `cut`, `decrypt`, `terminal_keystroke`. Verify each plays at the right moment. Common gaps:

- **`tick.wav` on every interactive hover** — buttons, nav links, case cards. Not just shard.
- **`decrypt.wav` on `/classified` and `/case/[slug]` route entry**, not only boot.
- **`terminal_keystroke.wav` pitch jitter** — the bible specifies ±5%. Verify this is implemented; without it the terminal sounds robotic.
- **Volume calibration.** The drone is supposed to be `-28 LUFS, barely perceptible`. Most builds ship too loud — A/B test this in a quiet room.

## 4. The Terminal — half-feature is worse than no feature

If the terminal works but commands are shallow, judges deduct creativity points. Each command should reward.

- **`whoami`** — should print a multi-line dossier with cursor delays between lines (not instant dump).
- **`projects`** — should render an interactive list, arrow keys to navigate, enter to open the case file.
- **`easter`** — the bible promises a 30-second "spot the malicious process" mini-challenge. If this isn't implemented, prioritize it. This single feature is what gets the site posted to /r/cybersecurity and HackerNews.
- **`sudo` joke command** — `permission denied. nice try.` Adds personality without being cute.
- **Tab autocomplete** for command names. Five lines of code, huge polish gain.
- **Command history with up/down arrows.** Standard terminal expectation.

## 5. Page Transitions — the seams are visible

Going from `/` → `/case/sentinel` → back is currently a hard cut. SOTD sites flow.

- Use Astro's **View Transitions** (`<ViewTransitions />` in BaseLayout). The shard should persist across navigation, scaling/repositioning rather than disappearing.
- On `/case/[slug]` entry: a brief "OPENING CASE FILE..." overlay with `decrypt.wav`, then the page resolves. ~600ms.

## 6. Operations — the horizontal scroll needs more reward

Right now horizontal scroll moves cards. That's table stakes. Add:

- **Per-case ambient sound.** Each operation gets a unique 2-second drone signature that fades in when its panel is centered. Subliminal but memorable.
- **Per-case color shift.** Each operation has a tertiary accent (still in the bible's palette) that briefly tints the canvas grain when centered. SENTINEL = signal cyan, NORTHWALL = pale amber, GATEKEEPER = blood red, etc.
- **"REDACTED" sections inside each case file.** Some sentences should render as filled black bars that reveal on hover. Plays with the intelligence-dossier metaphor and rewards re-reading.

## 7. The Transmission — is the form real?

The bible specifies `transmit.wav` plays on form submit. But is the form *functional*?

- Wire it to Formspree, Resend, or a Cloudflare Worker. A broken contact form on a security portfolio is an unacceptable signal.
- After submit: a typewriter response from "the system": `> TRANSMISSION RECEIVED. SUBJECT WILL RESPOND WITHIN 48 HOURS.` Then the form fades and is replaced with a faint timestamp.

## 8. Mobile — the awwwards mobile score is half the total

Most cinematic portfolios collapse on mobile. Don't be most.

- The horizontal scroll for Operations should become a vertical stack with each card snapping to viewport (`scroll-snap-type: y mandatory`).
- The shard should keep working on mobile. Reduce poly count, disable postprocessing, but keep the rotation. A black square on mobile is a fail.
- Boot sequence shorter on mobile (2s) — small screens read faster.
- `prefers-reduced-motion` audit: every animation should have a static fallback. Test by enabling reduced motion in OS settings.

## 9. Performance — hard ceiling for SOTD

Awwwards SOTD typically requires **Lighthouse 85+ on performance**. Without this, the design score is capped.

- **Lazy-load the shard.** Don't ship `three`, `@react-three/fiber`, `@react-three/drei`, `@react-three/postprocessing` in the main bundle. Dynamic import after the boot sequence.
- **Self-host fonts.** Google Fonts CDN adds 200ms+ of network. Download woff2 and serve from `/public/fonts/`.
- **Compress audio.** Drone loop should be ~30 seconds at 96kbps mono → under 400KB. Verify all five SFX are sub-50KB each.
- **Preload the profile image.** It's above the fold in section 02 — `<link rel="preload" as="image">`.
- **Run `pnpm build` and check the bundle.** Anything above 600KB initial JS is a flag.

## 10. SEO + share polish

- Custom domain. `sayanth.dev` or `nullsector.app` reads infinitely better than `*.pages.dev` on a portfolio submission. Cloudflare Pages → Custom Domains is two clicks.
- `robots.txt` and `sitemap.xml`. Astro has a sitemap integration — add it.
- JSON-LD structured data for `Person` schema (name, role, sameAs links to GitHub/LinkedIn). Free SEO win.
- Pre-render OG images per case file. When someone shares `/case/sentinel`, the OG card should reflect *that operation*, not the homepage. Use Astro's `og:image` per page.

## 11. The Awwwards Submission Itself

The submission page is its own design exercise.

- **Submission video.** Awwwards highly favors a 30-60s screen capture showing the scroll experience. Record at 60fps, no cursor visible (use a recording tool with cursor hide). Background it with the same drone.
- **Submission copy.** Three sentences, all from the bible voice. Don't break character for the meta description.
- **Submit at 9am UTC on a Tuesday.** Voting cycle data shows weekday EU-morning submissions get more eyes.
- **Credit your tools.** Astro, Three.js, GSAP, Lenis — credit them on the submission page. Awwwards judges are tool-aware.

## 12. The Long Tail (post-SOTD polish)

These don't move the SOTD needle but make the site outlive the submission cycle.

- A **changelog** at `/changelog` — terse mono entries with timestamps. `[2026.04.27] Added FACET 03 readout to cursor.` Treats the site as a living system.
- A **dead-drop** at `/dropbox` — a fake intel inbox where visitors can leave anonymous notes. Stored in Cloudflare KV. Nothing functional, just atmosphere.
- A **404 page** in character. `> ROUTE NOT FOUND. THE SUBJECT HAS NO RECORD OF THIS PATH. RETURNING TO TRANSMISSION.` Auto-redirect after 3s.
- **Reduced motion fallback** that's still cinematic — fade transitions instead of physics, but the voice and structure remain.

---

## Priority Stack

If you only do five things, do these in order:

1. **OG image + custom domain** — these are the share-virality multipliers
2. **Implement the `easter` terminal mini-challenge** — the standout creativity feature
3. **Cursor facet readout** — bible specifies it, judges will look for it
4. **Mobile horizontal scroll → vertical snap** — half the score
5. **Lighthouse pass — lazy-load three.js bundle** — performance ceiling

The bible already wrote the site. The above is just making sure the build matches the document.
