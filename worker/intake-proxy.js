/*
 * BetterEngineer intake-proxy
 *
 * Cloudflare Worker that sits between the static intake form (hosted on
 * GitHub Pages) and the HubSpot Forms API.
 *
 * Responsibilities:
 *   1. Verify a Cloudflare Turnstile token issued by the browser widget.
 *   2. Re-run the Tier 1 anti-spam checks server-side so direct API attacks
 *      cannot bypass them.
 *   3. Forward a clean payload to the HubSpot Forms API and return a small
 *      JSON response the client knows how to render.
 *
 * Secrets (set via `wrangler secret put`):
 *   - TURNSTILE_SECRET    Turnstile widget secret key
 *
 * See worker/README.md for end-to-end deploy steps.
 */

const ALLOWED_ORIGINS = [
  'https://discover.betterengineer.com',
  'https://www.betterengineer.com',
  'https://betterengineer.com',
  'https://patricemmh.github.io',
  'http://localhost:5180',
  'http://localhost:8080',
  'http://127.0.0.1:5500',
  'http://localhost:5500',
];

const HUBSPOT_PORTAL_ID = '8679235';
const HUBSPOT_FORM_ID = '4431ddc0-7bea-46ba-939c-98c422756479';
const HUBSPOT_ENDPOINT =
  'https://api.hsforms.com/submissions/v3/integration/submit/' +
  HUBSPOT_PORTAL_ID +
  '/' +
  HUBSPOT_FORM_ID;

const TURNSTILE_VERIFY_URL =
  'https://challenges.cloudflare.com/turnstile/v0/siteverify';

