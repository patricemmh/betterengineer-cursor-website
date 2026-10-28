# Structured Data Inventory

Audit of every page family that uses, or should use, structured data. Also the home
of the Roles v2 refactor plan.

Last updated: 2026-09-08

**Roles indexability patch, 2026-09-08 (in repo, live after next discover deploy):**
front-end and blockchain now emit Organization + Service + BreadcrumbList + FAQPage.
The roles hub emits Organization, BreadcrumbList, and CollectionPage with a 10-item
ItemList. Template URLs are overwritten in `dist/` as `noindex` stubs. Roles v2
(generator + `data/roles.js`) is still the right long-term project; it is not required
for Google to index the live family.

---

## 1. Current state at a glance

| Family | Pages | Data source | Generator | JSON-LD emitted | Verified |
| --- | --- | --- | --- | --- | --- |
| Technologies | 58 published plus hub plus template | `data/technologies.js` (890 KB, 25 fields, JSDoc typed) | `build-tech-pages.js` | Organization, BreadcrumbList, FAQPage, Service, WebPage. Hub adds CollectionPage with ItemList | Yes, `tools/verify-tech-data.js` |
| Roles | 10 plus hub plus template | None. Content lives in the HTML | None. Hand authored. Indexability patched by `tools/patch-role-indexability.js` | All 10 role pages: Organization, Service, BreadcrumbList, FAQPage. Hub: Organization, BreadcrumbList, CollectionPage ItemList. Dist templates: noindex stubs | Partial: `tools/verify-phase1-seo.js` now requires those types |
| Home and landing pages | 3 | `main-*.html` fragments | `build-pages.js` | None | Partially, `tools/verify-site.js` |
| Migrated Phase 1 pages | 7 in progress | `data/pages.js` plus `main-*.html` fragments | `build-pages.js` | Planned: Organization, BreadcrumbList, WebPage, FAQPage, Service where relevant | Planned |
| Case studies | 2, not migrated | n/a | n/a | Unknown | n/a |
| Careers | Landing plus job pages, not migrated | n/a | n/a | Unknown, JobPosting is the obvious fit | n/a |
| Industries | 3, not migrated | n/a | n/a | Unknown | n/a |

## 2. Technologies — the reference architecture

Treat this as the pattern to follow, not as perfect.

### Data model, `data/technologies.js`

`module.exports = { technologies }`, a flat array of 58 records. Fields:

`name`, `slug`, `category`, `priority`, `status`, `keyword` (`{primary, volume, difficulty, secondary[]}`),
`metaDescription`, `h1Noun` (optional, present on 17 of 58), `heroLead`, `heroDirectAnswer`,
`formPlaceholder`, `atAGlance` (6 rows), `whatTheyBuild`, `responsibilities` (6),
`coreSkills` (6), `ecosystem` (`{group, desc, icons[{label, slug, techSlug?, src?}]}`),
`useCases` (`{title, body}`), `evaluation` (5), `guideSections` (`{id, tocTitle, prose}`),
`stats` (`{text, source, url}`), `faqs` (`{q, a}`), `relatedTechnologies`, `relatedRoles`,
`ctaLead`, `lastUpdated`.

`status` is the publish gate. `category` is one of Language, Frontend, Backend, Mobile,
Data, Cloud, AI/ML. `priority` 1 to 3 mirrors the tier column in `data-keywords.csv`.

### Generation

`build-tech-pages.js` slices `technologies/tech-template/index.html` into a header
prefix, a footer suffix, and a form block, then composes 17 section functions into a
fixed page order. Everything is escaped except `guideSections[].prose`, which is
trusted raw HTML. The generator hard fails the build on any em dash character.

### Internal linking, all publish gated

1. Ecosystem icons link to `/technologies/{techSlug}/` only when that technology is published.
2. `relatedTechnologies` cards, filtered to published slugs, plus an always present
   link to the hub.
3. `relatedRoles` cards to `/roles/{slug}/`, gated on a hardcoded `ROLE_META` map.
4. First mention prose links, applied by `tools/link-role-tech-mentions.js`.

Because every link is gated, the family cannot produce a dead internal link.

### Verification

`tools/verify-tech-data.js` enforces roughly 20 dataset rules and 25 per page
assertions, including meta description length 120 to 155 characters, direct answer
word count, FAQ count, slug format, duplicate title detection, exact canonical,
exactly one H1, heading hierarchy (trust cards must use `h3`, not `h4`), all five
JSON-LD types present and parseable, **FAQ JSON-LD text matching visible FAQ text in
order**, and every internal link resolving to a real file on disk.

This is the single most valuable artifact in the repo. Every future page family
should ship with an equivalent verifier.

### Where the technology architecture could improve

- `guideSections[].id` values are bespoke per technology, roughly 200 distinct ids.
  A few records use a generic pattern instead. Worth normalizing.
