(function () {
  'use strict';

  var reduceMotion =
    window.matchMedia &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

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

  var toggle = document.getElementById('nav-toggle');
  var mobile = document.getElementById('mobile-menu');
  if (toggle && mobile) {
    toggle.addEventListener('click', function () {
      var open = mobile.classList.toggle('is-open');
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
  }

  var revealItems = document.querySelectorAll('#main .reveal');
  if (reduceMotion) {
    revealItems.forEach(function (el) {
      el.classList.add('is-visible');
    });
  } else if ('IntersectionObserver' in window) {
    var revealObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          entry.target.classList.add('is-visible');
          revealObserver.unobserve(entry.target);
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' },
    );

    revealItems.forEach(function (el) {
      revealObserver.observe(el);
    });
  }

  var faqList = document.getElementById('faq-list');
  if (faqList) {
    function openFaqPanel(item, button, panel) {
      item.classList.add('is-open');
      button.setAttribute('aria-expanded', 'true');
      if (!panel) return;

      panel.hidden = false;
      if (reduceMotion) {
        panel.style.height = '';
        return;
      }

      panel.style.height = '0px';
      requestAnimationFrame(function () {
        panel.style.height = panel.scrollHeight + 'px';
      });
    }

    function closeFaqPanel(item, button, panel) {
      item.classList.remove('is-open');
      button.setAttribute('aria-expanded', 'false');
      if (!panel) return;

      if (reduceMotion) {
        panel.hidden = true;
        panel.style.height = '';
        return;
      }

      panel.style.height = panel.scrollHeight + 'px';
      requestAnimationFrame(function () {
        panel.style.height = '0px';
      });
    }

    faqList.querySelectorAll('.faq-panel').forEach(function (panel) {
      if (!panel.hidden) panel.style.height = panel.scrollHeight + 'px';
    });

    faqList.addEventListener('click', function (event) {
      var button = event.target.closest('.faq-item button');
      if (!button || !faqList.contains(button)) return;

      var item = button.closest('.faq-item');
      var panel = item.querySelector('.faq-panel');
      var isOpen = item.classList.contains('is-open');

      faqList.querySelectorAll('.faq-item').forEach(function (other) {
        if (other === item) return;
        var otherButton = other.querySelector('button');
        var otherPanel = other.querySelector('.faq-panel');
        if (other.classList.contains('is-open') && otherButton) {
          closeFaqPanel(other, otherButton, otherPanel);
        }
      });

      if (isOpen) {
        closeFaqPanel(item, button, panel);
      } else {
        openFaqPanel(item, button, panel);
      }
    });

    faqList.querySelectorAll('.faq-panel').forEach(function (panel) {
      panel.addEventListener('transitionend', function (event) {
        if (event.propertyName !== 'height') return;
        var item = panel.closest('.faq-item');
        if (!item) return;
        if (item.classList.contains('is-open')) {
          panel.style.height = panel.scrollHeight + 'px';
        } else {
          panel.hidden = true;
          panel.style.height = '';
        }
      });
    });
  }

  var tocLinks = document.querySelectorAll('.air-toc-nav .toc-link');
  var tocSections = document.querySelectorAll('.air-toc-section[id]');
  if (tocLinks.length && tocSections.length && !reduceMotion && 'IntersectionObserver' in window) {
    function setActiveTocLink(activeId) {
      tocLinks.forEach(function (link) {
        var isActive = link.getAttribute('href') === '#' + activeId;
        link.classList.toggle('is-active', isActive);
        if (isActive) {
          link.setAttribute('aria-current', 'true');
        } else {
          link.removeAttribute('aria-current');
        }
      });
    }

    var headerOffset = header ? header.offsetHeight : 84;
    setActiveTocLink(tocSections[0].id);

    var tocObserver = new IntersectionObserver(
      function (entries) {
        var visibleEntries = entries
          .filter(function (entry) {
            return entry.isIntersecting;
          })
          .sort(function (a, b) {
            return a.boundingClientRect.top - b.boundingClientRect.top;
          });

        if (!visibleEntries.length) return;
        setActiveTocLink(visibleEntries[0].target.id);
      },
      {
        rootMargin: '-' + (headerOffset + 24) + 'px 0px -55% 0px',
        threshold: [0, 0.15, 0.35],
      },
    );

    tocSections.forEach(function (section) {
      tocObserver.observe(section);
    });
  } else if (tocLinks.length && tocSections.length) {
    tocLinks[0].classList.add('is-active');
    tocLinks[0].setAttribute('aria-current', 'true');
  }

  // ── Guide section accordion (mobile only) ───────────────────────────
  if (tocSections.length) {
    var accMq = window.matchMedia('(max-width: 900px)');

    function openGuideSection(section) {
      var prose = section.querySelector('.air-role-prose');
      section.classList.add('is-open');
      if (!prose) return;
      prose.hidden = false;
      if (reduceMotion) { prose.style.height = ''; return; }
      prose.style.height = '0px';
      requestAnimationFrame(function () {
        prose.style.height = prose.scrollHeight + 'px';
      });
    }

    function closeGuideSection(section) {
      var prose = section.querySelector('.air-role-prose');
      section.classList.remove('is-open');
      if (!prose) return;
      if (reduceMotion) { prose.hidden = true; prose.style.height = ''; return; }
      prose.style.height = prose.scrollHeight + 'px';
      requestAnimationFrame(function () {
        prose.style.height = '0px';
      });
    }

    tocSections.forEach(function (section) {
      var h3 = section.querySelector('h3');
      var prose = section.querySelector('.air-role-prose');
      if (!h3 || !prose) return;

      h3.setAttribute('tabindex', '0');
      h3.setAttribute('role', 'button');

      h3.addEventListener('click', function () {
        if (!accMq.matches) return;
        if (section.classList.contains('is-open')) {
          closeGuideSection(section);
        } else {
          tocSections.forEach(function (other) {
            if (other !== section && other.classList.contains('is-open')) {
              closeGuideSection(other);
            }
          });
          openGuideSection(section);
        }
      });

      h3.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          h3.click();
        }
      });

      // Mirror FAQ transitionend exactly
      prose.addEventListener('transitionend', function (e) {
        if (e.propertyName !== 'height') return;
        if (section.classList.contains('is-open')) {
          // Keep explicit height so CSS height:0 cannot re-collapse it
          prose.style.height = prose.scrollHeight + 'px';
        } else {
          prose.hidden = true;
          prose.style.height = '';
        }
      });
    });

    function syncAccordion() {
      if (accMq.matches) {
        tocSections.forEach(function (section, i) {
          var prose = section.querySelector('.air-role-prose');
          if (!prose) return;
          if (i === 0) {
            section.classList.add('is-open');
            prose.hidden = false;
            // Measure and set without triggering a transition on page load
            prose.style.transition = 'none';
            prose.style.height = prose.scrollHeight + 'px';
            requestAnimationFrame(function () { prose.style.transition = ''; });
          } else {
            section.classList.remove('is-open');
            prose.hidden = true;
            prose.style.height = '';
          }
        });
      } else {
        // Desktop: restore all panels, no animation
        tocSections.forEach(function (section) {
          var prose = section.querySelector('.air-role-prose');
          section.classList.remove('is-open');
          if (prose) {
            prose.hidden = false;
            prose.style.transition = 'none';
            prose.style.height = '';
            requestAnimationFrame(function () { prose.style.transition = ''; });
          }
        });
      }
    }

    syncAccordion();
    accMq.addEventListener('change', syncAccordion);
  }

  // ── Hero intake form (role pages) ────────────────────────────────────────
  var roleForm = document.getElementById('react-intake-form');
  if (roleForm) {
    var roleStatus = document.getElementById('react-intake-status');
    var HS_PORTAL = '8679235';
    var HS_FORM   = '4431ddc0-7bea-46ba-939c-98c422756479';
    var hsUrl     = 'https://api.hsforms.com/submissions/v3/integration/submit/' +
                    HS_PORTAL + '/' + HS_FORM;

    function showRoleSuccess() {
      if (!roleStatus) return;
      roleStatus.innerHTML =
        'Thanks - we got your request. We will be in touch within 24 hours. ' +
        'Or <a href="https://calendly.com/tim-salsamobi/30min" target="_blank" ' +
        'rel="noopener noreferrer">book a call with Tim directly</a>.';
      roleStatus.classList.remove('is-error');
      roleStatus.classList.add('is-success');
    }

    function setRoleFieldError(field, invalid) {
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
      err.textContent = invalid ? 'This field is required.' : '';
      err.style.display = invalid ? '' : 'none';
    }

    roleForm.addEventListener('submit', function (e) {
      e.preventDefault();

      var fd       = new FormData(roleForm);
      var first    = (fd.get('firstname') || '').trim();
      var last     = (fd.get('lastname')  || '').trim();
      var email    = (fd.get('email')     || '').trim();
      var message  = (fd.get('message')   || '').trim();
      var honeypot = (fd.get('company_website') || '').trim();

      var emailRe  = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

      // Validate required fields
      var valid = true;
      [['firstname', first], ['lastname', last], ['email', email], ['message', message]]
        .forEach(function (pair) {
          var field = roleForm.querySelector('[name="' + pair[0] + '"]');
          if (!pair[1]) { setRoleFieldError(field, true); valid = false; }
          else setRoleFieldError(field, false);
        });

      if (!valid) {
        var firstBad = roleForm.querySelector('[aria-invalid="true"]');
        if (firstBad) firstBad.focus();
        return;
      }

      if (!emailRe.test(email)) {
        setRoleFieldError(roleForm.querySelector('[name="email"]'), true);
        return;
      }

      // Honeypot: fake success silently
      if (honeypot) {
        roleForm.reset();
        roleForm.classList.add('intake-form--success');
        showRoleSuccess();
        return;
      }

      var submitBtn = roleForm.querySelector('button[type="submit"]');
      if (submitBtn) submitBtn.disabled = true;
      roleForm.classList.add('is-submitting');

      var fields = [
        { name: 'firstname', value: first   },
        { name: 'lastname',  value: last    },
        { name: 'email',     value: email   },
        { name: 'message',   value: message },
      ];
      ['utm_campaign', 'utm_content', 'utm_medium', 'utm_source'].forEach(function (k) {
        var v = (fd.get(k) || '').trim();
        if (v) fields.push({ name: k, value: v });
      });

      fetch(hsUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fields:  fields,
          context: { pageUri: window.location.href, pageName: document.title },
        }),
      })
        .then(function (r) {
          if (r.ok) {
            roleForm.reset();
            roleForm.classList.add('intake-form--success');
            showRoleSuccess();
          } else {
            if (roleStatus) {
              roleStatus.textContent = 'Something went wrong. Please try again.';
              roleStatus.classList.add('is-error');
            }
          }
        })
        .catch(function () {
          if (roleStatus) {
            roleStatus.textContent = 'Could not send your request. Please try again.';
            roleStatus.classList.add('is-error');
          }
        })
        .finally(function () {
          roleForm.classList.remove('is-submitting');
          if (submitBtn) submitBtn.disabled = false;
        });
    });
  }
})();
