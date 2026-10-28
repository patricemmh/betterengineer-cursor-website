# Extraction Record: Contact

- Source URL: https://www.betterengineer.com/contact
- Legacy path: `/contact`
- Proposed new path: `/contact`
- Extracted: 2026-08-07
- Extraction method: WebFetch (live HubSpot page)
- Status: EXTRACTED

## 1. Source metadata

| Field | Value |
| --- | --- |
| `<title>` | `Contact BetterEngineer \| Connect with Our Team` |
| Meta description | `Get in touch with BetterEngineer to hire engineers or explore AI solutions. Start your project with expert guidance today.` |
| Canonical URL | `https://www.betterengineer.com/contact` |
| `og:title` | `Contact BetterEngineer \| Connect with Our Team` |
| `og:description` | `Get in touch with BetterEngineer to hire engineers or explore AI solutions. Start your project with expert guidance today.` |
| `og:url` | `https://www.betterengineer.com/contact` |
| `og:image` | Not observed |
| `twitter:card` | `summary` |
| `twitter:title` | `Contact BetterEngineer \| Connect with Our Team` |
| `twitter:description` | `Get in touch with BetterEngineer to hire engineers or explore AI solutions. Start your project with expert guidance today.` |
| `twitter:image` | Not observed |
| Robots directive | None specified (defaults to index, follow) |
| Viewport | `width=device-width, initial-scale=1` |
| Generator | `HubSpot` |
| H1 | `Are you ready to hire Better Engineers?` |
| Analytics | Google Tag Manager container `GTM-WT77L8JF` (noscript iframe `https://www.googletagmanager.com/ns.html?id=GTM-WT77L8JF`) |

### Existing structured data

None detected. No JSON-LD blocks were present in the delivered HTML.

Migration opportunity (not present on legacy page, do not treat as extracted content): a `ContactPage` and/or `FAQPage` JSON-LD block would be a reasonable addition on the rebuilt page, given the page is dominated by a Q&A block. Flagged in Migration Notes, not added here.

### Heading outline

| Level | Text |
| --- | --- |
| H1 | Are you ready to hire Better Engineers? |
| H3 | Frequently Asked Questions |
| H3 | Why should we use BetterEngineer? |
| H3 | Why should we consider hiring contractors vs. full-time employees? |
| H3 | What does it cost to get started with BetterEngineer? |
| H3 | Who can I expect to meet from BetterEngineer? |
| H3 | Where are your engineers located? |
| H3 | How long will it take for me to meet candidates from BetterEngineer? |
| H3 | How do I know that BetterEngineer will protect my company's IP? |
| H3 | What will it take for me to get started with BetterEngineer? |

Note: there is no H2 anywhere on the page. The page jumps H1 to H3, and the section label "Frequently Asked Questions" sits at the same level (H3) as each individual question. This is an accessibility/heading-hierarchy defect in the legacy markup; preserved here as observed and logged in Migration Notes.

## 2. Content (VERBATIM)

All copy below is reproduced verbatim from the live page. Spelling, punctuation, apostrophe use, and grammar are as found and have NOT been corrected.

### Section 1 — Hero (form section)

> Are you ready to hire Better Engineers?

> Our team will reach out to talk about your companies' specific needs and we can get started introducing you to candidates right away.

The contact form itself renders in this section but is injected client-side and is not present in the server-delivered HTML. See Section 5.

### Section 2 — Social proof / logo strip

> Trusted by 100+ Clients

Followed by a grayscale client logo row (see Section 3 for the image inventory).

### Section 3 — Frequently Asked Questions

> Frequently Asked Questions

> **Why should we use BetterEngineer?**
>
> Staff augmentation is an important part of building an agile development team. Once you meet and interview candidates that interest you (via our self-service platform), BetterEngineer handles the rest of the details in filling the contract position. We take care of the HR logistics, and payroll, and are here to facilitate your relationship with contractors for the long term.

> **Why should we consider hiring contractors vs. full-time employees?**
>
> There are several reasons that contractors are a better option for meeting your company's software needs. First and foremost, there is the potential to reduce staffing costs and provide access to a larger talent pool than may be available to you locally. BetterEngineer's fully remote model offers staffing solutions to meet your budget. This can help companies make strategic pivots, and meet short-term and contingent workforce needs on demand.

> **What does it cost to get started with BetterEngineer?**
>
> There is no initial cost to work with one of our account managers to figure out your staff augmentation needs. We will analyze your development goals, your budget, and your existing team to help determine the engineering talent you need. Our options include: Contract: Hire a new team member on a contract basis with terms that fit your needs. Contract-to-Hire: Hire a new team member now with the option to make it permanent in the future. Direct Hire: Pay a one-time recruiting fee and hire straight to your team from day one.

