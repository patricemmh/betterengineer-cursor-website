'use strict';
const fs = require('fs');
const h = fs.readFileSync('technologies/react/index.html', 'utf8');
const sections = ['id="hiring-path"', 'id="ai-tools"', 'id="guide"', 'id="ecosystem"', 'id="trust"'];
sections.forEach(s => console.log(s.padEnd(24), h.indexOf(s)));
