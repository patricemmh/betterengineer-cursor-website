'use strict';
const https = require('https');

const icons = [
  // Devin / Cognition alternatives
  ['devinai',       'https://cdn.simpleicons.org/devinai'],
  ['cognitionai',   'https://cdn.simpleicons.org/cognitionai'],
  // Also check brand colors for confirmed icons
  ['replit',        'https://cdn.simpleicons.org/replit/F26207'],
  ['vercel',        'https://cdn.simpleicons.org/vercel/000000'],
  ['claudecode',    'https://cdn.simpleicons.org/claudecode/D97757'],
  ['cursor',        'https://cdn.simpleicons.org/cursor/000000'],
  ['windsurf',      'https://cdn.simpleicons.org/windsurf/1A9C8B'],
  ['githubcopilot', 'https://cdn.simpleicons.org/githubcopilot/000000'],
  ['openai',        'https://cdn.simpleicons.org/openai/000000'],
];

let done = 0;
icons.forEach(([name, url]) => {
  https.get(url, res => {
    const ok = res.statusCode === 200;
    console.log(`${ok ? '✅' : '❌'} ${name.padEnd(20)} ${res.statusCode}`);
    if (++done === icons.length) process.exit(0);
  }).on('error', () => {
    console.log(`❌ ${name.padEnd(20)} (error)`);
    if (++done === icons.length) process.exit(0);
  });
});
