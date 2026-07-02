'use strict';
const fs   = require('fs');
const path = require('path');

// Standard GTM snippets for GTM-WT77L8JF
const GTM_HEAD = `<!-- Google Tag Manager --><script>(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','GTM-WT77L8JF');</script><!-- End Google Tag Manager -->`;

const GTM_BODY = `<!-- Google Tag Manager (noscript) --><noscript><iframe src="https://www.googletagmanager.com/ns.html?id=GTM-WT77L8JF" height="0" width="0" style="display:none;visibility:hidden"></iframe></noscript><!-- End Google Tag Manager (noscript) -->`;

const PLACEHOLDER = `<!-- Google Tag Manager would go here (GTM-WT77L8JF), same as your current setup -->`;

// All 10 role pages
const pages = [
  'roles/index.html',
  'roles/ai-engineers/index.html',
  'roles/back-end-engineers/index.html',
  'roles/data-engineers/index.html',
  'roles/data-science-engineers/index.html',
  'roles/devops-engineers/index.html',
  'roles/front-end-engineers/index.html',
  'roles/full-stack-engineers/index.html',
  'roles/mobile-engineers/index.html',
  'roles/qa-engineers/index.html',
];

let updated = 0;
pages.forEach(f => {
  let html = fs.readFileSync(f, 'utf8');
  const before = html;

  // 1. Replace placeholder comment in <head> with live GTM head snippet
  if (html.includes(PLACEHOLDER)) {
    html = html.replace(PLACEHOLDER, GTM_HEAD);
  } else if (!html.includes('gtm.start')) {
    // No placeholder and no live snippet — inject before </head>
    html = html.replace('</head>', GTM_HEAD + '</head>');
  }

  // 2. Add noscript body tag immediately after <body> (only if missing)
  if (!html.includes('GTM-WT77L8JF\"\nheight') && !html.includes('ns.html?id=GTM')) {
    // The body tag in these single-line files is followed by a space and a skip-link
    html = html.replace('<body> <a class="skip-link"', '<body> ' + GTM_BODY + ' <a class="skip-link"');
  }

  if (html !== before) {
    fs.writeFileSync(f, html);
    console.log('Updated:', f);
    updated++;
  } else {
    console.log('No change:', f);
  }
});

console.log(`\nDone. Updated ${updated}/${pages.length} pages.`);
