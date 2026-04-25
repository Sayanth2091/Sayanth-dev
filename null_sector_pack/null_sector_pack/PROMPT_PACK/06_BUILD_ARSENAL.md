# 06 — BUILD THE ARSENAL (THIRD CUT)

> Section 4. The skills section, but never as bars. A 3D constellation of skill nodes connected by faint lines. The shard advances to State 3 here.

---

## What this step builds

- `src/components/Arsenal.astro` — the section
- `src/components/Constellation.tsx` — a separate R3F scene mounted in this section
- The skill data structure
- Cut 3 trigger

---

## The prompt — paste into Sonnet/Haiku

````
Build the Arsenal section of NULL_SECTOR. Build step 06 of 10.

Read 00_NARRATIVE_BIBLE.md first. Section 11 explicitly bans skill bars. Do not, under any circumstances, render percentage bars. The arsenal is a 3D constellation.

WHAT TO BUILD:

1. `src/components/Arsenal.astro` — the section wrapper
2. `src/components/Constellation.tsx` — a NEW React Three Fiber scene (separate Canvas from the shard)
3. `src/data/skills.ts` — the skill data
4. Cut 3 trigger added

LAYOUT:

Full viewport, single column, centered.

Top of section (small mono):
> SECTION 04 // THE ARSENAL

Headline (serif):
"Tools are vocabulary."
Italicized line below:
"The grammar is what matters."

Then the constellation, taking 70vh, full width.

Bottom mono caption:
[ HOVER A NODE TO READ ]

THE CONSTELLATION:

A separate Three.js Canvas mounted in the middle of the section, NOT the same one as the shard. The Canvas is 100vw x 70vh.

Skill data structure (`src/data/skills.ts`):

```ts
export interface Skill {
  id: string;
  name: string;
  category: 'defense' | 'offense' | 'engineering' | 'creative';
  description: string;     // 1-sentence mono caption shown on hover
  position: [number, number, number];  // pre-computed 3D position
  connections: string[];   // ids of related skills
}

export const skills: Skill[] = [
  // DEFENSE — clustered upper-left
  { id: 'soc',       name: 'SOC monitoring',        category: 'defense', description: 'Two years of alerts. Patterns become instinct.', position: [-3, 2, 0], connections: ['siem', 'mitre', 'ir'] },
  { id: 'siem',      name: 'SIEM analysis',          category: 'defense', description: 'AlienVault USM. ELK. Search until the noise speaks.', position: [-2.2, 2.6, 0.5], connections: ['soc', 'detection'] },
  { id: 'mitre',     name: 'MITRE ATT&CK',           category: 'defense', description: 'A framework for naming what you see.', position: [-3.5, 1.2, -0.3], connections: ['soc', 'threat'] },
  { id: 'ir',        name: 'incident response',      category: 'defense', description: 'Containment first. Forensics second.', position: [-2.5, 1.6, 0.8], connections: ['soc', 'forensics'] },
  { id: 'detection', name: 'detection engineering',  category: 'defense', description: 'Write the rule. Tune the rule. Trust the rule.', position: [-1.8, 2.2, -0.4], connections: ['siem', 'soc'] },
  { id: 'forensics', name: 'forensics',              category: 'defense', description: 'What happened. When. To whom.', position: [-3.2, 0.8, 0.6], connections: ['ir', 'mitre'] },
  { id: 'threat',    name: 'threat hunting',         category: 'defense', description: 'Assume breach. Look for ghosts.', position: [-2.8, 0.4, -0.8], connections: ['mitre', 'detection'] },

  // OFFENSE — clustered upper-right
  { id: 'pentest',   name: 'penetration testing',    category: 'offense', description: 'Validating defense by violating it.', position: [3, 2, 0], connections: ['recon', 'exploit'] },
  { id: 'recon',     name: 'reconnaissance',         category: 'offense', description: 'Most attacks succeed before they begin.', position: [2.4, 2.8, -0.4], connections: ['pentest'] },
  { id: 'exploit',   name: 'exploitation',           category: 'offense', description: 'A known vulnerability is not a vulnerability for long.', position: [3.5, 1.4, 0.5], connections: ['pentest', 'redteam'] },
  { id: 'redteam',   name: 'adversarial mindset',    category: 'offense', description: 'Ask: how would I attack this?', position: [2.7, 0.6, -0.6], connections: ['exploit', 'pentest'] },

  // ENGINEERING — clustered lower-center
  { id: 'python',    name: 'python',                  category: 'engineering', description: 'The lingua franca of automation.', position: [0, -1, 0.4], connections: ['n8n', 'api', 'docker'] },
  { id: 'n8n',       name: 'n8n',                     category: 'engineering', description: 'Workflows that survive their author.', position: [-0.8, -1.4, -0.3], connections: ['python', 'api'] },
  { id: 'docker',    name: 'docker',                  category: 'engineering', description: 'Reproducible everything.', position: [0.8, -1.6, 0.2], connections: ['python', 'linux'] },
  { id: 'linux',     name: 'linux',                   category: 'engineering', description: 'Where the work actually happens.', position: [1.4, -0.8, -0.5], connections: ['docker', 'iptables'] },
  { id: 'iptables',  name: 'iptables',                category: 'engineering', description: 'The oldest firewall. Still the strictest.', position: [-1.6, -0.4, 0.7], connections: ['linux', 'antibody'] },
  { id: 'api',       name: 'fastapi',                 category: 'engineering', description: 'Where logic meets the network.', position: [0.4, -2.2, -0.4], connections: ['python', 'docker'] },

  // CREATIVE — clustered far-right
  { id: 'astro',     name: 'astro · next',            category: 'creative', description: 'Frontends that load fast and look slow.', position: [4, 0, 0.5], connections: ['react', 'flutter'] },
  { id: 'react',     name: 'react · r3f',             category: 'creative', description: 'For the moments words can't carry.', position: [4.4, -0.8, -0.3], connections: ['astro', 'three'] },
  { id: 'three',     name: 'three.js · gsap',         category: 'creative', description: 'Math, but cinematic.', position: [4.8, 0.6, 0.4], connections: ['react'] },
  { id: 'flutter',   name: 'flutter',                 category: 'creative', description: 'For when the work needs a phone home.', position: [3.6, -1.4, -0.6], connections: ['astro'] },
];
```

