import './scroll';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { audio } from './audio';

gsap.registerPlugin(ScrollTrigger);

const cutSections = [
  { id: 'hero', cut: 0 },
  { id: 'dossier', cut: 1 },
  { id: 'operations', cut: 2 },
  { id: 'arsenal',      cut: 3 },
  { id: 'transmission', cut: 4 },
  { id: 'signoff',      cut: 5 },
];

cutSections.forEach(({ id, cut }) => {
  ScrollTrigger.create({
    trigger: `#${id}`,
    start: 'top 60%',
    end: 'bottom 40%',
    onEnter: () => dispatchCut(cut),
    onEnterBack: () => dispatchCut(cut),
  });
});

let lastCut = -1;

function dispatchCut(value: number) {
  if (value > lastCut && lastCut !== -1) {
    audio.play('cut', { volume: 0.4 });
  }
  lastCut = value;
  window.dispatchEvent(
    new CustomEvent('null-sector:cut-progress', { detail: { value } })
  );
}