> **Who can I expect to meet from BetterEngineer?**
>
> The engineers in our talent pool are accomplished, senior software engineers who can provide value to a distributed development team. We don't just look at resumes, but thoroughly assess English language ability, cultural fit, and technical skills. Their level of expertise has been demonstrated and they have the skills you are looking for.

> **Where are your engineers located?**
>
> Although we work with talent throughout the world, the majority of our engineers are concentrated in Latin America, offering a nearshore solution for your outsourcing needs. Many of them share US time zones, as our largest pools of talent are in Colombia, Argentina, Brazil, and Costa Rica. Shared time zones and English fluency allow our engineers to integrate into your existing team easily.

> **How long will it take for me to meet candidates from BetterEngineer?**
>
> We pride ourselves on introducing you to pre-vetted talent as soon as possible. While some specialties may take longer than others to find a perfect match, we will generally present you with senior-level engineers within four days.

> **How do I know that BetterEngineer will protect my company's IP?**
>
> BetterEngineer utilizes standard forms of Confidentiality and non-competition agreements. All inventions, discoveries, developments, and innovations created by contractors (relative to the duties of the contract) are the exclusive property of the company that has contracted with BetterEngineer.

> **What will it take for me to get started with BetterEngineer?**
>
> Contact the BetterEngineer team today! Let's build better teams together.

Note: within the final FAQ answer, the string "Contact the BetterEngineer team today!" is rendered as a link element but no `href` value was resolvable in the delivered markup. See Section 4.

### Section 4 — Pre-footer CTA band

> Lets build better teams together

> Contact Us

> Schedule a Call

Note: "Lets" is missing its apostrophe in this band, while the near-identical sentence inside the last FAQ answer is spelled "Let's build better teams together." Both are preserved exactly as found. Logged in Migration Notes.

### Section 5 — Global footer

> Follow Us

> Our Services
>
> - Staff Augmentation
> - AI Readiness Assessment
> - Hiring Dashboard
> - Browse Roles
> - Browse by Technology

> About Us
>
> - Who We Are
> - Why Nearshore

> Industries
>
> - FinTech
> - MarTech
> - HealthTech

> Careers
>
> - See All Job Opportunities
> - Join Us
> - Sign Up

> In-Demand Jobs
>
> - Full-Stack Engineer
> - Front-end Engineer
> - Python Engineer
> - DevOps Engineer
> - Java Engineer
> - Data Science Engineer
> - QA Automation Engineer
> - Typescript Engineer

> Resources
>
> - Blog
> - FAQs
> - Ebooks
> - Podcast
> - Technical Glossary

> Case Studies
>
> - Live CGI
> - Wasteplace

> Copyright © 2026 BetterEngineer

Also present in the footer utility row: `Privacy Policy` and `Terms of Service` (see Section 4 links table).

### Section 6 — Global header navigation (labels)

> Staff Augmentation
> AI Readiness
> Platform
> Browse Roles
> Browse by Technologies
> AI Fluency
> Who We Are
> Why Nearshore
> Blog
> FAQs
> Podcast
> Join Us
> Hire Engineers
> Login

## 3. Assets

