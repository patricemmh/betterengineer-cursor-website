'use strict';

/**
 * Download live HubSpot pages and write compact markdown extraction notes.
 * Usage: node tools/extract-live-pages.js
 */

var fs = require('fs');
var path = require('path');
var https = require('https');
var http = require('http');
var { JSDOM } = require('jsdom');

var root = path.join(__dirname, '..');
var outDir = path.join(root, 'tmp-live-extract');
var rawDir = path.join(outDir, 'raw');

var PAGES = [
  { slug: 'careers', url: 'https://www.betterengineer.com/careers' },
  { slug: 'careers-front-end-engineer', url: 'https://www.betterengineer.com/careers/front-end-engineer' },
  { slug: 'careers-python-engineer', url: 'https://www.betterengineer.com/careers/python-engineer' },
  { slug: 'fintech', url: 'https://www.betterengineer.com/fintech' },
  { slug: 'martech', url: 'https://www.betterengineer.com/martech' },
  { slug: 'healthtech', url: 'https://www.betterengineer.com/healthtech' },
  { slug: 'case-studies-livecgi', url: 'https://www.betterengineer.com/case-studies/livecgi' },
  { slug: 'case-studies-wasteplace', url: 'https://www.betterengineer.com/case-studies/wasteplace' },
  { slug: 'case-studies-securelink', url: 'https://www.betterengineer.com/case-studies/securelink' },
  { slug: 'terms-of-service', url: 'https://www.betterengineer.com/terms-of-service' },
  { slug: 'privacy-policy', url: 'https://www.betterengineer.com/resource-center/wpautoterms/privacy-policy' },
  { slug: 'multi-step-contact-form', url: 'https://www.betterengineer.com/multi-step-contact-form' },
  { slug: 'toptal-hire-inspect', url: 'https://www.toptal.com/hire/new?interested_in=developers', highLevelOnly: true }
];

function ensureDirs() {
  fs.mkdirSync(rawDir, { recursive: true });
}

function fetchUrl(url, redirectsLeft) {
  if (redirectsLeft === undefined) redirectsLeft = 8;
  return new Promise(function (resolve, reject) {
    var lib = url.indexOf('https:') === 0 ? https : http;
    var req = lib.get(
      url,
      {
        headers: {
          'User-Agent':
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36 betterengineer-migration/1.0',
          Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
          'Accept-Language': 'en-US,en;q=0.9'
        }
      },
      function (res) {
        if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
          res.resume();
          if (!redirectsLeft) return reject(new Error('too many redirects for ' + url));
          var next = new URL(res.headers.location, url).toString();
          return resolve(fetchUrl(next, redirectsLeft - 1));
        }
        var chunks = [];
        res.on('data', function (c) {
          chunks.push(c);
        });
        res.on('end', function () {
          resolve({
            status: res.statusCode,
            finalUrl: url,
            headers: res.headers,
            body: Buffer.concat(chunks).toString('utf8')
          });
        });
      }
    );
    req.on('error', reject);
    req.setTimeout(60000, function () {
      req.destroy(new Error('timeout fetching ' + url));
    });
  });
}

function metaContent(doc, selector) {
  var el = doc.querySelector(selector);
  if (!el) return null;
  return (el.getAttribute('content') || el.getAttribute('href') || '').trim() || null;
}

