'use strict';
const https = require('https');

const icons = [
  ['logos:codex',                 'https://api.iconify.design/logos:codex.svg'],
  ['logos:openai-codex',          'https://api.iconify.design/logos:openai-codex.svg'],
  ['logos:codex-cli',             'https://api.iconify.design/logos:codex-cli.svg'],
  ['devicon:codex',               'https://api.iconify.design/devicon:codex.svg'],
  ['file-icons:codex',            'https://api.iconify.design/file-icons:codex.svg'],
  ['vscode-icons:file-type-codex','https://api.iconify.design/vscode-icons:file-type-codex.svg'],
  ['simple-icons:codexcli',       'https://cdn.simpleicons.org/codexcli'],
  ['simple-icons:openaicodex',    'https://cdn.simpleicons.org/openaicodex'],
  ['simple-icons:codexbyopenai',  'https://cdn.simpleicons.org/codexbyopenai'],
];

let done = 0;
icons.forEach(([name, url]) => {
  https.get(url, res => {
    let body = '';
    res.on('data', d => { if (body.length < 150) body += d; });
    res.on('end', () => {
      const ok = res.statusCode === 200;
      console.log(`${ok ? '✅' : '❌'} ${name.padEnd(36)} ${res.statusCode}${ok ? ' | '+body.slice(0,60) : ''}`);
      if (++done === icons.length) process.exit(0);
    });
  }).on('error', () => {
    console.log(`❌ ${name.padEnd(36)} (error)`);
    if (++done === icons.length) process.exit(0);
  });
});
