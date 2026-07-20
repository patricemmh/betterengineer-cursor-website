'use strict';
const fs = require('fs');
const path = require('path');

// All role pages that have a React icon in their tech grid
const roleDirs = [
  'roles/ai-engineers',
  'roles/back-end-engineers',
  'roles/blockchain-engineers',
  'roles/data-engineers',
  'roles/data-science-engineers',
  'roles/devops-engineers',
  'roles/front-end-engineers',
  'roles/full-stack-engineers',
  'roles/mobile-engineers',
  'roles/qa-engineers',
  'roles/index.html', // actually a file not a dir
];

// Also update the role-detail CSS so all role pages get bigger eco icons + hover
// The role pages use inline tech grid HTML with .air-role-tech-icon or similar
// Let's check what class they use...

// First: check what class role pages use for their icon grid
const sample = fs.readFileSync('roles/front-end-engineers/index.html', 'utf8');
const techIdx = sample.indexOf('tech-icon') !== -1 ? sample.indexOf('tech-icon') :
                sample.indexOf('air-eco-icon') !== -1 ? sample.indexOf('air-eco-icon') : -1;
if (techIdx !== -1) {
  console.log('Class found:', sample.slice(techIdx - 5, techIdx + 60));
}

// The role pages use .air-tech-icon (from the build-tech-grids.js output)
// Find and wrap React icon divs in role pages with <a href="/technologies/react/">
const OLD_REACT_ICON_DIV = `<div class="air-tech-icon"><img src="https://cdn.simpleicons.org/react" alt="React"`;
const NEW_REACT_ICON_A   = `<a class="air-tech-icon air-tech-icon--link" href="/technologies/react/"><img src="https://cdn.simpleicons.org/react" alt="React"`;
const CLOSE_OLD = `</div>`;
const CLOSE_NEW = `</a>`;

let updated = 0;
const roleFiles = [
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
  'roles/index.html',
];

roleFiles.forEach(f => {
  if (!fs.existsSync(f)) { console.log(`  skip (not found): ${f}`); return; }
  let h = fs.readFileSync(f, 'utf8');
  
  // Find the React icon div and convert to <a>
  // Pattern: <div class="air-tech-icon"><img src="...react..." alt="React" ...width="36" height="36"...><span>React</span></div>
  // We need to find the full div block and replace it
  const START = '<div class="air-tech-icon"><img src="https://cdn.simpleicons.org/react" alt="React"';
  const REPLACEMENT_START = '<a class="air-tech-icon air-tech-icon--link" href="/technologies/react/"><img src="https://cdn.simpleicons.org/react" alt="React"';
  
  if (!h.includes(START)) {
    console.log(`  no React icon: ${f}`);
    return;
  }
  
  // Replace the opening tag
  let newH = h.replace(START, REPLACEMENT_START);
  
  // Now find the closing </div> that belongs to this icon
  // After the replacement, find the span>React</span></div> and change </div> to </a>
  const REACT_SPAN_CLOSE = '<span>React</span></div>';
  const REACT_SPAN_CLOSE_A = '<span>React</span></a>';
  
  if (newH.includes(REACT_SPAN_CLOSE)) {
    // Only replace the first occurrence after the React icon
    const idx = newH.indexOf(REACT_SPAN_CLOSE);
    newH = newH.slice(0, idx) + REACT_SPAN_CLOSE_A + newH.slice(idx + REACT_SPAN_CLOSE.length);
    console.log(`  linked React icon: ${f}`);
    updated++;
  } else {
    console.log(`  could not find close: ${f}`);
    // revert
    newH = h;
  }
  
  fs.writeFileSync(f, newH);
});

console.log(`\nUpdated ${updated} role pages`);

// Now add hover CSS to role-detail.css for .air-tech-icon--link
const roleDetailCSS = 'styles/role-detail.css';
let css = fs.readFileSync(roleDetailCSS, 'utf8');
const HOVER_CSS = `
/* Linked tech icons — clickable hover state */
a.air-tech-icon--link{text-decoration:none;color:inherit;cursor:pointer;border-radius:10px;transition:background .15s,transform .15s}
a.air-tech-icon--link:hover{background:rgba(79,70,229,.08);transform:translateY(-3px)}
a.air-tech-icon--link:hover img{filter:drop-shadow(0 3px 8px rgba(0,0,0,.18))}
`;

if (!css.includes('air-tech-icon--link')) {
  css += HOVER_CSS;
  fs.writeFileSync(roleDetailCSS, css);
  console.log('\nAdded hover CSS to role-detail.css');
}

// Also update the tech icon size in role-detail.css (make them bigger to match the tech page)
const OLD_ICON_SIZE = '.air-tech-icon img{width:36px;height:36px';
const NEW_ICON_SIZE = '.air-tech-icon img{width:44px;height:44px';
if (css.includes(OLD_ICON_SIZE)) {
  css = css.replace(OLD_ICON_SIZE, NEW_ICON_SIZE);
  // Also update the width of the icon wrapper
  const OLD_WRAPPER = '.air-tech-icon{display:flex;flex-direction:column;align-items:center;gap:.35rem;width:52px';
  const NEW_WRAPPER = '.air-tech-icon{display:flex;flex-direction:column;align-items:center;gap:.45rem;width:68px';
  css = css.replace(OLD_WRAPPER, NEW_WRAPPER);
  fs.writeFileSync(roleDetailCSS, css);
  console.log('Updated icon sizes in role-detail.css');
}
