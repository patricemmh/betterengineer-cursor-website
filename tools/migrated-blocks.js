'use strict';

/**
 * Shared markup helpers for generated migrated pages (careers, industries,
 * case studies). Keep class names on the verifier allowlist.
 */

function esc(s) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function stripEm(s) {
  return String(s || '')
    .replace(/—/g, ', ')
    .replace(/–/g, '-')
    .replace(/\s+,/g, ',')
    .replace(/,\s+,/g, ',')
    .replace(/[ \t]{2,}/g, ' ')
    .trim();
}

function p(text, cls) {
  var t = stripEm(text);
  if (!t) return '';
  return cls ? '<p class="' + cls + '">' + esc(t) + '</p>' : '<p>' + esc(t) + '</p>';
}

function faqList(faqs) {
  if (!faqs || !faqs.length) return '';
  var items = faqs
    .map(function (f, i) {
      var open = i === 0 ? ' is-open' : '';
      var hidden = i === 0 ? '' : ' hidden';
      var body =
        f.aHtml && /<(ol|ul)\b/i.test(f.aHtml)
          ? stripEm(f.aHtml)
          : '<p>' + esc(stripEm(f.a)) + '</p>';
      return (
        '<div class="faq-item' +
        open +
        '">\n' +
        '  <h3>\n' +
        '    <button type="button" aria-expanded="' +
        (i === 0 ? 'true' : 'false') +
        '"><span class="faq-question">' +
        esc(stripEm(f.q)) +
        '</span><span class="chevron" aria-hidden="true"></span></button>\n' +
        '  </h3>\n' +
        '  <div class="faq-panel"' +
        hidden +
        '>' +
        body +
        '</div>\n' +
        '</div>'
      );
    })
    .join('\n');
  return (
    '<div class="faq-list reveal" id="faq-list">\n' +
    items +
    '\n</div>'
  );
}

function processList() {
  return (
    '<ol class="process-list">\n' +
    '  <li class="process-list__item">\n' +
    '    <div class="process-list__num"><img src="/images/pages/staff-augmentation/step-1.png" alt="" width="56" height="56" loading="lazy"></div>\n' +
    '    <div>\n' +
    '      <h3>Connect and Consult</h3>\n' +
    '      <p>Discuss your project needs and ideal candidate profile with our team.</p>\n' +
    '    </div>\n' +
    '  </li>\n' +
    '  <li class="process-list__item">\n' +
    '    <div class="process-list__num"><img src="/images/pages/staff-augmentation/step-2.png" alt="" width="56" height="56" loading="lazy"></div>\n' +
    '    <div>\n' +
    '      <h3>Access Top-Tier Talent</h3>\n' +
    '      <p>Receive qualified candidates from our pre-vetted network within 72 hours.</p>\n' +
    '    </div>\n' +
    '  </li>\n' +
    '  <li class="process-list__item">\n' +
    '    <div class="process-list__num"><img src="/images/pages/staff-augmentation/step-3.png" alt="" width="56" height="56" loading="lazy"></div>\n' +
    '    <div>\n' +
    '      <h3>Review, Interview, and Hire</h3>\n' +
    '      <p>Easily manage and review candidates through our user-friendly platform.</p>\n' +
    '    </div>\n' +
    '  </li>\n' +
    '  <li class="process-list__item">\n' +
    '    <div class="process-list__num"><img src="/images/pages/staff-augmentation/step-4.png" alt="" width="56" height="56" loading="lazy"></div>\n' +
    '    <div>\n' +
    '      <h3>Get Continuous Support</h3>\n' +
    '      <p>Get continuous guidance and support to ensure smooth integration and long-term success.</p>\n' +
    '    </div>\n' +
    '  </li>\n' +
    '</ol>'
  );
}

function partnersStrip() {
  return (
    '<section class="partners" aria-label="Client logos">\n' +
    '  <div class="wrap">\n' +
    '    <p class="partners-label">Trusted by Leaders: 100+ Companies Choose BetterEngineer.</p>\n' +
    '    <div class="logo-marquee">\n' +
    '      <div class="logo-track">\n' +
    '        <div class="client-block"><img src="/images/roles/shared/logos/accenture-grey.png" alt="Accenture" width="280" height="80" loading="lazy"></div>\n' +
    '        <div class="client-block"><img src="/images/roles/shared/logos/chapterspot-grey.png" alt="ChapterSpot" width="280" height="80" loading="lazy"></div>\n' +
    '        <div class="client-block"><img src="/images/roles/shared/logos/securelink-grey.png" alt="SecureLink" width="280" height="80" loading="lazy"></div>\n' +
    '        <div class="client-block"><img src="/images/pages/staff-augmentation/logo-wasteplace.png" alt="WastePlace" width="280" height="80" loading="lazy"></div>\n' +
    '      </div>\n' +
    '    </div>\n' +
    '  </div>\n' +
    '</section>'
  );
}

