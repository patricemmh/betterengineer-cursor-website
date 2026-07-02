'use strict';
const fs = require('fs');
const h = fs.readFileSync('roles/ai-engineers/index.html', 'utf8');
const idx = h.indexOf('air-page');
console.log(h.slice(Math.max(0, idx - 20), idx + 80));
console.log('\nair-page.js exists:', fs.existsSync('air-page.js'));
console.log('air-page.js size:', fs.existsSync('air-page.js') ? fs.statSync('air-page.js').size : 'N/A');
