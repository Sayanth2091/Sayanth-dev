import { onLenisReady } from './scroll';
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

  onLenisReady(() => {
    const totalWidth = track.scrollWidth;
    const viewport = window.innerWidth;
    const distance = totalWidth - viewport;

    if (distance <= 0) return;

    const panels = Array.from(
      track.querySelectorAll<HTMLElement>('.ops-case-panel'),
    );

    // Folder effect: as a panel scrolls past the screen center, its text tucks
    // back behind the image (the "folder cover"). When the panel is centered,
    // the text is fully visible to the right of the image. As the panel moves
    // off-center, the text slides leftward into the image's column and ducks
    // beneath it — like a document being slid back into a folder.
    const TUCK_DISTANCE = 320; // px the text slides toward (and under) the image
    const VISUAL_LIFT   = 24;  // px the image lifts slightly to reinforce depth
    const SCALE_DROP    = 0.04;

    function updateParallax() {
      const vw = window.innerWidth;
      const vc = vw / 2;

      panels.forEach((panel) => {
        const rect = panel.getBoundingClientRect();
        const center = rect.left + rect.width / 2;
        // -1 (off-left) .. 0 (centered) .. +1 (off-right)
        const offset = Math.max(-1.2, Math.min(1.2, (center - vc) / vw));
        const absOff = Math.min(1, Math.abs(offset));

        const visual = panel.querySelector<HTMLElement>('.case-visual');
        const info = panel.querySelector<HTMLElement>('.case-info');

        if (visual) {
          const scale = 1 - absOff * SCALE_DROP;
          visual.style.transform =
            `translateX(${-offset * VISUAL_LIFT}px) scale(${scale})`;
          visual.style.opacity = String(Math.max(0.55, 1 - absOff * 0.4));
        }

        if (info) {
          // Always slides leftward as the panel drifts from center, regardless
          // of which side it drifts to — the text retreats into the folder.
          const tuck = absOff * TUCK_DISTANCE;
          info.style.transform =
            `translateX(${-tuck}px) translateY(${absOff * 8}px)`;
          // Ease the tucked text into shadow so it reads as "behind" the cover
          info.style.opacity = String(Math.max(0.1, 1 - absOff * 1.1));
          info.style.filter = `blur(${absOff * 1.4}px)`;
        }
      });
    }

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
        onUpdate: updateParallax,
        onRefresh: updateParallax,
      },
    });

    // Initial paint so panels aren't all flat at scroll position 0.
    requestAnimationFrame(updateParallax);
  });
}