THE CONSTELLATION COMPONENT:

```tsx
// src/components/Constellation.tsx
import { Canvas, useFrame } from '@react-three/fiber';
import { useRef, useState, useMemo } from 'react';
import * as THREE from 'three';
import { skills } from '../data/skills';

const categoryColors = {
  defense:     '#7DF9FF',
  offense:     '#FF6B6B',
  engineering: '#FFFFFF',
  creative:    '#B7B5FF',
};

function Nodes({ onHover }: { onHover: (id: string | null) => void }) {
  const groupRef = useRef<THREE.Group>(null!);

  useFrame((_, dt) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += dt * 0.05;
    }
  });

  return (
    <group ref={groupRef}>
      {/* lines first, behind nodes */}
      {skills.map((skill) =>
        skill.connections.map((targetId) => {
          const target = skills.find((s) => s.id === targetId);
          if (!target) return null;
          const points = [
            new THREE.Vector3(...skill.position),
            new THREE.Vector3(...target.position),
          ];
          const geometry = new THREE.BufferGeometry().setFromPoints(points);
          return (
            <line key={`${skill.id}-${targetId}`}>
              <bufferGeometry attach="geometry" {...geometry} />
              <lineBasicMaterial color="#FFFFFF" transparent opacity={0.08} />
            </line>
          );
        })
      )}

      {/* nodes */}
      {skills.map((skill) => (
        <mesh
          key={skill.id}
          position={skill.position}
          onPointerOver={(e) => { e.stopPropagation(); onHover(skill.id); document.body.style.cursor = 'pointer'; }}
          onPointerOut={() => { onHover(null); document.body.style.cursor = 'auto'; }}
        >
          <sphereGeometry args={[0.08, 16, 16]} />
          <meshBasicMaterial color={categoryColors[skill.category]} />
        </mesh>
      ))}
    </group>
  );
}

export default function Constellation() {
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const hovered = hoveredId ? skills.find((s) => s.id === hoveredId) : null;

  return (
    <div className="relative w-full h-full">
      <Canvas camera={{ position: [0, 0, 10], fov: 45 }}>
        <ambientLight intensity={0.3} />
        <pointLight position={[5, 5, 5]} intensity={0.5} />
        <Nodes onHover={setHoveredId} />
      </Canvas>

      {hovered && (
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 max-w-[480px] text-center pointer-events-none">
          <div className="font-mono text-[10px] text-fg-low tracking-mono-wide mb-1">
            [ {hovered.category.toUpperCase()} ]
          </div>
          <div className="font-serif italic text-fg-high text-[24px] mb-2">
            {hovered.name}
          </div>
          <div className="font-mono text-[12px] text-fg-mid leading-[1.6]">
            {hovered.description}
          </div>
        </div>
      )}

      <div className="absolute top-4 left-6 font-mono text-[10px] text-fg-low tracking-mono-wide">
        [ {skills.length} NODES // {Object.keys(categoryColors).length} CATEGORIES ]
      </div>

      <div className="absolute top-4 right-6 font-mono text-[10px] text-fg-low tracking-mono-wide flex flex-col gap-1">
        {Object.entries(categoryColors).map(([cat, color]) => (
          <div key={cat} className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full" style={{ background: color }} />
            <span>{cat}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
```

