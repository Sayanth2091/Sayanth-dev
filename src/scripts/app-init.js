const root = document.documentElement;
const START_TS = Date.now();
const MIN_LOADER_MS = 4500; // target intro (fade adds ~500ms ≈ 5s total)
let loadTimer = null;
let started = false;

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

function setupViewTransitions() {\n  const ENABLE_VT = false;\n  const supportsVT = typeof document.startViewTransition === 'function';\n  if (!ENABLE_VT || !supportsVT) return;\n\n  function calcRadius(x, y) {\n    const w = innerWidth;\n    const h = innerHeight;\n    const r1 = Math.hypot(x, y);\n    const r2 = Math.hypot(w - x, y);\n    const r3 = Math.hypot(x, h - y);\n    const r4 = Math.hypot(w - x, h - y);\n    return Math.max(r1, r2, r3, r4);\n  }\n\n  document.addEventListener('click', (e) => {\n    const a = e.target && (e.target.closest ? e.target.closest('a[href]') : null);\n    if (!a) return;\n    if (a.target === '_blank' || a.hasAttribute('download')) return;\n    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;\n    try {\n      const url = new URL(a.getAttribute('href') || a.href, location.href);\n      if (url.origin !== location.origin) return;\n      if (url.pathname === location.pathname && url.hash) return;\n\n      e.preventDefault();\n\n      const rect = a.getBoundingClientRect();\n      const clickX = (e.clientX || (rect.left + rect.width / 2));\n      const clickY = (e.clientY || (rect.top + rect.height / 2));\n\n      const x = Math.round(clickX) + 'px';\n      const y = Math.round(clickY) + 'px';\n      const r = Math.ceil(calcRadius(clickX, clickY)) + 'px';\n      root.style.setProperty('--vt-x', x);\n      root.style.setProperty('--vt-y', y);\n      root.style.setProperty('--vt-r-start', '0px');\n      root.style.setProperty('--vt-r-end', r);\n      root.classList.add('vt-clip');\n\n      const ring = document.createElement('div');\n      ring.id = 'vt-ring';\n      ring.style.setProperty('--ring-x', x);\n      ring.style.setProperty('--ring-y', y);\n      ring.style.setProperty('--ring-r', r);\n      document.body.appendChild(ring);\n\n      // VT disabled: fallback navigation\n      location.href = url.href;\n    } catch {}\n  }, { capture: true });\n}\n

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
  let ticking = false;
  let lastY = window.scrollY;
  const render = () => {
    ticking = false;
    const scrollY = lastY;
    const sh = document.documentElement.scrollHeight - innerHeight;
    const p = sh > 0 ? Math.min(1, Math.max(0, scrollY / sh)) : 0;
    if (bar) bar.style.transform = `scaleX(${p})`;
    const alpha = 65 + Math.min(23, Math.round((scrollY / 140) * 23));
    root.style.setProperty('--nav-a', alpha + '%');
    root.style.setProperty('--scroll-y', scrollY);
    const h = innerHeight || 1;
    const heroP = Math.min(1, Math.max(0, scrollY / (h * 0.9)));
    const ty = (scrollY * 0.22).toFixed(2) + 'px';
    const scale = (1 - heroP * 0.22).toFixed(4);
    const blur = (heroP * 1.2).toFixed(2) + 'px';
    root.style.setProperty('--hero-ty', ty);
    root.style.setProperty('--hero-scale', scale);
    root.style.setProperty('--hero-blur', blur);
  };
  const onScroll = () => {
    lastY = window.scrollY;
    if (!ticking) {
      ticking = true;
      requestAnimationFrame(render);
    }
  };
  const onResize = () => { lastY = window.scrollY; render(); };
  render();
  addEventListener('scroll', onScroll, { passive: true });
  addEventListener('resize', onResize);
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
  document.body.classList.remove('app-loading');
  const pl = document.getElementById('preloader');
  const finish = () => {
    if (pl) pl.remove();
    // Now allow page animations
    document.body.classList.add('ready');
    window.dispatchEvent(new Event('app:ready'));
  };
  if (pl) {
    pl.classList.add('hide');
    setTimeout(finish, 500);
  } else {
    finish();
  }
}

function bootApp() {
  if (started) return; // guard
  started = true;
  // After preloader fades and body becomes ready, initialize UI pieces
  const afterReady = () => {
    addEventListener('pointermove', onPointerMove, { passive: true });
    setupReveals();
    setupPrefetch();
    setupViewTransitions();
    setupNav();
    setupScrollUX();
    setupCardShine();
  };
  addEventListener('app:ready', afterReady, { once: true });
  markReady();
}

function init() {
  // While loading, block animations by omitting body.ready
  document.body.classList.add('app-loading');
  // Wait for full load and minimum loader time
  const onLoad = () => {
    const elapsed = Date.now() - START_TS;
    const delay = Math.max(0, MIN_LOADER_MS - elapsed);
    loadTimer = setTimeout(bootApp, delay);
  };
  if (document.readyState === 'complete') onLoad(); else addEventListener('load', onLoad, { once: true });

  // Expose skip function and click-to-skip on overlay
  window.skipIntro = () => {
    if (loadTimer) { try { clearTimeout(loadTimer); } catch {}
      loadTimer = null;
    }
    bootApp();
  };
  const pl = () => {
    const el = document.getElementById('preloader');
    if (!el) return;
    el.addEventListener('click', () => window.skipIntro(), { once: true });
  };
  if (document.readyState === 'loading') addEventListener('DOMContentLoaded', pl, { once: true }); else pl();
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

