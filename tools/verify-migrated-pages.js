'use strict';

/**
 * Verifier for migrated static marketing pages.
 *
 * Technology pages have tools/verify-tech-data.js. Migrated pages had nothing.
 * This closes that gap. See docs/site-migration/seo-followups.md section 5 and
 * docs/site-migration/technical-debt.md TD-12.
 *
 * FAIL sets a non-zero exit code. WARN does not.
 *
 * Usage:
 *   node tools/verify-migrated-pages.js
 *   node tools/verify-migrated-pages.js --slug=about
 */

var fs = require('fs');
var path = require('path');

var root = path.join(__dirname, '..');
var manifest = require(path.join(root, 'data', 'pages.js'));

var onlySlug = null;
process.argv.forEach(function (a) {
  if (a.indexOf('--slug=') === 0) onlySlug = a.slice('--slug='.length);
});

var fails = 0;
var warns = 0;

function fail(slug, msg) {
  console.error('FAIL  [' + slug + '] ' + msg);
  fails++;
}
function warn(slug, msg) {
  console.warn('WARN  [' + slug + '] ' + msg);
  warns++;
}

/* Classes the migrated pages are allowed to use. Anything else means someone
   invented a pattern instead of reusing one. Keep in sync with
   docs/site-migration/component-pattern-inventory.md. */
