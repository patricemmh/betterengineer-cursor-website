# Extraction Record: Podcast / Off The Algorithm

- Source URL: https://www.betterengineer.com/podcast
- Legacy path: `/podcast`
- Proposed new path: `/podcast` (keep; it is the live target of the "Podcast" item in both the header nav and the footer Resources column, so changing it would break two site-wide nav links. If a rename is ever wanted, `/off-the-algorithm` with a 301 from `/podcast`, but the generic slug is the better SEO target.)
- Extracted: 2026-08-07
- Extraction method: WebFetch (live HubSpot page), 5 passes
- Status: EXTRACTED (embed detection BLOCKED - see Migration Notes)

## 1. Source metadata

| Field | Value |
| --- | --- |
| title tag | `Podcast` |
| meta description | None specified (no meta description tag found) |
| canonical | `https://www.betterengineer.com/podcast` |
| robots | None specified (no robots meta tag found) |
| H1 | `Off The Algorithm: Exploring the Future of Software Engineering` |
| og:title | `Podcast` |
| og:description | Not found |
| og:image | Not found |
| og:type | Not found |
| og:url | `https://www.betterengineer.com/podcast` |
| twitter:card | `summary` |
| twitter:title | `Podcast` |
| twitter:description | Not found |
| viewport | `width=device-width, initial-scale=1` |
| existing JSON-LD types | None found |
| Analytics | Google Tag Manager container `GTM-WT77L8JF` |

### Existing structured data

None found.

No JSON-LD was present on the page. Notably there is **no `PodcastSeries` schema and no `PodcastEpisode` schema** despite the page being a five-episode podcast index (see Migration Notes).

### Heading outline

Every heading in document order, verbatim.

| Level | Verbatim heading text |
| --- | --- |
| H1 | Off The Algorithm: Exploring the Future of Software Engineering |
| H3 | EPISODE 1  Better AI Engineers |
| H3 | EPISODE 2  No More Blackbox: R&D ROI |
| H3 | EPISODE 3  The Future of Tech Talent: Latin America Rising |
| H3 | EPISODE 4  When to Build, When to Buy, and When to Walk Away |
| H3 | EPISODE 5  The Hidden Side of Cloud Innovation: Cost, Waste & Optimization |
| H2 | AI, software engineering, and the future of technology - without the noise. |

Notes on the outline:

- The five episode headings are **H3s with no parent H2**. They jump straight from the H1 to H3, skipping the H2 level entirely. The only H2 on the page sits *after* all five H3s, in the closing band. Flagged in Migration Notes.
- The `EPISODE n` label is **inside the same H3 element** as the episode title, not a separate eyebrow/kicker element. The extraction returned a double space between the label and the title (`EPISODE 1  Better AI Engineers`), which suggests two inline spans styled differently but sharing one heading. Preserved verbatim. Confirm the exact inline structure in the CMS before rebuilding.
- Pass 1 did not return the closing H2; passes 4 and 5 both did, and pass 5 explicitly confirmed it is a heading element and not a paragraph. Recorded as H2 on two-of-three agreement.
- The hero has no eyebrow/kicker above the H1.

## 2. Content (VERBATIM)

### Section 0 - Global header navigation (site chrome, not page content)

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

Identical to the header captured on `/latamengineer`. The "Podcast" item is a **self-link on this page**.

### Section 1 - Hero

- h1: `Off The Algorithm: Exploring the Future of Software Engineering`
- body: `Join us to discover key strategies for improving your teams, optimizing processes, and staying ahead in the digital era.`
- CTA label: `Explore the Series`

No eyebrow/kicker precedes the H1. The CTA leaves the site for the SoundCloud series page.

### Section 2 - Episode list (5 episodes)

There is **no section heading above the episode list**. The five cards follow the hero directly.

**Episode 1**
- h3: `EPISODE 1  Better AI Engineers`
- episode number label (inline in heading): `EPISODE 1`
- episode title (inline in heading): `Better AI Engineers`
- body: `How is AI reshaping software teams? In our first episode, CEO Boris Portman and CIO Marc Boudria discuss the essential AI-driven skills engineers need, how companies can build stronger AI-powered teams, and what the future of AI-driven development looks like.`
- guests (named in body copy only, no separate guest field): `CEO Boris Portman`, `CIO Marc Boudria`
- duration: not present on the page
- publish date: not present on the page
- CTA label: `Listen Now`

