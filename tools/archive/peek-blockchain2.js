'use strict';
const fs = require('fs');
const h = fs.readFileSync('roles/blockchain-engineers/index.html', 'utf8');

// Dump JSON-LD raw
const s1 = h.indexOf('<script type="application/ld+json">') + '<script type="application/ld+json">'.length;
const e1 = h.indexOf('</script>', s1);
console.log('--- JSON-LD (first 200 chars) ---');
console.log(h.slice(s1, s1 + 200));

// Dump first toc section
const s2 = h.indexOf('id="what-does-a-front-end-engineer-do"');
console.log('\n--- First toc section (first 300 chars) ---');
console.log(h.slice(s2 - 20, s2 + 300));

// Dump skills section
const s3 = h.indexOf('"skills-heading"');
console.log('\n--- Skills heading area (300 chars) ---');
console.log(h.slice(s3 - 20, s3 + 300));
