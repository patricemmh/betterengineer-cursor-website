# Pre-Deploy Checklist

**This is the gate. Nothing ships until it passes.**

Every item deferred during the migration is enumerated here, traced back to the
document that raised it. If it is not on this list, it is not a blocker. If it is on
this list and unchecked, it is.

Run the gate:

```bash
node tools/preflight.js                  # publishing the discover bundle
node tools/preflight.js --stage=cutover  # repointing www at this build
node tools/preflight.js --list           # outstanding items only, no checks
```

`preflight.js` runs every automated verifier, scans the build for unresolved markers,
then reads this file and fails on any unchecked item in a gate that applies to the
stage. It exits non-zero. Wire it into CI before the deploy job if you want it
enforced rather than remembered.

**To waive an item:** check the box and append `WAIVED: <reason> (<name>, <date>)`.
A waiver is a decision on the record, not a way to make the list shorter.

Section markers control the gate:

| Marker | Meaning |
| --- | --- |
| `<!-- preflight: hard -->` | Blocks every deploy, at any stage |
| `<!-- preflight: cutover -->` | Blocks the www cutover only |
| `<!-- preflight: advisory -->` | Reported, never blocks |

Last updated: 2026-09-08

---

## The two deploys are different

**Deploy A, discover bundle.** Publishing `discover.betterengineer.com` from CI. Low
risk: migrated pages are excluded, `www` is untouched. Gate: the `hard` sections only.

**Deploy B, the www cutover.** Repointing `www.betterengineer.com` at this build. This
replaces the entire HubSpot site in one move. Gate: everything.

The single largest risk in Deploy B is not any page we built. It is the pages we have
**not** built. `www` currently serves at least 31 URLs. Fourteen of them exist here.
Cutting over today would 404 the other 17, including every careers page, both case
studies, both legal pages, all three industry pages, and the multi-step contact form
that the primary header CTA points at on every single page of the site.

That is what section 2 is for.

---

<!-- preflight: hard -->
## 1. Build integrity

Automated. `preflight.js` runs these; the boxes are here so a human confirms they were
run against the real tree and not a stale copy.

- [ ] `npm run build` completes with no em dash error
- [ ] `npm run verify` passes (site, technology data, migrated pages, links and assets)
- [ ] `node tools/verify-migrated-pages.js` reports 0 failures and 0 warnings
- [ ] No `hubfs` or `hs-fs` URL survives anywhere in built output
- [ ] Every migrated page carries `noindex, follow` while `www` is still HubSpot
- [ ] `build-discover-dist.js` passes `--no-migrated`, and `dist/sitemap.xml` does not list any migrated page
- [ ] `git status` is clean and the branch is not `main` (per repo convention, branch before committing)

---

<!-- preflight: cutover -->
## 2. URL coverage, the cutover blocker

Source: `redirect-plan.md`, `data/live-url-inventory.js`.

Nothing else in this document matters if this section is incomplete. A missing URL is
an instant 404 on a page that currently ranks.

- [ ] Export every page from HubSpot: Content > Website Pages **and** Landing Pages
- [ ] Export every indexed URL from Google Search Console: Indexing > Pages
- [ ] Fetch `https://www.betterengineer.com/sitemap.xml` and extract every `<loc>`
- [ ] Union all three sources, dedupe, and reconcile into `data/live-url-inventory.js`
- [ ] Set `verified: true` in `data/live-url-inventory.js`
- [ ] Every entry has status `built` or `redirect`. Zero entries remain `pending`
- [x] Phase 2 built: FAQs, podcast, ebooks, technical glossary
- [ ] Phase 3 built: both case studies
- [ ] Phase 4 built: privacy policy, terms of service, legal language byte-identical
- [ ] Phase 5 resolved: `/multi-step-contact-form` built, or redirected, **and** the header CTA on every page repointed
- [ ] Phase 6 resolved: `/careers` and every job page built or redirected
- [ ] Phase 8 resolved: `/fintech`, `/martech`, `/healthtech` built or redirected
- [ ] Confirm the cutover host's trailing slash behavior. This build serves `/about/`; HubSpot serves `/about`. The host must serve both or 301 one to the other. Affects every page (`redirect-plan.md` section 2)
- [ ] Every URL change in `redirect-plan.md` section 3 is either approved with a 301 in place, or explicitly not happening
- [ ] Check ad platforms and email templates for links to `lp.betterengineer.com` or `/betterengineer-cursor-website/` paths (`redirect-plan.md` section 5)

