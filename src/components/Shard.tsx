// src/components/Shard.tsx — step-03 REWRITTEN
// One icosahedron. One material. Surface properties change with scroll.
// No inner mesh, no inner object, no second geometry of any kind.

import { useRef, useEffect, useMemo } from 'react';
import type { MutableRefObject } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { EffectComposer, Bloom, ChromaticAberration, Noise } from '@react-three/postprocessing';
import * as THREE from 'three';

// ── GLSL simplex noise — used for vertex displacement ────────────────────────
const NOISE_GLSL = `
vec3 _mod289v3(vec3 x){return x-floor(x*(1.0/289.0))*289.0;}
vec4 _mod289v4(vec4 x){return x-floor(x*(1.0/289.0))*289.0;}
vec4 _permute(vec4 x){return _mod289v4(((x*34.0)+10.0)*x);}
vec4 _taylorInvSqrt(vec4 r){return 1.79284291400159-0.85373472095314*r;}
float snoise(vec3 v){
  const vec2 C=vec2(1.0/6.0,1.0/3.0);
  const vec4 D=vec4(0.0,0.5,1.0,2.0);
  vec3 i =floor(v+dot(v,C.yyy));
  vec3 x0=v-i+dot(i,C.xxx);
  vec3 g =step(x0.yzx,x0.xyz);
  vec3 l =1.0-g;
  vec3 i1=min(g.xyz,l.zxy);
  vec3 i2=max(g.xyz,l.zxy);
  vec3 x1=x0-i1+C.xxx;
  vec3 x2=x0-i2+C.yyy;
  vec3 x3=x0-D.yyy;
  i=_mod289v3(i);
  vec4 p=_permute(_permute(_permute(
    i.z+vec4(0.0,i1.z,i2.z,1.0))
    +i.y+vec4(0.0,i1.y,i2.y,1.0))
    +i.x+vec4(0.0,i1.x,i2.x,1.0));
  float n_=0.142857142857;
  vec3 ns=n_*D.wyz-D.xzx;
  vec4 j=p-49.0*floor(p*ns.z*ns.z);
  vec4 x_=floor(j*ns.z);
  vec4 y_=floor(j-7.0*x_);
  vec4 x=x_*ns.x+ns.yyyy;
  vec4 y=y_*ns.x+ns.yyyy;
  vec4 h=1.0-abs(x)-abs(y);
  vec4 b0=vec4(x.xy,y.xy);
  vec4 b1=vec4(x.zw,y.zw);
  vec4 s0=floor(b0)*2.0+1.0;
  vec4 s1=floor(b1)*2.0+1.0;
  vec4 sh=-step(h,vec4(0.0));
  vec4 a0=b0.xzyw+s0.xzyw*sh.xxyy;
  vec4 a1=b1.xzyw+s1.xzyw*sh.zzww;
  vec3 p0=vec3(a0.xy,h.x);
  vec3 p1=vec3(a0.zw,h.y);
  vec3 p2=vec3(a1.xy,h.z);
  vec3 p3=vec3(a1.zw,h.w);
  vec4 norm=_taylorInvSqrt(vec4(dot(p0,p0),dot(p1,p1),dot(p2,p2),dot(p3,p3)));
  p0*=norm.x;p1*=norm.y;p2*=norm.z;p3*=norm.w;
  vec4 m=max(0.6-vec4(dot(x0,x0),dot(x1,x1),dot(x2,x2),dot(x3,x3)),0.0);
  m=m*m;
  return 42.0*dot(m*m,vec4(dot(p0,x0),dot(p1,x1),dot(p2,x2),dot(p3,x3)));
}
`;

// ── Surface config per cut state ─────────────────────────────────────────────
// These describe ONE object's surface, not two objects.
// "What's inside" at late states is light + refraction + emissive, not geometry.
type StateConfig = {
  displaceAmp: number;
  roughness:   number;
  metalness:   number;
  transmission:number;
  thickness:   number;
  ior:         number;
  clearcoat:   number;
  dispersion:  number;
  emissive:    number;
  color:       [number, number, number];  // linear RGB [0..1]
  scaleX:      number;
  scaleY:      number;
  scaleZ:      number;
};

