'use strict';

/**
 * Generate careers hub + job fragments from data/careers.js.
 * Shared HubSpot job architecture: data in, one template out.
 */

var fs = require('fs');
var path = require('path');
var b = require('./tools/migrated-blocks');
var data = require('./data/careers.js');

var root = __dirname;
var outDir = path.join(root, 'fragments', 'careers');

function ensureDir(dir) {
  fs.mkdirSync(dir, { recursive: true });
}

var CR_META_SVG_ATTRS =
  ' class="cr-meta__icon" width="22" height="22" viewBox="0 0 24 24" aria-hidden="true" focusable="false" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"';

function crMetaIconSvg(id) {
  if (id === 'remote') {
    return (
      '<svg' +
      CR_META_SVG_ATTRS +
      '><path d="M12 21s6-4.5 6-10a6 6 0 1 0-12 0c0 5.5 6 10 6 10z"/><circle cx="12" cy="11" r="2.25"/></svg>'
    );
  }
  if (id === 'employment') {
    return (
      '<svg' +
      CR_META_SVG_ATTRS +
      '><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/><circle cx="12" cy="15.5" r="2.25"/><path d="M12 14.25V16l.75.75"/></svg>'
    );
  }
  if (id === 'location') {
    return (
      '<svg' +
      CR_META_SVG_ATTRS +
      '><path d="M8 4 5 7v14l3-2 5 3 5-3 3 2V7l-3-3-5 3-5-3z"/><path d="M8 4v14l5 3 5-3V4"/></svg>'
    );
  }
  return '';
}

function roleMetaItems() {
  if (data.shared.roleMeta && data.shared.roleMeta.length) {
    return data.shared.roleMeta;
  }
  var fallbackIds = ['remote', 'employment', 'location'];
  return (data.shared.chips || []).map(function (label, index) {
    return { id: fallbackIds[index] || 'remote', label: label };
  });
}

function roleMetaListHtml() {
  return roleMetaItems()
    .map(function (item) {
      return (
        '          <li class="cr-meta__item cr-meta__item--' +
        b.esc(item.id) +
        '">' +
        crMetaIconSvg(item.id) +
        '<span class="cr-meta__label">' +
        b.esc(item.label) +
        '</span></li>'
      );
    })
    .join('\n');
}

function jobList(jobs, extraClass) {
  return (
    '        <ul class="cr-job-list' +
    (extraClass ? ' ' + extraClass : '') +
    '">\n' +
    jobs
      .map(function (job) {
        return (
          '          <li><a href="/careers/' +
          job.slug +
          '/">' +
          b.esc(job.name) +
          '</a></li>'
        );
      })
      .join('\n') +
    '\n        </ul>'
  );
}

function hubHtml() {
  var perks = data.hub.perks
    .map(function (perk) {
      return (
        '          <div class="cr-perk">\n' +
        '            <h3>' +
        b.esc(perk.title) +
        '</h3>\n' +
        '            <p>' +
        b.esc(perk.body) +
        '</p>\n' +
        '          </div>'
      );
    })
    .join('\n');

  return (
    '<main id="main" class="cr-page">\n' +
    '  <section class="cr-hero" id="hero" aria-labelledby="hero-title">\n' +
    '    <div class="wrap cr-hero__grid">\n' +
    '      <div class="reveal">\n' +
    '        <p class="eyebrow">For engineers / Job opportunities</p>\n' +
    '        <h1 class="h1" id="hero-title"><span class="light">Join our network of better</span> engineers, where talent has no borders.</h1>\n' +
    '        <p class="lead">' +
    b.esc(data.hub.lead) +
    '</p>\n' +
    '        <div class="btn-row">\n' +
    '          <a class="btn btn--primary" href="' +
    b.esc(data.shared.applyHref) +
    '">' +
    b.esc(data.shared.applyLabel) +
    '</a>\n' +
    '        </div>\n' +
    '      </div>\n' +
    '      <div class="cr-hero__map reveal">\n' +
    '        <img src="/images/pages/join/betterengineer-map-joinus.png" alt="Map of BetterEngineer talent across the Americas" width="1100" height="800" loading="eager">\n' +
    '      </div>\n' +
    '    </div>\n' +
    '  </section>\n' +
    '  <section class="section cr-openings" id="openings" aria-labelledby="openings-heading">\n' +
    '    <div class="wrap">\n' +
    '      <div class="air-section-head">\n' +
    '        <p class="eyebrow">Open roles</p>\n' +
    '        <h2 class="h2" id="openings-heading">' +
    b.esc(data.hub.openingsHeading) +
    '</h2>\n' +
    '        <p class="lead">' +
    b.esc(data.hub.openingsLead) +
    ' <a href="' +
    b.esc(data.shared.applyHref) +
    '">Send us your resume</a></p>\n' +
    '      </div>\n' +
    jobList(data.jobs) +
    '\n    </div>\n' +
    '  </section>\n' +
    '  <section class="section cr-perks" id="perks" aria-labelledby="perks-heading">\n' +
    '    <div class="wrap">\n' +
    '      <div class="air-section-head">\n' +
    '        <p class="eyebrow">For engineers</p>\n' +
    '        <h2 class="h2" id="perks-heading">Why engineers join BetterEngineer</h2>\n' +
    '      </div>\n' +
    '      <div class="cr-perks__grid">\n' +
    '      <div class="reveal">\n' +
    perks +
    '\n      </div>\n' +
    '      <div class="cr-perks__photo reveal">\n' +
    '        <img src="/images/pages/careers/perks.png" alt="" width="720" height="900" loading="lazy">\n' +
    '      </div>\n' +
    '      </div>\n' +
    '    </div>\n' +
    '  </section>\n' +
    b.communityBanner({
      eyebrow: 'Join us',
      heading: data.shared.communityHeading,
      lead: data.shared.communityLead,
      href: data.shared.applyHref,
    }) +
    '\n</main>\n'
  );
}

