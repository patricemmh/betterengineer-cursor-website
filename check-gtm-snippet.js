'use strict';
const fs = require('fs');
const h = fs.readFileSync('index.html', 'utf8');

// Extract GTM head snippet
const headStart = h.indexOf('<!-- Google Tag Manager -->');
const headEnd   = h.indexOf('<!-- End Google Tag Manager -->') + '<!-- End Google Tag Manager -->'.length;
console.log('HEAD SNIPPET:');
console.log(JSON.stringify(h.slice(headStart, headEnd)));

// Extract GTM body noscript
const bodyStart = h.indexOf('<!-- Google Tag Manager (noscript) -->');
const bodyEnd   = h.indexOf('<!-- End Google Tag Manager (noscript) -->') + '<!-- End Google Tag Manager (noscript) -->'.length;
console.log('\nBODY NOSCRIPT:');
console.log(JSON.stringify(h.slice(bodyStart, bodyEnd)));

// Show what the role pages currently have as placeholder
const r = fs.readFileSync('roles/ai-engineers/index.html', 'utf8');
const ph = r.indexOf('Google Tag Manager would go here');
console.log('\nROLE PAGE PLACEHOLDER:');
console.log(JSON.stringify(r.slice(ph - 5, ph + 80)));
