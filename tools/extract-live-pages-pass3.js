'use strict';

/**
 * Pass 3: fix job-page lists, parse multi-step form SSR fields cleanly,
 * and rewrite industry/case-study notes without nav chrome.
 */

var fs = require('fs');
var path = require('path');
var { JSDOM } = require('jsdom');

var root = path.join(__dirname, '..');
var outDir = path.join(root, 'tmp-live-extract');
var rawDir = path.join(outDir, 'raw');

function textClean(s) {
  return (s || '').replace(/\u00a0/g, ' ').replace(/\s+\n/g, '\n').replace(/\n{3,}/g, '\n\n').trim();
}

function meta(doc, sel) {
  var el = doc.querySelector(sel);
  if (!el) return '';
  return (el.getAttribute('content') || el.getAttribute('href') || '').trim();
}

function stripChrome(doc) {
  [
    'header',
    'footer',
    'nav',
    '.header',
    '.footer',
    '.header-wrapper',
    '.footer-container-wrapper',
    '#hs-eu-cookie-confirmation',
    'script',
    'style',
    'noscript',
    'iframe'
  ].forEach(function (sel) {
    doc.querySelectorAll(sel).forEach(function (el) {
      el.remove();
    });
  });
  // HubSpot global header section often first dnd
  doc.querySelectorAll('section.navigation, .navbar, #mobile-menu, .menu-wrapper').forEach(function (el) {
    el.remove();
  });
}

function listItems(ul) {
  var items = [];
  ul.querySelectorAll(':scope > li').forEach(function (li) {
    items.push(textClean(li.textContent));
  });
  return items;
}

