'use strict';

/**
 * Live synthetic checks for discover.betterengineer.com.
 * Run locally or in the weekly GitHub Actions workflow.
 */

const SITE = (process.env.LIVE_SITE_ORIGIN || 'https://discover.betterengineer.com').replace(/\/$/, '');
const WORKER = process.env.INTAKE_WORKER_URL || 'https://intake-proxy.patricemmh.workers.dev';
const GTM_ID = 'GTM-WT77L8JF';
const ORIGIN = SITE;

const failures = [];
const passes = [];

function pass(label) {
  passes.push(label);
  console.log('  OK  ' + label);
}

function fail(label, detail) {
  const msg = detail ? label + ': ' + detail : label;
  failures.push(msg);
  console.error(' FAIL ' + msg);
}

async function fetchResponse(url, options) {
  const controller = new AbortController();
  const timeout = setTimeout(function () {
    controller.abort();
  }, 25000);
  try {
    return await fetch(url, Object.assign({ signal: controller.signal, redirect: 'follow' }, options || {}));
  } finally {
    clearTimeout(timeout);
  }
}

async function expectStatus(label, url, expectedStatus, options) {
  try {
    const res = await fetchResponse(url, options);
    if (res.status !== expectedStatus) {
      fail(label, 'HTTP ' + res.status + ' (expected ' + expectedStatus + ')');
      return null;
    }
    pass(label);
    return res;
  } catch (e) {
    fail(label, e.message || String(e));
    return null;
  }
}

async function fetchSitemapUrls() {
  const res = await fetchResponse(SITE + '/sitemap.xml');
  if (!res || res.status !== 200) {
    fail('sitemap.xml', res ? 'HTTP ' + res.status : 'request failed');
    return [];
  }
  const xml = await res.text();
  const urls = [];
  const re = /<loc>([^<]+)<\/loc>/g;
  let m;
  while ((m = re.exec(xml)) !== null) {
    urls.push(m[1].trim());
  }
  if (!urls.length) fail('sitemap.xml', 'no <loc> entries found');
  else pass('sitemap.xml (' + urls.length + ' URLs)');
  return urls;
}

async function checkSitemapPages(urls) {
  for (const url of urls) {
    try {
      const res = await fetchResponse(url);
      if (!res || res.status !== 200) {
        fail('page ' + url, res ? 'HTTP ' + res.status : 'request failed');
        continue;
      }
      pass('page ' + url);
    } catch (e) {
      fail('page ' + url, e.message || String(e));
    }
  }
}

async function checkPageContent(url, checks) {
  try {
    const res = await fetchResponse(url);
    if (!res || res.status !== 200) {
      fail(checks.label + ' load', res ? 'HTTP ' + res.status : 'request failed');
      return;
    }
    const html = await res.text();
    checks.patterns.forEach(function (rule) {
      if (rule.must && !rule.must.test(html)) {
        fail(checks.label, 'missing ' + rule.name);
      }
      if (rule.mustNot && rule.mustNot.test(html)) {
        fail(checks.label, 'found ' + rule.name);
      }
    });
    if (checks.patterns.every(function (rule) {
      if (rule.must && !rule.must.test(html)) return false;
      if (rule.mustNot && rule.mustNot.test(html)) return false;
      return true;
    })) {
      pass(checks.label + ' content');
    }
  } catch (e) {
    fail(checks.label, e.message || String(e));
  }
}

async function checkLandingPageScript() {
  const bases = ['/ai-fluent-engineers', '/aimanufacturing'];
  const names = ['landing-page.js', 'react-page.js'];

  for (const base of bases) {
    let found = false;
    for (const name of names) {
      const pathname = base + '/' + name;
      const url = SITE + pathname;
      try {
        const res = await fetchResponse(url);
        if (res && res.status === 200) {
          const text = await res.text();
          if (!text.includes('intakeWired')) {
            fail('asset ' + pathname, 'missing intakeWired wiring');
            return;
          }
          pass('asset ' + pathname);
          found = true;
          break;
        }
      } catch (e) {
        /* try next candidate */
      }
    }
    if (!found) {
      fail('landing page script for ' + base, 'no landing-page.js or react-page.js returned 200');
      return;
    }
  }
}

