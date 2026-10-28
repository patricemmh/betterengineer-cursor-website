# Redirect Plan

Every URL change gets recorded here **before** it happens, with the reason.

Default policy: **preserve the existing public URL.** Do not change a slug casually.
The goal is to replace the HubSpot rendered page with the new implementation while
keeping its SEO value.

Last updated: 2026-08-07

---

## 1. Hosting context

| Host | Serves | State |
| --- | --- | --- |
| `www.betterengineer.com` | The legacy HubSpot site | Live, all Phase 1 pages |
| `discover.betterengineer.com` | This repository, GitHub Pages from `gh-pages` | Live: `/aimanufacturing/`, `/ai-fluent-engineers/`, `/roles/`, `/technologies/`. Root redirects to `www` |
| `blog.betterengineer.com` | HubSpot blog | Live, out of scope |
| `app.betterengineer.com` | Product | Live, out of scope |

**Decision (2026-08-07): build for a `www` cutover.** Migrated pages are built at
their existing paths, canonical to `www`, and kept out of the discover sitemap and
marked `noindex` until cutover. That means:

- No redirect is required for any Phase 1 page, because no slug changes.
- At cutover, `www` is repointed at this build and `noindex` is removed.
- Redirects only become necessary for pages whose slug we deliberately change, all
  of which are in later phases.

## 2. Phase 1 — no URL changes

| Page | Old URL | New URL | Reason | Redirect required |
| --- | --- | --- | --- | --- |
| Staff Augmentation | `/staff-augmentation` | `/staff-augmentation/` | Unchanged | No |
| AI Readiness | `/ai-readiness` | `/ai-readiness/` | Unchanged | No |
| Hiring Dashboard | `/hiring-dashboard` | `/hiring-dashboard/` | Unchanged | No |
| About | `/about` | `/about/` | Unchanged | No |
| LATAM Engineer | `/latamengineer` | `/latamengineer/` | Unchanged | No |
| Contact | `/contact` | `/contact/` | Unchanged | No |
| Join Us | `/join` | `/join/` | Unchanged | No |

Note on the trailing slash: this build serves directory `index.html` files, so the
canonical form gains a trailing slash. HubSpot currently serves the extensionless
form. At cutover, whatever fronts `www` must either serve both or 301 the non-slash
form to the slash form. **This must not be left to chance.** It affects all seven
pages plus every future migrated page.

Action: confirm the cutover host's trailing slash behavior before go live. If it
cannot normalize, build the pages as `staff-augmentation.html` style files instead
and keep the extensionless URL. `build-pages.js` already writes both a directory
index and a flat `.html` file for the two existing landing pages, so both options
are supported today.

## 3. Candidate URL changes, later phases

None of these are approved. Each needs a decision and a 301 if actioned.

| Page | Old URL | Proposed URL | Reason | Redirect required | Phase | Status |
| --- | --- | --- | --- | --- | --- | --- |
| FAQs | `/faqs-nearshore-software-engineers-staff-augmentation-ai-talent` | `/faqs/` | 61 character keyword stuffed slug | Yes, 301 | 2 | Not approved |
| Privacy Policy | `/resource-center/wpautoterms/privacy-policy` | `/privacy-policy/` | WordPress plugin artifact, and `resource-center` now belongs to the blog subdomain | Yes, 301 | 4 | Not approved |
| FinTech | `/fintech` | `/industries/fintech/` | Industries becomes a structured page family | Yes, 301 | 8 | Not approved |
| MarTech | `/martech` | `/industries/martech/` | Same | Yes, 301 | 8 | Not approved |
| HealthTech | `/healthtech` | `/industries/healthtech/` | Same | Yes, 301 | 8 | Not approved |
| Multi step contact | `/multi-step-contact-form` | `/contact/` or unchanged | Two competing contact entry points, see CF-36 | Depends | 5 | Not approved |

Weigh each of these carefully. A cleaner slug is worth very little compared to the
ranking risk of moving an indexed page. The default answer is no.

## 4. Existing redirects already in the build

`build-discover-dist.js` and `build-pages.js` already emit these. They are case
sensitivity workarounds for GitHub Pages, not SEO redirects.

| From | To | Type |
| --- | --- | --- |
| `discover.betterengineer.com/` | `https://www.betterengineer.com/` | Meta refresh plus `location.replace`, with a canonical |
| `/AIManufacturing/`, `/Aimanufacturing/` | `/aimanufacturing/` | Meta refresh plus canonical |
| `/AI-Fluent-Engineers/`, `/Ai-Fluent-Engineers/` | `/ai-fluent-engineers/` | Meta refresh plus canonical. Not generated on Windows, where the folder names collide |

Two notes:

1. These are client side meta refreshes, not 301s. They pass some signal but not as
   cleanly as a server redirect. If the cutover host supports real redirects, replace
   them.
2. The Windows exclusion means the case alias folders are missing from any local
   Windows build. They are generated in CI on Linux. Do not be surprised when a local
   `dist/` differs from the deployed one.

## 5. Historic URLs to keep an eye on

Recorded in `GITHUB_PAGES_DISCOVER_HOSTING.md`:

- `lp.betterengineer.com` and paths under `/betterengineer-cursor-website/` served
  earlier deploys and no longer resolve to this site. Any surviving bookmarks, ad
  destinations, or email links pointing there are broken.
- Check ad platforms and email templates for these before the cutover.

## 6. Cutover checklist

When `www` is repointed at this build:

1. Confirm trailing slash normalization on the new host.
2. Remove the `noindex` directive from every migrated page.
3. Add every migrated page to the sitemap.
4. Confirm every canonical still reads `https://www.betterengineer.com/<path>`.
5. Update `build-discover-dist.js` so migrated pages are no longer excluded from
   `sitemap.xml` and `llms.txt`.
6. Switch every internal link that still points at an absolute
   `https://www.betterengineer.com/...` URL to a root relative path, for pages that
   now exist locally.
7. Re-submit the sitemap in Search Console and watch coverage for two weeks.
8. Run `npm run monitor:live`.
9. Verify HubSpot forms still receive submissions and that CRM workflows fire. See
   CF-57, which is the highest risk item in the whole cutover.
