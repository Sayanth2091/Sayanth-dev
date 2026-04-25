# TEXTURES.md

> Optional. The site already implements film grain and scanlines via CSS+SVG. Only generate texture images if the CSS-only versions look too clean or too synthetic.

**Final paths:**
```
public/images/textures/
├── grain.png       (optional — replaces CSS grain if present)
└── scanlines.png   (optional — used over portrait)
```

Both are optional. Skip this entire file if the CSS fallbacks look fine.

---

## When to generate textures

- The CSS grain in `BaseLayout.astro` looks fake / too repetitive
- You want a more analog feel (real-film grain, not noise function)
- You have time and want to add 5% more polish

If unsure, skip and revisit only if the live site feels too digital.

---

## 1. grain.png — film grain overlay

**Specs:**
- 512×512 PNG with transparency
- Subtle monochrome noise — NOT colorful, NOT high contrast
- Tileable (must repeat seamlessly)
- File size <60KB

### Sources

**Free, ready-to-use:**
- https://www.lostandtaken.com/textures/grain (free, multiple variants)
- https://textures.com (free with account, search "grain" and "noise")
- https://www.transparenttextures.com (search "noise")

**Generate in Photopea (free, browser-based):**

1. New file: 512×512, transparent background
2. Filter → Noise → Add Noise → Monochromatic, ~12% strength
3. Filter → Blur → Gaussian Blur → 0.4px (softens the noise so it doesn't look like sand)
4. Image → Adjustments → Levels → bring midpoint to ~0.85 (darken so the texture is mostly invisible)
5. Filter → Other → Offset → 256, 256 → check that the seams aren't visible. If they are, use the clone stamp to blend.
6. Export as PNG, transparency on

### Usage in code

If you generate this, swap the CSS-only grain in `BaseLayout.astro` with:

```astro
<div class="fixed inset-0 z-40 pointer-events-none opacity-[0.04]"
     style="background-image: url('/null-sector/images/textures/grain.png'); background-size: 512px 512px;"></div>
```

Add a CSS animation to translate the background-position 4px per second, randomly. This creates the "moving grain" feel of real film:

```css
@keyframes grain-shift {
  0% { background-position: 0px 0px; }
  10% { background-position: -2px 1px; }
  20% { background-position: 1px -3px; }
  30% { background-position: -1px 2px; }
  /* ... 10 keyframes total, random translations */
  100% { background-position: 0px 0px; }
}
.grain-overlay {
  animation: grain-shift 8s steps(10) infinite;
}
```

---

## 2. scanlines.png — CRT scanline overlay

**Specs:**
- 4×4 PNG with transparency (it's tiny — that's correct)
- Two horizontal lines, slight vertical gap
- File size <1KB

This is so simple you can generate it inline with CSS, no PNG needed:

```css
.scanlines::after {
  content: '';
  position: absolute;
  inset: 0;
  background: repeating-linear-gradient(
    to bottom,
    transparent 0px,
    transparent 2px,
    rgba(0, 0, 0, 0.15) 2px,
    rgba(0, 0, 0, 0.15) 3px
  );
  pointer-events: none;
  mix-blend-mode: multiply;
}
```

Use the CSS version unless you specifically need a curved or imperfect scanline pattern (in which case generate a 256×256 PNG with hand-drawn imperfections in Photopea).

---

## 3. Bonus: noise data texture for the shard's inner scene

If you want to push the shard's inner scene further, generate a 512×512 noise texture for use as a displacement map or pattern overlay.

**Generate in Photopea:**

1. New file 512×512, white background
2. Filter → Render → Clouds (creates organic noise)
3. Filter → Distort → Wave with random parameters
4. Image → Adjustments → Levels → push contrast hard
5. Image → Adjustments → Hue/Saturation → desaturate fully
6. Export as PNG

Drop into `public/images/textures/noise.png`. The shard's inner scene shader can use it for subtle texture variation.

---

## Verification checklist

If you generated textures:

- [ ] grain.png is 512×512, tileable, under 60KB
- [ ] grain.png is desaturated (no color cast)
- [ ] grain.png is mostly invisible — should NOT dominate the design
- [ ] On the live site, the grain visibly improves the texture quality vs CSS-only
- [ ] Page load time has not regressed by more than 50ms

If textures don't visibly improve the site, **delete them**. Less is better. The CSS fallbacks were chosen because they're good enough for 95% of cases.
