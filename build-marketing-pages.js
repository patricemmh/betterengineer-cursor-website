'use strict';

var fs = require('fs');
var path = require('path');
var data = require('./data/marketing-pages');

var root = __dirname;
var brandCss = fs.readFileSync(path.join(root, 'styles', 'brand.css'), 'utf8');
var landingCss = fs.readFileSync(path.join(root, 'styles', 'landing-page.css'), 'utf8');

var extraCss = [
  '.people-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(220px,1fr));gap:1rem}',
  '.person-card{background:#fff;border:1px solid var(--color-border);border-radius:var(--radius-md);padding:1.25rem 1.4rem}',
  '.person-role{margin:0;font-size:.75rem;font-weight:700;letter-spacing:.06em;text-transform:uppercase;color:var(--color-primary)}',
  '.person-card h3{margin:.35rem 0 0;font-size:1.1rem}',
  '.mkt-card-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(240px,1fr));gap:1rem}',
  '.mkt-card{display:block;border:1px solid var(--color-border);border-radius:var(--radius-md);padding:1.25rem;background:#fff;color:inherit;text-decoration:none}',
  'a.mkt-card:hover{box-shadow:var(--shadow-soft);border-color:var(--color-primary)}',
  '.mkt-card h3{margin:0 0 .5rem;font-size:1.05rem;color:var(--color-text)}',
  '.mkt-card p{margin:0;color:var(--color-muted)}',
  '.mkt-prose{max-width:46rem}',
  '.mkt-prose p{margin:0 0 1rem}',
  '.rebuild-group{margin:2.25rem 0}',
  '.rebuild-group h2{margin:0 0 .75rem}',
  '.rebuild-list{display:grid;gap:.4rem}',
  '.rebuild-list a{font-weight:600}',
  '.rebuild-note{color:var(--color-muted);max-width:40rem}'
].join('\n');

var css = brandCss + '\n' + landingCss + '\n' + extraCss;

function localizeUrls(html) {
  var pairs = [
    ['https://www.betterengineer.com/staff-augmentation', '/staff-augmentation/'],
    ['https://www.betterengineer.com/ai-readiness-manufacturing', '/ai-readiness-manufacturing/'],
    ['https://www.betterengineer.com/ai-readiness', '/ai-readiness/'],
    ['https://www.betterengineer.com/hiring-dashboard', '/hiring-dashboard/'],
    ['https://www.betterengineer.com/about', '/about/'],
    ['https://www.betterengineer.com/latamengineer', '/latamengineer/'],
    ['https://www.betterengineer.com/fintech', '/fintech/'],
    ['https://www.betterengineer.com/martech', '/martech/'],
    ['https://www.betterengineer.com/healthtech', '/healthtech/'],
    ['https://www.betterengineer.com/join', '/join/'],
    ['https://www.betterengineer.com/faqs-nearshore-software-engineers-staff-augmentation-ai-talent', '/faqs-nearshore-software-engineers-staff-augmentation-ai-talent/'],
    ['https://www.betterengineer.com/ebooks', '/ebooks/'],
    ['https://www.betterengineer.com/podcast', '/podcast/'],
    ['https://www.betterengineer.com/case-studies/livecgi', '/case-studies/livecgi/'],
    ['https://www.betterengineer.com/case-studies/wasteplace', '/case-studies/wasteplace/'],
    ['https://www.betterengineer.com/multi-step-contact-form', '/multi-step-contact-form/'],
    ['https://www.betterengineer.com/contact', '/contact/'],
    ['https://www.betterengineer.com/terms-of-service', '/terms-of-service/'],
    ['https://www.betterengineer.com/resource-center/wpautoterms/privacy-policy', '/privacy-policy/'],
    ['https://www.betterengineer.com/careers/full-stack-javascript-engineer', '/careers/full-stack-javascript-engineer/'],
    ['https://www.betterengineer.com/careers/front-end-engineer', '/careers/front-end-engineer/'],
    ['https://www.betterengineer.com/careers/python-engineer', '/careers/python-engineer/'],
    ['https://www.betterengineer.com/careers/devops-engineer', '/careers/devops-engineer/'],
    ['https://www.betterengineer.com/careers', '/careers/'],
    ['https://www.betterengineer.com/technical-glossary', '/technical-glossary/'],
    ['https://discover.betterengineer.com/roles/', '/roles/'],
    ['https://discover.betterengineer.com/technologies/', '/technologies/'],
    ['https://discover.betterengineer.com/ai-fluent-engineers/', '/services/hire-ai-ready-engineers/'],
    ['https://www.betterengineer.com/', '/']
  ];
  var out = html;
  pairs.forEach(function (pair) {
    out = out.split(pair[0]).join(pair[1]);
  });
  return out;
}

