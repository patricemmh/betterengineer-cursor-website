# Content Follow-Ups

Everything here was found in approved live copy during extraction. **Nothing on this
list has been changed.** Copy is migrated verbatim. These items need a business or
content decision before anyone edits them.

Each item records: what it is, where it is, and what the decision is.

Last updated: 2026-09-08

Section 10 is the decision log. Items marked **Done** there are applied in the
fragments. Remaining blockers are approved numbers (CF-03, CF-04, CF-67), contact
form capture (CF-56, CF-57), and glossary QA Engineer sign-off (CF-63).

---

## 1. Blocking — needs a decision before the page can ship correctly

| ID | Page | Issue | Decision needed |
| --- | --- | --- | --- |
| CF-01 | LATAM Engineer | The section "Similar Time Zones & Real-Time Collaboration" appears **twice, back to back**, with identical heading, paragraph, and CTA. | **Done.** Duplicate deleted from `main-latamengineer.html`. |
| CF-02 | Join Us | The trait "AI-Enabled Mindset" appears **twice** with identical copy. | **Done 2026-09-08.** Duplicate sixth card removed from `main-join.html`. |
| CF-03 | Staff Augmentation | **Contradictory cost claims on the same page.** A differentiator card says "reducing costs by 42.8% on average". FAQ 11 says "Save 30-50% on Total Talent Costs". | Pick one number, or explain the difference. |
| CF-04 | LATAM Engineer | **Inconsistent savings claim**: "Save up to 50%" in one place, "30-50%" in another. | Same decision as CF-03. Should be one approved number site wide. |
| CF-05 | About | The hero paragraph contains **em dash characters**: "We take the hardest part of software development—finding top talent—and make it easy." | The repo forbids the em dash character and the build fails on it. Needs an approved rewrite, not a silent substitution. |
| CF-06 | Hiring Dashboard | **Em dashes in at least 5 places** in body copy. | Same as CF-05. |
| CF-07 | Join Us | **Em dashes in 5 places.** | Same as CF-05. |
| CF-08 | Hiring Dashboard | The **H1 and the first H2 are the identical sentence.** | RESOLVED 2026-08-24: dropped the duplicate H2 per content owner review. |
| CF-09 | About | **Two H1 elements**: the hero headline and "Our Leadership Team". | "Our Leadership Team" becomes an H2. This is a structural fix, not a copy change, so it is safe to do at build time. Logged for visibility. |

## 2. Copy quality — preserved, flagged

| ID | Page | Issue |
| --- | --- | --- |
| CF-10 | Staff Augmentation | "We do the heavylifting for you." "heavylifting" is not a word. It is an H2. |
| CF-11 | Staff Augmentation | "Our platform steps up beyond merely reviewing the tech expertise" reads awkwardly. |
| CF-12 | Staff Augmentation | "72 hours" is repeated five or more times on one page. |
| CF-13 | AI Readiness | "Ai-powered" miscapitalization. |
| CF-14 | AI Readiness | Missing terminal period on a sentence; a space before a question mark ("strategy ?"); a run-on missing a comma. |
| CF-15 | AI Readiness | Terminology drifts between "AI Readiness Assessment" and other names for the same offer. |
| CF-16 | AI Readiness | The title tag does not contain the page's own product name. |
| CF-17 | LATAM Engineer | Hero uses a hyphen where a dash is meant. FAQ 13 contains an en dash. Trailing periods on headings are inconsistent. "cost effective" is unhyphenated in an H2. |
| CF-18 | LATAM Engineer | FAQ 11 has list items that escaped the list markup. FAQ 7's five advantages are bare labels with no explanation. |
| CF-19 | Contact | "companies'" apostrophe error. "Lets" should be "Let's" in the CTA band (this also appears in `footer-full.html`). |
| CF-20 | Contact | The page has **no H2 at all**. |
| CF-21 | Join Us | Heading levels are invalid: an H4 sits above H3s, and the FAQ heading is an H3 while sibling sections use H2. |
| CF-22 | About | The FAQ heading is an H3 while sibling section headings are H2. Team member roles are H4s that precede the H3 name. |
| CF-23 | Staff Augmentation | Copy uses en dashes and an ellipsis character. |