function homePartnerClientBlocks() {
  return (
    '        <div class="client-block">\n' +
    '          <img src="/images/logos/accenture-grey.png" alt="Accenture" width="280" height="80" loading="lazy">\n' +
    '          <div class="client-sub"><span class="client-sub__trim-mobile">Global </span>$64B Consultancy</div>\n' +
    '        </div>\n' +
    '        <div class="client-block">\n' +
    '          <img src="/images/logos/chapterspot-grey.png" alt="ChapterSpot" width="280" height="80" loading="lazy">\n' +
    '          <div class="client-sub">Acquired 2024</div>\n' +
    '        </div>\n' +
    '        <div class="client-block">\n' +
    '          <img src="/images/logos/securelink-grey.png" alt="SecureLink" width="280" height="80" loading="lazy">\n' +
    '          <div class="client-sub">Acquired by Imprivata</div>\n' +
    '        </div>\n' +
    '        <div class="client-block">\n' +
    '          <img src="/images/logos/hydrow.png" alt="Hydrow" width="280" height="80" loading="lazy">\n' +
    '          <div class="client-sub"><a href="/case-studies/hydrow/">Read Case Study</a></div>\n' +
    '        </div>\n' +
    '        <div class="client-block">\n' +
    '          <img src="/images/logos/wasteplace-grey.png" alt="WastePlace" width="280" height="80" loading="lazy">\n' +
    '          <div class="client-sub"><a href="/case-studies/wasteplace/">Read Case Study</a></div>\n' +
    '        </div>\n'
  );
}

var canonicalMetrics = require('../data/canonical-metrics.js');

function airStatsStrip() {
  var cells = canonicalMetrics.strip
    .map(function (m) {
      var num = canonicalMetrics.formatStatNum(m);
      return (
        '          <div class="air-stat">\n' +
        '            <span class="air-stat__num">' +
        num +
        '</span>\n' +
        '            <span class="air-stat__label">' +
        esc(m.label) +
        '</span>\n' +
        '          </div>'
      );
    })
    .join('\n');
  return (
    '<section class="section air-stats-strip" aria-label="Key metrics">\n' +
    '  <div class="wrap">\n' +
    '    <div class="air-stat-row reveal">\n' +
    cells +
    '\n' +
    '    </div>\n' +
    '  </div>\n' +
    '</section>\n'
  );
}

function trustBar() {
  return (
    '<section class="be-trustbar" aria-label="Client logos">\n' +
    '  <div class="wrap">\n' +
    '    <div class="be-trustbar__bar">\n' +
    '      <p class="be-trustbar__copy">Trusted by Leaders: <span>100+ Companies</span> Choose BetterEngineer.</p>\n' +
    '      <div class="be-trustbar__logos">\n' +
    homePartnerClientBlocks() +
    '      </div>\n' +
    '    </div>\n' +
    '  </div>\n' +
    '</section>'
  );
}

function checkList(items) {
  if (!items || !items.length) return '';
  return (
    '<ul class="be-check-list">\n' +
    items
      .map(function (item) {
        var title = item.title || item[0];
        var body = item.body || item[1];
        return (
          '  <li class="be-check-list__item">\n' +
          '    <span class="be-check-list__mark" aria-hidden="true"></span>\n' +
          '    <div>\n' +
          '      <h3>' +
          esc(stripEm(title)) +
          '</h3>\n' +
          '      <p>' +
          esc(stripEm(body)) +
          '</p>\n' +
          '    </div>\n' +
          '  </li>'
        );
      })
      .join('\n') +
    '\n</ul>'
  );
}

function inlineCtaParagraphHtml(text) {
  var t = stripEm(text);
  var breakAfter = 'first call to';
  var i = t.indexOf(breakAfter);
  if (i !== -1) {
    var splitAt = i + breakAfter.length;
    var line1 = esc(t.slice(0, splitAt).trimEnd());
    var line2 = esc(t.slice(splitAt).trim());
    return line1 + '<br class="be-inline-cta__br" aria-hidden="true"> ' + line2;
  }
  return esc(t);
}

