'use strict';

/* Builds the discover.betterengineer.com bundle: / redirects to www.betterengineer.com, plus /aimanufacturing/, /ai-fluent-engineers/, /roles/, /technologies/. See GITHUB_PAGES_DISCOVER_HOSTING.md. */

var cp = require('child_process');
var fs = require('fs');
var path = require('path');

var root = __dirname;

function runBuild(basePath, outputRoot, lpRootPage, initPublishRoot) {
  var env = Object.assign({}, process.env, {
    OUTPUT_ROOT: outputRoot,
    LP_ROOT_PAGE: lpRootPage,
    GITHUB_PAGES_CNAME: 'discover.betterengineer.com',
  });
  if (initPublishRoot) {
    env.PAGES_PUBLISH_ROOT = 'dist';
  } else {
    delete env.PAGES_PUBLISH_ROOT;
  }
  /* --no-migrated keeps the Phase 1 HubSpot migration pages out of the published
     discover bundle until www is cut over to this build. See
     docs/site-migration/site-migration-plan.md section 4. */
  cp.execSync('node build-pages.js --no-migrated --base=' + basePath, {
    cwd: root,
    stdio: 'inherit',
    env: env,
  });
}

if (fs.existsSync(path.join(root, 'dist'))) {
  try {
    fs.rmSync(path.join(root, 'dist'), {
      recursive: true,
      force: true,
      maxRetries: 5,
      retryDelay: 200,
    });
  } catch (e) {
    // Some sandboxed/mounted filesystems refuse to unlink existing files
    // outright (observed on a FUSE-backed mount: unlink() fails with EPERM
    // even with full permissions, while rename() succeeds). Fall back to
    // renaming the stale dist/ out of the way so the build steps below
    // start from a clean, conflict-free directory.
    var trashDir = path.join(root, '.dist-trash-' + Date.now());
    try {
      fs.renameSync(path.join(root, 'dist'), trashDir);
      console.warn('warn: could not remove dist/ (' + e.code + '); renamed stale copy to ' + path.basename(trashDir) + ' instead');
    } catch (e2) {
      console.warn('warn: could not remove or rename dist/ (' + e.code + ' / ' + e2.code + '); continuing with in-place rebuild');
    }
  }
}

runBuild('/aimanufacturing', 'dist/aimanufacturing', 'manufacturing', true);
runBuild('/ai-fluent-engineers', 'dist/ai-fluent-engineers', 'hire-ai-ready', false);

var distRoot = path.join(root, 'dist');

/* Case-sensitive hosts only: on Windows these alias folder names collide with ai-fluent-engineers/. */
if (process.platform !== 'win32') {
  ['AI-Fluent-Engineers', 'Ai-Fluent-Engineers'].forEach(function (aliasSeg) {
    var aliasDir = path.join(distRoot, aliasSeg);
    fs.mkdirSync(aliasDir, { recursive: true });
    fs.writeFileSync(
      path.join(aliasDir, 'index.html'),
      '<!DOCTYPE html>\n<html lang="en">\n<head>\n  <meta charset="utf-8">\n  <meta http-equiv="refresh" content="0;url=/ai-fluent-engineers/">\n  <title>Redirecting</title>\n  <link rel="canonical" href="/ai-fluent-engineers/">\n</head>\n<body>\n  <p><a href="/ai-fluent-engineers/">Continue</a></p>\n</body>\n</html>\n',
      'utf8',
    );
  });
}

var hireLanding = path.join(
  distRoot,
  'ai-fluent-engineers',
  'services',
  'hire-ai-ready-engineers',
  'index.html',
);
var hireIndex = path.join(distRoot, 'ai-fluent-engineers', 'index.html');
if (fs.existsSync(hireLanding)) {
  fs.copyFileSync(hireLanding, hireIndex);
}

// ── Roles bundle ─────────────────────────────────────────────────────────────
// Copy roles pages and every asset they reference into dist so that
// discover.betterengineer.com/roles/ resolves correctly.

function copyDir(src, dest) {
  fs.mkdirSync(dest, { recursive: true });
  fs.readdirSync(src).forEach(function (entry) {
    var s = path.join(src, entry);
    var d = path.join(dest, entry);
    if (fs.statSync(s).isDirectory()) {
      copyDir(s, d);
    } else {
      fs.copyFileSync(s, d);
    }
  });
}

// roles/ HTML pages
copyDir(path.join(root, 'roles'), path.join(distRoot, 'roles'));

