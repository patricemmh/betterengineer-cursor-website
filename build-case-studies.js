'use strict';

/**
 * Generate case study fragments from data/case-studies.js.
 * Layout follows the live HubSpot case-study template.
 */

var fs = require('fs');
var path = require('path');
var b = require('./tools/migrated-blocks');
var data = require('./data/case-studies.js');

var outDir = path.join(__dirname, 'fragments', 'case-studies');
fs.mkdirSync(outDir, { recursive: true });

var TRUST = [
  {
    title: 'Frictionless Hiring',
    body: 'Skip the hassle, let us handle sourcing, vetting, and onboarding so you can focus on building.',
  },
  {
    title: 'Vetted Engineers',
    body: 'Gain access to top talent, each thoroughly screened for technical skills and team fit.',
  },
  {
    title: 'Flexible, On-Demand Scaling',
    body: 'Easily add the right engineers as your needs evolve, no long-term commitments required.',
  },
  {
    title: 'Seamless Collaboration',
    body: 'Engineers integrated into your workflows and culture, delivering impact from day one.',
  },
  {
    title: 'Long-Term Partnership',
    body: 'Our engineers are committed to your success, with an average tenure exceeding one year. Expect ongoing support and guidance as we grow together.',
  },
];

function kickerHeading(label, title, id) {
  return (
    '<h2 class="cs-kicker-heading" id="' +
    id +
    '"><span class="cs-kicker-heading__label">' +
    b.esc(label) +
    '</span> <span class="cs-kicker-heading__title">' +
    b.esc(title) +
    '</span></h2>'
  );
}

function heroLogoBlock(s) {
  var src;
  if (s.heroLogo === null || s.heroLogo === false) {
    return '';
  }
  if (typeof s.heroLogo === 'string' && s.heroLogo) {
    src = s.heroLogo;
  } else if (s.logo) {
    src = s.logo;
  } else {
    return '';
  }
  return (
    '      <div class="cs-hero__logo reveal">\n' +
    '        <img src="' +
    b.esc(src) +
    '" alt="' +
    b.esc(s.name) +
    ' logo" width="330" height="330" loading="eager">\n' +
    '      </div>\n'
  );
}

function trustHeading() {
  return (
    '<h2 class="h2 cs-why__heading" id="trust-heading">' +
    '<span class="cs-why__heading-line">Why High-Scaling Engineering' +
    '<br class="cs-why__heading-br" aria-hidden="true"> Teams</span> ' +
    '<span class="accent cs-why__heading-accent">Trust BetterEngineer</span></h2>'
  );
}

/** Quote with optional photo/author footer. Same markup the solution quote has always used. */
function quoteHtml(q, cls, ind) {
  return (
    ind + '<blockquote class="' + cls + '">\n' +
    ind + '  <p>' + b.esc(q.text) + '</p>\n' +
    (q.author
      ? ind + '  <footer class="cs-quote__person">\n' +
        (q.photo
          ? ind + '    <img src="' + b.esc(q.photo) + '" alt="" width="100" height="100" loading="lazy">\n'
          : '') +
        ind + '    <div><strong>' + b.esc(q.author) + '</strong><span>' + b.esc(q.role || '') + '</span></div>\n' +
        ind + '  </footer>\n'
      : '') +
    ind + '</blockquote>\n'
  );
}

/**
 * Optional free-form content blocks (multi paragraph copy with lists).
 * Each block is { p: 'text', bold: ['phrase'] } or { ul: ['item', ...] }.
 */
function blocksHtml(blocks, ulCls, ind) {
  return (blocks || [])
    .map(function (bl) {
      if (bl.ul) return b.ul(bl.ul, ulCls);
      return '<p>' + b.inlineStrong(bl.p, bl.bold) + '</p>';
    })
    .join('\n' + ind);
}

/**
 * Optional "About the Product" section (text + image carousel + feature quote).
 * Only emitted when a study defines productSection, so other pages are unchanged.
 */
