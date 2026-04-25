# 05 — BUILD THE OPERATIONS (SECOND CUT)

> Section 3 — the heaviest content section. Six case files in a horizontal-scroll archive. The shard advances to State 2 here. This step also wires up Astro Content Collections so you can drop new case files as MDX without touching code.

---

## What this step builds

- Astro Content Collection: `src/content/operations/` with schema, six MDX case file stubs
- `src/components/Operations.astro` — the section with horizontal scroll
- `src/components/CaseCard.tsx` — a React component for each case panel
- `src/pages/case/[slug].astro` — dynamic route for full case detail pages
- Cut 2 wiring (when this section enters, shard goes to State 2)

---

## The prompt — paste into Sonnet/Haiku

````
Build the Operations section of NULL_SECTOR. This is build step 05 of 10.

Read 00_NARRATIVE_BIBLE.md first, especially the project naming table in section 5.

WHAT TO BUILD:

1. CONTENT COLLECTION
   - `src/content/config.ts` — defines the "operations" collection with schema
   - `src/content/operations/sentinel.mdx` — case file 01
   - `src/content/operations/northwall.mdx` — case file 02
   - `src/content/operations/gatekeeper.mdx` — case file 03
   - `src/content/operations/asclepius.mdx` — case file 04
   - `src/content/operations/vessel.mdx` — case file 05
   - `src/content/operations/antibody.mdx` — case file 06

2. The Operations section component
3. CaseCard.tsx (React, for the horizontal scroll panels)
4. Dynamic detail page route
5. Cut 2 trigger added to cuts.ts

CONTENT COLLECTION SCHEMA (`src/content/config.ts`):

```ts
import { defineCollection, z } from 'astro:content';

const operations = defineCollection({
  type: 'content',
  schema: z.object({
    caseNumber: z.string(),           // "07"
    codename: z.string(),              // "SENTINEL"
    classification: z.string(),        // "autonomous triage"
    status: z.enum(['DEPLOYED', 'IN_DEVELOPMENT', 'CONCEPT', 'ARCHIVED']),
    realName: z.string(),              // "N8N NOC Analyst"
    stack: z.array(z.string()),
    role: z.string(),                  // "designer · engineer · operator"
    outcome: z.string(),               // 1-2 sentence outcome
    period: z.string(),                // "2025"
    heroVisual: z.string(),            // "/images/cases/sentinel-hero.png"
    order: z.number(),                 // for sort order
    featured: z.boolean().default(true),
  }),
});

export const collections = { operations };
```

CASE FILE CONTENT — write each MDX file with the EXACT frontmatter below. The MDX body for each is the long-form case writeup; for now use the structure provided as a template.

`sentinel.mdx`:
```mdx
---
caseNumber: "07"
codename: "SENTINEL"
classification: "autonomous triage"
status: "DEPLOYED"
realName: "N8N NOC Analyst"
stack: ["n8n", "Ollama", "Docker", "Python", "Webhooks"]
role: "designer · engineer · operator"
outcome: "Reduced first-tier alert noise by ~70%. Operator now reads structured summaries, not raw events."
period: "2025"
heroVisual: "/images/cases/sentinel-hero.png"
order: 1
featured: true
---

## the problem

A SOC sees ten thousand alerts a day. Most are noise. The analyst's first hour is spent grouping events that share a root cause — work a graph could do.

## the approach

A pipeline of small composable steps. Events flow into n8n. A local LLM correlates them by host, by tactic, by time window. Output is a single structured summary per cluster, dropped into the analyst's queue.

No agents. No autonomy beyond grouping. Humans still make every decision that matters.

## what was built

A working n8n workflow with twelve nodes. An Ollama instance running on a 6GB VRAM box. A correlation prompt evaluated against three months of historical alerts. Latency under three seconds per cluster.

## what was learned

The model's correlation accuracy plateaus at ~85%. The remaining 15% is where the human matters most.
```

