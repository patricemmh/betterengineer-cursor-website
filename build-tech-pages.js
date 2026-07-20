#!/usr/bin/env node
/**
 * Generate static technology hiring pages from data/technologies.js.
 *
 * Reuses the proven chrome (head boilerplate, header, footer, scripts, and the
 * wired intake form) from technologies/tech-template/index.html, and builds
 * every content section from the structured data below. Output is plain
 * static HTML: no framework, no runtime data loading.
 *
 * This is the single pipeline for technology pages. It merges the AEO-style
 * answer blocks (overview, at-a-glance table, responsibilities, cited stats)
 * with the conversion-style blocks that used to live only in the hand-stamped
 * template (candidate cards, partners marquee, long-form guide, trust grid,
 * mid-page CTA). One generator, one section order, used for every page.
 *
 * Also generates the technologies hub (technologies/index.html) from the same
 * dataset, grouped by category, listing only published records.
 *
 * Usage:
 *   node build-tech-pages.js            # generate all published pages + hub
 *   node build-tech-pages.js python     # generate only slugs matching "python" (hub always regenerates)
 */
"use strict";
const fs = require("fs");
const path = require("path");

const ROOT = process.env.TECH_ROOT || __dirname;
const { technologies } = require(path.join(ROOT, "data", "technologies.js"));
const { ENGINEERS, getEngineerPhoto, getEngineerDisplayName } = require(path.join(ROOT, "engineers.js"));
const TEMPLATE = fs.readFileSync(path.join(ROOT, "technologies", "tech-template", "index.html"), "utf8");

const PREFIX = TEMPLATE.slice(TEMPLATE.indexOf("<body"), TEMPLATE.indexOf("<main"));
const SUFFIX = TEMPLATE.slice(TEMPLATE.indexOf("</main>") + "</main>".length);
const FORM = (() => {
  const s = TEMPLATE.indexOf('<form id="react-intake-form"');
  const e = TEMPLATE.indexOf("</form>", s) + "</form>".length;
  return TEMPLATE.slice(s, e);
})();

const esc = (s) => String(s)
  .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
const EMDASH = /—/;
const publishedTechs = technologies.filter((t) => t.status === "published");
const publishedSlugs = new Set(publishedTechs.map((t) => t.slug));

// ---- Role metadata (for tech-to-role cross-linking) -------------------------
const ROLE_META = {
  "front-end-engineers": { name: "Front-end engineers", blurb: "React, TypeScript, and design systems with U.S. hours overlap." },
  "back-end-engineers": { name: "Back-end engineers", blurb: "APIs, microservices, databases, and scalable cloud systems." },
  "full-stack-engineers": { name: "Full-stack engineers", blurb: "End-to-end product work across front end, back end, and cloud deployment." },
  "mobile-engineers": { name: "Mobile engineers", blurb: "iOS, Android, React Native, and Flutter talent for apps that ship reliably." },
  "devops-engineers": { name: "DevOps engineers", blurb: "CI/CD, Kubernetes, cloud infrastructure, and automation for safer releases." },
  "data-engineers": { name: "Data engineers", blurb: "Pipelines, warehouses, and dependable data infrastructure." },
  "data-science-engineers": { name: "Data science engineers", blurb: "Machine learning, experimentation, and predictive analytics." },
  "ai-engineers": { name: "AI engineers", blurb: "LLMs, RAG, vector databases, and production AI workflows." },
  "qa-engineers": { name: "QA engineers", blurb: "Manual QA, automated testing, and release confidence." },
  "blockchain-engineers": { name: "Blockchain engineers", blurb: "Smart contracts, DeFi protocols, and Web3 infrastructure." }
};

// ---- Shared engineer roster selection (Section G) ---------------------------
// Deterministic, repetition-balanced selector: primary match on
// engineer.technologies[], then skill/ecosystem overlap, capped at 3,
// with usage tracked across the whole published set so the same few
// engineers do not appear on every page.
function techTagSet(t) {
  const tags = new Set([t.name.toLowerCase()]);
  for (const g of t.ecosystem || []) for (const ic of g.icons) tags.add(String(ic.label).toLowerCase());
  return tags;
}
function matchScore(engineer, tagSet, techSlug) {
  if (engineer.technologies && engineer.technologies.includes(techSlug)) return 1000;
  const pool = [...(engineer.primaryStack || []), ...(engineer.skills || [])];
  let score = 0;
  for (const s of pool) if (tagSet.has(String(s).toLowerCase())) score++;
  return score;
}
function computeRosterSelections() {
  const usage = new Map();
  const selections = new Map();
  const ordered = publishedTechs.slice().sort((a, b) => a.slug.localeCompare(b.slug));
  for (const t of ordered) {
    const tagSet = techTagSet(t);
    const scored = ENGINEERS
      .map((e) => ({ e, score: matchScore(e, tagSet, t.slug) }))
      .filter((x) => x.score > 0)
      .sort((a, b) => {
        if (b.score !== a.score) return b.score - a.score;
        const ua = usage.get(a.e.id) || 0, ub = usage.get(b.e.id) || 0;
        if (ua !== ub) return ua - ub;
        return a.e.id.localeCompare(b.e.id);
      });
    const picked = scored.slice(0, 3).map((x) => x.e);
    for (const e of picked) usage.set(e.id, (usage.get(e.id) || 0) + 1);
    selections.set(t.slug, picked);
  }
  return selections;
}
const rosterSelections = computeRosterSelections();

function ld(obj) {
  return `<script type="application/ld+json">${JSON.stringify(obj)}</script>`;
}

const ORG = {
  "@type": "Organization",
  name: "BetterEngineer",
  url: "https://www.betterengineer.com/",
  logo: "https://www.betterengineer.com/icons/betterengineer-logo.svg",
  sameAs: [
    "https://www.linkedin.com/company/salsamobi",
    "https://www.facebook.com/BetterEngineerbySalsaMobi",
    "https://www.instagram.com/betterengineer_/"
  ]
};
const OG_IMAGE = "https://www.betterengineer.com/images/roles/shared/trust-laptop.png";

