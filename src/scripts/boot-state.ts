// boot-state.ts — gate animations on the boot sequence finishing.
// Resolves immediately if the user has already booted in this session.

export const BOOT_EVENT = 'null-sector:boot-complete';

export function onBootComplete(cb: () => void): void {
  if (typeof window === 'undefined') return;
  if (sessionStorage.getItem('null-sector-booted')) {
    cb();
    return;
  }
  window.addEventListener(BOOT_EVENT, () => cb(), { once: true });
}