function extractJob(slug, url, html) {
  var orig = new JSDOM(html).window.document;
  var title = textClean((orig.querySelector('title') || {}).textContent || '');
  var description = meta(orig, 'meta[name="description"]');
  var canonical = meta(orig, 'link[rel="canonical"]');
  var robots = meta(orig, 'meta[name="robots"]') || 'none';
  var ogTitle = meta(orig, 'meta[property="og:title"]');
  var ogDescription = meta(orig, 'meta[property="og:description"]');
  var ogImage = meta(orig, 'meta[property="og:image"]');
  var ogUrl = meta(orig, 'meta[property="og:url"]');

  var dom = new JSDOM(html);
  var doc = dom.window.document;
  stripChrome(doc);
  var main = doc.querySelector('main') || doc.querySelector('.body-container-wrapper') || doc.body;

  var jobTitle = textClean((main.querySelector('.title') || {}).textContent || '');
  var metaBits = [];
  main.querySelectorAll('.icon-text').forEach(function (el) {
    metaBits.push(textClean(el.textContent));
  });
  var apply = main.querySelector('.apply-button a');
  var applyLabel = apply ? textClean(apply.textContent) : '';
  var applyHref = apply ? apply.getAttribute('href') : '';

  var jdIntro = textClean((main.querySelector('.normal-text') || {}).textContent || '');
  var jdList = [];
  var descUl = main.querySelector('.description ul');
  if (descUl) jdList = listItems(descUl);

  var reqList = [];
  var qualUl = main.querySelector('.qualifications ul');
  if (qualUl) reqList = listItems(qualUl);

  var english = textClean((main.querySelector('.english') || {}).textContent || '');
  var additionalHead = textClean((main.querySelector('.heading-additional-information') || {}).textContent || '');
  var additionalBody = textClean((main.querySelector('.candidates-time-zone-text') || {}).textContent || '');
  var about = textClean((main.querySelector('.powered-by-text') || {}).textContent || '');

  var communityH = '';
  var communityP = '';
  var h3 = main.querySelector('.small-banner-title, h3');
  if (h3) communityH = textClean(h3.textContent);
  var cp = main.querySelector('.small-banner-description');
  if (cp) communityP = textClean(cp.textContent);
  var communityCta = main.querySelector('.small-banner-section a, .small-banner-button a, a[href*="join"]');
  // find Join Better Engineer link near banner
  var joinLabel = '';
  var joinHref = '';
  main.querySelectorAll('a').forEach(function (a) {
    var t = textClean(a.textContent);
    if (/Join Better Engineer/i.test(t)) {
      joinLabel = t;
      joinHref = a.getAttribute('href') || '';
    }
  });

  var jobLinks = [];
  main.querySelectorAll('a.job-link, .li-job-item a').forEach(function (a) {
    jobLinks.push({ label: textClean(a.textContent), href: a.getAttribute('href') });
  });

  var images = [];
  main.querySelectorAll('img').forEach(function (img) {
    var src = img.getAttribute('src') || '';
    if (!src || /spacer|pixel|1x1/i.test(src)) return;
    // skip tiny logos in footer duplicates if alt empty and width tiny? keep work-from-home + logo
    images.push({ alt: textClean(img.getAttribute('alt') || ''), src: src.split('?')[0] + (src.indexOf('?') >= 0 ? src.slice(src.indexOf('?')) : '') });
  });
  // dedupe by path without size params name
  var seen = Object.create(null);
  images = images.filter(function (img) {
    var key = img.src.replace(/width=\d+|&height=\d+/g, '');
    if (seen[key]) return false;
    seen[key] = true;
    return true;
  });

  var lines = [];
  lines.push('# Extraction: ' + slug);
  lines.push('');
  lines.push('- Source URL: ' + url);
  lines.push('- Extracted: ' + new Date().toISOString().slice(0, 10));
  lines.push('- Method: pass3 job semantic extract');
  lines.push('- Note: No semantic H1; job title is `div.title`.');
  lines.push('');
  lines.push('## 1. Source metadata');
  lines.push('');
  lines.push('| Field | Value |');
  lines.push('| --- | --- |');
  lines.push('| title tag | `' + title + '` |');
  lines.push('| meta description | `' + description + '` |');
  lines.push('| canonical | `' + canonical + '` |');
  lines.push('| robots | `' + robots + '` |');
  lines.push('| H1 | `(none)` |');
  lines.push('| Job title | `' + jobTitle + '` |');
  lines.push('| og:title | `' + ogTitle + '` |');
  lines.push('| og:description | `' + ogDescription + '` |');
  lines.push('| og:image | `' + ogImage + '` |');
  lines.push('| og:url | `' + ogUrl + '` |');
  lines.push('');
  lines.push('### Section outline');
  lines.push('');
  lines.push('1. **div.title** ' + jobTitle);
  lines.push('2. **meta chips** Work remotely / Full-time / Apply from anywhere');
  lines.push('3. **CTA** Apply as a Better Engineer');
  lines.push('4. **Job Description** (+ bullet list)');
  lines.push('5. **Job Requirements** (+ bullet list)');
  lines.push('6. **English / NA experience note**');
  lines.push('7. **Additional Information**');
  lines.push('8. **About BetterEngineer blurb**');
  lines.push('9. **Community banner**');
  lines.push('10. **Select a job to learn more** (job list)');
  lines.push('');
  lines.push('## 2. Content (VERBATIM)');
  lines.push('');
  lines.push('### Title');
  lines.push('');
  lines.push('> ' + jobTitle);
  lines.push('');
  lines.push('**meta:**');
  lines.push('');
  metaBits.forEach(function (m) {
    lines.push('> - ' + m);
  });
  lines.push('');
  lines.push('**CTA:**');
  lines.push('');
  lines.push('> ' + applyLabel);
  lines.push('> href: `' + applyHref + '`');
  lines.push('');
  lines.push('### Job Description');
  lines.push('');
  lines.push('> Job Description');
  lines.push('');
  lines.push('> ' + jdIntro);
  lines.push('');
  lines.push('**list:**');
  lines.push('');
  jdList.forEach(function (it) {
    lines.push('> - ' + it);
  });
  lines.push('');
  lines.push('### Job Requirements');
  lines.push('');
  lines.push('> Job Requirements');
  lines.push('');
  lines.push('**list:**');
  lines.push('');
  reqList.forEach(function (it) {
    lines.push('> - ' + it);
  });
  lines.push('');
  if (english) {
    lines.push('### English / experience note');
    lines.push('');
    lines.push('> ' + english);
    lines.push('');
  }
  if (additionalHead || additionalBody) {
    lines.push('### Additional Information');
    lines.push('');
    if (additionalHead) lines.push('> ' + additionalHead);
    if (additionalBody) {
      lines.push('');
      lines.push('> ' + additionalBody);
    }
    lines.push('');
  }
  if (about) {
    lines.push('### About BetterEngineer (shared)');
    lines.push('');
    lines.push('> ' + about.replace(/\s+/g, ' '));
    lines.push('');
  }
  if (communityH) {
    lines.push('### Community banner');
    lines.push('');
    lines.push('> ' + communityH);
    lines.push('');
    if (communityP) {
      lines.push('> ' + communityP);
      lines.push('');
    }
    if (joinLabel) {
      lines.push('**CTA:** > ' + joinLabel + ' → `' + joinHref + '`');
      lines.push('');
    }
  }
  lines.push('### Job list');
  lines.push('');
  jobLinks.forEach(function (j) {
    lines.push('- `' + j.label + '` → `' + j.href + '`');
  });
  lines.push('');
  lines.push('## 3. Images that matter');
  lines.push('');
  images.forEach(function (img, i) {
    lines.push((i + 1) + '. alt=`' + img.alt + '`');
    lines.push('   - ' + img.src);
  });
  lines.push('');
  lines.push('## 4. Forms');
  lines.push('');
  lines.push('None. Apply CTA → external candidate signup.');
  lines.push('');
  lines.push('## 5. Template notes');
  lines.push('');
  lines.push('Shares careers **job-detail** template with sibling role URLs. Role-specific: title, meta description, JD intro, JD bullets, requirements bullets, additional info. Shared: chips, apply CTA target, about blurb, community banner, job list.');
  lines.push('');

  return {
    md: lines.join('\n'),
    jobTitle: jobTitle,
    jdIntro: jdIntro,
    jdList: jdList,
    reqList: reqList,
    english: english,
    additionalHead: additionalHead,
    additionalBody: additionalBody,
    about: about,
    metaBits: metaBits,
    applyLabel: applyLabel,
    applyHref: applyHref,
    communityH: communityH,
    communityP: communityP,
    joinLabel: joinLabel,
    joinHref: joinHref,
    jobLinks: jobLinks
  };
}

