import gsap from 'gsap';

type Keyframe = {
  x: string | number;
  y: string | number;
  scale: number;
  opacity: number;
  rotate: number;
};

// Inner box is centered in the viewport via CSS margins. GSAP fully owns the
// transform — x/y values shift the box from that centered baseline using
// viewport units, so positions stay sensible across screen sizes.
// 1/3-peek pattern: shard sits mostly off-screen, with only a corner or edge
// poking into the viewport. Each section anchors the shard at a different
// corner so it appears to circle the screen as the visitor scrolls.
// Signoff is the exception — fully visible, bottom-center, medium scale,
// before exploding 7s in.
const KEYFRAMES: Record<string, Keyframe> = {
  hero:         { x: '55vw',  y:  0,       scale: 1.00, opacity: 1.00, rotate:   0 },
  dossier:      { x: '45vw',  y: '-38vh',  scale: 0.70, opacity: 0.90, rotate:  12 },
  operations:   { x: '-45vw', y: '38vh',   scale: 0.65, opacity: 0.75, rotate:  -8 },
  arsenal:      { x: '-45vw', y: '-38vh',  scale: 0.70, opacity: 0.70, rotate:  18 },
  transmission: { x: '45vw',  y: '38vh',   scale: 0.60, opacity: 0.65, rotate:  -6 },
  signoff:      { x:  0,      y: '36vh',   scale: 0.54, opacity: 1.00, rotate:   0 },
};

const TWEEN = { duration: 1.6, ease: 'power3.inOut' };

export function initShardJourney() {
  const inner = document.querySelector<HTMLElement>('.shard-companion-inner');
  if (!inner) return;

  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduced) return;

  if (window.innerWidth < 768) return;

  gsap.set(inner, KEYFRAMES.hero);
  inner.style.pointerEvents = 'auto';

  window.addEventListener('null-sector:section-active', (e: Event) => {
    const id = (e as CustomEvent).detail?.id as string | undefined;
    if (!id || !(id in KEYFRAMES)) return;
    const kf = KEYFRAMES[id];
    gsap.to(inner, { ...kf, ...TWEEN });
    inner.style.pointerEvents = id === 'hero' ? 'auto' : 'none';
  });

  // Explosion: expand the inner box well past viewport so fragments cover
  // the entire screen (the canvas mask fades them at extreme edges).
  window.addEventListener('null-sector:shard-explode', () => {
    gsap.to(inner, {
      x: 0,
      y: 0,
      scale: 4.0,
      rotate: 0,
      opacity: 1,
      duration: 0.5,
      ease: 'power2.out',
    });
  });
}
