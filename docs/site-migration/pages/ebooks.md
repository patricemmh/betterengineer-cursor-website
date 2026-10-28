# Extraction Record: Ebooks

- Source URL: https://www.betterengineer.com/ebooks
- Legacy path: `/ebooks`
- Proposed new path: `/ebooks` (keep; it is the live target of the "Ebooks" item in the global footer's Resources column, so changing it would break a site-wide nav link plus any inbound links from gated-content promotion. No rename recommended.)
- Extracted: 2026-08-07
- Extraction method: WebFetch (live HubSpot page), 5 passes
- Status: EXTRACTED

## 1. Source metadata

| Field | Value |
| --- | --- |
| title tag | `Engineering & AI Ebooks for Tech Leaders \| BetterEngineer` |
| meta description | `Download free guides built from real hiring data and implementation experience. Practical frameworks for tech leaders on AI strategy, team building, and engineering excellence.` |
| canonical | `https://www.betterengineer.com/ebooks` |
| robots | None specified (no robots meta tag found) |
| H1 | `Ebooks: Engineering Insights, Backed by Real Data` |
| og:title | `Engineering & AI Ebooks for Tech Leaders \| BetterEngineer` |
| og:description | `Download free guides built from real hiring data and implementation experience. Practical frameworks for tech leaders on AI strategy, team building, and engineering excellence.` |
| og:image | Not found in extraction (see Migration Notes) |
| og:type | Not found in extraction (see Migration Notes) |
| og:url | `https://www.betterengineer.com/ebooks` |
| twitter:card | `summary` |
| twitter:title | `Engineering & AI Ebooks for Tech Leaders \| BetterEngineer` |
| twitter:description | `Download free guides built from real hiring data and implementation experience. Practical frameworks for tech leaders on AI strategy, team building, and engineering excellence.` |
| viewport | `width=device-width, initial-scale=1` |
| existing JSON-LD types | None found |
| Analytics | Google Tag Manager container `GTM-WT77L8JF` |

### Existing structured data

None found.

No JSON-LD was present on the page. Notably there is **no `ItemList`, `Book`, or `DigitalDocument` schema** despite the page being a two-item resource library with downloadable PDFs (see Migration Notes).

### Heading outline

Every heading in document order, verbatim.

| Level | Verbatim heading text |
| --- | --- |
| H1 | Ebooks: Engineering Insights, Backed by Real Data |
| H3 | FREE EBOOK The AI-ready Engine: How to build teams that learn and ship 10x faster |
| H3 | FREE WHITEPAPER You've got an LLM, Now What? |
| H2 | Latest Articles from our Resource Center. |
| H2 | What CTOs Get Wrong About AI and Engineering Throughput (And ... |
| H2 | 5 AI Tools Engineering Teams Should Actually Use in 2026 |
| H2 | The Jenga Tower Paradox: What AI Is Really Doing to Your ... |

Notes on the outline, preserved as found and flagged in Migration Notes:

- The two ebook card headings are **H3s with no parent H2**. They sit directly under the H1, so the document skips a heading level. The ebook grid has no section heading of its own.
- The eyebrow labels `FREE EBOOK` and `FREE WHITEPAPER` are **inside the H3 element**, not separate elements. The extracted heading text therefore reads as one run-on string. Confirm in the CMS whether they are `<span>`s inside the heading (a11y and SEO problem) or genuinely concatenated text.
- The three blog card titles render as **H2s, the same level as the "Latest Articles" section H2 that contains them**. They should be H3s.

## 2. Content (VERBATIM)

### Section 0 — Global header navigation (site chrome, not page content)

The body-text pass returned the entire nav block **twice** (mobile drawer plus desktop bar, both present in markup). Reproduced once here; the duplication is a rendering artifact of the shared header, not page content. Flagged in Migration Notes.

- nav item: `Menu`
- nav item: `Services`
  - nav sub-item: `Staff Augmentation`
  - nav sub-item: `AI Readiness`
  - nav sub-item: `Platform`
  - nav sub-item: `Browse Roles`
  - nav sub-item: `Browse by Technologies`
- nav item: `AI Fluency`
- nav item: `About`
  - nav sub-item: `Who We Are`
  - nav sub-item: `Why Nearshore`
- nav item: `Resources`
  - nav sub-item: `Blog`
  - nav sub-item: `FAQs`
  - nav sub-item: `Podcast`
- nav item: `Join Us`
- nav CTA: `Hire Engineers`
- nav item: `Login`

### Section 1 — Hero

- h1: `Ebooks: Engineering Insights, Backed by Real Data`
- body: `Access research-driven guides built from thousands of developer profiles, hiring engagements, and real-world AI implementation experience.`

No eyebrow/kicker precedes the H1. No CTA in the hero.

### Section 2 — Ebook cards (2 items)

There is no section heading above these cards. They follow the hero directly.

**Ebook 1**
- eyebrow label: `FREE EBOOK`
- h3 title: `The AI-ready Engine: How to build teams that learn and ship 10x faster`
- body: `This playbook gives founders and tech leaders a concrete roadmap — from maturity model to hiring patterns to ready-to-use templates — to turn AI into a real competitive advantage.`
- CTA label: `Download Now`
- cover image: **none found in source** (see Assets and Migration Notes)

**Ebook 2**
- eyebrow label: `FREE WHITEPAPER`
- h3 title: `You've got an LLM, Now What?`
- body: `Having access to an LLM isn't a strategy. This whitepaper breaks down why most RAG and agent implementations fail, what sovereign AI actually means for your business, and how to build systems that reason, not just retrieve.`
- CTA label: `Download Now`
- cover image: **none found in source** (see Assets and Migration Notes)

The full extracted H3 strings, including the eyebrow text that is embedded inside the heading element, are:

- `FREE EBOOK The AI-ready Engine: How to build teams that learn and ship 10x faster`
- `FREE WHITEPAPER You've got an LLM, Now What?`

### Section 3 — Latest articles (blog feed, 3 cards)

- h2: `Latest Articles from our Resource Center.`

Card 1
- topic tag: `staff augmentation`
- topic tag: `Artificial Intelligence`
- topic tag: `For Businesses`
- card title (link): `What CTOs Get Wrong About AI and Engineering Throughput (And ...)`
- attribution: `BetterEngineer -`
- date: `22 July 2026`
- excerpt: `Every engineering leader has the same dashboard open right now. Copilot seats purchased. Cursor licenses issued. AI tools rolled out across the org. And the same question sitting ...`
- CTA label: `Read more`

Card 2
- topic tag: `Artificial Intelligence`
- topic tag: `Software Development`
- card title (link): `5 AI Tools Engineering Teams Should Actually Use in 2026`
- attribution: `BetterEngineer -`
- date: `30 June 2026`
- excerpt: `Your engineering team may have more AI subscriptions than evidence that AI is improving delivery. It is a common situation. GitHub Copilot on every machine. Cursor because someone ...`
- CTA label: `Read more`

Card 3
- topic tag: `Artificial Intelligence`
- topic tag: `Software Development`
- card title (link): `The Jenga Tower Paradox: What AI Is Really Doing to Your ...`
- attribution: `BetterEngineer -`
- date: `3 June 2026`
- excerpt: `In the middle of the current AI wave, it's tempting to believe the hard part is tooling: Which copilot should we use? Which vendor? How fast can we roll something out? But if you ...`
- CTA label: `Read more`

Card titles and excerpts are truncated with an ellipsis by the legacy HubSpot blog listing module. The heading pass returned card 1's title as `What CTOs Get Wrong About AI and Engineering Throughput (And ...` (no closing parenthesis) while the body pass returned `... (And ...)`. Both are truncation artifacts of the same string; full titles are recoverable from the destination posts. See Migration Notes.

### Section 4 — Global footer (site chrome, not page content)

- body: `betterengineer`
- body: `Lets build better teams together`
- CTA label: `Contact Us`
- CTA label: `Schedule a Call`
- column heading: `Follow Us`
- column heading: `Our Services`
  - list item: `Staff Augmentation`
  - list item: `AI Readiness Assessment`
  - list item: `Hiring Dashboard`
  - list item: `Browse Roles`
  - list item: `Browse by Technology`
- column heading: `About Us`
  - list item: `Who We Are`
  - list item: `Why Nearshore`
- column heading: `Industries`
  - list item: `FinTech`
  - list item: `MarTech`
  - list item: `HealthTech`
- column heading: `Careers`
  - list item: `See All Job Opportunities`
  - list item: `Join Us`
  - list item: `Sign Up`
- column heading: `In-Demand Jobs`
  - list item: `Full-Stack Engineer`
  - list item: `Front-end Engineer`
  - list item: `Python Engineer`
  - list item: `DevOps Engineer`
  - list item: `Java Engineer`
  - list item: `Data Science Engineer`
  - list item: `QA Automation Engineer`
  - list item: `Typescript Engineer`
- column heading: `Resources`
  - list item: `Blog`
  - list item: `FAQs`
  - list item: `Ebooks`
  - list item: `Podcast`
  - list item: `Technical Glossary`
- column heading: `Case Studies`
  - list item: `Live CGI`
  - list item: `Wasteplace`
- legal: `Copyright © 2026 BetterEngineer`
- legal link: `Privacy Policy`
- legal link: `Terms of Service`

## 3. Assets

Proposed local paths follow the existing repo convention (`/images/pages/hire-ai-ready-engineers/`), so this page slug is `ebooks`. PDFs go under `/downloads/` rather than `/images/`.

### Images

| Source URL | Proposed local filename | Alt text | Usage | Notes |
| --- | --- | --- | --- | --- |
| `https://www.googletagmanager.com/ns.html?id=GTM-WT77L8JF` | n/a | (none) | GTM noscript iframe | SKIP - do not download. Tracking pixel. Re-implement GTM via the site's standard analytics include. |
| `https://www.betterengineer.com/hubfs/raw_assets/public/betterengineer/images/Icons/hamburger-icon-white.svg` | n/a | (empty `alt=""`) | Mobile nav toggle | SKIP - do not download. HubSpot chrome; the rebuilt site has its own header component. |
| BetterEngineer logo (header) | reuse existing repo logo | none (icon-only link) | Header | SKIP - do not download. Repo already has the brand logo. |
| Blog card thumbnails (3) | n/a | not returned by extraction | Section 3 cards | Could not confirm. The HubSpot blog listing module may render post feature images that the text extraction did not surface. Verify visually before rebuild. |

**Total downloadable page-specific images: 0.**

Two independent passes (a general image inventory and a dedicated cover-image hunt across `<img>`, `srcset`, `<picture>`, inline `style`, `<style>` blocks, and `data-src`/`data-bg` lazy-load attributes) both returned **only the GTM pixel and the hamburger icon**. The only `/hubfs/` image reference anywhere in the source is the hamburger SVG.

**The two ebook cards have no cover artwork.** This is unusual for a resource library page and is the single most likely thing the rebuild will want to add. See Migration Notes.

### Downloadable files (PDFs)

| Source URL | Proposed local path | Linked from | Notes |
| --- | --- | --- | --- |
| `https://www.betterengineer.com/hubfs/The%20AI%E2%80%90Ready%20Engine%20-%20How%20to%20Build%20Teams%20that%20Learn%20and%20Ship%2010%C3%97%20Faster%20-%20betterengineer.pdf` | `/downloads/ai-ready-engine.pdf` | Ebook 1 "Download Now" | Decoded filename: `The AI‐Ready Engine - How to Build Teams that Learn and Ship 10× Faster - betterengineer.pdf`. `%E2%80%90` is U+2010 HYPHEN (not ASCII hyphen); `%C3%97` is U+00D7 MULTIPLICATION SIGN. Filename contains spaces and two non-ASCII characters. **Must be renamed on download.** File size not visible in extraction. |
| `https://www.betterengineer.com/hubfs/Documents/Youve%20Got%20an%20LLM%2c%20Now%20What%20(2).pdf` | `/downloads/youve-got-an-llm-now-what.pdf` | Ebook 2 "Download Now" | Decoded filename: `Youve Got an LLM, Now What (2).pdf`. Note the `(2)` duplicate-upload suffix, the missing apostrophe in "Youve", the unencoded parentheses, and the lowercase `%2c` comma encoding. Lives in `/hubfs/Documents/` while the other PDF sits at `/hubfs/` root. **Must be renamed on download.** File size not visible in extraction. |

**Total assets to localize: 2** (both PDFs). Neither file's byte size, page count, or last-modified date was recoverable via WebFetch; capture these when downloading.

## 4. Links

| Anchor text | Href | Type | Migration note |
| --- | --- | --- | --- |
| (no text / icon only) | `https://www.betterengineer.com` | internal-www | Header logo. Becomes `/`. Icon-only link with no accessible name; flag. |
| Services | `https://www.betterengineer.com/staff-augmentation` | internal-www | Header nav. Top-level item points at the same target as its first child. |
| Staff Augmentation | `https://www.betterengineer.com/staff-augmentation` | internal-www | Header nav. Becomes `/staff-augmentation`. |
| AI Readiness | `https://www.betterengineer.com/ai-readiness` | internal-www | Header nav. Becomes `/ai-readiness`. |
| Platform | `https://www.betterengineer.com/hiring-dashboard` | internal-www | Header nav. Becomes `/hiring-dashboard`. Label and slug disagree. |
| Browse Roles | `https://discover.betterengineer.com/roles/` | internal-discover | Header nav. Keep absolute; discover is a separate build. |
| Browse by Technologies | `https://discover.betterengineer.com/technologies/` | internal-discover | Header nav. Keep absolute. Label differs from footer ("Browse by Technology"). |
| AI Fluency | `https://discover.betterengineer.com/ai-fluent-engineers/` | internal-discover | Header nav. Keep absolute. |
| About | `https://www.betterengineer.com/about` | internal-www | Header nav. Top-level item points at the same target as its first child. |
| Who We Are | `https://www.betterengineer.com/about` | internal-www | Header nav. Becomes `/about`. |
| Why Nearshore | `https://www.betterengineer.com/latamengineer` | internal-www | Header nav. |
| Resources | `https://blog.betterengineer.com/resource-center` | external (blog subdomain) | Header nav. Top-level item points at the same target as its "Blog" child. **Does not link to this Ebooks page**, even though Ebooks is a resource; flag. |
| Blog | `https://blog.betterengineer.com/resource-center` | external (blog subdomain) | Header nav. Stays on HubSpot unless the blog is also migrated. |
| FAQs | `https://www.betterengineer.com/faqs-nearshore-software-engineers-staff-augmentation-ai-talent` | internal-www | Header nav. Long keyword-stuffed slug; flag for review. |
| Podcast | `https://www.betterengineer.com/podcast` | internal-www | Header nav. |
| Join Us | `https://www.betterengineer.com/join` | internal-www | Header nav. |
| Hire Engineers | `https://www.betterengineer.com/multi-step-contact-form` | CTA (internal-www) | Header CTA. The only conversion CTA in the page chrome. |
| Login | `https://app.betterengineer.com/sign-in?redirect_url=https%3A%2F%2Fapp.betterengineer.com%2F` | app | Header. Keep absolute with query string intact. |
| Download Now | `https://www.betterengineer.com/hubfs/The%20AI%E2%80%90Ready%20Engine%20-%20How%20to%20Build%20Teams%20that%20Learn%20and%20Ship%2010%C3%97%20Faster%20-%20betterengineer.pdf` | file (HubSpot-hosted PDF) | **Ebook 1. Ungated direct file link.** Localize to `/downloads/ai-ready-engine.pdf`. |
| Download Now | `https://www.betterengineer.com/hubfs/Documents/Youve%20Got%20an%20LLM%2c%20Now%20What%20(2).pdf` | file (HubSpot-hosted PDF) | **Ebook 2. Ungated direct file link.** Localize to `/downloads/youve-got-an-llm-now-what.pdf`. Two identical "Download Now" anchor texts on one page; give each an `aria-label`. |
| staff augmentation | `https://blog.betterengineer.com/resource-center/tag/staff-augmentation` | external (blog subdomain) | Blog card 1 topic tag. |
| Artificial Intelligence | `https://blog.betterengineer.com/resource-center/tag/artificial-intelligence` | external (blog subdomain) | Blog card 1 topic tag. |
| For Businesses | `https://blog.betterengineer.com/resource-center/tag/for-businesses` | external (blog subdomain) | Blog card 1 topic tag. |
| What CTOs Get Wrong About AI and Engineering Throughput (And ... | `https://blog.betterengineer.com/resource-center/what-ctos-get-wrong-about-ai-and-engineering-throughput-and-how-latam-teams-fix-it` | external (blog subdomain) | Blog card 1 title. |
| Read more | `https://blog.betterengineer.com/resource-center/what-ctos-get-wrong-about-ai-and-engineering-throughput-and-how-latam-teams-fix-it` | external (blog subdomain) | Blog card 1 CTA. Duplicate href with the card title; ensure only one is in the a11y tab order or give the "Read more" an aria-label. |
| Artificial Intelligence | `https://blog.betterengineer.com/resource-center/tag/artificial-intelligence` | external (blog subdomain) | Blog card 2 topic tag. |
| Software Development | `https://blog.betterengineer.com/resource-center/tag/software-development` | external (blog subdomain) | Blog card 2 topic tag. |
| 5 AI Tools Engineering Teams Should Actually Use in 2026 | `https://blog.betterengineer.com/resource-center/5-ai-tools-engineering-teams-should-actually-use-in-2026` | external (blog subdomain) | Blog card 2 title. |
| Read more | `https://blog.betterengineer.com/resource-center/5-ai-tools-engineering-teams-should-actually-use-in-2026` | external (blog subdomain) | Blog card 2 CTA. |
| Artificial Intelligence | `https://blog.betterengineer.com/resource-center/tag/artificial-intelligence` | external (blog subdomain) | Blog card 3 topic tag. |
| Software Development | `https://blog.betterengineer.com/resource-center/tag/software-development` | external (blog subdomain) | Blog card 3 topic tag. |
| The Jenga Tower Paradox: What AI Is Really Doing to Your ... | `https://blog.betterengineer.com/resource-center/the-jenga-tower-paradox-what-ai-is-really-doing-to-your-organization` | external (blog subdomain) | Blog card 3 title. |
| Read more | `https://blog.betterengineer.com/resource-center/the-jenga-tower-paradox-what-ai-is-really-doing-to-your-organization` | external (blog subdomain) | Blog card 3 CTA. |
| betterengineer | `https://www.betterengineer.com` | internal-www | Footer logo. |
| Contact Us | `https://www.betterengineer.com/contact` | CTA (internal-www) | Footer. |
| Schedule a Call | `https://calendly.com/tim-salsamobi/30min` | external | Footer. **Calendly link is under a personal handle (`tim-salsamobi`) on the legacy SalsaMobi brand.** Flag for business review. |
| (no text / icon only) | `https://www.linkedin.com/company/salsamobi` | external | Footer social. Points at the SalsaMobi company page, not BetterEngineer. Flag. |
| (no text / icon only) | `https://www.facebook.com/BetterEngineerbySalsaMobi` | external | Footer social. |
| (no text / icon only) | `https://www.instagram.com/betterengineer_/` | external | Footer social. |
| Staff Augmentation | `https://www.betterengineer.com/staff-augmentation` | internal-www | Footer. |
| AI Readiness Assessment | `https://www.betterengineer.com/ai-readiness` | internal-www | Footer. Label differs from header ("AI Readiness"). |
| Hiring Dashboard | `https://www.betterengineer.com/hiring-dashboard` | internal-www | Footer. Label differs from header ("Platform"). |
| Browse Roles | `https://discover.betterengineer.com/roles/` | internal-discover | Footer. |
| Browse by Technology | `https://discover.betterengineer.com/technologies/` | internal-discover | Footer. Singular here, plural in header. |
| Who We Are | `https://www.betterengineer.com/about` | internal-www | Footer. |
| Why Nearshore | `https://www.betterengineer.com/latamengineer` | internal-www | Footer. |
| FinTech | `https://www.betterengineer.com/fintech` | internal-www | Footer. |
| MarTech | `https://www.betterengineer.com/martech` | internal-www | Footer. |
| HealthTech | `https://www.betterengineer.com/healthtech` | internal-www | Footer. |
| See All Job Opportunities | `https://www.betterengineer.com/careers` | internal-www | Footer. |
| Join Us | `https://www.betterengineer.com/join` | internal-www | Footer. |
| Sign Up | `https://app.betterengineer.com/sign-up/candidate` | app | Footer. |
| Full-Stack Engineer | `https://www.betterengineer.com/careers/full-stack-javascript-engineer` | internal-www | Footer. Label and slug disagree. |
| Front-end Engineer | `https://www.betterengineer.com/careers/front-end-engineer` | internal-www | Footer. |
| Python Engineer | `https://www.betterengineer.com/careers/python-engineer` | internal-www | Footer. |
| DevOps Engineer | `https://www.betterengineer.com/careers/devops-engineer` | internal-www | Footer. |
| Java Engineer | `https://www.betterengineer.com/careers/java-engineer` | internal-www | Footer. |
| Data Science Engineer | `https://www.betterengineer.com/careers/data-science-engineer` | internal-www | Footer. |
| QA Automation Engineer | `https://www.betterengineer.com/careers/qa-automation-engineer` | internal-www | Footer. |
| Typescript Engineer | `https://www.betterengineer.com/careers/typescript-engineer` | internal-www | Footer. |
| Blog | `https://blog.betterengineer.com/resource-center` | external (blog subdomain) | Footer. |
| FAQs | `https://www.betterengineer.com/faqs-nearshore-software-engineers-staff-augmentation-ai-talent` | internal-www | Footer. |
| Ebooks | `https://www.betterengineer.com/ebooks` | internal-www | Footer. **Self-link: this is the current page.** Preserving `/ebooks` avoids a nav change. |
| Podcast | `https://www.betterengineer.com/podcast` | internal-www | Footer. |
| Technical Glossary | `https://www.betterengineer.com/technical-glossary` | internal-www | Footer. |
| Live CGI | `https://www.betterengineer.com/case-studies/livecgi` | internal-www | Footer. |
| Wasteplace | `https://www.betterengineer.com/case-studies/wasteplace` | internal-www | Footer. |
| Privacy Policy | `https://www.betterengineer.com/resource-center/wpautoterms/privacy-policy` | internal-www | Footer. **Slug contains `wpautoterms`, a leftover from a WordPress plugin.** Flag for cleanup. |
| Terms of Service | `https://www.betterengineer.com/terms-of-service` | internal-www | Footer. |

Total links: **85 as rendered** (the header nav block is emitted twice in markup, mobile plus desktop, which accounts for 16 duplicate entries). Deduplicated: **69 unique link instances** — 14 page-body links (2 ebook downloads, 6 blog topic tags, 3 blog card titles, 3 "Read more") plus 55 header, footer, and social chrome links.

## 5. Forms

**No form on this page. Both downloads are UNGATED.**

This is the single most important finding on this page and it was verified by a dedicated extraction pass that searched the raw HTML and scripts for all of the following:

| Looked for | Result |
| --- | --- |
| `<form>` element | None found |
| `hbspt.forms.create` | Not present |
| `js.hsforms.net` | Not present |
| `js.hs-scripts.com` | Not present |
| `forms.hsforms.com` | Not present |
| `portalId` / HubSpot portal ID | Not present anywhere on the page |
| `formId` / form GUID | Not present |
| `region` value | Not present |
| `<iframe>` embeds | Only the GTM `ns.html` noscript tracking iframe |
| Modal / popup / lightbox markup (`hs-cta`, `leadinModal`, `popup`, `modal`) | None found |
| JavaScript that injects a form on click | None found |
| `onclick` handlers or `data-` attributes on the Download buttons | None found |
| Per-ebook landing page links | None; both buttons go straight to a `.pdf` |

**No HubSpot form IDs, portal IDs, or form GUIDs were recoverable, because no form exists on this page to recover them from.** This is not a BLOCKED extraction: the absence is affirmative, not a failure to see a JS-injected form. Both `Download Now` buttons are plain anchors whose `href` is a HubSpot-hosted `.pdf` file URL.

### Gating status per ebook

| # | Ebook | Gating | Destination |
| --- | --- | --- | --- |
| 1 | The AI-ready Engine: How to build teams that learn and ship 10x faster | **UNGATED — direct file link** | `https://www.betterengineer.com/hubfs/The%20AI%E2%80%90Ready%20Engine%20-%20How%20to%20Build%20Teams%20that%20Learn%20and%20Ship%2010%C3%97%20Faster%20-%20betterengineer.pdf` |
| 2 | You've got an LLM, Now What? | **UNGATED — direct file link** | `https://www.betterengineer.com/hubfs/Documents/Youve%20Got%20an%20LLM%2c%20Now%20What%20(2).pdf` |

**2 ebooks, 0 gated, 2 ungated.**

CTA destinations elsewhere on the page that do lead to a form:

| CTA | Destination | Location |
| --- | --- | --- |
| `Hire Engineers` | `/multi-step-contact-form` | Header nav CTA |
| `Contact Us` | `/contact` | Footer |
| `Schedule a Call` | `https://calendly.com/tim-salsamobi/30min` | Footer |

Required integrations for the rebuild: **none.** The page captures no leads. GTM container `GTM-WT77L8JF` must still fire so download clicks continue to attribute — and note that with no form, GTM click tracking on the two PDF anchors is currently the *only* measurement of this page's value.

Caveat: WebFetch renders the server HTML. A form injected by a third-party script at runtime would not appear. However, the absence of *any* HubSpot forms script tag (`js.hsforms.net`, `js.hs-scripts.com`), *any* portal ID, and *any* click handler on the download anchors means there is no mechanism present that could inject one. Confirm in a browser as a formality, but the evidence for "ungated" is strong and consistent across passes.

## 6. Page structure (logical, layout-independent)

1. **Hero** — Purpose: name the page and set the credibility frame ("backed by real data"). Content: H1 plus one supporting paragraph. Component: simple centered or left-aligned page-intro block. No CTA, no image, no eyebrow.
2. **Ebook grid (2 cards)** — Purpose: present and deliver the downloadable assets. Content: two cards, each with an eyebrow label, an H3 title, a one-paragraph description, and a single `Download Now` button linking straight to a PDF. Component: a 2-up resource card grid. **No section heading exists above this grid** and **no cover images exist**, so the cards are currently text-only. The rebuild should decide whether to add both. The component must scale: two items today, but this is a library page that will grow.
3. **Latest articles** — Purpose: content marketing cross-sell and internal linking. Content: H2 plus three post cards with topic tags, title, author, date, truncated excerpt, and a Read more link. Component: blog card grid. **Dynamic on the legacy page** (HubSpot blog listing module) — decide static-vs-dynamic for the rebuild. This is the same module used on `/latamengineer`; build it once and share it.
4. **No closing CTA band.** Unlike `/latamengineer`, this page ends on the blog grid with no final conversion prompt. Flagged in Migration Notes as a likely omission.

Site chrome (header nav, footer) is shared and belongs to the global layout, not to this page's structure.

## 7. Migration notes

### Gating decision (the critical item for this page)

The new site has an established custom-frontend / HubSpot-backend form pattern: `intake-form-shared.js`, portal `8679235`, fields `firstname` / `lastname` / `email` / `message`, plus a `company_website` honeypot and four hidden UTM fields. Mapping each ebook onto it:

- **Ebook 1 — The AI-ready Engine.** Currently an **ungated direct link**. **Nothing to map.** If the rebuild preserves current behaviour, this is a plain `<a href="/downloads/ai-ready-engine.pdf" download>` and needs no form infrastructure at all. If the business wants it gated, this requires a **new gated-download flow** that does not exist today — the `intake-form-shared.js` pattern is close but not sufficient: it is an *intake/contact* form whose success state is a thank-you message, whereas a gated download needs a success state that releases a file. See "New capability required" below.
- **Ebook 2 — You've got an LLM, Now What?** Identical situation. **Ungated direct link, nothing to map.** Same choice applies.

**Recommendation: raise this with the business before building.** Two "FREE EBOOK" assets sitting behind zero lead capture is either a deliberate ungated-content strategy or an unfinished implementation, and the two lead to very different rebuilds. The page's own meta description says "Download free guides", which reads as deliberate. But the page has no CTA band and no newsletter capture either, so it currently produces no measurable lead value whatsoever.

**New capability required if gating is approved.** The existing pattern would need extending with: (a) a per-asset identifier so HubSpot knows which ebook was requested, (b) a success handler that reveals or redirects to the file, (c) a decision on whether the PDF URL stays publicly guessable (which makes any gate trivially bypassable — if gating matters, the files must move behind a token or a non-enumerable path), and (d) a `firstname`/`lastname`/`email` field set without `message`, which the shared form does not currently support as a variant. Scope this as its own ticket; it is not a copy-paste of the intake form.

### Content issues (flag, do not fix)

- **Em dash in ebook 1's description.** `a concrete roadmap — from maturity model to hiring patterns to ready-to-use templates — to turn AI into a real competitive advantage.` uses two U+2014 EM DASH characters. **The repo forbids the em dash character.** This copy cannot be migrated verbatim without violating house style. Preserved verbatim here per the extraction rule; the rebuild must rewrite to a spaced hyphen, a comma pair, or a restructured sentence. **Needs a copy decision, not a silent find-and-replace.**
- **Eyebrow labels are inside the heading elements.** The H3s extract as `FREE EBOOK The AI-ready Engine: ...` and `FREE WHITEPAPER You've got an LLM, Now What?`. The label is not a separate element. This pollutes the accessible name and the SEO heading text. On rebuild, the eyebrow should be a sibling `<p>` or `<span>` outside the heading, or an `aria-hidden` decoration.
- **Inconsistent asset nomenclature.** Card 1 is labelled `FREE EBOOK`, card 2 `FREE WHITEPAPER`, the page title and H1 say `Ebooks`, and the nav/footer link says `Ebooks`. Three terms for two items. Decide on one taxonomy, or introduce a proper type field per resource.
- **Title casing is inconsistent between the page and the file.** On-page: `The AI-ready Engine: How to build teams that learn and ship 10x faster` (sentence case, lowercase "ready", ASCII "10x"). In the PDF filename: `The AI‐Ready Engine - How to Build Teams that Learn and Ship 10× Faster` (title case, capital "Ready", U+00D7 multiplication sign). The document itself may use a third variant. Confirm the canonical title before writing metadata or schema.
- **"AI-ready" vs "AI-Ready" vs "AI Readiness".** The page uses `AI-ready`, the file uses `AI‐Ready`, the nav uses `AI Readiness`, and the footer uses `AI Readiness Assessment`. Preserved verbatim; flag for a style ruling.
- **Blog card titles are H2, same level as their containing section H2.** `Latest Articles from our Resource Center.` is an H2 and each of the three card titles is also an H2. The cards are semantically nested inside the section but not structurally. Should be H3.
- **Heading level skip.** The document goes H1 to H3 with no H2 in between (the ebook cards are H3s, the first H2 is the blog section). Accessibility and outline defect.
- **The ebook grid has no section heading.** Unlike every other section on the site, the primary content block of this page is unlabelled.
- **Trailing period inconsistency.** `Latest Articles from our Resource Center.` ends with a period; the H1 and both ebook H3s do not. Same inconsistency as `/latamengineer`. Preserved verbatim; recommend a single convention site-wide.
- **Missing apostrophe in footer.** `Lets build better teams together` should be `Let's`. Site-wide footer issue, not page-specific. Preserved verbatim.
- **Two identical "Download Now" anchor texts.** Screen-reader users tabbing the link list hear "Download Now" twice with no distinguishing context. Each needs an `aria-label` naming its ebook.
- **Header nav renders twice in markup** (mobile drawer plus desktop bar), producing 16 duplicated links. Shared-header artifact, not page content, but it means every page on the site ships duplicate nav links. Worth resolving in the global layout with a single nav and CSS-driven presentation.
- **"Resources" nav does not link to this page.** The header's Resources parent and its Blog child both point at `blog.betterengineer.com/resource-center`. Ebooks is reachable only from the footer. For a page whose whole job is content distribution, that is a discoverability problem.
- **No closing CTA.** The page ends on the blog grid. Every other marketing page in this migration set ends with a conversion band. Confirm whether this is intentional.

### Missing assets or broken links

- **No ebook cover images anywhere in the source.** Two independent passes confirmed: no `<img>` in either card, no `background-image`, no `<picture>`/`srcset`, no `data-src`/`data-bg`. The only `/hubfs/` image on the entire page is the nav hamburger icon. A resource library page with no cover art is almost certainly incomplete. **Recommend generating or sourcing two cover images on rebuild** — flag to the business, and note that a cover doubles as the `og:image` this page is also missing.
- **No `og:image`.** The page has og:title, og:description, and og:url but no og:image, and twitter:card is `summary` rather than `summary_large_image`. Social shares of this page — the exact distribution channel a free-ebook page depends on — will have no preview image. **This is the highest-impact metadata fix on the page.**
- **No `og:type`.** Not found in extraction. Should be `website`.
- **PDF filenames are unusable as-is.** Ebook 1: `The AI‐Ready Engine - How to Build Teams that Learn and Ship 10× Faster - betterengineer.pdf` contains spaces, a U+2010 HYPHEN, and a U+00D7 MULTIPLICATION SIGN. Ebook 2: `Youve Got an LLM, Now What (2).pdf` contains spaces, a comma, unencoded parentheses, a missing apostrophe, and a `(2)` duplicate-upload suffix. Both must be renamed to lowercase kebab-case on download. Proposed names are in Section 3.
- **The `(2)` suffix on ebook 2 suggests a duplicate upload in HubSpot's file manager.** There is likely an earlier `Youve Got an LLM, Now What.pdf` sitting in the same folder. **Verify which file is current before localizing** — the linked one may or may not be the latest revision.
- **PDFs live in two different HubSpot folders.** One at `/hubfs/` root, one at `/hubfs/Documents/`. No file organisation convention. Both go to `/downloads/` in the rebuild.
- **PDF file sizes, page counts, and revision dates are not visible.** WebFetch cannot report them. Capture all three when downloading so the rebuild can show a file size next to each download link (a standard UX courtesy this page currently lacks).
- **Blog card thumbnails unconfirmed.** The three post cards may render feature images that the text-oriented extraction passes did not surface. Verify visually before finalising the asset list. Same caveat as `/latamengineer`.
- **No broken links detected**, but the two PDF URLs were not fetched and must be confirmed to return 200 before the rebuild links to localized copies.

### Questionable information needing business review

- **Are these ebooks supposed to be gated?** The central question for this page. See the gating section above.
- **Is the `(2)` PDF the current version of the LLM whitepaper?**
- **"ship 10x faster"** is a quantified performance claim in a headline with no cited source on the page. Confirm it is defensible, or that the ebook itself substantiates it.
- **"built from thousands of developer profiles, hiring engagements, and real-world AI implementation experience"** is a data-provenance claim in the hero. Same standard applies.
- **Calendly link is a personal handle on the predecessor brand:** `https://calendly.com/tim-salsamobi/30min`. Site-wide footer issue.
- **LinkedIn points to `linkedin.com/company/salsamobi`**, not a BetterEngineer company page. Facebook uses `BetterEngineerbySalsaMobi`. Instagram uses `betterengineer_`. Three different brand identities across three social links. Site-wide footer issue.
- **Privacy Policy URL contains `wpautoterms`** — `/resource-center/wpautoterms/privacy-policy`. Residue from a WordPress terms-generator plugin. Site-wide footer issue.
- **Blog card dates are 22 July, 30 June, and 3 June 2026**, all older than the three cards on `/latamengineer` (3 August 2026). The two pages use the same module but show different posts, so the listing is filtered by tag rather than showing the site-wide latest. Confirm the intended filter before rebuilding the module.
- **Only two resources on a page called "Ebooks".** Confirm whether more exist unpublished, or whether the library is genuinely this small — it affects whether the rebuild needs pagination, filtering, or a per-ebook detail page.

### Special interactions

- **None.** No accordions, carousels, tabs, modals, video embeds, animations, or form interactions were detected on this page. It is the structurally simplest page in the migration set so far.
- **Blog listing module.** Dynamic on HubSpot, pulling recent posts from `blog.betterengineer.com`. The rebuilt static site cannot query HubSpot at request time. Options: (a) hardcode three cards and accept staleness, (b) generate at build time from the blog's RSS/JSON feed as part of `npm run build`, (c) fetch client-side with vanilla JS from a feed endpoint. Option (b) fits the repo's static-only constraint best. **This is the same component as on `/latamengineer`; build it once, share it, and parameterise the tag filter.**
- **PDF download behaviour.** Decide whether the links open in a new tab, force a download via the `download` attribute, or navigate in place. The legacy page's anchors carry no `target` or `download` attribute, so PDFs currently open in the browser's built-in viewer in the same tab. Preserving that is the safe default.

### Implementation considerations

- **Add `og:image` and switch `twitter:card` to `summary_large_image`.** Highest-impact fix for a page built to be shared.
- **Add JSON-LD.** An `ItemList` of two `DigitalDocument` (or `Book`) entries with `name`, `description`, and `url` is a natural fit and this page has none. Lower priority than the `FAQPage` schema on `/latamengineer` but cheap to add.
- **Repair heading hierarchy.** Introduce an H2 for the ebook grid, demote the ebook titles from H3 to H3-under-that-H2 (level stays but the skip resolves), and demote the three blog card titles from H2 to H3.
- **Move eyebrow labels out of the heading elements.**
- **Localize both PDFs** to `/downloads/` with clean kebab-case filenames. Do not hotlink `hubfs` from the rebuilt site — that would leave a live HubSpot dependency on a page that otherwise has none.
- **Do not introduce the em dash character**, and note that ebook 1's existing description already violates this rule and must be rewritten (see Content issues).
- **Use root-relative asset paths** (`/downloads/...`, `/images/pages/ebooks/...`) per CLAUDE.md so nested routes resolve.
- **Build the resource card as a repeatable component**, not two hardcoded blocks. This page is a library and will grow.
- **Preserve GTM `GTM-WT77L8JF`** and make sure the two PDF anchor clicks are still tracked — with no form on the page, click events are the only conversion signal it produces.
- **Follow the repo build workflow.** Create the `main-ebooks.html` fragment, reuse `footer-full.html`, add page styles to `styles/*.css`, then `npm run build`, `node build-discover-dist.js`, `npm run verify`.
- **No 301 needed** if `/ebooks` is preserved, which is the recommendation. If it changes, update the "Ebooks" item in the global footer.

### Anything the extraction could not confirm

- **`og:image` and `og:type`** — not returned by the metadata pass. Cannot distinguish "absent" from "not surfaced by the fetch". Verify in the raw HTML head before concluding they are missing.
- **PDF file sizes, page counts, and last-modified dates** — not obtainable via WebFetch. Capture on download.
- **Whether an earlier `Youve Got an LLM, Now What.pdf` (without the `(2)`) exists in HubSpot's file manager** and which revision is current.
- **Ebook cover images** — two passes found none. It is possible a cover is applied via an external stylesheet the fetch did not follow. Verify visually in a browser before concluding the cards are text-only, since this determines whether two assets need to be created or merely downloaded.
- **Blog card thumbnails** — see Missing assets above.
- **Social icon alt text / accessible names** — the three footer social links were returned with no anchor text. They are likely icon-only links with no accessible name, which would be an a11y defect. Verify.
- **Whether the blog listing module is tag-filtered.** This page and `/latamengineer` use the same module but surface different posts. Inferred to be tag-filtered; confirm in the CMS.
- **Cookie banner, chat widget, or other third-party overlays** — none were surfaced by any pass, but text-based extraction routinely misses JS-injected chrome. Verify in a browser.
- **Extraction pass agreement:** all five passes agreed on body copy wording, punctuation, capitalization, and both PDF URLs. The only conflict was blog card 1's truncated title, returned as `... (And ...` by the heading pass and `... (And ...)` by the body pass — a truncation artifact of the same string, not a content discrepancy. The gating finding was confirmed by two passes (the dedicated form-mechanics pass and the full link inventory, which independently showed both Download buttons resolving to `.pdf` files).
