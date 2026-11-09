/**
 * Careers hub and the roles BetterEngineer places.
 * These are not live job openings. US companies ask for a skill, and
 * BetterEngineer introduces vetted engineers from the network.
 * Edit this file, then run `node build-careers.js`.
 */
'use strict';

var WWW = 'https://www.betterengineer.com';

var data = {
  hub: {
    title: 'Software engineer jobs in Latin America | BetterEngineer',
    description:
      'Roles BetterEngineer places with US product teams: senior engineers in Latin America, on a full-time contract, working US business hours.',
    h1: 'Roles we place with US product teams',
    lead:
      'These pages are not open jobs. US companies ask us for a skill, and we introduce vetted senior engineers from our network. Active client openings are posted on LinkedIn.',
    openingsHeading: 'Roles we place',
    openingsLead:
      'Each role is a full-time contract with a US product team. You work US business hours from Latin America.',
    selectHeading: 'Other roles we place',
    perks: [
      {
        title: 'Work in the client codebase.',
        body: 'You join a US product team and ship in their repo, their standups, and their code reviews.',
      },
      {
        title: 'Full-time contract, paid monthly.',
        body: 'The monthly amount stays the same. You are paid in US dollars. Candidates never pay anything.',
      },
      {
        title: 'Latin America, US business hours.',
        body: 'Engineers live in Mexico, Costa Rica, Colombia, Peru, Brazil, Chile, Argentina, and Uruguay.',
      },
    ],
  },
  shared: {
    roleMeta: [
      { id: 'remote', label: 'Remote, US business hours' },
      { id: 'employment', label: 'Full-time contract' },
      { id: 'location', label: 'Latin America' },
    ],
    applyLabel: 'Join the network',
    applyHref: 'https://app.betterengineer.com/sign-up/candidate',
    linkedInHref: 'https://www.linkedin.com/company/betterengineer/jobs/',
    englishNote:
      'You need advanced or fluent English. You will be in standups, code reviews, and Slack with a US team.',
    aiNote:
      'Every engineer is assessed on the four-level AI fluency scale before a client meets them.',
    aiHref: '/ai-fluent-engineers/',
    poolNote:
      'This is not a single opening. When a US company asks for this skill, we introduce engineers from the network.',
    checkNote:
      'We review work you have shipped. A keyword on a resume is not enough.',
    placement:
      'You join the client team and work in their repo, their standups, and their code reviews. You work US business hours from Mexico, Costa Rica, Colombia, Peru, Brazil, Chile, Argentina, or Uruguay. The placement is almost always a full-time contract. You are paid the same amount every month in US dollars. The monthly invoice is for bookkeeping. Candidates never pay to apply or to join.',
    about:
      'BetterEngineer introduces senior engineers in Mexico, Costa Rica, Colombia, Peru, Brazil, Chile, Argentina, and Uruguay to US product teams. You work in the client repo. Candidates never pay anything.',
    communityHeading: 'How joining works',
    communityLead:
      'Create a profile. We review your technical work, your English, and your AI fluency, then introduce you when a client asks for your skill.',
    updatedLabel: 'Updated November 9, 2026',
    joinHref: '/join/',
  },
  retired: [
    { slug: 'cordova-c-engineer', to: '/careers/react-native-engineer/' },
    { slug: 'groovy-on-grails-engineer', to: '/careers/java-engineer/' },
    { slug: 'openstack-engineer', to: '/careers/devops-engineer/' },
    { slug: 'peoplesoft-consultant', to: '/careers/' },
    { slug: 'drupal-engineer', to: '/careers/wordpress-engineer/' },
    { slug: 'ms-dynamics-crm-engineer', to: '/careers/' },
    { slug: 'cloudops-engineer', to: '/careers/devops-engineer/' },
    { slug: 'e-commerce-engineer', to: '/careers/shopify-engineer/' },
    { slug: 'project-manager', to: '/careers/' },
    { slug: 'elixir-engineer', to: '/careers/' },
    { slug: 'scala-engineer', to: '/careers/' },
    { slug: 'embedded-software-engineer', to: '/careers/' },
    { slug: 'magneto-engineer', to: '/careers/magento-engineer/' },
  ],
  jobs: require('./career-roles.js'),
};

function pageRecords() {
  var hub = {
    slug: 'careers',
    fragment: 'fragments/careers/index.html',
    outputs: ['careers/index.html'],
    cssBundle: 'landing',
    script: 'page.js',
    migrated: true,
    excludeFromDiscover: true,
    navActive: 'join',
    title: data.hub.title,
    description: data.hub.description,
    canonical: WWW + '/careers',
    breadcrumb: [{ name: 'Home', url: WWW + '/' }, { name: 'Careers' }],
    lastUpdated: '2026-11-09',
    extraSchema: function (ctx) {
      return [{
        '@context': 'https://schema.org',
        '@type': 'CollectionPage',
        name: data.hub.title,
        url: ctx.canonical,
        hasPart: data.jobs.map(function (item) {
          return { '@type': 'WebPage', name: item.name, url: WWW + '/careers/' + item.slug };
        }),
      }];
    },
  };
  var jobPages = data.jobs.map(function (item) {
    return {
      slug: 'careers-' + item.slug,
      fragment: 'fragments/careers/' + item.slug + '.html',
      outputs: ['careers/' + item.slug + '/index.html'],
      cssBundle: 'landing',
      script: 'page.js',
      migrated: true,
      excludeFromDiscover: true,
      navActive: 'join',
      title: item.title,
      description: item.description,
      canonical: WWW + '/careers/' + item.slug,
      breadcrumb: [
        { name: 'Home', url: WWW + '/' },
        { name: 'Careers', url: WWW + '/careers' },
        { name: item.name },
      ],
      lastUpdated: '2026-11-09',
    };
  });
  return [hub].concat(jobPages);
}

module.exports = {
  WWW: WWW,
  hub: data.hub,
  shared: data.shared,
  jobs: data.jobs,
  retired: data.retired,
  pageRecords: pageRecords,
};
