// GlyphGrid: lightweight matrix-like animated background (ASCII-safe)
// Attaches to #glyph-grid element if present

function initGlyphGrid() {
  const grid = document.getElementById('glyph-grid');
  if (!grid) return;

  const cyber = 'HACKR BYTECODE CYBERPHX 2091 SKYWALKR';
  const base = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789{}[]()<>+-/*=|&!?:;%$#~^.,_`"\'';
  const extra = 'CYBERHEX2091<>[]{}+-=*/\\|_^~';
  const glyphs = Array.from(cyber + ' ' + base + ' ' + extra);

  const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
  let cellSize = 18;
  let columns = 0, rows = 0;
  let cells = [];
  let mouseX = 0, mouseY = 0;

  function computeCellSize(){
    const base = Math.max(18, Math.min(30, Math.round(window.innerWidth / 72)));
    // Larger cells on smaller screens to reduce DOM size
    cellSize = (window.innerWidth < 920 || reduceMotion) ? Math.max(base, 24) : base;
  }

  function build() {
    grid.innerHTML = '';
    cells = [];
    computeCellSize();
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

  function updateGlyphsSampled() {
    const gx = Math.floor(mouseX / cellSize);
    const gy = Math.floor(mouseY / cellSize);
    // Update only a small random subset per tick
    const total = cells.length;
    const rate = reduceMotion ? 0.02 : 0.06; // 2% on RM, 6% otherwise
    const count = Math.max(1, Math.floor(total * rate));
    for (let k = 0; k < count; k++) {
      const i = (Math.random() * total) | 0;
      const c = cells[i];
      const near = dist(c.x, c.y, gx, gy) < 5;
      const char = glyphs[(Math.random() * glyphs.length) | 0];
      const scheme = colorSchemes[(Math.random() * colorSchemes.length) | 0];
      const color = scheme[(Math.random() * scheme.length) | 0];
      c.element.textContent = char;
      c.element.style.color = color;
      const fx = Math.random() < 0.5 ? 'pulse' : 'wave';
      c.element.classList.remove('pulse', 'wave');
      c.element.classList.add(fx);
      c.element.style.opacity = near ? '1' : String(0.4 + Math.random() * 0.5);
      const life = (near ? 2600 : 1200) + Math.random() * (near ? 1600 : 1200);
      setTimeout(() => {
        c.element.textContent = '';
        c.element.classList.remove('pulse', 'wave');
      }, life);
    }
  }

  function matrixFall() {
    if (Math.random() > (reduceMotion ? 0.992 : 0.97)) {
      const column = (Math.random() * columns) | 0;
      const el = document.createElement('div');
      el.textContent = glyphs[(Math.random() * glyphs.length) | 0];
      el.style.position = 'absolute';
      el.style.left = `${column * cellSize}px`;
      el.style.top = '0px';
      el.style.color = '#29f2ff';
      el.style.fontSize = '14px';
      el.style.animation = 'matrixFall 3s linear forwards';
      el.style.pointerEvents = 'none';
      el.style.zIndex = '1';
      grid.appendChild(el);
      setTimeout(() => el.remove(), 3000);
    }
  }

  document.addEventListener('mousemove', (e) => { mouseX = e.clientX; mouseY = e.clientY; }, { passive: true });
  window.addEventListener('resize', build);

  let running = true;
  document.addEventListener('visibilitychange', ()=> { running = !document.hidden; });

  build();
  const glyphTimer = setInterval(()=> { if (running) updateGlyphsSampled(); }, reduceMotion ? 160 : 120);
  const fallTimer = setInterval(()=> { if (running) matrixFall(); }, reduceMotion ? 300 : 220);
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initGlyphGrid, { once: true });
} else {
  initGlyphGrid();
}