---

<!-- preflight: cutover -->
## 3. Content sign-off, visible defects

Source: `content-followups.md` sections 1 and 7. These change what a visitor reads, so
they need a decision before the pages are indexable.

- [x] **CF-01** LATAM: the "Similar Time Zones & Real-Time Collaboration" section appears twice, back to back. Duplicate deleted 2026-08-07
- [x] **CF-02** Join Us: the trait "AI-Enabled Mindset" appears twice with identical copy. Duplicate deleted 2026-09-08
- [ ] **CF-03** Staff Augmentation: contradictory cost claims on one page, "42.8% on average" vs "30-50%"
- [ ] **CF-04** LATAM: inconsistent savings claim, "Save up to 50%" vs "30-50%"
- [x] **CF-05** About: em dash characters in the hero were replaced with commas. Wording is unchanged, but the substitution needs approval. Approved 2026-08-07
- [x] **CF-06** Hiring Dashboard: 4 em dash replacements need approval. Approved 2026-08-07
- [x] **CF-07** Join Us: 5 em dash replacements need approval. Approved 2026-08-07
- [ ] **CF-08** Hiring Dashboard: the H1 and the first H2 are the identical sentence
- [x] **CF-58** All 7 pages: the FAQ eyebrow labels are new copy, not from the source. Approve the wording or supply your own. Approved 2026-08-07
- [ ] Staff Augmentation FAQ items 13 and 14 verified against the live page (flagged inline; the extraction passes disagreed on the count)
- [x] **CF-60** Podcast title and meta description were written, not migrated. Approve or replace. Approved 2026-08-07
- [ ] **CF-63** Glossary: the QA Engineer entry publishes Python's definition. Someone has to write the real one
- [x] **CF-64** Glossary: two byte-identical duplicate entries (Selenium WebDriver / WebDriver). Kept Selenium WebDriver
- [x] **CF-65** Glossary: 5 em dash replacements need approval. Approved 2026-08-07
- [x] **CF-66** FAQs: a production signup link carries a leaked HubSpot preview parameter. Stripped 2026-09-08
- [x] **CF-59** Heading capitalization decision. Migrated pages use Title Case source copy; technology and role pages use sentence case. Convention documented in `DESIGN.md`

---

<!-- preflight: cutover -->
## 4. Integration gate

Source: `content-followups.md` section 6, `component-pattern-inventory.md` 4.12.

**CF-57 is the highest-risk item in the entire migration.** A form that renders
perfectly and silently fails to create a lead is worse than a form that is visibly
broken.

