// Intro text morph overlay
(function(){
  const KEY = 'intro_shown';
  const onHome = location.pathname === '/' || location.pathname === '/index.html';
  if (!onHome){ dispatchEvent(new CustomEvent('app:intro-done')); return; }
  localStorage.removeItem(KEY);
  const overlay = document.createElement('div');
  overlay.id = 'intro';
  overlay.innerHTML = '<div class="intro-inner"><div class="intro-text" id="introText"></div></div>';
  document.body.appendChild(overlay);
  const el = overlay.querySelector('#introText');
  const from = 'Sayanth Sreekanth';
  const to = 'SKYWALKR_2091';
  const glyphs = '!<>-_\\/[]{}�?"=+*^?#________CYBERHEX2091';
  let frame = 0;
  const chars = Math.max(from.length, to.length);
  const queue = [];
  for (let i = 0; i < chars; i++) {
    const fromCh = from[i] || ' ';
    const toCh = to[i] || ' ';
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
      if (frame < start) out += from; else if (frame >= end) { out += to; complete++; } else { out += `<span class="d">${randomChar()}</span>`; }
    }
    el.innerHTML = out;
    console.log(`Frame ${frame}: "${out.replace(/<[^>]*>/g, '')}" (${complete}/${queue.length} complete)`);
    frame++;
    return complete === queue.length;
  }
  let finished = false;
  function finish(){ if (finished) return; finished = true; overlay.classList.add('hide'); localStorage.setItem(KEY, '1'); setTimeout(()=>{ overlay.remove(); dispatchEvent(new CustomEvent('app:intro-done')); }, 300); }
  overlay.addEventListener('click', finish, { passive: true });
  addEventListener('keydown', (e)=>{ if (e.key === 'Escape') finish(); });
  update();
  function tick(){ const done = update(); if (!done){ setTimeout(tick, 50); return; } setTimeout(finish, 1000); }
  setTimeout(tick, 200);
})();