function inlineCtaBar(opts) {
  opts = opts || {};
  var text = opts.text || 'Partner with BetterEngineer and go from first call to exceptional hires faster than you imagined.';
  var label = opts.label || 'Schedule a Call';
  var href = opts.href || '/contact/';
  return (
    '<aside class="be-inline-cta">\n' +
    '  <img class="be-inline-cta__photo" src="/images/pages/hiring-dashboard/mid-cta-background.png" alt="" width="240" height="122" loading="lazy">\n' +
    '  <div class="be-inline-cta__body">\n' +
    '    <p>' +
    inlineCtaParagraphHtml(text) +
    '</p>\n' +
    '    <a class="btn be-inline-cta__btn" href="' +
    esc(href) +
    '">' +
    esc(label) +
    '</a>\n' +
    '  </div>\n' +
    '</aside>'
  );
}

function communityBanner(opts) {
  opts = opts || {};
  var heading = opts.heading || 'Become part of the Better Engineer Community';
  var lead = opts.lead || 'We value relationships and help you improve';
  var label = opts.label || 'Join Better Engineer';
  var href = opts.href || 'https://app.betterengineer.com/sign-up/candidate';
  var eyebrow = opts.eyebrow
    ? '      <p class="eyebrow">' + esc(stripEm(opts.eyebrow)) + '</p>\n'
    : '';
  return (
    '<section class="cr-banner" aria-labelledby="community-heading">\n' +
    '  <div class="wrap cr-banner__inner">\n' +
    '    <div>\n' +
    eyebrow +
    '      <h2 class="h2" id="community-heading">' +
    esc(stripEm(heading)) +
    '</h2>\n' +
    '      <p>' +
    esc(stripEm(lead)) +
    '</p>\n' +
    '    </div>\n' +
    '    <a class="btn btn--primary" href="' +
    esc(href) +
    '">' +
    esc(label) +
    '</a>\n' +
    '  </div>\n' +
    '</section>'
  );
}

function leadForm(opts) {
  opts = opts || {};
  var id = opts.id || 'lead';
  var formId = opts.formId || '4431ddc0-7bea-46ba-939c-98c422756479';
  var label = opts.label || 'Submit';
  var title = opts.title || '';
  var heading = title ? '<h2 class="hero-form__title">' + esc(title) + '</h2>\n' : '';
  var messageField = opts.message
    ? '      <div class="form-field form-field--full"><label for="' +
      id +
      '-message">' +
      esc(opts.messageLabel || 'Tell us about your hiring needs') +
      '</label><textarea id="' +
      id +
      '-message" name="message" rows="3" placeholder="' +
      esc(opts.messagePlaceholder || 'Tell us how we can help you') +
      '"></textarea></div>\n'
    : '      <div class="form-field form-field--full"><label for="' +
      id +
      '-company">Company</label><input id="' +
      id +
      '-company" name="company" type="text" autocomplete="organization"></div>\n';
  return (
    '<div class="hero-form__card hero-form__card--split">\n' +
    heading +
    '  <form class="react-intake-form" data-hs-form="' +
    esc(formId) +
    '" novalidate aria-label="' +
    esc(opts.aria || 'Contact form') +
    '">\n' +
    '    <div class="form-grid">\n' +
    '      <div class="form-field"><label for="' +
    id +
    '-firstname">First name *</label><input id="' +
    id +
    '-firstname" name="firstname" type="text" autocomplete="given-name" required></div>\n' +
    '      <div class="form-field"><label for="' +
    id +
    '-lastname">Last name *</label><input id="' +
    id +
    '-lastname" name="lastname" type="text" autocomplete="family-name" required></div>\n' +
    '      <div class="form-field form-field--full"><label for="' +
    id +
    '-email">Work email *</label><input id="' +
    id +
    '-email" name="email" type="email" autocomplete="email" required></div>\n' +
    messageField +
    '    </div>\n' +
    '    <div aria-hidden="true" style="position:absolute;left:-10000px;top:auto;width:1px;height:1px;overflow:hidden;pointer-events:none"><label for="' +
    id +
    '-website">Leave this field empty</label><input type="text" name="company_website" id="' +
    id +
    '-website" tabindex="-1" autocomplete="off" value=""></div>\n' +
    '    <button class="btn btn--primary" type="submit">' +
    esc(label) +
    '</button>\n' +
    '    <p class="form-status" role="status" aria-live="polite"></p>\n' +
    '  </form>\n' +
    '</div>'
  );
}

