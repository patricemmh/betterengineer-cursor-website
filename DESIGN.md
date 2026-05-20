# Design system — BetterEngineer landing pages

This document describes the **visual language, structure, and content workflow** for the static GitHub Pages site in this repository. For build commands and agent constraints, see [README.md](README.md) and [AGENTS.md](AGENTS.md).

## Goals

- **Clarity first**: marketing copy and CTAs should read easily; navigation mirrors the main BetterEngineer site.
- **Fast static delivery**: pages ship as single HTML documents with **inlined CSS** (produced by `build-pages.js`) so first paint does not wait on extra stylesheets.
- **Consistent brand**: shared tokens and components in `styles/brand.css`; the React staffing page adds scoped rules in `styles/react-landing.css`.

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
- **Reduced motion**: scripts respect `prefers-reduced-motion` where animations are used (see `home.js` / `react-page.js`).

## Layout

- **Header**: Sticky `site-header`; `header-inner` matches the main site chrome at **max-width 1128px** (per live HubSpot header module). Desktop breakpoint for the full nav is **946px**. Primary labels and URLs mirror [betterengineer.com](https://www.betterengineer.com/) (Services, AI Fluency, About, Resources, Join Us, Hire Engineers, Login).
- **Main content**: Section patterns use `.wrap` (and page-specific blocks) with consistent horizontal padding; `#main` uses `overflow-x: clip` on shipped pages to avoid horizontal scroll from full-bleed elements.
- **Footer**: Shared markup in `footer-full.html`, inlined into every generated page.

## Components (naming)

Conventions are intentionally **BEM-like** with utility-style modifiers:

- **Primary actions**: `.btn`, `.btn--primary`, modifiers such as `.btn--lg`
- **Header CTAs**: `.btn-nav`, `.btn-nav--ghost`, `.btn-nav--solid`
- **Navigation**: `.site-nav`, `.nav-desktop`, `.nav-mobile`, `.dropdown`
- **React page**: `.react-hero-badge`, `.hubspot-form-card`, `.react-intake-form`, etc. in `styles/react-landing.css`

Prefer **reusing** these classes before inventing new ones; extend in the appropriate stylesheet (`brand.css` vs `react-landing.css`).

## Pages


| Shipped URL (GitHub Pages) | Source body fragment | CSS bundle                                    | Script          |
| -------------------------- | -------------------- | --------------------------------------------- | --------------- |
| `/` (`index.html`)         | `main-home.html`     | `brand.css` + small `#main` safe-area snippet | `home.js`       |
| `/technologies/react/`     | `main-react.html`    | `brand.css` + `react-landing.css`             | `react-page.js` |


Headers are **assembled in `build-pages.js`** (not separate files) so home vs React can mark the active nav item and `aria-current="page"` correctly.

## Assets and paths

- Use **root-relative** paths in fragments and CSS: `/icons/...`, `/images/...`.
- The build step rewrites relative `./images/` and `./icons/` in fragments to root-relative for production.
- Favicon: `/icons/favicon.png`.

## Third-party touches

- **HubSpot**: `_hsq` queue and script loader in the generated `<head>`; forms and tracking on CTAs are coordinated in the page scripts (virtual page views on primary clicks).

## How to change the design safely

1. Edit `**styles/brand.css`** for site-wide tokens and shared components.
2. Edit `**styles/react-landing.css**` only for React-page-specific layout or overrides.
3. Edit `**main-*.html**` and `**footer-full.html**` for structure and copy.
4. If navigation or global chrome changes, update the header strings in `**build-pages.js**`, then run `**node build-pages.js**` (or `npm run build`).

Generated files `**index.html**`, `**react.html**`, and `**technologies/react/index.html**` are build outputs; treat the sources above as the source of truth.