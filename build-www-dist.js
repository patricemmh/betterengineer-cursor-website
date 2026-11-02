'use strict';

/* Builds the www.betterengineer.com bundle in ./dist-www/ for S3 + CloudFront.
   Run the root build first with PRE_CUTOVER_ROBOTS = null in data/pages.js:
     PowerShell: $env:INTERNAL_LINKS='local'; npm run build; Remove-Item Env:INTERNAL_LINKS; node build-www-dist.js
   /roles/, /technologies/, and /ai-fluent-engineers/ are shipped. A missing
   required file fails the build. Authoring templates are not shipped.
   Redirects live in docs/site-migration/cloudfront-www-function.js.
   That function file is not pasted into CloudFront by this build. */

var fs = require('fs');
var path = require('path');

var root = __dirname;
var outDir = path.join(root, 'dist-www');
var WWW = 'https://www.betterengineer.com';

var manifest = require('./data/pages.js');
var inventory = require('./data/live-url-inventory.js');

var ASSET_DIRS = ['icons', 'images', 'styles', 'scripts', 'downloads', 'videos', 'embeds', 'fonts'];
var problems = [];

/* Empty the folder rather than delete it: Dropbox locks the folder itself. */
function clean(dir) {
  if (!fs.existsSync(dir)) return;
  fs.readdirSync(dir).forEach(function (entry) {
    fs.rmSync(path.join(dir, entry), { recursive: true, force: true, maxRetries: 10, retryDelay: 300 });
  });
}

function copyFile(rel) {
  var src = path.join(root, rel);
  var dest = path.join(outDir, rel);
  fs.mkdirSync(path.dirname(dest), { recursive: true });
  fs.copyFileSync(src, dest);
}

clean(outDir);
fs.mkdirSync(outDir, { recursive: true });

/* 1. Pages from the manifest. Flat *.html twins are discover-era aliases; skip them. */
var shipped = [];
manifest.pages.forEach(function (page) {
  page.outputs.forEach(function (out) {
    if (!/(^|\/)index\.html$/.test(out)) return;
    if (!fs.existsSync(path.join(root, out))) {
      console.error('missing built page: ' + out + ' (run npm run build first)');
      process.exitCode = 1;
      return;
    }
    copyFile(out);
    shipped.push({ page: page, out: out });
  });
});

/* Thank-you is a standalone page, not a fragment, so the page manifest does not emit it.
   Copy it as-is. Its HTML uses the same consent gate as the other pages (no inline gtm.js). */
var thankYouOut = 'multi-step-contact-form/thank-you/index.html';
if (!fs.existsSync(path.join(root, thankYouOut))) {
  console.error('missing built page: ' + thankYouOut);
  process.exitCode = 1;
} else {
  copyFile(thankYouOut);
  shipped.push({
    page: { canonical: WWW + '/multi-step-contact-form/thank-you' },
    out: thankYouOut,
  });
}

/* Roles, technologies, and the AI fluency URL. Templates are authoring files
   and must not ship. A missing required page fails the build. */
function addShippedHtml(rel) {
  var src = path.join(root, rel);
  if (!fs.existsSync(src)) {
    problems.push('missing required file: ' + rel);
    return;
  }
  copyFile(rel);
  var html = fs.readFileSync(src, 'utf8');
  var canonicalMatch = html.match(/<link rel="canonical" href="([^"]+)"/);
  var canonical = canonicalMatch ? canonicalMatch[1] : '';
  if (canonical.indexOf('discover.betterengineer.com') !== -1) {
    problems.push('discover canonical in ' + rel);
  }
  shipped.push({ page: { canonical: canonical }, out: rel });
}

addShippedHtml('roles/index.html');
fs.readdirSync(path.join(root, 'roles')).forEach(function (name) {
  if (name === 'roles-template' || name === 'index.html') return;
  var dir = path.join(root, 'roles', name);
  if (!fs.statSync(dir).isDirectory()) return;
  addShippedHtml('roles/' + name + '/index.html');
});

