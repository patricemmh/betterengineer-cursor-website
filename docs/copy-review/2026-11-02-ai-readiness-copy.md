# Copy review: claims, homepage readability, two page openings (2026-11-02)

Status: **draft for Patrice to review. Nothing here is applied.** No site source file was edited, nothing was built, committed, or pushed. After you approve a section, the edits go into the source files listed below, then `npm run build`, then the normal review before push.

Update 2026-11-02: approved changes are applied on the review branch `copy-review-2026-11-02` only (not pushed, not deployed). `preview/copy-review-2026-11-02.html` lists every change, before and after, and what was left out.

Primary ICP for every draft below: **established companies (50 to 500 employees), read by a VP Engineering or CTO.** Per the 2026-11-02 decision, the savings claim is **44%**, the speed claim is **72 hours**, and 42.8%, 30 to 50%, up to 50%, 50 to 70%, and "within four days" are retired.

This file lives in `docs/`. Neither `build-www-dist.js` nor `build-pages.js` copies `docs/` into `dist-www` or the site root, so it cannot ship.

---

## 1. Summary of what would change

- **21 claim edits on pages that ship on www**, in 6 sources: homepage stat labels (3), Contact (1), FAQs (3), Staff Augmentation (2), LATAM Engineer (2), and 10 hand-built role pages (1 each).
- **1 template edit** that does not ship but seeds future role pages: `roles/roles-template/index.html`.
- **1 held-back page** with an old claim: SecureLink case study ("Up to 3x cost savings"). It is in Experiments, so it stays held back.
- **1 doc fix**: `COPY_BRIEF.md` still lists "42.8% average first-year hiring cost savings" as an approved proof point. Every future copy pass will pull 42.8% from it until it says 44%.
- **Homepage readability rewrite** in 5 sections (hero, AI readiness, talent cards, LATAM, Slack) plus 3 stat labels. Section structure and markup stay the same. The Troutwood testimonial and all other customer quotes are untouched.
- **New openings** for `/latamengineer/` and `/staff-augmentation/`.

**Does 44% exist today? Yes, in many places.** CF-03 was partly applied already. 44% is live on the homepage stat, About, FAQs (one answer), the Staff Augmentation "Cost-Effective Solutions" card, `/ai-fluent-engineers/`, the fintech, martech, and healthtech stat strips (`data/canonical-metrics.js`), every generated technology page (`build-tech-pages.js` and `data/technologies.js`), and the held-back `/hire-software-engineers-in-72-hours/`. The leftovers are the role pages (42%), the FAQ and Staff Augmentation "Is it worth it" answers (30 to 50% and 50 to 70%), and the LATAM page (up to 50% and 30 to 50%).

**72 hours is already the speed claim almost everywhere.** The only "four days" left on a shipped page is the Contact FAQ.

---

## 2. Claims table

Scope: shipped source only (`main-*.html`, `footer-full.html`, `data/*.js`, `build-*.js`, `fragments/`, hand-built `roles/*/index.html`). Excluded: `docs/`, `tools/archive/`, generated root HTML, and HTML comments. `footer-full.html` has no claims.

### 2a. Changes on shipped pages

