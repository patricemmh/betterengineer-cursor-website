'use strict';
const fs = require('fs');

// Pull the other-roles section from a page that has it, then add the blockchain card
const source = fs.readFileSync('roles/ai-engineers/index.html', 'utf8');

const START = source.indexOf('<section class="section section-tint" id="other-roles"');
const END   = source.indexOf('</section>', START) + '</section>'.length;
let section = source.slice(START, END);

// Add the blockchain-engineers card (before closing tags)
const CARD = `<a class="role-card" href="/roles/blockchain-engineers/"> <h3>Blockchain Engineers</h3> <p>Smart contracts, DeFi protocols, and Web3 infrastructure for teams building on-chain products.</p> </a>`;
const CLOSE = '</div> </div> </section>';
const closeIdx = section.lastIndexOf(CLOSE);
section = section.slice(0, closeIdx) + CARD + section.slice(closeIdx);

// Write into the blockchain page before <!-- Final CTA -->
let blockchain = fs.readFileSync('roles/blockchain-engineers/index.html', 'utf8');
const CTA_MARKER = '<!-- Final CTA -->';
blockchain = blockchain.replace(CTA_MARKER, section + '\n' + CTA_MARKER);
fs.writeFileSync('roles/blockchain-engineers/index.html', blockchain);
console.log('other-roles section added to blockchain-engineers page.');
