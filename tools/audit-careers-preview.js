'use strict';
const fs = require('fs');
const path = require('path');

const repo = path.join(__dirname, '..');
const preview = fs.readFileSync(path.join(repo, 'preview/index.html'), 'utf8');
const section = preview.match(/<section id="careers">[\s\S]*?<\/section>/)[0];
const hrefs = [...section.matchAll(/href="([^"]+)"/g)].map((m) => m[1]);
const careersDir = path.join(repo, 'careers');

function audit(href) {
  if (href === '/careers/') {
    const f = path.join(repo, 'careers/index.html');
    if (!fs.existsSync(f)) return { status: 'missing' };
    const h = fs.readFileSync(f, 'utf8');
    const hasHero = /class="[^"]*career-hero|job-hero|hero-careers|careers-hero/i.test(h) || /<h1[^>]*>[\s\S]{10,}/i.test(h);
    const hasList = /openings|current openings|hasPart|careers-job/i.test(h);
    const ok = hasHero && hasList && h.length > 50000;
    return { status: ok ? 'ok' : 'partial', size: h.length };
  }
  if (href === '/join/') {
    const f = path.join(repo, 'join/index.html');
    if (!fs.existsSync(f)) return { status: 'missing' };
    const h = fs.readFileSync(f, 'utf8');
    const hasHero = /<h1[^>]*>[\s\S]{10,}/i.test(h);
    const hasBody = h.length > 50000;
    return { status: hasHero && hasBody ? 'ok' : 'partial', size: h.length };
  }
  const m = href.match(/^\/careers\/([^/]+)\/$/);
  if (!m) return { status: 'unknown' };
  const f = path.join(careersDir, m[1], 'index.html');
  if (!fs.existsSync(f)) return { status: 'missing' };
  const h = fs.readFileSync(f, 'utf8');
  const hasJobPosting = /JobPosting/.test(h);
  const hasDuties = /Duties|duties|What you.ll do|What you'll do|Responsibilities|req-heading|duties-heading/i.test(h);
  const hasReq = /Requirements|requirements|What we're looking|What we.re looking|req-heading/i.test(h);
  const hasIntro = /We are seeking|We.re seeking|join a U\.S/i.test(h);
  if (h.length < 20000) return { status: 'partial', size: h.length };
  if (hasJobPosting && (hasDuties || hasReq || hasIntro)) return { status: 'ok', size: h.length };
  return { status: 'partial', size: h.length };
}

const rows = hrefs.map((href) => {
  const a = audit(href);
  const labelMatch = section.match(new RegExp('href="' + href.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '"><span>([^<]+)'));
  return { label: labelMatch ? labelMatch[1] : href, href, ...a };
});

console.log(JSON.stringify(rows, null, 2));
const ok = rows.filter((r) => r.status === 'ok');
const miss = rows.filter((r) => r.status === 'missing');
const part = rows.filter((r) => r.status === 'partial');
console.log('TOTAL', rows.length, 'OK', ok.length, 'PARTIAL', part.length, 'MISSING', miss.length);
if (miss.length) console.log('MISSING:', miss.map((r) => r.href).join(', '));
if (part.length) console.log('PARTIAL:', part.map((r) => r.href).join(', '));

if (process.argv.includes('--patch-preview')) {
  const previewPath = path.join(repo, 'preview/index.html');
  let html = fs.readFileSync(previewPath, 'utf8');
  html = html.replace(/(<section id="careers">[\s\S]*?<\/section>)/, (sec) =>
    sec.replace(/<a class="page" href=/g, '<a class="page" data-default-ready="true" href=')
  );
  fs.writeFileSync(previewPath, html);
  console.log('Patched preview/index.html careers section with data-default-ready');
}
