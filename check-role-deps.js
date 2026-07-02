'use strict';
const fs = require('fs');
const h = fs.readFileSync('roles/ai-engineers/index.html', 'utf8');

// Find all local resource references
const refs = new Set();
const patterns = [
  /href="(\/[^"#?]+)"/g,
  /src="(\/[^"#?]+)"/g,
];
for (const re of patterns) {
  let m;
  while ((m = re.exec(h)) !== null) {
    const p = m[1];
    if (!p.startsWith('http')) refs.add(p);
  }
}
console.log([...refs].sort().join('\n'));
