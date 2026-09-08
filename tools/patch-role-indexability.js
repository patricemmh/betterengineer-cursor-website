'use strict';

/**
 * One-shot indexability patches for role pages that predate the technology
 * generator: missing schema, missing social tags, and FAQ JSON-LD drift.
 * Safe to re-run. Does not change visible copy except FAQ schema names that
 * already differed from the on-page questions.
 */
var fs = require('fs');
var path = require('path');

var ROOT = path.join(__dirname, '..');
var OG = 'https://discover.betterengineer.com/images/roles/shared/cta-band-mask.png';
var WWW = 'https://www.betterengineer.com';
var DISCOVER = 'https://discover.betterengineer.com';

var ORG = {
  '@type': 'Organization',
  '@id': WWW + '/#organization',
  name: 'BetterEngineer',
  url: WWW + '/',
  logo: WWW + '/icons/betterengineer-logo.svg',
  sameAs: [
    'https://www.linkedin.com/company/salsamobi',
    'https://www.facebook.com/BetterEngineerbySalsaMobi',
    'https://www.instagram.com/betterengineer_/',
  ],
};

var ROLES = [
  { slug: 'front-end-engineers', name: 'Front-end engineers' },
  { slug: 'full-stack-engineers', name: 'Full stack engineers' },
  { slug: 'back-end-engineers', name: 'Back end engineers' },
  { slug: 'mobile-engineers', name: 'Mobile engineers' },
  { slug: 'ai-engineers', name: 'AI engineers' },
  { slug: 'data-engineers', name: 'Data engineers' },
  { slug: 'data-science-engineers', name: 'Data science engineers' },
  { slug: 'devops-engineers', name: 'DevOps engineers' },
  { slug: 'qa-engineers', name: 'QA engineers' },
  { slug: 'blockchain-engineers', name: 'Blockchain engineers' },
];

function socialTags(title, description) {
  return (
    '<meta property="og:image" content="' + OG + '">' +
    '<meta property="og:image:width" content="1200">' +
    '<meta property="og:image:height" content="630">' +
    '<meta name="twitter:card" content="summary_large_image">' +
    '<meta name="twitter:title" content="' + title + '">' +
    '<meta name="twitter:description" content="' + description + '">' +
    '<meta name="twitter:image" content="' + OG + '">'
  );
}

function insertSocial(html) {
  if (html.indexOf('property="og:image"') !== -1) return html;
  var title = (html.match(/<title>([^<]*)<\/title>/) || [])[1];
  var desc = (html.match(/name="description" content="([^"]*)"/) || [])[1];
  if (!title || !desc) throw new Error('missing title or description');
  var needle = '<meta property="og:type" content="website">';
  if (html.indexOf(needle) === -1) throw new Error('missing og:type');
  return html.replace(needle, needle + socialTags(title, desc));
}

function ldScript(obj) {
  return '<script type="application/ld+json">' + JSON.stringify(obj) + '</script>';
}

function patchRolePage(slug, service) {
  var file = path.join(ROOT, 'roles', slug, 'index.html');
  var html = fs.readFileSync(file, 'utf8');
  html = insertSocial(html);

  var url = DISCOVER + '/roles/' + slug + '/';
  var re = /<script type="application\/ld\+json">([\s\S]*?)<\/script>/;
  var m = html.match(re);
  if (!m) throw new Error(slug + ' has no JSON-LD');
  var data = JSON.parse(m[1]);
  var faq = data['@graph']
    ? data['@graph'].filter(function (n) { return n['@type'] === 'FAQPage'; })[0]
    : data;
  if (!faq || faq['@type'] !== 'FAQPage') throw new Error(slug + ' missing FAQPage');

  if (slug === 'front-end-engineers') {
    faq.mainEntity.forEach(function (q) {
      if (q.name.indexOf('vetted') !== -1) {
        q.name = 'How are BetterEngineer front-end engineers vetted?';
      }
      if (q.name.indexOf('types of companies') !== -1) {
        q.name = 'What kinds of companies get the most value from your front-end engineers?';
      }
    });
  }

  var graph = {
    '@context': 'https://schema.org',
    '@graph': [
      ORG,
      {
        '@type': 'Service',
        '@id': url + '#service',
        name: service.name,
        serviceType: service.serviceType,
        url: url,
        provider: { '@id': WWW + '/#organization' },
        areaServed: 'United States',
        audience: {
          '@type': 'Audience',
          audienceType: service.audience,
        },
        description: service.description,
      },
      {
        '@type': 'BreadcrumbList',
        '@id': url + '#breadcrumb',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: WWW + '/' },
          { '@type': 'ListItem', position: 2, name: 'Roles', item: DISCOVER + '/roles/' },
          { '@type': 'ListItem', position: 3, name: service.crumb, item: url },
        ],
      },
      {
        '@type': 'FAQPage',
        '@id': url + '#faq-schema',
        mainEntity: faq.mainEntity,
      },
    ],
  };

  html = html.replace(re, ldScript(graph));
  fs.writeFileSync(file, html);
  console.log('patched ' + path.relative(ROOT, file));
}