var ALLOWED_CLASSES = new Set(
  (
    'section section-tint section-rule wrap split split__img ai-split ai-split__right ' +
    'air-tech-split air-latam-split air-section-head air-section-head--light reveal is-visible ' +
    'h1 h2 lead eyebrow accent light quote air-page ' +
    'btn btn--primary btn--outline btn--ghost btn--outline-light btn-row ' +
    'hero hero-grid hero-visual hero-visual--image hero-visual__img ' +
    'hero--centered hero-rotating-word trust-line ' +
    'contact-hero contact-hero__copy contact-hero__image ' +
    'hero-form__card hero-form__title hero-form__subtitle react-hero-side-card ' +
    'card-grid role-card role-card--featured role-card__badge ' +
    'air-serve-grid air-serve-card air-serve-card__icon air-serve-card__source ' +
    'air-feature-stack air-feature air-feature__icon air-feature-stack--plain air-feature-stack--grid usecase-grid usecase-card air-use-grid ' +
    'process-layout process-layout__copy process-layout__aside process-list process-list__item process-list__num ' +
    'skill-card skills-head air-prose-card air-prose-card__kicker ' +
    'air-number-card air-number-card__num air-numbers-grid ' +
    'person-grid person-card person-card__photo person-card__name person-card__role person-card__social ' +
    'post-grid post-grid--blog post-card post-card__cover post-card__tags post-card__tag post-card__title post-card__meta ' +
    'post-card__excerpt post-card__more logo-wall logo-wall__item logo-wall__label ' +
    'resource-card resource-card__cover resource-card__body ' +
    /* Added in Cursor, 2026-08-07. AI Readiness two-up service grid, and the
       Hiring Dashboard LATAM timezone comparison chart. */
    'air-serve-grid--two air-feature-stack--plain heavylifting-cta service-check-grid ' +
    'about-hero about-hero__aside about-hero__intro about-hero__statement ' +
    'join-tech-board join-tech-row join-tech-row__label join-tech-row__panel ' +
    'join-tech-row__combo join-tech-row__plus join-tech-row__icons air-eco-icon ' +
    'engineer-quotes engineer-quotes-head engineer-quote engineer-quote__person ' +
    'engineer-quote__photo engineer-quote__name engineer-quote__role ' +
    'latam-talent-copy latam-talent-split latam-timezone-copy latam-timezone-split ' +
    'latam-timezone-chart latam-timezone-chart__city latam-timezone-chart__header-pair ' +
    'latam-timezone-chart__headers latam-timezone-chart__headers-spacer ' +
    'latam-timezone-chart__list latam-timezone-chart__note latam-timezone-chart__offsets ' +
    'latam-timezone-chart__offsets--dark latam-timezone-chart__offsets--light ' +
    'latam-timezone-chart__offsets--mid latam-timezone-chart__row ' +
    'panel-dark panel-dark__head jump-nav jump-nav__link faq-jump-intro faq-jump-intro__title ' +
    'faq-group faq-group__title ' +
    'resource-grid glossary-group glossary-letter glossary-list glossary-term ' +
    'glossary-term__name glossary-term__def glossary-term__links ' +
    'fluency-checks audit-checklist audit-checklist--compact air-list air-bullets ' +
    'problem-list chip-list air-tag air-tag-cluster air-skill-tags air-skills-cluster ' +
    'trust-pill trust-pills ' +
    'process-grid process-grid--three process-grid--five process-step process-step__num process-step__sub ' +
    'stats-section stats-title stats-bento stats-bento__cell stats-bento__stat ' +
    'stat-num stat-label stat-source air-stats-strip air-stat-row air-stat air-stat__num air-stat__label ' +
    'partners partners-label logo-marquee logo-track client-block client-sub ' +
    'carousel-wrap carousel-intro carousel-shell carousel-slides carousel carousel-btn carousel-dots slides quote ' +
    'slide slide-grid slide-photo slide-copy slide-footer slide-name slide-role slide-logo is-active ' +
    'faq-list faq-item faq-question faq-panel chevron is-open ' +
    'air-compare-wrap air-compare-table air-compare-table__us air-compare-head ' +
    'air-mark air-mark--yes air-mark--no air-mark--maybe ' +
    'cta-band cta-split cta-split__text cta-split__text-inner cta-split__photo ' +
    'cta-band--compact cta-break ' +
    'platform-video platform-video__player ' +
    'air-final-cta air-final-cta__inner air-final-cta__note air-mid-cta air-mid-cta__card ' +
    'air-mid-cta__title air-mid-cta__button air-mid-cta__image ' +
    'latam latam-title latam-title__accent latam-lead latam-locations latam-cta latam-map ' +
    'react-intake-card react-intake-form react-intake-submit form-grid form-field ' +
    'form-field--full form-privacy-note form-status split__form hero-form__card--split air-role-process ' +
    'legal-page legal-prose hire-wizard-layout hire-wizard-card hire-progress hire-progress__bar ' +
    'hire-step hire-tiles hire-tile hire-chips hire-chip hire-consent hire-tile-next is-selected ' +
    'cs-page cs-hero cs-hero__grid cs-hero__title cs-hero__logo cs-kicker-heading cs-kicker-heading__label cs-kicker-heading__title ' +
    'cs-summary cs-summary__grid cs-summary__lead cs-stats cs-stat cs-stat__num cs-stat__label ' +
    'cs-challenge cs-challenge__grid cs-challenge__aside cs-about-card cs-stack cs-stack__item cs-stack-label ' +
    'cs-list cs-list--dark cs-solution cs-solution__grid cs-quote cs-quote__person cs-roles cs-pills cs-role-list ' +
    'cs-product cs-product__grid cs-product__link cs-gallery cs-gallery__track cs-gallery__slide cs-quote--feature ' +
    'cs-why cs-why__grid cs-why__photo be-trustbar be-trustbar__bar be-trustbar__copy be-trustbar__logos ' +
    'be-check-list be-check-list__item be-check-list__mark be-inline-cta be-inline-cta--wide be-inline-cta__photo be-inline-cta__body be-inline-cta__btn be-inline-cta__title ' +
    'cr-page cr-job cr-hero cr-hero__grid cr-hero__title cr-hero__map cr-openings cr-rule cr-select cr-job-list ' +
    'cr-perks cr-perks__grid cr-perk cr-perks__photo cr-banner cr-banner__inner cr-job-hero cr-job-hero__grid cr-job-hero__photo ' +
    'cr-meta cr-jd cr-jd__grid cr-about cr-all visually-hidden ' +
    'ind-page ind-hero ind-hero__grid ind-hero__title ind-hero__form ind-hero__visual ind-solutions ind-solutions__img ' +
    'ind-cluster ind-cluster--tint ind-cluster__title ind-pair ind-pair__item ind-mid air-mid-cta air-mid-cta__card air-mid-cta__image air-mid-cta__title air-mid-cta__button ' +
    'cv-page cv-hero--dark cv-hero--photo cv-checks cv-skills cv-skills--2 cv-skill cv-steps cv-stats cv-ebook cv-kpi cv-kpi__item'
  ).split(/\s+/),
);

