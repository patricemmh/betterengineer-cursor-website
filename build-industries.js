'use strict';

/**
 * Generate industry landing fragments from data/industries.js.
 * Layout follows the live HubSpot vertical pages, not a generic card system.
 */

var fs = require('fs');
var path = require('path');
var b = require('./tools/migrated-blocks');
var data = require('./data/industries.js');

var outDir = path.join(__dirname, 'fragments', 'industries');
fs.mkdirSync(outDir, { recursive: true });

var CHOOSE_US_SUFFIX = ' Choose Us';

function whyHeadingHtml(heading) {
  if (heading.slice(-CHOOSE_US_SUFFIX.length) === CHOOSE_US_SUFFIX) {
    return (
      b.esc(heading.slice(0, -CHOOSE_US_SUFFIX.length)) +
      ' <span class="accent">Choose Us</span>'
    );
  }
  return b.esc(heading);
}

function midCtaHtml(ind) {
  if (!ind.midCta) return '';
  return (
    '<section class="ind-mid air-mid-cta" aria-labelledby="mid-cta-heading">\n' +
    '  <div class="wrap">\n' +
    '    <div class="air-mid-cta__card reveal">\n' +
    '      <img class="air-mid-cta__image" src="/images/roles/shared/cta-band-mask.png" alt="Engineer on a call" width="260" height="96" loading="lazy">\n' +
    '      <h2 class="air-mid-cta__title" id="mid-cta-heading">' +
    b.esc(ind.midCta) +
    '</h2>\n' +
    '      <a class="btn air-mid-cta__button" href="/multi-step-contact-form/">Let\'s Talk</a>\n' +
    '    </div>\n' +
    '  </div>\n' +
    '</section>\n'
  );
}

function clusterHtml(cluster, idx) {
  var items = cluster.items
    .map(function (item) {
      return (
        '        <article class="ind-pair__item reveal">\n' +
        '          <img class="ind-pair__icon" src="/images/pages/industries/icon-shield-check.svg" alt="" width="44" height="44" loading="lazy">\n' +
        '          <div class="ind-pair__text">\n' +
        '            <h3>' +
        b.esc(item.title) +
        '</h3>\n' +
        '            <p>' +
        b.esc(item.body) +
        '</p>\n' +
        '          </div>\n' +
        '        </article>'
      );
    })
    .join('\n');
  var id = 'cluster-' + (idx + 1);
  return (
    '<section class="section ind-cluster" id="' +
    id +
    '" aria-labelledby="' +
    id +
    '-heading">\n' +
    '  <div class="wrap">\n' +
    '    <h2 class="ind-cluster__title" id="' +
    id +
    '-heading">' +
    b.esc(cluster.title) +
    '</h2>\n' +
    (cluster.lead ? '    <p class="lead">' + b.esc(cluster.lead) + '</p>\n' : '') +
    '    <div class="ind-pair">\n' +
    items +
    '\n    </div>\n' +
    '  </div>\n' +
    '</section>'
  );
}