function patchRolesHub() {
  var file = path.join(ROOT, 'roles', 'index.html');
  var html = fs.readFileSync(file, 'utf8');
  html = insertSocial(html);

  var url = DISCOVER + '/roles/';
  var itemList = ROLES.map(function (r, i) {
    return {
      '@type': 'ListItem',
      position: i + 1,
      name: r.name,
      url: DISCOVER + '/roles/' + r.slug + '/',
    };
  });
  var blocks =
    ldScript({ '@context': 'https://schema.org', '@type': 'Organization',
      name: ORG.name, url: ORG.url, logo: ORG.logo, sameAs: ORG.sameAs }) +
    ldScript({
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: WWW + '/' },
        { '@type': 'ListItem', position: 2, name: 'Roles', item: url },
      ],
    }) +
    ldScript({
      '@context': 'https://schema.org',
      '@type': 'CollectionPage',
      name: 'Software Engineering Roles',
      url: url,
      description: 'Hire vetted senior nearshore engineers by role. U.S. hours overlap, senior-only talent, matched in as little as 72 hours.',
      isPartOf: {
        '@type': 'WebSite',
        name: 'BetterEngineer',
        url: DISCOVER + '/',
        publisher: { '@type': 'Organization', name: ORG.name, url: ORG.url },
      },
      mainEntity: { '@type': 'ItemList', itemListElement: itemList },
    });

  if (html.indexOf('"@type":"CollectionPage"') === -1 && html.indexOf('"@type": "CollectionPage"') === -1) {
    var marker = '<!-- Structured data for SEO + answer engines (AEO) -->';
    if (html.indexOf(marker) === -1) throw new Error('roles hub missing structured data marker');
    html = html.replace(marker, marker + blocks);
  }

  var heroP = 'Hire vetted senior nearshore engineers by role. U.S. hours overlap, senior-only talent, matched in as little as 72 hours.';
  var heroLinked = heroP + ' You can also <a href="/technologies/">browse by technology</a>.';
  if (html.indexOf('browse by technology') === -1) {
    html = html.replace(
      '<p>' + heroP + '</p>',
      '<p>' + heroLinked + '</p>'
    );
  }

  fs.writeFileSync(file, html);
  console.log('patched ' + path.relative(ROOT, file));
}

patchRolePage('front-end-engineers', {
  name: 'Senior front-end engineer hiring',
  serviceType: 'Front-end engineering staff augmentation',
  audience: 'U.S. product and engineering teams hiring senior front-end engineers',
  description: 'BetterEngineer helps U.S. teams hire vetted senior nearshore front-end engineers matched to their stack, culture, and working hours.',
  crumb: 'Front-End Engineers',
});

patchRolePage('blockchain-engineers', {
  name: 'Senior blockchain engineer hiring',
  serviceType: 'Blockchain engineering staff augmentation',
  audience: 'U.S. product and engineering teams hiring senior blockchain engineers',
  description: 'BetterEngineer helps U.S. teams hire vetted senior nearshore blockchain engineers matched to their protocol, stack, and working hours.',
  crumb: 'Blockchain Engineers',
});

patchRolesHub();
