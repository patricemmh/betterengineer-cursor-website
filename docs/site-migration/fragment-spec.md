# Migrated page fragment spec

This is the build spec used to author every `main-<slug>.html` fragment during the
HubSpot migration. It lives in the repo so future work produces identical output
instead of drifting. Read it alongside `component-pattern-inventory.md`.

Last updated: 2026-08-07


You are writing ONE `main-<slug>.html` fragment for the BetterEngineer static site.
This is a vanilla HTML/CSS/JS site. No React, no framework, no build-time templating
inside the fragment. The fragment is inlined by `build-pages.js` between the shared
header and the shared footer.

## Inputs you must read first

1. The extraction record for your page (path given in your task). It holds the
   VERBATIM source copy, the asset table with proposed local filenames and alt text,
   the link table, and the logical page structure. **Section 2 is your copy source.**
2. `docs/site-migration/component-pattern-inventory.md`. Section 4 is the pattern
   catalogue, section 6 has the approved section-to-pattern mapping per page.
3. `main-home.html`. The reference fragment. Match its formatting, indentation, and
   idiom exactly.

## Output

Write ONLY the fragment to the output path given in your task. It must:
- start with `  <main id="main">` and end with `  </main>` (two-space indent, matching main-home.html)
- contain NO `<html>`, `<head>`, `<header>`, `<footer>`, `<script>`, or `<style>` tags
- use 2-space indentation, same as main-home.html

## HARD RULES

1. **COPY VERBATIM.** Every headline, subhead, paragraph, list item, label, CTA text,
   button text, caption, FAQ question, FAQ answer, testimonial, quote, and statistic
   must match the extraction record exactly: same words, same punctuation, same
   capitalization. Do NOT rewrite, paraphrase, summarize, shorten, expand, modernize,
   fix typos, or "improve" anything. If the source says "heavylifting", you write
   "heavylifting". If the source repeats itself, you repeat it.
2. **NO EM DASH CHARACTER (U+2014).** The build hard-fails on it. Where the source
   copy contains an em dash, keep every word identical and replace only the em dash
   character with a comma (or a colon where a comma would be ungrammatical). Immediately
   after that element add an HTML comment:
   `<!-- MIGRATION: em dash replaced, wording unchanged. See content-followups.md -->`
   Also avoid the en dash character (U+2013) the same way where it appears as a dash;
   keep it if it is a numeric range like "30-50%" by writing a plain hyphen.
3. **REUSE EXISTING CLASSES ONLY.** Do not invent class names. The complete allowed
   set is listed below. If you believe you need something not on the list, use the
   closest listed pattern and add an HTML comment explaining the gap.
4. **Root-relative asset paths.** `/images/pages/<slug>/<file>` and `/icons/<file>`.
   Never a hubfs, hs-fs, or any betterengineer.com absolute image URL.
5. Every `<img>` needs `alt`, `width`, `height`, and `loading` (`eager` only for the
   hero image, `lazy` everywhere else). Write REAL descriptive alt text. The legacy
   alt text is mostly filenames; do not copy that. Decorative images get `alt=""`.
6. **One `<h1>` per page**, the H1 from the extraction record. Heading levels must
   descend correctly: h1 then h2 then h3. Fix broken levels from the source (that is
   structure, not copy). Never skip a level.
7. **Links.** Keep every destination from the extraction record's link table exactly.
   Pages not yet migrated stay absolute (`https://www.betterengineer.com/...`).
   Do NOT convert them; the build handles that at cutover.
8. Wrap major blocks in `<section class="section">` (or `section-tint` for alternating
   bands) containing a `<div class="wrap">`. Add `class="reveal"` to the animated
   content block inside each section, as main-home.html does. Give each section a
   stable `id` and `aria-labelledby` pointing at its heading id.

## ALLOWED CLASSES (complete list, use nothing else)

Layout/section: section, section-tint, section-rule, wrap, split, split__img, ai-split,
ai-split__right, air-tech-split, air-latam-split, air-section-head, air-section-head--light,
reveal, is-visible

Type: h1, h2, lead, eyebrow, accent, light, quote

Buttons: btn, btn--primary, btn--outline, btn--ghost, btn--outline-light, btn-row

Hero: hero, hero-grid, hero-visual, hero-visual--image, hero-visual__img,
hero-form__card, hero-form__title, hero-form__subtitle

