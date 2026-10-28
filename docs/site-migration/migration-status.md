# Migration Status

Update this file continuously. It is the permanent record of migration state.

Status values: `NOT STARTED` | `AUDITING` | `EXTRACTED` | `IN PROGRESS` | `BUILT` |
`QA NEEDED` | `BLOCKED` | `COMPLETE`

Last updated: 2026-09-09 (Phases 1-8 plus remaining sitemap conversion pages are local/noindex. Roles/tech remain live on discover.)

---

## Phase 1 — Core company and conversion pages

| Page | Legacy URL | New URL | Extracted | Assets Local | Built | Responsive QA | Content QA | SEO QA | Integration QA | Status | Follow-Up |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Staff Augmentation | /staff-augmentation | /staff-augmentation/ | Yes | Yes | Yes | Mobile 375 checked | Yes | Yes | n/a | BUILT | Contradictory cost claims (CF-03) |
| AI Readiness | /ai-readiness | /ai-readiness/ | Yes | Yes | Yes | Pending | Yes | Yes | Blocked | BUILT | Whitepaper download mechanism unconfirmed (CF-55) |
| Hiring Dashboard | /hiring-dashboard | /hiring-dashboard/ | Yes | Yes | Yes | Pending | Yes | Yes | n/a | BUILT | Em dashes replaced with commas (CF-06), duplicate H1/H2 (CF-08) |
| About | /about | /about/ | Yes | Yes | Yes | Mobile 375 checked | Yes | Yes | n/a | BUILT | Em dashes replaced (CF-05), section 2 has no body copy (CF-24) |
| LATAM Engineer | /latamengineer | /latamengineer/ | Yes | Yes | Yes | Pending | Yes | Yes | n/a | BUILT | Duplicate time-zone section deleted (CF-01) |
| Contact | /contact | /contact/ | Yes | Yes | Yes | Pending | Yes | Yes | BLOCKED | QA NEEDED | Form fields unconfirmed (CF-56), HubSpot workflow routing (CF-57) |
| Join Us | /join | /join/ | Yes | Yes | Yes | Mobile 375 checked | Yes | Yes | n/a | BUILT | Duplicate AI-Enabled Mindset card deleted (CF-02) |

### Phase 1 build notes

All seven fragments are built and pass `node tools/verify-migrated-pages.js` with
zero failures. The only warnings are referenced images that are not on disk yet.

**Assets are localized.** All 121 images were downloaded with
`node tools/fetch-migration-assets.js` and now live under `/images/pages/<slug>/` and
`/icons/join/`. `npm run verify:migrated` reports **0 failures and 0 warnings**, which
includes an on-disk existence check for every referenced asset. Nothing on any page
still points at a HubSpot `hubfs` or `hs-fs` URL.

Counts per page: staff-augmentation 40, join 28 (plus 6 icons in `/icons/join/`),
hiring-dashboard 12, ai-readiness 11, about 10, latamengineer 8, contact 6.

Re-run the fetcher any time with `--force` to refresh, or `--page=<slug>` for one page.

**Responsive QA:** 375px overflow and hamburger menu checked on staff-augmentation,
about, FAQs, join, plus the roles and technologies hubs and a sample tech page
(Python). No horizontal scroll. Tablet, laptop, and large desktop, and the remaining
migrated pages, are still pending.

**Content QA passed.** Every substantive string in section 2 of each extraction
record appears in the built page. The only deliberate deviations are recorded inline
as `<!-- MIGRATION ... -->` comments in the fragments:

- em dash characters replaced with commas, wording unchanged (CF-05, CF-06, CF-07)
- heading levels corrected where the source skipped or duplicated them (structure,
  not copy)
- process step numerals rendered as text instead of images of digits (SEO-08)
- blog feeds rendered static from the extraction snapshot (CF-54)
- an FAQ eyebrow label added on each page for parity with the canonical component (CF-58)