**Episode 2**
- h3: `EPISODE 2  No More Blackbox: R&D ROI`
- episode number label (inline in heading): `EPISODE 2`
- episode title (inline in heading): `No More Blackbox: R&D ROI`
- body: `Measuring ROI in research is challenging, but it doesn't have to be. This episode explores the real impact of AI on efficiency, why automation doesn't always lead to lower costs, and the shift from command-based computing to AI-driven exploration.`
- guests: none named
- duration: not present on the page
- publish date: not present on the page
- CTA label: `Listen Now`

**Episode 3**
- h3: `EPISODE 3  The Future of Tech Talent: Latin America Rising`
- episode number label (inline in heading): `EPISODE 3`
- episode title (inline in heading): `The Future of Tech Talent: Latin America Rising`
- body: `Latin America isn't the next big thing in tech talent, it's happening right now. In this episode, Dario Trevisani, Director of Talent Operations at BetterEngineer, shares why global companies are turning to LATAM for world-class engineers.`
- guest (named in body copy only): `Dario Trevisani, Director of Talent Operations at BetterEngineer`
- duration: not present on the page
- publish date: not present on the page
- CTA label: `Listen Now`

**Episode 4**
- h3: `EPISODE 4  When to Build, When to Buy, and When to Walk Away`
- episode number label (inline in heading): `EPISODE 4`
- episode title (inline in heading): `When to Build, When to Buy, and When to Walk Away`
- body: `From finance to fractional CTO, Christopher Esplin's journey is a masterclass in reinvention. Hear how he built his first SaaS from scratch, why being a generalist accelerates success, and how to lead remote teams with trust and autonomy.`
- guest (named in body copy only): `Christopher Esplin` (fractional CTO; no company named)
- duration: not present on the page
- publish date: not present on the page
- CTA label: `Listen Now`

**Episode 5**
- h3: `EPISODE 5  The Hidden Side of Cloud Innovation: Cost, Waste & Optimization`
- episode number label (inline in heading): `EPISODE 5`
- episode title (inline in heading): `The Hidden Side of Cloud Innovation: Cost, Waste & Optimization`
- body: `Behind every scalable system is smart strategy. In this episode, Asaf Zamir, founder of Cloud Expat, dives into how cloud cost optimization, multicloud solutions, and connecting tech with business accelerate real growth.`
- guest (named in body copy only): `Asaf Zamir, founder of Cloud Expat`
- duration: not present on the page
- publish date: not present on the page
- CTA label: `Listen Now`

**Episode count: 5.**

No episode carries a duration, runtime, publish date, season number, episode artwork, or transcript link. Guest names and titles exist only inside the prose description; there is no structured guest field. Every "Listen Now" leaves the site for SoundCloud.

### Section 3 - Closing band

- h2: `AI, software engineering, and the future of technology - without the noise.`
- body: `Every month we'll promote real, unfiltered discussions with top tech leaders, engineers, and innovators who are shaping the industry.`

This band carries **no CTA of its own**. The `Contact Us` and `Schedule a Call` buttons that follow it belong to the global footer, not to this section.

### Section 4 - Global footer (site chrome, not page content)

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

Identical to the footer captured on `/latamengineer`. Reuse the shared `footer-full.html` fragment.

## 3. Assets

Proposed local paths follow the existing repo convention, so this page slug is `podcast`.

