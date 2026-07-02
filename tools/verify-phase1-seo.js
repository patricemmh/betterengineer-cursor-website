'use strict';

const fs = require('fs');
const path = require('path');
const https = require('https');

const DISCOVER = 'https://discover.betterengineer.com';
const errors = [];

function walkHtml(dir, out) {
  if (!fs.existsSync(dir)) return;
  for (const name of fs.readdirSync(dir)) {
    const p = path.join(dir, name);
    if (fs.statSync(p).isDirectory()) walkHtml(p, out);
    else if (name === 'index.html') out.push(p);
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
          errors.push(filePath + ': FAQ name ' + (i + 1) + ' missing ?');
        }
        if (/\s-\s*$/.test(item.name)) {
          errors.push(filePath + ': FAQ name ' + (i + 1) + ' still has trailing dash');
        }
      });
    } catch (e) {
      errors.push(filePath + ': invalid JSON-LD');
    }
  }
}

function checkCanonical(filePath, html) {
  const can = html.match(/rel="canonical" href="([^"]+)"/);
  if (!can) return;
  if (!can[1].startsWith(DISCOVER + '/')) {
    errors.push(filePath + ': canonical not on discover host: ' + can[1]);
  }
}

const targets = [];
walkHtml('roles', targets);
walkHtml('technologies', targets);

targets.forEach(function (filePath) {
  const html = fs.readFileSync(filePath, 'utf8');
  checkCanonical(filePath, html);
  checkJsonLd(filePath, html);
});

if (errors.length) {
  console.error('SEO verification failed:');
  errors.forEach(function (e) {
    console.error(' ', e);
  });
  process.exit(1);
}

console.log('Verified', targets.length, 'pages: canonical host + FAQ JSON-LD OK');