// transmission: 0.001 on state 0 ensures the transmission shader variant
// is compiled from the start, avoiding a 1-frame stall at first cut.
const STATES: StateConfig[] = [
  // 0 — The Block: rough opaque obsidian, chunky non-uniform scale
  { displaceAmp: 0.25, roughness: 1.00, metalness: 0.05, transmission: 0.001, thickness: 0.1, ior: 1.40, clearcoat: 0.0, dispersion: 0.0, emissive: 0.00, color: [0x14/255, 0x14/255, 0x1A/255], scaleX: 1.15, scaleY: 0.85, scaleZ: 1.10 },
  // 1 — First Cut: surface polishes, light barely enters
  { displaceAmp: 0.18, roughness: 0.75, metalness: 0.05, transmission: 0.15, thickness: 0.8, ior: 1.40, clearcoat: 0.0, dispersion: 0.0, emissive: 0.00, color: [0x1A/255, 0x1A/255, 0x22/255], scaleX: 1.00, scaleY: 1.00, scaleZ: 1.00 },
  // 2 — Second Cut: facets sharpen, cyan rim visible, light bends
  { displaceAmp: 0.10, roughness: 0.45, metalness: 0.05, transmission: 0.40, thickness: 1.0, ior: 1.45, clearcoat: 0.0, dispersion: 0.0, emissive: 0.00, color: [0x16/255, 0x18/255, 0x20/255], scaleX: 1.00, scaleY: 1.00, scaleZ: 1.00 },
  // 3 — Third Cut: translucent, refraction patterns emerge
  { displaceAmp: 0.04, roughness: 0.20, metalness: 0.04, transmission: 0.65, thickness: 1.2, ior: 1.50, clearcoat: 0.0, dispersion: 0.1, emissive: 0.02, color: [0x12/255, 0x14/255, 0x1C/255], scaleX: 1.00, scaleY: 1.00, scaleZ: 1.00 },
  // 4 — Fourth Cut: near-clear, prismatic edges, high clearcoat
  { displaceAmp: 0.00, roughness: 0.05, metalness: 0.02, transmission: 0.85, thickness: 1.4, ior: 1.55, clearcoat: 1.0, dispersion: 0.2, emissive: 0.04, color: [0x10/255, 0x12/255, 0x18/255], scaleX: 1.00, scaleY: 1.00, scaleZ: 1.00 },
  // 5 — Final: perfect cut gem, pulsing emissive, full transmission
  { displaceAmp: 0.00, roughness: 0.00, metalness: 0.00, transmission: 1.00, thickness: 1.5, ior: 1.55, clearcoat: 1.0, dispersion: 0.4, emissive: 0.05, color: [1.00, 1.00, 1.00],            scaleX: 1.00, scaleY: 1.00, scaleZ: 1.00 },
];

