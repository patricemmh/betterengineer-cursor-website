# Live CloudFront function

**Only file to edit:** [cloudfront-www-function.js](cloudfront-www-function.js).

That file is the source of truth for the function Patrice and Josh are attaching. CloudFront does not read this git repo. After any edit to the JS file, paste the whole file into the CloudFront function in the AWS console and Publish. Then test discover and www.

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
- **Discover** (any host that is not www and not the apex): same as the old function, plus a www guard. Extensionless paths rewrite to `/path/index.html`. `/www` and `/www/*` 301 to the same path on `www.betterengineer.com`.
- **www** (`www.betterengineer.com`): serve from the `/www` prefix, apply the fixed 301s in the JS file, send `/roles` and `/technologies` (including nested paths) to discover, and 301 mixed-case page paths to lowercase. Query strings are kept on every redirect.

The old function only rewrites extensionless paths to `/path/index.html` for discover. It does not route www or the apex.

## How to change it

1. Edit `docs/site-migration/cloudfront-www-function.js`. Do not keep a second copy of the function.
2. Optional local check: `node docs/site-migration/test-cloudfront-function.js`.
3. CloudFront console: open `betterengineer-router`, paste the file, Publish. Wait until the distribution is Deployed.
4. Test both hosts:
   - Discover: `/`, `/roles`, `/roles/ai-engineers/` load; `/www/about/` returns 301 to www.
   - www: `/about` is rewritten to `/www/about/index.html`; apex `/about?utm_source=x` returns 301 to `https://www.betterengineer.com/about?utm_source=x`.

Cutover steps and the longer checklist are in [go-live-simple.md](go-live-simple.md).

## Rollback

On the default behavior, set viewer request back to the old discover function. Do not overwrite that old function. Alternate domain names, the certificate, and the `www/` objects can stay. DNS rollback is step 14 in [go-live-simple.md](go-live-simple.md).