| Source URL | Proposed local filename | Alt text | Usage | Notes |
| --- | --- | --- | --- | --- |
| `https://www.betterengineer.com/hubfs/raw_assets/public/betterengineer/images/Icons/hamburger-icon-white.svg` | `/icons/hamburger-icon-white.svg` | `Menu` | Mobile nav toggle | Global header asset; likely already handled by the new site's shared header. Do not re-import if an equivalent exists. |
| `https://www.betterengineer.com/hubfs/raw_assets/public/betterengineer/images/assets/Mask%20Group%20132@2x.png` | `/images/contact/contact-hero-landscape.png` | `Stock placeholder image with grayscale geometrical mountain landscape` | Hero decorative image | Alt text literally says "Stock placeholder image" — this is placeholder art that shipped to production. Strong candidate for replacement or removal rather than migration. See Migration Notes. |
| `https://www.betterengineer.com/hubfs/raw_assets/public/betterengineer/images/assets/accenture-logo-grey@2x.png` | `/images/logos/accenture-logo-grey.png` | (none) | Client logo strip, "Trusted by 100+ Clients" | Missing alt text on legacy page. Add `alt="Accenture"` on rebuild. |
| `https://www.betterengineer.com/hubfs/raw_assets/public/betterengineer/images/assets/chapterspot-logo-grey@2x.png` | `/images/logos/chapterspot-logo-grey.png` | (none) | Client logo strip | Missing alt text on legacy page. Add `alt="ChapterSpot"` on rebuild. |
| `https://www.betterengineer.com/hubfs/raw_assets/public/betterengineer/images/assets/logos-black_0000_fambrands@2x.png` | `/images/logos/fambrands-logo-grey.png` | (none) | Client logo strip | Missing alt text on legacy page. Add `alt="FAM Brands"` on rebuild. Filename prefix `logos-black_0000_` is a Photoshop layer-export artifact; rename on import. |
| `https://www.betterengineer.com/hubfs/raw_assets/public/betterengineer/images/assets/logos-black_0008_dosh@2x.png` | `/images/logos/dosh-logo-grey.png` | (none) | Client logo strip | Missing alt text on legacy page. Add `alt="Dosh"` on rebuild. Same layer-export filename artifact. |
| `https://www.betterengineer.com/hubfs/raw_assets/public/betterengineer/images/assets/wasteplace-logo-grey@2x.png` | `/images/logos/wasteplace-logo-grey.png` | (none) | Client logo strip | Missing alt text on legacy page. Add `alt="Wasteplace"` on rebuild. |

Additional assets not enumerable via WebFetch: the BetterEngineer wordmark/logo in header and footer, and the social icons for LinkedIn / Facebook / Instagram. These are global chrome and are assumed already present in the new site's shared header and footer fragments.

Total distinct page-level assets captured: 7.

## 4. Links

Type key: `internal` = betterengineer.com www page, `subdomain` = another BetterEngineer host, `external` = third party, `app` = authenticated product.

