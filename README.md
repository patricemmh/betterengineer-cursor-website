# BetterEngineer Static Site

This repository is plain static web work: HTML, CSS, and vanilla JavaScript.

There is no Astro, React app, Vite, TypeScript, or SPA framework for the pages in this repo.

## Where Things Live

- `index.html`, `react.html`, `react-fintech.html`, `hire-ai-ready-engineers.html`, `ai-systems-readiness-for-manufacturing.html`: generated static root pages.
- `main-*.html`: editable page content fragments used by `build-pages.js`.
- `footer-full.html`: shared footer fragment.
- `styles/brand.css`: shared design tokens, layout, header, footer, and base components.
- `styles/landing-page.css`: shared landing-page and service-page components.
- `styles/roles.css`: role index and simple role detail styles.
- `styles/role-detail.css`: front-end engineer role page styles.
- `home.js`, `landing-page.js`, `air-page.js`: vanilla JavaScript behavior.
- `icons/` and `images/`: static assets.
- `roles/`, `services/`, `technologies/`: nested static routes.
- `worker/`: optional Cloudflare Worker for the intake proxy.

For visual design, CSS structure, and component naming, see `DESIGN.md`.
For copy voice and positioning, see `COPY_BRIEF.md` and `COPY_WORKFLOW.md`.

## Local Preview

Start a static server from the repo root:

```bash
npm start
```

Then open:

```text
http://localhost:4323/
```

Nested static routes work directly, for example:

```text
http://localhost:4323/roles/front-end-engineers/
```

## Build

Regenerate the root static pages from fragments and source CSS:

```bash
npm run build
```

Cloudflare subpath build:

```bash
npm run build:cf
```

Cloudflare deploy:

```bash
npm run deploy:cf
```

## Rules

- Keep pages static: HTML, CSS, and vanilla JavaScript only.
- Do not add Astro, React app setup, Vite, TypeScript page builds, or SPA tooling.
- Use root-relative asset paths such as `/icons/...` and `/images/...` so nested routes work.
- Website copy must not use the em dash character.
