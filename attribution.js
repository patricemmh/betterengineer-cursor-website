(function () {
  'use strict';

  var UTM_FIELD_NAMES = ['utm_campaign', 'utm_content', 'utm_medium', 'utm_source'];
  var UTM_CAPTURE_KEYS = UTM_FIELD_NAMES.concat(['utm_term', 'utm_id']);
  var UTM_COOKIE = 'be_utm';
  var UTM_COOKIE_MAX_AGE = 60 * 60 * 24 * 30;

  function safeSessionGet(key) {
    try {
      return window.sessionStorage.getItem(key) || '';
    } catch (e) {
      return '';
    }
  }

  function safeSessionSet(key, value) {
    try {
      window.sessionStorage.setItem(key, value);
    } catch (e) {
      /* private mode */
    }
  }

  function getCookie(name) {
    var cookies = document.cookie ? document.cookie.split('; ') : [];
    for (var i = 0; i < cookies.length; i++) {
      var parts = cookies[i].split('=');
      var key = parts.shift();
      if (key === name) return decodeURIComponent(parts.join('='));
    }
    return '';
  }

  function setUtmCookie(queryString) {
    if (!queryString) return;
    var encoded = encodeURIComponent(queryString);
    var base = UTM_COOKIE + '=' + encoded + ';path=/;max-age=' + UTM_COOKIE_MAX_AGE + ';SameSite=Lax';
    document.cookie = base;
    if (/\.betterengineer\.com$/i.test(window.location.hostname)) {
      document.cookie = base + ';domain=.betterengineer.com';
    }
  }

  function loadUtmsFromCookie() {
    var raw = getCookie(UTM_COOKIE);
    if (!raw) return;
    try {
      var params = new URLSearchParams(raw);
      UTM_FIELD_NAMES.forEach(function (key) {
        var value = (params.get(key) || '').trim();
        if (value && !safeSessionGet(key)) safeSessionSet(key, value);
      });
    } catch (e) {
      /* ignore malformed cookie */
    }
  }

  function captureAttribution() {
    var params = new URLSearchParams(window.location.search || '');
    UTM_CAPTURE_KEYS.forEach(function (key) {
      var value = (params.get(key) || '').trim();
      if (value) safeSessionSet(key, value);
    });

    var landing = safeSessionGet('hs_landing_page');
    if (!landing) safeSessionSet('hs_landing_page', window.location.href);

    var referrer = (document.referrer || '').trim();
    if (referrer && !safeSessionGet('hs_original_referrer')) {
      safeSessionSet('hs_original_referrer', referrer);
    }

    var parts = [];
    UTM_FIELD_NAMES.forEach(function (key) {
      var value = getUtmValue(key);
      if (value) parts.push(encodeURIComponent(key) + '=' + encodeURIComponent(value));
    });
    if (parts.length) setUtmCookie(parts.join('&'));
  }

  function getUtmValue(key) {
    var params = new URLSearchParams(window.location.search || '');
    return (params.get(key) || safeSessionGet(key) || '').trim();
  }

  function fillUtmFields(root) {
    var scope = root || document;
    UTM_FIELD_NAMES.forEach(function (key) {
      var value = getUtmValue(key);
      if (!value) return;
      scope.querySelectorAll('input[name="' + key + '"]').forEach(function (field) {
        if (!field.value) field.value = value;
      });
    });
  }

  function utmFieldsForHubSpot() {
    var fields = [];
    UTM_FIELD_NAMES.forEach(function (key) {
      var value = getUtmValue(key);
      if (value) fields.push({ name: key, value: value });
    });
    return fields;
  }

  function appendUtmsToUrl(url) {
    if (!url || url.charAt(0) === '#') return url;
    try {
      var parsed = new URL(url, window.location.href);
      if (!/betterengineer\.com$/i.test(parsed.hostname)) return url;
      UTM_FIELD_NAMES.forEach(function (key) {
        var value = getUtmValue(key);
        if (value && !parsed.searchParams.has(key)) parsed.searchParams.set(key, value);
      });
      return parsed.toString();
    } catch (e) {
      return url;
    }
  }

  function decorateWwwLinks(root) {
    var scope = root || document;
    scope.querySelectorAll('a[href*="betterengineer.com"]').forEach(function (anchor) {
      var href = anchor.getAttribute('href');
      if (!href) return;
      var next = appendUtmsToUrl(href);
      if (next !== href) anchor.setAttribute('href', next);
    });
  }

  function init() {
    loadUtmsFromCookie();
    captureAttribution();
    fillUtmFields();
    decorateWwwLinks();
  }

  window.BEAttribution = {
    UTM_FIELD_NAMES: UTM_FIELD_NAMES,
    captureAttribution: captureAttribution,
    fillUtmFields: fillUtmFields,
    getUtmValue: getUtmValue,
    utmFieldsForHubSpot: utmFieldsForHubSpot,
    appendUtmsToUrl: appendUtmsToUrl,
    decorateWwwLinks: decorateWwwLinks,
    init: init,
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