- `keyword` is captured but is not enforced by the verifier's required field list.
- Six rows in `data-keywords.csv` were never built as pages.
- `ROLE_META` is hardcoded in the generator rather than read from a role data file.
- Tech to role linking is sparse. The React page links to only two role pages.
- `technologies/tech-template/` ships to production with a self canonical. It is
  excluded from the sitemap but nothing prevents indexing.

## 3. Roles — current state

Role pages predate the technology architecture and were never brought forward.

### How they are produced

There is no generator and no data file. All 10 role pages plus the hub were added in
a single commit and have been patched ever since by one off literal string replace
scripts: `build-blockchain-page.js` (37 KB of sequential replacements),
`finish-blockchain-page.js`, `add-other-roles-fe.js`, `add-other-roles-blockchain.js`,
`update-engineer-cards.js`, `update-role-tech-links.js`, `build-tech-grids.js`,
`tools/link-role-tech-mentions.js`.

Only three narrow slices are machine maintained: the candidate card grid (from
`engineers.js`), the related technologies block (reverse mapped from
`technology.relatedRoles`), and the tech stack icon grid (from a map hardcoded inside
`build-tech-grids.js`).

### Duplication, measured

- Footer: 6,577 bytes, byte identical on all 10 pages. 59,193 redundant bytes.
- Header: 4,157 bytes, identical on 9 of 10. Blockchain drifted to 4,141 bytes.
- Inline `<style>`: 2,817 bytes, identical on all 10. 25,353 redundant bytes.
- Five whole sections are byte identical across 8 to 10 pages: `.partners`,
  `#ai-tools`, `#other-roles`, `#hiring-path`, `.air-mid-cta`.
- Roughly **188,000 bytes, about 30 percent of the 631 KB role corpus, is the same
  bytes repeated across files.**
- 31 percent of all visible role page prose is a verbatim repeat of prose on another
  role page.
- Every page has the same 19 sections and near identical cardinality: 1 H1, 13 to 14
  H2, 13 H4, 8 FAQ items, 8 use case cards, 5 skill groups, 9 to 10 tech icons,
  4 guide sections, 3 candidate cards.

The content varies. The shape is rigid. That is the definition of something that
should be data driven.

### Schema and SEO gaps versus technologies

| Issue | Detail |
| --- | --- |
| No `WebPage` node on any role page | No `datePublished`, no `dateModified`, no visible "Last updated" |
| 2 of 10 pages have `FAQPage` only | `front-end-engineers` and `blockchain-engineers` are missing Organization, Service, and BreadcrumbList |
| `roles/index.html` has zero structured data | Technologies hub emits Organization, BreadcrumbList, CollectionPage with a 58 item ItemList |
| `Organization` omits `sameAs[]` | Technology pages include LinkedIn, Facebook, Instagram |
| FAQ JSON-LD to visible text drift | Already broken on `front-end-engineers`: LD reads "How are BetterEngineer's front-end engineers vetted?", visible text reads "How are BetterEngineer front-end engineers vetted?" |
| Title patterns inconsistent | Three different patterns across 10 pages |
| `og:image` and `twitter:card` missing | On front-end, blockchain, the hub, and the template |
| Different OG image asset | Roles use `cta-band-mask.png`, technologies use `trust-laptop.png` |
| Heading hierarchy violation | All 10 role pages use `h4` in trust cards. The tech verifier explicitly fails this pattern |
| Em dash removal artifacts | `" - "` double space hyphen residue in descriptions and copy |
| `roles-template/` ships to production | Live, crawlable, self canonical, near duplicate of front-end-engineers |
| Orphaned from the tech graph | `qa-engineers` has 2 technology links, `blockchain-engineers` has 1 and no related technologies section at all, because no technology record lists it in `relatedRoles` |

### Side by side

| Dimension | Technologies | Roles |
| --- | --- | --- |
| Data source | `data/technologies.js`, 25 typed fields | None |
| Generation | One deterministic script, `npm run build:tech` | Hand authored plus 7 one off replace scripts, not idempotent, no npm script |
| Schema | 5 verified LD blocks plus hub CollectionPage | 4 blocks on 8 of 10 pages, 1 block on 2 of 10, none on the hub |
| Metadata | Uniform and byte verified | Three title patterns, missing OG and Twitter tags on 4 files |
| Internal linking | 4 data driven publish gated channels | 1 data driven channel anchored on an HTML comment |
| Scalability | Add a record, run one command | Copy 55 KB of HTML and write another replace script |
| CSS | 4 linked sheets plus one generator owned inline block | 4 linked sheets plus a hand copied inline block duplicated 10 times |
| Guide UI | Tabs | Sticky TOC with scroll spy |
| Verification | 45 plus automated rules, CI gated | Asset existence only |

---

## 4. Roles Refactor — Future Project

