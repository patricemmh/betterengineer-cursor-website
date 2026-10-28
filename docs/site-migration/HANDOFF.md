# Handoff — where the migration stands

Updated 2026-09-08. Read this first. Older 2026-08-07 notes below are still true
except where this file says they are done.

---

## Do not ship migrated HubSpot pages

Eleven rebuilt marketing pages stay local, `noindex, follow`, and out of the
discover bundle (`--no-migrated`). Do not clear `PRE_CUTOVER_ROBOTS`. Do not
repoint `www`. A discover deploy is separate and does not publish those pages.

Preview everything at `http://localhost:4323/` and `http://localhost:4323/preview/`.

---

## What is already true for Google (roles and technologies)

Live on `discover.betterengineer.com` today:

- 10 role pages plus `/roles/`
- 58 technology pages plus `/technologies/`
- Canonicals on discover, no `noindex` on real pages
- Sitemap: `https://discover.betterengineer.com/sitemap.xml` (72 URLs)
- HubSpot already 301s `www.../roles/` and `/technologies/` (including nested) to discover

Traffic is still near zero. That is expected for pages that went live mid-August.
Indexing is a Search Console job, not a missing HTML file.

---

## Done in the repo, waiting on the next discover deploy

These are in source and in a local `dist/` build. Live discover will not show them
until CI publishes. Migrated marketing pages still stay out of that bundle.

| Item | What changes on discover after deploy |
| --- | --- |
| TD-04 templates | `/roles/roles-template/` and `/technologies/tech-template/` become short `noindex` stubs that canonical and refresh to the hubs. `robots.txt` Disallow those two paths. They stay out of the sitemap. |
| Role schema | Front-end and blockchain now emit Organization + Service + BreadcrumbList + FAQPage, matching the other eight roles. |
| Roles hub | Organization, BreadcrumbList, CollectionPage ItemList of all 10 roles, plus `og:image` / Twitter card. Hero links to `/technologies/`. |
| Tech hub | Hero links to `/roles/`. |
| Footer | Technical Glossary sits next to Podcast on migrated pages and on role/tech chrome. Live destination remains `www.../technical-glossary` until cutover. |
| Mobile overflow | `.person-grid` is one column under 480px. Role cards use `minmax(min(100%, 280px), 1fr)`. Checked at 375px with no horizontal scroll on staff-augmentation, about, FAQs, join, `/roles/`, `/technologies/`, and Python. |

Idempotent role patcher: `tools/patch-role-indexability.js`. Dist stubs:
`writeNoindexStub` in `build-discover-dist.js`. Verifiers now fail if template stubs
or required role JSON-LD regress.

---

## Your list (nothing here can be finished in this repo)

This is the remaining work. Everything else is either done or deferred on purpose.

### 1. Publish the discover bundle (when you want Google to see the SEO fixes)

Push or run the existing discover CI. That is the only way template stubs, role
schema, hub CollectionPage, and hub cross-links go live. It does **not** put the
eleven rebuilt HubSpot pages on the internet.

### 2. Google Search Console (about 10 minutes)

- Confirm a property for **discover.betterengineer.com** (URL-prefix or domain).
- Submit `https://discover.betterengineer.com/sitemap.xml`.
- Request indexing on `/roles/` and `/technologies/`.

Until that happens, Google can still find the pages through HubSpot 301s, but the
sitemap and Inspection UI will not be on our side.

### 3. HubSpot 301s for competing landings (still 200, self-canonical)

These still 200 and self-canonicalize. They are HubSpot pages. This Cloudflare
account does not host betterengineer.com, so they cannot be redirected from here.

Exact mapping to paste in HubSpot (Settings → Domains & URLs → URL Redirects,
301 permanent):