| Source URL | Proposed local filename | Alt text | Usage | Notes |
| --- | --- | --- | --- | --- |
| `https://www.googletagmanager.com/ns.html?id=GTM-WT77L8JF` | n/a | (none) | GTM noscript iframe | SKIP - do not download. Tracking pixel. Re-implement GTM via the site's standard analytics include. |
| `https://www.betterengineer.com/hubfs/raw_assets/public/betterengineer/images/Icons/hamburger-icon-white.svg` | n/a | `Menu` | Mobile nav toggle | SKIP - do not download. HubSpot chrome; the rebuilt site has its own header component. Note this page returns alt text `Menu` on the hamburger, where `/latamengineer` returned no alt for the same asset - verify which is current. |
| BetterEngineer logo (header) | reuse existing repo logo | not returned by extraction | Header | SKIP - do not download. Repo already has the brand logo. **The logo `<img>` was not surfaced on this page by any pass** (see Migration Notes); it is present visually on every other page, so this is an extraction gap, not a missing logo. |
| Social icons (LinkedIn / Facebook / Instagram) | reuse existing repo icons | not returned by extraction | Footer | SKIP - shared footer chrome. |
| Podcast cover art / series artwork | UNCONFIRMED | UNCONFIRMED | Hero, probable | **Not found by any pass.** A podcast index page almost certainly ships series artwork. Verify visually. |
| Episode thumbnails (5) | UNCONFIRMED | UNCONFIRMED | Episode cards, probable | **Not found by any pass.** The episode cards may be text-only, or may carry artwork/waveform images the text extraction did not surface. Verify visually. |
| Hero / band background images | UNCONFIRMED | UNCONFIRMED | Hero, closing band | **Not found.** If present they are CSS `background-image` declarations in the stylesheet, which the extractor cannot see. Verify in devtools. |

Total confirmed downloadable page-specific assets: **0**.

This is an unusually low count and is very likely wrong. Only a single `<img>` element was returned for the entire page (the hamburger icon), and no logo, no cover art, no episode thumbnails, and no background images were surfaced. **Treat the asset list as INCOMPLETE and re-run asset discovery in a browser before rebuilding.** See Migration Notes.

## 4. Links

