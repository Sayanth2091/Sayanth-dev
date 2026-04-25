# 00 — NARRATIVE BIBLE

> Read this first. Reference it in every build session. This is the source of truth for voice, story, and visual metaphor. Code that contradicts the bible is wrong, even if it works.

---

## 1. The Concept

**Project codename:** NULL_SECTOR
**Public name:** Sayanth Sreekanth — Portfolio (`skywalkr_2091`)
**Genre:** Cinematic, single-page, scroll-driven experience.
**Reference benchmarks:** awwwards SOTD winners. Bruno Simon territory in 3D ambition, Studio Lumio territory in editorial restraint.

## 2. The Story Spine — "The Excavation"

The visitor arrives at a black void containing a single object: a **rough, opaque block of obsidian**. It is unreadable. It is pre-information.

As the visitor scrolls, the block begins to **cut itself**. Each section of the site corresponds to one cut — one facet revealed, one layer of Sayanth made legible.

By the final section, the block has become a **fully cut, fully transparent gem**. The visitor has not been told who Sayanth is. They have *watched him be revealed*, one cut at a time.

**The metaphor:** Sayanth's work — SOC analysis, threat hunting, detection engineering — is the work of *removing what doesn't belong* until the truth of a system is visible. The site performs that act on its own subject.

The visitor leaves understanding two things without being told either:

1. Sayanth finds what is hidden in systems.
2. Sayanth is himself a system worth investigating.

## 3. The Six Cuts (Section Map)

Each section = one cut. Each cut = one revelation. The shard's geometry advances visibly across the scroll.

| # | Section | The Cut | Shard State | What the visitor learns |
|---|---------|---------|-------------|-------------------------|
| 1 | THE BLOCK | None yet — the unread surface | Rough obsidian block, opaque | A ghost is here. |
| 2 | THE FIRST CUT | The Dossier | Top facet sliced, light enters | Who the ghost is. |
| 3 | THE SECOND CUT | Operations | Side facets cut, internal structure hints | What the ghost has done. |
| 4 | THE THIRD CUT | The Arsenal | Internal lattice exposed | How the ghost works. |
| 5 | THE FOURTH CUT | The Transmission | Refraction begins, code visible inside | The ghost can be reached. |
| 6 | THE FINAL CUT | Signoff | Fully cut gem, transparent, slowly rotating | The visitor has seen everything. |

## 4. The Voice — "Cold and Distant"

The site does not sell. It does not enthuse. It does not use exclamation marks, emoji, or marketing verbs.

The voice is the voice of the **system itself** — describing its operator from the outside, with detached precision. It speaks in present tense. It uses short sentences. It treats the visitor as an analyst reading a file, not a customer being courted.

**Core voice rules:**

- No "I". The site refers to Sayanth in the third person, or simply by classification (`SUBJECT`, `OPERATOR`, `S.S.`).
- No marketing language. Banned words: *passionate, dedicated, results-driven, dynamic, innovative, leverage, expertise, proven, cutting-edge, robust, seamless, empower, unlock, transform.*
- Short. Most lines are under 10 words.
- Specific over abstract. "Two years monitoring SIEM at a Dubai MSSP" beats "experienced SOC professional."
- No filler. If a line could be removed without loss, remove it.
- Serif lines = the human truth, half-poetic. Mono lines = the system readout, all-caps, technical.

**Voice contrast pattern (use throughout):**

> *Serif italic:* "He grew up next to a river."
> *Mono mono:* `LOCATION: KL/IN. YEARS_ACTIVE: 02. STATUS: ACTIVE.`

The serif voice is what the system *suspects* about the subject. The mono voice is what the system has *confirmed*. This contrast is the site's signature literary device. Use it constantly.

## 5. The Naming Convention — Dramatic Cinematic

Projects are not "projects." They are **operations**. Each gets a codename in all-caps, a case file number, and a one-line classification.

**Pattern:**

```
CASE_FILE_07 // OPERATION: SENTINEL
classification: autonomous triage
status: deployed
```