var CS_GALLERY_SCRIPT =
  '<script>\n' +
  '(function () {\n' +
  '  document.querySelectorAll(".cs-gallery[data-cs-carousel]").forEach(function (root) {\n' +
  '    var track = root.querySelector(".cs-gallery__track");\n' +
  '    var slides = root.querySelectorAll(".cs-gallery__slide");\n' +
  '    var captionEl = root.querySelector(".cs-gallery__caption");\n' +
  '    var prev = root.querySelector(".cs-gallery__btn--prev");\n' +
  '    var next = root.querySelector(".cs-gallery__btn--next");\n' +
  '    if (!track || !slides.length) return;\n' +
  '    var index = 0;\n' +
  '    function captionFor(i) {\n' +
  '      var fig = slides[i].querySelector("figcaption");\n' +
  '      return fig ? fig.textContent : "";\n' +
  '    }\n' +
  '    function go(nextIndex) {\n' +
  '      index = (nextIndex + slides.length) % slides.length;\n' +
  '      track.style.transform = "translateX(-" + index * 100 + "%)";\n' +
  '      slides.forEach(function (slide, i) {\n' +
  '        slide.setAttribute("aria-hidden", i === index ? "false" : "true");\n' +
  '      });\n' +
  '      if (captionEl) captionEl.textContent = captionFor(index);\n' +
  '    }\n' +
  '    if (prev) prev.addEventListener("click", function () { go(index - 1); });\n' +
  '    if (next) next.addEventListener("click", function () { go(index + 1); });\n' +
  '    root.addEventListener("keydown", function (e) {\n' +
  '      if (e.key === "ArrowLeft") { e.preventDefault(); go(index - 1); }\n' +
  '      if (e.key === "ArrowRight") { e.preventDefault(); go(index + 1); }\n' +
  '    });\n' +
  '    go(0);\n' +
  '  });\n' +
  '})();\n' +
  '</script>\n';

function productSectionHtml(p) {
  if (!p) return '';
  var gallery = p.gallery || [];
  var firstCaption = gallery[0] && gallery[0].caption ? b.esc(gallery[0].caption) : '';
  var slides = gallery
    .map(function (g, slideIndex) {
      return (
        '              <li class="cs-gallery__slide" aria-hidden="' +
        (slideIndex === 0 ? 'false' : 'true') +
        '">\n' +
        '                <figure>\n' +
        '                  <img src="' + b.esc(g.src) + '" alt="' + b.esc(g.alt || '') + '" width="773" height="1200" loading="lazy">\n' +
        (g.caption ? '                  <figcaption>' + b.esc(g.caption) + '</figcaption>\n' : '') +
        '                </figure>\n' +
        '              </li>'
      );
    })
    .join('\n');
  return (
    '  <section class="section cs-product" id="product" aria-labelledby="product-heading">\n' +
    '    <div class="wrap">\n' +
    '      <div class="cs-product__grid">\n' +
    '        <div class="reveal">\n' +
    '          ' + kickerHeading(p.label, p.title, 'product-heading') + '\n' +
    '          ' + blocksHtml(p.blocks, 'cs-list cs-list--dark', '          ') + '\n' +
    (p.link
      ? '          <p class="cs-product__link"><a href="' + b.esc(p.link.href) + '" target="_blank" rel="noopener">' + b.esc(p.link.text) + ' \u2192</a></p>\n'
      : '') +
    '        </div>\n' +
    (slides
      ? '        <div class="cs-gallery reveal" data-cs-carousel role="region" aria-roledescription="carousel" aria-label="' +
        b.esc(p.galleryLabel || 'Image gallery') +
        '" tabindex="0">\n' +
        '          <div class="cs-gallery__viewport">\n' +
        '            <button type="button" class="cs-gallery__btn cs-gallery__btn--prev" aria-label="Previous">\n' +
        '              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true"><path d="M12.5 15 7.5 10l5-5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>\n' +
        '            </button>\n' +
        '            <ul class="cs-gallery__track">\n' +
        slides +
        '\n' +
        '            </ul>\n' +
        '            <button type="button" class="cs-gallery__btn cs-gallery__btn--next" aria-label="Next">\n' +
        '              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true"><path d="m7.5 5 5 5-5 5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>\n' +
        '            </button>\n' +
        '          </div>\n' +
        (firstCaption
          ? '          <p class="cs-gallery__caption" aria-live="polite">' + firstCaption + '</p>\n'
          : '') +
        '        </div>\n'
      : '') +
    '      </div>\n' +
    (p.quote ? quoteHtml(p.quote, 'cs-quote cs-quote--feature reveal', '      ') : '') +
    '    </div>\n' +
    (slides ? CS_GALLERY_SCRIPT : '') +
    '  </section>\n'
  );
}

