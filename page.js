(function () {
  'use strict';

  /**
   * Shared behavior for migrated static marketing pages.
   *
   * This is the consolidation target for the base behavior that home.js,
   * landing-page.js, and air-page.js each implement separately. New pages use this
   * script. The three existing scripts get folded into it as a scheduled cleanup,
   * not mid migration. See docs/site-migration/technical-debt.md TD-01.
   *
   * Everything here is feature detected. A page that has no carousel, no FAQ, or no
   * form simply skips that block.
   */

  var reduceMotion =
    typeof window !== 'undefined' &&
    window.matchMedia &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ── HubSpot attribution and CTA tracking ─────────────────────────────────── */
  /* UTM capture, cookies, and www link decoration live in attribution.js (BEAttribution). */

  function getHsqQueue() {
    window._hsq = window._hsq || [];
    return window._hsq;
  }

  function sanitizeEventName(raw) {
    return (
      (raw || 'interaction')
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '_')
        .replace(/^_+|_+$/g, '')
        .slice(0, 64) || 'interaction'
    );
  }

  function trackVirtualView(eventName) {
    var q = getHsqQueue();
    var basePath = window.location.pathname || '/';
    q.push(['setPath', basePath + ' - hs_evt=' + sanitizeEventName(eventName)]);
    q.push(['trackPageView']);
    q.push(['setPath', window.location.pathname + window.location.search]);
  }

  function bindHubSpotClickTracking() {
    document.addEventListener('click', function (e) {
      var target = e.target.closest('a.btn, a.btn-nav, button.btn');
      if (!target) return;
      var explicitName = target.getAttribute('data-hs-event');
      var textName = (target.textContent || '').trim();
      trackVirtualView(explicitName || 'cta_' + textName);
    });
  }

  if (window.BEAttribution) {
    window.BEAttribution.init();
  }
  bindHubSpotClickTracking();

  /* ── Sticky header ────────────────────────────────────────────────────────── */

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

  /* ── Mobile navigation ────────────────────────────────────────────────────── */

  var navToggle = document.getElementById('nav-toggle');
  var mobileMenu = document.getElementById('mobile-menu');
  if (navToggle && mobileMenu) {
    navToggle.addEventListener('click', function () {
      var open = mobileMenu.classList.toggle('is-open');
      navToggle.setAttribute('aria-expanded', open ? 'true' : 'false');
      navToggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    });
    document.addEventListener('keydown', function (e) {
      if (e.key !== 'Escape' || !mobileMenu.classList.contains('is-open')) return;
      mobileMenu.classList.remove('is-open');
      navToggle.setAttribute('aria-expanded', 'false');
      navToggle.setAttribute('aria-label', 'Open menu');
      navToggle.focus();
    });
  }

  /* ── Reveal on scroll ─────────────────────────────────────────────────────── */

  var revealItems = document.querySelectorAll('#main .reveal');
  if (reduceMotion || !('IntersectionObserver' in window)) {
    revealItems.forEach(function (el) {
      el.classList.add('is-visible');
    });
  } else {
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

  if (reduceMotion) {
    document.querySelectorAll('#main video[autoplay]').forEach(function (video) {
      video.removeAttribute('autoplay');
      video.pause();
    });
  }

  /* ── FAQ accordion ────────────────────────────────────────────────────────── */
  /* The canonical FAQ component. Markup, CSS, and behavior all match the
     technology pages. Styles live in styles/brand.css. Collapse is the `hidden`
     attribute; the height and opacity animation is layered on top by setting an
     inline height, which is what makes the transition run.

     Ported from air-page.js so the two implementations behave identically. When
     TD-01 is done, both should call the same function. */

  document.querySelectorAll('.faq-list').forEach(function (faqList) {
    function openPanel(item, button, panel) {
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

    function closePanel(item, button, panel) {
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

    faqList.addEventListener('click', function (event) {
      var button = event.target.closest('.faq-item button');
      if (!button || !faqList.contains(button)) return;

      var item = button.closest('.faq-item');
      if (!item) return;
      var panel = item.querySelector('.faq-panel');
      var wasOpen = item.classList.contains('is-open');

      faqList.querySelectorAll('.faq-item.is-open').forEach(function (other) {
        if (other === item) return;
        var otherButton = other.querySelector('button');
        if (otherButton) closePanel(other, otherButton, other.querySelector('.faq-panel'));
      });

      if (wasOpen) closePanel(item, button, panel);
      else openPanel(item, button, panel);
    });

    faqList.querySelectorAll('.faq-panel').forEach(function (panel) {
      panel.addEventListener('transitionend', function (event) {
        if (event.propertyName !== 'height') return;
        var item = panel.closest('.faq-item');
        if (!item) return;
        if (item.classList.contains('is-open')) {
          /* Hand height back to CSS (`.is-open .faq-panel { height: auto }`) so the
             panel reflows correctly if the viewport or content changes. */
          panel.style.height = '';
        } else {
          panel.hidden = true;
          panel.style.height = '';
        }
      });
    });

    /* Sync whatever initial state the markup declared. */
    faqList.querySelectorAll('.faq-item').forEach(function (item) {
      var button = item.querySelector('button');
      var panel = item.querySelector('.faq-panel');
      if (!button || !panel) return;
      var open = item.classList.contains('is-open');
      button.setAttribute('aria-expanded', open ? 'true' : 'false');
      panel.hidden = !open;
      panel.style.height = '';
    });
  });

  /* ── Testimonial carousel ─────────────────────────────────────────────────── */
  /* Generalized from home.js: slide count is read from the DOM, and arrow keys are
     scoped to the carousel instead of the whole document. */

  document.querySelectorAll('[data-carousel]').forEach(function (root) {
    var slides = root.querySelectorAll('.slide');
    var dotsWrap = root.querySelector('.carousel-dots');
    var dots = dotsWrap ? dotsWrap.querySelectorAll('button') : [];
    var count = slides.length;
    if (count < 2) return;

    var current = 0;

    function show(index) {
      current = ((index % count) + count) % count;
      slides.forEach(function (el, i) {
        el.classList.toggle('is-active', i === current);
        el.setAttribute('aria-hidden', i === current ? 'false' : 'true');
      });
      dots.forEach(function (btn, i) {
        btn.classList.toggle('is-active', i === current);
        btn.setAttribute('aria-selected', i === current ? 'true' : 'false');
      });
    }

    var prevBtn = root.querySelector('.carousel-btn[data-carousel-prev]');
    var nextBtn = root.querySelector('.carousel-btn[data-carousel-next]');
    if (prevBtn) {
      prevBtn.addEventListener('click', function () {
        show(current - 1);
      });
    }
    if (nextBtn) {
      nextBtn.addEventListener('click', function () {
        show(current + 1);
      });
    }
    if (dotsWrap) {
      dotsWrap.addEventListener('click', function (e) {
        var b = e.target.closest('button');
        if (!b || !dotsWrap.contains(b)) return;
        var idx = parseInt(b.getAttribute('data-slide-index'), 10);
        if (!isNaN(idx)) show(idx);
      });
    }
    root.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowLeft') {
        show(current - 1);
        e.preventDefault();
      }
      if (e.key === 'ArrowRight') {
        show(current + 1);
        e.preventDefault();
      }
    });

    show(0);
  });

  /* Curated video watchlist filters. The full list remains visible when script
     is unavailable; filtering is a progressive enhancement. */
  var playlistFilters = document.querySelectorAll('[data-playlist-filter]');
  var playlistVideos = document.querySelectorAll('[data-playlist-topic]');
  var playlistStatus = document.querySelector('[data-playlist-status]');
  if (playlistFilters.length && playlistVideos.length) {
    playlistFilters.forEach(function (button) {
      button.addEventListener('click', function () {
        var selected = button.getAttribute('data-playlist-filter') || 'all';
        var visibleCount = 0;

        playlistFilters.forEach(function (item) {
          var active = item === button;
          item.classList.toggle('is-active', active);
          item.setAttribute('aria-pressed', active ? 'true' : 'false');
        });

        playlistVideos.forEach(function (video) {
          var visible = selected === 'all' || video.getAttribute('data-playlist-topic') === selected;
          video.hidden = !visible;
          if (visible) visibleCount += 1;
        });

        if (playlistStatus) {
          playlistStatus.textContent =
            selected === 'all'
              ? 'Showing all ' + visibleCount + ' videos below'
              : 'Showing ' + visibleCount + ' ' + selected + ' videos';
        }
      });
    });
  }

  /* ── Intake form ──────────────────────────────────────────────────────────── */
  /* Uses the established shared implementation. Do not reimplement submission. */

  var intakeForm = document.getElementById('react-intake-form');
  if (intakeForm && window.BEIntakeForm) {
    window.BEIntakeForm.wireForm(intakeForm, document.getElementById('react-intake-status'));
  }

  /* ── Rotating hero phrase (hiring dashboard) ─────────────────────────────── */
  /* Words and timing match the live HubSpot hero at /hiring-dashboard. */

  var rotatingWord = document.getElementById('rotating-word');
  if (rotatingWord && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    var rotatingWords = [
      'Your Startup',
      'Your Urgent Roles',
      'Your Next Sprint',
      'Backend Services',
      'Scaling Your Products',
      'Your First Hire',
      'Your Upcoming Deadline',
      'Your AI Teams'
    ];
    var rotatingIndex = 0;
    setInterval(function () {
      rotatingIndex = (rotatingIndex + 1) % rotatingWords.length;
      rotatingWord.style.opacity = '0';
      setTimeout(function () {
        rotatingWord.textContent = rotatingWords[rotatingIndex];
        rotatingWord.style.opacity = '1';
      }, 300);
    }, 3500);
  }
})();