/**
 * Technology-page hero card + intake form (same markup as build-tech-pages.js).
 * The <form id="react-intake-form"> is read from technologies/tech-template so
 * industries and technologies never drift. Wired by page.js via BEIntakeForm,
 * which sends pageUri + pageName + UTMs for lead attribution.
 */
var techFormCache = null;
function techFormMarkup() {
  if (techFormCache) return techFormCache;
  var fs = require('fs');
  var path = require('path');
  var tpl = fs.readFileSync(path.join(__dirname, '..', 'technologies', 'tech-template', 'index.html'), 'utf8');
  var s = tpl.indexOf('<form id="react-intake-form"');
  var e = tpl.indexOf('</form>', s) + '</form>'.length;
  techFormCache = tpl.slice(s, e);
  return techFormCache;
}

function techIntakeCard(opts) {
  opts = opts || {};
  var form = techFormMarkup()
    .replace(/\[TECHNOLOGY\]/g, esc(opts.name || 'engineering'))
    .replace(
      /\[FORM_PLACEHOLDER\]/g,
      esc(opts.placeholder || 'Current stack, team size, and what you need to ship')
    );
  return (
    '<div class="hero-form__card react-hero-side-card air-role-hero-card">\n' +
    '  <p class="eyebrow">Get matched fast</p>\n' +
    '  <h2 class="hero-form__title">' +
    esc(opts.title || 'Book a 20-minute intro and tell us about your project.') +
    '</h2>\n  ' +
    form +
    '\n  <p class="air-role-process">Intro Call &gt; Requirements &gt; Profiles in slack / inbox</p>\n' +
    '</div>'
  );
}

function techLogoWall() {
  var items = [
    ['/images/pages/staff-augmentation/tech/java.png', 'Java'],
    ['/images/pages/staff-augmentation/tech/python.png', 'Python'],
    ['/images/pages/staff-augmentation/tech/node-js.png', 'Node JS'],
    ['/images/pages/staff-augmentation/tech/net-c-sharp.png', '.NET C#'],
    ['/images/pages/industries/tech/go.svg', 'Golang'],
    ['/images/pages/staff-augmentation/tech/react.png', 'React'],
    ['/images/pages/industries/tech/c-plusplus.svg', 'C++'],
    ['/images/pages/industries/tech/rust.svg', 'Rust'],
    ['/images/pages/industries/tech/swift.svg', 'Swift'],
    ['/images/pages/case-studies/kotlin.png', 'Kotlin'],
  ];
  var html = items
    .map(function (it) {
      return (
        '        <li class="tech-split__item">\n' +
        '          <img src="' +
        it[0] +
        '" alt="" width="64" height="64" loading="lazy">\n' +
        '          <span class="tech-split__label">' +
        it[1] +
        '</span>\n' +
        '        </li>'
      );
    })
    .join('\n');
  return (
    '<section class="section section-tint tech-split" id="tech" aria-labelledby="tech-heading">\n' +
    '  <div class="wrap tech-split__grid">\n' +
    '    <div class="tech-split__copy reveal">\n' +
    '      <h2 class="h2" id="tech-heading">Yes, we do work in your <span class="accent">technology</span></h2>\n' +
    '      <p class="lead">No matter what your techstack is, we have you covered. We have expert engineers in every technology.</p>\n' +
    '    </div>\n' +
    '    <ul class="tech-split__logos reveal" role="list">\n' +
    html +
    '\n    </ul>\n' +
    '  </div>\n' +
    '</section>'
  );
}

function closingCta(opts) {
  opts = opts || {};
  var heading = opts.heading || 'Say goodbye to endless job boards. Find your better engineer.';
  var body = opts.body || 'Stop Searching, Start Shipping';
  var label = opts.label || 'Schedule Your Call';
  var href = opts.href || 'https://www.betterengineer.com/contact';
  return (
    '<section class="cta-band" id="close" aria-labelledby="close-heading">\n' +
    '  <div class="cta-split">\n' +
    '    <div class="cta-split__text">\n' +
    '      <div class="cta-split__text-inner">\n' +
    '        <h2 class="h2" id="close-heading">' +
    esc(stripEm(heading)) +
    '</h2>\n' +
    '        <p>' +
    esc(stripEm(body)) +
    '</p>\n' +
    '        <div class="btn-row">\n' +
    '          <a class="btn btn--outline-light" href="' +
    esc(href) +
    '">' +
    esc(label) +
    '</a>\n' +
    '        </div>\n' +
    '      </div>\n' +
    '    </div>\n' +
    '    <div class="cta-split__photo">\n' +
    '      <picture>\n' +
    '        <source media="(max-width: 760px)" srcset="/images/pages/staff-augmentation/closing-cta-mobile.png">\n' +
    '        <img src="/images/pages/staff-augmentation/closing-cta.png" alt="" width="1100" height="720" loading="lazy">\n' +
    '      </picture>\n' +
    '    </div>\n' +
    '  </div>\n' +
    '</section>'
  );
}

