// Neon cursor trail, lightweight pooled sparks

const MAX_SPARKS = 28;
const POOL = [];
let idx = 0;
let last = 0;

function makeSpark() {
  const s = document.createElement('span');
  s.className = 'cursor-spark';
  s.hidden = true;
  document.body.appendChild(s);
  return s;
}

function spawn(x, y) {
  const now = performance.now();
  if (now - last < 16) return;
  last = now;

  const s = POOL[idx] || (POOL[idx] = makeSpark());
  idx = (idx + 1) % MAX_SPARKS;

  const size = 6 + Math.random() * 10;
  const hue = Math.random() < 0.55 ? 'var(--neon-cyan)' : 'var(--neon-purple)';
  const life = 480 + Math.random() * 320;
  const driftX = (Math.random() - 0.5) * 24;
  const driftY = (Math.random() - 0.5) * 24;

  s.style.setProperty('--spark-size', size + 'px');
  s.style.setProperty('--spark-color', hue);
  s.style.setProperty('--spark-life', life + 'ms');
  s.style.setProperty('--spark-dx', driftX.toFixed(2) + 'px');
  s.style.setProperty('--spark-dy', driftY.toFixed(2) + 'px');
  s.style.left = x + 'px';
  s.style.top = y + 'px';
  s.hidden = false;

  s.classList.remove('run');
  void s.offsetWidth;
  s.classList.add('run');

  clearTimeout(s._t);
  s._t = setTimeout(() => { s.hidden = true; }, life);
}

function initTrail() {
  for (let i = 0; i < MAX_SPARKS; i++) POOL.push(makeSpark());
  window.addEventListener('pointermove', (e) => spawn(e.clientX, e.clientY), { passive: true });
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initTrail, { once: true });
} else {
  initTrail();
}

document.addEventListener('astro:page-load', () => {});