| From (www) | To |
| --- | --- |
| `/hire-senior-python-engineers-nearshore-latam-talent` | `https://discover.betterengineer.com/technologies/python-developers/` |
| `/hire-senior-full-stack-engineers-nearshore-latam-talent` | `https://discover.betterengineer.com/roles/full-stack-engineers/` |
| `/hire-senior-ai-data-engineers-nearshore-latam-talent` | `https://discover.betterengineer.com/roles/ai-engineers/` |
| `/hire-software-engineers-in-72-hours` | `https://discover.betterengineer.com/roles/` |
| `/ai-readiness-manufacturing` | `https://discover.betterengineer.com/aimanufacturing/` |

### 4. One approved savings figure and one delivery-speed claim

Still contradictory across pages, all unsourced:

- Savings: 42.8%, 30 to 50%, 50 to 70% time-to-hire, up to 50%
- Speed: 72 hours vs within four days

Once you send the pair, they get applied everywhere and recorded in `COPY_BRIEF.md`.
Until then, do not invent a number.

### 5. Contact form (highest cutover risk, not a Google-for-roles issue)

- **CF-56:** real field list (HubSpot injects the form with JavaScript).
- **CF-57:** HubSpot workflow routing. An API post does not inherit the legacy form
  GUID workflows.

### 6. Confirm the live URL inventory

`data/live-url-inventory.js` is still `verified: false`. Export HubSpot pages plus
GSC indexed URLs before any www cutover. Cutting over today would 404 about 17 live
URLs (careers, case studies, legal, industries, multi-step contact).

### 7. Glossary QA Engineer definition (CF-63)

The live site publishes Python's definition on that term. A replacement is drafted
in `data/glossary.js` with a `note`. Needs sign-off.

---

## Built locally 2026-09-09 (still noindex, not on discover)

Phases 3 to 8 now have pages in this repo. Preview them at `http://localhost:4323/preview/`. They stay `noindex` and out of the discover bundle.

- Phase 3: Live CGI, WastePlace, SecureLink
- Phase 4: Privacy Policy (WordPress-era slug kept) and Terms of Service
- Phase 5: new 4-step hire form at `/multi-step-contact-form/`
- Phase 6: careers hub plus 39 job pages from the live HubSpot set
- Phase 8: `/industries/` hub plus `/fintech`, `/martech`, `/healthtech` (expandable via `data/industries.js`)

## Intentionally still later

- Roles v2 generator
- Exhaustive tablet and desktop QA on every migrated page
- FW-01 ebook HTML pages, FW-03 podcast transcripts
- Deploying the intake Worker change (`localhost:4323` origin) until you choose to publish that Worker

---

## Closed since the 2026-08-07 handoff (no longer blocking)

- Blog RSS URL: wired. `build-blog-feed.js` fetches HubSpot Resource Center feeds.
- CF-01 LATAM duplicate time-zone section: deleted.
- CF-02 Join Us duplicate "AI-Enabled Mindset" card: deleted (was marked done, still
  in the fragment until 2026-09-08).
- CF-42 / SEO-17: Technical Glossary in `footer-full.html`.
- CF-66: leaked `hs_preview` stripped from the FAQs self-registration link.
- Contact logo `width`/`height` warnings: gone.
- Phase 1 and 2 assets: localized. `npm run verify:migrated` is 0 failures, 0 warnings.

Friday 2026-08-07 decisions in `content-followups.md` section 10 still stand.

---

## Things that will still bite at www cutover

- Trailing slashes: this build serves `/about/`; HubSpot serves `/about`.
- Turnstile site key and intake Worker origins are domain scoped.
- Hiring dashboard MP4 is 12.5 MB: `videos/pages/hiring-dashboard/better-engineer-dashboard.mp4`. Git skips it unless added explicitly.
- Header CTA points at `/multi-step-contact-form`, which is now built locally. Confirm HubSpot workflows on form `d43da6a3-79aa-45d4-99be-0d1e8162daf7` before cutover.

---

## How to resume

```bash
cd "C:\Users\patri\Dropbox\Web Design\Better Engineer\betterengineer-cursor-website"
npm run build
npm run verify
npm start                    # http://localhost:4323/  and  /preview/
```

Then this file, then `docs/site-migration/README.md`.
