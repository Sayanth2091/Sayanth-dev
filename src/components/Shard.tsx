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
import * as THREE from 'three';
import { audio } from '../scripts/audio';

// Icosahedron at detail=1 has 80 triangles (20 base × 4 subdivisions).
// We map raycast face hits back to the original 20 facets for the readout.
const FACETS_PER_GROUP = 4;
const TOTAL_FACETS = 20;

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

  // Inertia model: direct rotation while dragging, smoothed recent delta is
  // committed as fling velocity on release, then decays exponentially.
  const dragVelocity = useRef({ x: 0, y: 0 });
  const recentDelta = useRef({ x: 0, y: 0 });
  const isDragging = useRef(false);
  const lastPointer = useRef({ x: 0, y: 0 });
  const mouse = useRef({ x: 0, y: 0 });
  const targetRot = useRef({ x: 0, y: 0 });
  const lastEdgesBucket = useRef(-1);
  const displayedCut = useRef(0);

  // Facet readout — throttled raycast, only emits on change.
  const lastFacetEmitted = useRef<number | null>(null);
  const lastRaycastTime = useRef(0);
  const raycaster = useMemo(() => new THREE.Raycaster(), []);

  // explosion state — fired 7s after cut=5 reaches signoff.
  // Each of the 80 triangles becomes a rigid fragment with its own linear
  // and angular velocity. Gravity pulls them down; they bounce once on the
  // floor and settle into a glass pile at the bottom of the canvas.
  type Fragment = {
    centroid: THREE.Vector3;
    offsets: [THREE.Vector3, THREE.Vector3, THREE.Vector3];
    vel: THREE.Vector3;
    angVel: THREE.Vector3;
    rotation: THREE.Quaternion;
    settled: boolean;
  };

  const exploding = useRef(false);
  const explosionDone = useRef(false);
  const explosionT = useRef(0);
  const fragments = useRef<Fragment[] | null>(null);

  // Reused scratch vars to avoid per-frame allocation.
  const scratch = useMemo(
    () => ({
      tmpV: new THREE.Vector3(),
      tmpQ: new THREE.Quaternion(),
    }),
    [],
  );

  const EXPLOSION_MAX_DURATION = 3.5; // hard cap, after which physics freezes
  const EXPLOSION_GRAVITY = 4.5;
  const EXPLOSION_FLOOR_Y = -1.9; // world-space bottom: just below visible canvas
  const EXPLOSION_RESTITUTION = 0.22;
  const EXPLOSION_FRICTION = 0.78;
  const EXPLOSION_FADE_MIN = 0.42; // glass remains semi-transparent after settle

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

  // -------- explosion: 7s after cut hits 5, build rigid fragments --------
  useEffect(() => {
    let timer: ReturnType<typeof setTimeout> | undefined;
    const onCut = (e: Event) => {
      const v = (e as CustomEvent).detail?.value;
      if (v === 5 && !exploding.current && !timer) {
        timer = setTimeout(() => {
          const positions = geometry.attributes.position;
          const arr = positions.array as Float32Array;
          const fragCount = positions.count / 3;
          const list: Fragment[] = new Array(fragCount);

          for (let f = 0; f < fragCount; f++) {
            const i0 = f * 3;
            const p0 = new THREE.Vector3(
              arr[i0 * 3],
              arr[i0 * 3 + 1],
              arr[i0 * 3 + 2],
            );
            const p1 = new THREE.Vector3(
              arr[(i0 + 1) * 3],
              arr[(i0 + 1) * 3 + 1],
              arr[(i0 + 1) * 3 + 2],
            );
            const p2 = new THREE.Vector3(
              arr[(i0 + 2) * 3],
              arr[(i0 + 2) * 3 + 1],
              arr[(i0 + 2) * 3 + 2],
            );
            const centroid = new THREE.Vector3()
              .add(p0)
              .add(p1)
              .add(p2)
              .multiplyScalar(1 / 3);

            const offsets: [THREE.Vector3, THREE.Vector3, THREE.Vector3] = [
              p0.clone().sub(centroid),
              p1.clone().sub(centroid),
              p2.clone().sub(centroid),
            ];

            const dirLen =
              Math.sqrt(
                centroid.x * centroid.x +
                  centroid.y * centroid.y +
                  centroid.z * centroid.z,
              ) || 1;

            // Slow radial drift — fragments separate before gravity dominates.
            const radial = 0.3 + Math.random() * 0.5;
            const vel = new THREE.Vector3(
              (centroid.x / dirLen) * radial + (Math.random() - 0.5) * 0.25,
              (centroid.y / dirLen) * radial * 0.4 +
                0.35 +
                Math.random() * 0.3,
              (centroid.z / dirLen) * radial + (Math.random() - 0.5) * 0.25,
            );

            const angVel = new THREE.Vector3(
              (Math.random() - 0.5) * 2.4,
              (Math.random() - 0.5) * 2.4,
              (Math.random() - 0.5) * 2.4,
            );

            list[f] = {
              centroid,
              offsets,
              vel,
              angVel,
              rotation: new THREE.Quaternion(),
              settled: false,
            };
          }

          fragments.current = list;
          explosionT.current = 0;
          exploding.current = true;
          audio.play('cut', { volume: 0.75 });
        }, 7000);
      }
    };
    window.addEventListener('null-sector:cut-progress', onCut);
    return () => {
      window.removeEventListener('null-sector:cut-progress', onCut);
      if (timer) clearTimeout(timer);
    };
  }, [geometry]);

  // -------- pointer handling on the canvas --------
  const { gl, camera } = useThree();
  useEffect(() => {
    const dom = gl.domElement;

    const emitFacet = (facet: number | null) => {
      if (facet === lastFacetEmitted.current) return;
      lastFacetEmitted.current = facet;
      window.dispatchEvent(
        new CustomEvent('null-sector:shard-facet', { detail: { facet } }),
      );
    };

    const onPointerDown = (e: PointerEvent) => {
      isDragging.current = true;
      lastPointer.current = { x: e.clientX, y: e.clientY };
      recentDelta.current = { x: 0, y: 0 };
      dragVelocity.current = { x: 0, y: 0 };
      dom.setPointerCapture(e.pointerId);
    };

    const onPointerMove = (e: PointerEvent) => {
      const rect = dom.getBoundingClientRect();
      mouse.current.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.current.y = -(((e.clientY - rect.top) / rect.height) * 2 - 1);

      if (isDragging.current) {
        const dx = e.clientX - lastPointer.current.x;
        const dy = e.clientY - lastPointer.current.y;
        // direct rotation while dragging — 1:1 feel
        targetRot.current.y += dx * 0.006;
        targetRot.current.x += dy * 0.006;
        // smooth recent delta — dominant pointer trajectory becomes fling velocity
        recentDelta.current.x = recentDelta.current.x * 0.7 + dy * 0.006 * 0.3;
        recentDelta.current.y = recentDelta.current.y * 0.7 + dx * 0.006 * 0.3;
        lastPointer.current = { x: e.clientX, y: e.clientY };
      }

      // Pointer position for facet overlay — emit every move (cheap, ref-driven)
      window.dispatchEvent(
        new CustomEvent('null-sector:shard-pointer', {
          detail: { x: e.clientX, y: e.clientY },
        }),
      );

      // Facet raycast throttled to ~30Hz
      const now = performance.now();
      if (now - lastRaycastTime.current < 33) return;
      lastRaycastTime.current = now;

      if (!meshRef.current) return;
      raycaster.setFromCamera(
        new THREE.Vector2(mouse.current.x, mouse.current.y),
        camera,
      );
      const hits = raycaster.intersectObject(meshRef.current, false);
      if (hits.length > 0 && hits[0].faceIndex !== undefined) {
        const facet = Math.floor(hits[0].faceIndex / FACETS_PER_GROUP) + 1;
        emitFacet(Math.min(TOTAL_FACETS, facet));
      } else {
        emitFacet(null);
      }
    };

    const onPointerUp = () => {
      if (isDragging.current) {
        // commit smoothed recent delta as inertia, decays in ~useFrame loop
        dragVelocity.current.x = recentDelta.current.x;
        dragVelocity.current.y = recentDelta.current.y;
        recentDelta.current = { x: 0, y: 0 };
      }
      isDragging.current = false;
    };

    const onPointerLeave = (e: PointerEvent) => {
      onPointerUp();
      emitFacet(null);
    };

    dom.addEventListener('pointerdown', onPointerDown);
    dom.addEventListener('pointermove', onPointerMove);
    dom.addEventListener('pointerup', onPointerUp);
    dom.addEventListener('pointerleave', onPointerLeave);
    return () => {
      dom.removeEventListener('pointerdown', onPointerDown);
      dom.removeEventListener('pointermove', onPointerMove);
      dom.removeEventListener('pointerup', onPointerUp);
      dom.removeEventListener('pointerleave', onPointerLeave);
    };
  }, [gl, camera, raycaster]);

  // -------- per-frame update --------
  useFrame((state, delta) => {
    if (!matRef.current || !edgesMatRef.current || !groupRef.current) return;

    // ---- explosion: rigid-body fragment physics ----
    if (exploding.current && fragments.current) {
      // Once settled, leave geometry frozen and skip all per-frame work.
      if (explosionDone.current) return;

      // Cap delta so a stalled tab doesn't launch fragments to infinity.
      const dt = Math.min(delta, 1 / 30);
      explosionT.current += dt;
      const t = explosionT.current;

      const list = fragments.current;
      const arr = geometry.attributes.position.array as Float32Array;
      const gDelta = EXPLOSION_GRAVITY * dt;

      let allSettled = true;
      for (let f = 0; f < list.length; f++) {
        const frag = list[f];

        if (!frag.settled) {
          // gravity → vertical velocity
          frag.vel.y -= gDelta;

          // integrate position
          frag.centroid.x += frag.vel.x * dt;
          frag.centroid.y += frag.vel.y * dt;
          frag.centroid.z += frag.vel.z * dt;

          // floor collision (simple plane at y = floor, with damping)
          if (frag.centroid.y < EXPLOSION_FLOOR_Y) {
            frag.centroid.y = EXPLOSION_FLOOR_Y;
            frag.vel.y = -frag.vel.y * EXPLOSION_RESTITUTION;
            frag.vel.x *= EXPLOSION_FRICTION;
            frag.vel.z *= EXPLOSION_FRICTION;
            frag.angVel.multiplyScalar(EXPLOSION_FRICTION);

            // Settle when energy is low enough that further bouncing is invisible.
            if (
              Math.abs(frag.vel.y) < 0.18 &&
              frag.vel.x * frag.vel.x + frag.vel.z * frag.vel.z < 0.04
            ) {
              frag.vel.set(0, 0, 0);
              frag.angVel.set(0, 0, 0);
              frag.settled = true;
            }
          }

          // integrate rotation around accumulated angular velocity
          const angSpeed = frag.angVel.length();
          if (angSpeed > 1e-4) {
            const angle = angSpeed * dt;
            scratch.tmpV
              .copy(frag.angVel)
              .multiplyScalar(1 / angSpeed); // normalized axis
            scratch.tmpQ.setFromAxisAngle(scratch.tmpV, angle);
            frag.rotation.premultiply(scratch.tmpQ);
          }

          if (!frag.settled) allSettled = false;
        }

        // write back the three vertices for this triangle
        const i0 = f * 3;
        for (let v = 0; v < 3; v++) {
          scratch.tmpV.copy(frag.offsets[v]).applyQuaternion(frag.rotation);
          const idx = (i0 + v) * 3;
          arr[idx] = frag.centroid.x + scratch.tmpV.x;
          arr[idx + 1] = frag.centroid.y + scratch.tmpV.y;
          arr[idx + 2] = frag.centroid.z + scratch.tmpV.z;
        }
      }
      geometry.attributes.position.needsUpdate = true;
      geometry.computeVertexNormals();

      // Glass fades to a translucent floor — fragments remain visible afterward.
      const fadeT = Math.min(1, t / 1.3);
      const fade =
        EXPLOSION_FADE_MIN + (1 - EXPLOSION_FADE_MIN) * (1 - fadeT * fadeT);
      matRef.current.transparent = true;
      matRef.current.opacity = fade;
      matRef.current.emissiveIntensity = Math.max(0, 0.35 - t * 0.18);
      edgesMatRef.current.opacity = fade * 0.55;

      // Freeze when everyone has come to rest, or after the safety cap.
      if (allSettled || t >= EXPLOSION_MAX_DURATION) {
        explosionDone.current = true;
      }

      return;
    }

    // smoothly lerp displayed cut toward target
    displayedCut.current += (cutProgress - displayedCut.current) * 0.06;
    if (Math.abs(cutProgress - displayedCut.current) < 0.001) displayedCut.current = cutProgress;

    const cut = displayedCut.current;
    const t = cut / 5;
    // Ease-in curve so the visual reveal is back-loaded — at cut=2 the shard
    // is only ~19% open, at cut=4 it's ~68%, with the dramatic completion
    // reserved for cut=5 (signoff). Linear/smoothstep made it feel "done" by
    // the third section.
    const tCurved = Math.pow(t, 1.8);

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

    // Rebuild edges only when the cut lerp has settled. Rebuilding mid-morph
    // disposes/uploads a fresh BufferGeometry on consecutive frames, which
    // produces visible flicker and frame-time spikes during the transition.
    const morphSettled = Math.abs(cutProgress - displayedCut.current) < 0.005;
    if (morphSettled) {
      const bucket = Math.floor(t * 30);
      if (bucket !== lastEdgesBucket.current && edgesRef.current) {
        lastEdgesBucket.current = bucket;
        edgesRef.current.geometry.dispose();
        edgesRef.current.geometry = new THREE.EdgesGeometry(geometry, 1);
      }
    }

    // -------- rotation: auto + fling inertia + cursor parallax --------
    targetRot.current.y += 0.0035 + dragVelocity.current.y;
    targetRot.current.x += 0.001 + dragVelocity.current.x;
    // Decay only on release — preserves the fling, doesn't fight active drag.
    if (!isDragging.current) {
      dragVelocity.current.x *= 0.95;
      dragVelocity.current.y *= 0.95;
    }
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
          emissive={0xD4B86A}
          emissiveIntensity={0}
          flatShading
          side={THREE.DoubleSide}
        />
        <lineSegments ref={edgesRef} geometry={initialEdgesGeometry}>
          <lineBasicMaterial ref={edgesMatRef} color={0xD4B86A} transparent opacity={0} />
        </lineSegments>
      </mesh>
    </group>
  );
}

