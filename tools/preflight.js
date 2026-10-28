'use strict';

/**
 * Pre-deploy gate.
 *
 * Runs every automated check, then reads docs/site-migration/pre-deploy-checklist.md
 * and reports every unchecked item. Nothing ships until this passes.
 *
 *   node tools/preflight.js                 # default: pre-cutover stage
 *   node tools/preflight.js --stage=cutover # the full www cutover gate
 *   node tools/preflight.js --list          # show outstanding items only, no checks
 *
 * Stages:
 *   pre-cutover  Publishing the discover bundle. Migrated pages must stay noindex and
 *                out of the sitemap. Only the "always" gates apply.
 *   cutover      Repointing www at this build. Everything applies, including full URL
 *                coverage, noindex removal, and content sign-off.
 */

var fs = require('fs');
var path = require('path');
var cp = require('child_process');

var root = path.join(__dirname, '..');
var CHECKLIST = path.join(root, 'docs', 'site-migration', 'pre-deploy-checklist.md');

var stage = 'pre-cutover';
var listOnly = false;
process.argv.forEach(function (a) {
  if (a.indexOf('--stage=') === 0) stage = a.slice('--stage='.length);
  if (a === '--list') listOnly = true;
});
if (['pre-cutover', 'cutover'].indexOf(stage) === -1) {
  console.error('Unknown stage "' + stage + '". Use pre-cutover or cutover.');
  process.exit(2);
}

var failures = [];
var warnings = [];

function fail(area, msg) {
  failures.push(area + ': ' + msg);
}
function warn(area, msg) {
  warnings.push(area + ': ' + msg);
}

function heading(text) {
  console.log('\n' + text + '\n' + '-'.repeat(text.length));
}

/* ── 1. Automated verifiers ─────────────────────────────────────────────────── */

function runVerifiers() {
  heading('1. Automated checks');
  var checks = [
    ['site', 'node tools/verify-site.js'],
    ['technology data', 'node tools/verify-tech-data.js'],
    ['migrated pages', 'node tools/verify-migrated-pages.js'],
    ['links and assets', 'node tools/verify-links.js --assets'],
  ];
  checks.forEach(function (c) {
    try {
      cp.execSync(c[1], { cwd: root, stdio: 'pipe' });
      console.log('  pass  ' + c[0]);
    } catch (e) {
      console.log('  FAIL  ' + c[0] + '   (' + c[1] + ')');
      fail('automated', c[0] + ' failed. Run `' + c[1] + '` for detail.');
    }
  });
}

/* ── 2. Unresolved migration markers ────────────────────────────────────────── */

function scanBlockedMarkers() {
  heading('2. Unresolved BLOCKED markers in fragments');
  var manifest = require(path.join(root, 'data', 'pages.js'));
  var found = 0;
  manifest.migratedPages.forEach(function (page) {
    var p = path.join(root, page.fragment);
    if (!fs.existsSync(p)) return;
    var html = fs.readFileSync(p, 'utf8');
    var re = /<!--\s*(MIGRATION[^>]*?BLOCKED[\s\S]*?)-->/g;
    var m;
    while ((m = re.exec(html)) !== null) {
      found++;
      var first = m[1].split('\n')[0].trim().slice(0, 110);
      console.log('  ' + page.slug + ': ' + first);
    }
  });
  if (!found) {
    console.log('  none');
  } else if (stage === 'cutover') {
    fail('content', found + ' BLOCKED marker(s) still in the fragments. Resolve or waive each.');
  } else {
    warn('content', found + ' BLOCKED marker(s) still in the fragments.');
  }
}

/* ── 3. HubSpot asset leakage ───────────────────────────────────────────────── */