function writeNoindexStub(destDir, canonicalPath, label) {
  var canonical = SITE_ORIGIN + canonicalPath;
  fs.mkdirSync(destDir, { recursive: true });
  fs.writeFileSync(
    path.join(destDir, 'index.html'),
    '<!DOCTYPE html>\n' +
      '<html lang="en">\n' +
      '<head>\n' +
      '  <meta charset="utf-8">\n' +
      '  <meta name="robots" content="noindex, follow">\n' +
      '  <link rel="canonical" href="' +
      canonical +
      '">\n' +
      '  <meta http-equiv="refresh" content="0;url=' +
      canonicalPath +
      '">\n' +
      '  <title>Redirecting</title>\n' +
      '</head>\n' +
      '<body>\n' +
      '  <p><a href="' +
      canonicalPath +
      '">Continue to ' +
      label +
      '</a></p>\n' +
      '</body>\n' +
      '</html>\n',
    'utf8',
  );
}

// Stylesheets
['brand.css', 'landing-page.css', 'role-detail.css', 'roles.css', 'cookie-consent.css'].forEach(function (f) {
  fs.mkdirSync(path.join(distRoot, 'styles'), { recursive: true });
  fs.copyFileSync(path.join(root, 'styles', f), path.join(distRoot, 'styles', f));
});

fs.mkdirSync(path.join(distRoot, 'scripts'), { recursive: true });
fs.copyFileSync(
  path.join(root, 'scripts', 'cookie-consent.js'),
  path.join(distRoot, 'scripts', 'cookie-consent.js'),
);

// Icons used by chrome plus tech-page ecosystem images.
copyDir(path.join(root, 'icons'), path.join(distRoot, 'icons'));
var faviconSrc = path.join(root, 'icons', 'favicon.png');
if (!fs.existsSync(faviconSrc)) {
  var altFav = path.join(root, 'favicon.png');
  if (fs.existsSync(altFav)) {
    fs.mkdirSync(path.join(distRoot, 'icons'), { recursive: true });
    fs.copyFileSync(altFav, path.join(distRoot, 'icons', 'favicon.png'));
  }
}

// images/roles/, images/engineers/, and images/ai-tools/
copyDir(path.join(root, 'images', 'roles'), path.join(distRoot, 'images', 'roles'));
copyDir(path.join(root, 'images', 'engineers'), path.join(distRoot, 'images', 'engineers'));
copyDir(path.join(root, 'images', 'ai-tools'), path.join(distRoot, 'images', 'ai-tools'));

// Shared JS
['air-page.js', 'intake-form-shared.js'].forEach(function (f) {
  var src = path.join(root, f);
  if (fs.existsSync(src)) {
    fs.copyFileSync(src, path.join(distRoot, f));
  }
});

// ── Technologies bundle ───────────────────────────────────────────────────────
// Copy technology pages so discover.betterengineer.com/technologies/ resolves.
copyDir(path.join(root, 'technologies'), path.join(distRoot, 'technologies'));

// ── Sitemap + robots.txt ─────────────────────────────────────────────────────
var SITE_ORIGIN = 'https://discover.betterengineer.com';
var SITEMAP_SKIP = new Set(['roles-template', 'tech-template']);

/* Authoring templates must not compete with real pages. Replace the copied
   files with noindex stubs that canonicalise to the hubs. */
writeNoindexStub(path.join(distRoot, 'roles', 'roles-template'), '/roles/', 'roles');
writeNoindexStub(path.join(distRoot, 'technologies', 'tech-template'), '/technologies/', 'technologies');

function collectIndexPaths(baseDir, urlPrefix, out) {
  if (!fs.existsSync(baseDir)) return;
  fs.readdirSync(baseDir).forEach(function (entry) {
    var entryPath = path.join(baseDir, entry);
    if (!fs.statSync(entryPath).isDirectory()) return;
    if (SITEMAP_SKIP.has(entry)) return;
    var indexPath = path.join(entryPath, 'index.html');
    if (fs.existsSync(indexPath)) {
      out.push(SITE_ORIGIN + urlPrefix + entry + '/');
    }
  });
}

