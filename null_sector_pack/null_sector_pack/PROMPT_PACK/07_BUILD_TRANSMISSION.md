# 07 — BUILD THE TRANSMISSION (FOURTH AND FINAL CUTS)

> Sections 5 and 6. The transmission (contact) form, then the signoff (footer). Fourth cut happens entering Transmission. Final cut happens entering Signoff. After this step, the entire scroll narrative is complete — the shard goes from rough block to fully transparent gem across the full page.

---

## What this step builds

- `src/components/Transmission.astro` — the contact section with the encrypted-message aesthetic
- `src/components/Signoff.astro` — the footer/closing section
- `src/components/ContactForm.tsx` — React form using Formspree (or netlify forms — but since we're on GitHub Pages, Formspree is the right pick)
- Cuts 4 and 5 wired into the scroll system

---

## The prompt — paste into Sonnet/Haiku

````
Build the Transmission and Signoff sections of NULL_SECTOR. Build step 07 of 10.

Read 00_NARRATIVE_BIBLE.md first. The transmission is "THE FOURTH CUT" — the ghost can be reached. The signoff is "THE FINAL CUT" — the visitor has seen everything.

WHAT TO BUILD:

1. `src/components/Transmission.astro` — the section
2. `src/components/ContactForm.tsx` — React form, posts to Formspree
3. `src/components/Signoff.astro` — the footer/closing
4. Cuts 4 and 5 wired
5. Add both to `src/pages/index.astro`

THE TRANSMISSION SECTION:

Layout: full viewport, two columns 50/50.
Left: text content
Right: the contact form

LEFT COLUMN:

Top mono:
> SECTION 05 // THE TRANSMISSION

Headline (serif):
"The channel is open."
Italic line below:
"Use it carefully."

Below that, mono block describing the protocol:
```
> RESPONSE TIME: ~24 HOURS
> TIMEZONE: UTC+5:30
> PREFERRED USE: COLLABORATION, OPPORTUNITY, CURIOSITY.
> NOT FOR: COLD SALES, RECRUITER SPRAYS, "QUICK SYNCS".
```

Below that, smaller mono with three direct channels:
```
EMAIL.....    sayanthsreekanth5@gmail.com
LINKEDIN..    /in/sayanth-sreekanth-289950188
GITHUB....    /Sayanth2091
```
Each is a clickable link with hover state to accent.

RIGHT COLUMN — THE FORM:

A "TRANSMISSION INTERFACE" styled to look like an encrypted message composer.

Top of form (mono):
```
[ TRANSMISSION INTERFACE ]
> ENCRYPTING IN TRANSIT.
```

Three fields:

1. IDENTIFY YOURSELF (full name) — text input
2. RETURN CHANNEL (email) — email input
3. PAYLOAD (message) — textarea, 6 rows

Each field has:
- A mono label above (text-[10px], fg-low, tracking-mono-wide)
- A simple line input (border-bottom only, no box)
- Border bottom: 0.5px solid fg-low, transitions to accent on focus
- Background: transparent
- Color: fg-high
- Font: JetBrains Mono, text-[14px]
- No placeholder text — the labels above are sufficient

Submit button:
```
> TRANSMIT [⏎]
```
mono, accent color, border 0.5px solid accent, padding 12px 24px, hover: bg accent at 0.1 opacity.

ON SUBMIT:

The button text changes through these states with 600ms each:
1. "> ENCRYPTING..."
2. "> ESTABLISHING ROUTE..."
3. "> TRANSMITTING..."
4. "> TRANSMITTED. ✓" (in accent green for 2 seconds, then form resets)

Use Formspree as the backend. The user will configure their endpoint. For now, hardcode a placeholder:
`https://formspree.io/f/REPLACE_ME`

If submit fails, show in red:
"> TRANSMISSION FAILED. RETRY OR USE DIRECT CHANNEL."

THE FORM COMPONENT (`src/components/ContactForm.tsx`):

```tsx
import { useState } from 'react';

const FORMSPREE_ENDPOINT = 'https://formspree.io/f/REPLACE_ME';

const STATES = [
  { key: 'idle',         label: '> TRANSMIT [⏎]',                   color: 'accent' },
  { key: 'encrypting',   label: '> ENCRYPTING...',                  color: 'accent' },
  { key: 'routing',      label: '> ESTABLISHING ROUTE...',          color: 'accent' },
  { key: 'transmitting', label: '> TRANSMITTING...',                color: 'accent' },
  { key: 'success',      label: '> TRANSMITTED. ✓',                 color: 'accent' },
  { key: 'error',        label: '> TRANSMISSION FAILED. RETRY.',    color: 'red' },
] as const;

type StateKey = typeof STATES[number]['key'];

export default function ContactForm() {
  const [state, setState] = useState<StateKey>('idle');
  const [form, setForm] = useState({ name: '', email: '', message: '' });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (state !== 'idle' && state !== 'error') return;

    setState('encrypting');
    await new Promise((r) => setTimeout(r, 600));
    setState('routing');
    await new Promise((r) => setTimeout(r, 600));
    setState('transmitting');

    try {
      const res = await fetch(FORMSPREE_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error();
      setState('success');
      setForm({ name: '', email: '', message: '' });
      setTimeout(() => setState('idle'), 3000);
    } catch {
      setState('error');
    }
  }

  const current = STATES.find((s) => s.key === state)!;
  const colorClass = current.color === 'red' ? 'text-red-400 border-red-400' : 'text-accent border-accent';

  return (
    <form onSubmit={handleSubmit} className="font-mono">
      <div className="text-[11px] text-fg-low tracking-mono-wide mb-1">[ TRANSMISSION INTERFACE ]</div>
      <div className="text-[11px] text-accent tracking-mono-wide mb-8">&gt; ENCRYPTING IN TRANSIT.</div>

      {(['name','email','message'] as const).map((field, i) => {
        const labels = { name: 'IDENTIFY YOURSELF', email: 'RETURN CHANNEL', message: 'PAYLOAD' };
        const isMessage = field === 'message';
        return (
          <div key={field} className="mb-8">
            <label className="block text-[10px] text-fg-low tracking-mono-wide mb-2">
              [ {String(i+1).padStart(2,'0')} ] {labels[field]}
            </label>
            {isMessage ? (
              <textarea
                rows={6}
                required
                value={form[field]}
                onChange={(e) => setForm({...form, [field]: e.target.value})}
                className="w-full bg-transparent border-b border-fg-low/40 focus:border-accent text-fg-high text-[14px] py-2 outline-none transition-colors duration-300 resize-none"
              />
            ) : (
              <input
                type={field === 'email' ? 'email' : 'text'}
                required
                value={form[field]}
                onChange={(e) => setForm({...form, [field]: e.target.value})}
                className="w-full bg-transparent border-b border-fg-low/40 focus:border-accent text-fg-high text-[14px] py-2 outline-none transition-colors duration-300"
              />
            )}
          </div>
        );
      })}

      <button
        type="submit"
        disabled={state !== 'idle' && state !== 'error'}
        className={`mt-4 px-6 py-3 border ${colorClass} text-[12px] tracking-mono-wide hover:bg-current/10 transition-colors duration-200 disabled:opacity-60`}
      >
        {current.label}
      </button>
    </form>
  );
}
```

THE TRANSMISSION SECTION (`src/components/Transmission.astro`):

```astro
---
import ContactForm from './ContactForm.tsx';
---

<section id="transmission" class="relative min-h-screen py-24 px-12">
  <div class="grid grid-cols-1 md:grid-cols-2 gap-16 max-w-[1280px] mx-auto">

    <div>
      <div class="font-mono text-[11px] text-fg-low tracking-mono-wide mb-6">
        &gt; SECTION 05 // THE TRANSMISSION
      </div>
      <h2 class="font-serif text-fg-high text-[clamp(40px,5vw,68px)] leading-[1.05] mb-1">
        The channel is open.
      </h2>
      <h2 class="font-serif italic text-fg-high text-[clamp(40px,5vw,68px)] leading-[1.05] mb-12">
        Use it carefully.
      </h2>

      <div class="font-mono text-[12px] text-fg-mid leading-[2] mb-12 max-w-[440px]">
        &gt; RESPONSE TIME: ~24 HOURS<br/>
        &gt; TIMEZONE: UTC+5:30<br/>
        &gt; PREFERRED USE: COLLABORATION, OPPORTUNITY, CURIOSITY.<br/>
        &gt; NOT FOR: COLD SALES, RECRUITER SPRAYS, "QUICK SYNCS".
      </div>

      <div class="font-mono text-[12px] text-fg-mid leading-[2.4] border-t border-fg-low/20 pt-6">
        <div class="flex justify-between max-w-[440px]">
          <span class="text-fg-low">EMAIL.....</span>
          <a href="mailto:sayanthsreekanth5@gmail.com" class="text-fg-mid hover:text-accent transition-colors">sayanthsreekanth5@gmail.com</a>
        </div>
        <div class="flex justify-between max-w-[440px]">
          <span class="text-fg-low">LINKEDIN..</span>
          <a href="https://linkedin.com/in/sayanth-sreekanth-289950188" target="_blank" rel="noopener" class="text-fg-mid hover:text-accent transition-colors">/sayanth-sreekanth</a>
        </div>
        <div class="flex justify-between max-w-[440px]">
          <span class="text-fg-low">GITHUB....</span>
          <a href="https://github.com/Sayanth2091" target="_blank" rel="noopener" class="text-fg-mid hover:text-accent transition-colors">/Sayanth2091</a>
        </div>
      </div>
    </div>

    <div>
      <ContactForm client:visible />
    </div>

  </div>
</section>
```

THE SIGNOFF SECTION (`src/components/Signoff.astro`):

A short closing section. Full viewport but content concentrated in the center.

```astro
---
---

<section id="signoff" class="relative min-h-screen flex flex-col items-center justify-center px-6">

  <div class="text-center max-w-[640px]">
    <div id="signoff-typer" class="font-mono text-[14px] text-accent tracking-mono-default leading-[2.2] min-h-[180px]">
      <!-- typed in by JS -->
    </div>

    <div class="font-serif italic text-fg-high text-[clamp(28px,3vw,40px)] mt-12 mb-2">
      Every system has a ghost.
    </div>
    <div class="font-serif text-fg-high text-[clamp(28px,3vw,40px)]">
      You just met one.
    </div>
  </div>

  <div class="absolute bottom-8 left-0 right-0 px-12 flex flex-col md:flex-row justify-between items-center gap-4 font-mono text-[10px] text-fg-low tracking-mono-wide">
    <div>SAYANTH SREEKANTH · 2026</div>
    <div class="flex gap-6">
      <a href="https://github.com/Sayanth2091/null-sector" target="_blank" rel="noopener" class="hover:text-accent transition-colors">// VIEW SOURCE</a>
      <a href="#hero" class="hover:text-accent transition-colors">↑ RETURN TO TOP</a>
    </div>
  </div>

</section>

<script>
  const lines = [
    '> END OF TRANSMISSION.',
    '> CONNECTION CLOSING IN 03... 02... 01...',
    '> THANK YOU FOR VISITING.',
    '> — S.S.',
  ];

  const target = document.getElementById('signoff-typer');
  if (target) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && !target.dataset.played) {
          target.dataset.played = '1';
          typeLines(target, lines);
        }
      });
    }, { threshold: 0.4 });
    observer.observe(target);
  }

  async function typeLines(el: HTMLElement, lines: string[]) {
    for (const line of lines) {
      const div = document.createElement('div');
      el.appendChild(div);
      for (const char of line) {
        div.textContent += char;
        await new Promise((r) => setTimeout(r, 20));
      }
      await new Promise((r) => setTimeout(r, 400));
    }
  }
</script>
```

CUTS 4 AND 5 WIRED:

In `src/scripts/cuts.ts`, the cutSections array is now complete:

```ts
const cutSections = [
  { id: 'hero',         cut: 0 },
  { id: 'dossier',      cut: 1 },
  { id: 'operations',   cut: 2 },
  { id: 'arsenal',      cut: 3 },
  { id: 'transmission', cut: 4 },
  { id: 'signoff',      cut: 5 },
];
```

UPDATE `src/pages/index.astro`:

```astro
---
import BaseLayout from '../layouts/BaseLayout.astro';
import Hero from '../components/Hero.astro';
import Dossier from '../components/Dossier.astro';
import Operations from '../components/Operations.astro';
import Arsenal from '../components/Arsenal.astro';
import Transmission from '../components/Transmission.astro';
import Signoff from '../components/Signoff.astro';
---
<BaseLayout title="SAYANTH SREEKANTH // NULL_SECTOR">
  <Hero />
  <Dossier />
  <Operations />
  <Arsenal />
  <Transmission />
  <Signoff />
</BaseLayout>
```

CONSTRAINTS:
- The Formspree endpoint is `REPLACE_ME` — user will replace after creating an account
- The "VIEW SOURCE" link points to a repo that doesn't exist yet — that's intentional. Once deployed, the repo IS the live source.
- The signoff typing animation only fires once per session, when the section enters viewport
- Mobile: form takes full width, side-by-side info collapses below

DELIVERABLES:
1. File tree
2. All file contents
3. Verification checklist
4. Commit message: "step-07: transmission + signoff — final cut, scroll narrative complete"

Begin.
````

---

## Verification checklist

- [ ] Transmission section renders with two columns
- [ ] Form fields are minimalist (border-bottom only)
- [ ] Submit cycles through encrypting / routing / transmitting / success states
- [ ] Test submission without a real Formspree endpoint — should fail gracefully with "TRANSMISSION FAILED" state
- [ ] Direct contact links work (mailto, LinkedIn, GitHub)
- [ ] Signoff section types in the four lines on first scroll-in
- [ ] Shard reaches State 4 in Transmission, State 5 in Signoff
- [ ] In State 5, the shard is fully transparent gem with inner scene fully visible
- [ ] No console errors

## Critical: replace the Formspree endpoint

Before going live:
1. Create a free Formspree account at formspree.io
2. Create a new form
3. Copy the endpoint URL (looks like `https://formspree.io/f/abcdefgh`)
4. Search the codebase for `REPLACE_ME` and replace
5. Test a real submission and verify you receive the email

## Token cost estimate

Sonnet: ~12k in / 12k out
Haiku: ~12k in / 18k out

## Commit and continue

```bash
git add .
git commit -m "step-07: transmission + signoff — final cut, scroll narrative complete"
git push
```

Move to `08_BUILD_AUDIO_LAYER.md`.
