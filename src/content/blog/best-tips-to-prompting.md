---
title: "Best Tips for Prompting: Practical, Repeatable Patterns"
description: "Actionable prompting patterns for agents, analysis and coding."
date: 2025-02-15
tags: [prompting, ai, tips]
category: "tools"
---

High-signal prompting doesn’t rely on magic phrases. It’s about structure, constraints, and feedback.

1) Set role + objective, then success criteria
- Role focuses behavior. Objective defines the job. Success criteria makes evaluation clear.

2) Constrain output shape
- Specify JSON schemas or bullet lists. Add examples. Enforce field names and types.

3) Provide minimal, representative context
- Use the smallest set of examples that captures edge cases. Don’t dump everything.

4) Use stepwise reasoning with checkpoints
- Ask for plan → confirm → execute. Or request a chain of thought summary (“brief rationale” not full thoughts) to keep it concise.

5) Anti-goals and non-permitted actions
- State what to avoid. It lowers hallucinations and scope creep.

6) Iterative feedback loop
- Provide deltas as corrections, not whole prompts. Refer to specific errors to nudge models efficiently.

7) Evaluation hooks
- Add quick tests: regex match, field presence, or lightweight scoring (“rate from 1–5 and justify”).

8) Tool awareness
- Tell the model about available tools, capabilities, and costs (latency/limits) so it picks wisely.

Template

```
You are <role>. Task: <objective>.
Output: <format with example>.
Constraints: <anti-goals, limits>.
Context: <minimal relevant facts/examples>.
Steps: Plan → Confirm → Execute.
Verify: <checks or quick tests>.
```

Use this, iterate with small feedback, and measure quality. That’s 90% of good prompting.

