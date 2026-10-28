# BetterEngineer Site Migration Plan

Living document. This is the permanent source of truth for the migration program.
Conversation history is not. Update this file as decisions change.

Last updated: 2026-08-07

---

## 1. What this program is

Migrate the remaining BetterEngineer marketing website out of the legacy HubSpot CMS
and into the code based static site in this repository, while:

- preserving approved page copy verbatim,
- localizing content and assets so we stop depending on HubSpot rendering,
- rebuilding every page in the established BetterEngineer design system,
- improving technical SEO without rewriting copy,
- keeping the site a fast static HTML, CSS, and vanilla JavaScript build.

This is one system, not a set of independent landing pages. Every page must be
built from the shared design language documented in `DESIGN.md` and inventoried in
`component-pattern-inventory.md`.

## 2. Sources of truth

| Domain | Source of truth |
| --- | --- |
| Copy, content, information architecture, existing metadata, existing links, images, downloadable assets | The live site at `www.betterengineer.com` (HubSpot) |
| Visual design, navigation, footer, typography, spacing, CSS architecture, JavaScript patterns, cards, buttons, page width, responsive behavior, animations, structured data conventions | This repository |
| Migration state, follow-ups, decisions | This `/docs/site-migration/` directory |

The legacy HubSpot visual design is **not** a source of truth. Take the content,
rebuild the presentation.

## 3. Hard rules

Inherited from `CLAUDE.md`, `AGENTS.md`, and `DESIGN.md`:

1. Static only. HTML, CSS, and vanilla JavaScript. No React, Vue, Next.js, Astro,
   Vite, or TypeScript page builds.
2. Never use the em dash character in website copy. The build fails on it for
   technology pages and the same guard now applies to migrated pages.
3. Shipped root pages are generated. Edit `main-*.html` fragments, `footer-full.html`,
   `data/pages.js`, and `styles/*.css`, then run `npm run build`.
4. Use root relative asset paths (`/icons/...`, `/images/...`) so nested routes work.

Migration specific:

5. Copy content verbatim. Do not rewrite, paraphrase, shorten, expand, modernize,
   or silently fix approved copy. Layout, hierarchy, grouping, and visual treatment
   may change. Wording may not.
6. Anything that looks outdated, wrong, repetitive, contradictory, or weak gets
   preserved and logged in `content-followups.md`.
7. Reuse before you invent. Check `component-pattern-inventory.md` before adding a
   class name, section style, button, card, animation, JavaScript utility, container
   width, spacing rule, CSS variable, or data structure.
8. No page-specific design systems. If a page needs something new, it becomes a
   shared pattern, documented in the inventory.

## 4. Hosting and URL strategy

**Decision (2026-08-07): build for a `www` cutover, work locally first, do not deploy.**

Current reality:

- `www.betterengineer.com` is HubSpot.
- `discover.betterengineer.com` is this repository, published to GitHub Pages from
  the `gh-pages` branch by `.github/workflows/ci.yml`, built by `build-discover-dist.js`.
- `discover.betterengineer.com/` itself redirects to `www.betterengineer.com/`.
- Only `/aimanufacturing/`, `/ai-fluent-engineers/`, `/roles/`, and `/technologies/`
  are live under `discover`.

Consequences for migrated pages:

- Migrated pages are built at their **existing public paths** (`/staff-augmentation/`,
  `/ai-readiness/`, `/hiring-dashboard/`, `/about/`, `/latamengineer/`, `/contact/`,
  `/join/`).
- Canonical URLs point at `https://www.betterengineer.com/<path>`, matching the
  live HubSpot canonical, so nothing competes for the same URL before cutover.
- Migrated pages are **excluded from the discover sitemap and marked `noindex`**
  until cutover, so we never publish a duplicate of a live HubSpot page.
  `build-discover-dist.js` must not add them to `sitemap.xml` or `llms.txt`.
- At cutover, `www` is repointed at this build, `noindex` is removed, and canonicals
  are already correct. No redirects are needed for pages whose slug did not change.
- Any slug that must change is recorded in `redirect-plan.md` before it changes.

