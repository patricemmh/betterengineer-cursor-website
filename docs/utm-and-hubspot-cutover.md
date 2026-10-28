# UTM + HubSpot tracking (www cutover)

## What the site does automatically

- **`attribution.js`** — reads UTMs from the URL, saves them for the browser session, stores a shared cookie on `.betterengineer.com`, fills hidden form fields, and appends UTMs to links to `www.betterengineer.com` (including from discover).
- **`intake-form-shared.js` / `hire-flow.js` / `hs-lead-form.js`** — send UTMs plus `hubspotutk`, `pageUri`, and `pageName` to HubSpot on submit.
- **HubSpot tracking** — pages built with `build-pages.js` register portal **8679235** via `be-hs-config`; `cookie-consent.js` loads the script only after analytics consent.
- **Google Tag Manager** — container **GTM-WT77L8JF**, same gating via `be-gtm-config`.
Discover (`betterengineer-marketing-site`) loads the same HubSpot script and now includes `attribution.js` on role/technology pages.

## Your checklist (HubSpot + QA)

1. **Confirm contact properties exist** (HubSpot → Settings → Properties → Contact):
   - `utm_source`, `utm_medium`, `utm_campaign`, `utm_content`
   - If any are missing, create them as single-line text.

2. **Test a form after deploy** (incognito):
   - Open: `https://www.betterengineer.com/contact?utm_source=test&utm_medium=email&utm_campaign=cutover_check`
   - Submit the form with a test email.
   - Open the contact in HubSpot and confirm all four UTM fields are set.

3. **Multi-step hire form** — repeat on `/multi-step-contact-form/` with the same query string; form GUID **d43da6a3-79aa-45d4-99be-0d1e8162daf7**. Confirm workflows tied to that form still run (API submissions do not always inherit old embed workflows). If submit fails with `FORM_HAS_RECAPTCHA_ENABLED`, disable reCAPTCHA/spam protection on that form in HubSpot (API submit cannot pass embed reCAPTCHA). On `localhost`, `hire-flow.js` surfaces the HubSpot error in the status line.

4. **Discover → www** — open a discover technology page with UTMs, click **Contact Us** / multi-step link, confirm the `www` URL still has UTMs (or submit and check HubSpot).

5. **GTM** — no change required if container **GTM-WT77L8JF** is unchanged; after cutover, spot-check GA4 real-time for page views on a rebuilt page.

6. **Live HubSpot pages** — until DNS points to AWS, production still serves HubSpot-hosted HTML. After cutover, tracking comes from the scripts above on static pages (loaded after cookie consent on rebuilt pages).
## Unpublished legacy URLs

`/webinar`, `/aiwebinar`, and `/roi` are removed from the local build list. Plan **301 redirects** in HubSpot (or CloudFront) to `/contact` or `/staff-augmentation` so old links do not 404.
