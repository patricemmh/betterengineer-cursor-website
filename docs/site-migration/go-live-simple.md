# www go-live: Patrick + Josh (2026-10-28)

Goal: move `www.betterengineer.com` and `betterengineer.com` off HubSpot onto the **existing** discover setup. No new bucket, no new distribution.

- Bucket `betterengineer-marketing-site`: discover stays at the root, www goes under `www/`.
- Distribution `E2014GBUWTTSVJ` (AWS account `791905878372`): serves all three hostnames.
- Upload: the marketing-site GitHub deploy (repo `SalsaMobi-dev/betterengineer-marketing-site`). Its `www/` folder is a copy of `dist-www/` (68 pages, 378 files, 81 MB) and the workflow syncs it to `s3://betterengineer-marketing-site/www/`. Discover syncs exclude `www/*`, so they never delete it.
- One CloudFront Function, `docs/site-migration/cloudfront-www-function.js`, routes by hostname: discover works exactly as today; `betterengineer.com` 301s to www; www gets the redirects, the `/page` and `/page/` handling, and serves from `www/`. Query strings (UTMs, gclid) are kept. Tested locally: `node docs/site-migration/test-cloudfront-function.js`.
- 404s: the distribution's existing error page (`/404.html`, the generic "Page not found | BetterEngineer" page) is shared by both sites. Leave the error responses alone.

## Patrick, first

1. HubSpot form `d43da6a3-79aa-45d4-99be-0d1e8162daf7`: turn off reCAPTCHA. Cloudflare Turnstile: add hostname `www.betterengineer.com`.
2. **Approve the push, deploy goes green.** In the local `betterengineer-marketing-site` folder: `git push origin main` (one commit: workflow change + `www/`). Then GitHub > `SalsaMobi-dev/betterengineer-marketing-site` > Actions > "Deploy site": wait for green. Spot check discover: `/roles/`, `/aimanufacturing/` still load.

   Until Josh attaches the new function (step 5), `discover.betterengineer.com/www/...` can show www pages. Nothing links there and every www page has a canonical pointing at `www.betterengineer.com`, so this is harmless; just keep the gap short.

## Josh, AWS console only (ACM in us-east-1)

3. **Certificate.** ACM, request a public cert for `discover.betterengineer.com`, `www.betterengineer.com`, `betterengineer.com`. DNS validation, click "Create records in Route 53", wait for Issued. (ACM can't add names to the current cert. Skip if it already covers all three.)
4. **Save the old function.** CloudFront > Functions: open the one on `E2014GBUWTTSVJ`'s default behavior, copy its code somewhere. It should only turn `/roles` and `/roles/` into `/roles/index.html`. If it does more, stop and send it to Patrick.
5. **New function.** Create `betterengineer-router`, runtime `cloudfront-js-2.0`, paste `cloudfront-www-function.js`. Test tab: host `www.betterengineer.com`, URI `/about`, expect `/www/about/index.html`; host `discover.betterengineer.com`, URI `/roles`, expect `/roles/index.html`. Publish.
6. **Distribution `E2014GBUWTTSVJ`.** General > Edit: add alternate domain names `www.betterengineer.com` and `betterengineer.com`, pick the new certificate, save. Behaviors > default > Edit > Function associations > Viewer request: CloudFront Functions, `betterengineer-router`, save. Wait for "Deployed".
7. **Cache:** the deploy already cleared `/*`, and the function runs before the cache, so no invalidation is needed. If something looks stale, Invalidations > Create > `/*`.
8. **Check discover right away** (it now runs the new function): `/`, `/roles`, `/roles/ai-engineers/`, `/technologies/python-developers/`, `/aimanufacturing/`, `/ai-fluent-engineers/` load; `/nope` shows the 404 page; `/www/about/` 301s to www. If anything is off, do step 14 (function part) now.

## Test www before DNS (Patrick or Josh)

9. CloudFront picks the site by hostname, so the `dxxxx.cloudfront.net` address shows discover. Point the real name at a CloudFront edge instead (IP from `nslookup discover.betterengineer.com`, for example `13.32.115.102`):

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

10. `www`: delete CNAME `8679235.group35.sites.hubspot.net` (TTL 120), create A + AAAA alias to `E2014GBUWTTSVJ`.
11. `betterengineer.com`: change A `199.60.103.36` (TTL 300) to A alias to the same distribution, add AAAA alias.

    Do not touch `discover`, `blog`, `app`, MX, or TXT records.

## Right after DNS (incognito)

12. - [ ] Open the live ad URL with its UTMs: 200, then a test lead shows the UTM fields in HubSpot.
    - [ ] Test leads from `/contact/?utm_source=test&utm_campaign=cutover_check` and `/multi-step-contact-form/?utm_source=test` land in HubSpot; workflows fire.
    - [ ] `http://betterengineer.com/about` ends at `https://www.betterengineer.com/about`.
13. - [ ] discover pages still load.

## Rollback

14. DNS: put back the two old values (steps 10 and 11), live in 2 to 5 minutes. Keep the domain connected in HubSpot for a few days. If discover misbehaves, re-attach the old function from step 4 on the default behavior. Alternate names, cert, and the `www/` files can stay.

## Later

15. Future www updates: rebuild `dist-www` here (`$env:INTERNAL_LINKS='local'; npm run build; Remove-Item Env:INTERNAL_LINKS; node build-www-dist.js`), mirror it into the marketing-site repo (`robocopy dist-www ..\betterengineer-marketing-site\www /MIR`), commit, push. Search Console: submit `https://www.betterengineer.com/sitemap.xml`. Consider making discover 301 to www on the same paths so everything lives on one hostname.
