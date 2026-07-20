/**
 * Inject BetterEngineer HubSpot tracking (portal 8679235) into role/tech HTML
 * that already have GTM but are missing the HubSpot loader.
 *
 * Matches the snippet already used in build-pages.js shell().
 * Idempotent.
 *
 * Usage: node tools/inject-hubspot-tracking.js
 */
"use strict";

const fs = require("fs");
const path = require("path");

const ROOT = path.join(__dirname, "..");
const HS_SNIPPET =
  '<script>window._hsq = window._hsq || [];</script>' +
  '<script id="hs-script-loader" async defer src="https://js.hs-scripts.com/8679235.js"></script>';
const HS_MARKER = "js.hs-scripts.com/8679235";
const GTM_END = "<!-- End Google Tag Manager -->";
const GTM_PLACEHOLDER =
  "<!-- Google Tag Manager would go here (GTM-WT77L8JF), same as your current setup -->";

function walkHtml(dir, out) {
  if (!fs.existsSync(dir)) return;
  for (const name of fs.readdirSync(dir)) {
    const p = path.join(dir, name);
    const st = fs.statSync(p);
    if (st.isDirectory()) walkHtml(p, out);
    else if (name.endsWith(".html")) out.push(p);
  }
}

function inject(html) {
  if (html.includes(HS_MARKER)) return { html, changed: false };

  if (html.includes(GTM_END)) {
    return {
      html: html.replace(GTM_END, GTM_END + HS_SNIPPET),
      changed: true,
    };
  }

  if (html.includes(GTM_PLACEHOLDER)) {
    return {
      html: html.replace(GTM_PLACEHOLDER, GTM_PLACEHOLDER + HS_SNIPPET),
      changed: true,
    };
  }

  return { html, changed: false, skipped: true };
}

function main() {
  const files = [];
  walkHtml(path.join(ROOT, "roles"), files);
  walkHtml(path.join(ROOT, "technologies"), files);

  let changed = 0;
  let skipped = 0;
  for (const file of files) {
    const before = fs.readFileSync(file, "utf8");
    const result = inject(before);
    if (result.skipped) {
      skipped += 1;
      console.warn("skip (no GTM marker):", path.relative(ROOT, file));
      continue;
    }
    if (result.changed) {
      fs.writeFileSync(file, result.html);
      changed += 1;
      console.log("injected:", path.relative(ROOT, file).replace(/\\/g, "/"));
    }
  }
  console.log(`Done. changed=${changed}, already-had-or-unchanged=${files.length - changed - skipped}, skipped=${skipped}`);
}

main();
