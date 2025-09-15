(function(){
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const el = document.getElementById('pre-text');
  const cur = document.querySelector('.pre-cursor');
  if (!el) return;
  const SRC = 'Sayanth Sreekanth';
  const DST = 'Skywalkr_2091';
  if (reduce) { el.textContent = DST; return; }
  const CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789_';
  const DURATION = 4200;
  const PHASE_STABLE = 450;
  const N = Math.max(SRC.length, DST.length);
  const srcArr = Array.from(SRC.padEnd(N, ' '));
  const dstArr = Array.from(DST.padEnd(N, ' '));
  const settle = new Array(N);
  const now0 = performance.now();
  for (let i = 0; i < N; i++) { const base = PHASE_STABLE + (i / N) * (DURATION - PHASE_STABLE - 200); settle[i] = base + Math.random() * 140; }
  function r(){ return CHARS[(Math.random() * CHARS.length) | 0]; }
  function render(ts){
    const t = ts - now0;
    if (t < PHASE_STABLE) { el.innerHTML = srcArr.join('').replace(/ /g,'&nbsp;'); requestAnimationFrame(render); return; }
    const out = new Array(N);
    for (let i = 0; i < N; i++) { out[i] = (t >= settle[i]) ? dstArr[i] : ((Math.random() < 0.25) ? srcArr[i] : r()); }
    el.innerHTML = out.join('').replace(/ /g,'&nbsp;');
    if (t < DURATION) requestAnimationFrame(render); else el.innerHTML = dstArr.join('').replace(/ /g,'&nbsp;');
  }
  if (cur) setInterval(()=> cur.classList.toggle('on'), 420);
  requestAnimationFrame(render);
})();

