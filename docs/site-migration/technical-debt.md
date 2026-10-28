# Technical Debt

Discovered during the full project audit. Nothing here is urgent enough to block the
migration. All of it makes the site harder to maintain as it grows.

Ordered roughly by cost of leaving it alone.

Last updated: 2026-08-07

---

## TD-01 — Base page behavior is implemented three times (high)

`home.js`, `landing-page.js`, and `air-page.js` each independently implement:

- sticky header scroll state (`.is-scrolled`)
- mobile nav toggle (`.nav-mobile.is-open`, `aria-expanded`)
- the `prefers-reduced-motion` gated IntersectionObserver that adds `.is-visible`
  to `.reveal` elements

The FAQ accordion is implemented in `landing-page.js`, `air-page.js`, and now `page.js`.

**Update 2026-08-07:** `page.js` was brought to parity with `air-page.js` (identical open
and close logic) and the FAQ **styles** were consolidated into one canonical component in
`styles/brand.css`. `landing-page.css` no longer defines any `.faq-*` rules. Separately,
no landing page currently contains an FAQ section, so `landing-page.js`'s FAQ code is
dead. Delete it when TD-01 is done.

**Cost:** any fix to nav accessibility or scroll behavior has to be made three times
and will drift. Every new page family adds a fourth copy.

**Fix:** extract a `site-core.js` with header, nav, reveal, FAQ accordion, and
carousel. Have the three existing scripts import or simply be replaced by it plus a
small page specific tail. Do this as a scheduled cleanup with visual regression
checks, not mid migration.

**Interim rule:** migrated marketing pages must not add a fourth copy.

## TD-02 — Role pages are hand maintained HTML (high)

Covered in detail in `structured-data-inventory.md` section 4. Summary:

- No data file, no generator.
- Roughly 188,000 bytes, about 30 percent of the 631 KB role corpus, is byte
  identical content repeated across files.
- 31 percent of visible role page prose is a verbatim repeat of prose on another
  role page.
- Maintained by seven one off literal string replace scripts, one of which is 37 KB
  of sequential `replace()` calls and warns then continues when a replacement fails.
- No verifier. `npm run verify` does not check role page schema, metadata, headings,
  or FAQ parity.

**Fix:** the Roles v2 project. Fully specified, not scheduled.

## TD-03 — Nineteen `.dist-trash-*` directories in the repo root (medium)

`build-discover-dist.js` cannot always delete `dist/` on this FUSE backed mount, so
it renames the stale copy to `.dist-trash-<timestamp>` and continues. Nineteen of
these have accumulated, dated 15 to 20 July.

**Cost:** repo noise, wasted disk, and a real risk that someone greps the wrong copy
of a file.

**Fix:** confirm they are gitignored, then delete them. Add a cleanup step to
`build-discover-dist.js` that removes trash directories older than a day.

## TD-04 — Template pages ship to production (medium)

`roles/roles-template/index.html` and `technologies/tech-template/index.html` are
both copied into `dist/` and are crawlable. They are excluded from `sitemap.xml`
only, via `SITEMAP_SKIP` in `build-discover-dist.js`.

`roles-template` is a near duplicate of `/roles/front-end-engineers/` carrying a
front-end description and a **self canonical**. That is a live duplicate competing
with a real page.

**Fix (in repo 2026-09-08, live after next discover deploy):**
`build-discover-dist.js` overwrites both copied templates with short `noindex,
follow` stubs that canonical and meta-refresh to the hubs. `dist/robots.txt`
Disallows both paths. They remain out of `sitemap.xml`. Source files stay as
authoring templates. `tools/verify-dist.js` fails if the stubs regress.

Until discover is redeployed, live URLs are still full crawlable pages. After
deploy, check Search Console coverage and add a 301 in HubSpot or Cloudflare if
either URL has impressions.

## TD-05 — Three different definitions of "the set of roles" (medium)

- `ROLE_META` hardcoded in `build-tech-pages.js` lines 47 to 58, all 10 slugs.
- `ROLE_SLUGS` hardcoded in `tools/verify-tech-data.js` lines 30 to 34.
- A 9 slug array in `audit-pages.js`, **missing `blockchain-engineers`**.
- A fourth map inside `build-tech-grids.js`.

Adding role 11 means editing four places, and forgetting one fails silently or fails
the verifier for the wrong reason.

**Fix:** one `data/roles.js`, required by all consumers. Part of Roles v2.

## TD-06 — Untracked stray build scripts in the repo root (medium)

The root contains: `add-other-roles-blockchain.js`, `add-other-roles-fe.js`,
`audit-pages.js`, `build-blockchain-page.js`, `build-lp-dist.js`,
`extract-section.js`, `finish-blockchain-page.js`, `inject-gtm.js`,
`inspect-fe.js`, `update-engineer-cards.js`, `update-role-tech-links.js`,
`verify-grids.js`, `verify-perf.js`.

Most are one shot mutation scripts that have already run. Several are 6 to 13 line
debug helpers. None are wired into `package.json`.

**Fix:** move genuinely reusable ones into `tools/`. Delete or archive the rest.
`tools/archive/` already exists for this.

## TD-07 — Repo root is crowded with generated output (low)

