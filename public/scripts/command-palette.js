// Lightweight command palette: Cmd/Ctrl+K to open, fuzzy filter, Enter to navigate

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

function openPalette() {
  createPalette();
  const panel = document.querySelector('.cmdk-panel');
  const backdrop = document.querySelector('[data-cmdk-backdrop]');
  const input = document.querySelector('.cmdk-input');
  const list = document.querySelector('.cmdk-list');
  if (!panel || !backdrop || !input || !list) return;

  panel.hidden = false;
  backdrop.hidden = false;
  document.documentElement.classList.add('lock');
  document.body.classList.add('lock');
  input.value = '';

  const options = [...PAGES, ...getInPageTargets()].map((o, idx) => ({ ...o, id: String(idx) }));
  renderList(list, options, 0);

  setTimeout(() => input.focus(), 0);

  const onKey = (e) => {
    const items = list.querySelectorAll('[role="option"]');
    let idx = Array.from(items).findIndex(el => el.getAttribute('aria-selected') === 'true');
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      idx = (idx + 1) % items.length;
      selectIndex(items, idx);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      idx = (idx - 1 + items.length) % items.length;
      selectIndex(items, idx);
    } else if (e.key === 'Enter') {
      e.preventDefault();
      const active = list.querySelector('[aria-selected="true"]');
      const href = active && active.getAttribute('data-href');
      if (href) {
        closePalette();
        if (href.startsWith('#')) {
          location.hash = href;
        } else {
          location.href = href;
        }
      }
    } else if (e.key === 'Escape') {
      e.preventDefault();
      closePalette();
    }
  };

  const onInput = () => {
    const q = input.value.trim().toLowerCase();
    const filtered = (q
      ? [...PAGES, ...getInPageTargets()].filter(o => o.label.toLowerCase().includes(q))
      : [...PAGES, ...getInPageTargets()]
    ).map((o, i) => ({ ...o, id: String(i) }));
    renderList(list, filtered, 0);
  };

  input.addEventListener('keydown', onKey);
  input.addEventListener('input', onInput);
  backdrop.addEventListener('click', closePalette, { once: true });

  panel.dataset.listeners = '1';
}

function closePalette() {
  const panel = document.querySelector('.cmdk-panel');
  const backdrop = document.querySelector('[data-cmdk-backdrop]');
  if (!panel || !backdrop) return;
  panel.hidden = true;
  backdrop.hidden = true;
  document.documentElement.classList.remove('lock');
  document.body.classList.remove('lock');
}

function renderList(listEl, items, selectIdx) {
  listEl.innerHTML = items.map((it, i) => `
    <li role="option" tabindex="-1" aria-selected="${i === selectIdx ? 'true' : 'false'}" data-href="${it.href}">
      <span class="cmdk-item-title">${it.label}</span>
      <span class="cmdk-item-sub">${it.href}</span>
    </li>
  `).join('');
  selectIndex(listEl.querySelectorAll('[role="option"]'), selectIdx);
  listEl.querySelectorAll('[role="option"]').forEach((el, i) => {
    el.addEventListener('mousemove', () => selectIndex(listEl.querySelectorAll('[role="option"]'), i));
    el.addEventListener('click', () => {
      const href = el.getAttribute('data-href');
      closePalette();
      if (href) location.href = href;
    });
  });
}

function selectIndex(nodes, idx) {
  nodes.forEach((n, i) => {
    if (i === idx) {
      n.setAttribute('aria-selected', 'true');
      n.scrollIntoView({ block: 'nearest' });
    } else {
      n.setAttribute('aria-selected', 'false');
    }
  });
}

function showKbdHintOnce() {
  if (sessionStorage.getItem('cmdk_hint_shown') === '1') return;
  const hint = document.createElement('div');
  hint.className = 'cmdk-fab-hint';
  const isMac = /Mac|iPhone|iPad/.test(navigator.platform);
  hint.innerHTML = `Press <kbd>${isMac ? '⌘' : 'Ctrl'}</kbd><kbd>K</kbd> for Quick Menu`;
  document.body.appendChild(hint);
  setTimeout(() => { hint.classList.add('hide'); setTimeout(() => hint.remove(), 800); }, 4200);
  sessionStorage.setItem('cmdk_hint_shown', '1');
}

function initPalette() {
  document.addEventListener('keydown', (e) => {
    const isMac = /Mac|iPhone|iPad/.test(navigator.platform);
    const hotkey = (isMac && e.metaKey && e.key.toLowerCase() === 'k') || (!isMac && e.ctrlKey && e.key.toLowerCase() === 'k');
    if (hotkey) { e.preventDefault(); openPalette(); }
    if (e.key === '/' && !e.metaKey && !e.ctrlKey && !e.altKey && !e.shiftKey) {
      // quick open on '/'
      if ((document.activeElement && (document.activeElement.tagName === 'INPUT' || document.activeElement.isContentEditable))) return;
      e.preventDefault(); openPalette();
    }
  });
  showKbdHintOnce();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initPalette, { once: true });
} else {
  initPalette();
}

document.addEventListener('astro:page-load', () => {
  // Recreate in-page targets after navigation
  const panel = document.querySelector('.cmdk-panel');
  if (panel && !panel.hidden) closePalette();
});

