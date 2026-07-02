'use strict';
const fs = require('fs');
const h = fs.readFileSync('technologies/react/index.html', 'utf8');
const idx = h.indexOf('trailblazers');
const chars = h.slice(idx - 30, idx + 10);
const buf = Buffer.from(chars, 'utf8');
console.log('Hex around trailblazers:', buf.toString('hex').match(/.{1,2}/g).join(' '));
