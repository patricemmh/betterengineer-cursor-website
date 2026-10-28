'use strict';

/**
 * Generates main-technical-glossary.html from data/glossary.js.
 *
 * The glossary is the one Phase 2 page that earns a data file. 71 regular
 * {term, definition} records justify build-time sorting, letter grouping,
 * duplicate detection, a generated jump nav, and generated cross-links into the
 * technology and role page families. The live page has none of that: it is one
 * flat alphabetical run of 71 H2s with zero links and no way to navigate.
 *
 * The terms stay on a single URL with anchors rather than becoming 71 thin pages.
 *
 * Run before build-pages.js:
 *   node build-glossary.js && node build-pages.js
 * or just `npm run build`, which chains them.
 */

var fs = require('fs');
var path = require('path');

var root = __dirname;
var terms = require('./data/glossary.js').terms;

var DISCOVER = 'https://discover.betterengineer.com';
var EMDASH = /—/;

/* Page-level copy, verbatim from the live page.
   See docs/site-migration/pages/technical-glossary.md section 2. */
var PAGE = {
  h1: 'Technical Glossary',
  lead:
    'The BetterEngineer Glossary is your go‑to resource for the concepts, roles, and delivery models that power modern software teams. Whether you’re scaling an engineering org, exploring staff augmentation in Latin America, or evaluating AI capabilities, use this glossary to get clear, practical definitions without the noise.',
  heroCtaLabel: 'Hire Better Engineers',
  /* The live hero CTA destination was not captured in the extraction. This uses the
     site-wide hire CTA, matching the header. Confirm before cutover. */
  heroCtaHref: 'https://www.betterengineer.com/multi-step-contact-form',
  ctaHeading: 'Want to build something great together?',
  ctaBody:
    'It’s not just about filling jobs. It’s about creating a better ecosystem for talent and innovation. At BetterEngineer, you’ll find solutions for both your employees and your business.',
  ctaLabel: 'Find Better Talent Today',
  ctaHref: 'https://www.betterengineer.com/multi-step-contact-form',
};

function esc(s) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

/* Sort key ignores case and any leading non-alphanumeric, so "AI-Enhanced" and
   ".NET" land where a reader expects them. */
function sortKey(term) {
  return term.replace(/^[^A-Za-z0-9]+/, '').toLowerCase();
}

function letterOf(term) {
  var k = sortKey(term);
  var c = k.charAt(0).toUpperCase();
  return /[A-Z]/.test(c) ? c : '#';
}

