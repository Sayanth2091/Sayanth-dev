# 03 — BUILD THE SHARD

> The single most important file in this pack. The shard is the centerpiece, the metaphor, and the awwwards bait. Get this right and the rest of the site coasts on its credibility. Get this wrong and no amount of polish elsewhere will save it.

---

## What this step builds

A React Three Fiber island, mounted via Astro's `client:load` directive into the `#shard-mount` div from step 02. The shard:

- Starts as a **rough obsidian block** — a high-poly cube with random surface displacement, opaque, dark
- Reacts to cursor position with parallax tilt
- Reacts to drag with momentum
- Has a slow autonomous rotation
- **Cuts itself progressively** as the visitor scrolls — five cuts total, one per section
- Each cut reveals more of an **inner data scene**: scrolling code, a wireframe network topology, your faint silhouette
- By final cut, the shard is a fully transparent multi-faceted gem with the inner scene fully visible
- Has chromatic aberration on edges (postprocessing)
- Has a subtle bloom on the inner pulse (postprocessing)

---

## The prompt — paste into Sonnet/Haiku

````
Build the SHARD centerpiece for NULL_SECTOR. Build step 03, REWRITTEN.

You read the bible. Now read THIS prompt very carefully. Previous attempts at this step misunderstood the geometry. Do not repeat that mistake.

WHAT THE SHARD IS — read this 3 times before writing any code:

The shard is ONE SOLID OBJECT. Not a container with something inside. Not a cube wrapping a sphere. ONE object — a faceted, gem-like polyhedron — whose SURFACE PROPERTIES change as the user scrolls.

Imagine a single block of obsidian. At State 0, its surface is rough and totally opaque — you cannot see through it; it is a black rock. As cuts happen, the SAME block has its surface progressively polished and becomes progressively transparent. By State 5, the block is a clear faceted gem and you can see DEEPLY INTO IT — through the surface, into volumes of light and refraction inside.

There is NO separate sphere. There is NO cube. There is ONE faceted object, and what changes is: how rough its surface is, how transparent it is, how aggressive its facets are.

Whatever appears "inside" the shard at later states is NOT a separate mesh. It is light, refraction, and a procedural pattern rendered through the transparent material itself — like looking into a cut diamond and seeing internal reflections, not like looking into a glass box at a separate object.

If at any point in your code you find yourself adding a second mesh inside the shard mesh, STOP. You have misunderstood. Refactor.

THE GEOMETRY — exactly one mesh:const geometry = new THREE.IcosahedronGeometry(1.5, 1);
// then we modify it for cut states (see below)
const material = new THREE.MeshPhysicalMaterial({ /* see below */ });
const shard = new THREE.Mesh(geometry, material);

That is the ONLY mesh in the shard component. There is no inner mesh. Inner detail comes from material properties (transmission, ior, dispersion) and from the postprocessing layer (chromatic aberration, bloom).

THE 5 STATES — describe ONE object's appearance, not two objects:

State 0 (cutProgress = 0): "The Block"
- ONE icosahedron, scaled non-uniformly to look chunky/blocky
- Per-vertex displacement via simplex noise, amplitude 0.25 — gives it a hewn, irregular, rough-rock surface
- Material:
  - color: 0x14141A (very dark, almost black)
  - roughness: 1.0 (totally rough)
  - metalness: 0.05
  - transmission: 0.0 (totally opaque)
  - opacity: 1.0
- The shard looks like: a rough black rock. You CANNOT see through it. There is NOTHING visible inside it.

State 1 (cutProgress = 1): "First Cut"
- SAME icosahedron geometry, but the displacement amplitude reduces to 0.18 — surface gets slightly less rough
- Subtle facet sharpening: increase the geometry's `flatShading` by adjusting normals to be face normals (not vertex normals), making the polygons more visible as flat planes
- Material:
  - color: 0x1A1A22
  - roughness: 0.75
  - transmission: 0.15 (faint transparency starting)
  - thickness: 0.8
  - ior: 1.4
- The shard looks like: a darkly polished stone. Hints of light passing through. No clear "inner scene" yet — just suggestions of internal depth.

State 2 (cutProgress = 2): "Second Cut"
- Displacement amplitude drops to 0.10
- Subdivide the geometry once: `IcosahedronGeometry(1.5, 2)` — creates more facets
- Material:
  - roughness: 0.45
  - transmission: 0.40
  - thickness: 1.0
- The shard looks like: a faceted dark crystal. Light visibly bends through it. Cyan accent rim light becomes visible on facet edges.

State 3 (cutProgress = 3): "Third Cut"
- Displacement amplitude drops to 0.04 — almost flat facets now
- Material:
  - roughness: 0.20
  - transmission: 0.65
  - thickness: 1.2
  - ior: 1.5
