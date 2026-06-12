---
name: create-role-page
description: Creates a new BetterEngineer role landing page from the established template, adds it to the roles index, updates the cross-link grid on all existing pages, and deploys to discover.betterengineer.com. Use when adding a new engineer role (e.g. "Security Engineers"), when the user says "add a role page", "new role", or "create a role landing page".
---

# Create a BetterEngineer Role Page

Produces a complete, SEO/AEO-ready role detail page and deploys it to `discover.betterengineer.com/roles/{slug}/`.

## Inputs — confirm before starting

| Field | Example |
|-------|---------|
| Display name | `Security Engineers` |
| Slug (directory) | `security-engineers` |
| One-line description for the roles grid | `Pen testing, threat modeling, and secure SDLC for teams handling sensitive data.` |
| 10 tech logos | Pick from [tech-grid-reference.md](tech-grid-reference.md) |
| Primary ICP for copy | startup / established company / agency |

Read `COPY_BRIEF.md` before drafting any copy. Copy rules: no em dashes, no vague AI phrases, concrete outcomes, short sentences.

---

## Workflow

### Step 1 — Copy the template

```bash
cp roles/roles-template/index.html roles/{slug}/index.html
```

### Step 2 — Replace all role-specific content

Open `roles/{slug}/index.html` and make every substitution below. The file is a single minified line; use StrReplace for targeted changes.

**Head / meta**
- `<title>Role Page Template | BetterEngineer</title>` → `<title>Hire {Display Name} | BetterEngineer</title>`
- Both `og:title` and `<title>` should match
- `og:url` and `rel="canonical"` → `https://www.betterengineer.com/roles/{slug}/`
- Meta description → unique sentence (120–155 chars), include role name + "nearshore" + "72 hours"

**Hero section (`#role-hero`)**
- Eyebrow: `ROLES | FRONT-END ENGINEERS` → `ROLES | {DISPLAY NAME UPPERCASE}`
- `h1`: rewrite for the new role — keep `<span class="light">` around the role name
- Lead `<p class="lead">`: 2–3 sentences, role-specific value prop. See existing pages for tone.
- Form textarea placeholder: `Stack, team size, and what you need shipped` (keep as-is or make role-specific)
- Form label: `Tell us about your front-end hiring needs` → `Tell us about your {role} hiring needs`

**Candidates section (`#candidates`)**
- `h2`: `Meet Our <span class="accent">Vetted Front-End Engineers</span>` → update role name
- Candidate card role labels, names, and skill tags → update for the new role
- Photos: reuse `/images/roles/front-end-engineers/candidates/` until role-specific photos are available

**Guide section (`#guide`)**
- `h2` and all 4 TOC item headings → rewrite for the new role
- Body prose in each `air-toc-section` → rewrite (4 sections, ~200 words each)

**Skills section (`#skills`)**
- Eyebrow and `h2` → update role name
- Lead: update role reference
- 5 `air-skill-group` blocks → replace with role-appropriate skill categories

**Use cases section (`#use-cases`)**
- `h2` → update role name
- 8 `air-serve-card` articles → replace with role-specific use cases

**Trust section (`#trust`)**
- `h2` → update `<span class="accent">` role name

**Tech stack section (`#tech-stack`)**
- Replace the `<div class="reveal"><img ...>` static image block with the icon grid. See [tech-grid-reference.md](tech-grid-reference.md).
- Add the icon grid CSS to `<head>` (before `</head>`) — see tech-grid-reference.md.

**FAQ section (`#faq`)**
- Eyebrow: `FRONT-END DEVELOPER FAQ` → `{ROLE UPPERCASE} FAQ`
- 8 FAQ items: rewrite questions and answers for the new role
- Also update the `FAQPage` JSON-LD in `<head>` to match

**Final CTA (`#cta-hire`)**
- Update lead `<p class="lead">` to reference the new role

### Step 3 — Add to `roles/index.html`

In `roles/index.html`, add a new `<a class="role-card">` to the `.roles-grid`. Don't mark it `role-card--featured` (AI Engineers owns that). Example card:

```html
<a class="role-card" href="/roles/{slug}/">
  <h3>{Display Name}</h3>
  <p>{One-line description}</p>
</a>
```

### Step 4 — Update the cross-link grid on all existing pages

Every existing role page has a hardcoded `.roles-grid` inside `#other-roles`. Run the utility:

```bash
node .cursor/skills/create-role-page/scripts/add-role-to-grids.js \
  --slug="{slug}" \
  --name="{Display Name}" \
  --desc="{one-line description}"
```

This appends the new card to every `roles/*/index.html` that already has `id="other-roles"`.

### Step 5 — Add Google Tag Manager tracking

The template contains a placeholder comment that must be replaced with the live GTM snippets.

**In `<head>`, replace:**
```html
<!-- Google Tag Manager would go here (GTM-WT77L8JF), same as your current setup -->
```
**With:**
```html
<!-- Google Tag Manager --><script>(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','GTM-WT77L8JF');</script><!-- End Google Tag Manager -->
```

**After `<body>`, add the noscript fallback** (immediately before `<a class="skip-link"`):
```html
<!-- Google Tag Manager (noscript) --><noscript><iframe src="https://www.googletagmanager.com/ns.html?id=GTM-WT77L8JF" height="0" width="0" style="display:none;visibility:hidden"></iframe></noscript><!-- End Google Tag Manager (noscript) -->
```

To apply both at once across any number of pages, run:
```bash
node inject-gtm.js
```
(The script auto-detects the placeholder and inserts both snippets correctly.)

### Step 6 — Verify

```bash
node verify-grids.js
node verify-perf.js
```

Check: `css: true`, `grid: true`, `imgGone: true` for all pages including the new one.

### Step 7 — Commit and deploy

```bash
git add roles/{slug}/ roles/index.html
git add .cursor/skills/   # if this is the first new role added via the skill
git commit -m "Add {Display Name} role page"
git push origin main
```

GitHub Actions deploys automatically. The full pipeline (build → gh-pages → pages rebuild) completes in ~60 seconds. Live at `https://discover.betterengineer.com/roles/{slug}/`.

---

## Checklist before pushing

- [ ] Canonical URL and `og:url` updated
- [ ] Meta description is unique and 120–155 chars
- [ ] FAQ JSON-LD matches the visible FAQ questions
- [ ] Tech icon grid CSS added to `<head>`
- [ ] Static image `technologies-stack.png` replaced with icon grid `div`
- [ ] GTM head snippet present (search for `gtm.start` — must not be a comment)
- [ ] GTM noscript iframe present after `<body>` (search for `ns.html?id=GTM`)
- [ ] No em dashes anywhere in copy
- [ ] All internal role links in `#other-roles` grid include the new role
- [ ] `roles/index.html` updated with new card

---

## Reference files

- [tech-grid-reference.md](tech-grid-reference.md) — icon CSS, CDN pattern, verified slugs
