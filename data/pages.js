'use strict';

/**
 * Static marketing page manifest.
 *
 * `build-pages.js` iterates this array. Adding a page means adding a record here
 * plus a `main-<slug>.html` fragment. It does not mean copying 25 lines of build
 * script. See docs/site-migration/technical-debt.md TD-13.
 *
 * @typedef {Object} PageRecord
 * @property {string}   slug            Stable identifier, also the URL segment for migrated pages.
 * @property {string}   fragment        Path to the <main> fragment, relative to repo root.
 * @property {string[]} outputs         Output paths written by the build, relative to the output root.
 * @property {"home"|"landing"} cssBundle  Which inlined CSS bundle to use.
 * @property {string}   script          Page script filename.
 * @property {string}   title           <title> content. For migrated pages this is the live title, verbatim.
 * @property {string}   description     <meta name="description">. For migrated pages this is the live description, verbatim.
 * @property {string|function} [canonical]  Canonical URL, or a function of { siteBase, githubPagesCname }.
 * @property {Object}   [og]            { title, description, type, image } overrides. Falls back to title/description.
 * @property {boolean}  [twitter]       Emit Twitter card tags.
 * @property {string}   [robots]        Robots directive. Migrated pages carry the pre-cutover value.
 * @property {boolean}  [migrated]      True for pages migrated off HubSpot. Enables the full SEO and schema block.
 * @property {boolean}  [excludeFromDiscover]  Keep the page out of campaign-specific discover bundles.
 * @property {string}   [navActive]     Top level nav item to mark with aria-current.
 * @property {Array}    [breadcrumb]    [{ name, url }] trail. The last item may omit url.
 * @property {Object}   [service]       { name, serviceType } to emit a Service node.
 * @property {boolean}  [faqSchema]     Generate FAQPage JSON-LD by parsing the fragment's .faq-item blocks.
 *                                      This guarantees the schema always matches the visible text.
 * @property {string}   [lastUpdated]   "YYYY-MM", used for datePublished/dateModified on WebPage.
 * @property {string}   [sourceRecord]  Path to the migration extraction record.
 */

var WWW = 'https://www.betterengineer.com';
var DISCOVER = 'https://discover.betterengineer.com';

/* Shared Organization node. Kept identical to build-tech-pages.js ORG so both
   generators emit the same entity. */
var ORG = {
  '@type': 'Organization',
  name: 'BetterEngineer',
  url: WWW + '/',
  logo: WWW + '/icons/betterengineer-logo.svg',
  sameAs: [
    'https://www.linkedin.com/company/salsamobi',
    'https://www.facebook.com/BetterEngineerbySalsaMobi',
    'https://www.instagram.com/betterengineer_/',
  ],
};

/* These files are served from discover today. Pointing OG tags at www 404s. */
var OG_IMAGE = DISCOVER + '/images/roles/shared/trust-laptop.png';

/* Migrated pages stay out of the index until www is cut over to this build.
   See docs/site-migration/redirect-plan.md section 6. Set to null at cutover. */
var PRE_CUTOVER_ROBOTS = null;

function hireAiReadyCanonical(ctx) {
  if (ctx.siteBase === '/ai-fluent-engineers' && ctx.githubPagesCname) {
    return 'https://' + ctx.githubPagesCname + '/ai-fluent-engineers/';
  }
  return WWW + '/services/hire-ai-ready-engineers/';
}

var aiManufacturingDescription =
  'We help manufacturing companies audit disconnected ERP, CRM, sales, and operations systems, then build practical AI workflows and integrations that reduce manual work.';

var hireAiReadyDescription =
  'Hire AI-ready engineers, machine learning engineers, and AI app developers from Latin America. Senior, pre-vetted, and assessed for genuine AI fluency before you meet them.';

/* ── Existing pages ──────────────────────────────────────────────────────────
   These three predate the migration. Their head output must stay byte identical,
   so they carry only the fields they already had. Do not add og:image, twitter,
   robots, or schema to them without checking the diff. */