async function checkStaticAsset(pathname, needle) {
  const url = SITE + pathname;
  try {
    const res = await fetchResponse(url);
    if (!res || res.status !== 200) {
      fail('asset ' + pathname, res ? 'HTTP ' + res.status : 'request failed');
      return;
    }
    const text = await res.text();
    if (needle && !text.includes(needle)) {
      fail('asset ' + pathname, 'missing expected content');
      return;
    }
    pass('asset ' + pathname);
  } catch (e) {
    fail('asset ' + pathname, e.message || String(e));
  }
}

async function checkWorker() {
  const optionsRes = await fetchResponse(WORKER, {
    method: 'OPTIONS',
    headers: { Origin: ORIGIN },
  });
  if (!optionsRes || optionsRes.status !== 204) {
    fail('intake worker OPTIONS', optionsRes ? 'HTTP ' + optionsRes.status : 'request failed');
  } else {
    pass('intake worker OPTIONS');
  }

  try {
    const postRes = await fetchResponse(WORKER, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Origin: ORIGIN,
      },
      body: 'not-json',
    });
    if (!postRes || postRes.status !== 400) {
      fail('intake worker invalid JSON', postRes ? 'HTTP ' + postRes.status : 'request failed');
    } else {
      pass('intake worker invalid JSON');
    }
  } catch (e) {
    fail('intake worker invalid JSON', e.message || String(e));
  }

  try {
    const postRes = await fetchResponse(WORKER, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Origin: ORIGIN,
      },
      body: JSON.stringify({ email: 'probe@example.com' }),
    });
    if (!postRes || postRes.status !== 400) {
      fail('intake worker missing turnstile', postRes ? 'HTTP ' + postRes.status : 'request failed');
    } else {
      pass('intake worker missing turnstile');
    }
  } catch (e) {
    fail('intake worker missing turnstile', e.message || String(e));
  }
}

async function main() {
  console.log('Live monitor for ' + SITE);
  console.log('Worker: ' + WORKER + '\n');

  const urls = await fetchSitemapUrls();
  await checkSitemapPages(urls);

  await checkStaticAsset('/intake-form-shared.js', 'wireForm');
  await checkLandingPageScript();
  await checkStaticAsset('/air-page.js', 'BEIntakeForm');

  await checkPageContent(SITE + '/roles/front-end-engineers/', {
    label: 'front-end engineers',
    patterns: [
      { name: 'GTM container', must: new RegExp(GTM_ID) },
      { name: 'login URL', must: /sign-in\?redirect_url=/ },
      { name: 'corrupted login URL', mustNot: /sign-in - redirect_url/ },
      { name: 'legacy /contact CTA', mustNot: /betterengineer\.com\/contact/ },
    ],
  });

  await checkPageContent(SITE + '/ai-fluent-engineers/', {
    label: 'ai-fluent-engineers',
    patterns: [
      { name: 'GTM container', must: new RegExp(GTM_ID) },
      { name: 'intake form script', must: /intake-form-shared\.js/ },
      { name: 'corrupted GTM loader', mustNot: /gtm\.js - id=/ },
    ],
  });

  await checkPageContent(SITE + '/technologies/react-fintech/', {
    label: 'react-fintech',
    patterns: [
      { name: 'GTM container', must: new RegExp(GTM_ID) },
      { name: 'corrupted GTM loader', mustNot: /gtm\.js - id=/ },
    ],
  });

  await checkWorker();

  console.log('\n' + passes.length + ' passed, ' + failures.length + ' failed');
  if (failures.length) {
    console.error('\nFailures:');
    failures.forEach(function (f) {
      console.error(' -', f);
    });
    process.exit(1);
  }
  console.log('\nLive monitor passed.');
}

main().catch(function (e) {
  console.error(e);
  process.exit(1);
});
