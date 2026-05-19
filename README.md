# BetterEngineer — static site

**Design tokens, layout patterns, and UI conventions** are documented in [DESIGN.md](DESIGN.md).

This repository is **plain static assets**: HTML with **embedded CSS**, **vanilla JavaScript** (`home.js`, `react-page.js`), and local `icons/` / `images/`. There is **no** React app, Vite, TypeScript, or SPA bundler for these pages.

The **React staffing** URL is a marketing page (`react.html`); it is still static HTML/JS. It loads **HubSpot’s** embed script only for the intake form.

## Copy system

- Copy guardrails: `.cursor/rules/copy-voice-guardrails.mdc`
- Source-of-truth brief: `COPY_BRIEF.md`
- Repeatable copy process: `COPY_WORKFLOW.md`

## Analytics (GTM / GA4)

**Google Tag Manager** container **`GTM-WT77L8JF`** is installed globally in **`build-pages.js`** (`shell()`): head script + noscript after `<body>`. **GA4 is not inlined**; Measurement goes through whatever Ryan publishes in that container (**GA4**, cross-domain **`discover.betterengineer.com`** on the stream, etc.). Reference: **[ANALYTICS_GTM_NEXT_STEPS.md](ANALYTICS_GTM_NEXT_STEPS.md)**.

- **Source CSS**: `styles/brand.css`, `styles/react-landing.css`
- **Page fragments**: `main-home.html`, `main-react.html`, `footer-full.html`
- Regenerate root HTML with embedded styles:

  ```bash
  npm run build
  ```

  or `node build-pages.js`

## GitHub Pages

Deploy from the **`main` branch root**. This repo writes:

- `index.html` -> `/`
- `technologies/react/index.html` -> `/technologies/react`

It also writes:

- `CNAME` with `discover.betterengineer.com` (written by CI to `gh-pages`; see `GITHUB_PAGES_DISCOVER_HOSTING.md`)
- `.nojekyll`

Use root-relative assets (`/icons/...`, `/images/...`) so nested routes work on GitHub Pages.

## Cloudflare Pages (subpath `/betterengineer/`)

When this site should live at **`https://<your-domain>/betterengineer/`** (alongside other routes), build a self-contained output folder and deploy that folder however you attach it to Cloudflare (direct upload, CI, or Wrangler).

1. **Build** (sets `SITE_BASE=/betterengineer`, writes `./betterengineer/` with HTML + copied `icons/`, `images/`, `home.js`, `react-page.js`):

   ```bash
   npm run build:cf
   ```

2. **Deploy** (Wrangler CLI; prompts login if needed):

   ```bash
   npm run deploy:cf
   ```

   Or in **Cloudflare Dashboard**: create or open your Pages project, set **Build command** to `npm run build:cf` and **Build output directory** to `betterengineer`, connect the repo, and deploy.

**If your Pages project serves the contents of `betterengineer/` at the site root** (for example `https://project.pages.dev/` with no `/betterengineer` prefix), build with root assets instead:

```bash
# PowerShell
$env:SITE_BASE="/"; $env:OUTPUT_ROOT="betterengineer"; node build-pages.js
```

Then upload or point the project at `betterengineer/` the same way as above.

## Local preview

Any static file server from this folder works, for example:

```bash
npm start
```

Then open [http://localhost:5173/](http://localhost:5173/) (or use `npx serve .` and the port it prints).
