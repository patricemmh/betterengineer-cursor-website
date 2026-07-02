'use strict';

var fs = require('fs');
var path = require('path');

var root = __dirname;
var styleDir = path.join(root, 'styles');

var cloudflareMode = process.argv.indexOf('--cloudflare') !== -1;

var baseFromArgv = null;
for (var ai = 0; ai < process.argv.length; ai++) {
  var argvItem = process.argv[ai];
  if (argvItem.indexOf('--base=') === 0) {
    baseFromArgv = argvItem.slice('--base='.length);
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

function withBase(urlPath) {
  if (!urlPath || urlPath.charAt(0) !== '/') return urlPath;
  if (siteBase === '/') return urlPath;
  return siteBase + urlPath;
}

function normalizeHtmlPaths(html) {
  return html
    .replace(/(src|href)=["']\.\/([^"']*)["']/g, '$1="/$2"')
    .replace(/srcset=["']\.\/([^"']*)["']/g, 'srcset="/$1"')
    .replace(/href=["']\/react\.html["']/g, 'href="/technologies/react/"')
    .replace(/href=["']\/react-fintech\.html["']/g, 'href="/technologies/react-fintech/"')
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
  var reactPath = path.join(styleDir, 'react-landing.css');
  if (!fs.existsSync(brandPath)) {
    console.error('Missing brand.css at', brandPath);
    process.exit(1);
  }
  if (!fs.existsSync(reactPath)) {
    console.error('Missing react-landing.css at', reactPath);
    process.exit(1);
  }
  return {
    brand: applyBaseToCss(fixUrls(fs.readFileSync(brandPath, 'utf8'))),
    reactExtra: applyBaseToCss(fixUrls(fs.readFileSync(reactPath, 'utf8'))),
  };
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

var styles = readStyles();

var reactMainPath = path.join(root, 'main-react.html');
if (!fs.existsSync(reactMainPath)) {
  console.error('Missing main-react.html (React landing <main> fragment).');
  process.exit(1);
}
var reactMain = normalizeHtmlPaths(fs.readFileSync(reactMainPath, 'utf8').trim());

var reactFintechMainPath = path.join(root, 'main-react-fintech.html');
if (!fs.existsSync(reactFintechMainPath)) {
  console.error('Missing main-react-fintech.html (React fintech <main> fragment).');
  process.exit(1);
}
var reactFintechMain = normalizeHtmlPaths(fs.readFileSync(reactFintechMainPath, 'utf8').trim());

var aiManufacturingMainPath = path.join(root, 'main-ai-systems-manufacturing.html');
if (!fs.existsSync(aiManufacturingMainPath)) {
  console.error('Missing main-ai-systems-manufacturing.html (AI manufacturing landing <main> fragment).');
  process.exit(1);
}
var aiManufacturingMain = normalizeHtmlPaths(fs.readFileSync(aiManufacturingMainPath, 'utf8').trim());

var hireAiReadyMainPath = path.join(root, 'main-hire-ai-ready-engineers.html');
if (!fs.existsSync(hireAiReadyMainPath)) {
  console.error('Missing main-hire-ai-ready-engineers.html (AI-ready engineers landing <main> fragment).');
  process.exit(1);
}
var hireAiReadyMain = normalizeHtmlPaths(fs.readFileSync(hireAiReadyMainPath, 'utf8').trim());

var mainHome = normalizeHtmlPaths(readFileSafe('main-home.html').trim());
var footer = normalizeHtmlPaths(readFileSafe('footer-full.html').trim());

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
  '          <li><a href="https://app.betterengineer.com/sign-in - redirect_url=https%3A%2F%2Fapp.betterengineer.com%2F">Login</a></li>\n' +
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
  '      <li><a href="https://app.betterengineer.com/sign-in - redirect_url=https%3A%2F%2Fapp.betterengineer.com%2F">Login</a></li>\n' +
  '    </ul>\n' +
  '  </header>\n';

var headerHome = headerPrimaryChrome;
var headerReact = headerPrimaryChrome;
var headerHireAiReady = headerPrimaryChrome;
var headerAiManufacturing = headerPrimaryChrome;

function shell(title, description, css, header, main, scriptName, extraHead) {
  if (!extraHead) extraHead = '';
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
    '  <!-- Google Tag Manager -->\n' +
    '  <!-- Replace GTM-WT77L8JF in this script and in the noscript iframe right after <body> in shell() if the container changes. -->\n' +
    '  <script>(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({\'gtm.start\':\n' +
    '  new Date().getTime(),event:\'gtm.js\'});var f=d.getElementsByTagName(s)[0],\n' +
    '  j=d.createElement(s),dl=l!=\'dataLayer\'?\'&l=\'+l:\'\';j.async=true;j.src=\n' +
    '  \'https://www.googletagmanager.com/gtm.js - id=\'+i+dl;f.parentNode.insertBefore(j,f);\n' +
    '  })(window,document,\'script\',\'dataLayer\',\'GTM-WT77L8JF\');</script>\n' +
    '  <!-- End Google Tag Manager -->\n' +
    '  <link rel="icon" href="./icons/favicon.png" type="image/png">\n' +
    '  <link rel="preconnect" href="https://fonts.googleapis.com">\n' +
    '  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>\n' +
    '  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:ital,wght@0,300;0,400;0,500;0,600;0,700;1,400&display=swap" rel="stylesheet">\n' +
    '  <script>window._hsq = window._hsq || [];</script>\n' +
    '  <script id="hs-script-loader" async defer src="https://js.hs-scripts.com/8679235.js"></script>\n' +
    '  <style>\n' +
    css +
    '\n  </style>\n' +
    '</head>\n' +
    '<body>\n' +
    '  <!-- Google Tag Manager (noscript) -->\n' +
    '  <noscript><iframe src="https://www.googletagmanager.com/ns.html - id=GTM-WT77L8JF"\n' +
    '  height="0" width="0" style="display:none;visibility:hidden"></iframe></noscript>\n' +
    '  <!-- End Google Tag Manager (noscript) -->\n' +
    '  <a class="skip-link" href="#main">Skip to content</a>\n' +
    '\n' +
    header +
    '\n' +
    main +
    '\n' +
    footer +
    '\n' +
    '  <script src="./' +
    scriptName +
    '" defer></script>\n' +
    '</body>\n' +
    '</html>\n';
  return applyBaseToHtml(normalizeHtmlPaths(html));
}

var homeCss =
  styles.brand +
  '\n\n/* Safe-area + overflow (subset of React landing #main rules) */\n#main { overflow-x: clip; }\n#main .wrap {\n  padding-left: max(1.25rem, env(safe-area-inset-left, 0px));\n  padding-right: max(1.25rem, env(safe-area-inset-right, 0px));\n}\n';

var indexHtml = shell(
  'BetterEngineer | Staff Augmentation & Engineering Talent',
  'Scale your team with vetted software engineers across the Americas. Staff augmentation, Slack integration, and the BetterEngineer hiring platform.',
  homeCss,
  headerHome,
  mainHome,
  'home.js',
);

var reactCss = styles.brand + '\n\n' + styles.reactExtra;

var reactHtml = shell(
  'React Engineers | BetterEngineer',
  'Hire senior React developers in your time zone. Staff augmentation, UI modernization, and shipping support from BetterEngineer.',
  reactCss,
  headerReact,
  reactMain,
  'react-page.js',
);

var reactFintechHtml = shell(
  'Fintech React Engineers | BetterEngineer',
  'Hire senior React engineers for fintech teams. Build onboarding, payment, and risk workflows with timezone-aligned staff augmentation support.',
  reactCss,
  headerReact,
  reactFintechMain,
  'react-page.js',
);

var aiManufacturingDescription =
  'We help manufacturing companies audit disconnected ERP, CRM, sales, and operations systems, then build practical AI workflows and integrations that reduce manual work.';
var aiManufacturingExtraHead =
  '  <link rel="canonical" href="https://www.betterengineer.com/services/ai-systems-readiness-for-manufacturing/">\n' +
  '  <meta property="og:title" content="AI Systems Readiness for Manufacturing Companies | BetterEngineer">\n' +
  '  <meta property="og:description" content="' +
  aiManufacturingDescription.replace(/"/g, '&quot;') +
  '">\n' +
  '  <meta property="og:type" content="website">\n';

var aiManufacturingHtml = shell(
  'AI Systems Readiness for Manufacturing Companies | BetterEngineer',
  aiManufacturingDescription,
  reactCss,
  headerAiManufacturing,
  aiManufacturingMain,
  'react-page.js',
  aiManufacturingExtraHead,
);

var hireAiReadyDescription =
  'Hire AI-ready engineers, machine learning engineers, and AI app developers from Latin America. Senior, pre-vetted, and assessed for genuine AI fluency before you meet them.';

function hireAiReadyCanonicalHref() {
  if (siteBase === '/ai-fluent-engineers' && githubPagesCname) {
    return 'https://' + githubPagesCname + '/ai-fluent-engineers/';
  }
  return 'https://www.betterengineer.com/services/hire-ai-ready-engineers/';
}

var hireAiReadyExtraHead =
  '  <link rel="canonical" href="' +
  hireAiReadyCanonicalHref() +
  '">\n' +
  '  <meta property="og:title" content="Hire AI-Ready Engineers | BetterEngineer">\n' +
  '  <meta property="og:description" content="' +
  hireAiReadyDescription.replace(/"/g, '&quot;') +
  '">\n' +
  '  <meta property="og:type" content="website">\n';

var hireAiReadyHtml = shell(
  'Hire AI-Ready Engineers | BetterEngineer, AI Development Team from LATAM',
  hireAiReadyDescription,
  reactCss,
  headerHireAiReady,
  hireAiReadyMain,
  'react-page.js',
  hireAiReadyExtraHead,
);

if (outputRoot) {
  fs.rmSync(path.join(root, outputRoot), { recursive: true, force: true });
}

writeFileSafe('index.html', indexHtml);
writeFileSafe(path.join('technologies', 'react', 'index.html'), reactHtml);
writeFileSafe(path.join('technologies', 'react-fintech', 'index.html'), reactFintechHtml);
writeFileSafe('react.html', reactHtml);
writeFileSafe('react-fintech.html', reactFintechHtml);
writeFileSafe(path.join('services', 'ai-systems-readiness-for-manufacturing', 'index.html'), aiManufacturingHtml);
writeFileSafe('ai-systems-readiness-for-manufacturing.html', aiManufacturingHtml);
writeFileSafe(path.join('services', 'hire-ai-ready-engineers', 'index.html'), hireAiReadyHtml);
writeFileSafe('hire-ai-ready-engineers.html', hireAiReadyHtml);
if (!pagesPublishRoot) {
  writeFileSafe('.nojekyll', '');
}

if (outputRoot) {
  copyIntoOutput('icons');
  copyIntoOutput('images');
  copyFileIntoOutput('home.js');
  copyFileIntoOutput('react-page.js');
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
