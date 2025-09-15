(function(){
  function setupCodeTyping() {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const pre = entry.target;
          if (pre.dataset.typingInitialized) return;
          pre.dataset.typingInitialized = true;
          typeCode(pre);
          observer.unobserve(pre);
        }
      });
    }, { threshold: 0.2 });

    document.querySelectorAll('.prose pre').forEach(pre => { observer.observe(pre); });
  }
  function typeCode(preElement) {
    const code = preElement.querySelector('code');
    if (!code) return;
    const copyBtn = preElement.querySelector('.copy-btn');
    if (copyBtn) copyBtn.style.visibility = 'hidden';
    const characters = [];
    const treeWalker = document.createTreeWalker(code, NodeFilter.SHOW_TEXT);
    while (treeWalker.nextNode()) {
      const node = treeWalker.currentNode;
      const parentElement = node.parentElement;
      const styles = parentElement.nodeName === 'SPAN' ? parentElement.className : '';
      for (const char of node.textContent) { characters.push({ char, styles }); }
    }
    code.innerHTML = '';
    preElement.classList.add('is-typing');
    const cursor = document.createElement('span');
    cursor.className = 'typing-cursor';
    code.appendChild(cursor);
    let idx = 0; const speed = 50;
    (function tick(){
      if (idx < characters.length) {
        const { char, styles } = characters[idx++];
        if (char === '\n') code.insertBefore(document.createTextNode('\n'), cursor);
        else { const span = document.createElement('span'); if (styles) span.className = styles; span.textContent = char; code.insertBefore(span, cursor); }
        preElement.scrollTop = preElement.scrollHeight;
        setTimeout(tick, Math.random() * speed + 5);
      } else { preElement.classList.remove('is-typing'); cursor.remove(); if (copyBtn) copyBtn.style.visibility = 'visible'; }
    })();
  }
  document.addEventListener('astro:page-load', setupCodeTyping);
  setupCodeTyping();
})();