addShippedHtml('technologies/index.html');
require('./data/technologies.js').technologies.forEach(function (tech) {
  if (tech.status !== 'published') return;
  addShippedHtml('technologies/' + tech.slug + '/index.html');
});

var fluencySrcRel = 'services/hire-ai-ready-engineers/index.html';
var fluencyRel = 'ai-fluent-engineers/index.html';
var fluencySrc = path.join(root, fluencySrcRel);
if (!fs.existsSync(fluencySrc)) {
  problems.push('missing required file: ' + fluencySrcRel + ' (run npm run build first)');
} else {
  var fluencyHtml = fs.readFileSync(fluencySrc, 'utf8');
  if (fluencyHtml.indexOf(WWW + '/ai-fluent-engineers/') === -1) {
    problems.push('AI fluency canonical is not ' + WWW + '/ai-fluent-engineers/');
  }
  var fluencyDest = path.join(outDir, fluencyRel);
  fs.mkdirSync(path.dirname(fluencyDest), { recursive: true });
  fs.writeFileSync(fluencyDest, fluencyHtml);
  shipped.push({ page: { canonical: WWW + '/ai-fluent-engineers/' }, out: fluencyRel });
}

['roles/roles-template/index.html', 'technologies/tech-template/index.html'].forEach(function (rel) {
  if (fs.existsSync(path.join(outDir, rel))) problems.push('template shipped: ' + rel);
});

/* 2. Static assets. */
ASSET_DIRS.forEach(function (d) {
  if (fs.existsSync(path.join(root, d))) {
    fs.cpSync(path.join(root, d), path.join(outDir, d), { recursive: true });
  }
});

/* 3. Root-level scripts referenced by any shipped page. */
var rootScripts = {};
shipped.forEach(function (s) {
  var html = fs.readFileSync(path.join(outDir, s.out), 'utf8');
  var re = /<script[^>]+src="\.?\/([A-Za-z0-9_.-]+\.js)"/g;
  var m;
  while ((m = re.exec(html)) !== null) rootScripts[m[1]] = true;
});
Object.keys(rootScripts).forEach(function (f) {
  if (fs.existsSync(path.join(root, f))) copyFile(f);
});
if (!fs.existsSync(path.join(root, 'air-page.js'))) {
  problems.push('missing required file: air-page.js');
} else if (!fs.existsSync(path.join(outDir, 'air-page.js'))) {
  copyFile('air-page.js');
}

/* 4. 404, robots, sitemap. */
fs.writeFileSync(
  path.join(outDir, '404.html'),
  '<!DOCTYPE html>\n' +
    '<html lang="en">\n' +
    '<head>\n' +
    '  <meta charset="utf-8">\n' +
    '  <meta name="viewport" content="width=device-width, initial-scale=1">\n' +
    '  <title>Page not found | BetterEngineer</title>\n' +
    '  <meta name="robots" content="noindex">\n' +
    '  <link rel="icon" href="/icons/favicon.png" type="image/png">\n' +
    '  <link rel="stylesheet" href="/styles/cookie-consent.css">\n' +
    '  <script src="/scripts/cookie-consent.js"></script>\n' +
    '  <script type="application/json" id="be-gtm-config">{"id":"GTM-WT77L8JF"}</script>\n' +
    '  <script type="application/json" id="be-hs-config">{"portalId":"8679235"}</script>\n' +
    '  <style>\n' +
    '    body { margin: 0; min-height: 100vh; display: grid; place-items: center; font-family: "Plus Jakarta Sans", system-ui, sans-serif; background: #fafafe; color: #1c1c1c; }\n' +
    '    main { text-align: center; padding: 2rem; max-width: 32rem; }\n' +
    '    h1 { font-size: 2rem; margin: 0 0 0.5rem; }\n' +
    '    p { color: #5c5c66; line-height: 1.5; }\n' +
    '    a { color: #545bb3; font-weight: 700; }\n' +
    '  </style>\n' +
    '</head>\n' +
    '<body>\n' +
    '  <main>\n' +
    '    <h1>Page not found</h1>\n' +
    '    <p>That page moved or no longer exists.</p>\n' +
    '    <p><a href="/">Back to BetterEngineer</a> or <a href="/contact/">contact us</a>.</p>\n' +
    '  </main>\n' +
    '</body>\n' +
    '</html>\n',
  'utf8',
);