function writeDiscoverSeoFiles() {
  var urls = [
    SITE_ORIGIN + '/ai-fluent-engineers/',
    SITE_ORIGIN + '/aimanufacturing/',
    SITE_ORIGIN + '/roles/',
    SITE_ORIGIN + '/technologies/',
  ];
  collectIndexPaths(path.join(distRoot, 'roles'), '/roles/', urls);
  collectIndexPaths(path.join(distRoot, 'technologies'), '/technologies/', urls);

  var lastmod = new Date().toISOString().slice(0, 10);
  var sitemap =
    '<?xml version="1.0" encoding="UTF-8"?>\n' +
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' +
    urls
      .sort()
      .map(function (loc) {
        return (
          '  <url>\n' +
          '    <loc>' +
          loc +
          '</loc>\n' +
          '    <lastmod>' +
          lastmod +
          '</lastmod>\n' +
          '  </url>'
        );
      })
      .join('\n') +
    '\n</urlset>\n';

  fs.writeFileSync(path.join(distRoot, 'sitemap.xml'), sitemap, 'utf8');
  fs.writeFileSync(
    path.join(distRoot, 'robots.txt'),
    'User-agent: *\nAllow: /\nDisallow: /roles/roles-template/\nDisallow: /technologies/tech-template/\n\nSitemap: ' +
      SITE_ORIGIN +
      '/sitemap.xml\n',
    'utf8',
  );
}


function writeLlmsTxt() {
  var lines = [
    '# BetterEngineer',
    '',
    '> BetterEngineer connects U.S. companies with pre-vetted senior software engineers from Latin America who embed as trusted long-term collaborators.',
    '',
    '## Key pages',
    '',
    '- [Home](https://www.betterengineer.com/): BetterEngineer staff augmentation and hiring platform overview.',
    '- [AI Fluent Engineers](' + SITE_ORIGIN + '/ai-fluent-engineers/): AI-fluency program overview.',
    '- [AI Manufacturing](' + SITE_ORIGIN + '/aimanufacturing/): AI systems readiness for manufacturing teams.',
    '- [Roles](' + SITE_ORIGIN + '/roles/): Hire by engineering role (front-end, back-end, full-stack, mobile, DevOps, data, AI, QA, blockchain).',
    '- [Technologies](' + SITE_ORIGIN + '/technologies/): Hire by technology and framework.'
  ];

  function collectPages(baseDir, urlPrefix, label) {
    if (!fs.existsSync(baseDir)) return;
    fs.readdirSync(baseDir).forEach(function (entry) {
      var entryPath = path.join(baseDir, entry);
      if (!fs.statSync(entryPath).isDirectory()) return;
      if (SITEMAP_SKIP.has(entry)) return;
      var indexPath = path.join(entryPath, 'index.html');
      if (!fs.existsSync(indexPath)) return;
      var html = fs.readFileSync(indexPath, 'utf8');
      var titleMatch = html.match(/<title>([^<]*)<\/title>/);
      var title = titleMatch ? titleMatch[1].replace(' | BetterEngineer', '') : entry;
      lines.push('- [' + title + '](' + SITE_ORIGIN + urlPrefix + entry + '/): ' + label + '.');
    });
  }

  lines.push('');
  lines.push('## Roles');
  lines.push('');
  collectPages(path.join(distRoot, 'roles'), '/roles/', 'Hire senior nearshore engineers for this role');
  lines.push('');
  lines.push('## Technologies');
  lines.push('');
  collectPages(path.join(distRoot, 'technologies'), '/technologies/', 'Hire senior nearshore engineers for this technology');

  fs.writeFileSync(path.join(distRoot, 'llms.txt'), lines.join('\n') + '\n', 'utf8');
}