function studyHtml(s) {
  var stats = (s.stats || [])
    .map(function (st) {
      return (
        '        <div class="cs-stat">\n' +
        '          <p class="cs-stat__num">' +
        b.esc(st.num) +
        '</p>\n' +
        '          <p class="cs-stat__label">' +
        b.esc(st.label) +
        '</p>\n' +
        '        </div>'
      );
    })
    .join('\n');

  var stack = (s.stack || [])
    .map(function (item) {
      return (
        '            <div class="cs-stack__item">\n' +
        '              <img src="' +
        b.esc(item.src) +
        '" alt="" width="69" height="61" loading="lazy">\n' +
        '              <span>' +
        b.esc(item.label) +
        '</span>\n' +
        '            </div>'
      );
    })
    .join('\n');

  var roles;
  if (s.rolesHiredLayout === 'card') {
    roles =
      '        <div class="cs-about-card">\n' +
      '          <h3>ROLES HIRED</h3>\n' +
      '          <ul class="cs-role-list">' +
      (s.rolesHired || [])
        .map(function (role) {
          return '<li>' + b.esc(role) + '</li>';
        })
        .join('') +
      '</ul>\n' +
      '        </div>';
  } else {
    roles =
      '      <div class="cs-roles">\n' +
      '        <h3>ROLES HIRED</h3>\n' +
      '        <ul class="cs-pills">' +
      (s.rolesHired || [])
        .map(function (role) {
          return '<li>' + b.esc(role) + '</li>';
        })
        .join('') +
      '</ul>\n' +
      '      </div>';
  }

  var quote = '';
  if (s.quote) {
    quote = quoteHtml(
      { text: s.quote, author: s.quoteAuthor, role: s.quoteRole, photo: s.quotePhoto },
      'cs-quote',
      '        '
    );
  }

  var productSection = productSectionHtml(s.productSection);

  var listIntro = s.challengeListIntro
    ? '<p>' +
      (s.challengeListIntroBold
        ? '<strong>' + b.esc(s.challengeListIntro) + '</strong>'
        : b.esc(s.challengeListIntro)) +
      '</p>\n'
    : '';

  return (
    '<main id="main" class="cs-page">\n' +
    '  <section class="cs-hero" id="hero" aria-labelledby="hero-title"' +
    (s.heroBg
      ? ' style="background-image:url(\'' + b.esc(s.heroBg) + '\')"'
      : '') +
    '>\n' +
    '    <div class="wrap cs-hero__grid">\n' +
    '      <div class="reveal">\n' +
    '        <p class="eyebrow">' +
    b.esc(s.heroEyebrow || 'CASE STUDY') +
    '</p>\n' +
    '        <h1 class="h1 cs-hero__title" id="hero-title">' +
    b.esc(s.h1 || '') +
    '</h1>\n' +
    '        <p class="lead">' +
    b.esc(s.heroLead) +
    '</p>\n' +
    '        <div class="btn-row">\n' +
    '          <a class="btn btn--primary" href="/contact/">Contact Us</a>\n' +
    '        </div>\n' +
    '      </div>\n' +
    heroLogoBlock(s) +
    '    </div>\n' +
    '  </section>\n' +
    b.trustBar() +
    '\n' +
    productSection +
    '  <section class="section cs-summary" id="summary" aria-labelledby="summary-heading">\n' +
    '    <div class="wrap cs-summary__grid">\n' +
    '      <div class="reveal">\n' +
    '        ' +
    kickerHeading('The Summary', s.summaryTitle, 'summary-heading') +
    '\n' +
    '        <p class="cs-summary__lead">' +
    b.esc(s.summary) +
    '</p>\n' +
    (s.summaryBlocks
      ? '        ' + blocksHtml(s.summaryBlocks, 'cs-list cs-list--dark', '        ') + '\n'
      : '') +
    '      </div>\n' +
    '      <div class="cs-stats reveal">\n' +
    stats +
    '\n      </div>\n' +
    '    </div>\n' +
    '  </section>\n' +
    '  <section class="cs-challenge" id="challenge" aria-labelledby="challenge-heading">\n' +
    '    <div class="wrap cs-challenge__grid">\n' +
    '      <div class="reveal">\n' +
    '        ' +
    kickerHeading('The Challenge', s.challengeTitle, 'challenge-heading') +
    '\n' +
    (s.challengeBlocks
      ? '        ' + blocksHtml(s.challengeBlocks, 'cs-list', '        ')
      : (s.challengeLead ? '        <p>' + b.esc(s.challengeLead) + '</p>\n' : '') +
        '        ' +
        listIntro +
        (s.challengeBoldPhrases
          ? b.challengeListUl(s.challengeItems, 'cs-list', s.challengeBoldPhrases)
          : b.ul(s.challengeItems, 'cs-list')) +
        (s.challengeClose ? '\n        <p>' + b.esc(s.challengeClose) + '</p>' : '')) +
    '\n      </div>\n' +
    '      <div class="cs-challenge__aside reveal">\n' +
    '        <div class="cs-about-card">\n' +
    '          <h3>' +
    b.esc(s.aboutTitle) +
    '</h3>\n' +
    '          <p>' +
    b.esc(s.about) +
    '</p>\n' +
    '          <hr>\n' +
    '          <h3>' +
    b.esc(s.serviceModelLabel) +
    '</h3>\n' +
    '          <p><a href="' +
    b.esc(s.serviceModelHref) +
    '">' +
    b.esc(s.serviceModelText) +
    ' →</a></p>\n' +
    '        </div>\n' +
    '        <p class="cs-stack-label">Technologies Used</p>\n' +
    '        <div class="cs-stack">\n' +
    stack +
    '\n        </div>\n' +
    '      </div>\n' +
    '    </div>\n' +
    '  </section>\n' +
    '  <section class="section cs-solution" id="solution" aria-labelledby="solution-heading">\n' +
    '    <div class="wrap">\n' +
    '      ' +
    kickerHeading('The Solution', s.solutionTitle, 'solution-heading') +
    '\n' +
    '      <div class="cs-solution__grid">\n' +
    '        <div class="reveal">\n' +
    (s.solutionBlocks
      ? '          ' + blocksHtml(s.solutionBlocks, 'cs-list cs-list--dark', '          ') + '\n'
      : '          <p>' +
        b.esc(s.solutionLead) +
        '</p>\n' +
        (s.solutionListIntro ? '          <p>' + b.esc(s.solutionListIntro) + '</p>\n' : '') +
        b.solutionListUl(s.solutionItems, 'cs-list cs-list--dark') +
        '\n          <p>' +
        b.inlineStrong(s.solutionClose, s.solutionCloseBold) +
        '</p>\n') +
    '        </div>\n' +
    '        <div class="reveal">\n' +
    quote +
    (s.rolesHiredLayout === 'card' ? roles : '') +
    '\n        </div>\n' +
    '      </div>\n' +
    (s.rolesHiredLayout === 'card' ? '' : roles + '\n') +
    '      ' +
    b.inlineCtaBar({
      text: s.inlineCta,
    }) +
    '\n    </div>\n' +
    '  </section>\n' +
    '  <section class="section cs-why" id="trust" aria-labelledby="trust-heading">\n' +
    '    <div class="wrap cs-why__grid">\n' +
    '      <div class="reveal">\n' +
    '        ' +
    trustHeading() +
    '\n' +
    '        <img class="cs-why__photo" src="/images/pages/case-studies/why-engineers.png" alt="Software engineers collaborating in a modern workspace" width="478" height="255" loading="lazy">\n' +
    '        <div class="btn-row">\n' +
    '          <a class="btn btn--primary" href="/contact/">Contact Us</a>\n' +
    '        </div>\n' +
    '      </div>\n' +
    '      <div class="reveal">\n' +
    b.checkList(s.trustItems || TRUST) +
    '\n      </div>\n' +
    '    </div>\n' +
    '  </section>\n' +
    '  <section class="section" id="process" aria-labelledby="process-heading">\n' +
    '    <div class="wrap process-layout">\n' +
    '      <div class="process-layout__copy reveal">\n' +
    '        <h2 class="h2" id="process-heading"><span class="accent">Our Process:</span> What to Expect.</h2>\n' +
    b.processList() +
    '\n      </div>\n' +
    '      <div class="process-layout__aside reveal">\n' +
    '        <img src="/images/pages/staff-augmentation/process.png" alt="Software engineer on a video call wearing a headset" width="286" height="379" loading="lazy">\n' +
    '      </div>\n' +
    '    </div>\n' +
    '  </section>\n' +
    b.closingCta({
      heading: 'Ready to Start? Receive a Shortlist in 72 hours.',
      body: 'Stop Searching, Start Shipping',
      label: 'Schedule a Call',
      href: 'https://calendly.com/tim-salsamobi/30min',
    }) +
    '\n</main>\n'
  );
}

