/**
 * update-role-tech-links.js
 *
 * Data-driven "Technologies we staff for this role" cross-link block.
 * Reads data/technologies.js, builds a reverse map of role slug -> published
 * tech slugs (via each technology's relatedRoles[]), and injects/updates a
 * '#related-technologies' section into the matching role pages, right before
 * the '<!-- Other roles -->' comment. Only published technologies are linked.
 *
 * Idempotent: re-running replaces the previously injected block instead of
 * duplicating it. Mirrors update-engineer-cards.js.
 *
 * Run with: node update-role-tech-links.js
 */
"use strict";
const fs = require("fs");
const path = require("path");
const { technologies } = require("./data/technologies.js");

const ROOT = __dirname;
const esc = (s) => String(s)
  .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

const published = technologies.filter((t) => t.status === "published");

// role slug -> [{slug, name}]
const roleToTech = {};
for (const t of published) {
  for (const r of t.relatedRoles || []) {
    (roleToTech[r] = roleToTech[r] || []).push({ slug: t.slug, name: t.name });
  }
}

function buildBlock(entries) {
  const cards = entries
    .map(({ slug, name }) => `<a class="role-card" href="/technologies/${slug}/"> <h3>${esc(name)} Engineers</h3> <p>Senior nearshore ${esc(name)} engineers matched to your stack and U.S. working hours.</p> </a>`)
    .join("");
  return `<section class="section section-tint" id="related-technologies" aria-labelledby="related-technologies-heading"> <div class="wrap"> <div class="reveal air-section-head"> <p class="eyebrow">Popular stacks</p> <h2 class="h2" id="related-technologies-heading">Technologies we staff for this role</h2> </div> <div class="roles-grid">${cards}</div> </div> </section> <!-- Other roles -->`;
}

const EXISTING_BLOCK_RE = /(?:<section class="section section-tint" id="related-technologies"[\s\S]*?<\/section> )?<!-- Other roles -->/;

let updated = 0, skipped = 0;
for (const [roleSlug, entries] of Object.entries(roleToTech)) {
  const filePath = path.join(ROOT, "roles", roleSlug, "index.html");
  if (!fs.existsSync(filePath)) { console.log(`SKIP  ${roleSlug} - file not found`); skipped++; continue; }
  const html = fs.readFileSync(filePath, "utf8");
  if (!EXISTING_BLOCK_RE.test(html)) { console.log(`WARN  ${roleSlug} - '<!-- Other roles -->' anchor not found, file unchanged`); skipped++; continue; }
  const result = html.replace(EXISTING_BLOCK_RE, buildBlock(entries));
  if (result === html) { console.log(`WARN  ${roleSlug} - no change (already up to date)`); skipped++; continue; }
  fs.writeFileSync(filePath, result);
  console.log(`OK    ${roleSlug} - ${entries.map((e) => e.name).join(", ")}`);
  updated++;
}

console.log(`\nDone. ${updated} role page(s) updated, ${skipped} skipped.`);