function lerpN(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

// ── THE SHARD ── one mesh, one material, full stop ───────────────────────────
function ShardMesh({ smoothCutRef }: { smoothCutRef: MutableRefObject<number> }) {
  const meshRef = useRef<THREE.Mesh>(null!);

  // Two shader uniforms: displacement amplitude and elapsed time
  const uniforms = useMemo(() => ({
    uDisplaceAmp: { value: 0.25 },
    uTime:        { value: 0.0 },
  }), []);

  // One geometry — IcosahedronGeometry(1.5, 2). That's it.
  const geometry = useMemo(() => new THREE.IcosahedronGeometry(1.5, 2), []);

  // One material — MeshPhysicalMaterial. Its surface properties evolve per state.
  const material = useMemo(() => {
    const mat = new THREE.MeshPhysicalMaterial({
      color:             new THREE.Color(0x14141A),
      roughness:         1.0,
      metalness:         0.05,
      transmission:      0.001,   // compile transmission variant from start
      thickness:         0.1,
      ior:               1.4,
      transparent:       true,
      flatShading:       true,    // flat faces = cut-gem look at low displacement
      emissive:          new THREE.Color(0x7DF9FF),
      emissiveIntensity: 0.0,
    });

    // Inject noise displacement into the vertex shader
    mat.onBeforeCompile = (shader) => {
      shader.uniforms.uDisplaceAmp = uniforms.uDisplaceAmp;
      shader.uniforms.uTime        = uniforms.uTime;

      shader.vertexShader = shader.vertexShader.replace(
        '#include <common>',
        `#include <common>
uniform float uDisplaceAmp;
uniform float uTime;
${NOISE_GLSL}`
      );

      // Displace along normal: two octaves of noise, amplitude driven by uniform
      shader.vertexShader = shader.vertexShader.replace(
        '#include <begin_vertex>',
        `#include <begin_vertex>
float _n = snoise(position * 2.2 + vec3(uTime * 0.10))
         + snoise(position * 5.1 + vec3(0.0, uTime * 0.07, 0.0)) * 0.5;
transformed += normal * _n * uDisplaceAmp;`
      );
    };

    mat.customProgramCacheKey = () => 'shard-v3-single';
    return mat;
  }, [uniforms]);

  // Temp colors for lerping — avoid allocation in hot path
  const _ca = useMemo(() => new THREE.Color(), []);
  const _cb = useMemo(() => new THREE.Color(), []);

  useFrame(({ clock }) => {
    const p = smoothCutRef.current;
    const t = clock.getElapsedTime();

    uniforms.uTime.value = t;

    // Interpolate between the two flanking state configs
    const i0 = Math.max(0, Math.min(Math.floor(p), 4));
    const i1 = Math.min(i0 + 1, 5);
    const f  = Math.max(0, Math.min(p - i0, 1));

    const s0 = STATES[i0];
    const s1 = STATES[i1];

    uniforms.uDisplaceAmp.value  = lerpN(s0.displaceAmp,  s1.displaceAmp,  f);
    material.roughness           = lerpN(s0.roughness,     s1.roughness,    f);
    material.metalness           = lerpN(s0.metalness,     s1.metalness,    f);
    material.transmission        = lerpN(s0.transmission,  s1.transmission, f);
    material.thickness           = lerpN(s0.thickness,     s1.thickness,    f);
    material.ior                 = lerpN(s0.ior,           s1.ior,          f);
    material.clearcoat           = lerpN(s0.clearcoat,     s1.clearcoat,    f);
    (material as any).dispersion = lerpN(s0.dispersion,    s1.dispersion,   f);

    // Emissive: base intensity + sine pulse that fades in at state 4→5
    const baseEmissive = lerpN(s0.emissive, s1.emissive, f);
    const pulseWeight  = Math.max(0, Math.min(p - 4.0, 1.0));
    material.emissiveIntensity = baseEmissive + Math.sin(t * 1.2) * 0.03 * pulseWeight;

    // Color: lerp between state colors
    _ca.setRGB(s0.color[0], s0.color[1], s0.color[2]);
    _cb.setRGB(s1.color[0], s1.color[1], s1.color[2]);
    material.color.lerpColors(_ca, _cb, f);

    // Non-uniform scale: chunky at state 0, normalises to 1,1,1 by state 1
    if (meshRef.current) {
      meshRef.current.scale.x = lerpN(s0.scaleX, s1.scaleX, f);
      meshRef.current.scale.y = lerpN(s0.scaleY, s1.scaleY, f);
      meshRef.current.scale.z = lerpN(s0.scaleZ, s1.scaleZ, f);
    }
  });

  // THE SINGLE MESH DECLARATION. If you see a second <mesh> anywhere in this
  // file, something has gone wrong. Refactor before committing.
  return <mesh ref={meshRef} geometry={geometry} material={material} />;
}

// ── Rotation wrapper — auto-rotate, drag, cursor parallax ───────────────────
function ShardRotator({
  smoothCutRef,
  mouseRef,
  facetDivRef,
}: {
  smoothCutRef: MutableRefObject<number>;
  mouseRef:     MutableRefObject<{ x: number; y: number }>;
  facetDivRef:  MutableRefObject<HTMLDivElement | null>;
}) {
  const groupRef = useRef<THREE.Group>(null!);

  // Rotation accumulators kept as refs to avoid re-renders
  const rot = useRef({
    autoY: 0, autoX: 0,
    offY: 0,  offX: 0,
    velY: 0,  velX: 0,
    dragging: false, lx: 0, ly: 0,
  });

  const reduced = useMemo(
    () => typeof window !== 'undefined' &&
          window.matchMedia('(prefers-reduced-motion: reduce)').matches,
    []
  );

  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      const r = rot.current;
      if (!r.dragging) return;
      const dx = (e.clientX - r.lx) * 0.005;
      const dy = (e.clientY - r.ly) * 0.005;
      r.velY = dx; r.velX = dy;
      r.autoY += dx; r.autoX += dy;
      r.lx = e.clientX; r.ly = e.clientY;
    };
    const onUp = () => { rot.current.dragging = false; };
    window.addEventListener('pointermove', onMove);
    window.addEventListener('pointerup',   onUp);
    return () => {
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerup',   onUp);
    };
  }, []);

  useFrame(() => {
    if (!groupRef.current) return;
    const r = rot.current;

    if (!reduced) {
      r.autoY += 0.003;
      r.autoX += 0.0008;
    }

    r.offY = THREE.MathUtils.lerp(r.offY, (mouseRef.current?.x ?? 0) * 0.2, 0.06);
    r.offX = THREE.MathUtils.lerp(r.offX, (mouseRef.current?.y ?? 0) * 0.2, 0.06);

    if (!r.dragging) {
      r.velY *= 0.94;
      r.velX *= 0.94;
    }

    groupRef.current.rotation.y = reduced ? 0 : r.autoY + r.offY;
    groupRef.current.rotation.x = reduced ? 0 : r.autoX + r.offX;
  });

  return (
    <group
      ref={groupRef}
      onPointerDown={(e) => {
        rot.current.dragging = true;
        rot.current.lx = e.clientX;
        rot.current.ly = e.clientY;
      }}
      onPointerMove={(e) => {
        const fi = ((e.faceIndex ?? 0) % 20) + 1;
        if (facetDivRef.current) {
          facetDivRef.current.textContent = `[ FACET ${String(fi).padStart(2, '0')} / 20 ]`;
          facetDivRef.current.style.opacity = '1';
        }
      }}
      onPointerLeave={() => {
        if (facetDivRef.current) facetDivRef.current.style.opacity = '0';
      }}
    >
      <ShardMesh smoothCutRef={smoothCutRef} />
    </group>
  );
}