var footer = localizeUrls(fs.readFileSync(path.join(root, 'footer-full.html'), 'utf8').trim())
  .replace(/src="\.\//g, 'src="/')
  .replace(/href="\.\//g, 'href="/');

var header = localizeUrls(
  '  <header class="site-header" id="header">\n' +
    '    <div class="header-inner">\n' +
    '      <a class="logo-link" href="https://www.betterengineer.com/" aria-label="BetterEngineer home">\n' +
    '        <img src="/icons/betterengineer-logo.svg" alt="BetterEngineer" width="183" height="33">\n' +
    '      </a>\n' +
    '      <nav class="site-nav" aria-label="Primary">\n' +
    '        <ul class="nav-desktop" role="list">\n' +
    '          <li class="has-children">\n' +
    '            <a href="https://www.betterengineer.com/staff-augmentation">Services <span class="nav-chevron" aria-hidden="true"></span></a>\n' +
    '            <ul class="dropdown" role="list">\n' +
    '              <li><a href="https://www.betterengineer.com/staff-augmentation">Staff Augmentation</a></li>\n' +
    '              <li><a href="https://www.betterengineer.com/ai-readiness">AI Readiness</a></li>\n' +
    '              <li><a href="https://www.betterengineer.com/hiring-dashboard">Platform</a></li>\n' +
    '              <li><a href="https://discover.betterengineer.com/roles/">Browse Roles</a></li>\n' +
    '              <li><a href="https://discover.betterengineer.com/technologies/">Browse by Technology</a></li>\n' +
    '            </ul>\n' +
    '          </li>\n' +
    '          <li><a href="https://discover.betterengineer.com/ai-fluent-engineers/">AI Fluency</a></li>\n' +
    '          <li class="has-children">\n' +
    '            <a href="https://www.betterengineer.com/about">About <span class="nav-chevron" aria-hidden="true"></span></a>\n' +
    '            <ul class="dropdown" role="list">\n' +
    '              <li><a href="https://www.betterengineer.com/about">Who We Are</a></li>\n' +
    '              <li><a href="https://www.betterengineer.com/latamengineer">Why Nearshore</a></li>\n' +
    '            </ul>\n' +
    '          </li>\n' +
    '          <li class="has-children">\n' +
    '            <a href="https://blog.betterengineer.com/resource-center">Resources <span class="nav-chevron" aria-hidden="true"></span></a>\n' +
    '            <ul class="dropdown" role="list">\n' +
    '              <li><a href="https://blog.betterengineer.com/resource-center">Blog</a></li>\n' +
    '              <li><a href="https://www.betterengineer.com/faqs-nearshore-software-engineers-staff-augmentation-ai-talent">FAQs</a></li>\n' +
    '              <li><a href="https://www.betterengineer.com/podcast">Podcast</a></li>\n' +
    '            </ul>\n' +
    '          </li>\n' +
    '          <li><a href="https://www.betterengineer.com/join">Join Us</a></li>\n' +
    '          <li><a class="nav-pill-hire" href="https://www.betterengineer.com/multi-step-contact-form">Hire Engineers</a></li>\n' +
    '          <li><a href="https://app.betterengineer.com/sign-in?redirect_url=https%3A%2F%2Fapp.betterengineer.com%2F">Login</a></li>\n' +
    '        </ul>\n' +
    '      </nav>\n' +
    '      <button type="button" class="nav-toggle" aria-expanded="false" aria-controls="mobile-menu" id="nav-toggle" aria-label="Open menu">\n' +
    '        <img src="/icons/hamburger-white.svg" alt="" width="30" height="30">\n' +
    '      </button>\n' +
    '    </div>\n' +
    '    <ul class="nav-mobile" id="mobile-menu" role="list">\n' +
    '      <li class="has-children">\n' +
    '        <a href="https://www.betterengineer.com/staff-augmentation">Services</a>\n' +
    '        <ul class="mobile-submenu" role="list">\n' +
    '          <li><a href="https://www.betterengineer.com/staff-augmentation">Staff Augmentation</a></li>\n' +
    '          <li><a href="https://www.betterengineer.com/ai-readiness">AI Readiness</a></li>\n' +
    '          <li><a href="https://www.betterengineer.com/hiring-dashboard">Platform</a></li>\n' +
    '          <li><a href="https://discover.betterengineer.com/roles/">Browse Roles</a></li>\n' +
    '          <li><a href="https://discover.betterengineer.com/technologies/">Browse by Technology</a></li>\n' +
    '        </ul>\n' +
    '      </li>\n' +
    '      <li><a href="https://discover.betterengineer.com/ai-fluent-engineers/">AI Fluency</a></li>\n' +
    '      <li class="has-children">\n' +
    '        <a href="https://www.betterengineer.com/about">About</a>\n' +
    '        <ul class="mobile-submenu" role="list">\n' +
    '          <li><a href="https://www.betterengineer.com/about">Who We Are</a></li>\n' +
    '          <li><a href="https://www.betterengineer.com/latamengineer">Why Nearshore</a></li>\n' +
    '        </ul>\n' +
    '      </li>\n' +
    '      <li class="has-children">\n' +
    '        <a href="https://blog.betterengineer.com/resource-center">Resources</a>\n' +
    '        <ul class="mobile-submenu" role="list">\n' +
    '          <li><a href="https://blog.betterengineer.com/resource-center">Blog</a></li>\n' +
    '          <li><a href="https://www.betterengineer.com/faqs-nearshore-software-engineers-staff-augmentation-ai-talent">FAQs</a></li>\n' +
    '          <li><a href="https://www.betterengineer.com/podcast">Podcast</a></li>\n' +
    '        </ul>\n' +
    '      </li>\n' +
    '      <li><a href="https://www.betterengineer.com/join">Join Us</a></li>\n' +
    '      <li><a class="nav-mobile-hire" href="https://www.betterengineer.com/multi-step-contact-form">Hire Engineers</a></li>\n' +
    '      <li><a href="https://app.betterengineer.com/sign-in?redirect_url=https%3A%2F%2Fapp.betterengineer.com%2F">Login</a></li>\n' +
    '    </ul>\n' +
    '  </header>\n'
);

function esc(str) {
  return String(str || '').replace(/"/g, '&quot;');
}

function formCard(page) {
  var title = page.formTitle || 'Tell us what you need';
  var submit = page.formSubmit || 'Send message';
  return (
    '<div class="hero-form__card react-hero-side-card react-intake-card">' +
    '<p class="eyebrow">Get a reply within one business day</p>' +
    '<h2 class="hero-form__title">' +
    title +
    '</h2>' +
    '<form id="react-intake-form" class="react-intake-form" novalidate>' +
    '<div class="form-grid">' +
    '<div class="form-field"><label for="firstname">First name *</label><input id="firstname" name="firstname" type="text" autocomplete="given-name" required placeholder="First name *"></div>' +
    '<div class="form-field"><label for="lastname">Last name *</label><input id="lastname" name="lastname" type="text" autocomplete="family-name" required placeholder="Last name *"></div>' +
    '<div class="form-field form-field--full"><label for="email">Work email *</label><input id="email" name="email" type="email" autocomplete="email" required placeholder="Work email *"></div>' +
    '<div class="form-field form-field--full"><label for="message">Current stack, team size, and what you need to ship *</label><textarea id="message" name="message" rows="3" required placeholder="Current stack, team size, and what you need to ship *"></textarea></div>' +
    '</div>' +
    '<div aria-hidden="true" style="position:absolute;left:-10000px;top:auto;width:1px;height:1px;overflow:hidden;pointer-events:none"><label for="company_website">Leave this field empty</label><input type="text" name="company_website" id="company_website" tabindex="-1" autocomplete="off" value=""></div>' +
    '<input type="hidden" name="utm_campaign" id="utm_campaign" value="">' +
    '<input type="hidden" name="utm_content" id="utm_content" value="">' +
    '<input type="hidden" name="utm_medium" id="utm_medium" value="">' +
    '<input type="hidden" name="utm_source" id="utm_source" value="">' +
    '<p class="form-privacy-note">By submitting, you agree to be contacted about your request.</p>' +
    '<button class="btn btn--primary react-intake-submit" type="submit">' +
    submit +
    '</button>' +
    '<p id="react-intake-status" class="form-status" role="status" aria-live="polite"></p>' +
    '</form></div>'
  );
}

function faqSection(faqs) {
  if (!faqs || !faqs.length) return '';
  var items = faqs
    .map(function (faq, i) {
      var open = i === 0;
      return (
        '<div class="faq-item' +
        (open ? ' is-open' : '') +
        '"><button type="button" aria-expanded="' +
        (open ? 'true' : 'false') +
        '"><span class="faq-question">' +
        faq.q +
        '</span><span class="chevron" aria-hidden="true"></span></button><div class="faq-panel"' +
        (open ? '' : ' hidden') +
        '><p>' +
        faq.a +
        '</p></div></div>'
      );
    })
    .join('');
  return (
    '<section class="section" id="faq"><div class="wrap"><h2 class="h2 reveal">Frequently asked <span class="accent">questions</span></h2><div class="faq-list reveal" id="faq-list">' +
    items +
    '</div></div></section>'
  );
}

function ctaBand() {
  return (
    '<section class="cta-band" id="cta"><div class="cta-split"><div class="cta-split__text"><div class="cta-split__text-inner reveal">' +
    '<h2 class="h2">Want to <strong>build something great</strong> together?</h2>' +
    '<p class="lead">Tell us the role and the stack. We introduce senior engineers who can work in your hours and stay with the team.</p>' +
    '<div class="btn-row"><a class="btn btn--primary" href="/multi-step-contact-form/">Find better talent today</a></div>' +
    '</div></div>' +
    '<div class="cta-split__photo reveal"><img src="/images/team/betterengineer-team-group-photo-full.png" alt="BetterEngineer team" loading="lazy" width="1200" height="900"></div>' +
    '</div></section>'
  );
}

function pageMain(page) {
  var heroInner =
    '<div class="reveal"><p class="eyebrow">' +
    page.eyebrow +
    '</p><h1 class="h1">' +
    page.h1 +
    '</h1><p class="lead">' +
    page.lead +
    '</p></div>';
  if (page.showForm) {
    heroInner =
      '<div class="wrap hero-grid">' +
      heroInner +
      '<div class="hero-visual reveal">' +
      formCard(page) +
      '</div></div>';
  } else {
    heroInner = '<div class="wrap">' + heroInner + '</div>';
  }
  return (
    '<main id="main" class="air-page">' +
    '<section class="hero section">' +
    heroInner +
    '</section>' +
    (page.body || '') +
    faqSection(page.faqs) +
    ctaBand() +
    '</main>'
  );
}

function shell(title, description, mainHtml) {
  return (
    '<!DOCTYPE html>\n<html lang="en">\n<head>\n' +
    '  <meta charset="utf-8">\n' +
    '  <meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover">\n' +
    '  <title>' +
    title +
    '</title>\n' +
    '  <meta name="description" content="' +
    esc(description) +
    '">\n' +
    '  <link rel="icon" href="/icons/favicon.png" type="image/png">\n' +
    '  <link rel="preconnect" href="https://fonts.googleapis.com">\n' +
    '  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>\n' +
    '  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:ital,wght@0,300;0,400;0,500;0,600;0,700;1,400&display=swap" rel="stylesheet">\n' +
    '  <style>\n' +
    css +
    '\n  </style>\n</head>\n<body>\n' +
    '  <a class="skip-link" href="#main">Skip to content</a>\n' +
    header +
    '\n' +
    mainHtml +
    '\n' +
    footer +
    '\n' +
    '  <script src="/intake-form-shared.js" defer></script>\n' +
    '  <script src="/landing-page.js" defer></script>\n' +
    '</body>\n</html>\n'
  );
}

function writePage(relDir, html) {
  var dir = path.join(root, relDir);
  fs.mkdirSync(dir, { recursive: true });
  var htmlPath = path.join(dir, 'index.html');
  fs.writeFileSync(htmlPath, html);
  if (/[\u2014]/.test(html)) {
    console.error('Em dash found in', relDir);
    process.exit(1);
  }
}

data.pages.forEach(function (page) {
  writePage(page.path, shell(page.title, page.description, pageMain(page)));
});

data.jobs.forEach(function (job) {
  var page = {
    eyebrow: 'Careers',
    h1: 'Senior ' + job.name + ' roles',
    lead:
      'Join BetterEngineer for long-term placements with U.S. product teams. Apply through Join Us and we will match you to open ' +
      job.name.toLowerCase() +
      ' searches.',
    body:
      '<section class="section section-tint"><div class="wrap"><div class="btn-row reveal">' +
      '<a class="btn btn--primary" href="https://app.betterengineer.com/sign-up/candidate" rel="noopener noreferrer">Create a candidate account</a>' +
      '<a class="btn btn--outline" href="/join/">Why join BetterEngineer</a>' +
      '</div></div></section>'
  };
  var main = pageMain(page);
  writePage(
    'careers/' + job.slug,
    shell(
      job.name + ' Jobs | BetterEngineer',
      'Apply for senior ' + job.name + ' roles through BetterEngineer. Remote work with U.S. hours overlap.',
      main
    )
  );
});

var groups = [
  {
    title: 'Already in this rebuild',
    links: [
      ['/', 'Home (cleaned staff-augmentation home)'],
      ['/services/hire-ai-ready-engineers/', 'Hire AI-ready engineers'],
      ['/services/ai-systems-readiness-for-manufacturing/', 'AI systems readiness for manufacturing'],
      ['/roles/', 'Roles hub'],
      ['/technologies/', 'Technologies hub']
    ]
  },
  {
    title: 'Core HubSpot pages now on localhost',
    links: [
      ['/about/', 'About / Who We Are'],
      ['/contact/', 'Contact'],
      ['/multi-step-contact-form/', 'Hire Engineers form'],
      ['/staff-augmentation/', 'Staff Augmentation'],
      ['/ai-readiness/', 'AI Readiness'],
      ['/hiring-dashboard/', 'Hiring Dashboard'],
      ['/latamengineer/', 'Why Nearshore'],
      ['/join/', 'Join Us'],
      ['/faqs-nearshore-software-engineers-staff-augmentation-ai-talent/', 'FAQs'],
      ['/ebooks/', 'Ebooks'],
      ['/podcast/', 'Podcast'],
      ['/technical-glossary/', 'Technical Glossary'],
      ['/careers/', 'Careers']
    ]
  },
  {
    title: 'Industries and case studies',
    links: [
      ['/fintech/', 'FinTech'],
      ['/martech/', 'MarTech'],
      ['/healthtech/', 'HealthTech'],
      ['/case-studies/livecgi/', 'Live CGI'],
      ['/case-studies/wasteplace/', 'WastePlace'],
      ['/case-studies/securelink/', 'SecureLink']
    ]
  },
  {
    title: 'Campaign pages',
    links: [
      ['/roi/', 'R&D ROI'],
      ['/hire-software-engineers-in-72-hours/', 'Hire in 72 hours'],
      ['/hire-senior-full-stack-engineers-nearshore-latam-talent/', 'Hire senior full stack'],
      ['/hire-senior-python-engineers-nearshore-latam-talent/', 'Hire senior Python'],
      ['/hire-senior-ai-data-engineers-nearshore-latam-talent/', 'Hire senior AI and data'],
      ['/ai-readiness-manufacturing/', 'AI readiness for manufacturing'],
      ['/webinar/', 'Webinar'],
      ['/aiwebinar/', 'AI webinar'],
      ['/youvegotllm/', 'You have an LLM']
    ]
  },
  {
    title: 'Legal shells',
    links: [
      ['/privacy-policy/', 'Privacy Policy (preview shell)'],
      ['/terms-of-service/', 'Terms of Service (preview shell)']
    ]
  }
];

var rebuildBody =
  '<main id="main"><section class="hero section"><div class="wrap reveal">' +
  '<p class="eyebrow">Local rebuild index</p>' +
  '<h1 class="h1">HubSpot pages on localhost</h1>' +
  '<p class="lead rebuild-note">These are the cleaned static rebuilds of the www.betterengineer.com marketing pages. Header and footer links stay on localhost while you preview.</p>' +
  '</div></section><section class="section"><div class="wrap">';

groups.forEach(function (group) {
  rebuildBody +=
    '<div class="rebuild-group reveal"><h2 class="h2">' +
    group.title +
    '</h2><div class="rebuild-list">';
  group.links.forEach(function (link) {
    rebuildBody += '<a href="' + link[0] + '">' + link[1] + '</a>';
  });
  rebuildBody += '</div></div>';
});

rebuildBody +=
  '<div class="rebuild-group reveal"><h2 class="h2">Careers job pages</h2><div class="rebuild-list">';
data.jobs.forEach(function (job) {
  rebuildBody += '<a href="/careers/' + job.slug + '/">' + job.name + '</a>';
});
rebuildBody += '</div></div></div></section></main>';

writePage(
  'rebuild',
  shell(
    'Local rebuild index | BetterEngineer',
    'Index of HubSpot marketing pages rebuilt as static pages for local preview.',
    rebuildBody
  )
);

console.log(
  'Wrote',
  data.pages.length,
  'marketing pages,',
  data.jobs.length,
  'career pages, and /rebuild/'
);
