'use strict';

/**
 * Download the migrated pages' images from the legacy HubSpot site into this repo.
 *
 * Run this once, locally, on a machine with network access:
 *
 *   node tools/fetch-migration-assets.js            # download what is missing
 *   node tools/fetch-migration-assets.js --force    # re-download everything
 *   node tools/fetch-migration-assets.js --page=about
 *   node tools/fetch-migration-assets.js --dry-run  # list what would be fetched
 *
 * The source list is data/migration-assets.js, generated from the asset tables in
 * docs/site-migration/pages/*.md and reconciled against what the main-*.html
 * fragments actually reference. Tracking pixels, HubSpot chrome, and spacers are
 * already filtered out.
 *
 * After this completes, run:
 *   npm run build && node tools/verify-migrated-pages.js
 */

var fs = require('fs');
var path = require('path');
var https = require('https');

var root = path.join(__dirname, '..');
var assets = require(path.join(root, 'data', 'migration-assets.js')).assets;

var force = process.argv.indexOf('--force') !== -1;
var dryRun = process.argv.indexOf('--dry-run') !== -1;
var onlyPage = null;
process.argv.forEach(function (a) {
  if (a.indexOf('--page=') === 0) onlyPage = a.slice('--page='.length);
});

var queue = assets.filter(function (a) {
  return !onlyPage || a.page === onlyPage;
});

var downloaded = 0;
var skipped = 0;
var failed = [];

function get(url, redirectsLeft) {
  if (redirectsLeft === undefined) redirectsLeft = 5;
  return new Promise(function (resolve, reject) {
    https
      .get(url, { headers: { 'User-Agent': 'betterengineer-migration/1.0' } }, function (res) {
        if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
          res.resume();
          if (!redirectsLeft) return reject(new Error('too many redirects'));
          var next = new URL(res.headers.location, url).toString();
          return resolve(get(next, redirectsLeft - 1));
        }
        if (res.statusCode !== 200) {
          res.resume();
          return reject(new Error('HTTP ' + res.statusCode));
        }
        var chunks = [];
        res.on('data', function (c) {
          chunks.push(c);
        });
        res.on('end', function () {
          resolve(Buffer.concat(chunks));
        });
      })
      .on('error', reject);
  });
}

function run() {
  var i = 0;

  function next() {
    if (i >= queue.length) return finish();
    var asset = queue[i++];
    var destAbs = path.join(root, asset.dest.replace(/^\//, ''));

    if (!force && fs.existsSync(destAbs)) {
      skipped++;
      return next();
    }

    if (dryRun) {
      console.log('would fetch  ' + asset.dest);
      downloaded++;
      return next();
    }

    get(asset.src)
      .then(function (buf) {
        fs.mkdirSync(path.dirname(destAbs), { recursive: true });
        fs.writeFileSync(destAbs, buf);
        downloaded++;
        console.log(
          'ok  ' + asset.dest + '  (' + Math.round(buf.length / 1024) + ' KB)',
        );
      })
      .catch(function (err) {
        failed.push({ dest: asset.dest, src: asset.src, error: err.message });
        console.error('FAIL ' + asset.dest + '  ' + err.message);
      })
      .then(next);
  }

  next();
}

function finish() {
  console.log(
    '\n' +
      downloaded +
      ' downloaded, ' +
      skipped +
      ' already present, ' +
      failed.length +
      ' failed',
  );
  if (failed.length) {
    console.log('\nFailed assets need a manual export from the HubSpot file manager:');
    failed.forEach(function (f) {
      console.log('  ' + f.dest + '\n    from ' + f.src + '\n    ' + f.error);
    });
    process.exitCode = 1;
    return;
  }
  if (!dryRun) {
    console.log('\nNext: npm run build && node tools/verify-migrated-pages.js');
  }
}

console.log(
  (dryRun ? 'Dry run: ' : 'Fetching ') +
    queue.length +
    ' asset(s)' +
    (onlyPage ? ' for ' + onlyPage : '') +
    '\n',
);
run();