function jobHtml(job) {
  var otherJobs = data.jobs.filter(function (j) {
    return j.slug !== job.slug;
  });

  return (
    '<main id="main" class="cr-page cr-job">\n' +
    '  <section class="cr-job-hero" id="hero" aria-labelledby="hero-title">\n' +
    '    <div class="wrap cr-job-hero__grid">\n' +
    '      <div class="reveal">\n' +
    '        <p class="eyebrow"><a href="/careers/">Careers</a></p>\n' +
    '        <h1 class="h1" id="hero-title">' +
    b.esc(job.name) +
    '</h1>\n' +
    '        <ul class="cr-meta" aria-label="Role details">\n' +
    roleMetaListHtml() +
    '\n        </ul>\n' +
    '        <div class="btn-row">\n' +
    '          <a class="btn btn--primary" href="' +
    b.esc(data.shared.applyHref) +
    '">' +
    b.esc(data.shared.applyLabel) +
    '</a>\n' +
    '        </div>\n' +
    '      </div>\n' +
    '      <div class="cr-job-hero__photo reveal">\n' +
    '        <img src="/images/pages/careers/work-from-home.jpg" alt="" width="720" height="480" loading="eager">\n' +
    '      </div>\n' +
    '    </div>\n' +
    '  </section>\n' +
    '  <section class="section cr-jd" id="description" aria-labelledby="jd-heading">\n' +
    '    <div class="wrap cr-jd__grid">\n' +
    '      <div class="reveal">\n' +
    '        <h2 class="h2" id="jd-heading">Job Description</h2>\n' +
    '        <p>' +
    b.esc(job.intro) +
    '</p>\n' +
    b.ul(job.duties, 'cs-list cs-list--dark') +
    '\n        <h2 class="h2" id="req-heading">Job Requirements</h2>\n' +
    b.ul(job.requirements, 'cs-list cs-list--dark') +
    '\n        <p class="cr-jd__emphasis">' +
    b.esc(data.shared.englishNote) +
    '</p>\n' +
    '        <h2 class="h2" id="additional-heading">Additional Information</h2>\n' +
    '        <p>' +
    b.esc(data.shared.additionalNote) +
    '</p>\n' +
    '      </div>\n' +
    '      <aside class="cr-about reveal">\n' +
    '        <p>' +
    b.esc(data.shared.about) +
    '</p>\n' +
    '      </aside>\n' +
    '    </div>\n' +
    '  </section>\n' +
    b.communityBanner({
      heading: data.shared.communityHeading,
      lead: data.shared.communityLead,
      href: data.shared.applyHref,
    }) +
    '\n  <section class="section cr-openings" id="more-jobs" aria-labelledby="more-jobs-heading">\n' +
    '    <div class="wrap">\n' +
    '      <h2 class="h2" id="more-jobs-heading">' +
    b.esc(data.hub.selectHeading) +
    '</h2>\n' +
    jobList(otherJobs) +
    '\n      <p class="cr-all"><a href="/careers/">See all job opportunities</a></p>\n' +
    '    </div>\n' +
    '  </section>\n' +
    '</main>\n'
  );
}

ensureDir(outDir);
fs.writeFileSync(path.join(outDir, 'index.html'), hubHtml());
data.jobs.forEach(function (job) {
  fs.writeFileSync(path.join(outDir, job.slug + '.html'), jobHtml(job));
});
console.log('careers fragments:', 1 + data.jobs.length);