fs.writeFileSync(
  path.join(outDir, 'robots.txt'),
  'User-agent: *\nAllow: /\n\nSitemap: ' + WWW + '/sitemap.xml\n',
  'utf8',
);

var redirectedUrls = {};
inventory.urls.forEach(function (u) {
  if (u.status === 'redirect') redirectedUrls[u.url.replace(/\/$/, '')] = true;
});

var locs = [WWW + '/'];
shipped.forEach(function (s) {
  var html = fs.readFileSync(path.join(outDir, s.out), 'utf8');
  if (/<meta name="robots" content="[^"]*noindex/i.test(html)) return;
  var canonical = typeof s.page.canonical === 'string' ? s.page.canonical : null;
  if (!canonical || canonical.indexOf(WWW + '/') !== 0) return;
  var p = canonical.slice(WWW.length).replace(/\/$/, '');
  if (!p || redirectedUrls[p]) return;
  if (locs.indexOf(canonical) === -1) locs.push(canonical);
});
var lastmod = new Date().toISOString().slice(0, 10);
fs.writeFileSync(
  path.join(outDir, 'sitemap.xml'),
  '<?xml version="1.0" encoding="UTF-8"?>\n' +
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' +
    locs
      .sort()
      .map(function (loc) {
        return '  <url>\n    <loc>' + loc + '</loc>\n    <lastmod>' + lastmod + '</lastmod>\n  </url>';
      })
      .join('\n') +
    '\n</urlset>\n',
  'utf8',
);

function writeLlmsTxt() {
  var lines = [
    '# BetterEngineer',
    '',
    '> BetterEngineer connects U.S. companies with pre-vetted senior software engineers from Latin America who embed as trusted long-term collaborators.',
    '',
    '## Key pages',
    '',
    '- [Home](' + WWW + '/): BetterEngineer staff augmentation and hiring platform overview.',
    '- [AI Fluent Engineers](' + WWW + '/ai-fluent-engineers/): AI fluency program overview.',
    '- [AI Systems Readiness for Manufacturing](' + WWW + '/services/ai-systems-readiness-for-manufacturing/): AI systems readiness for manufacturing teams.',
    '- [Roles](' + WWW + '/roles/): Hire by engineering role (front-end, back-end, full-stack, mobile, DevOps, data, AI, QA, blockchain).',
    '- [Technologies](' + WWW + '/technologies/): Hire by technology and framework.',
  ];

  ['staff-augmentation', 'latamengineer', 'faqs', 'about', 'contact'].forEach(function (slug) {
    var page = manifest.pages.filter(function (p) { return p.slug === slug; })[0];
    if (!page) {
      problems.push('llms.txt page missing from manifest: ' + slug);
      return;
    }
    var label = page.breadcrumb[page.breadcrumb.length - 1].name;
    lines.push('- [' + label + '](' + page.canonical + '): ' + page.description);
  });

  function collectPages(baseDir, urlPrefix, label) {
    if (!fs.existsSync(baseDir)) return;
    fs.readdirSync(baseDir).forEach(function (entry) {
      var entryPath = path.join(baseDir, entry);
      if (!fs.statSync(entryPath).isDirectory()) return;
      if (entry === 'roles-template' || entry === 'tech-template') return;
      var indexPath = path.join(entryPath, 'index.html');
      if (!fs.existsSync(indexPath)) return;
      var html = fs.readFileSync(indexPath, 'utf8');
      var titleMatch = html.match(/<title>([^<]*)<\/title>/);
      var title = titleMatch ? titleMatch[1].replace(' | BetterEngineer', '') : entry;
      lines.push('- [' + title + '](' + WWW + urlPrefix + entry + '/): ' + label + '.');
    });
  }

  lines.push('');
  lines.push('## Roles');
  lines.push('');
  collectPages(path.join(outDir, 'roles'), '/roles/', 'Hire senior nearshore engineers for this role');
  lines.push('');
  lines.push('## Technologies');
  lines.push('');
  collectPages(path.join(outDir, 'technologies'), '/technologies/', 'Hire senior nearshore engineers for this technology');
  fs.writeFileSync(path.join(outDir, 'llms.txt'), lines.join('\n') + '\n', 'utf8');
}

