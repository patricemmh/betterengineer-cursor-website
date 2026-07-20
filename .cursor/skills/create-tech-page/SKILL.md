---
name: create-tech-page
description: Adds a new BetterEngineer technology hiring page by adding a record to data/technologies.js and running the build-tech-pages.js generator, which writes technologies/{slug}/index.html and regenerates the technologies hub. Use when adding a new technology or stack page (for example Python, Node.js, Go, or Kubernetes), or when the user says "add a technology page", "new technology", or "create a tech landing page". Do NOT hand-copy technologies/tech-template/index.html; the generator is the only supported pipeline.
---

# Create a BetterEngineer Technology Page

Produces a complete, SEO/AEO-ready technology detail page and publishes it at
`discover.betterengineer.com/technologies/{slug}/`.

## The pipeline (read this first)

Technology pages are **generated, not hand-copied**. The pieces:

- `data/technologies.js` - the single source of truth. One JS object per technology,
  matching the `Technology` typedef at the top of the file (see that JSDoc block for
  every required field).
- `build-tech-pages.js` - reads `data/technologies.js`, renders every section (hero,
  overview, candidates, guide, ecosystem, use cases, stats, FAQ, related tech, related
  roles, etc.) from that data, and writes `technologies/{slug}/index.html`. It also
  regenerates `technologies/index.html` (the hub) from every `status: "published"`
  record, grouped by `category`.
- `technologies/tech-template/index.html` - chrome only (head boilerplate, header,
  footer, intake form). The generator slices this file for its `<body>`/`<main>`
  wrapper; it does **not** copy or edit page content from it. Never hand-edit this
  file for content, and never run `stamp-tech-template.js`, `build-tech-react.js`, or
  `move-ai-tools-section.js` (they target the old hand-copy flow and predate the
  generator).
- `engineers.js` (repo root) - the shared 31-person roster. The generator's roster
  selector (in `build-tech-pages.js`) picks up to 3 real engineers per tech page,
  matched first by `technologies[]` membership, then by `primaryStack`/`skills`
  overlap with the tech's ecosystem, with usage balanced across the whole published
  set so the same few people do not repeat on every page. You do not hand-pick
  candidates; you make sure the right engineers have this tech's slug in their
  `technologies[]` array (or matching skills) so the selector finds them.
- `tools/verify-tech-data.js` - build-time validation (Step 4).
- `tools/verify-links.js` - local asset existence check (`--assets`) and an opt-in
  network check for stat/icon URLs (`--external`).

**Never hand-edit `technologies/{slug}/index.html`.** If it looks wrong, fix the
data record or the generator, then re-run the build.

## Step 1, add or edit the data record

Read `COPY_BRIEF.md` before drafting any copy. Copy rules: no em dashes, no vague
AI-marketing phrases (unlock potential, revolutionize, seamless, cutting-edge,
game-changing), concrete outcomes, short-to-medium sentences. Pick the primary ICP
(startup, established company, or agency) first and align the hero, use cases,
trust framing, and FAQ answers to it.

Add a new object to the `technologies` array in `data/technologies.js` (the
`python-developers` record is the reference example) with every field from the
`Technology` typedef:

`name, slug, category, priority, status, keyword, metaDescription, heroLead,
heroDirectAnswer, atAGlance, whatTheyBuild, responsibilities, coreSkills, ecosystem,
useCases, evaluation, guideSections, stats, faqs, relatedTechnologies, relatedRoles,
ctaLead, lastUpdated`.

Notes on specific fields:

- `slug` must match `{tech}-developers` (lowercase, alphanumeric plus hyphens). Check
  existing records in `data/technologies.js` and the technologies hub before picking
  a new slug so you do not collide with a published page.
- `status` starts as `"draft"` while you write copy; set it to `"published"` only when
  every required field is complete and accurate. Only `"published"` records generate a
  page and appear in the hub, sitemap, and `llms.txt`.
- `ecosystem[].icons[].techSlug` is optional: set it to another record's `slug` only
  when that page is (or will be) published. Unpublished targets render as plain,
  non-clickable icons, so it is safe to reference future pages.
- `relatedTechnologies` must reference real slugs in the dataset and must not include
  the record's own slug.
- `relatedRoles` lists role page slugs (`back-end-engineers`, `data-engineers`,
  `data-science-engineers`, `ai-engineers`, `mobile-engineers`, `front-end-engineers`,
  `full-stack-engineers`, `devops-engineers`, `qa-engineers`, `blockchain-engineers`).
  Every slug must have a real `roles/{slug}/index.html`. This drives the "Roles that
  commonly need X" cross-link block on the tech page. To also add the reverse link
  (a "Technologies we staff for this role" block on those role pages), run
  `node update-role-tech-links.js` after publishing (Step 3).
