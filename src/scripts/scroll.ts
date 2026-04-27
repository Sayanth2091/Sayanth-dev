import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// Prevent browser scroll restoration from landing mid-page on hard refresh.
history.scrollRestoration = 'manual';

declare global {
  interface Window {
    __lenis?: Lenis;
  }
}

function createLenis(): Lenis {
  const lenis = new Lenis({
    duration: 1.4,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smoothWheel: true,
    touchMultiplier: 2,
  });

  // Bridge: Lenis drives ScrollTrigger updates
  lenis.on('scroll', ScrollTrigger.update);

  // Bridge: GSAP ticker drives Lenis
  gsap.ticker.add((time) => {
    lenis.raf(time * 1000);
  });

  gsap.ticker.lagSmoothing(0);

  return lenis;
}

// Singleton — only one Lenis instance is ever created, regardless of how many
// components import this module.
if (typeof window !== 'undefined' && !window.__lenis) {
  window.__lenis = createLenis();

  // Single global refresh after all section scripts have registered their
  // triggers. 100ms covers Operations (sync), then Dossier/Arsenal (setTimeout 0
  // → RAF), so every trigger's start/end is recalculated against final layout.
  setTimeout(() => ScrollTrigger.refresh(), 100);

  // After the boot overlay dismisses, body overflow unlocks and final heights
  // settle — refresh once more so pinned ranges align with the live layout.
  window.addEventListener(
    'null-sector:boot-complete',
    () => setTimeout(() => ScrollTrigger.refresh(), 50),
    { once: true },
  );
}

export const lenis = typeof window !== 'undefined' ? window.__lenis! : (null as unknown as Lenis);

// Wraps the callback in a single rAF so Lenis has had one frame to sync its
// scroll position with ScrollTrigger before any trigger is created.
export function onLenisReady(cb: (lenis: Lenis) => void) {
  if (typeof window === 'undefined') return;
  requestAnimationFrame(() => {
    if (window.__lenis) cb(window.__lenis);
  });
}
