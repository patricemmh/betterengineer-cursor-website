'use strict';

/**
 * Static page generator.
 *
 * Pages are described in data/pages.js. This file knows how to turn a page record
 * plus a main-*.html fragment into a shipped HTML document. Adding a page does not
 * require editing this file.
 *
 * Existing pages (home, the two service landing pages) must keep byte identical
 * output. Their records carry only the head fields they already had.
 */

var fs = require('fs');
var path = require('path');

var root = __dirname;
var styleDir = path.join(root, 'styles');

var manifest = require('./data/pages.js');

var cloudflareMode = process.argv.indexOf('--cloudflare') !== -1;

var baseFromArgv = null;
var onlySlugs = [];
/* Migrated pages are built locally but must not ship in the discover bundle until
   www is cut over. build-discover-dist.js passes --no-migrated for that reason.
   See docs/site-migration/site-migration-plan.md section 4. */
var skipMigrated = process.argv.indexOf('--no-migrated') !== -1;
for (var ai = 0; ai < process.argv.length; ai++) {
  var argvItem = process.argv[ai];
  if (argvItem.indexOf('--base=') === 0) {
    baseFromArgv = argvItem.slice('--base='.length);
  }
  if (argvItem.indexOf('--only=') === 0) {
    onlySlugs = argvItem.slice('--only='.length).split(',').filter(Boolean);
  }
}

function normalizeBasePath(input) {
  var value = (input || '/').trim();
  if (!value) value = '/';
  if (value.charAt(0) !== '/') value = '/' + value;
  if (value.length > 1 && value.endsWith('/')) value = value.slice(0, -1);
  return value;
}

function trimOutputRoot(dir) {
  var d = (dir || '').trim().replace(/\\/g, '/');
  while (d.startsWith('/')) d = d.slice(1);
  while (d.endsWith('/')) d = d.slice(0, -1);
  return d;
}

/* Default `/` matches custom-domain GitHub Pages (see README / CNAME) and local `npm start`. */
/* `--cloudflare` defaults to SITE_BASE=/betterengineer and OUTPUT_ROOT=betterengineer for Pages subpath deploys. */
var siteBase = normalizeBasePath(
  baseFromArgv ||
  process.env.SITE_BASE ||
  (cloudflareMode ? '/betterengineer' : '/'),
);
var outputRoot = trimOutputRoot(process.env.OUTPUT_ROOT || (cloudflareMode ? 'betterengineer' : ''));
/* Parent folder written by CI: CNAME, .nojekyll, optional root index redirect (see GITHUB_PAGES_DISCOVER_HOSTING.md). */
var pagesPublishRoot = trimOutputRoot(process.env.PAGES_PUBLISH_ROOT || '');
var githubPagesCname = (process.env.GITHUB_PAGES_CNAME || '').trim();

/* Until www is cut over to this build, internal links to migrated pages stay
   absolute so the published discover bundle does not 404. Set INTERNAL_LINKS=local
   at cutover to rewrite them to root relative paths.
   See docs/site-migration/seo-followups.md section 4. */
var localInternalLinks = (process.env.INTERNAL_LINKS || '').trim() === 'local';

var EMDASH = /\u2014/;

function withBase(urlPath) {
  if (!urlPath || urlPath.charAt(0) !== '/') return urlPath;
  if (siteBase === '/') return urlPath;
  return siteBase + urlPath;
}

