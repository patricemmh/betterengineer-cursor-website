'use strict';
const https = require('https');

const icons = [
  ['anthropic', 'https://cdn.simpleicons.org/anthropic'],
  ['openai', 'https://cdn.simpleicons.org/openai'],
  ['githubcopilot', 'https://cdn.simpleicons.org/githubcopilot'],
  ['cursor', 'https://cdn.simpleicons.org/cursor'],
  ['googlegemini', 'https://cdn.simpleicons.org/googlegemini'],
  ['codeium', 'https://cdn.simpleicons.org/codeium'],
  ['tabnine', 'https://cdn.simpleicons.org/tabnine'],
  ['warp', 'https://cdn.simpleicons.org/warp'],
  ['ollama', 'https://cdn.simpleicons.org/ollama'],
  ['windsurf', 'https://cdn.simpleicons.org/windsurf'],
  ['perplexity', 'https://cdn.simpleicons.org/perplexity'],
  ['mistral', 'https://cdn.simpleicons.org/mistral'],
];

let done = 0;
icons.forEach(([name, url]) => {
  https.get(url, res => {
    const ok = res.statusCode === 200;
    console.log(`${ok ? '✅' : '❌'} ${name.padEnd(20)} ${res.statusCode}`);
    if (++done === icons.length) process.exit(0);
  }).on('error', () => {
    console.log(`❌ ${name.padEnd(20)} (network error)`);
    if (++done === icons.length) process.exit(0);
  });
});
