# HAIKU MODE — pre-pend rules

> When running a build prompt with Claude Haiku instead of Sonnet, paste this BEFORE the build prompt. It adds the hand-holding Haiku needs to stay on track.

---

## The Haiku addendum (paste at the top of every build prompt)

```
HAIKU MODE — STRICT RULES:

1. Read 00_NARRATIVE_BIBLE.md first. Treat it as immutable.

2. Output format — MUST be exactly this structure, no other formatting:
   - First, a single code block containing the full file tree of new/modified files
   - Then, for each file, in order:
     - A heading: ### path/to/file.ext
     - A single code block containing the file's complete contents
   - At the end:
     - A heading: ### commands to run
     - A single code block with shell commands in execution order
     - A heading: ### verification checklist
     - A bulleted list

3. Do not skip files. Do not paraphrase. Do not summarize. Do not add "and so on..."

4. Do not invent dependencies. Use only the dependencies installed in step 01. If you think you need a new one, STOP and ask first.

5. Do not modify files outside the scope listed in this build step. If a previous step's file needs a small edit, list it explicitly and show the exact change.

6. If you are uncertain about any requirement, output a single line at the start: `[CLARIFICATION NEEDED]: <question>` and STOP. Do not guess.

7. Do not output prose explanations longer than 2 sentences anywhere except inside the verification checklist.

8. Use these exact constants. Do not derive them. Do not "improve" them.
   - Canvas color: #0A0A0F
   - Accent color: #7DF9FF
   - Default ease: cubic-bezier(0.65, 0, 0.35, 1)
   - Default duration: 800ms
   - Mono stagger: 60ms
   - Cut transition duration: 1200ms

9. Use these exact dependency versions:
   - astro: ^4
   - @astrojs/react: ^3
   - @astrojs/tailwind: ^5
   - tailwindcss: ^3
   - three: ^0.160
   - @react-three/fiber: ^8
   - @react-three/drei: ^9
   - @react-three/postprocessing: ^2
   - gsap: ^3.12
   - lenis: ^1
   - react: ^18

10. If asked for shaders, write valid GLSL only. No pseudocode. No "// add noise function here" comments. Either write the full noise function or import a known one.

11. If asked for components, never use placeholder copy. Use the exact strings provided in the build prompt. Voice rules are non-negotiable.

12. Output is committed to git verbatim. There is no second chance. If something doesn't compile, you have failed the step.

Now read the build prompt below and execute.

---
```

## Why each rule exists

1. **Read the bible first.** Haiku has a recency bias — it overweights the most recent prompt. Forcing a re-read of the bible re-anchors voice and style.
2. **Strict output format.** Haiku tends to wander into chatty explanations. Structured output is faster to copy-paste and reduces drift.
3. **No skipping.** Haiku will sometimes write "the rest follows the same pattern" — this is unacceptable for production code.
4. **No dependency invention.** Haiku has hallucinated package names ("astro-three", "gsap-plus"). The strict allowlist prevents this.
5. **No scope creep.** Haiku will rewrite step 03 files when working on step 06 if not constrained. This rule prevents poisoning earlier work.
6. **Clarify or stop.** Haiku will guess silently when uncertain. Forcing it to ask costs nothing and prevents 30-minute debugging sessions.
7. **No padding prose.** Haiku doubles output length with explanations. Trimming saves tokens and reading time.
8. **Exact constants.** Haiku rounds, derives, "improves" hex colors. Forces literal use.
9. **Exact versions.** The single most common Haiku failure: outputting old API patterns from `lenis@0.x` syntax when we want `lenis@1.x`.
10. **No pseudo-shaders.** Haiku's biggest failure mode in 3D: writing `// add fbm noise here` comments instead of actual code.
11. **No placeholder copy.** Haiku will write "Lorem ipsum SOC analyst description goes here." Strict copy enforcement prevents this.
12. **Verbatim commit.** Sets the seriousness bar.

---

## When Haiku still drifts

If despite these rules Haiku produces broken output:

1. **Smaller scope.** Break the step into halves. Run the first half, verify, then ask for the second half.
2. **One file at a time.** Instead of "build the dossier section," ask for "the Dossier.astro file only, skipping all other files." Then ask for the next file separately.
3. **Show, don't tell.** If Haiku won't follow a pattern, paste a working example from a previous step's output and say "match this style exactly."
4. **Restart fresh.** Sometimes Haiku gets stuck in a bad output loop. Start a new conversation with `00_NARRATIVE_BIBLE.md` + the build prompt. The token cost of restarting is lower than the cost of fighting a corrupted thread.

---

## When to switch to Sonnet

If you find yourself doing more than 2 retries on a single step, switch to Sonnet for that step. The math:

- Haiku at 4 retries: 4× token cost + 4× your time
- Sonnet at 1 try: 1× token cost (10× per token but 4× fewer tokens) + 1× your time

Sonnet wins as soon as Haiku misbehaves twice. Don't be precious about the model choice — the goal is the site, not loyalty to a tier.
