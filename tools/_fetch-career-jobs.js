'use strict';
var fs = require('fs');
var https = require('https');
var path = require('path');

var root = path.join(__dirname, '..');
var outFile = path.join(root, 'tmp-live-extract', 'careers-jobs.json');

var SLUGS = [
  'android-engineer', 'aws-engineer', 'azure-engineer', 'blockchain-engineer',
  'cloudops-engineer', 'cordova-c-engineer', 'data-science-engineer', 'devops-engineer',
  'drupal-engineer', 'e-commerce-engineer', 'elixir-engineer', 'embedded-software-engineer',
  'front-end-engineer', 'full-stack-javascript-engineer', 'groovy-on-grails-engineer',
  'ios-engineer', 'java-engineer', 'kubernetes-software-engineer', 'magneto-engineer',
  'ms-dynamics-crm-engineer', 'net-engineer', 'node-js-engineer', 'openstack-engineer',
  'peoplesoft-consultant', 'php-engineer', 'project-manager', 'python-engineer',
  'qa-automation-engineer', 'react-native-engineer', 'ruby-on-rails-engineer',
  'rust-c-engineer', 'salesforce-engineer', 'scala-engineer', 'shopify-engineer',
  'typescript-engineer', 'ui-ux-engineer', 'unity-engineer', 'unreal-engineer',
  'wordpress-engineer',
];

function get(url) {
  return new Promise(function (resolve, reject) {
    https.get(url, { headers: { 'User-Agent': 'BetterEngineerMigration/1.0' } }, function (res) {
      var chunks = [];
      res.on('data', function (c) { chunks.push(c); });
      res.on('end', function () {
        resolve(Buffer.concat(chunks).toString('utf8'));
      });
    }).on('error', reject);
  });
}

function decode(s) {
  return String(s || '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#0?39;/g, "'")
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/\s+/g, ' ')
    .trim();
}

function bulletsAfter(html, heading) {
  var idx = html.toLowerCase().indexOf(heading.toLowerCase());
  if (idx < 0) return [];
  var slice = html.slice(idx, idx + 8000);
  var ul = slice.match(/<ul[\s\S]*?<\/ul>/i);
  if (!ul) return [];
  var items = [];
  ul[0].replace(/<li[^>]*>([\s\S]*?)<\/li>/gi, function (_, inner) {
    var t = decode(inner);
    if (t) items.push(t);
    return _;
  });
  return items;
}

function firstPAfter(html, heading) {
  var idx = html.toLowerCase().indexOf(heading.toLowerCase());
  if (idx < 0) return '';
  var slice = html.slice(idx, idx + 4000);
  var m = slice.match(/<p[^>]*>([\s\S]*?)<\/p>/i);
  return m ? decode(m[1]) : '';
}

(async function () {
  var jobs = [];
  for (var i = 0; i < SLUGS.length; i++) {
    var slug = SLUGS[i];
    var url = 'https://www.betterengineer.com/careers/' + slug;
    var html = await get(url);
    var titleEl = (html.match(/class="[^"]*title[^"]*"[^>]*>([\s\S]*?)<\//i) || [])[1];
    var h1 = decode(titleEl || '');
    if (!h1) {
      var t = (html.match(/<title>([^<]*)<\/title>/i) || [])[1] || slug;
      h1 = t.split('|')[0].trim();
    }
    var desc = (html.match(/name="description" content="([^"]*)"/i) || [])[1] || '';
    var intro = firstPAfter(html, 'Job Description') || firstPAfter(html, 'job-description');
    if (!intro) {
      var allP = [];
      html.replace(/<p[^>]*>([\s\S]*?)<\/p>/gi, function (_, inner) {
        var t = decode(inner);
        if (t.indexOf('We are seeking') === 0) allP.push(t);
        return _;
      });
      intro = allP[0] || '';
    }
    var jd = bulletsAfter(html, 'Job Description');
    var req = bulletsAfter(html, 'Job Requirements');
    var additional = firstPAfter(html, 'Additional Information');
    jobs.push({
      slug: slug,
      name: h1,
      description: desc,
      intro: intro,
      duties: jd,
      requirements: req,
      additional: additional,
    });
    console.log(slug, '|', h1, '| duties', jd.length, 'req', req.length);
  }
  fs.mkdirSync(path.dirname(outFile), { recursive: true });
  fs.writeFileSync(outFile, JSON.stringify(jobs, null, 2));
  console.log('wrote', outFile, jobs.length);
})();