**The FAQ is now a canonical component.** It was rebuilt to match the technology pages
exactly: styles consolidated into `styles/brand.css`, the competing boxed-card rules
removed from `styles/landing-page.css`, `page.js` brought to behavioral parity with
`air-page.js`, and the markup contract enforced by `tools/verify-migrated-pages.js`.
See `component-pattern-inventory.md` section 4.9.

## Phase 2 — Resource and educational pages

| Page | Legacy URL | New URL | Extracted | Assets Local | Built | Responsive QA | Content QA | SEO QA | Integration QA | Status | Follow-Up |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| FAQs | /faqs-nearshore-software-engineers-staff-augmentation-ai-talent | (unchanged) | Yes | Yes | Yes | Mobile 375 checked | Yes | Yes | n/a | BUILT | 53 questions, 44 duplicated from Phase 1 pages (SEO-12). CF-66 hs_preview stripped. |
| Podcast | /podcast | /podcast/ | Yes | n/a | Yes | Pending | Yes | Yes | BLOCKED | BUILT | Audio player could not be captured (CF-61) |
| Ebooks | /ebooks | /ebooks/ | Yes | Pending fetch | Yes | Pending | Yes | Yes | n/a | BUILT | Both downloads ungated; gating is a business decision (CF-62) |
| Technical Glossary | /technical-glossary | /technical-glossary/ | Yes | n/a | Yes | Pending | Yes | Yes | n/a | BUILT | Data driven. Two live content defects preserved (CF-63, CF-64) |

### Phase 2 build notes

All four pages pass `node tools/verify-migrated-pages.js` with 0 failures.

**The glossary became a data-driven family.** 71 terms live in `data/glossary.js` and
`build-glossary.js` generates `main-technical-glossary.html`, which `build-pages.js`
then wraps. That earns its keep: build-time alphabetical sorting, letter grouping, a
generated jump nav, duplicate detection, 24 generated cross-links into the technology
and role pages, and `DefinedTermSet` schema built from the same records that render the
page. The live page has none of that, just 71 flat H2s with zero links.

The generator's duplicate detector independently caught both live content defects on
its first run, which is the argument for the approach in one line.

**The FAQ page is now the canonical FAQPage.** 44 of its 53 questions also appear on a
Phase 1 page. It carries `faqSchema: true`; whether the Phase 1 pages should keep
theirs is SEO-12 and still open.

**New in the design system:** `.jump-nav`, a grouped FAQ variant (`.faq-group`), a
`.resource-grid`, and the glossary components. All in `styles/landing-page.css`, all
added to the verifier's allowed class list.

**Two pages carry no images at all** (podcast, ebooks) because the live pages have
none. Ebooks in particular is a page whose whole job is distributing free assets and it
has no cover art and no `og:image`.

## Phase 3 — Case studies

| Page | Legacy URL | New URL | Extracted | Assets Local | Built | Responsive QA | Content QA | SEO QA | Integration QA | Status | Follow-Up |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Live CGI | /case-studies/livecgi | /case-studies/livecgi/ | Yes | Fetching | Yes | Pending | Yes | Pending | n/a | BUILT | Live "Productvity" typo preserved |
| WastePlace | /case-studies/wasteplace | /case-studies/wasteplace/ | Yes | Fetching | Yes | Pending | Yes | Pending | n/a | BUILT | |
| SecureLink | /case-studies/securelink | /case-studies/securelink/ | Yes | Fetching | Yes | Pending | Yes | Pending | n/a | BUILT | Live HubSpot reuses WastePlace stat numbers; preserved |

## Phase 4 — Legal

| Page | Legacy URL | New URL | Extracted | Assets Local | Built | Responsive QA | Content QA | SEO QA | Integration QA | Status | Follow-Up |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Privacy Policy | /resource-center/wpautoterms/privacy-policy | (unchanged) | Yes | n/a | Yes | Pending | Yes | n/a | n/a | BUILT | WordPress-era slug kept |
| Terms of Service | /terms-of-service | /terms-of-service/ | Yes | n/a | Yes | Pending | Yes | n/a | n/a | BUILT | Placeholder mailing address still on live copy |

