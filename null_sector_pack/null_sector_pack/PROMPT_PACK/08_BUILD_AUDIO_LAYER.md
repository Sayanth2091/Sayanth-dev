# 08 — BUILD THE AUDIO LAYER

> Audio is the highest-risk, highest-reward feature of this site. Done well, it's the difference between "nice portfolio" and "I'll remember this for a year." Done badly, it's the reason the visitor closes the tab in 3 seconds. This step adds it carefully, with strict opt-in.

---

## What this step builds

- `src/components/AudioController.astro` — the small toggle button + audio engine
- `src/scripts/audio.ts` — the audio class that loads, plays, manages all sounds
- Hooks into shard cuts, hover, form submit, scroll milestones
- Persistent on/off state in localStorage
- Honors `prefers-reduced-motion`

---

## The prompt — paste into Sonnet/Haiku

````
Build the audio layer of NULL_SECTOR. Build step 08 of 10.

Read 00_NARRATIVE_BIBLE.md section 8 first — those rules are inviolable.

WHAT TO BUILD:

1. `src/components/AudioController.astro` — the toggle button (top-right corner, fixed, mono style)
2. `src/scripts/audio.ts` — the audio engine class
3. Audio file expectations documented (will be sourced via MEDIA_PACK)
4. Integration into shard cuts, hover, and form submit

EXPECTED AUDIO FILES (paths in `public/audio/`):

```
public/audio/
├── ambient.mp3          — looping ambient drone, ~60s loop, ~70Hz pad
├── tick.wav             — UI hover tick, 40ms
├── transmit.wav         — modem chirp, 200ms
├── cut.wav              — crystal cut sound, 600ms
├── decrypt.wav          — static-to-clarity, 1200ms
└── keystroke.wav        — terminal keypress, 30ms
```

The user will source these via MEDIA_PACK. For this step, assume they exist. If a file is missing, the audio engine silently no-ops — never throws.

THE AUDIO ENGINE (`src/scripts/audio.ts`):

```ts
type SoundKey = 'tick' | 'transmit' | 'cut' | 'decrypt' | 'keystroke';

const SOUND_PATHS: Record<SoundKey, string> = {
  tick:      '/null-sector/audio/tick.wav',
  transmit:  '/null-sector/audio/transmit.wav',
  cut:       '/null-sector/audio/cut.wav',
  decrypt:   '/null-sector/audio/decrypt.wav',
  keystroke: '/null-sector/audio/keystroke.wav',
};

const AMBIENT_PATH = '/null-sector/audio/ambient.mp3';

class AudioEngine {
  private context: AudioContext | null = null;
  private buffers: Partial<Record<SoundKey, AudioBuffer>> = {};
  private ambientNode: AudioBufferSourceNode | null = null;
  private masterGain: GainNode | null = null;
  private ambientGain: GainNode | null = null;
  private enabled = false;
  private initialized = false;

  isEnabled() { return this.enabled; }

  async init() {
    if (this.initialized) return;
    this.initialized = true;
    try {
      this.context = new AudioContext();
      this.masterGain = this.context.createGain();
      this.masterGain.gain.value = 0.6;
      this.masterGain.connect(this.context.destination);

      this.ambientGain = this.context.createGain();
      this.ambientGain.gain.value = 0;  // start silent
      this.ambientGain.connect(this.masterGain);

      // load all SFX in parallel
      await Promise.all(
        (Object.keys(SOUND_PATHS) as SoundKey[]).map(async (key) => {
          try {
            const res = await fetch(SOUND_PATHS[key]);
            const arr = await res.arrayBuffer();
            this.buffers[key] = await this.context!.decodeAudioData(arr);
          } catch (err) {
            console.warn(`[audio] failed to load ${key}`);
          }
        })
      );

      // load ambient
      try {
        const res = await fetch(AMBIENT_PATH);
        const arr = await res.arrayBuffer();
        const buffer = await this.context.decodeAudioData(arr);
        this.ambientNode = this.context.createBufferSource();
        this.ambientNode.buffer = buffer;
        this.ambientNode.loop = true;
        this.ambientNode.connect(this.ambientGain);
        this.ambientNode.start();
      } catch (err) {
        console.warn('[audio] failed to load ambient');
      }
    } catch (err) {
      console.warn('[audio] init failed', err);
    }
  }

  async enable() {
    await this.init();
    if (!this.context) return;
    if (this.context.state === 'suspended') await this.context.resume();
    this.enabled = true;
    if (this.ambientGain) {
      this.ambientGain.gain.linearRampToValueAtTime(0.25, this.context.currentTime + 1.2);
    }
    localStorage.setItem('null-sector-audio', 'on');
    document.dispatchEvent(new CustomEvent('null-sector:audio-changed', { detail: { enabled: true } }));
  }

  disable() {
    this.enabled = false;
    if (this.context && this.ambientGain) {
      this.ambientGain.gain.linearRampToValueAtTime(0, this.context.currentTime + 0.6);
    }
    localStorage.setItem('null-sector-audio', 'off');
    document.dispatchEvent(new CustomEvent('null-sector:audio-changed', { detail: { enabled: false } }));
  }

  toggle() { this.enabled ? this.disable() : this.enable(); }

  play(key: SoundKey, opts: { volume?: number; pitch?: number } = {}) {
    if (!this.enabled || !this.context || !this.buffers[key]) return;
    const source = this.context.createBufferSource();
    source.buffer = this.buffers[key]!;
    if (opts.pitch) source.playbackRate.value = opts.pitch;
    const gain = this.context.createGain();
    gain.gain.value = opts.volume ?? 1;
    source.connect(gain);
    gain.connect(this.masterGain!);
    source.start();
  }
}

export const audio = new AudioEngine();

// auto-restore from localStorage on first user gesture
let restored = false;
function tryRestore() {
  if (restored) return;
  if (localStorage.getItem('null-sector-audio') === 'on') {
    audio.enable();
  }
  restored = true;
  document.removeEventListener('pointerdown', tryRestore);
}
document.addEventListener('pointerdown', tryRestore);

// honor prefers-reduced-motion: never auto-restore if user prefers reduced motion
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
if (reducedMotion.matches) restored = true;
```