var existingPages = [
  {
    slug: 'home',
    fragment: 'main-home.html',
    outputs: ['index.html'],
    cssBundle: 'home',
    script: 'home.js',
    title: 'BetterEngineer | Staff Augmentation & Engineering Talent',
    description:
      'Scale your team with vetted software engineers across the Americas. Staff augmentation, Slack integration, and the BetterEngineer hiring platform.',
  },
  {
    slug: 'engineer-playlist',
    fragment: 'main-engineer-playlist.html',
    outputs: ['engineer-playlist/index.html'],
    cssBundle: 'landing',
    script: 'page.js',
    excludeFromDiscover: true,
    robots: 'noindex, follow',
    title: 'BetterEngineer Academy | AI Skills for Software Engineers',
    description:
      'Build practical AI engineering skills through 10 focused tracks and 30 curated lessons, all published in 2026.',
    canonical: WWW + '/engineer-playlist/',
    og: {
      title: 'BetterEngineer Academy | AI Skills for Software Engineers',
      description:
        'Ten AI skill tracks with beginner, intermediate, and advanced lessons for software engineers.',
      type: 'website',
    },
  },
  {
    slug: 'ai-systems-readiness-for-manufacturing',
    fragment: 'main-ai-systems-manufacturing.html',
    outputs: [
      'services/ai-systems-readiness-for-manufacturing/index.html',
      'ai-systems-readiness-for-manufacturing.html',
    ],
    cssBundle: 'landing',
    script: 'landing-page.js',
    title: 'AI Systems Readiness for Manufacturing Companies | BetterEngineer',
    description: aiManufacturingDescription,
    canonical: WWW + '/services/ai-systems-readiness-for-manufacturing/',
    og: {
      title: 'AI Systems Readiness for Manufacturing Companies | BetterEngineer',
      description: aiManufacturingDescription,
      type: 'website',
    },
  },
  {
    slug: 'hire-ai-ready-engineers',
    fragment: 'main-hire-ai-ready-engineers.html',
    outputs: [
      'services/hire-ai-ready-engineers/index.html',
      'hire-ai-ready-engineers.html',
    ],
    cssBundle: 'landing',
    script: 'landing-page.js',
    title: 'Hire AI-Ready Engineers | BetterEngineer, AI Development Team from LATAM',
    description: hireAiReadyDescription,
    canonical: hireAiReadyCanonical,
    og: {
      title: 'Hire AI-Ready Engineers | BetterEngineer',
      description: hireAiReadyDescription,
      type: 'website',
    },
  },
];

/* ── Phase 1 migrated pages ──────────────────────────────────────────────────
   Titles, descriptions, and canonicals are copied verbatim from the live HubSpot
   pages. Do not "improve" them here. Proposed changes go to
   docs/site-migration/seo-followups.md. */

