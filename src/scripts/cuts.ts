import './scroll';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const cutSections = [
  { id: 'hero', cut: 0 },
  { id: 'dossier', cut: 1 },
  { id: 'operations', cut: 2 },
  { id: 'arsenal',    cut: 3 },
  // step 07 adds cut 4, step 08 adds cut 5
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

function dispatchCut(value: number) {
  window.dispatchEvent(
    new CustomEvent('null-sector:cut-progress', { detail: { value } })
  );
}
