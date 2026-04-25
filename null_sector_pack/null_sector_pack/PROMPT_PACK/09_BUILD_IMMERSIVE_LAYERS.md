# 09 — BUILD THE IMMERSIVE LAYERS

> Boot sequence, terminal, konami code, classified route, cursor enhancement. The features that turn a portfolio into an experience worth sharing.

---

## What this step builds

- `src/components/BootSequence.astro` — the 2.4s on-load typewriter
- `src/components/Terminal.tsx` — the `/`-triggered floating terminal
- `src/scripts/konami.ts` — keyboard listener
- `src/pages/classified.astro` — the konami-unlocked easter egg page
- Cursor enhancement: facet readout when hovering shard

---

## The prompt — paste into Sonnet/Haiku

````
Build the immersive layers of NULL_SECTOR. Build step 09 of 10. This is the most fun step.

Read 00_NARRATIVE_BIBLE.md section 9 first.

WHAT TO BUILD (in this order):

PART A — BOOT SEQUENCE

`src/components/BootSequence.astro`:

A full-viewport black overlay (z-index 100), shown only on first visit per session.
Inside: a vertical-centered mono text block that types itself out:

```
> ESTABLISHING SECURE CHANNEL...
> AUTHENTICATING REQUEST...
> CLEARANCE GRANTED.
> WELCOME TO NULL_SECTOR.
```

Each line types in at 25ms per character. After the last line completes, wait 600ms, play `decrypt.wav` (if audio is enabled), fade overlay out over 800ms. Total duration ~2.4s.

Use `sessionStorage.getItem('null-sector-booted')` to skip on subsequent navigations.

The overlay must block scroll and clicks while visible. Set `overflow: hidden` on body during boot.

```astro
---
---

<div id="boot-sequence" class="fixed inset-0 z-[100] bg-void flex items-center justify-center">
  <div class="font-mono text-fg-mid text-[14px] tracking-mono-default leading-[2.2] max-w-[480px]">
    <div id="boot-line-0" class="text-accent"></div>
    <div id="boot-line-1"></div>
    <div id="boot-line-2"></div>
    <div id="boot-line-3" class="text-accent"></div>
  </div>
</div>

<script>
  import { audio } from '../scripts/audio';

  const overlay = document.getElementById('boot-sequence')!;

  if (sessionStorage.getItem('null-sector-booted')) {
    overlay.style.display = 'none';
    document.body.style.overflow = '';
  } else {
    document.body.style.overflow = 'hidden';
    runBoot();
  }

  async function runBoot() {
    const lines = [
      '> ESTABLISHING SECURE CHANNEL...',
      '> AUTHENTICATING REQUEST...',
      '> CLEARANCE GRANTED.',
      '> WELCOME TO NULL_SECTOR.',
    ];
    for (let i = 0; i < lines.length; i++) {
      const el = document.getElementById(`boot-line-${i}`);
      if (!el) continue;
      for (const char of lines[i]) {
        el.textContent += char;
        await sleep(25);
      }
      await sleep(180);
    }
    await sleep(600);
    audio.play('decrypt');
    overlay.style.transition = 'opacity 800ms cubic-bezier(0.65, 0, 0.35, 1)';
    overlay.style.opacity = '0';
    await sleep(800);
    overlay.style.display = 'none';
    document.body.style.overflow = '';
    sessionStorage.setItem('null-sector-booted', '1');
  }

  function sleep(ms: number) {
    return new Promise((r) => setTimeout(r, ms));
  }
</script>
```

Add `<BootSequence />` to `BaseLayout.astro` BEFORE all other content.

PART B — TERMINAL

`src/components/Terminal.tsx`:

A floating terminal window that opens when the user types `/`. Closes on `Esc` or clicking outside.

Sized 480px x 360px, fixed center, mono font, void background, accent border.

Top bar reads: `// TERMINAL — type 'help' for commands`

History scrolls upward. Input prompt at the bottom: `skywalkr_2091:~$ `

Available commands:

- `help` — list commands
- `whoami` — print mono bio
- `projects` — scroll page to operations section
- `contact` — scroll page to transmission section
- `clear` — clear history
- `exit` — close terminal
- `about` — scroll page to dossier
- `easter` — print "ACCESS GRANTED. SCROLL DOWN. THE BLOCK CRACKS DEEPER."
- anything else — print `command not found: <cmd>`

