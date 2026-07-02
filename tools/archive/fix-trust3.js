'use strict';
const fs = require('fs');
let h = fs.readFileSync('technologies/react/index.html', 'utf8');

// U+2019 right single quotation mark
const CURLY = '\u2019';
const OLD = `BetterEngineer${CURLY}s experts are trailblazers with modern frameworks and seamlessly adopt the latest AI-powered tools, from dynamic user flows to intelligent UI personalization.`;
const NEW = `Our React engineers work with the current ecosystem as standard practice: Next.js server components, streaming UI, modern React patterns, and AI-assisted development tooling built into their workflow.`;

if (h.includes(OLD)) {
  h = h.split(OLD).join(NEW);
  fs.writeFileSync('technologies/react/index.html', h);
  console.log('Trust card 3: fixed (curly apostrophe matched)');
} else {
  // Show what's actually there
  const idx = h.indexOf('trailblazers');
  console.warn('Still missing. Content:', JSON.stringify(h.slice(idx - 30, idx + 150)));
}
