'use strict';
const fs = require('fs');
const h = fs.readFileSync('roles/blockchain-engineers/index.html', 'utf8');

// Check FAQ JSON-LD
const jIdx = h.indexOf('FAQPage');
console.log('FAQPage context:', JSON.stringify(h.slice(jIdx - 5, jIdx + 60)));

// Check toc sections
const s1 = h.indexOf('air-toc-section');
console.log('First toc section id:', JSON.stringify(h.slice(s1, s1 + 80)));

// Check skills heading
const sk = h.indexOf('Stack coverage');
console.log('Skills heading area:', JSON.stringify(h.slice(sk - 5, sk + 120)));

// Check what the h1 looks like now
const h1 = h.indexOf('role-hero-title');
console.log('h1 area:', JSON.stringify(h.slice(h1, h1 + 100)));
