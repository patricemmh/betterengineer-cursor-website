#!/usr/bin/env node
/**
 * verify-tech-page.js
 *
 * Verifies a single BetterEngineer technology landing page against the
 * pre-push checklist. Runs no network calls; it only inspects the HTML.
 *
 * Usage:
 *   node .cursor/skills/create-tech-page/scripts/verify-tech-page.js --slug=python
 *   node .cursor/skills/create-tech-page/scripts/verify-tech-page.js --slug=python --name=Python
 *
 * Exit code is 0 when there are no hard failures, 1 otherwise.
 * Warnings never fail the run; they flag things a human should confirm.
 */

'use strict';
const fs   = require('fs');
const path = require('path');

// ── Parse args ───────────────────────────────────────────────────────────────
const args = {};
process.argv.slice(2).forEach(arg => {
  const [k, v] = arg.replace(/^--/, '').split('=');
  args[k] = v;
});

const slug = args.slug;
const name = args.name || '';
if (!slug) {
  console.error('Usage: node verify-tech-page.js --slug=<slug> [--name="<Display Name>"]');
  process.exit(1);
}

const repoRoot = path.join(__dirname, '..', '..', '..', '..');
const file     = path.join(repoRoot, 'technologies', slug, 'index.html');

const fails = [];
const warns = [];
const oks   = [];
const fail = m => fails.push(m);
const warn = m => warns.push(m);
const ok   = m => oks.push(m);

if (!fs.existsSync(file)) {
  console.error(`FAIL: file not found: technologies/${slug}/index.html`);
  process.exit(1);
}
const html = fs.readFileSync(file, 'utf8');

const canonical = `https://discover.betterengineer.com/technologies/${slug}/`;

// 1. Canonical + og:url
if (html.includes(`rel="canonical" href="${canonical}"`)) ok('canonical URL correct');
else fail(`canonical is not ${canonical}`);
if (html.includes(`property="og:url" content="${canonical}"`)) ok('og:url correct');
else fail(`og:url is not ${canonical}`);

// 2. Meta description length (120-155)
const descMatch = html.match(/<meta name="description" content="([^"]*)"/);
if (!descMatch) {
  fail('meta description tag missing');
} else {
  const len = descMatch[1].length;
  if (len >= 120 && len <= 155) ok(`meta description length ${len} (120-155)`);
  else fail(`meta description length ${len} is outside 120-155`);
}

// 3. No leftover [BRACKET] tokens
const brackets = html.match(/\[[A-Z][A-Z0-9_]{2,}\]/g);
if (brackets) fail(`leftover bracket tokens: ${[...new Set(brackets)].join(', ')}`);
else ok('no leftover [BRACKET] tokens');

// 4. GTM head snippet present (real snippet, not the placeholder comment)
if (html.includes('gtm.start')) ok('GTM head snippet present (gtm.start)');
else fail('GTM head snippet missing (no gtm.start; still a placeholder comment?)');

// 5. GTM noscript iframe present
if (html.includes('ns.html?id=GTM')) ok('GTM noscript iframe present');
else fail('GTM noscript iframe missing (no ns.html?id=GTM)');

// 6. og:image present
if (html.includes('property="og:image"')) ok('og:image present');
else fail('og:image missing');

// 7. BreadcrumbList JSON-LD present and references this page
if (html.includes('"@type":"BreadcrumbList"')) {
  ok('BreadcrumbList JSON-LD present');
  if (!html.includes(`https://discover.betterengineer.com/technologies/${slug}/","@type"`) &&
      !html.includes(canonical)) {
    warn('BreadcrumbList may not reference this page URL; confirm the last item item URL');
  }
  if (name && !html.includes(`"name":"${name} Engineers"`)) {
    warn(`BreadcrumbList last item name is not "${name} Engineers"; confirm it`);
  }
} else {
  fail('BreadcrumbList JSON-LD missing');
}

// 8. FAQPage JSON-LD count matches the visible FAQ count
const jsonQuestions = (html.match(/"@type":"Question"/g) || []).length;
const visibleFaqs   = (html.match(/class="faq-item/g) || []).length;
if (jsonQuestions === 0) {
  fail('FAQPage JSON-LD has no questions');
} else if (jsonQuestions === visibleFaqs) {
  ok(`FAQ counts match (${jsonQuestions} JSON-LD questions, ${visibleFaqs} visible items)`);
} else {
  fail(`FAQ count mismatch: ${jsonQuestions} JSON-LD questions vs ${visibleFaqs} visible items`);
}

// 9. Visible FAQ questions should each appear in the JSON-LD (wording sync)
const decode = s => s
  .replace(/&#39;/g, "'").replace(/&#039;/g, "'").replace(/&apos;/g, "'")
  .replace(/&amp;/g, '&').replace(/&quot;/g, '"').replace(/&gt;/g, '>').replace(/&lt;/g, '<')
  .replace(/\s+/g, ' ').trim();
const visibleQs = [...html.matchAll(/<span class="faq-question">([^<]*)<\/span>/g)].map(m => decode(m[1]));
const jsonNames = [...html.matchAll(/"@type":"Question","name":"((?:[^"\\]|\\.)*)"/g)]
  .map(m => decode(m[1].replace(/\\"/g, '"')));
if (visibleQs.length) {
  const missing = visibleQs.filter(q => !jsonNames.some(n => n === q));
  if (missing.length === 0) ok('every visible FAQ question is present in the JSON-LD');
  else warn(`FAQ wording may differ; not found verbatim in JSON-LD: "${missing[0]}"${missing.length > 1 ? ` (+${missing.length - 1} more)` : ''}`);
}

// 10. No em dash character anywhere
if (html.includes('\u2014')) fail('em dash character found in copy (remove all)');
else ok('no em dash characters');

// 11. Leftover React copy (only meaningful when the tech is not React itself)
const isReactTech = /react/i.test(slug) || /react/i.test(name);
const reactHits = (html.match(/react/gi) || []).length;
if (!isReactTech && reactHits > 0) {
  warn(`found ${reactHits} occurrence(s) of "react"; confirm none are leftover template copy`);
} else if (!isReactTech) {
  ok('no leftover "React" copy');
}

// 12. Ecosystem icons resolve to a CDN (informational)
const iconCount = (html.match(/cdn\.simpleicons\.org|devicon@latest/g) || []).length;
if (iconCount > 0) ok(`${iconCount} ecosystem icon reference(s) found`);
else warn('no ecosystem icon CDN references found; confirm #ecosystem icons are set');

// ── Report ───────────────────────────────────────────────────────────────────
console.log(`\nVerifying technologies/${slug}/index.html\n`);
oks.forEach(m => console.log(`  OK   ${m}`));
warns.forEach(m => console.log(`  WARN ${m}`));
fails.forEach(m => console.log(`  FAIL ${m}`));
console.log(`\n${oks.length} ok, ${warns.length} warning(s), ${fails.length} failure(s).`);

process.exit(fails.length ? 1 : 0);