| Anchor text | Href | Type | Migration note |
| --- | --- | --- | --- |
| Services | `https://www.betterengineer.com/staff-augmentation` | internal-www | Header nav parent. **On this page the parent resolved to a real href**; on `/latamengineer` it was captured as a non-link dropdown parent. Reconcile - it should behave identically site-wide. |
| Staff Augmentation | `https://www.betterengineer.com/staff-augmentation` | internal-www | Header nav. Same destination as its own parent "Services". |
| AI Readiness | `https://www.betterengineer.com/ai-readiness` | internal-www | Header nav. Becomes `/ai-readiness`. |
| Platform | `https://www.betterengineer.com/hiring-dashboard` | internal-www | Header nav. Label and slug disagree. |
| Browse Roles | `https://discover.betterengineer.com/roles/` | internal-discover | Header nav. Keep absolute; discover is a separate build. |
| Browse by Technologies | `https://discover.betterengineer.com/technologies/` | internal-discover | Header nav. Keep absolute. Label differs from footer ("Browse by Technology"). |
| AI Fluency | `https://discover.betterengineer.com/ai-fluent-engineers/` | internal-discover | Header nav. Keep absolute. |
| About | `https://www.betterengineer.com/about` | internal-www | Header nav parent. Same destination as its "Who We Are" child. |
| Who We Are | `https://www.betterengineer.com/about` | internal-www | Header nav. |
| Why Nearshore | `https://www.betterengineer.com/latamengineer` | internal-www | Header nav. |
| Resources | `https://blog.betterengineer.com/resource-center` | external (blog subdomain) | Header nav parent. Same destination as its "Blog" child. |
| Blog | `https://blog.betterengineer.com/resource-center` | external (blog subdomain) | Header nav. Stays on HubSpot unless the blog is also migrated. |
| FAQs | `https://www.betterengineer.com/faqs-nearshore-software-engineers-staff-augmentation-ai-talent` | internal-www | Header nav. Long keyword-stuffed slug; flag for review. |
| Podcast | `https://www.betterengineer.com/podcast` | internal-www | Header nav. **Self-link: this is the current page.** |
| Join Us | `https://www.betterengineer.com/join` | internal-www | Header nav. |
| Hire Engineers | `https://www.betterengineer.com/multi-step-contact-form` | CTA (internal-www) | Header CTA. **The only conversion CTA reachable from this page's chrome.** The page body has zero hire/contact CTAs of its own. |
| Login | `https://app.betterengineer.com/sign-in?redirect_url=https%3A%2F%2Fapp.betterengineer.com%2F` | app | Header. Keep absolute with query string intact. |
| Explore the Series | `https://soundcloud.com/offthealgorithm` | **external (SoundCloud)** | Hero CTA. Sends the primary hero click **off-site** to the SoundCloud artist page. |
| Listen Now | `https://soundcloud.com/offthealgorithm/off-the-algorithm-podcast-series-episode-1-2-25` | **external (SoundCloud)** | Episode 1. Slug contains a date fragment `1-2-25`. |
| Listen Now | `https://soundcloud.com/offthealgorithm/no-more-blackbox-measure-grow-rd-roi` | **external (SoundCloud)** | Episode 2. SoundCloud slug ("measure-grow-rd-roi") does not match the on-page title ("No More Blackbox: R&D ROI"). |
| Listen Now | `https://soundcloud.com/offthealgorithm/the-future-of-tech-talent-latin-america-rising?utm_source=clipboard&utm_medium=text&utm_campaign=social_sharing` | **external (SoundCloud)** | Episode 3. **Carries SoundCloud's copy-to-clipboard UTM string** - the URL was pasted from SoundCloud's share button rather than cleaned. |
| Listen Now | `https://soundcloud.com/offthealgorithm/off-the-algorithm-when-to?utm_source=clipboard&utm_medium=text&utm_campaign=social_sharing` | **external (SoundCloud)** | Episode 4. Same clipboard UTMs. Slug is truncated mid-phrase (`off-the-algorithm-when-to`). |
| Listen Now | `https://soundcloud.com/offthealgorithm/the-hidden-side-of-cloud-innovation-cost-waste-optimization?utm_source=clipboard&utm_medium=text&utm_campaign=social_sharing&si=7245228fa2854064a2106b12d646b792` | **external (SoundCloud)** | Episode 5. Same clipboard UTMs **plus a share-session tracking parameter `si=7245228fa2854064a2106b12d646b792`**. |
| betterengineer | `https://www.betterengineer.com` | internal-www | Footer logo. Not surfaced by this page's extraction; carried over from the shared footer on `/latamengineer`. Verify. |
| Contact Us | `https://www.betterengineer.com/contact` | CTA (internal-www) | Footer. |
| Schedule a Call | `https://calendly.com/tim-salsamobi/30min` | external | Footer. **Calendly link is under a personal handle (`tim-salsamobi`) on the legacy SalsaMobi brand.** Flag for business review. |
| (LinkedIn icon) | `https://www.linkedin.com/company/salsamobi` | external | Footer social. Points at the SalsaMobi company page, not BetterEngineer. Flag. |
| (Facebook icon) | `https://www.facebook.com/BetterEngineerbySalsaMobi` | external | Footer social. |
| (Instagram icon) | `https://www.instagram.com/betterengineer_/` | external | Footer social. |
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
| Ebooks | `https://www.betterengineer.com/ebooks` | internal-www | Footer. |
| Podcast | `https://www.betterengineer.com/podcast` | internal-www | Footer. **Second self-link.** |
| Technical Glossary | `https://www.betterengineer.com/technical-glossary` | internal-www | Footer. |
| Live CGI | `https://www.betterengineer.com/case-studies/livecgi` | internal-www | Footer. |
| Wasteplace | `https://www.betterengineer.com/case-studies/wasteplace` | internal-www | Footer. |
| Privacy Policy | `https://www.betterengineer.com/resource-center/wpautoterms/privacy-policy` | internal-www | Footer. **Slug contains `wpautoterms`, a leftover from a WordPress plugin.** Flag for cleanup. |
| Terms of Service | `https://www.betterengineer.com/terms-of-service` | internal-www | Footer. |

Total links: **59** (6 in-page body links plus 17 header and 36 footer/social chrome links; the footer logo link is carried over from the shared footer and was not independently confirmed on this page).

**All 6 page-body links are outbound to SoundCloud.** This page contains zero internal links in its own content and zero conversion CTAs of its own.

## 5. Forms

**No form on this page.**

The page carries no HubSpot form embed, no newsletter signup, no "subscribe to the podcast" email capture, and no inline lead-capture module. Unusually, it also carries **no in-body CTA to `/contact` or `/multi-step-contact-form`** - every body CTA leaves for SoundCloud.

CTA destinations present on the page:

| CTA | Destination | Location |
| --- | --- | --- |
| `Explore the Series` | `https://soundcloud.com/offthealgorithm` | Hero (leaves the site) |
| `Listen Now` (x5) | SoundCloud episode URLs (see Section 4) | Episode cards (leave the site) |
| `Hire Engineers` | `/multi-step-contact-form` | Header nav CTA (chrome) |
| `Contact Us` | `/contact` | Footer (chrome) |
| `Schedule a Call` | `https://calendly.com/tim-salsamobi/30min` | Footer (chrome) |