function ul(items, cls) {
  if (!items || !items.length) return '';
  return (
    '<ul class="' +
    (cls || 'air-bullets') +
    '">\n' +
    items
      .map(function (item) {
        return '  <li>' + esc(stripEm(item)) + '</li>';
      })
      .join('\n') +
    '\n</ul>'
  );
}

/** Bold lead label before ": " or " - " in solution-style list items. */
function solutionListItemHtml(item) {
  var t = stripEm(item);
  var colon = /^([^:]+):\s*(.+)$/.exec(t);
  if (colon) {
    return (
      '<strong>' + esc(colon[1] + ':') + '</strong> ' + esc(colon[2])
    );
  }
  var dash = /^(.+?)\s-\s(.+)$/.exec(t);
  if (dash) {
    return (
      '<strong>' + esc(dash[1] + ' -') + '</strong> ' + esc(dash[2])
    );
  }
  return esc(t);
}

function solutionListUl(items, cls) {
  if (!items || !items.length) return '';
  return (
    '<ul class="' +
    (cls || 'air-bullets') +
    '">\n' +
    items
      .map(function (item) {
        return '  <li>' + solutionListItemHtml(item) + '</li>';
      })
      .join('\n') +
    '\n</ul>'
  );
}

/** Challenge list items with optional per-item bold phrases (parallel to items). */
function challengeListUl(items, cls, boldPhrasesPerItem) {
  if (!items || !items.length) return '';
  return (
    '<ul class="' +
    (cls || 'air-bullets') +
    '">\n' +
    items
      .map(function (item, i) {
        var phrases =
          boldPhrasesPerItem && boldPhrasesPerItem[i]
            ? boldPhrasesPerItem[i]
            : null;
        var html =
          phrases && phrases.length
            ? inlineStrong(item, phrases)
            : esc(stripEm(item));
        return '  <li>' + html + '</li>';
      })
      .join('\n') +
    '\n</ul>'
  );
}

/** Escape text but wrap each phrase (case-sensitive) in <strong>. */
function inlineStrong(text, phrases) {
  var t = stripEm(text);
  if (!phrases || !phrases.length) return esc(t);
  var sorted = phrases.slice().sort(function (a, b) {
    return b.length - a.length;
  });
  var parts = [{ text: t, bold: false }];
  sorted.forEach(function (phrase) {
    var next = [];
    parts.forEach(function (part) {
      if (part.bold) {
        next.push(part);
        return;
      }
      var idx = part.text.indexOf(phrase);
      if (idx === -1) {
        next.push(part);
        return;
      }
      if (idx > 0) {
        next.push({ text: part.text.slice(0, idx), bold: false });
      }
      next.push({ text: phrase, bold: true });
      var after = idx + phrase.length;
      if (after < part.text.length) {
        next.push({ text: part.text.slice(after), bold: false });
      }
    });
    parts = next;
  });
  return parts
    .map(function (part) {
      return part.bold ? '<strong>' + esc(part.text) + '</strong>' : esc(part.text);
    })
    .join('');
}

module.exports = {
  esc: esc,
  stripEm: stripEm,
  p: p,
  faqList: faqList,
  processList: processList,
  partnersStrip: partnersStrip,
  trustBar: trustBar,
  airStatsStrip: airStatsStrip,
  checkList: checkList,
  inlineCtaBar: inlineCtaBar,
  communityBanner: communityBanner,
  leadForm: leadForm,
  techIntakeCard: techIntakeCard,
  techLogoWall: techLogoWall,
  closingCta: closingCta,
  ul: ul,
  solutionListUl: solutionListUl,
  challengeListUl: challengeListUl,
  inlineStrong: inlineStrong,
};
