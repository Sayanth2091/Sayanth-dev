// GlyphGrid: lightweight matrix-like animated background (ASCII-safe)
// Attaches to #glyph-grid element if present

function initGlyphGrid() {
  const grid = document.getElementById('glyph-grid');
  if (!grid) return;

  const cyber = 'HACKR BYTECODE CYBERPHX 2091 SKYWALKR';
  const base = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789{}[]()<>+-/*=|&!?:;%$#~^.,_`"\'';
  const extra = 'CYBERHEX2091<>[]{}+-=*/\\|_^~';
  const glyphs = Array.from(cyber + ' ' + base + ' ' + extra);

  const cellSize = 18;
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
      const near = dist(c.x, c.y, gx, gy) < 5;
      const chance = near ? 0.95 : 0.985;
      if (Math.random() > chance) {
        const char = glyphs[(Math.random() * glyphs.length) | 0];
        const scheme = colorSchemes[(Math.random() * colorSchemes.length) | 0];
        const color = scheme[(Math.random() * scheme.length) | 0];
        c.element.textContent = char;
        c.element.style.color = color;
        const fx = Math.random() < 0.5 ? 'pulse' : 'wave';
        c.element.classList.remove('pulse', 'wave');
        c.element.classList.add(fx);
        c.element.style.opacity = near ? '1' : String(0.4 + Math.random() * 0.5);
        const life = (near ? 3000 : 1500) + Math.random() * (near ? 2000 : 1500);
        setTimeout(() => {
          c.element.textContent = '';
          c.element.classList.remove('pulse', 'wave');
        }, life);
      }
    }
  }

  function matrixFall() {
    if (Math.random() > 0.97) {
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

  build();
  setInterval(updateGlyphs, 80);
  setInterval(matrixFall, 200);
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initGlyphGrid, { once: true });
} else {
  initGlyphGrid();
}