Required integrations for the rebuild: none for this page itself. GTM container `GTM-WT77L8JF` must still fire so outbound-click attribution to SoundCloud survives - and note that outbound clicks need an explicit GTM outbound-link trigger, which should be verified rather than assumed.

## 6. Page structure (logical, layout-independent)

1. **Hero** - Purpose: name the show and its premise, and push the listener to the series. Content: H1 (show name plus tagline), one supporting paragraph, one CTA that leaves for SoundCloud. Component: standard hero with headline, subcopy, single primary button. Series cover art is likely present but unconfirmed; check during QA.
2. **Episode list** - Purpose: give each episode a hook and a direct listen path. Content: five cards, each with an H3 that contains an `EPISODE n` label plus the episode title, a two-to-three sentence description, and a `Listen Now` button. **No section heading introduces the list.** Component: episode card list (stacked rows or a grid), each card = label + title + body + button, optionally + artwork. **Hand-authored static markup**, not a HubSpot dynamic listing - see Migration Notes.
3. **Closing band** - Purpose: restate the show's positioning and cadence. Content: H2 with the show's tagline, one paragraph about publishing cadence. Component: full-width statement band. **No button.** This is the natural place to add the subscribe row and/or a newsletter capture that the page currently lacks.

Site chrome (header nav, footer) is shared and belongs to the global layout, not to this page's structure.

## 7. Migration notes

### Embeds - the critical finding for this page

- **There is no player embed on this page.** No `<iframe>`, no `<audio>`, no `<video>`, and no podcast-player `<script>` was found by any of the four passes that looked for them. Specifically searched for and **not found**: `w.soundcloud.com/player`, `open.spotify.com/embed`, `embed.podcasts.apple.com`, `youtube.com/embed`, `youtube-nocookie.com`, Buzzsprout, Libsyn, Captivate, Podbean, Anchor, Transistor.
- **The page's listening model is outbound links, not embeds.** All five episodes and the hero CTA are plain `<a>` elements pointing at `soundcloud.com/offthealgorithm/...`. A static rebuild reproduces this with ordinary anchors - **there is no player markup to port**.
- **Provider: SoundCloud** (artist/series page `https://soundcloud.com/offthealgorithm`), used as a link destination only.
- **BLOCKED - embed detection cannot be called conclusive.** WebFetch converts pages to markdown before analysis, and markdown conversion routinely drops `<iframe>` elements. The one piece of counter-evidence: the GTM noscript iframe *did* survive into the extraction (as a bare link to `googletagmanager.com/ns.html?id=GTM-WT77L8JF`), which suggests iframes are at least partially surfaced and that a SoundCloud player iframe would probably have appeared too. That is suggestive, not proof. **Additionally, a JavaScript-injected player would be invisible to this extraction method entirely.** Before rebuilding, open the page in a browser, view the rendered DOM, and confirm there is no player. If one exists, capture the full iframe `src`, `width`, `height`, `allow`, `loading`, `title`, and `frameborder` attributes and amend this record. **Do not ship the rebuild on the assumption of "links only" without that browser check.**
- If the business wants players on the rebuilt page, SoundCloud's standard embed is `https://w.soundcloud.com/player/?url=<encoded track URL>&color=...&auto_play=false&show_teaser=true`. That is a **new feature decision**, not a migration task, and it carries a real performance cost (one third-party iframe per episode). Prefer `loading="lazy"` and a click-to-load facade if it is adopted.

### Episode list: dynamic vs hand-authored

- **The episode list is hand-authored static markup.** The extraction found no `hs-blog`, `blog-listing`, `hs_cos_wrapper`, `post-item`, or other HubSpot dynamic-listing classes around the episode cards, and no HubSpot CTA module (`cta_button` / `hs-cta-wrapper`) on any button.
- This is **materially different from the blog feeds on `/latamengineer` and other pages**, which are dynamic HubSpot blog listing modules and are tracked under **CF-54**. This page does **not** need the CF-54 build-time feed treatment. Reference CF-54 only to record that it was evaluated and does not apply here.
- The trade-off is the opposite one: because the list is hand-authored, **every new episode requires a code change**. If the show keeps publishing monthly ("Every month we'll promote real, unfiltered discussions..."), consider driving the list from a small local data file (e.g. a JSON/YAML episode list consumed at build time) so adding an episode is a one-line content edit rather than a markup edit. Alternatively, generate it at build time from the SoundCloud RSS feed, which fits the repo's static-only constraint and would also supply the durations and publish dates the page is currently missing.

