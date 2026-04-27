import './scroll';
import { audio } from './audio';

// Cuts are driven by SideNav's section-active event so the shard cut state
// stays exactly in sync with the dot indicator. Independent ScrollTriggers
// fired incorrectly during Operations' pinned horizontal scroll because
// downstream section triggers crossed before the user actually reached them.

const SECTION_TO_CUT: Record<string, number> = {
  hero:         0,
  dossier:      1,
  operations:   2,
  arsenal:      3,
  transmission: 4,
  signoff:      5,
};

let lastCut = -1;

function dispatchCut(value: number) {
  if (value === lastCut) return;
  if (value > lastCut && lastCut !== -1) {
    audio.play('cut', { volume: 0.4 });
  }
  lastCut = value;
  window.dispatchEvent(
    new CustomEvent('null-sector:cut-progress', { detail: { value } })
  );
}

window.addEventListener('null-sector:section-active', (e: Event) => {
  const id = (e as CustomEvent).detail?.id as string | undefined;
  if (!id) return;
  const cut = SECTION_TO_CUT[id];
  if (cut !== undefined) dispatchCut(cut);
});