`index.html`, `hire-ai-ready-engineers.html`, and
`ai-systems-readiness-for-manufacturing.html` are build outputs that live next to
their own sources. `ai-systems-readiness-for-manufacturing.html` is 134 KB and
`hire-ai-ready-engineers.html` is 145 KB of generated HTML checked into git.

Worse, the repo root `index.html` is not published anywhere. The discover build
overwrites `dist/index.html` with a redirect to `www`. It only exists for local
preview.

**Fix:** build into `dist/` only and gitignore the generated root files, once the
GitHub Pages workflow no longer needs them.

## TD-08 — `astro-demo/` and `betterengineer/` directories (low)

`astro-demo/` contradicts the repo's own hard rule against Astro. `betterengineer/`
is the Cloudflare Pages subpath output directory and contains a partial duplicate of
the site including its own `home.js`, `react-page.js`, `icons/`, and `images/`.

**Fix:** confirm neither is an input to any build, then delete `astro-demo/` and
gitignore `betterengineer/`.

## TD-09 — Secrets and IDs are hardcoded in client JavaScript (low, by design)

`intake-form-shared.js` hardcodes the HubSpot portal ID `8679235`, form GUID
`4431ddc0-7bea-46ba-939c-98c422756479`, the Turnstile site key, and the Cloudflare
Worker URL `intake-proxy.patricemmh.workers.dev`.

These are all public values by design, so this is not a leak. But the worker URL is
on a personal `workers.dev` subdomain, which is fragile and off brand.

**Fix:** move the worker behind a `betterengineer.com` route. Do not put anything
genuinely secret in client JavaScript.

## TD-10 — Two CSS delivery strategies (low)

Home and landing pages **inline** all CSS into a single HTML document, which is
deliberate for first paint. Role and technology pages **link** four stylesheets and
add a generator owned inline block.

The result is that `brand.css` is duplicated into every generated root page, and the
same content is also served as a separate linked file for role and tech pages.

**Fix:** pick one strategy per page family and document why. Both are defensible.
The current split is undocumented, which is the actual problem.

## TD-11 — Inline `<style>` duplicated by hand across role pages (low)

A 2,817 byte inline style block is byte identical in all 10 role pages, and
`finish-blockchain-page.js` injected an extra block into one of them.

**Fix:** part of Roles v2. Generator owned, single source.

## TD-12 — `tools/verify-site.js` is 583 bytes (low) — PARTIALLY ADDRESSED

The technology family has a 9 KB verifier enforcing 45 or more rules. Everything
else has almost nothing. Migrated marketing pages currently have no schema, heading,
metadata, or asset checks at all.

**Status 2026-08-07:** `tools/verify-migrated-pages.js` now exists and is wired into
`npm run verify`. It checks, per migrated page: exactly one h1, no heading level skips,
no em dash, no unreplaced tokens, title and canonical matching `data/pages.js`, robots
directive, all OG and Twitter tags, every JSON-LD block parses, Organization plus
BreadcrumbList plus WebPage present, **FAQ JSON-LD text matching the visible FAQ in
order**, exactly one open FAQ panel, every img has alt plus width, height, and loading,
referenced assets exist on disk, no surviving hubfs or hs-fs URL, every class present in
the approved inventory, and intake form field completeness.

**Remaining:** role pages still have no equivalent. That is part of Roles v2.

## TD-13 — `build-pages.js` hardcoded every page — RESOLVED

Each of the three current pages has its own hand written block of variable
declarations, `shell()` call, and `writeFileSafe()` call. Adding a page means
copying about 25 lines. With seven Phase 1 pages plus Phases 2 to 4 this becomes
unmanageable.

**Fixed 2026-08-07.** `data/pages.js` now describes every static marketing page and
`build-pages.js` iterates it. Adding a page means adding a manifest record plus a
`main-<slug>.html` fragment. Output for the three pre-existing pages was verified
**byte identical** against the old generator before the change landed.

The manifest also drives the head block: canonical, robots, OG, Twitter card, and the
JSON-LD graph. Migrated pages get the full block; the three pre-existing pages carry
only the fields they already had, which is why their output did not move.

New flags: `--only=<slugs>` builds a subset, `--no-migrated` excludes the migration
pages (used by `build-discover-dist.js` so they stay out of the published bundle until
the www cutover).

## TD-14 — The footer is out of sync with the live site (low)

`footer-full.html` is missing the "Technical Glossary" resource link and four
in-demand job links (Java, Data Science, QA Automation, and one more) that the live
HubSpot footer has. The copyright year is a hardcoded string.

**Fix:** sync during Phase 2, and confirm whether the shorter list is intentional.
See CF-41 and CF-42.

## TD-15 — The canonical FAQ component is duplicated in `role-detail.css` (medium)

`styles/brand.css` now holds the canonical FAQ component. `styles/role-detail.css`
still carries a near identical copy at lines ~654 to ~792, which is what role and
technology pages actually use, because they link it after `brand.css`.

This was left in place deliberately: removing it would change 68 live pages during a
migration, and role pages are explicitly out of scope for modification right now.

**Cost:** the two copies will drift. Any change to the FAQ has to be made twice until
this is resolved.

**Fix:** delete the `.faq-*` block from `role-detail.css` and let `brand.css` supply it.
Do this as part of Roles v2, with a visual diff across a sample of role and technology
pages. The brand.css version is a superset (it also styles lists, links, and inline
emphasis inside answers), so the change should be additive rather than regressive.
