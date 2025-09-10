const PAGES = [
  { label: 'Home', href: '/' },
  { label: 'Projects', href: '/projects' },
  { label: 'Blog', href: '/blog' },
  { label: 'About', href: '/about' },
];

function getInPageTargets() {
  const targets = [];
  document.querySelectorAll('section[id] h2').forEach(h2 => {
    const section = h2.closest('section');
    if (!section || !section.id) return;
    targets.push({ label: `Section: ${h2.textContent?.trim() || section.id}`, href: `#${section.id}` });
  });
  return targets;
}

function createPalette() {
  if (document.getElementById('cmdk')) return;
  const wrap = document.createElement('div');
  wrap.id = 'cmdk';
  wrap.innerHTML = `
    <div class="cmdk-backdrop" data-cmdk-backdrop hidden></div>
    <div class="cmdk-panel" role="dialog" aria-modal="true" hidden>
      <div class="cmdk-input-row">
        <input type="text" class="cmdk-input" placeholder="Search pages and sections…" aria-label="Command palette" />
        <kbd class="cmdk-kbd">Esc</kbd>
      </div>
      <ul class="cmdk-list" role="listbox" aria-label="Results"></ul>
      <div class="cmdk-hint">Use ↑/↓ to navigate • Enter to go</div>
    </div>
  `;
  document.body.appendChild(wrap);
}

function fuzzyMatch(query, label) {
  query = query.toLowerCase();
  label = label.toLowerCase();
  let qi = 0;
  for (let i = 0; i < label.length && qi < query.length; i++) {
    if (label[i] === query[qi]) qi++;
  }
  return qi === query.length;
}

function openPalette() {
  createPalette();
  const panel = document.querySelector('.cmdk-panel');
  const backdrop = document.querySelector('[data-cmdk-backdrop]');
  const input = document.querySelector('.cmdk-input');
  const list = document.querySelector('.cmdk-list');
  const opts = [...PAGES, ...getInPageTargets()];
  function render(q=''){
    const items = opts.filter(o => fuzzyMatch(q, o.label));
    list.innerHTML = items.map((o,i)=> `<li data-i="${i}" tabindex="0">${o.label}</li>`).join('');
  }
  render('');
  panel.hidden = false; backdrop.hidden = false; input.value=''; input.focus();
  function close(){ panel.hidden = true; backdrop.hidden = true; list.innerHTML=''; }
  input.oninput = () => render(input.value);
  input.onkeydown = (e) => {
    const focusables = list.querySelectorAll('li');
    const cur = document.activeElement;
    let idx = Array.from(focusables).indexOf(cur);
    if (e.key === 'ArrowDown'){ e.preventDefault(); idx = Math.min(focusables.length-1, idx+1); focusables[idx]?.focus(); }
    else if (e.key === 'ArrowUp'){ e.preventDefault(); idx = Math.max(0, idx-1); focusables[idx]?.focus(); }
    else if (e.key === 'Enter') { const i = cur?.dataset?.i ?? '0'; const item = opts.filter(o=>fuzzyMatch(input.value, o.label))[Number(i)] || opts[0]; if (item) location.href = item.href; close(); }
    else if (e.key === 'Escape'){ close(); }
  };
  backdrop.onclick = close;
}

document.addEventListener('keydown', (e) => {
  if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') { e.preventDefault(); openPalette(); }
});

