'use strict';

/* Builds the discover.betterengineer.com bundle: home at /, plus /aimanufacturing/, /ai-fluent-engineers/, /roles/, /technologies/. See GITHUB_PAGES_DISCOVER_HOSTING.md. */

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
    SITE_ORIGIN + '/',
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
    'User-agent: *\nAllow: /\n\nSitemap: ' + SITE_ORIGIN + '/sitemap.xml\n',
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
    '- [Home](' + SITE_ORIGIN + '/): BetterEngineer staff augmentation and hiring platform overview.',
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

// ── Discover root home page ───────────────────────────────────────────────────
// manufacturing build writes a temporary dist/index.html redirect to
// /aimanufacturing/. Replace that with the staff-augmentation home page so
// https://discover.betterengineer.com/ is the main Discover home.
(function publishHomeAtDiscoverRoot() {
  var homeTmpRel = 'dist/_home_tmp';
  var homeTmpAbs = path.join(root, homeTmpRel);
  var env = Object.assign({}, process.env, {
    OUTPUT_ROOT: homeTmpRel,
    GITHUB_PAGES_CNAME: 'discover.betterengineer.com',
  });
  delete env.PAGES_PUBLISH_ROOT;
  delete env.LP_ROOT_PAGE;
  cp.execSync('node build-pages.js --base=/', {
    cwd: root,
    stdio: 'inherit',
    env: env,
  });
  fs.copyFileSync(path.join(homeTmpAbs, 'index.html'), path.join(distRoot, 'index.html'));
  ['home.js', 'intake-form-shared.js', 'landing-page.js'].forEach(function (f) {
    var src = path.join(homeTmpAbs, f);
    if (fs.existsSync(src)) {
      fs.copyFileSync(src, path.join(distRoot, f));
    }
  });
  if (fs.existsSync(path.join(homeTmpAbs, 'images'))) {
    copyDir(path.join(homeTmpAbs, 'images'), path.join(distRoot, 'images'));
  }
  if (fs.existsSync(path.join(homeTmpAbs, 'icons'))) {
    copyDir(path.join(homeTmpAbs, 'icons'), path.join(distRoot, 'icons'));
  }
  try {
    fs.rmSync(homeTmpAbs, { recursive: true, force: true, maxRetries: 5, retryDelay: 200 });
  } catch (e) {
    console.warn('warn: could not remove ' + homeTmpRel + ' (' + e.code + ')');
  }
})();

writeDiscoverSeoFiles();
writeLlmsTxt();

console.log('Discover bundle ready in ./dist/');
console.log('  https://discover.betterengineer.com/');
console.log('  https://discover.betterengineer.com/aimanufacturing/');
console.log('  https://discover.betterengineer.com/ai-fluent-engineers/');
console.log('  https://discover.betterengineer.com/roles/');
console.log('  https://discover.betterengineer.com/technologies/');