### Subscribe row

- **There is no subscribe row.** No Apple Podcasts, Spotify, Google Podcasts, Amazon Music, YouTube, Overcast, Pocket Casts, or RSS links appear anywhere on the page. The only platform destination on the entire page is SoundCloud.
- Captured platform URLs, complete:
  - Series: `https://soundcloud.com/offthealgorithm`
  - Episodes 1-5: see the Section 4 links table.
- **This is a distribution gap, not just a design gap.** A podcast that is SoundCloud-only is invisible on the two platforms where most listening happens. Confirm with the business whether the show is actually syndicated to Apple/Spotify and the links were simply never added, or whether SoundCloud really is the only distribution channel. If feeds exist, add a subscribe row to the closing band on rebuild.

### Content issues (flag, do not fix)

- **Title tag is the single word `Podcast`.** No brand, no show name, no keywords. og:title and twitter:title inherit the same single word. This is the weakest title on any page extracted so far.
- **No meta description at all.** Google will synthesise one from the hero copy. og:description and twitter:description are likewise absent.
- **Heading level skip.** The document goes H1 -> H3 (five times) -> H2. The five episode H3s have no parent H2, and the only H2 on the page appears after them, so the outline reads as if the closing band were the parent of nothing. Recommend adding an H2 above the episode list (e.g. "Episodes") and either promoting the episode headings or keeping them as H3s under that new H2.
- **`EPISODE n` label lives inside the heading text.** Screen readers will announce "EPISODE 1 Better AI Engineers" as one heading. Acceptable, but if the label is purely decorative styling it belongs in a sibling element outside the heading, or in a `<span>` the heading component can style separately. Preserved verbatim either way.
- **Double space inside the episode headings** between the label and the title (`EPISODE 1  Better AI Engineers`). Preserved verbatim; almost certainly a styling artifact of two adjacent inline spans.
- **Hyphen used as a dash in the closing H2:** "AI, software engineering, and the future of technology - without the noise." The repo forbids the em dash character, so a spaced hyphen is acceptable here; noting only that it is punctuation doing dash duty. Preserved verbatim.
- **Comma splice in Episode 3 copy:** "Latin America isn't the next big thing in tech talent, it's happening right now." Preserved verbatim.
- **Ambiguous cadence claim:** "Every month we'll promote real, unfiltered discussions with top tech leaders...". "promote" is an odd verb where "publish" or "host" is presumably meant, and the future tense ("we'll") sits oddly on a page that already lists five published episodes. Preserved verbatim; flag for a copy pass.
- **Cadence claim vs reality.** The page promises monthly episodes but lists only five, with no dates. If the show has lapsed, the sentence is a live inaccuracy. Confirm before republishing.
- **Missing apostrophe in footer.** "Lets build better teams together" should be "Let's". Site-wide footer issue, not page-specific. Preserved verbatim.
- **Episode 1's guest titles are bare.** "CEO Boris Portman and CIO Marc Boudria" name no company. Boris Portman and Marc Boudria are presumably BetterEngineer's own CEO and CIO, but the page never says so, unlike Episode 3 which spells out "Director of Talent Operations at BetterEngineer". Inconsistent treatment of guest attribution across cards.
- **No episode metadata anywhere.** Not one episode has a duration, publish date, season, episode artwork, transcript, or show-notes link. For a podcast index page this is the largest content gap.
- **Trailing period inconsistency.** The closing H2 ends with a period; the H1 and all five episode H3s do not. Same inconsistency logged on `/latamengineer`. Recommend a single convention on rebuild.

### Missing assets or broken links

