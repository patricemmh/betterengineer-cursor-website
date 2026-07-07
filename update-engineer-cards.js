/**
 * update-engineer-cards.js
 *
 * Reads engineers.js and rewrites the candidate card grid in every role page.
 * Run with: node update-engineer-cards.js
 *
 * To add/change engineers on a page, edit engineers.js and re-run this script.
 */

const fs   = require('fs');
const path = require('path');
const { ENGINEERS } = require('./engineers.js');

const ROOT = __dirname;

const ROLE_SLUGS = [
  'front-end-engineers',
  'back-end-engineers',
  'full-stack-engineers',
  'mobile-engineers',
  'devops-engineers',
  'data-engineers',
  'data-science-engineers',
  'ai-engineers',
  'qa-engineers',
  'blockchain-engineers',
];

// Only use engineers whose PRIMARY role (roles[0]) matches the slug.
// This keeps each person as the face of one role; secondary appearances
// are handled separately on technology pages.
function getPrimaryEngineers(roleSlug) {
  return ENGINEERS.filter(e => e.roles[0] === roleSlug);
}

function buildCard(eng) {
  const name  = `${eng.firstName} ${eng.lastInitial}.`;
  const photo = `/images/engineers/${eng.id}.png`;
  const tags  = eng.skills.map(s => `<span>${s}</span>`).join('');
  return [
    `<article class="air-candidate-card reveal">`,
    ` <p class="air-candidate-card__role">${eng.roleTitle}</p>`,
    ` <h3 class="air-candidate-card__name">${name}</h3>`,
    ` <img class="air-candidate-card__photo" src="${photo}" alt="${name}" width="400" height="400" loading="lazy">`,
    ` <p class="air-candidate-card__verified"> <span aria-hidden="true">&#10003;</span> <span>Verified Expert in Engineering</span> </p>`,
    ` <p class="air-candidate-card__label">Expertise</p>`,
    ` <div class="air-skill-tags" aria-label="Expertise"> ${tags} </div>`,
    ` <a class="btn btn--primary" href="https://www.betterengineer.com/multi-step-contact-form">Hire ${eng.firstName}</a>`,
    `</article>`,
  ].join('');
}

function buildGrid(engineers) {
  return `<div class="air-candidates-grid"> ${engineers.map(buildCard).join('')} </div>`;
}

// Matches the entire candidates grid up to (but not including) the Hiring Path comment.
// The two closing </div> tags close: (1) the grid, (2) the .wrap div.
const GRID_RE = /<div class="air-candidates-grid">[\s\S]*?<\/div> <\/div> <\/section> <!-- Hiring path -->/;

let updated = 0;
let skipped = 0;

for (const slug of ROLE_SLUGS) {
  const filePath = path.join(ROOT, 'roles', slug, 'index.html');

  if (!fs.existsSync(filePath)) {
    console.log(`SKIP  ${slug} — file not found`);
    skipped++;
    continue;
  }

  const engineers = getPrimaryEngineers(slug);
  if (engineers.length === 0) {
    console.log(`SKIP  ${slug} — no engineers assigned (check engineers.js)`);
    skipped++;
    continue;
  }

  const html    = fs.readFileSync(filePath, 'utf8');
  const newGrid = buildGrid(engineers) + ' </div> </section> <!-- Hiring path -->';
  const result  = html.replace(GRID_RE, newGrid);

  if (result === html) {
    console.log(`WARN  ${slug} — pattern not found, file unchanged`);
    skipped++;
    continue;
  }

  fs.writeFileSync(filePath, result, 'utf8');
  console.log(`OK    ${slug} — ${engineers.length} engineers: ${engineers.map(e => `${e.firstName} ${e.lastInitial}.`).join(', ')}`);
  updated++;
}

console.log(`\nDone. ${updated} pages updated, ${skipped} skipped.`);
