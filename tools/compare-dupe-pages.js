'use strict';
const fs = require('fs');

const pages = [
  'roles/ai-engineer/index.html',
  'roles/ai-engineers/index.html',
  'roles/backend-engineer/index.html',
  'roles/back-end-engineers/index.html',
  'roles/frontend-engineer/index.html',
  'roles/front-end-engineers/index.html',
  'roles/front-end-engineers-seo-aeo/index.html',
  'roles/data-engineers/index.html',
  'roles/data-science-engineers/index.html',
];

pages.forEach(function (f) {
  const s = fs.readFileSync(f, 'utf8');
  const title = (s.match(/<title>([^<]+)/) || ['', ''])[1];
  const can = (s.match(/rel="canonical" href="([^"]+)"/) || ['', 'none'])[1];
  const h1raw = (s.match(/<h1[^>]*>([\s\S]{0,200})/) || ['', ''])[1];
  const h1 = h1raw.replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim().slice(0, 80);
  const bytes = s.length;
  console.log('FILE:', f);
  console.log('  title:', title);
  console.log('  canonical:', can);
  console.log('  h1:', h1);
  console.log('  size:', bytes, 'bytes');
  console.log('');
});
