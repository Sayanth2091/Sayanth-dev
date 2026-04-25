# CASE_VISUALS.md

> Six hero visuals, one per operation. These show in the Operations horizontal scroll. Each is a single image that visually represents the case file's concept.

**Aspect ratio:** 4:5 (portrait, matching the card layout)
**Resolution:** at least 1024×1280
**Format:** PNG with transparency where helpful, otherwise JPG
**Style:** abstract, conceptual — never literal screenshots, never UI mockups

---

## The shared style anchor

Paste this at the end of EVERY case visual prompt to keep them consistent:

```
monochromatic palette of deep black #0A0A0F, white at low opacity, single cyan accent #7DF9FF, no other colors, abstract conceptual illustration, slight film grain, cinematic, dark, 4:5 aspect ratio, NO TEXT, NO LOGOS
```

---

## 1. SENTINEL — autonomous triage

**Final path:** `public/images/cases/sentinel-hero.png`

**Concept:** A graph of glowing nodes, most dim and clustered, a few highlighted in cyan. Lines connect them. The image suggests "the system has identified the signal in the noise."

### Midjourney / Flux prompt

```
An abstract dark visualization of a network of small circular nodes connected by thin lines, scattered across a black background. Most nodes are dim white, low opacity. A small cluster of about 5 nodes glows bright cyan, connected to each other but isolated from the rest. The cyan cluster looks like an organism inside the noise. Top-down view, scientific diagram aesthetic. Slight glow, soft bloom on cyan. Like a graph database visualization, but cinematic. --ar 4:5 --style raw --v 6 [STYLE ANCHOR]
```

### Alternative concept

A cluster of dots with one trail of cyan light tracing a path between them — suggesting "the AI found the pattern."

---

## 2. NORTHWALL — sovereign intelligence (OpenClaw)

**Final path:** `public/images/cases/northwall-hero.png`

**Concept:** A small isolated hardware device, like a Mini PC or a Raspberry Pi-form-factor box, glowing faintly in a dark room. The visual metaphor is "sovereign compute" — independence, locality, off-grid.

### Midjourney / Flux prompt

```
An isometric product render of a small black computing device, like a Mac mini or Raspberry Pi enclosure, sitting on a wooden surface in a dark room. A single cyan LED glows on its face. The room around it is empty, dim, almost agricultural — suggests a rural setting. The device feels alive but quiet. Soft volumetric lighting from a single source. Cinematic still life. --ar 4:5 --style raw --v 6 [STYLE ANCHOR]
```

### Alternative concept

A topographic map of South India in faint white lines, with a single cyan dot in Kerala — "the assistant is here."

---

## 3. GATEKEEPER — adversarial containment (LLM Firewall)

**Final path:** `public/images/cases/gatekeeper-hero.png`

**Concept:** A wall, a barrier, a filter. Streams of data hitting it — some pass through (cyan), most stop (white, dim). The visual metaphor is "selective filtering."

### Midjourney / Flux prompt

```
An abstract visualization of a vertical wall of fine particles or noise, with horizontal streams of light hitting it from the left side. Some streams pass through the wall and continue cleanly. Others scatter, dissolve, or are reflected. The streams that pass through glow cyan; those that stop fade to white. Sci-fi aesthetic. Like a particle filter or a force field rendered abstractly. --ar 4:5 --style raw --v 6 [STYLE ANCHOR]
```

### Alternative concept

A close-up of a single doorway, viewed from inside, with cyan light beams coming through the gaps but the door itself is a dark monolithic shape.

---

## 4. ASCLEPIUS — clinical defense (Healthcare SOC)

**Final path:** `public/images/cases/asclepius-hero.png`

**Concept:** A medical/clinical setting reframed as a security target. Hospital corridor or X-ray imagery overlaid with security signal.

### Midjourney / Flux prompt

```
A long hospital corridor at night, dim, empty, photographed in deep shadow. The fluorescent lights are off. A single cyan light source emerges from a doorway in the distance, casting a thin cyan line down the polished floor. The image feels like a thriller — a hospital after-hours, something is being investigated. Cinematic still. Reference: hospital scenes from Severance season 1. --ar 4:5 --style raw --v 6 [STYLE ANCHOR]
```

### Alternative concept

An abstract heart-rate / EKG line in cyan over a black background, but the line at one point shows an anomalous spike — the security event hidden inside vital signs data.

---

## 5. VESSEL — covert channel (Steganography)

**Final path:** `public/images/cases/vessel-hero.png`

**Concept:** An ordinary image (a vacation photo, a landscape) with the rightmost edge dissolving into pure pixel data — revealing the hidden information beneath.

### Midjourney / Flux prompt

```
A serene grayscale photograph of a coastal Kerala landscape at dusk — palm trees, water, mist — but the right third of the image is breaking down into individual square pixels of cyan and white, as if the image itself is decompiling. The transition between the photographic left and the pixelated right is jagged, organic. Glitch art aesthetic, but slow and beautiful, not aggressive. --ar 4:5 --style raw --v 6 [STYLE ANCHOR]
```

### Alternative concept

A photograph of an audio waveform pattern, but examined closely, you can see binary text encoded in the peaks.

---

## 6. ANTIBODY — autonomous response (VM-IPS)

**Final path:** `public/images/cases/antibody-hero.png`

**Concept:** A network of cells, like a biological immune system, with one cell glowing cyan and "swallowing" or surrounding a smaller dark intruder cell.

### Midjourney / Flux prompt

```
A microscopic biological visualization, abstract and stylized — multiple small spherical cell-like nodes in a dark fluid medium. One central cell glows cyan and is in the act of surrounding or absorbing a smaller darker shape. The other cells are dim white, watching. Looks like a white blood cell engaging a pathogen, but rendered in a sci-fi network-graph style. Almost looks like a security event being contained at a network level. --ar 4:5 --style raw --v 6 [STYLE ANCHOR]
```

### Alternative concept

A dark network topology graph where one node is "infected" (red, but desaturated to muted) and a wave of cyan ripples outward from a central node, isolating the infected one.

---

## Generation strategy

For each case visual:

1. Run the primary prompt — get 4 variants
2. If none feel right, try the alternative concept
3. Pick the variant that feels most **abstract** — anything literal (a literal hospital, a literal wall, a literal computer) breaks the editorial tone
4. Resize to exactly 1024×1280 if needed (keep aspect 4:5)
5. Drop into `public/images/cases/<codename>-hero.png`

## Common failure modes

- **Too colorful:** add `monochrome, no warm colors, no green, no red` to the prompt
- **Too literal / illustration-y:** add `cinematic still, photorealistic, NOT illustration, NOT digital art`
- **Missing the cyan accent:** if your generation has no cyan, do a second pass with `single cyan accent #7DF9FF` more emphasized at the start
- **Inconsistent across the six:** generate all six in one session, with the same model and same style anchor. Don't mix Midjourney and Flux outputs.

## Verification checklist for case visuals

- [ ] Six PNG files, one per operation
- [ ] All 4:5 aspect ratio
- [ ] All ~1024×1280 or larger
- [ ] All under 500KB each
- [ ] All visually consistent — could be from the same artist
- [ ] All abstract / conceptual, none literal screenshots or UI
- [ ] All have cyan as the only non-monochrome color
- [ ] All work on the void background (#0A0A0F)
- [ ] Files dropped at the correct paths in `public/images/cases/`