function decodeEntities(text) {
  return text
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#0?39;/g, "'")
    .replace(/&apos;/g, "'")
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&');
}

function htmlToText(html) {
  return decodeEntities(
    String(html)
      .replace(/<\s*br\s*\/?>/gi, '\n')
      .replace(/<\/(p|li|h[1-6]|div)>/gi, '\n')
      .replace(/<li[^>]*>/gi, '')
      .replace(/<[^>]+>/g, ''),
  )
    .replace(/[ \t]+/g, ' ')
    .replace(/\s*\n\s*/g, '\n')
    .replace(/\n{2,}/g, '\n')
    .trim();
}

function bodyOf(html) {
  var m = html.match(/<main id="main"(?: class="[^"]*")?>([\s\S]*?)<\/main>/);
  return m ? m[1] : '';
}

function checkPage(page) {
  var slug = page.slug;
  var outPath = path.join(root, page.outputs[0]);
  if (!fs.existsSync(outPath)) {
    fail(slug, 'output missing: ' + page.outputs[0]);
    return;
  }
  var html = fs.readFileSync(outPath, 'utf8');
  var body = bodyOf(html);

  if (!body) {
    fail(slug, 'no <main id="main"> block found in output');
    return;
  }

  /* ── Copy rules ─────────────────────────────────────────────────────────── */

  if (/—/.test(html)) fail(slug, 'em dash character (U+2014) present');
  if (/–/.test(body)) warn(slug, 'en dash character (U+2013) present in body');
  if (/\[[A-Z_]{3,}\]/.test(body)) fail(slug, 'unreplaced [TOKEN] placeholder in body');

  /* ── Headings ───────────────────────────────────────────────────────────── */

  var h1s = body.match(/<h1\b/g) || [];
  if (h1s.length !== 1) fail(slug, 'expected exactly one <h1>, found ' + h1s.length);

  var levels = [];
  var hRe = /<h([1-6])\b/g;
  var hm;
  while ((hm = hRe.exec(body)) !== null) levels.push(parseInt(hm[1], 10));
  for (var i = 1; i < levels.length; i++) {
    if (levels[i] > levels[i - 1] + 1) {
      /* FAQ hub matches live: hero H1, category labels as H3 with no section H2. */
      if (slug === 'faqs' && levels[i - 1] === 1 && levels[i] === 3) continue;
      fail(slug, 'heading level skip: h' + levels[i - 1] + ' followed by h' + levels[i]);
      break;
    }
  }

  /* ── Metadata ───────────────────────────────────────────────────────────── */

  var required = [
    ['<title>', /<title>([^<]+)<\/title>/],
    ['meta description', /<meta name="description" content="/],
    ['canonical', /<link rel="canonical" href="/],
    ['og:title', /<meta property="og:title"/],
    ['og:description', /<meta property="og:description"/],
    ['og:type', /<meta property="og:type"/],
    ['og:url', /<meta property="og:url"/],
    ['og:image', /<meta property="og:image"/],
    ['twitter:card', /<meta name="twitter:card"/],
  ];
  required.forEach(function (pair) {
    if (!pair[1].test(html)) fail(slug, 'missing ' + pair[0]);
  });

  var titleMatch = html.match(/<title>([^<]+)<\/title>/);
  if (titleMatch && titleMatch[1] !== page.title.replace(/&/g, '&')) {
    if (titleMatch[1] !== page.title) fail(slug, 'title does not match data/pages.js');
  }

  var canonicalMatch = html.match(/<link rel="canonical" href="([^"]+)"/);
  if (canonicalMatch && typeof page.canonical === 'string' && canonicalMatch[1] !== page.canonical) {
    fail(slug, 'canonical mismatch: ' + canonicalMatch[1]);
  }

  if (page.migrated) {
    var robotsMatch = html.match(/<meta name="robots" content="([^"]+)"/);
    if (!robotsMatch) {
      if (manifest.PRE_CUTOVER_ROBOTS) fail(slug, 'missing robots directive');
    } else if (manifest.PRE_CUTOVER_ROBOTS && robotsMatch[1] !== manifest.PRE_CUTOVER_ROBOTS) {
      warn(slug, 'robots is "' + robotsMatch[1] + '", expected "' + manifest.PRE_CUTOVER_ROBOTS + '"');
    }
  }

  /* ── Structured data ────────────────────────────────────────────────────── */

  var ldBlocks = [];
  var ldRe = /<script type="application\/ld\+json">([\s\S]*?)<\/script>/g;
  var ldm;
  while ((ldm = ldRe.exec(html)) !== null) {
    try {
      ldBlocks.push(JSON.parse(ldm[1]));
    } catch (e) {
      fail(slug, 'JSON-LD block does not parse: ' + e.message);
    }
  }
  var types = ldBlocks.map(function (b) {
    return b['@type'];
  });
  ['Organization', 'BreadcrumbList', 'WebPage'].forEach(function (t) {
    if (types.indexOf(t) === -1) fail(slug, 'missing ' + t + ' JSON-LD');
  });

  /* FAQ schema must match the visible FAQ exactly, in order. This is the check
     that roles/front-end-engineers currently fails. */
  var visibleFaqs = [];
  var itemRe = /<div class="faq-item[^"]*">([\s\S]*?)<\/div>\s*<\/div>/g;
  var im;
  while ((im = itemRe.exec(body)) !== null) {
    var qm = im[1].match(/<span class="faq-question">([\s\S]*?)<\/span>/);
    var am = im[1].match(/<div class="faq-panel"[^>]*>([\s\S]*)$/);
    if (qm && am) visibleFaqs.push({ q: htmlToText(qm[1]), a: htmlToText(am[1]) });
  }

  var faqLd = ldBlocks.filter(function (b) {
    return b['@type'] === 'FAQPage';
  })[0];

  if (page.faqSchema) {
    if (!visibleFaqs.length) {
      fail(slug, 'faqSchema is on but no .faq-item blocks were rendered');
    } else if (!faqLd) {
      fail(slug, 'visible FAQ present but no FAQPage JSON-LD emitted');
    } else {
      var ldFaqs = faqLd.mainEntity || [];
      if (ldFaqs.length !== visibleFaqs.length) {
        fail(slug, 'FAQ count mismatch: ' + visibleFaqs.length + ' visible, ' + ldFaqs.length + ' in JSON-LD');
      } else {
        ldFaqs.forEach(function (q, idx) {
          if (q.name !== visibleFaqs[idx].q) {
            fail(slug, 'FAQ question ' + (idx + 1) + ' text differs between JSON-LD and the page');
          }
          if (q.acceptedAnswer.text !== visibleFaqs[idx].a) {
            fail(slug, 'FAQ answer ' + (idx + 1) + ' text differs between JSON-LD and the page');
          }
        });
      }
    }
  }

  /* ── Canonical FAQ component contract ───────────────────────────────────── */
  /* The FAQ is the one component most likely to be rebuilt slightly differently
     each time, so its structure is checked explicitly rather than left to review.
     Contract is documented in styles/brand.css and in
     docs/site-migration/component-pattern-inventory.md section 4.9. */

  if (visibleFaqs.length) {
    var faqSectionRe =
      slug === 'faqs'
        ? /<section class="section section-tint" id="faq" aria-labelledby="faq-jump-intro">([\s\S]*?)<\/section>/
        : /<section class="section section-tint" id="faq" aria-labelledby="faq-heading">([\s\S]*?)<\/section>/;
    var faqSection = body.match(faqSectionRe);
    if (!faqSection) {
      fail(
        slug,
        slug === 'faqs'
          ? 'FAQ hub section must use aria-labelledby="faq-jump-intro" (Browse by topic intro, not hero H1)'
          : 'FAQ section wrapper does not match the canonical pattern ' +
              '(<section class="section section-tint" id="faq" aria-labelledby="faq-heading">)',
      );
    } else {
      var faqHtml = faqSection[1];
      if (slug === 'faqs') {
        if (!/<h2 class="faq-jump-intro__title" id="faq-jump-intro">Browse by topic<\/h2>/.test(faqHtml)) {
          fail(slug, 'FAQ hub is missing Browse by topic intro above jump nav');
        }
        if (!/<nav class="jump-nav/.test(faqHtml)) {
          fail(slug, 'FAQ hub is missing jump navigation');
        }
        if (!/id="hero"[\s\S]*<p class="eyebrow">BETTERENGINEER FAQ<\/p>[\s\S]*<h1 class="h1" id="hero-title">/.test(body)) {
          fail(slug, 'FAQ hub hero must include BETTERENGINEER FAQ eyebrow above the page title');
        }
      } else {
        if (!/<div class="reveal air-section-head"/.test(faqHtml)) {
          fail(slug, 'FAQ section is missing its .air-section-head block');
        }
        if (!/<p class="eyebrow">[^<]+<\/p>/.test(faqHtml)) {
          fail(slug, 'FAQ section is missing the eyebrow label above the heading');
        }
        if (!/<h2 class="h2" id="faq-heading">/.test(faqHtml)) {
          fail(slug, 'FAQ heading must be <h2 class="h2" id="faq-heading">');
        }
      }
      /* Ungrouped pages use one `.faq-list#faq-list`. The dedicated FAQ page groups
         53 questions into 7 categories, each with its own list inside a `.faq-group`
         whose id is the jump target. Accept either shape, reject anything else. */
      var hasFlatList = /<div class="faq-list reveal" id="faq-list">/.test(faqHtml);
      var groupLists = faqHtml.match(/<div class="faq-list" id="faq-list-[a-z0-9-]+">/g) || [];
      var groups = faqHtml.match(/<div class="faq-group[^"]*" id="[a-z0-9-]+">/g) || [];
      if (!hasFlatList && !groupLists.length) {
        fail(slug, 'FAQ list must be <div class="faq-list reveal" id="faq-list"> or grouped <div class="faq-list" id="faq-list-...">');
      }
      if (groupLists.length && groupLists.length !== groups.length) {
        fail(slug, 'grouped FAQ: ' + groups.length + ' .faq-group(s) but ' + groupLists.length + ' .faq-list(s)');
      }
      if (groupLists.length) {
        var ids = groupLists.map(function (g) { return g.match(/id="([^"]+)"/)[1]; });
        if (new Set(ids).size !== ids.length) fail(slug, 'grouped FAQ: duplicate .faq-list id');
        if (!/<h3 class="faq-group__title">/.test(faqHtml)) {
          fail(slug, 'grouped FAQ: each group needs an <h3 class="faq-group__title">');
        }
      }
    }

    var openItems = (body.match(/class="faq-item is-open"/g) || []).length;
    if (openItems !== 1) {
      fail(slug, 'expected exactly one open FAQ item, found ' + openItems);
    }

    /* Every item: a real <button>, the question in .faq-question, a .chevron,
       aria-expanded matching is-open, and hidden on every closed panel. */
    var itemRe2 = /<div class="faq-item([^"]*)">([\s\S]*?)<\/div>\s*<\/div>/g;
    var im2;
    var idx = 0;
    while ((im2 = itemRe2.exec(body)) !== null) {
      idx++;
      var isOpen = /is-open/.test(im2[1]);
      var inner = im2[2];
      var label = 'FAQ item ' + idx;
      if (!/<button type="button" aria-expanded="(true|false)">/.test(inner)) {
        fail(slug, label + ': button must be <button type="button" aria-expanded="...">');
        continue;
      }
      var expanded = /aria-expanded="true"/.test(inner);
      if (expanded !== isOpen) {
        fail(slug, label + ': aria-expanded does not match the is-open class');
      }
      if (!/<span class="faq-question">/.test(inner)) {
        fail(slug, label + ': question must be wrapped in <span class="faq-question">');
      }
      if (!/<span class="chevron" aria-hidden="true"><\/span>/.test(inner)) {
        fail(slug, label + ': missing <span class="chevron" aria-hidden="true"></span>');
      }
      var panelOpen = inner.match(/<div class="faq-panel"( hidden)?>/);
      if (!panelOpen) {
        fail(slug, label + ': panel must be <div class="faq-panel"> or <div class="faq-panel" hidden>');
      } else {
        var hasHidden = !!panelOpen[1];
        if (isOpen && hasHidden) fail(slug, label + ': open panel must not carry hidden');
        if (!isOpen && !hasHidden) fail(slug, label + ': closed panel must carry hidden');
      }
    }
  }

  /* ── Images ─────────────────────────────────────────────────────────────── */

  var imgRe = /<img\b[^>]*>/g;
  var img;
  var missingAssets = [];
  while ((img = imgRe.exec(body)) !== null) {
    var tag = img[0];
    var srcM = tag.match(/src="([^"]+)"/);
    var src = srcM ? srcM[1] : '(no src)';
    if (!/\balt="/.test(tag)) fail(slug, 'img without alt: ' + src);
    if (!/\bwidth="/.test(tag) || !/\bheight="/.test(tag)) {
      warn(slug, 'img without width/height: ' + src);
    }
    if (!/\bloading="/.test(tag)) warn(slug, 'img without loading attribute: ' + src);
    if (srcM && srcM[1].charAt(0) === '/') {
      var abs = path.join(root, srcM[1].replace(/^\//, ''));
      if (!fs.existsSync(abs)) missingAssets.push(srcM[1]);
    }
  }
  if (missingAssets.length) {
    warn(slug, missingAssets.length + ' referenced asset(s) not present on disk yet');
  }

  /* ── No HubSpot asset URLs may survive ──────────────────────────────────── */

  /* Blog featured images stay on the HubSpot CDN on purpose (CF-54). Everything
     else must still be a local asset. */
  var htmlForAssetScan = html.replace(
    /<a class="post-card__cover"[^>]*>[\s\S]*?<\/a>/g,
    '',
  );
  if (/betterengineer\.com\/(hubfs|hs-fs)\//.test(htmlForAssetScan)) {
    fail(slug, 'HubSpot hubfs/hs-fs asset URL survived in the output');
  }

  /* ── Class discipline ───────────────────────────────────────────────────── */

  var used = new Set();
  var clsRe = /class="([^"]+)"/g;
  var cm;
  while ((cm = clsRe.exec(body)) !== null) {
    cm[1].split(/\s+/).forEach(function (c) {
      if (c) used.add(c);
    });
  }
  var unknown = [];
  used.forEach(function (c) {
    if (!ALLOWED_CLASSES.has(c)) unknown.push(c);
  });
  if (unknown.length) {
    fail(slug, 'class(es) not in the approved inventory: ' + unknown.sort().join(', '));
  }

  /* ── Forms ──────────────────────────────────────────────────────────────── */

  if (/id="react-intake-form"/.test(body)) {
    ['firstname', 'lastname', 'email', 'message', 'company_website'].forEach(function (n) {
      if (body.indexOf('name="' + n + '"') === -1) fail(slug, 'intake form missing field: ' + n);
    });
    ['utm_campaign', 'utm_content', 'utm_medium', 'utm_source'].forEach(function (n) {
      if (body.indexOf('name="' + n + '"') === -1) fail(slug, 'intake form missing hidden field: ' + n);
    });
    if (body.indexOf('id="react-intake-status"') === -1) {
      fail(slug, 'intake form present but #react-intake-status is missing');
    }
  }

  console.log(
    'ok    [' +
      slug +
      '] sections=' +
      (body.match(/<section\b/g) || []).length +
      ' faqs=' +
      visibleFaqs.length +
      ' imgs=' +
      (body.match(/<img\b/g) || []).length +
      ' ld=' +
      types.join('+'),
  );
}

manifest.migratedPages.forEach(function (page) {
  if (onlySlug && page.slug !== onlySlug) return;
  if (!fs.existsSync(path.join(root, page.fragment))) {
    console.log('skip  [' + page.slug + '] no fragment yet');
    return;
  }
  checkPage(page);
});

console.log('\n' + fails + ' failure(s), ' + warns + ' warning(s)');
if (fails) process.exitCode = 1;
