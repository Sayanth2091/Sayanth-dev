// Reduced effects toggle: disables heavy 3D effects (starfield, holograms)
(function(){
  const KEY = 'reduce_effects';
  function applySetting(){
    try {
      const on = localStorage.getItem(KEY) === '1' || matchMedia('(prefers-reduced-motion: reduce)').matches;
      document.documentElement.classList.toggle('reduced-effects', on);
      const btns = document.querySelectorAll('[data-fx-toggle] .txt');
      btns.forEach(el => el.textContent = on ? 'FX: Low' : 'FX: On');
    } catch {}
  }
  function toggle(){
    try {
      const on = document.documentElement.classList.contains('reduced-effects');
      localStorage.setItem(KEY, on ? '0' : '1');
    } catch {}
    // Simple approach: reload so 3D initializers re-check the flag
    location.reload();
  }
  function init(){
    applySetting();
    document.addEventListener('click', (e)=>{
      const t = e.target.closest && e.target.closest('[data-fx-toggle]');
      if (t){ e.preventDefault(); toggle(); }
    });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init, { once:true }); else init();
})();

