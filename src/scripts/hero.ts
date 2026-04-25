// hero.ts — GSAP entry animation for THE BLOCK
// Order: top-left label → top-right label → pre-headline → headline lines → sub-headline → scroll hint
// Total duration: ~1800ms with 60ms stagger groups

import { gsap } from 'gsap';

export function initHeroAnimation(): void {
  const mm = window.matchMedia('(prefers-reduced-motion: reduce)');
  if (mm.matches) return;

  const ease = 'cubic-bezier(0.65, 0, 0.35, 1)';

  const tl = gsap.timeline({ defaults: { ease, duration: 0.8 } });

  // start everything invisible
  gsap.set(
    [
      '#hero-label-left',
      '#hero-label-right',
      '#hero-pre-headline',
      '#hero-headline-1',
      '#hero-headline-2',
      '#hero-sub',
      '#scroll-hint',
    ],
    { opacity: 0, y: 10 }
  );

  tl
    .to('#hero-label-left',    { opacity: 1, y: 0 }, 0.2)
    .to('#hero-label-right',   { opacity: 1, y: 0 }, 0.26)
    .to('#hero-pre-headline',  { opacity: 1, y: 0 }, 0.32)
    .to('#hero-headline-1',    { opacity: 1, y: 0 }, 0.38)
    .to('#hero-headline-2',    { opacity: 1, y: 0 }, 0.44)
    .to('#hero-sub',           { opacity: 1, y: 0 }, 0.50)
    .to('#scroll-hint',        { opacity: 1, y: 0 }, 0.56);
}