**Do not start this during the main page migration.** Do not modify role pages while
migrating Phase 1. This section exists so the work is fully specified when it is
scheduled.

### Goal

Apply everything learned from the technology family: a real data model, one
deterministic generator, complete and verified schema, publish gated internal
linking, and a CI enforced verifier. Zero copy changes in the same release.

### 4.1 Proposed data model, `data/roles.js`

`module.exports = { roles }`. Fields derived from what the role pages actually
contain today:

| Field | Type | Notes |
| --- | --- | --- |
| `name` | string | "Front-end", "QA", "Data science" |
| `slug` | string | Unchanged from today, URLs must not move |
| `pluralNoun` | string | H1 noun, the role analogue of `h1Noun` |
| `titleNoun` | string | Title tag casing, resolves the three pattern drift |
| `kicker` | string | "ROLES | FRONT-END ENGINEERS" |
| `priority` | 1 to 3 | |
| `status` | planned, draft, review, published | Publish gate |
| `keyword` | `{primary, volume, difficulty, secondary[]}` | From SEMrush research |
| `metaDescription` | string | 120 to 155 characters, unique |
| `heroLead` | string | |
| `heroDirectAnswer` | string | New. 40 to 60 word AEO answer. Roles have none today |
| `heroFormTitle` | string | |
| `formPlaceholder` | string | |
| `atAGlance` | `[string, string][]` | New. 6 rows, parity with technologies |
| `whatTheyBuild` | string[] | New |
| `responsibilities` | string[] | Currently only inside guide prose |
| `coreSkills` | string[] | Currently only inside guide prose |
| `skillGroups` | `{group, body}[]` | Exactly 5 today |
| `techIcons` | `{label, slug, src?, techSlug?}[]` | 9 to 10 today. Migrate from `build-tech-grids.js`. Add `techSlug` so icons become internal links |
| `techStackLead` | string | |
| `useCases` | `{title, body}[]` | Exactly 8 today |
| `trustPoints` | `{title, body}[]` | 6 today, roughly 4 are shared boilerplate. Model shared defaults in the generator with a per role override |
| `trustLead`, `trustPhotoAlt` | string | |
| `guideSections` | `{id, tocTitle, prose}[]` | 4 today. Raw HTML, no em dash |
| `evaluation` | string[] | New, parity with technologies |
| `stats` | `{text, source, url}[]` | New. Roles cite nothing today |
| `faqs` | `{q, a}[]` | Exactly 8 today |
| `relatedTechnologies` | string[] | New. Explicit forward edges |
| `relatedRoles` | string[] | Siblings |
| `proseLinks` | `{re, flags, slug}[]` | Migrate `ROLE_LINKS` from `tools/link-role-tech-mentions.js` |
| `ctaHeading`, `ctaLead`, `ctaNote` | string | |
| `lastUpdated` | string | "YYYY-MM" |

Candidate cards stay derived from `engineers.js` at build time. Do not put them in
the data file.

### 4.2 Generator, `build-role-pages.js`

Mirror `build-tech-pages.js` closely so both systems read the same way. Extract the
genuinely shared blocks into `lib/shared-blocks.js` imported by both generators:
`partners()`, `aiTools()`, `hiringPath()`, `midCta()`, `ORG`, `OG_IMAGE`, `ld()`,
`esc()`, `monthYear()`, `li()`. That alone removes the 10 duplicated copies of four
sections and stops the two families drifting again.

Two decisions to settle before writing code:

- **Guide UI.** Tabs, as on technology pages, or the sticky TOC, as on role pages.
  The TOC gives crawlable in page anchor targets, which is better for AEO on long
  form guide copy. Recommendation: keep the TOC for roles, consider backporting it
  to technologies later, but put one implementation in `lib/`.
- **OG image.** Roles use `cta-band-mask.png`, technologies use `trust-laptop.png`.
  Pick one constant. Note this changes every social share card, so get sign off.

Wire `"build:roles": "node build-role-pages.js"` into `package.json` and into the
`verify` chain.

### 4.3 Schema plan

Emit the same five separate top level LD blocks that technology pages emit, so one
shared checker validates both families:

1. `Organization`, reusing the shared `ORG` constant including `sameAs[]`.
2. `BreadcrumbList`: Home, Roles, the role.
3. `FAQPage`, generated 1 to 1 from `faqs` so the text can never drift.
4. `Service`, keeping the `audience` node that roles already have and technologies
   lack. That is worth backporting to technologies.
5. `WebPage`, new for roles, with `inLanguage`, `isPartOf`, `primaryImageOfPage`,
   `about`, `datePublished`, `dateModified`, plus a visible "Last updated" line.

Add `Organization`, `BreadcrumbList`, and `CollectionPage` with an `ItemList` to
`roles/index.html`.

