'use strict';

const fs = require('fs');
const path = require('path');

const DISCOVER = 'https://discover.betterengineer.com';
const OLD_HOST = 'https://www.betterengineer.com';

function walkHtml(dir, out) {
  if (!fs.existsSync(dir)) return;
  for (const name of fs.readdirSync(dir)) {
    const p = path.join(dir, name);
    if (fs.statSync(p).isDirectory()) walkHtml(p, out);
    else if (name === 'index.html') out.push(p);
  }
}

function fixJsonLdFaqNames(html) {
  const re = /<script type="application\/ld\+json">([\s\S]*?)<\/script>/g;
  return html.replace(re, function (match, jsonText) {
    try {
      const data = JSON.parse(jsonText);
      if (data['@type'] !== 'FAQPage' || !Array.isArray(data.mainEntity)) return match;
      data.mainEntity.forEach(function (item) {
        if (!item || item['@type'] !== 'Question' || typeof item.name !== 'string') return;
        item.name = item.name.replace(/\s+-\s*$/, '?').replace(/\?$/, '?');
        if (!item.name.endsWith('?')) item.name = item.name.replace(/[.\s]+$/, '') + '?';
      });
      return '<script type="application/ld+json">' + JSON.stringify(data) + '</script>';
    } catch (e) {
      return match;
    }
  });
}

function fixDiscoverCanonicals(html, filePath) {
  let out = html;
  const rel = filePath.replace(/\\/g, '/');

  if (rel.startsWith('roles/') || rel.startsWith('technologies/')) {
    out = out.split(OLD_HOST + '/roles/').join(DISCOVER + '/roles/');
    out = out.split(OLD_HOST + '/technologies/').join(DISCOVER + '/technologies/');
  }

  return out;
}

const targets = [];
walkHtml('roles', targets);
walkHtml('technologies', targets);

const fixed = [];
targets.forEach(function (filePath) {
  let html = fs.readFileSync(filePath, 'utf8');
  const orig = html;
  html = fixDiscoverCanonicals(html, filePath);
  html = fixJsonLdFaqNames(html);
  if (html !== orig) {
    fs.writeFileSync(filePath, html, 'utf8');
    fixed.push(filePath);
  }
});

console.log('Updated', fixed.length, 'files:');
fixed.forEach(function (f) {
  console.log(' ', f);
});
