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

  // ── Tech page guide tabs (one panel at a time) ───────────────────────
  var guideTabsRoot = document.querySelector('[data-air-guide-tabs]');
  if (guideTabsRoot) {
    var guideTabButtons = guideTabsRoot.querySelectorAll('[role="tab"]');
    var guideTabPanels = guideTabsRoot.querySelectorAll('[role="tabpanel"]');

    function activateGuideTab(index) {
      guideTabButtons.forEach(function (tab, i) {
        var selected = i === index;
        tab.setAttribute('aria-selected', selected ? 'true' : 'false');
        tab.classList.toggle('is-active', selected);
        tab.tabIndex = selected ? 0 : -1;
      });
      guideTabPanels.forEach(function (panel, i) {
        var active = i === index;
        panel.classList.toggle('is-active', active);
        panel.hidden = !active;
      });
    }

    guideTabButtons.forEach(function (tab, index) {
      tab.addEventListener('click', function () {
        activateGuideTab(index);
      });

      tab.addEventListener('keydown', function (e) {
        var next = index;
        if (e.key === 'ArrowDown' || e.key === 'ArrowRight') {
          e.preventDefault();
          next = (index + 1) % guideTabButtons.length;
        } else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
          e.preventDefault();
          next = (index - 1 + guideTabButtons.length) % guideTabButtons.length;
        } else if (e.key === 'Home') {
          e.preventDefault();
          next = 0;
        } else if (e.key === 'End') {
          e.preventDefault();
          next = guideTabButtons.length - 1;
        } else {
          return;
        }
        activateGuideTab(next);
        guideTabButtons[next].focus();
      });
    });

    activateGuideTab(0);
  }

  // ── Hero intake form (role + tech pages using air-page.js) ─────────────
  var roleForm = document.getElementById('react-intake-form');
  if (roleForm && window.BEIntakeForm) {
    window.BEIntakeForm.wireForm(roleForm, document.getElementById('react-intake-status'));
  }
})();
