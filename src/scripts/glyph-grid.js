// Enhanced GlyphGrid with dynamic effects for all pages
const grid = document.getElementById('glyph-grid');

if (grid) {
  // Enhanced glyph sets with cyberpunk theme
  const cyber = 'HACKR BYTEC0DE CYBERPHX 2091 SKYWALKR';
  const base = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789{}[]()<>+-/*=|&!?:;%$#~^.,_`"\'';
  const math = 'αβγΔΩπλµτφψΣ∞≠≈≤≥±∎∧∨⊕⊗⊙∈∉∅√∫∂∆∇°øØ';
  const arrows = '←↑→↓⇐⇑⇒⇓⟨⟩⟪⟫';
  const box = '─│┌┐└┘├┤┬┴┼╳╱╲▀▄█▌▐░▒▓';
  const kana = 'アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン';
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
      cells.push({
        element: cell,
        x: i % columns,
        y: Math.floor(i / columns),
        lastUpdate: 0,
        isActive: false
      });
    }
  }

  // Color schemes for different effects (20% brighter)
  const colorSchemes = [
    ['#29f2ff', '#2ccce6', '#66deff'],  // Cyan variations (brighter)
    ['#b866ff', '#a355ff', '#d480ff'],  // Purple variations (brighter)
    ['#1aff99', '#1ad67a', '#4dffbb'],  // Green variations (brighter)
    ['#ff8585', '#ff6b6b', '#ff9999'],  // Red variations (brighter)
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
      
      // Increased activity near mouse
      const baseChance = isNearMouse ? 0.95 : 0.985;
      
      if (Math.random() > baseChance) {
        const randomGlyph = glyphs[Math.floor(Math.random() * glyphs.length)];
        const colorScheme = colorSchemes[Math.floor(Math.random() * colorSchemes.length)];
        const color = colorScheme[Math.floor(Math.random() * colorScheme.length)];
        
        cell.element.textContent = randomGlyph;
        cell.element.style.color = color;
        cell.isActive = true;
        cell.lastUpdate = currentTime;
        
        // Add random animation effects
        const effects = ['pulse', 'wave'];
        const effect = effects[Math.floor(Math.random() * effects.length)];
        cell.element.classList.remove('pulse', 'wave');
        cell.element.classList.add(effect);
        
        // Set opacity based on distance from mouse (30% brighter total)
        const opacity = isNearMouse ? 1.0 : 0.4 + Math.random() * 0.5;
        cell.element.style.opacity = opacity;
        
        // Clear the glyph after some time
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

  // Matrix-style falling characters effect
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
      
      setTimeout(() => {
        if (fallElement.parentNode) {
          fallElement.parentNode.removeChild(fallElement);
        }
      }, 3000);
    }
  }

  // Track mouse movement
  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  });

  // Handle window resize
  window.addEventListener('resize', () => {
    initGrid();
  });

  // Initialize and start animations
  initGrid();
  setInterval(updateGlyphs, 80);
  setInterval(createMatrixFall, 200);
}