## 3. Structural content questions

| ID | Page | Issue | Decision needed |
| --- | --- | --- | --- |
| CF-24 | About | Section 2 is a heading and an image with **no body copy**. Reads unfinished. | Supply copy, merge into the hero, or drop. Do not invent copy. |
| CF-25 | About | The five core values (Passionate Team Players, Result-Oriented Ownership, Giving Before Getting, Transparency and Respect, Data-Driven Decisions) exist **only inside FAQ answer 3**. | On an About page these arguably deserve their own section. Restructuring is a business decision. |
| CF-26 | About | Proof points (72 hours to present, 38 days time to hire, up to 42% cost savings, 21.3 months average tenure) appear **only inside FAQ answer 7**, with no stat block treatment. | Verify against `COPY_BRIEF.md` approved claims before promoting them. |
| CF-27 | About | The leadership roster has **no bios**, only name, role, headshot, and LinkedIn. | Add bios, or accept as is. |
| CF-28 | AI Readiness | "Our Expert Team" section **names no one** and shows no photos. | Add named experts, or accept. |
| CF-29 | AI Readiness | The page has **no testimonials, no client logos, and no stats**. | Consider adding shared social proof. Requires approved content. |
| CF-30 | AI Readiness | FAQ answer 6 pivots the page to staff augmentation. | Intentional cross sell, or a content error. |
| CF-31 | LATAM Engineer | FAQ 4 narrows the talent network to four countries while other pages describe "the Americas". | Align the claim. |
| CF-32 | LATAM Engineer | Page identity is ambiguous: the title and H1 target different keywords, and the page functions as both "Why Nearshore" and "Hire in LATAM". | Clarify the page's job before Phase 8 industries work. |
| CF-33 | Staff Augmentation | A testimonial names an individual engineer ("developers such as Javier"). | Confirm consent to keep the name. |
| CF-34 | Staff Augmentation | FAQ 11 contains the phrase "high-demand roles like Python developer hire", which reads as keyword stuffing. | Rewrite with approval, or accept. |

## 4. Brand and destination consistency

| ID | Scope | Issue | Decision needed |
| --- | --- | --- | --- |
| CF-35 | Site wide | **Legacy SalsaMobi brand leakage.** The Calendly link is `calendly.com/tim-salsamobi/30min` and the LinkedIn link is `linkedin.com/company/salsamobi`. These appear in `footer-full.html`, `intake-form-shared.js`, and every live page. | Rebrand the Calendly handle and LinkedIn page, or accept. Affects every page, so decide once. |
| CF-36 | Site wide | **Two competing contact entry points**: `/contact` and `/multi-step-contact-form`. The header CTA uses the multi step form, body CTAs on several pages use `/contact`, and the Contact page's own CTA band links back to itself. | Consolidate, or document which is used where and why. This also blocks the Phase 5 multi step form work. |
| CF-37 | Site wide | The Privacy Policy URL is `/resource-center/wpautoterms/privacy-policy`, a WordPress era artifact carried into HubSpot. | Decide the new slug. See `redirect-plan.md`. |
| CF-38 | AI Readiness | **Two scheduling systems in use**: a Reclaim.ai booking link in the body, Calendly in the footer. | Standardize. |
| CF-39 | Join Us | Links use both `/signup` and `/sign-up/candidate`. | Standardize. |
| CF-40 | Hiring Dashboard | Three CTA pairs with different labels point at the same URL ("Try It For Free" and "Create Your Job", "Hire in US Timezones" and "Start For Free"). | Differentiate the destinations or the labels. |
| CF-41 | Footer | The footer lists "Typescript Engineer" while the live footer also lists Java, Data Science, and QA Automation jobs that the local `footer-full.html` omits. | Sync `footer-full.html` with the live footer, or confirm the shorter list is intentional. |
| CF-42 | Footer | The local `footer-full.html` is missing the "Technical Glossary" resource link that the live footer has. | **Done.** Link is in `footer-full.html` (www URL until cutover) and role/tech chrome. |
| CF-43 | Footer | Copyright reads "Copyright © 2026 BetterEngineer" as a hardcoded string. | Make it build generated, or accept an annual edit. |

