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
Build the shard centerpiece for NULL_SECTOR. This is build step 03 of 10 and is the most complex step.

Read 00_NARRATIVE_BIBLE.md first. The shard's behavior IS the site's narrative. Re-read section 3 ("The Excavation") and section 7 ("Visual Spine") before writing code.

WHAT TO BUILD:

A React Three Fiber scene that mounts into #shard-mount. The component is `src/components/Shard.tsx` and is loaded as an Astro island with client:visible.

THE SHARD HAS FIVE STATES, controlled by a single `cutProgress` value from 0 to 5:

State 0 (cutProgress = 0): The Block
- Geometry: BoxGeometry with 8 segments per axis
- Surface: displacement via simplex noise, ~0.15 amplitude — looks like rough hewn obsidian
- Material: MeshPhysicalMaterial, color #1A1A22, roughness 0.9, metalness 0.1, opacity 1, transmission 0
- Edge highlight: very subtle, accent color at 0.2 opacity
- The inner scene is invisible (the block is opaque)

State 1 (cutProgress = 1): First Cut
- The TOP of the block is sliced off cleanly. The geometry now has one flat polished facet.
- Material transitions: roughness 0.7, transmission 0.15
- Inner scene: barely visible through the cut facet. Glimpse of code lines.
- A 600ms animation: the cut "happens" — a thin accent-colored line sweeps across the top, then the noise on that face flattens.

State 2 (cutProgress = 2): Second Cut
- Two side facets are now cut.
- Material: roughness 0.5, transmission 0.35
- Inner scene: more visible. The wireframe network topology starts forming.
- Same 600ms cut animation on each new facet.

State 3 (cutProgress = 3): Third Cut
- All vertical faces cut. Block is becoming an octahedron-ish form.
- Material: roughness 0.3, transmission 0.55
- Inner scene: silhouette begins forming inside.
- Edge highlight grows to 0.5 accent opacity.

State 4 (cutProgress = 4): Fourth Cut
- Bottom and remaining faces cut. Form is now a faceted gem.
- Material: roughness 0.1, transmission 0.8
- Inner scene: fully visible. Code, network, silhouette all rendering.
- Postprocessing: chromatic aberration on edges activates.

State 5 (cutProgress = 5): Final State
- Pure cut gem. Crystal clear.
- Material: roughness 0.0, transmission 1.0, ior 1.5
- Inner scene: at full clarity, slowly rotating opposite the shard.
- Edge highlight at 1.0 accent opacity.
- A faint inner glow.

ANIMATION SYSTEM:

The cutProgress value is driven by GSAP ScrollTrigger. As the user scrolls past each section, cutProgress lerps to the next integer over 1200ms with the cinematic ease.

Use a single `useFrame` to interpolate the actual material/geometry properties from the current state toward the target state every frame. Do NOT swap geometries — instead, manage all 5 states by:
- Pre-computing 5 geometry variants at mount
- Storing them in a ref
- Cross-fading via a custom shader that blends two geometries based on the fractional part of cutProgress
- OR (simpler approach Haiku is more likely to get right): use a single geometry and animate the noise displacement amplitude per-face by sampling cutProgress

USE THE SIMPLER APPROACH FOR HAIKU. The simpler approach:
- Single BoxGeometry with 8 segments
- A per-vertex attribute "faceIndex" added in onBeforeCompile
- A uniform uCutProgress passed in
- In the vertex shader, the displacement amplitude for each face is a function of (faceIndex, uCutProgress) — once cutProgress >= faceIndex, amplitude lerps to 0 (face becomes flat)
- Material color, transmission, roughness all driven by uniforms that interpolate from state values

THE INNER DATA SCENE:

A separate, smaller Three.js scene rendered to a render target, used as a texture for the shard's `transmission` map. Contents:
- A vertical scrolling list of mono code lines (real code from your projects — pull 50 lines from a string array)
- A wireframe sphere with random connecting lines (network topology)
- A low-poly human silhouette in profile (use a simple extruded shape)
- All in fg-mid white on void background
- The inner scene rotates slowly opposite the shard rotation
- The inner scene is rendered at 512x512

CURSOR INTERACTION:

- Default: shard slowly auto-rotates (rotation.y += 0.003 per frame, rotation.x += 0.0008)
- On cursor hover within the canvas bounds: shard tilts toward cursor (parallax — multiply cursor.x and cursor.y by 0.2 and add to rotation, with damped lerp at 0.06)
- On pointer down + drag: rotation velocity gets the drag delta * 0.005, dampens by 0.94 per frame
- On scroll: cutProgress advances. Hovering still works during scroll.

POSTPROCESSING:

Use @react-three/postprocessing. Add:
- ChromaticAberration with offset [0.0008, 0.0008] — increases with cutProgress
- Bloom with intensity 0.4, luminanceThreshold 0.2, radius 0.6
- Noise overlay at 0.03 opacity (reinforces the page-level grain inside the canvas)

LIGHTING:

- AmbientLight at intensity 0.4, color 0x404060
- PointLight at position (3, 2, 3), color #7DF9FF (accent), intensity 2, distance 10
- PointLight at position (-3, -1, -2), color 0xFFFFFF, intensity 0.4, distance 10
- The accent point light intensifies as cutProgress increases (multiply by 1 + cutProgress * 0.2)

CAMERA:

- PerspectiveCamera, fov 45, position (0, 0, 6)
- Camera follows cursor with 0.04 lerp (mouse.x * 0.4, mouse.y * 0.4, fixed z)
- Always looks at (0, 0, 0)

PERFORMANCE:

- Cap pixel ratio at min(window.devicePixelRatio, 2)
- Use `frameloop="demand"` only if the shard is offscreen — when in viewport, render every frame
- Provide a `prefers-reduced-motion` fallback: if reduced motion is set, the shard renders State 5 immediately, no auto-rotation, no cursor parallax

INTEGRATION:

In `src/components/Hero.astro`, replace the empty shard-mount div with:

```astro
---
import Shard from './Shard.tsx';
---
<div id="shard-mount" class="...">
  <Shard client:visible />
</div>
```

A separate React component `src/components/ShardController.tsx` exposes the cutProgress state via a Zustand store (install zustand if needed) so future sections can read/write it. Or, simpler: export a window event "null-sector:cut-progress" that other modules dispatch when scroll triggers fire.

USE THE WINDOW EVENT APPROACH FOR HAIKU. Simpler than Zustand:
- Shard listens for `window.addEventListener('null-sector:cut-progress', e => setCutProgress(e.detail.value))`
- The scroll trigger code in step 04 dispatches `window.dispatchEvent(new CustomEvent('null-sector:cut-progress', { detail: { value: 1 } }))` etc.

For THIS step, no scroll trigger exists yet. Instead, add a temporary debug control: a small mono row of buttons in the bottom-right of the shard mount, labeled "0", "1", "2", "3", "4", "5". Clicking each dispatches the event. This lets you verify all 5 states work before wiring scroll. Buttons must be removable in one line — guard with `import.meta.env.DEV`.

DELIVERABLES:
1. File tree
2. All component files
3. The full vertex and fragment shader code, complete and tested
4. The inner scene's full source
5. Verification checklist below
6. Commit message: "step-03: shard — five states, scroll-ready"

DO NOT BUILD:
- The scroll trigger that drives cutProgress (step 04 or distributed across each section)
- Any sections beyond hero
- Audio cues for the cuts (step 08)

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
