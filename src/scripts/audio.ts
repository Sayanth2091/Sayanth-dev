type SoundKey = 'tick' | 'transmit' | 'cut' | 'decrypt' | 'keystroke';

const BASE = import.meta.env.BASE_URL.replace(/\/$/, '');

const SOUND_PATHS: Record<SoundKey, string> = {
  tick:      `${BASE}/audio/tick.wav`,
  transmit:  `${BASE}/audio/transmit.wav`,
  cut:       `${BASE}/audio/cut.wav`,
  decrypt:   `${BASE}/audio/decrypt.wav`,
  keystroke: `${BASE}/audio/keystoke.wav`,  // note: typo in filename on disk
};

const AMBIENT_PATH = `${BASE}/audio/ambient.mp3`;

class AudioEngine {
  private ctx: AudioContext | null = null;
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
      this.ctx = new AudioContext();
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.value = 0.6;
      this.masterGain.connect(this.ctx.destination);

      this.ambientGain = this.ctx.createGain();
      this.ambientGain.gain.value = 0;
      this.ambientGain.connect(this.masterGain);

      // load SFX in parallel — failures are silently swallowed
      await Promise.all(
        (Object.keys(SOUND_PATHS) as SoundKey[]).map(async (key) => {
          try {
            const buf = await fetchAudio(this.ctx!, SOUND_PATHS[key]);
            this.buffers[key] = buf;
          } catch {
            console.warn(`[audio] failed to load ${key}`);
          }
        })
      );

      // load ambient loop
      try {
        const buf = await fetchAudio(this.ctx, AMBIENT_PATH);
        this.ambientNode = this.ctx.createBufferSource();
        this.ambientNode.buffer = buf;
        this.ambientNode.loop = true;
        this.ambientNode.connect(this.ambientGain);
        this.ambientNode.start();
      } catch {
        console.warn('[audio] failed to load ambient');
      }
    } catch (err) {
      console.warn('[audio] init failed', err);
    }
  }

  async enable() {
    await this.init();
    if (!this.ctx) return;
    if (this.ctx.state === 'suspended') await this.ctx.resume();
    this.enabled = true;
    if (this.ambientGain) {
      this.ambientGain.gain.linearRampToValueAtTime(0.25, this.ctx.currentTime + 1.2);
    }
    localStorage.setItem('null-sector-audio', 'on');
    document.dispatchEvent(new CustomEvent('null-sector:audio-changed', { detail: { enabled: true } }));
  }

  disable() {
    this.enabled = false;
    if (this.ctx && this.ambientGain) {
      this.ambientGain.gain.linearRampToValueAtTime(0, this.ctx.currentTime + 0.6);
    }
    localStorage.setItem('null-sector-audio', 'off');
    document.dispatchEvent(new CustomEvent('null-sector:audio-changed', { detail: { enabled: false } }));
  }

  toggle() {
    this.enabled ? this.disable() : this.enable();
  }

  play(key: SoundKey, opts: { volume?: number; pitch?: number } = {}) {
    if (!this.enabled || !this.ctx || !this.buffers[key]) return;
    try {
      const source = this.ctx.createBufferSource();
      source.buffer = this.buffers[key]!;
      if (opts.pitch) source.playbackRate.value = opts.pitch;
      const gain = this.ctx.createGain();
      gain.gain.value = opts.volume ?? 1;
      source.connect(gain);
      gain.connect(this.masterGain!);
      source.start();
    } catch {
      // silently no-op if context was closed or interrupted
    }
  }
}

async function fetchAudio(ctx: AudioContext, url: string): Promise<AudioBuffer> {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const arr = await res.arrayBuffer();
  return ctx.decodeAudioData(arr);
}

export const audio = new AudioEngine();

// restore from localStorage on first user gesture
let restored = false;
function tryRestore() {
  if (restored) return;
  restored = true;
  document.removeEventListener('pointerdown', tryRestore);
  if (localStorage.getItem('null-sector-audio') === 'on') {
    audio.enable();
  }
}

if (typeof window !== 'undefined') {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    restored = true; // never auto-restore for reduced-motion users
  } else {
    document.addEventListener('pointerdown', tryRestore);
  }
}
