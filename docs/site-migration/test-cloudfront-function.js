// Local check for cloudfront-www-function.js: node docs/site-migration/test-cloudfront-function.js
// For rewrites on www, also confirms the target file exists in dist-www/.
var fs = require('fs');
var path = require('path');
var vm = require('vm');

var src = fs.readFileSync(path.join(__dirname, 'cloudfront-www-function.js'), 'utf8');
var ctx = {};
vm.runInNewContext(src, ctx);
var distWww = path.join(__dirname, '..', '..', 'dist-www');

function run(host, uri, qs) {
  var querystring = {};
  (qs || '').split('&').filter(Boolean).forEach(function (pair) {
    var i = pair.indexOf('=');
    querystring[i === -1 ? pair : pair.slice(0, i)] = { value: i === -1 ? '' : pair.slice(i + 1) };
  });
  return ctx.handler({ request: { uri: uri, querystring: querystring, headers: { host: { value: host } } } });
}

var D = 'discover.betterengineer.com';
var W = 'www.betterengineer.com';
var A = 'betterengineer.com';
var ADQS = 'utm_source=google&utm_medium=cpc&gclid=abc123';

// [host, uri, query, expected uri (rewrite) or "301 <location>"]
var cases = [
  [D, '/', '', '/index.html'],
  [D, '/roles', '', '/roles/index.html'],
  [D, '/roles/ai-engineers/', '', '/roles/ai-engineers/index.html'],
  [D, '/technologies/python-developers', 'utm_source=x', '/technologies/python-developers/index.html'],
  [D, '/aimanufacturing/', '', '/aimanufacturing/index.html'],
  [D, '/AIManufacturing/', '', '/AIManufacturing/index.html'],
  [D, '/ai-fluent-engineers/', '', '/ai-fluent-engineers/index.html'],
  [D, '/styles/brand.css', '', '/styles/brand.css'],
  [D, '/404.html', '', '/404.html'],
  [D, '/www/about/', 'a=1', '301 https://www.betterengineer.com/about/?a=1'],
  [W, '/', '', '/www/index.html'],
  [W, '/about', '', '/www/about/index.html'],
  [W, '/about/', '', '/www/about/index.html'],
  [W, '/case-studies/hydrow', '', '/www/case-studies/hydrow/index.html'],
  [W, '/styles/brand.css', '', '/www/styles/brand.css'],
  [W, '/icons/favicon.png', '', '/www/icons/favicon.png'],
  [W, '/scripts/cookie-consent.js', '', '/www/scripts/cookie-consent.js'],
  [W, '/sitemap.xml', '', '/www/sitemap.xml'],
  [W, '/robots.txt', '', '/www/robots.txt'],
  [W, '/hire-software-engineers-in-72-hours', ADQS, '/www/hire-software-engineers-in-72-hours/index.html'],
  [W, '/hire-software-engineers-in-72-hours/', ADQS, '/www/hire-software-engineers-in-72-hours/index.html'],
  [W, '/Hire-Software-Engineers-In-72-Hours', ADQS, '301 https://www.betterengineer.com/hire-software-engineers-in-72-hours?' + ADQS],
  [A, '/', '', '301 https://www.betterengineer.com/'],
  [A, '/about', 'utm_source=x', '301 https://www.betterengineer.com/about?utm_source=x'],
  [A, '/Hire-Software-Engineers-In-72-Hours', ADQS, '301 https://www.betterengineer.com/Hire-Software-Engineers-In-72-Hours?' + ADQS],
  [W, '/roles/ai-engineers', 'utm_source=x', '301 https://discover.betterengineer.com/roles/ai-engineers/?utm_source=x'],
  [W, '/roles/', '', '301 https://discover.betterengineer.com/roles/'],
  [W, '/Technologies/Python-Developers/', '', '301 https://discover.betterengineer.com/technologies/python-developers/'],
  [W, '/hire-senior-python-engineers-nearshore-latam-talent', ADQS, '301 https://discover.betterengineer.com/technologies/python-developers/?' + ADQS],
  [W, '/hire-senior-full-stack-engineers-nearshore-latam-talent', '', '301 https://discover.betterengineer.com/roles/full-stack-engineers/'],
  [W, '/hire-senior-ai-data-engineers-nearshore-latam-talent/', '', '301 https://discover.betterengineer.com/roles/ai-engineers/'],
  [W, '/ai-readiness-manufacturing', 'utm_campaign=q4', '301 https://discover.betterengineer.com/aimanufacturing/?utm_campaign=q4'],
  [W, '/webinar', '', '301 /contact/'],
  [W, '/aiwebinar/', 'utm_source=li', '301 /contact/?utm_source=li'],
  [W, '/roi', '', '301 /staff-augmentation/'],
  [W, '/blog', '', '301 https://blog.betterengineer.com/resource-center'],
  // Unknown page: rewritten, S3 has no such key, distribution error response serves /404.html with status 404.
  [W, '/nope', '', '/www/nope/index.html']
];

var failed = 0;
cases.forEach(function (c) {
  var res = run(c[0], c[1], c[2]);
  var got = res.statusCode ? res.statusCode + ' ' + res.headers.location.value : res.uri;
  var ok = got === c[3];
  var note = '';
  if (ok && !res.statusCode && c[0] === W && c[1] !== '/nope') {
    if (!fs.existsSync(path.join(distWww, got.slice('/www/'.length)))) { ok = false; note = ' (missing in dist-www)'; }
  }
  if (!ok) failed++;
  console.log((ok ? 'PASS ' : 'FAIL ') + c[0] + c[1] + (c[2] ? '?' + c[2] : '') + ' -> ' + got + (ok ? '' : '  expected ' + c[3] + note));
});

var size = Buffer.byteLength(src, 'utf8');
console.log('\nFunction size: ' + size + ' bytes (limit 10240)');
if (size > 10240) failed++;
console.log(failed ? failed + ' failed' : 'All passed');
process.exit(failed ? 1 : 0);