Real-name mapping (for the site's six featured operations):

| Real name | Codename | Classification |
|-----------|----------|----------------|
| N8N NOC Analyst | OPERATION: SENTINEL | autonomous triage |
| OpenClaw | OPERATION: NORTHWALL | sovereign intelligence |
| LLM Security Firewall | OPERATION: GATEKEEPER | adversarial containment |
| Healthcare SOC L2 / Wazuh project | OPERATION: ASCLEPIUS | clinical defense |
| StegImage | OPERATION: VESSEL | covert channel |
| VM-IPS | OPERATION: ANTIBODY | autonomous response |

The "moonlighting" tab (frontend / Flutter side projects) is labeled `// UNCLASSIFIED ACTIVITY`.

## 6. The Three-Word Brand Test

Every design decision must pass: does it feel **mysterious, classic, futuristic**?

- *Mysterious:* the visitor leaves with more questions than answers. Reward curiosity, do not satisfy it fully.
- *Classic:* serif type, generous whitespace, deliberate pacing. Nothing is rushed. Reference: cinema title cards, museum wall labels, intelligence dossiers from the 1970s.
- *Futuristic:* mono readouts, real-time motion, 3D centerpiece, ambient drone. Reference: *Blade Runner 2049*, *Severance*, *Mr. Robot* (specifically the elcate-style UI moments).

If a design choice hits two but breaks one, redesign. The triangle is non-negotiable.

## 7. The Visual Spine

- **Canvas:** `#0A0A0F` — deeper than black, with a slight blue undertone. Never pure black.
- **Foreground / type:** `rgba(255,255,255,0.92)` for body, `rgba(255,255,255,0.6)` for mono mid-emphasis, `rgba(255,255,255,0.35)` for mono low-emphasis.
- **Single accent:** `#7DF9FF` (signal cyan). Used sparingly — for the shard's edges, for active state, for the cursor, for transmissions. Never as a fill on a button. Never as a section background.
- **Type system:**
  - **Serif display:** PP Editorial New (preferred) or Migra (free fallback) or "Cormorant Garamond" (Google Fonts ultimate fallback). Used only for hero headlines and the italic "human truth" voice lines.
  - **Sans:** Inter Tight, weights 300 and 500. Used for body text where readability matters.
  - **Mono:** JetBrains Mono, weight 400. Used for all system readouts, case file numbers, navigation, technical metadata.
- **Motion language:**
  - Default ease: `cubic-bezier(0.65, 0, 0.35, 1)` — confident, not bouncy.
  - Default duration: 800ms for section transitions, 200ms for hover, 1200ms for shard cuts.
  - Stagger: 60ms between sequential elements (lines of text, list items).
- **Texture:** subtle film grain overlay across the entire site. 4% opacity. Animated noise via shader, not a static GIF.

## 8. The Sound Design

**Ambient drone:** a low-frequency hum (~70Hz) layered with very faint, slow modulation. Loops invisibly. Volume: -28 LUFS, barely perceptible.

**UI sounds (all subtle, all functional):**

- `tick.wav` — soft mechanical tick on hover of any interactive element. Length: 40ms.
- `transmit.wav` — analog modem chirp, 200ms, plays on form submit and on terminal command execute.
- `cut.wav` — a single low-pitched crystal *chk* sound. Plays once when each shard cut completes (so 5 times across the scroll). Length: 600ms.
- `decrypt.wav` — soft static-to-clarity whoosh. Plays on initial boot sequence and on hidden-route reveals. Length: 1200ms.
- `terminal_keystroke.wav` — single keypress sound for the terminal easter egg. Length: 30ms. Pitch-randomize ±5% on each play to avoid mechanical repetition.

**Audio rules:**

- All audio is **muted by default**. A small `[ AUDIO: OFF ]` mono toggle sits in the top-right of the boot sequence. Once enabled, persists in localStorage.
- Respect `prefers-reduced-motion` — if the user has reduced motion enabled, audio also defaults off and the toggle is hidden.
- Audio degrades silently. If a file fails to load, the site still works.

## 9. The Three Immersive Layers

**Layer 1 — The Boot Sequence** (first visit only, ~2.4 seconds)

On first load, the visitor sees a black screen. Mono text types itself out:

```
> ESTABLISHING SECURE CHANNEL...
> AUTHENTICATING REQUEST...
> CLEARANCE GRANTED.
> WELCOME TO NULL_SECTOR.
```

Then a `decrypt.wav` plays, the screen fades, and the hero appears. Stored in `sessionStorage` so it doesn't replay on every navigation.

**Layer 2 — The Custom Cursor**

Replace the default cursor with a small ring + crosshair, drawn in CSS. On hover over interactive elements, the ring expands and inverts to the accent color. On hover over the shard, the cursor displays a faint readout: `[ FACET 03 / 20 ]` showing which face is under the pointer.

**Layer 3 — The Hidden Routes**

Three hidden interactions:

1. **Konami code** anywhere on the site (`↑ ↑ ↓ ↓ ← → ← → B A`) — unlocks `/classified`, a single-page narrative reveal about Sayanth's homestay (the "human" easter egg). Triggered by `decrypt.wav` and a route transition.
2. **The Terminal** — typing `/` anywhere on the site opens a small floating terminal. Real, working. Commands: `help`, `whoami`, `projects`, `contact`, `clear`, `exit`, `about`, `easter`. The `easter` command launches a 30-second "spot the malicious process" mini-challenge based on the SENTINEL portfolio concept.
3. **The Source** — a faint mono link in the footer reading `// view source` opens the GitHub repo for the site itself. Highest credibility move — show your work.

## 10. The Visitor's Emotional Journey

This is the most important section. Every design decision must serve this arc.

| Time | Emotion | Trigger |
|------|---------|---------|
| 0s | Disorientation | Black screen, unfamiliar mono text, no clear navigation |
| 3s | Curiosity | The shard appears. It is beautiful and unfamiliar. They want to see it move. |
| 8s | Engagement | They drag the shard. It responds with weight and momentum. |
| 15s | Recognition | They scroll. The shard begins to cut. They realize the site is *responding to them*. |
| 30s | Investment | They are reading. The voice is unlike anything else. They are not on a portfolio anymore — they are inside something. |
| 60s | Awe | A case file expands. The shard fragments. They lose track of time. |
| 90s | Connection | They see the portrait. They see the human inside the system. The shard is now transparent. |
| 120s | Compulsion | They want to send a message. Not to apply for a role — to *talk to the person*. |
| Exit | Memory | They will not remember the projects. They will remember the *feeling*. They will share the link. |

The site has succeeded if a visitor pastes the URL into Slack with the message *"you have to see this."*

## 11. What This Site Is Not

To prevent drift during the build, here is what the site is explicitly **not**:

- It is **not a resume** in HTML. There is no skills bar. No percentage rating. No "soft skills" section.
- It is **not a marketing site**. There are no testimonials, no logos-of-companies-I've-worked-with, no calls-to-action begging for a hire.
- It is **not minimalist**. Minimalism is restraint with white space. This is *maximalism with restraint* — every element is loaded with intention.
- It is **not playful**. Playfulness lives only in hidden routes. The surface is serious, controlled, slightly menacing.
- It is **not for everyone**. It is for people who recognize the genre. If a recruiter doesn't get it, that's the filter working.

---

End of bible. Every build file references this. If a build instruction conflicts with the bible, the bible wins.
