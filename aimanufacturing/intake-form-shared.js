(function () {
  'use strict';

  var CALENDLY_URL = 'https://calendly.com/tim-salsamobi/30min';
  var HS_PORTAL = '8679235';
  var HS_FORM = '4431ddc0-7bea-46ba-939c-98c422756479';
  var HS_URL =
    'https://api.hsforms.com/submissions/v3/integration/submit/' + HS_PORTAL + '/' + HS_FORM;
  var TURNSTILE_SITEKEY = '0x4AAAAAADXUtFccGnkJSbpe';
  var WORKER_URL = 'https://intake-proxy.patricemmh.workers.dev';
  var USE_WORKER =
    TURNSTILE_SITEKEY !== 'PASTE_TURNSTILE_SITE_KEY_HERE' &&
    WORKER_URL !== 'PASTE_WORKER_URL_HERE' &&
    TURNSTILE_SITEKEY.length > 0 &&
    WORKER_URL.length > 0;

  var MIN_MESSAGE_LEN = 20;
  var EMAIL_RE = /^[A-Z0-9._%+\-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
  var MESSAGE_URL_RE =
    /(?:https?:\/\/|\bwww\.[a-z]|\bt\.me\/|\bbit\.ly\/|\btinyurl\.|\bgoo\.gl\/|\bdiscord\.gg\/)/i;
  var DISPOSABLE_DOMAINS = [
    'mailinator.com', 'mailinator.net', '10minutemail.com', '10minutemail.net',
    'guerrillamail.com', 'guerrillamail.net', 'sharklasers.com',
    'tempmail.com', 'temp-mail.org', 'tempr.email', 'dropmail.me',
    'yopmail.com', 'throwawaymail.com', 'maildrop.cc', 'getairmail.com',
    'spamgourmet.com', 'dispostable.com', 'fakeinbox.com', 'mailnesia.com',
    'mintemail.com', 'trbvm.com', 'mohmal.com', 'getnada.com',
    'tempinbox.com', 'emailondeck.com', 'mvrht.net',
  ];

  var turnstileWidgetId = null;
  var turnstileWaiter = null;
  var turnstileTokenCache = '';
  var turnstileReadyWaiters = [];
  var TURNSTILE_READY_TIMEOUT_MS = 30000;
  var TURNSTILE_TOKEN_TIMEOUT_MS = 90000;

  function renderIntakeSuccessMessage(el) {
    if (!el) return;
    el.innerHTML =
      '<span style="display:block;margin-bottom:0.75rem">' +
        '<svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">' +
          '<circle cx="18" cy="18" r="16" stroke="#545bb3" stroke-width="2"/>' +
          '<path d="M10 18l6 6 10-10" stroke="#545bb3" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>' +
        '</svg>' +
      '</span>' +
      '<span style="display:block;font-size:1.25rem;font-weight:700;margin-bottom:0.75rem">Request Received</span>' +
      '<span style="display:block;margin-bottom:0.75rem">We will be in touch within 24 hours.</span>' +
      '<span style="display:block;margin-bottom:0.75rem;opacity:0.6;font-size:0.9rem">Or</span>' +
      '<a href="' + CALENDLY_URL + '" target="_blank" rel="noopener noreferrer">Book a call with Tim directly</a>';
    el.classList.remove('is-error');
    el.classList.add('is-success');
  }

  function setFieldError(field, invalid, message) {
    if (!field) return;
    field.setAttribute('aria-invalid', invalid ? 'true' : 'false');
    var wrap = field.closest('.form-field');
    if (!wrap) return;
    var err = wrap.querySelector('.form-field__error');
    if (!err) {
      err = document.createElement('p');
      err.className = 'form-field__error';
      err.setAttribute('role', 'alert');
      wrap.appendChild(err);
    }
    err.textContent = invalid ? (message || 'This field is required.') : '';
    err.style.display = invalid ? '' : 'none';
  }

  function setStatus(el, message, kind) {
    if (!el) return;
    el.textContent = message || '';
    el.classList.remove('is-success', 'is-error');
    if (kind === 'success') el.classList.add('is-success');
    if (kind === 'error') el.classList.add('is-error');
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

  function notifyTurnstileWaiter(ok, val) {
    if (!turnstileWaiter) return;
    var w = turnstileWaiter;
    turnstileWaiter = null;
    if (ok) w.resolve(val);
    else w.reject(val);
  }

  function resolveTurnstileReady() {
    if (turnstileWidgetId === null) return;
    turnstileReadyWaiters.forEach(function (fn) {
      fn();
    });
    turnstileReadyWaiters = [];
  }

  function setTurnstileHolderVisible(form, show) {
    var holder = form.querySelector('#turnstile-widget');
    if (!holder) return;
    holder.classList.toggle('is-active', !!show);
  }

  function ensureTurnstileHolder(form) {
    var holder = form.querySelector('#turnstile-widget');
    if (holder) return holder;
    holder = document.createElement('div');
    holder.id = 'turnstile-widget';
    holder.className = 'turnstile-widget-wrap';
    var submitButton = form.querySelector('button[type="submit"]');
    if (submitButton && submitButton.parentNode) {
      submitButton.parentNode.insertBefore(holder, submitButton);
    } else {
      form.appendChild(holder);
    }
    return holder;
  }

  function renderTurnstileWidget(form) {
    if (!window.turnstile || turnstileWidgetId !== null) return;
    var holder = ensureTurnstileHolder(form);
    try {
      turnstileWidgetId = window.turnstile.render(holder, {
        sitekey: TURNSTILE_SITEKEY,
        theme: 'light',
        size: 'flexible',
        appearance: 'interaction-only',
        callback: function (token) {
          turnstileTokenCache = token;
          setTurnstileHolderVisible(form, false);
          notifyTurnstileWaiter(true, token);
        },
        'error-callback': function () {
          turnstileTokenCache = '';
          setTurnstileHolderVisible(form, true);
          notifyTurnstileWaiter(
            false,
            new Error('Verification could not load. Please reload the page and try again.'),
          );
        },
        'expired-callback': function () {
          turnstileTokenCache = '';
          setTurnstileHolderVisible(form, true);
          notifyTurnstileWaiter(false, new Error('Verification expired. Please submit again.'));
        },
      });
      resolveTurnstileReady();
    } catch (e) {
      turnstileWidgetId = null;
    }
  }

  function loadTurnstileScript(form) {
    if (!USE_WORKER) return;
    ensureTurnstileHolder(form);
    if (window.turnstile) {
      renderTurnstileWidget(form);
      return;
    }
    if (document.getElementById('turnstile-api-script')) return;
    window.onloadTurnstileCallback = function () {
      renderTurnstileWidget(form);
    };
    var s = document.createElement('script');
    s.id = 'turnstile-api-script';
    s.src =
      'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit&onload=onloadTurnstileCallback';
    s.defer = true;
    s.onerror = function () {
      turnstileReadyWaiters.forEach(function (fn) {
        fn(new Error('Verification script blocked. Disable ad blockers and refresh.'));
      });
      turnstileReadyWaiters = [];
    };
    document.head.appendChild(s);
  }

  function waitForTurnstileWidget(form) {
    return new Promise(function (resolve, reject) {
      if (!USE_WORKER) {
        resolve();
        return;
      }
      loadTurnstileScript(form);
      if (window.turnstile && turnstileWidgetId !== null) {
        resolve();
        return;
      }

      var settled = false;
      var timer = setTimeout(function () {
        if (settled) return;
        settled = true;
        turnstileReadyWaiters = [];
        reject(new Error('Verification could not load. Check your connection and refresh the page.'));
      }, TURNSTILE_READY_TIMEOUT_MS);

      function finish(err) {
        if (settled) return;
        if (err) {
          settled = true;
          clearTimeout(timer);
          reject(err);
          return;
        }
        if (turnstileWidgetId !== null) {
          settled = true;
          clearTimeout(timer);
          resolve();
        }
      }

      turnstileReadyWaiters.push(finish);

      var poll = setInterval(function () {
        if (settled) {
          clearInterval(poll);
          return;
        }
        if (window.turnstile) renderTurnstileWidget(form);
        finish();
      }, 150);
    });
  }

  function getTurnstileToken(form) {
    return waitForTurnstileWidget(form).then(function () {
      return new Promise(function (resolve, reject) {
        if (!USE_WORKER) {
          resolve('');
          return;
        }

        var existing = turnstileTokenCache || window.turnstile.getResponse(turnstileWidgetId);
        if (existing) {
          resolve(existing);
          return;
        }

        var settled = false;
        var timer = setTimeout(function () {
          if (settled) return;
          settled = true;
          turnstileWaiter = null;
          reject(
            new Error(
              'Security check timed out. Complete the verification step above the button, then submit again.',
            ),
          );
        }, TURNSTILE_TOKEN_TIMEOUT_MS);

        function settle(ok, val) {
          if (settled) return;
          settled = true;
          clearTimeout(timer);
          turnstileWaiter = null;
          if (ok) resolve(val);
          else reject(val);
        }

        turnstileWaiter = {
          resolve: function (token) {
            settle(true, token);
          },
          reject: function (err) {
            settle(false, err || new Error('Verification failed. Please try again.'));
          },
        };

        setTurnstileHolderVisible(form, true);
        try {
          window.turnstile.reset(turnstileWidgetId);
        } catch (e) {
          settle(false, e);
        }
      });
    });
  }

  function submitDirectToHubSpot(fields, context) {
    return fetch(HS_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ fields: fields, context: context }),
    }).then(function (res) {
      if (res.ok) return;
      throw new Error('HubSpot submission failed.');
    });
  }

  function wireIntakeForm(form, statusEl) {
    if (!form || form.dataset.intakeWired === 'true') return;
    form.dataset.intakeWired = 'true';

    if (USE_WORKER) {
      ensureTurnstileHolder(form);
      loadTurnstileScript(form);
    }

    form.addEventListener('submit', function (e) {
      e.preventDefault();

      var fd = new FormData(form);
      var first = (fd.get('firstname') || '').trim();
      var last = (fd.get('lastname') || '').trim();
      var email = (fd.get('email') || '').trim();
      var message = (fd.get('message') || '').trim();
      var honeypot = (fd.get('company_website') || '').trim();

      var valid = true;
      [['firstname', first], ['lastname', last], ['email', email], ['message', message]].forEach(
        function (pair) {
          var field = form.querySelector('[name="' + pair[0] + '"]');
          if (!pair[1]) {
            setFieldError(field, true);
            valid = false;
          } else {
            setFieldError(field, false);
          }
        },
      );

      if (!valid) {
        var firstBad = form.querySelector('[aria-invalid="true"]');
        if (firstBad) firstBad.focus();
        return;
      }

      if (!EMAIL_RE.test(email)) {
        setFieldError(
          form.querySelector('[name="email"]'),
          true,
          'Please enter a valid work email address.',
        );
        return;
      }

      if (honeypot) {
        form.reset();
        form.classList.add('intake-form--success');
        renderIntakeSuccessMessage(statusEl);
        return;
      }

      var atIdx = email.lastIndexOf('@');
      var emailDomain = atIdx >= 0 ? email.slice(atIdx + 1).toLowerCase() : '';
      if (DISPOSABLE_DOMAINS.indexOf(emailDomain) !== -1) {
        setFieldError(
          form.querySelector('[name="email"]'),
          true,
          'Please use your work email so we can verify your team.',
        );
        return;
      }

      if (message.length < MIN_MESSAGE_LEN) {
        setFieldError(
          form.querySelector('[name="message"]'),
          true,
          'Please add a few more details about what you are building so we can route your request.',
        );
        return;
      }

      if (MESSAGE_URL_RE.test(message)) {
        setFieldError(
          form.querySelector('[name="message"]'),
          true,
          'Please describe your project without links. We will follow up by email if we need any.',
        );
        return;
      }

      var fields = [
        { name: 'firstname', value: first },
        { name: 'lastname', value: last },
        { name: 'email', value: email },
        { name: 'message', value: message },
      ];
      ['utm_campaign', 'utm_content', 'utm_medium', 'utm_source'].forEach(function (k) {
        var v = (fd.get(k) || '').trim();
        if (v) fields.push({ name: k, value: v });
      });

      var context = {
        pageUri: window.location.href,
        pageName: document.title,
      };
      var hutk = getCookie('hubspotutk');
      if (hutk) context.hutk = hutk;

      var submitBtn = form.querySelector('button[type="submit"]');
      if (submitBtn) submitBtn.disabled = true;
      form.classList.add('is-submitting');

      function applySuccess() {
        form.reset();
        form.classList.add('intake-form--success');
        renderIntakeSuccessMessage(statusEl);
      }

      function applyError(msg) {
        setStatus(statusEl, msg || 'Could not send your request. Please try again.', 'error');
      }

      function clearLoading() {
        form.classList.remove('is-submitting');
        if (submitBtn) submitBtn.disabled = false;
      }

      if (USE_WORKER) {
        getTurnstileToken(form)
          .then(function (token) {
            return fetch(WORKER_URL, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                firstname: first,
                lastname: last,
                email: email,
                message: message,
                utm_campaign: (fd.get('utm_campaign') || '').trim(),
                utm_content: (fd.get('utm_content') || '').trim(),
                utm_medium: (fd.get('utm_medium') || '').trim(),
                utm_source: (fd.get('utm_source') || '').trim(),
                turnstileToken: token,
                pageUri: window.location.href,
                pageName: document.title,
                hutk: hutk,
                company_website: honeypot,
              }),
            }).then(function (res) {
              return res.json().catch(function () {
                return { ok: false, error: 'Unexpected server response.' };
              });
            });
          })
          .then(function (data) {
            if (data && data.ok) {
              applySuccess();
              return;
            }
            applyError(data && data.error);
          })
          .catch(function (err) {
            var msg = (err && err.message) || '';
            if (/Verification|Security check|blocked/i.test(msg)) {
              return submitDirectToHubSpot(fields, context)
                .then(applySuccess)
                .catch(function () {
                  applyError(msg);
                });
            }
            applyError(msg);
          })
          .finally(clearLoading);
        return;
      }

      submitDirectToHubSpot(fields, context)
        .then(applySuccess)
        .catch(function () {
          applyError();
        })
        .finally(clearLoading);
    });
  }

  window.BEIntakeForm = {
    calendlyUrl: CALENDLY_URL,
    renderSuccessMessage: renderIntakeSuccessMessage,
    wireForm: wireIntakeForm,
  };
})();
