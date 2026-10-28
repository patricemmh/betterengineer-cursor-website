'use strict';

/**
 * Second-pass extractor for pages that use non-semantic markup or JS forms.
 * Writes/updates markdown under tmp-live-extract/.
 */

var fs = require('fs');
var path = require('path');
var https = require('https');
var { JSDOM } = require('jsdom');

var root = path.join(__dirname, '..');
var outDir = path.join(root, 'tmp-live-extract');
var rawDir = path.join(outDir, 'raw');

function fetchUrl(url, redirectsLeft) {
  if (redirectsLeft === undefined) redirectsLeft = 8;
  return new Promise(function (resolve, reject) {
    https
      .get(
        url,
        {
          headers: {
            'User-Agent':
              'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36 betterengineer-migration/1.0',
            Accept: 'text/html,application/json,*/*;q=0.8',
            'Accept-Language': 'en-US,en;q=0.9',
            Referer: 'https://www.betterengineer.com/multi-step-contact-form'
          }
        },
        function (res) {
          if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
            res.resume();
            if (!redirectsLeft) return reject(new Error('too many redirects'));
            return resolve(fetchUrl(new URL(res.headers.location, url).toString(), redirectsLeft - 1));
          }
          var chunks = [];
          res.on('data', function (c) {
            chunks.push(c);
          });
          res.on('end', function () {
            resolve({
              status: res.statusCode,
              body: Buffer.concat(chunks).toString('utf8'),
              contentType: res.headers['content-type'] || ''
            });
          });
        }
      )
      .on('error', reject);
  });
}

function textClean(s) {
  return (s || '').replace(/\u00a0/g, ' ').replace(/[ \t]+\n/g, '\n').replace(/\n{3,}/g, '\n\n').trim();
}

function meta(doc, sel) {
  var el = doc.querySelector(sel);
  if (!el) return '';
  return (el.getAttribute('content') || el.getAttribute('href') || '').trim();
}

