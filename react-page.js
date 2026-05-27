(function () {
  'use strict';

  var reduceMotion =
    typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* Header shadow */
  var header = document.getElementById('header');
  if (header) {
    window.addEventListener(
      'scroll',
      function () {
        header.classList.toggle('is-scrolled', window.scrollY > 8);
      },
      { passive: true },
    );
  }

  /* Mobile nav */
  var toggle = document.getElementById('nav-toggle');
  var mobile = document.getElementById('mobile-menu');
  if (toggle && mobile) {
    toggle.addEventListener('click', function () {
      var open = mobile.classList.toggle('is-open');
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
  }

  /* Scroll reveal */
  if (!reduceMotion) {
    document.querySelectorAll('#main .reveal').forEach(function (el) {
      var io = new IntersectionObserver(
        function (entries) {
          entries.forEach(function (e) {
            if (e.isIntersecting) {
              e.target.classList.add('is-visible');
              io.unobserve(e.target);
            }
          });
        },
        { threshold: 0.12, rootMargin: '0px 0px -40px 0px' },
      );
      io.observe(el);
    });
  } else {
    document.querySelectorAll('#main .reveal').forEach(function (el) {
      el.classList.add('is-visible');
    });
  }

  /* FAQ accordion */
  var faqList = document.getElementById('faq-list');
  if (faqList) {
    faqList.addEventListener('click', function (e) {
      var btn = e.target.closest('.faq-item button');
      if (!btn || !faqList.contains(btn)) return;
      var item = btn.closest('.faq-item');
      var panel = item.querySelector('.faq-panel');
      var open = item.classList.contains('is-open');

      faqList.querySelectorAll('.faq-item').forEach(function (other) {
        if (other === item) return;
        other.classList.remove('is-open');
        var b = other.querySelector('button');
        var p = other.querySelector('.faq-panel');
        if (b) b.setAttribute('aria-expanded', 'false');
        if (p) p.hidden = true;
      });

      item.classList.toggle('is-open', !open);
      btn.setAttribute('aria-expanded', open ? 'false' : 'true');
      if (panel) panel.hidden = open;
    });

    /* Init aria / hidden to match first open item */
    faqList.querySelectorAll('.faq-item').forEach(function (item, i) {
      var btn = item.querySelector('button');
      var panel = item.querySelector('.faq-panel');
      var isOpen = item.classList.contains('is-open');
      if (btn) btn.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
      if (panel) panel.hidden = !isOpen;
    });
  }

  /* Fairy dust on hero CTA */
  var dustWrap = document.getElementById('fairy-dust-wrap');
  if (dustWrap && !reduceMotion) {
    var particleId = 0;
    var intervalId = null;
    var colors = ['#f0abfc', '#e9d5ff', '#fef08a', '#ffffff', '#ddd6fe', '#fbcfe8'];

    function removeParticle(node) {
      if (node && node.parentNode) node.parentNode.removeChild(node);
    }

    function spawnBurst() {
      var rect = dustWrap.getBoundingClientRect();
      var w = rect.width;
      var h = rect.height;
      for (var i = 0; i < 4; i++) {
        var x = Math.random() * w;
        var y = h * 0.15 + Math.random() * h * 0.55;
        var angle = Math.random() * Math.PI * 2;
        var dist = 36 + Math.random() * 55;
        var tx = Math.cos(angle) * dist;
        var ty = Math.sin(angle) * dist - (18 + Math.random() * 25);
        var color = colors[Math.floor(Math.random() * colors.length)];
        var size = 3 + Math.random() * 5;

        var span = document.createElement('span');
        span.className = 'fairy-dust-particle';
        span.style.left = x + 'px';
        span.style.top = y + 'px';
        span.style.width = size + 'px';
        span.style.height = size + 'px';
        span.style.setProperty('--tx', tx + 'px');
        span.style.setProperty('--ty', ty + 'px');
        span.style.background = color;
        span.style.boxShadow = '0 0 8px ' + color + ', 0 0 14px rgba(255,255,255,0.45)';

        particleId += 1;
        dustWrap.insertBefore(span, dustWrap.firstChild);

        span.addEventListener(
          'animationend',
          function (el) {
            return function () {
              removeParticle(el);
            };
          }(span),
          { once: true },
        );
      }
    }

    function trimParticles() {
      var nodes = dustWrap.querySelectorAll('.fairy-dust-particle');
      if (nodes.length > 80) {
        for (var j = 0; j < nodes.length - 80; j++) {
          removeParticle(nodes[j]);
        }
      }
    }

    dustWrap.addEventListener('mouseenter', function () {
      spawnBurst();
      intervalId = setInterval(function () {
        spawnBurst();
        trimParticles();
      }, 85);
    });

    dustWrap.addEventListener('mouseleave', function () {
      if (intervalId) {
        clearInterval(intervalId);
        intervalId = null;
      }
      dustWrap.querySelectorAll('.fairy-dust-particle').forEach(removeParticle);
    });
  }

  var HS_PORTAL_ID = '8679235';
  var HS_FORM_ID = '4431ddc0-7bea-46ba-939c-98c422756479';
  var hsSubmitEndpoint = 'https://api.hsforms.com/submissions/v3/integration/submit/' + HS_PORTAL_ID + '/' + HS_FORM_ID;

  function getCookie(name) {
    var cookies = document.cookie ? document.cookie.split('; ') : [];
    for (var i = 0; i < cookies.length; i++) {
      var parts = cookies[i].split('=');
      var key = parts.shift();
      if (key === name) return decodeURIComponent(parts.join('='));
    }
    return '';
  }

  var HS_UTM_KEYS = ['utm_campaign', 'utm_content', 'utm_medium', 'utm_source', 'utm_term', 'utm_id'];

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
      // Ignore storage access failures.
    }
  }

  function captureAttribution() {
    var params = new URLSearchParams(window.location.search || '');
    HS_UTM_KEYS.forEach(function (key) {
      var value = (params.get(key) || '').trim();
      if (value) safeSessionSet(key, value);
    });

    var landing = safeSessionGet('hs_landing_page');
    if (!landing) safeSessionSet('hs_landing_page', window.location.href);

    var referrer = (document.referrer || '').trim();
    if (referrer && !safeSessionGet('hs_original_referrer')) {
      safeSessionSet('hs_original_referrer', referrer);
    }
  }

  function getHsqQueue() {
    window._hsq = window._hsq || [];
    return window._hsq;
  }

  function sanitizeEventName(raw) {
    return (raw || 'interaction')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '_')
      .replace(/^_+|_+$/g, '')
      .slice(0, 64) || 'interaction';
  }

  function trackVirtualView(eventName) {
    var q = getHsqQueue();
    var basePath = window.location.pathname || '/';
    q.push(['setPath', basePath + '?hs_evt=' + sanitizeEventName(eventName)]);
    q.push(['trackPageView']);
    q.push(['setPath', window.location.pathname + window.location.search]);
  }

  function bindHubSpotClickTracking() {
    document.addEventListener('click', function (e) {
      var target = e.target.closest('a.btn, a.btn-nav, button.btn');
      if (!target) return;
      var explicitName = target.getAttribute('data-hs-event');
      var textName = (target.textContent || '').trim();
      var eventName = explicitName || ('cta_' + textName);
      trackVirtualView(eventName);
    });
  }

  function setFieldError(field, isInvalid) {
    if (!field) return;
    field.setAttribute('aria-invalid', isInvalid ? 'true' : 'false');
  }

  function setStatus(el, message, kind) {
    if (!el) return;
    el.textContent = message || '';
    el.classList.remove('is-success', 'is-error');
    if (kind === 'success') el.classList.add('is-success');
    if (kind === 'error') el.classList.add('is-error');
  }

  function getHubSpotErrorMessage(data) {
    if (!data) return '';
    if (data.errors && data.errors.length && data.errors[0] && data.errors[0].message) {
      return data.errors[0].message;
    }
    if (data.validationResults && data.validationResults.length && data.validationResults[0].message) {
      return data.validationResults[0].message;
    }
    if (data.message) return data.message;
    return '';
  }

  function wireReactIntakeForm() {
    var form = document.getElementById('react-intake-form');
    if (!form) return;
    var status = document.getElementById('react-intake-status');
    var utmKeys = ['utm_campaign', 'utm_content', 'utm_medium', 'utm_source'];
    var params = new URLSearchParams(window.location.search || '');

    utmKeys.forEach(function (key) {
      var queryValue = (params.get(key) || '').trim();
      var storedValue = safeSessionGet(key);
      var finalValue = queryValue || storedValue || '';
      var field = form.querySelector('[name="' + key + '"]');
      if (field) field.value = finalValue;
      if (queryValue) {
        safeSessionSet(key, queryValue);
      }
    });

    var requiredFields = Array.prototype.slice.call(form.querySelectorAll('[required]'));
    var formStartedTracked = false;
    var firstInputAt = 0;
    /* Validation timing: stay quiet until first submit attempt, then validate live as the user fixes
       each field. Mirrors the "submit-then-correct" pattern from GOV.UK / Adam Silver and the NN/g
       guidance against premature inline validation. */
    var submitAttempted = false;
    /* Anti-bot tier 1: honeypot, time trap, message hygiene, stricter email, disposable-domain block. */
    var MIN_FILL_MS = 3000;
    var MIN_MESSAGE_LEN = 20;
    var EMAIL_RE = /^[A-Z0-9._%+\-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
    var MESSAGE_URL_RE = /(?:https?:\/\/|\bwww\.[a-z]|\bt\.me\/|\bbit\.ly\/|\btinyurl\.|\bgoo\.gl\/|\bdiscord\.gg\/)/i;
    var DISPOSABLE_DOMAINS = [
      'mailinator.com','mailinator.net','10minutemail.com','10minutemail.net',
      'guerrillamail.com','guerrillamail.net','sharklasers.com',
      'tempmail.com','temp-mail.org','tempr.email','dropmail.me',
      'yopmail.com','throwawaymail.com','maildrop.cc','getairmail.com',
      'spamgourmet.com','dispostable.com','fakeinbox.com','mailnesia.com',
      'mintemail.com','trbvm.com','mohmal.com','getnada.com',
      'tempinbox.com','emailondeck.com','mvrht.net'
    ];

    /* === Cloudflare Turnstile + Worker proxy (Tier 2) ===
       Set both values below to activate. The form falls back to the existing
       direct-to-HubSpot path while the placeholders are still in place, so
       this code is safe to ship before Cloudflare setup is done.
       See worker/README.md for full deploy steps. */
    var TURNSTILE_SITEKEY = '0x4AAAAAADXUtFccGnkJSbpe';
    var WORKER_URL = 'https://intake-proxy.patricemmh.workers.dev';
    var USE_WORKER =
      TURNSTILE_SITEKEY !== 'PASTE_TURNSTILE_SITE_KEY_HERE' &&
      WORKER_URL !== 'PASTE_WORKER_URL_HERE' &&
      TURNSTILE_SITEKEY.length > 0 &&
      WORKER_URL.length > 0;

    var turnstileWidgetId = null;
    var turnstileWaiter = null;
    var turnstileTokenCache = '';
    var TURNSTILE_TOKEN_TIMEOUT_MS = 22000;

    function notifyTurnstileWaiter(ok, val) {
      if (!turnstileWaiter) return;
      var w = turnstileWaiter;
      turnstileWaiter = null;
      if (ok) w.resolve(val);
      else w.reject(val);
    }

    function ensureTurnstileHolder() {
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

    function renderTurnstileWidget() {
      if (!window.turnstile || turnstileWidgetId !== null) return;
      window.turnstile.ready(function () {
        if (turnstileWidgetId !== null) return;
        var holder = ensureTurnstileHolder();
        try {
          /* Managed widget (Cloudflare dashboard): render visibly and let the
             challenge run on page load. Invisible + execute() does not match
             our Managed sitekey and often never returns a token. */
          turnstileWidgetId = window.turnstile.render(holder, {
            sitekey: TURNSTILE_SITEKEY,
            theme: 'light',
            size: 'flexible',
            callback: function (token) {
              turnstileTokenCache = token;
              notifyTurnstileWaiter(true, token);
            },
            'error-callback': function () {
              turnstileTokenCache = '';
              notifyTurnstileWaiter(false, new Error('Verification could not load. Please reload the page and try again.'));
            },
            'expired-callback': function () {
              turnstileTokenCache = '';
              notifyTurnstileWaiter(false, new Error('Verification expired. Please submit again.'));
            },
          });
        } catch (e) {
          turnstileWidgetId = null;
        }
      });
    }

    function loadTurnstileScript() {
      if (!USE_WORKER) return;
      if (window.turnstile) { renderTurnstileWidget(); return; }
      if (document.getElementById('turnstile-api-script')) return;
      window.onloadTurnstileCallback = renderTurnstileWidget;
      var s = document.createElement('script');
      s.id = 'turnstile-api-script';
      s.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit&onload=onloadTurnstileCallback';
      s.defer = true;
      document.head.appendChild(s);
    }

    function getTurnstileToken() {
      return new Promise(function (resolve, reject) {
        if (!USE_WORKER) { resolve(''); return; }
        if (!window.turnstile || turnstileWidgetId === null) {
          reject(new Error('Verification not ready. Please wait a moment and try again.'));
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
          reject(new Error('Security check timed out. Complete the check above the button, then try again.'));
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
          resolve: function (token) { settle(true, token); },
          reject: function (err) {
            settle(false, err || new Error('Verification failed. Please try again.'));
          },
        };

        try {
          window.turnstile.reset(turnstileWidgetId);
        } catch (e) {
          settle(false, e);
        }
      });
    }

    loadTurnstileScript();

    form.addEventListener('input', function () {
      if (!firstInputAt) firstInputAt = Date.now();
      if (formStartedTracked) return;
      formStartedTracked = true;
      trackVirtualView('react_form_started');
    });
    requiredFields.forEach(function (field) {
      field.addEventListener('input', function () {
        if (!submitAttempted) return;
        if (field.value.trim()) setFieldError(field, false);
      });
      field.addEventListener('blur', function () {
        if (!submitAttempted) return;
        setFieldError(field, !field.value.trim());
      });
    });

    form.addEventListener('submit', function (event) {
      event.preventDefault();
      submitAttempted = true;
      form.classList.remove('intake-form--success');
      setStatus(status, '', '');

      var formData = new FormData(form);
      var values = {
        firstname: (formData.get('firstname') || '').trim(),
        lastname: (formData.get('lastname') || '').trim(),
        email: (formData.get('email') || '').trim(),
        message: (formData.get('message') || '').trim(),
        utm_campaign: (formData.get('utm_campaign') || '').trim(),
        utm_content: (formData.get('utm_content') || '').trim(),
        utm_medium: (formData.get('utm_medium') || '').trim(),
        utm_source: (formData.get('utm_source') || '').trim(),
      };

      var hasError = false;
      requiredFields.forEach(function (field) {
        var val = (values[field.name] || '').trim();
        var invalid = !val;
        setFieldError(field, invalid);
        if (invalid) hasError = true;
      });
      if (hasError) {
        setStatus(status, 'Please complete all required fields before submitting.', 'error');
        return;
      }

      /* Honeypot + time trap: silently fake success so bots do not retry or detect rejection. */
      var honeypot = (formData.get('company_website') || '').toString().trim();
      var elapsedSinceFirstInput = firstInputAt ? Date.now() - firstInputAt : 0;
      if (honeypot || !firstInputAt || elapsedSinceFirstInput < MIN_FILL_MS) {
        form.reset();
        requiredFields.forEach(function (field) { setFieldError(field, false); });
        form.classList.add('intake-form--success');
        setStatus(status, 'Thanks. Your request was sent. A staffing specialist will contact you shortly.', 'success');
        return;
      }

      var emailField = form.querySelector('[name="email"]');
      var looksLikeEmail = EMAIL_RE.test(values.email);
      if (!looksLikeEmail) {
        setFieldError(emailField, true);
        setStatus(status, 'Please enter a valid work email address.', 'error');
        return;
      }

      var atIdx = values.email.lastIndexOf('@');
      var emailDomain = atIdx >= 0 ? values.email.slice(atIdx + 1).toLowerCase() : '';
      if (DISPOSABLE_DOMAINS.indexOf(emailDomain) !== -1) {
        setFieldError(emailField, true);
        setStatus(status, 'Please use your work email so we can verify your team.', 'error');
        return;
      }

      var messageField = form.querySelector('[name="message"]');
      if (values.message.length < MIN_MESSAGE_LEN) {
        setFieldError(messageField, true);
        setStatus(status, 'Please add a few more details about what you are building so we can route your request.', 'error');
        return;
      }

      if (MESSAGE_URL_RE.test(values.message)) {
        setFieldError(messageField, true);
        setStatus(status, 'Please describe your project without links. We will follow up by email if we need any.', 'error');
        return;
      }

      var fields = [
        { name: 'firstname', value: values.firstname },
        { name: 'lastname', value: values.lastname },
        { name: 'email', value: values.email },
        { name: 'message', value: values.message },
      ];

      utmKeys.forEach(function (key) {
        if (values[key]) fields.push({ name: key, value: values[key] });
      });

      var context = {
        pageUri: window.location.href,
        pageName: document.title,
      };
      var hutk = getCookie('hubspotutk');
      if (hutk) {
        context.hutk = hutk;
      }

      var payload = {
        fields: fields,
        context: context,
      };

      form.classList.add('is-submitting');
      form.setAttribute('aria-busy', 'true');
      var submitButton = form.querySelector('button[type="submit"]');
      if (submitButton) submitButton.disabled = true;

      function applySuccess() {
        form.reset();
        requiredFields.forEach(function (field) { setFieldError(field, false); });
        form.classList.add('intake-form--success');
        setStatus(status, 'Thanks. Your request was sent. A staffing specialist will contact you shortly.', 'success');
        trackVirtualView('react_form_submit_success');
      }

      function applyError(message) {
        setStatus(status, message || 'We could not submit right now. Please try again in a moment.', 'error');
        trackVirtualView('react_form_submit_error');
      }

      function clearLoading() {
        form.classList.remove('is-submitting');
        form.removeAttribute('aria-busy');
        if (submitButton) submitButton.disabled = false;
      }

      if (USE_WORKER) {
        /* Route the submission through the Cloudflare Worker with a Turnstile token.
           Worker verifies the token, re-runs the Tier 1 checks server-side, then
           forwards to HubSpot. See worker/intake-proxy.js. */
        getTurnstileToken()
          .then(function (token) {
            var workerPayload = {
              firstname: values.firstname,
              lastname: values.lastname,
              email: values.email,
              message: values.message,
              utm_campaign: values.utm_campaign,
              utm_content: values.utm_content,
              utm_medium: values.utm_medium,
              utm_source: values.utm_source,
              turnstileToken: token,
              pageUri: window.location.href,
              pageName: document.title,
              hutk: getCookie('hubspotutk'),
              company_website: honeypot,
            };
            return fetch(WORKER_URL, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(workerPayload),
            }).then(function (res) {
              return res
                .json()
                .catch(function () { return { ok: false, error: 'Unexpected server response.' }; });
            });
          })
          .then(function (data) {
            if (data && data.ok) { applySuccess(); return; }
            applyError(data && data.error);
          })
          .catch(function (err) {
            applyError(err && err.message);
          })
          .finally(clearLoading);
        return;
      }

      fetch(hsSubmitEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      })
        .then(function (res) {
          if (res.ok) return null;
          return res.json()
            .then(function (data) { return data; })
            .catch(function () { return null; })
            .then(function (data) {
              var error = new Error('HubSpot submission failed.');
              error.data = data;
              throw error;
            });
        })
        .then(function () {
          applySuccess();
        })
        .catch(function (err) {
          var hubspotMessage = err && err.data ? getHubSpotErrorMessage(err.data) : '';
          applyError(hubspotMessage);
        })
        .finally(clearLoading);
    });
  }

  var SLIDE_COUNT = 3;
  var slide = 0;
  function showSlide(i) {
    slide = ((i % SLIDE_COUNT) + SLIDE_COUNT) % SLIDE_COUNT;
    var root = document.getElementById('testimonials');
    if (!root) return;
    var slides = root.querySelectorAll('.slide');
    var dots = root.querySelectorAll('.carousel-dots button');
    slides.forEach(function (el, idx) {
      el.classList.toggle('is-active', idx === slide);
      el.setAttribute('aria-hidden', idx === slide ? 'false' : 'true');
    });
    dots.forEach(function (btn, idx) {
      btn.classList.toggle('is-active', idx === slide);
      btn.setAttribute('aria-selected', idx === slide ? 'true' : 'false');
    });
  }

  function wireTestimonialsCarousel() {
    var testimonials = document.getElementById('testimonials');
    if (!testimonials) return;
    var prevBtn = testimonials.querySelector('.carousel-btn[aria-label="Previous testimonial"]');
    var nextBtn = testimonials.querySelector('.carousel-btn[aria-label="Next testimonial"]');
    var dots = testimonials.querySelector('.carousel-dots');
    if (prevBtn) prevBtn.addEventListener('click', function () { showSlide(slide - 1); });
    if (nextBtn) nextBtn.addEventListener('click', function () { showSlide(slide + 1); });
    if (dots) {
      dots.addEventListener('click', function (e) {
        var b = e.target.closest('button');
        if (!b || !dots.contains(b)) return;
        var idx = parseInt(b.getAttribute('data-slide-index'), 10);
        if (!isNaN(idx)) showSlide(idx);
      });
    }
    document.addEventListener('keydown', function (e) {
      if (!testimonials) return;
      if (e.key === 'ArrowLeft') showSlide(slide - 1);
      if (e.key === 'ArrowRight') showSlide(slide + 1);
    });
    showSlide(0);
  }

  captureAttribution();
  bindHubSpotClickTracking();
  wireReactIntakeForm();
  wireTestimonialsCarousel();
})();