| Anchor text | Href | Type | Migration note |
| --- | --- | --- | --- |
| (GTM noscript iframe) | `https://www.googletagmanager.com/ns.html?id=GTM-WT77L8JF` | external | Not a user-facing link. Confirm whether GTM container `GTM-WT77L8JF` is carried over or replaced by the new site's analytics. |
| (logo, header) | `https://www.betterengineer.com` | internal | Map to `/`. |
| Staff Augmentation | `https://www.betterengineer.com/staff-augmentation` | internal | Header nav (appears twice: desktop + mobile). Map to `/staff-augmentation`. |
| AI Readiness | `https://www.betterengineer.com/ai-readiness` | internal | Header nav. Map to `/ai-readiness`. |
| Platform | `https://www.betterengineer.com/hiring-dashboard` | internal | Header nav. Label "Platform" but path `/hiring-dashboard`; footer uses label "Hiring Dashboard" for the same URL. Preserve both labels. |
| Browse Roles | `https://discover.betterengineer.com/roles/` | subdomain | Points at the `discover` site. Confirm this stays external after migration. |
| Browse by Technologies | `https://discover.betterengineer.com/technologies/` | subdomain | Header label is "Browse by Technologies"; footer label is "Browse by Technology" (singular). Both preserved. |
| AI Fluency | `https://discover.betterengineer.com/ai-fluent-engineers/` | subdomain | Header nav only; not in footer. |
| Who We Are | `https://www.betterengineer.com/about` | internal | Map to `/about`. |
| Why Nearshore | `https://www.betterengineer.com/latamengineer` | internal | Label/path mismatch (`/latamengineer`). Decide whether to keep the legacy slug or redirect to a clearer one. |
| Blog | `https://blog.betterengineer.com/resource-center` | subdomain | Blog lives on a separate host under `/resource-center`. |
| FAQs | `https://www.betterengineer.com/faqs-nearshore-software-engineers-staff-augmentation-ai-talent` | internal | Very long keyword-stuffed slug. Consider a shorter canonical slug plus a redirect. |
| Podcast | `https://www.betterengineer.com/podcast` | internal | Map to `/podcast`. |
| Join Us | `https://www.betterengineer.com/join` | internal | Map to `/join`. |
| Hire Engineers | `https://www.betterengineer.com/multi-step-contact-form` | internal | Primary header CTA. Points to a SEPARATE multi-step contact page, not this page. Important: the site has two contact entry points. See Migration Notes. |
| Login | `https://app.betterengineer.com/sign-in?redirect_url=https%3A%2F%2Fapp.betterengineer.com%2F` | app | External product app. Preserve query string verbatim. |
| Contact the BetterEngineer team today! | (no resolvable href) | unknown | Inline link in the final FAQ answer with no href captured. Verify in browser and wire to the hero form anchor or `/contact`. |
| (logo, footer) `betterengineer` | `https://www.betterengineer.com` | internal | Map to `/`. |
| Contact Us | `https://www.betterengineer.com/contact` | internal | Self-referential link in the pre-footer CTA band (this page links to itself). Consider anchoring to the form instead. |
| Schedule a Call | `https://calendly.com/tim-salsamobi/30min` | external | Calendly link tied to an individual (`tim-salsamobi`) under the legacy SalsaMobi brand. Verify owner and brand before carrying over. |
| LinkedIn | `https://www.linkedin.com/company/salsamobi` | external | Legacy SalsaMobi company page. |
| Facebook | `https://www.facebook.com/BetterEngineerbySalsaMobi` | external | Legacy SalsaMobi-branded handle. |
| Instagram | `https://www.instagram.com/betterengineer_/` | external | |
| Staff Augmentation | `https://www.betterengineer.com/staff-augmentation` | internal | Footer, "Our Services". |
| AI Readiness Assessment | `https://www.betterengineer.com/ai-readiness` | internal | Footer label differs from header label ("AI Readiness"). Preserve both. |
| Hiring Dashboard | `https://www.betterengineer.com/hiring-dashboard` | internal | Footer, "Our Services". |
| Browse Roles | `https://discover.betterengineer.com/roles/` | subdomain | Footer, "Our Services". |
| Browse by Technology | `https://discover.betterengineer.com/technologies/` | subdomain | Footer, "Our Services". |
| Who We Are | `https://www.betterengineer.com/about` | internal | Footer, "About Us". |
| Why Nearshore | `https://www.betterengineer.com/latamengineer` | internal | Footer, "About Us". |
| FinTech | `https://www.betterengineer.com/fintech` | internal | Footer, "Industries". |
| MarTech | `https://www.betterengineer.com/martech` | internal | Footer, "Industries". |
| HealthTech | `https://www.betterengineer.com/healthtech` | internal | Footer, "Industries". |
| See All Job Opportunities | `https://www.betterengineer.com/careers` | internal | Footer, "Careers". |
| Join Us | `https://www.betterengineer.com/join` | internal | Footer, "Careers". |
| Sign Up | `https://app.betterengineer.com/sign-up/candidate` | app | Candidate signup in the product app. |
| Full-Stack Engineer | `https://www.betterengineer.com/careers/full-stack-javascript-engineer` | internal | Footer, "In-Demand Jobs". Label/slug mismatch (label omits "JavaScript"). |
| Front-end Engineer | `https://www.betterengineer.com/careers/front-end-engineer` | internal | Footer, "In-Demand Jobs". |
| Python Engineer | `https://www.betterengineer.com/careers/python-engineer` | internal | Footer, "In-Demand Jobs". |
| DevOps Engineer | `https://www.betterengineer.com/careers/devops-engineer` | internal | Footer, "In-Demand Jobs". |
| Java Engineer | `https://www.betterengineer.com/careers/java-engineer` | internal | Footer, "In-Demand Jobs". |
| Data Science Engineer | `https://www.betterengineer.com/careers/data-science-engineer` | internal | Footer, "In-Demand Jobs". |
| QA Automation Engineer | `https://www.betterengineer.com/careers/qa-automation-engineer` | internal | Footer, "In-Demand Jobs". |
| Typescript Engineer | `https://www.betterengineer.com/careers/typescript-engineer` | internal | Footer, "In-Demand Jobs". Label casing "Typescript" (not "TypeScript"); preserved. |
| Blog | `https://blog.betterengineer.com/resource-center` | subdomain | Footer, "Resources". |
| FAQs | `https://www.betterengineer.com/faqs-nearshore-software-engineers-staff-augmentation-ai-talent` | internal | Footer, "Resources". |
| Ebooks | `https://www.betterengineer.com/ebooks` | internal | Footer, "Resources". |
| Podcast | `https://www.betterengineer.com/podcast` | internal | Footer, "Resources". |
| Technical Glossary | `https://www.betterengineer.com/technical-glossary` | internal | Footer, "Resources". |
| Live CGI | `https://www.betterengineer.com/case-studies/livecgi` | internal | Footer, "Case Studies". Label "Live CGI" vs slug `livecgi`. |
| Wasteplace | `https://www.betterengineer.com/case-studies/wasteplace` | internal | Footer, "Case Studies". |
| Privacy Policy | `https://www.betterengineer.com/resource-center/wpautoterms/privacy-policy` | internal | Path contains `wpautoterms`, a WordPress auto-generated-terms plugin artifact left over from an earlier platform. Should be re-homed to a clean path with a redirect. |
| Terms of Service | `https://www.betterengineer.com/terms-of-service` | internal | Footer utility. |

