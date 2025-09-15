// basic reveal: respects body.ready
(function(){
  function setupReveals(){
    const io = new IntersectionObserver((entries)=>{
      entries.forEach(e=>{ if(e.isIntersecting) e.target.classList.add('in'); });
    }, { threshold: 0.1 });
    document.querySelectorAll('[data-reveal]').forEach(el=> io.observe(el));
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', setupReveals, { once:true }); else setupReveals();
})();

