---
caseNumber: "06"
codename: "NORTHWALL"
classification: "sovereign intelligence"
status: "IN_DEVELOPMENT"
realName: "OpenClaw"
stack: ["Ollama", "Whisper", "Piper TTS", "FastAPI", "SQLite"]
role: "founder · architect · engineer"
outcome: "An offline AI assistant that speaks Malayalam, runs without the cloud, and forgets when asked."
period: "2025 — present"
heroVisual: "/images/northwall-hero.png"
order: 2
featured: true
---

## the problem

Big Tech AI assumes you have bandwidth, English, and trust. Most of the world has none of those.

## the approach

A small assistant that runs locally, speaks the languages of South India, and ships as a hardware-plus-subscription product instead of a cloud service.

## what was built

A FastAPI server, a tuned llama3.2:3b model, voice in and out via Whisper and Piper, persistent memory in SQLite. Currently running on a VirtualBox stack; next step is a dedicated Mini PC SKU.

## what was learned

The defensible moat is not the model. It's hyperlocal human curation of training data. Big Tech can't do this. We can.
