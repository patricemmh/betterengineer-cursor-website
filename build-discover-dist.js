'use strict';

/* Builds the discover.betterengineer.com bundle: /aimanufacturing/ + /ai-fluent-engineers/. See GITHUB_PAGES_DISCOVER_HOSTING.md. */

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
  cp.execSync('node build-pages.js --base=' + basePath, {
    cwd: root,
    stdio: 'inherit',
    env: env,
  });
}

if (fs.existsSync(path.join(root, 'dist'))) {
  fs.rmSync(path.join(root, 'dist'), {
    recursive: true,
    force: true,
    maxRetries: 5,
    retryDelay: 200,
  });
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

// Stylesheets
['brand.css', 'landing-page.css', 'role-detail.css', 'roles.css'].forEach(function (f) {
  fs.mkdirSync(path.join(distRoot, 'styles'), { recursive: true });
  fs.copyFileSync(path.join(root, 'styles', f), path.join(distRoot, 'styles', f));
});

// Icons
['betterengineer-logo.svg', 'hamburger-white.svg', 'favicon.png'].forEach(function (f) {
  var src = path.join(root, 'icons', f);
  if (fs.existsSync(src)) {
    fs.mkdirSync(path.join(distRoot, 'icons'), { recursive: true });
    fs.copyFileSync(src, path.join(distRoot, 'icons', f));
  }
});

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
    'User-agent: *\nAllow: /\n\nSitemap: ' + SITE_ORIGIN + '/sitemap.xml\n',
    'utf8',
  );
}

writeDiscoverSeoFiles();

console.log('Discover bundle ready in ./dist/');
console.log('  https://discover.betterengineer.com/aimanufacturing/');
console.log('  https://discover.betterengineer.com/ai-fluent-engineers/');
console.log('  https://discover.betterengineer.com/roles/');
console.log('  https://discover.betterengineer.com/technologies/');