THE SECTION COMPONENT (`src/components/Arsenal.astro`):

```astro
---
import Constellation from './Constellation.tsx';
---

<section id="arsenal" class="relative min-h-screen flex flex-col items-center justify-center py-24">
  <div class="text-center max-w-[720px] px-6 mb-12">
    <div class="font-mono text-[11px] text-fg-low tracking-mono-wide mb-6">
      &gt; SECTION 04 // THE ARSENAL
    </div>
    <h2 class="font-serif text-fg-high text-[clamp(40px,6vw,72px)] leading-[1.05]">
      Tools are vocabulary.
    </h2>
    <h2 class="font-serif italic text-fg-high text-[clamp(40px,6vw,72px)] leading-[1.05]">
      The grammar is what matters.
    </h2>
  </div>

  <div class="w-full" style="height: 70vh;">
    <Constellation client:visible />
  </div>

  <div class="mt-8 font-mono text-[10px] text-fg-low tracking-mono-wide">
    [ HOVER A NODE TO READ ]
  </div>
</section>
```

CUT 3 TRIGGER (add to `src/scripts/cuts.ts`):

```ts
{ id: 'arsenal', cut: 3 },
```

ADD TO `src/pages/index.astro`:

```astro
---
import Hero from '../components/Hero.astro';
import Dossier from '../components/Dossier.astro';
import Operations from '../components/Operations.astro';
import Arsenal from '../components/Arsenal.astro';
---
<Hero />
<Dossier />
<Operations />
<Arsenal />
```

CONSTRAINTS:
- The constellation Canvas is SEPARATE from the shard's Canvas. Two R3F instances on one page is fine.
- Performance: only 22 nodes and ~50 lines. This should run at 60fps anywhere.
- Mobile: keep the constellation but reduce node size to 0.06 and adjust camera to position [0, 0, 12] for a wider view. Touch should also trigger hover.
- The hovered tooltip slides up from below with 200ms ease.
- Categories are color-coded but the colors are SUBTLE — none brighter than the fg-high white. The accent cyan is reserved for "defense" because that's your primary identity.

DELIVERABLES:
1. File tree
2. All file contents
3. Verification checklist
4. Commit message: "step-06: arsenal — constellation, third cut"

Begin.
````

---

## Verification checklist

- [ ] The constellation renders in a 70vh canvas
- [ ] 22 colored nodes, slowly rotating as a group
- [ ] Faint lines connect related skills
- [ ] Hovering a node shows the description in a tooltip below
- [ ] Categories are differentiated by color (cyan = defense, etc.)
- [ ] A category legend appears in the top-right
- [ ] Shard advances to State 3 when entering Arsenal
- [ ] Side nav fourth dot is active in Arsenal
- [ ] No console errors

## Token cost estimate

Sonnet: ~10k in / 12k out
Haiku: ~10k in / 18k out

## Commit and continue

```bash
git add .
git commit -m "step-06: arsenal — constellation, third cut"
git push
```

Move to `07_BUILD_TRANSMISSION.md`.