function scanHubSpotUrls() {
  heading('3. HubSpot asset URLs in built output');
  var manifest = require(path.join(root, 'data', 'pages.js'));
  var hits = 0;
  manifest.pages.forEach(function (page) {
    page.outputs.forEach(function (out) {
      var p = path.join(root, out);
      if (!fs.existsSync(p)) return;
      var html = fs.readFileSync(p, 'utf8').replace(
        /<a class="post-card__cover"[^>]*>[\s\S]*?<\/a>/g,
        '',
      );
      var m = html.match(/betterengineer\.com\/(hubfs|hs-fs)\/[^"' )]+/g);
      if (m) {
        hits += m.length;
        console.log('  ' + out + ': ' + m.length + ' reference(s)');
      }
    });
  });
  if (!hits) console.log('  none');
  else fail('assets', hits + ' HubSpot hubfs/hs-fs URL(s) survive in built output.');
}

/* ── 4. Indexing state ──────────────────────────────────────────────────────── */

function checkIndexingState() {
  heading('4. Indexing state for migrated pages (stage: ' + stage + ')');
  var manifest = require(path.join(root, 'data', 'pages.js'));
  manifest.migratedPages.forEach(function (page) {
    var p = path.join(root, page.outputs[0]);
    if (!fs.existsSync(p)) return;
    var html = fs.readFileSync(p, 'utf8');
    var hasNoindex = /<meta name="robots" content="[^"]*noindex/i.test(html);
    if (stage === 'cutover') {
      if (hasNoindex) {
        console.log('  FAIL  ' + page.slug + ' still carries noindex');
        fail('seo', page.slug + ' still carries noindex. Clear PRE_CUTOVER_ROBOTS in data/pages.js.');
      } else {
        console.log('  pass  ' + page.slug + ' is indexable');
      }
    } else {
      if (hasNoindex) {
        console.log('  pass  ' + page.slug + ' is noindex');
      } else {
        console.log('  FAIL  ' + page.slug + ' is indexable before cutover');
        fail('seo', page.slug + ' is missing noindex while www is still HubSpot. This creates a duplicate.');
      }
    }
  });
}

/* ── 5. Discover bundle must exclude migrated pages ─────────────────────────── */

function checkDiscoverExclusion() {
  heading('5. Discover bundle excludes migrated pages');
  var p = path.join(root, 'build-discover-dist.js');
  if (!fs.existsSync(p)) {
    warn('build', 'build-discover-dist.js not found.');
    console.log('  skipped');
    return;
  }
  var src = fs.readFileSync(p, 'utf8');
  if (src.indexOf('--no-migrated') === -1) {
    console.log('  FAIL  build-discover-dist.js does not pass --no-migrated');
    fail('build', 'build-discover-dist.js must pass --no-migrated until cutover.');
  } else {
    console.log('  pass  --no-migrated is passed to build-pages.js');
  }
  var sitemap = path.join(root, 'dist', 'sitemap.xml');
  if (fs.existsSync(sitemap)) {
    var xml = fs.readFileSync(sitemap, 'utf8');
    var manifest = require(path.join(root, 'data', 'pages.js'));
    var leaked = manifest.migratedSlugs.filter(function (s) {
      return xml.indexOf('/' + s + '/') !== -1;
    });
    if (leaked.length) {
      console.log('  FAIL  sitemap lists: ' + leaked.join(', '));
      fail('seo', 'dist/sitemap.xml lists migrated pages before cutover: ' + leaked.join(', '));
    } else {
      console.log('  pass  dist/sitemap.xml does not list migrated pages');
    }
  }
}

/* ── 6. URL coverage (cutover only) ─────────────────────────────────────────── */

function checkUrlCoverage() {
  heading('6. Live URL coverage');
  var p = path.join(root, 'data', 'live-url-inventory.js');
  if (!fs.existsSync(p)) {
    console.log('  FAIL  data/live-url-inventory.js is missing');
    fail('coverage', 'data/live-url-inventory.js is missing.');
    return;
  }
  var inv = require(p);
  var byStatus = { built: 0, redirect: 0, pending: 0 };
  var missingFiles = [];
  var pending = [];

  inv.urls.forEach(function (u) {
    byStatus[u.status] = (byStatus[u.status] || 0) + 1;
    if (u.status === 'built') {
      if (!u.localPath || !fs.existsSync(path.join(root, u.localPath))) {
        missingFiles.push(u.url + ' -> ' + (u.localPath || '(no localPath)'));
      }
    } else if (u.status === 'pending') {
      pending.push(u.url);
    } else if (u.status === 'redirect' && !u.redirectTo) {
      missingFiles.push(u.url + ' -> redirect with no redirectTo');
    }
  });

  console.log(
    '  ' +
      inv.urls.length +
      ' URL(s): ' +
      byStatus.built +
      ' built, ' +
      byStatus.redirect +
      ' redirect, ' +
      byStatus.pending +
      ' pending',
  );

  missingFiles.forEach(function (m) {
    console.log('  FAIL  ' + m);
    fail('coverage', 'inventory entry does not resolve: ' + m);
  });

  if (stage !== 'cutover') {
    if (pending.length) console.log('  note  ' + pending.length + ' URL(s) still pending, fine before cutover');
    return;
  }

  if (!inv.verified) {
    console.log('  FAIL  inventory is still the Phase 1 seed (verified: false)');
    fail(
      'coverage',
      'live-url-inventory.js has verified: false. Reconcile it against HubSpot, ' +
        'Search Console, and the live sitemap, then set verified: true.',
    );
  }
  if (pending.length) {
    console.log('  FAIL  ' + pending.length + ' URL(s) would 404 at cutover:');
    pending.forEach(function (u) {
      console.log('          ' + u);
    });
    fail('coverage', pending.length + ' live URL(s) have no page and no redirect. They would 404.');
  }
}

/* ── 7. Checklist state ─────────────────────────────────────────────────────── */

function checkChecklist() {
  heading('7. Checklist items outstanding');
  if (!fs.existsSync(CHECKLIST)) {
    console.log('  FAIL  pre-deploy-checklist.md is missing');
    fail('process', 'docs/site-migration/pre-deploy-checklist.md is missing.');
    return;
  }
  var md = fs.readFileSync(CHECKLIST, 'utf8');
  var lines = md.split('\n');
  var currentSection = null;
  var currentGate = 'advisory';
  var sections = [];

  lines.forEach(function (line) {
    var gm = line.match(/<!--\s*preflight:\s*(hard|cutover|advisory)\s*-->/);
    if (gm) {
      currentGate = gm[1];
      return;
    }
    var hm = line.match(/^##+\s+(.*)$/);
    if (hm) {
      currentSection = { title: hm[1].trim(), gate: currentGate, open: [], done: 0 };
      sections.push(currentSection);
      return;
    }
    var cm = line.match(/^\s*-\s*\[( |x|X)\]\s*(.*)$/);
    if (cm && currentSection) {
      if (cm[1] === ' ') currentSection.open.push(cm[2].trim());
      else currentSection.done++;
    }
  });

  var totalOpen = 0;
  sections.forEach(function (s) {
    if (!s.open.length && !s.done) return;
    var applies = s.gate === 'hard' || (s.gate === 'cutover' && stage === 'cutover');
    var tag = s.gate === 'hard' ? '[HARD]' : s.gate === 'cutover' ? '[CUTOVER]' : '[advisory]';
    console.log(
      '  ' + tag + ' ' + s.title + ': ' + s.done + ' done, ' + s.open.length + ' open',
    );
    s.open.forEach(function (item) {
      console.log('        [ ] ' + item.slice(0, 120));
    });
    if (applies && s.open.length) {
      totalOpen += s.open.length;
      fail('checklist', s.open.length + ' unchecked item(s) in "' + s.title + '"');
    } else if (s.open.length) {
      warn('checklist', s.open.length + ' unchecked item(s) in "' + s.title + '"');
    }
  });
  if (!sections.length) console.log('  no checklist items found');
  return totalOpen;
}

/* ── Run ────────────────────────────────────────────────────────────────────── */

console.log('BetterEngineer pre-deploy gate  (stage: ' + stage + ')');

if (!listOnly) {
  runVerifiers();
  scanBlockedMarkers();
  scanHubSpotUrls();
  checkIndexingState();
  checkDiscoverExclusion();
  checkUrlCoverage();
}
checkChecklist();

heading('Result');
if (warnings.length) {
  console.log('  ' + warnings.length + ' warning(s):');
  warnings.forEach(function (w) {
    console.log('    - ' + w);
  });
}
if (failures.length) {
  console.log('  ' + failures.length + ' blocker(s):');
  failures.forEach(function (f) {
    console.log('    - ' + f);
  });
  console.log('\n  DO NOT DEPLOY. Resolve the blockers above, or record an explicit');
  console.log('  waiver in docs/site-migration/pre-deploy-checklist.md and re-run.');
  process.exitCode = 1;
} else {
  console.log('  All gates for stage "' + stage + '" are clear.');
  if (stage === 'pre-cutover') {
    console.log('  For the full www cutover, run: node tools/preflight.js --stage=cutover');
  }
}