function compare(fe, py) {
  function sharedList(a, b) {
    var set = Object.create(null);
    b.forEach(function (x) {
      set[x] = true;
    });
    return a.filter(function (x) {
      return set[x];
    });
  }
  function uniqueList(a, b) {
    var set = Object.create(null);
    b.forEach(function (x) {
      set[x] = true;
    });
    return a.filter(function (x) {
      return !set[x];
    });
  }
  var lines = [];
  lines.push('# Template comparison: careers role pages');
  lines.push('');
  lines.push('**YES, shared job-detail template.** Unique copy is role name + JD/requirements/additional info.');
  lines.push('');
  lines.push('## Shared template pieces');
  lines.push('');
  lines.push('- title tag shell: `Engineer Careers | Remote Software Engineering Jobs at BetterEngineer`');
  lines.push('- meta chips: `' + fe.metaBits.join('`, `') + '`');
  lines.push('- CTA: `' + fe.applyLabel + '` → `' + fe.applyHref + '`');
  lines.push('- Section labels: Job Description, Job Requirements, Additional Information');
  lines.push('- English note (shared if identical):');
  lines.push('');
  lines.push('> ' + fe.english);
  lines.push('');
  lines.push('- About blurb:');
  lines.push('');
  lines.push('> ' + (fe.about || '').replace(/\s+/g, ' '));
  lines.push('');
  lines.push('- Community: `' + fe.communityH + '` / `' + fe.communityP + '`');
  lines.push('- Job list sidebar (same openings)');
  lines.push('');
  lines.push('### Shared JD bullets');
  lines.push('');
  sharedList(fe.jdList, py.jdList).forEach(function (it) {
    lines.push('> - ' + it);
  });
  lines.push('');
  lines.push('### Shared requirement bullets');
  lines.push('');
  sharedList(fe.reqList, py.reqList).forEach(function (it) {
    lines.push('> - ' + it);
  });
  lines.push('');
  lines.push('## Unique to Front-end Engineer');
  lines.push('');
  lines.push('- Title: `' + fe.jobTitle + '`');
  lines.push('- Intro:');
  lines.push('');
  lines.push('> ' + fe.jdIntro);
  lines.push('');
  lines.push('- JD bullets only on FE:');
  uniqueList(fe.jdList, py.jdList).forEach(function (it) {
    lines.push('> - ' + it);
  });
  lines.push('');
  lines.push('- Requirements only on FE:');
  uniqueList(fe.reqList, py.reqList).forEach(function (it) {
    lines.push('> - ' + it);
  });
  lines.push('');
  lines.push('- Additional: `' + fe.additionalBody + '`');
  lines.push('');
  lines.push('## Unique to Python Engineer');
  lines.push('');
  lines.push('- Title: `' + py.jobTitle + '`');
  lines.push('- Intro:');
  lines.push('');
  lines.push('> ' + py.jdIntro);
  lines.push('');
  lines.push('- JD bullets only on PY:');
  uniqueList(py.jdList, fe.jdList).forEach(function (it) {
    lines.push('> - ' + it);
  });
  lines.push('');
  lines.push('- Requirements only on PY:');
  uniqueList(py.reqList, fe.reqList).forEach(function (it) {
    lines.push('> - ' + it);
  });
  lines.push('');
  lines.push('- Additional: `' + py.additionalBody + '`');
  lines.push('');
  return lines.join('\n');
}

