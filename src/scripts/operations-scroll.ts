import './scroll';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export function initOperationsScroll() {
  const track = document.getElementById('ops-track') as HTMLElement | null;
  const section = document.getElementById('operations') as HTMLElement | null;

  if (!track || !section) return;

  // mobile: skip horizontal scroll, render as vertical stack
  if (window.innerWidth < 768) {
    track.style.flexDirection = 'column';
    track.style.height = 'auto';
    track.style.overflowY = 'visible';
    section.style.height = 'auto';
    section.style.minHeight = 'auto';
    return;
  }

  const totalWidth = track.scrollWidth;
  const viewport = window.innerWidth;
  const distance = totalWidth - viewport;

  if (distance <= 0) return;

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
