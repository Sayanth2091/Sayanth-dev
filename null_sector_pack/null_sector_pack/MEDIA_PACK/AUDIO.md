# AUDIO.md

> Six audio files. The site works without them but loses 40% of its impact. Audio is what turns a portfolio into something memorable.

**Final paths:**

```
public/audio/
├── ambient.mp3      ~60-second loop, low frequency drone
├── tick.wav         ~40ms, hover ticks
├── transmit.wav     ~200ms, modem chirp
├── cut.wav          ~600ms, crystal cut
├── decrypt.wav      ~1200ms, static-to-clarity
└── keystroke.wav    ~30ms, terminal keypress
```

**Total file size budget:** under 2MB combined. Most should be tiny WAVs; only the ambient is MP3.

---

## Source priority

For each file, try sources in this order:

1. **Freesound.org** — free, CC0 (no attribution needed) or CC-BY (attribution in README). Search the suggested terms below.
2. **Suno AI** — for the ambient drone, you can generate a custom one. (You've used Suno before.)
3. **ElevenLabs SFX** — for UI sounds. Free tier covers the volume needed.
4. **Manual recording** — your own keyboard, your own desk tap. Works for keystroke and tick.

---

## 1. ambient.mp3 — looping ambient drone

**Specs:**
- 60-second seamless loop (the loop point must be inaudible)
- Low frequency dominant: ~70Hz pad with very subtle higher harmonics
- Almost silent music — sets a mood, never demands attention
- Mono or stereo, 192 kbps MP3 (file should be ~1.4MB)

### Option A — Freesound search terms

Search Freesound.org for any of these:

- `ambient drone dark`
- `dark room ambience loop`
- `sci-fi base loop`
- `low frequency hum loop`
- `cinematic dark pad`

Filter by:
- License: Creative Commons 0 or Attribution
- Duration: 30-120 seconds
- Tag: `loop` or `seamless`

Recommended specific search:
```
https://freesound.org/search/?q=dark+ambient+loop&f=duration%3A%5B30+TO+120%5D+license%3A%22Creative+Commons+0%22
```

### Option B — Generate with Suno AI

Suno is great for this. Use this prompt:

```
A cinematic dark ambient drone loop. Very low frequency, around 70Hz. Subtle slow modulation, almost imperceptible. No melody. No drums. No vocals. Pure atmosphere. Like the score for a Severance scene where someone is walking down an empty corridor at 3 AM. 60 seconds, seamless loop, fade in fade out at the edges. Reference: Trent Reznor & Atticus Ross score for Mank. Soundtrack to surveillance.

Style: dark ambient, drone, cinematic
Length: 60 seconds
Instrumental: yes
```

Run 3 generations, pick the most boring (not the most exciting — the goal is not to draw attention).

### Post-processing

Whatever you source:

1. Open in Audacity (free)
2. Apply a low-pass filter at 200Hz (rolloff 12dB/oct) — kills any unwanted high frequencies
3. Reduce overall volume by -6dB — it should be barely audible at normal listening levels
4. Use Audacity's Effect → Repair → Crossfade Loop to make the loop point seamless
5. Export as MP3, 192 kbps, stereo

### Loudness target
-28 LUFS integrated. Use Audacity's Loudness Normalization plugin or any LUFS meter.

---

## 2. tick.wav — UI hover tick

**Specs:**
- ~40ms duration
- Sharp, small, mechanical
- Mid-frequency (~1-3kHz dominant)
- Mono, 16-bit PCM, file <10KB

### Sources

Freesound search:
- `mechanical click short`
- `tick small`
- `ui click subtle`
- `keyboard click single`

Suggested:
```
https://freesound.org/search/?q=tick+ui+short&f=duration%3A%5B0+TO+0.2%5D
```

### Manual option

Tap your fingernail on a hard surface near a phone microphone. Record. Trim to 40ms in Audacity. You'll get a perfect natural tick that no one has ever heard.

### Post-processing

1. Trim to ~40ms exactly
2. Apply a tiny fade-in (5ms) and fade-out (10ms) to avoid clicks
3. Normalize to -6dB peak (not 0 — keep headroom)
4. Export as WAV, 16-bit mono

---

## 3. transmit.wav — modem chirp

**Specs:**
- ~200ms duration
- A short electronic chirp, like a 56k modem handshake compressed
- Frequency sweep, ideally low to high
- Mono, 16-bit PCM, file <30KB

### Sources

Freesound search:
- `modem dial up short`
- `digital chirp transmission`
- `data send sound`
- `sci-fi message sent`

Specific recommendation: search for `modem` and filter to under 1 second. Modem sounds chopped to 200ms become beautiful UI.

### Generate alternative — ElevenLabs SFX

If you have ElevenLabs free tier:

```
Prompt: "A short 200 millisecond electronic chirp, like a modem connecting, but compressed into a quarter second. Frequency sweep from 800Hz up to 2400Hz. Subtle distortion. Sci-fi UI sound."
Duration: 0.2 seconds
```

### Post-processing

1. Trim to ~200ms
2. Apply 5ms fade in, 20ms fade out
3. Normalize to -3dB peak
4. Export WAV 16-bit mono

---

## 4. cut.wav — crystal cut sound

**Specs:**
- ~600ms duration
- A single resonant *chk* — like a clean cut through crystal or glass
- The signature sound of the site (plays at every shard cut)
- Mono, 16-bit PCM, file <50KB

### Sources

Freesound search:
- `glass crack short`
- `crystal break clean`
- `ice crack single`
- `sword draw short`
- `metal cut clean`

This one is critical — search hard. Listen to many. Pick the one that feels most like "the geometry just changed."

### Suggested specific search

```
https://freesound.org/search/?q=crystal+crack+single&f=duration%3A%5B0.3+TO+1%5D
```

A clean ice-cracking sample edited down works great. Or a single piano string struck and cut short.

### Post-processing

1. Trim to ~600ms (keep the resonant tail)
2. Apply a tiny low-pass filter at 6kHz to remove unwanted brittleness
3. Add a very subtle reverb tail (Audacity's reverb plugin, "small room" preset, only 8% wet) — gives the cut a sense of space
4. Normalize to -3dB peak
5. Export WAV 16-bit mono

---

## 5. decrypt.wav — static-to-clarity whoosh

**Specs:**
- ~1200ms duration
- Starts as static or noise, resolves to clarity (sometimes a soft tone, sometimes silence)
- Plays during boot sequence and konami unlock
- Mono or stereo, 16-bit PCM, file <100KB

### Sources

Freesound search:
- `radio tuning static to clear`
- `sci-fi reveal whoosh`
- `decryption sound ui`
- `transmission opens`
- `signal lock`

### Suggested approach

A "radio tuning" or "channel locking" sample is the perfect base. Many Freesound users have uploaded these.

### Generate alternative — Suno or ElevenLabs

```
Prompt: "1.2 second sound effect: starts with white noise / TV static, gradually filters down to a clean low electronic tone, ending in silence. Cinematic sci-fi reveal sound. Like a transmission becoming clear."
```

### Post-processing

1. Trim to ~1200ms
2. Ensure clean fade-in (50ms) and fade-out (200ms)
3. Apply slight reverb (8% wet) for cinema feel
4. Normalize to -3dB peak
5. Export WAV 16-bit, stereo if reverb is engaged, mono otherwise

---

## 6. keystroke.wav — terminal keypress

**Specs:**
- ~30ms duration
- A single mechanical-keyboard tap
- Will be played dozens of times in the terminal — must be subtle
- Mono, 16-bit PCM, file <8KB

### Sources

Freesound search:
- `mechanical keyboard single`
- `key press cherry mx`
- `keystroke single short`

### Manual option (BEST)

Record your own mechanical keyboard with your phone. Trim a single keypress in Audacity. This will sound more natural than any pre-recorded sample, and it's literally YOUR keyboard.

### Post-processing

1. Trim to ~30ms
2. Apply 2ms fade-in and 5ms fade-out
3. Normalize to -9dB peak (very quiet — it plays many times)
4. Export WAV 16-bit mono

---

## Putting it all together

After all 6 files are generated:

1. Place them at the correct paths in `public/audio/`
2. Test in the browser — open the live site, toggle audio on, hover links, scroll between sections
3. Listen on cheap earbuds, not studio monitors. The site will be heard on phone speakers and bad laptops 90% of the time.
4. If any sound is "too loud" — lower the file's normalization. The audio engine has volume controls, but the source should be subtle from the start.

## Verification checklist

- [ ] All 6 files exist at correct paths in `public/audio/`
- [ ] `ambient.mp3` loops seamlessly (no audible click at loop point)
- [ ] All UI sounds are subtle — none startle you on first hear
- [ ] Total combined size <2MB
- [ ] No file is louder than -3dB peak
- [ ] Tested on cheap earbuds and phone speaker

## Licensing note

If you use Creative Commons audio:
- CC0 — no attribution required, but listing it in your README is a courtesy
- CC-BY — attribution required. List in README as: `ambient.mp3 by [author] via Freesound, CC-BY 4.0`

If you generate with Suno: review their commercial-use terms (free tier has restrictions; paid tier doesn't).

If you record yourself: it's yours.
