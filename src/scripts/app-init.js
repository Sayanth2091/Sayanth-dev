const root = document.documentElement;

function onPointerMove(e) {
  root.style.setProperty('--cursor-x', e.clientX + 'px');
  root.style.setProperty('--cursor-y', e.clientY + 'px');
  const cx = (e.clientX / innerWidth - 0.5) * 2;
  const cy = (e.clientY / innerHeight - 0.5) * 2;
  root.style.setProperty('--tilt-x', (-cy * 4).toFixed(3) + 'deg');
  root.style.setProperty('--tilt-y', (cx * 4).toFixed(3) + 'deg');
}

function setupReveals() {
  const io = new IntersectionObserver((entries) => {
    for (const e of entries) {
      if (e.isIntersecting) {
        // Seed heading random landing before marking in
        const heading = e.target.querySelector && e.target.querySelector('h2');
        if (heading && !heading.dataset.lander) {
          const rx = (Math.random() * 60 - 30).toFixed(1) + 'px'; // -30..30
          const ry = (Math.random() * 40 - 20).toFixed(1) + 'px'; // -20..20
          const rot = (Math.random() * 16 - 8).toFixed(1) + 'deg'; // -8..8
          heading.style.setProperty('--hx', rx);
          heading.style.setProperty('--hy', ry);
          heading.style.setProperty('--hrot', rot);
          heading.classList.add('lander');
          heading.dataset.lander = '1';
        }
        e.target.classList.add('in');
        // Stagger children if any
        const cards = e.target.querySelectorAll('.cards > *');
        if (cards.length > 0) {
          cards.forEach((card, i) => {
            card.style.setProperty('--stagger', (i * 0.08) + 's');
          });
        }
      }
    }
  }, { threshold: 0.1 });
  document.querySelectorAll('[data-reveal]').forEach(el => io.observe(el));
}

function setupPrefetch() {
  document.addEventListener('mouseover', (e) => {
    const a = e.target.closest('a[href]');
    if (!a || a.target === '_blank' || a.hasAttribute('download')) return;
    const href = a.getAttribute('href');
    try {
      const url = new URL(href, location.href);
      if (url.origin !== location.origin) return;
      if (a.dataset.prefetched) return;
      const link = document.createElement('link');
      link.rel = 'prefetch';
      link.href = url.pathname + url.search;
      document.head.appendChild(link);
      a.dataset.prefetched = 'true';
    } catch {}
  });
}

function setupViewTransitions() {
  const supportsVT = typeof document.startViewTransition === 'function';
  if (!supportsVT) return;

  function calcRadius(x, y) {
    const w = innerWidth;
    const h = innerHeight;
    const r1 = Math.hypot(x, y);
    const r2 = Math.hypot(w - x, y);
    const r3 = Math.hypot(x, h - y);
    const r4 = Math.hypot(w - x, h - y);
    return Math.max(r1, r2, r3, r4);
  }

  document.addEventListener('click', (e) => {
    const a = e.target && (e.target.closest ? e.target.closest('a[href]') : null);
    if (!a) return;
    if (a.target === '_blank' || a.hasAttribute('download')) return;
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;
    try {
      const url = new URL(a.getAttribute('href') || a.href, location.href);
      if (url.origin !== location.origin) return;
      if (url.pathname === location.pathname && url.hash) return;

      e.preventDefault();

      // Determine reveal origin
      const rect = a.getBoundingClientRect();
      const clickX = (e.clientX || (rect.left + rect.width / 2));
      const clickY = (e.clientY || (rect.top + rect.height / 2));

      // Set CSS variables for reveal
      const x = Math.round(clickX) + 'px';
      const y = Math.round(clickY) + 'px';
      const r = Math.ceil(calcRadius(clickX, clickY)) + 'px';
      root.style.setProperty('--vt-x', x);
      root.style.setProperty('--vt-y', y);
      root.style.setProperty('--vt-r-start', '0px');
      root.style.setProperty('--vt-r-end', r);
      root.classList.add('vt-clip');

      // Create neon ring overlay
      const ring = document.createElement('div');
      ring.id = 'vt-ring';
      ring.style.setProperty('--ring-x', x);
      ring.style.setProperty('--ring-y', y);
      ring.style.setProperty('--ring-r', r);
      document.body.appendChild(ring);

      const vt = document.startViewTransition(() => {
        location.href = url.href;
      });

      vt.finished.finally(() => {
        root.classList.remove('vt-clip');
        ring.remove();
      });
    } catch {}
  }, { capture: true });
}

