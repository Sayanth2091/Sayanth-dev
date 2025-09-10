// Count-up on visible stats

function setupCounters() {
  const els = Array.from(document.querySelectorAll('[data-count-to]'));
  if (!els.length) return;

  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      if (el.dataset.countDone === '1') { io.unobserve(el); return; }
      el.dataset.countDone = '1';
      animateCount(el);
      io.unobserve(el);
    });
  }, { threshold: 0.35 });

  els.forEach(el => io.observe(el));
}

function animateCount(el) {
  const to = Number(el.getAttribute('data-count-to')) || 0;
  const dur = Number(el.getAttribute('data-count-dur')) || 1400;
  const suffix = el.getAttribute('data-count-suffix') || '';
  const start = performance.now();
  const ease = (t) => 1 - Math.pow(1 - t, 3);
  const from = 0;

  function tick(now) {
    const p = Math.min(1, (now - start) / dur);
    const v = Math.round(from + (to - from) * ease(p));
    el.textContent = String(v) + suffix;
    if (p < 1) requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', setupCounters, { once: true });
} else {
  setupCounters();
}

document.addEventListener('astro:page-load', setupCounters);

