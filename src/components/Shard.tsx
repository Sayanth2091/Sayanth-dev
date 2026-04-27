// src/components/Shard.tsx
//
// NULL_SECTOR centerpiece. A single jagged crystal that resolves into focus
// across 6 cut states (0-5) driven by the window event "null-sector:cut-progress".
//
// Geometry concept: an icosahedron whose vertices are displaced via two
// pre-computed displacement sets ("rough" and "sharp"). cutProgress lerps between
// them, so the SAME mesh smoothly transitions from rough obsidian rock silhouette
// to jagged entropy-crystal silhouette without swapping geometries.
//
// Material concept: dark crystalline body throughout (NOT glass) with cyan
// emissive that pulses brighter as cuts progress. Edges drawn as a cyan wireframe
// outline that fades in. flatShading is non-negotiable — every facet must read sharp.

import { useRef, useEffect, useState, useMemo } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { EffectComposer, Bloom, ChromaticAberration, Noise } from '@react-three/postprocessing';
import * as THREE from 'three';

// -------------------- noise (deterministic, no deps) --------------------
function noise3(x: number, y: number, z: number): number {
  const s = Math.sin(x * 12.9898 + y * 78.233 + z * 37.719) * 43758.5453;
  return (s - Math.floor(s)) * 2 - 1;
}