// ── Scene — camera, lights, postprocessing ───────────────────────────────────
function ShardScene({
  targetCutRef,
  smoothCutRef,
  facetDivRef,
}: {
  targetCutRef: MutableRefObject<number>;
  smoothCutRef: MutableRefObject<number>;
  facetDivRef:  MutableRefObject<HTMLDivElement | null>;
}) {
  const mouseRef    = useRef({ x: 0, y: 0 });
  // Mutable Vector2 updated each frame — ChromaticAberration reads it by reference
  const chromaOff   = useMemo(() => new THREE.Vector2(0.0, 0.0), []);

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      const el   = document.getElementById('shard-mount');
      const rect = el?.getBoundingClientRect();
      if (!rect) return;
      mouseRef.current.x =  ((e.clientX - rect.left) / rect.width)  * 2 - 1;
      mouseRef.current.y = -((e.clientY - rect.top)  / rect.height) * 2 - 1;
    };
    window.addEventListener('mousemove', onMove);
    return () => window.removeEventListener('mousemove', onMove);
  }, []);

  useFrame(({ camera }, delta) => {
    // Cinematic lerp: ~1200ms transition (time constant ~0.31s)
    const lf = 1 - Math.exp(-delta * 3.25);
    smoothCutRef.current = THREE.MathUtils.lerp(
      smoothCutRef.current, targetCutRef.current, lf
    );

    const p = smoothCutRef.current;

    // Chromatic aberration grows with each cut
    const ca = 0.0008 * p;
    chromaOff.x = ca;
    chromaOff.y = ca;

    // Camera parallax — lerp position toward mouse offset
    camera.position.x = THREE.MathUtils.lerp(camera.position.x, mouseRef.current.x * 0.4, 0.04);
    camera.position.y = THREE.MathUtils.lerp(camera.position.y, mouseRef.current.y * 0.4, 0.04);
    camera.lookAt(0, 0, 0);
  });

  return (
    <>
      {/* Background: the void. Transmission renders this through the gem. */}
      <color attach="background" args={['#0A0A0F']} />

      {/* Exact lights from spec — no more, no less */}
      <ambientLight intensity={0.3} color={0x404060} />
      {/* Cyan key — visible as rim light on facets */}
      <pointLight position={[3, 2, 3]}    color={0x7DF9FF} intensity={2}   distance={10} />
      {/* White fill */}
      <pointLight position={[-3, -1, -2]} color={0xFFFFFF} intensity={0.4} distance={10} />
      {/* White back — positioned BEHIND the shard; visible THROUGH it at high transmission */}
      <pointLight position={[0, 0, -5]}   color={0xFFFFFF} intensity={1.5} distance={20} />

      <ShardRotator
        smoothCutRef={smoothCutRef}
        mouseRef={mouseRef}
        facetDivRef={facetDivRef}
      />

      <EffectComposer multisampling={0}>
        <Bloom intensity={0.4} luminanceThreshold={0.2} radius={0.6} />
        <ChromaticAberration offset={chromaOff} radialModulation={false} modulationOffset={0.5} />
        <Noise opacity={0.02} />
      </EffectComposer>
    </>
  );
}

