// hero.ts — entry animation for THE BLOCK
// Gated on the boot sequence completing so the hero doesn't play behind the overlay.
// Mono lines use a typewriter effect; serif headline lines slide in.

import { gsap } from 'gsap';
import { onBootComplete } from './boot-state';

const EASE = 'cubic-bezier(0.65, 0, 0.35, 1)';

const HERO_IDS = [
  '#hero-label-left',
  '#hero-label-right',
  '#hero-pre-headline',
  '#hero-headline-1',
  '#hero-headline-2',
  '#hero-sub',
  '#scroll-hint',
];

function typeInto(
  el: HTMLElement,
  text: string,
  delay: number | (() => number),
): Promise<void> {
  return new Promise((resolve) => {
    el.textContent = '';
    el.style.opacity = '1';
    let i = 0;
    const tick = () => {
      el.textContent = text.slice(0, ++i);
      if (i < text.length) {
        setTimeout(tick, typeof delay === 'function' ? delay() : delay);
      } else {
        resolve();
      }
    };
    tick();
  });
}

export function initHeroAnimation(): void {
  if (typeof window === 'undefined') return;

  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // hide everything up front so nothing flashes while the boot overlay is up
  gsap.set(HERO_IDS, { opacity: 0, y: 10 });

  if (reduced) {
    onBootComplete(() => gsap.set(HERO_IDS, { opacity: 1, y: 0 }));
    return;
  }

  onBootComplete(() => {
    const preEl = document.getElementById('hero-pre-headline');
    const subEl = document.getElementById('hero-sub');
    const preText = preEl?.textContent?.trim() ?? '';
    const subText = subEl?.textContent?.trim() ?? '';

    // Typing cadence: ~65 wpm. Average English word = 5 chars, so 65 wpm ≈
    // 325 chars/min ≈ 185 ms/char. A small ±15ms jitter per keypress kills the
    // mechanical feel without crossing into "fast typist" territory.
    const MS_PER_CHAR = 185;
    const JITTER = 15;
    const charDelay = () => MS_PER_CHAR + (Math.random() * 2 - 1) * JITTER;

    const tl = gsap.timeline({ defaults: { ease: EASE, duration: 0.7 } });

    tl.to('#hero-label-left',  { opacity: 1, y: 0 }, 0.0)
      .to('#hero-label-right', { opacity: 1, y: 0 }, 0.05)
      .add(() => {
        if (preEl) typeInto(preEl, preText, charDelay);
      }, 0.25)
      .to('#hero-headline-1',  { opacity: 1, y: 0, duration: 0.9 }, 0.7)
      .to('#hero-headline-2',  { opacity: 1, y: 0, duration: 0.9 }, 0.85)
      .add(() => {
        if (subEl) typeInto(subEl, subText, charDelay);
      }, 1.2)
      .to('#scroll-hint',      { opacity: 1, y: 0 }, 1.6);
  });
}