// -------------------- the inner mesh component --------------------
function ShardMesh({ cutProgress }: { cutProgress: number }) {
  const meshRef = useRef<THREE.Mesh>(null!);
  const edgesRef = useRef<THREE.LineSegments>(null!);
  const groupRef = useRef<THREE.Group>(null!);
  const matRef = useRef<THREE.MeshPhysicalMaterial>(null!);
  const edgesMatRef = useRef<THREE.LineBasicMaterial>(null!);

  const dragRotVel = useRef({ x: 0, y: 0 });
  const isDragging = useRef(false);
  const lastPointer = useRef({ x: 0, y: 0 });
  const mouse = useRef({ x: 0, y: 0 });
  const targetRot = useRef({ x: 0, y: 0 });
  const lastEdgesBucket = useRef(-1);
  const displayedCut = useRef(0);

  const SHARD_RADIUS = 1.1;

  // build geometry once and keep references to base + displacement arrays
  const { geometry, basePositions, roughDisp, sharpDisp } = useMemo(() => {
    const geo = new THREE.IcosahedronGeometry(SHARD_RADIUS, 1);
    const positions = geo.attributes.position;
    const count = positions.count;
    const base = new Float32Array(positions.array.length);
    base.set(positions.array as Float32Array);

    const rough = new Float32Array(count);
    const sharp = new Float32Array(count);

    for (let i = 0; i < count; i++) {
      const x = base[i * 3];
      const y = base[i * 3 + 1];
      const z = base[i * 3 + 2];

      const nRough = noise3(x * 1.4, y * 1.4, z * 1.4);
      rough[i] = 0.25 + nRough * 0.35;

      const nSharp = noise3(x * 2.2 + 100, y * 2.2 + 100, z * 2.2 + 100);
      if (nSharp > 0.15) sharp[i] = 0.6 + Math.random() * 0.7;
      else if (nSharp < -0.3) sharp[i] = -0.2 - Math.random() * 0.15;
      else sharp[i] = 0.05 + Math.random() * 0.1;
    }

    return { geometry: geo, basePositions: base, roughDisp: rough, sharpDisp: sharp };
  }, []);

  // initial edges geometry
  const initialEdgesGeometry = useMemo(() => new THREE.EdgesGeometry(geometry, 1), [geometry]);

  // -------- pointer handling on the canvas (parented in the parent component) --------
  const { gl } = useThree();
  useEffect(() => {
    const dom = gl.domElement;

    const onPointerDown = (e: PointerEvent) => {
      isDragging.current = true;
      lastPointer.current = { x: e.clientX, y: e.clientY };
      dom.setPointerCapture(e.pointerId);
    };
    const onPointerMove = (e: PointerEvent) => {
      const rect = dom.getBoundingClientRect();
      mouse.current.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.current.y = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
      if (isDragging.current) {
        const dx = e.clientX - lastPointer.current.x;
        const dy = e.clientY - lastPointer.current.y;
        dragRotVel.current.y += dx * 0.005;
        dragRotVel.current.x += dy * 0.005;
        lastPointer.current = { x: e.clientX, y: e.clientY };
      }
    };
    const onPointerUp = () => { isDragging.current = false; };

    dom.addEventListener('pointerdown', onPointerDown);
    dom.addEventListener('pointermove', onPointerMove);
    dom.addEventListener('pointerup', onPointerUp);
    dom.addEventListener('pointerleave', onPointerUp);
    return () => {
      dom.removeEventListener('pointerdown', onPointerDown);
      dom.removeEventListener('pointermove', onPointerMove);
      dom.removeEventListener('pointerup', onPointerUp);
      dom.removeEventListener('pointerleave', onPointerUp);
    };
  }, [gl]);

  // -------- per-frame update --------
  useFrame((state, delta) => {
    if (!matRef.current || !edgesMatRef.current || !groupRef.current) return;

    // smoothly lerp displayed cut toward target
    displayedCut.current += (cutProgress - displayedCut.current) * 0.06;
    if (Math.abs(cutProgress - displayedCut.current) < 0.001) displayedCut.current = cutProgress;

    const cut = displayedCut.current;
    const t = cut / 5;
    const tCurved = t * t * (3 - 2 * t); // smoothstep

    // -------- geometry update --------
    const positions = geometry.attributes.position;
    for (let i = 0; i < positions.count; i++) {
      const bx = basePositions[i * 3];
      const by = basePositions[i * 3 + 1];
      const bz = basePositions[i * 3 + 2];
      const len = Math.sqrt(bx * bx + by * by + bz * bz);
      const d = roughDisp[i] * (1 - tCurved) + sharpDisp[i] * tCurved;
      positions.array[i * 3]     = bx + (bx / len) * d;
      positions.array[i * 3 + 1] = by + (by / len) * d;
      positions.array[i * 3 + 2] = bz + (bz / len) * d;
    }
    positions.needsUpdate = true;
    geometry.computeVertexNormals();

    // -------- material update --------
    const m = matRef.current;
    m.roughness = 0.95 - tCurved * 0.78;
    m.metalness = 0.15 + tCurved * 0.3;
    m.transmission = tCurved * 0.45;
    m.thickness = 0.5 + tCurved * 0.5;
    m.clearcoat = tCurved;

    const baseEmissive = tCurved * 0.18;
    const pulse = Math.sin(state.clock.elapsedTime * 1.6) * baseEmissive * 0.4;
    m.emissiveIntensity = baseEmissive + pulse;

    const cr = 0x14 + Math.floor(tCurved * 6);
    const cg = 0x14 + Math.floor(tCurved * 6);
    const cb = 0x18 + Math.floor(tCurved * 14);
    m.color.setRGB(cr / 255, cg / 255, cb / 255);

    // -------- edges update --------
    const edgesT = Math.min(1, Math.max(0, (t - 0.3) / 0.7));
    edgesMatRef.current.opacity = edgesT * 0.85;

    // rebuild edges geometry every ~30 buckets across the transition
    const bucket = Math.floor(t * 30);
    if (bucket !== lastEdgesBucket.current && edgesRef.current) {
      lastEdgesBucket.current = bucket;
      edgesRef.current.geometry.dispose();
      edgesRef.current.geometry = new THREE.EdgesGeometry(geometry, 1);
    }

    // -------- rotation: auto + drag inertia + cursor parallax --------
    targetRot.current.y += 0.0035 + dragRotVel.current.y;
    targetRot.current.x += 0.001 + dragRotVel.current.x;
    dragRotVel.current.x *= 0.94;
    dragRotVel.current.y *= 0.94;
    const parallaxRotY = mouse.current.x * 0.18;
    const parallaxRotX = mouse.current.y * 0.18;
    groupRef.current.rotation.y += (targetRot.current.y + parallaxRotY - groupRef.current.rotation.y) * 0.06;
    groupRef.current.rotation.x += (targetRot.current.x + parallaxRotX - groupRef.current.rotation.x) * 0.06;

    // camera follows cursor
    state.camera.position.x += (mouse.current.x * 0.3 - state.camera.position.x) * 0.04;
    state.camera.position.y += (mouse.current.y * 0.3 - state.camera.position.y) * 0.04;
    state.camera.lookAt(0, 0, 0);
  });

  return (
    <group ref={groupRef}>
      <mesh ref={meshRef} geometry={geometry}>
        <meshPhysicalMaterial
          ref={matRef}
          color={0x141418}
          roughness={0.95}
          metalness={0.15}
          transmission={0}
          thickness={0.5}
          ior={1.6}
          clearcoat={0}
          emissive={0x7DF9FF}
          emissiveIntensity={0}
          flatShading
          side={THREE.DoubleSide}
        />
        <lineSegments ref={edgesRef} geometry={initialEdgesGeometry}>
          <lineBasicMaterial ref={edgesMatRef} color={0x7DF9FF} transparent opacity={0} />
        </lineSegments>
      </mesh>
    </group>
  );
}