var migratedPages = [
  {
    slug: 'staff-augmentation',
    fragment: 'main-staff-augmentation.html',
    outputs: ['staff-augmentation/index.html'],
    cssBundle: 'landing',
    script: 'page.js',
    migrated: true,
    navActive: 'services',
    title: 'Staff Augmentation | Nearshore Outsourcing Services & Remote Engineers',
    description:
      'Scale your software team with nearshore outsourcing and staff augmentation. Deep vetting, rapid delivery, and remote engineering talent you trust.',
    canonical: WWW + '/staff-augmentation',
    breadcrumb: [
      { name: 'Home', url: WWW + '/' },
      { name: 'Staff Augmentation' },
    ],
    service: {
      name: 'Software engineering staff augmentation',
      serviceType: 'Nearshore software engineering staff augmentation',
    },
    /* SEO-12: visible FAQ stays, FAQPage schema does not. 44 of the dedicated FAQ
       page's 53 questions are duplicated from these pages, so only /faqs-... emits
       the markup. Decision 2026-08-07. */
    faqSchema: false,
    lastUpdated: '2026-08',
    sourceRecord: 'docs/site-migration/pages/staff-augmentation.md',
  },
  {
    slug: 'ai-readiness',
    fragment: 'main-ai-readiness.html',
    outputs: ['ai-readiness/index.html'],
    cssBundle: 'landing',
    script: 'page.js',
    scripts: ['page.js', 'hs-lead-form.js'],
    migrated: true,
    navActive: 'services',
    title: 'Accelerate Your Business with Expert AI Strategy',
    description:
      'Unlock your business potential with our AI Readiness Assessment. Get expert analysis, tailored AI solutions, and a clear path to digital transformation.',
    canonical: WWW + '/ai-readiness',
    breadcrumb: [
      { name: 'Home', url: WWW + '/' },
      { name: 'AI Readiness' },
    ],
    service: {
      name: 'AI Readiness Assessment',
      serviceType: 'AI readiness assessment and strategy consulting',
    },
    /* SEO-12: visible FAQ stays, FAQPage schema does not. 44 of the dedicated FAQ
       page's 53 questions are duplicated from these pages, so only /faqs-... emits
       the markup. Decision 2026-08-07. */
    faqSchema: false,
    lastUpdated: '2026-08',
    sourceRecord: 'docs/site-migration/pages/ai-readiness.md',
  },
  {
    slug: 'hiring-dashboard',
    fragment: 'main-hiring-dashboard.html',
    outputs: ['hiring-dashboard/index.html'],
    cssBundle: 'landing',
    script: 'page.js',
    migrated: true,
    navActive: 'services',
    title: 'Remote Hiring Platform | Manage Software Engineer Recruitment',
    description:
      "Streamline software engineer hiring. Post jobs, track candidates, and make fast, data-driven hiring decisions with BetterEngineer's remote hiring platform.",
    canonical: WWW + '/hiring-dashboard',
    breadcrumb: [
      { name: 'Home', url: WWW + '/' },
      { name: 'Hiring Dashboard' },
    ],
    service: {
      name: 'BetterEngineer hiring platform',
      serviceType: 'Remote engineering hiring platform',
    },
    /* SEO-12: visible FAQ stays, FAQPage schema does not. 44 of the dedicated FAQ
       page's 53 questions are duplicated from these pages, so only /faqs-... emits
       the markup. Decision 2026-08-07. */
    faqSchema: false,
    lastUpdated: '2026-08',
    sourceRecord: 'docs/site-migration/pages/hiring-dashboard.md',
  },
  {
    slug: 'about',
    fragment: 'main-about.html',
    outputs: ['about/index.html'],
    cssBundle: 'landing',
    script: 'page.js',
    migrated: true,
    navActive: 'about',
    title: 'BetterEngineer | Your Remote Software Engineering Talent Partner',
    description:
      'As a specialized nearshore outsourcing company, BetterEngineer connects you to elite software engineer talent across Latin America.',
    canonical: WWW + '/about',
    breadcrumb: [
      { name: 'Home', url: WWW + '/' },
      { name: 'About' },
    ],
    /* SEO-12: visible FAQ stays, FAQPage schema does not. 44 of the dedicated FAQ
       page's 53 questions are duplicated from these pages, so only /faqs-... emits
       the markup. Decision 2026-08-07. */
    faqSchema: false,
    lastUpdated: '2026-08',
    sourceRecord: 'docs/site-migration/pages/about.md',
  },
  {
    slug: 'latamengineer',
    fragment: 'main-latamengineer.html',
    outputs: ['latamengineer/index.html'],
    cssBundle: 'landing',
    script: 'page.js',
    migrated: true,
    navActive: 'about',
    title: 'Hire Nearshore Software Engineers from Latin America',
    description:
      'Transform your business by hiring skilled software engineers from Latin America, benefiting from cost-effective solutions and a thriving tech talent pool.',
    canonical: WWW + '/latamengineer',
    breadcrumb: [
      { name: 'Home', url: WWW + '/' },
      { name: 'Why Nearshore' },
    ],
    service: {
      name: 'Nearshore software engineering hiring in Latin America',
      serviceType: 'Nearshore software engineering staff augmentation',
    },
    /* SEO-12: visible FAQ stays, FAQPage schema does not. 44 of the dedicated FAQ
       page's 53 questions are duplicated from these pages, so only /faqs-... emits
       the markup. Decision 2026-08-07. */
    faqSchema: false,
    lastUpdated: '2026-08',
    sourceRecord: 'docs/site-migration/pages/latamengineer.md',
  },
  {
    slug: 'contact',
    fragment: 'main-contact.html',
    outputs: ['contact/index.html'],
    cssBundle: 'landing',
    script: 'page.js',
    migrated: true,
    title: 'Contact BetterEngineer | Connect with Our Team',
    description:
      'Get in touch with BetterEngineer to hire engineers or explore AI solutions. Start your project with expert guidance today.',
    canonical: WWW + '/contact',
    breadcrumb: [
      { name: 'Home', url: WWW + '/' },
      { name: 'Contact' },
    ],
    /* SEO-12: visible FAQ stays, FAQPage schema does not. 44 of the dedicated FAQ
       page's 53 questions are duplicated from these pages, so only /faqs-... emits
       the markup. Decision 2026-08-07. */
    faqSchema: false,
    lastUpdated: '2026-08',
    sourceRecord: 'docs/site-migration/pages/contact.md',
  },
  {
    slug: 'join',
    fragment: 'main-join.html',
    outputs: ['join/index.html'],
    cssBundle: 'landing',
    script: 'page.js',
    migrated: true,
    navActive: 'join',
    title: 'Why Join BetterEngineer | Senior Software Engineer Jobs',
    description:
      'Grow your career with BetterEngineer. Connect with top US companies, work on impactful projects, and enjoy remote opportunities while earning in USD.',
    canonical: WWW + '/join',
    breadcrumb: [
      { name: 'Home', url: WWW + '/' },
      { name: 'Join Us' },
    ],
    /* SEO-12: visible FAQ stays, FAQPage schema does not. 44 of the dedicated FAQ
       page's 53 questions are duplicated from these pages, so only /faqs-... emits
       the markup. Decision 2026-08-07. */
    faqSchema: false,
    lastUpdated: '2026-08',
    sourceRecord: 'docs/site-migration/pages/join.md',
  },
];