writeLlmsTxt();

/* 5. Checks: every inventory page is in the bundle, and local references resolve. */
inventory.urls.forEach(function (u) {
  if (u.status === 'built' && !fs.existsSync(path.join(outDir, u.localPath))) {
    problems.push('inventory page not in bundle: ' + u.url + ' -> ' + u.localPath);
  }
  if (u.status === 'pending') problems.push('inventory URL has no page or redirect: ' + u.url);
});

function resolves(ref) {
  var clean = decodeURIComponent(ref.split('#')[0].split('?')[0]);
  if (!clean || clean === '/') return true;
  if (redirectedUrls[clean.replace(/\/$/, '')]) return true;
  var abs = path.join(outDir, clean);
  if (fs.existsSync(abs) && fs.statSync(abs).isFile()) return true;
  return fs.existsSync(path.join(abs, 'index.html'));
}

var missingRefs = {};
shipped.concat([{ out: '404.html' }]).forEach(function (s) {
  var html = fs.readFileSync(path.join(outDir, s.out), 'utf8');
  var re = /(?:src|href)="(\/(?!\/)[^"]*)"|srcset="(\/(?!\/)[^" ,]*)/g;
  var m;
  while ((m = re.exec(html)) !== null) {
    var ref = m[1] || m[2];
    if (!resolves(ref)) (missingRefs[ref] = missingRefs[ref] || []).push(s.out);
  }
});
Object.keys(missingRefs).forEach(function (ref) {
  problems.push('broken local reference ' + ref + ' (in ' + missingRefs[ref].length + ' page(s), e.g. ' + missingRefs[ref][0] + ')');
});

['air-page.js', 'hire-software-engineers-in-72-hours/index.html', 'llms.txt'].forEach(function (rel) {
  if (!fs.existsSync(path.join(outDir, rel))) problems.push('missing required file: ' + rel);
});

function scanDiscover(dir, rel) {
  fs.readdirSync(dir).forEach(function (name) {
    var abs = path.join(dir, name);
    var child = rel ? rel + '/' + name : name;
    if (fs.statSync(abs).isDirectory()) {
      scanDiscover(abs, child);
      return;
    }
    if (!/\.(html|xml|txt|js|css)$/.test(name)) return;
    var text = fs.readFileSync(abs, 'utf8');
    if (text.indexOf('discover.betterengineer.com') !== -1) {
      problems.push('discover host still in shipped file ' + child);
    }
  });
}
scanDiscover(outDir, '');

console.log('www bundle ready in ./dist-www/');
console.log('  pages: ' + shipped.length + ', sitemap URLs: ' + locs.length + ', root scripts: ' + Object.keys(rootScripts).join(', '));
if (problems.length) {
  console.error('  ' + problems.length + ' problem(s):');
  problems.forEach(function (p) {
    console.error('    - ' + p);
  });
  process.exitCode = 1;
} else {
  console.log('  every inventory URL is built or redirected; every local reference resolves');
}
