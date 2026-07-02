# Google Tag Manager & GA4 (landing pages repo)

## What is implemented in code (already done)

Ryan confirmed the approach: **one GTM container**, **GA4 only through GTM** (nothing hardcoded).

| Item | Detail |
|------|--------|
| **Container** | `GTM-WT77L8JF` |
| **Where** | `build-pages.js`, function **`shell()`**: official GTM script in `<head>`, noscript iframe immediately after `<body>`. Every generated HTML page inherits this. |
| **GA4 in HTML** | **Not added.** No `G-…`/`gtag` snippet in site code (by design). |
| **HubSpot** | Existing HubSpot loaders in **`shell()`** stay separate from GTM or GA4. |

**Cross-domain:** Ryan added **`discover.betterengineer.com`** to the **existing GA4 web data stream** for cross-domain measurement. Domain autodetection in GTM/containers stays on their side. No extra GA4 installs are required on the static LP repo.

Changing the container ID later: edit both places **`GTM-WT77L8JF`** appears in **`build-pages.js`** (head snippet + noscript iframe), run **`npm run build`**.

---

## What Ryan / GTM owner does (not in GitHub)

1. **Publish** any pending GTM workspace changes so **`discover.betterengineer.com`** picks up GA4 Configuration (and Ads links if configured there).
2. **Preview:** Tag Assistant → open `https://discover.betterengineer.com/aimanufacturing/` (and other LP URLs).
3. **Validate** GA4 hits (Realtime, correct hostname / stream as they set cross-domain).

---

## Later (still only in GTM unless you decide otherwise)

- Custom events (`dataLayer.push` from `landing-page.js` / `home.js`) only if you want events the HTML cannot infer; coordinate with whoever owns tags.
- Add Google Ads conversions, Meta pixels, LinkedIn Insight, consent mode **in GTM** when ready; avoid hardcoding in this repo.

---

## What agents cannot do from this repo

- Log in to Tag Manager / Analytics / Ads or publish containers for you.
