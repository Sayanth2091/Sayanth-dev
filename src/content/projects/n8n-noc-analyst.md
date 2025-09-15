---
title: "N8N NOC Analyst — AI‑assisted event correlation"
summary: "Automated AI-driven correlation that groups similar events and sends structured alerts to reduce noise and speed up triage."
date: 2025-08-01
stack: ["n8n", "Ollama", "Docker", "Python"]
featured: true
---

This project builds a pragmatic “AI analyst” on top of existing monitoring. It ingests events, clusters similar ones, and generates clean, structured summaries for humans.

Goals

- Cut alert noise so responders see patterns quickly
- Keep output auditable with consistent, structured mail formats
- Stay portable (Docker) and simple to operate

Highlights

- Event grouping with light‑weight embeddings and windowed correlation
- Summarization with guardrails and deterministic prompts
- Delivery via email with links to originals and run metadata

Tech

- n8n for orchestration and schedules
- Ollama for on‑box inference
- Python helpers for parsing and scoring
