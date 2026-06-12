#!/usr/bin/env node
/**
 * add-role-to-grids.js
 *
 * Appends a new role card to the #other-roles .roles-grid on every
 * existing role detail page.
 *
 * Usage:
 *   node .cursor/skills/create-role-page/scripts/add-role-to-grids.js \
 *     --slug="security-engineers" \
 *     --name="Security Engineers" \
 *     --desc="Pen testing, threat modeling, and secure SDLC for teams handling sensitive data."
 */

'use strict';
const fs   = require('fs');
const path = require('path');

// ── Parse args ───────────────────────────────────────────────────────────────
const args = {};
process.argv.slice(2).forEach(arg => {
  const [k, v] = arg.replace(/^--/, '').split('=');
  args[k] = v;
});

const { slug, name, desc } = args;
if (!slug || !name || !desc) {
  console.error('Usage: node add-role-to-grids.js --slug=X --name=X --desc=X');
  process.exit(1);
}

// The new card to insert (not featured)
const NEW_CARD = `<a class="role-card" href="/roles/${slug}/"> <h3>${name}</h3> <p>${desc}</p> </a>`;

// ── Find all role pages that have an #other-roles grid ───────────────────────
const rolesDir = path.join(__dirname, '..', '..', '..', '..', 'roles');
const entries  = fs.readdirSync(rolesDir, { withFileTypes: true });

let updated = 0;
let skipped = 0;

entries.forEach(entry => {
  if (!entry.isDirectory()) return;
  const f = path.join(rolesDir, entry.name, 'index.html');
  if (!fs.existsSync(f)) return;

  let html = fs.readFileSync(f, 'utf8');

  if (!html.includes('id="other-roles"')) { skipped++; return; }
  if (html.includes(`href="/roles/${slug}/"`)) {
    console.log(`SKIP (already has card): ${entry.name}`);
    skipped++;
    return;
  }

  // Insert before </div> </div> </section> that closes the roles grid
  // The grid ends with the last role card followed by </div> </div> </section>
  const GRID_END = '</div> </div> </section>';
  const insertIdx = html.indexOf(GRID_END, html.indexOf('id="other-roles"'));

  if (insertIdx === -1) {
    console.log(`WARN: could not find grid end in ${entry.name}`);
    return;
  }

  html = html.slice(0, insertIdx) + NEW_CARD + html.slice(insertIdx);
  fs.writeFileSync(f, html);
  console.log(`Updated: ${entry.name}`);
  updated++;
});

console.log(`\nDone. Updated ${updated} pages, skipped ${skipped}.`);