`northwall.mdx`:
```mdx
---
caseNumber: "06"
codename: "NORTHWALL"
classification: "sovereign intelligence"
status: "IN_DEVELOPMENT"
realName: "OpenClaw"
stack: ["Ollama", "Whisper", "Piper TTS", "FastAPI", "SQLite"]
role: "founder · architect · engineer"
outcome: "An offline AI assistant that speaks Malayalam, runs without the cloud, and forgets when asked."
period: "2025 — present"
heroVisual: "/images/cases/northwall-hero.png"
order: 2
featured: true
---

## the problem

Big Tech AI assumes you have bandwidth, English, and trust. Most of the world has none of those.

## the approach

A small assistant that runs locally, speaks the languages of South India, and ships as a hardware-plus-subscription product instead of a cloud service.

## what was built

A FastAPI server, a tuned llama3.2:3b model, voice in and out via Whisper and Piper, persistent memory in SQLite. Currently running on a VirtualBox stack; next step is a dedicated Mini PC SKU.

## what was learned

The defensible moat is not the model. It's hyperlocal human curation of training data. Big Tech can't do this. We can.
```

`gatekeeper.mdx`:
```mdx
---
caseNumber: "05"
codename: "GATEKEEPER"
classification: "adversarial containment"
status: "IN_DEVELOPMENT"
realName: "LLM Security Firewall"
stack: ["Python", "OWASP LLM Top 10", "FastAPI", "Redis"]
role: "researcher · engineer"
outcome: "A bouncer for AI. Catches prompt injection, jailbreaks, data exfiltration before they reach your model."
period: "2025"
heroVisual: "/images/cases/gatekeeper-hero.png"
order: 3
featured: true
---

## the problem

LLMs are deployed everywhere with no inspection layer between them and the user. Every input is a potential exploit; every output is a potential leak.

## the approach

A reverse proxy that sits in front of the model. Inspects inbound prompts against the OWASP LLM Top 10. Inspects outbound completions for sensitive patterns. Logs everything. Blocks the obvious; flags the suspicious for review.

## what was built

[in progress]

## what was learned

[in progress]
```

`asclepius.mdx`:
```mdx
---
caseNumber: "04"
codename: "ASCLEPIUS"
classification: "clinical defense"
status: "IN_DEVELOPMENT"
realName: "Healthcare SOC L2 / Wazuh"
stack: ["Wazuh", "DVWA", "Docker", "HIPAA Framework"]
role: "GRC analyst · detection engineer · pentester"
outcome: "A three-phase exercise: GRC mapping, SIEM detection engineering, then offensive validation. One project, three lenses."
period: "2025"
heroVisual: "/images/cases/asclepius-hero.png"
order: 4
featured: true
---

## the problem

Cybersecurity hiring assumes you've worked in healthcare, or finance, or critical infrastructure. Most candidates haven't. Documentation is a poor substitute for experience.

## the approach

Build the experience. A reskinned DVWA as a hospital management system. Map the threats to HIPAA. Deploy Wazuh and tune detections. Then attack what was just defended.

## what was built

[in progress]

## what was learned

[in progress]
```

`vessel.mdx`:
```mdx
---
caseNumber: "03"
codename: "VESSEL"
classification: "covert channel"
status: "ARCHIVED"
realName: "StegImage"
stack: ["Node.js", "Python", "Express", "React"]
role: "engineer"
outcome: "A web app that hides messages inside images and audio. Built to learn the boundary between data and noise."
period: "2023"
heroVisual: "/images/cases/vessel-hero.png"
order: 5
featured: true
---

## the problem

Steganography is the oldest crypto technique, and the most overlooked. Most people don't know how trivial it is to hide an entire document inside a vacation photo.

## the approach

A web frontend, a Python backend, LSB substitution for images and phase encoding for audio. Demonstrate the concept; let the user feel it.

## what was built

A working app. Upload a carrier, upload a payload, download a stego file. Reverse the process to extract.

## what was learned

The interesting research is in detection, not creation. Hiding is easy; finding is hard. That's where the next case file lives.
```

`antibody.mdx`:
```mdx
---
caseNumber: "02"
codename: "ANTIBODY"
classification: "autonomous response"
status: "ARCHIVED"
realName: "VM-Specific Intrusion Prevention System"
stack: ["Python", "nmap", "iptables", "Flask", "React"]
role: "engineer"
outcome: "An immune system for a VM network. Detects scans and floods, blocks the source, logs the encounter."
period: "2023 — 2024"
heroVisual: "/images/cases/antibody-hero.png"
order: 6
featured: true
---

## the problem

Most IPS solutions are network-wide. The VM-level perspective is overlooked, and that's where lateral movement actually happens.

## the approach

A lightweight agent inside each VM. Watches for scan signatures and ping floods. Pushes blocks via iptables. Reports up to a Flask dashboard.

## what was built

A working prototype. Detected and blocked common attack patterns in a controlled lab. Dashboard visualized the network state.

## what was learned

Detection is binary; response is gradient. The hardest design decision was when NOT to block.
```