- [ ] **CF-56** Contact: the live HubSpot form's real field list confirmed in the HubSpot Forms UI, and any missing field added to the fragment and the property mapping
- [ ] **CF-57** Every HubSpot workflow, lead-routing rule, and notification attached to the legacy Contact form GUID identified, and re-pointed at the new submission path. **An API submission does not inherit them.**
- [ ] Submit a real test lead from `/contact/` and confirm the contact appears in HubSpot with the correct source, owner, and lifecycle stage
- [ ] Confirm the test lead triggers the same notifications and workflows the legacy form did
- [ ] Cloudflare **Turnstile site key allows `www.betterengineer.com`**. Site keys are domain-scoped; the widget will fail closed on a new hostname
- [ ] The intake Worker at `intake-proxy.patricemmh.workers.dev` accepts requests from the `www` origin (CORS / allowed origins)
- [ ] Test the direct-to-HubSpot fallback path by blocking the Worker, and confirm a lead still lands
- [ ] **CF-55** AI Readiness: the whitepaper download mechanism confirmed, the gated asset located, and the button given a real destination
- [ ] **CF-61** Podcast: verify in a browser whether an audio player is JS-injected. Five extraction passes found only outbound SoundCloud links
- [ ] **CF-62** Ebooks: decide whether the two downloads should be gated. If yes, the PDFs must move, since the current URLs are publicly guessable
- [ ] **CF-54** Blog feed decision made for AI Readiness, LATAM, and Join Us: build-time RSS fetch, curated static list, or drop. Currently a static snapshot from extraction
- [ ] GTM container `GTM-WT77L8JF` firing on every migrated page, verified in Preview mode
- [ ] HubSpot tracking script loading, and `page.js` virtual page views appearing for CTA clicks
- [ ] Calendly, `app.betterengineer.com` sign-up, and sign-in links all resolve
- [ ] `support@betterengineer.com` on Hiring Dashboard confirmed as plain text vs a mailto link (flagged inline)
- [ ] Hiring dashboard walkthrough video is tracked in git: `videos/pages/hiring-dashboard/better-engineer-dashboard.mp4` (~12.5 MB). It is a large binary and will not be picked up by a normal `git add` of HTML/CSS. Without this file, `/hiring-dashboard/` ships a broken player.

---

<!-- preflight: cutover -->
## 5. SEO gate

Source: `seo-followups.md`, `redirect-plan.md` section 6.

- [ ] `PRE_CUTOVER_ROBOTS` cleared in `data/pages.js` so migrated pages are indexable
- [ ] Every migrated page added to the sitemap, and `build-discover-dist.js` no longer excludes them
- [ ] Every canonical reads `https://www.betterengineer.com/<path>` and matches the served URL exactly
- [ ] Rebuild with `INTERNAL_LINKS=local` so internal links to migrated pages become root-relative instead of absolute `www` URLs
- [ ] **SEO-12** FAQ duplication decision made. 44 of the FAQ page's 53 questions also appear on a Phase 1 page. Seven pages carry 6 to 14 questions each, plus a standalone FAQ page, with substantial overlap. Decide which pages emit `FAQPage` before turning them all on
- [ ] Alt text reviewed by a human on all 121 images. It was written during migration because the source alt text was filenames; it has not been reviewed
- [ ] `<img>` width and height corrected against the downloaded files. Several are marked inline as "intrinsic-ratio placeholders taken from the legacy HubSpot rendering" and will cause layout shift if wrong
- [ ] **SEO-15 / SEO-16** decisions on the LATAM title-vs-H1 keyword mismatch and the AI Readiness title omitting the product name. Both change SERP snippets
- [ ] Sitemap submitted in Search Console
- [ ] Search Console coverage watched for two weeks post-cutover

---

<!-- preflight: cutover -->
## 6. Responsive, accessibility, and performance QA

Not automatable. Source: `site-migration-plan.md` section 5, steps 9 to 11.

- [ ] All 7 pages checked at mobile, tablet, laptop, desktop, and large desktop
- [ ] Navigation and mobile menu, including Escape to close and focus return
- [ ] FAQ accordion: keyboard operable, one panel at a time, focus visible, correct `aria-expanded`
- [ ] Testimonial carousel: keyboard operable, arrow keys scoped to the carousel
- [ ] Logo walls, card grids, and the person grid reflow cleanly at every width
- [ ] Art-directed images: the `<picture>` mobile sources on Staff Augmentation, About, and Join Us actually swap
- [ ] Long FAQ answers with nested lists and inline links read correctly on mobile
- [ ] Tables, long links, and legal text do not overflow
- [ ] Visible focus states on every interactive element
- [ ] Heading hierarchy verified with an outline tool, not just the regex check
- [ ] Contrast checked on `.eyebrow`, `.faq-panel` body text, and `.post-card__meta`
- [ ] Lighthouse run on at least Staff Augmentation (the heaviest page, 170 KB HTML plus 40 images) and Contact
- [ ] Image file sizes reviewed. The 121 assets came straight from HubSpot at whatever dimensions it stored; they have not been optimized
- [ ] Cumulative Layout Shift checked, specifically on the logo walls

