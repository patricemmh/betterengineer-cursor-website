'use strict';
const fs = require('fs');

// Check trust card 3 exact content
const react = fs.readFileSync('technologies/react/index.html', 'utf8');
const trustIdx = react.indexOf('Future-Ready');
console.log('Trust card 3:', JSON.stringify(react.slice(trustIdx, trustIdx + 200)));

// Check template meta description
const tmpl = fs.readFileSync('technologies/tech-template/index.html', 'utf8');
const descIdx = tmpl.indexOf('TECH_META_DESCRIPTION');
console.log('\nTemplate meta desc area:', JSON.stringify(tmpl.slice(descIdx - 30, descIdx + 60)));
