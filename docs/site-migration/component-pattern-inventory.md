# Component and Pattern Inventory

This is a vanilla HTML, CSS, and JavaScript site. "Component" here means a reusable
markup pattern plus its shared CSS, plus any shared JavaScript it depends on. There
are no framework components.

**Check this file before inventing anything.** If a pattern here fits, use it. If it
almost fits, extend it. Only add a new pattern when nothing existing works, and then
add it to this file and to shared CSS, never to a page specific stylesheet.

Last updated: 2026-08-07 (Phase 1 patterns added)

---

## 1. Where implementations live

| File | Role |
| --- | --- |
| `styles/brand.css` | Design tokens, base elements, header, footer, and the site wide component set. Inlined into every generated page. |
| `styles/landing-page.css` | Shared landing page and service page components. Inlined on landing and migrated marketing pages. |
| `styles/roles.css` | Role index and simple role detail styles. Linked, not inlined. |
| `styles/role-detail.css` | Role and technology detail page components (`.air-*`). Linked, not inlined. |
| `build-tech-pages.js` lines 145-255 | Generator owned inline `<style>` for technology pages. Single source, propagates on rebuild. |
| `footer-full.html` | The one and only footer markup. |
| `build-pages.js` | Header markup, assembled per page so the active nav item can be marked. |
| `home.js`, `landing-page.js`, `air-page.js` | Three separate vanilla JS bundles. See section 5. |
| `intake-form-shared.js` | Shared HubSpot intake form behavior. Used by all form bearing pages. |

## 2. Design tokens (`styles/brand.css` `:root`)

Never hard code a brand color, radius, shadow, font, or easing. Use these.

| Token | Value | Use |
| --- | --- | --- |
| `--color-primary` | `#545bb3` | Links, solid buttons, key emphasis |
| `--color-primary-dark` | `#3d4293` | Hover on solid buttons |
| `--color-primary-alt` | `#4c60b2` | Header hire pill |
| `--color-navy` | `#001062` | Deep brand contrast |
| `--color-text` | `#1c1c1c` | Body copy |
| `--color-muted` | `#5c5c66` | Secondary copy |
| `--color-surface` | `#fafafe` | Soft background |
| `--color-surface-2` | `#f0f1fb` | Tinted section background, hover states |
| `--color-border` | `#e2e4f0` | Dividers, ghost buttons, card borders |
| `--lavender-1/2/3` | `#c9c4ec` / `#a89fd8` / `#8b8dd4` | Decorative purple family |
| `--radius-sm/md/lg` | 4px / 12px / 16px | Pills use `border-radius: 999px` |
| `--shadow-soft` | `0 10px 40px rgba(28,28,28,.07)` | Cards, dropdowns |
| `--shadow-hover` | `0 16px 48px rgba(84,91,179,.18)` | Lift on interactive panels |
| `--font` | Plus Jakarta Sans, system-ui, -apple-system, sans-serif | Everything |
| `--ease` | `cubic-bezier(.4,0,.2,1)` | Short transitions |
| `--header-h` | `84px` | Sticky chrome offset |

Layout constants: header inner max width **1128px**, desktop nav breakpoint **946px**,
`.wrap` is the standard content container, `#main` uses `overflow-x: clip`.

## 3. Global chrome

| Pattern | Classes | Lives in | Notes |
| --- | --- | --- | --- |
| Sticky header | `.site-header`, `.header-inner`, `.logo-link`, `.site-nav`, `.nav-desktop`, `.has-children`, `.dropdown`, `.nav-chevron`, `.nav-pill-hire`, `.is-scrolled` | `brand.css` + `build-pages.js` | Assembled in the build so `aria-current="page"` can be set. Do not fork. |
| Mobile nav | `.nav-toggle`, `.nav-mobile`, `.mobile-submenu`, `.nav-mobile-hire`, `.is-open` | `brand.css` | Toggled by every page script. |
| Skip link | `.skip-link` | `brand.css` | Required on every page. |
| Footer | `.site-footer`, `.footer-main`, `.footer-brand`, `.footer-nav-col`, `.footer-nav-group`, `.footer-col__title`, `.footer-social__*`, `.footer-btn`, `.footer-bottom` | `footer-full.html` + `brand.css` | Single source. Never copy footer markup into a page. |