- **No `og:image`.** The page has og:title and og:url but no og:image, and twitter:card is `summary` rather than `summary_large_image`. **For a podcast page this is a notable miss** - podcast links get shared, and the show artwork is the obvious og:image. Fix on rebuild.
- **No `og:type`.** Should be `website` at minimum.
- **Asset extraction returned almost nothing and should not be trusted.** Exactly one `<img>` was surfaced for the whole page (the header hamburger icon). No logo, no series cover art, no episode thumbnails, no background images. The logo is definitely present visually on every other page, which proves the asset pass under-reported here. **Re-run asset discovery in a browser before rebuilding.**
- **Hamburger icon alt text conflicts across pages.** This page returned `Menu`; `/latamengineer` returned no alt for the identical asset. Shared header chrome should not differ. Verify which is current and normalise in the shared header component.
- **Episode 2's SoundCloud slug does not match its on-page title.** Page: "No More Blackbox: R&D ROI". Slug: `no-more-blackbox-measure-grow-rd-roi`. Not broken, but the titles have diverged between the site and SoundCloud.
- **Episode 4's SoundCloud slug is truncated mid-phrase:** `off-the-algorithm-when-to`. Page title is "When to Build, When to Buy, and When to Walk Away". Suggests the SoundCloud upload title was cut off. Not broken, but worth fixing at the source.
- **Episode 1's slug carries a date fragment:** `off-the-algorithm-podcast-series-episode-1-2-25`, which probably encodes a 2025-02-01 or 2025-01-02 publish date. This is the only date signal anywhere on the page and it is buried in a URL.
- **All five SoundCloud URLs should be link-checked.** None were fetched during extraction. External URLs on a third-party platform can rot silently.
- **No broken internal links detected**, but the same three destinations flagged on `/latamengineer` remain unverified: `/technical-glossary`, `/ebooks`, and `/careers/full-stack-javascript-engineer` (whose slug does not match its label).

### Questionable information needing business review

- **Three episode links carry SoundCloud's copy-to-clipboard UTM parameters** (`?utm_source=clipboard&utm_medium=text&utm_campaign=social_sharing`) and one additionally carries a share-session token (`&si=7245228fa2854064a2106b12d646b792`). These were pasted straight from SoundCloud's share button and never cleaned. They pollute the show's own analytics - every click from the website is attributed to "clipboard / social_sharing" instead of the site. **Recommend stripping the query strings on rebuild**, but this changes analytics attribution so it needs an owner's sign-off rather than a silent fix. Episodes 1 and 2 have clean URLs; 3, 4, and 5 do not. The inconsistency alone confirms it was unintentional.
- **The page is a conversion dead end.** Six body links, all of them outbound to a third-party platform, and zero in-body path to `/contact` or `/multi-step-contact-form`. A visitor who reads the whole page has no way to become a lead without using the nav. Confirm this is intentional (pure brand/awareness page) or add a CTA.
- **Calendly link is a personal handle on the predecessor brand:** `https://calendly.com/tim-salsamobi/30min`. Same finding as `/latamengineer`.
- **LinkedIn points to `linkedin.com/company/salsamobi`**, not a BetterEngineer company page. Facebook uses `BetterEngineerbySalsaMobi`. Instagram uses `betterengineer_`. Three different brand identities. Same finding as `/latamengineer`.
- **Privacy Policy URL contains `wpautoterms`.** Same finding as `/latamengineer`.
- **SoundCloud account ownership.** The show lives entirely on `soundcloud.com/offthealgorithm`, a handle that carries the show name rather than the company name. Confirm BetterEngineer controls that account and its RSS feed before making it the sole distribution dependency of the rebuilt page.
- **Guest names are published without visible consent records.** Dario Trevisani, Christopher Esplin, and Asaf Zamir are named with their titles and companies. Standard for a podcast, but worth confirming the release paperwork exists before republishing on a new platform.

### Special interactions

- **None detected.** No accordion, carousel, tabs, modal, video, audio player, animation, or dynamic listing was found. This is the simplest page extracted so far in interaction terms: it is a hero, a static list, and a text band.
- **Outbound-link handling needs a decision.** All six body links leave the site. Decide whether they open in a new tab (`target="_blank" rel="noopener noreferrer"`) - the legacy behaviour was not captured by the extraction and must be checked in the browser. For a podcast page, opening in a new tab is the conventional and probably desirable behaviour.
- **Cookie banner, chat widget, or other third-party overlays** - none surfaced, but text-based extraction routinely misses JS-injected chrome. Verify in a browser.

### Implementation considerations