Distinct link destinations: 41. Total link instances including duplicates: 69.

### Contact details on page

No email address, telephone number, or physical/office address appears anywhere on this page. The only direct-contact affordances are the embedded form and the Calendly link `https://calendly.com/tim-salsamobi/30min`. This is worth flagging: a page titled "Contact" that publishes no email, phone, or address.

## 5. Forms

### 5.1 Live form observed

The page is form-centric: the hero copy ("Our team will reach out to talk about your companies' specific needs and we can get started introducing you to candidates right away.") is written as lead-in text for a contact form sitting in the hero, and the page offers no alternative contact channel other than Calendly.

**However, the form could not be captured.** Four WebFetch passes against `https://www.betterengineer.com/contact` were run with progressively more targeted prompts, including a direct string search of the delivered source for `hsforms`, `js.hsforms.net`, `hbspt`, `portalId`, `formId`, `region`, `8679235`, `hs-form`, `forms.hsforms.com`, `meetings.hubspot.com`, `data-form-id`, `onFormSubmit`, and `iframe`. Results:

- **Zero** occurrences of any HubSpot forms identifier in the server-delivered HTML.
- **Zero** `input`, `select`, `textarea`, or `label` elements anywhere on the page.
- No submit button, no placeholder text, no consent or GDPR text.
- The only HubSpot signal present is `<meta name="generator" content="HubSpot">`.
- Google Tag Manager container `GTM-WT77L8JF` is present.

Conclusion: the form is **injected client-side** — either by the HubSpot forms embed script (`js.hsforms.net/forms/embed/v2.js` or the newer `/forms/embed/<portalId>.js`), by a `hs-form-frame` element hydrated after load, or by GTM. WebFetch converts pages to markdown and does not execute JavaScript, so script tags and their attributes are stripped before the content reaches the extraction prompt. **The field inventory below is therefore UNVERIFIED and must be confirmed against a rendered browser session or the HubSpot Forms UI before any rebuild work begins.**

A parallel probe of the sibling page `https://www.betterengineer.com/multi-step-contact-form` (the destination of the primary "Hire Engineers" header CTA) returned the same result: title `Find Top Software Engineering Talent – Find the Right Candidates`, H1 `Let's define your ideal engineer`, a "Book a Call" Calendly CTA, and **no form markup in the delivered HTML**. That page's multi-step form is also client-injected.

### 5.2 Field inventory

**STATUS: NOT CAPTURED — placeholder pending browser-rendered verification.**

| Field name | Label | Placeholder | Type | Required | Hidden | Notes |
| --- | --- | --- | --- | --- | --- | --- |
| UNKNOWN | UNKNOWN | UNKNOWN | UNKNOWN | UNKNOWN | UNKNOWN | No form fields present in server-delivered HTML. Form is JS-injected; WebFetch cannot execute JS. |

Anticipated-but-unconfirmed fields, based on the standard HubSpot contact-form defaults and on the rest of the BetterEngineer site's lead-capture pattern. **Treat every row as a hypothesis to verify, not as extracted content:**

| Field name (expected) | Confidence | Basis |
| --- | --- | --- |
| `firstname` | High | HubSpot default contact property; used by existing intake pattern. |
| `lastname` | High | HubSpot default contact property; used by existing intake pattern. |
| `email` | High | HubSpot default; required on essentially every HubSpot form. |
| `company` | Medium | Hero copy says "your companies' specific needs", implying a company field. Not in the existing intake pattern. |
| `phone` | Medium | Common on B2B HubSpot contact forms. Not in the existing intake pattern. |
| `jobtitle` | Low | Common but unconfirmed. |
| `message` / `what_can_we_help_you_with` | Medium | Free-text field; existing pattern uses `message`. |
| `hs_context` | High | HubSpot embed scripts always inject this hidden field. |
| GDPR/consent checkbox | Low | No consent text appeared in the copy pass; HubSpot GDPR consent may be disabled for this portal. |

### 5.3 HubSpot integration details