| # | File | Line | Current text | Proposed text |
| --- | --- | --- | --- | --- |
| 1 | `main-home.html` | 170 | 72 / "Avg hours to vet BetterEngineer profiles" | 72 / "Average hours to present vetted candidates" (matches the approved proof point: 72 hours to present initial candidates) |
| 2 | `main-home.html` | 176 | 44% / "Avg 1st year cost saving vs US equivalent" | 44% / "Average first-year hiring cost savings vs. U.S. hires" |
| 3 | `main-home.html` | 180 | 21 / "Months of average engineer duration" | 21 / "Months average engineer tenure" (approved figure is 21.3; keep 21 or show 21.3, your call) |
| 4 | `main-contact.html` | 133 | "While some specialties may take longer than others to find a perfect match, we will generally present you with senior-level engineers within four days." | "We will generally present senior-level engineers within 72 hours. Some specialties take longer to match." |
| 5 | `main-faqs.html` | 101 | "Faster Hiring (Reduce Time-to-Hire by 50-70%)<br>Traditional hiring cycles can take 8-12 weeks or more. With our ready-to-go network of vetted engineers, companies typically receive candidates within 72 hours." | "Faster hiring<br>You see vetted candidates within 72 hours. On average, clients hire in 38 days." |
| 6 | `main-faqs.html` | 102 | "Cost Efficiency (Save 30-50% on Total Talent Costs)<br>Nearshore outsourcing enables substantial savings compared to U.S.-based hires. Clients see cost reductions not just in salaries, but also in recruiting, onboarding, and HR overhead." | "Cost efficiency (44% average savings)<br>Clients save 44% on average on first-year hiring costs compared with a U.S. hire. The savings cover salary and the recruiting, onboarding, and HR work we take on." (see open question 2 before approving the second sentence) |
| 7 | `main-faqs.html` | 316 | "On average, Latin American developers earn <strong>50-70% less</strong> than U.S.-based engineers in equivalent roles. This cost difference is one of the main reasons U.S. companies hire nearshore technical talent." | "Salaries vary by country, seniority, and stack. BetterEngineer clients save <strong>44%</strong> on average on first-year hiring costs compared with hiring the same role in the U.S." (see open question 3) |
| 8 | `main-staff-augmentation.html` | 504 | Same text as row 5 | Same as row 5 |
| 9 | `main-staff-augmentation.html` | 505 | Same text as row 6 | Same as row 6 |
| 10 | `main-latamengineer.html` | 206 | "Save up to 50% without sacrificing the quality." (h3) | "Save 44% on first-year hiring costs, with senior engineers only." |
| 11 | `main-latamengineer.html` | 339 | "Cost savings (30-50% vs. U.S. averages)" | "Cost savings (44% on average in first-year hiring costs vs. U.S. hires)" |
| 12 | `roles/ai-engineers/index.html` | 148 | "On average, save 42% in first-year hiring costs compared to U.S. hires while keeping a senior-only talent bar." | "On average, save 44% in first-year hiring costs compared to U.S. hires while keeping a senior-only talent bar." |
| 13 | `roles/back-end-engineers/index.html` | 148 | Same as row 12 | Same as row 12 |
| 14 | `roles/data-engineers/index.html` | 148 | Same as row 12 | Same as row 12 |
| 15 | `roles/data-science-engineers/index.html` | 148 | Same as row 12 | Same as row 12 |
| 16 | `roles/devops-engineers/index.html` | 148 | Same as row 12 | Same as row 12 |
| 17 | `roles/full-stack-engineers/index.html` | 148 | Same as row 12 | Same as row 12 |
| 18 | `roles/mobile-engineers/index.html` | 148 | Same as row 12 | Same as row 12 |
| 19 | `roles/qa-engineers/index.html` | 148 | Same as row 12 | Same as row 12 |
| 20 | `roles/front-end-engineers/index.html` | 35 | "On average, save $107,000 per engineer in the first year, 42% less than U.S. hiring. You get world-class senior talent, not trade-offs or short-cuts." | "On average, save 44% on first-year hiring costs compared to U.S. hiring. You get senior talent, not trade-offs or short-cuts." (drops $107,000 until it has a source, see open question 4) |
| 21 | `roles/blockchain-engineers/index.html` | 31 | Same as row 20 | Same as row 20 |

Notes on the table:

- **FAQ schema follows automatically.** `/faqs-nearshore-software-engineers-staff-augmentation-ai-talent/` is the only page with `faqSchema: true`, and its JSON-LD is built from the fragment. Rows 5 to 7 update the schema answer text on the next build. Role-page JSON-LD only contains the 72-hour answer, which is already compliant.
- **Blockchain is derived from front-end.** `build-blockchain-page.js` copies the front-end role page and swaps strings. The 42% card is inherited, so edit both pages, or edit front-end and re-run the script. The script does not touch that card, so it will not break.
- **Meta descriptions:** none of the meta descriptions in `data/pages.js` carry a savings number or "four days". No change needed for claims.

### 2b. Template (does not ship)

| File | Line | Current text | Proposed text |
| --- | --- | --- | --- |
| `roles/roles-template/index.html` | 35 | "On average, save $107,000 per engineer in the first year, 42% less than U.S. hiring." | Same as row 20. The `create-role-page` skill copies this template, so every new role page will ship 42% until it is fixed. |

### 2c. Held back (Experiments): flag only, do not publish

| File | Line | Current text | Note |
| --- | --- | --- | --- |
| `data/case-studies.js` (builds `fragments/case-studies/securelink.html`) | 176 (fragment line 77) | "Up to 3x cost savings vs. U.S. salaries without sacrificing quality" | SecureLink is in Experiments. Proposed: "44% average first-year hiring cost savings vs. U.S. hiring." This stays held back until you promote the page. |
| `main-hire-software-engineers-in-72-hours.html` | 5, 136, 137, 155 | "in 72 hours" and "44% Avg first-year cost savings vs. U.S. hiring" | **No number change needed.** Both claims already match. The URL and experiment copy are out of scope and stay held back. |