## 4. Content patterns

### 4.1 Hero

| Variant | Classes | Source | Fits |
| --- | --- | --- | --- |
| Split hero with image | `.hero.section` > `.wrap.hero-grid` > text col + `.hero-visual.hero-visual--image` > `.hero-visual__img` | `brand.css`, used on home | Staff Augmentation, AI Readiness, Hiring Dashboard, LATAM, Join |
| Hero with intake form card | `.hero` + `.hero-form__card`, `.hero-form__title`, `.hero-form__subtitle`, `.react-intake-card` | `brand.css` + `landing-page.css` | Contact |
| Simple hero | `.hero--simple` | `roles.css` | Index style pages |
| Role/tech hero card | `.air-role-hero-card`, `.air-role-hero-visual`, `.air-hero-tools__*` | `role-detail.css` | Role and technology pages only |

Supporting: `.eyebrow` (kicker), `.h1`, `.h2`, `.lead`, `.accent` (colored span inside
a heading), `.light` (lighter weight span), `.btn-row`.

### 4.2 Buttons

`.btn` plus one of `.btn--primary`, `.btn--outline`, `.btn--ghost`, `.btn--outline-light`.
Header CTAs use `.btn-nav`, `.btn-nav--ghost`, `.btn-nav--solid`. Footer uses
`.footer-btn`, `.footer-btn--outline`, `.footer-btn--solid`. Group buttons with
`.btn-row`. Do not add a new button style.

### 4.3 Cards and grids

| Pattern | Classes | Source | Use for |
| --- | --- | --- | --- |
| Role / link card grid | `.card-grid` > `.role-card`, `.role-card--featured`, `.role-card__badge` | `brand.css`, `roles.css` | Any grid of linked cards with heading plus blurb |
| Icon feature card grid | `.air-serve-grid` > `.air-serve-card` > `.air-serve-card__icon` | `landing-page.css` | Icon plus heading plus paragraph grids (3-up, 4-up, 6-up) |
| Feature stack | `.air-feature-stack` > `.air-feature` > `.air-feature__icon` | `landing-page.css` | Vertical icon plus text list |
| Use case card grid | `.usecase-grid` > `.usecase-card`, `.air-use-grid` | `landing-page.css`, `role-detail.css` | Titled body cards |
| Skill card | `.skill-card`, `.skills-head` | `brand.css` | Skill or capability groups |
| Prose card | `.air-prose-card`, `.air-prose-card__kicker` | `landing-page.css` | Boxed narrative block |
| Number card | `.air-number-card`, `.air-number-card__num`, `.air-numbers-grid` | `landing-page.css` | Big number plus label |
| Candidate card | `.air-candidate-card*`, `.air-candidates-grid` | `role-detail.css` | Engineer profile cards, role and tech pages |
| Video watchlist | `.playlist-feature*`, `.video-grid`, `.video-card*`, `.playlist-filter*` | `landing-page.css` | Curated linked videos with optional topic filters |
| Local product video | `.platform-video` > `.platform-video__player` | `landing-page.css` | Native `<video>` for a locally hosted walkthrough (hiring dashboard) |

### 4.4 Sections and layout

`.section` (standard vertical rhythm), `.section-tint` (surface-2 background),
`.section-rule` (hairline divider), `.wrap` (container), `.split` + `.split__img`
(two column image and text band), `.ai-split` + `.ai-split__right`,
`.air-tech-split`, `.air-latam-split`, `.mfg-benefits-split`, `.air-section-head`,
`.air-section-head--light`, `.mfg-section-head`.

Split media and text bands are the single most reused layout on the site. Use
`.split` for the standard case.

### 4.5 Lists, checklists, tags