---

<!-- preflight: advisory -->
## 7. Content quality, preserved and flagged

Source: `content-followups.md` sections 2, 3, 4, and 5. None of these block a deploy.
They are the backlog of things the migration found and deliberately did not fix.

- [ ] Copy quality items CF-10 through CF-23 reviewed (typos, "heavylifting", spacing, repetition)
- [ ] Structural questions CF-24 through CF-34 reviewed (About section with no body copy, values buried in an FAQ answer, unnamed expert team)
- [ ] Brand and destination consistency CF-35 through CF-43 (SalsaMobi leakage in Calendly and LinkedIn URLs, two contact entry points, footer out of sync with the live site, hardcoded copyright year)
- [ ] Unsourced claims CF-44 through CF-53 reconciled against `COPY_BRIEF.md`. Ten claims currently have no source, including every use of "72 hours" and all the cost-savings numbers

---

<!-- preflight: advisory -->
## 8. Explicitly deferred, not deploy blockers

Source: `technical-debt.md`, `structured-data-inventory.md`. Listed so nobody mistakes
them for gates, and so nobody forgets them either.

- [ ] TD-01 consolidate `home.js`, `landing-page.js`, `air-page.js`, and `page.js` into one core script
- [ ] TD-02 / Phase 7 Roles v2 refactor
- [ ] TD-03 delete the 19 `.dist-trash-*` directories
- [ ] TD-04 stop shipping `roles-template` and `tech-template` to production. Code complete 2026-09-08 in `build-discover-dist.js`; live after next discover deploy
- [ ] TD-05 one `data/roles.js` instead of four definitions of "the set of roles"
- [ ] TD-06 archive the stray one-shot build scripts in the repo root
- [ ] TD-07 stop committing generated root HTML
- [ ] TD-08 delete `astro-demo/`, gitignore `betterengineer/`
- [ ] TD-09 move the intake Worker off the personal `workers.dev` subdomain
- [ ] TD-10 document or unify the two CSS delivery strategies
- [ ] TD-11 generator-owned inline style for role pages
- [ ] TD-12 role page verifier
- [ ] TD-14 sync `footer-full.html` with the live footer
- [ ] TD-15 delete the duplicated FAQ rules from `role-detail.css`

---

## 9. Cutover runbook

Run in order. Do not reorder; several steps depend on the one before.

1. Confirm sections 1 through 6 above are clear: `node tools/preflight.js --stage=cutover`
2. Take a full backup export of the HubSpot site, including all page content and the forms configuration
3. Snapshot current rankings and traffic for the top 20 URLs, so post-cutover movement is measurable
4. Clear `PRE_CUTOVER_ROBOTS` in `data/pages.js`
5. Rebuild with `INTERNAL_LINKS=local npm run build`
6. Re-run `npm run verify` and `node tools/preflight.js --stage=cutover`
7. Deploy to a staging hostname first, not straight to `www`
8. Crawl the staging build end to end with a link checker. Zero 404s, zero redirect chains
9. Put the 301s in place at the host before the DNS change, not after
10. Change DNS
11. Immediately: spot-check the top 20 URLs, both with and without trailing slashes
12. Immediately: submit one real lead through `/contact/` and confirm it reaches the CRM
13. Submit the new sitemap in Search Console
14. Run `npm run monitor:live`

---

## 10. Post-deploy monitoring

- [ ] Day 1: crawl for 404s and redirect chains
- [ ] Day 1: confirm form submissions are reaching HubSpot, and check the volume against the pre-cutover baseline
- [ ] Day 1: confirm GTM and HubSpot analytics are recording sessions
- [ ] Week 1: Search Console coverage report, watch for a spike in excluded or not-found pages
- [ ] Week 1: compare organic traffic and rankings against the step 3 snapshot
- [ ] Week 2: re-check coverage, confirm the new sitemap is fully processed
- [ ] Week 4: review whether any 301 is still carrying meaningful traffic, which would mean an internal link was missed
