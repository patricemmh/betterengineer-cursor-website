/**
 * Add Browse Roles + Browse by Technology under Our Services in footers,
 * beneath Hiring Dashboard. Idempotent.
 *
 * Usage: node tools/add-footer-browse-links.js
 */
"use strict";

const fs = require("fs");
const path = require("path");

const ROOT = path.join(__dirname, "..");
const HIRING =
  '<li><a href="https://www.betterengineer.com/hiring-dashboard">Hiring Dashboard</a></li>';
const ADD =
  '<li><a href="https://discover.betterengineer.com/roles/">Browse Roles</a></li>' +
  '<li><a href="https://discover.betterengineer.com/technologies/">Browse by Technology</a></li>';

function inject(html) {
  let out = html;
  let changes = 0;
  let idx = 0;
  while ((idx = out.indexOf(HIRING, idx)) !== -1) {
    const after = out.slice(idx + HIRING.length, idx + HIRING.length + 200);
    if (after.includes("Browse Roles")) {
      idx += HIRING.length;
      continue;
    }
    out = out.slice(0, idx + HIRING.length) + ADD + out.slice(idx + HIRING.length);
    changes += 1;
    idx += HIRING.length + ADD.length;
  }
  return { out, changes };
}

function walkHtml(dir, out) {
  if (!fs.existsSync(dir)) return;
  for (const name of fs.readdirSync(dir)) {
    const p = path.join(dir, name);
    const st = fs.statSync(p);
    if (st.isDirectory()) walkHtml(p, out);
    else if (name.endsWith(".html")) out.push(p);
  }
}

function main() {
  const files = [path.join(ROOT, "footer-full.html")];
  walkHtml(path.join(ROOT, "roles"), files);
  walkHtml(path.join(ROOT, "technologies"), files);
  walkHtml(path.join(ROOT, "services"), files);
  for (const name of fs.readdirSync(ROOT)) {
    if (name.endsWith(".html") && !name.startsWith("main-")) {
      files.push(path.join(ROOT, name));
    }
  }

  const seen = new Set();
  let touched = 0;
  for (const file of files) {
    if (seen.has(file)) continue;
    seen.add(file);
    if (!fs.existsSync(file)) continue;
    const before = fs.readFileSync(file, "utf8");
    if (!before.includes("Hiring Dashboard")) continue;
    const { out, changes } = inject(before);
    if (changes > 0) {
      fs.writeFileSync(file, out);
      touched += 1;
      console.log(`updated (${changes}):`, path.relative(ROOT, file).replace(/\\/g, "/"));
    }
  }
  console.log("Done. files updated:", touched);
}

main();