## 5. Content that needs a source

Unsourced or vaguely sourced claims found across Phase 1. All preserved verbatim.
None should be reused on new pages until sourced.

| ID | Claim | Pages |
| --- | --- | --- |
| CF-44 | "72 hours" to deliver vetted candidates | Staff Augmentation, LATAM, Contact, About |
| CF-45 | "reducing costs by 42.8% on average" | Staff Augmentation |
| CF-46 | "Save 30-50% on Total Talent Costs" | Staff Augmentation |
| CF-47 | "Reduce Time-to-Hire by 50-70%" | Staff Augmentation |
| CF-48 | "average tenure exceeding one year" / "21.3 months average tenure" | Staff Augmentation, About |
| CF-49 | "20% annual growth rate" and "over 2.6 million skilled engineers" in Latin America | Hiring Dashboard, LATAM |
| CF-50 | "38 days time to hire" and "up to 42% cost savings" | About |
| CF-51 | "4-6 weeks" assessment delivery commitment | AI Readiness |
| CF-52 | "decades of hands-on experience in AI, machine learning" | AI Readiness |
| CF-53 | "Trusted by 100+ Clients" | Contact |

Compare against the approved proof points in `COPY_BRIEF.md` before any of these
appear on a newly written page. Technology pages already model the right pattern:
every stat carries `{text, source, url}` and `tools/verify-links.js --external`
checks that the source URL still resolves.

## 6. Dynamic content decisions

| ID | Pages | Issue | Decision needed |
| --- | --- | --- | --- |
| CF-54 | AI Readiness, LATAM, Join Us | Each ends with a **live HubSpot blog feed** showing the three latest posts with tag, title, author, date, and excerpt. A static build cannot render this dynamically. | **Wired.** `build-blog-feed.js` fetches HubSpot RSS at build time, caches `data/blog-feed.json`, and `build-pages.js` injects `.post-card`s. A failed fetch reuses the cache. New posts appear after the next build. |
| CF-55 | AI Readiness | The **whitepaper download mechanism is unconfirmed.** One extraction pass reported a "Download our FREE Whitepaper" button, a follow up pass found no button or href. Likely a JavaScript injected HubSpot form invisible to the extractor. | Needs a rendered browser pass, plus the gated asset itself. Blocks the AI Readiness page from being fully complete. |
| CF-56 | Contact | The **contact form fields could not be captured.** Four extraction passes, including direct string searches for `hsforms`, `hbspt`, `portalId`, `formId`, and `hs-form`, found no form markup. The form is JavaScript injected. | Needs a rendered browser pass plus a cross check in the HubSpot Forms UI. **This blocks the Contact page.** |
| CF-57 | Contact | HubSpot workflows and lead routing attached to the legacy form GUID **will not follow** an API submission through the new pattern. | Confirm which workflows are attached to the legacy Contact form and re-point them, or leads silently stop reaching sales. This is the highest risk item in Phase 1. |

## 7. Copy added during the rebuild (not from the source page)

Only one item. Everything else on every migrated page is source copy.

| ID | Page | Added text | Why | Decision needed |
| --- | --- | --- | --- | --- |
| CF-58 | All 7 Phase 1 pages | An FAQ section eyebrow label: `STAFF AUGMENTATION FAQ`, `AI READINESS FAQ`, `HIRING PLATFORM FAQ`, `ABOUT BETTERENGINEER FAQ`, `NEARSHORE HIRING FAQ`, `CONTACT FAQ`, `JOIN BETTERENGINEER FAQ` | The canonical FAQ component, taken from the technology pages, includes an eyebrow above the heading. Without it the section does not read as the same component. | Approve the wording, or supply your own. Each is one line in the fragment, marked with a `<!-- MIGRATION CF-58 ... -->` comment, and can be deleted without touching anything else. |

