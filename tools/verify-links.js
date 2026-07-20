#!/usr/bin/env node
/**
 * tools/verify-links.js
 *
 * Link and asset verification for the technology + role pages.
 *
 * --assets (default, offline, CI-safe):
 *   Scans every generated technologies/{slug}/index.html and roles/{slug}/index.html
 *   for root-relative asset references (src="/..." and href="/...") pointing at
 *   /images/, /icons/, /styles/, or bare scripts like /air-page.js, and confirms
 *   each file exists on disk. Fails on any missing local asset.
 *
 * --external (network, run manually per phase):
 *   Additionally checks every technology's stats[].url and the external icon CDN
 *   hosts (cdn.simpleicons.org, api.iconify.design) with an HTTP HEAD request.
 *   Fails on 4xx/5xx for stat URLs specifically (those are content claims); logs
 *   a WARN for icon CDN failures (cosmetic, not a content-accuracy issue).
 *
 * Run: node tools/verify-links.js [--assets|--external]
 * Default (no flag) runs --assets only, matching the CI-safe behavior wired
 * into `npm run verify`.
 */
"use strict";
const fs = require("fs");
const path = require("path");
const https = require("https");
const http = require("http");

const ROOT = path.join(__dirname, "..");
const args = process.argv.slice(2);
const runExternal = args.includes("--external");

let fails = 0, warns = 0;
const fail = (m) => { console.error(`FAIL  ${m}`); fails++; };
const warn = (m) => { console.warn(`WARN  ${m}`); warns++; };
const ok = (m) => console.log(`ok    ${m}`);

function walkHtml(dir, out) {
  if (!fs.existsSync(dir)) return;
  for (const name of fs.readdirSync(dir)) {
    const p = path.join(dir, name);
    if (fs.statSync(p).isDirectory()) walkHtml(p, out);
    else if (name === "index.html") out.push(p);
  }
}

const pages = [];
walkHtml(path.join(ROOT, "technologies"), pages);
walkHtml(path.join(ROOT, "roles"), pages);

// ---- --assets: local asset existence ---------------------------------------
const LOCAL_ASSET_RE = /(?:src|href)="(\/(?:images|icons|styles)\/[^"?#]+|\/[a-z0-9_-]+\.js)"/gi;
let assetChecks = 0;

for (const file of pages) {
  const html = fs.readFileSync(file, "utf8");
  const rel = path.relative(ROOT, file);
  const seen = new Set();
  let m;
  while ((m = LOCAL_ASSET_RE.exec(html)) !== null) {
    const assetPath = m[1];
    if (seen.has(assetPath)) continue;
    seen.add(assetPath);
    assetChecks++;
    const onDisk = path.join(ROOT, assetPath);
    if (!fs.existsSync(onDisk)) fail(`${rel}: local asset ${assetPath} does not exist on disk`);
  }
}
ok(`--assets: checked ${assetChecks} unique local asset references across ${pages.length} pages`);

// ---- --external: network checks (opt-in) -----------------------------------
function headCheck(url) {
  return new Promise((resolve) => {
    try {
      const lib = url.startsWith("https:") ? https : http;
      const req = lib.request(url, { method: "HEAD", timeout: 8000 }, (res) => {
        resolve(res.statusCode);
        res.resume();
      });
      req.on("timeout", () => { req.destroy(); resolve(null); });
      req.on("error", () => resolve(null));
      req.end();
    } catch (e) {
      resolve(null);
    }
  });
}

async function runExternalChecks() {
  const { technologies } = require(path.join(ROOT, "data", "technologies.js"));
  const statUrls = new Set();
  for (const t of technologies.filter((x) => x.status === "published")) {
    for (const s of t.stats || []) statUrls.add(s.url);
  }
  for (const url of statUrls) {
    const status = await headCheck(url);
    if (status == null) warn(`stat source unreachable (network or timeout): ${url}`);
    else if (status >= 400) fail(`stat source returned ${status}: ${url}`);
    else ok(`stat source ${status}: ${url}`);
  }

  const iconHosts = new Set();
  for (const file of pages) {
    const html = fs.readFileSync(file, "utf8");
    const re = /https:\/\/(cdn\.simpleicons\.org|api\.iconify\.design)\/[^"'\s)]+/g;
    let m;
    while ((m = re.exec(html)) !== null) iconHosts.add(m[0]);
  }
  let iconFails = 0;
  for (const url of iconHosts) {
    const status = await headCheck(url);
    if (status == null || status >= 400) { warn(`icon CDN reference may be broken (${status}): ${url}`); iconFails++; }
  }
  ok(`--external: checked ${statUrls.size} stat source(s) and ${iconHosts.size} icon CDN reference(s) (${iconFails} icon warnings)`);
}

async function main() {
  if (runExternal) await runExternalChecks();
  console.log(`\n${fails ? "FAILED" : "PASSED"} link/asset validation: ${fails} fail, ${warns} warn`);
  process.exit(fails ? 1 : 0);
}

main();
