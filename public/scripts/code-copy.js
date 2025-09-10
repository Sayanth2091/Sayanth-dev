document.querySelectorAll('.prose pre').forEach(pre => {
  if (pre.querySelector('.copy-btn')) return;
  const btn = document.createElement('button');
  btn.className = 'copy-btn';
  btn.type = 'button';
  btn.ariaLabel = 'Copy code';
  btn.textContent = 'Copy';
  btn.addEventListener('click', async () => {
    const code = pre.querySelector('code');
    if (!code) return;
    try { await navigator.clipboard.writeText(code.textContent || ''); btn.textContent = 'Copied!'; setTimeout(()=> btn.textContent='Copy', 1200); } catch {}
  });
  pre.prepend(btn);
});

