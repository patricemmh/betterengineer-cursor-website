'use strict';
var fs = require('fs');
var https = require('https');
var path = require('path');

var outDir = path.join(__dirname, '..', 'tmp-live-extract');
fs.mkdirSync(outDir, { recursive: true });

var urls = [
  'https://www.betterengineer.com/careers',
  'https://www.betterengineer.com/careers/front-end-engineer',
  'https://www.betterengineer.com/careers/python-engineer',
  'https://www.betterengineer.com/careers/project-manager',
  'https://www.betterengineer.com/fintech',
  'https://www.betterengineer.com/martech',
  'https://www.betterengineer.com/healthtech',
  'https://www.betterengineer.com/case-studies/livecgi',
  'https://www.betterengineer.com/case-studies/wasteplace',
  'https://www.betterengineer.com/case-studies/securelink',
  'https://www.betterengineer.com/terms-of-service',
  'https://www.betterengineer.com/resource-center/wpautoterms/privacy-policy',
  'https://www.betterengineer.com/multi-step-contact-form',
];

function get(url) {
  return new Promise(function (resolve, reject) {
    https.get(url, { headers: { 'User-Agent': 'BetterEngineerMigration/1.0' } }, function (res) {
      var chunks = [];
      res.on('data', function (c) { chunks.push(c); });
      res.on('end', function () {
        resolve({ status: res.statusCode, html: Buffer.concat(chunks).toString('utf8'), url: url });
      });
    }).on('error', reject);
  });
}

function strip(html) {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<noscript[\s\S]*?<\/noscript>/gi, ' ');
}

function textOf(html) {
  return strip(html)
    .replace(/<\s*br\s*\/?>/gi, '\n')
    .replace(/<\/(p|li|h[1-6]|div|section|article)>/gi, '\n')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#0?39;/g, "'")
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/[ \t]+/g, ' ')
    .replace(/\n[ \t]+/g, '\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

(async function () {
  for (var i = 0; i < urls.length; i++) {
    var r = await get(urls[i]);
    var slug = urls[i].replace('https://www.betterengineer.com/', '').replace(/\//g, '__') || 'home';
    fs.writeFileSync(path.join(outDir, slug + '.html'), r.html);
    var title = (r.html.match(/<title>([^<]*)<\/title>/i) || [])[1] || '';
    var desc = (r.html.match(/name="description" content="([^"]*)"/i) || [])[1] || '';
    var h1s = [];
    r.html.replace(/<h1[^>]*>([\s\S]*?)<\/h1>/gi, function (_, inner) {
      h1s.push(inner.replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim());
      return _;
    });
    var summary = {
      url: urls[i],
      status: r.status,
      title: title.trim(),
      description: desc,
      h1: h1s,
      chars: r.html.length,
    };
    fs.writeFileSync(path.join(outDir, slug + '.meta.json'), JSON.stringify(summary, null, 2));
    fs.writeFileSync(path.join(outDir, slug + '.txt'), textOf(r.html).slice(0, 20000));
    console.log(r.status, title.trim().slice(0, 80), urls[i]);
  }
})();