Cards/grids: card-grid, role-card, role-card--featured, role-card__badge,
air-serve-grid, air-serve-card, air-serve-card__icon, air-serve-card__source,
air-feature-stack, air-feature, air-feature__icon, usecase-grid, usecase-card,
air-use-grid, skill-card, skills-head, air-prose-card, air-prose-card__kicker,
air-number-card, air-number-card__num, air-numbers-grid,
person-grid, person-card, person-card__photo, person-card__name, person-card__role, person-card__social,
post-grid, post-card, post-card__tags, post-card__tag, post-card__title, post-card__meta,
post-card__excerpt, post-card__more,
logo-wall, logo-wall__item, logo-wall__label,
resource-card, resource-card__cover, resource-card__body

Lists: fluency-checks, audit-checklist, audit-checklist--compact, air-list, air-bullets,
problem-list, chip-list, air-tag, air-tag-cluster, air-skill-tags, air-skills-cluster,
trust-pill, trust-pills

Process: process-grid, process-grid--three, process-grid--five, process-step,
process-step__num, process-step__sub

Stats/proof: stats-section, stats-title, stats-bento, stats-bento__cell, stats-bento__stat,
stat-num, stat-label, stat-source, air-stats-strip, air-stat-row, air-stat, air-stat__num,
air-stat__label, partners, partners-label, logo-marquee, logo-track, client-block, client-sub

Testimonials: carousel-wrap, carousel-intro, carousel-shell, carousel-slides, carousel-btn,
carousel-dots, slide, slide-grid, slide-photo, slide-copy, slide-footer, slide-name,
slide-role, slide-logo, is-active

FAQ: faq-list, faq-item, faq-question, faq-panel, chevron, is-open

Comparison: air-compare-wrap, air-compare-table, air-compare-table__us, air-compare-head,
air-mark, air-mark--yes, air-mark--no, air-mark--maybe

CTA: cta-band, cta-split, cta-split__text, cta-split__text-inner, cta-split__photo,
air-final-cta, air-final-cta__inner, air-final-cta__note, air-mid-cta, air-mid-cta__card,
air-mid-cta__title, air-mid-cta__button, air-mid-cta__image,
latam, latam-title, latam-title__accent, latam-lead, latam-locations, latam-cta, latam-map

Forms: react-intake-card, react-intake-form, react-intake-submit, form-grid, form-field,
form-field--full, form-privacy-note, form-status

## EXACT MARKUP FOR SHARED PATTERNS

### FAQ accordion (CANONICAL, must match exactly)

The FAQ has one approved treatment site wide, taken from the technology pages. Styles
live in `styles/brand.css`. `tools/verify-migrated-pages.js` fails the build on any
deviation. Full rationale in `component-pattern-inventory.md` section 4.9.

```html
    <section class="section section-tint" id="faq" aria-labelledby="faq-heading">
      <div class="wrap">
        <div class="reveal air-section-head" style="max-width:44rem">
          <p class="eyebrow">SECTION LABEL FAQ</p>
          <h2 class="h2" id="faq-heading">Frequently Asked Questions</h2>
        </div>
        <div class="faq-list reveal" id="faq-list">
          <div class="faq-item is-open">
            <button type="button" aria-expanded="true"><span class="faq-question">QUESTION TEXT VERBATIM</span><span class="chevron" aria-hidden="true"></span></button>
            <div class="faq-panel">
              <p>ANSWER TEXT VERBATIM</p>
            </div>
          </div>
          <div class="faq-item">
            <button type="button" aria-expanded="false"><span class="faq-question">QUESTION 2</span><span class="chevron" aria-hidden="true"></span></button>
            <div class="faq-panel" hidden>
              <p>Intro line.</p>
              <ul><li>List item</li><li>List item</li></ul>
            </div>
          </div>
        </div>
      </div>
    </section>
```

Non negotiable:

- The `.eyebrow` label is required. Uppercase, short, ending in "FAQ".
- Exactly one `.faq-item` has `is-open`, and it is the first.
- `aria-expanded` matches `is-open` on every button.
- Every closed `.faq-panel` carries `hidden`. The open one does not.
- The chevron is `<span class="chevron" aria-hidden="true"></span>` and nothing else.
  It is drawn in CSS. Never put an SVG or a character inside it.
- The heading text comes from the source page, verbatim. The eyebrow does not, so any
  new one gets logged in `content-followups.md`.
- Set `faqSchema: true` on the page's `data/pages.js` record. The build derives the
  `FAQPage` JSON-LD from this markup, so schema and visible text cannot drift.

### Testimonial carousel