- **Add `PodcastSeries` JSON-LD, and `PodcastEpisode` for each of the five episodes.** This is the single largest SEO win available on this page and the reason it was called out for follow-up. Caveats to hand to the SEO owner:
  - `PodcastSeries` needs `name` ("Off The Algorithm"), `description`, `url`, `image` (the missing cover art), and ideally `webFeed` (the SoundCloud RSS URL). **`image` and `webFeed` are both currently unavailable** and must be sourced before the schema can be complete.
  - `PodcastEpisode` needs `episodeNumber` (available), `name` (available), `description` (available), `partOfSeries` (available), and `associatedMedia`/`url` (available). It also wants `datePublished` and `duration`, **neither of which exists anywhere on the page** - they must be pulled from SoundCloud.
  - Recommendation: source the missing fields from the SoundCloud RSS feed at build time, which solves the schema gap and the on-page metadata gap in one move.
  - Note that `PodcastEpisode` markup pointing at audio hosted on a third party is weaker than markup pointing at self-hosted audio. Set expectations accordingly.
- **Add `og:image` (the show artwork) and switch `twitter:card` to `summary_large_image`.**
- **Rewrite the title tag.** `Podcast` should become something like the show name plus the brand. Coordinate with the SEO owner; do not silently change it as part of the migration.
- **Add a meta description.** None exists.
- **Fix the heading hierarchy** (H1 -> H3 skip) as described above.
- **Add a subscribe row** to the closing band once the platform feeds are confirmed.
- **Consider a data-driven episode list** (build-time JSON/YAML or SoundCloud RSS) rather than hardcoded markup, so monthly episodes do not require a code change each time.
- **Follow the repo build workflow.** Create the `main-podcast.html` fragment, reuse `footer-full.html`, add page styles to `styles/*.css`, then `npm run build`, `node build-discover-dist.js`, `npm run verify`.
- **Use root-relative asset paths** (`/images/pages/podcast/...`) per CLAUDE.md so nested routes resolve.
- **Do not introduce the em dash character** anywhere in this page's copy. The source copy is already clean on this point (it uses a spaced hyphen in the closing H2).
- **Preserve GTM `GTM-WT77L8JF`**, and verify the outbound-click trigger so SoundCloud click attribution survives the migration.
- **Keep the `/podcast` path.** It is linked from both the header and the footer site-wide. If it must change, ship a 301 and update both nav locations.

### Anything the extraction could not confirm

- **Whether a player embed exists in the rendered DOM.** This is the single most important open item. See the Embeds section above. **Marked BLOCKED until a browser check is done.** WebFetch's markdown conversion can drop iframes, and a JS-injected player is invisible to it outright.
- **The complete asset list.** Only one `<img>` was returned for the entire page. Cover art, episode thumbnails, the header logo, and any CSS background images are all unconfirmed. Assume the list in Section 3 is incomplete.
- **`og:image` and `og:type`** - not returned by the metadata pass. Cannot distinguish "absent" from "not surfaced by the fetch". Verify in the raw HTML head.
- **Whether the closing band's heading is an H2.** Pass 1's heading outline omitted it; passes 4 and 5 returned it, and pass 5 explicitly confirmed it as a heading rather than a paragraph. Recorded as H2 on two-of-three agreement, but confirm.
- **The exact inline structure of the episode headings** - whether `EPISODE n` is a `<span>` inside the H3 or two text nodes. The double space suggests two elements. Confirm in the CMS.
- **Whether episode cards carry artwork.** If they do, five more assets join the list and the card component needs an image slot.
- **`target` and `rel` attributes on the six outbound SoundCloud links.** Not captured. Check in the browser.
- **Social icon alt text / accessible names** - the three footer social links were returned by href with no anchor text captured. They may be icon-only links with no accessible name, which would be an a11y defect. Same finding as `/latamengineer`. Verify once in the shared footer component.
- **Whether the show is still publishing**, and whether more than five episodes exist on SoundCloud that the page has not been updated to list.
- **Extraction pass agreement:** five passes were run. All passes agreed on every word of body copy, all episode descriptions, all headings, and all hrefs. Three discrepancies required resolution: (a) pass 1 omitted the closing H2 that passes 4 and 5 returned - resolved in favour of its existence; (b) the asset pass returned a single image where the page must have more - resolved by marking the asset list incomplete rather than accepting it; (c) the hamburger icon's alt text differs from the value captured on `/latamengineer` - logged, unresolved.
