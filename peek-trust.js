'use strict';
const fs = require('fs');
const h = fs.readFileSync('technologies/react/index.html', 'utf8');
const idx = h.indexOf("BetterEngineer");
// Find "Future-Ready" section specifically
const idx2 = h.indexOf('trailblazers');
const raw = h.slice(idx2 - 20, idx2 + 100);
console.log('Raw string:', raw);
// Show char codes around the apostrophe
const apostIdx = raw.indexOf("'");
if (apostIdx !== -1) {
  console.log('Apostrophe char code:', raw.charCodeAt(apostIdx), '(straight=39, curly-right=8217)');
  // Show 5 chars around it
  for (let i = Math.max(0, apostIdx-2); i < Math.min(raw.length, apostIdx+5); i++) {
    console.log(`  [${i}] char ${raw[i].charCodeAt(0)}: "${raw[i]}"`);
  }
}
