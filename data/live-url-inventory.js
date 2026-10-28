'use strict';

/**
 * Every public URL currently served by www.betterengineer.com.
 *
 * WHY THIS EXISTS
 *
 * Cutting `www` over to this build replaces the whole HubSpot site at once. Any live
 * URL that does not exist here, and has no redirect, becomes a 404 the moment DNS
 * flips. `tools/preflight.js` refuses to pass the cutover gate until every entry in
 * this file resolves to a built page or a planned redirect.
 *
 * THIS LIST IS NOT COMPLETE YET.
 *
 * It was seeded from the links found during Phase 1 extraction: the header, the
 * footer, and in-page CTAs. That only covers what is linked from the pages we read.
 * It will not include orphaned pages, old campaign landing pages, blog-adjacent
 * pages, or anything that only search engines know about.
 *
 * Before cutover, replace this seed with a real inventory from all three of:
 *
 *   1. HubSpot: Content > Website Pages and Landing Pages, export the full list.
 *   2. Google Search Console: Indexing > Pages, export every indexed URL.
 *   3. The live sitemap at https://www.betterengineer.com/sitemap.xml
 *
 * Union all three, dedupe, and set `verified: true` on the resulting list. Preflight
 * fails while any entry is still `verified: false`, which is deliberate.
 *
 * status values:
 *   'built'     a page exists in this repo at `localPath`
 *   'redirect'  no page here; must 301 to `redirectTo` at cutover
 *   'pending'   not built and no redirect decided. A cutover blocker.
 */

var urls = [
  /* Phase 1, built */
  { url: '/', status: 'built', localPath: 'index.html', phase: 1 },
  { url: '/staff-augmentation', status: 'built', localPath: 'staff-augmentation/index.html', phase: 1 },
  { url: '/ai-readiness', status: 'built', localPath: 'ai-readiness/index.html', phase: 1 },
  { url: '/hiring-dashboard', status: 'built', localPath: 'hiring-dashboard/index.html', phase: 1 },
  { url: '/about', status: 'built', localPath: 'about/index.html', phase: 1 },
  { url: '/latamengineer', status: 'built', localPath: 'latamengineer/index.html', phase: 1 },
  { url: '/contact', status: 'built', localPath: 'contact/index.html', phase: 1 },
  { url: '/join', status: 'built', localPath: 'join/index.html', phase: 1 },

  /* Service pages, built, currently published on discover */
  {
    url: '/services/hire-ai-ready-engineers/',
    status: 'built',
    localPath: 'services/hire-ai-ready-engineers/index.html',
    phase: 0,
  },
  {
    url: '/services/ai-systems-readiness-for-manufacturing/',
    status: 'built',
    localPath: 'services/ai-systems-readiness-for-manufacturing/index.html',
    phase: 0,
  },

  /* Phase 2, resources. Built. */
  {
    url: '/faqs-nearshore-software-engineers-staff-augmentation-ai-talent',
    status: 'built',
    localPath: 'faqs-nearshore-software-engineers-staff-augmentation-ai-talent/index.html',
    phase: 2,
  },
  { url: '/podcast', status: 'built', localPath: 'podcast/index.html', phase: 2 },
  { url: '/ebooks', status: 'built', localPath: 'ebooks/index.html', phase: 2 },
  { url: '/technical-glossary', status: 'built', localPath: 'technical-glossary/index.html', phase: 2 },

  /* Phase 3, case studies. Built. */
  { url: '/case-studies/livecgi', status: 'built', localPath: 'case-studies/livecgi/index.html', phase: 3 },
  { url: '/case-studies/wasteplace', status: 'built', localPath: 'case-studies/wasteplace/index.html', phase: 3 },
  { url: '/case-studies/securelink', status: 'built', localPath: 'case-studies/securelink/index.html', phase: 3 },
  { url: '/case-studies/hydrow', status: 'built', localPath: 'case-studies/hydrow/index.html', phase: 3 },

  /* Phase 4, legal. Built. Privacy keeps the WordPress-era slug. */
  {
    url: '/resource-center/wpautoterms/privacy-policy',
    status: 'built',
    localPath: 'resource-center/wpautoterms/privacy-policy/index.html',
    phase: 4,
  },
  { url: '/terms-of-service', status: 'built', localPath: 'terms-of-service/index.html', phase: 4 },

  /* Phase 5, multi step contact. Built. */
  { url: '/multi-step-contact-form', status: 'built', localPath: 'multi-step-contact-form/index.html', phase: 5 },
  {
    url: '/multi-step-contact-form/thank-you',
    status: 'built',
    localPath: 'multi-step-contact-form/thank-you/index.html',
    phase: 5,
  },

  { url: '/webinar', status: 'redirect', redirectTo: 'https://www.betterengineer.com/contact', phase: 7 },
  { url: '/aiwebinar', status: 'redirect', redirectTo: 'https://www.betterengineer.com/contact', phase: 7 },
  { url: '/roi', status: 'redirect', redirectTo: 'https://www.betterengineer.com/staff-augmentation', phase: 7 },
  { url: '/youvegotllm', status: 'built', localPath: 'youvegotllm/index.html', phase: 7 },
  {
    url: '/hire-software-engineers-in-72-hours',
    status: 'built',
    localPath: 'hire-software-engineers-in-72-hours/index.html',
    phase: 7,
  },
  { url: '/hiring-dashboard-old', status: 'redirect', redirectTo: '/hiring-dashboard/', phase: 7 },
  {
    url: '/hire-senior-python-engineers-nearshore-latam-talent',
    status: 'redirect',
    redirectTo: 'https://discover.betterengineer.com/technologies/python-developers/',
    phase: 7,
  },
  {
    url: '/hire-senior-full-stack-engineers-nearshore-latam-talent',
    status: 'redirect',
    redirectTo: 'https://discover.betterengineer.com/roles/full-stack-engineers/',
    phase: 7,
  },
  {
    url: '/hire-senior-ai-data-engineers-nearshore-latam-talent',
    status: 'redirect',
    redirectTo: 'https://discover.betterengineer.com/roles/ai-engineers/',
    phase: 7,
  },
  {
    url: '/ai-readiness-manufacturing',
    status: 'redirect',
    redirectTo: 'https://discover.betterengineer.com/aimanufacturing/',
    phase: 7,
  },

  /* Phase 6, careers. Built from data/careers.js. */
  { url: '/careers', status: 'built', localPath: 'careers/index.html', phase: 6 },
  { url: '/careers-test', status: 'redirect', redirectTo: '/careers/', phase: 6 },

  /* Phase 8, industries. Built. Live slugs preserved. */
  { url: '/industries', status: 'built', localPath: 'industries/index.html', phase: 8 },
  { url: '/fintech', status: 'built', localPath: 'fintech/index.html', phase: 8 },
  { url: '/martech', status: 'built', localPath: 'martech/index.html', phase: 8 },
  { url: '/healthtech', status: 'built', localPath: 'healthtech/index.html', phase: 8 },
];

require('./careers.js').jobs.forEach(function (job) {
  urls.push({
    url: '/careers/' + job.slug,
    status: 'built',
    localPath: 'careers/' + job.slug + '/index.html',
    phase: 6,
  });
});

module.exports = {
  /* Flip to true only after the list has been reconciled against HubSpot, Search
     Console, and the live sitemap. Preflight fails the cutover gate while false. */
  verified: false,
  seededFrom: 'www sitemap plus live extracts, 2026-09-09. Still needs HubSpot export + GSC union.',
  urls: urls,
};
