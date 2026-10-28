# Site Migration Control Center

Documentation for migrating the BetterEngineer marketing site off HubSpot and into
this static HTML, CSS, and vanilla JavaScript build.

**This directory is the permanent source of truth for the migration.** Conversation
history is not. If a decision is not written down here, it did not happen.

## Read in this order

| File | What it is |
| --- | --- |
| [site-migration-plan.md](site-migration-plan.md) | The program. Sources of truth, hard rules, hosting and URL strategy, the per page process, phases, definition of done. **Start here.** |
| [migration-status.md](migration-status.md) | Live status table for every page across every phase. Update it continuously. |
| [component-pattern-inventory.md](component-pattern-inventory.md) | Every reusable pattern, where it lives, and the Phase 1 section to pattern mapping. **Check this before inventing anything.** |
| [structured-data-inventory.md](structured-data-inventory.md) | Technologies vs Roles architecture audit, plus the full Roles v2 refactor plan. |
| [content-followups.md](content-followups.md) | Content problems found in approved copy. Nothing here has been changed. Needs business decisions. |
| [seo-followups.md](seo-followups.md) | Technical SEO findings, what the rebuild fixes, what needs a decision, internal link audit. |
| [redirect-plan.md](redirect-plan.md) | Every URL change, recorded before it happens. Plus the cutover checklist. |
| [technical-debt.md](technical-debt.md) | Everything found during the audit that makes the site harder to maintain. |
| [fragment-spec.md](fragment-spec.md) | The build spec for authoring a `main-<slug>.html` fragment: hard rules, the allowed class list, and exact markup for every shared pattern. Read before writing a fragment. |
| [pages/](pages/) | One extraction record per migrated page. Verbatim content, assets, links, forms, structure, notes. |

## The three rules that matter most

1. **Copy content verbatim.** Layout, hierarchy, grouping, and visual treatment may
   change. Wording may not. Anything that looks wrong gets preserved and logged in
   `content-followups.md`.
2. **Reuse before you invent.** Check `component-pattern-inventory.md` first. No
   page specific design systems.
3. **Extract before you build.** Live page, then extraction record, then
   implementation. Never straight from the live page to code.

## Current state, 2026-09-08

See **[HANDOFF.md](HANDOFF.md)** for the short remaining list. Summary:

- Phase 1 and 2: 11 pages built, local only, `noindex`. Not in the discover bundle.
- Roles and technologies: live on discover. Repo now has template noindex stubs, full
  role schema, hub CollectionPage, and hub cross-links. Those go live on the next
  discover deploy. That deploy still does **not** publish migrated HubSpot pages.
- Remaining owner work: Search Console for discover, HubSpot 301s for competing
  landings, approved cost/speed numbers, contact form fields and workflows, live URL
  inventory, glossary QA Engineer sign-off.
- Phase 3+ and Roles v2 generator: not started, not this week's list.

## Build commands

```bash
node tools/fetch-migration-assets.js --dry-run   # review the asset download list
node tools/fetch-migration-assets.js             # download legacy images into the repo
npm run build                                    # regenerate pages from data/pages.js
npm start                                        # preview at http://localhost:4323/
npm run verify:migrated                          # migrated-page checks only
npm run verify                                   # full check chain
```

Preview the migrated pages at `http://localhost:4323/staff-augmentation/`,
`/ai-readiness/`, `/hiring-dashboard/`, `/about/`, `/latamengineer/`, `/contact/`,
and `/join/`.

Nothing here deploys. Pushing to `main` triggers CI, which builds and publishes the
discover bundle. Migrated pages are deliberately excluded from that bundle until the
`www` cutover decision is made.