The FAQ headings themselves are unchanged source copy.

## 8. Capitalization convention conflict

| ID | Scope | Issue | Decision needed |
| --- | --- | --- | --- |
| CF-59 | All 7 Phase 1 pages | The technology and role pages use **sentence case** for every on-page heading (`Hire senior OpenAI API engineers in your time zone.`, `Our simple hiring path`) and **Title Case** only in the `<title>` tag. The migrated pages use **Title Case headings** throughout, because that is the verbatim source copy. The two families read differently side by side. | Either (a) keep source capitalization and accept the difference, (b) convert migrated headings to sentence case, which is an edit to approved, indexed copy on roughly 60 headings, or (c) convert only headings that are not primary ranking targets. The convention itself is now written down in `DESIGN.md` under "Copy conventions". |

Examples of what would change under option (b): "Leverage AI to Solve Your Toughest
Challenges." becomes "Leverage AI to solve your toughest challenges.";
"Find the Right Skillset for Your Projects." becomes "Find the right skillset for your
projects."; "Our Process: What to Expect." becomes "Our process: what to expect."
Title tags and eyebrows would not change.

## 9. Phase 2 follow-ups

| ID | Page | Issue | Decision needed |
| --- | --- | --- | --- |
| CF-60 | Podcast | The live page's `<title>` is the single word "Podcast" and it has **no meta description at all**. Both were written for the rebuild, since there was no source text to preserve. | Approve the title "Off The Algorithm \| The BetterEngineer Podcast" and the description in `data/pages.js`, or supply your own. |
| CF-61 | Podcast | **The audio player could not be captured.** Five extraction passes found only outbound SoundCloud links, no iframe, no `<audio>`, no player script. The page is built with the outbound links as found. | Verify in a browser whether a player is JavaScript-injected. If one exists it needs a real embed. Also: three episode URLs carry SoundCloud clipboard UTM parameters and a share token that pollute attribution. |
| CF-62 | Ebooks | Both downloads are **ungated direct links** to HubSpot-hosted PDFs. Nothing maps onto the existing intake-form pattern, which shows a success message rather than serving a file. | Decide whether these should be gated. If yes, it needs a new gated-download flow, and the PDFs must move, because the current URLs are publicly guessable and any gate would be bypassable. |
| CF-63 | Glossary | **The `QA Engineer` entry publishes Python's definition verbatim.** Two independent extraction passes confirmed it. The real definition does not exist on the live page. | This is a live content incident, not just a migration issue. Someone needs to write the QA Engineer definition. |
| CF-64 | Glossary | `Selenium WebDriver` and `WebDriver (Selenium WebDriver)` are **byte-identical duplicate entries**. `Vanilla JavaScript` is out of alphabetical order on the live page (the generator now sorts it correctly). | Delete one of the duplicates, or differentiate them. |
| CF-65 | Glossary | Five definitions contained em dash characters, replaced with commas or colons per the standing rule. Wording unchanged. Each is marked with a `note` field in `data/glossary.js`. | Approve the substitutions. |
| CF-66 | FAQs | A production signup link on the live page carries a **leaked HubSpot preview parameter** (`?hs_preview=ZKiKAtZX-196806927364`). | **Done 2026-09-08.** Stripped. Target is `https://app.betterengineer.com/sign-up/hiring-manager`. |
| CF-67 | FAQs | The page's own claims contradict other pages: "72 hours" here vs "within four days" on `/contact`, and four different savings figures across the site (42%, 30-50%, 50-70%, up to 50%). | Same decision as CF-03 and CF-04. There should be one approved number. |

---

## 10. Decisions taken 2026-08-07