| Item | Value |
| --- | --- |
| Portal ID (this page) | **NOT CAPTURED.** No `portalId` string in delivered HTML. |
| Form GUID | **NOT CAPTURED.** No `formId` / form GUID string in delivered HTML. |
| Region | **NOT CAPTURED.** No `region` parameter observed (HubSpot NA1 is the default). |
| Embed script tag | **NOT CAPTURED.** No `js.hsforms.net` reference survived markdown conversion. |
| `hbspt.forms.create(...)` call | **NOT CAPTURED.** |
| `hs-form-frame` element | **NOT CAPTURED.** |
| Iframe source | **NOT CAPTURED.** No iframe other than the GTM noscript iframe. |
| Submission endpoint (legacy) | Presumed `https://api.hsforms.com/submissions/v3/integration/submit/<portalId>/<formGuid>` via the HubSpot embed, but unverified. |
| Success behavior | **NOT CAPTURED.** No inline confirmation/thank-you text appears in the delivered HTML, and no separate thank-you URL was observed. Legacy behavior is most likely HubSpot's default inline message swap. Must be confirmed. |
| Tracking fired on submit | Google Tag Manager container `GTM-WT77L8JF` is present on the page. Whether a form-submission event/conversion tag fires is **NOT CAPTURED** and must be checked in GTM. HubSpot's own `__hstc`/`hubspotutk` analytics cookie tracking is presumed active given `generator: HubSpot`. |
| Portal ID (target, from existing new-site pattern) | `8679235` — this is the portal the rebuilt site already posts to. **Note: it was NOT found on the legacy page**, so it is unconfirmed whether the legacy `/contact` form writes to the same portal. |

**Required follow-up to close this section (blocking for the form rebuild):**

1. Open `https://www.betterengineer.com/contact` in a real browser and read the rendered DOM (or View Source with JS enabled) to capture the embed script, `portalId`, and form GUID.
2. Cross-check in the HubSpot UI: Marketing → Forms → locate the form embedded on `/contact` and export its field list, required flags, and consent settings.
3. Capture the post-submit behavior by submitting a test lead, and record the exact confirmation copy verbatim into Section 2.
4. Confirm whether the legacy portal is `8679235` or a different portal that needs a data migration.

### 5.4 Gap analysis vs the existing BetterEngineer intake-form pattern

The new site already ships a hand-built HTML form (custom frontend, HubSpot backend) posting to HubSpot Forms API portal `8679235` through a Cloudflare Worker proxy with Turnstile, wired by `intake-form-shared.js`. Its fields are:

- `firstname`
- `lastname`
- `email`
- `message`
- `company_website` (honeypot, must stay empty)
- hidden `utm_campaign`, `utm_content`, `utm_medium`, `utm_source`

**Maps cleanly (assuming the legacy form uses HubSpot defaults):**

| Legacy field (expected) | Existing pattern equivalent | Action |
| --- | --- | --- |
| `firstname` | `firstname` | Direct reuse. No work. |
| `lastname` | `lastname` | Direct reuse. No work. |
| `email` | `email` | Direct reuse. No work. |
| free-text message | `message` | Direct reuse if the legacy field is also `message`. If the legacy property is a custom one (e.g. `what_can_we_help_you_with`), either rename to `message` or add the custom property to the payload allowlist. |

**Needs new handling (no equivalent in the existing pattern):**

| Legacy field (expected) | Gap | Work required |
| --- | --- | --- |
| `company` | Not in `intake-form-shared.js` | Add input to markup, add to the Worker's allowed-field list, confirm the `company` contact property exists in portal 8679235. Low effort. |
| `phone` | Not in `intake-form-shared.js` | Add input plus validation/formatting, add to Worker allowlist. Consider whether phone should be optional to avoid depressing conversion. |
| `jobtitle` | Not in `intake-form-shared.js` | Only if confirmed present on the legacy form. |
| GDPR / consent checkbox | Not in `intake-form-shared.js` | If the legacy form has one, the consent text must be captured verbatim and the legal-basis fields (`hs_legal_basis` / communication subscription types) added to the submission payload. HubSpot consent objects are passed in the `legalConsentOptions` block, which the Worker proxy does not currently construct. Medium effort. |
| `hs_context` | Not applicable | The existing pattern posts directly to the Forms API rather than using the embed, so `hs_context` is not needed. The Worker should instead forward `hutk` (the `hubspotutk` cookie) plus `pageUri` and `pageName` in `context` to preserve HubSpot attribution. **Verify the Worker already does this — if not, this is a real analytics regression versus the legacy embed.** |

**Already better than legacy (keep, no legacy equivalent):**

