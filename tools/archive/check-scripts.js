'use strict';
const fs = require('fs');
const h = fs.readFileSync('roles/ai-engineers/index.html', 'utf8');
// Find all script tags
const scripts = h.match(/<script[^>]*>/g) || [];
console.log('Script tags:', scripts);
// Find all style/link tags
const links = h.match(/<link[^>]*>/g) || [];
console.log('\nLink tags:', links.join('\n'));
