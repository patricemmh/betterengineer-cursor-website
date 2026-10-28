'use strict';

/**
 * Strip inline GTM/HubSpot loaders and inject cookie-consent gated analytics chrome.
 * Used by build-discover-dist.js so roles/technologies/LP pages share one pattern.
 */

var GTM_ID = 'GTM-WT77L8JF';
var HUBSPOT_PORTAL = '8679235';

var COOKIE_HEAD_SNIPPET =
  '<link rel="stylesheet" href="/styles/cookie-consent.css">\n' +
  '<script src="/scripts/cookie-consent.js"></script>\n' +
  '  <!-- Analytics (GTM, HubSpot) load only after cookie consent. IDs: ' +
  GTM_ID +
  ', portal ' +
  HUBSPOT_PORTAL +
  '. -->\n' +
  '<script type="application/json" id="be-gtm-config">{"id":"' +
  GTM_ID +
  '"}</script>\n' +
  '<script type="application/json" id="be-hs-config">{"portalId":"' +
  HUBSPOT_PORTAL +
  '"}</script>\n';

function stripLegacyAnalytics(html) {
  var out = html;
  out = out.replace(/<!-- Google Tag Manager -->[\s\S]*?<!-- End Google Tag Manager -->/g, '');
  out = out.replace(
    /<!-- Google Tag Manager \(noscript\) -->[\s\S]*?<!-- End Google Tag Manager \(noscript\) -->/g,
    '',
  );
  out = out.replace(/<!-- Google Tag Manager would go here[\s\S]*?-->/g, '');
  out = out.replace(/<script>window\._hsq[\s\S]*?<\/script>\s*/gi, '');
  out = out.replace(/<script id="hs-script-loader"[\s\S]*?<\/script>\s*/gi, '');
  return out;
}

function applyCookieConsentChrome(html) {
  if (!html || html.indexOf('<html') === -1) return html;
  if (html.indexOf('cookie-consent.js') !== -1) {
    return stripLegacyAnalytics(html);
  }
  var next = stripLegacyAnalytics(html);
  if (next.indexOf('</head>') !== -1) {
    return next.replace('</head>', COOKIE_HEAD_SNIPPET + '</head>');
  }
  return next;
}

function walkHtmlFiles(dir, out) {
  if (!require('fs').existsSync(dir)) return;
  require('fs')
    .readdirSync(dir)
    .forEach(function (name) {
      var p = require('path').join(dir, name);
      var st = require('fs').statSync(p);
      if (st.isDirectory()) walkHtmlFiles(p, out);
      else if (name.endsWith('.html')) out.push(p);
    });
}

function patchDiscoverHtmlTree(distRoot) {
  var fs = require('fs');
  var files = [];
  walkHtmlFiles(distRoot, files);
  var patched = 0;
  files.forEach(function (filePath) {
    var html = fs.readFileSync(filePath, 'utf8');
    var next = applyCookieConsentChrome(html);
    if (next !== html) {
      fs.writeFileSync(filePath, next, 'utf8');
      patched += 1;
    }
  });
  return patched;
}

module.exports = {
  GTM_ID: GTM_ID,
  HUBSPOT_PORTAL: HUBSPOT_PORTAL,
  COOKIE_HEAD_SNIPPET: COOKIE_HEAD_SNIPPET,
  stripLegacyAnalytics: stripLegacyAnalytics,
  applyCookieConsentChrome: applyCookieConsentChrome,
  patchDiscoverHtmlTree: patchDiscoverHtmlTree,
};
