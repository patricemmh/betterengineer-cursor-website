'use strict';
const https = require('https');

const icons = [
  ['simpleicons:codex',          'https://cdn.simpleicons.org/codex'],
  ['simpleicons:openaicodex',    'https://cdn.simpleicons.org/openaicodex'],
  ['logos:codex',                'https://api.iconify.design/logos:codex.svg'],
  ['logos:openai-codex',        'https://api.iconify.design/logos:openai-codex.svg'],
  ['logos:codex-icon',           'https://api.iconify.design/logos:codex-icon.svg'],
  ['vscode-icons:file-type-codex','https://api.iconify.design/vscode-icons:file-type-codex.svg'],
  ['logos:chatgpt',              'https://api.iconify.design/logos:chatgpt.svg'],
  ['logos:chatgpt-icon',         'https://api.iconify.design/logos:chatgpt-icon.svg'],
  ['skill-icons:openai-dark',    'https://api.iconify.design/skill-icons:openai-dark.svg'],
  ['skill-icons:openai-light',   'https://api.iconify.design/skill-icons:openai-light.svg'],
];

let done = 0;
icons.forEach(([name, url]) => {
  https.get(url, res => {
    let body = '';
    res.on('data', d => { if (body.length < 200) body += d; });
    res.on('end', () => {
      const ok = res.statusCode === 200;
      console.log(`${ok ? '✅' : '❌'} ${name.padEnd(32)} ${res.statusCode} | ${body.slice(0,90)}`);
      if (++done === icons.length) process.exit(0);
    });
  }).on('error', () => {
    console.log(`❌ ${name.padEnd(32)} (error)`);
    if (++done === icons.length) process.exit(0);
  });
});