- `company_website` honeypot and Cloudflare Turnstile — the legacy HubSpot embed relies on HubSpot's own spam handling. Keep both; no legacy parity work needed.
- Hidden `utm_campaign` / `utm_content` / `utm_medium` / `utm_source` — the legacy embed captured attribution via `hs_context` and cookies instead. The new explicit UTM fields are a superset, but confirm the corresponding contact properties exist in portal 8679235 or the values will be silently dropped.

**Must be configured manually in HubSpot (cannot be inferred from markup):**

1. Confirm/create contact properties for any new fields (`company`, `phone`, and the four UTM properties) in portal `8679235`.
2. Recreate any workflow, lead-routing, notification, or lifecycle-stage automation currently attached to the legacy form GUID. Form-triggered automation does not follow a field-level API submission unless it is retargeted to the new form GUID or converted to property-based triggers. **This is the single highest-risk item in the migration: silently losing lead routing means inbound leads stop reaching sales.**
3. Recreate the internal notification email that presumably fires on legacy submissions.
4. Decide the post-submit experience: inline confirmation (matching legacy) versus a dedicated thank-you page (better for conversion tracking in GTM).
5. Re-point or duplicate the GTM conversion tag so it fires on the new form's success callback rather than on the HubSpot embed's `onFormSubmitted` message event.

## 6. Page structure (logical, layout-independent)

1. **Global header** — logo linking to `/`; primary nav (Staff Augmentation, AI Readiness, Platform, Browse Roles, Browse by Technologies, AI Fluency, Who We Are, Why Nearshore, Blog, FAQs, Podcast, Join Us); primary CTA "Hire Engineers" → `/multi-step-contact-form`; secondary "Login" → app subdomain. Mobile variant duplicates the same link set behind the hamburger icon.
2. **Hero / form section** — H1 "Are you ready to hire Better Engineers?"; a single supporting paragraph; the contact form (client-injected, contents unverified); a decorative grayscale landscape image whose alt text self-identifies as a stock placeholder. This is the page's primary conversion unit.
3. **Social proof strip** — "Trusted by 100+ Clients" label above a row of five grayscale client logos (Accenture, ChapterSpot, FAM Brands, Dosh, Wasteplace), none of which carry alt text.
4. **FAQ block** — a "Frequently Asked Questions" label followed by eight question/answer pairs. Questions are marked up at the same heading level as the section label (H3). Presentation is presumed to be an accordion, though the delivered HTML gives no disclosure markup to confirm this; verify interaction pattern in browser.
5. **Pre-footer CTA band** — "Lets build better teams together" with two CTAs: "Contact Us" (self-referential, links back to this same page) and "Schedule a Call" (external Calendly).
6. **Global footer** — "Follow Us" with three social links; six link columns (Our Services, About Us, Industries, Careers, In-Demand Jobs, Resources) plus a Case Studies column; utility row with Privacy Policy and Terms of Service; copyright line.

Logical reading order for rebuild: header → hero+form → social proof → FAQ → CTA band → footer. The form should stay above the fold and above the FAQ; the FAQ functions as objection handling supporting the form, not as standalone content.

## 7. Migration notes

**Top 3 (blocking or highest risk)**

1. **The form itself was not captured, and it is the whole point of the page.** Four WebFetch passes found zero form markup, zero HubSpot form identifiers, and zero input elements — the form is JS-injected and WebFetch does not execute JavaScript. Portal ID, form GUID, field names, required flags, consent text, and confirmation copy are all still unknown. This record cannot be treated as complete until someone opens the page in a rendered browser and cross-checks the HubSpot Forms UI. Section 5.2's expected-field table is a hypothesis, not extracted content. Do not build against it.
2. **HubSpot-side automation is the real migration risk, not the markup.** Whatever workflows, lead routing, notification emails, and lifecycle-stage rules are attached to the legacy form GUID will not follow a Forms-API submission from the new hand-built form. If this is missed, the page will look fine and quietly stop delivering leads to sales. Audit and retarget this automation before cutover, and run an end-to-end test submission that a human confirms receiving.
3. **Two competing contact entry points exist.** This page (`/contact`) hosts one form, while the header's primary CTA "Hire Engineers" sends users to a completely separate page, `/multi-step-contact-form` (title "Find Top Software Engineering Talent – Find the Right Candidates", H1 "Let's define your ideal engineer"). Both are lead capture; both are HubSpot-backed; both are client-injected. Decide during migration whether the rebuilt site keeps two forms or consolidates to one, and make sure attribution and routing are not split across two forms in a way that breaks reporting.

**Content defects preserved verbatim (do not fix silently — raise with the copy owner)**