function head(t) {
  const title = `Hire ${t.name} Developers | BetterEngineer`;
  const url = `https://discover.betterengineer.com/technologies/${t.slug}/`;
  const organization = { "@context": "https://schema.org", ...ORG };
  const breadcrumb = { "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: "https://www.betterengineer.com/" },
    { "@type": "ListItem", position: 2, name: "Technologies", item: "https://discover.betterengineer.com/technologies/" },
    { "@type": "ListItem", position: 3, name: `${t.name} Developers`, item: url }
  ]};
  const faqPage = { "@context": "https://schema.org", "@type": "FAQPage", mainEntity: t.faqs.map((f) => ({
    "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a }
  }))};
  const service = { "@context": "https://schema.org", "@type": "Service",
    name: `${t.name} Developer Staffing`, serviceType: `${t.name} developer staff augmentation`,
    description: `BetterEngineer helps U.S. teams hire vetted senior nearshore ${t.name} engineers matched to their stack, culture, and working hours.`,
    provider: ORG,
    areaServed: { "@type": "Country", name: "United States" }, url };
  const webPage = { "@context": "https://schema.org", "@type": "WebPage", name: title, url,
    inLanguage: "en-US",
    isPartOf: { "@type": "WebSite", name: "BetterEngineer", url: "https://discover.betterengineer.com/", publisher: ORG },
    primaryImageOfPage: { "@type": "ImageObject", url: OG_IMAGE },
    about: { "@type": "Thing", name: `${t.name} software development` },
    datePublished: `${t.lastUpdated}-01`,
    dateModified: `${t.lastUpdated}-01` };

  return `<!DOCTYPE html><html lang="en"> <head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover"><title>${esc(title)}</title><meta name="description" content="${esc(t.metaDescription)}"><link rel="canonical" href="${url}"><!-- Open Graph --><meta property="og:title" content="${esc(title)}"><meta property="og:description" content="${esc(t.metaDescription)}"><meta property="og:url" content="${url}"><meta property="og:type" content="website"><meta property="og:image" content="${OG_IMAGE}"><meta property="og:image:width" content="720"><meta property="og:image:height" content="540"><!-- Twitter Card --><meta name="twitter:card" content="summary_large_image"><meta name="twitter:title" content="${esc(title)}"><meta name="twitter:description" content="${esc(t.metaDescription)}"><meta name="twitter:image" content="${OG_IMAGE}"><!-- Brand font --><link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin><link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:ital,wght@0,300;0,400;0,500;0,600;0,700;1,400&display=swap" rel="stylesheet"><!-- Structured data for SEO + answer engines (AEO) -->${ld(organization)}${ld(breadcrumb)}${ld(faqPage)}${ld(service)}${ld(webPage)}<!-- Google Tag Manager --><script>(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','GTM-WT77L8JF');</script><!-- End Google Tag Manager --><script>window._hsq = window._hsq || [];</script><script id="hs-script-loader" async defer src="https://js.hs-scripts.com/8679235.js"></script><link rel="stylesheet" href="/styles/brand.css">
<link rel="stylesheet" href="/styles/landing-page.css">
<link rel="stylesheet" href="/styles/roles.css">
<link rel="stylesheet" href="/styles/role-detail.css"><style>
.air-tech-ecosystem{display:grid;grid-template-columns:repeat(3,1fr);gap:1.5rem;margin-top:2rem}
.air-eco-group{background:var(--color-surface);border:1px solid var(--color-border);border-radius:var(--radius-md);padding:1.5rem}
.air-eco-group h3{font-size:.78rem;font-weight:700;text-transform:uppercase;letter-spacing:.06em;color:var(--color-primary);margin:0 0 .4rem}
.air-eco-group__desc{font-size:.85rem;color:var(--color-muted);margin:0 0 1rem;line-height:1.5}
.air-eco-group__icons{display:flex;flex-wrap:wrap;gap:.85rem .75rem;align-items:flex-start}
.air-eco-icon{display:flex;flex-direction:column;align-items:center;gap:.35rem;width:52px}
.air-eco-icon img{width:36px;height:36px;object-fit:contain}
.air-eco-icon span{font-size:.68rem;color:#374151;font-weight:600;text-align:center;line-height:1.2}
a.air-eco-icon{text-decoration:none;border-radius:8px;transition:transform .15s ease}
a.air-eco-icon span{color:var(--color-primary-dark);text-decoration:underline;text-decoration-color:transparent;transition:text-decoration-color .15s ease}
a.air-eco-icon:hover,a.air-eco-icon:focus-visible{transform:translateY(-2px)}
a.air-eco-icon:hover span,a.air-eco-icon:focus-visible span{text-decoration-color:currentColor}
a.air-eco-icon:focus-visible{outline:2px solid var(--color-primary);outline-offset:3px}
@media(max-width:900px){.air-tech-ecosystem{grid-template-columns:repeat(2,1fr)}}
@media(max-width:600px){.air-tech-ecosystem{grid-template-columns:1fr}}
.air-answer{background:#fff;border-left:3px solid var(--color-primary);border-radius:var(--radius-sm);padding:1rem 1.25rem;margin:1.25rem 0 0;font-size:1.02rem;line-height:1.6}
.air-glance{width:100%;border-collapse:collapse;margin-top:1.75rem;font-size:.92rem}
.air-glance th,.air-glance td{text-align:left;padding:.7rem .9rem;border-bottom:1px solid var(--color-border);vertical-align:top}
.air-glance th{width:34%;color:var(--color-primary);font-weight:700}
.air-glance-heading{font-size:clamp(1.05rem,2vw,1.25rem);font-weight:700;margin:2rem 0 .85rem;text-align:left;line-height:1.3;color:var(--color-text,#111827)}
.air-cols{display:grid;grid-template-columns:1fr 1fr;gap:1.5rem;margin-top:1.75rem}
@media(max-width:700px){.air-cols{grid-template-columns:1fr}}
.air-card{background:var(--color-surface);border:1px solid var(--color-border);border-radius:var(--radius-md);padding:1.25rem 1.4rem}
.air-card h3{margin:.1rem 0 .6rem;font-size:1rem}
.air-list{margin:.4rem 0 0;padding-left:1.1rem}
.air-list li{margin:.35rem 0;line-height:1.55}
.air-stats{display:grid;grid-template-columns:repeat(3,1fr);gap:1rem;margin-top:1.75rem}
@media(max-width:700px){.air-stats{grid-template-columns:1fr}}
.air-stat{background:var(--color-surface);border:1px solid var(--color-border);border-radius:var(--radius-md);padding:1.1rem;display:flex;flex-direction:column;align-items:flex-start;text-align:left}
.air-stat p{margin:0;font-size:.9rem;line-height:1.55}
.air-stat cite{display:block;margin-top:.55rem;font-size:.72rem;color:var(--color-muted);font-style:normal;text-align:left}
.air-stat a{color:var(--color-muted)}
.air-updated{font-size:.78rem;color:var(--color-muted);margin-top:.6rem}
.air-ai-tools-layout{display:grid;grid-template-columns:1fr auto;gap:3.5rem;align-items:center}
.air-ai-tools-text h2{margin-bottom:1rem}
.air-ai-tools-text .lead{color:var(--color-muted);margin-bottom:0}
.air-ai-tools-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:.85rem;width:360px;flex-shrink:0}
.air-ai-tool-card{background:#fff;border-radius:14px;box-shadow:0 2px 12px rgba(0,0,0,.07);display:flex;flex-direction:column;align-items:center;justify-content:center;gap:.5rem;padding:16px 10px;transition:transform .15s,box-shadow .15s;cursor:default}
.air-ai-tool-card:hover{transform:translateY(-3px);box-shadow:0 6px 20px rgba(0,0,0,.12)}
.air-ai-tool-card img,.air-ai-tool-card svg{width:40px;height:40px;object-fit:contain;flex-shrink:0}
.air-ai-tool-card span{font-size:.68rem;font-weight:600;color:#374151;text-align:center;line-height:1.2;white-space:nowrap}
.air-ai-tool-card--claude{background:#FFF6F0;box-shadow:0 2px 12px rgba(217,119,87,.2)}
.air-ai-tools-btn-mobile{display:none}
@media(max-width:1000px){.air-ai-tools-layout{grid-template-columns:1fr;gap:2rem;justify-items:center}.air-ai-tools-grid{width:100%;max-width:380px}}
@media(max-width:640px){.air-ai-tools-grid{gap:.65rem;max-width:100%}.air-ai-tool-card img,.air-ai-tool-card svg{width:32px;height:32px}.air-ai-tool-card{padding:13px 8px}.air-ai-tool-card span{white-space:normal;font-size:.62rem}#ai-tools .air-ai-tools-text .btn{display:none}#ai-tools .air-ai-tools-btn-mobile{display:block;width:100%;text-align:center;box-sizing:border-box;margin-top:1.25rem}}
@media(max-width:400px){.air-ai-tools-grid{grid-template-columns:repeat(2,1fr)}}
.air-tech-page #what-they-build{padding-bottom:2.5rem}
.air-tech-page #what-they-build #candidates{padding-bottom:3.5rem}
.air-tech-page #responsibilities{padding-top:2.5rem;padding-bottom:2.5rem}
.air-tech-page #ecosystem{padding-bottom:2.5rem}
.air-tech-page #use-cases{padding-top:2.5rem}
.air-hero-tools{display:flex;flex-direction:column;align-items:flex-start;gap:.25rem;margin-top:2rem}
.air-hero-tools__label{white-space:nowrap}
.air-hero-tools__icons{display:flex;align-items:center;gap:1.4rem}
.air-hero-tools__icons img{width:36px;height:36px;object-fit:contain}
.air-tech-page .air-role-hero-card .hero-form__title{font-size:clamp(1rem,2.5vw,1.2rem)}
.air-guide-tabs{display:grid;grid-template-columns:minmax(0,320px) minmax(0,1fr);gap:clamp(1.5rem,3vw,2.5rem);align-items:start;margin-top:2rem}
.air-guide-tabs__nav{display:flex;flex-direction:column;gap:.7rem;position:sticky;top:calc(var(--header-h,84px) + 1rem)}
.air-guide-tabs__tab{width:100%;text-align:left;padding:1rem 1.15rem;border:1px solid var(--color-border);border-radius:var(--radius-md);background:#fff;color:var(--color-text);font-family:inherit;font-size:.92rem;font-weight:600;line-height:1.35;cursor:pointer;transition:border-color .15s,box-shadow .15s,color .15s,background .15s}
.air-guide-tabs__tab:hover{border-color:var(--color-primary);color:var(--color-primary-dark)}
.air-guide-tabs__tab.is-active,.air-guide-tabs__tab[aria-selected="true"]{border-color:var(--color-primary);box-shadow:0 0 0 1px var(--color-primary);color:var(--color-primary-dark);background:var(--color-surface)}
.air-guide-tabs__content{min-width:0}
.air-guide-tabs__panel{display:none;background:#fff;border:1px solid var(--color-border);border-radius:var(--radius-md);padding:1.5rem 1.65rem}
.air-guide-tabs__panel.is-active{display:block}
.air-guide-tabs__panel h3{margin:0 0 1rem;font-size:clamp(1.2rem,2vw,1.45rem);font-weight:700;line-height:1.3;color:var(--color-text)}
.air-guide-tabs__panel .air-role-prose{color:var(--color-muted);font-size:.9875rem;line-height:1.65}
.air-guide-tabs__panel .air-role-prose p{margin:0 0 1rem}
.air-guide-tabs__panel .air-role-prose ul{margin:.4rem 0 0;padding-left:1.1rem}
.air-guide-tabs__panel .air-role-prose li{margin:.35rem 0;line-height:1.55}
.air-guide-tabs__panel .air-role-prose strong{color:var(--color-text);font-weight:600}
@media(max-width:900px){
.air-guide-tabs{grid-template-columns:1fr}
.air-guide-tabs__nav{position:static;flex-direction:row;flex-wrap:wrap;gap:.55rem}
.air-guide-tabs__tab{flex:1 1 calc(50% - .55rem);font-size:.82rem;padding:.8rem .95rem}
.air-trust-split,#trust .air-trust-split{grid-template-columns:1fr;gap:2rem;align-items:start}
.air-trust-split .air-trust-grid{width:100%}
#hiring-path .process-grid.process-grid--three{grid-template-columns:1fr}
#trust .air-trust-photo{margin-top:1.5rem}
#trust .air-trust-split .btn--primary{display:block;width:fit-content;margin-left:auto;margin-right:auto}
}
@media(max-width:768px){
.air-tech-page #what-they-build{padding-bottom:1.5rem}
.air-tech-page #what-they-build #candidates{padding-bottom:2.5rem}
.air-tech-page #responsibilities{padding-top:1.5rem;padding-bottom:1.5rem}
.air-tech-page #ecosystem{padding-bottom:1.5rem}
.air-tech-page #use-cases{padding-top:1.5rem}
}
@media(max-width:640px){
.air-hero-tools__label{white-space:normal}
.air-hero-tools__icons{flex-wrap:wrap;gap:.6rem .9rem}
.air-hero-tools__icons img{width:28px;height:28px}
#tech-hero .trust-pills{flex-wrap:wrap;gap:.4rem .6rem}
#tech-hero .trust-pill{white-space:normal}
.air-guide-tabs__tab{flex:1 1 100%}
.air-guide-tabs__panel{padding:1.15rem 1.25rem}
.air-glance{font-size:.88rem}
.air-glance th,.air-glance td{padding:.55rem .65rem}
.air-eco-icon{width:56px}
.air-eco-group__icons{gap:.7rem .6rem}
.air-answer{font-size:.98rem;padding:.9rem 1rem}
#hiring-path .btn-row .btn{width:100%;min-width:0}
}
@media(max-width:520px){
.air-glance tr{display:block;padding-bottom:.85rem;margin-bottom:.85rem;border-bottom:1px solid var(--color-border)}
.air-glance tr:last-child{margin-bottom:0;border-bottom:0}
.air-glance th{display:block;width:100%;padding:0 0 .2rem;border:0}
.air-glance td{display:block;width:100%;padding:0;border:0}
}
</style> </head>`;
}

