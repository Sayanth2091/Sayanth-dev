// Cycle the tab title while the page is backgrounded so the visitor sees the
// system "lose signal" when they tab away. Restores the original on focus.
const ORIGINAL = document.title;
const AWAY = '[ SIGNAL LOST ] // NULL_SECTOR';

let interval: number | null = null;
let toggled = false;

function startCycle() {
  if (interval !== null) return;
  toggled = false;
  interval = window.setInterval(() => {
    document.title = toggled ? ORIGINAL : AWAY;
    toggled = !toggled;
  }, 1400);
}

function stopCycle() {
  if (interval !== null) {
    window.clearInterval(interval);
    interval = null;
  }
  document.title = ORIGINAL;
}

document.addEventListener('visibilitychange', () => {
  if (document.hidden) startCycle();
  else stopCycle();
});
