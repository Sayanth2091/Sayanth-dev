// Constellation.tsx — 3D skill graph, separate Canvas from the Shard
import { Canvas, useFrame } from '@react-three/fiber';
import { useRef, useState, useMemo, useEffect } from 'react';
import * as THREE from 'three';
import { skills } from '../data/skills';

const CATEGORY_COLORS: Record<string, string> = {
  defense:     '#7DF9FF',
  offense:     '#FF6B6B',
  engineering: '#FFFFFF',
  creative:    '#B7B5FF',
};

const HOVER_SCALE = 3;    // hovered node grows to 3× its base size
const LERP_SPEED  = 10;   // scale lerp speed (units/s) — snappy but not instant

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
      const mat = new THREE.LineBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.08 });
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
}: {
  skill: (typeof skills)[number];
  nodeSize: number;
  isHovered: boolean;
  onHover: (id: string | null) => void;
}) {
  const meshRef = useRef<THREE.Mesh>(null!);

  useFrame((_, dt) => {
    if (!meshRef.current) return;
    const target = isHovered ? HOVER_SCALE : 1;
    const current = meshRef.current.scale.x;
    const next = current + (target - current) * Math.min(1, dt * LERP_SPEED);
    meshRef.current.scale.setScalar(next);
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
      <meshBasicMaterial color={CATEGORY_COLORS[skill.category]} />
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

  useEffect(() => {
    return () => {
      lineObjects.forEach(({ obj }) => {
        obj.geometry.dispose();
        (obj.material as THREE.Material).dispose();
      });
    };
  }, [lineObjects]);

  useFrame((_, dt) => {
    if (groupRef.current) groupRef.current.rotation.y += dt * 0.05;
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