Nothing in this program deploys automatically. Work is local. `npm run build` and
`npm start` for preview. Pushing to `main` triggers CI, so migrated pages stay out
of the discover bundle until the cutover decision is made.

## 5. Migration process, per page

```
LIVE HUBSPOT PAGE
  |
  v
EXTRACTION RECORD  (docs/site-migration/pages/<slug>.md)
  |
  v
LOCAL BETTERENGINEER PAGE  (main-<slug>.html + data/pages.js entry)
```

Never go straight from live page to implementation. The extraction record is what
makes the migration auditable, protects against dropped content, and lets us update
pages later without HubSpot.

Per page, in order:

1. **Audit** the live source page.
2. **Extract** into `docs/site-migration/pages/<slug>.md` using the standard record
   format (source metadata, verbatim content, assets, links, forms, logical page
   structure, migration notes).
3. **Download** meaningful assets into `/images/pages/<slug>/`. Skip tracking pixels,
   HubSpot chrome, spacers, and duplicates. Reuse assets that already exist locally.
4. **Map** each source section to an existing BetterEngineer pattern. Record the
   mapping in `component-pattern-inventory.md`. Only propose a new pattern when no
   existing one fits.
5. **Reuse** existing CSS and JavaScript. Extend `styles/brand.css` for site wide
   things and `styles/landing-page.css` for shared page level components.
6. **Build** the `main-<slug>.html` fragment and the `data/pages.js` entry.
7. **Content QA** against the extraction record. Every meaningful piece of source
   content must appear.
8. **Visual QA**. The page must feel native to the new site, not like a one off.
9. **Responsive QA** at mobile, tablet, laptop, desktop, and large desktop.
10. **SEO QA**. Title, description, canonical, heading hierarchy, internal links,
    structured data, robots directive.
11. **Integration QA**. Forms, embeds, downloads, analytics, scripts.
12. **Document**. Update `migration-status.md` and the follow-up files.

## 6. Phases

| Phase | Scope | State |
| --- | --- | --- |
| 1 | Core company and conversion pages: staff-augmentation, ai-readiness, hiring-dashboard, about, latamengineer, contact, join | BUILT locally |
| 2 | Resource and educational pages: FAQs, podcast, ebooks, technical-glossary | BUILT locally |
| 3 | Case studies: livecgi, wasteplace, securelink | BUILT locally |
| 4 | Legal: privacy policy, terms of service. Legal language preserved exactly | BUILT locally |
| 5 | Multi step contact system | BUILT locally |
| 6 | Careers system, landing plus job detail pages, JobPosting schema | BUILT locally |
| 7 | Roles v2 refactor. See `structured-data-inventory.md` | Documented, not started |
| 8 | Industries. `/fintech`, `/martech`, `/healthtech`, `/industries` | BUILT locally |
| 9 | Remaining HubSpot conversion pages: webinar, aiwebinar, roi, youvegotllm, hire-software-engineers-in-72-hours. Competing landings stay as 301s | BUILT locally |

## 7. SEO and SEMrush workflow

For structured page families the preferred order is:

```
SEO / SEMrush research -> content model -> structured data -> template
  -> generated pages -> internal linking -> schema -> QA
```

not:

```
generate page -> try to SEO optimize afterward
```

The technology page family already follows this (see `data-keywords.csv`, the
`keyword` field on every technology record, and `TECH_PAGES_*.md`). Roles do not.
Industries and Careers must.

For Phase 1 migration pages this does not apply directly. These are existing pages
with existing rankings. The job is preservation plus technical improvement, not
keyword driven reinvention. Record SEO opportunities in `seo-followups.md` instead
of acting on them mid migration.

## 8. Definition of done, per page

- Extraction record exists and is marked complete.
- Every meaningful piece of source content appears in the build, verbatim.
- Page assets are local, named sensibly, and have real alt text.
- Page uses only inventoried shared patterns, or new patterns that were added to
  the inventory and to shared CSS.
- Title, description, canonical, OG, Twitter card, and robots directive are set.
- Structured data is emitted and the FAQ JSON-LD matches the visible FAQ exactly.
- No em dash characters anywhere in the page.
- Responsive QA passed at all five widths.
- `migration-status.md` updated.
