'use strict';

const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
const distRoot = path.join(root, 'dist');
const DISCOVER = 'https://discover.betterengineer.com';
const GTM_ID = 'GTM-WT77L8JF';

const errors = [];
const htmlFiles = [];

const URL_CORRUPTION = [
  { pattern: /sign-in - redirect_url/, label: 'broken login URL (sign-in - redirect_url)' },
  { pattern: /gtm\.js - id=/, label: 'broken GTM loader (gtm.js - id=)' },
  { pattern: /ns\.html - id=/, label: 'broken GTM noscript (ns.html - id=)' },
  { pattern: /href="[^"]*\s-\s[a-z_]+=/i, label: 'space-hyphen inside href query string' },
];

function rel(filePath) {
  return path.relative(root, filePath).replace(/\\/g, '/');
}

function walkHtml(dir) {
  if (!fs.existsSync(dir)) return;
  for (const name of fs.readdirSync(dir)) {
    const p = path.join(dir, name);
    const st = fs.statSync(p);
    if (st.isDirectory()) walkHtml(p);
    else if (name.endsWith('.html')) htmlFiles.push(p);
  }
}

function fail(filePath, message) {
  errors.push(rel(filePath) + ': ' + message);
}

function resolveDistAsset(urlPath) {
  var p = urlPath.split('?')[0].split('#')[0];
  if (!p || p === '/') return path.join(distRoot, 'index.html');
  if (p.endsWith('/')) return path.join(distRoot, p.slice(1), 'index.html');
  return path.join(distRoot, p.slice(1));
}

function checkUrlCorruption(filePath, html) {
  URL_CORRUPTION.forEach(function (rule) {
    if (rule.pattern.test(html)) fail(filePath, rule.label);
  });
}

const CANONICAL_TOP_LEVEL = {
  'ai-fluent-engineers': 'ai-fluent-engineers',
  aimanufacturing: 'aimanufacturing',
};

function isCaseAliasRedirect(filePath) {
  const r = rel(filePath);
  const m = r.match(/^dist\/([^/]+)\/index\.html$/);
  if (!m) return false;
  const seg = m[1];
  const lower = seg.toLowerCase();
  return CANONICAL_TOP_LEVEL[lower] && seg !== CANONICAL_TOP_LEVEL[lower];
}

function isMetaRefreshStub(html) {
  return /<meta\s+http-equiv=["']refresh["']/i.test(html) && html.length < 1200;
}

function shouldSkipOptionalChecks(filePath, html) {
  const r = rel(filePath);
  return (
    r === 'dist/index.html' ||
    r.includes('/roles-template/') ||
    r.includes('/tech-template/') ||
    isCaseAliasRedirect(filePath) ||
    isMetaRefreshStub(html)
  );
}

function checkGtm(filePath, html) {
  if (shouldSkipOptionalChecks(filePath, html)) return;
  if (!html.includes(GTM_ID)) {
    fail(filePath, 'missing GTM container id ' + GTM_ID);
  }
  if (!html.includes('googletagmanager.com/gtm.js')) {
    fail(filePath, 'missing GTM loader script');
  }
  if (html.includes('gtm.js - id=') || html.includes('ns.html - id=')) {
    fail(filePath, 'corrupted GTM URL (space-hyphen instead of ?)');
  }
  if (!html.includes('googletagmanager.com/ns.html')) {
    fail(filePath, 'missing GTM noscript iframe');
  }
}

function checkJsonLd(filePath, html) {
  const re = /<script type="application\/ld\+json">([\s\S]*?)<\/script>/g;
  let m;
  while ((m = re.exec(html)) !== null) {
    try {
      const data = JSON.parse(m[1]);
      if (data['@type'] !== 'FAQPage' || !Array.isArray(data.mainEntity)) continue;
      data.mainEntity.forEach(function (item, i) {
        if (!item.name || !item.name.endsWith('?')) {
          fail(filePath, 'FAQ JSON-LD question ' + (i + 1) + ' missing ?');
        }
        if (/\s-\s*$/.test(item.name)) {
          fail(filePath, 'FAQ JSON-LD question ' + (i + 1) + ' has trailing dash corruption');
        }
      });
    } catch (e) {
      fail(filePath, 'invalid JSON-LD: ' + e.message);
    }
  }
}

function checkCanonical(filePath, html) {
  const can = html.match(/rel="canonical" href="([^"]+)"/);
  if (!can) return;
  if (!can[1].startsWith(DISCOVER + '/')) {
    fail(filePath, 'canonical not on discover host: ' + can[1]);
  }
}