| Pattern | Classes | Source |
| --- | --- | --- |
| Check list | `.fluency-checks` | `brand.css` |
| Audit checklist with modifiers | `.audit-checklist`, `--compact`, `--benefits`, `--deliverables` | `landing-page.css` |
| Problem list | `.problem-list` | `landing-page.css` |
| Tag / chip cluster | `.air-tag`, `.air-tag-cluster`, `.air-skill-tags`, `.air-skills-cluster` | `landing-page.css`, `role-detail.css` |
| Trust pills | `.trust-pill`, `.trust-pills` | `landing-page.css`, `role-detail.css` |
| Bulleted air list | `.air-list`, `.air-bullets` | tech generator, `landing-page.css` |

### 4.6 Process and steps

`.process-grid` with `.process-grid--three` or `.process-grid--five`, containing
`.process-step` > `.process-step__num` (or `.process-step__icon`). Covers every
numbered process on the site. Do not build a new step component.

### 4.7 Stats and proof

| Pattern | Classes | Source |
| --- | --- | --- |
| Bento stat block | `.stats-section`, `.stats-title`, `.stats-bento`, `.stats-bento__cell`, `.stats-bento__stat`, `.stat-num`, `.stat-label` | `brand.css` |
| Stat strip | `.air-stats-strip`, `.air-stat-row`, `.air-stat`, `.air-stat__num`, `.air-stat__label` | `landing-page.css`, `role-detail.css` |
| Cited stat | `.air-stat` with source link | tech generator |
| At a glance table | `.air-glance`, `.air-glance-heading` | tech generator |
| Client logo marquee | `.partners`, `.partners-label`, `.logo-marquee`, `.logo-track`, `.client-block`, `.client-sub` | `brand.css` |
| Tech logo grid | `.air-tech-icons`, `.air-eco-icon`, `.air-eco-group__icons`, `.air-tech-icon--link` | `build-tech-grids.js`, `role-detail.css` |

### 4.8 Testimonials

`.carousel-wrap`, `.carousel-intro`, `.carousel-shell`, `.carousel-slides`,
`.carousel-btn`, `.carousel-dots`, `.slide`, `.slide-grid`, `.slide-photo`,
`.slide-copy`, `.quote`, `.slide-footer`, `.slide-name`, `.slide-role`, `.slide-logo`.

Full ARIA carousel with tablist dots. Behavior in `home.js`. Content also works
statically if the carousel script is absent.

### 4.9 FAQ accordion (CANONICAL COMPONENT)

**There is one FAQ on this site.** The approved treatment is the one established on
the technology pages: a full width hairline list, no card boxes, large question type,
and a CSS drawn chevron. Do not build a second FAQ style, and do not restyle it per
page.

**Styles:** `styles/brand.css`, in the block marked `FAQ accordion: CANONICAL COMPONENT`.
That is the single source. `styles/landing-page.css` no longer defines any `.faq-*`
rules.

**Behavior:** `page.js` for migrated marketing pages, `air-page.js` for role and
technology pages. Both implement the same open and close logic. `landing-page.js` also
carries an older, simpler version, but no landing page currently has an FAQ, so it is
dead code (see `technical-debt.md`).

**Markup contract.** Copy this exactly. `tools/verify-migrated-pages.js` fails the build
if any of it is wrong.

```html
    <section class="section section-tint" id="faq" aria-labelledby="faq-heading">
      <div class="wrap">
        <div class="reveal air-section-head" style="max-width:44rem">
          <p class="eyebrow">SECTION LABEL FAQ</p>
          <h2 class="h2" id="faq-heading">Frequently Asked Questions</h2>
        </div>
        <div class="faq-list reveal" id="faq-list">
          <div class="faq-item is-open">
            <button type="button" aria-expanded="true"><span class="faq-question">Question</span><span class="chevron" aria-hidden="true"></span></button>
            <div class="faq-panel">
              <p>Answer</p>
            </div>
          </div>
          <div class="faq-item">
            <button type="button" aria-expanded="false"><span class="faq-question">Question</span><span class="chevron" aria-hidden="true"></span></button>
            <div class="faq-panel" hidden>
              <p>Answer</p>
              <ul><li>Supporting point</li></ul>
            </div>
          </div>
        </div>
      </div>
    </section>
```

Rules, all machine checked:

1. Section wrapper is exactly `class="section section-tint" id="faq" aria-labelledby="faq-heading"`.
2. An `.air-section-head` containing an `.eyebrow` label **and** an `h2#faq-heading`.
   The eyebrow is what makes it read as a technology page FAQ rather than a generic one.
3. The list is `<div class="faq-list reveal" id="faq-list">`.
4. **Exactly one** `.faq-item` carries `is-open`, and it is the first one.
5. Every button is `<button type="button" aria-expanded="...">` with `aria-expanded`
   matching the `is-open` state.
6. The question sits in `<span class="faq-question">`, followed by
   `<span class="chevron" aria-hidden="true"></span>`. The chevron is drawn in CSS;
   never put an SVG or a character in it.
7. Every **closed** panel carries `hidden`. The open one does not.
8. Answers may contain `<p>`, `<ul>`, `<ol>`, `<li>`, `<strong>`, and `<a>`. The
   component styles all of them. Technology pages only ever emit one `<p>`, which is why
   the richer cases were added when the marketing pages were migrated.

**Schema.** Any page with an FAQ must set `faqSchema: true` in its `data/pages.js`
record. `build-pages.js` then derives `FAQPage` JSON-LD by parsing the rendered markup,
so the schema physically cannot disagree with what a visitor reads. The verifier
re-checks that parity question by question.

**Why collapse uses `hidden` rather than height alone.** The `hidden` attribute is what
actually hides a closed panel, so a script that only toggles `hidden` and `is-open`
still renders correctly. The height and opacity transition is layered on top: a script
that also sets an inline height gets the animation, because an inline value beats the
`height: auto` rule. That keeps the component robust across all three page scripts.

### 4.10 Comparison table

`.air-compare-wrap`, `.air-compare-table`, `.air-compare-table__us`, `.air-compare-head`,
`.air-mark`, `.air-mark--yes`, `.air-mark--no`, `.air-mark--maybe`. In `landing-page.css`.

### 4.11 CTA bands

| Pattern | Classes | Source | Use for |
| --- | --- | --- | --- |
| Split CTA with photo | `.cta-band`, `.cta-split`, `.cta-split__text`, `.cta-split__text-inner`, `.cta-split__photo` | `brand.css` | Closing CTA with art directed image |
| Final CTA band | `.air-final-cta`, `.air-final-cta__inner`, `.air-final-cta__note` | `landing-page.css` | Full width closing CTA |
| Mid page CTA | `.air-mid-cta`, `.air-mid-cta__card`, `.air-mid-cta__title`, `.air-mid-cta__button`, `.air-mid-cta__image` | `role-detail.css` | Interrupt style mid scroll CTA |
| LATAM CTA band | `.latam`, `.latam-title`, `.latam-lead`, `.latam-locations`, `.latam-cta`, `.latam-map` | `brand.css` | Region messaging with map |

### 4.12 Forms

The established pattern is **custom BetterEngineer frontend, HubSpot backend**.

Markup: `.react-intake-card` (or `.hubspot-form-card`) wrapping
`form#react-intake-form.react-intake-form` containing `.form-grid` > `.form-field`
(and `.form-field--full`), labels, inputs, an off screen `company_website` honeypot,
four hidden UTM inputs, `.form-privacy-note`, a `.btn.btn--primary.react-intake-submit`
submit button, and `p#react-intake-status.form-status` with `role="status"`.

Behavior: `intake-form-shared.js` exposes `window.BEIntakeForm.wireForm(form, statusEl)`.
Page scripts call it. It handles validation, the honeypot, disposable domain blocking,
minimum message length, URL blocking, Cloudflare Turnstile, submission through the
Cloudflare Worker proxy at `intake-proxy.patricemmh.workers.dev`, and a direct
HubSpot Forms API fallback to portal `8679235`, form `4431ddc0-7bea-46ba-939c-98c422756479`.
It captures the `hubspotutk` cookie, `pageUri`, and `pageName` for CRM attribution.