- `stats` needs 3 real, current, third-party sources with live URLs (Stack Overflow
  Developer Survey, BLS Occupational Outlook, GitHub Octoverse, TIOBE, JetBrains, or a
  reputable vendor report). Never invent a statistic or reuse a stat that is not
  actually about this technology.
- `guideSections` needs 4-5 long-form sections (`id`, `tocTitle`, `prose` as trusted
  HTML). Add a 5th "Should you hire {Tech} engineers for AI and machine learning
  work?" section only when it is editorially relevant (Python, data, ML/AI stacks);
  do not force it onto PHP, Ruby, mobile, or pure database pages. The generator
  attaches the evaluation checklist to whichever section is last.
- Approved BetterEngineer proof points only (from `COPY_BRIEF.md`): 25,000+ vetted
  engineers, 72 hours to first profiles, 38 days average time to hire, 3 of 4
  candidates interviewed, 21.3 months average tenure, 42.8% average savings, 98%
  long-term engagement rate. Never invent company numbers.

## Step 2, repopulate the engineer roster if needed

If the roster selector (Step 3 output) shows fewer than 3 matched engineers, or the
matches feel like a weak stretch, open `engineers.js` and add this tech's slug to the
`technologies[]` array of engineers whose real `primaryStack`/`skills` genuinely fit
(for example `python-developers` for engineers who list Python, Django, or FastAPI).
Do not invent new engineers or reuse the old fake candidate pool; every card must map
to a real entry in `engineers.js` with a photo already in `images/engineers/`.

## Step 3, build and check the roster

```bash
node build-tech-pages.js <slug-substring>
```

This regenerates only the matching slug(s) plus the hub (`technologies/index.html`).
Run with no argument to regenerate every published page and the hub. Check the
console output and confirm `technologies/{slug}/index.html` shows 1-3 real candidate
cards (names/photos from `engineers.js`, not placeholder text). If it shows the
generic "Talent matched to your stack" fallback, go back to Step 2.

If this technology has `relatedRoles`, also run:

```bash
node update-role-tech-links.js
```

This injects/updates the "Technologies we staff for this role" block on every role
page whose slug appears in a published technology's `relatedRoles`. Safe to re-run
any time; it replaces its own previously injected block instead of duplicating it.

## Step 4, verify

```bash
node tools/verify-tech-data.js
node tools/verify-links.js --assets
npm run verify
```

`verify-tech-data.js` checks: required fields present, meta description length
(120-155 chars), `heroDirectAnswer` word count (35-70, aim 40-60), 4-6 FAQs, exactly
one H1, canonical on the `discover.` host, GTM present, intake form wired, FAQ visible
text matches `FAQPage` JSON-LD verbatim, `Organization`/`WebPage`/`Service`/
`BreadcrumbList`/`FAQPage` JSON-LD present, Twitter Card meta present, trust cards use
`<h3>` (not `<h4>`), `relatedTechnologies`/`relatedRoles` resolve to real pages, every
rendered `/images/engineers/{id}.png` exists on disk, no em dash anywhere, and warns
(does not fail) if a published page renders zero roster engineers.

`verify-links.js --assets` confirms every local `/images/...`, `/icons/...`,
`/styles/...` reference across all technology and role pages resolves to a real file.
Run `node tools/verify-links.js --external` manually before shipping a phase to check
that every stat URL and icon CDN reference is still live (network call, not part of
CI).

Fix every `FAIL`, review every `WARN`, then rerun until clean.

## Step 5, commit

```bash
git add data/technologies.js technologies/{slug}/ technologies/index.html engineers.js
git commit -m "Add {Display Name} technology page"
```

Do not push unless asked. GitHub Actions deploys automatically on push to `main`,
after `npm run verify` passes in CI.

---

## Checklist before committing

- [ ] Record in `data/technologies.js` has every required field and `status: "published"`
- [ ] Slug matches `{tech}-developers`
- [ ] Copy is unique and technology-accurate (not a reskin of another record)
- [ ] 3 real, current, third-party stats with live URLs
- [ ] `relatedTechnologies` and `relatedRoles` set and resolve to real pages
- [ ] Roster shows 1-3 real engineers from `engineers.js` (not the generic fallback)
- [ ] AI/ML guide section included only where editorially appropriate
- [ ] No em dash anywhere; no banned hype phrases
- [ ] `node tools/verify-tech-data.js` passes (0 fail)
- [ ] `node tools/verify-links.js --assets` passes (0 fail)
- [ ] `npm run verify` passes end to end
- [ ] Page appears in `technologies/index.html` (hub) after the build

---

## Reference files

- `technologies/python-developers/index.html` - gold-standard generated output; do not
  hand-edit it, but read it to see what the generator should produce.
- `data/technologies.js` - the Python record is the fullest reference for every field.
- `COPY_BRIEF.md` (repo root) - voice, positioning, ICP segments, approved proof points.
