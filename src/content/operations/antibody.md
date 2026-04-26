---
caseNumber: "02"
codename: "ANTIBODY"
classification: "autonomous response"
status: "ARCHIVED"
realName: "VM-Specific Intrusion Prevention System"
stack: ["Python", "nmap", "iptables", "Flask", "React"]
role: "engineer"
outcome: "An immune system for a VM network. Detects scans and floods, blocks the source, logs the encounter."
period: "2023 — 2024"
heroVisual: "/images/cases/antibody-hero.png"
order: 6
featured: true
---

## the problem

Most IPS solutions are network-wide. The VM-level perspective is overlooked, and that's where lateral movement actually happens.

## the approach

A lightweight agent inside each VM. Watches for scan signatures and ping floods. Pushes blocks via iptables. Reports up to a Flask dashboard.

## what was built

A working prototype. Detected and blocked common attack patterns in a controlled lab. Dashboard visualized the network state.

## what was learned

Detection is binary; response is gradient. The hardest design decision was when NOT to block.
