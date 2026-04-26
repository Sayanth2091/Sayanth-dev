---
caseNumber: "03"
codename: "VESSEL"
classification: "covert channel"
status: "ARCHIVED"
realName: "StegImage"
stack: ["Node.js", "Python", "Express", "React"]
role: "engineer"
outcome: "A web app that hides messages inside images and audio. Built to learn the boundary between data and noise."
period: "2023"
heroVisual: "/images/cases/vessel-hero.png"
order: 5
featured: true
---

## the problem

Steganography is the oldest crypto technique, and the most overlooked. Most people don't know how trivial it is to hide an entire document inside a vacation photo.

## the approach

A web frontend, a Python backend, LSB substitution for images and phase encoding for audio. Demonstrate the concept; let the user feel it.

## what was built

A working app. Upload a carrier, upload a payload, download a stego file. Reverse the process to extract.

## what was learned

The interesting research is in detection, not creation. Hiding is easy; finding is hard. That's where the next case file lives.
