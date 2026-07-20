#!/usr/bin/env node
/**
 * Build-time validation for the technology pages system.
 *
 * Checks the dataset (data/technologies.js) and every generated published page
 * (technologies/{slug}/index.html). Exits non-zero on any FAIL so it can gate
 * `npm run verify` and CI. WARN lines are advisory.
 *
 * Run: node tools/verify-tech-data.js
 */
"use strict";
const fs = require("fs");
const path = require("path");

const ROOT = path.join(__dirname, "..");
const { technologies } = require(path.join(ROOT, "data", "technologies.js"));

let fails = 0, warns = 0;
const fail = (m) => { console.error(`FAIL  ${m}`); fails++; };
const warn = (m) => { console.warn(`WARN  ${m}`); warns++; };
const ok = (m) => console.log(`ok    ${m}`);

const REQUIRED_PUBLISHED = [
  "metaDescription", "heroLead", "heroDirectAnswer", "atAGlance", "whatTheyBuild",
  "responsibilities", "coreSkills", "ecosystem", "useCases", "evaluation",
  "guideSections", "stats", "faqs", "relatedTechnologies", "ctaLead", "lastUpdated"
];
const STATUSES = new Set(["planned", "draft", "review", "published"]);
const allSlugs = new Set(technologies.map((t) => t.slug));
const ROLE_SLUGS = new Set([
  "front-end-engineers", "back-end-engineers", "full-stack-engineers", "mobile-engineers",
  "devops-engineers", "data-engineers", "data-science-engineers", "ai-engineers",
  "qa-engineers", "blockchain-engineers"
]);

// ---- Dataset checks ---------------------------------------------------------
const seenSlug = new Map(), seenTitle = new Map();
for (const t of technologies) {
  if (!t.name || !t.slug || !t.category) fail(`record missing name/slug/category: ${JSON.stringify(t.name || t.slug)}`);
  if (!STATUSES.has(t.status)) fail(`${t.slug}: invalid status "${t.status}"`);
  if (!/^[a-z0-9-]+-developers$/.test(t.slug)) warn(`${t.slug}: slug does not match {tech}-developers convention`);
  if (seenSlug.has(t.slug)) fail(`duplicate slug: ${t.slug}`); else seenSlug.set(t.slug, 1);

  if (t.status === "published") {
    const title = `Hire ${t.name} Developers | BetterEngineer`;
    if (seenTitle.has(title)) fail(`duplicate SEO title: ${title}`); else seenTitle.set(title, 1);
    for (const f of REQUIRED_PUBLISHED) {
      const v = t[f];
      if (v == null || (Array.isArray(v) && v.length === 0)) fail(`${t.slug}: missing required field "${f}"`);
    }
    if (t.metaDescription && (t.metaDescription.length < 120 || t.metaDescription.length > 155))
      fail(`${t.slug}: meta description ${t.metaDescription.length} chars (need 120-155)`);
    const words = (t.heroDirectAnswer || "").trim().split(/\s+/).length;
    if (t.heroDirectAnswer && (words < 35 || words > 70)) warn(`${t.slug}: heroDirectAnswer ${words} words (aim 40-60)`);
    if (Array.isArray(t.faqs) && (t.faqs.length < 4 || t.faqs.length > 8)) warn(`${t.slug}: ${t.faqs.length} FAQs (aim 4-6)`);
    (t.relatedTechnologies || []).forEach((s) => {
      if (!allSlugs.has(s)) fail(`${t.slug}: relatedTechnologies references unknown slug "${s}"`);
      if (s === t.slug) fail(`${t.slug}: relatedTechnologies references itself`);
    });
    (t.relatedRoles || []).forEach((s) => {
      if (!ROLE_SLUGS.has(s)) fail(`${t.slug}: relatedRoles references unknown role slug "${s}"`);
      else if (!fs.existsSync(path.join(ROOT, "roles", s, "index.html")))
        fail(`${t.slug}: relatedRoles "${s}" has no roles/${s}/index.html`);
    });
    if (!t.relatedRoles || !t.relatedRoles.length) warn(`${t.slug}: no relatedRoles set`);
    JSON.stringify(t).match(/—/) && fail(`${t.slug}: em dash character in data`);
  }
}
ok(`dataset: ${technologies.length} records, ${[...seenTitle.keys()].length} published`);

