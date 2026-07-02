'use strict';
const fs = require('fs');
const f = 'roles/front-end-engineers/index.html';
const s = fs.readFileSync(f, 'utf8');
const can = s.match(/rel="canonical" href="([^"]+)"/);
const og = s.match(/property="og:url" content="([^"]+)"/);
const ld = s.match(/application\/ld\+json">([^<]+)/);
console.log('canonical:', can && can[1]);
console.log('og:url:', og && og[1]);
if (ld) {
  const j = JSON.parse(ld[1]);
  console.log('faq names:', j.mainEntity.map((q) => q.name));
}