THE TOGGLE COMPONENT (`src/components/AudioController.astro`):

```astro
---
---

<button
  id="audio-toggle"
  class="fixed top-6 right-6 z-50 font-mono text-[10px] tracking-mono-wide text-fg-low hover:text-accent transition-colors duration-200 border border-fg-low/30 hover:border-accent/60 px-3 py-2 backdrop-blur-sm bg-void/40"
  aria-label="Toggle ambient audio"
>
  <span id="audio-label">[ AUDIO: OFF ]</span>
</button>

<script>
  import { audio } from '../scripts/audio';

  const btn = document.getElementById('audio-toggle');
  const label = document.getElementById('audio-label');
  if (btn && label) {
    btn.addEventListener('click', () => {
      audio.toggle();
    });
    document.addEventListener('null-sector:audio-changed', ((e: CustomEvent) => {
      label.textContent = e.detail.enabled ? '[ AUDIO: ON ]' : '[ AUDIO: OFF ]';
    }) as EventListener);

    // hide entirely if user prefers reduced motion
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      btn.style.display = 'none';
    }
  }
</script>
```

Add `<AudioController />` to `BaseLayout.astro` at the top of `<body>`, just inside the layout.

INTEGRATION HOOKS:

1. SHARD CUTS (modify `src/scripts/cuts.ts`):

```ts
import { audio } from './audio';

let lastCut = -1;
window.addEventListener('null-sector:cut-progress', (e: any) => {
  const value = e.detail.value;
  if (value > lastCut && lastCut !== -1) {
    audio.play('cut', { volume: 0.4 });
  }
  lastCut = value;
});
```

2. HOVER TICKS (add to `src/scripts/cursor.ts` or create `src/scripts/hover-audio.ts`):

```ts
import { audio } from './audio';

let lastTick = 0;
function attach() {
  document.addEventListener('mouseover', (e) => {
    const target = e.target as HTMLElement;
    const isInteractive = target.matches('a, button, input, textarea, [data-interactive]');
    if (!isInteractive) return;
    const now = performance.now();
    if (now - lastTick < 80) return; // throttle
    lastTick = now;
    audio.play('tick', { volume: 0.3, pitch: 0.95 + Math.random() * 0.1 });
  });
}
attach();
```

3. FORM SUBMIT (modify `src/components/ContactForm.tsx`):

In the `handleSubmit` function, after the success branch:
```ts
import { audio } from '../scripts/audio';
// ...
setState('success');
audio.play('transmit');
```

4. ON FIRST INIT (boot sequence will use `decrypt.wav`, but that's step 09).

CONSTRAINTS:

- Audio is OFF by default. Always. Never autoplay.
- The toggle is in the top-right corner, very small, very subtle. It does not draw attention to itself.
- localStorage key is `null-sector-audio`. When set to `on`, the next visit will auto-enable on first user gesture (browser autoplay policy requires gesture).
- `prefers-reduced-motion` users: toggle is hidden, audio cannot be enabled. This is non-negotiable.
- All audio files load lazily — only when the user first toggles ON. Until then, no fetches happen.
- If any file fails to load, the engine silently continues. Other sounds still work. Console warns but no throw.
- Volumes:
  - Ambient: 0.25 (very quiet)
  - Tick: 0.3
  - Cut: 0.4
  - Transmit: 0.5
  - Decrypt: 0.5

DELIVERABLES:
1. File tree
2. All file contents
3. Verification checklist
4. Commit message: "step-08: audio layer — ambient + ui sounds, opt-in"

Begin.
````

---

## Verification checklist

- [ ] Top-right corner shows `[ AUDIO: OFF ]` toggle
- [ ] Default state: silent, no audio fetches in network tab
- [ ] Click toggle once: ambient drone fades in over ~1.2s, label changes to `[ AUDIO: ON ]`
- [ ] Hovering links/buttons plays a soft tick (slightly varied pitch)
- [ ] Scrolling between sections: when shard transitions to a new state, a single `cut.wav` plays
- [ ] Form submit: `transmit.wav` plays on success state
- [ ] Reload page: audio remembers ON state, re-enables on first click anywhere
- [ ] Set `prefers-reduced-motion: reduce` in DevTools → toggle disappears entirely
- [ ] If `ambient.mp3` is removed: page still loads, ambient just doesn't play, console warns once
- [ ] No console errors in normal use

---

## Common failure modes

- **Browser blocks audio.** Cause: autoplay policy. Fix: audio.enable() must be triggered by a user gesture (click). Our toggle does this correctly. If audio fails to enable on click, the AudioContext is suspended — call `context.resume()`.
- **Loud audio surprises user.** Cause: master gain too high. Fix: 0.6 master, 0.25 ambient is the right baseline. Test on cheap earbuds, not studio monitors.
- **Tick spam.** Cause: hover events fire continuously. Fix: throttle as shown (80ms minimum gap).

## Token cost estimate

Sonnet: ~10k in / 8k out
Haiku: ~10k in / 14k out

## Commit and continue

```bash
git add .
git commit -m "step-08: audio layer — ambient + ui sounds, opt-in"
git push
```

Move to `09_BUILD_IMMERSIVE_LAYERS.md`.