4. `Our team will reach out to talk about your companies' specific needs` — "companies'" is a plural possessive where "company's" (singular possessive) is intended. Preserved as found.
5. `Lets build better teams together` in the pre-footer CTA band is missing its apostrophe, while the near-identical line inside the last FAQ answer reads `Let's build better teams together`. Two spellings of the same phrase on one page. Both preserved.
6. `We take care of the HR logistics, and payroll, and are here to facilitate...` — awkward serial construction with a stray comma. Preserved.
7. The "What does it cost" answer flattens what is almost certainly a formatted list (Contract / Contract-to-Hire / Direct Hire) into a single run-on paragraph. This may be a markup-to-markdown extraction artifact rather than a genuine content defect — **verify in browser whether these three options are rendered as a list or as inline text**, and rebuild with the correct structure. Flagged as uncertain.
8. Footer label "Typescript Engineer" uses non-standard casing (correct form is "TypeScript"). Preserved.

**Structural and accessibility issues**

9. **No H2 anywhere on the page.** Heading level jumps H1 → H3, and the section label "Frequently Asked Questions" sits at the same level (H3) as each individual question, so questions are siblings of their own section header rather than children. Rebuild should use H2 for the section and H3 for each question.
10. **Five client logos ship with no alt text at all.** Proposed alt values are in Section 3; apply them on rebuild.
11. The hero image's alt text is literally `Stock placeholder image with grayscale geometrical mountain landscape` — placeholder art and placeholder alt text that reached production. Recommend replacing with real imagery or removing the image entirely rather than porting the placeholder forward.
12. The inline link `Contact the BetterEngineer team today!` in the final FAQ answer had no resolvable `href`. Either it is a dead link or the href did not survive extraction. Verify and wire it to the hero form anchor.
13. The "Contact Us" CTA in the pre-footer band links to `/contact` — this page linking to itself. On rebuild, make it an in-page anchor to the form.

**Brand, ownership, and legacy-platform artifacts**

14. Legacy SalsaMobi branding persists in three outbound links: LinkedIn `company/salsamobi`, Facebook `BetterEngineerbySalsaMobi`, and the Calendly link `calendly.com/tim-salsamobi/30min`. The Calendly link in particular is bound to one named individual. Confirm ownership and whether these should be rebranded before migration.
15. The Privacy Policy path `/resource-center/wpautoterms/privacy-policy` contains `wpautoterms`, an artifact of a WordPress auto-generated-terms plugin from a pre-HubSpot platform. Re-home to a clean path with a redirect.
16. Two client logo filenames (`logos-black_0000_fambrands@2x.png`, `logos-black_0008_dosh@2x.png`) carry Photoshop layer-export numbering. Rename on import per Section 3.
17. Several label/slug mismatches to resolve or document: "Platform" → `/hiring-dashboard`, "Why Nearshore" → `/latamengineer`, "Full-Stack Engineer" → `/careers/full-stack-javascript-engineer`, "Live CGI" → `/case-studies/livecgi`. The FAQs slug (`/faqs-nearshore-software-engineers-staff-augmentation-ai-talent`) is keyword-stuffed and should get a shorter canonical with a redirect.
18. Header and footer use different labels for the same destinations: "AI Readiness" vs "AI Readiness Assessment", "Platform" vs "Hiring Dashboard", "Browse by Technologies" vs "Browse by Technology". Both variants preserved in Section 4; pick one per destination on rebuild.

**SEO and metadata**

19. No `og:image` or `twitter:image` was observed, so social shares of this page render without a preview image. Add one on rebuild.
20. `twitter:card` is set to `summary` rather than `summary_large_image`. Consider upgrading once an image exists.
21. No JSON-LD on the page. Given eight Q&A pairs, `FAQPage` structured data plus `ContactPage` markup is a clear win. Note that the same FAQ content may appear on the dedicated `/faqs-...` page — if so, only one page should carry `FAQPage` markup to avoid duplication.
22. No robots directive is present, so the page indexes by default. Confirm that is intended.
23. Google Tag Manager container `GTM-WT77L8JF` is present. Confirm whether it carries over to the new site and, if so, that its form-conversion tag is re-pointed per Section 5.4.

**Content-source uncertainty**

24. The extraction passes did not disagree on any wording, so no conflict resolution was required for the body copy. The single substantive extraction gap is the form (notes 1 and 2), plus the possible list-flattening in note 7 and the missing href in note 12.
25. No email address, phone number, or office address appears anywhere on this Contact page. If the business wants a non-form contact channel, that is a net-new content decision for the rebuild, not a migration item.
