# PORTRAIT.md

> The single most impactful image on the site. Goes in the Dossier section. The visitor sees the human inside the system. Spend time here.

**Final file path:** `public/images/portrait.jpg`
**Aspect ratio:** 4:5 (portrait)
**Resolution:** at least 1024×1280, ideally 2048×2560
**Format:** JPG, ~85% quality (file size <300KB)

---

## What it must communicate

- A real person. Not a model, not a stock photo.
- South Indian man, mid-twenties (you).
- An analyst's gaze — focused, slightly tired, looking past the camera, not at it.
- Monitor light on the face — the work is what illuminates him.
- The room is dark. The person is barely lit.

The portrait is **not flattering**. It's surveillance. It's a system file photograph. The visitor should feel they are looking at evidence, not a headshot.

---

## Option 1: Use a real photo of yourself (recommended)

If you have a candid photo of yourself in low light, ideally lit by a screen or a single lamp, that beats any AI-generated image. You are the subject of this site. Use the actual subject.

Process to make it match the aesthetic:

1. Crop to 4:5 portrait
2. Open in Photopea (free, browser-based)
3. Desaturate to ~30% (not full black-and-white — keep the very faintest skin warmth)
4. Drop highlights to 70%, lift shadows slightly
5. Add a 2-3% film grain layer (Filter → Noise → Add Noise, monochromatic, ~3%)
6. Apply a very subtle vignette (Filter → Render → Lens Flare set very dark)
7. Optional: add a 1-pixel cyan accent rim light along one edge of the silhouette using a color overlay layer
8. Export as JPG, quality 85%

This will look better than any Midjourney image. AI-generated faces always have something subtly wrong — uncanny eyes, weird ear, inhuman skin texture. A real photo of you, processed, has none of those problems.

---

## Option 2: Midjourney v6 / Flux 1.1 Pro prompt

If you don't have or don't want to use a personal photo, generate one with this prompt.

### Primary prompt

```
A cinematic portrait of a South Indian man in his mid-twenties, wearing a dark grey hoodie, shot in a dim room lit only by the cool blue-white glow of multiple computer monitors off-camera. His face is partially in shadow, only one side lit. He is looking slightly past the camera, focused on something off-frame. Tired, intelligent eyes. Stubble. Short dark hair. The atmosphere is quiet, surveillant, end-of-shift. Color palette: deep black, monitor blue-white, faint cyan rim light along his jaw. 35mm film grain, shallow depth of field, slight motion blur. Cinematography reference: Roger Deakins lighting in Blade Runner 2049. Severance corporate analyst aesthetic. NOT a headshot. NOT smiling. Surveillance camera quality, candid, like the subject doesn't know they're being photographed.

--ar 4:5 --style raw --stylize 200 --v 6
```

### Style anchor (paste as suffix to all generations to keep consistency)

```
shot like Severance and Blade Runner 2049, monochromatic with cyan accent only, no warm tones, 35mm film grain, dim monitor light, surveillance aesthetic, candid not posed
```

### Alternate prompts if the first doesn't land

**More menacing:**
```
A South Indian man, mid-twenties, sitting in a dark server room, only lit by green and blue indicator lights from racks behind him. He's typing. We see his face from a low angle, three-quarter view. He hasn't slept in 18 hours. Cinematic, like a Mr. Robot frame. 35mm grain. --ar 4:5 --style raw --v 6
```

**More contemplative:**
```
A South Indian man in his twenties, mid-shot, sitting alone in a small home office at 2 AM. A single desk lamp is the only light source. Hoodie up. He is looking at a screen we cannot see. The reflection of code is faintly visible on his glasses. The mood is solitary, focused, slightly lonely. Cinematography reference: Drive (2011) interiors. --ar 4:5 --style raw --v 6
```

**More analytical (closer to "subject file" energy):**
```
A South Indian man, mid-twenties, photographed from a security camera angle. Slightly grainy, slightly washed out, slight motion blur. He's walking past a window in a corporate building at night. Half his face is visible, half cut by the window frame. The image feels like evidence, not a portrait. Aspect ratio 4:5. --style raw --v 6
```

### Generation tips

- Run **at least 4 variants**. Pick the one where the face has the most natural asymmetry (perfectly symmetric AI faces feel fake).
- Avoid Midjourney's `--stylize` above 250 — it pushes the image into cartoonish territory.
- Use `--style raw` to reduce Midjourney's default "epic cinematic" sheen, which works against the "surveillance file" aesthetic.
- If using **Flux 1.1 Pro** instead, drop the `--ar` flags and use Flux's native 4:5 output. Flux handles dim-lit faces noticeably better than Midjourney.

### Post-generation processing

After picking your best generation:

1. Crop tightly to 4:5 if needed
2. Open in Photopea
3. Reduce saturation to ~25%
4. Slightly increase contrast (+10%)
5. Add film grain layer at 4% opacity (Filter → Noise → Add Noise, monochromatic)
6. Apply subtle blue-cyan color grade in shadows (use Image → Adjustments → Color Balance → Shadows: cyan +15)
7. Export at 85% JPG quality

---

## Option 3: Hybrid (best of both worlds)

The professional approach for awwwards-tier output:

1. Take a real candid photo of yourself in dim monitor light
2. Run it through ComfyUI with an img2img workflow at 0.4 denoising strength using a "cinematic film grain" model (you have ComfyUI configured per your past sessions)
3. The output keeps your real face geometry but gains the cinematographic polish

This combines the credibility of "real person" with the production value of generated work. It's also undetectable as AI-touched, because at 0.4 denoising, your actual face dominates.

---

## Verification checklist

The portrait is ready when:

- [ ] 4:5 aspect ratio
- [ ] At least 1024×1280 resolution
- [ ] File size under 300KB
- [ ] Looks like surveillance, not a headshot
- [ ] Cyan or cool blue is the dominant non-skin color
- [ ] Film grain is visible (not heavy)
- [ ] You'd be comfortable showing this image to a recruiter
- [ ] The image works on a `#0A0A0F` background — the dark areas blend into the page

Drop the final file at `public/images/portrait.jpg` in your project.