function normalizeHtmlPaths(html) {
  return html
    .replace(/(src|href)=["']\.\/([^"']*)["']/g, '$1="/$2"')
    .replace(/srcset=["']\.\/([^"']*)["']/g, 'srcset="/$1"')
    .replace(
      /href=["']\/ai-systems-readiness-for-manufacturing\.html["']/g,
      'href="/services/ai-systems-readiness-for-manufacturing/"',
    )
    .replace(
      /href=["']\/hire-ai-ready-engineers\.html["']/g,
      'href="/services/hire-ai-ready-engineers/"',
    )
    .replace(/href=["']\/index\.html["']/g, 'href="/"')
    .replace(/href=["']\/["']/g, 'href="/"');
}

/* Rewrite absolute www links to pages that now exist locally. Off by default. */
function localizeInternalLinks(html) {
  if (!localInternalLinks) return html;
  var out = html;
  (manifest.pages || []).forEach(function (page) {
    if (!page.canonical || typeof page.canonical !== 'string') return;
    if (page.canonical.indexOf(manifest.WWW) !== 0) return;
    var localPath = page.canonical.slice(manifest.WWW.length);
    if (!localPath) return;
    if (localPath.charAt(localPath.length - 1) !== '/') localPath += '/';
    var escaped = page.canonical.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    out = out.replace(new RegExp('href="' + escaped + '/?"', 'g'), 'href="' + localPath + '"');
  });
  return out;
}

function applyBaseToHtml(html) {
  return html
    .replace(/(src|href)=["']\/(?!\/)([^"']*)["']/g, function (_, attr, value) {
      return attr + '="' + withBase('/' + value) + '"';
    })
    .replace(/srcset=["']\/(?!\/)([^"']*)["']/g, function (_, value) {
      return 'srcset="' + withBase('/' + value) + '"';
    });
}

function applyBaseToCss(css) {
  return css.replace(/url\((["'])\/(?!\/)([^"')]+)\1\)/g, function (_, quote, value) {
    return 'url(' + quote + withBase('/' + value) + quote + ')';
  });
}

function fixUrls(css) {
  return css
    .replace(/url\("\.\/images\//g, 'url("/images/')
    .replace(/url\('\.\/images\//g, "url('/images/");
}

function readStyles() {
  var brandPath = path.join(styleDir, 'brand.css');
  var landingCssPath = path.join(styleDir, 'landing-page.css');
  if (!fs.existsSync(brandPath)) {
    console.error('Missing brand.css at', brandPath);
    process.exit(1);
  }
  if (!fs.existsSync(landingCssPath)) {
    console.error('Missing landing-page.css at', landingCssPath);
    process.exit(1);
  }
  return {
    brand: applyBaseToCss(fixUrls(fs.readFileSync(brandPath, 'utf8'))),
    landingExtra: applyBaseToCss(fixUrls(fs.readFileSync(landingCssPath, 'utf8'))),
  };
}

var blogFeedBuilder = require('./build-blog-feed.js');
var migratedBlocks = require('./tools/migrated-blocks.js');

function injectBlogFeed(html) {
  var cache = blogFeedBuilder.readCache();
  var feeds = cache.feeds || {};
  return html.replace(/<!--BLOG_FEED:([a-z]+)-->/g, function (_, key) {
    return blogFeedBuilder.renderPostGrid(feeds[key] || []);
  });
}

function readFileSafe(rel) {
  return fs.readFileSync(path.join(root, rel), 'utf8');
}

function writeFileSafe(relPath, contents) {
  var outRel = outputRoot ? path.join(outputRoot, relPath) : relPath;
  var absPath = path.join(root, outRel);
  fs.mkdirSync(path.dirname(absPath), { recursive: true });
  fs.writeFileSync(absPath, contents, 'utf8');
}

function copyIntoOutput(name) {
  var src = path.join(root, name);
  var dest = path.join(root, outputRoot, name);
  if (!fs.existsSync(src)) {
    console.warn('Skip copy (missing):', name);
    return;
  }
  fs.cpSync(src, dest, { recursive: true });
}

function copyFileIntoOutput(file) {
  var src = path.join(root, file);
  var dest = path.join(root, outputRoot, file);
  if (!fs.existsSync(src)) {
    console.warn('Skip copy (missing):', file);
    return;
  }
  fs.mkdirSync(path.dirname(dest), { recursive: true });
  fs.copyFileSync(src, dest);
}

function attr(value) {
  return String(value).replace(/"/g, '&quot;');
}

/* ── JSON-LD helpers ─────────────────────────────────────────────────────────── */

function ld(obj) {
  return (
    '  <script type="application/ld+json">' +
    JSON.stringify(obj) +
    '</script>\n'
  );
}

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

/**
 * Build FAQPage JSON-LD by parsing the fragment's own FAQ markup.
 *
 * This is deliberate. Technology pages generate both the markup and the schema
 * from one data record, so they cannot drift. Migrated pages keep their verbatim
 * copy in the fragment, so the schema is derived from the rendered markup instead.
 * Either way the schema can never disagree with what a visitor reads, which is the
 * failure already present on roles/front-end-engineers.
 */
function faqsFromFragment(mainHtml) {
  var faqs = [];
  var itemRe = /<div class="faq-item[^"]*">([\s\S]*?)<\/div>\s*<\/div>/g;
  var m;
  while ((m = itemRe.exec(mainHtml)) !== null) {
    var block = m[1];
    var qMatch = block.match(/<span class="faq-question">([\s\S]*?)<\/span>/);
    var aMatch = block.match(/<div class="faq-panel"[^>]*>([\s\S]*)$/);
    if (!qMatch || !aMatch) continue;
    var q = htmlToText(qMatch[1]);
    var a = htmlToText(aMatch[1]);
    if (q && a) faqs.push({ q: q, a: a });
  }
  return faqs;
}

function schemaBlocks(page, canonicalUrl, mainHtml) {
  var out = '';
  var org = manifest.ORG;

  out += ld(Object.assign({ '@context': 'https://schema.org' }, org));

  if (page.breadcrumb && page.breadcrumb.length) {
    out += ld({
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: page.breadcrumb.map(function (b, i) {
        var item = { '@type': 'ListItem', position: i + 1, name: b.name };
        if (b.url) item.item = b.url;
        else item.item = canonicalUrl;
        return item;
      }),
    });
  }

  if (page.faqSchema) {
    var faqs = faqsFromFragment(mainHtml);
    if (faqs.length) {
      out += ld({
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: faqs.map(function (f) {
          return {
            '@type': 'Question',
            name: f.q,
            acceptedAnswer: { '@type': 'Answer', text: f.a },
          };
        }),
      });
    } else {
      console.warn('warn: faqSchema is on but no .faq-item blocks were found in', page.fragment);
    }
  }

  if (page.service) {
    out += ld({
      '@context': 'https://schema.org',
      '@type': 'Service',
      name: page.service.name,
      serviceType: page.service.serviceType,
      description: page.description,
      provider: org,
      areaServed: { '@type': 'Country', name: 'United States' },
      url: canonicalUrl,
    });
  }

  var webPage = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: page.title,
    url: canonicalUrl,
    description: page.description,
    inLanguage: 'en-US',
    isPartOf: { '@type': 'WebSite', name: 'BetterEngineer', url: manifest.WWW + '/' },
    primaryImageOfPage: (page.og && page.og.image) || manifest.OG_IMAGE,
  };
  if (page.lastUpdated) {
    webPage.datePublished = page.lastUpdated + '-01';
    webPage.dateModified = page.lastUpdated + '-01';
  }
  out += ld(webPage);

  /* Page-specific schema, built from the same data that renders the page so the
     two cannot drift. Used by the glossary for DefinedTermSet. */
  if (typeof page.extraSchema === 'function') {
    var extra = page.extraSchema({ canonical: canonicalUrl, page: page }) || [];
    extra.forEach(function (node) {
      out += ld(node);
    });
  }

  return out;
}

/* ── Head ────────────────────────────────────────────────────────────────────── */

function buildExtraHead(page, mainHtml) {
  var extra = '';
  if (page.slug === 'home') {
    extra +=
      '  <link rel="preload" as="image" href="./images/hero/home-ai-engineer-800.webp" type="image/webp" media="(max-width: 500px)" fetchpriority="high">\n' +
      '  <link rel="preload" as="image" href="./images/hero/home-ai-engineer-1120.webp" type="image/webp" media="(min-width: 501px)" fetchpriority="high">\n';
  }
  var canonicalUrl = null;

  if (typeof page.canonical === 'function') {
    canonicalUrl = page.canonical({ siteBase: siteBase, githubPagesCname: githubPagesCname });
  } else if (page.canonical) {
    canonicalUrl = page.canonical;
  }

  if (canonicalUrl) {
    extra += '  <link rel="canonical" href="' + canonicalUrl + '">\n';
  }

  var robots = page.migrated && page.robots === undefined
    ? manifest.PRE_CUTOVER_ROBOTS
    : page.robots;
  if (robots) {
    extra += '  <meta name="robots" content="' + attr(robots) + '">\n';
  }

  var og = page.og || (page.migrated ? {} : null);
  if (og) {
    var ogTitle = og.title || page.title;
    var ogDescription = og.description || page.description;
    var ogType = og.type || 'website';
    extra += '  <meta property="og:title" content="' + attr(ogTitle) + '">\n';
    extra += '  <meta property="og:description" content="' + attr(ogDescription) + '">\n';
    extra += '  <meta property="og:type" content="' + ogType + '">\n';

    if (page.migrated) {
      var ogImage = og.image || manifest.OG_IMAGE;
      if (canonicalUrl) {
        extra += '  <meta property="og:url" content="' + canonicalUrl + '">\n';
      }
      extra += '  <meta property="og:image" content="' + ogImage + '">\n';
      extra += '  <meta property="og:image:width" content="720">\n';
      extra += '  <meta property="og:image:height" content="540">\n';
      extra += '  <meta name="twitter:card" content="summary_large_image">\n';
      extra += '  <meta name="twitter:title" content="' + attr(ogTitle) + '">\n';
      extra += '  <meta name="twitter:description" content="' + attr(ogDescription) + '">\n';
      extra += '  <meta name="twitter:image" content="' + ogImage + '">\n';
    }
  }

  if (page.migrated) {
    extra += schemaBlocks(page, canonicalUrl, mainHtml);
  }

  return extra;
}

/* ── Chrome ──────────────────────────────────────────────────────────────────── */

var footer = localizeInternalLinks(normalizeHtmlPaths(readFileSafe('footer-full.html').trim()));

/* Primary header: structure, labels, and URLs match www.betterengineer.com (HubSpot header module, 2025). */
var headerPrimaryChrome =
  '  <header class="site-header" id="header">\n' +
  '    <div class="header-inner">\n' +
  '      <a class="logo-link" href="https://www.betterengineer.com/" aria-label="BetterEngineer home">\n' +
  '        <img src="./icons/betterengineer-logo.svg" alt="BetterEngineer" width="183" height="33">\n' +
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
  '          <li class="nav-item-join"><a href="https://www.betterengineer.com/join">Join Us</a></li>\n' +
  '          <li><a class="nav-pill-hire" href="https://www.betterengineer.com/multi-step-contact-form">Hire Engineers</a></li>\n' +
  '          <li><a href="https://app.betterengineer.com/sign-in?redirect_url=https%3A%2F%2Fapp.betterengineer.com%2F">Login</a></li>\n' +
  '        </ul>\n' +
  '      </nav>\n' +
  '      <button type="button" class="nav-toggle" aria-expanded="false" aria-controls="mobile-menu" id="nav-toggle" aria-label="Open menu">\n' +
  '        <img src="./icons/hamburger-white.svg" alt="" width="30" height="30">\n' +
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
  '  </header>\n';

var headerMinimalChrome =
  '  <header class="site-header site-header--minimal" id="header">\n' +
  '    <div class="header-inner header-inner--minimal">\n' +
  '      <a class="logo-link" href="https://www.betterengineer.com/" aria-label="BetterEngineer home">\n' +
  '        <img src="./icons/betterengineer-logo.svg" alt="BetterEngineer" width="183" height="33">\n' +
  '      </a>\n' +
  '      <div class="site-header-minimal-cta">\n' +
  '        <span class="site-header-minimal-cta__label">Prefer to talk first?</span>\n' +
  '        <a class="btn btn--primary site-header-minimal-cta__btn" href="https://calendly.com/tim-salsamobi/30min" target="_blank" rel="noopener">Book a Call</a>\n' +
  '      </div>\n' +
  '    </div>\n' +
  '  </header>\n';

function chromeFor(page) {
  if (page.chrome === 'minimal') {
    return {
      header: localizeInternalLinks(headerMinimalChrome),
      footer: '',
      bodyClass: ' page-shell--hire-wizard',
    };
  }
  return {
    header: headerFor(page),
    footer: footer,
    bodyClass: '',
  };
}

/* Mark the current page in the nav. Purely additive: pages with no canonical, or
   whose canonical is not in the nav, get the header unchanged. */
function headerFor(page) {
  var header = localizeInternalLinks(headerPrimaryChrome);
  var canonicalUrl = typeof page.canonical === 'function' ? null : page.canonical;
  if (!canonicalUrl) return header;
  var needle = 'href="' + canonicalUrl + '"';
  if (header.indexOf(needle) === -1) return header;
  return header.split(needle).join(needle + ' aria-current="page"');
}

/* ── Shell ───────────────────────────────────────────────────────────────────── */

function extraScripts(page) {
  var names = page.scripts && page.scripts.length ? page.scripts : [page.script || 'page.js'];
  var html =
    '  <script src="./attribution.js" defer></script>\n' +
    '  <script src="./intake-form-shared.js" defer></script>\n';
  names.forEach(function (name) {
    if (!name) return;
    html += '  <script src="./' + name + '" defer></script>\n';
  });
  return html;
}

function shell(title, description, css, header, main, page, extraHead, pageFooter, bodyClass) {
  if (!extraHead) extraHead = '';
  var footerHtml = typeof pageFooter === 'string' ? pageFooter : footer;
  if (!bodyClass) bodyClass = '';
  var html =
    '<!DOCTYPE html>\n' +
    '<html lang="en">\n' +
    '<head>\n' +
    '  <meta charset="utf-8">\n' +
    '  <meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover">\n' +
    '  <title>' +
    title +
    '</title>\n' +
    '  <meta name="description" content="' +
    description.replace(/"/g, '&quot;') +
    '">\n' +
    extraHead +
    '  <script src="./scripts/cookie-consent.js" defer></script>\n' +
    '  <!-- Analytics (GTM, HubSpot) load only after cookie consent. IDs: GTM-WT77L8JF, portal 8679235. -->\n' +
    '  <script type="application/json" id="be-gtm-config">{"id":"GTM-WT77L8JF"}</script>\n' +
    '  <script type="application/json" id="be-hs-config">{"portalId":"8679235"}</script>\n' +
    '  <link rel="icon" href="/icons/favicon.png" type="image/png">\n' +
    '  <link rel="preload" href="/fonts/plus-jakarta-sans/plus-jakarta-sans-latin.woff2" as="font" type="font/woff2" crossorigin>\n' +
    '  <style>\n' +
    css +
    '\n' +
    cookieCss +
    '\n  </style>\n' +
    '</head>\n' +
    '<body class="' +
    bodyClass.trim() +
    '">\n' +
    '  <a class="skip-link" href="#main">Skip to content</a>\n' +
    '\n' +
    header +
    '\n' +
    main +
    '\n' +
    footerHtml +
    '\n' +
    extraScripts(page) +
    '</body>\n' +
    '</html>\n';
  return applyBaseToHtml(normalizeHtmlPaths(html));
}

/* ── Build ───────────────────────────────────────────────────────────────────── */

var styles = readStyles();
var cookieCss = fs.readFileSync(path.join(styleDir, 'cookie-consent.css'), 'utf8');

var homeCss =
  styles.brand +
  '\n\n/* Safe-area + overflow (subset of landing #main rules) */\n#main { overflow-x: clip; }\n#main .wrap {\n  padding-left: max(1.25rem, env(safe-area-inset-left, 0px));\n  padding-right: max(1.25rem, env(safe-area-inset-right, 0px));\n}\n';

var landingCss = styles.brand + '\n\n' + styles.landingExtra;

function cssFor(page) {
  return page.cssBundle === 'home' ? homeCss : landingCss;
}

if (outputRoot) {
  fs.rmSync(path.join(root, outputRoot), { recursive: true, force: true });
}

var built = [];
var missing = [];
var emdashPages = [];

manifest.pages.forEach(function (page) {
  if (onlySlugs.length && onlySlugs.indexOf(page.slug) === -1) return;
  if (skipMigrated && (page.migrated || page.excludeFromDiscover)) return;

  var fragmentPath = path.join(root, page.fragment);
  if (!fs.existsSync(fragmentPath)) {
    /* Existing pages are required. Migrated pages may not have a fragment yet,
       which is expected while the migration is in progress. */
    if (page.migrated) {
      missing.push(page.slug);
      return;
    }
    console.error('Missing fragment for "' + page.slug + '":', page.fragment);
    process.exit(1);
  }

  var mainHtml = injectBlogFeed(
    localizeInternalLinks(
      normalizeHtmlPaths(fs.readFileSync(fragmentPath, 'utf8').trim()),
    ),
  );

  var chrome = chromeFor(page);
  var html = shell(
    page.title,
    page.description,
    cssFor(page),
    chrome.header,
    mainHtml,
    page,
    buildExtraHead(page, mainHtml),
    chrome.footer,
    chrome.bodyClass,
  );

  if (EMDASH.test(html)) {
    emdashPages.push(page.slug);
  }

  page.outputs.forEach(function (outPath) {
    writeFileSafe(outPath, html);
  });
  built.push(page.slug);
});

if (!pagesPublishRoot) {
  writeFileSafe('.nojekyll', '');
}

if (outputRoot) {
  copyIntoOutput('icons');
  copyIntoOutput('images');
  copyFileIntoOutput('home.js');
  copyFileIntoOutput('attribution.js');
  copyFileIntoOutput('intake-form-shared.js');
  copyFileIntoOutput('landing-page.js');
  copyFileIntoOutput('page.js');
  copyFileIntoOutput('hire-flow.js');
  copyFileIntoOutput('hs-lead-form.js');
  copyFileIntoOutput('styles/cookie-consent.css');
  copyFileIntoOutput('scripts/cookie-consent.js');
}

if (pagesPublishRoot) {
  var prAbs = path.join(root, pagesPublishRoot);
  fs.mkdirSync(prAbs, { recursive: true });
  fs.writeFileSync(path.join(prAbs, '.nojekyll'), '', 'utf8');
  if (githubPagesCname) {
    fs.writeFileSync(path.join(prAbs, 'CNAME'), githubPagesCname + '\n', 'utf8');
  }
  if (outputRoot) {
    var siteAbs = path.join(root, outputRoot);
    var relSite = path.relative(prAbs, siteAbs).replace(/\\/g, '/');
    if (relSite && !relSite.startsWith('..')) {
      var redirectHtml =
        '<!DOCTYPE html>\n' +
        '<html lang="en">\n' +
        '<head>\n' +
        '  <meta charset="utf-8">\n' +
        '  <meta http-equiv="refresh" content="0;url=' +
        relSite +
        '/">\n' +
        '  <title>Redirecting</title>\n' +
        '  <link rel="canonical" href="/' +
        relSite +
        '/">\n' +
        '</head>\n' +
        '<body>\n' +
        '  <p><a href="' +
        relSite +
        '/">Continue to BetterEngineer landing pages</a></p>\n' +
        '</body>\n' +
        '</html>\n';
      fs.writeFileSync(path.join(prAbs, 'index.html'), redirectHtml, 'utf8');

      /* GitHub Pages paths are case-sensitive; common capitalization typos 404 otherwise. */
      var lpRoot = (process.env.LP_ROOT_PAGE || '').trim();
      if (lpRoot === 'manufacturing') {
        var aliasTarget = '/' + relSite + '/';
        var aliasHtml =
          '<!DOCTYPE html>\n' +
          '<html lang="en">\n' +
          '<head>\n' +
          '  <meta charset="utf-8">\n' +
          '  <meta http-equiv="refresh" content="0;url=' +
          aliasTarget +
          '">\n' +
          '  <title>Redirecting</title>\n' +
          '  <link rel="canonical" href="' +
          aliasTarget +
          '">\n' +
          '</head>\n' +
          '<body>\n' +
          '  <p><a href="' +
          aliasTarget +
          '">Continue</a></p>\n' +
          '</body>\n' +
          '</html>\n';
        ['AIManufacturing', 'Aimanufacturing'].forEach(function (aliasSeg) {
          var aliasDir = path.join(prAbs, aliasSeg);
          fs.mkdirSync(aliasDir, { recursive: true });
          fs.writeFileSync(path.join(aliasDir, 'index.html'), aliasHtml, 'utf8');
        });
      }
    }
  }
}

var lpRootPage = (process.env.LP_ROOT_PAGE || '').trim();
if (lpRootPage === 'manufacturing' && outputRoot) {
  var mfgIdx = path.join(
    root,
    outputRoot,
    'services',
    'ai-systems-readiness-for-manufacturing',
    'index.html',
  );
  var outIdx = path.join(root, outputRoot, 'index.html');
  if (fs.existsSync(mfgIdx)) {
    fs.copyFileSync(mfgIdx, outIdx);
  }
}
if (lpRootPage === 'hire-ai-ready' && outputRoot) {
  var hireIdx = path.join(root, outputRoot, 'services', 'hire-ai-ready-engineers', 'index.html');
  var hireOutIdx = path.join(root, outputRoot, 'index.html');
  if (fs.existsSync(hireIdx)) {
    fs.copyFileSync(hireIdx, hireOutIdx);
  }
}

console.log(
  'Wrote static build; base path:',
  siteBase,
  outputRoot ? '(output: ./' + outputRoot + '/)' : '(output: repo root)',
  pagesPublishRoot ? '; publish root: ./' + pagesPublishRoot + '/' : '',
);
console.log('  built: ' + built.join(', '));
if (missing.length) {
  console.log('  pending migration (no fragment yet): ' + missing.join(', '));
}
if (emdashPages.length) {
  console.error('ERROR: em dash character found in: ' + emdashPages.join(', '));
  process.exitCode = 1;
}
