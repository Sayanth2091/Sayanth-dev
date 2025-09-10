const SELECTOR = '.btn, .stack-card, .dock-item, .badge';
const MAX_OFFSET = 8; // px
const EASE = 0.18; // springiness

function attach(el) {
  if (el.dataset.magnetized) return;
  el.dataset.magnetized = '1';
  let raf = 0;
  let vx = 0, vy = 0; // velocity for release

  function set(dx, dy) {
    el.style.setProperty('--magnet', `translate(${dx.toFixed(2)}px, ${dy.toFixed(2)}px)`);
  }

  function onMove(e) {
    const r = el.getBoundingClientRect();
    const cx = r.left + r.width / 2;
    const cy = r.top + r.height / 2;
    const dx = Math.max(-MAX_OFFSET, Math.min(MAX_OFFSET, (e.clientX - cx) / (r.width / 2) * MAX_OFFSET));
    const dy = Math.max(-MAX_OFFSET, Math.min(MAX_OFFSET, (e.clientY - cy) / (r.height / 2) * MAX_OFFSET));
    set(dx, dy);
  }

  function onLeave() {
    cancelAnimationFrame(raf);
    // Snap back smoothly without spring wobble
    el.style.transition = 'transform .25s ease';
    set(0, 0);
    setTimeout(() => { el.style.transition = ''; }, 260);
  }

  el.addEventListener('mousemove', onMove);
  el.addEventListener('mouseleave', onLeave);
}

function initMagnet() {
  document.querySelectorAll(SELECTOR).forEach(attach);
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initMagnet, { once: true });
} else {
  initMagnet();
}

document.addEventListener('astro:page-load', initMagnet);