function setupNav() {
  document.querySelectorAll('.nav').forEach(nav => {
    const btn = nav.querySelector('.menu-toggle');
    btn?.addEventListener('click', () => {
      const open = nav.classList.toggle('open');
      btn.setAttribute('aria-expanded', String(open));
      document.documentElement.classList.toggle('lock', open);
      document.body.classList.toggle('lock', open);
    });
    nav.querySelectorAll('.links a').forEach(a => a.addEventListener('click', () => {
      nav.classList.remove('open');
      btn?.setAttribute('aria-expanded', 'false');
      document.documentElement.classList.remove('lock');
      document.body.classList.remove('lock');
    }));
  });
}

function setupScrollUX() {
  const bar = document.getElementById('scroll-progress');
  const update = () => {
    const scrollY = window.scrollY;
    const sh = document.documentElement.scrollHeight - innerHeight;
    const p = sh > 0 ? Math.min(1, Math.max(0, scrollY / sh)) : 0;
    if (bar) bar.style.transform = `scaleX(${p})`;
    const alpha = 65 + Math.min(23, Math.round((scrollY / 140) * 23));
    root.style.setProperty('--nav-a', alpha + '%');
    root.style.setProperty('--scroll-y', scrollY);
    // Hero depth: translate + scale + subtle blur
    const h = innerHeight || 1;
    const heroP = Math.min(1, Math.max(0, scrollY / (h * 0.9)));
    const ty = (scrollY * 0.25).toFixed(2) + 'px';
    const scale = (1 - heroP * 0.25).toFixed(4); // down to ~0.75
    const blur = (heroP * 1.6).toFixed(2) + 'px';
    root.style.setProperty('--hero-ty', ty);
    root.style.setProperty('--hero-scale', scale);
    root.style.setProperty('--hero-blur', blur);
  };
  update();
  addEventListener('scroll', update, { passive: true });
  addEventListener('resize', update);
}

function setupCardShine() {
  const onMove = (e) => {
    const card = e.target.closest && e.target.closest('.card, .stack-card');
    if (!card) return;
    const r = card.getBoundingClientRect();
    const x = e.clientX - r.left;
    const y = e.clientY - r.top;
    card.style.setProperty('--mx', x + 'px');
    card.style.setProperty('--my', y + 'px');
  };
  document.addEventListener('mousemove', onMove, { passive: true });
}

function markReady() {
  document.body.classList.add('ready');
  const pl = document.getElementById('preloader');
  if (pl) { pl.classList.add('hide'); setTimeout(() => pl.remove(), 400); }
}

function init() {
  addEventListener('pointermove', onPointerMove, { passive: true });
  setupReveals();
  setupPrefetch();
  setupViewTransitions();
  setupNav();
  setupScrollUX();
  setupCardShine();
  
  // Check if we're on home page - if so, wait for intro, otherwise mark ready immediately
  const onHome = location.pathname === '/' || location.pathname === '/index.html';
  if (onHome) {
    addEventListener('app:intro-done', () => markReady(), { once: true });
    // Safety timeout in case intro doesn't fire
    setTimeout(() => {
      if (!document.body.classList.contains('ready')) {
        markReady();
      }
    }, 5000);
  } else {
    markReady();
  }
}

if (document.readyState === 'complete' || document.readyState === 'interactive') {
  requestAnimationFrame(init);
} else {
  addEventListener('DOMContentLoaded', init, { once: true });
}

addEventListener('astro:page-load', () => {
  setupReveals();
  setupNav();
  setupScrollUX();
});