// -------------------- the scene wrapper --------------------
function Scene({ cutProgress }: { cutProgress: number }) {
  return (
    <>
      <ambientLight intensity={0.4} color={0x303040} />
      <pointLight position={[3, 2.5, 3]} intensity={5} color={0xD4B86A} distance={18} />
      <pointLight position={[-3, -1, -2]} intensity={1.0} color={0xFFFFFF} distance={12} />
      <pointLight position={[0, 0, -6]} intensity={3.0} color={0xD4B86A} distance={20} />
      <pointLight position={[-2, 3, 2]} intensity={2} color={0xFFFFFF} distance={10} />

      <ShardMesh cutProgress={cutProgress} />
    </>
  );
}

// -------------------- exported component --------------------
export default function Shard() {
  const [cutProgress, setCutProgress] = useState(0);
  const [, setReducedMotion] = useState(false);
  const [facet, setFacet] = useState<number | null>(null);
  const readoutRef = useRef<HTMLDivElement>(null);

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

  // facet readout: number via state (rerenders only on change),
  // pointer position via direct DOM ref (no rerender on pointermove).
  useEffect(() => {
    const onFacet = (e: Event) => {
      const f = (e as CustomEvent).detail?.facet;
      setFacet(typeof f === 'number' ? f : null);
    };
    const onPointer = (e: Event) => {
      const d = (e as CustomEvent).detail;
      if (!d || !readoutRef.current) return;
      readoutRef.current.style.transform = `translate(${d.x + 22}px, ${d.y - 28}px)`;
    };
    window.addEventListener('null-sector:shard-facet', onFacet);
    window.addEventListener('null-sector:shard-pointer', onPointer);
    return () => {
      window.removeEventListener('null-sector:shard-facet', onFacet);
      window.removeEventListener('null-sector:shard-pointer', onPointer);
    };
  }, []);

  // Show readout only when shard is meaningfully revealed (cut >= ~1.5).
  // Before that, the facets aren't formed yet — readout would be premature.
  const readoutVisible = facet !== null && cutProgress >= 1.5;

  return (
    <div className="w-full h-full relative">
      <Canvas
        camera={{ position: [0, 0, 5.5], fov: 45 }}
        gl={{ powerPreference: 'high-performance', antialias: true, alpha: true, premultipliedAlpha: false }}
        dpr={[1, 2]}
        onCreated={({ gl }) => {
          gl.setClearColor(0x000000, 0);
          gl.setClearAlpha(0);
        }}
      >
        <Scene cutProgress={cutProgress} />
      </Canvas>

      <div
        ref={readoutRef}
        className="shard-facet-readout"
        data-visible={readoutVisible || undefined}
      >
        [ FACET {facet !== null ? String(facet).padStart(2, '0') : '00'} / 20 ]
      </div>
    </div>
  );
}