// ---- Generated page checks --------------------------------------------------
for (const t of technologies.filter((x) => x.status === "published")) {
  const file = path.join(ROOT, "technologies", t.slug, "index.html");
  if (!fs.existsSync(file)) { fail(`${t.slug}: published but technologies/${t.slug}/index.html not generated (run build-tech-pages.js)`); continue; }
  const html = fs.readFileSync(file, "utf8");
  const url = `https://discover.betterengineer.com/technologies/${t.slug}/`;
  const check = (cond, m) => { if (!cond) fail(`${t.slug}: ${m}`); };

  check(!/\[[A-Z_]+\]/.test(html), "leftover [TOKEN] in output");
  check(!/—/.test(html), "em dash character in output");
  check(html.includes(`<title>Hire ${t.name} Developers | BetterEngineer</title>`), "title must use Developers");
  check(html.includes(`<span class="light">${t.name} engineers</span>`) || (t.h1Noun && html.includes(t.h1Noun)), "H1 must use engineers");
  check(html.includes(`rel="canonical" href="${url}"`), "canonical must be discover slug URL");
  check((html.match(/<h1[ >]/g) || []).length === 1, "must have exactly one H1");
  check(html.includes("gtm.start"), "GTM head snippet missing");
  check(html.includes("ns.html?id=GTM-WT77L8JF"), "GTM noscript missing");
  check(html.includes('id="react-intake-form"') && html.includes('id="react-intake-status"'), "intake form not wired");
  check(html.includes('class="air-answer"'), "no direct-answer block");
  check(html.includes('class="air-glance"'), "no at-a-glance table");
  check(/id="responsibilities"/.test(html), "no responsibilities/skills section");
  check(/class="air-stat /.test(html), "no cited stats");
  check(/id="candidates"/.test(html), "no candidate cards section");
  check(/id="guide"/.test(html), "no long-form hiring guide section");
  check(/id="trust"/.test(html), "no trust section");
  check(/id="hiring-path"/.test(html), "no hiring path section");
  check(/id="other-technologies"/.test(html), "no other-technologies section");
  check(!/air-trust-mini reveal">\s*<h4>/.test(html), "trust mini cards must use h3, not h4 (heading hierarchy)");

  const candidateNameCount = (html.match(/air-candidate-card__name/g) || []).length;
  if (candidateNameCount === 0) warn(`${t.slug}: zero candidate cards rendered (roster selector found no matches)`);
  const engineerPhotoRefs = [...html.matchAll(/\/images\/engineers\/([a-z0-9-]+)\.png/g)].map((m) => m[1]);
  engineerPhotoRefs.forEach((id) => {
    if (!fs.existsSync(path.join(ROOT, "images", "engineers", `${id}.png`)))
      fail(`${t.slug}: engineer photo /images/engineers/${id}.png does not exist on disk`);
  });

  (t.relatedRoles || []).forEach((slug) => {
    if (!html.includes(`/roles/${slug}/`)) warn(`${t.slug}: relatedRoles "${slug}" set in data but not linked on the page`);
  });

  const ldBlocks = [...html.matchAll(/<script type="application\/ld\+json">(.*?)<\/script>/gs)].map((m) => {
    try { return JSON.parse(m[1]); } catch (e) { fail(`${t.slug}: invalid JSON-LD (${e.message})`); return null; }
  }).filter(Boolean);
  const faqLd = ldBlocks.find((o) => o["@type"] === "FAQPage");
  const visibleQ = [...html.matchAll(/<span class="faq-question">(.*?)<\/span>/g)].map((m) => m[1]);
  check(!!faqLd, "no FAQPage JSON-LD");
  check(!!ldBlocks.find((o) => o["@type"] === "BreadcrumbList"), "no BreadcrumbList JSON-LD");
  check(!!ldBlocks.find((o) => o["@type"] === "Service"), "no Service JSON-LD");
  check(!!ldBlocks.find((o) => o["@type"] === "Organization"), "no Organization JSON-LD");
  check(!!ldBlocks.find((o) => o["@type"] === "WebPage"), "no WebPage JSON-LD");
  check(html.includes('name="twitter:card"'), "no Twitter Card meta");
  if (faqLd) {
    const ldQ = faqLd.mainEntity.map((q) => q.name);
    check(ldQ.length === visibleQ.length, `FAQ count mismatch (visible ${visibleQ.length}, JSON-LD ${ldQ.length})`);
    check(ldQ.every((q, i) => q === visibleQ[i]), "FAQ JSON-LD wording does not match visible FAQ");
  }
  const links = [...html.matchAll(/href="(\/technologies\/[a-z0-9-]+\/)"/g)].map((m) => m[1]);
  links.forEach((href) => {
    if (href === "/technologies/") return;
    const slug = href.split("/")[2];
    if (!fs.existsSync(path.join(ROOT, "technologies", slug, "index.html")))
      fail(`${t.slug}: internal link ${href} points to a page that is not generated`);
  });
  const roleLinks = [...html.matchAll(/href="(\/roles\/[a-z0-9-]+\/)"/g)].map((m) => m[1]);
  roleLinks.forEach((href) => {
    if (href === "/roles/") return;
    const slug = href.split("/")[2];
    if (!fs.existsSync(path.join(ROOT, "roles", slug, "index.html")))
      fail(`${t.slug}: internal role link ${href} points to a page that does not exist`);
  });
  ok(`page technologies/${t.slug}/index.html`);
}

console.log(`\n${fails ? "FAILED" : "PASSED"} tech-data validation: ${fails} fail, ${warns} warn`);
process.exit(fails ? 1 : 0);