const li = (items) => `<ul class="air-list">${items.map((i) => `<li>${esc(i)}</li>`).join("")}</ul>`;
const monthYear = (ym) => {
  const [y, m] = ym.split("-");
  return `${["", "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"][+m]} ${y}`;
};

const HERO_AI_TOOLS = `<div class="air-hero-tools" aria-label="AI tools our engineers use"> <span class="eyebrow air-hero-tools__label">Some AI Tools Our Engineers Use Daily</span> <div class="air-hero-tools__icons"> <img src="https://cdn.simpleicons.org/claudecode/D97757" alt="Claude Code" width="36" height="36" loading="lazy"> <img src="https://cdn.simpleicons.org/cursor/000000" alt="Cursor" width="36" height="36" loading="lazy"> <img src="/images/ai-tools/codex.png" alt="Codex" width="36" height="36" loading="lazy"> <img src="https://api.iconify.design/logos:github-copilot.svg" alt="GitHub Copilot" width="36" height="36" loading="lazy"> <img src="https://cdn.simpleicons.org/v0/000000" alt="v0" width="36" height="36" loading="lazy"> <img src="https://cdn.simpleicons.org/replit/F26207" alt="Replit" width="36" height="36" loading="lazy"> </div> </div>`;

function hero(t) {
  const form = FORM.replace(/\[TECHNOLOGY\]/g, esc(t.name)).replace(/\[FORM_PLACEHOLDER\]/g, esc(t.formPlaceholder || "Current stack, team size, and what you need to ship"));
  const noun = t.h1Noun || `${t.name} engineers`;
  return `<section class="hero section" id="tech-hero" aria-labelledby="role-hero-title"> <div class="wrap hero-grid"> <div class="reveal"> <p class="eyebrow air-hero-kicker">TECHNOLOGIES | ${esc(t.name.toUpperCase())} DEVELOPERS</p> <h1 class="h1" id="role-hero-title">Hire senior <span class="light">${esc(noun)}</span> in your time zone.</h1> <p class="lead">${esc(t.heroLead)}</p> <div class="trust-pills" aria-label="Highlights"> <span class="trust-pill">Profiles in 72 hours</span> <span class="trust-pill">Senior engineers only</span> <span class="trust-pill">U.S. hours overlap</span> </div> ${HERO_AI_TOOLS} </div> <div class="hero-visual reveal"> <div class="hero-form__card react-hero-side-card air-role-hero-card"> <p class="eyebrow">Get matched fast</p> <h2 class="hero-form__title">Book a 20-minute intro and tell us about your ${esc(t.name)} project.</h2> ${form} <p class="air-role-process">Intro Call &gt; Requirements &gt; Profiles in slack / inbox</p> </div> </div> </div> </section>`;
}

