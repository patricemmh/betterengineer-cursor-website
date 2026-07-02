'use strict';
const https = require('https');

const icons = [
  // Iconify logos collection (colored brand logos)
  ['logos:google-gemini',       'https://api.iconify.design/logos:google-gemini.svg'],
  ['logos:github-copilot',      'https://api.iconify.design/logos:github-copilot.svg'],
  ['logos:openai',              'https://api.iconify.design/logos:openai.svg'],
  ['logos:openai-icon',         'https://api.iconify.design/logos:openai-icon.svg'],
  ['logos:cursor',              'https://api.iconify.design/logos:cursor.svg'],
  ['logos:windsurf',            'https://api.iconify.design/logos:windsurf.svg'],
  ['logos:replit',              'https://api.iconify.design/logos:replit.svg'],
  ['logos:anthropic',           'https://api.iconify.design/logos:anthropic.svg'],
  ['logos:claude',              'https://api.iconify.design/logos:claude.svg'],
  ['logos:microsoft-copilot',   'https://api.iconify.design/logos:microsoft-copilot.svg'],
  ['logos:vercel',              'https://api.iconify.design/logos:vercel.svg'],
  ['logos:vercel-icon',         'https://api.iconify.design/logos:vercel-icon.svg'],
  // Skill icons collection (another colored set)
  ['skill-icons:cursor-dark',   'https://api.iconify.design/skill-icons:cursor-dark.svg'],
  ['skill-icons:vercel-dark',   'https://api.iconify.design/skill-icons:vercel-dark.svg'],
];

let done = 0;
icons.forEach(([name, url]) => {
  https.get(url, res => {
    const ok = res.statusCode === 200;
    console.log(`${ok ? '✅' : '❌'} ${name.padEnd(30)} ${res.statusCode}`);
    if (++done === icons.length) process.exit(0);
  }).on('error', () => {
    console.log(`❌ ${name.padEnd(30)} (error)`);
    if (++done === icons.length) process.exit(0);
  });
});