function extractMarketing(slug, url, html, opts) {
  opts = opts || {};
  var orig = new JSDOM(html).window.document;
  var title = textClean((orig.querySelector('title') || {}).textContent || '');
  var description = meta(orig, 'meta[name="description"]');
  var canonical = meta(orig, 'link[rel="canonical"]');
  var robots = meta(orig, 'meta[name="robots"]') || 'none';
  var h1 = textClean((orig.querySelector('h1') || {}).textContent || '');
  var ogTitle = meta(orig, 'meta[property="og:title"]');
  var ogDescription = meta(orig, 'meta[property="og:description"]');
  var ogImage = meta(orig, 'meta[property="og:image"]');
  var ogUrl = meta(orig, 'meta[property="og:url"]');

  var dom = new JSDOM(html);
  var doc = dom.window.document;
  stripChrome(doc);
  var main = doc.querySelector('main') || doc.querySelector('.body-container-wrapper') || doc.body;

  var headings = [];
  main.querySelectorAll('h1,h2,h3,h4,h5,h6').forEach(function (h) {
    var t = textClean(h.textContent);
    if (t) headings.push({ level: h.tagName.toLowerCase(), text: t });
  });

  var blocks = [];
  main.querySelectorAll('h1,h2,h3,h4,h5,h6,p,ul,ol').forEach(function (el) {
    var tag = el.tagName.toLowerCase();
    if (tag === 'ul' || tag === 'ol') {
      // skip if looks like leftover nav
      var items = listItems(el);
      if (!items.length) return;
      if (items.length <= 8 && items.every(function (it) {
        return it.length < 40;
      }) && /Staff Augmentation|Who We Are|Browse Roles/.test(items.join(' '))) {
        return;
      }
      blocks.push({ type: tag, items: items });
      return;
    }
    var t = textClean(el.textContent);
    if (!t) return;
    if (/^Services$|^Resources$|^About$/i.test(t)) return;
    blocks.push({ type: tag, text: t });
  });

  // FAQs: h3 under FAQ heading + following p
  var faqs = [];
  var inFaq = false;
  for (var i = 0; i < blocks.length; i++) {
    var b = blocks[i];
    if (/^h[23]$/.test(b.type) && /frequently asked/i.test(b.text || '')) {
      inFaq = true;
      continue;
    }
    if (inFaq && b.type === 'h3') {
      var ans = [];
      var j = i + 1;
      while (j < blocks.length && blocks[j].type === 'p') {
        ans.push(blocks[j].text);
        j++;
      }
      faqs.push({ q: b.text, a: ans.join('\n\n') });
    }
    if (inFaq && /^h2$/.test(b.type) && !/frequently asked/i.test(b.text || '')) inFaq = false;
  }

  var images = [];
  var seenImg = Object.create(null);
  main.querySelectorAll('img').forEach(function (img) {
    var src = img.getAttribute('src') || img.getAttribute('data-src') || '';
    if (!src || /spacer|pixel|1x1|tracking|blank/i.test(src)) return;
    if (/Logo-betterengineer|logo_betterengineer|be-favicon/i.test(src) && images.length > 3) return;
    var key = src.replace(/width=\d+/g, '');
    if (seenImg[key]) return;
    seenImg[key] = true;
    images.push({ alt: textClean(img.getAttribute('alt') || ''), src: src });
  });

  var ctas = [];
  main.querySelectorAll('a').forEach(function (a) {
    var cls = (a.getAttribute('class') || '').toLowerCase();
    var t = textClean(a.textContent);
    if (!t || t.length > 60) return;
    if (/btn|button|cta|hs-button/i.test(cls) || /Hire|Book|Schedule|Get Started|Talk|Contact|Download|Apply/i.test(t)) {
      ctas.push({ label: t, href: a.getAttribute('href') || '' });
    }
  });
  // dedupe
  var seenCta = Object.create(null);
  ctas = ctas.filter(function (c) {
    var k = c.label + '|' + c.href;
    if (seenCta[k]) return false;
    seenCta[k] = true;
    return true;
  });

  var forms = [];
  orig.querySelectorAll('[data-form-id]').forEach(function (el) {
    forms.push({
      formId: el.getAttribute('data-form-id'),
      portalId: el.getAttribute('data-portal-id'),
      region: el.getAttribute('data-region')
    });
  });

  var lines = [];
  lines.push('# Extraction: ' + slug);
  lines.push('');
  lines.push('- Source URL: ' + url);
  lines.push('- Extracted: ' + new Date().toISOString().slice(0, 10));
  lines.push('- Method: pass3 chrome-stripped content extract');
  lines.push('');
  lines.push('## 1. Source metadata');
  lines.push('');
  lines.push('| Field | Value |');
  lines.push('| --- | --- |');
  lines.push('| title tag | `' + title + '` |');
  lines.push('| meta description | `' + description + '` |');
  lines.push('| canonical | `' + canonical + '` |');
  lines.push('| robots | `' + robots + '` |');
  lines.push('| H1 | `' + h1 + '` |');
  lines.push('| og:title | `' + ogTitle + '` |');
  lines.push('| og:description | `' + ogDescription + '` |');
  lines.push('| og:image | `' + ogImage + '` |');
  lines.push('| og:url | `' + ogUrl + '` |');
  lines.push('');
  lines.push('### Heading outline');
  lines.push('');
  headings.forEach(function (h, i) {
    lines.push(i + 1 + '. **' + h.level.toUpperCase() + '** ' + h.text);
  });
  lines.push('');
  lines.push('## 2. Content (VERBATIM)');
  lines.push('');
  blocks.forEach(function (b) {
    if (/^h[1-6]$/.test(b.type)) {
      lines.push('### ' + b.type.toUpperCase());
      lines.push('');
      lines.push('> ' + b.text);
      lines.push('');
      return;
    }
    if (b.type === 'ul' || b.type === 'ol') {
      lines.push('**list (' + b.type + '):**');
      lines.push('');
      b.items.forEach(function (it) {
        lines.push('> - ' + it);
      });
      lines.push('');
      return;
    }
    lines.push('**p:**');
    lines.push('');
    lines.push('> ' + b.text);
    lines.push('');
  });
  if (faqs.length) {
    lines.push('## FAQs');
    lines.push('');
    faqs.forEach(function (f, i) {
      lines.push('### Q' + (i + 1));
      lines.push('');
      lines.push('> ' + f.q);
      lines.push('');
      lines.push('**A:**');
      lines.push('');
      f.a.split(/\n/).forEach(function (ln) {
        lines.push('> ' + ln);
      });
      lines.push('');
    });
  }
  lines.push('## 3. Images that matter');
  lines.push('');
  images.slice(0, 40).forEach(function (img, i) {
    lines.push(i + 1 + '. alt=`' + img.alt + '`');
    lines.push('   - ' + img.src);
  });
  lines.push('');
  lines.push('## 4. CTAs');
  lines.push('');
  ctas.slice(0, 30).forEach(function (c) {
    lines.push('- `' + c.label + '` → `' + c.href + '`');
  });
  lines.push('');
  lines.push('## 5. Forms');
  lines.push('');
  if (!forms.length) lines.push('None detected.');
  else
    forms.forEach(function (f) {
      lines.push('- HubSpot form id=`' + f.formId + '` portal=`' + f.portalId + '` region=`' + (f.region || '') + '`');
    });
  lines.push('');
  lines.push('## 6. Template notes');
  lines.push('');
  lines.push(opts.templateNote || 'See comparison files.');
  lines.push('');
  return { md: lines.join('\n'), headings: headings, h1: h1, title: title };
}

