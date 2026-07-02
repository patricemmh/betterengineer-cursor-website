'use strict';
const https = require('https');

const icons = [
  ['simple-icons:v0',        'https://cdn.simpleicons.org/v0'],
  ['logos:v0',               'https://api.iconify.design/logos:v0.svg'],
  ['logos:v0-icon',          'https://api.iconify.design/logos:v0-icon.svg'],
  ['simple-icons:shadcn',    'https://cdn.simpleicons.org/shadcn'],
  ['logos:shadcnui',         'https://api.iconify.design/logos:shadcnui.svg'],
];

let done = 0;
icons.forEach(([name, url]) => {
  https.get(url, res => {
    let body = '';
    res.on('data', d => { if (body.length < 200) body += d; });
    res.on('end', () => {
      const ok = res.statusCode === 200;
      console.log(`${ok ? '✅' : '❌'} ${name.padEnd(26)} ${res.statusCode} | ${body.slice(0,80)}`);
      if (++done === icons.length) process.exit(0);
    });
  }).on('error', () => {
    console.log(`❌ ${name.padEnd(26)} (error)`);
    if (++done === icons.length) process.exit(0);
  });
});