### 2d. Found, no change proposed

| File | Line | Text | Why no change |
| --- | --- | --- | --- |
| `data/case-studies.js` / `fragments/case-studies/livecgi.html` | 11, 16, 56 / 50, 54 | "40% Cost Savings", "40% reduction in engineering costs" | This is one client's result, not the company average. Keep it unless you say otherwise (open question 5). |
| `main-hire-ai-ready-engineers.html` (ships as `/ai-fluent-engineers/`) | 203, 449 | "44% avg savings, about $107K per hire per year" and a "$107K" stat card | 44% is correct. $107K needs a source (open question 4). |
| `main-roi.html` | 25 | "46% lower than onshore rates" | `/roi` 301s to `/staff-augmentation/`. This fragment is not in the page manifest and does not ship. |
| `main-ai-readiness.html` | 92 | "substantial cost savings" | General statement about AI, not a BetterEngineer number. A candidate for a later hype pass. |
| `data/technologies.js` | 2474 | "roughly 44 percent of developers" | Stack Overflow survey stat about TypeScript usage, not a savings claim. |
| All 72-hour mentions (about 300 in `data/technologies.js`, plus role pages, industries, case studies, hiring dashboard, staff augmentation, AI-fluent) | many | "within 72 hours", "in as little as 72 hours", "about 72 hours", "often in 72 hours" | The number is already right everywhere. The wording varies (open question 6). |
| `COPY_BRIEF.md` (doc, not shipped) | 45 | "42.8% average first-year hiring cost savings." | Should read "44% average first-year hiring cost savings." Not edited here because you asked for a review only. |

---

## 3. Homepage before and after (`main-home.html`, builds `index.html`)

Confirmed in `data/pages.js`: slug `home`, fragment `main-home.html`, output `index.html`.

One correction to the brief: the sentence "Partner with talented, ambitious engineers who will push the boundaries of your technology and drive success." sits in the **"The talent you need"** section header, not in the LATAM section. The LATAM section already reads differently ("Work with senior software engineers across Latin America in overlapping U.S. hours..."). Both are covered below.

### 3a. Hero (`#hero`)

H1 unchanged: "Better AI Native Engineers. Better Results."

**Before (lead, 31 words)**
> We build relationships with exceptional AI native software engineers throughout the Americas. Scale your team with senior engineers to fit your culture and time-zone, for better results.

**After (lead, 37 words)**
> We place senior, AI-fluent engineers from Latin America on U.S. software teams. You see vetted profiles in 72 hours, and every engineer works your hours. Clients save 44% on first-year hiring costs, on average.

Covers what we do, for whom, how fast, time zones, and cost in the first two lines. Vetting detail is in the AI Fluency section directly below the logos.

Alternate if you would rather keep cost out of the hero and lead with vetting:
> We place senior, AI-fluent engineers from Latin America on U.S. software teams. Each one is vetted for technical depth and communication. You see profiles in 72 hours, and they work your hours.

Section Flesch: 51.2 before, 67.6 after.

### 3b. AI readiness (`#ai-readiness`)

Left H2 unchanged: "Identify practical opportunities to apply AI in high-impact work."

**Before (lead)**
> Get on-demand access to AI experts who will analyze your current capabilities, identify opportunities, and create a tailored roadmap for your success.

**After (lead)**
> In 4 to 6 weeks, we interview your stakeholders, review your workflows, and rank where AI will pay off first. You get an executive readout and a roadmap your team can act on.

Source for each detail: the `/ai-readiness/` page (4 to 6 week duration in its FAQ, stakeholder discussions and workflow review in "Information Gathering", prioritization in "Analysis and Prioritization", "Executive Summary and Readout").

**Before (right H2)**
```html
<span class="accent">Empower</span> Your Projects with our <span class="accent">AI Readiness Assessment.</span>
```

**After (right H2)**
```html
Know where AI fits <span class="accent">before you staff for it.</span>
```

Eyebrow "Services / AI Readiness" stays, so the service name is still visible.

**Before (button):** "Discover Your AI Solutions"
**After (button):** "See How the Assessment Works"

Section Flesch: 26.5 before, 69.2 after. This was the lowest-scoring section.

### 3c. The talent you need (`#skills`)

H2 unchanged: "The talent you need."