function parseFormSsr(html) {
  var dom = new JSDOM(html);
  var doc = dom.window.document;
  var fields = [];
  doc.querySelectorAll('.hs-form-field').forEach(function (wrap) {
    var labelEl = wrap.querySelector('label');
    var label = labelEl ? textClean(labelEl.textContent.replace(/\*/g, '').replace(/required/i, '')) : '';
    var input = wrap.querySelector('input:not([type="hidden"]):not([type="submit"]), select, textarea');
    if (!input) {
      // radio/checkbox groups
      var inputs = wrap.querySelectorAll('input[type="radio"], input[type="checkbox"]');
      if (!inputs.length) return;
      var options = [];
      inputs.forEach(function (inp) {
        var lab = inp.parentElement ? textClean(inp.parentElement.textContent) : inp.value;
        options.push(lab || inp.value);
      });
      fields.push({
        label: label,
        type: inputs[0].getAttribute('type'),
        name: inputs[0].getAttribute('name') || '',
        required: !!wrap.querySelector('.hs-form-required') || /required/i.test(wrap.textContent.slice(0, 80)),
        options: options
      });
      return;
    }
    var type = (input.getAttribute('type') || input.tagName.toLowerCase()).toLowerCase();
    var options = [];
    if (input.tagName.toLowerCase() === 'select') {
      input.querySelectorAll('option').forEach(function (o) {
        var ot = textClean(o.textContent);
        if (ot) options.push(ot);
      });
    }
    fields.push({
      label: label,
      type: type,
      name: input.getAttribute('name') || '',
      placeholder: input.getAttribute('placeholder') || '',
      required: input.hasAttribute('required') || input.getAttribute('aria-required') === 'true' || !!wrap.querySelector('.hs-form-required'),
      options: options
    });
  });
  // step detection via fieldsets or data attributes
  var steps = [];
  doc.querySelectorAll('fieldset, [data-step], .hs-form-field-step, .form-step').forEach(function (el, i) {
    var legend = el.querySelector('legend');
    steps.push({
      index: i + 1,
      legend: legend ? textClean(legend.textContent) : textClean(el.getAttribute('data-step') || el.className).slice(0, 80),
      fieldCount: el.querySelectorAll('input:not([type=hidden]), select, textarea').length
    });
  });
  return { fields: fields, steps: steps, htmlBytes: Buffer.byteLength(html, 'utf8') };
}

