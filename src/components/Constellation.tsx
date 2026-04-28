// Constellation.tsx — 3D skill graph, separate Canvas from the Shard
import { Canvas, useFrame } from '@react-three/fiber';
import { useRef, useState, useMemo, useEffect } from 'react';
import * as THREE from 'three';
import { skills } from '../data/skills';

const CATEGORY_COLORS: Record<string, string> = {
  defense:     '#D4B86A',
  offense:     '#FF6B6B',
  engineering: '#FFFFFF',
  creative:    '#B7B5FF',
};

const HOVER_SCALE = 3;    // hovered node grows to 3× its base size
const LERP_SPEED  = 10;   // scale lerp speed (units/s) — snappy but not instant

// ── intro/loading sequence timings (seconds) ────────────────────────────────
const NODE_SPAWN_DURATION = 0.5; // how long each node takes to grow in
const NODE_SPAWN_WINDOW   = 1.6; // total time across which all nodes spawn
const LINE_FADE_DELAY     = 1.6; // wait for nodes to settle, then draw lines
const LINE_FADE_DURATION  = 1.2; // line draw-in length
const LINE_TARGET_OPACITY = 0.08;

// ── line objects built once, deduped by sorted pair key ──────────────────────
function buildLines() {
  const seen = new Set<string>();
  const lines: Array<{ key: string; obj: THREE.Line }> = [];

  skills.forEach((skill) => {
    skill.connections.forEach((targetId) => {
      const pairKey = [skill.id, targetId].sort().join('|');
      if (seen.has(pairKey)) return;
      seen.add(pairKey);

      const target = skills.find((s) => s.id === targetId);
      if (!target) return;

      const geo = new THREE.BufferGeometry().setFromPoints([
        new THREE.Vector3(...skill.position),
        new THREE.Vector3(...target.position),
      ]);
      const mat = new THREE.LineBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0 });
      lines.push({ key: pairKey, obj: new THREE.Line(geo, mat) });
    });
  });

  return lines;
}

// ── single animated node ──────────────────────────────────────────────────────
function Node({
  skill,
  nodeSize,
  isHovered,
  onHover,
  spawnDelay,
  elapsed,
}: {
  skill: (typeof skills)[number];
  nodeSize: number;
  isHovered: boolean;
  onHover: (id: string | null) => void;
  spawnDelay: number;
  elapsed: { current: number };
}) {
  const meshRef = useRef<THREE.Mesh>(null!);
  const matRef = useRef<THREE.MeshBasicMaterial>(null!);

  useFrame((_, dt) => {
    if (!meshRef.current) return;

    // Spawn easing — clamp 0..1 across NODE_SPAWN_DURATION starting at spawnDelay.
    const t = Math.max(0, Math.min(1, (elapsed.current - spawnDelay) / NODE_SPAWN_DURATION));
    // easeOutBack-ish for a soft "droplet lands" feel
    const eased = t === 0 ? 0 : 1 - Math.pow(1 - t, 3);
    const spawnScale = eased;

    if (matRef.current) matRef.current.opacity = eased;

    const hoverTarget = isHovered ? HOVER_SCALE : 1;
    const current = meshRef.current.scale.x;
    // lerp the hover layer, multiply by spawn factor for the droplet entry
    const lerped = current + (hoverTarget - current) * Math.min(1, dt * LERP_SPEED);
    meshRef.current.scale.setScalar(lerped * spawnScale);
  });

  return (
    <mesh
      ref={meshRef}
      position={skill.position}
      onPointerOver={(e) => {
        e.stopPropagation();
        onHover(skill.id);
        document.getElementById('cursor-ring')?.classList.add('expanded');
      }}
      onPointerOut={() => {
        onHover(null);
        document.getElementById('cursor-ring')?.classList.remove('expanded');
      }}
    >
      <sphereGeometry args={[nodeSize, 16, 16]} />
      <meshBasicMaterial
        ref={matRef}
        color={CATEGORY_COLORS[skill.category]}
        transparent
        opacity={0}
      />
    </mesh>
  );
}