function writeDiscover404Page() {
  fs.writeFileSync(
    path.join(distRoot, '404.html'),
    '<!DOCTYPE html>\n' +
      '<html lang="en">\n' +
      '<head>\n' +
      '  <meta charset="utf-8">\n' +
      '  <meta name="viewport" content="width=device-width, initial-scale=1">\n' +
      '  <title>Page not found | BetterEngineer</title>\n' +
      '  <meta name="robots" content="noindex">\n' +
      '  <link rel="icon" href="/icons/favicon.png" type="image/png">\n' +
      '  <style>\n' +
      '    body { margin: 0; min-height: 100vh; display: grid; place-items: center; font-family: "Plus Jakarta Sans", system-ui, sans-serif; background: #fafafe; color: #1c1c1c; }\n' +
      '    main { text-align: center; padding: 2rem; max-width: 28rem; }\n' +
      '    h1 { font-size: 2rem; margin: 0 0 0.5rem; }\n' +
      '    p { color: #5c5c66; }\n' +
      '    a { color: #545bb3; font-weight: 700; }\n' +
      '    ul { list-style: none; padding: 0; margin: 1.25rem 0 0; }\n' +
      '    li { margin: 0.5rem 0; }\n' +
      '  </style>\n' +
      '</head>\n' +
      '<body>\n' +
      '  <main>\n' +
      '    <h1>Page not found</h1>\n' +
      '    <p>That page is not on this site.</p>\n' +
      '    <ul>\n' +
      '      <li><a href="/technologies/">Browse technologies</a></li>\n' +
      '      <li><a href="/roles/">Browse roles</a></li>\n' +
      '      <li><a href="https://www.betterengineer.com/">Main BetterEngineer site</a></li>\n' +
      '    </ul>\n' +
      '  </main>\n' +
      '</body>\n' +
      '</html>\n',
    'utf8',
  );
}

// ── Discover root redirect ────────────────────────────────────────────────────
// manufacturing build writes a temporary dist/index.html redirect to
// /aimanufacturing/. Replace that so https://discover.betterengineer.com/
// sends visitors to the main BetterEngineer site. Visible links below help
// embedded browsers (for example Cursor Simple Browser) when external redirects
// are blocked; deep paths such as /technologies/ are unchanged.
(function redirectDiscoverRootToWww() {
  var wwwHome = 'https://www.betterengineer.com/';
  fs.writeFileSync(
    path.join(distRoot, 'index.html'),
    '<!DOCTYPE html>\n' +
      '<html lang="en">\n' +
      '<head>\n' +
      '  <meta charset="utf-8">\n' +
      '  <meta name="viewport" content="width=device-width, initial-scale=1">\n' +
      '  <meta http-equiv="refresh" content="0;url=' +
      wwwHome +
      '">\n' +
      '  <link rel="canonical" href="' +
      wwwHome +
      '">\n' +
      '  <title>Redirecting to BetterEngineer</title>\n' +
      '  <link rel="icon" href="/icons/favicon.png" type="image/png">\n' +
      '  <script>location.replace(' +
      JSON.stringify(wwwHome) +
      ');</script>\n' +
      '  <style>\n' +
      '    body { margin: 0; min-height: 100vh; display: grid; place-items: center; font-family: "Plus Jakarta Sans", system-ui, sans-serif; background: #fafafe; color: #1c1c1c; }\n' +
      '    main { text-align: center; padding: 2rem; max-width: 28rem; }\n' +
      '    p { color: #5c5c66; }\n' +
      '    a { color: #545bb3; font-weight: 700; }\n' +
      '    ul { list-style: none; padding: 0; margin: 1rem 0 0; }\n' +
      '    li { margin: 0.35rem 0; }\n' +
      '  </style>\n' +
      '</head>\n' +
      '<body>\n' +
      '  <main>\n' +
      '    <p>Redirecting to BetterEngineer…</p>\n' +
      '    <p><a href="' +
      wwwHome +
      '">Continue to BetterEngineer</a></p>\n' +
      '    <p>Or explore on Discover:</p>\n' +
      '    <ul>\n' +
      '      <li><a href="/technologies/">Technologies</a></li>\n' +
      '      <li><a href="/roles/">Roles</a></li>\n' +
      '      <li><a href="/ai-fluent-engineers/">AI Fluent Engineers</a></li>\n' +
      '      <li><a href="/aimanufacturing/">AI Manufacturing</a></li>\n' +
      '    </ul>\n' +
      '  </main>\n' +
      '</body>\n' +
      '</html>\n',
    'utf8',
  );
})();

writeDiscover404Page();

writeDiscoverSeoFiles();
writeLlmsTxt();

var cookieChrome = require('./tools/cookie-consent-chrome.js');
var cookiePatches = cookieChrome.patchDiscoverHtmlTree(distRoot);
console.log('Cookie consent chrome applied to ' + cookiePatches + ' HTML file(s) under ./dist/');

console.log('Discover bundle ready in ./dist/');
console.log('  https://discover.betterengineer.com/ -> https://www.betterengineer.com/');
console.log('  https://discover.betterengineer.com/aimanufacturing/');
console.log('  https://discover.betterengineer.com/ai-fluent-engineers/');
console.log('  https://discover.betterengineer.com/roles/');
console.log('  https://discover.betterengineer.com/technologies/');
