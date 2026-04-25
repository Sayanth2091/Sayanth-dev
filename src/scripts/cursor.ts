// cursor.ts — ring + crosshair follows pointer, expands on interactive hover

export function initCursor(): void {
  const ring = document.getElementById('cursor-ring');
  const dot = document.getElementById('cursor-dot');

  if (!ring || !dot) return;

  let raf: number;
  let targetX = 0;
  let targetY = 0;
  let currentX = 0;
  let currentY = 0;

  document.addEventListener('mousemove', (e) => {
    targetX = e.clientX;
    targetY = e.clientY;
  });

  const INTERACTIVE = 'a, button, input, textarea, select, label, [data-cursor], [role="button"]';

  document.addEventListener('mouseover', (e) => {
    if ((e.target as Element).closest(INTERACTIVE)) {
      ring.classList.add('expanded');
    }
  });

  document.addEventListener('mouseout', (e) => {
    if ((e.target as Element).closest(INTERACTIVE)) {
      ring.classList.remove('expanded');
    }
  });

  // dot follows exactly; ring lerps slightly for weight
  const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

  function tick() {
    currentX = lerp(currentX, targetX, 0.15);
    currentY = lerp(currentY, targetY, 0.15);

    ring.style.left = `${currentX}px`;
    ring.style.top = `${currentY}px`;
    dot.style.left = `${targetX}px`;
    dot.style.top = `${targetY}px`;

    raf = requestAnimationFrame(tick);
  }

  raf = requestAnimationFrame(tick);

  // clean up if this ever unmounts (unlikely in Astro static, but correct)
  return () => cancelAnimationFrame(raf) as unknown as void;
}
