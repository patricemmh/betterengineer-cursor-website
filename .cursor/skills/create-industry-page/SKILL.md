---
name: create-industry-page
description: Adds a BetterEngineer industry hiring page by adding a record to data/industries.js and running build-industries.js. Use when adding a new industry vertical (for example insurtech, edtech, or climate), or when the user says "add an industry page". Keep live slugs like /fintech unless a 301 is approved. Do not hand-copy fragments.
---

# Create a BetterEngineer Industry Page

Industry pages are generated, not hand-copied.

- `data/industries.js` is the source of truth (`fintech` is the reference record).
- `build-industries.js` writes `fragments/industries/{slug}.html` and the `/industries/` hub.
- `data/pages.js` loads `pageRecords()` from that file, so a published record gets a URL.
- Live HubSpot slugs stay at the root (`/fintech`, `/martech`, `/healthtech`). New industries can use the same pattern (`/insurtech`) or wait for an approved `/industries/{slug}` redirect.

## Add a record

Copy a published industry object. Required fields:

`name, slug, status, category, title, metaDescription, h1, heroLead, heroDirectAnswer, heroEyebrow, midCta, solutionsHeading, clusters, reasonsHeading, reasons, faqs, relatedIndustries, relatedRoles, relatedTechnologies, atAGlance, keyword, ctaLead, lastUpdated, heroImage, solutionsImage`.

Set `status: "draft"` until copy, FAQs, and a local hero image exist. Only `"published"` generates a page.

Read `COPY_BRIEF.md` before writing new copy. No em dashes. Keep live wording when migrating an existing HubSpot page.

## Build

```bash
node build-industries.js
npm run build
```

Put the hero at `/images/pages/{slug}/hero.png` and add it to `data/migration-assets.js` if it still lives on HubSpot.

## Schema

Published pages emit Organization, Service, BreadcrumbList, WebPage, and FAQPage (from the visible `.faq-item` blocks). That is the same family as technology pages, adapted for an industry vertical.
