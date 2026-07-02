'use strict';
const https = require('https');

const icons = [
  // Claude icon variants
  ['logos:claude',              'https://api.iconify.design/logos:claude.svg'],
  ['logos:claude-color',        'https://api.iconify.design/logos:claude-color.svg'],
  ['logos:anthropic',           'https://api.iconify.design/logos:anthropic.svg'],
  ['logos:anthropic-icon',      'https://api.iconify.design/logos:anthropic-icon.svg'],
  ['simple-icons:claudecode',   'https://cdn.simpleicons.org/claudecode'],
  // Gemini variants — confirm which gives the sparkle
  ['logos:google-gemini',       'https://api.iconify.design/logos:google-gemini.svg'],
  ['logos:google-gemini-icon',  'https://api.iconify.design/logos:google-gemini-icon.svg'],
  ['logos:gemini',              'https://api.iconify.design/logos:gemini.svg'],
  ['vscode-icons:file-type-gemini', 'https://api.iconify.design/vscode-icons:file-type-gemini.svg'],
];

const https2 = require('https');

let done = 0;
icons.forEach(([name, url]) => {
  https.get(url, res => {
    const ok = res.statusCode === 200;
    // For SVG responses, grab first 200 bytes to see what the icon looks like
    let body = '';
    res.on('data', d => { if (body.length < 300) body += d; });
    res.on('end', () => {
      const snippet = body.slice(0, 120).replace(/\s+/g,' ');
      console.log(`${ok ? '✅' : '❌'} ${name.padEnd(34)} ${res.statusCode} | ${snippet}`);
      if (++done === icons.length) process.exit(0);
    });
  }).on('error', () => {
    console.log(`❌ ${name.padEnd(34)} (error)`);
    if (++done === icons.length) process.exit(0);
  });
});