Consider `Occupation` or `hasOccupation` on role pages. Roles are a natural fit and
technologies cannot claim it. Validate against Google's supported types first.

### 4.4 Internal linking plan

- Union the reverse map from `technology.relatedRoles` with an explicit
  `role.relatedTechnologies` forward list. This fixes `blockchain-engineers`, which
  currently has no related technologies because no technology names it.
- Generate `#other-roles` from published roles, filtering out self. Retire
  `add-other-roles-fe.js` and `add-other-roles-blockchain.js`.
- Move `ROLE_LINKS` into `role.proseLinks` and apply first mention linking during
  generation, publish gated. This makes it idempotent by construction rather than by
  regex guard, and evens out the current 1 to 35 links per page spread.
- Replace the hardcoded `ROLE_META` in `build-tech-pages.js` with a require of
  `data/roles.js`.
- Add `techSlug` to `techIcons` so the 9 to 10 currently inert icons per page become
  90 to 100 new internal edges into the technology graph.

### 4.5 Migration path that does not break URLs

1. Snapshot the current rendered output of all 11 files as the diff baseline.
2. Write `tools/extract-role-data.js` to parse the existing HTML into `data/roles.js`.
   Hand review the output. **Preserve every word of existing indexed copy.** No copy
   rewrite in the same change as the pipeline change, or you lose the ability to
   attribute any ranking movement.
3. Iterate the generator until output diffs cleanly against the baseline apart from
   the intended fixes: add `WebPage`, add the three missing LD blocks to front-end
   and blockchain, add `og:image` and `twitter:card` to those two, change `h4` to
   `h3` in trust cards, fix the front-end FAQ LD mismatch, remove `" - "` artifacts,
   add "Last updated".
4. **Write `tools/verify-role-data.js` before the generator, not after.** It is the
   artifact that makes the refactor safe to land.
5. Retire the mutation scripts in one commit.
6. Decide what to do about `roles/roles-template/`. Preferred: move it outside the
   published tree, check Search Console for traffic first, add a 301 if any. Minimum:
   `noindex, follow` plus a canonical pointing at `/roles/front-end-engineers/`. Same
   question applies to `technologies/tech-template/`.
7. `build-discover-dist.js` needs no change as long as output paths are stable.
8. Deploy, then run `npm run monitor:live` for the first week.

### 4.6 Risks

- **Copy rewrite is not a refactor.** Ship the pipeline change with zero copy churn.
- **`guideSections[].prose` already contains generated technology anchors.** Strip
  them during extraction and re-derive from `proseLinks`, or you get double linking
  and permanently frozen links that ignore the publish gate.
- **HTML entities.** Existing copy contains `&#39;`, `&amp;`, `&gt;`. Decode for
  fields that pass through `esc()`, do not decode inside `prose`, which bypasses it.
- **`build-blockchain-page.js` warns and continues on failed replacements.** Some may
  have silently no-opped. Grep the blockchain output for stray front-end copy before
  trusting the extraction.
- **Three different definitions of "the set of roles" exist today**: the hardcoded
  `ROLE_META` in the tech generator, `ROLE_SLUGS` in the tech verifier, and a 9 item
  list in `audit-pages.js` that is missing blockchain. All must be repointed at
  `data/roles.js` in the same change.
- **`engineers.js` has a record with an undefined primary role.** The tech roster
  selector tolerates it. A strict role selector may not.
- **The title pattern split may be intentional.** Two pages have shorter titles,
  possibly for SERP truncation. Check before normalizing all 10 at once.

---

## 5. Future structured data ecosystem

These families should not share one giant schema, but they should be aware of one
another. Relationships worth modeling later:

```
Technology <-> Role          already exists, one directional and sparse
Technology <-> Industry      not built
Role <-> Industry            not built
Industry <-> Case Study      not built
Role <-> Career              not built
Technology <-> Career        not built
Resource <-> Technology      not built
Resource <-> Role            not built
```

Audit and document these opportunities. Do not over engineer them now.

## 6. SEMrush and SEO workflow

Preferred order for any new structured family:

```
SEMrush research -> search intent analysis -> competitor research -> content model
  -> structured data design -> internal link strategy -> schema strategy
  -> template -> content -> generation -> QA
```

Technologies followed a version of this. `data-keywords.csv` holds
`technology, category, hire_developers_volume, keyword_difficulty, opportunity_score, tier`
for 65 rows, and it seeds `keyword.volume`, `keyword.difficulty`, and `priority`.

Roles did not. Industries and Careers must.

Do not fabricate SEMrush results. Where research has not been run, record what should
be researched rather than inventing numbers. Research still needed:

- Role keyword data, to seed `role.keyword` in the v2 model.
- Industry keyword and intent research, before any `/industries/` content model.
- Careers keyword research, plus a review of whether job pages should target search
  at all or exist purely for applicants.
- Resource and glossary term research for Phase 2.
