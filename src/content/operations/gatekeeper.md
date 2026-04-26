---
caseNumber: "05"
codename: "GATEKEEPER"
classification: "adversarial containment"
status: "IN_DEVELOPMENT"
realName: "LLM Security Firewall"
stack: ["Python", "OWASP LLM Top 10", "FastAPI", "Redis"]
role: "researcher · engineer"
outcome: "A bouncer for AI. Catches prompt injection, jailbreaks, data exfiltration before they reach your model."
period: "2025"
heroVisual: "/images/Gatekeeper.jpeg"
order: 3
featured: true
---

## the problem

LLMs are deployed everywhere with no inspection layer between them and the user. Every input is a potential exploit; every output is a potential leak.

## the approach

A reverse proxy that sits in front of the model. Inspects inbound prompts against the OWASP LLM Top 10. Inspects outbound completions for sensitive patterns. Logs everything. Blocks the obvious; flags the suspicious for review.

## what was built

[in progress]

## what was learned

[in progress]