- The shard looks like: a translucent gem. You see internal refraction patterns. Light splits subtly. The shape is clearly a many-faceted polyhedron now.

State 4 (cutProgress = 4): "Fourth Cut"
- Displacement amplitude 0.0 — facets are perfectly flat
- Material:
  - roughness: 0.05
  - transmission: 0.85
  - thickness: 1.4
  - ior: 1.55
  - clearcoat: 1.0
  - dispersion: 0.2 (rainbow refraction at edges)
- The shard looks like: an almost-clear cut gem. You can see THROUGH it to whatever is behind. Edges show prismatic light splitting. Postprocessing chromatic aberration intensifies.

State 5 (cutProgress = 5): "Final State"
- Same flat-faceted geometry
- Material:
  - roughness: 0.0
  - transmission: 1.0
  - thickness: 1.5
  - ior: 1.55
  - clearcoat: 1.0
  - dispersion: 0.4
  - color: 0xFFFFFF (now neutral; transparency dominates)
- A subtle pulsing inner glow — implement this NOT with an inner mesh, but with an emissive material property that pulses on a sine wave: `material.emissive = new THREE.Color(0x7DF9FF); material.emissiveIntensity = 0.05 + Math.sin(time) * 0.03;`
- The shard looks like: a perfect translucent cut gem. Slowly rotating. Light refracts through it. The cyan emissive glow gives a sense of "something within" — but there is NO inner mesh. The "something within" is light, refraction, and color.

WHAT YOU SEE THROUGH THE SHARD AT LATE STATES:

When transmission is high, MeshPhysicalMaterial's transmission renders whatever is behind the shard, distorted by refraction. So at States 4-5, the visitor sees:
- The void background
- Whatever ambient lighting hits behind the shard
- The accent point light (positioned behind+above the shard) creating a focal point of light visible THROUGH the gem

That's it. NO procedural code lines. NO wireframe network. NO silhouette inside. NO render target inner scene. The previous version of this file overcomplicated this — discard those concepts entirely.

The illusion of "depth and life" inside the gem comes from:
1. transmission + ior + thickness creating real light bending
2. The pulsing emissive cyan
3. Postprocessing bloom on the bright spots
4. Postprocessing chromatic aberration on edges

These four ingredients together make the gem feel alive WITHOUT any inner geometry.

INTERACTION (unchanged from spec):

- Auto-rotate slowly (0.003 rad/frame on Y, 0.0008 on X)
- Cursor parallax: damped lerp of rotation toward (mouse.x * 0.2, mouse.y * 0.2), lerp factor 0.06
- Pointer drag: angular velocity gets drag delta * 0.005, dampens by 0.94 per frame
- prefers-reduced-motion: render State 5 statically, no rotation, no parallax

CUT TRANSITIONS:

The cutProgress value is a FLOAT, lerped over 1200ms with cinematic ease when it changes. Use a SINGLE useFrame to interpolate the displayed material/geometry properties from current toward target every frame. Do not swap geometries; keep one geometry whose displacement amplitude is animated via a uniform, OR rebuild the geometry's position attribute on cutProgress changes (whichever is simpler).

DRIVING cutProgress:

Listen for window event 'null-sector:cut-progress' with detail.value being the target. Internally lerp toward that target.

For testing this step in isolation, add temporary debug buttons in the bottom-right of the canvas: 6 small buttons labeled 0,1,2,3,4,5. Clicking dispatches the event. Guard with `import.meta.env.DEV` so they're stripped in production.

