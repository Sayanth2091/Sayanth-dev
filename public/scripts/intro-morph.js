// Intro text morph overlay
(function(){
  const KEY = 'intro_shown';
  const onHome = location.pathname === '/' || location.pathname === '/index.html';
  
  if (!onHome){
    // Only show intro on home
    dispatchEvent(new CustomEvent('app:intro-done'));
    return;
  }
  
  // Respect one-time display using localStorage (remove KEY to force again)

  const overlay = document.createElement('div');
  overlay.id = 'intro';
  overlay.innerHTML = '<div class="intro-inner"><div class="intro-text" id="introText"></div></div>';
  document.body.appendChild(overlay);
  // Remove screen lock for debugging
  // document.documentElement.classList.add('lock');
  // document.body.classList.add('lock');

  const el = overlay.querySelector('#introText');
  const from = 'Sayanth Sreekanth';
  const to = 'SKYWALKR_2091';
  const glyphs = '!<>-_\\/[]{}=+*^?#CYBERHEX2091_';
  let frame = 0;
  const chars = Math.max(from.length, to.length);
  const queue = [];
  for (let i = 0; i < chars; i++) {
    const fromCh = from[i] || ' ';
    const toCh = to[i] || ' ';
    // Slower, more visible morph: start 10-30, duration 30-60 frames
    const start = 10 + Math.floor(Math.random()*20);
    const duration = 30 + Math.floor(Math.random()*30);
    const end = start + duration;
    queue.push({ from: fromCh, to: toCh, start, end, char: '' });
  }

  function randomChar(){ return glyphs[Math.floor(Math.random()*glyphs.length)]; }

  function update(){
    let out = '';
    let complete = 0;
    for (let i = 0; i < queue.length; i++){
      const { from, to, start, end } = queue[i];
      if (frame < start) {
        out += from;
      } else if (frame >= end) {
        out += to; complete++;
      } else {
        out += `<span class="d">${randomChar()}</span>`;
      }
    }
    el.innerHTML = out;
    frame++;
    return complete === queue.length;
  }

  // Phase 1: scramble from name to SKY…
  let finished = false;
  function finish(){
    if (finished) return; finished = true;
    overlay.classList.add('hide');
    localStorage.setItem(KEY, '1');
    setTimeout(()=>{
      overlay.remove();
      // document.documentElement.classList.remove('lock');
      // document.body.classList.remove('lock');
      dispatchEvent(new CustomEvent('app:intro-done'));
    }, 300);
  }

  // Allow user to skip
  overlay.addEventListener('click', finish, { passive: true });
  addEventListener('keydown', (e)=>{ if (e.key === 'Escape') finish(); });

  // Show initial state
  update();
  
  // Always show morph on home; user can click/Esc to skip
  function tick(){
    const done = update();
    if (!done){ 
      setTimeout(tick, 50); // Slow down animation - 20fps instead of 60fps
      return; 
    }
    setTimeout(finish, 1000); // Show final result longer
  }
  
  // Start animation after a brief delay
  setTimeout(tick, 200);
})();

