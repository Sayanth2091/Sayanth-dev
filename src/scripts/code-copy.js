function setupCodeCopy() {
  document.querySelectorAll('.prose pre').forEach(pre => {
    if (pre.querySelector('.copy-btn')) return; // Already has a button

    const code = pre.querySelector('code');
    if (!code) return;

    const button = document.createElement('button');
    button.className = 'copy-btn';
    button.setAttribute('aria-label', 'Copy code');
    button.innerHTML = '<span>Copy</span><svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"></path></svg>';
    
    pre.appendChild(button);

    button.addEventListener('click', () => {
      const text = code.innerText;
      navigator.clipboard.writeText(text).then(() => {
        button.querySelector('span').innerText = 'Copied!';
        button.setAttribute('data-copied', 'true');
        setTimeout(() => {
          button.querySelector('span').innerText = 'Copy';
          button.removeAttribute('data-copied');
        }, 2000);
      }).catch(err => {
        console.error('Failed to copy text: ', err);
        button.querySelector('span').innerText = 'Error';
      });
    });
  });
}

// Run on initial page load
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', setupCodeCopy, { once: true });
} else {
  setupCodeCopy();
}

// Run on Astro page-load event for subsequent navigations
document.addEventListener('astro:page-load', setupCodeCopy);