function build() {
  var sorted = terms.slice().sort(function (a, b) {
    return sortKey(a.term).localeCompare(sortKey(b.term));
  });

  /* Duplicate detection. The live page ships two byte-identical entries
     (Selenium WebDriver and WebDriver). Surface it rather than hiding it. */
  var seenDefs = {};
  var dupes = [];
  sorted.forEach(function (t) {
    var k = t.definition.slice(0, 120);
    if (seenDefs[k]) dupes.push(seenDefs[k] + ' / ' + t.term);
    else seenDefs[k] = t.term;
  });

  var slugs = {};
  sorted.forEach(function (t) {
    if (slugs[t.slug]) {
      console.error('ERROR: duplicate slug "' + t.slug + '"');
      process.exitCode = 1;
    }
    slugs[t.slug] = true;
  });

  var groups = [];
  var byLetter = {};
  sorted.forEach(function (t) {
    var L = letterOf(t.term);
    if (!byLetter[L]) {
      byLetter[L] = [];
      groups.push(L);
    }
    byLetter[L].push(t);
  });

  var nav = groups
    .map(function (L) {
      return (
        '            <a class="jump-nav__link" href="#glossary-' +
        L.toLowerCase().replace('#', 'other') +
        '">' +
        esc(L) +
        '</a>'
      );
    })
    .join('\n');

  var body = groups
    .map(function (L) {
      var anchor = 'glossary-' + L.toLowerCase().replace('#', 'other');
      var items = byLetter[L]
        .map(function (t) {
          var links = [];
          if (t.techSlug) {
            links.push(
              '<a href="' +
                DISCOVER +
                '/technologies/' +
                t.techSlug +
                '/">Hire ' +
                esc(t.term) +
                ' engineers</a>',
            );
          }
          if (t.roleSlug) {
            links.push(
              '<a href="' + DISCOVER + '/roles/' + t.roleSlug + '/">Browse this role</a>',
            );
          }
          var linkRow = links.length
            ? '\n              <p class="glossary-term__links">' + links.join(' ') + '</p>'
            : '';
          return (
            '            <div class="glossary-term" id="' +
            t.slug +
            '">\n' +
            '              <h3 class="glossary-term__name">' +
            esc(t.term) +
            '</h3>\n' +
            '              <p class="glossary-term__def">' +
            esc(t.definition) +
            '</p>' +
            linkRow +
            '\n            </div>'
          );
        })
        .join('\n');
      return (
        '        <div class="glossary-group reveal" id="' +
        anchor +
        '">\n' +
        '          <h2 class="glossary-letter">' +
        esc(L) +
        '</h2>\n' +
        '          <div class="glossary-list">\n' +
        items +
        '\n          </div>\n' +
        '        </div>'
      );
    })
    .join('\n\n');

  var html =
    '  <main id="main">\n' +
    '    <section class="hero section" id="hero" aria-labelledby="hero-title">\n' +
    '      <div class="wrap hero-grid">\n' +
    '        <div class="reveal">\n' +
    '          <h1 class="h1" id="hero-title">' +
    esc(PAGE.h1) +
    '</h1>\n' +
    '          <p class="lead">' +
    esc(PAGE.lead) +
    '</p>\n' +
    '          <div class="btn-row">\n' +
    '            <a class="btn btn--primary" href="' +
    PAGE.heroCtaHref +
    '">' +
    esc(PAGE.heroCtaLabel) +
    '</a>\n' +
    '          </div>\n' +
    '        </div>\n' +
    '        <div class="hero-visual hero-visual--image reveal">\n' +
    '          <img class="hero-visual__img" src="/images/pages/faqs/ai-readiness-strategy-1.png" alt="AI-readiness-strategy – 1" width="606" height="578" loading="eager">\n' +
    '        </div>\n' +
    '      </div>\n' +
    '    </section>\n' +
    '\n' +
    '    <section class="section" id="glossary" aria-labelledby="glossary-heading">\n' +
    '      <div class="wrap">\n' +
    '        <h2 class="h2" id="glossary-heading" style="position:absolute;left:-9999px">Glossary terms</h2>\n' +
    '        <!-- MIGRATION: the live page has no jump navigation and no letter groupings. Both are added here; 71 terms in a flat list is not navigable. No copy was changed. -->\n' +
    '        <nav class="jump-nav reveal" aria-label="Jump to a letter">\n' +
    nav +
    '\n        </nav>\n' +
    '\n' +
    body +
    '\n      </div>\n' +
    '    </section>\n' +
    '\n' +
    '    <section class="cta-band" id="cta" aria-labelledby="cta-heading">\n' +
    '      <div class="cta-split">\n' +
    '        <div class="cta-split__text">\n' +
    '          <div class="cta-split__text-inner reveal">\n' +
    '            <h2 class="h2" id="cta-heading">' +
    esc(PAGE.ctaHeading) +
    '</h2>\n' +
    '            <p class="lead">' +
    esc(PAGE.ctaBody) +
    '</p>\n' +
    '            <div class="btn-row">\n' +
    '              <a class="btn btn--primary" href="' +
    PAGE.ctaHref +
    '">' +
    esc(PAGE.ctaLabel) +
    '</a>\n' +
    '            </div>\n' +
    '          </div>\n' +
    '        </div>\n' +
    '      </div>\n' +
    '    </section>\n' +
    '  </main>\n';

  if (EMDASH.test(html)) {
    console.error('ERROR: em dash character in generated glossary');
    process.exitCode = 1;
  }

  fs.writeFileSync(path.join(root, 'main-technical-glossary.html'), html, 'utf8');

  var linked = sorted.filter(function (t) {
    return t.techSlug || t.roleSlug;
  }).length;

  console.log(
    'Wrote main-technical-glossary.html: ' +
      sorted.length +
      ' terms, ' +
      groups.length +
      ' letter groups, ' +
      linked +
      ' cross-linked',
  );
  if (dupes.length) {
    console.warn('  note: duplicate definitions detected: ' + dupes.join(', '));
  }
}

build();
