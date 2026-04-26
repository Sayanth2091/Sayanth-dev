import { audio } from './audio';

let lastTick = 0;

document.addEventListener('mouseover', (e) => {
  const target = e.target as HTMLElement;
  if (!target.matches('a, button, input, textarea, [data-interactive]')) return;
  const now = performance.now();
  if (now - lastTick < 80) return; // throttle: max one tick per 80ms
  lastTick = now;
  audio.play('tick', { volume: 0.3, pitch: 0.95 + Math.random() * 0.1 });
});
