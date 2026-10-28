/**
 * BetterEngineer cookie consent (no third-party CMP).
 * - Stores choices in localStorage + optional first-party cookie.
 * - Gates analytics (GTM, HubSpot) registered via build-pages shell or data-be-cookie-category.
 * - QA: ?cookie_preview=1 clears stored consent and shows the banner again.
 * - Preview page: set window.BE_COOKIE_ALWAYS_PREVIEW = true before this script loads.
 */
(function (global) {
  'use strict';

  var STORAGE_KEY = 'be_cookie_consent_v1';
  var COOKIE_NAME = 'be_consent';
  var COOKIE_MAX_AGE_DAYS = 180;
  var VERSION = 1;

  var doc = global.document;
  if (!doc) return;

  function readQueryFlag(name) {
    try {
      return new URL(global.location.href).searchParams.get(name);
    } catch (e) {
      return null;
    }
  }

  var previewQuery = readQueryFlag('cookie_preview') === '1';
  var alwaysPreview = !!global.BE_COOKIE_ALWAYS_PREVIEW;

  if (previewQuery && !alwaysPreview) {
    try {
      global.localStorage.removeItem(STORAGE_KEY);
    } catch (e) {
      /* ignore */
    }
    clearConsentCookie();
  }

  function parseConsent(raw) {
    if (!raw) return null;
    try {
      var data = JSON.parse(raw);
      if (!data || data.v !== VERSION) return null;
      return {
        necessary: true,
        analytics: !!data.analytics,
        ts: data.ts || 0,
      };
    } catch (e) {
      return null;
    }
  }

  function readStoredConsent() {
    if (alwaysPreview || previewQuery) return null;
    try {
      var fromLs = parseConsent(global.localStorage.getItem(STORAGE_KEY));
      if (fromLs) return fromLs;
    } catch (e) {
      /* ignore */
    }
    var fromCookie = readConsentCookie();
    return fromCookie;
  }

  function readConsentCookie() {
    var match = doc.cookie.match(new RegExp('(?:^|; )' + COOKIE_NAME + '=([^;]*)'));
    if (!match) return null;
    try {
      return parseConsent(decodeURIComponent(match[1]));
    } catch (e) {
      return null;
    }
  }

  function clearConsentCookie() {
    doc.cookie = COOKIE_NAME + '=; Max-Age=0; Path=/; SameSite=Lax';
  }

  function persistConsent(consent) {
    var payload = JSON.stringify({
      v: VERSION,
      necessary: true,
      analytics: !!consent.analytics,
      ts: Date.now(),
    });
    try {
      global.localStorage.setItem(STORAGE_KEY, payload);
    } catch (e) {
      /* ignore */
    }
    var maxAge = COOKIE_MAX_AGE_DAYS * 24 * 60 * 60;
    doc.cookie =
      COOKIE_NAME +
      '=' +
      encodeURIComponent(payload) +
      '; Max-Age=' +
      maxAge +
      '; Path=/; SameSite=Lax';
  }

  var state = {
    consent: readStoredConsent(),
    analyticsLoaded: false,
    uiBuilt: false,
  };

  function loadGtm(containerId) {
    if (!containerId) return;
    if (doc.querySelector('script[src*="googletagmanager.com/gtm.js"]')) return;
    global.dataLayer = global.dataLayer || [];
    global.dataLayer.push({ 'gtm.start': new Date().getTime(), event: 'gtm.js' });
    var first = doc.getElementsByTagName('script')[0];
    var gtm = doc.createElement('script');
    gtm.async = true;
    gtm.src = 'https://www.googletagmanager.com/gtm.js?id=' + containerId;
    first.parentNode.insertBefore(gtm, first);

    var noscript = doc.createElement('noscript');
    noscript.innerHTML =
      '<iframe src="https://www.googletagmanager.com/ns.html?id=' +
      containerId +
      '" height="0" width="0" style="display:none;visibility:hidden"></iframe>';
    doc.body.insertBefore(noscript, doc.body.firstChild);
  }

  function loadHubSpot(portalId) {
    if (!portalId) return;
    global._hsq = global._hsq || [];
    if (doc.getElementById('hs-script-loader')) return;
    var s = doc.createElement('script');
    s.id = 'hs-script-loader';
    s.async = true;
    s.defer = true;
    s.src = 'https://js.hs-scripts.com/' + portalId + '.js';
    doc.head.appendChild(s);
  }

  function loadTaggedScripts() {
    var nodes = doc.querySelectorAll('[data-be-cookie-category="analytics"]');
    for (var i = 0; i < nodes.length; i++) {
      var el = nodes[i];
      if (el.getAttribute('data-be-loaded') === 'true') continue;
      if (el.tagName === 'SCRIPT') {
        var clone = doc.createElement('script');
        var type = el.getAttribute('data-be-script-type') || 'text/javascript';
        clone.type = type;
        if (el.src) clone.src = el.src;
        else clone.text = el.text || el.textContent || '';
        clone.async = el.hasAttribute('async');
        clone.defer = el.hasAttribute('defer');
        el.parentNode.insertBefore(clone, el);
      }
      el.setAttribute('data-be-loaded', 'true');
    }
  }

  function applyAnalyticsConsent() {
    if (state.analyticsLoaded) return;
    state.analyticsLoaded = true;

    var gtmNode = doc.getElementById('be-gtm-config');
    if (gtmNode && gtmNode.textContent) {
      try {
        var gtmCfg = JSON.parse(gtmNode.textContent);
        if (gtmCfg && gtmCfg.id) loadGtm(gtmCfg.id);
      } catch (e) {
        /* ignore */
      }
    }

    var hsNode = doc.getElementById('be-hs-config');
    if (hsNode && hsNode.textContent) {
      try {
        var hsCfg = JSON.parse(hsNode.textContent);
        if (hsCfg && hsCfg.portalId) loadHubSpot(String(hsCfg.portalId));
      } catch (e) {
        /* ignore */
      }
    }

    loadTaggedScripts();
    try {
      global.dispatchEvent(new CustomEvent('be:cookie-analytics-allowed'));
    } catch (e) {
      /* IE11 not a target */
    }
  }

  function revokeAnalytics() {
    /* Scripts already injected cannot be fully unloaded; record denial for next visit. */
    state.analyticsLoaded = false;
  }

  function setConsent(choice) {
    var next = { necessary: true, analytics: !!choice.analytics, ts: Date.now() };
    state.consent = next;
    if (!alwaysPreview && !previewQuery) {
      persistConsent(next);
    }
    if (next.analytics) applyAnalyticsConsent();
    else revokeAnalytics();
    hideUi();
    try {
      global.dispatchEvent(
        new CustomEvent('be:cookie-consent-updated', { detail: next }),
      );
    } catch (e) {
      /* ignore */
    }
  }

  function shouldShowBanner() {
    if (alwaysPreview || previewQuery) return true;
    return !state.consent;
  }

  function privacyUrl() {
    return (
      (global.BE_COOKIE_PRIVACY_URL || '/resource-center/wpautoterms/privacy-policy/') +
      ''
    );
  }

  function getFocusable(container) {
    return container.querySelectorAll(
      'a[href], button:not([disabled]), input:not([disabled]), textarea, select, [tabindex]:not([tabindex="-1"])',
    );
  }

  function trapFocus(panel, onEscape) {
    var previouslyFocused = doc.activeElement;

    function handleKey(e) {
      if (e.key === 'Escape') {
        e.preventDefault();
        onEscape();
        return;
      }
      if (e.key !== 'Tab') return;
      var focusable = getFocusable(panel);
      if (!focusable.length) return;
      var first = focusable[0];
      var last = focusable[focusable.length - 1];
      if (e.shiftKey && doc.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && doc.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }

    panel.addEventListener('keydown', handleKey);
    var closeBtn = panel.querySelector('[data-be-cookie-close]');
    if (closeBtn) closeBtn.focus();
    else {
      var f = getFocusable(panel);
      if (f.length) f[0].focus();
    }

    return function release() {
      panel.removeEventListener('keydown', handleKey);
      if (previouslyFocused && previouslyFocused.focus) previouslyFocused.focus();
    };
  }

  var releaseTrap = null;

  function hideUi() {
    var banner = doc.getElementById('be-cookie-banner');
    var modal = doc.getElementById('be-cookie-modal');
    if (banner) banner.hidden = true;
    if (modal) modal.hidden = true;
    if (releaseTrap) {
      releaseTrap();
      releaseTrap = null;
    }
    doc.documentElement.classList.remove('be-cookie-modal-open');
  }

  function openPreferences() {
    var modal = doc.getElementById('be-cookie-modal');
    if (!modal) return;
    modal.hidden = false;
    doc.documentElement.classList.add('be-cookie-modal-open');
    var panel = modal.querySelector('.be-cookie-modal__panel');
    var analyticsToggle = modal.querySelector('#be-cookie-analytics');
    if (analyticsToggle) {
      analyticsToggle.checked = state.consent ? !!state.consent.analytics : false;
    }
    releaseTrap = trapFocus(panel, function () {
      hideUi();
      if (shouldShowBanner()) {
        var banner = doc.getElementById('be-cookie-banner');
        if (banner) banner.hidden = false;
      }
    });
  }

  function buildUi() {
    if (state.uiBuilt || !doc.body) return;
    state.uiBuilt = true;

    var banner = doc.createElement('div');
    banner.id = 'be-cookie-banner';
    banner.className = 'be-cookie-banner';
    banner.setAttribute('role', 'dialog');
    banner.setAttribute('aria-labelledby', 'be-cookie-banner-title');
    banner.setAttribute('aria-describedby', 'be-cookie-banner-desc');
    banner.innerHTML =
      '<h2 class="be-cookie-banner__title" id="be-cookie-banner-title">Cookies on BetterEngineer</h2>' +
      '<p class="be-cookie-banner__text" id="be-cookie-banner-desc">We use necessary cookies to run the site. With your permission, we also use analytics cookies to understand how visitors use our pages. See our <a href="' +
      privacyUrl() +
      '">Privacy Policy</a>.</p>' +
      '<div class="be-cookie-banner__actions">' +
      '<button type="button" class="be-cookie-btn be-cookie-btn--primary" data-be-action="accept-all">Accept all</button>' +
      '<button type="button" class="be-cookie-btn be-cookie-btn--secondary" data-be-action="reject">Essential only</button>' +
      '<button type="button" class="be-cookie-btn be-cookie-btn--ghost" data-be-action="manage">Manage preferences</button>' +
      '</div>';

    var modal = doc.createElement('div');
    modal.id = 'be-cookie-modal';
    modal.className = 'be-cookie-modal';
    modal.hidden = true;
    modal.innerHTML =
      '<div class="be-cookie-modal__backdrop" data-be-cookie-close tabindex="-1" aria-hidden="true"></div>' +
      '<div class="be-cookie-modal__panel" role="dialog" aria-modal="true" aria-labelledby="be-cookie-prefs-title">' +
      '<h2 class="be-cookie-modal__title" id="be-cookie-prefs-title">Cookie preferences</h2>' +
      '<p class="be-cookie-modal__intro">Choose which cookies we may use. Necessary cookies are always on because the site needs them to work.</p>' +
      '<div class="be-cookie-pref">' +
      '<div class="be-cookie-pref__head">' +
      '<div><p class="be-cookie-pref__name">Necessary</p><p class="be-cookie-pref__desc">Security, network management, and accessibility. Required for the site to function.</p></div>' +
      '<span class="be-cookie-pref__badge">Always on</span>' +
      '</div></div>' +
      '<div class="be-cookie-pref">' +
      '<div class="be-cookie-pref__head">' +
      '<div><p class="be-cookie-pref__name">Analytics</p><p class="be-cookie-pref__desc">Helps us measure traffic and improve content (Google Tag Manager, HubSpot).</p></div>' +
      '<label class="be-cookie-toggle" aria-label="Allow analytics cookies">' +
      '<input type="checkbox" id="be-cookie-analytics" />' +
      '<span class="be-cookie-toggle__track" aria-hidden="true"></span>' +
      '<span class="be-cookie-toggle__thumb" aria-hidden="true"></span>' +
      '</label></div></div>' +
      '<div class="be-cookie-modal__actions">' +
      '<button type="button" class="be-cookie-btn be-cookie-btn--ghost" data-be-cookie-close>Cancel</button>' +
      '<button type="button" class="be-cookie-btn be-cookie-btn--primary" data-be-action="save-prefs">Save preferences</button>' +
      '</div></div>';

    doc.body.appendChild(banner);
    doc.body.appendChild(modal);

    banner.addEventListener('click', function (e) {
      var btn = e.target.closest('[data-be-action]');
      if (!btn) return;
      var action = btn.getAttribute('data-be-action');
      if (action === 'accept-all') setConsent({ analytics: true });
      else if (action === 'reject') setConsent({ analytics: false });
      else if (action === 'manage') {
        banner.hidden = true;
        openPreferences();
      }
    });

    modal.addEventListener('click', function (e) {
      if (e.target.closest('[data-be-cookie-close]')) {
        hideUi();
        if (shouldShowBanner()) banner.hidden = false;
        return;
      }
      var btn = e.target.closest('[data-be-action]');
      if (!btn) return;
      if (btn.getAttribute('data-be-action') === 'save-prefs') {
        var toggle = doc.getElementById('be-cookie-analytics');
        setConsent({ analytics: toggle && toggle.checked });
      }
    });

    if (shouldShowBanner()) banner.hidden = false;
    else hideUi();
  }

  function onReady() {
    buildUi();
    if (state.consent && state.consent.analytics) applyAnalyticsConsent();
  }

  if (doc.readyState === 'loading') {
    doc.addEventListener('DOMContentLoaded', onReady);
  } else {
    onReady();
  }

  global.BECookieConsent = {
    getConsent: function () {
      return state.consent;
    },
    openPreferences: function () {
      buildUi();
      var banner = doc.getElementById('be-cookie-banner');
      if (banner) banner.hidden = true;
      openPreferences();
    },
    resetForPreview: function () {
      try {
        global.localStorage.removeItem(STORAGE_KEY);
      } catch (e) {
        /* ignore */
      }
      clearConsentCookie();
      state.consent = null;
      state.analyticsLoaded = false;
      buildUi();
      var banner = doc.getElementById('be-cookie-banner');
      if (banner) banner.hidden = false;
    },
  };
})(typeof window !== 'undefined' ? window : this);
