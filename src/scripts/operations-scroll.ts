import { onLenisReady } from './scroll';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

function easeOutQuart(t: number): number {
  return 1 - Math.pow(1 - t, 4);
}

export function initOperationsScroll() {
  const track   = document.getElementById('ops-track')   as HTMLElement | null;
  const section = document.getElementById('operations') as HTMLElement | null;

  if (!track || !section) return;

  // Mobile: drop to vertical stack, no JS needed
  if (window.innerWidth < 768) {
    track.style.flexDirection  = 'column';
    track.style.height         = 'auto';
    section.style.height       = 'auto';
    section.style.minHeight    = 'auto';
    section.style.overflow     = 'visible';
    const vp = section.querySelector<HTMLElement>('.ops-viewport');
    if (vp) vp.style.overflow  = 'visible';
    return;
  }

  onLenisReady(() => {
    const totalWidth = track.scrollWidth;
    const viewport   = window.innerWidth;
    const distance   = totalWidth - viewport;

    if (distance <= 0) return;

    const panels = Array.from(
      track.querySelectorAll<HTMLElement>('.ops-case-panel'),
    );

    // Folder-effect constants (standard + strip only)
    const TUCK_DISTANCE = 320; // px the info column tucks toward the image
    const VISUAL_LIFT   = 24;  // px the image counter-shifts for depth
    const SCALE_DROP    = 0.04;

    function updateParallax() {
      const vw = window.innerWidth;
      const vc = vw / 2;

      panels.forEach((panel) => {
        const rect   = panel.getBoundingClientRect();
        const center = rect.left + rect.width / 2;
        // –1.2 (off-left) … 0 (centred) … +1.2 (off-right)
        const offset  = Math.max(-1.2, Math.min(1.2, (center - vc) / vw));
        const absOff  = Math.min(1, Math.abs(offset));

        // Approach (entering from right): 0 at centre, 1 far right
        const entranceP = easeOutQuart(Math.max(0, Math.min(1, offset)));
        // Recede (exiting left): 0 at centre, 1 far left
        const exitP     = easeOutQuart(Math.max(0, Math.min(1, -offset)));

        const variant = panel.dataset.variant ?? 'standard';
        const card    = panel.querySelector<HTMLElement>('.case-card');

        // ── 1. Card-container entrance — each variant has a distinct signature ──
        //
        // These are the physical "arrival" behaviours of the card box itself,
        // not just the text inside it. entranceP drives approach, resets at centre.
        if (card) {
          switch (variant) {
            case 'standard':
              // Settles down from 10 px above on approach.
              // Counterpoint to the X-axis folder tuck that dominates the exit.
              card.style.transform = `translateY(${entranceP * 10}px)`;
              break;

            case 'overprint':
              // Full-bleed frame scales up from 96 % as it enters the viewport —
              // the card "grows" into its position rather than just sliding in.
              card.style.transform = `scale(${1 - entranceP * 0.04})`;
              break;

            case 'strip':
              // Gentle Y-drop + scale. Distinct from standard because the tall
              // narrow strip makes the downward motion read as a page-turn.
              card.style.transform =
                `translateY(${entranceP * 8}px) scale(${1 - entranceP * 0.018})`;
              break;

            case 'oversize':
              // Inverse: starts 2.5 % too large and zooms OUT to its natural size —
              // the only card that arrives this way, rhymes with the ghost type
              // materialising from inside rather than entering from outside.
              card.style.transform = `scale(${1 + entranceP * 0.025})`;
              break;
          }
        }

        // ── 2. Folder effect (standard + strip) ───────────────────────────────
        const visual = panel.querySelector<HTMLElement>('.case-visual');
        const info   = panel.querySelector<HTMLElement>('.case-info');

        if (visual) {
          const s = 1 - absOff * SCALE_DROP;
          if (variant === 'strip') {
            // Strip visual unfurls horizontally from left edge on entrance
            const hScale = 1 - entranceP * 0.055 - exitP * 0.04;
            visual.style.transform =
              `translateX(${-offset * VISUAL_LIFT}px) scaleX(${hScale}) scaleY(${s})`;
          } else {
            visual.style.transform =
              `translateX(${-offset * VISUAL_LIFT}px) scale(${s})`;
          }
          visual.style.opacity = String(Math.max(0.55, 1 - absOff * 0.4));
        }

        if (info) {
          const tuck = absOff * TUCK_DISTANCE;
          info.style.transform = `translateX(${-tuck}px) translateY(${absOff * 8}px)`;
          info.style.opacity   = String(Math.max(0.1, 1 - absOff * 1.1));
          info.style.filter    = `blur(${absOff * 1.4}px)`;
        }

        // ── 3. Per-variant image + content entrance ────────────────────────────

        // overprint: the full-bleed image wipes in from its left edge as the card
        // enters — a clip-path curtain that reveals the image left-to-right while
        // the card itself slides right-to-left. The text layers assemble after.
        if (variant === 'overprint') {
          const overprintVisual =
            panel.querySelector<HTMLElement>('.ops-overprint-visual');
          const title = panel.querySelector<HTMLElement>('.ops-overprint-title');
          const body  = panel.querySelector<HTMLElement>('.ops-overprint-body');

          if (overprintVisual) {
            // inset(0 R% 0 0): clips from the right side.
            // entranceP=1 → 100% clipped (image hidden), 0 → fully visible.
            const clipR = (entranceP * 100).toFixed(1);
            overprintVisual.style.clipPath = `inset(0 ${clipR}% 0 0)`;
          }
          if (title) {
            const y = entranceP * 36 - exitP * 20;
            title.style.transform = `translateY(${y}px)`;
            title.style.opacity   =
              String(Math.max(0.06, 1 - entranceP * 0.88 - exitP * 0.7));
          }
          if (body) {
            const y = entranceP * 22 - exitP * 13;
            body.style.transform = `translateY(${y}px)`;
            body.style.opacity   =
              String(Math.max(0.06, 1 - entranceP * 0.9 - exitP * 0.6));
          }
        }

        // oversize: ghost type materialises from slightly oversized as card enters;
        // foreground info drifts upward into place.
        if (variant === 'oversize') {
          const bg    = panel.querySelector<HTMLElement>('.ops-oversize-bg');
          const info2 = panel.querySelector<HTMLElement>('.ops-oversize-info');

          if (bg) {
            bg.style.transform =
              `translate(-50%, -50%) scale(${1 + entranceP * 0.05 - exitP * 0.03})`;
            bg.style.opacity =
              String(0.09 * Math.max(0.15, 1 - entranceP * 0.82));
          }
          if (info2) {
            const y = entranceP * 20 - exitP * 12;
            info2.style.transform = `translateY(${y}px)`;
            info2.style.opacity   =
              String(Math.max(0.08, 1 - entranceP * 0.86 - exitP * 0.6));
          }
        }
      });
    }

    gsap.to(track, {
      x: -distance,
      ease: 'none',
      scrollTrigger: {
        trigger: section,
        start: 'top top',
        end:   () => `+=${distance}`,
        scrub: 1,
        pin:   true,
        anticipatePin:       1,
        invalidateOnRefresh: true,
        onUpdate:  updateParallax,
        onRefresh: updateParallax,
      },
    });

    requestAnimationFrame(updateParallax);
  });
}
