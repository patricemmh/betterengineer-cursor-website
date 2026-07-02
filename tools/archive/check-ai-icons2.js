'use strict';
const https = require('https');

const icons = [
  ['cursor',        'https://cdn.simpleicons.org/cursor'],
  ['githubcopilot', 'https://cdn.simpleicons.org/githubcopilot'],
  ['anthropic',     'https://cdn.simpleicons.org/anthropic'],        // Claude Code
  ['openai',        'https://cdn.simpleicons.org/openai'],            // ChatGPT
  ['vercel',        'https://cdn.simpleicons.org/vercel'],             // v0
  ['windsurf',      'https://cdn.simpleicons.org/windsurf'],
  ['replit',        'https://cdn.simpleicons.org/replit'],
  ['devin',         'https://cdn.simpleicons.org/devin'],              // Cognition's Devin
  ['cognition',     'https://cdn.simpleicons.org/cognition'],
  ['codex',         'https://cdn.simpleicons.org/codex'],              // OpenAI Codex
  ['claudecode',    'https://cdn.simpleicons.org/claudecode'],
  ['claudeai',      'https://cdn.simpleicons.org/claudeai'],
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
