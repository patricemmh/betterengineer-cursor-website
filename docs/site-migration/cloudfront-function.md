# Live CloudFront function

**Only file to edit:** [cloudfront-www-function.js](cloudfront-www-function.js).

That file is the source of truth for the function Patrice and Josh are attaching. CloudFront does not read this git repo. After any edit to the JS file, paste the whole file into the CloudFront function in the AWS console and Publish. Then test discover and www.

**Not pasted yet (2026-11-02).** The repo copy now serves `/roles/` and `/technologies/` from www, and 301s `discover.betterengineer.com` to the same path on www. Josh has not pasted this version into `betterengineer-router`, and it has not been published. Until that paste, the live function is still the previous one: www 301s `/roles` and `/technologies` to discover, and discover still serves those files. Do not deploy a discover bundle from this tree before the paste. Role and technology HTML in the repo now canonicals to www, so a discover deploy done first would point canonicals at URLs the live function sends back to discover.

Noted 2026-10-28, about 4:46 PM CT. As of about 4:38 PM CT the new function was not attached yet (`discover.betterengineer.com/www/about/` still returned 200), and `www.betterengineer.com` and `betterengineer.com` were not alternate domain names on the distribution yet. If live responses do not match this file, the console copy is behind the repo.

## Where it is attached

- Distribution: `E2014GBUWTTSVJ`
- Bucket: `betterengineer-marketing-site`
- Function name: `betterengineer-router`
- Runtime: `cloudfront-js-2.0`
- Association: viewer request on the **default** behavior (the same behavior that already has the old discover function)

Do not add a second behavior. Do not edit the old function in place. Leave it published so it can be re-attached for rollback.

The certificate already on the distribution covers `betterengineer.com`, `www.betterengineer.com`, `discover.betterengineer.com`, and `blog.betterengineer.com`.

## Bucket layout

- Discover files are at the bucket root.
- www files are under the prefix `www/`.
- The `betterengineer-marketing-site` GitHub Actions workflow deploys that prefix. As of this note, that deploy is commit `8f4a2d9`.

## What it does

- **Apex** (`betterengineer.com`): 301 to `https://www.betterengineer.com` on the same path. The query string is kept.
- **Discover** (any host that is not www and not the apex): keep the `/www` and `/www/*` guard first, so `discover.betterengineer.com/www/about/` lands on `https://www.betterengineer.com/about/` and not on `/www/about/`. Then 301 the rest of the host to the same path on www. Extensionless paths are lowercased. The query string is kept. Exceptions: `/aimanufacturing` and `/AIManufacturing` go to `https://www.betterengineer.com/services/ai-systems-readiness-for-manufacturing/`. `/AI-Fluent-Engineers` and `/Ai-Fluent-Engineers` go to `/ai-fluent-engineers/`. The four legacy hire slugs and `/services/hire-ai-ready-engineers` 301 once, straight to their www targets.
- **www** (`www.betterengineer.com`): serve from the `/www` prefix, including `/roles` and `/technologies`, using the same extensionless `index.html` rules as other www pages. Do not 301 those paths to discover. Apply the fixed 301s in the JS file. `/services/hire-ai-ready-engineers` 301s to `/ai-fluent-engineers/`. Mixed-case page paths still 301 to lowercase. `/hire-software-engineers-in-72-hours` stays a rewrite (200), with and without the slash. `/webinar`, `/aiwebinar`, `/roi`, `/blog`, `/hiring-dashboard-old`, and `/careers-test` stay as they are. Query strings are kept on every redirect. The shared 404 is unchanged.

The old function only rewrites extensionless paths to `/path/index.html` for discover. It does not route www or the apex.

## How to change it

1. Edit `docs/site-migration/cloudfront-www-function.js`. Do not keep a second copy of the function.
2. Optional local check: `node docs/site-migration/test-cloudfront-function.js`.
3. CloudFront console: open `betterengineer-router`, paste the file, Publish. Wait until the distribution is Deployed. Do not do this until Patrice asks. The 2026-11-02 behavior is in the repo only.
4. Test both hosts after the paste:
   - Discover: `/` and `/roles/ai-engineers/` 301 to the same path on www; `/www/about/` 301s to `https://www.betterengineer.com/about/`; `/aimanufacturing/` 301s to the manufacturing services page.
   - www: `/about` is rewritten to `/www/about/index.html`; `/roles/ai-engineers/` is rewritten to `/www/roles/ai-engineers/index.html`; apex `/about?utm_source=x` returns 301 to `https://www.betterengineer.com/about?utm_source=x`.

Cutover steps and the longer checklist are in [go-live-simple.md](go-live-simple.md).

## Rollback

On the default behavior, set viewer request back to the old discover function. Do not overwrite that old function. Alternate domain names, the certificate, and the `www/` objects can stay. DNS rollback is step 14 in [go-live-simple.md](go-live-simple.md).
