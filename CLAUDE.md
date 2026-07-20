# CLAUDE.md

Start here, then read **[AGENTS.md](AGENTS.md)** — it is the source of truth for how to
work in this repo. This file exists so any harness (Claude, Cursor, etc.) starts in the
same place. Keep instructions in AGENTS.md, not here, so the two never drift.

Also read, as needed:

- **[DESIGN.md](DESIGN.md)** — visual language, CSS structure, component naming.
- **[COPY_BRIEF.md](COPY_BRIEF.md)** — voice, positioning, ICPs, approved proof points. Read before writing any copy.
- **[COPY_WORKFLOW.md](COPY_WORKFLOW.md)** — the copy drafting process.
- **[README.md](README.md)** — build, preview, and deploy commands.

## Critical rules (do not miss)

- **Static only**: HTML, CSS, and vanilla JavaScript. Do not add React app setup, Astro, Vite, TypeScript page builds, or SPA tooling.
- **Never use the em dash character (`—`)** in website copy.
- Shipped root pages (`index.html`, etc.) are **generated**. Edit the `main-*.html` fragments, `footer-full.html`, and `styles/*.css`, then run `npm run build`.
- Use root-relative asset paths (`/icons/...`, `/images/...`) so nested routes work.

## Build and verify

```bash
npm run build
node build-discover-dist.js
npm run verify
```