// -------------------- the scene wrapper --------------------
function Scene({ cutProgress }: { cutProgress: number }) {
  return (
    <>
      <color attach="background" args={['#0A0A0F']} />
      <ambientLight intensity={0.4} color={0x303040} />
      <pointLight position={[3, 2.5, 3]} intensity={5} color={0x7DF9FF} distance={18} />
      <pointLight position={[-3, -1, -2]} intensity={1.0} color={0xFFFFFF} distance={12} />
      <pointLight position={[0, 0, -6]} intensity={3.0} color={0x7DF9FF} distance={20} />
      <pointLight position={[-2, 3, 2]} intensity={2} color={0xFFFFFF} distance={10} />

      <ShardMesh cutProgress={cutProgress} />

      <EffectComposer>
        <ChromaticAberration offset={[0.0008 * (cutProgress / 5), 0.0008 * (cutProgress / 5)] as any} />
        <Bloom intensity={0.5} luminanceThreshold={0.15} radius={0.7} />
        <Noise opacity={0.025} />
      </EffectComposer>
    </>
  );
}

// -------------------- exported component --------------------
export default function Shard() {
  const [cutProgress, setCutProgress] = useState(0);
  const [reducedMotion, setReducedMotion] = useState(false);

  // listen for the cut-progress window event
  useEffect(() => {
    const handler = (e: Event) => {
      const detail = (e as CustomEvent).detail;
      if (detail && typeof detail.value === 'number') {
        setCutProgress(detail.value);
      }
    };
    window.addEventListener('null-sector:cut-progress', handler);

    // honor prefers-reduced-motion
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (mq.matches) {
      setReducedMotion(true);
      setCutProgress(5);
    }
    const mqHandler = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mq.addEventListener('change', mqHandler);

    return () => {
      window.removeEventListener('null-sector:cut-progress', handler);
      mq.removeEventListener('change', mqHandler);
    };
  }, []);

  return (
    <div className="w-full h-full relative">
      <Canvas
        camera={{ position: [0, 0, 5.5], fov: 45 }}
        gl={{ powerPreference: 'high-performance', antialias: true }}
        dpr={[1, 2]}
      >
        <Scene cutProgress={cutProgress} />
      </Canvas>

      {/* DEV-ONLY debug controls */}
      {import.meta.env.DEV && !reducedMotion && (
        <div className="absolute bottom-4 right-4 flex gap-1.5 font-mono">
          {[0, 1, 2, 3, 4, 5].map((n) => (
            <button
              key={n}
              onClick={() => {
                window.dispatchEvent(
                  new CustomEvent('null-sector:cut-progress', { detail: { value: n } })
                );
              }}
              className={`px-2.5 py-1 text-[11px] border transition-colors ${
                Math.round(cutProgress) === n
                  ? 'bg-[#7DF9FF] text-[#0A0A0F] border-[#7DF9FF]'
                  : 'bg-[#7DF9FF]/5 text-white/60 border-[#7DF9FF]/30 hover:text-[#7DF9FF]'
              }`}
              style={{ letterSpacing: '0.1em' }}
            >
              {n}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