// --- run ---
var fe = extractJob(
  'careers-front-end-engineer',
  'https://www.betterengineer.com/careers/front-end-engineer',
  fs.readFileSync(path.join(rawDir, 'careers-front-end-engineer.html'), 'utf8')
);
var py = extractJob(
  'careers-python-engineer',
  'https://www.betterengineer.com/careers/python-engineer',
  fs.readFileSync(path.join(rawDir, 'careers-python-engineer.html'), 'utf8')
);
fs.writeFileSync(path.join(outDir, 'careers-front-end-engineer.md'), fe.md);
fs.writeFileSync(path.join(outDir, 'careers-python-engineer.md'), py.md);
fs.writeFileSync(path.join(outDir, '_compare-careers-roles.md'), compare(fe, py));
console.log('jobs ok', fe.jdList.length, py.jdList.length, 'reqs', fe.reqList.length, py.reqList.length);

var marketing = [
  {
    slug: 'fintech',
    url: 'https://www.betterengineer.com/fintech',
    note: 'Industry landing template (shared shell with martech/healthtech; industry-specific solution pillars).'
  },
  {
    slug: 'martech',
    url: 'https://www.betterengineer.com/martech',
    note: 'Industry landing template (shared shell with fintech/healthtech; industry-specific solution pillars).'
  },
  {
    slug: 'healthtech',
    url: 'https://www.betterengineer.com/healthtech',
    note: 'Industry landing template (shared shell with fintech/martech; industry-specific solution pillars).'
  },
  {
    slug: 'case-studies-livecgi',
    url: 'https://www.betterengineer.com/case-studies/livecgi',
    note: 'Case study template (shared with wasteplace/securelink; client-specific story content).'
  },
  {
    slug: 'case-studies-wasteplace',
    url: 'https://www.betterengineer.com/case-studies/wasteplace',
    note: 'Case study template (shared with livecgi/securelink; client-specific story content).'
  },
  {
    slug: 'case-studies-securelink',
    url: 'https://www.betterengineer.com/case-studies/securelink',
    note: 'Case study template (shared with livecgi/wasteplace; client-specific story content).'
  }
];

