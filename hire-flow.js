(function () {
  'use strict';

  var HS_PORTAL = '8679235';
  var HS_FORM = 'd43da6a3-79aa-45d4-99be-0d1e8162daf7';
  var HS_URL =
    'https://api.hsforms.com/submissions/v3/integration/submit/' + HS_PORTAL + '/' + HS_FORM;
  var THANK_YOU = '/multi-step-contact-form/thank-you/';
  var EMAIL_RE = /^[A-Z0-9._%+\-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
  var TOTAL_STEPS = 3;
  var WORKER_URL = 'https://intake-proxy.patricemmh.workers.dev';
  var CONSENT_TEXT = 'I agree to receive communications from Better Engineer.';

  function isDevHost() {
    var host = window.location.hostname;
    return host === 'localhost' || host === '127.0.0.1' || host === '[::1]';
  }

  function legalConsentOptions() {
    return {
      consent: {
        consentToProcess: true,
        text: CONSENT_TEXT,
        communications: [
          {
            value: true,
            subscriptionTypeId: 1110919639,
            text: CONSENT_TEXT,
          },
        ],
      },
    };
  }

  function hubSpotErrorFromBody(data) {
    if (!data || typeof data !== 'object') return '';
    if (Array.isArray(data.errors) && data.errors[0] && data.errors[0].message) {
      return data.errors[0].message;
    }
    if (data.message) return data.message;
    return '';
  }

  function userFacingSubmitError(primaryErr, fallbackErr) {
    var detail = (primaryErr && primaryErr.hubspotMessage) || (primaryErr && primaryErr.message) || '';
    var errorType = primaryErr && primaryErr.errorType;
    if (errorType === 'FORM_HAS_RECAPTCHA_ENABLED') {
      if (fallbackErr) {
        return (
          'Online submit is blocked by HubSpot spam protection on the hire form. ' +
          'We tried a backup route but it failed' +
          (fallbackErr.message ? ' (' + fallbackErr.message + ').' : '.') +
          ' Please book a call or email us.'
        );
      }
      return (
        'Online submit is blocked by HubSpot spam protection on this form. ' +
        'Please book a call or email us while we update the form settings.'
      );
    }
    if (isDevHost() && detail) {
      return 'HubSpot rejected submission: ' + detail;
    }
    if (fallbackErr && /Verification|Security check|Origin not allowed/i.test(fallbackErr.message || '')) {
      return fallbackErr.message + ' You can also book a call.';
    }
    return 'Could not send your request. Please try again or book a call.';
  }

  function logSubmitFailure(label, err, responseBody) {
    if (!isDevHost()) return;
    console.error('[hire-flow]', label, err || '', responseBody || '');
  }

  var state = {
    step: 1,
    engineers: '',
    skills: [],
    specificSkills: '',
    name: '',
    company: '',
    email: '',
    notes: '',
  };

  function $(sel, root) {
    return (root || document).querySelector(sel);
  }

  function $$(sel, root) {
    return Array.prototype.slice.call((root || document).querySelectorAll(sel));
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

  function setStatus(el, message, kind) {
    if (!el) return;
    el.textContent = message || '';
    el.classList.remove('is-success', 'is-error');
    if (kind) el.classList.add(kind === 'success' ? 'is-success' : 'is-error');
  }

  function goThankYou() {
    window.location.assign(THANK_YOU);
  }

  function showStep(wizard, n, opts) {
    state.step = n;
    $$('.hire-step', wizard).forEach(function (stepEl) {
      var id = stepEl.getAttribute('data-step');
      var on = String(id) === String(n);
      stepEl.hidden = !on;
      stepEl.classList.toggle('is-active', on);
    });
    var label = $('#hire-step-label', wizard);
    var progress = $('.hire-progress', wizard);
    if (label) label.textContent = 'Step ' + n + ' of ' + TOTAL_STEPS;
    if (progress) {
      progress.setAttribute('aria-valuenow', String(n));
      progress.setAttribute('aria-valuemax', String(TOTAL_STEPS));
    }
    $$('.hire-progress__dot', wizard).forEach(function (dot, i) {
      var stepNum = i + 1;
      dot.classList.toggle('is-current', stepNum === n);
      dot.classList.toggle('is-done', stepNum < n);
    });
    if (opts && opts.focus) {
      var heading = wizard.querySelector('.hire-step.is-active .hire-step__intro, .hire-step.is-active legend');
      if (heading && heading.focus) {
        heading.setAttribute('tabindex', '-1');
        heading.focus();
      }
    }
  }

  function syncEngineers(wizard) {
    var engineersInput = $('[name="engineers"]', wizard);
    var picked = $('input[name="engineers_choice"]:checked', wizard);
    $$('.hire-count', wizard).forEach(function (tile) {
      var input = tile.querySelector('input');
      tile.classList.toggle('is-selected', !!(input && input.checked));
    });
    if (engineersInput && picked) engineersInput.value = picked.value;
    return engineersInput;
  }

  function readAnswers(wizard) {
    var engineersInput = syncEngineers(wizard);
    state.engineers = engineersInput ? String(engineersInput.value || '').trim() : '';
    state.skills = $$('input[name="skills"]:checked', wizard).map(function (el) {
      return el.value;
    });
    var specific = $('[name="specific_skills"]', wizard);
    state.specificSkills = specific ? (specific.value || '').trim() : '';
  }

  function stepError(wizard, n) {
    readAnswers(wizard);
    if (n === 1) {
      return '';
    }
    if (n === 3) {
      var name = ($('[name="name"]', wizard).value || '').trim();
      var company = ($('[name="company"]', wizard).value || '').trim();
      var email = ($('[name="email"]', wizard).value || '').trim();
      var consent = $('[name="consent"]', wizard).checked;
      if (!name || !company || !EMAIL_RE.test(email) || !consent) {
        return 'Please complete the required fields.';
      }
    }
    return '';
  }

  function splitName(full) {
    var parts = (full || '').trim().split(/\s+/);
    var first = parts.shift() || 'Hiring';
    var last = parts.join(' ') || 'Manager';
    return { first: first, last: last };
  }

  function buildSubmission(wizard) {
    var formEl = $('#hire-wizard-form', wizard);
    if (window.BEAttribution && formEl) window.BEAttribution.fillUtmFields(formEl);
    readAnswers(wizard);
    var fd = new FormData(formEl);
    var fullName = (fd.get('name') || '').trim();
    var names = splitName(fullName);
    var notes = (fd.get('hiring_needs') || '').trim();

    var fields = [
      { name: 'email', value: (fd.get('email') || '').trim() },
      { name: 'multi_step_form___name', value: fullName },
      { name: 'multi_step_form___company', value: (fd.get('company') || '').trim() },
    ];
    if (state.engineers) {
      fields.push({ name: 'multi_step_form___engineers', value: String(state.engineers) });
    }
    if (state.skills.length) {
      fields.push({ name: 'multi_step_form___skills', value: state.skills.join(';') });
    }
    if (state.specificSkills) {
      fields.push({ name: 'multi_step_form___specific_skills', value: state.specificSkills });
    }
    if (notes) {
      fields.push({ name: 'multi_step_form___hiring_needs', value: notes });
    }
    if (window.BEAttribution) {
      fields = fields.concat(window.BEAttribution.utmFieldsForHubSpot());
    } else {
      ['utm_campaign', 'utm_content', 'utm_medium', 'utm_source'].forEach(function (k) {
        var v = (fd.get(k) || '').trim();
        if (v) fields.push({ name: k, value: v });
      });
    }

    var context = {
      pageUri: window.location.href,
      pageName: document.title,
    };
    var hutk = getCookie('hubspotutk');
    if (hutk) context.hutk = hutk;

    return { formEl: formEl, fd: fd, names: names, fields: fields, context: context, hutk: hutk, notes: notes };
  }

  function postToHubSpot(payload) {
    return fetch(HS_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        fields: payload.fields,
        context: payload.context,
        legalConsentOptions: legalConsentOptions(),
      }),
    }).then(function (res) {
      return res
        .json()
        .catch(function () {
          return {};
        })
        .then(function (data) {
          if (res.ok) return data;
          var err = new Error('HubSpot submission failed.');
          err.status = res.status;
          err.hubspotMessage = hubSpotErrorFromBody(data);
          if (Array.isArray(data.errors) && data.errors[0] && data.errors[0].errorType) {
            err.errorType = data.errors[0].errorType;
          }
          err.responseBody = data;
          throw err;
        });
    });
  }

  function workerFallbackMessage(payload) {
    return (
      'Hire wizard request. Engineers: ' +
      (state.engineers || 'n/a') +
      '. Skills: ' +
      (state.skills.join(', ') || state.specificSkills || 'n/a') +
      '. Company: ' +
      (payload.fd.get('company') || '') +
      (payload.notes ? '. ' + payload.notes : '')
    );
  }

  function postToWorkerFallback(payload) {
    var intake = window.BEIntakeForm;
    if (!intake || !intake.useWorker || !intake.getTurnstileToken) {
      return Promise.reject(new Error('Backup submit is not available.'));
    }
    var message = workerFallbackMessage(payload);
    if (message.length < 20) {
      message = message + ' Please follow up about hiring needs.';
    }
    return intake
      .getTurnstileToken(payload.formEl)
      .then(function (token) {
        return fetch(intake.workerUrl || WORKER_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            firstname: payload.names.first,
            lastname: payload.names.last,
            email: (payload.fd.get('email') || '').trim(),
            message: message,
            utm_campaign: window.BEAttribution
              ? window.BEAttribution.getUtmValue('utm_campaign')
              : (payload.fd.get('utm_campaign') || '').trim(),
            utm_content: window.BEAttribution
              ? window.BEAttribution.getUtmValue('utm_content')
              : (payload.fd.get('utm_content') || '').trim(),
            utm_medium: window.BEAttribution
              ? window.BEAttribution.getUtmValue('utm_medium')
              : (payload.fd.get('utm_medium') || '').trim(),
            utm_source: window.BEAttribution
              ? window.BEAttribution.getUtmValue('utm_source')
              : (payload.fd.get('utm_source') || '').trim(),
            turnstileToken: token,
            pageUri: window.location.href,
            pageName: document.title,
            hutk: payload.hutk,
            company_website: payload.fd.get('company_website') || '',
          }),
        });
      })
      .then(function (res) {
        return res.json().catch(function () {
          return { ok: false, error: 'Unexpected server response.' };
        });
      })
      .then(function (data) {
        if (data && data.ok) return data;
        throw new Error((data && data.error) || 'Backup submit failed.');
      });
  }

  function submitToHubSpot(wizard, statusEl, submitBtn) {
    var payload = buildSubmission(wizard);

    if (submitBtn) submitBtn.disabled = true;
    setStatus(statusEl, 'Sending…');

    var primaryErr = null;

    postToHubSpot(payload)
      .then(function () {
        goThankYou();
      })
      .catch(function (err) {
        primaryErr = err;
        logSubmitFailure('HubSpot submit failed', err, err && err.responseBody);
        return postToWorkerFallback(payload);
      })
      .then(function (data) {
        if (data) goThankYou();
      })
      .catch(function (fallbackErr) {
        logSubmitFailure('Worker fallback failed', fallbackErr);
        setStatus(
          statusEl,
          userFacingSubmitError(primaryErr, fallbackErr),
          'error',
        );
      })
      .then(function () {
        if (submitBtn) submitBtn.disabled = false;
      });
  }

  function wire(wizard) {
    if (!wizard || wizard.dataset.wired === 'true') return;
    wizard.dataset.wired = 'true';

    wizard.addEventListener('change', function (e) {
      if (!e.target || !e.target.matches || !e.target.matches('input[name="engineers_choice"]')) return;
      syncEngineers(wizard);
      setStatus($('#hire-wizard-status', wizard), '');
      if (state.step === 1 && !stepError(wizard, 1)) {
        showStep(wizard, 2, { focus: true });
      }
    });

    wizard.addEventListener('click', function (e) {
      if (e.target.closest('[data-next]')) {
        var err = stepError(wizard, state.step);
        if (err) {
          setStatus($('#hire-wizard-status', wizard), err, 'error');
          return;
        }
        setStatus($('#hire-wizard-status', wizard), '');
        showStep(wizard, state.step + 1, { focus: true });
        return;
      }
      if (e.target.closest('[data-prev]')) {
        setStatus($('#hire-wizard-status', wizard), '');
        showStep(wizard, Math.max(1, state.step - 1), { focus: true });
      }
    });

    var form = $('#hire-wizard-form', wizard);
    if (window.BEIntakeForm && window.BEIntakeForm.prepareTurnstile) {
      window.BEIntakeForm.prepareTurnstile(form);
    }
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      if (stepError(wizard, 3)) {
        setStatus($('#hire-wizard-status', wizard), 'Please complete the required fields.', 'error');
        return;
      }
      if (($('[name="company_website"]', wizard).value || '').trim()) {
        goThankYou();
        return;
      }
      submitToHubSpot(wizard, $('#hire-wizard-status', wizard), form.querySelector('[type="submit"]'));
    });

    showStep(wizard, 1);
  }

  document.addEventListener('DOMContentLoaded', function () {
    wire(document.getElementById('hire-wizard'));
  });
})();
