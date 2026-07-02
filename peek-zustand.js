'use strict';
const fs = require('fs');
const h = fs.readFileSync('technologies/react/index.html', 'utf8');
const idx = h.indexOf('Zustand');
console.log('Context:', JSON.stringify(h.slice(idx - 80, idx + 150)));