var mAll = {};
marketing.forEach(function (p) {
  var html = fs.readFileSync(path.join(rawDir, p.slug + '.html'), 'utf8');
  var r = extractMarketing(p.slug, p.url, html, { templateNote: p.note });
  mAll[p.slug] = r;
  fs.writeFileSync(path.join(outDir, p.slug + '.md'), r.md);
  console.log('marketing', p.slug, 'headings', r.headings.length);
});

// industry compare refresh
var indLines = [];
indLines.push('# Template comparison: industry pages');
indLines.push('');
indLines.push('**YES, shared industry landing template.** Same late-page sections (tech strip, process, FAQ, closing CTAs). Unique: hero H1/copy and solution-pillar H2/H4 clusters.');
indLines.push('');
['fintech', 'martech', 'healthtech'].forEach(function (k) {
  indLines.push('## ' + k);
  indLines.push('');
  indLines.push('- title: `' + mAll[k].title + '`');
  indLines.push('- H1: `' + mAll[k].h1 + '`');
  mAll[k].headings.forEach(function (h) {
    indLines.push('  - **' + h.level.toUpperCase() + '** ' + h.text);
  });
  indLines.push('');
});
fs.writeFileSync(path.join(outDir, '_compare-industry-pages.md'), indLines.join('\n'));

var csLines = [];
csLines.push('# Template comparison: case studies');
csLines.push('');
csLines.push('**YES, shared case-study template.** Unique: client name, challenge/solution story, stats, images.');
csLines.push('');
['case-studies-livecgi', 'case-studies-wasteplace', 'case-studies-securelink'].forEach(function (k) {
  csLines.push('## ' + k);
  csLines.push('');
  csLines.push('- title: `' + mAll[k].title + '`');
  csLines.push('- H1: `' + mAll[k].h1 + '`');
  mAll[k].headings.forEach(function (h) {
    csLines.push('  - **' + h.level.toUpperCase() + '** ' + h.text);
  });
  csLines.push('');
});
fs.writeFileSync(path.join(outDir, '_compare-case-studies.md'), csLines.join('\n'));

