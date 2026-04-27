---
caseNumber: "07"
codename: "SENTINEL"
classification: "autonomous triage"
status: "DEPLOYED"
realName: "N8N NOC Analyst"
stack: ["n8n", "Ollama", "Docker", "Python", "Webhooks"]
role: "designer · engineer · operator"
outcome: "Reduced first-tier alert noise by ~70%. Operator now reads structured summaries, not raw events."
period: "2025"
heroVisual: "/images/sentinel-hero.jpeg"
heroVideo: "/videos/sentinel-video.mp4"
order: 1
featured: true
---

## the problem

A SOC sees ten thousand alerts a day. Most are noise. The analyst's first hour is spent grouping events that share a root cause — work a graph could do.

## the approach

A pipeline of small composable steps. Events flow into n8n. A local LLM correlates them by host, by tactic, by time window. Output is a single structured summary per cluster, dropped into the analyst's queue.

No agents. No autonomy beyond grouping. Humans still make every decision that matters.

## what was built

A working n8n workflow with twelve nodes. An Ollama instance running on a 6GB VRAM box. A correlation prompt evaluated against three months of historical alerts. Latency under three seconds per cluster.

## what was learned

The model's correlation accuracy plateaus at ~85%. The remaining 15% is where the human matters most.