function partners() {
  return `<section class="partners" aria-label="Client logos"> <div class="wrap"> <p class="partners-label">Partnered with Top Brands and Startups</p> <div class="logo-marquee"> <div class="logo-track"> <div class="client-block"> <img src="/images/roles/shared/logos/accenture-grey.png" alt="Accenture" loading="lazy"> <div class="client-sub">Global $64B Consultancy</div> </div><div class="client-block"> <img src="/images/roles/shared/logos/chapterspot-grey.png" alt="ChapterSpot" loading="lazy"> <div class="client-sub">Acquired 2024</div> </div><div class="client-block"> <img src="/images/roles/shared/logos/securelink-grey.png" alt="SecureLink" loading="lazy"> <div class="client-sub">Acquired by Imprivata</div> </div><div class="client-block"> <img src="/images/roles/shared/logos/hydrow.png" alt="Hydrow" loading="lazy"> <div class="client-sub">$300M+ Raised</div> </div><div class="client-block"> <img src="/images/roles/shared/logos/wasteplace-grey.png" alt="WastePlace" loading="lazy"> <div class="client-sub"> <a href="https://www.betterengineer.com/case-studies/wasteplace">Read Case Study</a> </div> </div> </div> </div> </div> </section>`;
}

function candidatesBlock(t) {
  const engineers = rosterSelections.get(t.slug) || [];
  if (!engineers.length) {
    return `<div id="candidates" aria-labelledby="candidates-heading"> <div class="reveal air-section-head"> <p class="eyebrow">Vetted talent</p> <h2 class="h2" id="candidates-heading"> Meet our <span class="accent">vetted ${esc(t.name)} engineers</span> ready to work.</h2> </div> <p class="lead">Talent matched to your stack. Tell us your requirements and we will source ${esc(t.name)} engineers for your team.</p> </div>`;
  }
  const cards = engineers.map((e) => {
    const tags = e.skills.slice(0, 6);
    const tagsHtml = tags.map((s) => `<span>${esc(s)}</span>`).join("");
    const name = getEngineerDisplayName(e);
    const photo = getEngineerPhoto(e);
    const verified = e.verified !== false;
    return `<article class="air-candidate-card reveal"> <p class="air-candidate-card__role">${esc(t.name)} Engineer</p> <h3 class="air-candidate-card__name">${esc(name)}</h3> <img class="air-candidate-card__photo" src="${photo}" alt="${esc(name)}" width="400" height="400" loading="lazy">${verified ? ` <p class="air-candidate-card__verified"> <span aria-hidden="true">&#10003;</span> <span>Verified Expert in Engineering</span> </p>` : ""} <p class="air-candidate-card__label">Expertise</p> <div class="air-skill-tags" aria-label="Expertise">${tagsHtml}</div> <a class="btn btn--primary" href="https://www.betterengineer.com/multi-step-contact-form">Hire ${esc(e.firstName)}</a> </article>`;
  }).join("");
  return `<div id="candidates" aria-labelledby="candidates-heading"> <div class="reveal air-section-head"> <p class="eyebrow">Vetted talent</p> <h2 class="h2" id="candidates-heading"> Meet our <span class="accent">vetted ${esc(t.name)} engineers</span> ready to work.</h2> </div> <div class="air-candidates-grid">${cards}</div> </div>`;
}