/* ── Phase 2 migrated pages: resources and education ─────────────────────────
   Same rules as Phase 1. Titles, descriptions, and canonicals are verbatim from
   the live HubSpot pages unless a field did not exist there. */

var phase2Pages = [
  {
    slug: 'faqs',
    fragment: 'main-faqs.html',
    /* The live slug is 61 characters of keyword stuffing. It is preserved because
       moving an indexed URL costs more than a clean path is worth. A rename is
       proposed but not approved, see docs/site-migration/redirect-plan.md. */
    outputs: ['faqs-nearshore-software-engineers-staff-augmentation-ai-talent/index.html'],
    cssBundle: 'landing',
    script: 'page.js',
    migrated: true,
    title: 'FAQs | Nearshore Software Engineers, Staff Augmentation & AI Talent',
    description:
      'Find out about hiring nearshore Latin America software engineers, team augmentation, flexible staffing solutions, our custom hiring platform, and more.',
    canonical: WWW + '/faqs-nearshore-software-engineers-staff-augmentation-ai-talent',
    breadcrumb: [{ name: 'Home', url: WWW + '/' }, { name: 'FAQs' }],
    /* This page carries 53 questions, 44 of which also appear on a Phase 1 page.
       It is the canonical home for FAQPage markup. See seo-followups.md SEO-12. */
    faqSchema: true,
    lastUpdated: '2026-08',
    sourceRecord: 'docs/site-migration/pages/faqs.md',
  },
  {
    slug: 'podcast',
    fragment: 'main-podcast.html',
    outputs: ['podcast/index.html'],
    cssBundle: 'landing',
    script: 'page.js',
    scripts: ['page.js', 'hs-lead-form.js'],
    migrated: true,
    /* The live title tag is the single word "Podcast" and there is no meta
       description at all. Both are written here rather than migrated, because
       there is no source text to preserve. Logged as CF-60. */
    title: 'Off The Algorithm | The BetterEngineer Podcast',
    description:
      'Off The Algorithm is the BetterEngineer podcast on the future of software engineering, with senior engineers and technology leaders across the Americas.',
    canonical: WWW + '/podcast',
    breadcrumb: [{ name: 'Home', url: WWW + '/' }, { name: 'Podcast' }],
    lastUpdated: '2026-08',
    sourceRecord: 'docs/site-migration/pages/podcast.md',
  },
  {
    slug: 'ebooks',
    fragment: 'main-ebooks.html',
    outputs: ['ebooks/index.html'],
    cssBundle: 'landing',
    script: 'page.js',
    migrated: true,
    title: 'Engineering & AI Ebooks for Tech Leaders | BetterEngineer',
    description:
      'Download free guides built from real hiring data and implementation experience. Practical frameworks for tech leaders on AI strategy, team building, and engineering excellence.',
    canonical: WWW + '/ebooks',
    breadcrumb: [{ name: 'Home', url: WWW + '/' }, { name: 'Ebooks' }],
    lastUpdated: '2026-08',
    sourceRecord: 'docs/site-migration/pages/ebooks.md',
  },
  {
    slug: 'technical-glossary',
    /* Generated by build-glossary.js from data/glossary.js. Do not hand edit the
       fragment; edit the data file and rebuild. */
    fragment: 'main-technical-glossary.html',
    outputs: ['technical-glossary/index.html'],
    cssBundle: 'landing',
    script: 'page.js',
    migrated: true,
    title: 'Tech Glossary | Essential Terms for Software Industry Success | BetterEngineer',
    description:
      'Discover the BetterEngineer Tech Glossary, a curated list of essential terms in software engineering and AI built to help you scale your engineering org with confidence.',
    canonical: WWW + '/technical-glossary',
    breadcrumb: [{ name: 'Home', url: WWW + '/' }, { name: 'Technical Glossary' }],
    /* A glossary is the textbook DefinedTermSet case. Built from the same data
       that renders the page, so the two cannot drift. */
    extraSchema: function (ctx) {
      var terms = require('./glossary.js').terms;
      return [
        {
          '@context': 'https://schema.org',
          '@type': 'DefinedTermSet',
          name: 'BetterEngineer Technical Glossary',
          url: ctx.canonical,
          hasDefinedTerm: terms.map(function (t) {
            return {
              '@type': 'DefinedTerm',
              name: t.term,
              description: t.definition,
              url: ctx.canonical + '#' + t.slug,
              inDefinedTermSet: ctx.canonical,
            };
          }),
        },
      ];
    },
    lastUpdated: '2026-08',
    sourceRecord: 'docs/site-migration/pages/technical-glossary.md',
  },
];