Supporting classes: `.form-field__error`, `.form-status`, `.is-submitting`,
`.is-success`, `.is-error`, `.intake-form--success`, `.turnstile-widget-wrap`,
`.form-privacy-note`, `.form-submit-error`, `.hero-form__*`.

**Do not** embed an unstyled native HubSpot form. **Do not** build a separate backend.
**Do not** invent field names without checking HubSpot's field definitions first.

### 4.13 Motion

`.reveal` plus `.is-visible`, driven by an IntersectionObserver in every page script,
gated on `prefers-reduced-motion`. `.fairy-dust-wrap` and `.fairy-dust-particle` are
decorative, landing page only.

## 5. JavaScript inventory

| File | Provides | Used by |
| --- | --- | --- |
| `intake-form-shared.js` | `window.BEIntakeForm`: form wiring, validation, Turnstile, HubSpot submission, success message | Every form bearing page |
| `home.js` | Header scroll state, mobile nav, reveal observer, testimonial carousel | Home |
| `landing-page.js` | Header scroll state, mobile nav, reveal observer, FAQ accordion, form wiring, landing page specific behavior | Landing and service pages |
| `air-page.js` | Header scroll state, mobile nav, reveal observer, FAQ accordion, sticky TOC with scroll spy, mobile guide accordion, guide tabs, form wiring | Role and technology pages |

Header scroll state, mobile nav, and the reveal observer are implemented **three
times**. The FAQ accordion is implemented **twice**. This is the largest piece of
JavaScript technical debt in the repo. See `technical-debt.md`.

`page.js` also progressively enhances curated watchlists marked with
`data-playlist-filter` and `data-playlist-topic`. All cards remain visible when
JavaScript is unavailable.

**Rule for migrated pages:** do not add a fourth copy. Migrated marketing pages use
a shared core script, and the duplicated implementations get consolidated as a
separate, scheduled cleanup rather than mid migration.

## 6. Phase 1 section to pattern mapping

Legend: **REUSE** existing pattern as is. **EXTEND** existing pattern with a modifier.
**NEW** genuinely new shared pattern, must be added to shared CSS and to this file.

### Staff Augmentation

| Source section | Pattern | Action |
| --- | --- | --- |
| Hero: eyebrow, H1, lede, CTA, image | `.hero` + `.hero-grid` + `.hero-visual--image` | REUSE |
| Differentiators: 4 icon cards | `.air-serve-grid` + `.air-serve-card` | REUSE |
| Skills: ~25 logo plus label pairs | `.air-tech-icons` grid, or `.logo-marquee` | REUSE |
| Service scope: 6 labels plus image | `.split` + `.audit-checklist--compact` or `.air-tag-cluster` | REUSE |
| Mid page CTA band | `.air-mid-cta` | REUSE |
| Process: 4 numbered steps plus CTA plus image | `.process-grid` + `.process-step` | REUSE |
| Platform promo: eyebrow, H2, 2 CTAs, screenshot | `.section-tint` + `.split` | REUSE |
| Testimonials: 3 quotes with portrait, name, title, logo | `.carousel-*` + `.slide-*` | REUSE |
| FAQ: 14 Q&A with nested lists and inline links | `.faq-list` + `.faq-item` | REUSE |
| Closing CTA with art directed image | `.cta-band` + `.cta-split` | REUSE |

### AI Readiness

| Source section | Pattern | Action |
| --- | --- | --- |
| Hero | `.hero` + `.hero-grid` | REUSE |
| Positioning block plus CTA | `.section` + `.wrap` narrow prose | REUSE |
| Benefits: 4 icon cards | `.air-serve-grid` | REUSE |
| Offer breakdown: 3 items plus image plus CTA | `.split` + `.air-feature-stack` | REUSE |
| Process: 3 steps with two level headings | `.process-grid--three` + `.process-step` | EXTEND: step needs an optional subtitle line |
| Expert team prose | `.air-prose-card` | REUSE |
| Whitepaper lead magnet | `.split` + download card | **NEW**: `.resource-download-card`. Also blocked, see notes |
| FAQ: 6 items | `.faq-list` | REUSE |
| Blog feed: 3 posts | `.card-grid` + `.role-card` | EXTEND: needs a meta line for tag, author, date |
| Closing CTA over background image | `.air-final-cta` | REUSE |

