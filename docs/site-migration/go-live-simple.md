# www go-live: Patrick + Josh (2026-10-28)

Goal: move `www.betterengineer.com` and `betterengineer.com` off HubSpot onto the **existing** discover setup. No new bucket, no new distribution.

- Bucket `betterengineer-marketing-site`: discover stays at the root, www goes under `www/`.
- Distribution `E2014GBUWTTSVJ` (AWS account `791905878372`): serves all three hostnames.
- One CloudFront Function, `docs/site-migration/cloudfront-www-function.js`, routes by hostname: discover works exactly as today; `betterengineer.com` 301s to www; www gets the redirects, the `/page` and `/page/` handling, and serves from `www/`. Query strings (UTMs, gclid) are kept. Tested locally: `node docs/site-migration/test-cloudfront-function.js`.
- 404s: the distribution's existing error page (`/404.html`, the generic "Page not found | BetterEngineer" page) is shared by both sites. Leave the error responses alone.
- Upload folder: `dist-www/` (68 pages, sitemap, robots, about 81 MB).

## Patrick, before Josh starts

1. HubSpot form `d43da6a3-79aa-45d4-99be-0d1e8162daf7`: turn off reCAPTCHA. Cloudflare Turnstile: add hostname `www.betterengineer.com`.
2. **Protect www from the discover deploy.** In `SalsaMobi-dev/betterengineer-marketing-site`, add `--exclude "www/*"` to the first `aws s3 sync` (the one with `--delete`) in `.github/workflows/deploy.yml` and merge to `main`. Without it, the next discover deploy deletes all www files. Exact diff: `deploy-workflow-changes.md`. Wait for the "Deploy site" run to go green.
3. Zip `dist-www/` and send it to Josh.

## Josh, AWS (us-east-1 for ACM)

4. **Certificate.** ACM, request a public cert for `discover.betterengineer.com`, `www.betterengineer.com`, `betterengineer.com`. DNS validation, click "Create records in Route 53", wait for Issued. (ACM can't add names to the current cert. Skip if it already covers all three.)
5. **Save the old function.** CloudFront > Functions: open the one on `E2014GBUWTTSVJ`'s default behavior, copy its code somewhere. It should only turn `/roles` and `/roles/` into `/roles/index.html`. If it does more, stop and send it to Patrick.
6. **New function.** Create `betterengineer-router`, runtime `cloudfront-js-2.0`, paste `cloudfront-www-function.js`. Test tab: host `www.betterengineer.com`, URI `/about`, expect `/www/about/index.html`; host `discover.betterengineer.com`, URI `/roles`, expect `/roles/index.html`. Publish.
7. **Upload www** (CloudShell: upload the zip, `unzip`, then run from the folder that contains `dist-www/`). Run once with `--dryrun` and confirm every line says `s3://betterengineer-marketing-site/www/`. No `--delete` today.

   ```
   aws s3 sync dist-www/ s3://betterengineer-marketing-site/www/ --exclude "*.html" --exclude "*.md" --cache-control "public,max-age=86400"
   aws s3 sync dist-www/ s3://betterengineer-marketing-site/www/ --exclude "*" --include "*.html" --cache-control "public,max-age=300"
   ```

8. **Distribution `E2014GBUWTTSVJ`.** General > Edit: add alternate domain names `www.betterengineer.com` and `betterengineer.com`, pick the new certificate, save. Behaviors > default > Edit > Function associations > Viewer request: CloudFront Functions, `betterengineer-router`, save. Wait for "Deployed".
9. **Clear cache:** `aws cloudfront create-invalidation --distribution-id E2014GBUWTTSVJ --paths "/*"`
10. **Check discover right away** (it now runs the new function): `/`, `/roles`, `/roles/ai-engineers/`, `/technologies/python-developers/`, `/aimanufacturing/`, `/ai-fluent-engineers/` load; `/nope` shows the 404 page. If anything is off, do step 15 (function part) now.

## Test www before DNS

11. CloudFront picks the site by hostname, so the `dxxxx.cloudfront.net` address shows discover. Point the real name at a CloudFront edge instead (IP from `nslookup discover.betterengineer.com`, for example `13.32.115.102`):

    ```
    curl -sI --resolve www.betterengineer.com:443:13.32.115.102 "https://www.betterengineer.com/about"
    curl -sI --resolve www.betterengineer.com:443:13.32.115.102 "https://www.betterengineer.com/hire-software-engineers-in-72-hours?utm_source=google&gclid=test"
    curl -sI --resolve betterengineer.com:443:13.32.115.102 "https://betterengineer.com/about?utm_source=x"
    ```

    For a browser check, add `13.32.115.102 www.betterengineer.com` to the hosts file, test, then remove it.

    - [ ] `/`, `/about`, `/about/`, `/contact/`, `/careers`, `/case-studies/hydrow` load with styles and images
    - [ ] 72-hour ad URL is a 200 (no redirect), with and without the trailing slash
    - [ ] `/multi-step-contact-form` steps through (do not submit)
    - [ ] `/roles/ai-engineers` and `/webinar` redirect with the query kept; `/nope` is a 404 page
    - [ ] Apex 301s to `https://www.betterengineer.com/about?utm_source=x`
    - [ ] `/robots.txt` says `Allow: /`; `/sitemap.xml` lists www URLs

## Josh, DNS (Route 53, `betterengineer.com` zone)

12. `www`: delete CNAME `8679235.group35.sites.hubspot.net` (TTL 120), create A + AAAA alias to `E2014GBUWTTSVJ`.
13. `betterengineer.com`: change A `199.60.103.36` (TTL 300) to A alias to the same distribution, add AAAA alias.

    Do not touch `discover`, `blog`, `app`, MX, or TXT records.

## Right after DNS (incognito)

14. - [ ] Open the live ad URL with its UTMs: 200, then a test lead shows the UTM fields in HubSpot.
    - [ ] Test leads from `/contact/?utm_source=test&utm_campaign=cutover_check` and `/multi-step-contact-form/?utm_source=test` land in HubSpot; workflows fire.
    - [ ] `http://betterengineer.com/about` ends at `https://www.betterengineer.com/about`.
    - [ ] discover pages still load.

## Rollback

15. DNS: put back the two old values (step 12 and 13), live in 2 to 5 minutes. Keep the domain connected in HubSpot for a few days. If discover misbehaves, re-attach the old function from step 5 on the default behavior. Alternate names, cert, and the `www/` files can stay.

## Later

16. Search Console: submit `https://www.betterengineer.com/sitemap.xml`. Add a www deploy workflow (draft in `deploy-workflow-changes.md`). Consider making discover 301 to www on the same paths so everything lives on one hostname. Rebuild the upload folder: `$env:INTERNAL_LINKS='local'; npm run build; Remove-Item Env:INTERNAL_LINKS; node build-www-dist.js`