var phase3Pages = require('./case-studies.js').pageRecords();

var phase4Pages = [
  {
    slug: 'privacy-policy',
    fragment: 'main-privacy-policy.html',
    outputs: ['resource-center/wpautoterms/privacy-policy/index.html'],
    cssBundle: 'landing',
    script: 'page.js',
    migrated: true,
    title: 'Privacy Policy | BetterEngineer',
    description: 'Privacy Policy | BetterEngineer',
    canonical: WWW + '/resource-center/wpautoterms/privacy-policy',
    breadcrumb: [{ name: 'Home', url: WWW + '/' }, { name: 'Privacy Policy' }],
    lastUpdated: '2026-08',
  },
  {
    slug: 'terms-of-service',
    fragment: 'main-terms-of-service.html',
    outputs: ['terms-of-service/index.html'],
    cssBundle: 'landing',
    script: 'page.js',
    migrated: true,
    title: 'Terms of Service | BetterEngineer',
    description: 'Terms of Service | BetterEngineer',
    canonical: WWW + '/terms-of-service',
    breadcrumb: [{ name: 'Home', url: WWW + '/' }, { name: 'Terms of Service' }],
    lastUpdated: '2021-07',
  },
];

var phase5Pages = [
  {
    slug: 'multi-step-contact-form',
    fragment: 'main-multi-step-contact-form.html',
    outputs: ['multi-step-contact-form/index.html'],
    cssBundle: 'landing',
    chrome: 'minimal',
    script: 'page.js',
    scripts: ['page.js', 'hire-flow.js'],
    migrated: true,
    robots: 'noindex, nofollow',
    title: 'Find Top Software Engineering Talent – Find the Right Candidates',
    description:
      'Tell us what you need in a software engineer, and we’ll match you with the right candidates. Start your search now with our simple multi-step form.',
    canonical: WWW + '/multi-step-contact-form',
    breadcrumb: [{ name: 'Home', url: WWW + '/' }, { name: 'Hire Engineers' }],
    lastUpdated: '2026-09',
  },
];