LIGHTING — exactly these lights, no more no less:<ambientLight intensity={0.3} color={0x404060} />
<pointLight position={[3, 2, 3]} intensity={2} color={0x7DF9FF} distance={10} />
<pointLight position={[-3, -1, -2]} intensity={0.4} color={0xFFFFFF} distance={10} />
<pointLight position={[0, 0, -5]} intensity={1.5} color={0xFFFFFF} distance={20} />
```
The fourth light (behind the shard) is what you see THROUGH the shard at high transmission. That's how the "internal glow" effect emerges naturally without an inner mesh.
POSTPROCESSING:
Use @react-three/postprocessing:

ChromaticAberration: offset [0.0008 * cutProgress, 0.0008 * cutProgress] — scales with cuts
Bloom: intensity 0.4, luminanceThreshold 0.2, radius 0.6
Noise: opacity 0.02 (very subtle film grain inside the canvas)

CAMERA:
PerspectiveCamera, fov 45, position [0, 0, 5]. Camera lerps toward (mouse.x * 0.4, mouse.y * 0.4, 5) with 0.04 lerp. Always lookAt(0,0,0).
PERFORMANCE:

Pixel ratio capped at min(devicePixelRatio, 2)
Cap to 60fps
transmission requires <meshPhysicalMaterial transmission={value} /> AND the renderer needs gl={{ powerPreference: 'high-performance', antialias: true }} on the Canvas
For transmission to render correctly, you need a transmission render target. Three.js handles this automatically with MeshPhysicalMaterial when transmission > 0, but the render target needs an envMap or a background to "transmit." Set <color attach="background" args={['#0A0A0F']} /> inside the Canvas.

INTEGRATION:
Component path: src/components/Shard.tsx. Mount via Astro island in Hero.astro: <Shard client:visible /> inside the existing #shard-mount div.
DELIVERABLES:

The SINGLE component file src/components/Shard.tsx — complete, runnable
A short verification checklist
A commit message: "step-03: shard — corrected, single object, transmission-driven cuts"

DO NOT INCLUDE:

Any second mesh inside the shard
Any inner sphere, inner cube, inner anything
A render-to-texture inner scene
Any procedural code rendering, wireframe networks, or silhouettes
Anything beyond ONE faceted polyhedron with smart material properties

THE TEST: when you finish writing, re-read your code. Search for the word "Mesh" or "geometry" — there should be EXACTLY ONE mesh declaration in the entire Shard component. If there are two, you have failed and must rewrite.
Begin.
````

---

## Verification checklist for step 03

Run `pnpm dev`. Load `localhost:4321`. **All** must be true:

- [ ] The shard appears in the right half of the hero on desktop (top half on mobile)
- [ ] Initial state is rough opaque obsidian — clearly a "block," not a smooth shape
- [ ] The shard slowly auto-rotates
- [ ] Moving the cursor over the shard's canvas tilts it toward the cursor
- [ ] Click-and-drag rotates with momentum that dampens
- [ ] The temporary "0/1/2/3/4/5" debug buttons render at bottom-right of the shard area
- [ ] Clicking each button visibly transforms the shard:
  - [ ] State 0: rough block, opaque
  - [ ] State 1: top facet polished, slight transmission, glimpse of inner code
  - [ ] State 2: more facets, more transmission, network forming inside
  - [ ] State 3: half-cut gem, silhouette visible inside
  - [ ] State 4: nearly clear, chromatic aberration visible
  - [ ] State 5: fully transparent gem, inner scene fully readable, slow counter-rotation visible
- [ ] Transitions between states are smooth (1200ms ease, no jank)
- [ ] The accent light brightens as cutProgress increases
- [ ] Frame rate holds 60fps on a mid-range laptop in state 5 (the heaviest state)
- [ ] No console errors related to shaders or geometries
- [ ] On mobile (resize to 375px wide), the shard renders correctly in the top half of the layout
- [ ] On `prefers-reduced-motion: reduce`, the shard renders State 5 statically

---

## Common Haiku failure modes (and fixes)

- **Shader compilation error on first load.** Haiku sometimes mixes WebGL 1 and 2 syntax. Fix: ensure all shaders use `#version 300 es` and modern `in/out` syntax, OR use Three.js's `onBeforeCompile` hook which is more forgiving.
- **`MeshPhysicalMaterial` transmission appears black.** Common cause: missing `transmissionResolution` set on renderer. Fix: in the parent Canvas, pass `gl={{ powerPreference: 'high-performance' }}` and on material set `transmission={1}`, `thickness={0.5}`, and ensure scene has an envMap or the inner scene as a background.
- **Cuts don't show smooth transitions.** Cause: lerping integer states without a fractional value. Fix: cutProgress is a float, not an int. The current visual state is `Math.floor(cutProgress)` and the transition mix is `cutProgress - Math.floor(cutProgress)`.
- **Performance tanks at state 4-5.** Cause: chromatic aberration + bloom + transmission compound. Fix: lower the renderTarget resolution of the inner scene to 256x256, lower bloom intensity to 0.2.

---

## Token cost estimate

Sonnet: ~14k in / 18k out (this is the heaviest step)
Haiku: ~14k in / 28k out (Haiku will write more shader code than necessary; trim it manually)

If running on Haiku and output starts going off the rails (e.g. inventing components not asked for), kill the generation and restart with a smaller scope: ask only for "the geometry and material with cutProgress driving displacement," verify, then in a second pass ask for "the inner scene render target," verify, then a third pass for postprocessing.

---

## Commit and continue

```bash
git add .
git commit -m "step-03: shard — five states, scroll-ready"
git push
```

Move to `04_BUILD_DOSSIER.md`.
