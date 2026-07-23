'use strict';

/**
 * Inserts <link rel="icon" href="/icons/favicon.png"> into roles/ and
 * technologies/ HTML pages that are missing it. Safe to re-run.
 */

const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const FAV =
  '<link rel="icon" href="/icons/favicon.png" type="image/png">';

function walk(dir, out) {
  if (!fs.existsSync(dir)) return out;
  for (const name of fs.readdirSync(dir)) {
    const p = path.join(dir, name);
    const st = fs.statSync(p);
    if (st.isDirectory()) walk(p, out);
    else if (name.endsWith('.html')) out.push(p);
  }
  return out;
}

const files = walk(path.join(ROOT, 'roles'), []).concat(
  walk(path.join(ROOT, 'technologies'), []),
);

let already = 0;
let updated = 0;
let skipped = 0;

for (const file of files) {
  let html = fs.readFileSync(file, 'utf8');
  if (html.includes('/icons/favicon.png')) {
    already += 1;
    continue;
  }
  if (html.includes('<!-- Open Graph -->')) {
    html = html.replace('<!-- Open Graph -->', FAV + '<!-- Open Graph -->');
    fs.writeFileSync(file, html);
    updated += 1;
    continue;
  }
  if (/<link rel="canonical"[^>]*>/.test(html)) {
    html = html.replace(/(<link rel="canonical"[^>]*>)/, '$1' + FAV);
    fs.writeFileSync(file, html);
    updated += 1;
    continue;
  }
  skipped += 1;
  console.warn('SKIP (no insert point):', path.relative(ROOT, file));
}

console.log(
  'favicon inject:',
  JSON.stringify({ files: files.length, already, updated, skipped }),
);