// ── inner scene ──────────────────────────────────────────────────────────────
function ConstellationScene({
  hoveredId,
  onHover,
  nodeSize,
}: {
  hoveredId: string | null;
  onHover: (id: string | null) => void;
  nodeSize: number;
}) {
  const groupRef = useRef<THREE.Group>(null!);
  const lineObjects = useMemo(buildLines, []);
  const elapsed = useRef(0);

  // Per-node spawn delays: deterministic pseudo-random shuffle so droplets
  // appear in a non-linear, organic order across the spawn window.
  const spawnDelays = useMemo(() => {
    const n = skills.length;
    const indices = Array.from({ length: n }, (_, i) => i);
    // simple seeded shuffle (LCG-ish) for stability across renders
    let seed = 1337;
    for (let i = n - 1; i > 0; i--) {
      seed = (seed * 9301 + 49297) % 233280;
      const j = Math.floor((seed / 233280) * (i + 1));
      [indices[i], indices[j]] = [indices[j], indices[i]];
    }
    const step = (NODE_SPAWN_WINDOW - NODE_SPAWN_DURATION) / Math.max(1, n - 1);
    const map: Record<string, number> = {};
    skills.forEach((s, i) => {
      map[s.id] = indices[i] * step;
    });
    return map;
  }, []);

  useEffect(() => {
    return () => {
      lineObjects.forEach(({ obj }) => {
        obj.geometry.dispose();
        (obj.material as THREE.Material).dispose();
      });
    };
  }, [lineObjects]);

  useFrame((_, dt) => {
    elapsed.current += dt;

    // Line fade-in after nodes have largely settled.
    const lineT = Math.max(
      0,
      Math.min(1, (elapsed.current - LINE_FADE_DELAY) / LINE_FADE_DURATION),
    );
    const lineEase = 1 - Math.pow(1 - lineT, 2);
    const lineOpacity = lineEase * LINE_TARGET_OPACITY;
    lineObjects.forEach(({ obj }) => {
      const m = obj.material as THREE.LineBasicMaterial;
      if (m.opacity !== lineOpacity) m.opacity = lineOpacity;
    });

    // Hold rotation still until nodes have all spawned in — feels intentional.
    if (groupRef.current && elapsed.current > NODE_SPAWN_WINDOW) {
      groupRef.current.rotation.y += dt * 0.05;
    }
  });

  return (
    <group ref={groupRef}>
      {lineObjects.map(({ key, obj }) => (
        <primitive key={key} object={obj} />
      ))}

      {skills.map((skill) => (
        <Node
          key={skill.id}
          skill={skill}
          nodeSize={nodeSize}
          isHovered={hoveredId === skill.id}
          onHover={onHover}
          spawnDelay={spawnDelays[skill.id] ?? 0}
          elapsed={elapsed}
        />
      ))}
    </group>
  );
}

// ── exported component ───────────────────────────────────────────────────────
export default function Constellation() {
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const hovered = hoveredId ? skills.find((s) => s.id === hoveredId) ?? null : null;

  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
  const nodeSize = isMobile ? 0.06 : 0.08;
  const camZ     = isMobile ? 12   : 10;

  return (
    <div className="relative w-full h-full">
      <Canvas
        camera={{ position: [0, 0, camZ], fov: 45 }}
        gl={{ powerPreference: 'high-performance', antialias: true }}
        dpr={[1, 1.5]}
      >
        <ambientLight intensity={0.3} />
        <ConstellationScene hoveredId={hoveredId} onHover={setHoveredId} nodeSize={nodeSize} />
      </Canvas>

      {/* hover tooltip — slides up from below */}
      <div
        className="absolute bottom-8 left-1/2 max-w-[480px] text-center pointer-events-none"
        style={{
          transform: `translateX(-50%) translateY(${hovered ? '0px' : '12px'})`,
          opacity: hovered ? 1 : 0,
          transition: 'opacity 200ms ease, transform 200ms ease',
        }}
      >
        <div
          className="font-mono text-[10px] tracking-[0.2em] uppercase mb-1"
          style={{ color: hovered ? CATEGORY_COLORS[hovered.category] : 'inherit' }}
        >
          [ {hovered?.category.toUpperCase()} ]
        </div>
        <div
          className="font-serif italic text-[24px] leading-[1.2] mb-2"
          style={{ color: 'rgba(255,255,255,0.92)' }}
        >
          {hovered?.name}
        </div>
        <div
          className="font-mono text-[12px] leading-[1.6]"
          style={{ color: 'rgba(255,255,255,0.6)' }}
        >
          {hovered?.description}
        </div>
      </div>

      {/* top-left: node count */}
      <div
        className="absolute top-4 left-6 font-mono text-[10px] tracking-[0.2em] uppercase"
        style={{ color: 'rgba(255,255,255,0.35)' }}
      >
        [ {skills.length} NODES // {Object.keys(CATEGORY_COLORS).length} CATEGORIES ]
      </div>

      {/* top-right: legend */}
      <div className="absolute top-4 right-6 flex flex-col gap-2">
        {Object.entries(CATEGORY_COLORS).map(([cat, color]) => (
          <div key={cat} className="flex items-center gap-2">
            <div style={{ width: 6, height: 6, borderRadius: '50%', backgroundColor: color, flexShrink: 0 }} />
            <span
              className="font-mono text-[10px] tracking-[0.15em] uppercase"
              style={{ color: 'rgba(255,255,255,0.35)' }}
            >
              {cat}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
