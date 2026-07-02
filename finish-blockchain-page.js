'use strict';
const fs = require('fs');

const SI = 'https://cdn.simpleicons.org';
const DI = 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons';

// ── 1. Add icon grid CSS + replace static image ──────────────────────────────
const CSS = `<style>.air-tech-icons{display:grid;grid-template-columns:repeat(5,1fr);gap:1.75rem 1rem}.air-tech-icon{display:flex;flex-direction:column;align-items:center;gap:.85rem}.air-tech-icon img{width:54px;height:54px;object-fit:contain}.air-tech-icon span{font-size:.8rem;color:#374151;font-weight:600;text-align:center;line-height:1.3}@media(max-width:768px){.air-tech-icons{gap:1.4rem .75rem}}@media(max-width:600px){.air-tech-icons{grid-template-columns:repeat(4,1fr)}}@media(max-width:380px){.air-tech-icons{grid-template-columns:repeat(3,1fr);gap:1.1rem .6rem}}</style>`;

const icons = [
  [`${SI}/ethereum`,   'Ethereum'],
  [`${SI}/solidity`,   'Solidity'],
  [`${SI}/rust`,       'Rust'],
  [`${SI}/typescript`, 'TypeScript'],
  [`${SI}/python`,     'Python'],
  [`${SI}/go`,         'Go'],
  [`${SI}/docker`,     'Docker'],
  [`${SI}/graphql`,    'GraphQL'],
  [`${SI}/ipfs`,       'IPFS'],
  [`${SI}/redis`,      'Redis'],
];

const items = icons.map(([url, label]) =>
  `<div class="air-tech-icon"><img src="${url}" alt="${label}" width="54" height="54" loading="lazy"><span>${label}</span></div>`
).join('');

const GRID = `<div class="reveal"> <div class="air-tech-icons" aria-label="Technologies blockchain engineers work with"> ${items} </div> </div>`;

const IMG_RE = /<div class="reveal"> <img src="\/images\/roles\/front-end-engineers\/technologies-stack\.png" alt="[^"]*" loading="lazy"> <\/div>/;

let blockchain = fs.readFileSync('roles/blockchain-engineers/index.html', 'utf8');
if (!blockchain.includes('air-tech-icons')) {
  blockchain = blockchain.replace('</head>', CSS + '</head>');
}
blockchain = blockchain.replace(IMG_RE, GRID);
fs.writeFileSync('roles/blockchain-engineers/index.html', blockchain);
console.log('Icon grid added.');

// ── 2. Add performance image attributes ─────────────────────────────────────
// Client logos width/height (same as all other pages)
[
  ['accenture-grey.png" alt="Accenture" loading="lazy">', 'accenture-grey.png" alt="Accenture" width="120" height="36" loading="lazy">'],
  ['chapterspot-grey.png" alt="ChapterSpot" loading="lazy">', 'chapterspot-grey.png" alt="ChapterSpot" width="120" height="36" loading="lazy">'],
  ['securelink-grey.png" alt="SecureLink" loading="lazy">', 'securelink-grey.png" alt="SecureLink" width="120" height="36" loading="lazy">'],
  ['hydrow.png" alt="Hydrow" loading="lazy">', 'hydrow.png" alt="Hydrow" width="120" height="36" loading="lazy">'],
  ['wasteplace-grey.png" alt="WastePlace" loading="lazy">', 'wasteplace-grey.png" alt="WastePlace" width="120" height="36" loading="lazy">'],
].forEach(([old, nw]) => {
  blockchain = fs.readFileSync('roles/blockchain-engineers/index.html', 'utf8');
  blockchain = blockchain.split(old).join(nw);
  fs.writeFileSync('roles/blockchain-engineers/index.html', blockchain);
});

// Trust photo height
blockchain = fs.readFileSync('roles/blockchain-engineers/index.html', 'utf8');
blockchain = blockchain.replace('width="720" loading="lazy">', 'width="720" height="540" loading="lazy">');
// Header logo eager loading
blockchain = blockchain.split('betterengineer-logo.svg" alt="BetterEngineer" width="183" height="33">').join('betterengineer-logo.svg" alt="BetterEngineer" width="183" height="33" loading="eager">');
fs.writeFileSync('roles/blockchain-engineers/index.html', blockchain);
console.log('Image attributes added.');

// ── 3. Add to roles/index.html grid ─────────────────────────────────────────
let index = fs.readFileSync('roles/index.html', 'utf8');
const NEW_CARD = `<a class="role-card" href="/roles/blockchain-engineers/"> <h3>Blockchain Engineers</h3> <p>Smart contracts, DeFi protocols, and Web3 infrastructure for teams building on-chain products.</p> </a>`;
// Insert before the closing of the roles-grid
const GRID_CLOSE = '</div> </div> </section>';
const gridEnd = index.indexOf(GRID_CLOSE, index.indexOf('roles-grid'));
index = index.slice(0, gridEnd) + NEW_CARD + index.slice(gridEnd);
fs.writeFileSync('roles/index.html', index);
console.log('Added card to roles/index.html.');

// ── 4. Add GTM to the new page ───────────────────────────────────────────────
const PLACEHOLDER = `<!-- Google Tag Manager would go here (GTM-WT77L8JF), same as your current setup -->`;
const GTM_HEAD = `<!-- Google Tag Manager --><script>(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','GTM-WT77L8JF');</script><!-- End Google Tag Manager -->`;
const GTM_BODY = `<!-- Google Tag Manager (noscript) --><noscript><iframe src="https://www.googletagmanager.com/ns.html?id=GTM-WT77L8JF" height="0" width="0" style="display:none;visibility:hidden"></iframe></noscript><!-- End Google Tag Manager (noscript) -->`;

blockchain = fs.readFileSync('roles/blockchain-engineers/index.html', 'utf8');
blockchain = blockchain.replace(PLACEHOLDER, GTM_HEAD);
blockchain = blockchain.replace('<body> <a class="skip-link"', '<body> ' + GTM_BODY + ' <a class="skip-link"');
fs.writeFileSync('roles/blockchain-engineers/index.html', blockchain);
console.log('GTM injected.');
