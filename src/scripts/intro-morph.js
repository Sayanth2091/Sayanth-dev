// One-time intro text morph overlay
(function(){
  const KEY = 'intro_shown';
  const onHome = location.pathname === '/' || location.pathname === '/index.html';
  const first = localStorage.getItem(KEY) !== '1';
  if (!onHome){
    // Only show intro on home
    dispatchEvent(new CustomEvent('app:intro-done'));
    return;
  }

  const overlay = document.createElement('div');
  overlay.id = 'intro';
  overlay.innerHTML = '<div class="intro-inner"><div class="intro-text" id="introText"></div></div>';
  document.body.appendChild(overlay);
  document.documentElement.classList.add('lock');
  document.body.classList.add('lock');

  const el = overlay.querySelector('#introText');
  const from = 'Sayanth Sreekanth';
  const to = 'SKYWALKR_2091';
  const glyphs = '!<>-_\/[]{}—=+*^?#________CYBERHEX2091';
  let frame = 0;
  const chars = Math.max(from.length, to.length);
  const queue = [];
  for (let i = 0; i < chars; i++) {
    const fromCh = from[i] || ' ';
    const toCh = to[i] || ' ';
    // Even longer morph: start 20–60, end 60–120 after start (~1.3s–3s)
    const start = 20 + Math.floor(Math.random()*40);
    const end = start + 60 + Math.floor(Math.random()*60);
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
      document.documentElement.classList.remove('lock');
      document.body.classList.remove('lock');
      dispatchEvent(new CustomEvent('app:intro-done'));
    }, 300);
  }

  // Allow user to skip
  overlay.addEventListener('click', finish, { passive: true });
  addEventListener('keydown', (e)=>{ if (e.key === 'Escape') finish(); });

  // Always show morph on home; user can click/Esc to skip
  function tick(){
    const done = update();
    if (!done){ requestAnimationFrame(tick); return; }
    setTimeout(finish, 700);
  }
  requestAnimationFrame(tick);
})();
