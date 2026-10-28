(function () {
  'use strict';

  var HS_PORTAL = '8679235';
  var EMAIL_RE = /^[A-Z0-9._%+\-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;

  function $(sel, root) {
    return (root || document).querySelector(sel);
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

  function utmFieldsFromForm(form) {
    if (window.BEAttribution) {
      if (window.BEAttribution.fillUtmFields) window.BEAttribution.fillUtmFields(form);
      return window.BEAttribution.utmFieldsForHubSpot();
    }
    var fields = [];
    ['utm_campaign', 'utm_content', 'utm_medium', 'utm_source'].forEach(function (key) {
      var input = form.querySelector('[name="' + key + '"]');
      var value = input ? (input.value || '').trim() : '';
      if (value) fields.push({ name: key, value: value });
    });
    return fields;
  }

  function setStatus(el, message, kind) {
    if (!el) return;
    el.textContent = message || '';
    el.classList.remove('is-success', 'is-error');
    if (kind) el.classList.add(kind === 'success' ? 'is-success' : 'is-error');
  }

  function wire(form) {
    if (!form || form.dataset.wired === 'true') return;
    form.dataset.wired = 'true';
    var formId = form.getAttribute('data-hs-form');
    var statusEl = form.querySelector('.form-status');
    var submitBtn = form.querySelector('[type="submit"]');

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var fd = new FormData(form);
      if ((fd.get('company_website') || '').trim()) {
        setStatus(statusEl, 'Thanks. We will be in touch shortly.', 'success');
        form.reset();
        return;
      }
      var email = (fd.get('email') || '').trim();
      var first = (fd.get('firstname') || '').trim();
      var last = (fd.get('lastname') || '').trim();
      if (!first || !last || !EMAIL_RE.test(email)) {
        setStatus(statusEl, 'Please complete the required fields.', 'error');
        return;
      }
      if (!formId) {
        setStatus(statusEl, 'This form is not configured. Please use Contact Us.', 'error');
        return;
      }

      var fields = [
        { name: 'email', value: email },
        { name: 'firstname', value: first },
        { name: 'lastname', value: last },
      ];
      var company = (fd.get('company') || '').trim();
      if (company) fields.push({ name: 'company', value: company });
      var message = (fd.get('message') || '').trim();
      if (message) fields.push({ name: 'message', value: message });
      fields = fields.concat(utmFieldsFromForm(form));

      var context = { pageUri: window.location.href, pageName: document.title };
      var hutk = getCookie('hubspotutk');
      if (hutk) context.hutk = hutk;

      if (submitBtn) submitBtn.disabled = true;
      setStatus(statusEl, 'Sending…');

      fetch(
        'https://api.hsforms.com/submissions/v3/integration/submit/' + HS_PORTAL + '/' + formId,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ fields: fields, context: context }),
        },
      )
        .then(function (res) {
          if (!res.ok) throw new Error('HubSpot submission failed.');
          return res.json().catch(function () {
            return {};
          });
        })
        .then(function (data) {
          var message =
            form.getAttribute('data-success') ||
            (data && (data.inlineMessage || data.message)) ||
            'Thanks. We will be in touch shortly.';
          setStatus(statusEl, message, 'success');
          form.reset();
        })
        .catch(function () {
          setStatus(
            statusEl,
            'Could not send your request. Please try again or use Contact Us.',
            'error',
          );
        })
        .then(function () {
          if (submitBtn) submitBtn.disabled = false;
        });
    });
  }

  document.addEventListener('DOMContentLoaded', function () {
    document.querySelectorAll('form[data-hs-form]').forEach(wire);
  });
})();