// ── Root export ───────────────────────────────────────────────────────────────
export default function Shard() {
  const targetCutRef = useRef<number>(0);
  const smoothCutRef = useRef<number>(0);
  const facetDivRef  = useRef<HTMLDivElement | null>(null);
  const sweepDivRef  = useRef<HTMLDivElement | null>(null);
  const lastCutFloor = useRef(0);

  // Listen for scroll-driven cut progress from the page
  useEffect(() => {
    const handler = (e: Event) => {
      targetCutRef.current = (e as CustomEvent<{ value: number }>).detail.value;
    };
    window.addEventListener('null-sector:cut-progress', handler);
    return () => window.removeEventListener('null-sector:cut-progress', handler);
  }, []);

  // Fire the sweep line whenever smoothCut crosses an integer
  useEffect(() => {
    let raf: number;
    const tick = () => {
      raf = requestAnimationFrame(tick);
      const p   = smoothCutRef.current;
      const cur = Math.floor(p);
      if (cur > lastCutFloor.current && p - cur < 0.15) {
        lastCutFloor.current = cur;
        sweep();
      }
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  function sweep() {
    const div = sweepDivRef.current;
    if (!div) return;
    div.style.transition  = 'none';
    div.style.opacity     = '0.85';
    div.style.transform   = 'scaleX(0)';
    requestAnimationFrame(() => {
      div.style.transition = 'transform 480ms cubic-bezier(0.65,0,0.35,1)';
      div.style.transform  = 'scaleX(1)';
      setTimeout(() => {
        if (!sweepDivRef.current) return;
        sweepDivRef.current.style.transition = 'opacity 200ms ease';
        sweepDivRef.current.style.opacity    = '0';
      }, 500);
    });
  }

  return (
    <div style={{ width: '100%', height: '100%', position: 'relative', minHeight: '60vh' }}>

      {/* Cyan sweep line — fires across the shard face on each integer cut */}
      <div
        ref={sweepDivRef}
        style={{
          position: 'absolute', left: 0, right: 0, height: '1px',
          background: 'linear-gradient(90deg, transparent, #7DF9FF 15%, #7DF9FF 85%, transparent)',
          top: '42%', opacity: 0, pointerEvents: 'none', zIndex: 15,
          transform: 'scaleX(0)', transformOrigin: 'left center',
          boxShadow: '0 0 8px #7DF9FF, 0 0 24px rgba(125,249,255,0.4)',
        }}
      />

      {/* Facet readout overlay */}
      <div
        ref={facetDivRef}
        style={{
          position: 'absolute', top: 14, right: 14, zIndex: 10,
          fontFamily: '"JetBrains Mono", monospace',
          fontSize: '10px', letterSpacing: '0.15em', textTransform: 'uppercase',
          color: 'rgba(255,255,255,0.35)', pointerEvents: 'none',
          opacity: 0, transition: 'opacity 200ms',
        }}
      />

      {/* DEV: cut state buttons — stripped in production builds */}
      {import.meta.env.DEV && (
        <div
          style={{
            position: 'absolute', bottom: 12, right: 12, zIndex: 20,
            display: 'flex', gap: 6,
          }}
        >
          {[0, 1, 2, 3, 4, 5].map((n) => (
            <button
              key={n}
              onClick={() =>
                window.dispatchEvent(
                  new CustomEvent('null-sector:cut-progress', { detail: { value: n } })
                )
              }
              style={{
                fontFamily: '"JetBrains Mono", monospace', fontSize: '10px',
                color: 'rgba(255,255,255,0.6)', background: 'transparent',
                border: '1px solid rgba(255,255,255,0.2)',
                padding: '3px 8px', cursor: 'pointer', letterSpacing: '0.1em',
              }}
            >
              {n}
            </button>
          ))}
        </div>
      )}

      <Canvas
        dpr={[1, typeof window !== 'undefined' ? Math.min(window.devicePixelRatio, 2) : 1]}
        camera={{ fov: 45, position: [0, 0, 5] }}
        gl={{
          antialias:         true,
          alpha:             false,      // needed for correct transmission rendering
          powerPreference:   'high-performance',
        }}
        style={{ width: '100%', height: '100%' }}
      >
        <ShardScene
          targetCutRef={targetCutRef}
          smoothCutRef={smoothCutRef}
          facetDivRef={facetDivRef}
        />
      </Canvas>
    </div>
  );
}
