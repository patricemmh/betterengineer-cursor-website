/**
 * Add Browse Roles + Browse by Technology after Platform in every Services
 * dropdown (desktop + mobile). Idempotent.
 *
 * Usage: node tools/add-nav-browse-links.js
 */
"use strict";

const fs = require("fs");
const path = require("path");

const ROOT = path.join(__dirname, "..");
const PLATFORM =
  '<li><a href="https://www.betterengineer.com/hiring-dashboard">Platform</a></li>';
const ADD =
  '<li><a href="https://discover.betterengineer.com/roles/">Browse Roles</a></li>' +
  '<li><a href="https://discover.betterengineer.com/technologies/">Browse by Technology</a></li>';

function inject(html) {
  let out = html;
  let changes = 0;
  let idx = 0;
  while ((idx = out.indexOf(PLATFORM, idx)) !== -1) {
    const after = out.slice(idx + PLATFORM.length, idx + PLATFORM.length + 160);
    if (after.includes("Browse Roles")) {
      idx += PLATFORM.length;
      continue;
    }
    out = out.slice(0, idx + PLATFORM.length) + ADD + out.slice(idx + PLATFORM.length);
    changes += 1;
    idx += PLATFORM.length + ADD.length;
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
  const files = [];
  walkHtml(path.join(ROOT, "roles"), files);
  walkHtml(path.join(ROOT, "technologies"), files);
  walkHtml(path.join(ROOT, "services"), files);
  for (const name of fs.readdirSync(ROOT)) {
    if (name.endsWith(".html") && !name.startsWith("main-") && name !== "footer-full.html") {
      files.push(path.join(ROOT, name));
    }
  }

  let touched = 0;
  for (const file of files) {
    const before = fs.readFileSync(file, "utf8");
    if (!before.includes("hiring-dashboard")) continue;
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
