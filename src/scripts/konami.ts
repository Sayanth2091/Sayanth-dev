const SEQUENCE = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
let buffer: string[] = [];

window.addEventListener('keydown', (e) => {
  // don't intercept while typing in a form field
  const t = e.target as HTMLElement;
  if (t.tagName === 'INPUT' || t.tagName === 'TEXTAREA') return;

  buffer.push(e.key);
  if (buffer.length > SEQUENCE.length) buffer.shift();

  if (buffer.join(',').toLowerCase() === SEQUENCE.join(',').toLowerCase()) {
    buffer = [];
    const base = import.meta.env.BASE_URL.replace(/\/$/, '');
    window.location.href = `${base}/classified`;
  }
});