function talentAndBuild(t) {
  return `<section class="section section-tint" id="what-they-build" aria-labelledby="candidates-heading"> <div class="wrap"> ${candidatesBlock(t)} <div class="reveal" style="max-width:48rem"> <h2 class="h2" id="what-they-build-heading">What you can build with senior ${esc(t.name)} engineers</h2> <p class="air-answer">Senior ${esc(t.name)} engineers own real production systems, not just tickets. Common examples:</p>${li(t.whatTheyBuild)} </div> </div> </section>`;
}

function guide(t) {
  const tabs = t.guideSections.map((s, i) => {
    const tabId = `guide-tab-${i}`;
    const panelId = `guide-panel-${i}`;
    const selected = i === 0;
    return `<button type="button" class="air-guide-tabs__tab${selected ? " is-active" : ""}" id="${tabId}" role="tab" aria-selected="${selected}" aria-controls="${panelId}" tabindex="${selected ? "0" : "-1"}">${esc(s.tocTitle)}</button>`;
  }).join("");
  const panels = t.guideSections.map((s, i) => {
    const tabId = `guide-tab-${i}`;
    const panelId = `guide-panel-${i}`;
    const isLast = i === t.guideSections.length - 1;
    const checklist = isLast ? `<p><strong>Quick evaluation checklist:</strong></p>${li(t.evaluation)}` : "";
    const active = i === 0;
    return `<div class="air-guide-tabs__panel${active ? " is-active" : ""}" id="${panelId}" role="tabpanel" aria-labelledby="${tabId}"${active ? "" : " hidden"}> <h3>${esc(s.tocTitle)}</h3> <div class="air-role-prose">${s.prose}${checklist}</div> </div>`;
  }).join("");
  return `<section class="section section-tint" id="guide" aria-labelledby="guide-heading"> <div class="wrap"> <div class="reveal air-section-head"> <p class="eyebrow">Hiring guide</p> <h2 class="h2" id="guide-heading">Everything you need to know before hiring a <span class="accent">${esc(t.name)} engineer</span></h2> <p class="lead" style="margin-bottom:0">Select a question on the left to read the answer.</p> </div> <div class="air-guide-tabs reveal" data-air-guide-tabs> <div class="air-guide-tabs__nav" role="tablist" aria-label="Hiring guide topics">${tabs}</div> <div class="air-guide-tabs__content">${panels}</div> </div> </div> </section>`;
}

function midCta() {
  return `<section class="section air-mid-cta" aria-labelledby="mid-cta-heading"> <div class="wrap"> <div class="air-mid-cta__card reveal"> <img class="air-mid-cta__image" src="/images/roles/shared/cta-band-mask.png" alt="Engineer on a call" width="260" height="96" loading="lazy"> <h2 class="air-mid-cta__title" id="mid-cta-heading">Ready to meet your next engineer? Describe your role and receive vetted matches in 72 hours.</h2> <a class="btn air-mid-cta__button" href="https://calendly.com/tim-salsamobi/30min" target="_blank" rel="noopener noreferrer">Book a Call</a> </div> </div> </section>`;
}

