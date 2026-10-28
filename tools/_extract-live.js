'use strict';
var fs = require('fs');
var path = require('path');
var tmp = process.env.TEMP || process.env.TMPDIR || '.';
var sm = fs.readFileSync(path.join(tmp, 'be-sitemap.xml'), 'utf8');
var locs = [];
sm.replace(/<loc>([^<]+)<\/loc>/g, function (_, u) { locs.push(u); return _; });
var interesting = locs.filter(function (u) {
  return /careers|case-stud|privacy|terms|fintech|martech|healthtech|multi-step|contact-form|industr/i.test(u);
});
console.log('TOTAL', locs.length);
console.log('INTERESTING', interesting.length);
interesting.sort().forEach(function (u) { console.log(u); });

var html = fs.readFileSync(path.join(tmp, 'be-careers.html'), 'utf8');
var title = (html.match(/<title>([^<]*)<\/title>/i) || [])[1];
var desc = (html.match(/name="description" content="([^"]*)"/i) || [])[1];
var can = (html.match(/rel="canonical" href="([^"]+)"/i) || [])[1];
var jobs = [];
html.replace(/href="(https:\/\/www\.betterengineer\.com\/careers\/[^"]+)"/g, function (_, u) {
  jobs.push(u.split('?')[0].replace(/\/$/, ''));
  return _;
});
var unique = Array.from(new Set(jobs));
console.log('\nCAREERS TITLE', title);
console.log('CAREERS DESC', desc);
console.log('CAREERS CANON', can);
console.log('JOB LINKS', unique.length);
unique.sort().forEach(function (u) { console.log(u); });
