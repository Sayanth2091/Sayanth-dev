# VIDEO_LOOPS.md

> Entirely optional. Use only if you want extra polish on case detail pages or want a hero video loop. The site is deliberately heavy on 3D and audio — adding video on top can be too much. Default: skip this file.

**Final paths:**
```
public/video/
├── hero-loop.mp4         (optional — alternate hero background)
├── case-loops/
│   ├── sentinel-loop.mp4 (optional — for case detail page)
│   ├── ...etc
```

---

## When to use video loops

✓ **Yes:** If you want one short ambient loop on the `/case/<slug>` detail page as a header background. Replaces the static hero image.

✗ **No:** As background for the homepage. The shard is already the centerpiece. A video behind it competes for attention and tanks performance.

✗ **No:** For the operations cards. Six autoplaying videos in a horizontal scroll is a performance nightmare and an aesthetic mistake.

So at most: **one short loop per case detail page**, only if you want to push for SOTD on awwwards. Six total. Each ~6-8 seconds. All silent. All MP4.

---

## Specs for video loops

- Duration: 6-8 seconds
- Resolution: 1280×720 maximum (don't waste bandwidth on bigger)
- Format: MP4, H.264, ~2 Mbps bitrate
- File size: <2MB per video
- No audio (mute the video element in HTML)
- Seamless loop (last frame matches first frame)

---

## Generation with your existing Wan2GP pipeline

You have an established Wan2GP setup via Pinokio per past sessions. RTX 4060 8GB with the constraints you've worked out:

- Profile 5
- SDPA attention
- 384×672 resolution
- Single-line prompts only (Wan2GP treats line breaks as separate generations)

Below are six single-line prompts, one per operation. Generate each, then upscale to 1280×720 in Upscayl, then convert to MP4 in DaVinci Resolve.

### Sentinel — autonomous triage

```
Slow zoom into a dark grid of glowing dots, where one cluster of cyan dots pulses in rhythm while the rest stay dim, cinematic dark background, monochromatic with single cyan accent, slow motion, 8 seconds
```

### Northwall — sovereign intelligence

```
A small black computing device on a wooden surface in a dim room, cyan LED slowly pulsing, dust particles drift through the air illuminated by a single shaft of light, isometric angle, slow camera dolly forward, 8 seconds
```

### Gatekeeper — adversarial containment

```
Streams of light particles flowing horizontally hit an invisible vertical wall, some pass through and continue cyan, others scatter and dissolve white, cinematic slow motion abstract, dark monochromatic, 8 seconds
```

### Asclepius — clinical defense

```
A long dim hospital corridor at night, fluorescent lights flicker faintly, a single cyan light source emerges from a doorway in the distance casting a thin line down the polished floor, slow camera push forward, 8 seconds
```

### Vessel — covert channel not completed

```
A serene grayscale coastal Kerala landscape at dusk slowly dissolves from left to right into individual cyan and white pixels like a glitching photograph, slow motion abstract, 8 seconds
```

### Antibody — autonomous response

```
Microscopic biological cells floating in a dark fluid, one central cell glows cyan and slowly engulfs a smaller dark intruder cell while other cells in the background pulse faintly white, science fiction aesthetic, slow motion, 8 seconds
```

---

## Generation workflow

For each video:

1. Open Wan2GP via Pinokio
2. Set Profile 5, SDPA attention, 384×672 resolution
3. Paste a prompt (one of the six above, on a single line)
4. Generate. With your hardware this should take 6-12 minutes per generation.
5. If the result is wrong, regenerate with seed variation (Wan2GP seed parameter)
6. When happy, save as MP4

### Post-processing

For each generated video:

1. Open in **DaVinci Resolve** (free version, you have it set up)
2. Place clip on timeline
3. Color grade: pull saturation down to 30%, push shadows toward cyan
4. Add a slight vignette via Resolve's color page
5. Use the **Loop tool** — duplicate clip and crossfade the end of one with the start of the next over 0.5s. The loop point should be invisible.
6. Export: H.264, 1280×720, 2 Mbps target, no audio
7. Place at `public/video/case-loops/<codename>-loop.mp4`

### Upscaling (optional)

If the 384×672 output looks soft after upscaling to 1280×720, run through **Upscayl** before color grading. The Real-ESRGAN model handles this well.

---

## Integration on case detail pages

Update the case detail template (`src/pages/case/[slug].astro` from step 05) to include a video header IF the file exists:

```astro
<div class="aspect-[16/9] bg-[#1A1A22] mb-12 overflow-hidden">
  <video
    src={`/null-sector/video/case-loops/${op.slug}-loop.mp4`}
    autoplay
    muted
    loop
    playsInline
    class="w-full h-full object-cover opacity-70"
  ></video>
</div>
```

The browser will fallback gracefully if the video doesn't exist (just shows the dark block).

---

## When to skip video entirely

If after one or two attempts the videos look amateurish or eat into your time, skip this entire file. The site is excellent without them. Awwwards juries don't reward videos that don't work; they reward restraint and craft.

The 80/20 split:

- 80% of the impact: the shard, the audio, the typography, the boot sequence, the konami code
- 20% of the impact: video loops

Don't optimize for the 20% if it slows down shipping. **Ship without video, then add later if you have appetite.**

---

## Verification checklist

Only if you generated videos:

- [ ] Six MP4 files at `public/video/case-loops/<codename>-loop.mp4`
- [ ] Each file under 2MB
- [ ] Each loops seamlessly (no visible jump at loop point)
- [ ] All silent (no audio track)
- [ ] All in monochrome with cyan accent
- [ ] Page load time on case detail pages still under 3 seconds
- [ ] Mobile: videos either play or fallback gracefully (the `<video>` element handles both)

If you skipped videos: nothing to check. The site works without them.
