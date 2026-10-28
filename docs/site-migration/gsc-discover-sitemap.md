# Google Search Console: discover.betterengineer.com sitemap

One-time setup (~2 minutes). Requires Patrick’s Google account (Search Console).

**Sitemap URL (already live):** `https://discover.betterengineer.com/sitemap.xml`

**robots.txt** already points crawlers at that sitemap. Generated on each discover build by `build-discover-dist.js` (`writeDiscoverSeoFiles()` → `./dist/sitemap.xml` and `./dist/robots.txt`).

Verified 2026-10-28: HTTP 200, valid XML, 72 URLs (includes `/roles/` hub + role pages, `/technologies/` hub + tech pages; templates excluded).

---

## Steps in Search Console

1. Open [Google Search Console](https://search.google.com/search-console).
2. **Add property** (if not already listed):
   - Choose **URL prefix**.
   - Enter `https://discover.betterengineer.com`
   - Verify ownership (DNS TXT on the domain, or HTML file upload, whichever you already use for BetterEngineer).
3. In the left sidebar: **Sitemaps**.
4. Under **Add a new sitemap**, enter: `sitemap.xml` (or the full URL above).
5. Click **Submit**.

---

## After submit

- Status may show “Success” or “Couldn’t fetch” for a few hours; refresh later.
- **URL Inspection** on any discover URL (e.g. `/roles/front-end-engineers/`) to request indexing if needed.
- No code change required unless the sitemap returns 404 or robots.txt drops the `Sitemap:` line (re-run `node build-discover-dist.js` and publish the discover bundle).

---

## Rebuild (only if sitemap is missing on production)

```bash
node build-discover-dist.js
```

Then deploy the discover `dist/` output per `GITHUB_PAGES_DISCOVER_HOSTING.md` / marketing-site CI.
