# www go-live: Patrick + Josh (2026-10-28)

Goal: `www.betterengineer.com` moves from HubSpot to static files on S3 + CloudFront, the same setup discover already uses (AWS account `791905878372`, discover bucket `betterengineer-marketing-site`, distribution `E2014GBUWTTSVJ`). Upload folder: `dist-www/` (68 pages, `404.html`, `sitemap.xml`, `robots.txt`, about 81 MB). Redirect and trailing-slash code: `docs/site-migration/cloudfront-www-function.js`.

## 0. Patrick, before anything else (HubSpot + Cloudflare)

- HubSpot form `d43da6a3-79aa-45d4-99be-0d1e8162daf7` (multi-step hire form): **turn off reCAPTCHA**, or submits fail with `FORM_HAS_RECAPTCHA_ENABLED`.
- Cloudflare Turnstile widget for the contact form: **add allowed hostname `www.betterengineer.com`**.

## 1. Josh: AWS setup

1. S3 bucket `betterengineer-www`, private, same settings as the discover bucket.
2. ACM certificate in `us-east-1` for `www.betterengineer.com` and `betterengineer.com` (DNS validation in Route 53).
3. CloudFront distribution, copied from the discover one: origin is the new bucket with Origin Access Control; alternate names `www.betterengineer.com` and `betterengineer.com`; default root object `index.html`; redirect HTTP to HTTPS; compression on; custom error responses 403 and 404 both return `/404.html` with status 404.
4. CloudFront Function: paste `cloudfront-www-function.js`, runtime `cloudfront-js-2.0`, publish, attach to the default behavior as **Viewer request**. It serves `/page` and `/page/` from the same file, lowercases mixed-case page URLs, 301s the bare domain to `www`, 301s `/roles/*` and `/technologies/*` plus the old landings to discover, and keeps every query string (UTMs, gclid, fbclid, li_fat_id).

## 2. Josh: upload `dist-www`

```
aws s3 sync dist-www/ s3://betterengineer-www --delete --exclude "*.html" --cache-control "public,max-age=86400"
aws s3 sync dist-www/ s3://betterengineer-www --exclude "*" --include "*.html" --cache-control "public,max-age=300"
```

## 3. Test on the `dxxxx.cloudfront.net` address (before DNS)

- [ ] `/`, `/about`, `/about/`, `/contact/`, `/careers`, `/case-studies/hydrow` all load with styles and images
- [ ] **Ad URL**: `/hire-software-engineers-in-72-hours?utm_source=google&utm_medium=cpc&gclid=test` loads (200, not a redirect), and so does the trailing-slash version
- [ ] `/multi-step-contact-form` loads and steps through to the last step (do not submit yet)
- [ ] `/roles/ai-engineers` and `/webinar` redirect; `/nope` shows the 404 page
- [ ] `/robots.txt` says `Allow: /`; `/sitemap.xml` lists www URLs

## 4. Josh: DNS (Route 53, `betterengineer.com` zone)

| Record | Today | Change to |
| --- | --- | --- |
| `www` | CNAME `8679235.group35.sites.hubspot.net` (TTL 120) | A + AAAA alias to the new distribution |
| `betterengineer.com` | A `199.60.103.36` (HubSpot) | A + AAAA alias to the same distribution |

Do not touch `discover`, `blog`, `app`, MX, or TXT/DKIM records.

## 5. Right after DNS (incognito)

- [ ] **Ad landing check**: open the exact live ad URL with its UTMs. Confirm a 200 page (no redirect), then submit a test lead and confirm the contact in HubSpot has the UTM fields.
- [ ] Test lead from `/contact/?utm_source=test&utm_medium=email&utm_campaign=cutover_check`; confirm it lands in HubSpot.
- [ ] Test lead from `/multi-step-contact-form/?utm_source=test`; confirm it lands in HubSpot and its workflows fire.
- [ ] `http://betterengineer.com/about` ends at `https://www.betterengineer.com/about`.

## 6. Rollback (about 2 minutes, TTL 120)

Put the two old DNS values back (table above). Keep the domain connected in HubSpot for a few days so rollback stays possible.

## 7. Post-launch

- Search Console: submit `https://www.betterengineer.com/sitemap.xml`; watch coverage for two weeks.
- Next week: `deploy-www` GitHub workflow (same OIDC role, Josh adds the new bucket and distribution to its policy); align internal links (`/about/`) with canonicals (`/about`).
- Rebuild the upload folder (PowerShell, `PRE_CUTOVER_ROBOTS = null` in `data/pages.js`): `$env:INTERNAL_LINKS='local'; npm run build; Remove-Item Env:INTERNAL_LINKS; node build-www-dist.js`
