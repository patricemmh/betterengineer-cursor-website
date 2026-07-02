'use strict';
const fs = require('fs');
const path = require('path');

const CARD = `<a class="role-card" href="/roles/blockchain-engineers/"> <h3>Blockchain Engineers</h3> <p>Smart contracts, DeFi protocols, and Web3 infrastructure for teams building on-chain products.</p> </a>`;

const pages = [
  'roles/index.html',
  'roles/ai-engineers/index.html',
  'roles/back-end-engineers/index.html',
  'roles/blockchain-engineers/index.html',
  'roles/data-engineers/index.html',
  'roles/data-science-engineers/index.html',
  'roles/devops-engineers/index.html',
  'roles/front-end-engineers/index.html',
  'roles/full-stack-engineers/index.html',
  'roles/mobile-engineers/index.html',
  'roles/qa-engineers/index.html',
];

pages.forEach(f => {
  let html = fs.readFileSync(f, 'utf8');
  const count = (html.split(CARD).length - 1);
  if (count > 1) {
    // Remove all occurrences and put back exactly one
    html = html.split(CARD).join('');
    // Re-insert once before the closing of the grid/section
    const closeTag = '</div> </div> </section>';
    const lastClose = html.lastIndexOf(closeTag, html.indexOf('id="other-roles"') !== -1
      ? html.indexOf('</section>', html.indexOf('id="other-roles"'))
      : html.lastIndexOf(closeTag));
    // Simpler: find last occurrence of the close tag after the roles-grid
    const gridIdx = html.indexOf('roles-grid');
    const closeAfterGrid = html.indexOf(closeTag, gridIdx);
    html = html.slice(0, closeAfterGrid) + CARD + html.slice(closeAfterGrid);
    fs.writeFileSync(f, html);
    console.log(`Fixed (${count} → 1): ${f}`);
  } else {
    console.log(`OK (${count}): ${f}`);
  }
});
