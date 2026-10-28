# SEO Follow-Ups

Technical SEO findings from the Phase 1 extraction, plus items that need attention
later. Preserving rankings is the priority. Nothing here justifies rewriting approved
copy.

Last updated: 2026-09-08

---

## 1. Preserved on every migrated page

The build must carry these forward from the live page, unchanged unless noted:

- `<title>` exactly as live
- `<meta name="description">` exactly as live
- `<link rel="canonical">` pointing at `https://www.betterengineer.com/<path>`
- H1 text and heading hierarchy
- The public URL slug
- Every existing internal link destination

## 2. Fixed during migration (safe technical improvements, no copy change)

These are gaps on the live HubSpot pages that the rebuild closes. None of them touch
wording.

| ID | Issue | Pages affected | Fix |
| --- | --- | --- | --- |
| SEO-01 | **No JSON-LD anywhere.** Not one Phase 1 page emits structured data, despite FAQ blocks of 6 to 14 questions. | All 7 | Emit `Organization`, `BreadcrumbList`, `WebPage`, and `FAQPage` where an FAQ exists, plus `Service` on the two service pages. FAQ JSON-LD text must match visible text exactly, as enforced for technology pages. |
| SEO-02 | **No `og:image`.** | All 7 | Add a shared OG image, matching the technology page constant. |
| SEO-03 | **No `og:type`.** | Staff Augmentation, LATAM, and others | Add `website`. |
| SEO-04 | **No `twitter:card` / `twitter:image`.** | Staff Augmentation, LATAM (which uses `summary`, not `summary_large_image`) | Add `summary_large_image` plus title, description, image. |
| SEO-05 | **No robots meta tag.** | All 7 | Add explicit directives. Migrated pages get `noindex, follow` until the www cutover, then it is removed. |
| SEO-06 | **Broken heading hierarchy.** Two H1s on About. H4 above H3 on Join Us and About. FAQ headings at H3 while siblings are H2. No H2 at all on Contact. | About, Join Us, LATAM, Contact | Correct the levels. Structural only, text unchanged. |
| SEO-07 | **Missing or junk alt text.** 6 images with no alt on Staff Augmentation, 5 unlabeled logos on Contact, all 5 icons unlabeled on LATAM, 8 of 11 filename-derived on About, 9 machine generated on Hiring Dashboard. Includes "Frame 2", "Artboard – 1", "1-white", "react (2)", and a hero whose alt literally reads "Stock placeholder image". | All 7 | Write real descriptive alt text during asset localization. Record it in each extraction record's asset table. |
| SEO-08 | **Numerals rendered as images.** Process step numbers 1 to 4 are pictures of digits. | Staff Augmentation, Hiring Dashboard, AI Readiness, Join Us | Render as text using `.process-step__num`. |
| SEO-09 | **Non-descriptive anchors.** Repeated bare "Read more" links in blog feeds, and repeated "Learn More". | AI Readiness, LATAM, Join Us, Staff Augmentation | Give each a descriptive accessible name. |
| SEO-10 | **All images served through HubSpot's `/hs-fs/` resizer or `/hubfs/`.** Every asset is a third party request against a domain we are migrating off. | All 7 | Localize into `/images/pages/<slug>/`. |
| SEO-11 | **No `lastmod` / freshness signal.** | All 7 | `WebPage` schema carries `datePublished` and `dateModified`. |

## 3. Needs a decision, not yet actioned

| ID | Issue | Notes |
| --- | --- | --- |
| SEO-12 | **FAQ content is heavily duplicated across pages.** Staff Augmentation has 14 questions, LATAM has 13, Hiring Dashboard has 12, Contact has 8, About has 8, Join Us has 6, AI Readiness has 6, and a separate `/faqs-...` page exists as well. Several answers overlap substantially. | **Decided 2026-08-07:** `FAQPage` schema only on `/faqs-...`. Visible accordions stay on every page. |
| SEO-13 | **The `/faqs-nearshore-software-engineers-staff-augmentation-ai-talent` slug is 61 characters of keyword stuffing.** | Phase 2. Changing it costs the existing rankings and needs a 301. See `redirect-plan.md`. |
| SEO-14 | **The Privacy Policy lives at `/resource-center/wpautoterms/privacy-policy`.** A WordPress plugin artifact under a `resource-center` path that now belongs to the blog subdomain. | Phase 4. Redirect required if moved. |
| SEO-15 | **Title and H1 target different keywords on LATAM Engineer.** | Fixing this means changing the title tag, which changes SERP snippets. Needs sign off. |
| SEO-16 | **AI Readiness title tag omits the product name.** "Accelerate Your Business with Expert AI Strategy" does not contain "AI Readiness Assessment". | Same class of decision as SEO-15. |
| SEO-17 | **`/technical-glossary` is not linked from the local `footer-full.html`** although the live footer links it. | **Done 2026-09-08.** Link is in `footer-full.html` and role/tech chrome. Destination stays `www` until cutover. |
| SEO-18 | **Blog feeds are the main internal link path to `blog.betterengineer.com`.** If they become static or are dropped, that link equity path changes. | **Wired.** `build-blog-feed.js` fetches HubSpot RSS at build time. |

