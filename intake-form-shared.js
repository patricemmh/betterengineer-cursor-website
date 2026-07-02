(function () {
  'use strict';

  var CALENDLY_URL = 'https://calendly.com/tim-salsamobi/30min';
  var HS_PORTAL = '8679235';
  var HS_FORM = '4431ddc0-7bea-46ba-939c-98c422756479';
  var HS_URL = 'https://api.hsforms.com/submissions/v3/integration/submit/' +
    HS_PORTAL + '/' + HS_FORM;

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
      '<span style="display:block;margin-bottom:0.75rem;opacity:0.6;font-size:0.9rem">&#8212; Or &#8212;</span>' +
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

  function wireIntakeForm(form, statusEl) {
    if (!form || form.dataset.intakeWired === 'true') return;
    form.dataset.intakeWired = 'true';

    var emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

    form.addEventListener('submit', function (e) {
      e.preventDefault();

      var fd = new FormData(form);
      var first = (fd.get('firstname') || '').trim();
      var last = (fd.get('lastname') || '').trim();
      var email = (fd.get('email') || '').trim();
      var message = (fd.get('message') || '').trim();
      var honeypot = (fd.get('company_website') || '').trim();

      var valid = true;
      [['firstname', first], ['lastname', last], ['email', email], ['message', message]]
        .forEach(function (pair) {
          var field = form.querySelector('[name="' + pair[0] + '"]');
          if (!pair[1]) {
            setFieldError(field, true);
            valid = false;
          } else {
            setFieldError(field, false);
          }
        });

      if (!valid) {
        var firstBad = form.querySelector('[aria-invalid="true"]');
        if (firstBad) firstBad.focus();
        return;
      }

      if (!emailRe.test(email)) {
        setFieldError(form.querySelector('[name="email"]'), true, 'Please enter a valid work email address.');
        return;
      }

      if (honeypot) {
        form.reset();
        form.classList.add('intake-form--success');
        renderIntakeSuccessMessage(statusEl);
        return;
      }

      var submitBtn = form.querySelector('button[type="submit"]');
      if (submitBtn) submitBtn.disabled = true;
      form.classList.add('is-submitting');

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

      fetch(HS_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fields: fields,
          context: { pageUri: window.location.href, pageName: document.title },
        }),
      })
        .then(function (r) {
          if (r.ok) {
            form.reset();
            form.classList.add('intake-form--success');
            renderIntakeSuccessMessage(statusEl);
          } else if (statusEl) {
            statusEl.textContent = 'Something went wrong. Please try again.';
            statusEl.classList.remove('is-success');
            statusEl.classList.add('is-error');
          }
        })
        .catch(function () {
          if (statusEl) {
            statusEl.textContent = 'Could not send your request. Please try again.';
            statusEl.classList.remove('is-success');
            statusEl.classList.add('is-error');
          }
        })
        .finally(function () {
          form.classList.remove('is-submitting');
          if (submitBtn) submitBtn.disabled = false;
        });
    });
  }

  window.BEIntakeForm = {
    calendlyUrl: CALENDLY_URL,
    renderSuccessMessage: renderIntakeSuccessMessage,
    wireForm: wireIntakeForm,
  };
})();