## Phase 5 — Multi-step hire form

| Page | Legacy URL | New URL | Extracted | Assets Local | Built | Responsive QA | Content QA | SEO QA | Integration QA | Status | Follow-Up |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Hire wizard | /multi-step-contact-form | /multi-step-contact-form/ | Yes | n/a | Yes | Pending | Yes | noindex | BLOCKED | BUILT | Confirm workflows on form d43da6a3... (CF-57). Timing step is new; stored in hiring_needs. |

## Remaining HubSpot pages from the live sitemap

| Page | Legacy URL | New URL | Built | Status | Follow-Up |
| --- | --- | --- | --- | --- | --- |
| Webinar | /webinar | /webinar/ | Yes | BUILT | Live title is "Webinar"; description was empty, written locally |
| AI Webinar | /aiwebinar | /aiwebinar/ | Yes | BUILT | Session topics were an image on live; transcribed from alt |
| R&D ROI | /roi | /roi/ | Yes | BUILT | 46% savings claim is live copy, preserved |
| You've got an LLM | /youvegotllm | /youvegotllm/ | Yes | BUILT | Ungated PDF, same file as /ebooks/ |
| Hire in 72 hours | /hire-software-engineers-in-72-hours | unchanged | Yes | BUILT | Live form GUID 4431ddc0, same as contact |
| hiring-dashboard-old | /hiring-dashboard-old | redirect /hiring-dashboard/ | Redirect planned | REDIRECT | |
| Competing landings | /hire-senior-*-nearshore-latam-talent, /ai-readiness-manufacturing | 301 to discover | No page | YOUR TODO | Do not unpublish until 301s are live |

## Phase 6 — Careers

| Page | Legacy URL | New URL | Extracted | Assets Local | Built | Responsive QA | Content QA | SEO QA | Integration QA | Status | Follow-Up |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Careers hub | /careers | /careers/ | Yes | Reuses join map | Yes | Pending | Yes | JobPosting on jobs | n/a | BUILT | 39 jobs from live sitemap |
| Job pages | /careers/{slug} | /careers/{slug}/ | Yes | n/a | Yes | Pending | Yes | JobPosting | Apply CTA to app | BUILT | Shared JD duties; unique requirements from live |
| careers-test | /careers-test | redirect /careers/ | n/a | n/a | Redirect planned | n/a | n/a | n/a | n/a | REDIRECT | Do not ship as a real page |

## Future phases

| Workstream | Legacy URLs | Status | Notes |
| --- | --- | --- | --- |
| Roles v2 | /roles/* (already on discover) | DOCUMENTED | Full refactor plan in `structured-data-inventory.md`. |
| Industries | /fintech, /martech, /healthtech, /industries | BUILT | Data family in `data/industries.js`. Live root slugs kept. Hub added at `/industries/` for expansion. Semrush: FinTech ranks for "fintech engineers" (pos 5). |

## Already migrated (pre-existing, for reference)

| Page | URL | Status | Notes |
| --- | --- | --- | --- |
| Home | / (repo `index.html`) | COMPLETE | Built from `main-home.html`. Not published to www yet |
| Hire AI-Ready Engineers | discover.betterengineer.com/ai-fluent-engineers/ | COMPLETE | Live |
| AI Systems Readiness for Manufacturing | discover.betterengineer.com/aimanufacturing/ | COMPLETE | Live |
| Roles (11 pages) | discover.betterengineer.com/roles/ | COMPLETE | Live. Schema/OG/hub CollectionPage patched in repo 2026-09-08; live after next discover deploy. Roles v2 generator still deferred. |
| Technologies (59 pages) | discover.betterengineer.com/technologies/ | COMPLETE | Live. Hub now cross-links to roles. Template URLs stubbed in dist builder, live after next discover deploy. |