data.studies.forEach(function (s) {
  fs.writeFileSync(path.join(outDir, s.slug + '.html'), studyHtml(s));
});
console.log('case study fragments:', data.studies.length);

/**
 * Starter template preview: design/case-study-template.html
 * Same renderer as production (Live CGI is the reference layout), filled with
 * {{placeholders}} from data/case-studies.js templateStudy. Links the shared
 * stylesheets instead of embedding them. Not part of the site build.
 */
function templatePage() {
  return (
    '<!DOCTYPE html>\n' +
    '<!--\n' +
    '  CASE STUDY STARTER TEMPLATE (generated, do not hand-edit)\n' +
    '  Layout = Live CGI case study. Production pages are NOT built from this file.\n' +
    '  They come from data/case-studies.js + build-case-studies.js (fragments/case-studies/<slug>.html)\n' +
    '  then build-pages.js (case-studies/<slug>/index.html).\n' +
    '\n' +
    '  To start a new case study:\n' +
    '    1. Copy the livecgi entry in data/case-studies.js (or templateStudy) and set a new slug.\n' +
    '    2. Replace every {{placeholder}} with the client\'s exact copy.\n' +
    '    3. Add images: /images/pages/case-studies/<slug>-hero.jpg, -logo.png, -quote.png.\n' +
    '    4. node build-case-studies.js && node build-pages.js\n' +
    '\n' +
    '  Optional fields: heroLogo (null hides the hero logo), challengeBoldPhrases, challengeListIntro\n' +
    '  (+ challengeListIntroBold), solutionListIntro, solutionCloseBold, rolesHiredLayout: "card".\n' +
    '  CSS is shared: styles/landing-page.css (.cs-* classes). Do not fork a stylesheet.\n' +
    '  Preview: npm run dev  ->  http://127.0.0.1:4323/design/case-study-template.html\n' +
    '-->\n' +
    '<html lang="en">\n' +
    '<head>\n' +
    '  <meta charset="utf-8">\n' +
    '  <meta name="viewport" content="width=device-width, initial-scale=1.0">\n' +
    '  <meta name="robots" content="noindex, nofollow">\n' +
    '  <title>Case study starter template | BetterEngineer (not production)</title>\n' +
    '  <link rel="icon" href="/icons/favicon.png" type="image/png">\n' +
    '  <link rel="preconnect" href="https://fonts.googleapis.com">\n' +
    '  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>\n' +
    '  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:ital,wght@0,300;0,400;0,500;0,600;0,700;1,400&display=swap" rel="stylesheet">\n' +
    '  <link rel="stylesheet" href="/styles/brand.css">\n' +
    '  <link rel="stylesheet" href="/styles/landing-page.css">\n' +
    '</head>\n' +
    '<body>\n' +
    studyHtml(data.templateStudy) +
    '</body>\n' +
    '</html>\n'
  );
}

var designDir = path.join(__dirname, 'design');
fs.mkdirSync(designDir, { recursive: true });
fs.writeFileSync(path.join(designDir, 'case-study-template.html'), templatePage());
console.log('case study template: design/case-study-template.html');
