# BetterEngineer Copy Workflow

Use this process whenever you want new or revised website copy.

## 1) Add Inputs

For each new source document, add notes to `COPY_BRIEF.md` under the relevant section:

- Positioning changes
- ICP updates
- Offer details
- Proof points and metrics
- Objection handling language

If a source contains direct quotes, label them as approved quotes.

## 2) Define the Copy Task

Provide:

- Page target (e.g. `main-home.html`, or a specific `technologies/*` page)
- Section target (hero, problem, process, CTA, etc.)
- Objective (conversion, clarity, differentiation, trust)
- Primary ICP (`startup`, `established`, or `agency`)
- Constraints (word count, must-include claims, claims to avoid)

## 3) Draft Pass

Write copy using `COPY_BRIEF.md` plus these hard checks:

- No em dash character (`—`)
- No generic AI-marketing tone
- Every major claim ties to mechanism or evidence
- Objections for chosen ICP are answered directly

## 4) Edit Pass

Edit for:

- Specificity
- Clarity
- Natural cadence
- Strong CTA

## 5) Final QA

- Scan final copy for em dash characters before shipping.
- Confirm tone sounds human and practical.
- Confirm language reflects current ICP and positioning.
- Confirm metrics and proof points match approved claims in `COPY_BRIEF.md`.

## Suggested Prompt Format

Use this exact format when requesting copy updates:

```text
Page: [main-home.html | technologies/<slug>/index.html]
Sections: [hero, social proof, process, CTA]
Objective: [what this copy should achieve]
Audience: [ICP segment]
Must include: [claims, proof points, terms]
Avoid: [phrases, claims, tone]
References: [new docs or pasted notes]
```
