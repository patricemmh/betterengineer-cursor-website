# Intake form proxy (Cloudflare Worker + Turnstile)

This Worker sits in front of the HubSpot Forms API and rejects bot submissions
before they reach HubSpot. The static site on GitHub Pages renders a Turnstile
widget and POSTs to this Worker instead of POSTing directly to HubSpot. The
Worker verifies the Turnstile token, re-runs the Tier 1 anti-spam checks
server-side, and forwards a clean payload to HubSpot.

You do **not** need to move hosting off GitHub Pages. The Worker is a separate
service that lives at a `*.workers.dev` URL (or a custom domain if you prefer).

---

## What you need

- A free Cloudflare account. No domain transfer or hosting change is required.
- Node.js 18+ installed locally (you already have it).

---

## One-time setup

### 1. Get a Turnstile site key + secret

1. Sign in to Cloudflare → **Turnstile** → **Add Site**.
2. Site name: `betterengineer-intake` (any name).
3. Domains: add the hostnames where the form is served:
   - `discover.betterengineer.com`
   - `www.betterengineer.com`
   - `betterengineer.com`
   - `patricemmh.github.io`
   - (optional) `localhost` for local testing
4. Widget mode: **Managed** (recommended).
5. Click **Create**. Cloudflare gives you:
   - **Site key** (public, goes in the browser).
   - **Secret key** (private, goes in the Worker).

### 2. Install dependencies and deploy the Worker

From this `worker/` directory:

```bash
npm install
npx wrangler login         # opens browser, sign in to Cloudflare
npx wrangler secret put TURNSTILE_SECRET
# paste the Turnstile SECRET key when prompted, then press Enter
npx wrangler deploy
```

The first deploy will print the public URL of the Worker, for example:

```
Deployed intake-proxy triggers
  https://intake-proxy.<your-cloudflare-subdomain>.workers.dev
```

Copy that URL. You will paste it into `react-page.js` in step 3.

### 3. Wire the browser form to the Worker

Open `react-page.js` at the repo root and find this block near the top of
`wireReactIntakeForm()`:

```js
/* === Cloudflare Turnstile + Worker proxy === */
var TURNSTILE_SITEKEY = 'PASTE_TURNSTILE_SITE_KEY_HERE';
var WORKER_URL = 'PASTE_WORKER_URL_HERE';
```

Replace the two placeholder strings with:

- `TURNSTILE_SITEKEY` → the **site key** from step 1.
- `WORKER_URL` → the Worker URL printed in step 2 (no trailing slash).

Save. The next page load on `discover.betterengineer.com` will start routing
submissions through the Worker. Until both values are filled in, the form will
keep using the existing direct-to-HubSpot path so nothing breaks during setup.

### 4. Verify

Open the live form in a browser. Submit a real test entry. You should see:

- HubSpot receives the submission as expected.
- The Worker logs a request when you run `npx wrangler tail` in this folder.
- A request to the Worker without a Turnstile token (curl or Postman) is
  rejected with `403`.
- A request to the Worker from an origin that is not allowlisted is rejected
  with `403`.

---

## Local development

To run the Worker locally on `http://localhost:8787`:

```bash
npx wrangler dev
```

For local testing without setting the secret in Cloudflare, create
`worker/.dev.vars` (gitignored):

```
TURNSTILE_SECRET=your_turnstile_secret_here
```

Then point `WORKER_URL` in `react-page.js` at `http://localhost:8787` while
testing locally.

---

## Updating the allowlist

If you add a new hostname for the site, edit the `ALLOWED_ORIGINS` array at the
top of `intake-proxy.js` and re-deploy with `npx wrangler deploy`.

## Custom domain (optional)

If you want the Worker reachable at, say, `https://intake.betterengineer.com`
instead of the default `*.workers.dev`, see the Cloudflare docs for
"[Routes for Workers](https://developers.cloudflare.com/workers/configuration/routing/)".
The TOML stub is at the bottom of `wrangler.toml`.

## Removing the proxy

Delete the two filled-in values in `react-page.js`, leaving the placeholders,
and the form falls back to the original direct-to-HubSpot submission path.