```html
    <section class="section" id="testimonials" aria-roledescription="carousel" aria-label="Client testimonials" data-carousel>
      <div class="wrap carousel-wrap">
        <div class="carousel-intro reveal">
          <h2 class="h2">HEADING VERBATIM</h2>
          <p class="lead" style="margin:0 auto;max-width:32rem">SUBHEAD VERBATIM</p>
        </div>
        <div class="carousel-shell reveal">
          <button type="button" class="carousel-btn" data-carousel-prev aria-label="Previous testimonial">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M15 18l-6-6 6-6"></path></svg>
          </button>
          <div class="carousel-slides">
            <article class="slide is-active" id="slide-0" role="tabpanel" aria-hidden="false">
              <div class="slide-grid">
                <div class="slide-photo"><img src="/images/pages/<slug>/name.png" alt="" width="360" height="360" loading="lazy"></div>
                <div class="slide-copy">
                  <p class="quote">QUOTE VERBATIM including its original curly quotes</p>
                  <div class="slide-footer">
                    <div><div class="slide-name">NAME</div><div class="slide-role">TITLE</div></div>
                    <div class="slide-logo"><img src="/images/pages/<slug>/logo.png" alt="COMPANY" width="140" height="40" loading="lazy"></div>
                  </div>
                </div>
              </div>
            </article>
          </div>
          <button type="button" class="carousel-btn" data-carousel-next aria-label="Next testimonial">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 18l6-6-6-6"></path></svg>
          </button>
        </div>
        <div class="carousel-dots" role="tablist" aria-label="Choose testimonial">
          <button type="button" role="tab" aria-label="Show testimonial 1" aria-selected="true" class="is-active" data-slide-index="0"></button>
        </div>
      </div>
    </section>
```
The `data-carousel`, `data-carousel-prev`, and `data-carousel-next` attributes are
required. page.js reads the slide count from the DOM, so any number of slides works.

### Intake form (custom frontend, HubSpot backend, wired by intake-form-shared.js)

```html
          <div class="react-intake-card reveal">
            <h2 class="h2 hero-form__title" id="form-heading">HEADING</h2>
            <p class="hero-form__subtitle">SUBHEAD</p>
            <form id="react-intake-form" class="react-intake-form" novalidate>
              <div class="form-grid">
                <div class="form-field">
                  <label for="firstname">First name *</label>
                  <input id="firstname" name="firstname" type="text" autocomplete="given-name" required placeholder="First name *">
                </div>
                <div class="form-field">
                  <label for="lastname">Last name *</label>
                  <input id="lastname" name="lastname" type="text" autocomplete="family-name" required placeholder="Last name *">
                </div>
                <div class="form-field form-field--full">
                  <label for="email">Work email *</label>
                  <input id="email" name="email" type="email" autocomplete="email" required placeholder="Work email *">
                </div>
                <div class="form-field form-field--full">
                  <label for="message">LABEL *</label>
                  <textarea id="message" name="message" rows="3" required placeholder="PLACEHOLDER"></textarea>
                </div>
              </div>
              <div aria-hidden="true" style="position:absolute;left:-10000px;top:auto;width:1px;height:1px;overflow:hidden;pointer-events:none">
                <label for="company_website">Leave this field empty</label>
                <input type="text" name="company_website" id="company_website" tabindex="-1" autocomplete="off" value="">
              </div>
              <input type="hidden" name="utm_campaign" id="utm_campaign" value="">
              <input type="hidden" name="utm_content" id="utm_content" value="">
              <input type="hidden" name="utm_medium" id="utm_medium" value="">
              <input type="hidden" name="utm_source" id="utm_source" value="">
              <p class="form-privacy-note">By submitting, you agree to be contacted about your request.</p>
              <button class="btn btn--primary react-intake-submit" type="submit">SUBMIT LABEL</button>
              <p id="react-intake-status" class="form-status" role="status" aria-live="polite"></p>
            </form>
          </div>
```
Never change the field `name` attributes. Never add a field that is not in this
pattern without an HTML comment flagging that HubSpot needs a matching property.

### Blog feed sections

The source pages end with a live HubSpot blog feed. A static build cannot render
that. Emit the three posts as static `.post-card`s using the verbatim extracted
titles, authors, dates, and excerpts, and put this comment immediately before the
section:
`<!-- MIGRATION CF-54: this was a live HubSpot blog module. Rendered static from the extraction snapshot. Decide build-time fetch vs curated list vs drop. -->`

## Before you finish

Re-read section 2 of the extraction record and confirm EVERY piece of copy appears in
your fragment. Then check: exactly one h1, no skipped heading levels, no em dash
character, no hubfs URL, every img has alt/width/height/loading, every class is on the
allowed list, FAQ markup matches the template exactly.
