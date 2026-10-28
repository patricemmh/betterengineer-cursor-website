# Agent instructions — betterengineer (GitHub Pages)

## CloudFront function (live routing)

`docs/site-migration/cloudfront-www-function.js` is the only copy of the viewer-request function. Distribution `E2014GBUWTTSVJ`, default behavior, function `betterengineer-router`. Edit that JS file, then paste it into CloudFront and Publish. CloudFront does not read git. Details: `docs/site-migration/cloudfront-function.md`.

For **visual design, CSS structure, and component naming**, see [DESIGN.md](DESIGN.md).

This site is **static only**: **HTML, CSS, and vanilla JavaScript** checked into this repo.

- **Do not** add **React**, **Vite**, **TypeScript** for pages, or other SPA frameworks.
- Source CSS: `styles/brand.css`, `styles/landing-page.css`. Run `node build-pages.js` to regenerate `index.html` (styles are embedded).
- Content fragments: `main-home.html`, `footer-full.html`. Scripts: `home.js`, `landing-page.js`.
- Copy rules are strict: never use an em dash character (`—`) in website copy.
- Avoid generic AI-sounding marketing language. Prefer concrete language with clear claims, specific outcomes, and natural sentence rhythm.
- Before writing or revising copy, read `COPY_BRIEF.md` and follow its voice, positioning, and ICP guidance.
- Choose a primary ICP (startup, established company, or agency) before drafting a section and tailor message angle, objections, and proof.

The working copy in **betterengineer-cursor-website** mirrors this setup; keep both in sync when editing.