```tsx
import { useState, useEffect, useRef } from 'react';
import { audio } from '../scripts/audio';

interface Line { type: 'input' | 'output'; text: string }

const COMMANDS: Record<string, () => string | null> = {
  help: () => `available commands:
  help          show this message
  whoami        print operator bio
  about         go to dossier
  projects      go to operations
  contact       go to transmission
  easter        ???
  clear         clear screen
  exit          close terminal`,
  whoami: () => `subject:        sayanth sreekanth
classification: SOC analyst, researcher, builder
location:       kerala, india
years_active:   02
status:         active
note:           type 'help' for more commands.`,
  projects: () => { document.getElementById('operations')?.scrollIntoView({ behavior: 'smooth' }); return 'navigating to operations.'; },
  contact:  () => { document.getElementById('transmission')?.scrollIntoView({ behavior: 'smooth' }); return 'navigating to transmission.'; },
  about:    () => { document.getElementById('dossier')?.scrollIntoView({ behavior: 'smooth' }); return 'navigating to dossier.'; },
  clear:    () => null,
  exit:     () => null,
  easter:   () => `ACCESS GRANTED. SCROLL DOWN. THE BLOCK CRACKS DEEPER.`,
};

export default function Terminal() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState('');
  const [history, setHistory] = useState<Line[]>([
    { type: 'output', text: '// null_sector terminal v1.0' },
    { type: 'output', text: '// type "help" for commands' },
  ]);
  const inputRef = useRef<HTMLInputElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === '/' && !open && !isTypingInForm(e.target)) {
        e.preventDefault();
        setOpen(true);
      } else if (e.key === 'Escape' && open) {
        setOpen(false);
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [open]);

  useEffect(() => {
    if (open && inputRef.current) inputRef.current.focus();
  }, [open]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [history]);

  function execute(raw: string) {
    const cmd = raw.trim().toLowerCase();
    const newHistory: Line[] = [...history, { type: 'input', text: raw }];
    audio.play('keystroke');

    if (cmd === '') {
      setHistory(newHistory);
      return;
    }
    if (cmd === 'clear') {
      setHistory([]);
      return;
    }
    if (cmd === 'exit') {
      setOpen(false);
      return;
    }

    const fn = COMMANDS[cmd];
    if (fn) {
      const out = fn();
      if (out !== null) newHistory.push({ type: 'output', text: out });
    } else {
      newHistory.push({ type: 'output', text: `command not found: ${cmd}` });
    }
    setHistory(newHistory);
  }

  function isTypingInForm(target: EventTarget | null) {
    const t = target as HTMLElement;
    return t && (t.tagName === 'INPUT' || t.tagName === 'TEXTAREA');
  }

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[90] flex items-center justify-center bg-void/40 backdrop-blur-sm" onClick={() => setOpen(false)}>
      <div
        className="w-[480px] h-[360px] bg-void border border-accent/40 font-mono text-[12px] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="border-b border-fg-low/20 px-3 py-2 text-fg-low text-[10px] tracking-mono-wide flex justify-between">
          <span>// TERMINAL — type 'help' for commands</span>
          <span className="cursor-pointer hover:text-accent" onClick={() => setOpen(false)}>[ × ]</span>
        </div>
        <div className="flex-1 overflow-y-auto px-3 py-2 text-fg-mid leading-[1.6]">
          {history.map((line, i) => (
            <div key={i} className={line.type === 'input' ? 'text-fg-high' : 'text-fg-mid'}>
              {line.type === 'input' ? <><span className="text-accent">skywalkr_2091:~$</span> {line.text}</> : <pre className="whitespace-pre-wrap">{line.text}</pre>}
            </div>
          ))}
          <div ref={bottomRef} />
        </div>
        <div className="border-t border-fg-low/20 px-3 py-2 flex items-center gap-2">
          <span className="text-accent">skywalkr_2091:~$</span>
          <input
            ref={inputRef}
            value={input}
            onChange={(e) => { setInput(e.target.value); audio.play('keystroke', { volume: 0.2, pitch: 0.95 + Math.random() * 0.1 }); }}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                execute(input);
                setInput('');
              }
            }}
            className="flex-1 bg-transparent text-fg-high outline-none"
            autoFocus
          />
        </div>
      </div>
    </div>
  );
}
```