## 4. Internal link audit

Current state after Phase 1 extraction:

- Every Phase 1 page links to the same 23 to 25 shared chrome destinations from the
  header and footer.
- Header and footer already point at `discover.betterengineer.com/roles/` and
  `/technologies/`, so the new page families are linked from the legacy site.
- Nothing on the legacy site links to `/services/hire-ai-ready-engineers/` or
  `/services/ai-systems-readiness-for-manufacturing/` except the AI Fluency nav item.
- No links were found from Phase 1 pages to case studies except the WastePlace logo
  on the home page.
- Industries pages (`/fintech`, `/martech`, `/healthtech`) are linked only from the
  footer.

Rules while migrating:

1. Links to pages that have not migrated yet stay pointed at `www.betterengineer.com`
   and are logged as a dependency.
2. Once both pages exist locally, switch to a root relative path.
3. Never use an absolute `https://www.betterengineer.com/...` URL for a page that
   exists locally. That is the single easiest way to leak link equity off the new build.
4. Re-run `node tools/verify-links.js --assets` after every batch.

Dependencies currently outstanding, meaning a Phase 1 page links to something not
yet migrated:

| From | To | Status |
| --- | --- | --- |
| All 7 | `/multi-step-contact-form` | Phase 5, stays absolute |
| All 7 | `/careers`, `/careers/*` | Phase 6, stays absolute |
| All 7 | `/fintech`, `/martech`, `/healthtech` | Phase 8, stays absolute |
| All 7 | `/case-studies/livecgi`, `/case-studies/wasteplace` | Phase 3, stays absolute |
| All 7 | `/podcast`, `/ebooks`, `/faqs-...`, `/technical-glossary` | Phase 2, stays absolute |
| All 7 | `/resource-center/wpautoterms/privacy-policy`, `/terms-of-service` | Phase 4, stays absolute |
| Staff Augmentation, Home | `/hiring-dashboard`, `/ai-readiness`, `/about`, `/latamengineer`, `/contact` | **Phase 1. Switch to root relative once all seven are built.** |

## 5. Verification to add

Technology pages are protected by `tools/verify-tech-data.js`. Migrated marketing
pages currently have only `tools/verify-site.js`, which is 583 bytes.

Add a `tools/verify-migrated-pages.js` that asserts, per page:

- exactly one H1
- no em dash character anywhere
- title, description, and canonical present and matching `data/pages.js`
- `og:title`, `og:description`, `og:image`, `og:type`, `twitter:card` present
- robots directive present and matching the pre-cutover policy
- every JSON-LD block parses
- FAQ JSON-LD questions and answers match the visible FAQ text in order
- every `<img>` has non-empty alt, plus `width`, `height`, and `loading`
- every root relative asset path resolves to a real file
- no `hubfs` or `hs-fs` URL survives anywhere in the output

Wire it into `npm run verify` so CI blocks regressions.

## 6. Phase 2 additions

| ID | Item | Status |
| --- | --- | --- |
| SEO-12 (update) | The overlap is worse than estimated: **44 of the FAQ page's 53 questions also appear on a Phase 1 page.** Three whole categories are wholesale copies: all 6 AI Readiness questions, 11 of 12 Hiring Dashboard questions, and all 6 Join Us questions. | The FAQ page now carries `faqSchema: true` and is the intended canonical home. **Decision still open:** whether to drop `FAQPage` from the Phase 1 pages, keep it everywhere and accept the duplication, or trim the Phase 1 FAQ blocks to only page-specific questions. The last option means editing approved copy. |
| SEO-19 | The glossary now emits `DefinedTermSet` with 71 `DefinedTerm` nodes, each with its own anchor URL, generated from the same data that renders the page. | Done |
| SEO-20 | The glossary gained 24 internal links into the technology and role pages, where the live page had zero. 47 terms have no confident match; more could be added by hand in `data/glossary.js`. | Partially done |
| SEO-21 | `PodcastSeries` / `PodcastEpisode` schema is not emitted. It needs artwork, a feed URL, publish dates, and durations, none of which exist on the live page. | Blocked on content |
| SEO-22 | The ebooks page has no `og:image` and no cover art, on a page whose entire job is social distribution of free assets. | Open |
| SEO-23 | The FAQ page's 53 answers contain only 7 links, and no answer links to its matching service page. Large missed internal-linking opportunity. | Open |