THE OPERATIONS SECTION COMPONENT:

```astro
---
// src/components/Operations.astro
import { getCollection } from 'astro:content';
import CaseCard from './CaseCard.tsx';

const operations = await getCollection('operations');
const sorted = operations.sort((a, b) => a.data.order - b.data.order);
---

<section id="operations" class="relative min-h-screen">
  <div class="sticky top-0 h-screen overflow-hidden">
    <div id="ops-track" class="flex h-full will-change-transform">
      <div class="flex-shrink-0 w-screen flex items-center px-12">
        <div class="font-mono text-fg-low text-[11px] tracking-mono-wide">
          <div>// SECTION 03</div>
          <div class="font-serif italic text-fg-high text-[clamp(40px,6vw,80px)] not-italic mt-4 leading-[1.05]">
            Six operations.<br/>
            <span class="italic">Six lessons.</span>
          </div>
          <div class="text-fg-mid mt-6 max-w-[420px] leading-[2]">
            > SCROLL HORIZONTALLY TO ENTER THE ARCHIVE.
          </div>
        </div>
      </div>

      {sorted.map((op) => (
        <div class="flex-shrink-0 w-screen flex items-center justify-center px-12">
          <CaseCard client:visible op={op.data} slug={op.slug} />
        </div>
      ))}
    </div>
  </div>
</section>
```

THE CASECARD COMPONENT:

```tsx
// src/components/CaseCard.tsx
import { useState } from 'react';

interface Props {
  op: {
    caseNumber: string;
    codename: string;
    classification: string;
    status: string;
    realName: string;
    stack: string[];
    role: string;
    outcome: string;
    period: string;
    heroVisual: string;
  };
  slug: string;
}

export default function CaseCard({ op, slug }: Props) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      className="w-full max-w-[920px] grid grid-cols-2 gap-12"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div className="relative aspect-[4/5] bg-[#1A1A22] border border-fg-low/20 overflow-hidden">
        <img
          src={op.heroVisual}
          alt=""
          className="w-full h-full object-cover opacity-80 transition-opacity duration-700"
          style={{ opacity: hovered ? 1 : 0.7 }}
          onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
        />
        <div className="absolute inset-0 pointer-events-none"
             style={{ background: 'linear-gradient(transparent 50%, rgba(10,10,15,0.8))' }} />
        <div className="absolute bottom-3 left-3 font-mono text-[10px] text-accent tracking-mono-wide">
          [ HERO_VISUAL ]
        </div>
      </div>

      <div className="flex flex-col justify-center">
        <div className="font-mono text-[10px] text-fg-low tracking-mono-wide mb-2">
          CASE_FILE_{op.caseNumber} //
        </div>
        <h3 className="font-serif text-fg-high text-[clamp(36px,4vw,56px)] leading-[1.05] mb-1">
          OPERATION:
        </h3>
        <h3 className="font-serif italic text-accent text-[clamp(36px,4vw,56px)] leading-[1.05] mb-6">
          {op.codename}
        </h3>

        <div className="font-mono text-[11px] text-fg-mid tracking-mono-default leading-[2]">
          <div>CLASSIFICATION: {op.classification}</div>
          <div>STATUS:         {op.status}</div>
          <div>PERIOD:         {op.period}</div>
          <div>STACK:          {op.stack.join(' · ')}</div>
        </div>

        <p className="font-sans text-fg-mid text-[14px] leading-[1.7] mt-6 max-w-[400px]">
          {op.outcome}
        </p>

        <a
          href={`/null-sector/case/${slug}`}
          className="inline-block mt-8 font-mono text-[11px] text-accent tracking-mono-wide border border-accent/40 px-4 py-2 hover:bg-accent/10 transition-colors duration-200"
        >
          OPEN CASE FILE →
        </a>
      </div>
    </div>
  );
}
```

THE HORIZONTAL SCROLL CHOREOGRAPHY:

In `src/scripts/operations-scroll.ts`:

```ts
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

const track = document.getElementById('ops-track') as HTMLElement;
const section = document.getElementById('operations') as HTMLElement;

if (track && section) {
  const totalWidth = track.scrollWidth;
  const viewport = window.innerWidth;
  const distance = totalWidth - viewport;

  gsap.to(track, {
    x: -distance,
    ease: 'none',
    scrollTrigger: {
      trigger: section,
      start: 'top top',
      end: () => `+=${distance}`,
      scrub: 1,
      pin: true,
      anticipatePin: 1,
      invalidateOnRefresh: true,
    },
  });
}
```

CUT 2 TRIGGER:

In `src/scripts/cuts.ts`, add to the cutSections array:
```ts
{ id: 'operations', cut: 2 },
```

DYNAMIC CASE DETAIL PAGE (`src/pages/case/[slug].astro`):

```astro
---
import { getCollection } from 'astro:content';
import BaseLayout from '../../layouts/BaseLayout.astro';

export async function getStaticPaths() {
  const operations = await getCollection('operations');
  return operations.map((op) => ({
    params: { slug: op.slug },
    props: { op },
  }));
}

const { op } = Astro.props;
const { Content } = await op.render();
---

<BaseLayout title={`OPERATION: ${op.data.codename}`}>
  <article class="max-w-[720px] mx-auto px-6 py-32 prose-dossier">
    <a href="/null-sector/" class="font-mono text-[11px] text-fg-low hover:text-accent">← BACK TO ARCHIVE</a>

    <div class="font-mono text-[10px] text-fg-low tracking-mono-wide mt-12 mb-2">
      CASE_FILE_{op.data.caseNumber} //
    </div>
    <h1 class="font-serif text-fg-high text-[clamp(48px,6vw,80px)] leading-[1.05] mb-2">
      OPERATION:<br/>
      <span class="italic text-accent">{op.data.codename}</span>
    </h1>

    <div class="font-mono text-[11px] text-fg-mid tracking-mono-default leading-[2] mt-8 mb-12 border-t border-b border-fg-low/20 py-6">
      <div>REAL NAME:      {op.data.realName}</div>
      <div>CLASSIFICATION: {op.data.classification}</div>
      <div>STATUS:         {op.data.status}</div>
      <div>PERIOD:         {op.data.period}</div>
      <div>ROLE:           {op.data.role}</div>
      <div>STACK:          {op.data.stack.join(' · ')}</div>
    </div>

    <div class="font-sans text-fg-high text-[16px] leading-[1.7]">
      <Content />
    </div>
  </article>
</BaseLayout>
```

Add a global CSS rule for the prose styling — h2 in mono uppercase, paragraphs in fg-high, etc. This goes in `src/styles/global.css`:

```css
.prose-dossier h2 {
  font-family: var(--font-mono);
  font-size: 14px;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  color: var(--accent);
  margin-top: 3rem;
  margin-bottom: 1rem;
}
.prose-dossier p {
  margin-bottom: 1.25rem;
  color: var(--fg-high);
}
```

MOBILE BEHAVIOR:

Below 768px, the horizontal scroll is too painful. Replace with vertical stack — disable the GSAP horizontal scroll, set track to `flex-direction: column`, each card takes full viewport height. Use a media query in JS to enable/disable the scroll trigger.

DELIVERABLES:
1. File tree
2. All file contents
3. Verification checklist
4. Commit message: "step-05: operations — six cases, horizontal archive, second cut"

DO NOT BUILD:
- Arsenal section (step 06)
- Audio cues (step 08)

Begin.
````

---

## Verification checklist

- [ ] Six MDX files exist in `src/content/operations/`
- [ ] Scrolling into Operations pins the section and switches to horizontal scroll
- [ ] All six case cards visible by horizontal scroll
- [ ] Hovering a card brightens its hero visual placeholder
- [ ] Clicking "OPEN CASE FILE" navigates to `/null-sector/case/sentinel` (etc.)
- [ ] The detail page renders the MDX content with proper styling
- [ ] Shard transitions to State 2 when entering Operations
- [ ] Mobile: horizontal scroll disabled, cards stack vertically
- [ ] Side nav third dot becomes active in Operations
- [ ] No console errors

## Token cost estimate

Sonnet: ~16k in / 14k out (lots of content)
Haiku: ~16k in / 24k out

## Commit and continue

```bash
git add .
git commit -m "step-05: operations — six cases, horizontal archive, second cut"
git push
```

Move to `06_BUILD_ARSENAL.md`.
