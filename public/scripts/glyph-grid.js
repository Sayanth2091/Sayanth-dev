// Enhanced GlyphGrid with dynamic effects for all pages
const grid = document.getElementById('glyph-grid');

if (grid) {
  const cyber = 'HACKR BYTEC0DE CYBERPHX 2091 SKYWALKR';
  const base = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789{}[]()<>+-/*=|&!?:;%$#~^.,_`"\'';
  const math = 'I�I�I3I"IcI?I�A�I,I+I^I��^z�%��%^�%\u000f�%�A�^Z�^\u0015�^"�S\u0007�S-�ST�^^�^%�^.�^s�^��^,�^+�^�A�A,A~';
  const arrows = '�+?�+`�+'�+"��?��`��'��"�Y"�Yc�Y��Y�';
  const box = '�"?�",�"O�"?�""�"~�"o�"\u000f�"��"'�"��\u00073�\u0007�\u0007��-?�-,�-^�-O�-?�-`�-'�-"';
  const kana = 'a,�a,\u000fa,�a,"a,�a,�a,-a,_a,�a,3a,�a,�a,1a,�a,�a,�a�?a�,a�+a�^a�Sa�<a�Oa�?a�Za�?a�'a�\u0007a�~a�>a�za�Ya��a��a��a�\u000fa��a�"a�ca��a��a��a�-a�_a��a�3';
  const glyphs = Array.from(cyber + base + math + arrows + box + kana);

  const cellSize = 18;
  let columns = Math.floor(window.innerWidth / cellSize);
  let rows = Math.floor(window.innerHeight / cellSize);

  let cells = [];
  let mouseX = 0;
  let mouseY = 0;

  function initGrid() {
    grid.innerHTML = '';
    cells = [];
    columns = Math.floor(window.innerWidth / cellSize);
    rows = Math.floor(window.innerHeight / cellSize);
    grid.style.display = 'grid';
    grid.style.gridTemplateColumns = `repeat(${columns}, ${cellSize}px)`;
    grid.style.gridTemplateRows = `repeat(${rows}, ${cellSize}px)`;
    for (let i = 0; i < columns * rows; i++) {
      const cell = document.createElement('div');
      cell.className = 'glyph-cell';
      cell.style.userSelect = 'none';
      grid.appendChild(cell);
      cells.push({ element: cell, x: i % columns, y: Math.floor(i / columns), lastUpdate: 0, isActive: false });
    }
  }

  const colorSchemes = [
    ['#29f2ff', '#2ccce6', '#66deff'],
    ['#b866ff', '#a355ff', '#d480ff'],
    ['#1aff99', '#1ad67a', '#4dffbb'],
    ['#ff8585', '#ff6b6b', '#ff9999'],
  ];

  function getDistance(x1, y1, x2, y2) {
    return Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
  }

  function updateGlyphs() {
    const currentTime = Date.now();
    const mouseGridX = Math.floor(mouseX / cellSize);
    const mouseGridY = Math.floor(mouseY / cellSize);
    for (let i = 0; i < cells.length; i++) {
      const cell = cells[i];
      const distanceFromMouse = getDistance(cell.x, cell.y, mouseGridX, mouseGridY);
      const isNearMouse = distanceFromMouse < 5;
      const baseChance = isNearMouse ? 0.95 : 0.985;
      if (Math.random() > baseChance) {
        const randomGlyph = glyphs[Math.floor(Math.random() * glyphs.length)];
        const colorScheme = colorSchemes[Math.floor(Math.random() * colorSchemes.length)];
        const color = colorScheme[Math.floor(Math.random() * colorScheme.length)];
        cell.element.textContent = randomGlyph;
        cell.element.style.color = color;
        cell.isActive = true;
        cell.lastUpdate = currentTime;
        const effects = ['pulse', 'wave'];
        const effect = effects[Math.floor(Math.random() * effects.length)];
        cell.element.classList.remove('pulse', 'wave');
        cell.element.classList.add(effect);
        const opacity = isNearMouse ? 1.0 : 0.4 + Math.random() * 0.5;
        cell.element.style.opacity = opacity;
        const lifetime = isNearMouse ? 3000 + Math.random() * 2000 : 1500 + Math.random() * 1500;
        setTimeout(() => {
          if (cell.element) {
            cell.element.textContent = '';
            cell.element.classList.remove('pulse', 'wave');
            cell.isActive = false;
          }
        }, lifetime);
      }
    }
  }

  function createMatrixFall() {
    if (Math.random() > 0.97) {
      const column = Math.floor(Math.random() * columns);
      const fallElement = document.createElement('div');
      fallElement.textContent = glyphs[Math.floor(Math.random() * glyphs.length)];
      fallElement.style.position = 'absolute';
      fallElement.style.left = `${column * cellSize}px`;
      fallElement.style.top = '0px';
      fallElement.style.color = '#29f2ff';
      fallElement.style.fontSize = '14px';
      fallElement.style.animation = 'matrixFall 3s linear forwards';
      fallElement.style.pointerEvents = 'none';
      fallElement.style.zIndex = '1';
      grid.appendChild(fallElement);
      setTimeout(() => { if (fallElement.parentNode) fallElement.parentNode.removeChild(fallElement); }, 3000);
    }
  }

  document.addEventListener('mousemove', (e) => { mouseX = e.clientX; mouseY = e.clientY; });
  window.addEventListener('resize', () => { initGrid(); });
  initGrid();
  setInterval(updateGlyphs, 80);
  setInterval(createMatrixFall, 200);
}