function textClean(s) {
  return (s || '')
    .replace(/\u00a0/g, ' ')
    .replace(/[ \t]+\n/g, '\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

function isNoise(el) {
  if (!el || !el.closest) return true;
  if (el.closest('script, style, noscript, svg, iframe')) return true;
  if (el.closest('#hs-web-interactive-top-anchor, .hs-web-interactive-container')) return true;
  if (el.closest('[data-global-banner], .cookie-banner, #hs-eu-cookie-confirmation')) return true;
  return false;
}

function getMainRoot(doc) {
  return (
    doc.querySelector('main') ||
    doc.querySelector('#main-content') ||
    doc.querySelector('.body-container-wrapper') ||
    doc.querySelector('.dnd-section')?.parentElement ||
    doc.body
  );
}

function collectHeadings(root) {
  var out = [];
  root.querySelectorAll('h1, h2, h3, h4, h5, h6').forEach(function (h) {
    if (isNoise(h)) return;
    var t = textClean(h.textContent);
    if (!t) return;
    out.push({ level: h.tagName.toLowerCase(), text: t });
  });
  return out;
}

function absUrl(base, maybe) {
  if (!maybe) return null;
  try {
    return new URL(maybe, base).toString();
  } catch (e) {
    return maybe;
  }
}

function collectImages(root, baseUrl) {
  var seen = Object.create(null);
  var out = [];
  root.querySelectorAll('img').forEach(function (img) {
    if (isNoise(img)) return;
    var src =
      img.getAttribute('src') ||
      img.getAttribute('data-src') ||
      img.getAttribute('data-lazy-src') ||
      '';
    var srcset = img.getAttribute('srcset') || img.getAttribute('data-srcset') || '';
    if (!src && srcset) {
      src = srcset.split(',')[0].trim().split(/\s+/)[0];
    }
    if (!src) return;
    // skip tiny tracking / spacer / hubspot chrome
    if (/spacer|tracking|pixel|1x1|blank\.gif|hs-banner|web-interactive/i.test(src)) return;
    if (/cdn2\.hubspot\.net\/hubfs\/.*\/raw_assets/i.test(src) && /icon|favicon/i.test(src)) return;
    var full = absUrl(baseUrl, src);
    if (!full || seen[full]) return;
    seen[full] = true;
    out.push({
      src: full,
      alt: textClean(img.getAttribute('alt') || ''),
      width: img.getAttribute('width') || null,
      height: img.getAttribute('height') || null
    });
  });
  // background images in style attrs that look like content
  root.querySelectorAll('[style*="background"]').forEach(function (el) {
    if (isNoise(el)) return;
    var style = el.getAttribute('style') || '';
    var m = style.match(/url\(['"]?([^'")]+)['"]?\)/i);
    if (!m) return;
    var full = absUrl(baseUrl, m[1]);
    if (!full || seen[full]) return;
    if (/spacer|tracking|pixel|1x1/i.test(full)) return;
    seen[full] = true;
    out.push({ src: full, alt: '(CSS background)', width: null, height: null });
  });
  return out;
}

function collectLinks(root, baseUrl) {
  var out = [];
  var seen = Object.create(null);
  root.querySelectorAll('a[href]').forEach(function (a) {
    if (isNoise(a)) return;
    var href = a.getAttribute('href');
    if (!href || href === '#' || href.indexOf('javascript:') === 0) return;
    var label = textClean(a.textContent);
    if (!label) return;
    // CTAs / meaningful nav within content
    var full = absUrl(baseUrl, href);
    var key = label + '|' + full;
    if (seen[key]) return;
    seen[key] = true;
    var cls = (a.getAttribute('class') || '').toLowerCase();
    var isCta =
      /btn|button|cta|hs-button/i.test(cls) ||
      /btn|button|cta/i.test(a.getAttribute('role') || '') ||
      a.closest('.cta, .hs-cta-wrapper, [class*="cta"]');
    out.push({ label: label, href: full, isCta: !!isCta });
  });
  return out;
}

function collectForms(root) {
  var forms = [];
  root.querySelectorAll('form').forEach(function (form, idx) {
    if (isNoise(form)) return;
    var fields = [];
    form.querySelectorAll('input, select, textarea').forEach(function (field) {
      var type = (field.getAttribute('type') || field.tagName.toLowerCase()).toLowerCase();
      if (type === 'hidden') {
        fields.push({
          kind: 'hidden',
          name: field.getAttribute('name') || '',
          value: field.getAttribute('value') || ''
        });
        return;
      }
      if (type === 'submit' || type === 'button') {
        fields.push({
          kind: 'submit',
          name: field.getAttribute('name') || '',
          value: field.getAttribute('value') || textClean(field.textContent) || ''
        });
        return;
      }
      var label = '';
      var id = field.getAttribute('id');
      if (id) {
        var lab = root.querySelector('label[for="' + id.replace(/"/g, '\\"') + '"]');
        if (lab) label = textClean(lab.textContent);
      }
      if (!label) {
        var parentLab = field.closest('label');
        if (parentLab) label = textClean(parentLab.textContent);
      }
      if (!label) {
        var wrap = field.closest('.hs-form-field, .field, .form-group, .hs-fieldtype-text, .hs-fieldtype-select');
        if (wrap) {
          var l2 = wrap.querySelector('label, .hs-form-required, legend, span.label');
          if (l2) label = textClean(l2.textContent);
        }
      }
      var options = [];
      if (field.tagName.toLowerCase() === 'select') {
        field.querySelectorAll('option').forEach(function (opt) {
          options.push(textClean(opt.textContent));
        });
      }
      fields.push({
        kind: type,
        name: field.getAttribute('name') || '',
        label: label,
        placeholder: field.getAttribute('placeholder') || '',
        required: field.hasAttribute('required') || field.getAttribute('aria-required') === 'true',
        options: options
      });
    });
    // HubSpot embeds may not have native fields yet; note data attrs
    forms.push({
      index: idx,
      id: form.getAttribute('id') || '',
      action: form.getAttribute('action') || '',
      method: (form.getAttribute('method') || 'get').toLowerCase(),
      className: form.getAttribute('class') || '',
      fields: fields,
      htmlSnippet: form.outerHTML.slice(0, 500)
    });
  });
  // HubSpot form placeholders
  root.querySelectorAll('[data-form-id], .hs-form, .hs-form-frame, [class*="hs-form"]').forEach(function (el) {
    if (el.tagName && el.tagName.toLowerCase() === 'form') return;
    forms.push({
      index: 'embed-' + forms.length,
      id: el.getAttribute('id') || '',
      formId: el.getAttribute('data-form-id') || el.getAttribute('data-hs-form-id') || '',
      portalId: el.getAttribute('data-portal-id') || '',
      region: el.getAttribute('data-region') || '',
      className: el.getAttribute('class') || '',
      note: 'HubSpot form embed container (fields may load via JS)',
      fields: []
    });
  });
  return forms;
}

function extractFaqPairs(root) {
  var faqs = [];
  // common accordion patterns
  root.querySelectorAll('details').forEach(function (d) {
    var q = textClean((d.querySelector('summary') || {}).textContent || '');
    var a = textClean(d.textContent || '').replace(q, '').trim();
    if (q) faqs.push({ q: q, a: a });
  });
  // heading + following sibling paragraph patterns for FAQ sections
  var faqHeading = null;
  root.querySelectorAll('h2, h3, h4').forEach(function (h) {
    var t = textClean(h.textContent);
    if (/frequently asked|faq/i.test(t)) faqHeading = h;
  });
  if (faqHeading) {
    var section = faqHeading.closest('.dnd-section, section, .row-fluid-wrapper') || faqHeading.parentElement;
    if (section) {
      section.querySelectorAll('h3, h4, .accordion__title, [class*="faq"] h3, [class*="faq"] h4').forEach(function (qEl) {
        if (qEl === faqHeading) return;
        var q = textClean(qEl.textContent);
        if (!q || /frequently asked/i.test(q)) return;
        var aParts = [];
        var n = qEl.nextElementSibling;
        var guard = 0;
        while (n && guard < 6) {
          guard++;
          if (/^H[1-6]$/.test(n.tagName)) break;
          if (n.matches && n.matches('p, ul, ol, div')) {
            var tx = textClean(n.textContent);
            if (tx) aParts.push(tx);
          }
          n = n.nextElementSibling;
        }
        if (q && aParts.length) faqs.push({ q: q, a: aParts.join('\n\n') });
      });
    }
  }
  return faqs;
}

function extractBodyBlocks(root) {
  var blocks = [];
  var walkerNodes = root.querySelectorAll(
    'h1, h2, h3, h4, h5, h6, p, ul, ol, blockquote, figcaption, li, .btn, a.hs-button, .cta_button'
  );
  var lastWasHeading = false;
  walkerNodes.forEach(function (el) {
    if (isNoise(el)) return;
    // skip nested li when parent ul/ol already captured? keep li for fidelity under lists
    var tag = el.tagName.toLowerCase();
    if (tag === 'li') {
      // only include if parent list not already going to be huge; we'll include via ul/ol text
      return;
    }
    if (tag === 'a') {
      var cls = (el.getAttribute('class') || '').toLowerCase();
      if (!/btn|button|cta|hs-button/.test(cls)) return;
    }
    var text = textClean(el.textContent);
    if (!text) return;
    // skip extremely short chrome
    if (text.length < 2) return;
    if (/^(menu|skip to content|close)$/i.test(text)) return;

    if (/^h[1-6]$/.test(tag)) {
      blocks.push({ type: tag, text: text });
      lastWasHeading = true;
      return;
    }
    if (tag === 'ul' || tag === 'ol') {
      var items = [];
      el.querySelectorAll(':scope > li').forEach(function (li) {
        items.push(textClean(li.textContent));
      });
      if (items.length) blocks.push({ type: tag, items: items });
      lastWasHeading = false;
      return;
    }
    if (tag === 'p' || tag === 'blockquote' || tag === 'figcaption') {
      blocks.push({ type: tag, text: text });
      lastWasHeading = false;
      return;
    }
    if (tag === 'a' || /btn|button|cta/.test(el.className || '')) {
      blocks.push({ type: 'cta', text: text, href: el.getAttribute('href') || '' });
      lastWasHeading = false;
    }
  });
  return blocks;
}

function countWords(text) {
  return textClean(text).split(/\s+/).filter(Boolean).length;
}

function mdEscapePipe(s) {
  return String(s || '').replace(/\|/g, '\\|');
}

function renderMarkdown(page, data) {
  var lines = [];
  var legal = /terms|privacy|legal/i.test(page.slug);
  lines.push('# Extraction: ' + page.slug);
  lines.push('');
  lines.push('- Source URL: ' + page.url);
  lines.push('- Final URL: ' + (data.finalUrl || page.url));
  lines.push('- HTTP status: ' + data.status);
  lines.push('- Extracted: ' + new Date().toISOString().slice(0, 10));
  lines.push('- Method: node tools/extract-live-pages.js (JSDOM)');
  if (page.highLevelOnly) {
    lines.push('- Mode: HIGH-LEVEL STRUCTURE ONLY (do not copy branding or copyrighted copy)');
  }
  lines.push('');

  if (page.highLevelOnly) {
    lines.push('## High-level form structure (Toptal hire flow)');
    lines.push('');
    lines.push('Do not migrate Toptal copy, branding, logos, or wording. Capture only step/field-type patterns for UX reference.');
    lines.push('');
    lines.push('### Meta (non-copy)');
    lines.push('');
    lines.push('| Field | Value |');
    lines.push('| --- | --- |');
    lines.push('| title present | ' + (data.title ? 'yes' : 'no') + ' |');
    lines.push('| form count | ' + data.forms.length + ' |');
    lines.push('| heading count | ' + data.headings.length + ' |');
    lines.push('');
    lines.push('### Detected steps / headings (labels only if generic; else describe)');
    lines.push('');
    data.headings.forEach(function (h, i) {
      lines.push((i + 1) + '. **' + h.level.toUpperCase() + '** length=' + h.text.length + ' chars');
    });
    lines.push('');
    lines.push('### Form fields (types only)');
    lines.push('');
    if (!data.forms.length) {
      lines.push('No static `<form>` fields found (likely JS-rendered multi-step wizard).');
      lines.push('');
      lines.push('Raw HTML size: ' + data.htmlBytes + ' bytes. Check raw file for app shell markers.');
      if (data.toptalHints && data.toptalHints.length) {
        lines.push('');
        lines.push('### Structure hints from HTML/JS shell');
        lines.push('');
        data.toptalHints.forEach(function (h) {
          lines.push('- ' + h);
        });
      }
    } else {
      data.forms.forEach(function (f) {
        lines.push('#### Form ' + f.index);
        lines.push('');
        f.fields.forEach(function (field) {
          if (field.kind === 'hidden') return;
          lines.push(
            '- type=`' +
              field.kind +
              '` name=`' +
              field.name +
              '` required=' +
              !!field.required +
              (field.options && field.options.length ? ' options=' + field.options.length : '')
          );
        });
        lines.push('');
      });
    }
    lines.push('### Shared-template note');
    lines.push('');
    lines.push('External reference only. Not a BetterEngineer template.');
    lines.push('');
    return lines.join('\n');
  }

  lines.push('## 1. Source metadata');
  lines.push('');
  lines.push('| Field | Value |');
  lines.push('| --- | --- |');
  lines.push('| title tag | `' + mdEscapePipe(data.title || '') + '` |');
  lines.push('| meta description | `' + mdEscapePipe(data.description || '') + '` |');
  lines.push('| canonical | `' + mdEscapePipe(data.canonical || '') + '` |');
  lines.push('| robots | `' + mdEscapePipe(data.robots || 'none') + '` |');
  lines.push('| H1 | `' + mdEscapePipe(data.h1 || '') + '` |');
  lines.push('| og:title | `' + mdEscapePipe(data.ogTitle || '') + '` |');
  lines.push('| og:description | `' + mdEscapePipe(data.ogDescription || '') + '` |');
  lines.push('| og:image | `' + mdEscapePipe(data.ogImage || '') + '` |');
  lines.push('| og:url | `' + mdEscapePipe(data.ogUrl || '') + '` |');
  lines.push('| generator | `' + mdEscapePipe(data.generator || '') + '` |');
  lines.push('');

  lines.push('### Heading outline');
  lines.push('');
  data.headings.forEach(function (h, i) {
    lines.push((i + 1) + '. **' + h.level.toUpperCase() + '** ' + h.text);
  });
  lines.push('');

  if (legal) {
    lines.push('## Legal body note');
    lines.push('');
    lines.push(
      '- Body word count (main root): **' +
        data.bodyWordCount +
        '**. This is long legal text. Preserve byte-for-byte (or character-for-character) on migration; do not paraphrase.'
    );
    lines.push('- Raw HTML saved to `raw/' + page.slug + '.html` for verbatim recovery.');
    lines.push('- Full plain-text dump saved to `raw/' + page.slug + '.txt`.');
    lines.push('');
  }

  lines.push('## 2. Content (VERBATIM quotes)');
  lines.push('');
  lines.push('Quoted enough to rebuild. Do not rewrite.');
  lines.push('');

  var sectionNum = 0;
  data.blocks.forEach(function (b) {
    if (/^h[1-6]$/.test(b.type)) {
      sectionNum++;
      lines.push('### Section / ' + b.type.toUpperCase());
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
    if (b.type === 'cta') {
      lines.push('**CTA:**');
      lines.push('');
      lines.push('> ' + b.text + (b.href ? '  \n> href: `' + b.href + '`' : ''));
      lines.push('');
      return;
    }
    lines.push('**' + b.type + ':**');
    lines.push('');
    // preserve multi-line in blockquotes
    b.text.split(/\n/).forEach(function (ln) {
      lines.push('> ' + ln);
    });
    lines.push('');
  });

  if (data.faqs && data.faqs.length) {
    lines.push('## FAQs (extracted)');
    lines.push('');
    data.faqs.forEach(function (faq, i) {
      lines.push('### Q' + (i + 1));
      lines.push('');
      lines.push('> ' + faq.q);
      lines.push('');
      lines.push('**A:**');
      lines.push('');
      faq.a.split(/\n/).forEach(function (ln) {
        lines.push('> ' + ln);
      });
      lines.push('');
    });
  }

  lines.push('## 3. Images that matter');
  lines.push('');
  if (!data.images.length) {
    lines.push('None found in main content.');
  } else {
    data.images.forEach(function (img, i) {
      lines.push((i + 1) + '. alt=`' + (img.alt || '') + '`');
      lines.push('   - ' + img.src);
    });
  }
  lines.push('');

  lines.push('## 4. CTAs / notable links');
  lines.push('');
  var ctas = data.links.filter(function (l) {
    return l.isCta;
  });
  var show = ctas.length ? ctas : data.links.slice(0, 25);
  show.forEach(function (l) {
    lines.push('- ' + (l.isCta ? '**CTA** ' : '') + '`' + l.label + '` → `' + l.href + '`');
  });
  lines.push('');

  lines.push('## 5. Forms');
  lines.push('');
  if (!data.forms.length) {
    lines.push('No forms detected.');
  } else {
    data.forms.forEach(function (f) {
      lines.push('### Form ' + f.index);
      lines.push('');
      if (f.note) lines.push('- ' + f.note);
      if (f.formId) lines.push('- data-form-id: `' + f.formId + '`');
      if (f.portalId) lines.push('- portal-id: `' + f.portalId + '`');
      if (f.id) lines.push('- id: `' + f.id + '`');
      if (f.action) lines.push('- action: `' + f.action + '`');
      if (f.className) lines.push('- class: `' + f.className + '`');
      lines.push('');
      if (!f.fields.length) {
        lines.push('No static fields (JS-rendered HubSpot form likely).');
      } else {
        f.fields.forEach(function (field) {
          if (field.kind === 'hidden') {
            lines.push('- hidden `' + field.name + '` = `' + field.value + '`');
            return;
          }
          lines.push(
            '- **' +
              (field.label || field.name || field.kind) +
              '** type=`' +
              field.kind +
              '`' +
              (field.name ? ' name=`' + field.name + '`' : '') +
              (field.placeholder ? ' placeholder=`' + field.placeholder + '`' : '') +
              (field.required ? ' required' : '') +
              (field.options && field.options.length ? ' options=[' + field.options.join(' | ') + ']' : '')
          );
        });
      }
      lines.push('');
    });
  }

  lines.push('## 6. Template / sharing notes');
  lines.push('');
  lines.push(data.templateNote || 'See cross-page comparison in `_template-comparison.md`.');
  lines.push('');

  if (data.jsonLdTypes && data.jsonLdTypes.length) {
    lines.push('## Structured data');
    lines.push('');
    lines.push('- JSON-LD types: ' + data.jsonLdTypes.join(', '));
    lines.push('');
  }

  return lines.join('\n');
}

function extractToptalHints(html) {
  var hints = [];
  if (/__NEXT_DATA__/i.test(html)) hints.push('Next.js app shell (`__NEXT_DATA__` present)');
  if (/react/i.test(html)) hints.push('React markers present in HTML/JS');
  if (/interested_in/i.test(html)) hints.push('Query param `interested_in` referenced');
  if (/multi-?step|wizard|stepper/i.test(html)) hints.push('Multi-step / wizard language in shell');
  // count input-like strings without quoting copy
  var inputMatches = html.match(/"type"\s*:\s*"(text|email|tel|select|checkbox|radio|textarea|number)"/gi) || [];
  if (inputMatches.length) hints.push('Serialized field type tokens found: ' + inputMatches.length);
  var stepMatches = html.match(/"step"\s*:/gi) || [];
  if (stepMatches.length) hints.push('Serialized `step` keys found: ' + stepMatches.length);
  return hints;
}

function analyze(page, fetched) {
  var dom = new JSDOM(fetched.body);
  var doc = dom.window.document;
  var root = getMainRoot(doc);
  var title = textClean((doc.querySelector('title') || {}).textContent || '');
  var description = metaContent(doc, 'meta[name="description"]');
  var canonical = metaContent(doc, 'link[rel="canonical"]');
  var robots = metaContent(doc, 'meta[name="robots"]');
  var ogTitle = metaContent(doc, 'meta[property="og:title"]');
  var ogDescription = metaContent(doc, 'meta[property="og:description"]');
  var ogImage = metaContent(doc, 'meta[property="og:image"]');
  var ogUrl = metaContent(doc, 'meta[property="og:url"]');
  var generator = metaContent(doc, 'meta[name="generator"]');

  var headings = collectHeadings(root);
  // also collect from whole doc if main is thin
  if (headings.length < 2) headings = collectHeadings(doc.body);

  var h1 = '';
  var h1el = root.querySelector('h1') || doc.querySelector('h1');
  if (h1el) h1 = textClean(h1el.textContent);

  var images = collectImages(root, page.url);
  if (images.length < 2) {
    var more = collectImages(doc.body, page.url);
    more.forEach(function (img) {
      if (!images.some(function (x) {
        return x.src === img.src;
      }))
        images.push(img);
    });
  }

  var links = collectLinks(root, page.url);
  var forms = collectForms(doc.body);
  var faqs = extractFaqPairs(root);
  var blocks = extractBodyBlocks(root);
  if (blocks.length < 5) blocks = extractBodyBlocks(doc.body);

  var jsonLdTypes = [];
  doc.querySelectorAll('script[type="application/ld+json"]').forEach(function (s) {
    try {
      var j = JSON.parse(s.textContent);
      var arr = Array.isArray(j) ? j : [j];
      arr.forEach(function (obj) {
        if (obj && obj['@type']) jsonLdTypes.push(String(obj['@type']));
      });
    } catch (e) {}
  });

  var bodyText = textClean(root.textContent || '');
  var data = {
    status: fetched.status,
    finalUrl: fetched.finalUrl,
    htmlBytes: Buffer.byteLength(fetched.body, 'utf8'),
    title: title,
    description: description,
    canonical: canonical,
    robots: robots,
    h1: h1,
    ogTitle: ogTitle,
    ogDescription: ogDescription,
    ogImage: ogImage,
    ogUrl: ogUrl,
    generator: generator,
    headings: headings,
    images: images,
    links: links,
    forms: forms,
    faqs: faqs,
    blocks: blocks,
    bodyWordCount: countWords(bodyText),
    bodyText: bodyText,
    jsonLdTypes: jsonLdTypes,
    templateNote: '',
    toptalHints: page.highLevelOnly ? extractToptalHints(fetched.body) : []
  };
  return data;
}

function fingerprint(data) {
  return {
    headingPattern: data.headings.map(function (h) {
      return h.level;
    }).join(','),
    headingTexts: data.headings.map(function (h) {
      return h.text;
    }),
    imageCount: data.images.length,
    formCount: data.forms.length,
    sectionCount: data.headings.filter(function (h) {
      return h.level === 'h2';
    }).length
  };
}

function compareCareers(fe, py) {
  var sharedHeadings = [];
  var uniqueFe = [];
  var uniquePy = [];
  var feSet = Object.create(null);
  var pySet = Object.create(null);
  fe.headings.forEach(function (h) {
    feSet[h.level + '|' + h.text] = true;
  });
  py.headings.forEach(function (h) {
    pySet[h.level + '|' + h.text] = true;
  });
  fe.headings.forEach(function (h) {
    var k = h.level + '|' + h.text;
    if (pySet[k]) sharedHeadings.push(h);
    else uniqueFe.push(h);
  });
  py.headings.forEach(function (h) {
    var k = h.level + '|' + h.text;
    if (!feSet[k]) uniquePy.push(h);
  });

  // shared body paragraphs
  var feParas = fe.blocks.filter(function (b) {
    return b.type === 'p';
  }).map(function (b) {
    return b.text;
  });
  var pyParas = py.blocks.filter(function (b) {
    return b.type === 'p';
  }).map(function (b) {
    return b.text;
  });
  var pyParaSet = Object.create(null);
  pyParas.forEach(function (p) {
    pyParaSet[p] = true;
  });
  var sharedParas = feParas.filter(function (p) {
    return pyParaSet[p];
  });
  var uniqueFeParas = feParas.filter(function (p) {
    return !pyParaSet[p];
  });
  var feParaSet = Object.create(null);
  feParas.forEach(function (p) {
    feParaSet[p] = true;
  });
  var uniquePyParas = pyParas.filter(function (p) {
    return !feParaSet[p];
  });

  var lines = [];
  lines.push('# Template comparison: careers role pages');
  lines.push('');
  lines.push('- front-end: `/careers/front-end-engineer`');
  lines.push('- python: `/careers/python-engineer`');
  lines.push('');
  lines.push('## Shared template?');
  lines.push('');
  lines.push(
    fingerprint(fe).headingPattern === fingerprint(py).headingPattern
      ? 'YES, same heading-level skeleton (`' + fingerprint(fe).headingPattern + '`)'
      : 'PARTIAL / DIFFERENT heading skeletons'
  );
  lines.push('');
  lines.push('- FE H1: `' + fe.h1 + '`');
  lines.push('- PY H1: `' + py.h1 + '`');
  lines.push('- Shared heading texts: ' + sharedHeadings.length);
  lines.push('- Unique FE headings: ' + uniqueFe.length);
  lines.push('- Unique PY headings: ' + uniquePy.length);
  lines.push('- Shared verbatim paragraphs: ' + sharedParas.length);
  lines.push('- Unique FE paragraphs: ' + uniqueFeParas.length);
  lines.push('- Unique PY paragraphs: ' + uniquePyParas.length);
  lines.push('');
  lines.push('## Shared headings');
  lines.push('');
  sharedHeadings.forEach(function (h) {
    lines.push('- **' + h.level.toUpperCase() + '** ' + h.text);
  });
  lines.push('');
  lines.push('## Unique to front-end');
  lines.push('');
  uniqueFe.forEach(function (h) {
    lines.push('- **' + h.level.toUpperCase() + '** ' + h.text);
  });
  uniqueFeParas.slice(0, 40).forEach(function (p) {
    lines.push('- p: ' + p);
  });
  lines.push('');
  lines.push('## Unique to python');
  lines.push('');
  uniquePy.forEach(function (h) {
    lines.push('- **' + h.level.toUpperCase() + '** ' + h.text);
  });
  uniquePyParas.slice(0, 40).forEach(function (p) {
    lines.push('- p: ' + p);
  });
  lines.push('');
  lines.push('## Shared paragraphs (template body)');
  lines.push('');
  sharedParas.slice(0, 40).forEach(function (p) {
    lines.push('> ' + p);
    lines.push('');
  });
  return lines.join('\n');
}

function industryTemplateNote(all) {
  var keys = ['fintech', 'martech', 'healthtech'];
  var items = keys.map(function (k) {
    return all[k];
  }).filter(Boolean);
  if (items.length < 2) return '';
  var patterns = items.map(function (d) {
    return fingerprint(d).headingPattern;
  });
  var same = patterns.every(function (p) {
    return p === patterns[0];
  });
  var lines = [];
  lines.push('# Template comparison: industry pages (fintech / martech / healthtech)');
  lines.push('');
  lines.push(same ? 'YES, shared heading-level skeleton.' : 'DIFFERENT heading skeletons across industries.');
  lines.push('');
  keys.forEach(function (k) {
    if (!all[k]) return;
    lines.push('## ' + k);
    lines.push('');
    lines.push('- H1: `' + all[k].h1 + '`');
    lines.push('- title: `' + all[k].title + '`');
    lines.push('- heading pattern: `' + fingerprint(all[k]).headingPattern + '`');
    lines.push('- headings:');
    all[k].headings.forEach(function (h) {
      lines.push('  - **' + h.level.toUpperCase() + '** ' + h.text);
    });
    lines.push('');
  });
  // shared heading texts across all three
  if (items.length === 3) {
    var sets = items.map(function (d) {
      var o = Object.create(null);
      d.headings.forEach(function (h) {
        o[h.text] = true;
      });
      return o;
    });
    var shared = items[0].headings
      .map(function (h) {
        return h.text;
      })
      .filter(function (t) {
        return sets[1][t] && sets[2][t];
      });
    lines.push('## Headings shared by all three');
    lines.push('');
    shared.forEach(function (t) {
      lines.push('- ' + t);
    });
    lines.push('');
  }
  return lines.join('\n');
}

function caseStudyTemplateNote(all) {
  var keys = ['case-studies-livecgi', 'case-studies-wasteplace', 'case-studies-securelink'];
  var items = keys.map(function (k) {
    return { key: k, data: all[k] };
  }).filter(function (x) {
    return x.data;
  });
  var lines = [];
  lines.push('# Template comparison: case studies');
  lines.push('');
  var patterns = items.map(function (x) {
    return fingerprint(x.data).headingPattern;
  });
  var same = patterns.length > 1 && patterns.every(function (p) {
    return p === patterns[0];
  });
  lines.push(same ? 'YES, shared heading-level skeleton.' : 'PARTIAL / review per-page outlines.');
  lines.push('');
  items.forEach(function (x) {
    lines.push('## ' + x.key);
    lines.push('');
    lines.push('- H1: `' + x.data.h1 + '`');
    lines.push('- title: `' + x.data.title + '`');
    lines.push('- heading pattern: `' + fingerprint(x.data).headingPattern + '`');
    x.data.headings.forEach(function (h) {
      lines.push('  - **' + h.level.toUpperCase() + '** ' + h.text);
    });
    lines.push('');
  });
  return lines.join('\n');
}

async function main() {
  ensureDirs();
  var all = Object.create(null);
  var errors = [];

  for (var i = 0; i < PAGES.length; i++) {
    var page = PAGES[i];
    process.stdout.write('Fetching ' + page.slug + '...\n');
    try {
      var fetched = await fetchUrl(page.url);
      fs.writeFileSync(path.join(rawDir, page.slug + '.html'), fetched.body, 'utf8');
      var data = analyze(page, fetched);
      all[page.slug] = data;
      if (/terms|privacy/i.test(page.slug)) {
        fs.writeFileSync(path.join(rawDir, page.slug + '.txt'), data.bodyText, 'utf8');
      }
      var md = renderMarkdown(page, data);
      fs.writeFileSync(path.join(outDir, page.slug + '.md'), md, 'utf8');
      process.stdout.write('  OK status=' + fetched.status + ' headings=' + data.headings.length + ' images=' + data.images.length + '\n');
    } catch (err) {
      errors.push({ slug: page.slug, error: String(err && err.message ? err.message : err) });
      process.stderr.write('  FAIL ' + page.slug + ': ' + err + '\n');
      fs.writeFileSync(
        path.join(outDir, page.slug + '.md'),
        '# Extraction FAILED: ' + page.slug + '\n\n- URL: ' + page.url + '\n- Error: `' + String(err) + '`\n',
        'utf8'
      );
    }
  }

  // careers comparison
  if (all['careers-front-end-engineer'] && all['careers-python-engineer']) {
    var cmp = compareCareers(all['careers-front-end-engineer'], all['careers-python-engineer']);
    fs.writeFileSync(path.join(outDir, '_compare-careers-roles.md'), cmp, 'utf8');
    all['careers-front-end-engineer'].templateNote =
      'Shares role-page template with python-engineer. See `_compare-careers-roles.md`.';
    all['careers-python-engineer'].templateNote =
      'Shares role-page template with front-end-engineer. See `_compare-careers-roles.md`.';
    // rewrite those two with template notes
    PAGES.filter(function (p) {
      return p.slug === 'careers-front-end-engineer' || p.slug === 'careers-python-engineer';
    }).forEach(function (p) {
      fs.writeFileSync(path.join(outDir, p.slug + '.md'), renderMarkdown(p, all[p.slug]), 'utf8');
    });
  }

  var ind = industryTemplateNote(all);
  if (ind) fs.writeFileSync(path.join(outDir, '_compare-industry-pages.md'), ind, 'utf8');
  var cs = caseStudyTemplateNote(all);
  if (cs) fs.writeFileSync(path.join(outDir, '_compare-case-studies.md'), cs, 'utf8');

  // index
  var index = [];
  index.push('# Live extract index');
  index.push('');
  index.push('Generated by `node tools/extract-live-pages.js`');
  index.push('');
  PAGES.forEach(function (p) {
    var d = all[p.slug];
    if (!d) {
      index.push('- **' + p.slug + '**: FAILED');
      return;
    }
    index.push(
      '- [' +
        p.slug +
        '](' +
        p.slug +
        '.md) — H1: `' +
        (d.h1 || '(none)') +
        '` | status ' +
        d.status +
        (p.highLevelOnly ? ' | high-level only' : '')
    );
  });
  index.push('');
  index.push('## Comparisons');
  index.push('');
  index.push('- [_compare-careers-roles.md](_compare-careers-roles.md)');
  index.push('- [_compare-industry-pages.md](_compare-industry-pages.md)');
  index.push('- [_compare-case-studies.md](_compare-case-studies.md)');
  if (errors.length) {
    index.push('');
    index.push('## Errors');
    index.push('');
    errors.forEach(function (e) {
      index.push('- ' + e.slug + ': ' + e.error);
    });
  }
  // Avoid em dash in index notes that quote site copy later; this index uses ASCII hyphen above intentionally replaced
  var indexText = index.join('\n').replace(/\u2014/g, ',');
  fs.writeFileSync(path.join(outDir, 'README.md'), indexText, 'utf8');

  process.stdout.write('\nDone. Wrote ' + Object.keys(all).length + ' extractions to tmp-live-extract/\n');
  if (errors.length) process.exitCode = 1;
}

main().catch(function (err) {
  console.error(err);
  process.exit(1);
});
