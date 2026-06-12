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
})();