function ecosystem(t) {
  const groups = t.ecosystem.map((g) => `<div class="air-eco-group reveal"><h3>${esc(g.group)}</h3><p class="air-eco-group__desc">${esc(g.desc)}</p><div class="air-eco-group__icons">${g.icons.map((ic) => {
    const linked = ic.techSlug && publishedSlugs.has(ic.techSlug);
    const tag = linked ? "a" : "div";
    const href = linked ? ` href="/technologies/${esc(ic.techSlug)}/"` : "";
    const iconSrc = ic.src || `https://cdn.simpleicons.org/${esc(ic.slug)}`;
    return `<${tag} class="air-eco-icon"${href}><img src="${iconSrc}" alt="${esc(ic.label)}" width="36" height="36" loading="lazy"><span>${esc(ic.label)}</span></${tag}>`;
  }).join("")}</div></div>`).join("");
  return `<section class="section section-tint" id="ecosystem" aria-labelledby="ecosystem-heading"><div class="wrap"><div class="reveal air-section-head"><p class="eyebrow">Full ecosystem coverage</p><h2 class="h2" id="ecosystem-heading">The <span class="accent">${esc(t.name)} ecosystem</span> your engineers know</h2><p class="lead air-roles-lead" style="margin-bottom:0">Our ${esc(t.name)} engineers are not framework beginners. They make deliberate choices between the right tools for the right problem and can defend those decisions to your team.</p></div><div class="air-tech-ecosystem">${groups}</div></div></section>`;
}

function useCases(t) {
  const cards = t.useCases.map((u) => `<article class="air-serve-card reveal"> <h3>${esc(u.title)}</h3> <p>${esc(u.body)}</p> </article>`).join("");
  return `<section class="section" id="use-cases" aria-labelledby="use-cases-heading"> <div class="wrap"> <div class="reveal air-section-head"> <p class="eyebrow">Where we help</p> <h2 class="h2" id="use-cases-heading"> Use cases &amp; <span class="accent">${esc(t.name)}</span> expertise</h2> <p class="lead air-serve-lead" style="margin-bottom:0">This is where our ${esc(t.name)} engineers make the biggest impact, from first commit to production scale.</p> </div> <div class="air-use-grid">${cards}</div> </div> </section>`;
}

function aiTools(t) {
  return `<section class="section section-tint" id="ai-tools" aria-labelledby="ai-tools-heading"><div class="wrap air-ai-tools-layout"><div class="air-ai-tools-text reveal"><p class="eyebrow">AI-FLUENT BY DEFAULT</p><h2 class="h2" id="ai-tools-heading">Every ${esc(t.name)} engineer we place <span class="accent">uses AI tools daily.</span></h2><p class="lead">Not as a novelty. Our engineers use the tools your team already relies on to write faster, catch issues earlier, and ship with fewer review cycles.</p><a class="btn btn--primary" href="https://discover.betterengineer.com/ai-fluent-engineers/" style="margin-top:1.5rem;display:inline-flex">See Our AI Fluency Program</a></div><div class="air-ai-tools-grid reveal"><div class="air-ai-tool-card air-ai-tool-card--claude"><img src="https://cdn.simpleicons.org/claudecode/D97757" alt="Claude Code" width="40" height="40" loading="lazy"><span>Claude Code</span></div><div class="air-ai-tool-card"><img src="https://cdn.simpleicons.org/cursor/000000" alt="Cursor IDE" width="40" height="40" loading="lazy"><span>Cursor</span></div><div class="air-ai-tool-card"><img src="https://api.iconify.design/logos:github-copilot.svg" alt="GitHub Copilot" width="40" height="40" loading="lazy"><span>Copilot</span></div><div class="air-ai-tool-card"><img src="https://api.iconify.design/logos:openai-icon.svg" alt="ChatGPT" width="40" height="40" loading="lazy"><span>ChatGPT</span></div><div class="air-ai-tool-card"><img src="/images/ai-tools/codex.png" alt="Codex by OpenAI" width="40" height="40" loading="lazy"><span>Codex</span></div><div class="air-ai-tool-card"><img src="https://cdn.simpleicons.org/v0/000000" alt="v0 by Vercel" width="40" height="40" loading="lazy"><span>v0</span></div><div class="air-ai-tool-card"><img src="https://cdn.simpleicons.org/windsurf/1A9C8B" alt="Windsurf" width="40" height="40" loading="lazy"><span>Windsurf</span></div><div class="air-ai-tool-card"><img src="https://cdn.simpleicons.org/replit/F26207" alt="Replit" width="40" height="40" loading="lazy"><span>Replit</span></div><div class="air-ai-tool-card"><img src="https://api.iconify.design/vscode-icons:file-type-gemini.svg" alt="Google Gemini" width="40" height="40" loading="lazy"><span>Gemini</span></div></div><a class="btn btn--primary air-ai-tools-btn-mobile" href="https://discover.betterengineer.com/ai-fluent-engineers/">See Our AI Fluency Program</a></div></section>`;
}

function trust(t) {
  return `<section class="section section-tint" id="trust" aria-labelledby="trust-heading"> <div class="wrap split air-trust-split air-latam-split"> <div class="reveal"> <p class="eyebrow">Why teams choose us</p> <h2 class="h2" id="trust-heading"> Why high-growth teams trust BetterEngineer for <span class="accent">${esc(t.name)}</span> engineering</h2> <p class="lead" style="margin-bottom:0">Built for teams who demand more than code</p> <img class="air-trust-photo" src="/images/roles/shared/trust-laptop.png" alt="${esc(t.name)} engineer working on laptop" width="720" loading="lazy"> <a class="btn btn--primary" href="https://www.betterengineer.com/multi-step-contact-form">Contact Us</a> </div> <div class="air-trust-grid"> <article class="air-trust-mini reveal"> <h3>Product partners, not just developers</h3> <p>Our senior engineers blend deep technical mastery with real product ownership. They connect roadmap, architecture, and delivery to measurable business outcomes, not just completed tickets.</p> </article><article class="air-trust-mini reveal"> <h3>Lightning-fast, precision hiring</h3> <p>Skip the talent churn. We deliver a curated shortlist of product-focused, AI-ready engineers within 72 hours, each handpicked for your culture, stack, and goals.</p> </article><article class="air-trust-mini reveal"> <h3>Future-ready &amp; AI-savvy</h3> <p>BetterEngineer's engineers stay current with modern frameworks and adopt the AI-powered tools your team already relies on for daily work.</p> </article><article class="air-trust-mini reveal"> <h3>U.S. time zone overlap</h3> <p>English-fluent, timezone-aligned, and embedded in your workflows from day one. Expect fast collaboration that feels like an in-house team, not outsourcing.</p> </article><article class="air-trust-mini reveal"> <h3>Long-term retention &amp; trust</h3> <p>With an average tenure of 21+ months, our engineers provide continuity, protect critical knowledge, and eliminate the revolving door risk for your most important products.</p> </article><article class="air-trust-mini reveal"> <h3>Real cost advantage without compromise</h3> <p>On average, save 42.8% on first-year hiring costs compared to U.S. hiring. You get senior talent, not trade-offs or short-cuts.</p> </article> </div> </div> </section>`;
}

function stats(t) {
  const items = t.stats.map((s) => `<div class="air-stat reveal"><p>${esc(s.text)}</p><cite>Source: <a href="${esc(s.url)}" rel="nofollow noopener" target="_blank">${esc(s.source)}</a></cite></div>`).join("");
  return `<section class="section section-tint" id="demand" aria-labelledby="demand-heading"><div class="wrap"><div class="reveal" style="max-width:44rem"><p class="eyebrow">By the numbers</p><h2 class="h2" id="demand-heading">Why ${esc(t.name)} talent is worth hiring well</h2></div><div class="air-stats">${items}</div></div></section>`;
}