// form SSR
var ssr = fs.readFileSync(path.join(rawDir, 'multi-step-contact-form.ssr.html'), 'utf8');
var parsed = parseFormSsr(ssr);
var msDoc = new JSDOM(fs.readFileSync(path.join(rawDir, 'multi-step-contact-form.html'), 'utf8')).window.document;
var ms = [];
ms.push('# Extraction: multi-step-contact-form');
ms.push('');
ms.push('- Source URL: https://www.betterengineer.com/multi-step-contact-form');
ms.push('- Extracted: ' + new Date().toISOString().slice(0, 10));
ms.push('- Method: page HTML + HubSpot SSR form definition (pass3)');
ms.push('');
ms.push('## 1. Source metadata');
ms.push('');
ms.push('| Field | Value |');
ms.push('| --- | --- |');
ms.push('| title tag | `' + textClean((msDoc.querySelector('title') || {}).textContent || '') + '` |');
ms.push('| meta description | `' + meta(msDoc, 'meta[name="description"]') + '` |');
ms.push('| canonical | `' + meta(msDoc, 'link[rel="canonical"]') + '` |');
ms.push('| robots | `' + meta(msDoc, 'meta[name="robots"]') + '` |');
ms.push('| H1 | `(none)` |');
ms.push('| Visible headline | `Let\'s define your ideal engineer` |');
ms.push('| HubSpot portal | `8679235` |');
ms.push('| HubSpot form id | `d43da6a3-79aa-45d4-99be-0d1e8162daf7` |');
ms.push('| SSR bytes | `' + parsed.htmlBytes + '` |');
ms.push('');
ms.push('## 2. Page copy (VERBATIM)');
ms.push('');
ms.push('> Let\'s define your ideal engineer');
ms.push('');
ms.push('**CTA:** `Book a Call` → `https://calendly.com/tim-salsamobi/30min`');
ms.push('');
ms.push('## 3. Form fields (from SSR)');
ms.push('');
if (!parsed.fields.length) {
  ms.push('No `.hs-form-field` nodes parsed. Inspect `raw/multi-step-contact-form.ssr.html`.');
} else {
  parsed.fields.forEach(function (f, i) {
    ms.push(
      i +
        1 +
        '. **' +
        (f.label || f.name || '(unlabeled)') +
        '** type=`' +
        f.type +
        '`' +
        (f.name ? ' name=`' + f.name + '`' : '') +
        (f.placeholder ? ' placeholder=`' + f.placeholder + '`' : '') +
        (f.required ? ' required' : '') +
        (f.options && f.options.length ? '\n   - options: ' + f.options.join(' | ') : '')
    );
  });
}
ms.push('');
ms.push('### Steps');
ms.push('');
if (!parsed.steps.length) {
  ms.push('No fieldset/step wrappers in SSR. Likely single HubSpot form with progressive UI, or steps encoded in custom module JS on the page.');
} else {
  parsed.steps.forEach(function (s) {
    ms.push('- Step ' + s.index + ': ' + s.legend + ' (fields≈' + s.fieldCount + ')');
  });
}
ms.push('');
ms.push('## 4. Template notes');
ms.push('');
ms.push('Standalone lead form page (`noindex, nofollow`). Not shared with marketing section templates.');
ms.push('');
fs.writeFileSync(path.join(outDir, 'multi-step-contact-form.md'), ms.join('\n'));
console.log('form fields', parsed.fields.length, 'steps', parsed.steps.length);

// dump field JSON for debugging
fs.writeFileSync(path.join(rawDir, 'multi-step-contact-form.fields.json'), JSON.stringify(parsed, null, 2));

// README index
var pages = [
  'careers',
  'careers-front-end-engineer',
  'careers-python-engineer',
  'fintech',
  'martech',
  'healthtech',
  'case-studies-livecgi',
  'case-studies-wasteplace',
  'case-studies-securelink',
  'terms-of-service',
  'privacy-policy',
  'multi-step-contact-form',
  'toptal-hire-inspect'
];
var idx = [];
idx.push('# Live extract index');
idx.push('');
idx.push('Generated under `tmp-live-extract/`. Raw HTML in `raw/`.');
idx.push('');
pages.forEach(function (p) {
  idx.push('- [' + p + '](' + p + '.md)');
});
idx.push('');
idx.push('## Comparisons');
idx.push('');
idx.push('- [_compare-careers-roles.md](_compare-careers-roles.md)');
idx.push('- [_compare-industry-pages.md](_compare-industry-pages.md)');
idx.push('- [_compare-case-studies.md](_compare-case-studies.md)');
idx.push('');
fs.writeFileSync(path.join(outDir, 'README.md'), idx.join('\n'));
console.log('done');