function industryHtml(ind) {
  var visualHero = ind.heroLayout === 'visual';
  var heroAside = visualHero
    ? '      <div class="ind-hero__visual reveal">\n        <img src="' +
      b.esc(ind.heroImage) +
      '" alt="" width="1056" height="772" loading="eager">\n      </div>\n'
    : '      <div class="ind-hero__form reveal">\n' +
      b.techIntakeCard({
        name: ind.name,
        title: 'Book a 20-minute intro and tell us about your ' + ind.name + ' project.',
        placeholder: ind.formPlaceholder,
      }) +
      '\n      </div>\n';
  var heroCta = visualHero
    ? '        <div class="btn-row">\n          <a class="btn btn--primary" href="/contact/">Contact Us</a>\n        </div>\n'
    : '';
  return (
    '<main id="main" class="ind-page">\n' +
    '  <section class="hero section ind-hero" id="hero" aria-labelledby="hero-title">\n' +
    '    <div class="wrap ind-hero__grid">\n' +
    '      <div class="reveal">\n' +
    '        <p class="eyebrow">' +
    b.esc((ind.heroEyebrow || ind.name + ' ENGINEERING TALENT').toUpperCase()) +
    '</p>\n' +
    '        <h1 class="h1 ind-hero__title" id="hero-title">' +
    b.esc(ind.h1) +
    '</h1>\n' +
    '        <p class="lead">' +
    b.esc(ind.heroLead) +
    '</p>\n' +
    heroCta +
    '      </div>\n' +
    heroAside +
    '    </div>\n' +
    '  </section>\n' +
    b.airStatsStrip() +
    '\n' +
    b.trustBar() +
    '\n' +
    '  <section class="section ind-solutions" id="solutions" aria-labelledby="solutions-heading">\n' +
    '    <div class="wrap">\n' +
    '      <h2 class="h2" id="solutions-heading">' +
    b.esc(ind.solutionsHeading) +
    '</h2>\n' +
    '    </div>\n' +
    '  </section>\n' +
    ind.clusters
      .map(function (cluster, idx) {
        return clusterHtml(cluster, idx) + (idx === 1 ? '\n' + midCtaHtml(ind) : '');
      })
      .join('\n') +
    '\n' +
    '  <section class="section cs-why" id="why" aria-labelledby="why-heading">\n' +
    '    <div class="wrap cs-why__grid">\n' +
    '      <div class="reveal">\n' +
    '        <h2 class="h2" id="why-heading">' +
    whyHeadingHtml(ind.reasonsHeading) +
    '</h2>\n' +
    (ind.solutionsImage
      ? '        <img class="cs-why__photo" src="' +
        b.esc(ind.solutionsImage) +
        '" alt="" width="478" height="255" loading="lazy">\n'
      : '') +
    '        <div class="btn-row">\n' +
    '          <a class="btn btn--primary" href="/contact/">Contact Us</a>\n' +
    '        </div>\n' +
    '      </div>\n' +
    '      <div class="reveal">\n' +
    b.checkList(ind.reasons) +
    '\n      </div>\n' +
    '    </div>\n' +
    '  </section>\n' +
    b.techLogoWall() +
    '\n' +
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
    '  <section class="section section-tint" id="faq" aria-labelledby="faq-heading">\n' +
    '    <div class="wrap">\n' +
    '      <div class="reveal air-section-head">\n' +
    '        <p class="eyebrow">FAQ</p>\n' +
    '        <h2 class="h2" id="faq-heading">Frequently Asked Questions</h2>\n' +
    '      </div>\n' +
    b.faqList(ind.faqs) +
    '\n    </div>\n' +
    '  </section>\n' +
    '  <section class="section" id="guesswork" aria-labelledby="guesswork-heading">\n' +
    '    <div class="wrap">\n' +
    '      <h2 class="h2" id="guesswork-heading">' +
    b.esc(ind.ctaLead) +
    '</h2>\n' +
    '      <p class="lead">You\'ve probably tried generic staffing or freelancers before. We\'re different on purpose: fewer candidates, much deeper vetting, and a focus on engineers who care about outcomes, not just experiments.</p>\n' +
    '      <div class="btn-row">\n' +
    '        <a class="btn btn--primary" href="/contact/">Almost there, let\'s connect to help your team.</a>\n' +
    '      </div>\n' +
    '    </div>\n' +
    '  </section>\n' +
    b.closingCta({
      heading: 'Say goodbye to endless job boards. Find your better engineer.',
      body: 'Stop Searching, Start Shipping',
      label: 'Schedule Your Call',
      href: '/contact/',
    }) +
    '\n</main>\n'
  );
}

function hubHtml() {
  var items = data.industries
    .filter(function (ind) {
      return ind.status === 'published';
    })
    .map(function (ind) {
      return (
        '          <li><a href="/' +
        ind.slug +
        '/">' +
        b.esc(ind.name) +
        '</a></li>'
      );
    })
    .join('\n');

  return (
    '<main id="main" class="ind-page">\n' +
    '  <section class="hero section" id="hero" aria-labelledby="hero-title">\n' +
    '    <div class="wrap">\n' +
    '      <p class="eyebrow">INDUSTRIES</p>\n' +
    '      <h1 class="h1" id="hero-title">Hire senior engineers who already know your industry.</h1>\n' +
    '      <p class="lead">Start with FinTech, MarTech, or HealthTech. Each page covers how we staff that vertical, which skills we screen for, and how U.S. teams meet pre-vetted nearshore engineers.</p>\n' +
    '    </div>\n' +
    '  </section>\n' +
    '  <section class="section cr-openings" id="list" aria-labelledby="list-heading">\n' +
    '    <div class="wrap">\n' +
    '      <div class="cr-rule"></div>\n' +
    '      <h2 class="h2" id="list-heading">Industry pages</h2>\n' +
    '      <ul class="cr-job-list">\n' +
    items +
    '\n      </ul>\n' +
    '    </div>\n' +
    '  </section>\n' +
    '</main>\n'
  );
}

data.industries
  .filter(function (ind) {
    return ind.status === 'published';
  })
  .forEach(function (ind) {
    if (/—/.test(JSON.stringify(ind))) {
      console.error('em dash in industry data:', ind.slug);
      process.exit(1);
    }
    fs.writeFileSync(path.join(outDir, ind.slug + '.html'), industryHtml(ind));
  });
fs.writeFileSync(path.join(outDir, 'index.html'), hubHtml());
console.log('industry fragments:', data.industries.length + 1);