Add `<Terminal client:idle />` to `BaseLayout.astro`.

PART C — KONAMI CODE

`src/scripts/konami.ts`:

```ts
const SEQUENCE = ['ArrowUp','ArrowUp','ArrowDown','ArrowDown','ArrowLeft','ArrowRight','ArrowLeft','ArrowRight','b','a'];
let buffer: string[] = [];

window.addEventListener('keydown', (e) => {
  buffer.push(e.key);
  if (buffer.length > SEQUENCE.length) buffer.shift();
  if (buffer.join(',').toLowerCase() === SEQUENCE.join(',').toLowerCase()) {
    buffer = [];
    window.location.href = import.meta.env.BASE_URL + 'classified';
  }
});
```

Import this into `BaseLayout.astro` via `<script>`.

PART D — CLASSIFIED PAGE

`src/pages/classified.astro`:

A single-page narrative reveal about the homestay — the human side of Sayanth. Same design language but a softer voice.

```astro
---
import BaseLayout from '../layouts/BaseLayout.astro';
---

<BaseLayout title="// CLASSIFIED">
  <article class="max-w-[640px] mx-auto px-6 py-32">
    <a href="/null-sector/" class="font-mono text-[11px] text-fg-low hover:text-accent">← BACK TO TRANSMISSION</a>

    <div class="font-mono text-[10px] text-accent tracking-mono-wide mt-12 mb-2">
      [ KONAMI CLEARANCE GRANTED ]
    </div>
    <h1 class="font-serif text-fg-high text-[clamp(40px,5vw,68px)] leading-[1.1] mb-8">
      The river was first.
    </h1>

    <div class="font-sans text-fg-high text-[16px] leading-[1.7] space-y-6">
      <p>Before the alerts. Before the SIEM. Before the screens. There was a river in Kerala that he grew up next to.</p>
      <p>The homestay sits on its bank. He still runs it. Travelers come and go. The water doesn't notice.</p>
      <p>This is the part of him the system file doesn't mention.</p>
    </div>

    <div class="font-mono text-[11px] text-fg-mid leading-[2] mt-16 border-t border-fg-low/20 pt-8">
      <div>HOMESTAY:    KALMAN, MANA — KERALA, IN</div>
      <div>CHANNELS:    AIRBNB, DIRECT</div>
      <div>STATUS:      OPEN</div>
    </div>

    <div class="font-serif italic text-fg-mid text-[20px] mt-16 text-center">
      Every analyst goes home eventually.
    </div>
  </article>
</BaseLayout>
```

PART E — CURSOR FACET READOUT

Modify `src/scripts/cursor.ts` to detect when the cursor is over the shard mount and show a small mono readout next to the cursor:

`[ FACET 03 / 20 ]` — where the number is randomized to feel "alive" but stable per-position.

The simplest approach: when cursor is over `#shard-mount`, append a small absolute element near the cursor showing this text. Update the number based on `(mouseX + mouseY) % 20` for stability.

DELIVERABLES:
1. File tree
2. All file contents
3. Verification checklist
4. Commit message: "step-09: immersive layers — boot, terminal, konami, classified"

Begin.
````

---

## Verification checklist

- [ ] First load: black overlay appears, types in four lines, fades out
- [ ] Subsequent reloads in same session: no overlay (sessionStorage)
- [ ] Press `/` anywhere: terminal opens
- [ ] Type `help` then enter: command list shown
- [ ] Type `projects` then enter: page scrolls to operations, terminal closes naturally on next click outside
- [ ] Type `easter`: easter egg message printed
- [ ] Press Esc: terminal closes
- [ ] Type `↑ ↑ ↓ ↓ ← → ← → B A` anywhere: redirects to `/classified`
- [ ] Classified page renders correctly with the river narrative
- [ ] Hovering the shard area: cursor shows `[ FACET XX / 20 ]` readout
- [ ] No console errors

## Token cost estimate

Sonnet: ~14k in / 14k out
Haiku: ~14k in / 22k out

## Commit and continue

```bash
git add .
git commit -m "step-09: immersive layers — boot, terminal, konami, classified"
git push
```

Move to `10_POLISH_AND_DEPLOY.md`.
