'use strict';
const fs = require('fs');

const f = 'roles/blockchain-engineers/index.html';
const h = fs.readFileSync(f, 'utf8');

const checks = [
  ['Title',        h.includes('<title>Hire Blockchain Engineers')],
  ['Meta desc',    h.includes('Solidity, Rust, and Web3')],
  ['H1 content',   h.includes('Hire senior <span class="light">Blockchain engineers</span>')],
  ['Hero lead',    h.includes('Most Web3 teams stall at the smart contract layer')],
  ['Toc link 1',   h.includes('href="#what-does-a-blockchain-engineer-do"')],
  ['Toc link 2',   h.includes('href="#why-strong-blockchain-engineers"')],
  ['Section id1',  h.includes('id="what-does-a-blockchain-engineer-do"')],
  ['Section id2',  h.includes('id="why-strong-blockchain-engineers"')],
  ['Skills h2',    h.includes('<span class="accent">Blockchain</span> skills')],
  ['Use cases h2', h.includes('<span class="accent">Blockchain</span> expertise')],
  ['FAQ eyebrow',  h.includes('BLOCKCHAIN ENGINEER FAQ')],
  ['FAQ Q3 text',  h.includes('What blockchain platforms do your engineers specialize in')],
  ['JSON-LD',      h.includes('"How are BetterEngineer blockchain engineers vetted?"')],
  ['Tech grid',    h.includes('air-tech-icons')],
  ['Grid aria',    h.includes('Technologies blockchain engineers work with')],
  ['Ethereum icon',h.includes('simpleicons.org/ethereum')],
  ['Solidity icon',h.includes('simpleicons.org/solidity')],
  ['Rust icon',    h.includes('simpleicons.org/rust')],
  ['GTM head',     h.includes('GTM-WT77L8JF')],
  ['GTM noscript', h.includes('googletagmanager.com/ns.html')],
  ['OG url',       h.includes('roles/blockchain-engineers/')],
  ['No template',  !h.includes('roles/roles-template/')],
  ['Other roles',  h.includes('id="other-roles"')],
  ['Blockchain card in self', h.includes('href="/roles/blockchain-engineers/"')],
];

// Check roles/index.html card
const idx = fs.readFileSync('roles/index.html', 'utf8');
checks.push(['Index card', idx.includes('href="/roles/blockchain-engineers/"')]);

// Check 2 existing pages have blockchain card
const sample = fs.readFileSync('roles/ai-engineers/index.html', 'utf8');
checks.push(['Cross-link ai-engineers', sample.includes('href="/roles/blockchain-engineers/"')]);
const sample2 = fs.readFileSync('roles/front-end-engineers/index.html', 'utf8');
checks.push(['Cross-link front-end', sample2.includes('href="/roles/blockchain-engineers/"')]);

let pass = 0, fail = 0;
checks.forEach(([name, ok]) => {
  console.log(ok ? `  PASS  ${name}` : `  FAIL  ${name}`);
  ok ? pass++ : fail++;
});
console.log(`\n${pass} passed, ${fail} failed`);
