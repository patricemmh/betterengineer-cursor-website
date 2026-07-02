'use strict';
const https = require('https');

const icons = [
  ['logos:replit',       'https://api.iconify.design/logos:replit.svg'],
  ['simpleicons:replit', 'https://cdn.simpleicons.org/replit/F26207'],
];

let done = 0;
icons.forEach(([name, url]) => {
  https.get(url, res => {
    let body = '';
    res.on('data', d => { if (body.length < 300) body += d; });
    res.on('end', () => {
      const match = body.match(/viewBox="([^"]+)"/);
      const vb = match ? match[1] : 'unknown';
      console.log(`${res.statusCode === 200 ? '✅' : '❌'} ${name.padEnd(26)} viewBox: ${vb}`);
      if (++done === icons.length) process.exit(0);
    });
  }).on('error', () => { console.log(`❌ ${name}`); if (++done === icons.length) process.exit(0); });
});