**Before (lead)**
> Partner with talented, ambitious engineers who will push the boundaries of your technology and drive success. We specialize in a wide range of tech skills.

**After (lead)**
> Hire senior engineers by role. Every candidate passes technical, communication, and AI fluency checks before you see a profile.

Card text. Card titles, links, and the Featured badge stay the same. Each card now starts with a verb and names the work, not a stack of nouns.

| Card | Before | After |
| --- | --- | --- |
| AI engineers | LLMs, RAG, vector databases, and production AI workflows beyond demo-stage prototypes. | Move LLM and RAG features from demo to production inside your existing stack. |
| Full stack engineers | Senior engineers for end-to-end product work across React, Node.js, TypeScript, APIs, and cloud deployment. | Own features end to end, from the React front end to the Node.js API and the deploy. |
| Front-end engineers | Hire vetted senior front-end engineers for React, TypeScript, and design systems with U.S. hours overlap. | Build React and TypeScript screens that follow your design system and pass review. |
| Back end engineers | APIs, microservices, databases, and scalable cloud systems from vetted nearshore senior engineers. | Design APIs, services, and databases that hold up as your traffic grows. |
| Mobile engineers | iOS, Android, React Native, and Flutter talent for apps that ship reliably through store review. | Ship iOS and Android apps in native code, React Native, or Flutter, and get them through store review. |
| Data engineers | Pipelines, warehouses, Airflow, dbt, and Spark expertise for dependable data infrastructure. | Build data pipelines your reports can trust, with tools like Airflow, dbt, and Spark. |
| Data science engineers | Machine learning, experimentation, and predictive analytics that connect to real product decisions. | Run experiments and build models that answer real product questions. |
| DevOps engineers | CI/CD, Kubernetes, AWS, monitoring, and automation for safer, faster releases. | Set up CI/CD, Kubernetes, and monitoring so your team can release often and roll back safely. |
| QA engineers | Manual QA, Cypress, Playwright, and API testing to raise release confidence. | Write Cypress, Playwright, and API tests, and run manual checks before each release. |

Tradeoff: the old cards carried more stack keywords (vector databases, microservices, warehouses, AWS, Swift/Kotlin names). The role pages they link to still carry those terms, so SEO coverage stays on the target pages. If you want a keyword back on any card, it fits without hurting the score much.

Section Flesch: 40.5 before, 66.2 after.

### 3d. LATAM (`#latam`)

Heading, location line, and button unchanged.

**Before**
> Work with senior software engineers across Latin America in overlapping U.S. hours. You get global reach with day-to-day collaboration that feels local.

**After**
> Our engineers live in Argentina, Brazil, Colombia, and Costa Rica and work U.S. business hours. They join your standups, code reviews, and Slack threads in real time.

The four countries are the ones already listed in the section's location line. Section Flesch: 43.6 before, 62.0 after.

### 3e. Slack (`#slack`)

Small change, included because it shares the hero's 72-hour line.

**Before**
> We offer full Slack integration. Simply Slack us about your hiring needs and we will submit fully vetted candidates within 72 hours.

**After**
> Message us in Slack with the role you need. We send fully vetted candidates within 72 hours.

Section Flesch: 72.3 before, 85.4 after.

### 3f. Stats labels (`#stats`)

See claims table rows 1 to 3.

### 3g. Left as is

- AI Fluency section, Staff Augmentation section, Hiring Dashboard section, and the closing CTA band. They already read clearly and score near the page average.
- All three testimonials, including Troutwood. They are customer quotes.

---

## 4. Page openings

H1s are unchanged in both. Only the lead paragraph changes.

### 4a. `/latamengineer/` (`main-latamengineer.html`, line 6)

**Before**
> Discover how nearshoring to Latin America can transform your business with senior software engineers - streamlined, vetted, and cost-effective.

**After**
> BetterEngineer connects U.S. engineering teams with senior software engineers in Argentina, Brazil, Colombia, and Costa Rica. They work U.S. business hours, and you see vetted profiles within 72 hours. Clients save 44% on first-year hiring costs compared with a U.S. hire, on average.

### 4b. `/staff-augmentation/` (`main-staff-augmentation.html`, line 7)

**Before**
> Don't let limited resources stall your growth. Get access to our pre-vetted network of passionate senior software engineers in just 72 hours.

**After**
> BetterEngineer adds senior Latin American software engineers to U.S. engineering teams, for one project or a long-term role. You see vetted profiles in 72 hours, and every engineer works U.S. hours. Clients save 44% on first-year hiring costs, on average.

