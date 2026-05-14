# Next steps: Google Tag Manager and GA4

The site already loads **Google Tag Manager** container **`GTM-WT77L8JF`** on every generated page (see `build-pages.js`, function `shell`). Nothing else is required in this repo for basic pageview tracking.

Everything below happens in **Google Tag Manager** and **Google Analytics**. This file is a checklist your team can follow.

## 1. Create or open GA4

1. Go to [Google Analytics](https://analytics.google.com/) (admin access on your Google account).
2. Create a **GA4 property** for BetterEngineer (or open the one you already use).
3. Under **Admin → Data streams**, add a **Web** stream for **`discover.betterengineer.com`** (or your real hostname).
4. Copy the **Measurement ID** (format **`G-XXXXXXXX`**).

## 2. Connect GA4 inside GTM

1. Open [Google Tag Manager](https://tagmanager.google.com/) and select container **`GTM-WT77L8JF`**.
2. **Tags → New** → choose **Google Analytics: GA4 Configuration** (or the current GA4 tag type Google shows).
3. Paste your **Measurement ID** (`G-...`).
4. **Triggering**: choose **All Pages** (or a trigger group you prefer for first launch).
5. **Save** the tag.

## 3. Test before publishing

1. Click **Preview** in GTM. Enter your live URL (for example `https://discover.betterengineer.com/aimanufacturing/`).
2. Confirm the **GA4** tag **fires** on page load in the Tag Assistant debug panel.
3. In GA4, open **Reports → Realtime** and confirm you see yourself (and the correct stream).

## 4. Publish the container

1. In GTM, **Submit** the workspace and **Publish** (add a version name such as “GA4 config live”).

Until you publish, production visitors only get what was in the **last published** version (often no GA4 yet).

## 5. Later (optional, still in GTM)

- **Events**: form submits, CTA clicks, file downloads: add triggers and GA4 event tags in GTM (no change to this repo unless you need `dataLayer.push` from custom JS).
- **Google Ads / Meta / LinkedIn**: add tags only in GTM when ready; do not hardcode those scripts in the site.
- **Consent / privacy**: if you need a CMP or consent mode, plan that in GTM or with legal; this repo does not add it by default.

## 6. HubSpot

**HubSpot** tracking on these pages is separate (existing script in `shell`). It does not replace GA4. Keep both if you use HubSpot for forms and CRM.

## What we cannot do from this repository

- Log in to your Google accounts or create tags for you.
- Publish your GTM container or verify GA4 property settings remotely.

If you change the GTM container ID, edit **`GTM-WT77L8JF`** in **`build-pages.js`** (head script and noscript iframe), then run **`npm run build`**.
