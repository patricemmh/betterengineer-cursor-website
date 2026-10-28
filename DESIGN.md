# Design system — BetterEngineer landing pages

This document describes the **visual language, structure, and content workflow** for the static GitHub Pages site in this repository. For build commands and agent constraints, see [README.md](README.md) and [AGENTS.md](AGENTS.md).

## Goals

- **Clarity first**: marketing copy and CTAs should read easily; navigation mirrors the main BetterEngineer site.
- **Fast static delivery**: pages ship as single HTML documents with **inlined CSS** (produced by `build-pages.js`) so first paint does not wait on extra stylesheets.
- **Consistent brand**: shared tokens and components in `styles/brand.css`; the React staffing page adds scoped rules in `styles/landing-page.css`.

## Typography

- **Primary typeface**: [Plus Jakarta Sans](https://fonts.google.com/specimen/Plus+Jakarta+Sans) (loaded in the generated `<head>`).
- **Fallback stack**: `system-ui`, `-apple-system`, sans-serif (see `--font` in `styles/brand.css`).
- **Body**: default line height ~1.6; `-webkit-font-smoothing: antialiased` for crisp text on light backgrounds.

## Color and surfaces

Design tokens live on `:root` in `styles/brand.css`. Highlights:


| Token                                      | Role                                                |
| ------------------------------------------ | --------------------------------------------------- |
| `--color-primary` / `--color-primary-dark` | Links, solid buttons, key emphasis                  |
| `--color-navy`                             | Deep brand contrast (headings / accents where used) |
| `--color-text` / `--color-muted`           | Body and secondary copy                             |
| `--color-surface`, `--color-surface-2`     | Soft backgrounds, hover states                      |
| `--color-border`                           | Dividers, ghost buttons, cards                      |
| `--lavender-*`                             | Gradient / decorative purple family                 |


The React landing uses an **additional purple** for a scoped hero CTA (`.btn.react-hero-card-cta`) so that block can diverge slightly without changing site-wide primary buttons.

## Shape, depth, and motion

- **Radii**: `--radius-sm` (4px), `--radius-md` (12px), `--radius-lg` (16px); pills use `border-radius: 999px` where noted.
- **Shadows**: `--shadow-soft` for cards/dropdowns; `--shadow-hover` for lift on interactive panels.
- **Easing**: `--ease`: `cubic-bezier(0.4, 0, 0.2, 1)` for short transitions.
- **Reduced motion**: scripts respect `prefers-reduced-motion` where animations are used (see `home.js` / `landing-page.js`).

## Layout

- **Header**: Sticky `site-header`; `header-inner` matches the main site chrome at **max-width 1128px** (per live HubSpot header module). Desktop breakpoint for the full nav is **946px**. Primary labels and URLs mirror [betterengineer.com](https://www.betterengineer.com/) (Services, AI Fluency, About, Resources, Join Us, Hire Engineers, Login).
- **Main content**: Section patterns use `.wrap` (and page-specific blocks) with consistent horizontal padding; `#main` uses `overflow-x: clip` on shipped pages to avoid horizontal scroll from full-bleed elements.
- **Footer**: Shared markup in `footer-full.html`, inlined into every generated page.

## Components (naming)

Conventions are intentionally **BEM-like** with utility-style modifiers:

- **Primary actions**: `.btn`, `.btn--primary`, modifiers such as `.btn--lg`
- **Header CTAs**: `.btn-nav`, `.btn-nav--ghost`, `.btn-nav--solid`
- **Navigation**: `.site-nav`, `.nav-desktop`, `.nav-mobile`, `.dropdown`
- **React page**: `.react-hero-badge`, `.hubspot-form-card`, `.react-intake-form`, etc. in `styles/landing-page.css`

Prefer **reusing** these classes before inventing new ones; extend in the appropriate stylesheet (`brand.css` vs `landing-page.css`).

### Canonical components

Some components have exactly one approved implementation and must not be re-derived
per page. These are documented in full, with their markup contract, in
[docs/site-migration/component-pattern-inventory.md](docs/site-migration/component-pattern-inventory.md).

- **FAQ accordion.** Styles live in `styles/brand.css` under the block marked
  `FAQ accordion: CANONICAL COMPONENT`. The visual treatment is the technology-page
  one: a full-width hairline list, no card boxes, large question type, CSS-drawn
  chevron. The markup contract (section wrapper, `.air-section-head` with an
  `.eyebrow` plus `h2#faq-heading`, `.faq-list#faq-list`, one `is-open` item,
  `hidden` on every closed panel) is enforced by
  `node tools/verify-migrated-pages.js`. Pages with an FAQ set `faqSchema: true` in
  `data/pages.js`; the build derives `FAQPage` JSON-LD from the rendered markup, so
  the schema cannot drift from the visible text.
  `styles/role-detail.css` still carries a duplicate of these rules for role and
  technology pages. Mirror any change there until TD-15 is resolved.

For the full pattern catalogue, and before adding any new class name, section style,
button, card, animation, container width, spacing rule, or CSS variable, read
[docs/site-migration/component-pattern-inventory.md](docs/site-migration/component-pattern-inventory.md).

## Pages


| Shipped URL (GitHub Pages) | Source body fragment | CSS bundle                                    | Script          |
| -------------------------- | -------------------- | --------------------------------------------- | --------------- |
| `/` (`index.html`)         | `main-home.html`     | `brand.css` + small `#main` safe-area snippet | `home.js`       |
| `/services/hire-ai-ready-engineers/` | `main-hire-ai-ready-engineers.html` | `brand.css` + `landing-page.css` | `landing-page.js` |
| `/services/ai-systems-readiness-for-manufacturing/` | `main-ai-systems-manufacturing.html` | `brand.css` + `landing-page.css` | `landing-page.js` |
| `/staff-augmentation/` | `main-staff-augmentation.html` | `brand.css` + `landing-page.css` | `page.js` |
| `/ai-readiness/` | `main-ai-readiness.html` | `brand.css` + `landing-page.css` | `page.js` |
| `/hiring-dashboard/` | `main-hiring-dashboard.html` | `brand.css` + `landing-page.css` | `page.js` |
| `/about/` | `main-about.html` | `brand.css` + `landing-page.css` | `page.js` |
| `/latamengineer/` | `main-latamengineer.html` | `brand.css` + `landing-page.css` | `page.js` |
| `/contact/` | `main-contact.html` | `brand.css` + `landing-page.css` | `page.js` |
| `/join/` | `main-join.html` | `brand.css` + `landing-page.css` | `page.js` |

Every page in this table is described by a record in `data/pages.js`. `build-pages.js`
iterates that manifest; it does not hardcode pages. To add a page, add a record and a
`main-<slug>.html` fragment.


Headers are **assembled in `build-pages.js`** (not separate files) so each page can mark the active nav item and `aria-current="page"` correctly.

## Copy conventions: capitalization and naming

These were never written down. They are derived from what the technology and role
pages actually ship, which is the reference architecture, so treat them as the rule
from here on.

### Capitalization

| Where | Case | Example |
| --- | --- | --- |
| `<title>` tag | **Title Case** | `Hire OpenAI API Developers \| BetterEngineer` |
| `<h1>` | **Sentence case** | `Hire senior OpenAI API engineers in your time zone.` |
| `<h2>`, `<h3>` | **Sentence case** | `What does a senior OpenAI API developer do?`, `Our simple hiring path` |
| `.eyebrow` | **ALL CAPS** | `OPENAI API DEVELOPER FAQ` |
| Buttons and CTAs | **Title Case** | `Book Your 20-Minute Intro` |
| Meta description | Sentence case | |

The short version: **the title tag is Title Case, everything a visitor reads on the
page is sentence case, eyebrows are caps.**

Proper nouns keep their own casing regardless: `OpenAI`, `TypeScript`, `Node.js`,
`BetterEngineer`, `LATAM`.

### Noun rule (from TECH_PAGES_PLAN.md section 2, settled by keyword data)

Hire-intent searches with a technology are dominated by "developer" (48 keywords,
~5,030 volume) over "engineer" (1 keyword, 50 volume). Generic searches tie. So:

- **Slug:** `{tech}-developers`
- **`<title>`, meta, OG:** "Hire {Tech} Developers | BetterEngineer"
- **H1, hero, CTAs, brand voice:** "{Tech} Engineers"
- **Body:** both terms appear naturally, capturing both query sets

`tools/verify-tech-data.js` enforces the slug and title halves of this.

### Open conflict on the migrated pages

The seven Phase 1 pages migrated from HubSpot use **Title Case headings** throughout,
because that is the approved source copy and the migration rule is to reproduce copy
verbatim, capitalization included. That conflicts with the sentence-case convention
above.

This is tracked as **CF-59** in `docs/site-migration/content-followups.md` and is a
decision, not a bug. Converting them means editing indexed H1 and H2 text on seven
pages. Do not change them without sign-off.

## Assets and paths

- Use **root-relative** paths in fragments and CSS: `/icons/...`, `/images/...`.
- The build step rewrites relative `./images/` and `./icons/` in fragments to root-relative for production.
- Favicon: `/icons/favicon.png`.

## Third-party touches

- **HubSpot**: `_hsq` queue and script loader in the generated `<head>`; forms and tracking on CTAs are coordinated in the page scripts (virtual page views on primary clicks).

## How to change the design safely

1. Edit `**styles/brand.css`** for site-wide tokens and shared components.
2. Edit `**styles/landing-page.css**` only for landing-page-specific layout or overrides.
3. Edit `**main-*.html**` and `**footer-full.html**` for structure and copy.
4. If navigation or global chrome changes, update the header strings in `**build-pages.js**`, then run `**node build-pages.js**` (or `npm run build`).
5. Run `**npm run verify**` before shipping. It includes `tools/verify-migrated-pages.js`,
   which rejects any migrated page that uses a class outside the approved inventory.

Generated files `**index.html**` and the `**technologies/*/index.html**` pages are build outputs; treat the sources above as the source of truth.