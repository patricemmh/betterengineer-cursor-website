'use strict';
const fs = require('fs');

const files = [
  'index.html',
  'roles/index.html',
  'roles/ai-engineers/index.html',
  'roles/front-end-engineers/index.html',
];

files.forEach(f => {
  const h = fs.readFileSync(f, 'utf8');
  console.log(`\n=== ${f} ===`);
  console.log('GTM head snippet:', h.includes('GTM-') ? h.match(/GTM-[A-Z0-9]+/g) : 'MISSING');
  console.log('GTM noscript body:', h.includes('gtm.js') ? 'present' : 'MISSING (or inline only)');
  console.log('GA4 gtag:', h.includes('gtag') ? 'present' : 'MISSING');
  console.log('GA4 G-ID:', h.match(/G-[A-Z0-9]+/)?.[0] || 'MISSING');
  console.log('GTM comment placeholder:', h.includes('Google Tag Manager would go here') ? 'YES (placeholder only, not live)' : 'no');
});