function hiringPath() {
  return `<section class="section section-tint" id="hiring-path" aria-labelledby="hiring-path-heading"><div class="wrap"><div class="reveal air-section-head"><p class="eyebrow">How it works</p><h2 class="h2" id="hiring-path-heading">Our <span class="accent">simple hiring</span> path</h2></div><div class="process-grid process-grid--three"><article class="process-step reveal"><img class="process-step__icon" src="/images/roles/shared/hiring-path-1.png" alt="" width="60" height="60" loading="lazy"><h3>Align your needs</h3><p>We align on skills, team structure, and engagement model.</p></article><article class="process-step reveal"><img class="process-step__icon" src="/images/roles/shared/hiring-path-2.png" alt="" width="60" height="60" loading="lazy"><h3>Meet candidates</h3><p>Get matched with senior talent tailored to your culture and tech.</p></article><article class="process-step reveal"><img class="process-step__icon" src="/images/roles/shared/hiring-path-3.png" alt="" width="60" height="60" loading="lazy"><h3>Seamless onboarding</h3><p>Your engineer is up to speed: hyper-collaborative, timezone matched, impact-driven.</p></article></div><div class="btn-row reveal" style="justify-content:center;margin-top:2rem"><a class="btn btn--primary" href="https://calendly.com/tim-salsamobi/30min" target="_blank" rel="noopener noreferrer">Schedule your call</a></div></div></section>`;
}

function faq(t) {
  const items = t.faqs.map((f, i) => {
    const open = i === 0;
    return `<div class="faq-item${open ? " is-open" : ""}"> <button type="button" aria-expanded="${open}"><span class="faq-question">${esc(f.q)}</span><span class="chevron" aria-hidden="true"></span></button> <div class="faq-panel"${open ? "" : " hidden"}> <p>${esc(f.a)}</p> </div> </div>`;
  }).join("");
  return `<section class="section section-tint" id="faq" aria-labelledby="faq-heading"><div class="wrap"><div class="reveal air-section-head" style="max-width:44rem"><p class="eyebrow">${esc(t.name.toUpperCase())} DEVELOPER FAQ</p><h2 class="h2" id="faq-heading">Frequently asked questions about hiring ${esc(t.name)} developers</h2></div><div class="faq-list reveal" id="faq-list">${items}</div></div></section>`;
}

function related(t) {
  const cards = t.relatedTechnologies
    .filter((slug) => publishedSlugs.has(slug))
    .map((slug) => {
      const r = technologies.find((x) => x.slug === slug);
      return `<a class="role-card" href="/technologies/${slug}/"> <h3>${esc(r.name)} engineers</h3> <p>Senior nearshore ${esc(r.name)} engineers matched to your stack and U.S. working hours.</p> </a>`;
    });
  cards.push(`<a class="role-card" href="/technologies/"> <h3>All technologies</h3> <p>Browse every technology and framework we staff senior nearshore engineers for.</p> </a>`);
  return `<section class="section section-tint" id="other-technologies" aria-labelledby="other-technologies-heading"> <div class="wrap"> <div class="reveal air-section-head"> <p class="eyebrow">Explore technologies</p> <h2 class="h2" id="other-technologies-heading">Hire engineers <span class="accent">across your stack</span></h2> <p class="lead" style="margin-bottom:0">Senior nearshore engineers matched to your framework and U.S. working hours. Browse the other technologies we staff.</p> </div> <div class="roles-grid">${cards.join("")}</div> </div> </section>`;
}

function relatedRoles(t) {
  const slugs = (t.relatedRoles || []).filter((s) => ROLE_META[s]);
  if (!slugs.length) return "";
  const cards = slugs.map((s) => `<a class="role-card" href="/roles/${s}/"> <h3>${esc(ROLE_META[s].name)}</h3> <p>${esc(ROLE_META[s].blurb)}</p> </a>`).join("");
  return `<section class="section" id="related-roles" aria-labelledby="related-roles-heading"> <div class="wrap"> <div class="reveal air-section-head"> <p class="eyebrow">Hiring for a role, not just a stack?</p> <h2 class="h2" id="related-roles-heading">Roles that commonly need <span class="accent">${esc(t.name)}</span></h2> <p class="lead" style="margin-bottom:0">Browse the engineering roles most likely to need ${esc(t.name)} depth.</p> </div> <div class="roles-grid">${cards}</div> </div> </section>`;
}

function finalCta(t) {
  return `<section class="cta-band air-final-cta" id="cta-hire" aria-labelledby="final-cta-heading"> <div class="wrap"> <div class="reveal air-final-cta__inner"> <h2 class="h2" id="final-cta-heading"> Say goodbye to endless job boards. <strong>Find your better engineer.</strong> </h2> <p class="lead">${esc(t.ctaLead)}</p> <div class="btn-row"> <a class="btn btn--primary" href="https://www.betterengineer.com/multi-step-contact-form">Get Started</a> </div> <p class="air-final-cta__note">No juniors. No fluff. Senior engineers only, vetted for skill, culture, and commitment.</p> </div> </div> </section>`;
}

function main(t) {
  const glanceRows = t.atAGlance.map(([k, v]) => `<tr><th scope="row">${esc(k)}</th><td>${esc(v)}</td></tr>`).join("");
  const overview = `<section class="section" id="overview" aria-labelledby="overview-heading"><div class="wrap"><div class="reveal" style="max-width:48rem"><p class="eyebrow">Overview</p><h2 class="h2" id="overview-heading">What does a senior ${esc(t.name)} developer do?</h2><p class="air-answer">${esc(t.heroDirectAnswer)}</p><h3 class="air-glance-heading" id="glance-heading">${esc(t.name)} developers at a glance</h3><table class="air-glance" aria-labelledby="glance-heading"><tbody>${glanceRows}</tbody></table><p class="air-updated">Last updated ${monthYear(t.lastUpdated)}</p></div></div></section>`;
  const respSkills = `<section class="section" id="responsibilities" aria-labelledby="responsibilities-heading"><div class="wrap"><div class="reveal" style="max-width:48rem"><p class="eyebrow">Role and skills</p><h2 class="h2" id="responsibilities-heading">${esc(t.name)} developer responsibilities and core skills</h2></div><div class="air-cols"><div class="air-card reveal"><h3>Typical responsibilities</h3>${li(t.responsibilities)}</div><div class="air-card reveal"><h3>Core skills we vet for</h3>${li(t.coreSkills)}</div></div></div></section>`;
  return `<main class="air-tech-page" id="main"> ${hero(t)} ${partners()} ${overview} ${talentAndBuild(t)} ${respSkills} ${guide(t)} ${midCta()} ${ecosystem(t)} ${useCases(t)} ${aiTools(t)} ${trust(t)} ${stats(t)} ${hiringPath()} ${faq(t)} ${related(t)} ${relatedRoles(t)} ${finalCta(t)} </main>`;
}