### Hiring Dashboard

| Source section | Pattern | Action |
| --- | --- | --- |
| Hero: eyebrow, H1, sub, 2 CTAs, trust line | `.hero` + `.btn-row` + `.trust-pills` | REUSE |
| Section header | `.air-section-head` | REUSE |
| 4 alternating feature blocks with screenshots | `.split` alternating, with `.air-feature-stack` inside | REUSE |
| Mid CTA band | `.air-mid-cta` | REUSE |
| How it works: 4 numbered steps | `.process-grid` | REUSE |
| Why LATAM: 2 alternating media blocks | `.split` | REUSE |
| What to expect: 3 icon cards | `.air-serve-grid` | REUSE |
| FAQ: 12 items | `.faq-list` | REUSE |
| Closing CTA band | `.cta-band` + `.cta-split` | REUSE |

### About

| Source section | Pattern | Action |
| --- | --- | --- |
| Hero: H1, paragraph, CTA | `.hero` | REUSE |
| Positioning banner: H2 plus photo | `.split` | REUSE |
| Mission prose | `.section` + narrow `.wrap` | REUSE |
| Leadership roster: 7 headshot cards with LinkedIn | `.card-grid` | **NEW**: `.person-card` (photo, name, role, social link) |
| Team group photo, mobile and desktop variants | `<picture>` inside `.cta-split__photo` style full bleed | REUSE |
| FAQ: 8 items | `.faq-list` | REUSE |
| Closing CTA: H2, paragraph, 2 CTAs | `.cta-band` | REUSE |

### LATAM Engineer

| Source section | Pattern | Action |
| --- | --- | --- |
| Hero | `.hero` | REUSE |
| Market context with 2 inline stats | `.split` + `.air-stat-row` | REUSE |
| Time zone advantage plus CTA | `.split` | REUSE |
| Time zone advantage duplicate | none | Preserve pending sign off, see `content-followups.md` |
| Talent quality: 5 icon cards, 2 with citations | `.air-serve-grid` | EXTEND: card needs an optional cited source line |
| Cost narrative prose | `.section` + `.wrap` | REUSE |
| Savings claim band plus CTA | `.air-final-cta` | REUSE |
| FAQ: 13 items | `.faq-list` | REUSE |
| Latest articles: 3 cards | `.card-grid` + `.role-card` | EXTEND, same as AI Readiness blog feed |
| Closing CTA | `.cta-band` | REUSE |

### Contact

| Source section | Pattern | Action |
| --- | --- | --- |
| Hero plus form, form above the fold | `.hero` + `.react-intake-card` + `.react-intake-form` | REUSE, blocked on field confirmation |
| Social proof: 5 client logos | `.partners` + `.logo-marquee` | REUSE |
| FAQ: 8 items | `.faq-list` | REUSE |
| Pre-footer CTA band | `.cta-band` | REUSE |

### Join Us

| Source section | Pattern | Action |
| --- | --- | --- |
| Hero: eyebrow, H1, paragraph, CTA, map | `.hero` + `.latam-map` style image | REUSE |
| Benefits: 6 icon cards | `.air-serve-grid` | REUSE |
| Process: 3 numbered steps plus CTA | `.process-grid--three` | REUSE |
| Community statement plus photo | `.split` | REUSE |
| Traits: 6 heading plus paragraph items, no icons | `.air-feature-stack` without icon | REUSE |
| Technology logo wall: 21 logos with labels | `.air-tech-icons` | REUSE |
| Testimonials: 4 quote cards | `.carousel-*` | REUSE |
| FAQ: 6 items | `.faq-list` | REUSE |
| Blog feed: 3 cards plus tag list | `.card-grid` + `.role-card` | EXTEND, same as above |
| Closing CTA with full bleed team photo | `.cta-band` + `.cta-split` | REUSE |

### New shared patterns added (2026-08-07, now live in `styles/landing-page.css`)