Optional fourth sentence for the compliance objection this ICP raises, sourced from the LATAM FAQ ("We handle onboarding, HR, contracts, and payroll"):
> We handle contracts, payroll, and HR, so your team interviews and manages the work.

"For one project or a long-term role" is based on the existing card "flexible staffing for short-term projects or permanent positions."

---

## 5. Readability numbers

| Measure | Before | After |
| --- | --- | --- |
| Homepage, all visible body text | **54.5** | **64.8** |
| Homepage, prose blocks only (8+ words) | 52.0 | 64.7 |
| Words (all visible text) | 786 | 814 |
| Average syllables per word | 1.71 | 1.59 |

Method, applied the same way to both versions: Flesch reading ease, 206.835 minus 1.015 times words per sentence minus 84.6 times syllables per word. Text is every visible string inside `<main>` of `main-home.html` (headings, paragraphs, list items, buttons, card text, stat labels, testimonials). Scripts, SVG, and alt text are excluded. Each block element counts as at least one sentence. Syllables use a standard vowel-group heuristic. The "after" text is the "before" file with only the replacements in section 3 applied, in memory.

This is not Okara's exact method, so the absolute numbers differ (Okara gave the current page 48, this method gives 54.5). Compare the two numbers to each other, not to Okara's. Most of the gain comes from fewer long words: syllables per word drops from 1.71 to 1.59. Sentence length barely changes.

---

## 6. Open questions

1. **COPY_BRIEF.md still says 42.8%.** OK to change it to 44%, and mark CF-03, CF-04, and CF-67 as decided in `docs/site-migration/content-followups.md` and section 4 of `HANDOFF.md`?
2. **What does the 44% include?** The approved proof is "average first-year hiring cost savings vs. U.S." A CFO or VP Engineering will ask what goes into that number (salary only, or also recruiting fees, benefits, and HR). Row 6 claims it covers recruiting, onboarding, and HR work. Confirm that, or I drop that sentence. A one-line footnote on the methodology would also help with this ICP.
3. **The FAQ "salary" answer (row 7).** "Latin American developers earn 50 to 70% less" is a market salary claim, not a BetterEngineer savings claim, and it has no source. The proposed text swaps in 44%, which answers a slightly different question. Options: use the proposed text, keep 50 to 70% with a cited source, or remove the number.
4. **$107K (and $107,000) per hire.** It appears on `/ai-fluent-engineers/` (two places), two role pages, and the role template. It has no source in `COPY_BRIEF.md`, and it was originally paired with 42%. Keep it with a source, or drop it?
5. **LiveCGI 40%.** This is one client's result, so I left it. Confirm it stays.
6. **72-hour wording.** The approved proof is an *average* ("72 hours average time to present initial candidates"). Live copy also says "in as little as 72 hours" and "often in 72 hours", which suggests a best case rather than an average. Standardizing touches about 300 strings in `data/technologies.js` plus role, industry, and case-study pages. Do you want that pass, and if so which phrasing: "within 72 hours" or "72 hours on average"?
7. **"8 to 12 weeks" traditional hiring cycle** (FAQ and Staff Augmentation "Is it worth it" answers). It is unsourced. The proposed rows 5 and 8 drop it and use the approved 38-day time-to-hire instead.
8. **The ICP shift changes CTAs and social proof, which I did not rewrite.**
   - Homepage partner strip says "Partnered with Top Brands and Startups". For established companies, something like "Trusted by engineering teams at Accenture, Hydrow, and more" fits better. The SecureLink logo is on the homepage, but its case study is held back.
   - Homepage buttons "Find Talent" and "Find Better Talent Today" read as founder-oriented. A VP Engineering may respond better to "Request vetted profiles" or "Book a 30-minute call".
   - The Staff Augmentation hero line "Don't let limited resources stall your growth" is startup framing. The proposed opening replaces it.
9. **"20-minute intro" vs 30-minute Calendly.** The LATAM and AI Readiness hero forms say "Book a 20-minute intro", but the meeting link everywhere is the 30-minute Calendly. Which is right?
10. **Time zone detail.** The drafts say "U.S. business hours" rather than a specific overlap (for example, "within 2 hours of U.S. Eastern"). If you want a number, confirm it, since it varies by country and daylight saving time.
11. **"AI native" vs "AI-fluent".** The H1 says "AI Native Engineers". On the fluency scale, AI Native is the top tier and "our priority", not every placement. The hero lead uses "AI-fluent" so it does not overclaim. Keep the H1 as is, or align it?