const MIN_MESSAGE_LEN = 20;
const EMAIL_RE = /^[A-Z0-9._%+\-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
const MESSAGE_URL_RE =
  /(?:https?:\/\/|\bwww\.[a-z]|\bt\.me\/|\bbit\.ly\/|\btinyurl\.|\bgoo\.gl\/|\bdiscord\.gg\/)/i;
const DISPOSABLE_DOMAINS = new Set([
  'mailinator.com', 'mailinator.net', '10minutemail.com', '10minutemail.net',
  'guerrillamail.com', 'guerrillamail.net', 'sharklasers.com',
  'tempmail.com', 'temp-mail.org', 'tempr.email', 'dropmail.me',
  'yopmail.com', 'throwawaymail.com', 'maildrop.cc', 'getairmail.com',
  'spamgourmet.com', 'dispostable.com', 'fakeinbox.com', 'mailnesia.com',
  'mintemail.com', 'trbvm.com', 'mohmal.com', 'getnada.com',
  'tempinbox.com', 'emailondeck.com', 'mvrht.net',
]);

function corsHeaders(origin) {
  return {
    'Access-Control-Allow-Origin': origin,
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Max-Age': '86400',
    'Vary': 'Origin',
  };
}

function jsonResponse(body, status, origin) {
  return new Response(JSON.stringify(body), {
    status: status,
    headers: Object.assign(
      { 'Content-Type': 'application/json' },
      corsHeaders(origin),
    ),
  });
}

function pickAllowedOrigin(requestOrigin) {
  if (ALLOWED_ORIGINS.indexOf(requestOrigin) !== -1) return requestOrigin;
  return ALLOWED_ORIGINS[0];
}

async function verifyTurnstile(token, secret, ip) {
  const params = new URLSearchParams();
  params.append('secret', secret);
  params.append('response', token);
  if (ip) params.append('remoteip', ip);
  const res = await fetch(TURNSTILE_VERIFY_URL, {
    method: 'POST',
    body: params,
  });
  if (!res.ok) return { success: false };
  try {
    return await res.json();
  } catch (e) {
    return { success: false };
  }
}

function trimString(value) {
  return (value == null ? '' : String(value)).trim();
}

function fakeSuccess(origin) {
  /* For tripped honeypot or hard-fail anti-spam signals: pretend the submission
     went through so bots do not retry or detect rejection. */
  return jsonResponse({ ok: true }, 200, origin);
}

export default {
  async fetch(request, env) {
    const origin = request.headers.get('Origin') || '';
    const allow = pickAllowedOrigin(origin);

    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: corsHeaders(allow) });
    }

    if (request.method !== 'POST') {
      return jsonResponse({ ok: false, error: 'Method not allowed.' }, 405, allow);
    }

    if (ALLOWED_ORIGINS.indexOf(origin) === -1) {
      return jsonResponse({ ok: false, error: 'Origin not allowed.' }, 403, allow);
    }

    let body;
    try {
      body = await request.json();
    } catch (e) {
      return jsonResponse({ ok: false, error: 'Invalid JSON.' }, 400, allow);
    }

    const ip = request.headers.get('CF-Connecting-IP') || '';

    const turnstileToken = trimString(body.turnstileToken);
    if (!turnstileToken) {
      return jsonResponse(
        { ok: false, error: 'Verification token missing. Please reload and try again.' },
        400,
        allow,
      );
    }

    if (!env.TURNSTILE_SECRET) {
      return jsonResponse(
        { ok: false, error: 'Server is not configured. Please contact the team.' },
        500,
        allow,
      );
    }

    const verify = await verifyTurnstile(turnstileToken, env.TURNSTILE_SECRET, ip);
    if (!verify || !verify.success) {
      return jsonResponse(
        { ok: false, error: 'Verification failed. Please reload and try again.' },
        403,
        allow,
      );
    }

    const honeypot = trimString(body.company_website);
    if (honeypot) return fakeSuccess(allow);

    const firstname = trimString(body.firstname);
    const lastname = trimString(body.lastname);
    const email = trimString(body.email);
    const message = trimString(body.message);

    if (!firstname || !lastname || !email || !message) {
      return jsonResponse(
        { ok: false, error: 'Please complete all required fields before submitting.' },
        400,
        allow,
      );
    }

    if (!EMAIL_RE.test(email)) {
      return jsonResponse(
        { ok: false, error: 'Please enter a valid work email address.' },
        400,
        allow,
      );
    }

    const atIdx = email.lastIndexOf('@');
    const domain = atIdx >= 0 ? email.slice(atIdx + 1).toLowerCase() : '';
    if (DISPOSABLE_DOMAINS.has(domain)) {
      return jsonResponse(
        { ok: false, error: 'Please use your work email so we can verify your team.' },
        400,
        allow,
      );
    }

    if (message.length < MIN_MESSAGE_LEN) {
      return jsonResponse(
        {
          ok: false,
          error:
            'Please add a few more details about what you are building so we can route your request.',
        },
        400,
        allow,
      );
    }

    if (MESSAGE_URL_RE.test(message)) {
      return jsonResponse(
        {
          ok: false,
          error:
            'Please describe your project without links. We will follow up by email if we need any.',
        },
        400,
        allow,
      );
    }

    const fields = [
      { name: 'firstname', value: firstname },
      { name: 'lastname', value: lastname },
      { name: 'email', value: email },
      { name: 'message', value: message },
    ];
    const utmKeys = ['utm_campaign', 'utm_content', 'utm_medium', 'utm_source'];
    utmKeys.forEach(function (key) {
      const v = trimString(body[key]);
      if (v) fields.push({ name: key, value: v });
    });

    const context = {
      pageUri: trimString(body.pageUri),
      pageName: trimString(body.pageName),
    };
    const hutk = trimString(body.hutk);
    if (hutk) context.hutk = hutk;
    if (ip) context.ipAddress = ip;

    let hsRes;
    try {
      hsRes = await fetch(HUBSPOT_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fields: fields, context: context }),
      });
    } catch (e) {
      return jsonResponse(
        { ok: false, error: 'We could not submit right now. Please try again in a moment.' },
        502,
        allow,
      );
    }

    if (!hsRes.ok) {
      let errData = null;
      try {
        errData = await hsRes.json();
      } catch (e) {
        errData = null;
      }
      let hsMessage = '';
      if (errData) {
        if (Array.isArray(errData.errors) && errData.errors[0] && errData.errors[0].message) {
          hsMessage = errData.errors[0].message;
        } else if (
          Array.isArray(errData.validationResults) &&
          errData.validationResults[0] &&
          errData.validationResults[0].message
        ) {
          hsMessage = errData.validationResults[0].message;
        } else if (errData.message) {
          hsMessage = errData.message;
        }
      }
      return jsonResponse(
        {
          ok: false,
          error: hsMessage || 'We could not submit right now. Please try again in a moment.',
        },
        502,
        allow,
      );
    }

    return jsonResponse({ ok: true }, 200, allow);
  },
};