All five were added to the shared stylesheet under a clearly marked block, not to any
page specific file. `tools/verify-migrated-pages.js` enforces that migrated pages use
only classes from this inventory.

| Class | What it is | Used by |
| --- | --- | --- |
| `.person-grid`, `.person-card`, `.person-card__photo`, `.person-card__name`, `.person-card__role`, `.person-card__social` | Headshot, name, role, and a social icon link. Name and role are `<p>` elements, not headings, because they are not section headings. | About leadership roster |
| `.post-grid`, `.post-grid--blog`, `.post-card`, `.post-card__cover`, `.post-card__tags`, `.post-card__tag`, `.post-card__title`, `.post-card__meta`, `.post-card__excerpt`, `.post-card__more` | Blog card grid. `.post-grid--blog` is the Resource Center preview: featured image, uppercase tags, title, excerpt, Read more. Cards are filled at build time from HubSpot RSS (`build-blog-feed.js`). Default `.post-card` still has a bordered treatment for podcast and similar lists. | AI Readiness, LATAM, Join Us, Ebooks |
| `.logo-wall`, `.logo-wall__item`, `.logo-wall__label` | Technology logo grid with a visible text label under each mark. Distinct from `.logo-marquee` (animated client logos) and `.air-eco-icon` (generated technology page icons). | Staff Augmentation, Join Us |
| `.resource-card`, `.resource-card__cover`, `.resource-card__body` | Cover image plus body, for a gated or downloadable asset. | AI Readiness whitepaper |
| `.process-step__sub` | Optional second level label under a step heading, for example a delivery modality. Avoids introducing an `h4` inside a step. | AI Readiness process |
| `.air-serve-card__source`, `.stat-source` | Small cited source line under a card or stat. | LATAM talent quality cards |
| `.panel-dark`, `.panel-dark__head` | A dark rounded panel: centered heading over a hairline rule, then a grid of icon-plus-text items. Composes with `.air-feature-stack` / `.air-feature` / `.air-feature__icon`, which lose their white card treatment inside it and render their icons white. Use for a short, high-trust block that should visually break the page rhythm. | AI Readiness "Our Expert Team" |
| `.chip-list` | Compact non linked labels, for example "Sourcing, Hiring, Onboarding, Payroll". | Staff Augmentation service scope |

### Icon wrappers: chip or floating

`.air-serve-card__icon` and `.air-feature__icon` have two treatments, chosen by what
is inside them rather than by which page they are on:

- **Inline SVG line icon** keeps the tinted 40px chip with a border. This is what the
  AI-Fluent landing page uses.
- **An `<img>`, meaning a standalone illustrated icon asset**, floats on the card
  surface with no box behind it, sized 48px (42px under 700px wide).

The switch is `:has(img)` in `styles/landing-page.css`, so no fragment opts in and the
two treatments cannot drift. Browsers without `:has()` fall back to the chip, which is
the previous behavior.

### Shared JavaScript added: `page.js`

Migrated marketing pages load `intake-form-shared.js` plus `page.js`. `page.js` is the
consolidation target for TD-01 and provides, all feature detected:

- HubSpot attribution capture and UTM hidden field population
- HubSpot virtual page view tracking on CTA clicks
- sticky header scroll state
- mobile nav toggle, with Escape to close and a focus return
- `prefers-reduced-motion` gated reveal observer
- FAQ accordion, one panel open at a time, plain `hidden` toggle
- testimonial carousel, slide count read from the DOM, arrow keys scoped to the
  carousel rather than the document
- intake form wiring through `window.BEIntakeForm.wireForm`

Two deliberate improvements over `home.js`: the carousel is no longer hardcoded to
three slides, and arrow key handling no longer hijacks the whole document.

### Summary of new work required

Across seven pages, the existing system covers almost everything. Genuinely new
shared patterns needed:

1. `.person-card` and `.person-grid` for the About leadership roster.
2. `.post-card` meta line (tag chip, author, date, read more) as an extension of
   `.role-card` for the three blog feed sections.
3. `.resource-download-card` for the AI Readiness whitepaper, once the download
   mechanism is confirmed.
