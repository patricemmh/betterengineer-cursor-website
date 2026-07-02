'use strict';
const https = require('https');

const icons = [
  ['chatgpt',       'https://cdn.simpleicons.org/chatgpt'],
  ['openai',        'https://cdn.simpleicons.org/openai'],
  ['openai-412991', 'https://cdn.simpleicons.org/openai/412991'],
  ['claudecode',    'https://cdn.simpleicons.org/claudecode/D97757'],
  ['cursor-clr',    'https://cdn.simpleicons.org/cursor/000000'],
  ['replit-clr',    'https://cdn.simpleicons.org/replit/F26207'],
  ['vercel-clr',    'https://cdn.simpleicons.org/vercel/000000'],
  ['windsurf-clr',  'https://cdn.simpleicons.org/windsurf/1A9C8B'],
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