| ID | Decision | Status |
| --- | --- | --- |
| CF-01 | Delete the duplicated LATAM "Similar Time Zones" section | **Done.** Removed from `main-latamengineer.html` |
| CF-02 | Delete the duplicated Join Us "AI-Enabled Mindset" trait | **Done 2026-09-08.** Removed from `main-join.html` (was still in the fragment after the 08-07 log). |
| CF-64 | Delete the duplicate glossary entry, keep `Selenium WebDriver` | **Done.** Glossary is now 70 terms |
| CF-05, CF-06, CF-07, CF-65 | Approve the 14 em dash replacements. Wording unchanged | **Approved** |
| CF-58 | Approve the FAQ eyebrow labels on all 7 Phase 1 pages | **Approved** |
| CF-60 | Approve the written podcast title and meta description | **Approved** |
| CF-63 | QA Engineer definition written for the migration, not migrated | **Drafted, needs sign-off.** Marked with a `note` in `data/glossary.js` |
| CF-59 | Keep source capitalization on migrated pages | **Decided.** Convention documented in `DESIGN.md` |
| SEO-12 | `FAQPage` schema only on `/faqs-...`. Visible FAQs stay on every page | **Done.** `faqSchema: false` on all 7 Phase 1 records |
| CF-54 | Fetch the blog RSS at build time | **Wired.** `build-blog-feed.js` writes `data/blog-feed.json`; pages use `<!--BLOG_FEED:...-->` tokens |
| CF-62 | Keep both ebooks ungated with crawlable PDF links | **Decided.** See FW-01 and FW-02 below |
| CF-61 | Podcast stays as outbound SoundCloud links, no embedded player | **Decided.** See FW-03 below |
| CF-35 | SalsaMobi Calendly and LinkedIn stay; account-level change | **Logged as a business task** |
| CF-36 | Two contact entry points; decide during Phase 5 | **Deferred to Phase 5** |
| CF-03, CF-04, CF-67 | Standardize the cost and speed claims | **Blocked on the approved numbers** |

## 11. Future work recorded, not implemented

| ID | Item | Why |
| --- | --- | --- |
| FW-01 | **Build a public HTML resource page for each ebook.** Substantial content from the ebook itself: introduction, key ideas, chapter summaries, selected sections, with the complete PDF as an optional download. | A PDF alone gives Google very little to associate with the brand. An HTML page with real content ranks, earns links, and gives the PDF somewhere to be discovered from. This is the highest-value item on this list. |
| FW-02 | **Host the ebook PDFs on the BetterEngineer domain** rather than HubSpot. | Keeps the content and any links it earns on the domain we are migrating to, instead of one we are migrating off. |
| FW-03 | **Podcast audio format for SEO and AEO.** Currently five outbound SoundCloud links and nothing else. | Recommended, in order of value: (1) **an episode transcript on the page.** Audio is invisible to search engines and to answer engines; a transcript is the only way the content becomes indexable and quotable, and it is by far the biggest win here. (2) `PodcastEpisode` schema, which needs artwork, durations, dates, and a feed URL that do not currently exist. (3) An embedded player, which improves engagement but contributes nothing to indexing. Point (1) alone would likely outperform the entire rest of the page. |
| FW-04 | **The FAQ page's 53 answers contain only 7 links**, and no answer links to its matching service page. | Large internal-linking opportunity on the page with the most on-page text. |

## 12. Blog feed

Wired. `build-blog-feed.js` fetches:

- latest: `https://blog.betterengineer.com/resource-center/rss.xml`
- AI: `https://blog.betterengineer.com/resource-center/tag/artificial-intelligence/rss.xml`
- Join: `https://blog.betterengineer.com/resource-center/tag/for-candidates/rss.xml`

It writes `data/blog-feed.json`. `build-pages.js` replaces `<!--BLOG_FEED:latest|ai|join-->` in the page fragments. A failed fetch reuses the cache. Featured images stay on the HubSpot CDN. New posts show up after the next `npm run build`.
