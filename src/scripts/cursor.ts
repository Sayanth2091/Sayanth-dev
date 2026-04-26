// cursor.ts — ring + crosshair follows pointer, expands on interactive hover
// Also shows [ FACET XX / 20 ] readout when hovering the shard mount.

export function initCursor(): void {
  const ring = document.getElementById('cursor-ring');
  const dot  = document.getElementById('cursor-dot');

  if (!ring || !dot) return;

  // ── facet readout element ──────────────────────────────────────────────────
  const facetEl = document.createElement('div');
  facetEl.id = 'cursor-facet';
  Object.assign(facetEl.style, {
    position: 'fixed',
    pointerEvents: 'none',
    zIndex: '9999',
    fontFamily: 'var(--font-mono)',
    fontSize: '10px',
    letterSpacing: '0.15em',
    color: 'var(--color-accent)',
    textTransform: 'uppercase',
    opacity: '0',
    transition: 'opacity 200ms ease',
    whiteSpace: 'nowrap',
  });
  document.body.appendChild(facetEl);

  let targetX = 0;
  let targetY = 0;
  let currentX = 0;
  let currentY = 0;
  let overShard = false;

  const INTERACTIVE = 'a, button, input, textarea, select, label, [data-cursor], [role="button"]';

  document.addEventListener('mousemove', (e) => {
    targetX = e.clientX;
    targetY = e.clientY;

    // update facet readout position
    facetEl.style.left = `${e.clientX + 18}px`;
    facetEl.style.top  = `${e.clientY - 8}px`;

    // stable-ish facet number based on cursor position
    if (overShard) {
      const facet = (Math.floor(e.clientX / 12 + e.clientY / 10) % 20) + 1;
      facetEl.textContent = `[ FACET ${String(facet).padStart(2, '0')} / 20 ]`;
    }
  });

  document.addEventListener('mouseover', (e) => {
    const target = e.target as Element;

    if (target.closest(INTERACTIVE)) {
      ring.classList.add('expanded');
    }

    // detect shard mount hover
    if (target.closest('#shard-mount')) {
      overShard = true;
      facetEl.style.opacity = '1';
    }
  });

  document.addEventListener('mouseout', (e) => {
    const target = e.target as Element;

    if (target.closest(INTERACTIVE)) {
      ring.classList.remove('expanded');
    }

    if (target.closest('#shard-mount')) {
      overShard = false;
      facetEl.style.opacity = '0';
    }
  });

  // dot follows exactly; ring lerps for weight
  const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

  function tick() {
    currentX = lerp(currentX, targetX, 0.15);
    currentY = lerp(currentY, targetY, 0.15);

    ring.style.left = `${currentX}px`;
    ring.style.top  = `${currentY}px`;
    dot.style.left  = `${targetX}px`;
    dot.style.top   = `${targetY}px`;

    requestAnimationFrame(tick);
  }

  tick();
}