function collectInternalLinks(html) {
  const links = new Set();
  const re = /href="(\/[^"]*)"/g;
  let m;
  while ((m = re.exec(html)) !== null) {
    var href = m[1];
    if (href.startsWith('//')) continue;
    links.add(href);
  }
  return links;
}

function checkSitemap() {
  const sitemapPath = path.join(distRoot, 'sitemap.xml');
  if (!fs.existsSync(sitemapPath)) {
    errors.push('dist/sitemap.xml: missing');
    return;
  }
  const xml = fs.readFileSync(sitemapPath, 'utf8');
  const locRe = /<loc>([^<]+)<\/loc>/g;
  let m;
  while ((m = locRe.exec(xml)) !== null) {
    const loc = m[1];
    if (!loc.startsWith(DISCOVER + '/')) {
      errors.push('dist/sitemap.xml: loc not on discover host: ' + loc);
      continue;
    }
    const urlPath = loc.slice(DISCOVER.length);
    const target = resolveDistAsset(urlPath);
    if (!fs.existsSync(target)) {
      errors.push('dist/sitemap.xml: loc has no built file: ' + loc + ' (' + rel(target) + ')');
    }
  }
}

function checkLegacyContactCta(filePath, html) {
  if (shouldSkipOptionalChecks(filePath, html)) return;
  if (/betterengineer\.com\/contact/.test(html)) {
    fail(filePath, 'legacy /contact CTA (use /multi-step-contact-form)');
  }
}

function checkRobots() {
  const robotsPath = path.join(distRoot, 'robots.txt');
  if (!fs.existsSync(robotsPath)) {
    errors.push('dist/robots.txt: missing');
    return;
  }
  const robots = fs.readFileSync(robotsPath, 'utf8');
  if (!robots.includes('Sitemap: ' + DISCOVER + '/sitemap.xml')) {
    errors.push('dist/robots.txt: missing sitemap directive');
  }
}

if (!fs.existsSync(distRoot)) {
  console.error('dist/ not found. Run node build-discover-dist.js first.');
  process.exit(1);
}

walkHtml(distRoot);

htmlFiles.forEach(function (filePath) {
  const html = fs.readFileSync(filePath, 'utf8');
  checkUrlCorruption(filePath, html);
  checkGtm(filePath, html);
  checkJsonLd(filePath, html);
  checkLegacyContactCta(filePath, html);
  if (rel(filePath).startsWith('dist/roles/') || rel(filePath).startsWith('dist/technologies/')) {
    if (!shouldSkipOptionalChecks(filePath, html)) {
      checkCanonical(filePath, html);
    }
  }
});

const checkedLinks = new Set();
htmlFiles.forEach(function (filePath) {
  const html = fs.readFileSync(filePath, 'utf8');
  collectInternalLinks(html).forEach(function (href) {
    const key = href;
    if (checkedLinks.has(key)) return;
    checkedLinks.add(key);
    const target = resolveDistAsset(href);
    if (!fs.existsSync(target)) {
      errors.push(rel(filePath) + ': broken internal link ' + href + ' (' + rel(target) + ' missing)');
    }
  });
});

checkSitemap();
checkRobots();

if (errors.length) {
  console.error('dist verification failed (' + errors.length + ' issue(s)):');
  errors.forEach(function (e) {
    console.error(' ', e);
  });
  process.exit(1);
}

console.log(
  'dist verification passed:',
  htmlFiles.length,
  'HTML files,',
  checkedLinks.size,
  'internal links, sitemap + robots OK',
);