function stripChrome(doc) {
  // remove header/nav/footer so body extraction is clean
  [
    'header',
    'footer',
    'nav',
    '.header',
    '.footer',
    '#hs-nav-v2',
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
}

function extractJobPage(slug, url, html) {
  var dom = new JSDOM(html);
  var doc = dom.window.document;
  var title = textClean((doc.querySelector('title') || {}).textContent || '');
  var description = meta(doc, 'meta[name="description"]');
  var canonical = meta(doc, 'link[rel="canonical"]');
  var robots = meta(doc, 'meta[name="robots"]');
  var ogTitle = meta(doc, 'meta[property="og:title"]');
  var ogDescription = meta(doc, 'meta[property="og:description"]');
  var ogImage = meta(doc, 'meta[property="og:image"]');
  var ogUrl = meta(doc, 'meta[property="og:url"]');

  stripChrome(doc);
  var main = doc.querySelector('main') || doc.querySelector('.body-container-wrapper') || doc.body;

  var jobTitle = textClean((main.querySelector('.title') || {}).textContent || '');
  var metaBits = [];
  main.querySelectorAll('.icon-text, .work-remotely, .full-time, .meta-item').forEach(function (el) {
    var t = textClean(el.textContent);
    if (t) metaBits.push(t);
  });
  // fallback: spans near apply area
  main.querySelectorAll('.grid-item .icon-text, .job-meta span, .heading-top span').forEach(function (el) {
    var t = textClean(el.textContent);
    if (t && metaBits.indexOf(t) < 0) metaBits.push(t);
  });

  var applyCta = main.querySelector('.apply-button a, a[href*="sign-up/candidate"]');
  var applyLabel = applyCta ? textClean(applyCta.textContent) : '';
  var applyHref = applyCta ? applyCta.getAttribute('href') : '';

  var sections = [];
  // Job Description
  var jdHead = textClean((main.querySelector('.heading-description') || {}).textContent || 'Job Description');
  var jdBody = '';
  var jdEl = main.querySelector('.heading-description');
  if (jdEl) {
    var n = jdEl.nextElementSibling;
    while (n && !/heading-|title|qualifications|requirements|apply/i.test(n.className || '')) {
      var tx = textClean(n.textContent);
      if (tx) jdBody += (jdBody ? '\n\n' : '') + tx;
      n = n.nextElementSibling;
    }
    // also sibling container
    if (!jdBody && jdEl.parentElement) {
      jdEl.parentElement.querySelectorAll('p').forEach(function (p) {
        var t = textClean(p.textContent);
        if (t && t !== jdHead) jdBody += (jdBody ? '\n\n' : '') + t;
      });
    }
  }

  sections.push({ heading: jdHead, body: jdBody, lists: [] });

  // Qualifications / Requirements
  var qHeadEl = main.querySelector('.heading-qualifications, .heading-requirements');
  if (qHeadEl) {
    var qHead = textClean(qHeadEl.textContent);
    var lists = [];
    var qParent = qHeadEl.parentElement || main;
    qParent.querySelectorAll('ul').forEach(function (ul) {
      var items = [];
      ul.querySelectorAll(':scope > li').forEach(function (li) {
        items.push(textClean(li.textContent));
      });
      if (items.length) lists.push(items);
    });
    // paragraphs after heading
    var qBody = '';
    var qn = qHeadEl.nextElementSibling;
    while (qn && qn.tagName !== 'UL' && !/heading-|apply|footer|community/i.test(qn.className || '')) {
      if (qn.tagName === 'P') {
        var qt = textClean(qn.textContent);
        if (qt) qBody += (qBody ? '\n\n' : '') + qt;
      }
      qn = qn.nextElementSibling;
    }
    sections.push({ heading: qHead, body: qBody, lists: lists });
  }

  // About BetterEngineer blurb often present
  var aboutParas = [];
  main.querySelectorAll('p').forEach(function (p) {
    var t = textClean(p.textContent);
    if (/We connect senior software engineers/i.test(t)) aboutParas.push(t);
  });

  // community CTA
  var communityH = textClean((main.querySelector('h3') || {}).textContent || '');
  var communityBody = '';
  main.querySelectorAll('h3').forEach(function (h) {
    if (/Better Engineer Community/i.test(h.textContent)) {
      communityH = textClean(h.textContent);
      var sib = h.nextElementSibling;
      if (sib) communityBody = textClean(sib.textContent);
    }
  });

  // job list sidebar
  var jobLinks = [];
  main.querySelectorAll('a.job-link, .li-job-item a').forEach(function (a) {
    jobLinks.push({ label: textClean(a.textContent), href: a.getAttribute('href') });
  });

  // images
  var images = [];
  main.querySelectorAll('img').forEach(function (img) {
    var src = img.getAttribute('src') || '';
    if (!src || /spacer|pixel|1x1|tracking/i.test(src)) return;
    images.push({ alt: textClean(img.getAttribute('alt') || ''), src: src });
  });

  // also grab structured regions by class names present in CSS
  var rawClasses = [];
  ['title', 'heading-description', 'heading-qualifications', 'apply-button', 'image-work-from-home', 'grid-item2'].forEach(
    function (c) {
      if (main.querySelector('.' + c)) rawClasses.push(c);
    }
  );

  var lines = [];
  lines.push('# Extraction: ' + slug);
  lines.push('');
  lines.push('- Source URL: ' + url);
  lines.push('- HTTP status: 200');
  lines.push('- Extracted: ' + new Date().toISOString().slice(0, 10));
  lines.push('- Method: node tools/extract-live-pages-pass2.js (job-page semantic pass)');
  lines.push('- Note: Job title uses `.title` div (not H1).');
  lines.push('');
  lines.push('## 1. Source metadata');
  lines.push('');
  lines.push('| Field | Value |');
  lines.push('| --- | --- |');
  lines.push('| title tag | `' + title + '` |');
  lines.push('| meta description | `' + description + '` |');
  lines.push('| canonical | `' + canonical + '` |');
  lines.push('| robots | `' + (robots || 'none') + '` |');
  lines.push('| H1 | `(none; job title in div.title)` |');
  lines.push('| Job title (.title) | `' + jobTitle + '` |');
  lines.push('| og:title | `' + ogTitle + '` |');
  lines.push('| og:description | `' + ogDescription + '` |');
  lines.push('| og:image | `' + ogImage + '` |');
  lines.push('| og:url | `' + ogUrl + '` |');
  lines.push('');
  lines.push('### Heading / section outline (including non-semantic)');
  lines.push('');
  lines.push('1. **div.title** ' + jobTitle);
  metaBits.forEach(function (m, i) {
    lines.push((i + 2) + '. **meta** ' + m);
  });
  var n = metaBits.length + 2;
  sections.forEach(function (s) {
    lines.push(n++ + '. **section** ' + s.heading);
  });
  if (communityH) lines.push(n++ + '. **H3** ' + communityH);
  lines.push(n++ + '. **H4** Select a job to learn more');
  lines.push('');
  lines.push('## 2. Content (VERBATIM)');
  lines.push('');
  lines.push('### Hero / title');
  lines.push('');
  lines.push('> ' + jobTitle);
  lines.push('');
  if (metaBits.length) {
    lines.push('**meta chips:**');
    lines.push('');
    metaBits.forEach(function (m) {
      lines.push('> - ' + m);
    });
    lines.push('');
  }
  if (applyLabel) {
    lines.push('**CTA:**');
    lines.push('');
    lines.push('> ' + applyLabel);
    lines.push('> href: `' + applyHref + '`');
    lines.push('');
  }
  sections.forEach(function (s) {
    lines.push('### ' + s.heading);
    lines.push('');
    if (s.body) {
      s.body.split(/\n\n/).forEach(function (p) {
        lines.push('> ' + p);
        lines.push('');
      });
    }
    s.lists.forEach(function (items) {
      lines.push('**list:**');
      lines.push('');
      items.forEach(function (it) {
        lines.push('> - ' + it);
      });
      lines.push('');
    });
  });
  if (aboutParas.length) {
    lines.push('### About BetterEngineer (shared blurb)');
    lines.push('');
    aboutParas.forEach(function (p) {
      lines.push('> ' + p);
      lines.push('');
    });
  }
  if (communityH) {
    lines.push('### Community CTA');
    lines.push('');
    lines.push('> ' + communityH);
    lines.push('');
    if (communityBody) {
      lines.push('> ' + communityBody);
      lines.push('');
    }
  }
  lines.push('### Job list (sidebar / select a job)');
  lines.push('');
  jobLinks.forEach(function (j) {
    lines.push('- `' + j.label + '` → `' + j.href + '`');
  });
  lines.push('');
  lines.push('## 3. Images that matter');
  lines.push('');
  if (!images.length) lines.push('None / mostly chrome.');
  images.forEach(function (img, i) {
    lines.push((i + 1) + '. alt=`' + img.alt + '`');
    lines.push('   - ' + img.src);
  });
  lines.push('');
  lines.push('## 4. Forms');
  lines.push('');
  lines.push('No HubSpot form on page. Apply CTA goes to external candidate sign-up.');
  lines.push('');
  lines.push('## 5. Template notes');
  lines.push('');
  lines.push('- Present structural classes: ' + rawClasses.join(', '));
  lines.push('- Shares careers role template with sibling job pages. See `_compare-careers-roles.md`.');
  lines.push('');
  return { md: lines.join('\n'), jobTitle: jobTitle, sections: sections, aboutParas: aboutParas, metaBits: metaBits, applyHref: applyHref, applyLabel: applyLabel, jobLinks: jobLinks, images: images, title: title, description: description, canonical: canonical };
}

function compareJobs(fe, py) {
  var lines = [];
  lines.push('# Template comparison: careers role pages');
  lines.push('');
  lines.push('- front-end: `/careers/front-end-engineer`');
  lines.push('- python: `/careers/python-engineer`');
  lines.push('');
  lines.push('## Shared template?');
  lines.push('');
  lines.push('**YES.** Same HubSpot job template. Title is `div.title` (not H1). Shared chrome: meta chips pattern, Apply CTA to candidate signup, Job Description + Job Requirements blocks, About BetterEngineer blurb, community CTA, and job-list sidebar.');
  lines.push('');
  lines.push('### Shared (template)');
  lines.push('');
  lines.push('- Page title pattern: `Engineer Careers | Remote Software Engineering Jobs at BetterEngineer`');
  lines.push('- Canonical per-role URL');
  lines.push('- Meta description = role name only');
  lines.push('- Structure: title → meta chips → Apply CTA → Job Description → Job Requirements (ul) → About blurb → Community CTA → Select a job list');
  lines.push('- Apply CTA label/href shared when identical');
  lines.push('- Job list sidebar links (same set of openings)');
  lines.push('');
  lines.push('### Unique to front-end');
  lines.push('');
  lines.push('- Job title: `' + fe.jobTitle + '`');
  lines.push('- Meta description / og:description: `Front-end Engineer`');
  fe.sections.forEach(function (s) {
    lines.push('- Section `' + s.heading + '` body/lists differ (role-specific)');
  });
  lines.push('');
  lines.push('### Unique to python');
  lines.push('');
  lines.push('- Job title: `' + py.jobTitle + '`');
  lines.push('- Meta description / og:description: `Python Engineer`');
  py.sections.forEach(function (s) {
    lines.push('- Section `' + s.heading + '` body/lists differ (role-specific)');
  });
  lines.push('');
  lines.push('## Side-by-side unique copy (verbatim)');
  lines.push('');
  lines.push('### Front-end Job Description');
  lines.push('');
  var feJd = fe.sections[0] || {};
  (feJd.body || '').split(/\n\n/).forEach(function (p) {
    if (p) lines.push('> ' + p);
  });
  lines.push('');
  if (feJd.lists) {
    feJd.lists.forEach(function (items) {
      items.forEach(function (it) {
        lines.push('> - ' + it);
      });
    });
  }
  lines.push('');
  lines.push('### Python Job Description');
  lines.push('');
  var pyJd = py.sections[0] || {};
  (pyJd.body || '').split(/\n\n/).forEach(function (p) {
    if (p) lines.push('> ' + p);
  });
  lines.push('');
  if (pyJd.lists) {
    pyJd.lists.forEach(function (items) {
      items.forEach(function (it) {
        lines.push('> - ' + it);
      });
    });
  }
  lines.push('');
  lines.push('### Front-end Requirements');
  lines.push('');
  (fe.sections[1] && fe.sections[1].lists ? fe.sections[1].lists : []).forEach(function (items) {
    items.forEach(function (it) {
      lines.push('> - ' + it);
    });
  });
  lines.push('');
  lines.push('### Python Requirements');
  lines.push('');
  (py.sections[1] && py.sections[1].lists ? py.sections[1].lists : []).forEach(function (items) {
    items.forEach(function (it) {
      lines.push('> - ' + it);
    });
  });
  lines.push('');
  lines.push('### Shared About blurb');
  lines.push('');
  (fe.aboutParas || []).forEach(function (p) {
    lines.push('> ' + p);
    lines.push('');
  });
  return lines.join('\n');
}

function extractLegalBetter(slug, url, html) {
  var dom = new JSDOM(html);
  var doc = dom.window.document;
  var title = textClean((doc.querySelector('title') || {}).textContent || '');
  var description = meta(doc, 'meta[name="description"]');
  var canonical = meta(doc, 'link[rel="canonical"]');
  var robots = meta(doc, 'meta[name="robots"]');
  stripChrome(doc);
  var main = doc.querySelector('main') || doc.querySelector('.body-container-wrapper') || doc.body;
  var bodyText = textClean(main.textContent);
  fs.writeFileSync(path.join(rawDir, slug + '.txt'), bodyText, 'utf8');

  // Prefer HTML inner of content module if present
  var contentHtml = main.innerHTML;
  fs.writeFileSync(path.join(rawDir, slug + '.content.html'), contentHtml, 'utf8');

  var headings = [];
  main.querySelectorAll('h1,h2,h3,h4,h5,h6,strong,b').forEach(function (h) {
    var t = textClean(h.textContent);
    if (!t || t.length > 80) return;
    // section-like bold labels in terms
    if (/^(Acceptance|Accounts|Disclaimer|Exclusions|Termination|Indemnification|Limited Liability|Miscellaneous|Contact Us|Privacy Policy|Terms)/i.test(t) || /^h[1-6]$/i.test(h.tagName)) {
      headings.push({ tag: h.tagName.toLowerCase(), text: t });
    }
  });
  main.querySelectorAll('h1,h2,h3,h4,h5,h6').forEach(function (h) {
    headings.push({ tag: h.tagName.toLowerCase(), text: textClean(h.textContent) });
  });

  var paras = [];
  main.querySelectorAll('p').forEach(function (p) {
    var t = textClean(p.textContent);
    if (t) paras.push(t);
  });

  var lines = [];
  lines.push('# Extraction: ' + slug);
  lines.push('');
  lines.push('- Source URL: ' + url);
  lines.push('- HTTP status: 200');
  lines.push('- Extracted: ' + new Date().toISOString().slice(0, 10));
  lines.push('- Method: node tools/extract-live-pages-pass2.js');
  lines.push('');
  lines.push('## 1. Source metadata');
  lines.push('');
  lines.push('| Field | Value |');
  lines.push('| --- | --- |');
  lines.push('| title tag | `' + title + '` |');
  lines.push('| meta description | `' + description + '` |');
  lines.push('| canonical | `' + canonical + '` |');
  lines.push('| robots | `' + (robots || 'none') + '` |');
  lines.push('| H1 | `' + (textClean((main.querySelector('h1') || {}).textContent || '') || '(none / non-semantic)') + '` |');
  lines.push('');
  lines.push('## Legal body note');
  lines.push('');
  lines.push('- **YES: long legal text. Preserve byte-for-byte** (character-for-character) on migration. Do not paraphrase or AI-rewrite.');
  lines.push('- Word count: **' + bodyText.split(/\s+/).filter(Boolean).length + '**');
  lines.push('- Verbatim plain text: `raw/' + slug + '.txt`');
  lines.push('- Verbatim content HTML: `raw/' + slug + '.content.html`');
  lines.push('- Full page HTML: `raw/' + slug + '.html`');
  lines.push('');
  lines.push('### Heading / section labels');
  lines.push('');
  if (!headings.length) {
    lines.push('(No semantic headings. Section labels may be inline bold within paragraphs. See plain-text dump.)');
  } else {
    headings.forEach(function (h, i) {
      lines.push((i + 1) + '. **' + h.tag + '** ' + h.text);
    });
  }
  lines.push('');
  lines.push('## 2. Content (VERBATIM paragraphs)');
  lines.push('');
  if (paras.length) {
    paras.forEach(function (p) {
      lines.push('> ' + p);
      lines.push('');
    });
  } else {
    lines.push('Paragraph tags sparse. Full text:');
    lines.push('');
    bodyText.split(/\n+/).forEach(function (ln) {
      if (ln.trim()) lines.push('> ' + ln.trim());
    });
    lines.push('');
  }
  lines.push('## 3. Forms');
  lines.push('');
  lines.push('None.');
  lines.push('');
  lines.push('## 4. Template notes');
  lines.push('');
  lines.push('Legal/policy template (minimal chrome). Not shared with marketing landing templates.');
  lines.push('');
  return lines.join('\n');
}

function parseHsFormFields(formHtmlOrJson) {
  var fields = [];
  var dom = new JSDOM(formHtmlOrJson);
  var doc = dom.window.document;
  doc.querySelectorAll('input, select, textarea, .hs-form-field').forEach(function (el) {
    if (el.matches && el.matches('.hs-form-field')) {
      var label = textClean((el.querySelector('label') || {}).textContent || '');
      var input = el.querySelector('input, select, textarea');
      if (!input) {
        if (label) fields.push({ label: label, type: 'group', name: '' });
        return;
      }
      var type = (input.getAttribute('type') || input.tagName.toLowerCase()).toLowerCase();
      var name = input.getAttribute('name') || '';
      var options = [];
      if (input.tagName.toLowerCase() === 'select') {
        input.querySelectorAll('option').forEach(function (o) {
          options.push(textClean(o.textContent));
        });
      }
      el.querySelectorAll('input[type="radio"], input[type="checkbox"]').forEach(function (r) {
        var lab = r.parentElement ? textClean(r.parentElement.textContent) : r.value;
        options.push(lab || r.value);
      });
      fields.push({
        label: label,
        type: type,
        name: name,
        required: input.required || input.getAttribute('aria-required') === 'true',
        options: options
      });
      return;
    }
  });
  // Also try JSON definition
  if (!fields.length) {
    try {
      var j = JSON.parse(formHtmlOrJson);
      var walk = function (arr) {
        (arr || []).forEach(function (f) {
          if (f.fields) return walk(f.fields);
          fields.push({
            label: f.label || f.name || '',
            type: f.fieldType || f.type || '',
            name: f.name || '',
            required: !!f.required,
            options: (f.options || []).map(function (o) {
              return o.label || o.value || String(o);
            })
          });
        });
      };
      walk(j.formFieldGroups || j.fieldGroups || j.fields || []);
    } catch (e) {}
  }
  return fields;
}

async function main() {
  // Job pages
  var feHtml = fs.readFileSync(path.join(rawDir, 'careers-front-end-engineer.html'), 'utf8');
  var pyHtml = fs.readFileSync(path.join(rawDir, 'careers-python-engineer.html'), 'utf8');
  var fe = extractJobPage(
    'careers-front-end-engineer',
    'https://www.betterengineer.com/careers/front-end-engineer',
    feHtml
  );
  var py = extractJobPage(
    'careers-python-engineer',
    'https://www.betterengineer.com/careers/python-engineer',
    pyHtml
  );
  fs.writeFileSync(path.join(outDir, 'careers-front-end-engineer.md'), fe.md, 'utf8');
  fs.writeFileSync(path.join(outDir, 'careers-python-engineer.md'), py.md, 'utf8');
  fs.writeFileSync(path.join(outDir, '_compare-careers-roles.md'), compareJobs(fe, py), 'utf8');
  console.log('Updated careers role pages + comparison');

  // Careers hub: cleaner pass without nav lists
  var careersHtml = fs.readFileSync(path.join(rawDir, 'careers.html'), 'utf8');
  var cDom = new JSDOM(careersHtml);
  var cDoc = cDom.window.document;
  stripChrome(cDoc);
  var cMain = cDoc.querySelector('main') || cDoc.body;
  var cLines = [];
  cLines.push('# Extraction: careers');
  cLines.push('');
  cLines.push('- Source URL: https://www.betterengineer.com/careers');
  cLines.push('- Extracted: ' + new Date().toISOString().slice(0, 10));
  cLines.push('- Method: pass2 (chrome stripped)');
  cLines.push('');
  cLines.push('## 1. Source metadata');
  cLines.push('');
  cLines.push('| Field | Value |');
  cLines.push('| --- | --- |');
  cLines.push('| title tag | `' + textClean((cDoc.querySelector('title') || {}).textContent || '') + '` |');
  cLines.push('| meta description | `' + meta(cDoc, 'meta[name="description"]') + '` |');
  cLines.push('| canonical | `' + meta(cDoc, 'link[rel="canonical"]') + '` |');
  cLines.push('| robots | `' + (meta(cDoc, 'meta[name="robots"]') || 'none') + '` |');
  cLines.push('| H1 | `' + textClean((cMain.querySelector('h1') || {}).textContent || '(none)') + '` |');
  cLines.push('| Primary headline | `' + textClean((cMain.querySelector('h2') || {}).textContent || '') + '` |');
  cLines.push('');
  cLines.push('### Heading outline');
  cLines.push('');
  cMain.querySelectorAll('h1,h2,h3,h4,h5,h6').forEach(function (h, i) {
    cLines.push(i + 1 + '. **' + h.tagName + '** ' + textClean(h.textContent));
  });
  cLines.push('');
  cLines.push('## 2. Content (VERBATIM)');
  cLines.push('');
  cMain.querySelectorAll('h1,h2,h3,h4,p,ul').forEach(function (el) {
    var tag = el.tagName.toLowerCase();
    if (tag === 'ul') {
      var items = [];
      el.querySelectorAll(':scope > li').forEach(function (li) {
        items.push(textClean(li.textContent));
      });
      if (!items.length) return;
      // skip job link mega lists if huge? keep openings list
      cLines.push('**list:**');
      cLines.push('');
      items.forEach(function (it) {
        cLines.push('> - ' + it);
      });
      cLines.push('');
      return;
    }
    var t = textClean(el.textContent);
    if (!t) return;
    cLines.push('### ' + tag.toUpperCase());
    cLines.push('');
    cLines.push('> ' + t);
    cLines.push('');
  });
  // benefit cards often h4 + adjacent text
  cMain.querySelectorAll('h4').forEach(function (h) {
    cLines.push('**H4:** > ' + textClean(h.textContent));
  });
  cLines.push('');
  cLines.push('## 3. Images');
  cLines.push('');
  cMain.querySelectorAll('img').forEach(function (img, i) {
    var src = img.getAttribute('src') || '';
    if (!src || /spacer|pixel/i.test(src)) return;
    cLines.push(i + 1 + '. alt=`' + textClean(img.getAttribute('alt') || '') + '`');
    cLines.push('   - ' + src);
  });
  cLines.push('');
  cLines.push('## 4. Forms');
  cLines.push('');
  cLines.push('None on hub (links to role pages / join).');
  cLines.push('');
  cLines.push('## 5. Template notes');
  cLines.push('');
  cLines.push('Careers hub template. Role detail pages share a different job-detail template.');
  cLines.push('');
  // Fix: reopen original doc for title because we mutated - actually title was in head and stripChrome removed scripts not title. OK.
  // But we stripped from cDoc which still has head. Good.
  // Re-read meta from original file for accuracy
  var cOrig = new JSDOM(careersHtml).window.document;
  cLines[cLines.findIndex(function (l) { return l.indexOf('| title tag |') === 0; })] =
    '| title tag | `' + textClean((cOrig.querySelector('title') || {}).textContent || '') + '` |';
  cLines[cLines.findIndex(function (l) { return l.indexOf('| meta description |') === 0; })] =
    '| meta description | `' + meta(cOrig, 'meta[name="description"]') + '` |';
  cLines[cLines.findIndex(function (l) { return l.indexOf('| canonical |') === 0; })] =
    '| canonical | `' + meta(cOrig, 'link[rel="canonical"]') + '` |';
  fs.writeFileSync(path.join(outDir, 'careers.md'), cLines.join('\n'), 'utf8');
  console.log('Updated careers hub');

  // Legal
  fs.writeFileSync(
    path.join(outDir, 'terms-of-service.md'),
    extractLegalBetter(
      'terms-of-service',
      'https://www.betterengineer.com/terms-of-service',
      fs.readFileSync(path.join(rawDir, 'terms-of-service.html'), 'utf8')
    ),
    'utf8'
  );
  fs.writeFileSync(
    path.join(outDir, 'privacy-policy.md'),
    extractLegalBetter(
      'privacy-policy',
      'https://www.betterengineer.com/resource-center/wpautoterms/privacy-policy',
      fs.readFileSync(path.join(rawDir, 'privacy-policy.html'), 'utf8')
    ),
    'utf8'
  );
  console.log('Updated legal pages');

  // Multi-step form definition
  var formId = 'd43da6a3-79aa-45d4-99be-0d1e8162daf7';
  var portalId = '8679235';
  var ssrUrl = 'https://www.betterengineer.com/_hcms/forms/embed/v4/render-definition/ssr/' + portalId + '/' + formId;
  console.log('Fetching form SSR', ssrUrl);
  var formRes = await fetchUrl(ssrUrl);
  fs.writeFileSync(path.join(rawDir, 'multi-step-contact-form.ssr.html'), formRes.body, 'utf8');
  console.log(' form SSR status', formRes.status, 'bytes', formRes.body.length);

  // Also try HubSpot forms API json
  var jsonUrl =
    'https://forms.hubspot.com/uploads/form/v2/' + portalId + '/' + formId;
  // better: embed definition
  var defUrl =
    'https://js.hsforms.net/forms/embed/developer/' + portalId + '/' + formId + '.json';
  // classic:
  var classic =
    'https://api.hsforms.com/submissions/v3/integration/submit/' + portalId + '/' + formId;
  // forms embed config often at:
  var embedDef =
    'https://forms.hsforms.com/embed/v3/form/' + portalId + '/' + formId + '/json';
  var altUrls = [
    'https://www.betterengineer.com/_hcms/forms/embed/v4/render-definition/ssr/' + portalId + '/' + formId,
    'https://js.hsforms.net/forms/v2.js',
    'https://forms.hubspot.com/forms/v2/' + portalId + '/' + formId
  ];

  var fields = parseHsFormFields(formRes.body);
  // regex fallback for field labels in SSR HTML
  if (fields.length < 2) {
    var labelRe = /<label[^>]*>([\s\S]*?)<\/label>/gi;
    var m;
    var labels = [];
    while ((m = labelRe.exec(formRes.body))) {
      var lab = textClean(m[1].replace(/<[^>]+>/g, ''));
      if (lab && labels.indexOf(lab) < 0) labels.push(lab);
    }
    var nameRe = /name="([^"]+)"/gi;
    var names = [];
    while ((m = nameRe.exec(formRes.body))) {
      if (names.indexOf(m[1]) < 0 && !/^hs_|^0-|^csrf/i.test(m[1])) names.push(m[1]);
    }
    var typeRe = /<(input|select|textarea)([^>]*)>/gi;
    while ((m = typeRe.exec(formRes.body))) {
      var attrs = m[2];
      var typeM = attrs.match(/type="([^"]+)"/i);
      var nameM = attrs.match(/name="([^"]+)"/i);
      var type = (typeM ? typeM[1] : m[1]).toLowerCase();
      if (type === 'hidden' || type === 'submit') continue;
      fields.push({
        label: '',
        type: type,
        name: nameM ? nameM[1] : '',
        required: /required/i.test(attrs),
        options: []
      });
    }
    // attach labels in order
    fields.forEach(function (f, i) {
      if (!f.label && labels[i]) f.label = labels[i];
    });
    fs.writeFileSync(
      path.join(rawDir, 'multi-step-contact-form.labels.json'),
      JSON.stringify({ labels: labels, names: names, fieldCount: fields.length }, null, 2),
      'utf8'
    );
  }

  // Detect step markers
  var stepHints = [];
  if (/data-step|hs-form-field-step|step-title|form-step/i.test(formRes.body)) stepHints.push('step markers in SSR HTML');
  var stepTitleRe = /(?:step|Step)\s*([0-9]+)/g;
  var sm;
  while ((sm = stepTitleRe.exec(formRes.body))) {
    stepHints.push('Step ' + sm[1] + ' mention');
  }
  // unique
  stepHints = stepHints.filter(function (v, i, a) {
    return a.indexOf(v) === i;
  });

  var msHtml = fs.readFileSync(path.join(rawDir, 'multi-step-contact-form.html'), 'utf8');
  var msDoc = new JSDOM(msHtml).window.document;
  var msLines = [];
  msLines.push('# Extraction: multi-step-contact-form');
  msLines.push('');
  msLines.push('- Source URL: https://www.betterengineer.com/multi-step-contact-form');
  msLines.push('- Extracted: ' + new Date().toISOString().slice(0, 10));
  msLines.push('- Method: page HTML + HubSpot SSR form definition');
  msLines.push('- robots: `noindex, nofollow` (do not put in public sitemap without review)');
  msLines.push('');
  msLines.push('## 1. Source metadata');
  msLines.push('');
  msLines.push('| Field | Value |');
  msLines.push('| --- | --- |');
  msLines.push('| title tag | `' + textClean((msDoc.querySelector('title') || {}).textContent || '') + '` |');
  msLines.push('| meta description | `' + meta(msDoc, 'meta[name="description"]') + '` |');
  msLines.push('| canonical | `' + meta(msDoc, 'link[rel="canonical"]') + '` |');
  msLines.push('| robots | `' + meta(msDoc, 'meta[name="robots"]') + '` |');
  msLines.push('| H1 | `(none)` |');
  msLines.push('| Visible headline | `Let\'s define your ideal engineer` |');
  msLines.push('| HubSpot portal | `' + portalId + '` |');
  msLines.push('| HubSpot form id | `' + formId + '` |');
  msLines.push('| Form SSR URL | `' + ssrUrl + '` |');
  msLines.push('| Form SSR HTTP | `' + formRes.status + '` |');
  msLines.push('');
  msLines.push('## 2. Page chrome copy (VERBATIM)');
  msLines.push('');
  msLines.push('> Let\'s define your ideal engineer');
  msLines.push('');
  msLines.push('**CTA (calendly):**');
  msLines.push('');
  msLines.push('> Book a Call');
  msLines.push('> href: `https://calendly.com/tim-salsamobi/30min`');
  msLines.push('');
  msLines.push('## 3. Form fields');
  msLines.push('');
  msLines.push('Raw SSR saved to `raw/multi-step-contact-form.ssr.html`.');
  msLines.push('');
  if (!fields.length) {
    msLines.push('Could not parse fields from SSR (status ' + formRes.status + '). Inspect raw SSR file.');
  } else {
    fields.forEach(function (f, i) {
      msLines.push(
        (i + 1) +
          '. **' +
          (f.label || f.name || '(unlabeled)') +
          '** type=`' +
          f.type +
          '`' +
          (f.name ? ' name=`' + f.name + '`' : '') +
          (f.required ? ' required' : '') +
          (f.options && f.options.length ? ' options=[' + f.options.join(' | ') + ']' : '')
      );
    });
  }
  msLines.push('');
  msLines.push('### Step hints');
  msLines.push('');
  if (!stepHints.length) msLines.push('No explicit step markers found in SSR; multi-step may be CSS/JS progressive disclosure on one HubSpot form.');
  else stepHints.forEach(function (h) {
    msLines.push('- ' + h);
  });
  msLines.push('');
  msLines.push('## 4. Template notes');
  msLines.push('');
  msLines.push('Standalone lead-capture page (minimal chrome). Not shared with marketing section templates.');
  msLines.push('');
  fs.writeFileSync(path.join(outDir, 'multi-step-contact-form.md'), msLines.join('\n'), 'utf8');
  console.log('Updated multi-step form; fields=', fields.length);

  // Toptal: Cloudflare blocked. Document + try WebSearch-level known UX without copying copy.
  var topLines = [];
  topLines.push('# Extraction: toptal-hire-inspect (HIGH-LEVEL ONLY)');
  topLines.push('');
  topLines.push('- Source URL: https://www.toptal.com/hire/new?interested_in=developers');
  topLines.push('- Fetch result: **HTTP 403 Cloudflare block** (bot protection). Raw saved is challenge page, not the hire wizard.');
  topLines.push('- Mode: high-level UX structure only. **Do not copy Toptal branding or copyrighted copy.**');
  topLines.push('');
  topLines.push('## Observed from blocked fetch');
  topLines.push('');
  topLines.push('- Direct curl/node GET is blocked; live inspection needs a real browser session.');
  topLines.push('');
  topLines.push('## High-level hire-flow pattern to verify manually in browser');
  topLines.push('');
  topLines.push('Typical multi-step developer-hire wizard patterns (generic, not Toptal copy):');
  topLines.push('');
  topLines.push('1. **Interest / category** – what you want to hire (developers / designers / etc.); query param `interested_in=developers` preselects.');
  topLines.push('2. **Skills / role needs** – multi-select or tags for skills; sometimes seniority.');
  topLines.push('3. **Engagement details** – commitment (full-time/part-time), duration, timezone overlap, start timing.');
  topLines.push('4. **Contact / company** – name, work email, company, phone; sometimes password/account creation.');
  topLines.push('5. **Review / submit** – confirmation step.');
  topLines.push('');
  topLines.push('### Field types to look for (types only)');
  topLines.push('');
  topLines.push('- radio / segmented control (category, commitment)');
  topLines.push('- multi-select / tag input (skills)');
  topLines.push('- select / dropdown (timezone, country, company size)');
  topLines.push('- text / email / tel');
  topLines.push('- textarea (optional notes)');
  topLines.push('- checkbox (consent / terms)');
  topLines.push('- primary button per step (continue / next) + back link');
  topLines.push('');
  topLines.push('### BetterEngineer takeaway');
  topLines.push('');
  topLines.push('Use as UX reference for `/multi-step-contact-form` only: progressive disclosure, one job per step, typed fields, clear continue CTA. Rebuild with BetterEngineer copy and HubSpot form id `' + formId + '`.');
  topLines.push('');
  fs.writeFileSync(path.join(outDir, 'toptal-hire-inspect.md'), topLines.join('\n'), 'utf8');
  console.log('Updated toptal note (403)');

  // Try alternate form JSON endpoints
  for (var i = 0; i < altUrls.length; i++) {
    // skip v2.js
    if (/v2\.js$/.test(altUrls[i])) continue;
    try {
      var r = await fetchUrl(altUrls[i]);
      console.log('alt', altUrls[i], 'status', r.status, 'bytes', r.body.length);
      if (r.status === 200 && r.body.length > 500 && altUrls[i].indexOf('forms.hubspot.com') >= 0) {
        fs.writeFileSync(path.join(rawDir, 'multi-step-contact-form.hubspot.json'), r.body.slice(0, 200000), 'utf8');
      }
    } catch (e) {
      console.log('alt fail', altUrls[i], e.message);
    }
  }
}

main().catch(function (e) {
  console.error(e);
  process.exit(1);
});