4. An optional subtitle line on `.process-step` for the AI Readiness process.
5. An optional cited source line on `.air-serve-card` for LATAM talent quality stats.

Everything else is reuse. That is the correct outcome and confirms the design system
is doing its job.

---

## 7. Phase 2 patterns (added 2026-08-07)

| Pattern | Classes | Lives in | Used by |
| --- | --- | --- | --- |
| Jump navigation | `.jump-nav`, `.jump-nav__link` | `landing-page.css` | FAQs (7 categories), glossary (20 letters) |
| Grouped FAQ | `.faq-group`, `.faq-group__title` wrapping the canonical `.faq-list` | `landing-page.css` | FAQs |
| Resource grid | `.resource-grid`, plus `.resource-card` collapsing to one column when it has no cover | `landing-page.css` | Ebooks |
| Glossary | `.glossary-group`, `.glossary-letter`, `.glossary-list`, `.glossary-term`, `.glossary-term__name`, `.glossary-term__def`, `.glossary-term__links` | `landing-page.css` | Technical glossary |

### Grouped FAQ variant

The canonical FAQ (section 4.9) assumes one `.faq-list#faq-list` per page. The
dedicated FAQ page has 53 questions in 7 named categories, so it uses the grouped
variant: each category is a `.faq-group` carrying the jump-target `id`, containing an
`<h3 class="faq-group__title">` and its own `<div class="faq-list" id="faq-list-<slug>">`.

Item markup and styling are unchanged. `page.js` already selects every `.faq-list`, so
"one panel open at a time" scopes per group with no code change. **Exactly one item on
the whole page carries `is-open`**, the first item of the first group.

`tools/verify-migrated-pages.js` accepts either shape and rejects anything else. On the
grouped shape it also checks that group and list counts match, that list ids are
unique, and that every group has a title.

### The glossary is data driven

`data/glossary.js` holds 71 `{term, slug, definition, techSlug?, roleSlug?, note?}`
records. `build-glossary.js` generates `main-technical-glossary.html`, which
`build-pages.js` then wraps like any other fragment. `npm run build` chains them.

Do not hand edit `main-technical-glossary.html`. Edit the data file and rebuild.

What the generator adds that the live page does not have: alphabetical sorting, letter
grouping, a jump nav, per-term anchors, duplicate-definition detection, duplicate-slug
detection that fails the build, 24 cross-links into the technology and role pages, and
`DefinedTermSet` schema built from the same records that render the page.

### `extraSchema` hook

`data/pages.js` records may carry `extraSchema: function (ctx) { return [node, ...] }`.
`build-pages.js` appends the returned JSON-LD after the standard graph. The glossary
uses it for `DefinedTermSet`. Use it when a page has schema that should be derived from
the same data that renders it, never for hand-written schema that can drift.

---

## 8. Case studies, careers, industries (fidelity pass)

These patterns exist so HubSpot compositions are not forced into `.air-serve-card` /
`.role-card` grids. All live in `styles/landing-page.css` and are scoped. Do not use
them on Phase 1–2 pages.

| Pattern | Classes | Used by |
| --- | --- | --- |
| Logo trust bar | `.be-trustbar` | Case studies, industry verticals |
| Checklist (not cards) | `.be-check-list` | Case studies trust, industry why-us |
| Inline CTA bar | `.be-inline-cta` | Case studies, industry mid CTA |
| Case study kicker heading | `.cs-kicker-heading` | Case studies |
| Stacked stats with left bar | `.cs-stat` | Case studies |
| Dark challenge band | `.cs-challenge`, `.cs-about-card` | Case studies |
| Careers job list | `.cr-job-list`, `.cr-perk`, `.cr-banner` | Careers hub and jobs |
| Industry 2x2 text pairs | `.ind-pair`, `.ind-cluster` | FinTech, MarTech, HealthTech |
| Conversion talent tiles | `.cv-skill`, `.cv-steps`, `.cv-checks` | Hire in 72 hours |

Careers and industries stay data-driven: `data/careers.js` + `build-careers.js`,
`data/industries.js` + `build-industries.js`. Do not split them into hand-copied pages.
