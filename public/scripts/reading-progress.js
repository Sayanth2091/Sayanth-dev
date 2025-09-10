function initReadingProgress(){
  const bar = document.getElementById('reading-progress');
  if(!bar) return;
  const update=()=>{
    const scrollable = document.documentElement.scrollHeight - window.innerHeight;
    const scrolled = Math.max(0, Math.min(scrollable, window.scrollY));
    bar.style.width = (scrollable>0? (scrolled/scrollable)*100 : 0) + '%';
  };
  update();
  window.addEventListener('scroll', update, { passive: true });
  window.addEventListener('resize', update);
}
if(document.readyState==='loading') document.addEventListener('DOMContentLoaded', initReadingProgress, { once:true }); else initReadingProgress();