function render(t) {
  return head(t) + " " + PREFIX + main(t) + " " + SUFFIX;
}

// ---- Generated technologies hub (Section E.4) -------------------------------
const CATEGORY_ORDER = ["Language", "Frontend", "Backend", "Mobile", "Data", "Cloud", "AI/ML"];

function hubHead() {
  const title = "Hire Engineers by Technology | BetterEngineer";
  const desc = "Hire senior nearshore engineers by technology. Browse Python and every published stack, matched to your team in U.S. hours in as little as 72 hours.";
  const url = "https://discover.betterengineer.com/technologies/";
  const organization = { "@context": "https://schema.org", ...ORG };
  const breadcrumb = { "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: "https://www.betterengineer.com/" },
    { "@type": "ListItem", position: 2, name: "Technologies", item: url }
  ]};
  const itemList = publishedTechs.map((t, i) => ({ "@type": "ListItem", position: i + 1, name: `${t.name} Developers`, url: `https://discover.betterengineer.com/technologies/${t.slug}/` }));
  const collectionPage = { "@context": "https://schema.org", "@type": "CollectionPage", name: "Hire Engineers by Technology", url, description: desc,
    isPartOf: { "@type": "WebSite", name: "BetterEngineer", url: "https://discover.betterengineer.com/", publisher: ORG },
    mainEntity: { "@type": "ItemList", itemListElement: itemList } };
  return `<!DOCTYPE html><html lang="en"> <head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover"><title>${esc(title)}</title><meta name="description" content="${esc(desc)}"><link rel="canonical" href="${url}"><!-- Open Graph --><meta property="og:title" content="${esc(title)}"><meta property="og:description" content="${esc(desc)}"><meta property="og:url" content="${url}"><meta property="og:type" content="website"><meta property="og:image" content="${OG_IMAGE}"><meta property="og:image:width" content="720"><meta property="og:image:height" content="540"><meta name="twitter:card" content="summary_large_image"><meta name="twitter:title" content="${esc(title)}"><meta name="twitter:description" content="${esc(desc)}"><meta name="twitter:image" content="${OG_IMAGE}"><link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin><link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:ital,wght@0,300;0,400;0,500;0,600;0,700;1,400&display=swap" rel="stylesheet">${ld(organization)}${ld(breadcrumb)}${ld(collectionPage)}<!-- Google Tag Manager --><script>(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','GTM-WT77L8JF');</script><!-- End Google Tag Manager --><script>window._hsq = window._hsq || [];</script><script id="hs-script-loader" async defer src="https://js.hs-scripts.com/8679235.js"></script><style>.role-card--featured{border-color:#545bb3}.role-card__badge{display:inline-block;margin-top:8px;font-size:12px;font-weight:600;color:#545bb3;text-transform:uppercase;letter-spacing:.04em}
</style>
<link rel="stylesheet" href="/styles/brand.css">
<link rel="stylesheet" href="/styles/landing-page.css">
<link rel="stylesheet" href="/styles/roles.css">
<link rel="stylesheet" href="/styles/role-detail.css"></head>`;
}

function hubMain() {
  const byCategory = new Map();
  for (const t of publishedTechs) {
    if (!byCategory.has(t.category)) byCategory.set(t.category, []);
    byCategory.get(t.category).push(t);
  }
  const orderedCategories = CATEGORY_ORDER.filter((c) => byCategory.has(c))
    .concat([...byCategory.keys()].filter((c) => !CATEGORY_ORDER.includes(c)));
  const sections = orderedCategories.map((cat) => {
    const items = byCategory.get(cat).slice().sort((a, b) => a.name.localeCompare(b.name));
    const cards = items.map((t, i) => `<a class="role-card${i === 0 ? " role-card--featured" : ""}" href="/technologies/${t.slug}/"> <h3>${esc(t.name)} engineers</h3> <p>${esc(t.metaDescription)}</p>${i === 0 ? ` <span class="role-card__badge">Featured</span>` : ""} </a>`).join("");
    return `<div class="reveal air-section-head" style="margin-top:2rem"><h2 class="h2">${esc(cat)}</h2></div><div class="roles-grid">${cards}</div>`;
  }).join("");
  return `<main id="main" class=""> <section class="hero"> <div class="container"> <p class="eyebrow">Engineering by technology</p> <h1>Hire engineers by the technology you build on</h1> <p>Match with senior nearshore engineers who already work in your stack. Senior-only talent, U.S. hours overlap, and profiles in as little as 72 hours.</p> </div> </section> <section class="section"> <div class="container"> ${sections} </div> </section> </main>`;
}

function renderHub() {
  return hubHead() + " " + PREFIX + hubMain() + " " + SUFFIX;
}

function run() {
  const filter = process.argv[2];
  const pubs = publishedTechs.filter((t) => !filter || t.slug.includes(filter));
  let count = 0;
  if (!pubs.length) {
    console.log("No published technologies match.");
  } else {
    for (const t of pubs) {
      const html = render(t);
      if (EMDASH.test(html)) { console.error(`FAIL ${t.slug}: em dash character found in output`); process.exitCode = 1; }
      const dir = path.join(ROOT, "technologies", t.slug);
      fs.mkdirSync(dir, { recursive: true });
      fs.writeFileSync(path.join(dir, "index.html"), html);
      console.log(`generated technologies/${t.slug}/index.html (${(html.length / 1024).toFixed(1)} KB)`);
      count++;
    }
  }
  const hubHtml = renderHub();
  if (EMDASH.test(hubHtml)) { console.error("FAIL technologies hub: em dash character found in output"); process.exitCode = 1; }
  fs.writeFileSync(path.join(ROOT, "technologies", "index.html"), hubHtml);
  console.log(`generated technologies/index.html (${(hubHtml.length / 1024).toFixed(1)} KB)`);
  console.log(`Done. ${count} page(s) + hub.`);
}

if (require.main === module) run();
module.exports = { render, renderHub, technologies, rosterSelections };
