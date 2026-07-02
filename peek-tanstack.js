'use strict';
const fs = require('fs');
const h = fs.readFileSync('technologies/react/index.html', 'utf8');
const idx = h.indexOf('tanstack');
console.log('TanStack icon:', JSON.stringify(h.slice(idx - 10, idx + 80)));
const zustandIcon = h.includes('alt="Zustand"') || h.includes('<span>Zustand</span>');
console.log('Zustand icon still present?', zustandIcon);