var leftoverHubSpotPages = [
  {
    slug: 'youvegotllm',
    fragment: 'main-youvegotllm.html',
    outputs: ['youvegotllm/index.html'],
    cssBundle: 'landing',
    script: 'page.js',
    migrated: true,
    title: "e-Books - You've got an LLM now what?",
    description:
      'Explore expert guidance, proven frameworks, and real-world risks when implementing AI solutions.',
    canonical: WWW + '/youvegotllm',
    breadcrumb: [{ name: 'Home', url: WWW + '/' }, { name: "You've got an LLM" }],
    lastUpdated: '2026-09',
  },
  {
    slug: 'hire-software-engineers-in-72-hours',
    fragment: 'main-hire-software-engineers-in-72-hours.html',
    outputs: ['hire-software-engineers-in-72-hours/index.html'],
    cssBundle: 'landing',
    script: 'page.js',
    scripts: ['page.js', 'hs-lead-form.js'],
    migrated: true,
    navActive: 'services',
    title: 'BetterEngineer | Hire Remote Software Developers',
    description:
      'Hire top remote software engineers in your timezone. BetterEngineer connects you with vetted talent for faster delivery and proven project results.',
    canonical: WWW + '/hire-software-engineers-in-72-hours',
    breadcrumb: [{ name: 'Home', url: WWW + '/' }, { name: 'Hire in 72 Hours' }],
    lastUpdated: '2026-09',
  },
];

var phase6Pages = require('./careers.js').pageRecords();
var phase8Pages = require('./industries.js').pageRecords();

/* Migrated pages are excluded from the discover bundle until cutover. Anything in
   this list must not appear in dist/sitemap.xml or dist/llms.txt. */
var allMigrated = migratedPages
  .concat(phase2Pages)
  .concat(phase3Pages)
  .concat(phase4Pages)
  .concat(phase5Pages)
  .concat(leftoverHubSpotPages)
  .concat(phase6Pages)
  .concat(phase8Pages);

var migratedSlugs = allMigrated.map(function (p) {
  return p.slug;
});

module.exports = {
  WWW: WWW,
  ORG: ORG,
  OG_IMAGE: OG_IMAGE,
  PRE_CUTOVER_ROBOTS: PRE_CUTOVER_ROBOTS,
  pages: existingPages.concat(allMigrated),
  existingPages: existingPages,
  migratedPages: allMigrated,
  phase1Pages: migratedPages,
  phase2Pages: phase2Pages,
  phase3Pages: phase3Pages,
  phase4Pages: phase4Pages,
  phase5Pages: phase5Pages,
  leftoverHubSpotPages: leftoverHubSpotPages,
  phase6Pages: phase6Pages,
  phase8Pages: phase8Pages,
  migratedSlugs: migratedSlugs,
};
