// GlyphGrid: lightweight matrix-like animated background (ASCII-safe)
// Attaches to #glyph-grid element if present

function initGlyphGrid() {
  const grid = document.getElementById('glyph-grid');
  if (!grid) return;
  if (document.documentElement.classList.contains('reduced-effects')) return;

  const glyphs = Array.from('SKYWALKR_2091');

  const cellSize = 22;
  let columns = 0, rows = 0;
  let cells = [];
  let mouseX = 0, mouseY = 0;

  function build() {
    grid.innerHTML = '';
    cells = [];
    columns = Math.max(1, Math.floor(window.innerWidth / cellSize));
    rows = Math.max(1, Math.floor(window.innerHeight / cellSize));
    grid.style.display = 'grid';
    grid.style.gridTemplateColumns = `repeat(${columns}, ${cellSize}px)`;
    grid.style.gridTemplateRows = `repeat(${rows}, ${cellSize}px)`;
    for (let i = 0; i < columns * rows; i++) {
      const el = document.createElement('div');
      el.className = 'glyph-cell';
      el.style.userSelect = 'none';
      grid.appendChild(el);
      cells.push({ element: el, x: i % columns, y: Math.floor(i / columns) });
    }
  }

  const colorSchemes = [
    ['#29f2ff', '#2ccce6', '#66deff'],
    ['#b866ff', '#a355ff', '#d480ff'],
    ['#1aff99', '#1ad67a', '#4dffbb'],
    ['#ff8585', '#ff6b6b', '#ff9999'],
  ];

  function dist(ax, ay, bx, by) {
    const dx = bx - ax, dy = by - ay; return Math.hypot(dx, dy);
  }

  function updateGlyphs() {
    const gx = Math.floor(mouseX / cellSize);
    const gy = Math.floor(mouseY / cellSize);
    for (let i = 0; i < cells.length; i++) {
      const c = cells[i];
      const near = dist(c.x, c.y, gx, gy) < 4;
      const chance = near ? 0.975 : 0.993;
      if (Math.random() > chance) {
        const char = glyphs[(Math.random() * glyphs.length) | 0];
        const scheme = colorSchemes[(Math.random() * colorSchemes.length) | 0];
        const color = scheme[(Math.random() * scheme.length) | 0];
        c.element.textContent = char;
        c.element.style.color = color;
        const fx = Math.random() < 0.5 ? 'pulse' : 'wave';
        c.element.classList.remove('pulse', 'wave');
        c.element.classList.add(fx);
        c.element.style.opacity = near ? '0.9' : String(0.3 + Math.random() * 0.4);
        const life = (near ? 1600 : 900) + Math.random() * (near ? 800 : 600);
        setTimeout(() => {
          c.element.textContent = '';
          c.element.classList.remove('pulse', 'wave');
        }, life);
      }
    }
  }

  function matrixFall() {
    if (Math.random() > 0.995) {
      const column = (Math.random() * columns) | 0;
      const el = document.createElement('div');
      el.textContent = glyphs[(Math.random() * glyphs.length) | 0];
      el.style.position = 'absolute';
      el.style.left = `${column * cellSize}px`;
      el.style.top = '0px';
      el.style.color = '#29f2ff';
      el.style.fontSize = '14px';
      el.style.animation = 'matrixFall 2.2s linear forwards';
      el.style.pointerEvents = 'none';
      el.style.zIndex = '1';
      grid.appendChild(el);
      setTimeout(() => el.remove(), 2400);
    }
  }

  document.addEventListener('mousemove', (e) => { mouseX = e.clientX; mouseY = e.clientY; }, { passive: true });
  window.addEventListener('resize', build);

  build();\n  const glyphTimer = setInterval(updateGlyphs, 80);\n  const fallTimer = setInterval(matrixFall, 200);\n\n  const stop = () => { try { clearInterval(glyphTimer); clearInterval(fallTimer); } catch {} };\n  window.addEventListener('pagehide', stop, { once: true });\n  window.addEventListener('beforeunload', stop, { once: true });
}

function readyOrWait(cb){
  if (document.body && document.body.classList.contains('app-loading')) {
    window.addEventListener('app:ready', () => cb(), { once: true });
  } else {
    cb();
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => readyOrWait(initGlyphGrid), { once: true });
} else {
  readyOrWait(initGlyphGrid);
}


