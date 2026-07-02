'use strict';
const fs = require('fs');

// Fix 1: Trust card 3 (apostrophe is literal ', not &#39;)
let react = fs.readFileSync('technologies/react/index.html', 'utf8');
const OLD = "BetterEngineer's experts are trailblazers with modern frameworks and seamlessly adopt the latest AI-powered tools, from dynamic user flows to intelligent UI personalization.";
const NEW = "Our React engineers work with the current ecosystem as standard practice: Next.js server components, streaming UI, modern React patterns, and AI-assisted development tooling built into their workflow.";
if (react.includes(OLD)) {
  react = react.split(OLD).join(NEW);
  console.log('Trust card 3: fixed');
} else {
  console.warn('Trust card 3: still missing');
}
fs.writeFileSync('technologies/react/index.html', react);

// Fix 2: Template og:description still has React content?
let tmpl = fs.readFileSync('technologies/tech-template/index.html', 'utf8');
const ogDesc = tmpl.indexOf('og:description');
console.log('\nTemplate og:description area:', JSON.stringify(tmpl.slice(ogDesc, ogDesc + 120)));
// Fix if still contains React
if (tmpl.includes('Hire senior React engineers in your timezone.')) {
  tmpl = tmpl.split('Hire senior React engineers in your timezone. ').join('');
  console.log('Template og:description: fixed React prefix removed');
  fs.writeFileSync('technologies/tech-template/index.html', tmpl);
} else {
  console.log('Template og:description: already clean');
}
