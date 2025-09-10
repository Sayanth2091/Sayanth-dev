// Parallax tilt for image rows with [data-tilt]
const MAX_DEG = 6;

function attach(el) {
  if (el.dataset.tiltBound) return;
  el.dataset.tiltBound = '1';
  const onMove = (e) => {
    const r = el.getBoundingClientRect();
    const nx = ((e.clientX - r.left) / r.width - 0.5) * 2; // -1..1
    const ny = ((e.clientY - r.top) / r.height - 0.5) * 2; // -1..1
    el.style.setProperty('--tilt-ry', (nx * MAX_DEG).toFixed(2) + 'deg');
    el.style.setProperty('--tilt-rx', (-ny * MAX_DEG).toFixed(2) + 'deg');
  };
  const onLeave = () => {
    el.style.setProperty('--tilt-ry', '0deg');
    el.style.setProperty('--tilt-rx', '0deg');
  };
  el.addEventListener('mousemove', onMove);
  el.addEventListener('mouseleave', onLeave);
}

function initTilt() {
  document.querySelectorAll('[data-tilt]').forEach(attach);
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initTilt, { once: true });
} else {
  initTilt();
}

document.addEventListener('astro:page-load', initTilt);

